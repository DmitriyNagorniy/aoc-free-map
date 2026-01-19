const data = require('./test-markers.json');
const boundary = [[65,-128],[47,-130],[-24,-145],[-18,-88],[5,-91],[4,-78],[-11,-73],[-28,-42],[1,-41],[19,-68],[30,-92],[62,-90]];

function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const lati = polygon[i][0], lngi = polygon[i][1];
        const latj = polygon[j][0], lngj = polygon[j][1];
        const intersect = ((lati > lat) !== (latj > lat)) &&
            (lng < (lngj - lngi) * (lat - lati) / (latj - lati) + lngi);
        if (intersect) inside = !inside;
    }
    return inside;
}

const outside = data.filter(m => !pointInPolygon(m.lat, m.lng, boundary));
console.log('Total markers: ' + data.length);
console.log('Markers outside boundary: ' + outside.length);
if (outside.length === 0) {
    console.log('✓ All markers are within the boundary!');
} else {
    console.log('✗ Some markers are outside the boundary:');
    outside.slice(0, 10).forEach(m => console.log(`  ${m.lat}, ${m.lng}`));
}
