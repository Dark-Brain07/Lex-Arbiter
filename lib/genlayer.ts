import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { CaseRecord, ProtocolMetrics } from "./types";

export const CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0x4FA892C70149522d21Ac76509559Bb1105f14205";

export const DEFAULT_OPERATOR_KEY =
  process.env.NEXT_PUBLIC_OPERATOR_PRIVATE_KEY ||
  "0x900671616aea6cebf2a7f1f3f0fd81d89cf0b544db785b4b455a7b71a3c86044";

export const EXPLORER_BASE =
  process.env.NEXT_PUBLIC_EXPLORER_BASE ||
  "https://explorer-studio.genlayer.com/address/";

export const EXPLORER_TX_BASE =
  process.env.NEXT_PUBLIC_EXPLORER_TX_BASE ||
  "https://explorer-studio.genlayer.com/tx/";

export const STUDIO_BASE =
  process.env.NEXT_PUBLIC_STUDIO_BASE ||
  "https://studio.genlayer.com/?import-contract=";

export function getGenLayerClient(operatorKey?: string) {
  const key = (operatorKey?.trim() || DEFAULT_OPERATOR_KEY).trim();
  if (key) {
    const formatted = (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`;
    const account = createAccount(formatted);
    return createClient({ chain: studionet, account });
  }
  return createClient({ chain: studionet });
}

export async function fetchMetrics(): Promise<ProtocolMetrics | null> {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.startsWith("0x00000000")) {
    return null;
  }
  try {
    const client = getGenLayerClient();
    const metrics = (await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_metrics",
      args: [],
    })) as unknown as ProtocolMetrics;
    return metrics;
  } catch (err) {
    console.warn("Could not read contract metrics:", err);
    return null;
  }
}

export async function fetchCase(caseId: string): Promise<CaseRecord | null> {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.startsWith("0x00000000")) {
    return null;
  }
  try {
    const client = getGenLayerClient();
    const record = (await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_case",
      args: [caseId],
    })) as unknown as CaseRecord;
    return record;
  } catch (err) {
    console.warn(`Could not read case ${caseId}:`, err);
    return null;
  }
}

export interface SubmitCasePayload {
  caseId: string;
  mandateJson: string;
  manifestJson: string;
  mandateHash: string;
  deliveryHash: string;
  policy: string;
  operatorPrivateKey?: string;
  onTxSubmitted?: (txHash: string) => void;
  onStatusUpdate?: (status: string) => void;
}

export interface SubmitCaseResponse {
  success: boolean;
  txHash: string;
  caseRecord?: CaseRecord | null;
  error?: string;
}

export async function submitCaseToContract(
  params: SubmitCasePayload
): Promise<SubmitCaseResponse> {
  const {
    caseId,
    mandateJson,
    manifestJson,
    mandateHash,
    deliveryHash,
    policy,
    operatorPrivateKey,
    onTxSubmitted,
    onStatusUpdate,
  } = params;

  try {
    onStatusUpdate?.("Initializing GenLayer StudioNet client with operator account...");
    const client = getGenLayerClient(operatorPrivateKey);

    onStatusUpdate?.("Broadcasting submit_case transaction to GenLayer StudioNet...");
    const txHash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "submit_case",
      args: [
        caseId,
        mandateJson,
        manifestJson,
        mandateHash,
        deliveryHash,
        policy,
      ],
      value: 0n,
    });

    onTxSubmitted?.(txHash);
    onStatusUpdate?.("Transaction broadcasted. Waiting for GenVM validator consensus & finality (15-45s)...");

    // Poll until finalized
    await client.waitForTransactionReceipt({
      hash: txHash,
      status: TransactionStatus.FINALIZED,
      interval: 3000,
      retries: 240,
    });

    onStatusUpdate?.("Consensus finalized! Fetching updated on-chain case dossier...");

    let caseRecord: CaseRecord | null = null;
    try {
      caseRecord = await fetchCase(caseId);
    } catch (readErr) {
      console.warn("Case readback note:", readErr);
    }

    return {
      success: true,
      txHash,
      caseRecord,
    };
  } catch (err: any) {
    console.error("submitCaseToContract error:", err);
    return {
      success: false,
      txHash: "",
      error: err?.message || String(err),
    };
  }
}

