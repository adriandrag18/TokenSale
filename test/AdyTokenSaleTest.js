/* eslint-disable no-undef */
const { assert } = require('chai')

const AdyToken = artifacts.require("AdyToken")
const AdyTokenSale = artifacts.require("AdyTokenSale")

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('AdyTokenSale', (accounts) => {
    let tokenInstance
    let tokenSaleInsatnce
    const tokenPrice = tokens('0.001')
    const totalSupply = 1000000
    const tokensAvailable = 500000 // 50% of totalSupply
    const admin = accounts[0] // the same for the token and tokenSale smart contract
    const numberOfTokens = 10;

    before(async () => {
        tokenInstance = await AdyToken.new(tokens(totalSupply.toString()), {from: admin})
        tokenSaleInsatnce = await AdyTokenSale.new(tokenInstance.address, tokenPrice, 
            {from: admin})
        await tokenInstance.transfer(tokenSaleInsatnce.address, tokens(tokensAvailable.toString()), 
            {from: admin})
    })

    describe('AdyTokenSale deployment', async () => {
        it('address & contaract & price', async () => {
            const address = tokenSaleInsatnce.address
            assert.notEqual(address, 0, 'address')
            const tokenContract = await tokenSaleInsatnce.tokenContract()
            assert.equal(tokenContract, tokenInstance.address, 'tokenContract')
            const price = await tokenSaleInsatnce.tokenPrice()
            assert.equal(price, tokenPrice, "price")
        })
    })

    describe('Buy', async () => {
        const buyer = accounts[1]
        it('token buying', async () => {
            let tokenRemaining = await tokenInstance.balanceOf(tokenSaleInsatnce.address)
            assert.equal(tokenRemaining, tokens(tokensAvailable.toString()), 'tokensAvailable')

            const receipt = await tokenSaleInsatnce.buyTokens(numberOfTokens, 
                {from: buyer, value: numberOfTokens * tokenPrice})
            
            assert.equal(receipt.logs.length, 1, 'trigger 1 event')
            assert.equal(receipt.logs[0].event, 'Sell', 'Must trigger the Sell event')
            assert.equal(receipt.logs[0].args._buyer, buyer, 'Buyer')
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'Amout')

            const amount = await tokenSaleInsatnce.tokenSold()
            assert.equal(amount, numberOfTokens, 'tokenSold')

            tokenRemaining = await tokenInstance.balanceOf(tokenSaleInsatnce.address)
            assert.equal(tokenRemaining, tokens((tokensAvailable - numberOfTokens).toString()), 'tokenRemaining')
        })

        it('wrong value', async () => {
            await tokenSaleInsatnce.buyTokens(numberOfTokens,
                {from: buyer, value: 1}).should.be.rejected
            // TODO:
            // try {
            //     tokenSaleInsatnce.buyTokens(numberOfTokens, {from: buyer, value: 1})
            //     assert.fail()
            // } catch(err) {
            //     assert(err.message.indexOf('revert') >= 0, 'Error message must contain revert')
            // }
            // buy too much tokens
            await tokenSaleInsatnce.buyTokens(tokens('1000000'),
                {from: buyer, value: 1000000 * tokenPrice}).should.be.rejected
            
            await tokenSaleInsatnce.buyTokens(tokens('500000'),
                {from: buyer, value: 500000 * tokenPrice}).should.be.rejected

            const tokenRemaining = await tokenInstance.balanceOf(tokenSaleInsatnce.address)
            assert.equal(tokenRemaining, tokens((tokensAvailable - numberOfTokens).toString()), 'tokenRemaining')

            const amount = await tokenSaleInsatnce.tokenSold()
            assert.equal(amount, numberOfTokens, 'tokenSold')
        })
    })

    describe('EndSale', async () => {
        it('not admin try to end sale', async () => {
            const tokenRemaining = await tokenInstance.balanceOf(tokenSaleInsatnce.address)
            assert.equal(tokenRemaining, tokens((tokensAvailable - numberOfTokens).toString()), 'tokenRemaining')
            for (let i = 1; i < accounts.length; i++)
                await tokenSaleInsatnce.endSale({from: accounts[i]}).should.be.rejected
            await tokenSaleInsatnce.endSale({from: admin})
        })
    })
})
