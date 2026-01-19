# AoC Free Map - Interactive Resource Map

A standalone, browser-based interactive map application for tracking resources in Ashes of Creation. Save markers locally, export/import your data, and share with friends - all without any server requirements.

<a href="https://dmitriynagorniy.github.io/aoc-free-map/">https://dmitriynagorniy.github.io/aoc-free-map/</a>

<img width="1103" height="915" alt="image" src="https://github.com/user-attachments/assets/0272e8b5-5705-47da-b9d4-c8e90746ccc5" />


## Features

- 🗺️ **Interactive Map**: Click anywhere to add resource markers
- 🎯 **Resource Categories**: Organize markers by type (Lumber, Mining, Herbalism, Hunting) and tier (T1, T2, T3)
- 🔍 **Advanced Filtering**: Filter markers by group, tier, or specific resource name
- 🛣️ **Route Optimization**: Calculate optimal collection routes with smooth curved paths
- 💾 **Local Storage**: Markers are automatically saved in your browser
- 📤 **Export/Import**: Share your markers with friends via JSON files
- 🎨 **Color-Coded Markers**: Visual distinction by tier (Green=T1, Blue=T2, Orange=T3)
- 🗑️ **Easy Management**: Delete markers via popup button or right-click
- 🔄 **Auto-Backup**: Automatic backup before clearing all markers

## Quick Start

### Option 1: Use GitHub Pages (Easiest - No Setup Required)

If this repository is hosted on GitHub Pages, you can access it directly:
- Visit: `https://YOUR_USERNAME.github.io/aoc-free-map/`
- No installation or setup needed!
- All features work in the browser

### Option 2: Direct File Opening (Local)

1. **Download the project**
   ```bash
   git clone https://github.com/yourusername/aoc-free-map.git
   cd aoc-free-map
   ```

2. **Open `index.html`** in your web browser
   - Simply double-click `index.html`
   - Or right-click → "Open with" → Your browser

3. **Start using the map!**
   - Click on the map to add markers
   - Select resource type, tier, and specific resource from the modal

### Option 3: Local Web Server (Recommended for Development)

If you encounter CORS issues or want the best performance, use a local web server:

**Python 3:**
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000/index.html`

**Node.js:**
```bash
npx http-server
```
Then open the URL shown in the terminal (usually `http://localhost:8080`)

**VS Code:**
- Install the "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## How It Works

### Adding Markers

1. **Click on the map** where you want to place a marker
2. **Select Resource Group**: Choose from Lumber 🌳, Mining 🪨, Herbalism 🌿, or Hunting 🐺
3. **Select Tier**: Choose T1, T2, or T3
4. **Select Resource**: Pick the specific resource from the list
5. The marker is automatically created with the appropriate icon and color

### Marker Features

- **Icons**: Each resource type has a unique emoji icon
  - 🌳 Lumber
  - 🪨 Mining  
  - 🌿 Herbalism
  - 🐺 Hunting

- **Colors**: Markers are color-coded by tier
  - 🟢 Green = T1
  - 🔵 Blue = T2
  - 🟠 Orange = T3

### Managing Markers

- **Delete Single Marker**: Click the marker → Click "Delete Marker" button
- **Delete via Right-Click**: Right-click near a marker to remove it
- **Clear All**: Click "Clear All Markers" (automatically exports a backup first)

### Filtering Markers

- **Filter by Group**: Show only markers from a specific resource group
- **Filter by Tier**: Show only markers of a specific tier level
- **Filter by Resource**: Show only a specific resource type
- **Combined Filters**: Use multiple filters together for precise filtering
- **Real-Time Updates**: Markers show/hide instantly as you change filters
- **Clear Filters**: One-click button to reset all filters

### Route Optimization

