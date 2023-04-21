import { DAT, PKZ, CPK, defineFile, resolveFile } from "@cabalex/platinum-extract";
import { writable, get } from 'svelte/store';
import { addToast } from "./lib/Toasts/ToastStore";

export function readableBytes(bytes: number) {
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 B';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return (bytes / Math.pow(1024, i)).toFixed(2).replace('.00', '') + ' ' + sizes[i];
}

export async function asyncForEach(array: Array<any>, callback: (item: any, i: number, array: Array<any>) => void, update: (index: number, progress: number) => void = () => {}) : Promise<void> {
    return new Promise((resolve) => {
        let i = 0;
        const loop = async () => {
            if (i < array.length) {
                await callback(array[i], i, array);
                update(i, i / array.length);
                i++;
                requestAnimationFrame(loop);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(loop);
    })
}

export function fileEquality(file1: any, file2: any) {
    if (file1 === file2) return true;
    return file1.id === file2.id;
    /*if (file1.name !== file2.name) return false;

    
    if (file1.arrayBuffer && file2.arrayBuffer) {
        if (file1.arrayBuffer.byteLength !== file2.arrayBuffer.byteLength) return false;
    } else if (file1.arrayBuffer || file2.arrayBuffer) {
        return false;
    }
    console.log(file1, file2)

    return true;*/
}

function getPercentages(array: Array<any>, property: string) {
    let items = {};
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (items[item[property]] == undefined) {
            items[item[property]] = 1;
        } else {
            items[item[property]]++;
        }
    }
    let output = [];
    for (let key in items) {
        output.push(`${Math.round(items[key] / array.length * 100)}% ${key}`)
    }

    return output.join(', ');
}

const randomID = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export class Folder {
    id = randomID();
    set;
    files = writable([], (set) => {
        this.set = set;
    })
    name: string;
    isPartial = false;
    root?: any;

    constructor(name: string, root?: PKZ|DAT) {
        this.name = name;
        this.root = root;

        // ensure all files have unique IDs
        this.files.subscribe((files) => { files.filter(f => !f.id).forEach(f => f.id = randomID()); return files });
    }

    addFiles(...files: Array<any>) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].files instanceof Array) {
                // MUST convert to folder
                let folder = new Folder(files[i].name, files[i].root);
                folder.addFiles(...files[i].files);
                files[i] = folder;
            }
        }
        this.files.update((all) => [...all, ...files]);
    }

    clear() {
        this.files.set([]);
    }

    getFolder(folderName: string, createIfNotExist=true, root?: PKZ|DAT) {
        let folders = get(this.files).filter((file) => file instanceof Folder);
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].name == folderName) {
                return folders[i];
            }
            let innerResults = folders[i].getFolder(folderName, false);
            if (innerResults) return innerResults;
        }

        if (!createIfNotExist) return null;

        // no folder; create it
        let folder = new Folder(folderName, root);
        this.addFiles(folder);
        return folder;
    }

    getFolderByFile(file: any) {
        function parseFolder(folder: Folder) {
            let files = get(folder.files);
            for (let i = 0; i < files.length; i++) {
                if (fileEquality(files[i], file)) {
                    return folder;
                } else if (files[i] instanceof Folder) {
                    let result = parseFolder(files[i])
                    if (result) return result; 
                }
            }
            return null;
        }
        return parseFolder(this);
    }


    /**
     * Searches in a folder for a filename.
     * @param query Search query.
     * @param recursive Whether to check subfolders or not.
     * @returns 
     */
    search(query: string, recursive: boolean = true, exact: boolean = false) {
        let ctx = this;
        let results = [];
        let files = get(ctx.files);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.name === query || (!exact && file.name.toLowerCase().includes(query.toLowerCase()))) {
                results.push(file);
            }
            if (file instanceof Folder && recursive) {
                results.push(...file.search(query));
            }
        }
        return results;
    }

    /**
     * Checks recursively if a file is in the folder or any of its subfolders.
     */
    includes(file: any|string) {
        let ctx = this;
        let files = get(ctx.files);
        for (let i = 0; i < files.length; i++) {
            let item = files[i];
            if ((typeof file === "string" && item.name === file) ||
                (typeof file !== "string" && fileEquality(item, file))
            ) return true;
            if (item instanceof Folder) {
                return item.includes(file);
            }
        }
        return false;
    }

    /**
     * Replaces a file in the folder.
     * @param original  The file to replace.
     * @param replacement  The file to replace it with (leave out to remove the file)
     * @returns The folder the replaced file was located in.
     */
    replaceFile(original: any, replacement?: any) {
        function parseFolder(folder: Folder) {
            let files = get(folder.files);
            for (let i = 0; i < files.length; i++) {
                if (files[i] === original) {
                    folder.files.update((all) => all.map((value) => {
                        if (fileEquality(value, original)) {
                            return replacement;
                        }
                        return value;
                    }).filter((value) => value != undefined));
                    return folder;
                } else if (files[i] instanceof Folder) {
                    let result = parseFolder(files[i])
                    if (result) return result; 
                }
            }
        }
        return parseFolder(this);
    }

    async getArrayBuffer() {
        // ZIP ?
        console.warn("getArrayBuffer() not implemented for folders");
        return new ArrayBuffer(0);
    }
}

export default class FileHandler extends Folder {
    constructor() {
        super('');
    }

