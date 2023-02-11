declare module "tools/arrayBufferTools" {
    export function concatArrayBuffer(...arrayBuffers: ArrayBuffer[]): ArrayBuffer;
    export function setArrayBuffer(a: ArrayBuffer, b: ArrayBuffer, offset: number): ArrayBuffer;
}
declare module "tools/bigEndianTools" {
    export function swap32(val: number): number;
    export function swapUint32Array(array: Uint32Array): Uint32Array;
}
declare module "tools/generateDATHash" {
    export default function generateDATHash(files: {
        name: string;
    }[]): ArrayBuffer;
}
declare module "tools/readArrayBuffer" {
    /**
     * Reads a file and returns its contents.
     * @param file The arrayBuffer to read.
     * @returns the stringified file content.
     */
    export default function readArrayBuffer(arrayBuffer: ArrayBuffer, encoding: string): string;
}
declare module "tools/readFile" {
    type TypeName = 'text' | 'arraybuffer' | 'dataurl' | 'binarystring';
    type FileType<T> = T extends 'text' ? string : T extends 'arraybuffer' ? ArrayBuffer : T extends 'dataurl' ? string : T extends 'binarystring' ? string : never;
    /**
     * Reads a file and returns its contents.
     * @param file The file or blob to read.
     * @param readAs The type to return as (default arraybuffer).
     * @returns the file content in the form of readAs.
     */
    function readFile<T extends TypeName>(file: File | Blob | ArrayBuffer, readAs: T, encoding?: string): Promise<FileType<T>>;
    export default readFile;
}
declare module "tools/toString" {
    export default function toString(arrayBuffer: ArrayBuffer): string;
}
declare module "games/Global/PlatinumFile" {
    export default class PlatinumFile {
        name: string;
        size: number;
        original?: ArrayBuffer | File;
        isPartial: boolean;
        arrayBuffer?: ArrayBuffer;
        constructor(name: string, size: number, isPartial: boolean);
        getArrayBuffer(): Promise<ArrayBuffer>;
    }
}
declare module "games/AstralChain/PKZ" {
    import PlatinumFile from "games/Global/PlatinumFile";
    export class PKZFile extends PlatinumFile {
        root: PKZ;
        ext: string;
        offset: number;
        size: number;
        compressedSize: number;
        compressionType: string;
        arrayBuffer?: ArrayBuffer;
        constructor(root: PKZ, name: string, ext: string, offset: number, size: number, compressedSize: number, compressionType: string);
        read(): Promise<ArrayBuffer>;
        getArrayBuffer(): Promise<ArrayBuffer>;
    }
    /**
     * PKZ files are Platinum Games' main compressed archive format.
     * The files inside a DAT are compressed, either in ZSTD (Astral Chain) or Oodle Kraken (Bayonetta).
     */
    export default class PKZ extends PlatinumFile {
        root: File | null;
        files: PKZFile[];
        constructor(name: string, size: number, file?: File);
        /**
         * Extracts a DAT file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the DAT file.
         * @returns the DAT object.
         */
        static extract(file: File | ArrayBuffer, name: string): Promise<PKZ>;
        /**
         * Repacks the PKZ file into an ArrayBuffer.
         */
        static repack(): Promise<boolean>;
    }
}
declare module "games/Global/BXM" {
    import PlatinumFile from "games/Global/PlatinumFile";
    interface BXMNode {
        name: string;
        value: string;
        attributes: {
            [key: string]: string;
        };
        children: BXMNode[];
    }
    /**
     * BXM (stands for Binary XML) is an XML format used by some games.
     * It is a binary format that is very similar to XML.
     */
    export default class BXM extends PlatinumFile {
        encoding: "SHIFT-JIS" | "UTF-8";
        data: BXMNode;
        constructor(name: string, size: number);
        toString(): string;
        fromString(xml: string): void;
        getArrayBuffer(): Promise<ArrayBuffer>;
        private parseXML;
        private stringifiedXML;
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<BXM>;
        /**
         * Repacks an XML file to BXM format.
         * @returns ArrayBuffer
         */
        repack(): Promise<ArrayBuffer>;
    }
}
declare module "games/Global/CSV" {
    import PlatinumFile from "games/Global/PlatinumFile";
    /**
     * CSV (Comma-Separated Values) are files that contain a comma-separated table.
     * While not necessary to extract (as they are text files), it can be useful
     * for navigation and extraction, as usually the text is encoded in SHIFT-JIS.
     */
    export default class CSV extends PlatinumFile {
        data: Array<string[]>;
        toString(): string;
        fromString(text: string): void;
        getArrayBuffer(): Promise<ArrayBuffer>;
        constructor(name: string, data: string, arrayBuffer?: ArrayBuffer);
        repack(): Promise<ArrayBuffer>;
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<CSV>;
    }
}
declare module "games/Global/WTA" {
    import PlatinumFile from "games/Global/PlatinumFile";
    enum TextureData {
    }
    /**
     * WTA files are the games' main texture formats.
     */
    export default class WTA extends PlatinumFile {
        textures: TextureData[];
        name: string;
        constructor(name: string);
        /**
         * Extracts a DAT file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the DAT file.
         * @returns the DAT object.
         */
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<WTA>;
        /**
         * Repacks the WTA file.
         */
        repack(): Promise<ArrayBuffer>;
    }
}
declare module "tools/parseUTF" {
    export default function parseUTF(buffer: ArrayBuffer): any[] | null;
}
declare module "games/NieR/CPK" {
    import PlatinumFile from "games/Global/PlatinumFile";
    export class CPKFile extends PlatinumFile {
        root: CPK;
        ext: string;
        offset: number;
        size: number;
        compressedSize: number;
        compressionType: string;
        arrayBuffer?: ArrayBuffer;
        constructor(root: CPK, name: string, ext: string, offset: number, size: number);
        read(): Promise<ArrayBufferLike>;
        getArrayBuffer(): Promise<ArrayBufferLike>;
    }
    /**
     * PKZ files are Platinum Games' main compressed archive format.
     * The files inside a DAT are compressed, either in ZSTD (Astral Chain) or Oodle Kraken (Bayonetta).
     */
    export default class CPK extends PlatinumFile {
        root: File | null;
        files: CPKFile[];
        size: number;
        constructor(name: string, file?: File);
        /**
         * Extracts a DAT file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the DAT file.
         * @returns the DAT object.
         */
        static extract(file: File | ArrayBuffer, name: string): Promise<CPK>;
        /**
         * Repacks the PKZ file into an ArrayBuffer.
         */
        repack(): Promise<boolean>;
    }
}
declare module "tools/defineFile" {
    /**
     * Defines a file.
     * @param filename The filename to check.
     * @returns A type definition for the file, in the form of "type/subtype".
     * Types:
     * - text: text/xml, text/csv, etc
     * - localization: localization/bin, localization/mcd, etc
     * - folder: folder/dat, folder/pkz, etc
     * - model: model/wmb
     * - texture: texture/wta, texture/wtp, texture/wtb
     * - audio: audio/wem
     * - animation: animation/mot
     * - unknown: If we don't know what it is.
     */
    export default function defineFile(filename: string): "text/xml" | "unknown" | "text/csv" | "localization/bin" | "localization/mcd" | "folder/dat" | "folder/pkz" | "folder/cpk" | "texture/wta" | "texture/wtp" | "texture/wtb" | "model/wmb" | "animation/mot" | "audio/wem" | "audio/bnk" | "audio/wwi" | "audio/wai" | "ruby/rbd" | "ui/uid" | "ui/uvd";
}
declare module "tools/resolveFile" {
    import PKZ from "games/AstralChain/PKZ";
    import BXM from "games/Global/BXM";
    import CSV from "games/Global/CSV";
    import DAT from "games/Global/DAT";
    import CPK from "games/NieR/CPK";
    /**
     * Resolves a file to its respective class.
     * @param filename The filename to check.
     */
    export default function resolveFile(filename: string): typeof PKZ | typeof BXM | typeof CSV | typeof CPK | typeof DAT | {
        extract: () => null;
    };
}
declare module "games/Global/DAT" {
    import PlatinumFile from "games/Global/PlatinumFile";
    /**
     * DAT files are Platinum Games' main archive format (almost like a ZIP folder).
     * The files inside a DAT are not compressed.
     */
    export default class DAT extends PlatinumFile {
        files: any[];
        name: string;
        littleEndian: boolean;
        constructor(name: string);
        /**
         * Extracts a DAT file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the DAT file.
         * @returns the DAT object.
         */
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<DAT>;
        /**
         * Repacks the DAT file into an ArrayBuffer.
         */
        static repack(files: {
            name: string;
            arrayBuffer: ArrayBuffer;
        }[], datType?: 'DAT' | 'DTT', game?: 'astral-chain' | 'nier-automata-switch'): Promise<ArrayBuffer>;
    }
}
declare module "index" {
    export { default as DAT } from "games/Global/DAT";
    export { default as BXM } from "games/Global/BXM";
    export { default as CSV } from "games/Global/CSV";
    export { default as PKZ } from "games/AstralChain/PKZ";
    export { default as CPK } from "games/NieR/CPK";
    export { default as readFile } from "tools/readFile";
    export { default as defineFile } from "tools/defineFile";
    export { default as resolveFile } from "tools/resolveFile";
}
declare module "games/NieR/CPK_old" {
    import PlatinumFile from "games/Global/PlatinumFile";
    export class CPKFile extends PlatinumFile {
        root: CPK;
        ext: string;
        offset: number;
        size: number;
        compressedSize: number;
        compressionType: string;
        arrayBuffer?: ArrayBuffer;
        constructor(root: CPK, name: string, ext: string, offset: number, size: number, compressedSize: number, compressionType: string);
        read(): Promise<ArrayBuffer>;
        getArrayBuffer(): Promise<ArrayBuffer>;
    }
    /**
     * PKZ files are Platinum Games' main compressed archive format.
     * The files inside a DAT are compressed, either in ZSTD (Astral Chain) or Oodle Kraken (Bayonetta).
     */
    export default class CPK extends PlatinumFile {
        root: File | null;
        files: CPKFile[];
        size: number;
        constructor(name: string, file?: File);
        /**
         * Extracts a DAT file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the DAT file.
         * @returns the DAT object.
         */
        static extract(file: File | ArrayBuffer, name: string): Promise<CPK>;
        /**
         * Repacks the PKZ file into an ArrayBuffer.
         */
        repack(): Promise<boolean>;
    }
}
declare const formatTable: {
    R8G8B8A8_UNORM: number[];
    BC1_UNORM: number[];
    BC2_UNORM: number[];
    BC3_UNORM: number[];
    BC4_UNORM: number[];
    BC1_UNORM_SRGB: number[];
    BC2_UNORM_SRGB: number[];
    BC3_UNORM_SRGB: number[];
    BC4_SNORM: number[];
    BC6H_UF16: number[];
    ASTC_4x4_UNORM: number[];
    ASTC_6x6_UNORM: number[];
    ASTC_8x8_UNORM: number[];
    ASTC_4x4_SRGB: number[];
    ASTC_6x6_SRGB: number[];
    ASTC_8x8_SRGB: number[];
};
declare const formats: {
    37: string;
    66: string;
    67: string;
    68: string;
    69: string;
    70: string;
    71: string;
    72: string;
    73: string;
    80: string;
    45: string;
    56: string;
    58: string;
    121: string;
    128: string;
    135: string;
    142: string;
    125: string;
    139: string;
};
declare function getFormatTable(_format: string): any;
declare function getFormatByIndex(_format: number): any;
declare function pow2_round_up(x: number): number;
declare function DIV_ROUND_UP(n: number, d: number): number;
declare function subArray(data: any[], offset: number, length: number): any[];
declare function round_up(x: number, y: number): number;
declare function _swizzle(width: number, height: number, depth: number, blkWidth: number, blkHeight: number, blkDepth: number, roundPitch: number, bpp: number, tileMode: number, blockHeightLog2: number, data: any, toSwizzle: any): Uint8Array;
declare function deswizzle(width: number, height: number, depth: number, blkWidth: number, blkHeight: number, blkDepth: number, roundPitch: number, bpp: number, tileMode: number, size_range: number, data: any): Uint8Array;
declare function swizzle(width: number, height: number, depth: number, blkWidth: number, blkHeight: number, blkDepth: number, roundPitch: number, bpp: number, tileMode: number, size_range: number, data: any): Uint8Array;
declare function getAddrBlockLinear(x: number, y: number, image_width: number, bytes_per_pixel: number, base_address: number, block_height: number): number;
declare function loadImageData(format: string, width: number, height: number, depth: number, arrayCount: number, mipCount: number, imageData: any, blockHeightLog2: number, target?: number, linearTileMode?: boolean): false | Uint8Array;
declare function compressImageData(format: string, width: number, height: number, depth: number, arrayCount: number, mipCount: number, imageData: any, blockHeightLog2: number, target?: number, linearTileMode?: boolean): false | Uint8Array;
