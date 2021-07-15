var express = require('express');
var router = express.Router();
var {contractAddress, contract, baseURI} = require('../utils')

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
    const hash = await contract.tokenHash(id)
    cached[id] = hash
    res.render('generator', {hash: hash});
});

module.exports = router;
