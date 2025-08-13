const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user dashboard (mock auth)
router.get('/dashboard', async (req, res) => {
    try {
        // Mock user data
        const mockUser = {
            address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            totalDeposited: 1000,
            totalRewards: 50,
            preferredRiskLevel: 3
        };

        const portfolio = {
            totalValue: mockUser.totalDeposited + mockUser.totalRewards,
            totalDeposited: mockUser.totalDeposited,
            totalRewards: mockUser.totalRewards,
            currentAPY: 8.7
        };

        res.json({
            user: mockUser,
            portfolio,
            yieldHistory: [],
            recentTransactions: []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user portfolio
router.get('/portfolio', async (req, res) => {
    try {
        const summary = {
            totalValue: 1050,
            totalDeposited: 1000,
            totalRewards: 50,
            averageAPY: 8.7,
            activePositions: 2
        };

        const positions = [
            {
                id: '1',
                strategyName: 'Core Native Staking',
                amount: 600,
                apy: 5.2,
                rewards: 30
            },
            {
                id: '2',
                strategyName: 'Bitcoin Lending',
                amount: 400,
                apy: 12.8,
                rewards: 20
            }
        ];

        res.json({ summary, positions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;