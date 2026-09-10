# LexArbiter Protocol Specification (v1.0.0)

**Author:** Dark-Brain07  
**Network:** GenLayer StudioNet  
**Target VM:** GenVM (Python 3.13 / py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6)

---

## 1. System Overview

LexArbiter is an autonomous forensic adjudication protocol for decentralized, agentic economic agreements. While existing smart contracts reliably execute deterministic token transfers and escrow releases, they lack the ability to inspect complex external deliverables—such as software repositories, public REST/GraphQL APIs, live database schemas, and research datasets.

LexArbiter bridges this gap by turning agreements into immutable on-chain commitments evaluated by GenLayer validator consensus through non-deterministic web retrieval and natural language equivalence verification.

```text
[MANDATE COMMITMENT] ──► [DELIVERY MANIFEST] ──► [GENLAYER VALIDATION] ──► [FINAL JUDGMENT]
   (Atomic Criteria)        (HTTPS Evidence)         (Prompt Comparative)       (Settlement Bps)
```

---

## 2. Core Protocol Mechanics

### 2.1 The Locked Mandate
A mandate defines the law of the case. It is cryptographically committed using SHA-256:
- `mandateId`: Unique case identifier
- `objective`: Primary deliverable scope
- `policy`: One of four forensic standards (`GENERAL_V1`, `RESEARCH_DATA_V1`, `SOFTWARE_WEB_V1`, `CREATIVE_VISUAL_V1`)
- `allowPartialSettlement`: Boolean flag governing fractional payouts
- `acceptanceCriteria`: Array of 1 to 32 atomic criteria, with `weightBps` summing strictly to 10,000 basis points (100.00%) and optional `critical` flags.

### 2.2 The Delivery Manifest & Evidence
Providers submit proof of completion via structured manifests:
- `artifacts`: Core deliverable references (URLs, git tags, container digests)
- `evidence`: Supporting logs, test runs, and verification endpoints
- Every source URL must use `https://` (unencrypted HTTP is rejected)
- Declared `sha256` digests are compared against actual fetched response bodies (`MATCH`, `MISMATCH`, or `UNCOMMITTED`).

### 2.3 Judicial Evaluation & Equivalence Principle
The leader validator retrieves up to 64,000 characters of external proof using `gl.nondet.web.get`. GenVM LLM consensus evaluates every criterion against the locked mandate and independently fetched proof.

Validation is governed by `gl.eq_principle.prompt_comparative`:
```python
judgment = gl.eq_principle.prompt_comparative(
    leader_fn,
    principle="Compare the proposed judgment against the locked mandate and independently fetched evidence. Verdict, every criterion result, critical-breach determination, and settlement basis points must be materially equivalent."
)
```

---

## 3. Storage Pre-Extraction Architecture

To ensure deterministic consensus and eliminate Python pickle/closure failures across validator nodes:
1. All storage properties (`manifest`, `mandate`, `policy`, `case_id`) are pre-extracted into pure Python primitives before defining the non-deterministic closure.
2. The closure function contains zero references to `self`.
3. Canonical serialization enforces sorted JSON keys and compact separators to maintain exact byte parity across nodes.

---

## 4. Verdicts & Settlement Rules

| Verdict | Condition | Payout BPS |
|---|---|---|
| `FULFILLED` | All mandatory criteria PASS (Passed weight = 10,000 bps) | 10,000 BPS (100%) |
| `PARTIALLY_FULFILLED` | Non-critical criteria fail/partial, partial settlement allowed | Proportionate to passed weight |
| `BREACHED` | Critical mandatory criterion fails or material contradiction | 0 BPS (0%) |
| `UNDETERMINED` | Admissible evidence inaccessible or insufficient | 0 BPS (Escrow held/appealed) |
