const express = require('express');
const router = express.Router();

// Generate nonce
router.post('/nonce', async (req, res) => {
    try {
        const { address } = req.body;
        const nonce = Math.floor(Math.random() * 1000000).toString();
        const message = `Sign this message to authenticate.\nNonce: ${nonce}`;

        res.json({ message, nonce });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify signature
router.post('/verify', async (req, res) => {
    try {
        const { address, signature, message } = req.body;

        // Mock token
        const token = 'mock-jwt-token';

        res.json({
            success: true,
            token,
            user: {
                address,
                totalDeposited: 0,
                totalRewards: 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;