// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.5.16;

contract AdyToken {

    string public name = "Ady Token";
    string public symbol = "ADY";
    uint8 public decimals = 18;
    uint public totalSupply = 1000000 * 10 ** 18;
    

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor() public {
    }

    // function name() public view returns (string) {
    //     return _name;
    // }

    // function symbol() public view returns (string) {
    //     return _symbol;
    // }

    // function decimals() public view returns (uint8) {
    //     return _decimals;
    // }

    // function totalSupply() public view returns (uint256)

    // function balanceOf(address _owner) public view returns (uint256 balance)

    // function transfer(address _to, uint256 _value) public returns (bool success)

    // function approve(address _spender, uint256 _value) public returns (bool success)

    // function allowance(address _owner, address _spender) public view returns (uint256 remaining)

    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
}