// Route optimization functions
// Calculate distance between two lat/lng points using Haversine formula (in km)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get currently visible (filtered) markers
function getVisibleMarkers() {
    return markers.filter(marker => map.hasLayer(marker));
}

// Nearest neighbor algorithm for initial route
function nearestNeighborRoute(points) {
    if (points.length <= 1) return points;
    
    const route = [points[0]];
    const remaining = points.slice(1);
    
    while (remaining.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        const current = route[route.length - 1];
        const currentPos = current.getLatLng();
        
        for (let i = 0; i < remaining.length; i++) {
            const pos = remaining[i].getLatLng();
            const distance = calculateDistance(
                currentPos.lat, currentPos.lng,
                pos.lat, pos.lng
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = i;
            }
        }
        
        route.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
    }
    
    return route;
}

// 2-opt improvement algorithm
function twoOptImprovement(route) {
    if (route.length < 4) return route;
    
    let improved = true;
    let bestRoute = route.slice();
    let bestDistance = calculateRouteDistance(route);
    let iterations = 0;
    const maxIterations = 10; // Limit iterations for performance
    
    while (improved && iterations < maxIterations) {
        improved = false;
        iterations++;
        
        for (let i = 1; i < route.length - 2; i++) {
            for (let j = i + 1; j < route.length; j++) {
                if (j - i === 1) continue;
                
                // Try reversing segment between i and j
                const newRoute = route.slice();
                newRoute.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
                
                const newDistance = calculateRouteDistance(newRoute);
                if (newDistance < bestDistance) {
                    bestRoute = newRoute;
                    bestDistance = newDistance;
                    improved = true;
                    route = newRoute;
                    break; // Restart from beginning after improvement
                }
            }
            if (improved) break;
        }
    }
    
    return bestRoute;
}

// Calculate total distance of a route
function calculateRouteDistance(route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const pos1 = route[i].getLatLng();
        const pos2 = route[i + 1].getLatLng();
        totalDistance += calculateDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
    }
    // Add distance back to start for loop
    if (route.length > 2) {
        const first = route[0].getLatLng();
        const last = route[route.length - 1].getLatLng();
        totalDistance += calculateDistance(first.lat, first.lng, last.lat, last.lng);
    }
    return totalDistance;
}

// Calculate offset waypoint near a marker (not directly on it)
// Uses a consistent offset based on marker index to ensure reproducible curves
function calculateOffsetWaypoint(marker, markerIndex, offsetDistance = 0.0015) {
    const pos = marker.getLatLng();
    // Use sine/cosine for consistent circular offset pattern
    const angle = (markerIndex * 137.5) % 360; // Golden angle for even distribution
    const rad = angle * Math.PI / 180;
    const offsetLat = offsetDistance * Math.cos(rad);
    const offsetLng = offsetDistance * Math.sin(rad);
    return [pos.lat + offsetLat, pos.lng + offsetLng];
}

// Catmull-Rom spline interpolation
// Generates a smooth curve that passes near control points
function catmullRomSpline(p0, p1, p2, p3, tParam, tension = 0.5) {
    // Catmull-Rom to Bezier conversion
    const t1 = tension;
    const t2 = tension;
    
    // Calculate tangent vectors
    const m1x = (p2[0] - p0[0]) * t1;
    const m1y = (p2[1] - p0[1]) * t1;
    const m2x = (p3[0] - p1[0]) * t2;
    const m2y = (p3[1] - p1[1]) * t2;
    
    // Convert to Bezier control points
    const cp1 = [p1[0] + m1x / 3, p1[1] + m1y / 3];
    const cp2 = [p2[0] - m2x / 3, p2[1] - m2y / 3];
    
    // Cubic Bezier interpolation
    const mt = 1 - tParam;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const tParam2 = tParam * tParam;
    const tParam3 = tParam2 * tParam;
    
    const lat = mt3 * p1[0] + 3 * mt2 * tParam * cp1[0] + 3 * mt * tParam2 * cp2[0] + tParam3 * p2[0];
    const lng = mt3 * p1[1] + 3 * mt2 * tParam * cp1[1] + 3 * mt * tParam2 * cp2[1] + tParam3 * p2[1];
    
    return [lat, lng];
}

// Generate points along a Catmull-Rom spline segment
function generateSplineSegment(p0, p1, p2, p3, segments = 30, tension = 0.5) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const point = catmullRomSpline(p0, p1, p2, p3, t, tension);
        points.push(point);
    }
    return points;
}

