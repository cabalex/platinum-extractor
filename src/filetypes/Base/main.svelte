<script lang="ts">
    import type { FileData } from "./extract";
    import type FileHandler from "../../lib/FileHandler";

    export let name: string;
    export let data: FileData;
    export let fileHandler: FileHandler; // If you want to access other files (fileHandler.files store)
    export let setUnsavedChanges: (value: boolean) => {}; // Run setUnsavedChanges(true) to indicate that the file has unsaved changes

    export function save(): FileData {
        // Whatever is returned here will update the file's data.
        // Unsaved changes will automatically be set to false.
        return { myData: "Hello, world! This is my modded data." };
    }
</script>

<div>
    Hello world! My file name is {name} and I have {data.myData} in me.
</div>