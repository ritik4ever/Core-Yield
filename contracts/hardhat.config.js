require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: '0.8.19',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        core_mainnet: {
            url: process.env.CORE_MAINNET_RPC || 'https://rpc.coredao.org',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1116,
            gasPrice: 'auto',
        },
        core_testnet: {
            url: process.env.CORE_TESTNET_RPC || 'https://rpc.test.btcs.network',
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1115,
            gasPrice: 'auto',
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
    },
    mocha: {
        timeout: 40000,
    },
};