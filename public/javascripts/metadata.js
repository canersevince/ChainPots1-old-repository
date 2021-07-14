class Random {
    constructor(seed) {
        this.seed = seed
    }

    random_dec() {
        this.seed ^= this.seed << 13
        this.seed ^= this.seed >> 17
        this.seed ^= this.seed << 5
        return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
    }

    random_between(a, b) {
        return a + (b - a) * this.random_dec()
    }

    random_int(a, b) {
        return Math.floor(this.random_between(a, b + 1))
    }

    random_choice(x) {
        return x[Math.floor(this.random_between(0, x.length * 0.99))]
    }
}


let colorNames = [
    "Fainted Mind",
    "Saffron",
    "Pipolar",
    "Persian",
    "Tokenized Retro",
    "Sky is Lava",
    "Berry Lover",
    "Yucky Eggplant Meal",
    "Indigo Child",
    "Strawmelon",
    "Pale Lava",
    "Dutch Platinum",
    "Mauve Dreams",
    "Carrot and Raspberry",
    "Mellow Blue Crayola",
    "Cinnamon Terra Cotta",
    "Fiery Midnight",
    "Lavender",
    "Gloomy Bitch",
    "Cotton Candy MF",
    "Sex On Da Beach",
    "Creepy Old Mailman",
    "Unicorn Puke",
    "Rainbow Poop",
    "Unicorn Pee",
    "Manic Anxiety",
    "Hallucinative Diarrhea",
    "Monochrome Constipation",
    "Happily Depressed Soul",
]


module.exports = function getAttributes(hash) {
    let seed = parseInt(hash.slice(0, 16), 16);
    let rng = new Random(seed);
    let palettes = [
        "333333-839788-eee0cb-baa898-bfd7ea", // fainted mind
        "585123-eec170-f2a65a-f58549-772f1a", // saffron
        "fbf5f3-e28413-000022-de3c4b-c42847", // bipolar
        "0fa3b1-d9e5d6-eddea4-f7a072-ff9b42", // persian
        "10002b-240046-5a189a-9d4edd-e0aaff", // tokenized retro
        "0466c8-023e7d-001845-33415c-7d8597", // sky is lava
        "861657-a64253-d56aa0-bbdbb4-fcf0cc", // berry lover
        "493843-61988e-a0b2a6-cbbfbb-eabda8", // yucky eggplant meal
        "031d44-04395e-70a288-dab785-d5896f", // indigo child
        "ff0a54-ff5c8a-ff85a1-fbb1bd-f7cad0", // strawmelon
        "463f3a-8a817c-bcb8b1-f4f3ee-e0afa0", // pale lava
        "dd6e42-e8dab2-4f6d7a-c0d6df-eaeaea", // dutch platinum
        "ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff", // mauve dreams
        "aa8f66-ed9b40-ffeedb-61c9a8-ba3b46", // carrot and raspberry
        "a57548-fcd7ad-f6c28b-5296a5-82ddf0", // mellow blue crayola
        "713e5a-63a375-edc79b-d57a66-ca6680", // cinnamon terra cotta
        "114b5f-456990-e4fde1-f45b69-6b2737", // fiery midnight
        "edf2fb-e2eafc-ccdbfd-c1d3fe-abc4ff", // lavender
        "9cafb7-ead2ac-fe938c-e6b89c-4281a4", //gloomyBitch
        "7bdff2-b2f7ef-eff7f6-f7d6e0-f2b5d4", //cottonCandyMadafaka
        "ffcdb2-ffb4a2-e5989b-b5838d-6d6875", //sunnyCaliforniasexOnDaBeach
        "f2d7ee-d3bcc0-a5668b-69306d-0e103d", //creepyOldMailman
        "ffbe0b-fb5607-ff006e-8338ec-3a86ff", //unicornPuke
        "9b5de5-f15bb5-fee440-00bbf9-00f5d4", //Rainbow Crap/Poop
        "fee440-f15bb5-9b5de5-00bbf9-00f5d4", //unicorn Pee
        "181a99-5d93cc-454593-e05328-e28976", //Manic Anxiety
        "F61067-5E239D-00F0B5-6DECAF-F4F4ED", //HallucinativeDiarrhea
        "f8f9fa-dee2e6-adb5bd-495057-212529", // Monochrome Constipation
        "212529-000000-adb5bd-495057-f8f9fa", // HappilyDepressedSoul
    ].map(palette => palette.split('-').map(c => '#' + c))
    let palette = rng.random_choice(palettes);
    let timeRandomness = rng.random_between(0, 1)
    let isNight = timeRandomness < 0.05;
    let stairnum = rng.random_int(3, 6);
    let gridsize = rng.random_int(8, 36)
    let paletteIndex = palettes.indexOf(palette)
    console.log({paletteIndex})
    return [
        {
            "trait_type": "Stair Count",
            "value": stairnum
        },
        {
            "trait_type": "Light Tone",
            "value": isNight ? "dark" : "light"
        },
        {
            "trait_type": "Grid Size",
            "value": gridsize
        },
        {
            "trait_type": "Palette",
            "value": colorNames[paletteIndex]
        },
        {
            "trait_type": "Palette Colors",
            "value": palette
        },
    ]
}