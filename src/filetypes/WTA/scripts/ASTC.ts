import { getFormatTable } from './tegrax1swizzle';
import { createProgram } from 'twgl.js';

function getASTCHeader(format: string, width: number, height: number, depth: number) {

    let header = new Uint8Array(16).buffer;
    let view = new DataView(header);

    let formatInfo = getFormatTable(format);

    view.setUint32(0, 1554098963, true); // magic for ASTC
    view.setUint8(4, formatInfo[1]); // block width
    view.setUint8(5, formatInfo[2]); // block height
    view.setUint8(6, formatInfo[3]); // block depth
    view.setUint16(7, width); // x size
    view.setUint16(10, height); // y size
    view.setUint16(13, depth); // z size

    return header;
}
  

export function addASTCHeader(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer) {
    // Add header to data
    let ddsHeader = getASTCHeader(format, width, height, depth);
    let ddsFile = new Uint8Array(ddsHeader.byteLength + textureData.byteLength);
    ddsFile.set(new Uint8Array(ddsHeader));
    ddsFile.set(new Uint8Array(textureData), ddsHeader.byteLength);
    
    return ddsFile.buffer;
}

// Loads an ASTC texture into a canvas element.
export function loadASTC(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get 2D context from canvas');
    }

    canvas.width = width;
    canvas.height = height;

    let blockWidth = getFormatTable(format)[1];
    let blockHeight = getFormatTable(format)[2];
    let bytesPerPixel = getFormatTable(format)[0];

    // @ts-ignore
    let decompressImageData = Module.cwrap('decompressImageData', 'boolean', ['number', 'number', 'boolean', 'number', 'number', 'number', 'number', 'number', 'number'])
    
    // @ts-ignore
    const dataPtr = Module._malloc(textureData.byteLength);
    // @ts-ignore
    const destinationPtr = Module._malloc(width * height * 4);
    // @ts-ignore
    const dataOnHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, textureData.byteLength);
    // @ts-ignore
    dataOnHeap.set(new Uint8Array(textureData));

    
    // @ts-ignore
    let result = decompressImageData(destinationPtr, dataPtr, false, textureData.byteLength, width, height, bytesPerPixel, blockWidth, blockHeight);

    if (!result) console.warn("Decompressed incorrectly");

    // @ts-ignore
    let data = new Uint8Array(Module.HEAPU8.buffer, destinationPtr, width * height * 4);

    // @ts-ignore
    Module._free(dataPtr);
    // @ts-ignore
    Module._free(destinationPtr);

    let imageData = ctx.createImageData(width, height);

    imageData.data.set(data);

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}