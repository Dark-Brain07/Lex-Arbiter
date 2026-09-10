import { readFile, writeFile, mkdir } from "node:fs/promises";
import crypto from "node:crypto";
import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

async function main() {
  process.stdout.write("=========================================\n");
  process.stdout.write("   LexArbiter — GenLayer Deployment     \n");
  process.stdout.write("=========================================\n\n");

  let rawKey = process.env.DEPLOYER_PRIVATE_KEY?.trim();
  if (!rawKey) {
    rawKey = "0x" + crypto.randomBytes(32).toString("hex");
  }
  const account = createAccount(rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`);

  process.stdout.write(`Operator Account Address: ${account.address}\n`);

  const client = createClient({ chain: studionet, account });
  const contractPath = new URL("../contracts/LexArbiter.py", import.meta.url);
  const code = await readFile(contractPath, "utf8");

  process.stdout.write("Deploying LexArbiter with operator: " + account.address + "\n");
  
  // LexArbiter.__init__(operator: Address)
  const hash = await client.deployContract({
    code,
    args: [account.address],
  });

  process.stdout.write(`Deployment Transaction Hash: ${hash}\n`);
  process.stdout.write("Waiting for FINALIZED consensus status on StudioNet...\n");

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.FINALIZED,
    interval: 2500,
    retries: 300,
  });

  const contractAddress =
    receipt.data?.contract_address ||
    receipt.contractAddress ||
    receipt.contract_address ||
    receipt.data?.contractAddress;

  if (!contractAddress) {
    throw new Error("Failed to extract deployed contract address from receipt: " + JSON.stringify(receipt));
  }

  process.stdout.write("\n=========================================\n");
  process.stdout.write("       Deployment Successful!            \n");
  process.stdout.write("=========================================\n");
  process.stdout.write(`Contract Address: ${contractAddress}\n`);
  process.stdout.write(`Explorer URL:     https://explorer-studio.genlayer.com/address/${contractAddress}\n`);
  process.stdout.write(`Studio Import:    https://studio.genlayer.com/?import-contract=${contractAddress}\n\n`);

  const envContent = [
    `NEXT_PUBLIC_GENLAYER_NETWORK=studionet`,
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`,
    `NEXT_PUBLIC_OPERATOR_ADDRESS=${account.address}`,
    `NEXT_PUBLIC_EXPLORER_BASE=https://explorer-studio.genlayer.com/address/`,
    `NEXT_PUBLIC_STUDIO_BASE=https://studio.genlayer.com/?import-contract=`,
    `DEPLOYER_PRIVATE_KEY=${rawKey}`,
  ].join("\n") + "\n";

  await writeFile(new URL("../.env", import.meta.url), envContent, "utf8");
  await writeFile(new URL("../.env.local", import.meta.url), envContent, "utf8");

  const deploymentData = {
    network: "studionet",
    contractAddress,
    deployerAddress: account.address,
    operatorAddress: account.address,
    operatorPrivateKey: rawKey,
    transactionHash: hash,
    deployedAt: new Date().toISOString(),
    receipt,
  };

  await mkdir(new URL("../.deployment", import.meta.url), { recursive: true });
  await writeFile(
    new URL("./deployment.json", import.meta.url),
    JSON.stringify(deploymentData, null, 2),
    "utf8"
  );
  await writeFile(
    new URL("../.deployment/deployment.json", import.meta.url),
    JSON.stringify(deploymentData, null, 2),
    "utf8"
  );

  process.stdout.write("Saved configuration to .env, .env.local, and deployment.json\n");
}

main().catch((err) => {
  process.stderr.write(`Deployment failed: ${err.message || err}\n`);
  process.exit(1);
});
