/* eslint-disable no-undef */
const AdyToken = artifacts.require("AdyToken")
const AdyTokenSale = artifacts.require("AdyTokenSale")

module.exports = function (deployer) {
	deployer.deploy(AdyToken, web3.utils.toWei('1000000', 'Ether')).then(function() {
		const tokenPrice = 10**15; // 0.001 Ether
		return deployer.deploy(AdyTokenSale, AdyToken.address, tokenPrice)
	})
}
