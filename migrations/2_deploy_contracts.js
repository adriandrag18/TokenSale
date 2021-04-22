/* eslint-disable no-undef */
const AdyToken = artifacts.require("AdyToken")

module.exports = function (deployer) {
	deployer.deploy(AdyToken, web3.utils.toWei('1000000', 'Ether'))
}
