import type PlatinumFileReader from "../../lib/PlatinumFileReader";

export interface FileData {
    // whatever the extract function returns; here's some sample data
    myData: string;
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    // ... Do some cool extraction magic here ...

    return {
        myData: "Hello World!"
    };
}

export default extract;