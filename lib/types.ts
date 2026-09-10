export type PolicyType = 
  | "GENERAL_V1" 
  | "RESEARCH_DATA_V1" 
  | "SOFTWARE_WEB_V1" 
  | "CREATIVE_VISUAL_V1";

export type VerdictType = 
  | "FULFILLED" 
  | "PARTIALLY_FULFILLED" 
  | "BREACHED" 
  | "UNDETERMINED";

export type CriterionResult = "PASS" | "FAIL" | "PARTIAL" | "UNVERIFIABLE";
export type CriterionSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type EvidenceStatus = "ADMISSIBLE" | "INADMISSIBLE" | "UNVERIFIABLE";
export type IntegrityStatus = "MATCH" | "MISMATCH" | "UNCOMMITTED";

export interface AcceptanceCriterion {
  id: string;
  weightBps: number;
  critical: boolean;
  description?: string;
  result?: CriterionResult;
  severity?: CriterionSeverity;
  evidenceRefs?: string[];
  reasonCode?: string;
  reason?: string;
}

export interface AdmissibilityFinding {
  id: string;
  status: EvidenceStatus;
  reason: string;
}

export interface Judgment {
  schemaVersion?: string;
  caseId?: string;
  verdict: VerdictType;
  confidenceBps: number;
  criteria: AcceptanceCriterion[];
  admissibility: AdmissibilityFinding[];
  contradictions: string[];
  materialBreaches: string[];
  missingEvidence: string[];
  settlementBps: number;
  appealGrounds: string[];
  summary: string;
  evidenceCommitment?: string;
}

export interface CaseRecord {
  case_id: string;
  mandate_hash: string;
  delivery_hash: string;
  policy: PolicyType;
  judgment: Judgment;
  judgment_hash: string;
  report_hash: string;
  status: "PENDING" | "FINALIZED" | "APPEALED" | "SETTLED";
  created_at: string;
  updated_at: string;
}

export interface ProtocolMetrics {
  case_count: string;
  finalized_count: string;
  operator: string;
  policies: PolicyType[];
  constitution_hash: string;
}
