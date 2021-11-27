//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./WIDEToken.sol";

//FOR TESTS ONLY. WIDEToken with public mint function so we can test it.
contract ExposedWIDEToken is WIDEToken{

    function mint(address account, uint256 amount) public onlyOwner{
        _mint(account, amount);
    }
}