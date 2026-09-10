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
  console.log("Submitting partial-settlement case to StudioNet:", caseId);

  const mandate = {
    mandateId: caseId,
    objective: "Verify microservice uptime and custom security header assertion",
    policy: "SOFTWARE_WEB_V1",
    allowPartialSettlement: true,
    acceptanceCriteria: [
      {
        id: "crit-service-up",
        weightBps: 5000,
        critical: true,
        description: "Service responds over HTTPS with 200 OK status"
      },
      {
        id: "crit-custom-header",
        weightBps: 5000,
        critical: false,
        description: "Service response body contains custom authorization field 'x-custom-auth'"
      }
    ]
  };

  const manifest = {
    mandateId: caseId,
    artifacts: [
      {
        id: "art-microservice",
        source_kind: "artifact",
        url: "https://httpbin.org/status/200",
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
  console.log("Finalized Case 3 from chain:\n", JSON.stringify(caseData, null, 2));
}

run().catch(console.error);
