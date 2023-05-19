// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./SylverToken.sol";

contract Lib {
    SylverToken private immutable token;
    address owner;

    constructor(address _address) {
        token = SylverToken(_address);
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        require(msg.sender == owner, "Vous ne pouvez pas execute cette fonction");
        return owner;
    }

}