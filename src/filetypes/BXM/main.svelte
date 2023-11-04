<script lang="ts">
    import Loading from '../../assets/Loading.svelte';
    import Check from "svelte-material-icons/Check.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import { AceEditor } from 'svelte-ace';
    import "brace/theme/monokai";
    import "brace/ext/searchbox";

    import type { FileData, Node } from "./extract";

    export let name: string;
    export let data: FileData;
    export let setUnsavedChanges: (value: boolean) => {};

    console.log(data);

    let repackError: string|false = false;
    let timeout = null;

    function toXMLString(data: Node, depth=0) {
        let xml = "";
        if (depth > 0) xml += "\n" + "\t".repeat(depth);
        xml += `<${data.name}`;
        for (let attr in data.attributes) {
            xml += ` ${attr}="${data.attributes[attr]}"`;
        }
        xml += ">";
        xml += data.value;
        for (let child of data.children) {
            xml += toXMLString(child, depth + 1);
        }
        if (data.children.length) xml += "\n" + "\t".repeat(depth);
        xml += `</${data.name}>`;
        return xml;
    }

    let originalValue = "";
    let value = "";

    $: {
        originalValue = toXMLString(data.data);
        value = originalValue;
    }

    function parse(detail: string) {
        // check repackability
        let parser = new DOMParser();
        let doc = parser.parseFromString(detail.replace("&", "&amp;"), "text/xml");
        let parseError = doc.querySelector('parsererror > div');
        repackError = parseError ? parseError.textContent : false;
    }

    function handleChange(e) {
        value = e.detail;
        setUnsavedChanges(true);

        // HACK: This function currently has no way of detecting whether it's a new file being
        // loaded or not, so it just runs it every time. This sorta hurts performance unnecessarily,
        // but I don't know how to fix it.
        if (value.length === 0 || e.detail.length === 0 || originalValue.length === e.detail.length) {
            if (timeout) clearTimeout(timeout);
            parse(e.detail);
            return;
        }
        repackError = null;
        clearTimeout(timeout);
        timeout = setTimeout(parse.bind(null, e.detail), 1000);
    }

    export const repack = () => {
        let newValue = value.replace(/\r/, '').replace(/(\n)/, "\r\n");
        if (newValue === new XMLSerializer().serializeToString(data.data)) return;
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