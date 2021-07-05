// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.16;
import "./AdyToken.sol";

contract AdyTokenSale {
    
    address admin;
    AdyToken public tokenContract;
    uint public tokenPrice;

    

    constructor (AdyToken _tokenContract, uint _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint _numberOfTokens) public payable {
        
    }
}


