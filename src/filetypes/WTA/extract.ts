import type PlatinumFileReader from "../../lib/PlatinumFileReader";
import { addASTCHeader, loadASTC } from "./scripts/ASTC";
import { loadImageData } from "./scripts/tegrax1swizzle";
import gameSupport, { games } from "../../lib/game";
import { addDDSHeader, loadDDS } from "./scripts/DDS";

export interface FileData {
    // whatever the extract function returns; here's some sample data
    textures: WTATexture[];
}

export const surfaceTypes = [
    'T_1D', 'T_2D', 'T_3D',
    'T_Cube',
    'T_1D_Array', 'TD_2D_Array', 'T_2D_Multisample', 'T_2D_Multisample_Array',
    'T_Cube_Array'
];

// Credit to Kerilk
// https://github.com/Kerilk/noesis_bayonetta_pc/blob/master/bayonetta_pc/Nier.h
export const textureFormats = {
    // DDS
    0x25: "R8G8B8A8_UNORM",
    0x38: "R8_G8_B8_A8_SRGB",

    0x42: "BC1_UNORM", //DXT1
	0x43: "BC2_UNORM", //DXT3
	0x44: "BC3_UNORM", //DXT5
	0x45: "BC4_UNORM",
	0x46: "BC1_SRGB",
	0x47: "BC2_SRGB",
	0x48: "BC3_SRGB",
	0x49: "BC4_SRGB",

    0x4B: "BC5_UNORM",
	0x4C: "BC5_SRGB",
	0x4D: "BC7_UNORM",
	0x4E: "BC7_SRGB",
	0x4F: "BC6H_F16",
	0x50: "BC6H_UF16",

    0x79: "ASTC_4x4_UNORM",
    0x7A: "ASTC_5x4_UNORM",
	0x7B: "ASTC_5x5_UNORM",
	0x7C: "ASTC_6x5_UNORM",
	0x7D: "ASTC_6x6_UNORM",
	0x7E: "ASTC_8x5_UNORM",
	0x7F: "ASTC_8x6_UNORM",
	0x80: "ASTC_8x8_UNORM",
	0x81: "ASTC_10x5_UNORM",
	0x82: "ASTC_10x6_UNORM",
	0x83: "ASTC_10x8_UNORM",
	0x84: "ASTC_10x10_UNORM", // Thanks DniweTamp
	0x85: "ASTC_12x10_UNORM",
	0x86: "ASTC_12x12_UNORM",
	0x87: "ASTC_4x4_SRGB",
	0x88: "ASTC_5x4_SRGB",
	0x89: "ASTC_5x5_SRGB",
	0x8A: "ASTC_6x5_SRGB",
	0x8B: "ASTC_6x6_SRGB",
	0x8C: "ASTC_8x5_SRGB",
	0x8D: "ASTC_8x6_SRGB",
	0x8E: "ASTC_8x8_SRGB",
	0x8F: "ASTC_10x5_SRGB",
	0x90: "ASTC_10x6_SRGB",
	0x91: "ASTC_10x8_SRGB",
	0x92: "ASTC_10x10_SRGB",  // Thanks DniweTamp
	0x93: "ASTC_12x10_SRGB",
	0x94: "ASTC_12x12_SRGB",

    // ASTC (weird texture formats ??)
    0x2D: "ASTC_4x4_UNORM",
    0x3A: "ASTC_12x12_UNORM",
}

export class WTATexture {
    identifier = "0";
    offset = 0;
    size = 0;
    unknownArrayValue = 0;

    // --- WTA Texture Header ---
    magic = 3232856;
    // unknown: number;
    imageSize = 0;
    headerSize = 0;
    mipCount = 1;
    type = 0x44;
    format = 0x1;
    width = 0;
    height = 0;
    depth = 1;
    // unknown4: number;
    textureLayout = 0;
    textureLayout2 = 0;
    arrayCount = 1;

