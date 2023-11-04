import type PlatinumFileReader from "../../lib/PlatinumFileReader";

export interface FileData {
    // whatever the extract function returns; here's some sample data
    data: string[][];
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    // ... Do some cool extraction magic here ...
    let arrayBuffer = await file.read();

    let decoder = new TextDecoder("SHIFT-JIS");

    let text = decoder.decode(arrayBuffer);

    if (text.includes("\r\n")) {
        text = text.replace(/\r\n/g, "\n");
    }

    return {
        data: text.split("\n").map(line => line.split(","))
    };
}

export default extract;