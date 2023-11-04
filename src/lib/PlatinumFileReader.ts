export default class PlatinumFileReader {
    file: File|ArrayBuffer;
    
    constructor(fileBuffer: File|ArrayBuffer) {
        this.file = fileBuffer;
    }

    /**
     * Reads the file and returns an ArrayBuffer.
     * @param start (optional)
     * @param end (optional)
     * @returns ArrayBuffer
     */
    read(start?: number, end?: number): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            if (this.file instanceof ArrayBuffer) {
                resolve(this.file.slice(start, end));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsArrayBuffer(this.file.slice(start, end));
        });
    }

    readString(start?: number, end?: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.file instanceof ArrayBuffer) {
                resolve(new TextDecoder().decode(this.file.slice(start, end)));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsText(this.file.slice(start, end));
        });
    }

    async readUint8(offset: number): Promise<number> {
        const buffer = await this.read(offset, offset + 1);
        return new DataView(buffer).getUint8(0);
    }

    async readUint16(offset: number, littleEndian=false): Promise<number> {
        const buffer = await this.read(offset, offset + 2);
        return new DataView(buffer).getUint16(0, littleEndian);
    }

    async readUint32(offset: number, littleEndian=false): Promise<number> {
        const buffer = await this.read(offset, offset + 4);
        return new DataView(buffer).getUint32(0, littleEndian);
    }

    async readInt8(offset: number): Promise<number> {
        const buffer = await this.read(offset, offset + 1);
        return new DataView(buffer).getInt8(0);
    }

    async readInt16(offset: number, littleEndian=false): Promise<number> {
        const buffer = await this.read(offset, offset + 2);
        return new DataView(buffer).getInt16(0, littleEndian);
    }

    async readInt32(offset: number, littleEndian=false): Promise<number> {
        const buffer = await this.read(offset, offset + 4);
        return new DataView(buffer).getInt32(0, littleEndian);
    }

    async readFloat32(offset: number, littleEndian=false): Promise<number> {
        const buffer = await this.read(offset, offset + 4);
        return new DataView(buffer).getFloat32(0, littleEndian);
    }
}