import type PlatinumFileReader from "../../lib/PlatinumFileReader";

export interface FileData {
    // whatever the extract function returns; here's some sample data
    chars: Char[];
    events: Event[];
    charGraphs: CharGraph[];
    specialGraphs: SpecialGraph[];
    usedEvents: UsedEvent[];
}

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
        }>
    }>
}

interface CharGraph {
    textureID: number,
    u1: number,
    v1: number,
    u2: number,
    v2: number,
    width: number,
    height: number,
    belowSpacing: number,
    horizontalSpacing: number,
}

interface SpecialGraph {
    languageFlag: number,
    width: number,
    height: number,
    belowSpacing: number,
    horizontalSpacing: number,
}

interface UsedEvent {
    hash: number,
    index: number,
    event: Event;
    name: string;
}

function readLetter(chars: Char[], n: [number, number]) {
    if (n[0] <= 0x8000) {
        return chars[n[0]] ? chars[n[0]]['char'] : `<Char${n[0]}>`
    } else if (n[0] == 0x8001) {
        return " "
    } else if (n[0] == 0x8020) {
        // button - copied from bayonetta_tools
        const keycodes = {
            9: "+",
            10: "-",
            11: "B",
            12: "A",
            13: "Y",
            14: "X",
            15: "R",
            16: "L",
            17: "DPadUpDown",
            18: "DPadLeftRight",
            19: "RightStick",
            20: "RightStickPress",
            21: "LeftStick",
            22: "LeftStickPress",
            23: "LeftStickRotate",
            24: "LeftStickUpDown"
        }
        // @ts-ignore
        return `[BTN: ${keycodes[n[1]]}]`
    } else {
        return `<Special0x${n[0]}_${n[1]}`
    }
}

