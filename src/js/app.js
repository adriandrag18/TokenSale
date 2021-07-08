App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init: async () => {
        console.log("App initializing")
        await App.initWeb3()
        await App.initContracts()
        App.render()
    },

    initWeb3: async() => {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = window.ethereum
            await window.ethereum.enable()
        } else {
            App.web3Provider = new Web3.providers.HttpProviders('http://localhost:7545')
        }
        web3 = new Web3(App.web3Provider)
    },

    initContracts: () => {
        $.getJSON("AdyTokenSale.json", (adyTokenSale)  =>{
            App.contracts.AdyTokenSale = TruffleContract(adyTokenSale)
            App.contracts.AdyTokenSale.setProvider(App.web3Provider)
            App.contracts.AdyTokenSale.deployed().then((adyTokenSale) => {
                console.log("Ady Token Sale Address:", adyTokenSale.address)
            })
        }).done(() => {
            $.getJSON("AdyToken.json", (adyToken) => {
                App.contracts.AdyToken = TruffleContract(adyToken);
                App.contracts.AdyToken.setProvider(App.web3Provider);
                App.contracts.AdyToken.deployed().then((adyToken) => {
                    console.log("Ady Token Address:", adyToken.address)
                })
          })
        })
      },

    render: () => {
        // Load account data
        web3.eth.getAccounts(function(error, accounts){
            App.account = accounts[0]
            $("#accountAddress").html("Your Account: " + accounts[0])
        })
    }
}

$(() => {
    $(window).load(() => {
        App.init()
    })
})
