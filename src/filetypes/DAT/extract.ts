import type PlatinumFileReader from "../../lib/PlatinumFileReader";
import { swapUint32Array } from "../../lib/bigEndianTools";

export interface FileData {
    files: Array<{
        name: string;
        arrayBuffer: ArrayBuffer;
    }>;
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    let arrayBuffer = await file.read();
    let textDecoder = new TextDecoder();
    const view = new DataView(arrayBuffer);

    let fileCount = view.getUint32(4, true);

    let littleEndian = true;
    if (fileCount > 100000) {
        // This is a big endian DAT file.
        littleEndian = false;
        fileCount = view.getUint32(4, false);
    }
    const fileOffsetsTableOffset = view.getUint32(8, littleEndian);
    //const fileExtTableOffset = view.getUint32(12, littleEndian);
    const fileNameTableOffset = view.getUint32(16, littleEndian);
    const fileSizeTableOffset = view.getUint32(20, littleEndian);
    //const hashMapOffset = view.getUint32(24, true);

    const fileOffsetsTable = new Uint32Array(
        arrayBuffer.slice(
            fileOffsetsTableOffset,
            fileOffsetsTableOffset + fileCount * 4
            )
        );
    
    /*const fileExtTable = textDecoder.decode(
        arrayBuffer.slice(
            fileExtTableOffset,
            fileExtTableOffset + fileCount * 4
            )
        )
        .split("\0")
        .filter((x) => x.length > 0)*/
    
    const fileSizesTable = new Uint32Array(
        arrayBuffer.slice(
            fileSizeTableOffset,
            fileSizeTableOffset + fileCount * 4
            )
        );

    const fileNameLength = view.getUint32(fileNameTableOffset, littleEndian);

    const fileNameTable = textDecoder.decode(
        arrayBuffer.slice(
            fileNameTableOffset + 4,
            fileNameTableOffset + 4 + fileNameLength * fileCount
            )
        )
        .split("\0")
        .filter((x) => x.length > 0);
    
    if (!littleEndian) {
        // switch endianness
        swapUint32Array(fileOffsetsTable);
        swapUint32Array(fileSizesTable);
    }
    
    // --- Hash table does not need to be stored (see hashing function shamelessly copied from B2N)

    return {
        files: fileNameTable.map((name, i) => {
            return {
                name,
                arrayBuffer: arrayBuffer.slice(fileOffsetsTable[i], fileOffsetsTable[i] + fileSizesTable[i])
            }
        })
    }
}

export default extract;