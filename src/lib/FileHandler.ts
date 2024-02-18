import { addToast } from "../components/Toasts/ToastStore";
import { loadedComponentIndex, componentTabs } from "../components/Main/MainStore";
import { get, writable, type Writable } from "svelte/store";

function loadComponents() {
    const fileTypes = {};
  
    const context = import.meta.glob('/src/filetypes/*/*.svelte', { eager: true });
    for (const [path, module] of Object.entries(context)) {
        const [, folderName, fileName] = path.match(/^.+\/filetypes\/([^/]+)\/(.*)\.(ts|svelte)$/);
        if (folderName === 'Base') continue;
        if (!fileTypes[folderName]) {
            fileTypes[folderName] = {};
        }
        if (fileName === 'main') {
            // @ts-ignore
            fileTypes[folderName] = module.default;
        }
    }
    return fileTypes;
}

function loadVisualizers() {
    const visualizerTypes = {};
  
    const context = import.meta.glob('/src/visualizers/*/*.{ts,svelte}', { eager: true });
    for (const [path, module] of Object.entries(context)) {
        const [, folderName, fileName] = path.match(/^.+\/visualizers\/([^/]+)\/(.*)\.(ts|svelte)$/);
        if (folderName === 'Base') continue;
        if (!visualizerTypes[folderName]) {
            visualizerTypes[folderName] = {};
        }
        switch (fileName) {
            case 'visualizer':
                // @ts-ignore
                visualizerTypes[folderName].component = module.default;
                break;
            case 'visualizerInfo':
                // @ts-ignore
                visualizerTypes[folderName].visualizerInfo = module.default;
                break;
            default:
                break;
        }
    }
    return visualizerTypes;
}

export class PlatinumFile {
    name: string;
    baseName: string; // Name without path
    data: Writable<any>;
    isPartial: boolean;
    repackable: boolean;
    unknown = false;
    icon = "file";
    resolvedType = "unknown";
    extractFn?: (caller: PlatinumFile) => Promise<any>;

    constructor(name: string, data: any, isPartial: boolean, repackable: boolean, resolvedType?: string, icon?: string, extractFn?: () => Promise<any>) {
        this.name = name;
        this.baseName = name.split('/').pop();
        this.data = writable(data);
        this.isPartial = isPartial;
        this.repackable = repackable;
        if (extractFn) this.extractFn = extractFn;
        if (icon) this.icon = icon;
        if (resolvedType) this.resolvedType = resolvedType;

        if (data?.name && data?.target) {
            this.unknown = true;
        }
    }

    async extract() {
        if (!this.isPartial || !this.extractFn) return get(this.data);

        let newData = await this.extractFn(this);
        this.data.set(newData);
        this.isPartial = false;
        this.extractFn = null;
        return newData;
    }
}


export default class FileHandler {
    worker: Worker;
    components = loadComponents();
    visualizers = loadVisualizers();
    files: Writable<PlatinumFile[]> = writable([]);

    constructor() {
        this.worker = new Worker(new URL('./FileHandler.worker.ts', import.meta.url), {type: 'module'});
    }

    async sendMessage(type: string, data: any) {
        let id = Math.random().toString(36).substring(7) + Date.now().toString(36);
        return new Promise((resolve, reject) => {
            this.worker.onmessage = (event) => {
                if (event.data.id === id) {
                    if (event.data.error || event.data.ok === false) {
                        reject(event.data.error || "An error occurred (recieved non-OK response)");
                    } else {
                        resolve(event.data.data);
                    }
                }
            };
            this.worker.onerror = (event) => {
                reject(event);
            };
            this.worker.postMessage({data, type, id});
        });
    }

