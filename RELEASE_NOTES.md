# Release Notes

## Version 1.1.0 - January 2026

### What's New

#### 🐺 Hunting Resource Type Added
- Added complete Hunting resource category with all tiers (T1, T2, T3)
- 22 new hunting resources including Grem, Bear, Wolf, Gryphon, and more
- Full integration with marker system and filters

#### 🔍 Advanced Filtering System
- **Multi-level filtering**: Filter markers by Group, Tier, and Resource Name
- **Dynamic resource dropdown**: Resource list updates based on selected group and tier
- **Real-time filtering**: Markers show/hide instantly as filters change
- **Clear filters button**: One-click reset for all filters

#### 🛣️ Route Optimization
- **Optimal route calculation**: 
  - Nearest Neighbor algorithm for initial route
  - 2-opt improvement algorithm for route optimization
  - Calculates shortest path through filtered markers
- **Smooth curved routes**: 
  - Catmull-Rom spline interpolation
  - Routes pass near markers without directly connecting
  - Beautiful curved visualization
- **Route information**: Displays total distance (km) and marker count
- **Auto-fit view**: Map automatically adjusts to show entire route

#### 🧪 Testing Tools
- **Test data generator**: Script to generate test markers with configurable map boundaries
- **Pre-generated test data**: Sample markers file included for testing routes
- **Boundary-based generation**: Markers generated within specified map boundaries

#### 🏗️ Code Architecture Improvements
- **Modular structure**: Code split into logical modules in `scripts/` folder:
  - `config.js` - Configuration and utilities
  - `resources.js` - Resource data and constants
  - `map.js` - Map initialization and tile handling
  - `markers.js` - Marker management
  - `storage.js` - Data persistence
  - `modal.js` - UI modals
  - `filters.js` - Filtering functionality
  - `route.js` - Route optimization
  - `main.js` - Event handlers and initialization
- **Better maintainability**: Easier to understand and modify code
- **Improved organization**: Clear separation of concerns

### Improvements
- Route automatically clears when filters change or markers are removed
- Filter state preserved when updating resource dropdown
- Better error handling for route calculation
- Performance optimizations for route calculation (limited iterations)

### Bug Fixes
- Fixed route not clearing when markers are deleted
- Fixed filter dropdown not updating correctly when group/tier changes
- Improved marker visibility handling with filters

---

## Previous Versions

### Version 1.0.0 - Initial Release
- Basic marker management (add, delete, clear)
- Resource selection modal (Lumber, Mining, Herbalism)
- LocalStorage persistence
- Export/Import functionality
- Color-coded markers by tier
- Custom marker icons with emojis

### 🗺️ Map Functionality
- **Interactive Leaflet Map**: Full-featured map with zoom controls (levels 4-6)
- **Local Tile Support**: Uses locally stored map tiles for offline functionality
- **Coordinate Display**: Real-time display of latitude, longitude, and tile coordinates
- **Smooth Navigation**: Pan and zoom with mouse and touch support

### 📍 Marker Management
- **Add Markers**: Click anywhere on the map to add resource markers
- **Add at Center**: Quick button to add a marker at the current map center
- **Custom Icons**: Visual markers with:
  - Tier-based colors (T1: Green, T2: Blue, T3: Orange)
  - Group-specific emojis (🌳 Lumber, 🪨 Mining, 🌿 Herbalism, 🐺 Hunting)
  - Custom styled markers with drop shadows
- **Delete Markers**: 
  - Click marker and use "Delete Marker" button in popup
  - Right-click near marker to remove
- **Marker Information**: Each marker displays:
  - Resource name, group, and tier
  - Exact coordinates
  - Quick delete option

### 🎯 Resource Selection
- **Three-Step Modal**: Intuitive resource selection process
  1. Select Resource Group (Lumber, Mining, Herbalism, Hunting)
  2. Select Tier (T1, T2, T3)
  3. Select Specific Resource
- **Auto-Advance**: Seamless navigation through selection steps
- **Visual Feedback**: Selected options are highlighted

### 🔍 Filtering System
- **Multi-Level Filters**: Filter markers by:
  - Resource Group
  - Tier Level
  - Specific Resource Name
- **Dynamic Resource List**: Resource dropdown updates based on selected group and tier
- **Real-Time Filtering**: Markers show/hide instantly as filters change
- **Clear Filters**: One-click button to reset all filters

### 🛣️ Route Optimization
- **Optimal Route Calculation**: 
  - Nearest Neighbor algorithm for initial route
  - 2-opt improvement algorithm for route optimization
  - Calculates shortest path through filtered markers
