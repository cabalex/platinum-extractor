<script lang="ts">
    import type { FileData } from "./extract";
    import type FileHandler from "../../lib/FileHandler";

    export let name: string;
    export let data: FileData;
    export let fileHandler: FileHandler; // If you want to access other files (fileHandler.files store)
    export let setUnsavedChanges: (value: boolean) => {}; // Run setUnsavedChanges(true) to indicate that the file has unsaved changes

    export function save(): FileData|false {
        return false;
    }
</script>

<div>
    <h2>You need NieR2Blender2NieR to open this file</h2>
    <p>NieR2Blender2NieR is a Blender add-on that lets you load and edit collision files in 3D.</p>
    <a href="https://github.com/cabalex/NieR2Blender2NieR" rel="noopener noreferrer" target="_blank">Get NieR2Blender2NieR</a>
</div>