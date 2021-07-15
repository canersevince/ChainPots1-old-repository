var express = require('express');
var router = express.Router();
var {contract, baseURI} = require('../utils')
var thumbnail = require('./lib/thumbnail')
var getAttributes = require('../public/javascripts/metadata')
/* GET home page. */
router.get('/token/:id', async function (req, res, next) {
    try {
        let id = req.params.id
        if (id === null || typeof id == "undefined") {
            res.status(404)
            return
        }
        const hash = await contract.tokenHash(id)
        let metadata = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        if (image[0]) {
            image = `data:image/png;base64,${image[0].toString('base64')}`
        }
        console.log({metadata})
        res.status(200).json({
            image,
            hash,
            name: `Stairway To Chain - #${id}`,
            description: `Generative NFT collection with limited supply with the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
            animation_url: `${baseURI}/generator/${id}`,
            token_uri: `${baseURI}/api/token/${id}`,
            attributes: metadata || [],
            external_url: `${baseURI}/token/${id}`,
            script_type: "p5js",
            aspect_ratio: "1",
        })
    } catch (e) {
        console.log(e)
        res.status(404)
    }
});

module.exports = router;
