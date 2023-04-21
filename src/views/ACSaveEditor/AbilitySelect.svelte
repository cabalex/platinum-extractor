<script lang="ts">
    import { AstralChainAbilities, AstralChainSubAbilities, AstralChainGetAbility } from "@cabalex/platinum-extract"

    export let stockAbilities = true;
    export let value;
</script>

<select on:change={(e) => value = parseInt(e.target.value)}>
    {#if stockAbilities}
        {#each Object.keys(AstralChainAbilities) as abilityId}
            <option value={abilityId} selected={value == abilityId}>{AstralChainGetAbility(abilityId)}</option>
        {/each}
    {:else}
        {#each Object.keys(AstralChainSubAbilities) as abilityId}
            <option value={abilityId} selected={value == abilityId}>{AstralChainGetAbility(abilityId, true)}</option>
        {/each}
    {/if}
</select>

<style>
    select {
        font-weight: unset;
        font-size: unset;
        font-family: unset;
    }
</style>