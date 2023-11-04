import type PlatinumFileReader from "../../lib/PlatinumFileReader";

export interface PartialFile {
    name: string,
    offset: number,
    size: number,
    compressedSize: number,
    compressionType: string;
}

export interface FileData {
    baseFile: File|ArrayBuffer,
    files: Array<PartialFile>,
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    let headerArrayBuffer = await file.read(0, 32);
    let headerDataView = new DataView(headerArrayBuffer);

    let header = {
        // magic: headerDataView.getUint32(0, true),
        // version: headerDataView.getUint32(4, true),
        size: headerDataView.getBigUint64(8, true),
        fileCount: headerDataView.getUint32(16, true),
        fileDescriptorsOffset: headerDataView.getUint32(20, true),
        fileNameTableLength: headerDataView.getUint32(24, true),
        // unknown: headerDataView.getUint32(28, true),
    }

    // @ts-ignore -- Load partial file data (name offset, size, offset, compressed size)
    let fileTable: ArrayBuffer = await file.read(header.fileDescriptorsOffset, header.fileDescriptorsOffset + header.fileCount * 32);
    let fileTableDataView = new DataView(fileTable);
    let partialFiles = [];

    for (let i = 0; i < header.fileCount; i++) {
        partialFiles.push(
            {
                nameOffset: fileTableDataView.getUint32(i * 32, true),
                compressionOffset: fileTableDataView.getUint32(i * 32 + 4, true),
                size: fileTableDataView.getBigUint64(i * 32 + 8, true),
                offset: fileTableDataView.getBigUint64(i * 32 + 16, true),
                compressedSize: fileTableDataView.getBigUint64(i * 32 + 24, true),
            }
        );
    }

    // get file names and assign them
    let newOffset = header.fileDescriptorsOffset + header.fileCount * 32;
    // @ts-ignore
    let fileNames: string = await file.readString(newOffset, newOffset + Number(partialFiles[0].offset));

    let files = [];

    for (let i = 0; i < partialFiles.length; i++) {
        let fileName = fileNames.slice(partialFiles[i]['nameOffset']).split('\0')[0];

        let compressionType = fileNames.slice(partialFiles[i]['compressionOffset']).split('\0')[0];

        files.push({
            name: fileName,
            offset: Number(partialFiles[i]['offset']),
            size: Number(partialFiles[i]['size']),
            compressedSize: Number(partialFiles[i]['compressedSize']),
            compressionType
        });
    }

    return {
        baseFile: file.file,
        files
    };
}

export default extract;