import { concatArrayBuffer } from "../../lib/arrayBufferTools";
import type { FileData, Node } from "./extract";

function repack(data: FileData) : ArrayBuffer {
    // This code is HORRIBLY MESSY and needs rewriting.
    // It's basically legacy code from the previous astral-extractor
    // that I never bothered to refactor. Oops!
    const enc = new TextEncoder();

    let nodeInfo: Array<[number, number, number, number]> = [];
    let dataOffsets: Array<number[]> = [];
    let strings: string[] = [];

    function calculateStringsLength(index: number) {
        var len = 0;
        for (var i = 0; i < index; i++) {
            len += enc.encode(strings[i]).byteLength + 1; // Zero-terminated C-strings
        }
        return len;
    }
    function applyToDataOffsets(dataoff: number[]) {
        var dataoffcount = 0;
        for (var i = 0; i < dataOffsets.length; i++) {
            if (dataOffsets[i].length == dataoff.length && dataOffsets[i].every((element, index) => element == dataoff[index])) {
                return dataoffcount/2;
            }
            dataoffcount += dataOffsets[i].length;
        }
        dataOffsets.push(dataoff);
        return dataoffcount/2;
    }
    function readTree(input: Node, iter: number) {
        // Create NodeInfo
        nodeInfo[iter] = [input.children.length, nodeInfo.length || 1, Object.keys(input.attributes).length, 0]; // last is filled in later!
        let dataOffset = [];
        // create DataOffsets for name, value, and [potential] attributes
        if (!strings.includes(input.name)) strings.push(input.name);

        dataOffset.push(calculateStringsLength(strings.indexOf(input.name)))

        if (input.value && input.value.toString()) {
            if (!strings.includes(input.value.toString())) strings.push(input.value.toString());

            dataOffset.push(calculateStringsLength(strings.indexOf(input.value.toString())))
        } else {
            dataOffset.push(0xFFFF)
        }

        for (const [key, value] of Object.entries(input.attributes)) {
            if (!strings.includes(key)) strings.push(key);

            dataOffset.push(calculateStringsLength(strings.indexOf(key)))
            
            if (value.toString()) {
                if (!strings.includes(value.toString())) strings.push(value.toString());
                dataOffset.push(calculateStringsLength(strings.indexOf(value.toString())))
            } else {
                dataOffset.push(0xFFFF)
            }
        }
        nodeInfo[iter][3] = applyToDataOffsets(dataOffset)
        const startChildren = nodeInfo.length; 
        nodeInfo = nodeInfo.concat(new Array(input.children.length))
        for (var i = 0; i < input.children.length; i++) {
            readTree(input.children[i], startChildren+i);
        }
    }
    readTree(data.data, 0);
    // Construct the BXM file
    // BXMs are big endian!!
    function swap16(val: number) {
        return ((val & 0xFF) << 8) | ((val >> 8) & 0xFF);
    }
    var newNodeInfo: number[] = []
    var newDataOffsets: number[] = []
    var newStrings = ""
    nodeInfo.map(function(item) {newNodeInfo.push(...item)})
    newNodeInfo = newNodeInfo.map(item => swap16(item))
    dataOffsets.map(function(item) {newDataOffsets.push(...item)})
    newDataOffsets = newDataOffsets.map(item => swap16(item))
    strings.map(function(item) {newStrings += item + "\x00"})
    var stringData = enc.encode(newStrings)
    var header = Uint16Array.from([19800, 76, 0, 0, swap16(nodeInfo.length), swap16(newDataOffsets.length/2)]);
    var stringDataLenBE = ((stringData.byteLength & 0xFF) << 24) | ((stringData.byteLength & 0xFF00) << 8) | ((stringData.byteLength >> 8) & 0xFF00) | ((stringData.byteLength >> 24) & 0xFF);
    return concatArrayBuffer(
        header.buffer,
        Uint32Array.from([stringDataLenBE]).buffer,
        Uint16Array.from(newNodeInfo).buffer,
        Uint16Array.from(newDataOffsets).buffer,
        stringData.buffer
    );
}

export default repack;