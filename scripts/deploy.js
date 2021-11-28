async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    //token deployment
    const Token = await ethers.getContractFactory("WIDEToken");
    const token = await Token.deploy();

    console.log("Token address:", token.address);

    //vesting deployment
    const Vesting = await ethers.getContractFactory("WIDEVesting");
    const vesting = await Vesting.deploy(token.address);

    console.log("Vesting address:", vesting.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });