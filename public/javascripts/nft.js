
let tokenData = { "hash": "0x311212f7717479a0afde9357db37dbb6de85321e6529900b191d7dda3ad89e8e" }
//let tokenData = { "hash": "0xb871cd70edae9a70815520d7e7ea2d65ded3912b02d3f6e283e5f5fad167b313" }
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

//let tokenData = { "hash": "0xb871cd70edae9a70815520d7e7ea2d65ded3912b02d3f6e283e5f5fad167b313" }
let seed = parseInt(tokenData.hash.slice(0, 16), 16);
let rng = new Random(seed);
let palettes = [
    "333333-839788-eee0cb-baa898-bfd7ea", //
    "585123-eec170-f2a65a-f58549-772f1a",
    "fbf5f3-e28413-000022-de3c4b-c42847",
    "0fa3b1-d9e5d6-eddea4-f7a072-ff9b42",
    "10002b-240046-5a189a-9d4edd-e0aaff",
    "0466c8-023e7d-001845-33415c-7d8597",
    "861657-a64253-d56aa0-bbdbb4-fcf0cc",
    "493843-61988e-a0b2a6-cbbfbb-eabda8",
    "031d44-04395e-70a288-dab785-d5896f",
    "ff0a54-ff5c8a-ff85a1-fbb1bd-f7cad0",
    "463f3a-8a817c-bcb8b1-f4f3ee-e0afa0",
    "dd6e42-e8dab2-4f6d7a-c0d6df-eaeaea",
    "ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff",
    "aa8f66-ed9b40-ffeedb-61c9a8-ba3b46",
    "a57548-fcd7ad-f6c28b-5296a5-82ddf0",
    "713e5a-63a375-edc79b-d57a66-ca6680",
    "114b5f-456990-e4fde1-f45b69-6b2737",
    "edf2fb-e2eafc-ccdbfd-c1d3fe-abc4ff",
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
let aObj$ = [];
let bG;
let on$
let nsr$
let noiseStepObj
let offset$
let nsdt$
let npd$
let ddn$

function setup() {
    bG = color(palette[0]);
    noiseSeed(seed)
    let cSize$;
    if (windowWidth <= windowHeight) {
        cSize$ = windowWidth;
    } else {
        cSize$ = windowHeight;
    }
    let renderer = createCanvas(cSize$, cSize$);
    renderer.canvas.classList.add("stairwayRenderer")

    frameRate(34);
    noStroke();
    on$ = rng.random_int(20, 100)
    ddn$ = rng.random_int(30, 180);
    let rm$ = width / 10 * 12;
    let yGap = height / on$ / 1.5;
    nsr$ = rng.random_int(0, 10);
    noiseStepObj = rng.random_between(0.001, 0.1);
    offset$ = -0.5;
    nsdt$ = rng.random_int(0, 10);
    npd$ = rng.random_between(0.001,0.01);
    for (let i = 0; i < on$; i++) {
        let myV$ = new V$(rm$, i, on$, yGap,
            ddn$, nsr$, nsdt$ + i * noiseStepObj,
            npd$, offset$);
        aObj$.push(myV$);
    }
}

class V$ {
    constructor(rm$, oi$, on$, yGap,
                ddn$, nsr$, nsdt$,
                npd$, offset$) {
        this.cX$ = 0;
        this.cY$ = yGap * (on$ - oi$) - height / 3;
        this.rm$ = rm$;
        this.color = rng.random_choice(palette);
        this.ddn$ = ddn$;
        this.nsr$ = nsr$;
        this.nsdt$ = nsdt$;
        this.npd$ = npd$;
        this.offset$ = offset$;
    }

    draw$() {
        this.nsdt$ += this.npd$;
        fill(this.color);
        let d = 1;
        let rx_0;
        let ry_0;
        let rxl$;
        let ryl$;
        beginShape();
        for (let i = 0; i < this.ddn$; i++) {
            let tgti$ = i;
            if (tgti$ >= this.ddn$) {
                tgti$ -= this.ddn$;
            }
            let mang$ = 2 * PI / this.ddn$ * tgti$;
            let rx = this.rm$ * (noise(this.nsr$, this.nsdt$) + this.offset$) ** d * cos(mang$);
            let ry = this.rm$ * (noise(this.nsr$, this.nsdt$) + this.offset$) ** d * sin(mang$) / 2.5;
            if (tgti$ == 0) {
                rx_0 = rx;
                ry_0 = ry;
            } else if (tgti$ == this.ddn$ - 2) {
                rxl$ = rx;
                ryl$ = ry;
            } else if (tgti$ == this.ddn$ - 1) {
                rx = (rx_0 + rxl$) / 2;
                ry = (ry_0 + ryl$) / 2;
            }
            vertex(this.cX$ + rx, this.cY$ + ry);
        }
        beginContour();
        for (let i = 0; i < this.ddn$; i++) {
            let tgti$ = i;
            if (tgti$ >= this.ddn$) {
                tgti$ -= this.ddn$;
            }
            let mang$ = 2 * PI / this.ddn$ * tgti$;
            let rx = this.rm$ * (noise(this.nsr$, this.nsdt$ + 0.1) + this.offset$) ** d * cos(-mang$ + PI / 2);
            let ry = this.rm$ * (noise(this.nsr$, this.nsdt$ + 0.1) + this.offset$) ** d * sin(-mang$ + PI / 2) / 2.5;
            if (tgti$ == 0) {
                rx_0 = rx;
                ry_0 = ry;
            } else if (tgti$ == this.ddn$ - 2) {
                rxl$ = rx;
                ryl$ = ry;
            } else if (tgti$ == this.ddn$ - 1) {
                rx = (rx_0 + rxl$) / 2;
                ry = (ry_0 + ryl$) / 2;
            }
            vertex(this.cX$ + rx / 1.1, this.cY$ + ry / 1.1);
        }
        endContour();
        endShape();
    }
}

function draw() {
    if (frameCount % 7 == 0) {
        bG = lerpColor(color(palette[0]), color(palette[frameCount % 4]), .01);
        background(bG)
    } else {
        background(bG)
    }
    push();
    translate(width / 2, height / 2);
    for (let i = 0; i < aObj$.length; i++) {
        aObj$[i].draw$();
    }
    pop();
}