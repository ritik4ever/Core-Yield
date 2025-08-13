const express = require('express');
const router = express.Router();

// Get analytics
router.get('/', async (req, res) => {
    try {
        const analytics = {
            portfolioValue: 12845.67,
            totalRewards: 1284.33,
            averageAPY: 8.7,
            performanceHistory: []
        };

        res.json({ analytics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;