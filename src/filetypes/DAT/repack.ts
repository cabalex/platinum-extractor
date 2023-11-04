import { concatArrayBuffer, setArrayBuffer } from "../../lib/arrayBufferTools";
import type { FileData } from "./extract";
import generateDATHash from "./lib/generateDATHash";

async function repack(data: FileData) : Promise<ArrayBuffer> {
    const textEncoder = new TextEncoder();

    // --- Generate Hash Map
    const hashMap = generateDATHash(data.files);
    // --- Generate File Extensions (do some sanity checks)
    const fileExtTable = textEncoder.encode(
        data.files.map((x) => {
            let ext = x.name.split(".").pop() || "";
            return ext + new Array(4 - ext.length).fill('\0').join('')
        }).join('')
        ).buffer;
    // --- Generate File Names
    const nameLength = data.files.map((x) => x.name.length + 1).reduce((a, b) => Math.max(a, b));
    let fileNameStr = ""
    for (let i = 0; i < data.files.length; i++) {
        fileNameStr += data.files[i].name;
        fileNameStr += new Array(nameLength - data.files[i].name.length).fill('\0').join('');
    }
    const fileNameTable = concatArrayBuffer(Uint32Array.from([nameLength]).buffer, textEncoder.encode(fileNameStr).buffer);
    // --- Generate File Sizes
    const fileSizeTable = Uint32Array.from(data.files.map((x) => x.arrayBuffer.byteLength)).buffer;

    // --- Compute size of the new DAT file
    const headerSize =
        32 +                            // header
        data.files.length * 4 +         // file offsets table
        fileExtTable.byteLength +       // file extensions table
        fileNameTable.byteLength +      // file names table
        data.files.length * 4 +         // file sizes table
        hashMap.byteLength              // hash map

    // --- Generate File Offsets
    const fileOffsets32Array = new Uint32Array(data.files.length);
    let fileOffset = headerSize;
    for (let i = 0; i < data.files.length; i++) {
        fileOffset = Math.ceil(fileOffset / 16) * 16;
        fileOffsets32Array[i] = data.files[i].arrayBuffer.byteLength === 0 ? 0 : fileOffset;
        fileOffset += data.files[i].arrayBuffer.byteLength;
    }
    const fileOffsetsTable = fileOffsets32Array.buffer;

    // --- Create array buffer
    let arrayBuffer = new ArrayBuffer(fileOffsets32Array[fileOffsets32Array.length - 1] + data.files[data.files.length - 1].arrayBuffer.byteLength); // header only
    const view = new DataView(arrayBuffer);

    // --- Header
    view.setUint32(0, 5521732, true); // "DAT\0"
    view.setUint32(4, data.files.length, true); // fileCount
    view.setUint32(8, 32, true); // fileOffsetsOffset
    view.setUint32(12, 32 + data.files.length * 4, true); // fileExtOffset
    view.setUint32(16, 32 + data.files.length * 4 + fileExtTable.byteLength, true); // fileNameOffset
    view.setUint32(20, 32 + data.files.length * 4 + fileExtTable.byteLength + fileNameTable.byteLength, true); // fileSizeOffset
    view.setUint32(24, 32 + data.files.length * 4 + fileExtTable.byteLength + fileNameTable.byteLength + data.files.length * 4, true); // hashMapOffset

    arrayBuffer = setArrayBuffer(arrayBuffer, fileOffsetsTable, 32);
    arrayBuffer = setArrayBuffer(arrayBuffer, fileExtTable, 32 + data.files.length * 4);
    arrayBuffer = setArrayBuffer(arrayBuffer, fileNameTable, 32 + data.files.length * 4 + fileExtTable.byteLength);
    arrayBuffer = setArrayBuffer(arrayBuffer, fileSizeTable, 32 + data.files.length * 4 + fileExtTable.byteLength + fileNameTable.byteLength);
    arrayBuffer = setArrayBuffer(arrayBuffer, hashMap, 32 + data.files.length * 4 + fileExtTable.byteLength + fileNameTable.byteLength + data.files.length * 4);

    // --- Files
    for (let i = 0; i < data.files.length; i++) {
        arrayBuffer = setArrayBuffer(arrayBuffer, data.files[i].arrayBuffer, fileOffsets32Array[i]);
    }

    return arrayBuffer;
}

export default repack;