const settings = {}

// these are global variables that we will use.
let provider
let providerRw
let contract
let contractRW
let signer
let contractAddress = "0x03Ce4a39Dd1146d052934836f73E2d7f82ab5Bba"
let baseURI = "https://chainpots.com"
let infuraAPI = "https://mainnet.infura.io/v3/09654b1282fd40b0ae16691e4b66484e"
let supply
let price = 0.05

// i decided to used jquery(a javascript library) for this app because
$(document).ready(async function () {
    console.log("ready!");
    if (window.ethereum) {
        try {
            // await window.ethereum.enable()
            await window.ethereum?.send('eth_requestAccounts');
        } catch (e) {
            alert(e.message || e)
        } finally {
            provider = await new ethers.providers.getDefaultProvider(infuraAPI)
            providerRw = await new ethers.providers.Web3Provider(web3.currentProvider)
            console.log(provider,providerRw)
            contract = await new ethers.Contract(contractAddress, ContractABI, provider)
            contractRW = await new ethers.Contract(contractAddress, ContractABI, providerRw.getSigner())
            $('#mintButton').click(() => {
                mint()
            })
            await fetchSupplyAndPrice();
        }
    }

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
    if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }

    if(supply > 1023) {
        alert('SALE HAS ENDED. THANKS FOR ALL THE LOVE AND SUPPORT!')
        return
    }



    const amount = $('#mintAmount').val()
    if(amount > 0){
        let value = ethers.utils.parseEther((price*amount).toString())
        console.log({amount, value, a: value.toString()})
        const tx = await contractRW.mintPots(amount, {value: value})
        const receipt = await tx.wait()
        if (receipt.confirmations >= 1) {
            alert('NFTs minted!')
        }
    }

}