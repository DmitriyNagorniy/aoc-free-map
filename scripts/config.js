// Configuration - Based on downloaded tiles
// Original tile: z=5, x=8, y=14
const TILE_CONFIG = {
    date: '20250826',
    baseUrl: 'tiles',
    // Calculate center from tile coordinates (z=5, x=8, y=14)
    centerTile: { z: 5, x: 8, y: 14 },
    initialZoom: 5,
    minZoom: 4,
    maxZoom: 6
};

// Helper function to convert tile coordinates to lat/lng
function tileToLatLng(x, y, z) {
    const n = Math.pow(2, z);
    const lon_deg = x / n * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat_deg = lat_rad * 180.0 / Math.PI;
    return [lat_deg, lon_deg];
}

// Calculate center coordinates from tile
const centerCoords = tileToLatLng(
    TILE_CONFIG.centerTile.x + 0.5, 
    TILE_CONFIG.centerTile.y + 0.5, 
    TILE_CONFIG.centerTile.z
);
