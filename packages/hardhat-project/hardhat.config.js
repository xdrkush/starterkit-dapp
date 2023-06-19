require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { INFURA_API_KEY, SEPOLIA_PRIVATE_KEY, GOERLI_PRIVATE_KEY } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      blockGasLimit: 3000000 // Default 30_000_000
    },
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [SEPOLIA_PRIVATE_KEY]
    // },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
