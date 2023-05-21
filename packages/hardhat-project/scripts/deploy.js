// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Deploy Token
  const supply = hre.ethers.utils.parseEther("420000000");
  const SylverToken = await hre.ethers.getContractFactory("SylverToken");
  const sylverToken = await SylverToken.deploy(supply);

  await sylverToken.deployed();
  console.log(
    `SylverToken deployed to ${sylverToken.address}`
  );

  // Deploy Lib
  const Lib = await hre.ethers.getContractFactory("Lib");
  const lib = await Lib.deploy(sylverToken.address);
  
  await lib.deployed();
  console.log(
    `Lib deployed to ${lib.address}`
  );

  // Deploy Voting
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  
  await voting.deployed();
  console.log(
    `Voting deployed to ${voting.address}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
