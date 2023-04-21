<script lang="ts">
    import VirtualList from "@sveltejs/svelte-virtual-list";
    import './Sidebar.css';
    import FormatLetterCase from "svelte-material-icons/FormatLetterCase.svelte";
    import TextBox from "svelte-material-icons/TextBox.svelte";
    import { loadedFile } from "../lib/Main/MainStore";
    import { addToast } from "../lib/Toasts/ToastStore";
    import { get } from "svelte/store";

    console.log($loadedFile.data);

    // svelte-ignore unused-export-let
    export let data;
    // svelte-ignore unused-export-let
    export let ext;
    export let fileHandler;

    let hoveredChar = null;
    let openTab = "chars";
    let wtaFile = null;
    let wtpFile = null;
    let textureContainer;
    let canvas;

    $: {
        if (!wtaFile || !wtpFile || !canvas || wtaFile.name !== $loadedFile.name.replace('.mcd', '.wta') || wtpFile.name !== $loadedFile.name.replace('.mcd', '.wtp')) {
            setupTexture();
        }
    }

    async function setupTexture() {
        let folder = fileHandler.getFolderByFile($loadedFile);
        let newFolder = fileHandler.getFolder(folder.name.replace('.dat', '.dtt'), false);
        
        if (!wtpFile) {
            let wtpName = $loadedFile.name.replace('.wta', '.wtp');
            let results = [...folder.search(wtpName), ...(newFolder?.search(wtpName) || [])];
            if (results.length) {
                wtpFile = results[0];
            } else {
                addToast({
                    type: 'danger',
                    title: `WTP not found`,
                    message: `${$loadedFile.name.replace('.wta', '.wtp')} wasn't found in your loaded directory (did you forget to open a .DTT?).\nWTA files need WTP texture data in order to function.`,
                    timeout: 10000
                })
                return
            }
        }

        if (!wtaFile) {
            let wtaName = $loadedFile.name.replace('.mcd', '.wta');
            let results = [...folder.search(wtaName), ...(newFolder?.search(wtaName) || [])];
            if (results.length) {
                wtaFile = results[0];
            } else {
                addToast({
                    type: 'danger',
                    title: `WTA not found`,
                    message: `${$loadedFile.name.replace('.wta', '.wtp')} wasn't found in your loaded directory (did you forget to open a .DTT?).\nWTA files need WTP texture data in order to function.`,
                    timeout: 10000
                })
                return
            }
        }

        if (wtaFile.textures.length && $loadedFile.data.charGraphs.length) {
            let textureID = $loadedFile.data.charGraphs[0].textureID.toString(16);
            let wtaTexture;
            wtaFile.textures.forEach((texture) => {
                if (texture.identifier === textureID) {
                    wtaTexture = texture;
                }
            })

            if (wtaTexture) {
                if (canvas) canvas.remove();
                
                canvas = wtaTexture.load(await wtpFile.getArrayBuffer());

                textureContainer.appendChild(canvas);
            } else {
                addToast({
                    type: 'danger',
                    title: `Texture not found`,
                    message: `The texture ID ${textureID} wasn't found in the WTA file. This is a bug, please report it.`,
                    timeout: 10000
                })
            }
        }
    }

</script>

