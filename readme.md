# ChainPots

ChainPots is a generative NFT collection by memorycollector with limited supply and the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".


This project is using express.js with Jade template engine and p5.js.

## Installation

Use the node package manager [npm](https://nodejs.org/en/) to install all modules.

```bash
npm i
```

## Usage

Set your Infura API key in utils & app.js files.
Then run
```node
npm run start
```

when you are on localhost, token endpoint won't work unless you disable caching code. Keep that in mind.



## Structure

```
chainpots/
├─ node_modules/
├─ public/
│  ├─ javascripts/
│  │  ├─ app.js
│  │  ├─ abi.js
│  │  ├─ metadata.js
│  │  ├─ nft.js
│  │  ├─ random.js
│  │  ├─ p5.min.js
├─ views/
│  ├─ error.jade
│  ├─ generator.jade
│  ├─ index.jade
│  ├─ layout.jade
├─ routes/
│  │  ├─ lib/
│  │  │  ├─ thumbnail.js
│  │  ├─ generator.js
│  │  ├─ token.js
│  │  ├─ index.js
├─ .gitignore
```

## Guide
##### All API routes can be found in routes folder.
##### app.js -> contains the core logic of minting & fetching the totalSupply.
##### generator.js -> this is where the ChainPot is drawn on canvas and served to marketplaces or just view it fullscreen.
##### token.js -> creates whole metadata for the token. this is where marketplaces send requests to get your token metadata. also can be found in contract by calling tokenURI.


## License
[Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)

## p5js script is derivated from the source below
https://openprocessing.org/sketch/1227657


Changes made:
-Edited the canvas properties
-Added random number generator from the token hash coming from the backend.
-Added color schemas and edited the draw function