// Create smooth curved path using Catmull-Rom splines
// The curve passes near waypoints but doesn't connect directly to them
function createCurvedPath(waypoints, offsetDistance = 0.001, curveSegments = 30) {
    if (waypoints.length < 2) return waypoints;
    
    // For closed loop, we need to wrap points
    const closedWaypoints = [...waypoints];
    if (closedWaypoints.length > 2) {
        // Add extra points at beginning and end for smooth closed loop
        closedWaypoints.unshift(closedWaypoints[closedWaypoints.length - 1]);
        closedWaypoints.push(closedWaypoints[1]);
    }
    
    if (waypoints.length === 2) {
        // For 2 points, create a smooth arc
        const p0 = waypoints[0];
        const p1 = waypoints[1];
        const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        
        // Create control points for smooth arc
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        const perpX = -dy;
        const perpY = dx;
        const len = Math.sqrt(perpX * perpX + perpY * perpY);
        const offset = offsetDistance * 3;
        
        const cp0 = [p0[0] - dx * 0.3, p0[1] - dy * 0.3];
        const cp1 = [mid[0] + (perpX / len) * offset, mid[1] + (perpY / len) * offset];
        const cp2 = [p1[0] + dx * 0.3, p1[1] + dy * 0.3];
        
        return generateSplineSegment(cp0, p0, p1, cp2, curveSegments, 0.5);
    }
    
    const curvedPoints = [];
    
    // Generate spline segments between waypoints
    for (let i = 1; i < closedWaypoints.length - 2; i++) {
        const p0 = closedWaypoints[i - 1];
        const p1 = closedWaypoints[i];
        const p2 = closedWaypoints[i + 1];
        const p3 = closedWaypoints[i + 2];
        
        // Calculate adaptive tension based on distances
        const dist1 = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
        const dist2 = Math.sqrt((p3[0] - p2[0]) ** 2 + (p3[1] - p2[1]) ** 2);
        const avgDist = (dist1 + dist2) / 2;
        const tension = Math.min(0.6, 0.3 + 0.2 * Math.min(dist1, dist2) / (avgDist + 0.0001));
        
        // Generate spline segment
        const segmentPoints = generateSplineSegment(p0, p1, p2, p3, curveSegments, tension);
        
        // Add points (skip first to avoid duplicates except for first segment)
        if (i === 1) {
            curvedPoints.push(...segmentPoints);
        } else {
            curvedPoints.push(...segmentPoints.slice(1));
        }
    }
    
    return curvedPoints;
}

// Calculate optimal route for visible markers
function calculateOptimalRoute() {
    const visibleMarkers = getVisibleMarkers();
    
    if (visibleMarkers.length < 2) {
        alert('Need at least 2 visible markers to calculate a route.');
        return;
    }
    
    // Clear existing route
    clearRoute();
    
    // Show loading message
    const infoPanel = document.querySelector('.info-panel');
    const originalText = infoPanel.innerHTML;
    infoPanel.innerHTML = '<strong>Calculating optimal route...</strong>';
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
        // Calculate initial route using nearest neighbor
        let route = nearestNeighborRoute(visibleMarkers);
        
        // Improve route using 2-opt if we have enough points
        if (route.length > 3) {
            route = twoOptImprovement(route);
        }
        
        // Create offset waypoints (near markers but not directly on them)
        const offsetDistance = 0.0015; // ~150-200 meters offset
        const waypoints = route.map((marker, index) => calculateOffsetWaypoint(marker, index, offsetDistance));
        
        // Note: createCurvedPath handles closed loops internally, so we don't need to duplicate the first point
        
        // Generate smooth curved path using Catmull-Rom splines
        // Higher segment count for smoother curves
        const curvedPath = createCurvedPath(waypoints, offsetDistance, 35);
        
        // Create and add polyline to map with smooth curves
        routePolyline = L.polyline(curvedPath, {
            color: '#ff6b35',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1.0,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(map);
        
        // Calculate total distance (approximate, using waypoints)
        const totalDistance = calculateRouteDistance(route);
        
        // Update info panel
        infoPanel.innerHTML = `<strong>Route calculated!</strong> ${route.length} markers, Total distance: ${totalDistance.toFixed(2)} km`;
        
        // Fit map to show the entire route
        if (routePolyline) {
            map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
        }
    }, 100);
}

// Clear the route
function clearRoute() {
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    // Reset info panel
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.innerHTML = '<strong>Instructions:</strong> Click on the map to add markers | Click marker and use "Delete Marker" button | Right-click near marker to remove';
}
