<script lang="ts">
    import './Sidebar.css';
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import Image from 'svelte-material-icons/Image.svelte';
    import ImageMultiple from 'svelte-material-icons/ImageMultiple.svelte';
    import Download from 'svelte-material-icons/Download.svelte';
    import { loadedFile } from '../lib/Main/MainStore';
    import { addToast } from '../lib/Toasts/ToastStore';
    import Loading from '../assets/Loading.svelte';

    let openTab = 'textures';

    export let fileHandler;
    export let ext;
    let textureContainer;
    let wtpFile = null;
    let isLoading = true;
    let loaded = $loadedFile.textures.length ? $loadedFile.textures[0] : null;
    let canvas = null;

    $: {
        let folder = fileHandler.getFolderByFile($loadedFile);
        let newFolder = fileHandler.getFolder(folder.name.replace('.dat', '.dtt'), false);
        let wtpName = $loadedFile.name.replace('.wta', '.wtp');
        let results = [...folder.search(wtpName, true, true), ...(newFolder?.search(wtpName, true, true) || [])];
        if (results.length) {
            wtpFile = results[0]

            if ($loadedFile.textures.length && !$loadedFile.textures.includes(loaded)) {
                loaded = $loadedFile.textures[0];
                loadTexture(loaded);
            } else if (loaded && !canvas) {
                loadTexture(loaded);
            }
        } else {
            addToast({
                type: 'danger',
                title: `WTP not found`,
                message: `${$loadedFile.name.replace('.wta', '.wtp')} wasn't found in your loaded directory (did you forget to open a .DTT?).\nWTA files need WTP texture data in order to function.`,
                timeout: 10000
            })
        }
    }

    async function loadTexture(texture: any) {
        if (canvas) {
            canvas.remove();
        }

        if (wtpFile === null) {
            return;
        }

        loaded = texture;
        isLoading = true;

        // Ensure the loading icon appears before we block the page
        setTimeout(async () => {
            canvas = texture.load(await wtpFile.getArrayBuffer());

            textureContainer.appendChild(canvas);

            isLoading = false;
        }, 0)
        
    }

    async function downloadTexture(texture: any) {
        if (wtpFile === null) {
            return;
        }
        
        let arrayBuffer = texture.download(await wtpFile.getArrayBuffer());

        // download file
        let blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
        let url = URL.createObjectURL(blob);
        
        let link = document.createElement("a");
        let ext = texture._format.includes("ASTC") ? "astc" : "dds";
        link.setAttribute('download', `${texture.identifier}.${ext}`);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }
</script>

<div class="editor wtaViewer">
    <main>
        <div class="texture" bind:this={textureContainer} style={`aspect-ratio: ${loaded.width} / ${loaded.height}`}>
            {#if !canvas}
            <img src="texture-unavailable.png" alt="Texture" />
            {/if}
        </div>
    </main>
    <aside>
        <header>
            <h2>{$loadedFile.name}</h2>
            <button class="repack" disabled={true}>View only</button>
        </header>
        <div class="tabs">
            <button class="tab" class:active={openTab === "textures"} on:click={() => openTab = "textures"}>
                <ImageMultiple />
            </button>
        </div>
        {#if openTab === "textures"}
            <h3>Textures ({$loadedFile.textures.length})</h3>
            <VirtualList height="calc(100vh - 90px)" items={$loadedFile.textures} let:item={item}>
                <button class="textureItem" class:active={loaded === item} on:click={() => loadTexture(item)}>
                    {#if loaded === item && isLoading}
                    <Loading />
                    {:else}
                    <Image />
                    {/if}
                    <div class="info">
                        <h4 class="name">{item.identifier}</h4>
                        <span class="format">{item.width}x{item.height} - {item._format || `⚠ ??? (0x${item.format.toString(16)})`}</span>
                    </div>
                    <button on:click={(e) => { downloadTexture(item); e.stopPropagation() }}>
                        <Download />
                    </button>
                </button>
            </VirtualList>
        {/if}
    </aside>
</div>

<style>
    .wtaViewer aside {
        width: 400px;
    }
    .textureItem {
        margin: 5px;
        width: calc(100% - 10px);
        outline: none;
    }
    .textureItem.active {
        background-color: #777;
    }
    .textureItem .info {
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }
    .textureItem .info h4 {
        margin: 0;
        font-family: 'Consolas', monospace;
    }
    .textureItem .info .format {
        font-size: 0.9em;
        color: #aaa;
    }
    .textureItem span {
        flex-grow: 1;
    }
</style>