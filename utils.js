var ethers = require('ethers');
var abi = require('./abi.json')
var memjs = require('memjs')

const settings = {
    baseURI: "https://stairwaytochain.herokuapp.com",
    contractAddress: "0xFb621De1C5D79B1f42487b03d23b0E7651087cdD",
    infuraAPI: "https://rinkeby.infura.io/v3/8f5b089af6e9483ca2ba3b01f9f5a442"
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