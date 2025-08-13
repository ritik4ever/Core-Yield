const axios = require('axios');

class PriceService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async getBitcoinPrice() {
        try {
            const cacheKey = 'btc-price';
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            // Mock price data for demo
            const price = {
                usd: 43250 + Math.random() * 1000,
                change24h: (Math.random() - 0.5) * 2000,
                changePercentage24h: (Math.random() - 0.5) * 10,
                timestamp: Date.now()
            };

            this.cache.set(cacheKey, {
                data: price,
                timestamp: Date.now()
            });

            return price;
        } catch (error) {
            console.error('Error fetching Bitcoin price:', error);
            // Return fallback data
            return {
                usd: 43500,
                change24h: 0,
                changePercentage24h: 0,
                timestamp: Date.now()
            };
        }
    }

    async getCorePrice() {
        try {
            // Mock Core token price
            return {
                usd: 1.15 + Math.random() * 0.1,
                change24h: (Math.random() - 0.5) * 0.1,
                changePercentage24h: (Math.random() - 0.5) * 5,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error fetching Core price:', error);
            return {
                usd: 1.20,
                change24h: 0,
                changePercentage24h: 0,
                timestamp: Date.now()
            };
        }
    }

    async getMultiplePrices(tokens = ['bitcoin', 'core']) {
        try {
            const prices = {};

            if (tokens.includes('bitcoin')) {
                prices.bitcoin = await this.getBitcoinPrice();
            }

            if (tokens.includes('core')) {
                prices.core = await this.getCorePrice();
            }

            return prices;
        } catch (error) {
            console.error('Error fetching multiple prices:', error);
            return {};
        }
    }

    // Start background price updates
    startPriceUpdates() {
        setInterval(async () => {
            try {
                await this.getBitcoinPrice();
                await this.getCorePrice();
                console.log('📈 Price data updated');
            } catch (error) {
                console.error('Price update error:', error);
            }
        }, 30000); // Update every 30 seconds
    }
}

module.exports = new PriceService();