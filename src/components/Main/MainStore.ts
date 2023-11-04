import { writable, type Writable } from "svelte/store";
import Unloaded from "./Unloaded.svelte";
import type { PlatinumFile } from "../../lib/FileHandler";

interface Tab {
    name: string;
    component: any;
    file?: any;
    files?: PlatinumFile[];
    unsaved: Writable<boolean>;
    unchanged: Writable<boolean>;
}

export let loadedComponentIndex = writable(0);
export let componentTabs = writable<Tab[]>([]);
