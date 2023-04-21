<script lang="ts">
    import Delete from "svelte-material-icons/Delete.svelte";

    export let onClick;
</script>

<button class="delete-btn" on:click={onClick}>
    <Delete />
</button>

<style>
    .delete-btn {
        background-color: var(--danger);
        outline: none;
    }
    .delete-btn:hover, .delete-btn:focus-visible {
        border-color: black;
    }
</style>