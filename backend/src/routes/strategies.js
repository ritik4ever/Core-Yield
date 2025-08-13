const express = require('express');
const router = express.Router();
const Strategy = require('../models/Strategy');

// Get all strategies
router.get('/', async (req, res) => {
    try {
        const strategies = await Strategy.find({ active: true });

        // Add mock live data
        const strategiesWithData = strategies.map(strategy => ({
            ...strategy.toObject(),
            tvl: Math.floor(Math.random() * 50000000) + 1000000,
            participants: Math.floor(Math.random() * 5000) + 100
        }));

        res.json({ strategies: strategiesWithData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get strategy by ID
router.get('/:id', async (req, res) => {
    try {
        const strategy = await Strategy.findById(req.params.id);
        if (!strategy) {
            return res.status(404).json({ error: 'Strategy not found' });
        }
        res.json({ strategy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;