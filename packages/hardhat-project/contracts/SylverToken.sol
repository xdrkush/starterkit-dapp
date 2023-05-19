// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SylverToken is Ownable, ERC20 {
    constructor(uint256 initialSupply) ERC20("SylverToken", "SYLV") {
        _mint(owner(), initialSupply);
    }

}