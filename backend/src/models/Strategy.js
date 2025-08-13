const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    protocol: {
        type: String,
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    apy: {
        type: Number,
        required: true
    },
    riskLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    category: {
        type: String,
        required: true,
        enum: ['staking', 'lending', 'farming', 'defi']
    },
    minimumDeposit: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Strategy', strategySchema);