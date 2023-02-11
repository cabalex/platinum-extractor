<script lang="ts">
    import Loading from '../assets/Loading.svelte';
    import Check from "svelte-material-icons/Check.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import { AceEditor } from "svelte-ace";
    import "brace/theme/monokai";
    import "brace/ext/searchbox";
    import { loadedFile } from '../lib/Main/MainStore';
    import { defineFile } from "@cabalex/platinum-extract";

    export let data;
    export let ext;
    export let includeRepack = true;
    let repackError: string|false = false;
    let timeout = null;

    $: value = data;

    function parse(detail: string) {
        // check repackability
        let parser = new DOMParser();
        let doc = parser.parseFromString(detail.replace("&", "&amp;"), "text/xml");
        let parseError = doc.querySelector('parsererror > div');
        repackError = parseError ? parseError.textContent : false;
    }

    function handleChange(e) {
        value = e.detail;
        if (defineFile(ext) === 'text/xml') {
            // HACK: This function currently has no way of detecting whether it's a new file being
            // loaded or not, so it just runs it every time. This sorta hurts performance unnecessarily,
            // but I don't know how to fix it.
            if (value.length === 0 || e.detail.length === 0 || data.length === e.detail.length) {
                if (timeout) clearTimeout(timeout);
                parse(e.detail);
                return;
            }
            repackError = null;
            clearTimeout(timeout);
            timeout = setTimeout(parse.bind(null, e.detail), 1000);
        }
    }

    export const repack = () => {
        let newValue = value.replace(/\r/, '').replace(/(\n)/, "\r\n");
        if (newValue === $loadedFile.toString()) return;
        $loadedFile.fromString(newValue);
        loadedFile.update(value => { value.modified = true; return value });
    }
</script>
{#if includeRepack}
<header class="repackChecker">
    {#if (repackError === null)}
    <Loading />
    <span>Checking if you can repack this file...</span>
    {:else if (repackError === false)}
    <Check width="32px" height="32px" />
    <span><b>Editing {$loadedFile.name}.</b></span>
    {:else}
    <Close width="32px" height="32px" />
    <span><b>There are errors in this version of {$loadedFile.name} that prevent you from repacking.</b> {repackError}</span>
    {/if}
    <button class="repack" on:click={repack} disabled={repackError !== false}>Save and Repack</button>
    <button class="repack"><Download /> Download</button>
</header>
{/if}
<AceEditor
    theme="monokai"
    lang=""
    on:init={(e) => { e.detail.setShowPrintMargin(false); e.detail.setFontSize("16px")}}
    on:input={handleChange}
    value={data}
/>

<style>
    /* other codejar styles are in app.css since they are not directly in this component */
    .repackChecker span {
        flex-grow: 1;
    }
</style>