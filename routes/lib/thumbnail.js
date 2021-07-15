const {baseURI} = require('../../utils')
const puppeteer = require('puppeteer');         // Require Puppeteer module

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
        encoding: "base64"// take a fullpage screenshot
    });
    await page.close();                           // Close the website
    await browser.close();
    return ss
}