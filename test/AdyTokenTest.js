/* eslint-disable no-undef */
import { assert } from 'chai'

const AdyToken = artifacts.require("AdyToken")
require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('DappToken', (accounts) => {
    before(async () => {
        adyToken = await AdyToken.new()
    })

    describe('Ady Token deploymet', async () => {
        it('total supply', async () => {
            const totalSupply = await adyToken.totalSupply;
            assert.equal(totalSupply.toString, tokens('1000000'), 'total supply')
        })
    })
})