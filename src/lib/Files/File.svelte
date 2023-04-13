<script lang="ts">
    import { afterUpdate } from 'svelte';
    import { slide } from "svelte/transition";
    import OpenInNew from 'svelte-material-icons/OpenInNew.svelte';
    import './File.css';
    import { readableBytes } from "../../FileHandler";
    import { loadedFile, searchedFile, settings } from "../Main/MainStore";
    import { addToast } from "../Toasts/ToastStore";
    import FileQuickActions from "./FileQuickActions.svelte";
    import { defineFile } from "@cabalex/platinum-extract";

    export let file;
    export let fileHandler;
    let elem = null;
    
    let active = false;
    let { files } = file;
    let showContents = files && $files.length < 100;
    $: {
        // only show contents if the file is the searched file
        // do not toggle showContents off when the searched file is changed
        if (!showContents && files && $searchedFile && file.includes($searchedFile)) {
            showContents = true;
        }
    }

    if (files && $files.length >= 100 && !$settings.seenLargeFilesWarning) {
        addToast({
            type: 'warning',
            title: 'Large folder detected!',
            message: 'Folders larger than 100 files will not be opened by default. You can expand them to view their contents.\n(This won\'t be shown again for this session.)',
            timeout: 30000
        })
        $settings.seenLargeFilesWarning = true;
    }

    afterUpdate(() => {
        if ($searchedFile === file) {
            console.log("scrolling into view")
            elem.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }
    })

    async function open() {
        // reset searched file
        searchedFile.set(null);

        if ($files && typeof $files.length === "number") {
            // If folder
            showContents = !showContents;
        } else if (file.isPartial) {
            // If partial file (i.e. loaded from PKZ, CPK, etc) load it
            let arrayBuffer = await file.read().catch((e) => {
                addToast({
                    type: 'danger',
                    title: `Error extracting ${file.name}`,
                    message: e.message,
                    timeout: 10000
                })
            })
            if (defineFile(file.name) === 'folder/dat') {
                addToast({
                    type: 'success',
                    title: `Decompressed partial file`,
                    message: `Decompressed partial file ${file.name}. (${readableBytes(file.compressedSize)} -> ${readableBytes(arrayBuffer.byteLength)})\nEncoding: ${file.compressionType}`,
                    timeout: 10000
                })
                await fileHandler.import([{name: file.name, file: arrayBuffer, size: arrayBuffer.byteLength}], {print: false, replace: file});
            } else {
                let extracted = await fileHandler.import([{name: file.name, file: arrayBuffer, size: arrayBuffer.byteLength}], {print: false, returnInstance: true});
                if (extracted) {
                    fileHandler.replaceFile(file, extracted);
                    loadedFile.set(extracted);
                } else {
                    addToast({
                        type: 'danger',
                        title: `Error extracting ${file.name}`,
                        message: `🤔 It looks like I don't support that file type (${defineFile(file.name)}) yet. Check back later or request support!`,
                        link: {
                            text: 'Request support',
                            href: `https://github.com/cabalex/platinum-extractor/issues/new?title=${encodeURIComponent(`Feature: Add .${file.name.split(".").pop().toUpperCase()} (${defineFile(file.name)}) support`)}&body=${encodeURIComponent(`**Beep boop! Generated on ${new Date().toUTCString()}**\n\n---\n\n**Explain why you want this type added, which game(s) you expect it to work for, and how you think it should be implemented. Add links to sample files where possible!**`)}`,
                        },
                        timeout: 10000
                    })
                }
            }
        } else {
            // load the file normally
            loadedFile.set(file);
            active = true;

            // subscribe for updates if the file is modified
            let unsubscribe = loadedFile.subscribe((loaded) => {
                if (file !== loaded) {
                    unsubscribe();
                    active = false;
                } else {
                    file = loaded;
                }
            })
        }
    }

    let isHovering = false;
</script>

<div
    class={"file " + defineFile(file.name).replace("/", " ")}
    title={file.name}
    bind:this={elem}
    class:modified={file.modified}
    class:open={files && $files.length && showContents}
    class:active={$loadedFile == file || active || $searchedFile == file || ($loadedFile === file.root)}
    class:folder={$files && typeof $files.length === "number"}
>
    <div
        class="filename"
        style={`background-color: ${isHovering ? 'var(--sidebar-light)' : 'transparent'}`}
        on:click={open}
        on:mouseenter={() => isHovering = true}
        on:mouseleave={() => isHovering = false}
    >
        {file.name}
        <FileQuickActions isHovering={isHovering} file={file} fileHandler={fileHandler} />
    </div>
    {#if ($files && $files.length && showContents)}
    <div class="contents" transition:slide|local={{ duration: 200 }} >
        {#if file.root && file.root.visualizer}
        <button class="visualizerBtn" title={file.root.visualizer.actionTitle}>
            {file.root.visualizer.actionText}
            <OpenInNew />
        </button>
        {/if}
        {#each $files as subfile}
        {#key `${subfile.name}-${subfile.isPartial}`}
        <svelte:self fileHandler={fileHandler} file={subfile} />
        {/key}
        {/each}
    </div>
    {/if}
</div>