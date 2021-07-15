const {baseURI} = require('../../utils')
const Pageres = require('pageres');

module.exports = async (tokenId) => {
    return await new Pageres({delay: 2, launchOptions: {headless: true, devtools: false, args: ['--no-sandbox','--disable-setuid-sandbox']}})
        .src(`${baseURI}/generator/${tokenId}`, ['400x400'], {crop: true}).run()
}