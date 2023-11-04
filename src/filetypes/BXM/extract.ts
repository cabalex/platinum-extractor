import type PlatinumFileReader from "../../lib/PlatinumFileReader";

export interface Node {
    name: string;
    value: string;
    attributes: {[key: string]: string};
    children: Node[];
}

export interface FileData {
    data: Node;
    encoding: "SHIFT-JIS"|"UTF-8";
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    let arrayBuffer = await file.read();
    let encoding: "SHIFT-JIS"|"UTF-8" = "SHIFT-JIS";
    if (arrayBuffer.byteLength < 4) return {data: null, encoding};
    // stuff is in BIG ENDIAN
    const view = new DataView(arrayBuffer)
    // magic - 0-4 - magic may be BXM\x00 or XML\x00
    // unk (flags?) - 4-8
    const nodeCount = view.getUint16(8);
    let dataCount = view.getUint16(10);
    const dataSize = view.getUint32(12);
    if (dataSize > 90000) {
        // this is completely arbitrary; though ive found it works mostly?
        // this issue only occurs on route BXMs in the ph_/ folders; i'm not sure why
        // maybe i should limit it to file name but that seems strange
        dataCount *= 2
    }

    // node info starts at 0x10 (16)
    let nodeInfo: Array<[number, number, number, number]> = [];
    let offset = 16;
    for (var i = 0; i < nodeCount; i++) {
        nodeInfo.push([view.getUint16(offset), view.getUint16(offset+2), view.getUint16(offset+4), view.getUint16(offset+6)])
        offset += 8;
    }

    const dataOffsetsOffset = offset;
    let dataOffsets: Array<[number, number]> = [];
    for (var i = 0; i < dataCount; i++) {
        dataOffsets.push([view.getUint16(offset), view.getUint16(offset+2)])
        // name offset - 0
        // value offset - 1
        offset += 4;
    }
    let enc = new TextDecoder("SHIFT-JIS");
    let encAlt = new TextDecoder("UTF-8");

    function readString(pos: number) {
        pos = pos + offset;
        var tmppos = pos;
        while (tmppos < arrayBuffer.byteLength && view.getUint8(tmppos) != 0) {
            tmppos += 1;
        }
        var decoded = enc.decode(arrayBuffer.slice(pos, tmppos));
        if (decoded.includes("�")) {
            // quest data is in UTF-8; must support both formats
            decoded = encAlt.decode(arrayBuffer.slice(pos, tmppos));
            encoding = "UTF-8";
        }
        return decoded;
    }
    function readTree(nodeNum: number): Node {
        var node = nodeInfo[nodeNum];
        // child count - 0
        // first child index/next sibling list index - 1
        // attribute count - 2
        // data index - offset inside the data offset table - 3
        var name = "";
        var value = "";
        
        if (dataOffsets[node[3]][0] != -1) {
            name = readString(dataOffsets[node[3]][0])
        }
        if (dataOffsets[node[3]][1] != -1) {
            value = readString(dataOffsets[node[3]][1])
        }
        let outputNode = {
            name: name,
            attributes: {},
            value: value,
            children: [] 
        }

        // attributes
        if (node[2] > 0) {
            for (var i = 0; i < node[2]; i++) {
                var attrname = "";
                var attrvalue = "";
                if (dataOffsets[node[3]+i+1][0] != -1) {
                    attrname = readString(dataOffsets[node[3]+i+1][0])
                }
                if (dataOffsets[node[3]+i+1][1] != -1) {
                    attrvalue = readString(dataOffsets[node[3]+i+1][1])
                }
                outputNode.attributes[attrname] = attrvalue;
            }
        }
        // children
        if (node[0] > 0) {
            var childNodeNum = node[1];
            for (var i = 0; i < node[0]; i++) {
                outputNode.children.push(readTree(childNodeNum+i))
            }
        }
        return outputNode;
    }
    //console.log(`reading tree... ${nodeCount} nodes, ${dataCount} data offsets, ${dataSize} total data size`)
    // read tree to object
    let doc = readTree(0);
    
    return {data: doc, encoding};
}

export default extract;