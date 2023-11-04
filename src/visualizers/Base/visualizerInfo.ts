const visualizerInfo = {
    // The name of the file format.
    "name": "Astral Chain Quest",
    // Regex matching of the folder name.
    "match": "^quest([0-9a-f]+).dat$",
    // Regex matching of the folder contents.
    "folderMatch": ["QuestData\.bxm", "BezierData\.bxm"],
    // A description of the visualizer.
    "description": "A quest file for Astral Chain, used for most logic in the game.",
    // The Call to Action button used to start the visualizer.
    "buttonText": "Open in AC Quest Viewer",
    // Icons8 icon name to use for the file.
    "icon": "file",
    // Credits to who implemented it. (I.e., you!)
    "credits": "Cabalex"
}
    
export default visualizerInfo;