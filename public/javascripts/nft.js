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

let WH = Math.min(window.innerWidth, window.innerHeight)
let WIDTH = WH
let HEIGHT = WH
let tokenData = { "hash": "0xb871cd70edae9a70815520d7e7ea2d65ded3912b02d3f6e283e5f5fad167b313" }
//let tokenData = { "hash": "0xb871cd70edae9a70815520d7e7ea2d65ded3912b02d3f6e283e5f5fad167b313" }
let seed = parseInt(tokenData.hash.slice(0, 16), 16);
let rng = new Random(seed);
let renderer;
let castle;
let timeval;
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
const ColorPalette = Object.freeze({
    "dark": palette[1],
    "light": palette[3],
    "shadow": palette[2],
    "shade" : palette[0],
    "white" : palette[4]
});
let timeRandomness = rng.random_between(0,1)
let isNight = timeRandomness < 0.05;
let stairnum = rng.random_int(3,6);
let gridsize = rng.random_int(8,36)
function setup() {
    renderer = createCanvas(WIDTH, HEIGHT, WEBGL);
    ortho(-width/2, width/2, -height/2, height/2, 0.01, 10000);
    castle = new Castle();
}
function draw() {
    background(ColorPalette.shadow);
    noiseSeed(seed);
    let minval = -0.8;
    let maxval = 0.5;
    timeval = timeRandomness + 0.5
    directionalLight(lerpColor(color(0), color(ColorPalette.shade), timeval), 0.5, 1.0, -1.0);
    ambientLight(lerpColor(color(255), isNight ? color(30) : color(220), timeval));
    castle.draw();
}
function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
}
function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
}
class Castle{
    constructor(){
        this.setup();
    }

    setup(){
        let maxnum = rng.random_int(2,20);
        this.size = min(WIDTH, HEIGHT) / gridsize * 1.7;
        this.x = gridsize;
        this.y = gridsize;

        this.positions = [];
        this.heights = [];
        this.stairinfos = [];
        this.windowinfos = [];

        for(let n=0; n<this.y; n++){
            let ii = 1;
            for(let i=0; i<this.x; i++){
                let pos = createVector(i * this.size, 0, n * this.size);
                this.positions.push(pos);
                let rng9 = rng.random_between(0,1)
                if(pow(rng9, 3) < 0.1){
                    ii++;
                }
                let t = n / (this.y - 1.0);
                t = pow(t, 0.5);
                this.heights.push(this.size * ceil(max(ii * t, 1)));
            }
        }

        for(let n=0; n<this.y-1; n++){
            for(let i=0; i<this.x-1; i++){
                let index1 = n * this.x + i;
                let index2 = n * this.x + i + 1;
                let index3 = (n + 1) * this.x + i;
                let h1 = this.heights[index1];
                let h2 = this.heights[index2];
                let h3 = this.heights[index3];
                let rng1 = rng.random_between(0,1)
                if(rng1 < 0.5){
                    if(h1 + this.size == h2) {
                        let rng4 = rng.random_between(0,1)
                        this.stairinfos.push([index1, 1, rng4]);
                    }
                    else if(h1 + this.size == h3){
                        let rng5 = rng.random_between(0,1)
                        this.stairinfos.push([index1, 0, rng5]);
                    }
                }

                if(h1 < h2){
                    for(let t=h1; t<h2-1; t+= this.size){
                        let rng2 = rng.random_between(0,1)
                        if(rng2 < 0.3){
                            let rng7 = rng.random_int(1, maxnum)
                            let size = map(rng7, 1, maxnum-1, 0.2, 0.4);
                            this.windowinfos.push([index1, 1, t, size]);
                        }
                    }
                }

                if(h1 < h3){
                    for(let t=h1; t<h3-1; t+= this.size){
                        let rng3 = rng.random_between(0,1)
                        if(rng3 < 0.3){
                            let rng8 = rng.random_int(1, maxnum)
                            let size = map(floor(rng8, 1, maxnum-1, 0.2, 0.4));
                            this.windowinfos.push([index1, 0, t, size]);
                        }
                    }
                }
            }
        }
    }

    draw(){
        // stroke(100);
        noStroke();

        push();
        rotateX(radians(150));
        rotateY(radians(-45));
        translate(- this.x * 0.5 * this.size,  - this.size * this.y * 0.2, - this.y * 0.5 * this.size);


        let scaleval = map(timeval, 0.0, 1.0, 0.0001, 1.0);
        scaleval = easeOutElastic(scaleval);
        scale(1.0, scaleval, 1.0);

        this.drawBlocks();

        for(let i=0; i<this.stairinfos.length; i++){
            let stairinfo = this.stairinfos[i];
            this.drawStairByIndex(stairinfo);
        }

        ambientMaterial(lerpColor(color(ColorPalette.shadow), color(ColorPalette.dark), timeval));
        for(let i=0; i<this.windowinfos.length; i++){
            let windowinfo = this.windowinfos[i];
            this.drawWindowByIndex(windowinfo);
        }
        pop();
    }

    drawBlocks(){
        for(let i=0; i<this.positions.length; i++){
            push();
            let pos = this.positions[i];
            let h = this.heights[i];
            let val = h / (this.y * this.size * 0.5);
            let col = lerpColor(color(ColorPalette.shadow), color(ColorPalette.light), val);
            col = lerpColor(color(ColorPalette.shadow), col, timeval);
            ambientMaterial(col);
            translate(pos.x , pos.y + h * 0.5 , pos.z );
            scale(this.size, h, this.size);
            box(1.0);
            pop();
        }
    }

    drawWindowByIndex(windowinfo){
        let index = windowinfo[0];
        let dir = windowinfo[1];
        let hadd = windowinfo[2];
        let sc = windowinfo[3];
        let h = this.heights[index];
        let pos = this.positions[index];


        push();
        translate(pos.x , pos.y + this.size * 0.5 + hadd, pos.z );
        rotateY(-HALF_PI * dir);
        translate(0,0, (-this.size * 0.5 + 0.1) * (dir - 0.5) * 2);
        plane(this.size * sc, this.size * sc);
        pop();
    }

    drawStairByIndex(stairinfo){
        let index = stairinfo[0];
        let dir = stairinfo[1];
        let shift = stairinfo[2];

        let pos = this.positions[index];
        let h = this.heights[index];

        let val = h / (this.y * this.size * 0.5);

        let stepsize = this.size / stairnum;
        let col = lerpColor(color(ColorPalette.shadow), color(ColorPalette.light), val);
        col = lerpColor(color(ColorPalette.shadow), col, timeval);
        ambientMaterial(col);
        push();
        translate(pos.x, h + pos.y, pos.z );
        rotateY(HALF_PI * dir);
        translate(0,0,-this.size * 0.5);
        for(let i=1; i<stairnum; i++){
            push();
            let minval = -0.5;
            let maxval = 0.5;
            let sanim = map(constrain(sin(radians(frameCount * 1) + shift * TWO_PI), minval, maxval), minval, maxval, 0, 1.0);
            sanim = max(0.0001, easeInOutQuart(sanim));
            translate(0,stepsize * i * 0.5 * sanim, stepsize * 0.5 + stepsize * i);
            scale(this.size, stepsize * i * sanim, stepsize);
            box(1.0);
            pop();
        }
        pop();
    }
}