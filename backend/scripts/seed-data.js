const mongoose = require('mongoose');
const Strategy = require('../backend/src/models/Strategy');
require('dotenv').config();

const strategies = [
    {
        name: 'Core Native Staking',
        description: 'Stake CORE tokens directly on the Core blockchain to secure the network and earn rewards. Low risk with steady returns.',
        protocol: 'Core Blockchain',
        contractAddress: '0x0000000000000000000000000000000000000001',
        apy: 520, // 5.20%
        tvl: 50000000, // $50M
        riskLevel: 1,
        active: true,
        category: 'staking',
        minimumDeposit: 1,
        lockupPeriod: 0,
        fees: {
            managementFee: 0,
            performanceFee: 200 // 2%
        },
        metadata: {
            website: 'https://stake.coredao.org',
            documentation: 'https://docs.coredao.org/staking',
            audit: 'https://audits.coredao.org/staking'
        }
    },
    {
        name: 'Core Lending Protocol',
        description: 'Lend your CORE tokens to earn interest from borrowers. Moderate risk with competitive yields.',
        protocol: 'Compound Core',
        contractAddress: '0x0000000000000000000000000000000000000002',
        apy: 850, // 8.50%
        tvl: 25000000, // $25M
        riskLevel: 2,
        active: true,
        category: 'lending',
        minimumDeposit: 10,
        lockupPeriod: 0,
        fees: {
            managementFee: 50, // 0.5%
            performanceFee: 250 // 2.5%
        },
        metadata: {
            website: 'https://compound.core.finance',
            documentation: 'https://docs.compound.core.finance',
            audit: 'https://audits.compound.core.finance'
        }
    },
    {
        name: 'Bitcoin Yield Farming',
        description: 'Farm yield by providing liquidity to Bitcoin-Core trading pairs. Higher returns with impermanent loss risk.',
        protocol: 'SushiSwap Core',
        contractAddress: '0x0000000000000000000000000000000000000003',
        apy: 1280, // 12.80%
        tvl: 15000000, // $15M
        riskLevel: 3,
        active: true,
        category: 'farming',
        minimumDeposit: 50,
        lockupPeriod: 0,
        fees: {
            managementFee: 100, // 1%
            performanceFee: 300 // 3%
        },
        metadata: {
            website: 'https://sushi.core.finance',
            documentation: 'https://docs.sushi.core.finance',
            audit: 'https://audits.sushi.core.finance'
        }
    },
    {
        name: 'High-Yield DeFi Strategy',
        description: 'Advanced strategy combining multiple DeFi protocols for maximum yield. Higher risk with potential for significant returns.',
        protocol: 'Yearn Core',
        contractAddress: '0x0000000000000000000000000000000000000004',
        apy: 1850, // 18.50%
        tvl: 8000000, // $8M
        riskLevel: 4,
        active: true,
        category: 'defi',
        minimumDeposit: 100,
        lockupPeriod: 0,
        fees: {
            managementFee: 150, // 1.5%
            performanceFee: 400 // 4%
        },
        metadata: {
            website: 'https://yearn.core.finance',
            documentation: 'https://docs.yearn.core.finance',
            audit: 'https://audits.yearn.core.finance'
        }
    },
    {
        name: 'Aggressive Yield Strategy',
        description: 'Highest risk, highest reward strategy using leverage and exotic derivatives. Only for experienced users.',
        protocol: 'Alpha Core',
        contractAddress: '0x0000000000000000000000000000000000000005',
        apy: 2500, // 25.00%
        tvl: 3000000, // $3M
        riskLevel: 5,
        active: true,
        category: 'defi',
        minimumDeposit: 500,
        lockupPeriod: 86400, // 1 day
        fees: {
            managementFee: 200, // 2%
            performanceFee: 500 // 5%
        },
        metadata: {
            website: 'https://alpha.core.finance',
            documentation: 'https://docs.alpha.core.finance',
            audit: 'https://audits.alpha.core.finance'
        }
    },
    {
        name: 'Core-Bitcoin Bridge Farming',
        description: 'Earn rewards by providing liquidity for the Core-Bitcoin bridge. Moderate risk with steady yields.',
        protocol: 'Core Bridge',
        contractAddress: '0x0000000000000000000000000000000000000006',
        apy: 720, // 7.20%
        tvl: 12000000, // $12M
        riskLevel: 2,
        active: true,
        category: 'farming',
        minimumDeposit: 25,
        lockupPeriod: 0,
        fees: {
            managementFee: 75, // 0.75%
            performanceFee: 200 // 2%
        },
        metadata: {
            website: 'https://bridge.coredao.org',
            documentation: 'https://docs.coredao.org/bridge',
            audit: 'https://audits.coredao.org/bridge'
        }
    }
];

async function seedStrategies() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('🗑️ Clearing existing strategies...');
        await Strategy.deleteMany({});

        console.log('📦 Inserting seed strategies...');
        const insertedStrategies = await Strategy.insertMany(strategies);

        console.log(`✅ Successfully seeded ${insertedStrategies.length} strategies`);

        // Display summary
        console.log('\n📊 Strategy Summary:');
        const summary = insertedStrategies.reduce((acc, strategy) => {
            acc[strategy.category] = (acc[strategy.category] || 0) + 1;
            return acc;
        }, {});

        console.table(summary);

        console.log('\n💰 TVL Summary:');
        const totalTVL = insertedStrategies.reduce((sum, strategy) => sum + strategy.tvl, 0);
        console.log(`Total TVL: $${(totalTVL / 1000000).toFixed(1)}M`);

        console.log('\n📈 APY Range:');
        const apys = insertedStrategies.map(s => s.apy / 100).sort((a, b) => a - b);
        console.log(`Min APY: ${apys[0]}%`);
        console.log(`Max APY: ${apys[apys.length - 1]}%`);
        console.log(`Avg APY: ${(apys.reduce((sum, apy) => sum + apy, 0) / apys.length).toFixed(2)}%`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run if called directly
if (require.main === module) {
    seedStrategies()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = { seedStrategies, strategies };