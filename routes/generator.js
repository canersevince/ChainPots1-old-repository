var express = require('express');
var router = express.Router();
var {contract} = require('../utils')

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
    }
});
router.get('/clear/:id', async function (req, res, next) {
    cached[req.params.id] = null
    res.status(200).json({
        cache: "cleared"
    })
});
module.exports = router;
