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
        if (!browser) {
            browser = await puppeteer.launch({
                defaultViewport: {width: 275, height: 275},
                headless: true,
                args: ['--no-sandbox'],
            });
        }
        // Launch a "browser"
        const page = await browser.newPage();        // Open a new page
        await page.goto(`${baseURI}/generator/${tokenId}`);                        // Go to the website
        let ss = await page.screenshot({                      // Screenshot the website using defined options
            fullPage: true,
            type: "jpeg",
            quality: 80
            // encoding: "base64"// take a fullpage screenshot
        });
        await page.close();                           // Close the website
        return await uploadFile(ss)
    } catch (e) {
        console.log(e)
        return null
    }
}