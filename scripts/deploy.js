const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the Token Contract
  const tokenContract = await hre.ethers.deployContract("Token");
  await tokenContract.waitForDeployment();
  console.log("Token deployed to:", tokenContract.target);

  // Deploy the Exchange Contract
  const exchangeContract = await hre.ethers.deployContract("Exchange", [
    tokenContract.target,
  ]);
  await exchangeContract.waitForDeployment();
  console.log("Exchange deployed to:", exchangeContract.target);

  // Wait for 30 seconds to let Etherscan catch up on contract deployments
  await sleep(30 * 1000);

  // Verify the contracts on Etherscan
  await hre.run("verify:verify", {
    address: tokenContract.target,
    constructorArguments: [],
    contract: "contracts/Token.sol:Token",
  });

  await hre.run("verify:verify", {
    address: exchangeContract.target,
    constructorArguments: [tokenContract.target],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The contract 0xEE3cf014A1793816C6eDcF4f6D7483ed7357C9D7 has already been verified.
// https://sepolia.etherscan.io/address/0xEE3cf014A1793816C6eDcF4f6D7483ed7357C9D7#code
// Successfully submitted source code for contract
// contracts/Exchange.sol:Exchange at 0x6Da6956876E0c6dc13B700012B1B7e29a18CeA5f
// for verification on the block explorer. Waiting for verification result...

// Successfully verified contract Exchange on the block explorer.
// https://sepolia.etherscan.io/address/0x6Da6956876E0c6dc13B700012B1B7e29a18CeA5f#code
