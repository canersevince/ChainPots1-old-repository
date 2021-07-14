var ethers = require('ethers');
var abi = require('./abi.json')
const settings = {
    baseURI: "https://stairwaytochain.herokuapp.com",
    contractAddress: "0xAfFB101A5168ed99D7642746aC5390d8F7CF271E",
    infuraAPI: "https://rinkeby.infura.io/v3/8f5b089af6e9483ca2ba3b01f9f5a442"
}
const provider = new ethers.providers.getDefaultProvider(settings.infuraAPI)
const contract = new ethers.Contract(settings.contractAddress, abi, provider)
module.exports = {
    ...settings,
    contract
}