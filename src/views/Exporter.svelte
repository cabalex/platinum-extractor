<script lang="ts">
    import AlertBox from "svelte-material-icons/AlertBox.svelte";
    import { DAT, defineFile } from "@cabalex/platinum-extract";
    import ExportType from "../assets/ExportType.svelte";
    import { addToast, dismissToast, updateToast } from "../lib/Toasts/ToastStore";
    import { loadedFile } from "../lib/Main/MainStore";
    import { asyncForEach, downloadArrayBuffer } from "../FileHandler";

    export let ext;
    // svelte-ignore unused-export-let
    export let data;

    $: files = $loadedFile.files;

    let game = localStorage.getItem('pe-game') || 'astral-chain';

    function errorExporting(e) {
        addToast({
            title: `An error occurred while exporting ${$loadedFile.name}`,
            message: e.message,
            type: "danger",
            timeout: 30000
        })
    }

    async function exportDAT(isDAT = true) {
        for (let i = 0; i < $files.length; i++) {
            if ($files[i].files) {
                return addToast({
                    title: "Can't export DAT",
                    message: `This folder contains a subfolder (${$files[i].name}) that hasn't been repacked. Please repack it, reupload it to this folder, and delete the old file.\n(This limitation will be fixed in the future)`,
                    type: "danger",
                    timeout: 10000
                })
            }
        }


        let toastId = addToast({
            title: "Exporting DAT...",
            message: `Packing ${$files.length} files...`,
            type: "info",
            dismissable: false,
            progress: 0
        })
        let packedFiles = [];

        await asyncForEach($files,
            async (file) => packedFiles.push({name: file.name, arrayBuffer: await file.getArrayBuffer().catch(errorExporting)}),
            (i, progress) => updateToast(toastId, {
                title: "Exporting DAT...",
                message: `Packing ${i+1}/${$files.length} files...\nDownloading ${$files[i].name}`,
                progress
            })
        )

        updateToast(toastId, {
            title: "Exporting DAT...",
            message: `Packing DAT contents...`
        })
        let arrayBuffer = await DAT.repack(packedFiles, isDAT ? "DAT" : "DTT", game).catch(errorExporting);

        if (!arrayBuffer) {
            dismissToast(toastId);
            return;
        };

        let name = $loadedFile.name.split('.')[0];
        if (defineFile($loadedFile.name) === 'folder/dat') {
            if (isDAT) {
                name = $loadedFile.name;
            } else {
                name += ".dtt";
            }
        } else {
            name += isDAT ? ".dat" : ".dtt";
        }

        downloadArrayBuffer(arrayBuffer, name);

        dismissToast(toastId);
        addToast({
            title: "Exported DAT successfully!",
            message: `Check your hard drive for ${name}.`,
            type: "success",
            timeout: 10000
        })
    }
</script>

<div class="exporter">
    <h2>Export folder {$loadedFile.name} to
        <select bind:value={game} on:change={(e) => localStorage.setItem('pe-game', e.target.value)}>
            <option value="anarchy-reigns" disabled>(not soon) Anarchy Reigns</option>
            <option value="astral-chain">Astral Chain</option>
            <option value="bayo-1-be" disabled>(soon) Bayonetta 1 (PC / Wii U)</option>
            <option value="bayo-2-be" disabled>(soon) Bayonetta 2 (Wii U)</option>
            <option value="bayo-2-le" disabled>(soon) Bayonetta 2 (Switch)</option>
            <option value="bayo-3" disabled>(soon) Bayonetta 3</option>
            <option value="nier-replicant" disabled>(soon) NieR: Replicant</option>
            <option value="nier-automata">NieR: Automata</option>
            <option value="nier-automata-switch" disabled>(soon) NieR: Automata (Switch)</option>
            <option value="mgr">Metal Gear Rising: Revengence</option>
            <option value="star-fox-zero" disabled>(not soon) Star Fox Zero</option>
            <option value="star-fox-guard" disabled>(not soon) Star Fox Guard</option>
            <option value="transformers" disabled>(not soon) Transformers: Devastation</option>
            <option value="vanquish" disabled>(not soon) Vanquish</option>
            <option value="wonderful-101" disabled>(not soon) The Wonderful 101</option>
            <option value="wonderful-101-switch" disabled>(not soon) The Wonderful 101 (Remastered)</option>
        </select>
        <p style="font-size: 12px; margin: 0">Game not supported? See if choosing another game works, or open an issue on GitHub! (include some example files.)</p>
    </h2>
    <main>
        {#if ext === ""}
        <div class="warning">
            <AlertBox width="32px" height="32px" />
            <span>This folder doesn't have an extension. You can still export it, but it <i>probably</i> wasn't intended for this purpose.<br>We currently don't support repacking to a single file with directories (CPK, Bayonetta 3 PKZ, etc...) right now.</span>
        </div>
        {/if}
        <h3>Export options</h3>
        <ExportType
            fileExt={ext.toLowerCase() === 'dtt' ? '' : ext}
            ext="DAT"
            download={exportDAT.bind(null, true)}
            description={"Platinum Games' signature folder format, used in most games. Uncompressed."}
        />
        <p><b>Deep waters ahead!</b> Though similar, formats beyond DAT can vary between games (and many cases haven't been tested). Export at your own risk!</p>
        {#if game == "astral-chain"}
            <ExportType
                fileExt={ext.toLowerCase() === 'dtt' ? 'DTT' : ''}
                ext="DTT"
                download={exportDAT.bind(null, false)}
                description={"(COMING SOON) DAT File format, but optimized for large data segments (models, texture data, etc). DTT files are always paired with DAT files."}
            />
            <ExportType
                fileExt={ext}
                ext="PKZ"
                download={() => {}}
                description={"(COMING SOON) Astral Chain's compressed file format, compressed with ZStandard."}
            />
        {:else if game == "nier-automata" || game == "mgr"}
            <ExportType
                fileExt={ext}
                ext="CPK"
                link={{href: "https://github.com/esperknight/CriPakTools", text: "Download CriPakTools"}}
                description={"Repacking CPKs isn't necessary for most games, and is sort of a pain, but if you must, you'll have to use a different tool such as CriPakTools."}
            />
        {/if}
    </main>
</div>

<style>
    .exporter {
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
    }
    .exporter h2 {
        width: calc(100% - 20px);
        border-bottom: 1px solid #ccc;
        padding: 10px;
        margin: 0;
    }
    .exporter main {
        width: calc(100% - 20px);
        flex-grow: 1;
        margin: 0 10px;
        overflow-y: auto;
    }
    .exporter select {
        font-size: unset;
    }

    .warning {
        gap: 10px;
        background-color: var(--danger);
        margin: 10px 0;
        padding: 10px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        border-radius: 5px;
    }
</style>