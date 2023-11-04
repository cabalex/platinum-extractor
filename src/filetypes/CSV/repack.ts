import type { FileData } from "./extract";
import Encoding from 'encoding-japanese';

async function repack(data: FileData) : Promise<ArrayBuffer> {
    return new Promise((resolve) => {
        let string = this.data.map(line => line.join(",")).join("\r\n");
        let returnarr = Encoding.stringToCode(string);
        let returning = Encoding.convert(returnarr, {
            to: 'SJIS', // to_encoding
            from: 'AUTO' // from_encoding
        });
        resolve(Uint8Array.from(returning).buffer);
    })
}

export default repack;