// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.5.16;

contract AdyToken {

    string public name = "Ady Token";
    string public symbol = "ADY";
    string public standard = "Ady Token v0.1";
    uint8 public decimals = 18;
    uint public totalSupply;
    uint public maxSupply = 1000000 * 10 ** 18;

    address public admin; 
    mapping(address => uint) public balances;
    mapping(address => mapping (address => uint)) allowances;   

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(uint _initalSupply) public {
        require(_initalSupply <= maxSupply, "initial supply to big");
        totalSupply = _initalSupply;
        balances[msg.sender] = _initalSupply;
        admin = msg.sender;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        balance = balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] > _value, "balance to low");
        emit Transfer(msg.sender, _to, _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] > _value, 'balance to low');
        emit Approval(msg.sender, _spender, _value);

        allowances[msg.sender][_spender] = _value;
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        remaining = allowances[_owner][_spender];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balances[_from] > _value, "balance to low");
        require(allowances[_from][msg.sender] > _value, "allowance to low");
        emit Transfer(_from, _to, _value);
        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;
        return true;
    }
}