- **Smooth Curved Routes**: 
  - Catmull-Rom spline interpolation
  - Routes pass near markers without directly connecting
  - Beautiful curved visualization
- **Route Information**: Displays total distance and marker count
- **Auto-Fit View**: Map automatically adjusts to show entire route

### 💾 Data Persistence
- **LocalStorage**: All markers automatically saved to browser storage
- **Export Functionality**: 
  - Export all markers to JSON file
  - Timestamped filenames
  - Includes all marker data and coordinates
- **Import Functionality**: 
  - Import markers from JSON files
  - Merge with existing markers
  - Validation and error handling
- **Backup on Clear**: Automatic export before clearing all markers

### 🎨 User Interface
- **Modern Design**: Clean, gradient-based UI with smooth animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Modal Dialogs**: Smooth animations for resource selection
- **Info Panel**: Contextual information and instructions
- **Color-Coded Controls**: Visual distinction for different actions

### 🧪 Testing Tools
- **Test Data Generator**: Script to generate test markers
  - Configurable map boundaries
  - Random distribution across resource types
  - Adequate spacing for route testing
- **Test Markers**: Pre-generated test data file included

---

## Technical Details

### Architecture
- **Modular Code Structure**: Organized into logical modules:
  - `config.js` - Configuration and utilities
  - `resources.js` - Resource data and constants
  - `map.js` - Map initialization and tile handling
  - `markers.js` - Marker management
  - `storage.js` - Data persistence
  - `modal.js` - UI modals
  - `filters.js` - Filtering functionality
  - `route.js` - Route optimization
  - `main.js` - Event handlers and initialization

### Technologies
- **Leaflet.js 1.9.4**: Mapping library
- **Vanilla JavaScript**: No framework dependencies
- **LocalStorage API**: Browser storage
- **File API**: Import/export functionality

### Browser Support
- Modern browsers with ES6+ support
- LocalStorage support required
- File API support for import/export

---

## Resource Types Supported

### Lumber (🌳)
- **T1**: Plumeria Wood
- **T2**: Weeping Willow, Eddledom, Dragon Tree
- **T3**: Braidwood, Korn'brolach Fir, Cacao Wood, Joshua

### Mining (🪨)
- **T2**: Slate, Lumadon, Resonite, Halcyonite, Coveglass
- **T3**: Limestone, Rividium, Mourning Slate, Wyrdstone, Nestone, Ochroah, Scalestone

### Herbalism (🌿)
- **T1**: Elephant Ear
- **T2**: Moonbell, Giant Bluebell, Salvewort, Bird of Paradise, Paintbrush, Barrel Cactus
- **T3**: Fungal Anemone, Spindlevine, Furnace Moss, Gloomy Pross, Grve Lily, Fumitor, Giant's Toe

### Hunting (🐺)
- **T1**: Grem, Bear, Wolf, Raven, Spider, Hawk
- **T2**: Raptor, Bork, Skinwalker, Otter, Bullywog, Hippo, Daystrider, Ram
- **T3**: Gryphon, Wyrmling, Crocodile, Giant Beetle, Basilisk, Komodo, Iguana, Flailrunner

---

## Usage Instructions

### Adding Markers
1. Click anywhere on the map
2. Select resource group from modal
3. Select tier level
4. Select specific resource
5. Marker is automatically added and saved

### Filtering Markers
1. Use dropdown menus to select filters
2. Markers automatically show/hide based on selection
3. Click "Clear Filters" to show all markers

### Calculating Routes
1. Apply filters if you want to route specific resources
2. Click "Calculate Route" button
3. View the optimal curved route on the map
4. Route shows total distance and marker count

### Exporting/Importing
- **Export**: Click "Export Markers" to download JSON file
- **Import**: Click "Import Markers" and select JSON file
- **Sharing**: Share exported JSON files with friends

---

## Known Limitations
- Map tiles must be stored locally in `tiles/` directory
- Route optimization works best with 2-200 markers
- Large marker sets may take longer to calculate routes

---

## Future Enhancements (Potential)
- Multiple route calculation algorithms
- Route waypoint editing
- Marker clustering for large datasets
- Custom marker colors
- Route export/import
- Statistics and analytics

---

## Credits
- Built with Leaflet.js
- All data stored locally - no server required

---

## License
See LICENSE file for details.

---

**Version**: 1.1.0  
**Release Date**: January 2026  
**Status**: Stable
