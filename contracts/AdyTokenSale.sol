// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;
import "./AdyToken.sol";

contract AdyTokenSale {
    
    address payable admin;
    uint public tokenPrice;
    uint public tokensSold;
    uint oneToken;
    AdyToken public tokenContract;

    event Sell(address _buyer, uint _amount);

    constructor (AdyToken _tokenContract, uint _tokenPrice) public {
        admin = msg.sender;
        tokenPrice = _tokenPrice;
        tokenContract = _tokenContract;
        oneToken = 10 ** uint(tokenContract.decimals());
    }

    function buyTokens(uint _amount) public payable {
        require(msg.value == mul(_amount, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _amount);
        require(tokenContract.transfer(msg.sender, mul(_amount, oneToken)));

        tokensSold += _amount;

        emit Sell(msg.sender, _amount);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // destroy the contract 
        selfdestruct(admin);
    }

    // dsmath
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}