    constructor(identifier: number, wtpOffset: number, wtpSize: number, unknownArrayValue: number) {
        this.identifier = identifier.toString(16);
        this.offset = wtpOffset;
        this.size = wtpSize;
        this.unknownArrayValue = unknownArrayValue;
    }

    get game(): games {
        switch(this.magic) {
            case 3232856: // XT1\x00 (Astral Chain)
                return games.AstralChain;
            case 2019914798: // .tex (NieR Automata Switch)
                return games.NieRAutomataSwitch;
            case 0x47: // NieR Automata PC
                return games.NieRAutomata;
            default:
                return games.PlatinumGeneric;
        }
    }

    get _format() {
        // @ts-ignore
        return textureFormats[this.format];
    }
    get _type() {
        return surfaceTypes[this.type];
    }

    /**
     * Recreates the WTATexture if it was serialized.
     */
    static recreate(args: any) {
        let texture = new WTATexture(0, args.wtpOffset, args.wtpSize, args.unknownArrayValue);
        Object.assign(texture, args);

        return texture;
    }

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
    static extract(
        view: DataView,
        offset: number,
        wtpOffset: number,
        wtpSize: number,
        identifier: number,
        unknownArrayValue: number
    ) : [WTATexture, number] {
        let magic = view.getUint32(offset, true);

        let texture = new WTATexture(identifier, wtpOffset, wtpSize, unknownArrayValue);
        texture.magic = magic;
        
        switch(magic) {
            case 3232856: // XT1\x00 (Astral Chain)
                // texture.unknown = view.getUint32(offset + 4, true);
                texture.imageSize = view.getUint32(offset + 8, true);
                texture.headerSize = view.getUint32(offset + 16, true);
                texture.mipCount = view.getUint32(offset + 20, true);
                texture.type = view.getUint32(offset + 24, true);
                texture.format = view.getUint32(offset + 28, true);
                texture.width = view.getUint32(offset + 32, true);
                texture.height = view.getUint32(offset + 36, true);
                texture.depth = view.getUint32(offset + 40, true);
                // texture.unknown4 = view.getUint32(offset + 44, true);
                texture.textureLayout = view.getUint32(offset + 48, true);
                // texture.textureLayout2 = view.getUint32(offset + 52, true);

                if (["T_Cube", "T_Cube_Array"].includes(texture._type)) {
                    texture.arrayCount = 6;
                };
                
                return [texture, offset + 56];
            case 2019914798: // .tex (NieR Automata Switch)
                texture.format = view.getUint32(offset + 4, true);
                // texture.unknown = view.getUint32(offset + 8, true);
                texture.width = view.getUint32(offset + 12, true);
                texture.height = view.getUint32(offset + 16, true);
                texture.depth = view.getUint32(offset + 20, true);
                texture.mipCount = view.getUint32(offset + 24, true);
                // texture.unknown2 = view.getUint32(offset + 28, true); // always 256?
                // texture.somedecimal = view.getFloat16(offset + 32, true);
                // texture.unknown3 = view.getUint32(offset + 34, true);

                // values not shown in header; make a guess?
                texture.type = 0x1;
                texture.textureLayout = 0x4;

                // credit: MasaGratoR
                if (texture.height > 256) {
                    texture.arrayCount = 1;
                } else if (texture.height > 128) {
                    texture.arrayCount = 4;
                } else {
                    texture.arrayCount = 2;
                }

                console.log(texture.format)
                
                return [texture, offset + 0x100];
            case 71: // NieR Automata DXT1
                texture.format = 0x42;
                return [texture, offset + 20];
            case 74: // NieR Automata DXT3
                texture.format = 0x42;
                return [texture, offset + 20];
            case 77: // NieR Automata DXT5
                texture.format = 0x42;
                return [texture, offset + 20];
            default:
                console.warn("Unknown texture magic: " + magic);
        }
        return [texture, offset + 0x100]
    }

