<script lang="ts">
    import { loadedFile } from "../lib/Main/MainStore";
    import Pencil from "svelte-material-icons/Pencil.svelte";
    import DatabaseEye from "svelte-material-icons/DatabaseEye.svelte";
    import Beta from "../assets/Beta.svelte";
    import TextEditor from "./TextEditor.svelte";
    
    // svelte-ignore unused-export-let
    export let data;
    export let ext;

    let widths = [];
    let viewingCSV = true;
    let table;
    let customColors = new Map();
    let textEditorRepack;

    function toLetters(num) {
        let mod = num % 26,
            pow = num / 26 | 0,
            out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
        return pow ? toLetters(pow) + out : out;
    }

    
    $: {
        let data = $loadedFile.data;
        widths = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (!widths[j]) widths[j] = 0;
                if (data[i][j].length > widths[j]) widths[j] = data[i][j].length;
            }
        }

        // parse colors -- wonderfully overengineered!
        let colors = new Map();
        if ($loadedFile.name.includes("Color")) {
            // colors start on second column
            for (let i = 0; i < data.length; i++) {
                let offset = false;
                for (let j = 1; j < data[i].length; j += 3) {
                    if (data[i][j].length && data[i][j+1].length && data[i][j+2].length &&
                        !isNaN(Number(data[i][j])) && !isNaN(Number(data[i][j+1])) && !isNaN(Number(data[i][j+2]))) {
                        let rgb = `background-color: rgb(${data[i][j]}, ${data[i][j+1]}, ${data[i][j+2]}); color: ${data[i][j] > 200 || data[i][j+1] > 200 || data[i][j+2] > 200 ? 'black' : 'white'}`;
                        colors.set(`${i}-${j}`, rgb);
                        colors.set(`${i}-${j+1}`, rgb);
                        colors.set(`${i}-${j+2}`, rgb);
                    } else if (
                        !offset &&
                        !isNaN(Number(data[i][j])) && !isNaN(Number(data[i][j+1]))
                    ) {
                        // For some color sets, the first column is used for color instead of index
                        j = -3;
                        offset = true;
                        continue;
                    }
                }
            }
        }
        customColors = colors;
    }

    function repack() {
        if (viewingCSV) {
            // parse table
            let data = [];
            let rows = [...table.getElementsByClassName('contentRow')];
            rows.forEach((row, i) => {
                let cells = [...row.getElementsByClassName('contentCell')];
                data[i] = cells.map(cell => cell.innerText);
            });
            if (data.map(row => row.join(",")).join("\r\n") == $loadedFile.toString()) return;

            $loadedFile.data = data;
            loadedFile.update(value => { value.modified = true; return value });
        } else {
            textEditorRepack();
        }
    }

    function toggleEditor() {
        // save first
        repack();

        viewingCSV = !viewingCSV;
    }
</script>

<header>
    <Pencil width="32px" height="32px" />
    <span><b>CSV Editor</b> - Editing {$loadedFile.name} <Beta /></span>
    <button class="repack" on:click={repack}>Save and Repack</button>
    <button class="repack" on:click={toggleEditor}><DatabaseEye /> Toggle View</button>
</header>
{#if viewingCSV}
<main class="csvEditor">
    <table bind:this={table}>
    <tr class="row headerRow">
        <th></th>
        {#each widths as cell, j}
            <th class="cell" style={`width: ${widths[j]}em`}>
                <span>{toLetters(j + 1)}</span>
            </th>
        {/each}
    </tr>
    {#each $loadedFile.data as row, i}
        <tr class="row contentRow">
            <th class="cell">{i + 1}</th>
            {#each row as cell, j}
                <td translate="yes" contenteditable spellcheck="false" class="cell contentCell" style={`width: ${widths[j]}em; ` + (customColors.get(`${i}-${j}`) || "")}>
                    {cell}
                </td>
            {/each}
        </tr>
    {/each}
</table>
</main>
{:else}
<TextEditor bind:repack={textEditorRepack} data={$loadedFile.toString()} includeRepack={false} ext={ext} />
{/if}

<style>
    header > span {
        flex-grow: 1;
    }
    .csvEditor {
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        font-family: 'Consolas', monospace;
        background-color: #111;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .csvEditor td, .csvEditor th {
        min-width: 20px;
        border: 1px solid #333;
        background-color: #222;
        white-space: pre;
    }
    .csvEditor tr:first-child {
        background-color: #333;
        position: sticky;
        top: 0;
        z-index: 2;
    }
    .csvEditor tr:first-child th:first-child {
        background-color: #444;
        position: sticky;
        top: 0;
        left: 0;
        width: 3em;
        z-index: 3;
    }
    .csvEditor tr:not(:first-child) > th {
        background-color: #333;
        position: sticky;
        left: 0;
        width: 3em;
    }
    .csvEditor td:focus-visible {
        outline: none;
        border: 1px solid #ccc;
    }
</style>