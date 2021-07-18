var ethers = require('ethers');
var abi = require('./abi.json')
var memjs = require('memjs')

const settings = {
    baseURI: "https://chainpots.com",
    contractAddress: "0x03Ce4a39Dd1146d052934836f73E2d7f82ab5Bba",
    infuraAPI: "https://mainnet.infura.io/v3/yourapikey"
}

const provider = new ethers.providers.getDefaultProvider(settings.infuraAPI)
const contract = new ethers.Contract(settings.contractAddress, abi, provider)

var mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
})

module.exports = {
    ...settings,
    contract,
    mc
}