<script lang="ts">
    import Close from "svelte-material-icons/Close.svelte";
    import ContentSave from "svelte-material-icons/ContentSave.svelte";
    import { loadedComponentIndex, componentTabs } from "../MainStore";

    export let i;
    export let tab;

    let unsaved = tab.unsaved;
    let unchanged = tab.unchanged;

    function removeComponent() {
        if ($unsaved) {
            if (!confirm("This tab has unsaved changes. Are you sure you want to close it?")) {
                return;
            }
        }
        $componentTabs = $componentTabs.filter((_, index) => i !== index);
        if (i >= $loadedComponentIndex) {
            $loadedComponentIndex = Math.max($loadedComponentIndex - 1, 0);
        }
        console.log($componentTabs)
    }
</script>

<div
    class:active={$loadedComponentIndex === i}
    class:unsaved={$unsaved}
    class:unchanged={$unchanged}
    on:click={() => $loadedComponentIndex = i}
>
    {tab.name}
    <button class="saveBtn">
        <ContentSave />
    </button>
    <button class="closeBtn" on:click={removeComponent}>
        <Close />
    </button>
</div>

<style>
    div {
        display: inline-flex;
        background-color: transparent;
        border-radius: 0;
        padding: 5px 10px;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        white-space: nowrap;
        user-select: none;
    }
    .unchanged {
        font-style: italic;
    }
    div button {
        padding: 5px;
        height: 100%;
        background-color: transparent;
        border: none;
        opacity: 0;
        outline: none;
        transition: opacity 0.2s ease-in-out;
    }
    div.unsaved:not(:hover) .closeBtn {
        background-color: #fff;
        border-radius: 100%;
        aspect-ratio: 1;
        height: 14px;
        margin: 0 6px;
    }
    div:hover button, div.unsaved .closeBtn {
        opacity: 1;
    }
    div button:hover {
        background-color: #333;
    }
    div.active {
        background-color: #242424;
    }
</style>