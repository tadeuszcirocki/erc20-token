//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WIDEToken is ERC20, Ownable{

    constructor() ERC20("Widelab", "WIDE"){
        _mint(msg.sender, 1000);
    }

    function _mint(address account, uint256 amount) internal onlyOwner override{
        super._mint(account, amount);
    }
}
