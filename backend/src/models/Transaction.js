const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    userAddress: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw', 'harvest', 'optimize', 'compound']
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    },
    strategyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Strategy'
    },
    blockNumber: Number,
    gasUsed: Number,
    gasPrice: Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    confirmedAt: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);