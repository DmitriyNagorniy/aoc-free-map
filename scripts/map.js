// Initialize the map
const map = L.map('map').setView(centerCoords, TILE_CONFIG.initialZoom);

// Override Leaflet's createTile to suppress errors before they happen
const originalCreateTile = L.GridLayer.prototype.createTile;
L.GridLayer.prototype.createTile = function(coords, done) {
    const tile = originalCreateTile.call(this, coords, done);
    
    if (tile && tile.tagName === 'IMG') {
        // Store tile layer reference
        const layer = this;
        
        // Add error handler immediately to suppress console errors
        const errorHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Use error tile if available
            if (layer && layer.options && layer.options.errorTileUrl) {
                this.src = layer.options.errorTileUrl;
            } else {
                // Use transparent pixel as fallback
                this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            }
            return false;
        };
        
        // Set onerror BEFORE setting src to catch errors early
        tile.onerror = errorHandler;
        
        // Also add event listener with capture phase
        tile.addEventListener('error', errorHandler, true);
    }
    
    return tile;
};

// Add local tile layer (from downloaded tiles)
const tileLayer = L.tileLayer(`${TILE_CONFIG.baseUrl}/${TILE_CONFIG.date}/{z}/{x}/{y}.webp`, {
    attribution: '',
    minZoom: TILE_CONFIG.minZoom,
    maxZoom: TILE_CONFIG.maxZoom,
    tileSize: 256,
    zoomOffset: 0,
    // Show a transparent/blank tile for missing tiles instead of error
    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    noWrap: false
});

// Store reference for error handlers
tileLayer.on('tileloadstart', function(e) {
    if (e.tile && e.tile.tagName === 'IMG') {
        e.tile._tileLayer = tileLayer;
    }
});

tileLayer.addTo(map);

// Suppress tile loading errors in console
tileLayer.on('tileerror', function(error, tile) {
    // Silently handle missing tiles
    if (tile && tile.img) {
        tile.img.onerror = function() {
            // Suppress error - do nothing
            return false;
        };
    }
});

// Intercept and suppress tile-related console errors
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args) {
    const message = args.join(' ');
    // Filter out tile-related file not found errors
    if (message.includes('tiles/') && 
        (message.includes('ERR_FILE_NOT_FOUND') || 
         message.includes('Failed to load') ||
         message.includes('404') ||
         message.includes('net::ERR_FILE_NOT_FOUND') ||
         message.includes('GET file://'))) {
        return; // Suppress this error
    }
    // Log other errors normally
    originalError.apply(console, args);
};

console.warn = function(...args) {
    const message = args.join(' ');
    // Filter out tile-related warnings
    if (message.includes('tiles/') && 
        (message.includes('Failed to load') ||
         message.includes('404'))) {
        return; // Suppress this warning
    }
    // Log other warnings normally
    originalWarn.apply(console, args);
};

// Catch unhandled image load errors at the window level
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG' && 
        e.target.src && e.target.src.includes('tiles/')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
}, true);

// Display coordinates and tile info
let coordDisplay = null;
map.on('mousemove', function(e) {
    if (!coordDisplay) {
        coordDisplay = L.control({position: 'bottomright'});
        coordDisplay.onAdd = function() {
            const div = L.DomUtil.create('div', 'coord-display');
            div.style.backgroundColor = 'white';
            div.style.padding = '8px 12px';
            div.style.borderRadius = '5px';
            div.style.fontSize = '11px';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            div.style.lineHeight = '1.4';
            return div;
        };
        coordDisplay.addTo(map);
    }
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    const zoom = map.getZoom();
    
    // Calculate tile coordinates
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const lat_rad = e.latlng.lat * Math.PI / 180;
    const y = Math.floor((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2 * n);
    
    coordDisplay.getContainer().innerHTML = `
        <div><strong>Lat:</strong> ${lat}, <strong>Lng:</strong> ${lng}</div>
        <div><strong>Tile:</strong> z=${zoom}, x=${x}, y=${y}</div>
    `;
});
