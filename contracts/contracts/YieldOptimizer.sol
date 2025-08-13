// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract YieldOptimizer is ReentrancyGuard, Ownable, Pausable {
    struct Strategy {
        address protocol;
        uint256 apy;
        uint256 tvl;
        uint256 riskLevel; // 1-5 scale
        bool active;
        string name;
    }
    
    struct UserDeposit {
        uint256 amount;
        uint256 timestamp;
        uint256 strategyId;
        uint256 pendingRewards;
        bool autoCompound;
    }
    
    mapping(uint256 => Strategy) public strategies;
    mapping(address => UserDeposit[]) public userDeposits;
    mapping(address => uint256) public userTotalDeposited;
    mapping(address => uint256) public userTotalRewards;
    
    uint256 public strategyCount;
    uint256 public totalValueLocked;
    uint256 public constant PERFORMANCE_FEE = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    IERC20 public immutable coreToken;
    address public treasury;
    
    event StrategyAdded(uint256 indexed strategyId, string name, uint256 apy);
    event Deposit(address indexed user, uint256 amount, uint256 strategyId);
    event Withdraw(address indexed user, uint256 amount, uint256 strategyId);
    event RewardsHarvested(address indexed user, uint256 amount);
    event StrategyOptimized(address indexed user, uint256 fromStrategy, uint256 toStrategy);
    
    constructor(address _coreToken, address _treasury) {
        coreToken = IERC20(_coreToken);
        treasury = _treasury;
    }
    
    function addStrategy(
        address _protocol,
        uint256 _apy,
        uint256 _riskLevel,
        string memory _name
    ) external onlyOwner {
        require(_riskLevel >= 1 && _riskLevel <= 5, "Invalid risk level");
        
        strategies[strategyCount] = Strategy({
            protocol: _protocol,
            apy: _apy,
            tvl: 0,
            riskLevel: _riskLevel,
            active: true,
            name: _name
        });
        
        emit StrategyAdded(strategyCount, _name, _apy);
        strategyCount++;
    }
    
    function deposit(uint256 _strategyId, uint256 _amount, bool _autoCompound) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(_strategyId < strategyCount, "Invalid strategy");
        require(strategies[_strategyId].active, "Strategy not active");
        
        coreToken.transferFrom(msg.sender, address(this), _amount);
        
        userDeposits[msg.sender].push(UserDeposit({
            amount: _amount,
            timestamp: block.timestamp,
            strategyId: _strategyId,
            pendingRewards: 0,
            autoCompound: _autoCompound
        }));
        
        userTotalDeposited[msg.sender] += _amount;
        strategies[_strategyId].tvl += _amount;
        totalValueLocked += _amount;
        
        emit Deposit(msg.sender, _amount, _strategyId);
    }
    
    function withdraw(uint256 _depositIndex, uint256 _amount) 
        external 
        nonReentrant 
    {
        require(_depositIndex < userDeposits[msg.sender].length, "Invalid deposit");
        UserDeposit storage userDeposit = userDeposits[msg.sender][_depositIndex];
        require(_amount <= userDeposit.amount, "Insufficient balance");
        
        // Calculate and harvest rewards before withdrawal
        _harvestRewards(_depositIndex);
        
        userDeposit.amount -= _amount;
        userTotalDeposited[msg.sender] -= _amount;
        strategies[userDeposit.strategyId].tvl -= _amount;
        totalValueLocked -= _amount;
        
        coreToken.transfer(msg.sender, _amount);
        
        emit Withdraw(msg.sender, _amount, userDeposit.strategyId);
    }
    
    function harvestRewards(uint256 _depositIndex) external nonReentrant {
        _harvestRewards(_depositIndex);
    }
    
    function _harvestRewards(uint256 _depositIndex) internal {
        UserDeposit storage userDeposit = userDeposits[msg.sender][_depositIndex];
        uint256 rewards = calculateRewards(msg.sender, _depositIndex);
        
        if (rewards > 0) {
            uint256 performanceFee = (rewards * PERFORMANCE_FEE) / FEE_DENOMINATOR;
            uint256 userRewards = rewards - performanceFee;
            
            userDeposit.pendingRewards = 0;
            userDeposit.timestamp = block.timestamp;
            userTotalRewards[msg.sender] += userRewards;
            
            if (userDeposit.autoCompound) {
                userDeposit.amount += userRewards;
                userTotalDeposited[msg.sender] += userRewards;
                strategies[userDeposit.strategyId].tvl += userRewards;
                totalValueLocked += userRewards;
            } else {
                coreToken.transfer(msg.sender, userRewards);
            }
            
            coreToken.transfer(treasury, performanceFee);
            
            emit RewardsHarvested(msg.sender, userRewards);
        }
    }
    
    function calculateRewards(address _user, uint256 _depositIndex) 
        public 
        view 
        returns (uint256) 
    {
        UserDeposit memory userDeposit = userDeposits[_user][_depositIndex];
        Strategy memory strategy = strategies[userDeposit.strategyId];
        
        uint256 timeElapsed = block.timestamp - userDeposit.timestamp;
        uint256 annualRewards = (userDeposit.amount * strategy.apy) / 10000;
        uint256 rewards = (annualRewards * timeElapsed) / 365 days;
        
        return rewards + userDeposit.pendingRewards;
    }
    
    function optimizeYield(uint256 _depositIndex, uint256 _newStrategyId) 
        external 
        nonReentrant 
    {
        require(_newStrategyId < strategyCount, "Invalid strategy");
        require(strategies[_newStrategyId].active, "Strategy not active");
        
        UserDeposit storage userDeposit = userDeposits[msg.sender][_depositIndex];
        uint256 oldStrategyId = userDeposit.strategyId;
        
        // Harvest current rewards
        _harvestRewards(_depositIndex);
        
        // Update TVL for strategies
        strategies[oldStrategyId].tvl -= userDeposit.amount;
        strategies[_newStrategyId].tvl += userDeposit.amount;
        
        // Update user deposit strategy
        userDeposit.strategyId = _newStrategyId;
        userDeposit.timestamp = block.timestamp;
        
        emit StrategyOptimized(msg.sender, oldStrategyId, _newStrategyId);
    }
    
    function getUserDeposits(address _user) 
        external 
        view 
        returns (UserDeposit[] memory) 
    {
        return userDeposits[_user];
    }
    
    function getOptimalStrategy(uint256 _riskTolerance) 
        external 
        view 
        returns (uint256 bestStrategyId, uint256 bestApy) 
    {
        bestApy = 0;
        bestStrategyId = 0;
        
        for (uint256 i = 0; i < strategyCount; i++) {
            Strategy memory strategy = strategies[i];
            if (strategy.active && 
                strategy.riskLevel <= _riskTolerance && 
                strategy.apy > bestApy) {
                bestApy = strategy.apy;
                bestStrategyId = i;
            }
        }
    }
    
    function getUserTotalValue(address _user) 
        external 
        view 
        returns (uint256 totalDeposited, uint256 totalRewards, uint256 pendingRewards) 
    {
        totalDeposited = userTotalDeposited[_user];
        totalRewards = userTotalRewards[_user];
        
        UserDeposit[] memory deposits = userDeposits[_user];
        for (uint256 i = 0; i < deposits.length; i++) {
            pendingRewards += calculateRewards(_user, i);
        }
    }
    
    function updateStrategyAPY(uint256 _strategyId, uint256 _newAPY) 
        external 
        onlyOwner 
    {
        require(_strategyId < strategyCount, "Invalid strategy");
        strategies[_strategyId].apy = _newAPY;
    }
    
    function toggleStrategy(uint256 _strategyId) external onlyOwner {
        require(_strategyId < strategyCount, "Invalid strategy");
        strategies[_strategyId].active = !strategies[_strategyId].active;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function updateTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }
}