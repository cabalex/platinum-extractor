<script lang="ts">
    import type FileHandler from "src/FileHandler";
    import File from "./File.svelte";
    import Delete from "svelte-material-icons/Delete.svelte";
  import { loadedFile } from "../Main/MainStore";

    export let fileHandler: FileHandler;
    let isDragHovering = false;
    let fileInput = null;
    let { files } = fileHandler;
    
    const handleDragDrop = (e) => {
        e.preventDefault();
        isDragHovering = false;
        fileHandler.import([...e.dataTransfer.files].map((file) => {return {name: file.name, size: file.size, file}}), {print: true});
    }

    const fileChange = async (e) => {
        await fileHandler.import([...e.target.files].map((file) => {return {name: file.name, size: file.size, file}}), {print: true});
        e.target.value = null;
    }

    const handleDragEnter = (e) => isDragHovering = true;
    const handleDragLeave = (e) => {
        if (e.target === e.currentTarget) isDragHovering = false;
    }

    const deleteAllFiles = () => {
        if (confirm("Are you sure you want to clear all files from here? You can't undo this.")) {
            loadedFile.set(null);
            fileHandler.clear();
            
        }
    }
</script>

<aside
    class="files"
    class:empty={$files.length === 0}
    class:dragover={isDragHovering}
    on:drop={handleDragDrop}
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={e => e.preventDefault()}
>
    <header>
        <a href="https://cabalex.github.io" class="logo">cabalex.github.io</a>
        <h1>Platinum Extractor</h1>
    </header>
    <div class="rootDir">
        {#each $files as file}
            {#key `${file.name}-${file.isPartial}`}
            <File fileHandler={fileHandler} file={file} />
            {/key}
        {/each}

        <div class="uploadMore">
            <button class="uploadBtn" on:click={() => fileInput.click()}>
            + Upload files
            </button>
            {#if $files.length}
            <button class="deleteFiles" on:click={deleteAllFiles}><Delete /></button>
            {/if}
        </div>
    </div>
    <input
        type="file"
        accept=".pkz,.dat,.dtt,.cpk,.csv,.bxm,.seq"
        multiple
        on:change={fileChange}
        bind:this={fileInput}
    />
</aside>

<style>
    aside > header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 50px;
        margin-bottom: 10px;
        gap: 10px;
        border-bottom: 1px solid #ccc;
    }
    header .logo {
        background-color: #0063db;
        color: white;
        padding: 0 10px;
        line-height: 50px;
        font-weight: bold;
        height: 50px;
    }
    aside h1 {
        margin: 0;
        /* small caps */
        font-variant: small-caps;
        font-size: 1.5em;
    }
    .files.empty .uploadMore {
        height: 100%;
        font-size: 20px;
    }
    aside.files {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        position: relative;
        height: 100%;
        width: 420px;
        background-color: var(--sidebar-dark);
    }
    aside input[type="file"] {
        display: none;
    }
    .files.dragover > * {
        pointer-events: none;
    }
    .files.dragover:after {
        content: "Drop files here";
        position: absolute;
        height: 100%;
        width: 100%;
        pointer-events: none;
        font-size: 2rem;
        line-height: 3rem;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 50;
        color: var(--text-light);

        display: flex;
        align-items: center;
        justify-content: center;
    }
    .rootDir {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        flex-grow: 1;
        width: calc(100% - 20px);
        padding: 0 10px;
        overflow-y: auto;
    }
    .rootDir .uploadMore {
        margin-top: 10px;
        width: calc(100% - 20px);
        position: sticky;
        bottom: 0px;
        padding: 10px;
        z-index: 15;

        display: flex;
        gap: 10px;
        align-items: stretch;

        background: linear-gradient(transparent, var(--sidebar-dark));
    }
    .rootDir .deleteFiles {
        background-color: var(--danger);
    }
    .rootDir .uploadBtn {
        flex-grow: 1;
    }
</style>