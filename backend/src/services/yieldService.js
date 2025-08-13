const Strategy = require('../models/Strategy');
const User = require('../models/User');
const cron = require('node-cron');
const { ethers } = require('ethers');

class YieldService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.CORE_RPC_URL);
        this.optimizerContract = new ethers.Contract(
            process.env.OPTIMIZER_CONTRACT_ADDRESS,
            require('../abi/YieldOptimizer.json'),
            this.provider
        );
    }

    async getOptimizationRecommendations({ amount, riskLevel, currentStrategy, userAddress }) {
        try {
            // Get all available strategies within risk tolerance
            const availableStrategies = await Strategy.find({
                active: true,
                riskLevel: { $lte: riskLevel }
            }).sort({ apy: -1 });

            if (!availableStrategies.length) {
                return { recommendations: [], message: 'No strategies found for your risk level' };
            }

            // Calculate potential returns for each strategy
            const recommendations = await Promise.all(
                availableStrategies.map(async (strategy) => {
                    const projectedYield = await this.calculateProjectedYield(amount, strategy, 365);
                    const risk = await this.calculateRiskMetrics(strategy);

                    return {
                        strategy: {
                            id: strategy._id,
                            name: strategy.name,
                            apy: strategy.apy,
                            riskLevel: strategy.riskLevel,
                            tvl: strategy.tvl,
                            category: strategy.category
                        },
                        projectedYield,
                        risk,
                        efficiency: projectedYield.totalReturn / strategy.riskLevel,
                        recommended: strategy._id.toString() !== currentStrategy
                    };
                })
            );

            // Sort by efficiency (risk-adjusted returns)
            recommendations.sort((a, b) => b.efficiency - a.efficiency);

            return {
                recommendations: recommendations.slice(0, 5), // Top 5 recommendations
                currentStrategy: currentStrategy ?
                    recommendations.find(r => r.strategy.id.toString() === currentStrategy) : null,
                totalStrategiesAnalyzed: availableStrategies.length
            };
        } catch (error) {
            throw new Error(`Optimization analysis failed: ${error.message}`);
        }
    }

    async simulateYield({ amount, strategyId, duration, autoCompound }) {
        try {
            const strategy = await Strategy.findById(strategyId);
            if (!strategy) {
                throw new Error('Strategy not found');
            }

            const dailyRate = strategy.apy / 365 / 10000; // Convert APY to daily rate
            const days = duration;

            let principal = amount;
            let totalRewards = 0;
            const timeline = [];

            for (let day = 0; day <= days; day++) {
                const dayReward = principal * dailyRate;
                totalRewards += dayReward;

                if (autoCompound) {
                    principal += dayReward;
                }

                // Record data points for visualization (every 7 days or at milestones)
                if (day % 7 === 0 || day === days) {
                    timeline.push({
                        day,
                        principal: autoCompound ? principal : amount,
                        totalRewards,
                        totalValue: autoCompound ? principal : amount + totalRewards,
                        apy: strategy.apy
                    });
                }
            }

            const finalValue = autoCompound ? principal : amount + totalRewards;

            return {
                strategy: {
                    id: strategy._id,
                    name: strategy.name,
                    apy: strategy.apy,
                    riskLevel: strategy.riskLevel
                },
                simulation: {
                    initialAmount: amount,
                    duration,
                    autoCompound,
                    finalValue,
                    totalRewards,
                    totalReturn: finalValue - amount,
                    returnPercentage: ((finalValue - amount) / amount) * 100,
                    effectiveAPY: ((finalValue / amount) ** (365 / duration) - 1) * 100
                },
                timeline
            };
        } catch (error) {
            throw new Error(`Yield simulation failed: ${error.message}`);
        }
    }

    async compareStrategies({ strategyIds, amount, duration }) {
        try {
            const strategies = await Strategy.find({
                _id: { $in: strategyIds },
                active: true
            });

            const comparisons = await Promise.all(
                strategies.map(async (strategy) => {
                    const simulation = await this.simulateYield({
                        amount,
                        strategyId: strategy._id,
                        duration,
                        autoCompound: true
                    });

                    const risk = await this.calculateRiskMetrics(strategy);

                    return {
                        strategy: {
                            id: strategy._id,
                            name: strategy.name,
                            apy: strategy.apy,
                            riskLevel: strategy.riskLevel,
                            category: strategy.category,
                            tvl: strategy.tvl
                        },
                        returns: simulation.simulation,
                        risk,
                        sharpeRatio: this.calculateSharpeRatio(simulation.simulation.returnPercentage, risk.volatility)
                    };
                })
            );

            // Sort by total return
            comparisons.sort((a, b) => b.returns.totalReturn - a.returns.totalReturn);

            return {
                comparisons,
                summary: {
                    bestReturn: comparisons[0],
                    lowestRisk: comparisons.reduce((min, curr) =>
                        curr.risk.volatility < min.risk.volatility ? curr : min
                    ),
                    bestRiskAdjusted: comparisons.reduce((max, curr) =>
                        curr.sharpeRatio > max.sharpeRatio ? curr : max
                    )
                },
                metadata: {
                    amount,
                    duration,
                    strategiesCompared: comparisons.length,
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Strategy comparison failed: ${error.message}`);
        }
    }

    async generateYieldForecast({ strategyId, period }) {
        try {
            const strategy = await Strategy.findById(strategyId);
            if (!strategy) {
                throw new Error('Strategy not found');
            }

            const historicalData = strategy.historicalAPY.slice(-30); // Last 30 data points

            if (historicalData.length < 5) {
                return {
                    forecast: 'Insufficient historical data for accurate forecasting',
                    confidence: 'low',
                    currentAPY: strategy.apy
                };
            }

            // Simple moving average and trend analysis
            const recentAPYs = historicalData.map(h => h.apy);
            const movingAverage = recentAPYs.reduce((sum, apy) => sum + apy, 0) / recentAPYs.length;

            // Calculate trend (linear regression slope)
            const trend = this.calculateTrend(recentAPYs);

            let forecastDays;
            switch (period) {
                case '7d': forecastDays = 7; break;
                case '30d': forecastDays = 30; break;
                case '90d': forecastDays = 90; break;
                default: forecastDays = 30;
            }

            const forecastedAPY = Math.max(0, movingAverage + (trend * forecastDays));
            const confidence = this.calculateConfidence(recentAPYs);

            return {
                strategy: {
                    id: strategy._id,
                    name: strategy.name,
                    currentAPY: strategy.apy
                },
                forecast: {
                    period,
                    forecastedAPY,
                    movingAverage,
                    trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
                    confidence,
                    factors: this.getMarketFactors()
                },
                historicalContext: {
                    dataPoints: historicalData.length,
                    averageAPY: movingAverage,
                    volatility: this.calculateVolatility(recentAPYs),
                    maxAPY: Math.max(...recentAPYs),
                    minAPY: Math.min(...recentAPYs)
                }
            };
        } catch (error) {
            throw new Error(`Yield forecast failed: ${error.message}`);
        }
    }

    async getMarketOverview() {
        try {
            const strategies = await Strategy.find({ active: true });

            const totalTVL = strategies.reduce((sum, s) => sum + s.tvl, 0);
            const averageAPY = strategies.reduce((sum, s) => sum + s.apy, 0) / strategies.length;
            const maxAPY = Math.max(...strategies.map(s => s.apy));

            const riskDistribution = {};
            strategies.forEach(s => {
                riskDistribution[s.riskLevel] = (riskDistribution[s.riskLevel] || 0) + 1;
            });

            const categoryBreakdown = {};
            strategies.forEach(s => {
                categoryBreakdown[s.category] = {
                    count: (categoryBreakdown[s.category]?.count || 0) + 1,
                    totalTVL: (categoryBreakdown[s.category]?.totalTVL || 0) + s.tvl,
                    averageAPY: categoryBreakdown[s.category]?.averageAPY || []
                };
                categoryBreakdown[s.category].averageAPY.push(s.apy);
            });

            // Calculate average APY for each category
            Object.keys(categoryBreakdown).forEach(category => {
                const apys = categoryBreakdown[category].averageAPY;
                categoryBreakdown[category].averageAPY =
                    apys.reduce((sum, apy) => sum + apy, 0) / apys.length;
            });

            return {
                overview: {
                    totalStrategies: strategies.length,
                    totalTVL,
                    averageAPY,
                    maxAPY,
                    activeProtocols: new Set(strategies.map(s => s.protocol)).size
                },
                riskDistribution,
                categoryBreakdown,
                topStrategies: strategies
                    .sort((a, b) => b.apy - a.apy)
                    .slice(0, 5)
                    .map(s => ({
                        id: s._id,
                        name: s.name,
                        apy: s.apy,
                        tvl: s.tvl,
                        riskLevel: s.riskLevel
                    })),
                marketTrends: await this.getMarketTrends(),
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Market overview failed: ${error.message}`);
        }
    }

    // Helper methods
    async calculateProjectedYield(amount, strategy, days) {
        const dailyRate = strategy.apy / 365 / 10000;
        const totalReturn = amount * dailyRate * days;

        return {
            totalReturn,
            percentage: (totalReturn / amount) * 100,
            dailyReturn: amount * dailyRate,
            monthlyReturn: amount * dailyRate * 30,
            annualizedReturn: totalReturn * (365 / days)
        };
    }

    async calculateRiskMetrics(strategy) {
        const historicalAPYs = strategy.historicalAPY.map(h => h.apy);

        return {
            riskLevel: strategy.riskLevel,
            volatility: this.calculateVolatility(historicalAPYs),
            maxDrawdown: this.calculateMaxDrawdown(historicalAPYs),
            consistency: this.calculateConsistency(historicalAPYs),
            liquidityRisk: strategy.lockupPeriod / (24 * 3600), // Convert to days
            smartContractRisk: strategy.metadata?.audit ? 'low' : 'medium'
        };
    }

    calculateSharpeRatio(returnPercentage, volatility) {
        const riskFreeRate = 3; // Assuming 3% risk-free rate
        return volatility > 0 ? (returnPercentage - riskFreeRate) / volatility : 0;
    }

    calculateVolatility(values) {
        if (values.length < 2) return 0;

        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

        return Math.sqrt(variance);
    }

    calculateTrend(values) {
        if (values.length < 2) return 0;

        const n = values.length;
        const xSum = (n * (n - 1)) / 2; // Sum of indices 0 to n-1
        const ySum = values.reduce((sum, val) => sum + val, 0);
        const xySum = values.reduce((sum, val, i) => sum + (i * val), 0);
        const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices

        return (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    }

    calculateConfidence(values) {
        const volatility = this.calculateVolatility(values);
        if (volatility < 50) return 'high';
        if (volatility < 100) return 'medium';
        return 'low';
    }

    calculateMaxDrawdown(values) {
        if (values.length < 2) return 0;

        let maxDrawdown = 0;
        let peak = values[0];

        for (let i = 1; i < values.length; i++) {
            if (values[i] > peak) {
                peak = values[i];
            } else {
                const drawdown = (peak - values[i]) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }

        return maxDrawdown;
    }

    calculateConsistency(values) {
        if (values.length < 2) return 1;

        const volatility = this.calculateVolatility(values);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

        // Higher consistency score for lower volatility relative to mean
        return mean > 0 ? Math.max(0, 1 - (volatility / mean)) : 0;
    }

    getMarketFactors() {
        return [
            'Bitcoin price volatility',
            'Core network adoption',
            'DeFi protocol updates',
            'Regulatory changes',
            'Market sentiment'
        ];
    }

    async getMarketTrends() {
        // This would typically fetch real market data
        return {
            bitcoinPrice: 45000, // Placeholder
            corePrice: 1.2, // Placeholder
            totalValueLocked: 150000000, // Placeholder
            avgYieldTrend: 'stable',
            riskAppetite: 'moderate'
        };
    }
}

// Singleton instance
const yieldService = new YieldService();

// Background job to update yield data
const startYieldUpdater = () => {
    // Update APY data every hour
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('🔄 Updating yield data...');
            await updateAllStrategyAPYs();
            console.log('✅ Yield data updated successfully');
        } catch (error) {
            console.error('❌ Failed to update yield data:', error);
        }
    });
};

async function updateAllStrategyAPYs() {
    const strategies = await Strategy.find({ active: true });

    for (const strategy of strategies) {
        try {
            // In production, this would fetch real-time APY data from the protocol
            const currentAPY = await fetchRealTimeAPY(strategy.contractAddress);

            if (currentAPY !== strategy.apy) {
                await strategy.updateAPY(currentAPY);
            }
        } catch (error) {
            console.error(`Failed to update APY for strategy ${strategy.name}:`, error);
        }
    }
}

async function fetchRealTimeAPY(contractAddress) {
    // Placeholder - in production, this would call the actual protocol contract
    // For demo purposes, we'll simulate APY fluctuation
    const baseAPY = 500; // 5%
    const volatility = 50; // ±0.5%
    const randomChange = (Math.random() - 0.5) * volatility;

    return Math.max(0, baseAPY + randomChange);
}

module.exports = yieldService;
module.exports.startYieldUpdater = startYieldUpdater;