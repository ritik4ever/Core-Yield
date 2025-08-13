const { ethers } = require('ethers');

class BlockchainService {
    constructor() {
        this.provider = null;
        this.initProvider();
    }

    initProvider() {
        try {
            const rpcUrl = process.env.CORE_RPC_URL || 'http://127.0.0.1:8545';
            this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            console.log('🔗 Blockchain service connected to:', rpcUrl);
        } catch (error) {
            console.error('Failed to connect to blockchain:', error);
        }
    }

    async getBalance(address) {
        try {
            if (!this.provider) return '0';
            const balance = await this.provider.getBalance(address);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error getting balance:', error);
            return '0';
        }
    }

    async getTransactionStatus(txHash) {
        try {
            if (!this.provider) return null;
            const receipt = await this.provider.getTransactionReceipt(txHash);
            return receipt;
        } catch (error) {
            console.error('Error getting transaction status:', error);
            return null;
        }
    }
}

module.exports = new BlockchainService();