async function extract(file: PlatinumFileReader): Promise<FileData> {
    // ... Do some cool extraction magic here ...
    let arrayBuffer = await file.read();
    let view = new DataView(arrayBuffer);

    let header = {
        offsetEvents: view.getUint32(0, true),
        eventCount: view.getUint32(4, true),
        offsetCharSet: view.getUint32(8, true),
        charCount: view.getUint32(12, true),
        offsetCharGraphs: view.getUint32(16, true),
        charGraphsCount: view.getUint32(20, true),
        offsetSpecialGraphs: view.getUint32(24, true),
        specialGraphsCount: view.getUint32(28, true),
        offsetUsedEvents: view.getUint32(32, true),
        usedEventCount: view.getUint32(36, true)
    }

    console.log(header);

    let chars = [];
    for (let i = 0; i < header.charCount; i++) {
        chars.push({
            code: view.getUint16(40 + i * 8, true),
            positionOffset: view.getUint16(40 + i * 8 + 4, true),

            lang: view.getUint16(header.offsetCharSet + i * 8, true),
            char: String.fromCharCode(view.getUint16(header.offsetCharSet + 2 + i * 8, true)),
            index: view.getUint32(header.offsetCharSet + 4 + i * 8, true)
        })
    }

    let pos = [header.offsetEvents, 0, 0]
    let events = []
    for (let x = 0; x < header.eventCount; x++) { // EVENTS
        let paragraphs = []
        let eventHeader = {
            paragraphOffset: view.getUint32(pos[0], true),
            paragraphCount: view.getUint32(pos[0] + 4, true),
            sequenceNumber: view.getUint32(pos[0] + 8, true),
            eventID: view.getUint32(pos[0] + 12, true)
        }
        pos[0] += 16;
        pos[1] = eventHeader.paragraphOffset;
        
        for (let y = 0; y < eventHeader.paragraphCount; y++) { // PARAGRAPHS
            let strings = []
            let paragraphHeader = {
                stringOffset: view.getUint32(pos[1], true),
                stringCount: view.getInt32(pos[1] + 4, true),
                belowSpacing: view.getFloat32(pos[1] + 8, true),
                horizontalSpacing: view.getFloat32(pos[1] + 12, true),
                languageFlags: view.getUint16(pos[1] + 16, true),
                unk: view.getUint16(pos[1] + 18, true)
            }

            pos[1] += 20;
            pos[2] = paragraphHeader.stringOffset;
            for (let z = 0; z < paragraphHeader.stringCount; z++) { // STRINGS
                let stringHeader = {
                    stringOffset: view.getUint32(pos[2], true),
                    //u_a: view.getUint32(pos[2] + 4, true), // always zero
                    length: view.getUint32(pos[2] + 8, true),
                    length2: view.getUint32(pos[2] + 12, true),
                    belowSpacing: view.getFloat32(pos[2] + 16, true),
                    horizontalSpacing: view.getFloat32(pos[2] + 20, true)
                }
                //console.log(f"## {x} string header: {stringHeader}")
                pos[2] += 24;
                let stringLetters = [];
                for (var c = 0; c < (stringHeader.length - 1)/2; c++) {
                    stringLetters.push(readLetter(chars, [view.getUint16(stringHeader.stringOffset + c * 4, true), view.getInt16(stringHeader.stringOffset + 2 + c * 4, true)]))
                }
                let terminator = view.getUint16(stringHeader.stringOffset + stringLetters.length*4);
                strings.push({
                    header: stringHeader,
                    text: stringLetters.join(""),
                    terminator
                })
                //break
            }
            paragraphs.push({
                header: paragraphHeader,
                strings
            })
        }
        events.push({
            header: eventHeader,
            paragraphs
        })
    }

    // char graphs
    let charGraphs = [];
    for (var x = 0; x < header.charGraphsCount; x++) {
        charGraphs.push({
            textureID: view.getUint32(header.offsetCharGraphs + x*40, true),
            u1: view.getFloat32(header.offsetCharGraphs + 4 + x*40, true),
            v1: view.getFloat32(header.offsetCharGraphs + 8 + x*40, true),
            u2: view.getFloat32(header.offsetCharGraphs + 12 + x*40, true),
            v2: view.getFloat32(header.offsetCharGraphs + 16 + x*40, true),
            width: view.getFloat32(header.offsetCharGraphs + 20 + x*40, true),
            height: view.getFloat32(header.offsetCharGraphs + 24 + x*40, true),
            //unk: view.getFloat32(header.offsetCharGraphs + 28 + x*40, true), // this is always zero
            belowSpacing: view.getFloat32(header.offsetCharGraphs + 32 + x*40, true),
            horizontalSpacing: view.getFloat32(header.offsetCharGraphs + 36 + x*40, true)
        })
    }
    let specialGraphs = []
    for (let x = 0; x < header.specialGraphsCount; x++) {
        specialGraphs.push({
            languageFlag: view.getUint32(header.offsetSpecialGraphs + x * 20, true),
            width: view.getFloat32(header.offsetSpecialGraphs + 4 + x * 20, true),
            height: view.getFloat32(header.offsetSpecialGraphs + 8 + x * 20, true),
            belowSpacing: view.getFloat32(header.offsetSpecialGraphs + 12 + x * 20, true),
            horizontalSpacing: view.getFloat32(header.offsetSpecialGraphs + 16 + x * 20, true),
        })
    }

    let usedEvents = []
    let decoder = new TextDecoder();
    for (let x = 0; x < header.usedEventCount; x++) {
        let eventIndex = view.getUint32(header.offsetUsedEvents + x*40 + 4, true);
        let name = decoder.decode(
            arrayBuffer.slice(
                header.offsetUsedEvents + x*40 + 8,
                header.offsetUsedEvents + (x+1)*40
            )
        ).replace(/\0/gm, "");
        
        usedEvents.push({
            hash: view.getUint32(header.offsetUsedEvents + x*40, true),
            index: eventIndex,
            event: events[eventIndex],
            name
        })
    }

    if (usedEvents.length !== events.length) {
        console.warn(`The event list is ${events.length-usedEvents.length} items longer than what is used (usedEvents). There may be unused events.`)
    }

    return { chars, events, charGraphs, specialGraphs, usedEvents };
}

export default extract;