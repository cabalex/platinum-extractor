export enum games {
    PlatinumGeneric, // for generic platinum games
    AstralChain,
    NieRReplicant,
    NieRAutomata,
    NieRAutomataSwitch,
    MetalGearRisingRevengence,
    Bayonetta1PC,
    Bayonetta1Switch,
    Bayonetta2WiiU,
    Bayonetta2Switch,
    Bayonetta3,
    StarFoxZero,
    StarFoxGuard,
    TransformersDevastation,
    Vanquish,
    Wonderful101,
    Wonderful101Remastered,
    Wonderful101RemasteredSwitch,
}
export enum platforms {
    PC,
    Switch,
    WiiU
}

const gameSupport = {
    [games.PlatinumGeneric]: {
        platform: platforms.PC,
        name: 'Unknown Platinum Game',
        deswizzlingRequired: false,
        astc: false
    },
    [games.AstralChain]: {
        platform: platforms.Switch,
        name: 'Astral Chain',
        deswizzlingRequired: true,
        astc: true
    },
    [games.NieRReplicant]: {
        platform: platforms.PC,
        name: 'NieR Replicant',
        deswizzlingRequired: false,
        astc: false
    },
    [games.NieRAutomata]: {
        platform: platforms.PC,
        name: 'NieR Automata',
        deswizzlingRequired: false,
        astc: false
    },
    [games.NieRAutomataSwitch]: {
        platform: platforms.Switch,
        name: 'NieR Automata Switch',
        deswizzlingRequired: true,
        astc: true
    },
    [games.MetalGearRisingRevengence]: {
        platform: platforms.PC,
        name: 'Metal Gear Rising: Revengence',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Bayonetta1PC]: {
        platform: platforms.PC,
        name: 'Bayonetta 1 PC',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Bayonetta1Switch]: {
        platform: platforms.Switch,
        name: 'Bayonetta 1 Switch',
        deswizzlingRequired: true,
        astc: true
    },
    [games.Bayonetta2WiiU]: {
        platform: platforms.WiiU,
        name: 'Bayonetta 2 Wii U',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Bayonetta2Switch]: {
        platform: platforms.Switch,
        name: 'Bayonetta 2 Switch',
        deswizzlingRequired: true,
        astc: true
    },
    [games.Bayonetta3]: {
        platform: platforms.Switch,
        name: 'Bayonetta 3',
        deswizzlingRequired: true,
        astc: true
    },
    [games.StarFoxZero]: {
        platform: platforms.WiiU,
        name: 'Star Fox Zero',
        deswizzlingRequired: false,
        astc: false
    },
    [games.StarFoxGuard]: {
        platform: platforms.WiiU,
        name: 'Star Fox Guard',
        deswizzlingRequired: false,
        astc: false
    },
    [games.TransformersDevastation]: {
        platform: platforms.PC,
        name: 'Transformers Devastation',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Vanquish]: {
        platform: platforms.PC,
        name: 'Vanquish',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Wonderful101]: {
        platform: platforms.WiiU,
        name: 'Wonderful 101',
        deswizzlingRequired: false,
        astc: false
    },
    [games.Wonderful101Remastered]: {
        platform: platforms.PC,
        name: 'Wonderful 101 Remastered PC',
        deswizzlingRequired: true,
        astc: true
    },
    [games.Wonderful101RemasteredSwitch]: {
        platform: platforms.Switch,
        name: 'Wonderful 101 Remastered Switch',
        deswizzlingRequired: true,
        astc: true
    }
}

export default gameSupport;