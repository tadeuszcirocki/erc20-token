const { expect } = require("chai");

describe("WIDEVesting contract", function () {

    let TokenFactory;
    let token;
    let VestingFactory;
    let vesting;
    let owner;
    let addr1;
    let addr2;
    let addrs;


    before(async function () {
        TokenFactory = await ethers.getContractFactory("WIDEToken");
        VestingFactory = await ethers.getContractFactory("MockWIDEVesting");
    });

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        token = await TokenFactory.deploy();
        await token.deployed();
        vesting = await VestingFactory.deploy(token.address, 0);
        await vesting.deployed();

        await token.transfer(vesting.address, 100000);
    });


    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await vesting.owner()).to.equal(owner.address);
        });
    });

    describe("Vesting", function () {
        it("Should fail if someone other than owner tries to vest", async function () {
            await expect(
                vesting.connect(addr1).vest(addr2.address, 100)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should fail if owner tries to vest more than contract balance", async function () {
            await expect(
                vesting.vest(addr2.address, 1000000)
            ).to.be.revertedWith("WIDEVesting: Not enough tokens in the contract balance");
        });

        it("Should vest correct amount of tokens to an address", async function () {
            await vesting.vest(addr1.address, 100);
            let vestedBalance = await vesting.initialBalances(addr1.address);
            expect(vestedBalance).to.equal(100);
        });
    });

    describe("Claiming", function () {
        it("Should be able to claim 1/30 of his tokens at first day", async function () {
            await vesting.vest(addr1.address, 90);
            await vesting.connect(addr1).claim(3);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(3);
        });

        it("Shouldn't be able to claim more than 1/30 of his tokens at first day", async function () {
            await vesting.vest(addr1.address, 90);
            await expect(
                vesting.connect(addr1).claim(4)
            ).to.be.revertedWith("WIDEVesting: Amount too high");
        });

        it("Should be able to claim 15/30 of his tokens at 15th day", async function () {
            token = await TokenFactory.deploy();
            await token.deployed();
            vesting = await VestingFactory.deploy(token.address, 14);
            await vesting.deployed();
            await token.transfer(vesting.address, 100000);

            await vesting.vest(addr1.address, 90);
            await vesting.connect(addr1).claim(25);
            await vesting.connect(addr1).claim(20);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(45);
        });

        it("Shouldn't be able to claim more than 15/30 of his tokens at 15th day", async function () {
            token = await TokenFactory.deploy();
            await token.deployed();
            vesting = await VestingFactory.deploy(token.address, 14);
            await vesting.deployed();
            await token.transfer(vesting.address, 100000);

            await vesting.vest(addr1.address, 90);
            await expect(
                vesting.connect(addr1).claim(46)
            ).to.be.revertedWith("WIDEVesting: Amount too high");
        });

        it("Should be able to claim all of his tokens at 30th day or later", async function () {
            token = await TokenFactory.deploy();
            await token.deployed();
            vesting = await VestingFactory.deploy(token.address, 40);
            await vesting.deployed();
            await token.transfer(vesting.address, 100000);

            await vesting.vest(addr1.address, 90);
            await vesting.connect(addr1).claim(90);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(90);
        });

        it("Shouldn't be able to claim more tokens than vested at 30th day or later", async function () {
            token = await TokenFactory.deploy();
            await token.deployed();
            vesting = await VestingFactory.deploy(token.address, 40);
            await vesting.deployed();
            await token.transfer(vesting.address, 100000);

            await vesting.vest(addr1.address, 90);
            await expect(
                vesting.connect(addr1).claim(91)
            ).to.be.revertedWith("WIDEVesting: Amount too high");
        });
    });
});