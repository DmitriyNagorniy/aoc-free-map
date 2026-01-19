// Main initialization and event handlers

// Add click event to map
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    pendingMarkerLocation = { lat, lng };
    openModal();
});

// Add context menu (right-click) to remove markers
map.on('contextmenu', function(e) {
    e.originalEvent.preventDefault(); // Prevent default browser context menu
    e.originalEvent.stopPropagation();
    
    // Get click point in pixels
    const clickPoint = map.latLngToContainerPoint(e.latlng);
    
    // Find and remove the closest marker using pixel distance
    let closestMarker = null;
    let minPixelDistance = Infinity;
    const pixelThreshold = 50; // pixels - how close you need to click
    
    markers.forEach(marker => {
        const markerPoint = map.latLngToContainerPoint(marker.getLatLng());
        const dx = clickPoint.x - markerPoint.x;
        const dy = clickPoint.y - markerPoint.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (pixelDistance < minPixelDistance && pixelDistance < pixelThreshold) {
            minPixelDistance = pixelDistance;
            closestMarker = marker;
        }
    });
    
    if (closestMarker) {
        map.removeLayer(closestMarker);
        markers = markers.filter(m => m !== closestMarker);
        clearRoute(); // Clear route when marker is removed
        saveMarkersToLocalStorage(); // Update localStorage after removal
    }
    
    return false; // Prevent default context menu
});

// Load markers from localStorage on page load
window.addEventListener('load', function() {
    // Wait a bit for map to fully initialize
    setTimeout(() => {
        loadMarkersFromLocalStorage();
        initializeFilters();
    }, 500);
});
