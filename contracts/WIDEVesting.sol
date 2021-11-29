//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WIDEVesting
 */
contract WIDEVesting is Ownable, ReentrancyGuard{

    using SafeERC20 for IERC20;

    // address of the ERC20 token
    IERC20 immutable private _token;

    event Vested(address receiver, uint256 amount);
    event Claimed(address claimer, uint256 amount);

    //duration of vesting period in days
    uint256 constant vestingPeriod = 30;
    uint256 startTime;

    //initially vested balance, won't change
    mapping(address => uint256) public initialBalances;

    //changes everytime an user claims some of his tokens
    mapping(address => uint256) public balances;

    constructor(address token_){
        require(token_ != address(0x0));
        _token = IERC20(token_);
        startTime = block.timestamp;
    }

    function vest(address receiver, uint256 amount) public nonReentrant onlyOwner{
        require(amount <= _token.balanceOf(address(this)), "WIDEVesting: Not enough tokens in the contract balance");
        initialBalances[receiver] = amount;
        balances[receiver] = 0;
        emit Vested(receiver, amount);
    }

    function claim(uint256 amount) public nonReentrant{
        require(startTime <= block.timestamp, "WIDEVesting: You're too early");
        require(tokensAvailable(msg.sender) >= amount, "WIDEVesting: Amount too high");

        balances[msg.sender] += amount;
        _token.safeTransfer(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    function getInitialBalance(address receiver) public view returns (uint256){
        return initialBalances[receiver];
    }

    //number of tokens that are available to address at present moment
    function tokensAvailable(address receiver) internal view returns (uint256){
        uint256 initialBalance = initialBalances[receiver];
        uint256 balance = balances[receiver];
        require(balance <= initialBalance);

        uint256 available;
        uint256 dayNumber = currentDayNumber();
        if(dayNumber <= vestingPeriod){
            available = (initialBalance/vestingPeriod)*dayNumber - balance;
        }
        else{
            available = initialBalance - balance;
        }
        return available;
    }

    //launch day - day number 1, next day - day number 2, etc
    function currentDayNumber() internal view returns (uint256){
        return (block.timestamp + 1 days - startTime) / 60 / 60 / 24;
    }

}