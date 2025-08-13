// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ICoreStaking {
    function stake(uint256 amount) external returns (uint256);
    function unstake(uint256 amount) external returns (uint256);
    function getCurrentAPY() external view returns (uint256);
    function getStakedAmount(address user) external view returns (uint256);
    function claimRewards() external returns (uint256);
}