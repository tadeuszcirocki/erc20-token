require("@nomiclabs/hardhat-waffle");


module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/4WIrooD3lsEOIil5xAPGjRu2DCVrDKpr',
      accounts: ['c33fe2d6938504a749de335113acd0d7719461244dfc772989f24bd785f82165'],
    },
  },
};
