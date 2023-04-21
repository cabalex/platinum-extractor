<script lang="ts">
    import { onDestroy } from "svelte";
    import { loadedFile } from "./MainStore";
    import { defineFile } from "@cabalex/platinum-extract";
    import { addToast } from "../Toasts/ToastStore";

    import TextEditor from "../../views/TextEditor.svelte";
    import CSVEditor from "../../views/CSVEditor.svelte";
    import Exporter from "../../views/Exporter.svelte";
    import Unloaded from "../../views/Unloaded.svelte";
    import MCDEditor from "../../views/MCDEditor.svelte";
    import WTAViewer from "../../views/WTAViewer.svelte";
    import ACSaveEditor from "../../views/ACSaveEditor.svelte";

    export let fileHandler;

    const unsubscribe = loadedFile.subscribe((value) => {
    })

    onDestroy(() => {
        unsubscribe();
    })

    $: files = $loadedFile !== null ? $loadedFile.files : null;
    function fetchComponent(name: string) {
        // Allow for exporting folders that don't have an extension
        if (files && $files.length > 0) {
            return Exporter;
        }

        let type = defineFile(name);
        console.log(name, type);

        switch(type) {
            case 'text/xml':
                return TextEditor;
            case 'text/csv':
                return CSVEditor;
            case 'localization/mcd':
                return MCDEditor;
            case 'texture/wta':
                return WTAViewer;
            case 'texture/wtp':
                addToast({
                    type: 'danger',
                    title: `Load the WTA`,
                    message: `WTP is just texture data- open ${name.replace('.wtp', '.wta')} to read this file's contents.`,
                    timeout: 10000
                })
                return Unloaded;
            case 'save/astralchain_slot':
                return ACSaveEditor;
            default:
                addToast({
                    type: 'danger',
                    title: `Unsupported file type`,
                    message: `The file type ${type} is not supported yet.`,
                    timeout: 10000
                })
        }
    }
</script>

<main>
    {#if !$loadedFile}
    <Unloaded />
    {:else}
        <svelte:component
            this={fetchComponent($loadedFile.name)}
            ext={$loadedFile.name.split('.')[1] || ""}
            data={$loadedFile.toString()}
            fileHandler={fileHandler}
        />
    {/if}
</main>

<style>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow-y: auto;

    width: 100%;
}
</style>