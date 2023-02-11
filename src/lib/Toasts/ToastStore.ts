import { writable } from 'svelte/store'
// https://dev.to/danawoodman/svelte-quick-tip-creating-a-toast-notification-system-ge3

interface ToastProps {
    id?: number,
    type?: 'info'|'danger'|'success'|'warning',
    dismissable?: boolean,
    timeout?: number|null,
    title: string;
    message: string|null;
    link?: { text: string, href: string };
    progress?: number;
}

interface Toast extends ToastProps {
    id: number;
}

export const toasts = writable([]);

export const dismissToast = (id) => {
    toasts.update((all) => all.filter((t) => t.id !== id))
}

/**
 * Adds a toast to the store.
 * @param id The id of the toast.
 * @param type ['info', 'danger', 'success'] - default info
 * @param title The title of the toast.
 * @param message The message to display.
 * @param timeout The timeout in ms before the toast is dismissed. Default none.
 * @param dismissible Whether the toast can be dismissed by the user. Default true.
 * 
 */
export const addToast = (toast: ToastProps) => {
    // Create a unique ID so we can easily find/remove it
    // if it is dismissible/has a timeout.
    const id = Math.floor(Date.now() * 1000)

    // Setup some sensible defaults for a toast.
    const t = {
        id: toast.id || id,
        type: toast.type || 'info',
        dismissable: toast.dismissable !== false ? true : toast.dismissable,
        timeout: toast.timeout || null,
        title: toast.title,
        message: toast.message,
        link: toast.link || null,
    }
    
    toasts.update((all) => [...all, t])

    // If toast is dismissible, dismiss it after "timeout" amount of time.
    if (t.timeout) setTimeout(() => dismissToast(id), t.timeout)

    return toast.id || id;
}

export const updateToast = (id: number, properties: ToastProps) => {
    toasts.update((all) => {
        const toast = all.find(t => t.id === id);
        if (toast) {
            for (const [key, value] of Object.entries(properties)) {
                toast[key] = value;
            }
        }
        return all;
    });
}