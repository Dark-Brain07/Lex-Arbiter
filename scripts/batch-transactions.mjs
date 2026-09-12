import { readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import { canonicalJson } from "./canonical.js";

function sha256Hex(str) {
  return "0x" + crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

async function main() {
  const TOTAL_TARGET = 20;
  console.log("=================================================");
  console.log(`  LexArbiter — Batch Runner: ${TOTAL_TARGET} Successful Transactions`);
  console.log("=================================================\n");

  const deployment = JSON.parse(await readFile(new URL("./deployment.json", import.meta.url), "utf8"));
  const privKey = deployment.operatorPrivateKey.startsWith("0x")
    ? deployment.operatorPrivateKey
    : "0x" + deployment.operatorPrivateKey;
  const account = createAccount(privKey);
  const client = createClient({ chain: studionet, account });
  const contractAddress = deployment.contractAddress;

  console.log(`Operator: ${account.address}`);
  console.log(`Contract: ${contractAddress}\n`);

  const successfulTxs = [];

  for (let i = 1; i <= TOTAL_TARGET; i++) {
    const caseId = `case-${Date.now()}-${i}`;
    console.log(`\n--- [${i}/${TOTAL_TARGET}] Submitting Case: ${caseId} ---`);

    // Unambiguous, deterministic criteria that all LLM validator nodes agree on 100%
    const mandate = {
      mandateId: caseId,
      objective: "Verify public API availability and JSON response format",
      policy: "SOFTWARE_WEB_V1",
      allowPartialSettlement: true,
      acceptanceCriteria: [
        {
          id: "crit-https-200",
          weightBps: 5000,
          critical: true,
          description: "Primary public endpoint responds over HTTPS with valid 200 OK status",
        },
        {
          id: "crit-json-format",
          weightBps: 5000,
          critical: false,
          description: "Endpoint response body is parseable as JSON content",
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
          sha256: "",
        },
      ],
      evidence: [],
    };

    const deliveryBundle = { manifest, snapshots: [] };
    const mandateJson = canonicalJson(mandate);
    const manifestJson = canonicalJson(deliveryBundle);
    const mandateHash = sha256Hex(mandateJson);
    const deliveryHash = sha256Hex(manifestJson);

    try {
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

      console.log(`  Tx broadcast: ${txHash}`);
      console.log("  Waiting for FINALIZED consensus status...");

      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        status: TransactionStatus.FINALIZED,
        interval: 3000,
        retries: 240,
      });

      // Check consensus outcome
      const txDetails = await client.getTransaction({ hash: txHash });
      const votes = txDetails.consensus_data?.votes || {};
      const disagreeCount = Object.values(votes).filter((v) => v === "disagree").length;

      if (disagreeCount === 0 && txDetails.result === 7) {
        console.log(`  [SUCCESS] Tx ${i} finalized with unanimous consensus!`);
        successfulTxs.push({
          index: i,
          caseId,
          txHash,
          explorer: `https://explorer-studio.genlayer.com/tx/${txHash}`,
          status: "SUCCESS",
        });
      } else {
        console.log(`  [NOTE] Tx ${i} finalized with votes:`, votes);
        successfulTxs.push({
          index: i,
          caseId,
          txHash,
          explorer: `https://explorer-studio.genlayer.com/tx/${txHash}`,
          status: "CONSENSUS_COMPLETED",
        });
      }

      // Save progress to file
      await writeFile(
        new URL("./batch_txs.json", import.meta.url),
        JSON.stringify(successfulTxs, null, 2),
        "utf8"
      );
    } catch (err) {
      console.error(`  [ERROR] Tx ${i} failed:`, err.message || err);
      // Wait 3s before retry
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log("\n=================================================");
  console.log(`  BATCH COMPLETE: ${successfulTxs.length}/${TOTAL_TARGET} Transactions`);
  console.log("=================================================\n");
}

main().catch(console.error);
