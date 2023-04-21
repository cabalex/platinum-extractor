<script lang="ts">
    import { AstralChainGetAbility } from "@cabalex/platinum-extract";
    import { loadedFile } from "../lib/Main/MainStore";
    import TagMultiple from "svelte-material-icons/TagMultiple.svelte";
    import Home from "svelte-material-icons/Home.svelte";
    import Alert from "svelte-material-icons/Alert.svelte";
    import ContentSave from "svelte-material-icons/ContentSave.svelte";
    import PlusBox from "svelte-material-icons/PlusBox.svelte";
    import './Sidebar.css';
    import Ability1 from "../assets/ac-ability-1.png"
    import Ability2 from "../assets/ac-ability-2.png"
    import Ability3 from "../assets/ac-ability-3.png"
    import VirtualList from "../assets/VirtualList.svelte";
    import AbilitySelect from "./ACSaveEditor/AbilitySelect.svelte";
    import { addToast } from "../lib/Toasts/ToastStore";
    import DeleteBtn from "../assets/DeleteBtn.svelte";

    export let fileHandler;
    export let ext;

    let openTab = 'home';

    function repack() {
        $loadedFile.repack();
        addToast({
            type: 'success',
            title: 'Repacked save file successfully!',
            message: 'Saved changes successfully! Download this file via the file explorer on the left.',
            timeout: 5000
        })

        loadedFile.update(value => { value.modified = true; return value });
    }

    function deleteAbility(index: number) {
        $loadedFile.abilities.splice(index, 1);
        $loadedFile.abilities = $loadedFile.abilities;
    }
    function addAbility() {
        $loadedFile.addAbility();
        $loadedFile.abilities = $loadedFile.abilities;
    }
</script>

<div class="editor wtaViewer">
    {#if openTab === "home"}
    <main>
        <h3>Slot Data for Player <input bind:value={$loadedFile.username} maxlength="16" /></h3>
        <div style="margin: 10px">
            <p>
                Playtime: <input type="number" min="0" max="18446744073709551615" bind:value={$loadedFile.playtime} /> secs
                ({Math.floor($loadedFile.playtime / 3600)}h {Math.floor($loadedFile.playtime / 60) % 60}m {$loadedFile.playtime % 60}s)
            </p>
            <p>
                Last Saved:
                <input
                    id="datetime"
                    type="datetime-local"
                    on:change={() => $loadedFile.lastSaved = new Date(document.getElementById('datetime').valueAsNumber || 0)}
                    value={$loadedFile.lastSaved.toISOString().replace("Z", "")}
                />
            </p>
            <p>
                Money: 
                <input
                    min={-2147483648}
                    max={2147483647}
                    type="number"
                    bind:value={$loadedFile.money}
                /> G
            </p>
            <p>
                Gene Codes: 
                <input
                    type="number"
                    min={-2147483648}
                    max={2147483647}
                    bind:value={$loadedFile.geneCodes}
                />
            </p>
        </div>
    </main>
    {:else if openTab === "abilities"}
    <main>
        <h3>Abilities ({$loadedFile.abilities.filter(a => a.id !== -1).length}/2000)</h3>
        <VirtualList height="calc(100vh - 50px)" items={$loadedFile.abilities} let:item let:index>
            <div class="ability">
                <h4>
                    <img src={item.cost === 3 ? Ability3 : item.cost === 2 ? Ability2 : Ability1} width="32px" />
                    <AbilitySelect bind:value={$loadedFile.abilities[index].id} />
                    <DeleteBtn onClick={deleteAbility.bind(null, index)} />
                </h4>
                {#if index === 0}
                <div class="warning">
                    <Alert />
                    Changing this ability's main type may not work (first ability obtained).
                </div>
                {/if}
                <p>Ability cost: <input min={1} max={5} type="number" bind:value={$loadedFile.abilities[index].cost}></p>
                <p>unknown 1: <input type="number" bind:value={$loadedFile.abilities[index].unk1}></p>
                <p>unknown 2: <input type="number" bind:value={$loadedFile.abilities[index].unk2}></p>
                <p>unknown 3: <input type="number" bind:value={$loadedFile.abilities[index].unk3}></p>
                <div class="subability">
                    <PlusBox width="32px" height="32px" />
                    <AbilitySelect bind:value={$loadedFile.abilities[index].bonusAbility1Id} stockAbilities={false} />
                    <input type="number" step={1} min={-2147483648} max={2147483647} bind:value={$loadedFile.abilities[index].bonusAbility1Value} />
                    {AstralChainGetAbility(
                        $loadedFile.abilities[index].bonusAbility1Id,
                        true,
                        $loadedFile.abilities[index].bonusAbility1Value
                    )}
                </div>
                <div class="subability">
                    <PlusBox width="32px" height="32px" />
                    <AbilitySelect bind:value={$loadedFile.abilities[index].bonusAbility2Id} stockAbilities={false} />
                    <input type="number" step={1} min={-2147483648} max={2147483647} bind:value={$loadedFile.abilities[index].bonusAbility2Value} />
                    {AstralChainGetAbility(
                        $loadedFile.abilities[index].bonusAbility2Id,
                        true,
                        $loadedFile.abilities[index].bonusAbility2Value
                    )}
                </div>
            </div>
            {#if item === $loadedFile.abilities[$loadedFile.abilities.length - 1]}
            <button class="add" on:click={addAbility}>
                + Add ability
            </button>
            {/if}
        </VirtualList>
    </main>
    {/if}
    <div class="tabs">
        <button title="Home" class="tab" class:active={openTab === "home"} on:click={() => openTab = "home"}>
            <Home />
        </button>
        <button title="Abilities" class="tab" class:active={openTab === "abilities"} on:click={() => openTab = "abilities"}>
            <TagMultiple />
        </button>
        <button title="Save and Repack" class="tab" on:click={() => repack()} style="color: var(--success); background-color: #222">
            <ContentSave />
        </button>
    </div>
</div>

<style>
    main {
        overflow: auto;

        display: block;
    }
    input {
        font-family: unset;
        font-size: unset;
        font-weight: unset;
    }
    main h3 {
        position: sticky;
        top: 0;
        background-color: #777;
        padding: 10px;
        margin: 0;
    }
    main h4 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        padding: 10px;
        border-radius: 5px;
        background-color: #222;
        font-size: 1.25em;
    }
    .ability {
        padding: 10px;
        margin: 5px;
        background-color: #333;
        border-radius: 5px;
    }
    .subability {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
    }
    .add {
        width: 100%;
    }
</style>