<div class="editor MCDEditor">
    <main>
        <div class="texture" bind:this={textureContainer}>
            {#if hoveredChar}
                <div class="uvOverlay" style={`left: ${hoveredChar.u1 * 100}%; top: ${hoveredChar.v1 * 100}%; width: ${(hoveredChar.u2 - hoveredChar.u1) * 100}%; height: ${(hoveredChar.v2 - hoveredChar.v1) * 100}%`} />
            {/if}
            {#if !canvas}
            <img src="texture-unavailable.png" alt="Texture" />
            {/if}
        </div>
    </main>
    <aside>
        <header>
            <h2>{$loadedFile.name}</h2>
            <button class="repack" disabled={true}>Save and Repack (soon)</button>
        </header>
        <div class="tabs">
            <button class="tab" class:active={openTab === "chars"} on:click={() => openTab = "chars"}>
                <FormatLetterCase />
            </button>
            <button class="tab" class:active={openTab === "events"} on:click={() => openTab = "events"}>
                <TextBox />
            </button>
        </div>
        {#if openTab === "chars"}
            <h3>Chars ({$loadedFile.data.chars.length})</h3>
            <VirtualList height="calc(100vh - 90px)" items={$loadedFile.data.charGraphs} let:item>
                <div class="char" on:mouseover={() => hoveredChar = item} on:mouseout={() => hoveredChar = null} >
                    <input class="name" type="text" size="1" maxlength="1" value={$loadedFile.data.chars[$loadedFile.data.charGraphs.indexOf(item)].char} />
                    <div class="charGraph">
                        <div class="charParam dimensions">
                            <span>Set UV dimensions</span>
                            <input class="u1" type="number" min="0" step="0.0000000001" max="1.0000" value={item.u1} />
                            <input class="v1" type="number" min="0" step="0.0000000001" max="1.0000" value={item.v1} />
                            <input class="u2" type="number" min="0" step="0.0000000001" max="1.0000" value={item.u2} />
                            <input class="v2" type="number" min="0" step="0.0000000001" max="1.0000" value={item.v2} />
                        </div>
                        <div class="charParam">
                            <span>Width / Height</span>
                            <input type="number" min="0" step="1" max="4096" value={item.width} />
                            x
                            <input type="number" min="0" step="1" max="4096" value={item.height} />
                        </div>
                    </div>
                </div>
            </VirtualList>
        {/if}
        {#if openTab === "events"}
            <h3>Used Events ({$loadedFile.data.usedEvents.length}/{$loadedFile.data.events.length})</h3>
            <VirtualList height="calc(100vh - 90px)" items={$loadedFile.data.usedEvents} let:item>
                <div class="usedEvent">
                    <div class="name">
                        <input type="text" size="32" maxlength="32" value={item.name} />
                        <span>{item.hash.toString(16)} - {item.event.paragraphs.length} PGS</span>
                    </div>
                    <div class="paragraphs">
                        {#each item.event.paragraphs as paragraph}
                            <div class="paragraph">
                                {#each paragraph.strings as string}
                                    <textarea class="string">{string.text}</textarea>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            </VirtualList>
        {/if}
    </aside>
</div>

<style>
    .MCDEditor aside {
        width: 620px;
    }
    .texture .uvOverlay {
        position: absolute;
        z-index: 2;
        background-color: rgba(255, 0, 0, 0.5);
        animation: glow 2s infinite;
    }
    @keyframes glow {
        0% {
            background-color:rgba(255, 0, 0, 0.5);
        }
        50% {
            background-color:rgba(255, 0, 0, 0.2);
        }
        100% {
            background-color:rgba(255, 0, 0, 0.5);
        }
    }
    .texture img {
        width: 100%;
    }

    .usedEvent, .char {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 10px;
        padding-bottom: 5px;
        border-top: 1px solid #ccc;
        transition: background-color 0.1s;
    }
    .char:hover {
        background-color: #777;
    }
    .char > .charGraph {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px 0;
    }
    .charParam.dimensions {
        position: relative;
        height: 100px;
        width: 100%;
    }
    .charParam.dimensions > span {
        font-size: 0.8em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .charParam.dimensions > input {
        position: absolute;
    }
    .charParam.dimensions .u1 {
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
    }
    .charParam.dimensions .v1 {
        left: 50%;
        top: 0;
        transform: translate(-50%, 0);
    }
    .charParam.dimensions .u2 {
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
    }
    .charParam.dimensions .v2 {
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 0);
    }


    .usedEvent > .name {
        display: flex;
        flex-direction: column;
    }
    input, .char > .name {
        border: none;
        background-color: #555;
        padding: 5px;
        border-radius: 3px;
    }
    .char > .name {
        font-size: 2em;
        width: 2ch;
        text-align: center;
    }
    .usedEvent > .name > span {
        font-size: 0.8em;
        color: #888;
        font-style: italic;
        text-transform: uppercase;
    }
    .usedEvent > .paragraphs {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex-grow: 1;
    }
    .paragraphs .paragraph:not(:last-child) {
        border-bottom: 1px solid #666;
    }
    textarea.string {
        width: 300px;
        background-color: #444;
        border: none;
        border-radius: 2px;
    }
    input:focus-visible, textarea:focus-visible {
        outline: 1px solid #999;
    }
</style>