- **Calculate Optimal Route**: Click "Calculate Route" to find the shortest path through visible markers
- **Smart Algorithms**: Uses Nearest Neighbor + 2-opt improvement for optimal routes
- **Smooth Curved Paths**: Beautiful Catmull-Rom spline curves that pass near markers
- **Route Information**: See total distance (km) and number of markers in route
- **Filtered Routes**: Calculate routes only for filtered markers
- **Auto-Fit View**: Map automatically adjusts to show the entire route

### Export/Import

- **Export**: Click "Export Markers" to download a JSON file with all your markers
- **Import**: Click "Import Markers" to load markers from a JSON file
- **Sharing**: Share the JSON file with friends to share your resource locations

### Data Persistence

- Markers are **automatically saved** to browser localStorage
- Your markers persist across browser sessions
- No internet connection required after initial load

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Your site will be live at:**
   ```
   https://YOUR_USERNAME.github.io/aoc-free-map/
   ```

The site will automatically update whenever you push changes to the `main` branch.

For detailed setup instructions, see [.github/pages-setup.md](.github/pages-setup.md)

## Project Structure

```
aoc-free-map/
├── index.html          # Main application file
├── scripts/            # Modular JavaScript files
│   ├── config.js      # Configuration and utilities
│   ├── resources.js   # Resource data and constants
│   ├── map.js         # Map initialization and tile handling
│   ├── markers.js     # Marker management
│   ├── storage.js     # Data persistence
│   ├── modal.js       # UI modals
│   ├── filters.js     # Filtering functionality
│   ├── route.js       # Route optimization
│   └── main.js        # Event handlers and initialization
├── tiles/              # Map tile images (downloaded separately)
│   └── 20250826/      # Tile date folder
│       └── {z}/{x}/{y}.webp
├── test/               # Testing tools
│   ├── generate-test-markers.js  # Test data generator
│   └── test-markers.json         # Sample test data
├── RELEASE_NOTES.md   # Release notes and changelog
└── README.md          # This file
```

## Requirements

- **Modern Web Browser** (Chrome, Firefox, Edge, Safari)
- **No installation needed** - works directly in the browser
- **Internet connection** (only for initial Leaflet.js library load)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Troubleshooting

### Tiles Not Loading

If map tiles don't appear:
- **Use a local web server** instead of opening the file directly
- Check that the `tiles/` folder exists and contains tile images
- Verify the tile path in `index.html` matches your tile structure

### Markers Not Saving

- Check browser console for errors (F12)
- Ensure localStorage is enabled in your browser
- Try clearing browser cache and reloading

### Import Not Working

- Verify the JSON file format is correct
- Check that the file contains an array of marker objects
- Ensure each marker has `lat` and `lng` properties

## Technical Details

- **Framework**: Pure JavaScript (no build process, no dependencies)
- **Map Library**: Leaflet.js 1.9.4
- **Storage**: Browser localStorage API
- **File Format**: JSON for export/import
- **Architecture**: Modular code structure for maintainability
- **Route Algorithms**: Nearest Neighbor + 2-opt improvement
- **Spline Interpolation**: Catmull-Rom splines for smooth routes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

### What this means:

✅ **You CAN:**
- Use this software for free
- Modify and adapt the code
- Share the code with others
- Use it for personal or educational purposes

❌ **You CANNOT:**
- Use this software for commercial purposes
- Sell this software or any derivative works
- Use it in any product or service that generates revenue

### Full License Text

See [LICENSE](LICENSE) file for the complete license terms, or visit:
https://creativecommons.org/licenses/by-nc/4.0/

## Disclaimer

This is a fan-made tool and is not affiliated with or endorsed by Intrepid Studios or Ashes of Creation. All game-related content belongs to their respective owners.

## Support the Project

If you find this project useful and would like to support its development, consider buying me a coffee! ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/dimanagornv)

Your support helps me continue improving this tool and creating more useful projects. Thank you! 🙏

## Getting Help

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Open an issue on GitHub
3. Check browser console for error messages (F12)

## Credits

- **Leaflet.js**: Open-source JavaScript library for mobile-friendly interactive maps

---

**Enjoy mapping your resources!** 🗺️✨
