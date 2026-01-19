// Save markers to localStorage
function saveMarkersToLocalStorage() {
    const markersData = markers.map(marker => {
        const latlng = marker.getLatLng();
        return {
            lat: latlng.lat,
            lng: latlng.lng,
            resourceData: marker.resourceData
        };
    });
    try {
        localStorage.setItem('aocMapMarkers', JSON.stringify(markersData));
        console.log('Markers saved to localStorage');
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Load markers from localStorage
function loadMarkersFromLocalStorage() {
    try {
        const saved = localStorage.getItem('aocMapMarkers');
        if (saved) {
            const markersData = JSON.parse(saved);
            markersData.forEach(data => {
                addMarker(data.lat, data.lng, data.resourceData || null);
            });
            console.log(`Loaded ${markersData.length} markers from localStorage`);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
}

// Export markers to JSON file (internal function)
function exportMarkersToFile(silent = false) {
    if (markers.length === 0) {
        if (!silent) {
            alert('No markers to export.');
        }
        return false;
    }
    
    const markersData = markers.map(marker => {
        const latlng = marker.getLatLng();
        return {
            lat: latlng.lat,
            lng: latlng.lng,
            resourceData: marker.resourceData,
            title: marker.resourceData ? 
                `${marker.resourceData.group} ${marker.resourceData.grade} - ${marker.resourceData.resource}` : 
                'Custom Marker'
        };
    });
    
    const dataStr = JSON.stringify(markersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    link.download = `aoc-map-markers-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
}

// Export markers to JSON file (public function)
function exportMarkers() {
    exportMarkersToFile(false);
}

// Import markers from JSON file
function importMarkers() {
    document.getElementById('importFile').click();
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const markersData = JSON.parse(e.target.result);
            
            if (!Array.isArray(markersData)) {
                alert('Invalid file format. Expected an array of markers.');
                return;
            }
            
            if (markersData.length === 0) {
                alert('File is empty.');
                return;
            }
            
            if (confirm(`Import ${markersData.length} markers? This will add them to your current markers.`)) {
                markersData.forEach(data => {
                    if (data.lat && data.lng) {
                        addMarker(data.lat, data.lng, data.resourceData || null);
                    }
                });
                saveMarkersToLocalStorage();
                alert(`Successfully imported ${markersData.length} markers!`);
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}
