// Global state
let markers = [];
let markerCounter = 0;
let routePolyline = null; // Store the route polyline

// Create custom icon with icon emoji and tier-based color
function createCustomIcon(tier, iconEmoji = null) {
    const color = tier ? TIER_COLORS[tier] || '#667eea' : '#667eea';
    
    const iconDisplay = iconEmoji ? `<div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        font-size: 16px;
        pointer-events: none;
        z-index: 10;
        line-height: 1;
    ">${iconEmoji}</div>` : '';
    
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `<div style="
            position: relative;
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">${iconDisplay}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

// Add marker function
function addMarker(lat, lng, resourceData = null) {
    const title = resourceData ? 
        `${resourceData.group} ${resourceData.grade} - ${resourceData.resource}` : 
        `Marker ${++markerCounter}`;
    
    const iconEmoji = resourceData ? GROUP_ICONS[resourceData.group] : null;
    const tier = resourceData ? resourceData.grade : null;
    const marker = L.marker([lat, lng], { icon: createCustomIcon(tier, iconEmoji) });
    
    // Check if marker should be visible based on current filters
    const filterGroup = document.getElementById('filterGroup')?.value || '';
    const filterTier = document.getElementById('filterTier')?.value || '';
    const filterResource = document.getElementById('filterResource')?.value || '';
    
    let shouldShow = true;
    if (filterGroup || filterTier || filterResource) {
        // Only apply filters if at least one is set
        if (filterGroup && (!resourceData || resourceData.group !== filterGroup)) {
            shouldShow = false;
        }
        if (shouldShow && filterTier && (!resourceData || resourceData.grade !== filterTier)) {
            shouldShow = false;
        }
        if (shouldShow && filterResource && (!resourceData || resourceData.resource !== filterResource)) {
            shouldShow = false;
        }
    }
    
    // Only add to map if it should be visible
    if (shouldShow) {
        marker.addTo(map);
    }
    
    // Create popup content with delete button
    const popupContent = document.createElement('div');
    popupContent.style.textAlign = 'center';
    popupContent.innerHTML = `
        <strong>${title}</strong><br>
        ${resourceData ? `<small>${resourceData.group} • ${resourceData.grade}</small><br>` : ''}
        <small>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}</small><br>
        <button class="delete-marker-btn" 
                style="margin-top: 8px; padding: 5px 15px; background: #dc3545; color: white; 
                       border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Delete Marker
        </button>
    `;
    
    // Add click handler to delete button
    const deleteBtn = popupContent.querySelector('.delete-marker-btn');
    deleteBtn.addEventListener('click', function() {
        removeMarker(marker);
    });
    
    marker.bindPopup(popupContent);
    marker.resourceData = resourceData; // Store resource data with marker
    
    markers.push(marker);
    
    // Save to localStorage whenever a marker is added
    saveMarkersToLocalStorage();
    
    return marker;
}

// Remove a specific marker
function removeMarker(marker) {
    if (marker && markers.includes(marker)) {
        map.removeLayer(marker);
        markers = markers.filter(m => m !== marker);
        map.closePopup();
        saveMarkersToLocalStorage();
        // Clear route if marker was removed
        clearRoute();
    }
}

// Add marker at center
function addMarkerAtCenter() {
    const center = map.getCenter();
    pendingMarkerLocation = { lat: center.lat, lng: center.lng };
    openModal();
}

// Clear all markers
function clearMarkers() {
    if (markers.length === 0) {
        alert('No markers to clear.');
        return;
    }
    
    if (confirm(`Are you sure you want to clear all ${markers.length} markers?\n\nA backup will be exported automatically before clearing.`)) {
        // Export markers before clearing
        const exported = exportMarkersToFile(true);
        
        if (exported) {
            // Small delay to ensure file download starts
            setTimeout(() => {
                markers.forEach(marker => {
                    map.removeLayer(marker);
                });
                markers = [];
                markerCounter = 0;
                clearRoute(); // Clear route when markers are cleared
                saveMarkersToLocalStorage(); // Update localStorage after clearing
                alert('Markers cleared. Backup file has been downloaded.');
            }, 100);
        } else {
            // If export failed, still clear but warn user
            if (confirm('Export failed. Clear markers anyway? (No backup will be saved)')) {
                markers.forEach(marker => {
                    map.removeLayer(marker);
                });
                markers = [];
                markerCounter = 0;
                clearRoute(); // Clear route when markers are cleared
                saveMarkersToLocalStorage();
            }
        }
    }
}
