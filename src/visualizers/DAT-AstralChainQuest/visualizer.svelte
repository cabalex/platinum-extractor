<script lang="ts">
    import type FileHandler from "../../lib/FileHandler";
    import type { PlatinumFile } from "../../lib/FileHandler";

    export let name: string; // name of folder
    export let files: { [key: string]: PlatinumFile }; // object with files
    export let fileHandler: FileHandler; // If you want to access other files (fileHandler.files store)
    export let setUnsavedChanges: (value: boolean) => {}; // Run setUnsavedChanges(true) to indicate that the file has unsaved changes

    
</script>
{#each Object.keys(files) as fileName}
    <div>Hello, I'm file {files[fileName].name}!</div>
{/each}