    async import(files: {name: string, file: File|ArrayBuffer|Blob, size: number}[], { print, replace, returnInstance }: {print?: boolean, replace?: any, returnInstance?: boolean}) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.size === 0) {
                if (returnInstance) return null;
                continue;
            }

            let type = defineFile(file.name);
            let extracted;
            switch (type) {
                // --- PKZ (Astral Chain, Bayonetta)
                case "folder/pkz":
                    extracted = await PKZ.extract(file.file, file.name);
                    if (print) addToast({
                        title: `Extracted PKZ`,
                        message: `Extracted ${extracted.files.length} files from ${file.name}.\nCompressed Size: ${readableBytes(file.size)}\nUncompressed Size: ${readableBytes(extracted.files.reduce((a, b) => a + b.size, 0))}\nCompression type: ${getPercentages(extracted.files, 'compressionType')}`,
                        type: "success",
                        timeout: 10000
                    })
                    if (returnInstance) return extracted;

                    /*
                    PKZs are able to create a directory structure inside of them.
                    This expands it out.
                    */
                    let noPaths = true;
                    for (let i = 0; i < extracted.files.length; i++) {
                        if (extracted.files[i].name.split('/').length > 1) {
                            noPaths = false;
                            break;
                        }
                    }
                    if (noPaths) {
                        // create an outer folder
                        let folder = new Folder(file.name.split('.')[0], extracted);
                        folder.addFiles(...extracted.files);
                        this.addFiles(folder);
                    } else {
                        for (let i = 0; i < extracted.files.length; i++) {
                            const path = extracted.files[i].name.split('/');
                            
                            let ctx: any = this;
                            for (let j = 0; j < path.length; j++) {
                                if (j === path.length - 1) {
                                    // file name; place it here
                                    extracted.files[i].name = path[j];
                                    extracted.files[i].path = path;
                                    ctx.addFiles.call(ctx, extracted.files[i]);
                                } else {
                                    ctx = ctx.getFolder.call(ctx, path[j], extracted);
                                }
                            }
                        }
                    }
                    break;
                // --- CPK (NieR, MGR)
                case "folder/cpk":
                    extracted = await CPK.extract(file.file, file.name);
                    if (print) addToast({
                        title: `Extracted CPK`,
                        message: `Extracted ${extracted.files.length} files from ${file.name}.\nCompressed Size: ${readableBytes(file.size)}\nUncompressed Size: ${readableBytes(extracted.files.reduce((a, b) => a + b.size, 0))}\nCompression type: ${getPercentages(extracted.files, 'compressionType')}`,
                        type: "success",
                        timeout: 10000
                    })

                    /*
                    CPKs are able to create a directory structure inside of them.
                    This expands it out.
                    */
                    for (let i = 0; i < extracted.files.length; i++) {
                        const path = extracted.files[i].name.split('/');
                        
                        let ctx: any = this;
                        for (let j = 0; j < path.length; j++) {
                            if (j === path.length - 1) {
                                // file name; place it here
                                extracted.files[i].name = path[j];
                                ctx.addFiles.call(ctx, extracted.files[i]);
                            } else {
                                ctx = ctx.getFolder.call(ctx, path[j], extracted);
                            }
                        }
                    }
                    break;
                // --- DAT/DTT (pretty much everything)
                case "folder/dat":
                    // This DAT may be extracted using a visualizer class, such as quests or events
                    extracted = await (resolveFile(file.name)).extract(file.file, file.name);
                    if (print) addToast({
                        title: `Extracted ${extracted.constructor.name}`,
                        message: extracted.files ? `Extracted ${extracted.files.length} files from ${file.name}.` : `Extracted ${file.name}.`,
                        type: "success",
                        timeout: 10000
                    })
                    if (returnInstance) return extracted;

                    if (extracted.files) {
                        let folder = new Folder(file.name, extracted);
                        if (extracted.files.length > 0 || file.file['byteLength'] === 64) {
                            folder.addFiles(...extracted.files)
                            if (replace) {
                                this.replaceFile(replace, folder);
                            } else {
                                this.set([...get(this.files), folder]);
                            }
                        } else {
                            addToast({
                                title: `Couldn't extract DAT`,
                                message: `Couldn't find any files in ${file.name} (we might have extracted it wrong?)`,
                                type: "danger",
                                timeout: 10000
                            })
                        }
                        if (file.file['byteLength'] === 64) {
                            addToast({
                                title: `DAT empty`,
                                message: `${file.name} doesn't have any files in it.`,
                                type: "warning",
                                timeout: 10000
                            })
                        }
                    } else {
                        if (replace) {
                            this.replaceFile(replace, extracted);
                        } else {
                            this.set([...get(this.files), extracted]);
                        }
                    }
                    break;
                default:
                    extracted = await resolveFile(file.name).extract(file.file, file.name);

                    if (extracted) {
                        if (print) addToast({
                            title: "Extracted file",
                            message: `Extracted ${file.name}.`,
                            type: "success",
                            timeout: 10000
                        });

                        if (returnInstance) return extracted;

                        if (replace) {
                            this.replaceFile(replace, extracted);
                        } else {
                            this.set([...get(this.files), extracted]);
                        }
                    } else if (print) {
                        addToast({
                            title: `Extraction error`,
                            message: `I don't support this file type (${file.name}) right now. Try again later or open an issue to request support.`,
                            type: "danger",
                            timeout: 10000
                        })
                        
                        if (returnInstance) return null;
                    }
            }
        }

        
    }
}

export function downloadArrayBuffer(arrayBuffer: ArrayBuffer, name: string) {
    const blob = new Blob([arrayBuffer]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
}