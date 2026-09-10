import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { CaseRecord, ProtocolMetrics } from "./types";

export const CONTRACT_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

export const EXPLORER_BASE =
  process.env.NEXT_PUBLIC_EXPLORER_BASE ||
  "https://explorer-studio.genlayer.com/address/";

export const STUDIO_BASE =
  process.env.NEXT_PUBLIC_STUDIO_BASE ||
  "https://studio.genlayer.com/?import-contract=";

export function getGenLayerClient() {
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
