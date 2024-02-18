<script lang="ts">
    import Unloaded from "./Unloaded.svelte";
    import { componentTabs } from "./MainStore";
    import MainTab from "./components/MainTab.svelte";
    import MainBody from "./components/MainBody.svelte";

    export let fileHandler;

    // since you can't scroll horizontally with the mouse wheel by default
    function handleTabsScroll(e) {
        e.currentTarget.scrollLeft += e.deltaY;
    }
</script>
<div class="mainApp">
    <header class="tabs" on:wheel={handleTabsScroll}>
        {#each $componentTabs as tab, i}
            {#key tab.name}
            <MainTab i={i} tab={tab} />
            {/key}
        {/each}
    </header>
    {#if $componentTabs.length}
        {#each $componentTabs as tab, i}
            {#key tab.name}
            <MainBody i={i} tab={tab} fileHandler={fileHandler} />
            {/key}
        {/each}
    {:else}
        <main>
            <Unloaded />
        </main>
    {/if}
</div>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        overflow: hidden;
    }
    .mainApp {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }
    .tabs {
        display: flex;
        align-items: stretch;
        background-color: #111;
        justify-content: flex-start;
        height: 40px;
        width: calc(100vw - 300px); /* hack so that the scrollbar will appear */
        overflow-y: auto;
    }
    .tabs::-webkit-scrollbar-thumb {
        background-color: #444;
    }
    .tabs::-webkit-scrollbar {
        height: 3px;
    }
</style>