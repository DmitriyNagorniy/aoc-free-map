const fs = require('fs');

// Resource data structure matching script.js
const RESOURCES = {
    'Lumber': {
        'T1': ['Plumeria Wood'],
        'T2': ['Weeping Willow', 'Eddledom', 'Dragon Tree'],
        'T3': ['Braidwood', "Korn'brolach Fir", 'Cacao Wood', 'Joshua']
    },
    'Mining': {
        'T2': ['Slate', 'Lumadon', 'Resonite', 'Halcyonite', 'Coveglass'],
        'T3': ['Limestone', 'Rividium', 'Mourning Slate', 'Wyrdstone', 'Nestone', 'Ochroah', 'Scalestone']
    },
    'Herbalism': {
        'T1': ['Elephant Ear'],
        'T2': ['Moonbell', 'Giant Bluebell', 'Salvewort', 'Bird of Paradise', 'Paintbrush', 'Barrel Cactus'],
        'T3': ['Fungal Anemone', 'Spindlevine', 'Furnace Moss', 'Gloomy Pross', 'Grve Lily', 'Fumitor', "Giant's Toe"]
    },
    'Hunting': {
        'T1': ['Grem', 'Bear', 'Wolf', 'Raven', 'Spider', 'Hawk'],
        'T2': ['Raptor', 'Bork', 'Skinwalker', 'Otter', 'Bullywog', 'Hippo', 'Daystrider', 'Ram'],
        'T3': ['Gryphon', 'Wyrmling', 'Crocodile', 'Giant Beetle', 'Basilisk', 'Komodo', 'Iguana', 'Flailrunner']
    }
};

// Map boundary points (lat, lng)
const MAP_BOUNDARY = [
    [65, -128],
    [47, -130],
    [-24, -145],
    [-18, -88],
    [5, -91],
    [4, -78],
    [-11, -73],
    [-28, -42],
    [1, -41],
    [19, -68],
    [30, -92],
    [62, -90]
];

// Calculate bounding box for efficient generation
const minLat = Math.min(...MAP_BOUNDARY.map(p => p[0]));
const maxLat = Math.max(...MAP_BOUNDARY.map(p => p[0]));
const minLng = Math.min(...MAP_BOUNDARY.map(p => p[1]));
const maxLng = Math.max(...MAP_BOUNDARY.map(p => p[1]));

// Point-in-polygon test using ray casting algorithm
// Casts a ray from the point going east (increasing lng) and counts intersections
// Standard algorithm: for point (x,y), check if ray going right crosses edges
// For lat/lng: lng is horizontal (x), lat is vertical (y)
function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const lati = polygon[i][0], lngi = polygon[i][1];
        const latj = polygon[j][0], lngj = polygon[j][1];
        
        // Check if horizontal ray from (lat, lng) going east crosses the edge
        // Standard: ((y1 > y) != (y2 > y)) && (x < (x2-x1)*(y-y1)/(y2-y1) + x1)
        // Applied: ((lat1 > lat) != (lat2 > lat)) && (lng < (lng2-lng1)*(lat-lat1)/(lat2-lat1) + lng1)
        const intersect = ((lati > lat) !== (latj > lat)) &&
            (lng < (lngj - lngi) * (lat - lati) / (latj - lati) + lngi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Grid configuration for route finding
const spacing = 0.15; // ~15km spacing between grid points (good for route finding)
const jitter = 0.03; // Small random offset to avoid perfect grid alignment

const markers = [];

// Generate grid points within bounding box
const latRange = maxLat - minLat;
const lngRange = maxLng - minLng;
const gridRows = Math.ceil(latRange / spacing);
const gridCols = Math.ceil(lngRange / spacing);

console.log(`Generating markers within map boundary...`);
console.log(`Bounding box: Lat [${minLat.toFixed(2)}, ${maxLat.toFixed(2)}], Lng [${minLng.toFixed(2)}, ${maxLng.toFixed(2)}]`);
console.log(`Grid size: ${gridRows} x ${gridCols} points`);

// Generate candidate points in grid
const candidatePoints = [];
for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
        const lat = minLat + row * spacing + (Math.random() - 0.5) * jitter;
        const lng = minLng + col * spacing + (Math.random() - 0.5) * jitter;
        
        // Check if point is inside polygon
        if (pointInPolygon(lat, lng, MAP_BOUNDARY)) {
            candidatePoints.push({ lat, lng });
        }
    }
}

console.log(`Found ${candidatePoints.length} valid grid points within map boundary`);

// Shuffle candidate points to distribute markers evenly across the polygon
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const shuffledPoints = shuffleArray(candidatePoints);

// Generate markers for each resource
let pointIndex = 0;
Object.keys(RESOURCES).forEach(group => {
    Object.keys(RESOURCES[group]).forEach(tier => {
        RESOURCES[group][tier].forEach(resource => {
            // Random number of markers per resource (2-5)
            const count = Math.floor(Math.random() * 4) + 2;
            
            for (let i = 0; i < count; i++) {
                if (pointIndex >= shuffledPoints.length) {
                    // If we run out of candidate points, generate random points within polygon
                    let attempts = 0;
                    let lat, lng;
                    do {
                        lat = minLat + Math.random() * latRange;
                        lng = minLng + Math.random() * lngRange;
                        attempts++;
                    } while (!pointInPolygon(lat, lng, MAP_BOUNDARY) && attempts < 100);
                    
                    if (attempts >= 100) {
                        console.warn(`Warning: Could not find valid point for ${group} ${tier} ${resource}`);
                        continue;
                    }
                    
                    markers.push({
                        lat: parseFloat(lat.toFixed(6)),
                        lng: parseFloat(lng.toFixed(6)),
                        resourceData: {
                            group: group,
                            grade: tier,
                            resource: resource
                        },
                        title: `${group} ${tier} - ${resource}`
                    });
                } else {
                    // Use shuffled grid point for better distribution
                    const point = shuffledPoints[pointIndex];
                    markers.push({
                        lat: parseFloat(point.lat.toFixed(6)),
                        lng: parseFloat(point.lng.toFixed(6)),
                        resourceData: {
                            group: group,
                            grade: tier,
                            resource: resource
                        },
                        title: `${group} ${tier} - ${resource}`
                    });
                    pointIndex++;
                }
            }
        });
    });
});

// Write to file
fs.writeFileSync('test-markers.json', JSON.stringify(markers, null, 2));

console.log(`\nGenerated ${markers.length} test markers`);
console.log(`Spacing: ~${(spacing * 111).toFixed(1)}km between grid points`);
console.log(`File saved as: test-markers.json`);

// Print summary by group
console.log('\nSummary by group:');
Object.keys(RESOURCES).forEach(group => {
    const groupMarkers = markers.filter(m => m.resourceData.group === group);
    console.log(`  ${group}: ${groupMarkers.length} markers`);
});
