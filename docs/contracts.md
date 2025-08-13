### `docs/contracts.md`
```markdown
# Smart Contract Documentation

## YieldOptimizer.sol

Main contract for managing yield optimization strategies.

### Core Functions

#### deposit(uint256 _strategyId, uint256 _amount, bool _autoCompound)
Deposit tokens into a yield strategy.

**Parameters:**
- `_strategyId`: ID of the strategy to deposit into
- `_amount`: Amount of tokens to deposit
- `_autoCompound`: Whether to auto-compound rewards

**Events:**
- `Deposit(address indexed user, uint256 amount, uint256 strategyId)`

#### withdraw(uint256 _depositIndex, uint256 _amount)
Withdraw tokens from a position.

**Parameters:**
- `_depositIndex`: Index of the user's deposit
- `_amount`: Amount to withdraw

**Events:**
- `Withdraw(address indexed user, uint256 amount, uint256 strategyId)`

[Continue with more contract documentation...]