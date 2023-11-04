<script lang="ts">
    import type FileHandler from "../../lib/FileHandler";
    import type { PlatinumFile } from "../../lib/FileHandler";

    export let name: string; // name of folder
    export let files: { [key: string]: PlatinumFile }; // object with files
    export let fileHandler: FileHandler; // If you want to access other files (fileHandler.files store)
    export let setUnsavedChanges: (value: boolean) => {}; // Run setUnsavedChanges(true) to indicate that the file has unsaved changes

    let questData = files["QuestData.bxm"].data;
    // Each file's (extracted) data is stored in a Svelte store, so that it can be subscribed to.
    // Access it with the dollar sign notation like so.
    let questDataObject = $questData;

    function changeQuestData() {
        // There's no "save" function here. Instead, you can modify the data directly.
        // Changing the data inside each file is as simple as modifying its store.
        questData.set({ myData: "Hello, world! This is my modded data." });
        setUnsavedChanges(false);
    }
</script>

<button on:click={changeQuestData}>
    Change Quest Data
</button>

{#each Object.keys(files) as fileName}
    <div>Hello, I'm file {files[fileName].name}!</div>
{/each}