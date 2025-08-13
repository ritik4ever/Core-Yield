const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('YieldOptimizer', function () {
    let yieldOptimizer;
    let coreToken;
    let owner;
    let user1;
    let user2;
    let treasury;

    beforeEach(async function () {
        [owner, user1, user2, treasury] = await ethers.getSigners();

        // Deploy mock Core token
        const MockToken = await ethers.getContractFactory('MockERC20');
        coreToken = await MockToken.deploy(
            'Core Token',
            'CORE',
            ethers.utils.parseEther('1000000')
        );
        await coreToken.deployed();

        // Deploy YieldOptimizer
        const YieldOptimizer = await ethers.getContractFactory('YieldOptimizer');
        yieldOptimizer = await YieldOptimizer.deploy(
            coreToken.address,
            treasury.address
        );
        await yieldOptimizer.deployed();

        // Give users some tokens
        await coreToken.transfer(user1.address, ethers.utils.parseEther('1000'));
        await coreToken.transfer(user2.address, ethers.utils.parseEther('1000'));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await yieldOptimizer.owner()).to.equal(owner.address);
        });

        it('Should set the correct core token', async function () {
            expect(await yieldOptimizer.coreToken()).to.equal(coreToken.address);
        });

        it('Should initialize with zero strategies', async function () {
            const strategyCount = await yieldOptimizer.strategyCount();
            expect(strategyCount).to.equal(0);
        });
    });

    describe('Strategy Management', function () {
        it('Should add a new strategy', async function () {
            await yieldOptimizer.addStrategy(
                user1.address, // protocol address
                500, // 5% APY
                2, // risk level
                'Test Strategy'
            );

            const strategyCount = await yieldOptimizer.strategyCount();
            expect(strategyCount).to.equal(1);

            const strategy = await yieldOptimizer.strategies(0);
            expect(strategy.name).to.equal('Test Strategy');
            expect(strategy.apy).to.equal(500);
            expect(strategy.riskLevel).to.equal(2);
            expect(strategy.active).to.equal(true);
        });

        it('Should fail to add strategy with invalid risk level', async function () {
            await expect(
                yieldOptimizer.addStrategy(
                    user1.address,
                    500,
                    6, // invalid risk level
                    'Test Strategy'
                )
            ).to.be.revertedWith('Invalid risk level');
        });

        it('Should only allow owner to add strategies', async function () {
            await expect(
                yieldOptimizer.connect(user1).addStrategy(
                    user1.address,
                    500,
                    2,
                    'Test Strategy'
                )
            ).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe('Basic Functionality', function () {
        beforeEach(async function () {
            // Add a test strategy
            await yieldOptimizer.addStrategy(
                user1.address,
                500, // 5% APY
                2,
                'Test Strategy'
            );
        });

        it('Should allow token approval and deposit', async function () {
            const depositAmount = ethers.utils.parseEther('100');

            // Approve tokens
            await coreToken.connect(user1).approve(yieldOptimizer.address, depositAmount);

            // Check allowance
            const allowance = await coreToken.allowance(user1.address, yieldOptimizer.address);
            expect(allowance).to.equal(depositAmount);

            // Make deposit
            await expect(
                yieldOptimizer.connect(user1).deposit(0, depositAmount, true)
            ).to.emit(yieldOptimizer, 'Deposit')
                .withArgs(user1.address, depositAmount, 0);

            // Check user deposits
            const userDeposits = await yieldOptimizer.getUserDeposits(user1.address);
            expect(userDeposits.length).to.equal(1);
            expect(userDeposits[0].amount).to.equal(depositAmount);
            expect(userDeposits[0].strategyId).to.equal(0);
            expect(userDeposits[0].autoCompound).to.equal(true);
        });

        it('Should track total value locked', async function () {
            const depositAmount = ethers.utils.parseEther('100');

            await coreToken.connect(user1).approve(yieldOptimizer.address, depositAmount);
            await yieldOptimizer.connect(user1).deposit(0, depositAmount, true);

            const totalTVL = await yieldOptimizer.totalValueLocked();
            expect(totalTVL).to.equal(depositAmount);
        });
    });
});