import type { CaseRecord } from "./types";

/**
 * Real on-chain cases finalized by GenLayer StudioNet validator consensus
 * Target Contract: 0x4FA892C70149522d21Ac76509559Bb1105f14205
 */
export const SAMPLE_CASES: CaseRecord[] = [
  {
    case_id: "case-1789009125755",
    mandate_hash: "0xdca156c0503434ff5e12b46d6199b43d72b240fe875fb9dbda6361fe95ae740e",
    delivery_hash: "0xfcbfba2b1553eafafe7bbbe4ca1627f75cdf378845e41f0436f08079511e1d68",
    policy: "SOFTWARE_WEB_V1",
    status: "FINALIZED",
    created_at: "2026-09-10T02:58:49.072452Z",
    updated_at: "2026-09-10T02:58:49.072452Z",
    judgment_hash: "0x531863c3265504269edf5ed0ce14950117283658456b42dee2adef1dce73f7cd",
    report_hash: "0xabf122e154b146e0c721ce8b3eee680eda0b7405f762775cfe9c89f9485edcf0",
    judgment: {
      schemaVersion: "1.0",
      caseId: "case-1789009125755",
      verdict: "FULFILLED",
      confidenceBps: 9600,
      settlementBps: 10000,
      summary: "Independent inspection of the submitted package.json found a valid JSON manifest named lexarbiter with both required core dependencies, next and genlayer-js, declared.",
      criteria: [
        {
          id: "crit-pkg-name",
          weightBps: 5000,
          critical: true,
          description: "Package manifest is valid JSON with package name lexarbiter",
          result: "PASS",
          severity: "CRITICAL",
          evidenceRefs: ["art-package-json"],
          reasonCode: "JSON_VALID_NAME_MATCH",
          reason: "The retrieved package manifest is valid JSON and contains \"name\": \"lexarbiter\"."
        },
        {
          id: "crit-dependencies-present",
          weightBps: 5000,
          critical: false,
          description: "Next.js and genlayer-js are declared as core dependencies",
          result: "PASS",
          severity: "LOW",
          evidenceRefs: ["art-package-json"],
          reasonCode: "DEPENDENCIES_DECLARED",
          reason: "The retrieved package manifest declares both core dependencies under dependencies: \"next\": \"^15.2.1\" and \"genlayer-js\": \"1.1.8\"."
        }
      ],
      admissibility: [
        {
          id: "art-package-json",
          status: "ADMISSIBLE",
          reason: "Independently fetched artifact was accessible at declared URL over HTTPS with HTTP 200 and JSON content was directly inspectable."
        }
      ],
      contradictions: [],
      materialBreaches: [],
      missingEvidence: [],
      appealGrounds: []
    }
  },
  {
    case_id: "case-1789006588547",
    mandate_hash: "0x94b5955ead9750acbb10ccf30a270eb3d8dee48f007bbbcafff1840458ae29f8",
    delivery_hash: "0xcc1be25860521613fec3702e4a7151a746e0157148fb796dc2113786ab622f66",
    policy: "SOFTWARE_WEB_V1",
    status: "FINALIZED",
    created_at: "2026-09-10T02:16:31.777005Z",
    updated_at: "2026-09-10T02:16:31.777005Z",
    judgment_hash: "0xfcf2351c514544785e4178b71c492bbb7477a005dc0b432f2ca0a6bc97c74b10",
    report_hash: "0x43954d956612160a3e3564b742c1b7261bc9b07841e57119e109b0f2ebe8dcc1",
    judgment: {
      schemaVersion: "1.0",
      caseId: "case-1789006588547",
      verdict: "FULFILLED",
      confidenceBps: 10000,
      settlementBps: 10000,
      summary: "The provider successfully delivered a reachable HTTPS endpoint that returns the required valid JSON payload. All criteria, including the critical reachability requirement, were satisfied.",
      criteria: [
        {
          id: "crit-https-reachable",
          weightBps: 5000,
          critical: true,
          description: "Primary public endpoint responds over HTTPS with valid 200 OK status",
          result: "PASS",
          severity: "CRITICAL",
          evidenceRefs: ["art-api-endpoint"],
          reasonCode: "HTTP_200_OK",
          reason: "Independently verified HTTPS request returned a 200 OK status code."
        },
        {
          id: "crit-json-payload",
          weightBps: 5000,
          critical: false,
          description: "Endpoint returns valid structured JSON payload matching schema specification",
          result: "PASS",
          severity: "LOW",
          evidenceRefs: ["art-api-endpoint"],
          reasonCode: "JSON_VALID",
          reason: "Payload parsed successfully as valid structured JSON."
        }
      ],
      admissibility: [
        {
          id: "art-api-endpoint",
          status: "ADMISSIBLE",
          reason: "Artifact independently fetched via HTTPS; observed status and content allow for objective verification."
        }
      ],
      contradictions: [],
      materialBreaches: [],
      missingEvidence: [],
      appealGrounds: []
    }
  }
];
