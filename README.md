# LexArbiter

> **Autonomous Forensic Adjudication Protocol for Agentic Agreements & Provable Deliverables on GenLayer.**

LexArbiter enables autonomous agents and economic counterparties to lock objective mandates, submit cryptographic delivery manifests, crawl external HTTPS evidence, and receive decentralized forensic adjudication powered by GenLayer's Prompt Comparative consensus on GenVM.

```text
COMMITMENT ──► MANIFEST ──► TLS EVIDENCE ──► GENVM CONSENSUS ──► FINAL SETTLEMENT
```

---

## Key Capabilities

- **Neutral Forensic Adjudication:** Mandates are locked before execution. GenVM validators evaluate atomic criteria against delivered evidence without human bias.
- **Zero-Trust Evidence Ingestion:** Live web evidence is fetched directly over TLS (`gl.nondet.web.get`). Response bodies are hashed with SHA-256 and matched against committed checksums.
- **Strict Prompt-Injection Defense:** All submitted strings, documentation, and external payloads are isolated as data, neutralizing attempts to override protocol rules.
- **Storage Pre-Extraction Resilience:** Formatted for GenVM consensus with zero `self` closure references and deterministic canonical JSON serialization.
- **Fractional Settlement Calculus:** Criterion weights strictly total 10,000 basis points (100.00%), enabling mathematically verifiable partial payouts.

---

## Contract Architecture

The intelligent contract is written in Python for the GenLayer GenVM:

```
contracts/
├── LexArbiter.py          # Intelligent Contract with Prompt Comparative Equivalence
└── LexArbiter.schema.json # Contract ABI Schema
```

### Supported Forensic Policies
1. **`SOFTWARE_WEB_V1`**: Validates live APIs, TLS certificates, test coverage, and git digests.
2. **`RESEARCH_DATA_V1`**: Inspects dataset schemas, row counts, and independent DOI/academic citations.
3. **`GENERAL_V1`**: Standard contractual interpretation for autonomous agreements.
4. **`CREATIVE_VISUAL_V1`**: Objective artifact specifications, dimensions, and provenance metadata.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy to GenLayer StudioNet
Deploy the contract to StudioNet and set your operator address:
```bash
npm run deploy:studionet
```
*The script automatically updates `.env` and `.env.local` with the deployed contract address.*

### 3. Submit a Live Forensic Test Case
Submit an end-to-end case to the deployed contract and watch GenLayer validators reach consensus:
```bash
npm run sample:case
```

### 4. Run the Web Interface
Start the modern cyber-forensic web dashboard:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the Case Docket, submit mandates, and test the Evidence Sandbox.

---

## Verification & Audit Checklist

- [x] **Closure Audit:** Non-deterministic closures (`leader_fn`) use pure Python primitives with zero `self` storage access.
- [x] **Evidence Audit:** Strict HTTPS requirement with SHA-256 observed vs committed checksum verification.
- [x] **Consensus Audit:** Governed by `gl.eq_principle.prompt_comparative`.
- [x] **Syntax Audit:** Passed static AST verification (`python -m py_compile`).

## License

MIT
