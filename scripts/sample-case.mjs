import { readFile } from "node:fs/promises";
import crypto from "node:crypto";
import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

import { canonicalJson } from "./canonical.js";

function sha256Hex(str) {
  return "0x" + crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

async function main() {
  process.stdout.write("=========================================\n");
  process.stdout.write("  LexArbiter — Submit Forensic Test Case \n");
  process.stdout.write("=========================================\n\n");

  let deployment;
  try {
    const raw = await readFile(new URL("./deployment.json", import.meta.url), "utf8");
    deployment = JSON.parse(raw);
  } catch (err) {
    throw new Error("Could not load scripts/deployment.json. Please deploy the contract first via npm run deploy:studionet");
  }

  const contractAddress = deployment.contractAddress;
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY?.trim() || deployment.operatorPrivateKey;
  if (!deployerKey) {
    throw new Error("No operator private key found in environment or deployment.json");
  }
  const account = createAccount(deployerKey.startsWith("0x") ? deployerKey : `0x${deployerKey}`);

  const client = createClient({ chain: studionet, account });
  process.stdout.write(`Submitting case as Operator: ${account.address}\n`);
  process.stdout.write(`Target Contract: ${contractAddress}\n`);

  const caseId = `case-${Date.now()}`;
  const mandate = {
    mandateId: caseId,
    objective: "Verify public API availability, SSL certificate compliance, and JSON health schema",
    policy: "SOFTWARE_WEB_V1",
    allowPartialSettlement: true,
    acceptanceCriteria: [
      {
        id: "crit-https-reachable",
        weightBps: 5000,
        critical: true,
        description: "Primary public endpoint responds over HTTPS with valid 200 OK status",
      },
      {
        id: "crit-json-payload",
        weightBps: 5000,
        critical: false,
        description: "Endpoint returns valid structured JSON payload matching schema specification",
      },
    ],
  };

  const manifest = {
    mandateId: caseId,
    artifacts: [
      {
        id: "art-api-endpoint",
        source_kind: "artifact",
        url: "https://httpbin.org/get",
        sha256: "", // uncommitted or live match
      },
    ],
    evidence: [],
  };

  const deliveryBundle = {
    manifest,
    snapshots: [],
  };

  const mandateJson = canonicalJson(mandate);
  const manifestJson = canonicalJson(deliveryBundle);
  const mandateHash = sha256Hex(mandateJson);
  const deliveryHash = sha256Hex(manifestJson);

  process.stdout.write(`Case ID: ${caseId}\n`);
  process.stdout.write(`Mandate Hash: ${mandateHash}\n`);
  process.stdout.write(`Delivery Hash: ${deliveryHash}\n`);

  const txHash = await client.writeContract({
    address: contractAddress,
    functionName: "submit_case",
    args: [
      caseId,
      mandateJson,
      manifestJson,
      mandateHash,
      deliveryHash,
      "SOFTWARE_WEB_V1",
    ],
    value: 0n,
  });

  process.stdout.write(`Transaction submitted: ${txHash}\n`);
  process.stdout.write("Waiting for FINALIZED consensus status from GenLayer validators...\n");

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: TransactionStatus.FINALIZED,
    interval: 3000,
    retries: 240,
  });

  process.stdout.write("\n=========================================\n");
  process.stdout.write("      Case Adjudication Finalized!       \n");
  process.stdout.write("=========================================\n");
  process.stdout.write(`Transaction Hash: ${txHash}\n`);
  process.stdout.write(`Explorer: https://explorer-studio.genlayer.com/tx/${txHash}\n`);

  // Read back the finalized case
  try {
    const caseResult = await client.readContract({
      address: contractAddress,
      functionName: "get_case",
      args: [caseId],
    });
    process.stdout.write(`Case Data from Chain:\n${JSON.stringify(caseResult, null, 2)}\n`);
  } catch (err) {
    process.stdout.write(`Note on reading case: ${err.message || err}\n`);
  }
}

main().catch((err) => {
  process.stderr.write(`Submission failed: ${err.message || err}\n`);
  process.exit(1);
});