    openFile(file: PlatinumFile) {
        if (get(file.data).arrayBuffer && get(file.data).name) {
            addToast({type: 'warning', timeout: 10000, title: `Failed to open ${file.name.split("/").pop()}`, message: "I don't currently support opening this file type right now, but you can open an issue to request support!"});
            return;
        }

        // resolve component
        let component = this.components[file.resolvedType];
        if (!component) {
            addToast({type: 'warning', timeout: 10000, title: `Failed to open ${file.name.split("/").pop()}`, message: `Despite an implementation existing (${file.resolvedType}), no component was found for this file type.\nAre you sure you should be opening this file?`});
            return;
        }

        if (get(componentTabs).map(tab => tab.file).includes(file)) {
            componentTabs.update(tabs => tabs.map(tab => {
                // If file is double clicked, ensure it is kept
                if (tab.file === file) {
                    tab.unchanged.set(false);
                }
                return tab;
            }));
            loadedComponentIndex.set(get(componentTabs).map(tab => tab.file).indexOf(file));
            return;
        }

        // set component
        componentTabs.update(tabs => [...tabs.filter(tab => !get(tab.unchanged)), {
            name: file.name.split("/").pop(),
            file,
            unchanged: writable(true),
            unsaved: writable(false),
            component
        }]);
        loadedComponentIndex.set(get(componentTabs).length - 1);
    }

    /**
     * Create a tab for the given visualizer.
     * @param visualizer
     * @param files  The files the visualizer should visualize.
     * @param folderName The name of the folder to visualize.
     * @returns 
     */
    visualizeFolder(visualizer: any, files: PlatinumFile[], folderName: string) {
        // resolve component
        if (!visualizer.component) {
            addToast({
                type: 'warning',
                timeout: 10000,
                title: `Failed to visualize folder`,
                message: "Despite an implementation existing, no component was found for this visualizer.\nPlease add a Svelte component to this visualizer."
            });
            return;
        }

        let tabName = visualizer.visualizerInfo.name + " - " + folderName;

        if (get(componentTabs).map(tab => tab.name).includes(tabName)) {
            componentTabs.update(tabs => tabs.map(tab => {
                // If file is double clicked, ensure it is kept
                if (tab.name === tabName) {
                    tab.unchanged.set(false);
                }
                return tab;
            }));
            loadedComponentIndex.set(get(componentTabs).map(tab => tab.name).indexOf(tabName));
            return;
        }

        // set component
        componentTabs.update(tabs => [...tabs.filter(tab => !get(tab.unchanged)), {
            name: tabName,
            files,
            unchanged: writable(true),
            unsaved: writable(false),
            component: visualizer.component
        }]);
        loadedComponentIndex.set(get(componentTabs).length - 1);
    }

    async extractPartialFile(baseFiletype: string, baseFile: any, partialFile: any, caller: PlatinumFile) {
        let response: any = await this.sendMessage('extract_partial', {baseFile, partialFile, filetype: baseFiletype})
            .catch((e) => {
                addToast({type: 'warning', timeout: 10000, title: `Failed to extract ${partialFile.name} from ${baseFile.baseFile.name}`, message: e});
            })
        
        // Compressed (in PKZ) -> Archive formats (DAT/DTT)
        if (response.data.files) {
            // remove original object
            let files = get(this.files);
            files.splice(files.indexOf(caller), 1);
            files.push(
                ...response.data.files.map(
                    (f) => new PlatinumFile(partialFile.name + "/" + f.name, f.data, response.hasPartialFiles, response.isRepackable, f.filetype, response.icon)
                )
            )
            this.files.set(files);
        }
        
        return response;
    }

    async import(files: File[]) {
        for (let file of files) {
            let response: any = await this.sendMessage('extract', {target: file})
                .catch((e) => {
                    addToast({type: 'warning', timeout: 10000, title: `Failed to extract ${file.name}`, message: e});
                })

            if (!response) continue;

            // Archive formats (DAT/DTT)
            if (response.data.files) {
                if (response.data.files.length === 0) {
                    addToast({type: 'warning', timeout: 10000, title: `Failed to extract ${file.name}`, message: "No files found in archive"});
                    continue;
                }

                // Partial files (large formats, PKZ/CPK)
                let baseFn = undefined;
                if (response.hasPartialFiles) {
                    baseFn = (partialFile: any, caller: any) => this.extractPartialFile(response.filetype, response.data, partialFile, caller);
                }

                this.files.update(f => [...f,
                    ...response.data.files.map(
                        (f) => new PlatinumFile(f.name, f.data, response.hasPartialFiles, response.isRepackable, response.filetype, response.icon, baseFn ? baseFn.bind(this, f) : undefined)
                    )
                ]);
            } else {
                // Single file
                this.files.update(f => [...f, new PlatinumFile(file.name, response.data, false, response.isRepackable, response.filetype, response.icon)]);
            }
        }

        //this.files.set([...get(this.files), ...fileData]);
    }
}