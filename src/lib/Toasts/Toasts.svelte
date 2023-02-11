<script lang="ts">
    import { beforeUpdate, afterUpdate } from "svelte";
    import { slide } from 'svelte/transition';
    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";
    import Close from "svelte-material-icons/Close.svelte";
    import { dismissToast, toasts } from "./ToastStore";

    let toastDiv;
    let autoscroll;
    beforeUpdate(() => {
        autoscroll = toastDiv && (toastDiv.offsetHeight + toastDiv.scrollTop) > (toastDiv.scrollHeight - 20);
    });

    afterUpdate(() => {
        if (autoscroll) {
            let scrollAnimStart = Date.now();
            const scroll = () => {
                toastDiv.scrollTo(0, toastDiv.scrollHeight)
                if (Date.now() - scrollAnimStart < 300) {
                    requestAnimationFrame(scroll);
                }
            };

            requestAnimationFrame(scroll);
        }
    });

</script>

{#if $toasts}
    <div class="toasts" bind:this={toastDiv} style={$toasts.length > 3 ? "pointer-events: all" : ""}>
        <div class="toastsScrollable">
            {#each $toasts as toast (toast.id)}
                <div
                    class="toast"
                    id={toast.id}
                    class:info={toast.type === "info"}
                    class:success={toast.type === "success"}
                    class:warning={toast.type === "warning"}
                    class:danger={toast.type === "danger"}
                    transition:slide|local={{ duration: 200 }}
                >
                    <header>
                        <div class="title">{toast.title}</div>
                        {#if (toast.dismissable)}
                        <button class="dismiss" on:click={() => dismissToast(toast.id)}>
                            <Close />
                        </button>
                        {/if}
                    </header>
                    <div class="message">{toast.message}</div>
                    {#if toast.link}
                    <a href={toast.link.href} target="_blank" rel="noopener noreferrer">{toast.link.text} <OpenInNew /></a>
                    {/if}
                    {#if toast.timeout}
                    <i>Dismissing in {Math.round(toast.timeout / 1000)}s</i>
                    {/if}
                    {#if typeof toast.progress === "number"}
                    <div class="progress"><div class="bar" style="width: {toast.progress * 100}%" /></div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .toasts {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 10px;
        height: calc(100% - 20px);
        overflow-y: auto;
        pointer-events: none;
        z-index: 10;
    }
    .toastsScrollable {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        min-height: 100%;
    }
    .toast {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: 300px;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        background-color: #454545;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        border-left: 5px solid #ccc;
        white-space: pre-line;
        pointer-events: all;
        position: relative;
    }
    .toast .message {
        overflow-wrap: break-word;
        width: 100%;
    }
    .toast .progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        appearance: none;
        border: none;
        border-radius: 0 0 5px 0;
        background-color: #333;
        overflow: hidden;
        height: 5px;
        margin: 0;
    }
    .toast .progress .bar {
        background-color: #ccc;
        height: 100%;
        max-width: 100%;
        transition: width 0.2s ease-in-out;
    }
    .toast header {
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .toast header button {
        height: 2rem;
        display: flex;
        align-items: center;
        padding: 0 5px;
    }
    .toast header .title {
        flex-grow: 1;
        font-size: 1.25rem;
        font-weight: bold;
        overflow-wrap: break-word;
    }
    .toast a {
        background-color: #222;
        padding: 5px 10px;
        border-radius: 5px;
        color: #ccc;
        transition: background-color 0.2s;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }
    .toast a:hover {
        background-color: #333;
    }
    .toast.success {
        border-left-color: var(--success);
    }
    .toast.danger {
        border-left-color: var(--danger);
    }
    .toast.warning {
        border-left-color: var(--warning);
    }
</style>