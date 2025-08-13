const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get transactions
router.get('/', async (req, res) => {
    try {
        const transactions = [];
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create transaction
router.post('/', async (req, res) => {
    try {
        const transaction = {
            hash: req.body.hash || '0x123...',
            type: req.body.type || 'deposit',
            amount: req.body.amount || 0,
            status: 'pending'
        };

        res.status(201).json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;