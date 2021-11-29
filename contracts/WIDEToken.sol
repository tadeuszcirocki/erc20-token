//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WIDEToken
 */
contract WIDEToken is ERC20, Ownable{

    constructor() ERC20("Widelab", "WIDE"){
        _mint(msg.sender, 100000);
    }

    //mintable, owner can mint more tokens if he wishes to
    function mint(address account, uint256 amount) public onlyOwner{
        _mint(account, amount);
    }
}
