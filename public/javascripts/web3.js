const settings = {}

let provider
let providerRw
let contract
let contractRW
let signer
let contractAddress = "0xAfFB101A5168ed99D7642746aC5390d8F7CF271E"
let baseURI = "https://stairwaytochain.herokuapp.com"
let infuraAPI = "https://rinkeby.infura.io/v3/8f5b089af6e9483ca2ba3b01f9f5a442"
let supply
let price = 0.05

$(document).ready(async function () {
    console.log("ready!");
    if (window.ethereum) {
        window.ethereum.enable()
        await window.ethereum?.send('eth_requestAccounts');
    }
    provider = await new ethers.providers.getDefaultProvider(infuraAPI)
    providerRw = await new ethers.providers.Web3Provider(web3.currentProvider)
    console.log(provider,providerRw)
    contract = await new ethers.Contract(contractAddress, ContractABI, provider)
    contractRW = await new ethers.Contract(contractAddress, ContractABI, providerRw.getSigner())
    console.log({ethers: ethers, signer, provider, contract})
    $('#mintButton').click(() => {
        mint()
    })
    await fetchSupplyAndPrice();
});

async function fetchSupplyAndPrice() {

    try {
        supply = await contract.totalSupply()
        $('div.loader').remove()
        $('p#current-supply').text(`#${supply}/1024 minted`)
        return true
    } catch (e) {
        console.log(e)
    } finally {
        console.log('loaded.')
    }
}

async function mint() {
    if(parseInt(providerRw.provider.chainId) !== 4) {
        alert('WRONG NETWORK. WE ARE ON RINKEBY TESTNET')
        return
    }
    const amount = $('#mintAmount').val()
    console.log(ethers.utils)
    if(amount > 0){
        let value = ethers.utils.parseEther((price*amount).toString())
        console.log({amount, value, a: value.toString()})
        const tx = await contractRW.mintStairs(amount, {value: value})
        const receipt = await tx.wait()
        if (receipt.confirmations >= 1) {
            alert('NFTs minted!')
        }
    }

}