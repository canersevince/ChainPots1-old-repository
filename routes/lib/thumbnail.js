const {baseURI} = require('../../utils')
const Pageres = require('pageres');

module.exports = async (tokenId) => {
    return await new Pageres({delay: 2})
        .src(`${baseURI}/generator/${tokenId}`, ['400x400'], {crop: true}).run()
}