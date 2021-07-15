var express = require('express');
var router = express.Router();
var {contract, baseURI, mc} = require('../utils')
var thumbnail = require('./lib/thumbnail')
var getAttributes = require('../public/javascripts/metadata')
/* GET home page. */
let isBusy;

router.get('/token/:id', async function (req, res, next) {
    try {
        let id = req.params.id
        if (id === null || typeof id == "undefined") {
            res.status(404)
            return
        }
        if (isBusy) {
            res.status(202)
            return
        }
        const cached = await mc.get(`token_${id.toString()}`)
        if (cached) {
            res.status(200).json(cached)
            isBusy = false;
            return
        }
        isBusy = true
        const hash = await contract.tokenHash(id)
        if (!hash) {
            res.status(404)
            isBusy = false;
            return
        }
        let metadata = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        console.log(image)
        if (image) {
            image = `https://ipfs.infura.io/ipfs/${image}`
        }
        console.log({metadata})
        isBusy = false;
        let metadata$ = {
            image,
            hash,
            name: `Stairway To Chain - #${id}`,
            description: `Generative NFT collection with limited supply and the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
            animation_url: `${baseURI}/generator/${id}`,
            token_uri: `${baseURI}/api/token/${id}`,
            attributes: metadata,
            external_url: `${baseURI}/token/${id}`,
            script_type: "p5js",
            aspect_ratio: "1",
        }
        await mc.set(`token_${id}`, JSON.stringify(metadata$)
            , {expires: 0}, function (err, val) {
                if (err !== null) {
                    console.log('Error setting value: ' + err)
                    res.status(500).json(err)
                    isBusy = false;
                    return
                }
            })
        res.status(200).json(metadata$)
    } catch (e) {
        console.log(e)
        isBusy = false;
        res.status(404)
    }
});

module.exports = router;
