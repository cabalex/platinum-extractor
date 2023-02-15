import { writable } from 'svelte/store'
// https://dev.to/danawoodman/svelte-quick-tip-creating-a-toast-notification-system-ge3

export const loadedFile = writable(null);
export const searchedFile = writable(null);

export const settings = writable({
    seenLargeFilesWarning: false 
})