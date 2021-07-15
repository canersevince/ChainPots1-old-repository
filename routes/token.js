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
        if(isBusy){
            res.status(201)
            return
        }
        await mc.get(id, function (err, val) {
            if (err != null) {
                console.log('Error getting value: ' + err)
            } else {
                res.status(200).json(val)
                return
            }
        })
        isBusy = true
        const hash = await contract.tokenHash(id)
        let metadata = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        console.log(image)
        if (image) {
            image = `https://ipfs.infura.io/ipfs/${image}`
        }
        console.log({metadata})
        isBusy = false;
        await mc.set(id, {
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
        }, {expires: 0}, function (err, val) {
            if (err != null) {
                console.log('Error setting value: ' + err)
            }
            res.status(200).json(val)
        })
    } catch (e) {
        console.log(e)
        res.status(404)
    }
});

module.exports = router;
