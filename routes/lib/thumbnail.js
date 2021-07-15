const {baseURI} = require('../../utils')
const puppeteer = require('puppeteer');         // Require Puppeteer module
const ipfsClient =  require('ipfs-http-client')

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
    const browser = await puppeteer.launch({
        defaultViewport: {width: 400, height: 400},
        headless: true,
        args: ['--no-sandbox']
    });    // Launch a "browser"
    const page = await browser.newPage();        // Open a new page
    await page.goto(`${baseURI}/generator/${tokenId}`);                        // Go to the website
    let ss = await page.screenshot({                      // Screenshot the website using defined options
        fullPage: true,
        type: "jpeg"
        // encoding: "base64"// take a fullpage screenshot
    });
    await page.close();                           // Close the website
    await browser.close();
    let hash = await uploadFile(ss)
    return hash
}