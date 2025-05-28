import { ethers } from "hardhat";

async function main() {
  const stablecoinAddress = process.env.USDC_SEP_ADDRESS as string;

  console.log(
    "Deploying Escrow Contract with stablecoin address:",
    stablecoinAddress
  );

  const Escrow = await ethers.deployContract("TuitionEscrow", [
    stablecoinAddress,
  ]);

  console.log("Waiting for deployment confirmation...");

  await Escrow.waitForDeployment();

  const contractAddress = await Escrow.getAddress();
  console.log("Escrow deployed to:", contractAddress);
  console.log("Using stablecoin at:", stablecoinAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
