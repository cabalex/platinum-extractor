const fileInfo = {
    "ext": "BXM",
    // The name of the file format.
    "name": "Binary XML",
    // The file magic (first 4 bytes of the file).
    "magic": ["BXM\x00", "XML\x00"],
    // A description of the file.
    "description": "A compressed XML format commonly used for storing configuration data.",
    // Icons8 icon name to use for the file.
    "icon": "file",
    // Credits to who implmeneted it. (I.e., you!)
    "credits": "Cabalex",
}

export default fileInfo;