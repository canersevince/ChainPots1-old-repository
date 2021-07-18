let express = require('express');
let router = express.Router();
let {contract, baseURI, mc} = require('../utils')
let thumbnail = require('./lib/thumbnail')
let getAttributes = require('../public/javascripts/metadata')
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
        const cached = await mc.get(`token_${parseInt(id).toString()}`)
        console.log(cached)
        if (cached.value) {
            res.status(200).json(JSON.parse(cached.value?.toString()))
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
        let attributes = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        console.log(image)
        if (image) {
            image = `https://ipfs.infura.io/ipfs/${image}`
        }
        isBusy = false;
        let metadata$ = {
            image,
            hash,
            name: `Non Fungible Pot - #${id}`,
            description: `Generative NFT collection with limited supply and the scripts stored on Ethereum Blockchain. Inspired by on-chain art platform "Art Blocks".`,
            animation_url: `${baseURI}/generator/${id}`,
            token_uri: `${baseURI}/api/token/${id}`,
            attributes: attributes,
            external_url: `${baseURI}/generator/${id}`,
            script_type: "p5js",
            aspect_ratio: "1",
        }
        console.log({metadata$})


        // magical thing. heroku has a memory cache add-on. this way we can cache our responses and get a faster working api.
        await mc.set(`token_${id}`, JSON.stringify(metadata$)
            , {expires: 1200}, function (err, val) {
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
