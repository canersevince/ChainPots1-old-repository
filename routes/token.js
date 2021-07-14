var express = require('express');
var router = express.Router();
var {contractAddress, contract, baseURI} = require('../utils')
var getAttributes = require('../public/javascripts/metadata')
/* GET home page. */
router.get('/token/:id', async function (req, res, next) {
    try {
        let id = req.params.id
        if (!id) {
            res.status(404)
            return
        }
        const hash = await contract.tokenHash(id)
        let metadata = getAttributes(hash)
        console.log({metadata})
        res.status(200).json({
            hash,
            name: `Stairway To Chain - #${id}`,
            description: `Generative NFT collection with limited supply, which is stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
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
