/* eslint-disable no-undef */
const AdyToken = artifacts.require("AdyToken");

module.exports = function (deployer) {
	deployer.deploy(AdyToken);
};
