const { ethers } = require('hardhat');

async function main() {
    console.log('🚀 Starting deployment...');

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with account:', deployer.address);

    // Check balance
    const balance = await deployer.getBalance();
    console.log('Account balance:', ethers.utils.formatEther(balance), 'ETH');

    // Deploy MockERC20 for testing (if on local network)
    const network = await ethers.provider.getNetwork();
    console.log('Network:', network.name, 'Chain ID:', network.chainId);

    let coreTokenAddress;
    if (network.chainId === 31337) { // Local Hardhat network
        console.log('\n📦 Deploying Mock CORE Token for testing...');
        const MockToken = await ethers.getContractFactory('MockERC20');
        const coreToken = await MockToken.deploy(
            'Core Token',
            'CORE',
            ethers.utils.parseEther('1000000') // 1M tokens
        );
        await coreToken.deployed();
        coreTokenAddress = coreToken.address;
        console.log('✅ Mock CORE Token deployed to:', coreTokenAddress);
    } else {
        // Use real CORE token address from env or hardcoded
        coreTokenAddress = process.env.CORE_TOKEN_ADDRESS || '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f';
    }

    // FIXED: Use hardcoded treasury address for testing
    const treasuryAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Hardhat account #0

    console.log('\n📦 Deploying YieldOptimizer...');
    console.log('Core Token Address:', coreTokenAddress);
    console.log('Treasury Address:', treasuryAddress);

    // Validate treasury address format
    if (!ethers.utils.isAddress(treasuryAddress)) {
        throw new Error(`Invalid treasury address: ${treasuryAddress}`);
    }

    // Deploy YieldOptimizer contract
    const YieldOptimizer = await ethers.getContractFactory('YieldOptimizer');
    const yieldOptimizer = await YieldOptimizer.deploy(coreTokenAddress, treasuryAddress);
    await yieldOptimizer.deployed();

    console.log('✅ YieldOptimizer deployed to:', yieldOptimizer.address);

    // Deploy CoreStakingAdapter
    console.log('\n📦 Deploying CoreStakingAdapter...');

    const CoreStakingAdapter = await ethers.getContractFactory('CoreStakingAdapter');
    const coreStakingAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
    const stCoreAddress = '0x0000000000000000000000000000000000000000'; // Placeholder

    const coreStakingAdapter = await CoreStakingAdapter.deploy(coreStakingAddress, stCoreAddress);
    await coreStakingAdapter.deployed();

    console.log('✅ CoreStakingAdapter deployed to:', coreStakingAdapter.address);

    // Add initial strategies
    console.log('\n⚙️ Adding initial strategies...');

    const strategies = [
        {
            protocol: coreStakingAdapter.address,
            apy: 520, // 5.20%
            riskLevel: 1,
            name: 'Core Native Staking'
        },
        {
            protocol: '0x0000000000000000000000000000000000000001',
            apy: 850, // 8.50%
            riskLevel: 2,
            name: 'Core Lending Protocol'
        },
        {
            protocol: '0x0000000000000000000000000000000000000002',
            apy: 1280, // 12.80%
            riskLevel: 3,
            name: 'Bitcoin Yield Farming'
        }
    ];

    for (let i = 0; i < strategies.length; i++) {
        try {
            const strategy = strategies[i];
            console.log(`Adding strategy ${i + 1}: ${strategy.name}`);

            const tx = await yieldOptimizer.addStrategy(
                strategy.protocol,
                strategy.apy,
                strategy.riskLevel,
                strategy.name
            );
            await tx.wait();
            console.log(`✅ Added strategy: ${strategy.name}`);
        } catch (error) {
            console.error(`❌ Failed to add strategy:`, error.message);
        }
    }

    // Save deployment info
    const deploymentInfo = {
        network: {
            name: network.name,
            chainId: network.chainId
        },
        deployer: deployer.address,
        contracts: {
            YieldOptimizer: {
                address: yieldOptimizer.address,
                constructorArgs: [coreTokenAddress, treasuryAddress]
            },
            CoreStakingAdapter: {
                address: coreStakingAdapter.address,
                constructorArgs: [coreStakingAddress, stCoreAddress]
            }
        },
        coreToken: coreTokenAddress,
        treasury: treasuryAddress,
        strategies: strategies.length,
        timestamp: new Date().toISOString()
    };

    console.log('\n📋 Deployment Summary:');
    console.log(JSON.stringify(deploymentInfo, null, 2));

    console.log('\n🎉 Deployment complete!');
    console.log('\n📝 Contract Addresses:');
    console.log(`YieldOptimizer: ${yieldOptimizer.address}`);
    console.log(`CoreStakingAdapter: ${coreStakingAdapter.address}`);
    console.log(`Core Token: ${coreTokenAddress}`);
    console.log(`Treasury: ${treasuryAddress}`);

    // Save addresses to file
    const fs = require('fs');
    fs.writeFileSync(
        'deployed-contracts.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log('💾 Deployment info saved to deployed-contracts.json');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    });