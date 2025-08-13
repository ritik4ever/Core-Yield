// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ICoreStaking.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoreStakingAdapter {
    ICoreStaking public immutable coreStaking;
    IERC20 public immutable stCore;
    
    constructor(address _coreStaking, address _stCore) {
        coreStaking = ICoreStaking(_coreStaking);
        stCore = IERC20(_stCore);
    }
    
    function stake(uint256 _amount) external returns (uint256) {
        return coreStaking.stake(_amount);
    }
    
    function unstake(uint256 _amount) external returns (uint256) {
        return coreStaking.unstake(_amount);
    }
    
    function getStakingAPY() external view returns (uint256) {
        return coreStaking.getCurrentAPY();
    }
    
    function getUserStakedAmount(address _user) external view returns (uint256) {
        return coreStaking.getStakedAmount(_user);
    }
}