    // share code for extracting texture data
    private getTextureData(wtpTexture: ArrayBuffer) {
        let wtpImageData = wtpTexture.slice(this.offset, this.offset + this.size);
        
        if (gameSupport[this.game].deswizzlingRequired) {
            // deswizzle
            let blockHeightLog2 = this.textureLayout & 7;
            wtpImageData = loadImageData(
                this._format,
                this.width,
                this.height,
                this.depth,
                this.arrayCount,
                this.mipCount,
                wtpImageData,
                blockHeightLog2
            ) || new ArrayBuffer(0);

            if (wtpImageData.byteLength === 0)
                throw new Error("Texture swizzling failed!");
        } else if (this.width === 0 || this.height === 0) {
            // Unknown data: Get texture data from DDS header
            let view = new DataView(wtpImageData);
            
            if (view.getUint32(0, true) !== 542327876) throw new Error("Invalid DDS header!");

            this.headerSize = view.getUint32(4, true);
            this.width = view.getUint32(12, true);
            this.height = view.getUint32(16, true);
            this.depth = 1;

            console.log(`Unknown texture: ${this.identifier} (${this.width}x${this.height}x${this.depth})`)
            
            switch(view.getUint32(84, true)) {
                case 827611204: // DXT1
                    this.format = 0x42;
                    break;
                case 861165636: // DXT3
                    this.format = 0x43;
                    break;
                case 894720068: // DXT5
                    this.format = 0x44;
                    break;
                case 959535172: // DX10
                    this.format = 0x50;
                    break;
                default:
                    console.warn(`Unknown DDS format: ${view.getUint32(84, true)}. This texture may not load correctly.`)
            }

            // Have only image data in the final product, no header
            wtpImageData = wtpImageData.slice(Math.ceil(this.headerSize / 16) * 16);
        }

        return wtpImageData
    }

    /**
     * Loads a texture into a canvas.
     * @returns 
     */
    load(wtpTexture: ArrayBuffer, canvas?: HTMLCanvasElement) {
        let wtpImageData = this.getTextureData(wtpTexture);

        if (this._format.includes('ASTC')) {
            // ASTC
            canvas = loadASTC(this._format, this.width, this.height, this.depth, wtpImageData, canvas);
        } else {
            // DDS
            canvas = loadDDS(this._format, this.width, this.height, this.depth, wtpImageData, canvas);
        }

        return canvas;
    }

    /**
     * Returns an ArrayBuffer of the texture as a file.
     */
    download(wtpTexture: ArrayBuffer) {
        let wtpImageData = this.getTextureData(wtpTexture);

        if (this._format.includes('ASTC')) {
            // ASTC
            return addASTCHeader(this._format, this.width, this.height, this.depth, wtpImageData);
        } else {
            // DDS
            return addDDSHeader(this._format, this.width, this.height, this.depth, wtpImageData);
        }
    }
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    // ... Do some cool extraction magic here ...

    let arrayBuffer = await file.read();
    const view = new DataView(arrayBuffer);

    const header = {
        magic: view.getUint32(0, true),
        unk: view.getUint32(4, true),
        textureCount: view.getUint32(8, true),
        textureOffsetArrayOffset: view.getUint32(12, true),
        textureSizeArrayOffset: view.getUint32(16, true),
        unkArrayOffset1: view.getUint32(20, true),
        textureIdentifierArrayOffset: view.getUint32(24, true),
        unkArrayOffset2: view.getUint32(28, true)
    };

    let textures = [];
    let offset = header.unkArrayOffset2;
    for (var i = 0; i < header.textureCount; i++) {
        
        let [texture, newOffset] = WTATexture.extract(
            view,
            offset,
            view.getUint32(header.textureOffsetArrayOffset + i*4, true),
            view.getUint32(header.textureSizeArrayOffset + i*4, true),
            view.getUint32(header.textureIdentifierArrayOffset + i*4, true),
            view.getUint32(header.unkArrayOffset1 + i*4, true)
        )
        textures.push(texture);
        offset = newOffset;
    }

    return { textures };
}

export default extract;