<script lang="ts">
    import Unloaded from "../Unloaded.svelte";
    import { loadedComponentIndex } from "../MainStore";

    export let i;
    export let tab;
    export let fileHandler;

    let data = tab.file?.data;
    let files = tab.files;

    let props = {
        name: tab?.name,
        data: $data,
        files: files,
        fileHandler: fileHandler,
        setUnsavedChanges: (unsaved) => { tab.unchanged.set(false); tab.unsaved.set(unsaved) }
    }
</script>


<main style={$loadedComponentIndex !== i ? "display: none" : ""}>
    <svelte:component
        this={tab?.component || Unloaded}
        {...props}
    />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        overflow: hidden;
    }
</style>