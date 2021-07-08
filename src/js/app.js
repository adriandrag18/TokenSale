App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,
    loading: false,
    tokenPrice: 0, // in wei
    tokensSold: 0,
    tokensAvailable: 0, // in wei
    tokenInstance: null,
    tokenSaleInstance: null,

    init: async () => {
        console.log("App initializing")
        await App.initWeb3()
        await App.initContracts()
        await App.listenForEvents()
        await App.render()
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

    initContracts: async () => {
        await $.getJSON("AdyTokenSale.json", (adyTokenSale)  =>{
            App.contracts.AdyTokenSale = TruffleContract(adyTokenSale)
            App.contracts.AdyTokenSale.setProvider(App.web3Provider)
            App.contracts.AdyTokenSale.deployed().then((adyTokenSale) => {
                App.tokenSaleInstance = adyTokenSale
                console.log("Ady Token Sale Address:", App.tokenSaleInstance.address)
            })
        })
        await $.getJSON("AdyToken.json", (adyToken) => {
            App.contracts.AdyToken = TruffleContract(adyToken);
            App.contracts.AdyToken.setProvider(App.web3Provider);
            App.contracts.AdyToken.deployed().then((adyToken) => {
                App.tokenInstance = adyToken
                console.log("Ady Token Address:", adyToken.address)
            })
        })
    },

    listenForEvents: async () => {
        App.contracts.AdyTokenSale.deployed().then((instance) => {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch((error, event) => {
                console.log("Sell event triggered", event)
                App.render()
            })
        })
    },

    render: async () => {
        if (App.loading)
            return
        App.loading = true
        
        let loader = $('#loader')
        let content = $('#content')
        loader.show()
        content.hide()

        // Load account data
        web3.eth.getAccounts((error, accounts) => {
            App.account = accounts[0]
            $('#accountAddress').html("Your Account: " + accounts[0])
        })

        // Load contracts data
        App.tokenPrice = await App.tokenSaleInstance.tokenPrice()
        console.log('token price:', App.tokenPrice)
        $('#token-price').html(Number(web3.fromWei(App.tokenPrice, 'ether')))       
        
        App.tokensSold = await App.tokenSaleInstance.tokensSold()
        console.log('tokens sold:', App.tokensSold)
        $('#tokens-sold').html(Number(App.tokensSold))

        let address = await App.tokenSaleInstance.address
        App.tokensAvailable = await App.tokenInstance.balanceOf(address)
        console.log('tokens available:', App.tokensAvailable)
        $('#tokens-available').html(Number(web3.fromWei(App.tokensAvailable, 'ether')) + Number(App.tokensSold))

        let progressPercent = Math.ceil(100 * Number(App.tokensSold) / Number(web3.fromWei(App.tokensAvailable, 'ether')))
        $('#progress').css('width', progressPercent + "%")
        
        let tokenBalance = await App.tokenInstance.balanceOf(App.account)
        $('#token-balance').html(Number(web3.fromWei(tokenBalance, 'ether')))

        App.loading = false
        loader.hide()
        content.show()
    },

    buyTokens: async () => {
        $('#content').hide()
        $('#loader').show()
        let numberOfTokens = $('#numberOfTokens').val()
        let recipt = await App.tokenSaleInstance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000})
        console.log('Token bought:', Number(recipt.logs[0].args._amount))
       $('form').trigger('reset')
    }
}

$(() => {
    $(window).load(() => {
        App.init()
    })
})
