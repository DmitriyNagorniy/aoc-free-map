// Filter functions
function initializeFilters() {
    // Populate group filter
    const groupSelect = document.getElementById('filterGroup');
    Object.keys(RESOURCES).forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
    
    // Populate tier filter
    const tierSelect = document.getElementById('filterTier');
    const tiers = ['T1', 'T2', 'T3'];
    tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier;
        option.textContent = tier;
        tierSelect.appendChild(option);
    });
    
    // Resource filter will be populated dynamically based on selected group and tier
    updateResourceFilter();
}

function updateResourceFilter() {
    const resourceSelect = document.getElementById('filterResource');
    const selectedGroup = document.getElementById('filterGroup').value;
    const selectedTier = document.getElementById('filterTier').value;
    
    // Clear existing options except "All Resources"
    resourceSelect.innerHTML = '<option value="">All Resources</option>';
    
    if (selectedGroup && RESOURCES[selectedGroup]) {
        const resources = new Set();
        
        if (selectedTier) {
            // If tier is selected, only show resources for that tier
            if (RESOURCES[selectedGroup][selectedTier]) {
                RESOURCES[selectedGroup][selectedTier].forEach(resource => {
                    resources.add(resource);
                });
            }
        } else {
            // If no tier selected, show all resources for the group
            Object.keys(RESOURCES[selectedGroup]).forEach(tier => {
                RESOURCES[selectedGroup][tier].forEach(resource => {
                    resources.add(resource);
                });
            });
        }
        
        // Sort and add resources to dropdown
        Array.from(resources).sort().forEach(resource => {
            const option = document.createElement('option');
            option.value = resource;
            option.textContent = resource;
            resourceSelect.appendChild(option);
        });
    } else {
        // If no group selected, show all resources from all groups
        const allResources = new Set();
        Object.keys(RESOURCES).forEach(group => {
            Object.keys(RESOURCES[group]).forEach(tier => {
                RESOURCES[group][tier].forEach(resource => {
                    allResources.add(resource);
                });
            });
        });
        
        Array.from(allResources).sort().forEach(resource => {
            const option = document.createElement('option');
            option.value = resource;
            option.textContent = resource;
            resourceSelect.appendChild(option);
        });
    }
}

function applyFilters() {
    const filterGroup = document.getElementById('filterGroup').value;
    const filterTier = document.getElementById('filterTier').value;
    const filterResource = document.getElementById('filterResource').value;
    
    // Store current resource filter value before updating options
    const currentResourceValue = filterResource;
    
    // Update resource filter options based on group and tier
    updateResourceFilter();
    
    // If resource filter was set, try to maintain it if it's still valid
    if (currentResourceValue) {
        const resourceSelect = document.getElementById('filterResource');
        const optionExists = Array.from(resourceSelect.options).some(opt => opt.value === currentResourceValue);
        if (optionExists) {
            resourceSelect.value = currentResourceValue;
        } else {
            resourceSelect.value = '';
        }
    }
    
    // Get the final filter values (resource might have been reset)
    const finalFilterGroup = document.getElementById('filterGroup').value;
    const finalFilterTier = document.getElementById('filterTier').value;
    const finalFilterResource = document.getElementById('filterResource').value;
    
    // Apply filters to markers
    markers.forEach(marker => {
        const resourceData = marker.resourceData;
        let shouldShow = true;
        
        // Filter by group
        if (finalFilterGroup && (!resourceData || resourceData.group !== finalFilterGroup)) {
            shouldShow = false;
        }
        
        // Filter by tier
        if (shouldShow && finalFilterTier && (!resourceData || resourceData.grade !== finalFilterTier)) {
            shouldShow = false;
        }
        
        // Filter by resource name
        if (shouldShow && finalFilterResource && (!resourceData || resourceData.resource !== finalFilterResource)) {
            shouldShow = false;
        }
        
        // Show or hide marker
        if (shouldShow) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
    
    // Clear route when filters change
    clearRoute();
}

function clearFilters() {
    document.getElementById('filterGroup').value = '';
    document.getElementById('filterTier').value = '';
    document.getElementById('filterResource').value = '';
    updateResourceFilter();
    
    // Show all markers
    markers.forEach(marker => {
        if (!map.hasLayer(marker)) {
            marker.addTo(map);
        }
    });
    
    // Clear route when filters change
    clearRoute();
}
