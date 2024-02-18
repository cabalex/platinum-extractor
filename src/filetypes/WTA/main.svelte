<script lang="ts">
    import Image from "svelte-material-icons/Image.svelte";
    import { textureFormats, type FileData, WTATexture } from "./extract";
    import type FileHandler from "../../lib/FileHandler";
    import ImageComponent from "./components/Image.svelte";
    import { get } from "svelte/store";

    export let name: string;
    export let data: FileData;
    export let fileHandler: FileHandler; // If you want to access other files (fileHandler.files store)
    export let setUnsavedChanges: (value: boolean) => {}; // Run setUnsavedChanges(true) to indicate that the file has unsaved changes

    export function save(): FileData|false {
        return false; // cannot save this file
    }

    let fileHandlerFiles = fileHandler.files;
    let wtpFile = null;
    let wtpArrayBuffer = null;
    $: {
        wtpFile = $fileHandlerFiles.find(file => file.name.endsWith(name.replace(".wta", ".wtp")));
        // @ts-ignore
        if (wtpFile && get(wtpFile.data).target) {
            // @ts-ignore
            let buffer = get(wtpFile.data)?.target;
            wtpArrayBuffer = new Uint8Array(new ArrayBuffer(buffer.byteLength));
            wtpArrayBuffer.set(new Uint8Array(buffer));
            wtpArrayBuffer = wtpArrayBuffer.buffer;
        }
    }

    $: recreatedTextures = data.textures.map(x => WTATexture.recreate(x));

    let index = 0;
</script>

{#if wtpFile}
<main class="wtaViewer">
    {#if recreatedTextures[index]}
    <ImageComponent texture={recreatedTextures[index]} wtpFile={wtpArrayBuffer} />
    {/if}
    <aside class="textureList">
        {#each recreatedTextures as texture, i}
            <button class="texture" class:active={index === i} on:click={() => index = i}>
                <Image size="1.5em" />
                <div class="name">
                    <span class="identifier">{texture.identifier}</span>
                    <span class="info">{texture.width}x{texture.height} - {texture._format} (0x{texture.format.toString(16).toUpperCase()})</span>
                </div>
            </button>
        {/each}
    </aside>
</main>
{:else}
<h2>WTP file not found</h2>
<span>Ensure you've extracted the DAT that holds this texture file.</span>
{/if}

<style>
    .wtaViewer {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }
    .textureList {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }
    .texture {
        background-color: #333;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 20px;
        user-select: none;
        border: none;
    }
    .texture.active {
        background-color: #555;
    }
    .texture:not(.active):hover {
        background-color: #444;
    }
    .name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .name .info {
        color: #aaa;
        font-family: monospace;
    }
</style>