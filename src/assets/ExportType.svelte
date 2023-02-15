<script lang="ts">
    import Folder from "svelte-material-icons/Folder.svelte";
    import Download from "svelte-material-icons/Download.svelte";
    import Creation from "svelte-material-icons/Creation.svelte";
    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";
    import { defineFile } from "@cabalex/platinum-extract";

    export let ext = "DAT";
    export let fileExt;
    export let description = "No description provided.";
    export let download: null|(() => void) = null;
    export let link: null|{href: string, text: string} = null;

    $: isRecommended = defineFile(ext) === defineFile(fileExt);
</script>

<div class="exportType" class:recommended={isRecommended}>
    {#if isRecommended}
    <h4><Creation /> RECOMMENDED BASED ON FILE TYPE</h4>
    {/if}
    <h3><Folder /> {ext.toUpperCase()}</h3>
    <p>{description}</p>
    {#if download}
    <button on:click={download}>
        <Download /> Export {ext}
    </button>
    {/if}
    {#if link}
    <a href={link.href}>
        <button>
            {link.text}
            <OpenInNew />
        </button>
    </a>
    {/if}
</div>

<style>
    .exportType {
        background-color: #777;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        max-width: 750px;
        border: 3px solid #777;
        position: relative;
    }
    .exportType.recommended {
        border-color: #aaa;
    }
    .exportType h4 {
        position: absolute;
        right: 10px;
        top: 10px;
        margin: 0;
        text-align: right;
    }
    .exportType h3 {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        font-size: 24px;
        gap: 10px;
    }
</style>