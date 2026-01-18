# AoC Free Map - Interactive Resource Map

A standalone, browser-based interactive map application for tracking resources in Ashes of Creation. Save markers locally, export/import your data, and share with friends - all without any server requirements.

## Features

- 🗺️ **Interactive Map**: Click anywhere to add resource markers
- 🎯 **Resource Categories**: Organize markers by type (Lumber, Mining, Herbalism) and tier (T1, T2, T3)
- 💾 **Local Storage**: Markers are automatically saved in your browser
- 📤 **Export/Import**: Share your markers with friends via JSON files
- 🎨 **Color-Coded Markers**: Visual distinction by tier (Green=T1, Blue=T2, Orange=T3)
- 🗑️ **Easy Management**: Delete markers via popup button or right-click
- 🔄 **Auto-Backup**: Automatic backup before clearing all markers

## Quick Start

### Option 1: Direct File Opening (Simplest)

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

### Option 2: Local Web Server (Recommended for Best Experience)

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
2. **Select Resource Group**: Choose from Lumber 🌳, Mining 🪨, or Herbalism 🌿
3. **Select Tier**: Choose T1, T2, or T3
4. **Select Resource**: Pick the specific resource from the list
5. The marker is automatically created with the appropriate icon and color

### Marker Features

- **Icons**: Each resource type has a unique emoji icon
  - 🌳 Lumber
  - 🪨 Mining  
  - 🌿 Herbalism

- **Colors**: Markers are color-coded by tier
  - 🟢 Green = T1
  - 🔵 Blue = T2
  - 🟠 Orange = T3

### Managing Markers

- **Delete Single Marker**: Click the marker → Click "Delete Marker" button
- **Delete via Right-Click**: Right-click near a marker to remove it
- **Clear All**: Click "Clear All Markers" (automatically exports a backup first)

### Export/Import

- **Export**: Click "Export Markers" to download a JSON file with all your markers
- **Import**: Click "Import Markers" to load markers from a JSON file
- **Sharing**: Share the JSON file with friends to share your resource locations

### Data Persistence

- Markers are **automatically saved** to browser localStorage
- Your markers persist across browser sessions
- No internet connection required after initial load

## Project Structure

```
aoc-free-map/
├── index.html          # Main application file
├── tiles/              # Map tile images (downloaded separately)
│   └── 20250826/      # Tile date folder
│       └── {z}/{x}/{y}.webp
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

- **Framework**: Pure JavaScript (no build process)
- **Map Library**: Leaflet.js 1.9.4
- **Storage**: Browser localStorage API
- **File Format**: JSON for export/import

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
