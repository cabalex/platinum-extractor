<script lang="ts">
    import JSZip from "jszip";
    import type FileHandler from "src/FileHandler";
    import { asyncForEach, downloadArrayBuffer, readableBytes } from "../../FileHandler";
    import Download from "svelte-material-icons/Download.svelte";
    import Upload from "svelte-material-icons/Upload.svelte";
    import PackageDown from "svelte-material-icons/PackageDown.svelte";
    import ExpandAll from "svelte-material-icons/ExpandAll.svelte";
    import Delete from "svelte-material-icons/Delete.svelte";
    import { addToast, dismissToast, updateToast } from "../Toasts/ToastStore";
    import { loadedFile } from "../Main/MainStore";
    import { defineFile } from "@cabalex/platinum-extract";

    export let file;
    let { files } = file;
    export let fileHandler: FileHandler;
    export let isHovering;

    async function downloadFile() {
        if ($files && typeof $files.length === "number") {
            // folder
            let toastID = addToast({
                type: "info",
                title: `Download Folder`,
                message: `Zipping ${$files.length} files...`,
                progress: 0,
                dismissable: false
            });

            let zip = new JSZip();

            await asyncForEach($files,
                async (file) => zip.file(file.name, await file.getArrayBuffer()),
                (i, progress) => updateToast(toastID, {
                    type: "info",
                    title: `Download Folder`,
                    message: `Zipping ${i+1}/${$files.length} files...\nDownloading ${$files[i].name}`,
                    progress
                })
            );

            updateToast(toastID, {
                type: "info",
                title: `Download Folder`,
                message: `Zipping ${$files.length} files...`
            })

            let name = file.name + ".zip";
            downloadArrayBuffer(await zip.generateAsync({type: "arraybuffer"}), name);
            
            dismissToast(toastID);
            addToast({
                title: "Zipped successfully!",
                message: `Check your hard drive for ${name}.`,
                type: "success",
                timeout: 10000
            })
        } else {
            // file
            addToast({
                type: "info",
                title: `Download File`,
                message: `Downloading ${file.name} (${readableBytes(file.size)})`,
                timeout: 5000
            });

            downloadArrayBuffer(file.isPartial ? await file.read() : await file.getArrayBuffer(), file.name);
        }
    }

    async function uploadFile() {
        let input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = async (e) => {
            let files = []
            if (e.target.files === 0) return;

            let toastID = addToast({
                type: "info",
                title: `Importing ${e.target.files.length} files...`,
                message: `Importing ${e.target.files.length} files...`,
                progress: 0,
                dismissable: false
            });

            asyncForEach(e.target.files,
                async (f) => file.addFiles({
                    name: f.name,
                    modified: true,
                    size: f.size,
                    isPartial: true,
                    read: () => f.arrayBuffer(),
                    getArrayBuffer: () => f.arrayBuffer()
                }),
                (i, progress) => updateToast(toastID, {
                    type: "info",
                    title: `Importing ${e.target.files.length} files...`,
                    message: `Importing ${i+1}/${e.target.files.length} files...\nImporting ${e.target.files[i].name}`,
                    progress
                })
            );

            dismissToast(toastID);
            addToast({
                title: "Import finished",
                message: `Imported ${files.length} files successfully.`,
                type: "success",
                timeout: 10000
            })
        }
        input.click();
    }

    async function expandAll() {
        let partials = $files.filter(file => file.isPartial);

        if (partials.length === 0) {
            return addToast({
                type: "danger",
                title: "Can't bulk extract",
                message: "This folder has no partial files in it.",
                progress: 0,
                timeout: 10000
            });
        }

        if (partials.length > 10 && !confirm("Are you sure you want to load all files in this directory? WARNING: It will take a while, and may crash this tab depending on the file count.")) return;
        let successes = 0;

        let toastID = addToast({
            type: "info",
            title: `Extracting ${partials.length} files...`,
            message: `Extracting ${partials.length} partial files...`,
            progress: 0,
            dismissable: false
        });

        await asyncForEach(
            partials,
            async (file) => {
                let arrayBuffer = await file.read().catch((e) => {
                    addToast({
                        type: 'danger',
                        title: `Error extracting ${file.name}`,
                        message: e.message,
                        timeout: 10000
                    })
                })
                if (defineFile(file.name) === 'folder/dat') {
                    await fileHandler.import([{name: file.name, file: arrayBuffer, size: arrayBuffer.byteLength}], {print: false, replace: file});
                    successes++;
                } else {
                    let extracted = await fileHandler.import([{name: file.name, file: arrayBuffer, size: arrayBuffer.byteLength}], {print: false, returnInstance: true});
                    if (extracted) {
                        fileHandler.replaceFile(file, extracted);
                        loadedFile.set(extracted);
                        successes++;
                    }
                }
            },
            (i, progress) => updateToast(toastID, {
                type: "info",
                title: `Extracting ${partials.length} files...`,
                message: `Extracting ${i+1}/${partials.length} partial files... (${successes} success, ${(i+1) - successes} fail)\nExtracting ${partials[i].name}`,
                progress,
                dismissable: false
            })
        )

        dismissToast(toastID);
        addToast({
            title: "Bulk extraction finished",
            message: `Extracted ${successes}/${partials.length} files successfully.`,
            type: "success",
            timeout: 10000
        })
    }

    async function removeFile() {
        // If the file or a file within this folder is loaded, unload it
        if (file === $loadedFile || (files && typeof $files.length === "number" && file.includes($loadedFile))) {
            loadedFile.set(null);
        }
        fileHandler.replaceFile(file);
    }

</script>

{#if isHovering}
<div class="quickActions" on:click={(e) => e.stopPropagation()}>
    {#if typeof file.size === "number"}
    <span>{file.modified ? 'Modified.' : readableBytes(file.size)}</span>
    {/if}
    {#if (files && typeof $files.length === "number")}
    <span>{$files.length} files</span>
    <div title="Export to archive formats." on:click={() => $loadedFile = file}><PackageDown /></div>
    <div title="Download folder as ZIP." on:click={downloadFile}><Download /></div>
    <div title="Expand all partial files (warning: slow!)." on:click={expandAll}><ExpandAll /></div>
    <div title="Upload a file to this folder." on:click={uploadFile}><Upload /></div>
    {:else}
    <div title="Download file." on:click={downloadFile}><Download /></div>
    {/if}
    <div class="danger" title="Remove this file from the explorer." on:click={removeFile}><Delete /></div>
</div>
{/if}

{#if typeof file.size === "number"}
<span class="fileSize">{file.modified ? 'MODDED' : readableBytes(file.size)}</span>
{/if}
{#if ($files && typeof $files.length === "number")}
<span class="fileSize">{$files.length} files</span>
{/if}

<style>
    .fileSize {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 5px;

        position: absolute;
        top: -5px;
        right: 5px;
        color: #777;
        font-family: monospace;
    }
    .quickActions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 5px;
        z-index: 10;

        position: absolute;
        top: -5px;
        right: 5px;
        background-color: var(--sidebar-light);
        border: 2px solid #aaa;
        border-radius: 5px;

        font-size: 24px;
    }
    .quickActions > span {
        font-size: 16px;
    }
    .quickActions > div:hover {
        color: #777;
    }
    .quickActions > * {
        line-height: 0;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .danger {
        color: #ed4245;
    }
</style>