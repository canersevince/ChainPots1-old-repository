const {baseURI} = require('../../utils')
const puppeteer = require('puppeteer');         // Require Puppeteer module
const ipfsClient = require('ipfs-http-client')
let browser
const ipfsHost = "ipfs.infura.io"
const ipfs = ipfsClient.create({
    host: ipfsHost,
    port: 5001,
    protocol: "https",
})


// this was a complex thing to do since we are generating NFT when token is minted. i had to make this thumbnail creator.

// it basically creates a virtual chrome browser instance with puppeteer, going to generator, taking screenshot of the canvas
// uploading it to ipfs and returning the file hash. i thought this was a good idea. also the magic is the cache. application is caching the image hash
// so we don't have to send do this process every time a token is minted.


const uploadFile = async (file) => {
    try {
        const added = await ipfs.add(
            file
        )
        if (!added.path) {
            return
        }
        return added.path
    } catch (err) {
        console.error(err)
    }
}

module.exports = async (tokenId) => {
    try {
        // this way it stores browser object in higher scope. making it accessible and preventing creating new browser for each run.
        if (!browser) {
            browser = await puppeteer.launch({
                defaultViewport: {width: 275, height: 275},
                headless: true,
                args: ['--no-sandbox'],
            });
        }
        // Launch a "browser"
        const page = await browser.newPage();        // Open a new page
        await page.goto(`${baseURI}/generator/${tokenId}`, {"waitUntil": "domcontentloaded", timeout: 0}); // Go to the website
        await page.waitForTimeout(600) // waiting script to generate pot first.
        let ss = await page.screenshot({// Screenshot the website using defined options
            fullPage: true,
            type: "jpeg",
            quality: 80
        });
        await page.close();                           // Close the website so app won't get crashed due to memory overload
        return await uploadFile(ss)
    } catch (e) {
        console.log(e)
        return null
    }
}