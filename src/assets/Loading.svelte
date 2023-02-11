<script lang="ts">
    import load from "./load.svg";
</script>

<img class="loading" alt="Loading..." src={load} />

<style>
    .loading {
        animation: load 1s infinite linear;
        color: white;
    }
    @keyframes load {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>