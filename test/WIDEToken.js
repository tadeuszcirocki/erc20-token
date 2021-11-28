const { expect } = require("chai");

describe("WIDEToken contract", function () {

    let contractFactory;
    let contract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        contractFactory = await ethers.getContractFactory("MockWIDEToken");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        contract = await contractFactory.deploy();
    });


    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await contract.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await contract.balanceOf(owner.address);
            expect(await contract.totalSupply()).to.equal(ownerBalance);
        });

        it('Should have the right name', async function () {
            expect(await contract.name()).to.equal('Widelab');
        });

        it('Should have the right symbol', async function () {
            expect(await contract.symbol()).to.equal('WIDE');
        });

        it('Should have 18 decimals', async function () {
            expect(await contract.decimals()).to.equal(18);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await contract.transfer(addr1.address, 50);
            const addr1Balance = await contract.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2
            await contract.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await contract.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner
            await expect(
                contract.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed.
            expect(await contract.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await contract.balanceOf(owner.address);

            // Transfer 100 tokens from owner to addr1.
            await contract.transfer(addr1.address, 100);

            // Transfer another 50 tokens from owner to addr2.
            await contract.transfer(addr2.address, 50);

            // Check balances.
            const finalOwnerBalance = await contract.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

            const addr1Balance = await contract.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await contract.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });

    describe("Minting", function () {
        it("Should let the owner mint tokens", async function () {
            await contract.mint(addr1.address, 100);

            const addr1Balance = await contract.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
        });

        it("Should increase the total supply after minting", async function () {
            await contract.mint(addr1.address, 100);

            const ownerBalance = await contract.balanceOf(owner.address);
            expect(await contract.totalSupply()).to.equal(+ownerBalance + 100);
        });

        it("Should fail if someone other than owner tries minting", async function () {
            await expect(
                contract.connect(addr1).mint(addr2.address, 100)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});