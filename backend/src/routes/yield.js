const express = require('express');
const router = express.Router();
const Strategy = require('../models/Strategy');

// Get optimization recommendations
router.get('/optimize', async (req, res) => {
    try {
        const { amount = 1000, riskLevel = 3 } = req.query;

        const optimization = {
            inputParameters: {
                amount: parseFloat(amount),
                riskLevel: parseInt(riskLevel)
            },
            recommendations: [
                {
                    strategy: { name: 'Core Staking', apy: 5.2, riskLevel: 1 },
                    allocation: 60,
                    amount: parseFloat(amount) * 0.6
                },
                {
                    strategy: { name: 'Bitcoin Lending', apy: 12.8, riskLevel: 2 },
                    allocation: 40,
                    amount: parseFloat(amount) * 0.4
                }
            ],
            summary: {
                expectedAPY: 8.32,
                expectedAnnualReturn: parseFloat(amount) * 0.0832
            }
        };

        res.json({ optimization });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;