//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./WIDEVesting.sol";

/**
 * @title MockWIDEVesting
 * WARNING: use only for testing and debugging purpose
 */
contract MockWIDEVesting is WIDEVesting{

    //this way one can simulate that vesting period start happend x days ago
    constructor(address token_, uint256 start) WIDEVesting(token_){
        startTime = block.timestamp - start * 1 days;
    }
}