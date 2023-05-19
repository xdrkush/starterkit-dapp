// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lib {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        require(msg.sender == owner, "Vous ne pouvez pas execute cette fonction");
        return owner;
    }

}