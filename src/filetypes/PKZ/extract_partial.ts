import { ZstdInit } from '@oneidentity/zstd-js';
import { load as loadOOZ, decompressUnsafe as decompressOOZ } from 'ooz-wasm';
import PlatinumFileReader from "../../lib/PlatinumFileReader";
import type { FileData, PartialFile } from "./extract";

let zstdDecompress: any = null;

async function extract_partial(partialFile: PartialFile, fileData: FileData) : Promise<{name: string, data: ArrayBuffer}> {
    // Create a new file reader
    let platinumFileReader = new PlatinumFileReader(fileData.baseFile);

    // Read the file
    let arrayBuffer = await platinumFileReader.read(
        partialFile.offset,
        partialFile.offset + partialFile.compressedSize
    );

    switch(partialFile.compressionType) {
        case 'ZStandard':
            if (!zstdDecompress) {
                let { ZstdStream } = await ZstdInit();
                zstdDecompress = ZstdStream;
            }
            arrayBuffer = zstdDecompress.decompress(new Uint8Array(arrayBuffer)).buffer;
            break;
        case 'OodleKraken':
            // Note: ooz-wasm is not very consistent at extraction, and you often need to search
            // for the DAT header in the wasm memory to find the correct offset.
            // I'm not very sure why that happens, but this works 99% of the time.
            await loadOOZ();
            arrayBuffer = (await decompressOOZ(new Uint8Array(arrayBuffer), partialFile.size)).buffer;
            let bit32 = new Uint32Array(arrayBuffer);
            let header = bit32.indexOf(5521732);
            if (header) {
                arrayBuffer = arrayBuffer.slice(header * 4, header * 4 + partialFile.size);
            } else {
                console.warn('Could not find DAT header in decompressed file. It may have been extracted wrong.');
            }
            break;
        case 'None':
            break;
        default:
            console.warn(`Unknown compression type: ${partialFile.compressionType}`);
    }

    // Return name and data as an object
    return {name: partialFile.name, data: arrayBuffer};
}

export default extract_partial;