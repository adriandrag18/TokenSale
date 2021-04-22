/* eslint-disable no-undef */
const { assert } = require('chai')

const AdyToken = artifacts.require("AdyToken")

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('AdyToken', (accounts) => {
    let adyToken
    before(async () => {
        adyToken = await AdyToken.new(web3.utils.toWei('1000000', 'Ether'))
    })

    describe('Ady Token deploymet', async () => {
        it('name & symbol &', async () => {
            let name = await adyToken.name()
            assert(name, 'Ady Token', 'name')
            let symbol = await adyToken.symbol()
            assert(symbol, 'ADY', 'symbol')
            let standard = await adyToken.standard()
            assert(standard, 'Ady Token v0.1', 'standard')
        })
        it('to much inital supply', async () => {
        await AdyToken.new(web3.utils.toWei('10000000', 'Ether')).should.be.rejected
        })
        it('total supply', async () => {
            const totalSupply = await adyToken.totalSupply();
            assert.equal(totalSupply.toString(), tokens('1000000'), 'total supply')
            const adminBalance = await adyToken.balanceOf(accounts[0])
            assert.equal(adminBalance.toString(), tokens('1000000'), 'admin balance')
        })
    })

    describe('Transfer', async () => {
        it('transfer', async() => {
            await adyToken.transfer(accounts[1], tokens('100000000000'),
                {from: accounts[0]}).should.be.rejected

            let succes = await adyToken.transfer.call(accounts[1], tokens('100000'), {from: accounts[0]})
            assert.equal(succes, true, 'return value transfer')

            let receipt = await adyToken.transfer(accounts[1], tokens('100000'),
                {from: accounts[0]})
            
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'event')
            assert.equal(receipt.logs[0].args._from, accounts[0], 'from')
            assert.equal(receipt.logs[0].args._to, accounts[1], 'to')
            assert.equal(receipt.logs[0].args._value, Number(tokens('100000')), 'value')
            
            let result = await adyToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100000'), 'reciver balance')
            result = await adyToken.balanceOf(accounts[0])
            assert.equal(result.toString(), tokens('900000'), 'admin balance')
        })
    })
})