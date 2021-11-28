//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./WIDEToken.sol";

/**
 * @title MockWIDEToken
 * WARNING: use only for testing and debugging purpose
 */
contract MockWIDEToken is WIDEToken{

    function mint(address account, uint256 amount) public onlyOwner{
        _mint(account, amount);
    }
}