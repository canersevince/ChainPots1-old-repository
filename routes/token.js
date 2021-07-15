var express = require('express');
var router = express.Router();
var {contract, baseURI} = require('../utils')
var thumbnail = require('./lib/thumbnail')
var getAttributes = require('../public/javascripts/metadata')
/* GET home page. */
let cached = {};
router.get('/token/:id', async function (req, res, next) {
    try {
        let id = req.params.id
        if (id === null || typeof id == "undefined") {
            res.status(404)
            return
        }


        if(cached[id]) {
            res.status(200).json(cached[id])
            console.log('served cache')
            return
        }

        const hash = await contract.tokenHash(id)
        let metadata = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        console.log(image)
        if (image) {
            image = `https://ipfs.infura.io/ipfs/${image}`
        }

        console.log({metadata})
        cached[id] = {
            tokenId: id,
            image,
            hash,
            name: `Stairway To Chain - #${id}`,
            description: `Generative NFT collection with limited supply and the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
            animation_url: `${baseURI}/generator/${id}`,
            token_uri: `${baseURI}/api/token/${id}`,
            attributes: metadata || [],
            external_url: `${baseURI}/token/${id}`,
            script_type: "p5js",
            aspect_ratio: "1",
        }
        res.status(200).json({
            image,
            hash,
            name: `Stairway To Chain - #${id}`,
            description: `Generative NFT collection with limited supply and the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
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
    return
});

module.exports = router;
