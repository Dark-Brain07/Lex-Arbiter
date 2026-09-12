import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { writeFile } from "node:fs/promises";

async function sync() {
  const client = createClient({ chain: studionet });
  const caseIds = [
    "case-1789056699432-7",
    "case-1789056624905-6",
    "case-1789056566610-5",
    "case-1789056484579-4",
    "case-1789056223936-2",
    "case-1789056011800-1",
    "case-1789009125755",
    "case-1789006588547",
  ];

  const records = [];
  for (const id of caseIds) {
    try {
      const c = await client.readContract({
        address: "0x4FA892C70149522d21Ac76509559Bb1105f14205",
        functionName: "get_case",
        args: [id],
      });
      if (c && c.case_id) {
        records.push(c);
        console.log("Fetched on-chain case:", c.case_id);
      }
    } catch (err) {
      console.warn("Could not fetch:", id);
    }
  }

  const content = `import type { CaseRecord } from "./types";

/**
 * Real on-chain cases finalized by GenLayer StudioNet validator consensus
 * Target Contract: 0x4FA892C70149522d21Ac76509559Bb1105f14205
 */
export const SAMPLE_CASES: CaseRecord[] = ${JSON.stringify(records, null, 2)};
`;

  await writeFile(new URL("../lib/mock-data.ts", import.meta.url), content, "utf8");
  console.log(`Synced ${records.length} real on-chain cases into lib/mock-data.ts`);
}

sync().catch(console.error);
