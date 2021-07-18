const settings = {}

// these are global variables that we will use.
let provider
let providerRw
let contract
let contractRW
let signer
let contractAddress = "0x03Ce4a39Dd1146d052934836f73E2d7f82ab5Bba"
let baseURI = "https://chainpots.com"
let infuraAPI = "https://mainnet.infura.io/v3/yourapikey"
let supply
let price = 0.05

// i decided to used jquery(a javascript library) for this app. i thought a big framework would be an overkill.
$(document).ready(async function () {
    console.log("ready!");
    if (window.ethereum) {
        try {
            // await window.ethereum.enable()
            await window.ethereum?.send('eth_requestAccounts');
        } catch (e) {
            alert(e.message || e)
        } finally {
            // read only provider.
            provider = await new ethers.providers.getDefaultProvider(infuraAPI)
            // read & write provider. in this case, our metamask wallet, so we can send txs.
            providerRw = await new ethers.providers.Web3Provider(web3.currentProvider)
            // read-only contract for calling the view functions
            contract = await new ethers.Contract(contractAddress, ContractABI, provider)
            // contract with Read&Write
            contractRW = await new ethers.Contract(contractAddress, ContractABI, providerRw.getSigner())

            // binding events and loading total supply
            $('#mintButton').click(() => {
                mint()
            })
            await fetchSupply();
        }
    }

});

async function fetchSupply() {
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
        // always make sure you are on the right chain. so users don't lose any money. in this case chain id is 1, mainnet ethereum.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }

    if(supply > 1023) {
        alert('SALE HAS ENDED. THANKS FOR ALL THE LOVE AND SUPPORT!')
        return
    }

    const amount = $('#mintAmount').val()
    if(amount > 0){
        // calculate the price using the utilities of ethers.
        let value = ethers.utils.parseEther((price*amount).toString())
        const tx = await contractRW.mintPots(amount, {value: value})
        const receipt = await tx.wait()
        if (receipt.confirmations >= 1) {
            alert('NFTs minted!')
        }
    }
}