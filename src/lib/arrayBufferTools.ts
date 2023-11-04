export function concatArrayBuffer(...arrayBuffers: ArrayBuffer[]): ArrayBuffer {
    const c = new Uint8Array(arrayBuffers.reduce((a, b) => a + b.byteLength, 0));
    let offset = 0;
    for (const arrayBuffer of arrayBuffers) {
        c.set(new Uint8Array(arrayBuffer), offset);
        offset += arrayBuffer.byteLength;
    }
    
    return c.buffer;
}

export function setArrayBuffer(a: ArrayBuffer, b: ArrayBuffer, offset: number): ArrayBuffer {
    const c = new Uint8Array(a);
    c.set(new Uint8Array(b), offset);
    return c.buffer;
}