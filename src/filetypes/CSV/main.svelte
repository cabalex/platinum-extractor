<script lang="ts">
    import Loading from '../../assets/Loading.svelte';
    import Check from "svelte-material-icons/Check.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import { AceEditor } from 'svelte-ace';
    import "brace/theme/monokai";
    import "brace/ext/searchbox";

    import type { FileData } from "./extract";

    export let name: string;
    export let data: FileData;
    export let setUnsavedChanges: (value: boolean) => {};

    console.log(data);

    let repackError: string|false = false;
    let timeout = null;

    function toCSVString(data: string[][], depth=0) {
        return data.map(row => row.join(",")).join("\n");
    }

    let originalValue = "";
    let value = "";

    $: {
        originalValue = toCSVString(data.data);
        value = originalValue;
    }

    function handleChange(e) {
        value = e.detail;
        setUnsavedChanges(true);
    }

    export const repack = () => {
        let newValue = value;
        if (newValue === toCSVString(data.data)) return;
        // update logic here
        //loadedFile.update(value => { value.modified = true; return value });
    }
</script>
<header class="repackChecker">
    {#if (repackError === null)}
    <Loading />
    <span>Checking if you can repack this file...</span>
    {:else if (repackError === false)}
    <Check width="32px" height="32px" />
    <span><b>Editing {name}.</b></span>
    {:else}
    <Close width="32px" height="32px" />
    <span><b>There are errors in this version of {name} that prevent you from repacking.</b> {repackError}</span>
    {/if}
    <button class="repack"><Download /> Download</button>
</header>
<AceEditor
    theme="monokai"
    lang=""
    on:init={(e) => { e.detail.setShowPrintMargin(false); e.detail.setFontSize("16px")}}
    on:input={handleChange}
    value={originalValue}
/>

<style>
    /* other codejar styles are in app.css since they are not directly in this component */
    .repackChecker span {
        flex-grow: 1;
    }
</style>