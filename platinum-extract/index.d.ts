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
        /**
         * Loads a stringified XML into the BXM object.
         * Warning: replaces all contents inside the BXM!
         */
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
declare module "games/Global/MCD" {
    import PlatinumFile from "games/Global/PlatinumFile";
    interface Char {
        char: string;
        positionOffset: number;
    }
    interface Event {
        header: any;
        paragraphs: Array<{
            header: any;
            strings: Array<{
                header: any;
                text: string;
                terminator: any;
            }>;
        }>;
    }
    interface CharGraph {
        textureID: number;
        u1: number;
        v1: number;
        u2: number;
        v2: number;
        width: number;
        height: number;
        belowSpacing: number;
        horizontalSpacing: number;
    }
    interface SpecialGraph {
        languageFlag: number;
        width: number;
        height: number;
        belowSpacing: number;
        horizontalSpacing: number;
    }
    interface UsedEvent {
        hash: number;
        index: number;
        event: Event;
        name: string;
    }
    export default class MCD extends PlatinumFile {
        data: {
            chars: Char[];
            events: Event[];
            charGraphs: CharGraph[];
            specialGraphs: SpecialGraph[];
            usedEvents: UsedEvent[];
        };
        constructor(name: string, chars: Char[], events: Event[], charGraphs: CharGraph[], specialGraphs: SpecialGraph[], usedEvents: UsedEvent[], size?: number);
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<MCD>;
        getArrayBuffer(): Promise<ArrayBuffer>;
        static repack(chars: Char[], events: Event[], charGraphs: CharGraph[], specialGraphs: SpecialGraph[], usedEvents: UsedEvent[]): Promise<ArrayBuffer>;
    }
}
declare module "tools/gameSupport" {
    export enum games {
        PlatinumGeneric = 0,
        AstralChain = 1,
        NieRReplicant = 2,
        NieRAutomata = 3,
        NieRAutomataSwitch = 4,
        MetalGearRisingRevengence = 5,
        Bayonetta1PC = 6,
        Bayonetta1Switch = 7,
        Bayonetta2WiiU = 8,
        Bayonetta2Switch = 9,
        Bayonetta3 = 10,
        StarFoxZero = 11,
        StarFoxGuard = 12,
        TransformersDevastation = 13,
        Vanquish = 14,
        Wonderful101 = 15,
        Wonderful101Remastered = 16,
        Wonderful101RemasteredSwitch = 17
    }
    export enum platforms {
        PC = 0,
        Switch = 1,
        WiiU = 2
    }
    const gameSupport: {
        0: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        1: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        2: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        3: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        4: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        5: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        6: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        7: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        8: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        9: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        10: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        11: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        12: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        13: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        14: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        15: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        16: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
        17: {
            platform: platforms;
            name: string;
            deswizzlingRequired: boolean;
            astc: boolean;
        };
    };
    export default gameSupport;
}
declare module "games/SwitchGlobal/tegrax1swizzle" {
    export const formatTable: {
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
    export function getFormatTable(_format: string): any;
    export function deswizzle(width: number, height: number, depth: number, blkWidth: number, blkHeight: number, blkDepth: number, roundPitch: number, bpp: number, tileMode: number, size_range: number, data: ArrayBuffer): ArrayBufferLike;
    export function swizzle(width: number, height: number, depth: number, blkWidth: number, blkHeight: number, blkDepth: number, roundPitch: number, bpp: number, tileMode: number, size_range: number, data: ArrayBuffer): ArrayBufferLike;
    export function getAddrBlockLinear(x: number, y: number, image_width: number, bytes_per_pixel: number, base_address: number, block_height: number): number;
    /**
     * Unswizzles an image and returns an ArrayBuffer containing the image data.
     * @param format The stringified format of the image. (e.g. "ASTC_4x4_UNORM")
     * @param width Image width, in pixels.
     * @param height Image height, in pixels.
     * @param depth Image depth. Usually 1.
     * @param arrayCount The array count of the texture.
     * @param mipCount Number of mipmaps.
     * @param imageData The image data, as an ArrayBuffer.
     * @param blockHeightLog2 The base 2 log of the block height. (e.g. this.textureLayout & 7)
     * @param target (optional) Leave this as 1.
     * @param linearTileMode (optional) Whether to use LINEAR tile mode. Leave this as false.
     * @returns ArrayBuffer of the unswizzled image, or false if unswizzling failed.
     */
    export function loadImageData(format: string, width: number, height: number, depth: number, arrayCount: number, mipCount: number, imageData: ArrayBuffer, blockHeightLog2: number, target?: number, linearTileMode?: boolean): false | ArrayBuffer;
    /**
     * Swizzles an image and returns an ArrayBuffer containing the image data.
     * @param format The stringified format of the image. (e.g. "ASTC_4x4_UNORM")
     * @param width Image width, in pixels.
     * @param height Image height, in pixels.
     * @param depth Image depth. Usually 1.
     * @param arrayCount The array count of the texture.
     * @param mipCount Number of mipmaps.
     * @param imageData The image data, as an ArrayBuffer.
     * @param blockHeightLog2 The base 2 log of the block height. (e.g. this.textureLayout & 7)
     * @param target (optional) Leave this as 1.
     * @param linearTileMode (optional) Whether to use LINEAR tile mode. Leave this as false.
     * @returns ArrayBuffer of the swizzled image, or false if swizzling failed.
     */
    export function compressImageData(format: string, width: number, height: number, depth: number, arrayCount: number, mipCount: number, imageData: ArrayBuffer, blockHeightLog2: number, target?: number, linearTileMode?: boolean): false | ArrayBuffer;
}
declare module "games/SwitchGlobal/ASTC" {
    export function addASTCHeader(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer): ArrayBufferLike;
    export function loadASTC(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer): HTMLCanvasElement;
}
declare module "games/SwitchGlobal/DDS" {
    /**
     * Prepends a DDS header to DDS texture data, for exporting.
     * @param format The format of the texture, e.g. "BC1_UNORM".
     * @param width Texture width
     * @param height Texture height
     * @param depth Texture depth (usually 1)
     * @param textureData An ArrayBuffer containing the texture data.
     * @returns An ArrayBuffer containing the complete file (both header and data).
     */
    export function addDDSHeader(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer): ArrayBufferLike;
    /**
     * Loads a DDS texture into a canvas element. Renders using WebGL.
     * @param format The format of the texture, e.g. "BC1_UNORM".
     * @param width Texture width
     * @param height Texture height
     * @param depth Texture depth (usually 1)
     * @param textureData An ArrayBuffer containing the texture data.
     * @returns A canvas element containing the texture.
     */
    export function loadDDS(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer): HTMLCanvasElement;
}
declare module "games/Global/WTA" {
    import { games } from "tools/gameSupport";
    import PlatinumFile from "games/Global/PlatinumFile";
    export class WTATexture {
        identifier: string;
        offset: number;
        size: number;
        unknownArrayValue: number;
        magic: number;
        imageSize: number;
        headerSize: number;
        mipCount: number;
        type: number;
        format: number;
        width: number;
        height: number;
        depth: number;
        textureLayout: number;
        textureLayout2: number;
        arrayCount: number;
        constructor(identifier: number, wtpOffset: number, wtpSize: number, unknownArrayValue: number);
        get game(): games;
        get _format(): any;
        get _type(): string;
        /**
         * Extracts a texture from a WTA DataView.
         * @param view  DataView of the file.
         * @param offset Offset of the texture.
         * @param wtpOffset Offset of the texture in the WTP.
         * @param wtpSize Size of the texture in the WTP.
         * @param identifier Identifier of the texture.
         * @param unknownArrayValue Unknown value.
         * @returns [texture, offset]
         */
        static extract(view: DataView, offset: number, wtpOffset: number, wtpSize: number, identifier: number, unknownArrayValue: number): [WTATexture, number];
        private getTextureData;
        /**
         * Loads a texture into a canvas.
         * @returns
         */
        load(wtpTexture: ArrayBuffer): HTMLCanvasElement;
        /**
         * Returns an ArrayBuffer of the texture as a file.
         */
        download(wtpTexture: ArrayBuffer): ArrayBufferLike;
    }
    /**
     * WTA files are the games' main texture formats.
     */
    export default class WTA extends PlatinumFile {
        textures: WTATexture[];
        name: string;
        constructor(name: string, textures: WTATexture[], arrayBuffer: ArrayBuffer);
        /**
         * Extracts a WTA file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the WTA file.
         * @returns the WTA object.
         */
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<WTA>;
        /**
         * Repacks the WTA file.
         */
        repack(): Promise<ArrayBuffer>;
    }
}
declare module "games/Global/WTP" {
    import PlatinumFile from "games/Global/PlatinumFile";
    export default class WTP extends PlatinumFile {
        name: string;
        arrayBuffer: ArrayBuffer;
        constructor(name: string, arrayBuffer: ArrayBuffer);
        /**
         * Extracts a WTP file from an ArrayBuffer.
         * @param arrayBuffer The array buffer of the WTP file.
         * @returns the WTP object.
         */
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<WTP>;
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
    export default function defineFile(filename: string): "text/xml" | "unknown" | "save/astralchain_slot" | "save/astralchain_game" | "text/csv" | "localization/bin" | "localization/mcd" | "folder/dat" | "folder/pkz" | "folder/cpk" | "texture/wta" | "texture/wtp" | "texture/wtb" | "model/wmb" | "model/col" | "animation/mot" | "audio/wem" | "audio/bnk" | "audio/wwi" | "audio/wai" | "ruby/rbd" | "ui/uid" | "ui/uvd";
}
declare module "tools/resolveFile" {
    /**
     * Resolves a file to its respective class.
     * @param filename The filename to check.
     */
    export default function resolveFile(filename: string): any;
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
declare module "games/AstralChain/database" {
    export const items: {};
    export const abilities: any;
    export const subabilities: any;
    export function getAbility(id: number, subability?: boolean, value?: number): any;
    export const enemies: any;
}
declare module "games/AstralChain/AstralChainSlotData" {
    import PlatinumFile from "games/Global/PlatinumFile";
    class Item {
        constructor();
        export(): ArrayBuffer;
    }
    /**
     * Astral Chain Ability. 36 bytes.
     * Abilites start at 0x97000.
     */
    class Ability {
        id: number;
        cost: number;
        unk1: number;
        unk2: number;
        bonusAbility1Id: number;
        bonusAbility1Value: number;
        bonusAbility2Id: number;
        bonusAbility2Value: number;
        unk3: number;
        constructor(buffer: ArrayBuffer);
        get name(): any;
        repack(): ArrayBufferLike;
    }
    export default class AstralChainSlotData extends PlatinumFile {
        playtime: number;
        lastSaved: Date;
        money: number;
        geneCodes: number;
        username: string;
        items: Item[];
        abilities: Ability[];
        arrayBuffer: ArrayBuffer;
        constructor(root: ArrayBuffer, slotId: number);
        addAbility(): void;
        static extract(fileBuffer: ArrayBuffer | File, name: string): Promise<AstralChainSlotData>;
        repack(): Promise<ArrayBufferLike>;
    }
}
declare module "index" {
    export { default as DAT } from "games/Global/DAT";
    export { default as BXM } from "games/Global/BXM";
    export { default as CSV } from "games/Global/CSV";
    export { default as PKZ } from "games/AstralChain/PKZ";
    export { default as AstralChainSlotData } from "games/AstralChain/AstralChainSlotData";
    export { abilities as AstralChainAbilities, subabilities as AstralChainSubAbilities, getAbility as AstralChainGetAbility, enemies as AstralChainEm } from "games/AstralChain/database";
    export { default as CPK } from "games/NieR/CPK";
    export { default as readFile } from "tools/readFile";
    export { default as defineFile } from "tools/defineFile";
    export { default as resolveFile } from "tools/resolveFile";
}
declare module "games/AstralChain/AstralChainQuest" {
    import DAT from "games/Global/DAT";
    export default class AstralChainQuest extends DAT {
        data: any;
        visualizer: {
            actionText: string;
            actionTitle: string;
        };
        constructVisualizer(): Promise<void>;
        parse(): void;
    }
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
