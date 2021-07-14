var express = require('express');
var router = express.Router();
var {contractAddress,contract,baseURI} = require('../utils')

router.get('/:tokenId', async function(req, res, next) {
    let id = req.params.tokenId
    if (id === null || typeof id == "undefined") {
        res.status(404)
        return
    }
    const hash = await contract.tokenHash(id)

    res.render('generator', { hash: hash });
});

module.exports = router;
