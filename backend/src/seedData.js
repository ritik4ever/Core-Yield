const mongoose = require('mongoose');
const Strategy = require('./models/Strategy');
require('dotenv').config();

const seedStrategies = [
  {
    name: 'Core Native Staking',
    description: 'Low-risk Bitcoin staking with guaranteed returns',
    protocol: 'Core Blockchain',
    contractAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    apy: 5.2,
    riskLevel: 1,
    category: 'staking',
    minimumDeposit: 0.01
  },
  {
    name: 'Bitcoin Lending',
    description: 'Lend Bitcoin to earn interest',
    protocol: 'Compound Core',
    contractAddress: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    apy: 12.8,
    riskLevel: 2,
    category: 'lending',
    minimumDeposit: 0.05
  },
  {
    name: 'Yield Farming',
    description: 'Advanced yield farming strategies',
    protocol: 'SushiSwap Core',
    contractAddress: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    apy: 22.5,
    riskLevel: 3,
    category: 'farming',
    minimumDeposit: 0.1
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bitcoin-yield-optimizer');
    console.log('📊 Connected to MongoDB');
    
    console.log('🗑️ Clearing existing strategies...');
    await Strategy.deleteMany({});
    
    console.log('📦 Inserting seed strategies...');
    await Strategy.insertMany(seedStrategies);
    
    console.log('✅ Database seeded successfully with', seedStrategies.length, 'strategies');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
