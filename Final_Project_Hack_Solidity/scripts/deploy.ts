import { ethers } from "hardhat";

async function main() {

  const StakeTokenNFT = await ethers.getContractFactory("StakeTokenNFT");
  const stakeTokenNFT = await StakeTokenNFT.deploy();

  await stakeTokenNFT.deployed();

  const StakeToken = await ethers.getContractFactory("StakeToken");
  const stakeToken = await StakeToken.deploy(stakeTokenNFT.address);

  await stakeToken.deployed();

  await stakeTokenNFT.transferOwnership(stakeToken.address)

  console.log("StakeTokenNFT deployed to:", stakeTokenNFT.address);
  console.log("StakeToken deployed to:", stakeToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
