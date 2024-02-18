<script lang="ts">
    import Unloaded from "../Unloaded.svelte";
    import { componentTabs, loadedComponentIndex, type Tab } from "../MainStore";

    export let i;
    export let tab: Tab;
    export let fileHandler;

    let data = tab.file?.data;
    let files = tab.files;
    let save = () => false

    let props = {
        name: tab?.name,
        files: files,
        fileHandler: fileHandler,
        setUnsavedChanges: (unsaved) => { tab.unchanged.set(false); tab.unsaved.set(unsaved) }
    }

    function checkSave(e) {
        if (e.ctrlKey && e.key === "s") {
            e.preventDefault();
            if ($loadedComponentIndex === i && save) {
                let result = save();
                console.log(result);
                if (result === false) {
                    tab.unchanged.set(false);
                } else {
                    tab.file.data = result;
                    tab.unchanged.set(false);
                    tab.unsaved.set(false);
                }
            }
        }
    }
</script>


<main style={$loadedComponentIndex !== i ? "display: none" : ""}>
    <svelte:component
        this={tab?.component || Unloaded}
        bind:data={$data}
        bind:save={save}
        {...props}
    />
</main>

<svelte:body on:keydown={checkSave} />

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