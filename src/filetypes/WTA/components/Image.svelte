<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import type { WTATexture } from "../extract";

    export let texture: WTATexture;
    export let wtpFile: ArrayBuffer;

    let canvasElem;

    let syncWorker: Worker|undefined = undefined;

    async function loadWorker() {
        const offscreen = canvasElem.transferControlToOffscreen();
        const SyncWorker = await import('../scripts/CanvasWorker?worker');
        syncWorker = new SyncWorker.default();
        syncWorker.postMessage({ canvas: offscreen, texture, wtpFile }, [offscreen, wtpFile])
    }

    async function destroyWorker() {
        if (syncWorker) {
            syncWorker.terminate();
        }
    }

    onMount(loadWorker);
    onDestroy(destroyWorker);

</script>

<div class="canvasContainer">
    <canvas bind:this={canvasElem} width={texture.width} height={texture.height} />
</div>

<style>
    .canvasContainer {
        flex-grow: 1;
        position: relative;
        background-color: #111;
    }
    :global(.canvasContainer > *) {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>