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

    describe('AdyToken deploymet', async () => {
        it('name & symbol & standard', async () => {
            const name = await adyToken.name()
            assert(name, 'Ady Token', 'name')
            const symbol = await adyToken.symbol()
            assert(symbol, 'ADY', 'symbol')
            const standard = await adyToken.standard()
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
            assert.equal(result.toString(), tokens('100000'), 'receiver balance')
            result = await adyToken.balanceOf(accounts[0])
            assert.equal(result.toString(), tokens('900000'), 'admin balance')
        })

        it('approves', async () => {
            await adyToken.approve(accounts[0], tokens('900000000'),
                {from: accounts[1]}).should.be.rejected

            let result = await adyToken.approve.call(accounts[0], tokens('10000'),
                {from: accounts[1]})
            assert.equal(result, true, 'return value approve')

            let receipt = await adyToken.approve(accounts[0], tokens('10000'),
                {from: accounts[1]})
            assert.equal(receipt.logs.length, 1, 'number of events')
            assert.equal(receipt.logs[0].event, 'Approval', 'event type')
            assert.equal(receipt.logs[0].args._spender, accounts[0], 'sender')
            assert.equal(receipt.logs[0].args._owner, accounts[1], 'owner')
            assert.equal(receipt.logs[0].args._value, Number(tokens('10000')), 'value')

            result = await adyToken.allowance(accounts[1], accounts[0])
            assert.equal(result.toString(), tokens('10000'), 'allowance')
        })

        it('transferFrom', async () => {
            await adyToken.transferFrom(accounts[1], accounts[2], tokens('100000000'),
                {from: accounts[0]}).should.be.rejected
            await adyToken.transferFrom(accounts[1], accounts[2], tokens('10001'),
                {from: accounts[0]}).should.be.rejected
            
            let result = await adyToken.transferFrom.call(accounts[1], accounts[2],
                tokens('10000'), {from: accounts[0]})
            assert.equal(result, true, 'return value')

            let receipt = await adyToken.transferFrom(accounts[1], accounts[2],
                tokens('10000'), {from: accounts[0]})
            assert.equal(receipt.logs.length, 1, 'number of events')
            assert.equal(receipt.logs[0].event, 'Transfer', 'event type')
            assert.equal(receipt.logs[0].args._from, accounts[1], 'from')
            assert.equal(receipt.logs[0].args._to, accounts[2], 'to')
            assert.equal(receipt.logs[0].args._value, Number(tokens('10000')), 'value')
        })
    })
})