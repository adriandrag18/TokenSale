/* eslint-disable no-undef */
const { assert } = require('chai')

const AdyToken = artifacts.require("AdyToken")
const AdyTokenSale = artifacts.require("AdyTokenSale")

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('AdyTokenSale', (accounts) => {
    let tokenSaleInsatnce
    let tokenPrice = tokens('0.001')

    before(async () => {
        tokenSaleInsatnce = await AdyTokenSale.new(AdyToken.address, tokenPrice)
    })

    describe('AdyTokenSale deployment', async () => {
        it('address & contaract & price', async () => {
            const address = tokenSaleInsatnce.address
            assert.notEqual(address, 0, 'address')
            const tokenContract = await tokenSaleInsatnce.tokenContract()
            assert.notEqual(tokenContract, 0, 'tokenContract')
            const price = await tokenSaleInsatnce.tokenPrice()
            assert.equal(price, tokenPrice, "price")
        })
    })

    describe('buy', async () => {
        it("token buying", () => {
            
        })
    })
})
