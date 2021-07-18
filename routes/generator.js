var express = require('express');
var router = express.Router();
var {contract} = require('../utils')

// since we don't have a big data and only have 1024 tokens.
// we are storing token hashes in an object. so we don't send request to infura every time.
// as long as our application is live, it will serve the cache. you can use an external add-on too, just like MemCachier
let cached = {}

router.get('/:tokenId', async function (req, res, next) {
    let id = req.params.tokenId
    if (id === null || typeof id == "undefined") {
        res.status(404)
        return
    }
    if (cached[id]) {
        res.render('generator', {hash: cached[id]});
        console.log('serving cache')
        return
    }

    try {
        const hash = await contract.tokenHash(id)
        if (!hash) {
            res.status(404)
            return
        }
        cached[id] = hash
        res.render('generator', {hash: hash});
    } catch (e) {
        console.log(e.message)
        res.status(404)
        return
    }
});


// this is an endpoint for clearing cache just in case we need it.
router.get('/clear/:id', async function (req, res, next) {
    cached[req.params.id] = null
    res.status(200).json({
        cache: "cleared"
    })
});
module.exports = router;
