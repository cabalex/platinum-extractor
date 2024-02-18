import PlatinumFileReader from "./PlatinumFileReader";

function loadFileTypes() {
    const fileTypes = {};
  
    const context = import.meta.glob('/src/filetypes/*/*.ts', { eager: true });
    for (const [path, module] of Object.entries(context)) {
        const [, folderName, fileName] = path.match(/^.+\/filetypes\/([^/]+)\/(.*)\.(ts)$/);
        if (folderName === 'Base') continue;
        if (!fileTypes[folderName]) {
            fileTypes[folderName] = {};
        }
        switch (fileName) {
            case 'extract':
                // @ts-ignore
                fileTypes[folderName].extract = module.default;
                // @ts-ignore
                fileTypes[folderName].FileData = module.FileData;
                break;
            case 'extract_partial':
                // @ts-ignore
                fileTypes[folderName].extract_partial = module.default;
                break;
            case 'repack':
                // @ts-ignore
                fileTypes[folderName].repack = module.default;
                break;
            case 'fileInfo':
                // @ts-ignore
                fileTypes[folderName].fileInfo = module.default;
                break;
            default:
                break;
        }
    }
    return fileTypes;
}


const filetypes = loadFileTypes();

function resolveFile(magic: string, name: string) {
    let magicMatch = Object.keys(filetypes).find((filetype) => filetypes[filetype].fileInfo.magic.includes(magic));
    if (magicMatch) return magicMatch;

    let filetypeMatch = Object.keys(filetypes).find((filetype) => filetype === name.split(".").pop().toUpperCase());
    if (filetypeMatch) return filetypeMatch;
}

function replyBase(id: string, data: any) {
    self.postMessage({id, data});
}

async function parseMessage(type: string, data: any, reply: (data: any) => void) {
    switch (type) {
        case 'extract':
            let name = data.target.name || data.name || "";
            
            if (data.target.byteLength === 0) {
                reply({ok: false, error: `File ${name} is empty`, data: {target: data.target, name: data.name}});
                return;
            }

            let fileReader = new PlatinumFileReader(data.target);
            let magic = await fileReader.readString(0, 4);
            let filetype = await resolveFile(magic, name);

            if (!filetype) {
                console.warn(`No filetype found for ${name} with magic ${magic}`);
                reply({ok: false, error: `No filetype found for ${name} with magic ${magic}`, data: {target: data.target, name: data.name}});
                return;
            }

            let extractedData = await filetypes[filetype].extract(fileReader);

            // Has files, but they are not compressed (DAT/DTT)
            if (!filetypes[filetype].extract_partial && extractedData.files) {
                for (let i = 0; i < extractedData.files.length; i++) {
                    extractedData.files[i] = await new Promise((resolve) => {
                        parseMessage(
                            'extract',
                            {target: extractedData.files[i].arrayBuffer, name: extractedData.files[i].name},
                            (data) => resolve({name: extractedData.files[i].name, data: data.data, filetype: data.filetype})
                        )
                    });
                }
            }

            reply({
                ok: true,
                filetype,
                icon: filetypes[filetype].fileInfo.icon,
                isRepackable: !!filetypes[filetype].repack,
                hasPartialFiles: !!filetypes[filetype].extract_partial,
                data: extractedData
            });

            break;
        case 'extract_partial':
            let partialFile = data.partialFile;
            let baseFile = data.baseFile;
            let partialData = await filetypes[data.filetype].extract_partial(partialFile, baseFile);

            // Reparse the file and reply then
            parseMessage('extract', {target: partialData.data, name: partialData.name}, reply);
            break;
        case 'repack':
            break;
        case 'fileInfo':
            break;
    }
}

self.onmessage = async (event) => parseMessage(event.data.type, event.data.data, replyBase.bind(null, event.data.id));

// Let the web app know that we loaded
self.postMessage("loaded");