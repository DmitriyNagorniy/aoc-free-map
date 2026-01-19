// Resource data structure - parsed from JSON
// Type mapping: 🪨 = Mining, 🌳 = Lumber, 🌿 = Herbalism
const RESOURCES = {
    'Lumber': {
        'T1': ['Plumeria Wood'],
        'T2': ['Weeping Willow', 'Eddledom', 'Dragon Tree'],
        'T3': ['Braidwood', "Korn'brolach Fir", 'Cacao Wood', 'Joshua']
    },
    'Mining': {
        'T2': ['Slate', 'Lumadon', 'Resonite', 'Halcyonite' , 'Coveglass'],
        'T3': ['Limestone', 'Rividium', 'Mourning Slate', 'Wyrdstone' , 'Nestone', 'Ochroah', 'Scalestone']
    },
    'Herbalism': {
        'T1': ['Elephant Ear'],
        'T2': ['Moonbell', 'Giant Bluebell', 'Salvewort', 'Bird of Paradise', 'Paintbrush', 'Barrel Cactus'],
        'T3': ['Fungal Anemone', 'Spindlevine', 'Furnace Moss', 'Gloomy Pross', 'Grve Lily', 'Fumitor', 'Giant\'s Toe']
    },
    'Hunting': {
        'T1': ['Grem', "Bear", "Wolf", "Raven", "Spider", 'Hawk'],
        'T2': ['Raptor', 'Bork', 'Skinwalker', 'Otter', 'Bullywog', 'Hippo', 'Daystrider', 'Ram'],
        'T3': ['Gryphon', 'Wyrmling', 'Crocodile', 'Giant Beetle', 'Basilisk', 'Komodo', 'Iguana', 'Flailrunner']
    },
};

// Icon emojis for different resource groups
const GROUP_ICONS = {
    'Lumber': '🌳',
    'Mining': '🪨',
    'Herbalism': '🌿',
    'Hunting': '🐺'
};

// Tier-based colors
const TIER_COLORS = {
    'T1': '#4CAF50',  // Green
    'T2': '#2196F3',  // Blue
    'T3': '#FF9800'   // Orange
};
