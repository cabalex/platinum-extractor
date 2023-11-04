<script lang="ts">
    import { componentTabs, loadedComponentIndex } from "../Main/MainStore";
    import { PlatinumFile } from "../../lib/FileHandler";
    import type FileHandler from "../../lib/FileHandler";
    import { get } from "svelte/store";

    export let fileHandler: FileHandler;
    export let tree = {};
    export let root = false;
    export let directoryName = "root";

    let directoryOpen = true;

    let files = fileHandler.files;

    // Build a tree of files from an array of paths. (root only)
    function buildTree(files: Array<PlatinumFile>) {
        let tree = {};

        for (let file of files) {
            let path = file.name.split("/");

            let current = tree;

            for (let i = 0; i < path.length; i++) {
                let part = path[i];

                if (i === path.length - 1) {
                    current[part] = file;
                } else {
                    if (!current[part]) current[part] = {};
                    current = current[part];
                }
            }
        }

        matchVisualizers(tree, "root");

        return tree;
    }

    // Recurse to find applicable visualizers
    function matchVisualizers(files: { [key: string]: PlatinumFile|{}|[] }, folderName: string) {
        let fileNames = [];
        for (let fileName in files) {
            if (files[fileName] instanceof PlatinumFile) {
                fileNames.push(fileName)
            } else if (!(files[fileName] instanceof Array)) {
                // @ts-ignore folder, recurse
                matchVisualizers(files[fileName], fileName);
            }
        }

        let matched = false;
        for (let visualizer in fileHandler.visualizers) {
            let info = fileHandler.visualizers[visualizer].visualizerInfo;

            if (!folderName.match(info.match)) continue;

            for (let fileMatcher of info.folderMatch) {
                if (fileMatcher.startsWith("?")) {
                    fileMatcher = fileMatcher.slice(1);
                    for (let i = 0; i < fileNames.length; i++) {
                        if (fileNames[i].match(fileMatcher)) {
                            // @ts-ignore
                            fileNames.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    matched = false;
                    for (let i = 0; i < fileNames.length; i++) {
                        if (fileNames[i].match(fileMatcher)) {
                            // @ts-ignore
                            fileNames.splice(i, 1);
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) break;
                }
            }

            if (!matched) continue;

            if (fileNames.length === 0) {
                // Complete match (no files unaccounted for)
                console.log("woo");
                if (files._visualizers) {
                    (files._visualizers as Array<any>).push(fileHandler.visualizers[visualizer]);
                } else {
                    files._visualizers = [fileHandler.visualizers[visualizer]];
                }
            }
        }

    }

    function openFile(file: PlatinumFile) {
        if (file.unknown) {    
            if (get(file.data).target.byteLength === 0) {
                alert("This file is empty. It cannot be opened.");
            } else {
                if (confirm("This file currently isn't recognized by this app. Would you like to download it?")) {
                    let blob = new Blob([get(file.data).target], { type: "application/octet-stream" });
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url;
                    a.download = file.name;
                    a.click();
                    
                    URL.revokeObjectURL(url);
                }
            }
        } else if (file.isPartial) {
            file.extract();
        } else {
            fileHandler.openFile(file);
        }
    }

    function visualizeFolder(visualizer: any, tree: any[]) {
        let files = {};
        for (let fileName in tree) {
            if (tree[fileName] instanceof PlatinumFile) {
                files[fileName] = tree[fileName];
            }
        }
        fileHandler.visualizeFolder(visualizer, files, directoryName);        
    }

    $: {
        if (root) {
            tree = buildTree($files);
        }
    }
</script>

{#if root}
<div class="contents" style="margin-left: 0; width: 100%">
    {#each Object.keys(tree).sort() as fileName}
        {#if tree[fileName] instanceof PlatinumFile}
            <div class="fileName" on:click={() => openFile(tree[fileName])}>
                <span class="icon">
                    {#if tree[fileName].unknown}
                    <img alt="file" src={`https://img.icons8.com/color/20/000000/delete-file.png`} />
                    {:else}
                    <img alt="file" src={`https://img.icons8.com/color/20/000000/${tree[fileName].icon}.png`} />
                    {/if}
                </span>
                <span>{fileName}</span>
            </div>
        {:else if !(tree[fileName] instanceof Array)}
            <svelte:self fileHandler={fileHandler} tree={tree[fileName]} directoryName={fileName} />
        {/if}
    {/each}
</div>
{:else}
<div class="directory" class:open={directoryOpen}>
    <div class="fileName" on:click={() => directoryOpen = !directoryOpen}>
        <span class="icon">
            {#if directoryOpen}
                <img alt="open" src="https://img.icons8.com/color/20/000000/opened-folder.png" />
            {:else}
                <img alt="closed" src="https://img.icons8.com/color/20/000000/folder-invoices--v1.png" />
            {/if}
        </span>
        <span>{directoryName}</span>
    </div>
    {#if directoryOpen}
    <div class="contents">
        {#if tree["_visualizers"]}
            {#each tree["_visualizers"] as visualizer}    
                <button class="visualizerBtn" on:click={visualizeFolder.bind(null, visualizer, tree)}>
                    {visualizer.visualizerInfo.buttonText}
                </button>
            {/each}
        {/if}
        {#each Object.keys(tree).sort() as fileName}
            {#if tree[fileName] instanceof PlatinumFile}
                <div
                    class="fileName"
                    class:active={$componentTabs[$loadedComponentIndex]?.file === tree[fileName]}
                    class:empty={tree[fileName].unknown && get(tree[fileName].data).target.byteLength === 0}
                    on:click={() => openFile(tree[fileName])}
                >
                    <span class="icon">
                        {#if tree[fileName].unknown}
                        <img alt="file" src={`https://img.icons8.com/color/20/000000/delete-file.png`} />
                        {:else}
                        <img alt="file" src={`https://img.icons8.com/color/20/000000/${tree[fileName].icon}.png`} />
                        {/if}
                    </span>
                    <span>{fileName}</span>
                </div>
            {:else if !(tree[fileName] instanceof Array)}
                <svelte:self fileHandler={fileHandler} tree={tree[fileName]} directoryName={fileName} />
            {/if}
        {/each}
    </div>
    {/if}
</div>
{/if}

<style>
    .directory {
        cursor: pointer;
        user-select: none;
    }

    .icon {
        line-height: 0;
    }

    .directory > .fileName {
        position: sticky;
        top: 0;
        background-color: var(--sidebar-dark);
    }

    .contents {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .fileName {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 1px;
        user-select: none;
        cursor: pointer;
    }
    .fileName:hover {
        background-color: var(--sidebar-light);
    }

    .visualizerBtn {
        margin: 10px;
        margin-left: 0;
        align-self: flex-start;
    }

    .directory > .contents {
        margin-left: 24px;
    }
    .directory.open .fileName {
        padding-top: 4px;
    }
    .active {
        background: linear-gradient(to right, var(--sidebar-dark), #555) !important;
    }
    .empty {
        opacity: 0.5;
    }
    .empty:after {
        content: "(empty)";
        font-style: italic;
    }
</style>