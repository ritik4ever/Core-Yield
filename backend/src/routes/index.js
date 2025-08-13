const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const strategyRoutes = require('./strategies');
const transactionRoutes = require('./transactions');
const analyticsRoutes = require('./analytics');
const yieldRoutes = require('./yield');

// Route mounting
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/strategies', strategyRoutes);
router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/yield', yieldRoutes);

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        name: 'Bitcoin Yield Optimizer API',
        version: '1.0.0',
        description: 'API for Core Connect Global Buildathon project',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            strategies: '/api/strategies',
            transactions: '/api/transactions',
            analytics: '/api/analytics',
            yield: '/api/yield'
        }
    });
});

module.exports = router;