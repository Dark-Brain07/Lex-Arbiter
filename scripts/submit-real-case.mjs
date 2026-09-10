import { readFile } from "node:fs/promises";
import crypto from "node:crypto";
import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import { canonicalJson } from "./canonical.js";

function sha256Hex(str) {
  return "0x" + crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

async function run() {
  const deployment = JSON.parse(await readFile(new URL("./deployment.json", import.meta.url), "utf8"));
  const privKey = deployment.operatorPrivateKey.startsWith("0x")
    ? deployment.operatorPrivateKey
    : "0x" + deployment.operatorPrivateKey;
  const account = createAccount(privKey);
  const client = createClient({ chain: studionet, account });
  const contractAddress = deployment.contractAddress;

  const caseId = "case-" + Date.now();
  console.log("Submitting real case to StudioNet:", caseId);

  const mandate = {
    mandateId: caseId,
    objective: "Audit decentralized agent repository package manifest and dependency configuration",
    policy: "SOFTWARE_WEB_V1",
    allowPartialSettlement: true,
    acceptanceCriteria: [
      {
        id: "crit-pkg-name",
        weightBps: 5000,
        critical: true,
        description: "Package manifest is valid JSON with package name lexarbiter"
      },
      {
        id: "crit-dependencies-present",
        weightBps: 5000,
        critical: false,
        description: "Next.js and genlayer-js are declared as core dependencies"
      }
    ]
  };

  const manifest = {
    mandateId: caseId,
    artifacts: [
      {
        id: "art-package-json",
        source_kind: "artifact",
        url: "https://raw.githubusercontent.com/Dark-Brain07/Lex-Arbiter/main/package.json",
        sha256: ""
      }
    ],
    evidence: []
  };

  const deliveryBundle = { manifest, snapshots: [] };
  const mandateJson = canonicalJson(mandate);
  const manifestJson = canonicalJson(deliveryBundle);
  const mandateHash = sha256Hex(mandateJson);
  const deliveryHash = sha256Hex(manifestJson);

  console.log("Sending submit_case transaction...");
  const txHash = await client.writeContract({
    address: contractAddress,
    functionName: "submit_case",
    args: [caseId, mandateJson, manifestJson, mandateHash, deliveryHash, "SOFTWARE_WEB_V1"],
    value: 0n
  });
  console.log("Tx sent:", txHash);
  console.log("Waiting for consensus finality from GenLayer validators...");

  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: TransactionStatus.FINALIZED,
    interval: 3000,
    retries: 240
  });

  console.log("Transaction finalized! Receipt status:", receipt.status);
  const caseData = await client.readContract({
    address: contractAddress,
    functionName: "get_case",
    args: [caseId]
  });
  console.log("Finalized Case from chain:\n", JSON.stringify(caseData, null, 2));
}

run().catch(console.error);
