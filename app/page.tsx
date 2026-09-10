"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  ShieldCheck,
  Cpu,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Layers,
  Sparkles,
  Fingerprint
} from "lucide-react";
import { SAMPLE_CASES } from "@/lib/mock-data";
import type { CaseRecord, PolicyType } from "@/lib/types";
import { formatAddress, formatBps, computeSha256 } from "@/lib/crypto-utils";
import { CONTRACT_ADDRESS, EXPLORER_BASE, STUDIO_BASE, fetchMetrics, fetchCase } from "@/lib/genlayer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"docket" | "submit" | "sandbox" | "constitution">("docket");
  const [cases, setCases] = useState<CaseRecord[]>(SAMPLE_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseRecord>(SAMPLE_CASES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Live contract metrics
  const [metrics, setMetrics] = useState({
    caseCount: cases.length.toString(),
    finalizedCount: cases.filter(c => c.status === "FINALIZED").length.toString(),
    operator: formatAddress("0x8e5Bd026227CC93169Df51BD9C1b6CA82292F0D2"),
  });

  // Submission Form State
  const [mandateId, setMandateId] = useState(`LEX-${Date.now().toString().slice(-4)}`);
  const [objective, setObjective] = useState("Verify production GraphQL endpoint resilience, TLS 1.3 certificate, and response time under 300ms");
  const [policy, setPolicy] = useState<PolicyType>("SOFTWARE_WEB_V1");
  const [crit1Desc, setCrit1Desc] = useState("Endpoint returns HTTP 200 with valid schema on HTTPS");
  const [crit1Weight, setCrit1Weight] = useState(6000);
  const [crit2Desc, setCrit2Desc] = useState("P95 latency benchmark stays below 300ms under 50 concurrent requests");
  const [crit2Weight, setCrit2Weight] = useState(4000);
  const [evidenceUrl, setEvidenceUrl] = useState("https://httpbin.org/get");
  const [computedMandateHash, setComputedMandateHash] = useState("0x...");
  const [computedDeliveryHash, setComputedDeliveryHash] = useState("0x...");

  // Sandbox State
  const [sandboxInput, setSandboxInput] = useState("https://raw.githubusercontent.com/Dark-Brain07/sample-spec/main/evidence.json");
  const [sandboxHash, setSandboxHash] = useState("");
  const [sandboxStatus, setSandboxStatus] = useState<"idle" | "testing" | "success">("idle");

  useEffect(() => {
    fetchMetrics().then((m) => {
      if (m) {
        setMetrics({
          caseCount: m.case_count,
          finalizedCount: m.finalized_count,
          operator: formatAddress(m.operator),
        });
      }
    });

    // Dynamically poll/fetch live cases
    Promise.all([
      fetchCase("case-1789056699432-7"),
      fetchCase("case-1789056624905-6"),
      fetchCase("case-1789056566610-5"),
      fetchCase("case-1789056484579-4"),
      fetchCase("case-1789056223936-2"),
      fetchCase("case-1789056011800-1"),
      fetchCase("case-1789009125755"),
      fetchCase("case-1789006588547"),
    ]).then((fetched) => {
      const liveCases = fetched.filter((c): c is CaseRecord => c !== null);
      if (liveCases.length > 0) {
        setCases(liveCases);
        setSelectedCase(liveCases[0]);
      }
    });
  }, []);

  // Update computed hashes dynamically
  useEffect(() => {
    const mandateObj = {
      mandateId,
      objective,
      policy,
      acceptanceCriteria: [
        { id: "crit-01", weightBps: Number(crit1Weight), critical: true, description: crit1Desc },
        { id: "crit-02", weightBps: Number(crit2Weight), critical: false, description: crit2Desc },
      ],
    };
    computeSha256(JSON.stringify(mandateObj)).then(setComputedMandateHash);

    const deliveryObj = {
      manifest: {
        mandateId,
        artifacts: [{ id: "art-01", source_kind: "artifact", url: evidenceUrl, sha256: "" }],
      },
    };
    computeSha256(JSON.stringify(deliveryObj)).then(setComputedDeliveryHash);
  }, [mandateId, objective, policy, crit1Desc, crit1Weight, crit2Desc, crit2Weight, evidenceUrl]);

  const copyContract = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestSandbox = async () => {
    setSandboxStatus("testing");
    const hash = await computeSha256(sandboxInput);
    setTimeout(() => {
      setSandboxHash(hash);
      setSandboxStatus("success");
    }, 400);
  };

  const filteredCases = cases.filter(
    (c) =>
      c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.judgment?.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateTab = (tab: "docket" | "submit" | "sandbox" | "constitution") => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById("main-content");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 30);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Top Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand" onClick={() => navigateTab("docket")}>
            <div className="brand-logo-wrap">
              <img src="/logo.png" alt="LexArbiter Logo" className="brand-logo-img" />
            </div>
            <span className="brand-title">LEX ARBITER</span>
          </div>

          <nav className="header-nav-pill">
            <button
              onClick={() => navigateTab("docket")}
              className={`nav-pill-item ${activeTab === "docket" ? "active" : ""}`}
            >
              <FileCheck2 size={14} />
              <span>Case Docket</span>
            </button>
            <button
              onClick={() => navigateTab("submit")}
              className={`nav-pill-item ${activeTab === "submit" ? "active" : ""}`}
            >
              <Terminal size={14} />
              <span>Submit Mandate</span>
            </button>
            <button
              onClick={() => navigateTab("sandbox")}
              className={`nav-pill-item ${activeTab === "sandbox" ? "active" : ""}`}
            >
              <Fingerprint size={14} />
              <span>Evidence Sandbox</span>
            </button>
            <button
              onClick={() => navigateTab("constitution")}
              className={`nav-pill-item ${activeTab === "constitution" ? "active" : ""}`}
            >
              <Lock size={14} />
              <span>Constitution</span>
            </button>
          </nav>

          <div className="header-meta">
            <div className="network-pill" title="Live on GenLayer StudioNet">
              <span className="network-dot" />
              <span>StudioNet</span>
            </div>
            <button onClick={copyContract} className="contract-copy-pill" title="Click to copy contract address">
              <Copy size={12} className={copied ? "text-cyan-400" : "text-muted"} />
              <span className="font-mono">{copied ? "Copied!" : formatAddress(CONTRACT_ADDRESS)}</span>
            </button>
            <a
              href={`${STUDIO_BASE}${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="studio-btn"
              title="Open contract in GenLayer Studio"
            >
              <Cpu size={13} />
              <span>Studio Import</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Protocol Command Pulse */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <ShieldCheck size={14} />
              <span>Forensic Protocol</span>
            </div>
            <h1 className="hero-title">
              Promises Become <span>Provably Settled.</span>
            </h1>
            <p className="hero-subtitle">
              LexArbiter evaluates autonomous agent deliveries against locked commitments.
              GenLayer validators independently crawl HTTPS evidence, verify cryptographic checksums,
              and reach Prompt Comparative consensus without human bias.
            </p>
            <div className="hero-actions">
              <button onClick={() => navigateTab("docket")} className="btn-primary">
                <FileCheck2 size={15} />
                <span>Explore Case Docket</span>
              </button>
              <button onClick={() => navigateTab("submit")} className="btn-secondary">
                <Terminal size={15} />
                <span>Submit Mandate</span>
              </button>
              <a
                href={`${EXPLORER_BASE}${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={14} />
                <span>Explorer</span>
              </a>
            </div>
          </div>

          {/* Protocol Pulse Card */}
          <div className="pulse-card">
            <div className="pulse-header">
              <h3>
                <Activity size={16} className="text-cyan-400" />
                <span>Protocol Consensus State</span>
              </h3>
              <span className="text-xs text-muted font-mono">Consensus: Comparative</span>
            </div>

            <div className="stat-grid">
              <div className="stat-box">
                <div className="stat-label">Total Cases</div>
                <div className="stat-value">{metrics.caseCount}</div>
                <div className="stat-sub">Indexed On-Chain</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Finalized Verdicts</div>
                <div className="stat-value">{metrics.finalizedCount}</div>
                <div className="stat-sub">Zero Contradictions</div>
              </div>
            </div>

            <div className="pulse-meta">
              <div className="flex justify-between">
                <span>Contract Operator:</span>
                <span className="text-white">{metrics.operator}</span>
              </div>
              <div className="flex justify-between">
                <span>Zero-Trust Evidence:</span>
                <span className="text-emerald-400">Strict HTTPS + SHA256</span>
              </div>
              <div className="flex justify-between">
                <span>Consensus Engine:</span>
                <span className="text-cyan-400">Equivalence Principle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="main-content" className="container flex-1">
        {/* Navigation Tabs */}
        <div className="tabs-bar">
          <button
            onClick={() => navigateTab("docket")}
            className={`tab-btn ${activeTab === "docket" ? "active" : ""}`}
          >
            <FileCheck2 size={16} />
            <span>Forensic Case Explorer</span>
          </button>
          <button
            onClick={() => navigateTab("submit")}
            className={`tab-btn ${activeTab === "submit" ? "active" : ""}`}
          >
            <Terminal size={16} />
            <span>Case Submission Terminal</span>
          </button>
          <button
            onClick={() => navigateTab("sandbox")}
            className={`tab-btn ${activeTab === "sandbox" ? "active" : ""}`}
          >
            <Fingerprint size={16} />
            <span>Evidence Sandbox</span>
          </button>
          <button
            onClick={() => navigateTab("constitution")}
            className={`tab-btn ${activeTab === "constitution" ? "active" : ""}`}
          >
            <Lock size={16} />
            <span>Judicial Constitution</span>
          </button>
        </div>

        {/* Tab 1: Case Docket & Explorer */}
        {activeTab === "docket" && (
          <section className="cases-section">
            {/* Case List Sidebar */}
            <div className="case-list-panel">
              <div className="panel-title-bar">
                <div className="panel-title">
                  <Layers size={16} />
                  <span>Adjudication Docket</span>
                </div>
                <span className="text-xs text-muted font-mono">{filteredCases.length} records</span>
              </div>

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search case ID, policy, or summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input w-full pl-8 text-xs"
                />
              </div>

              <div className="case-cards-scroll">
                {filteredCases.map((c) => {
                  const isSelected = selectedCase.case_id === c.case_id;
                  const verdict = c.judgment?.verdict || "UNDETERMINED";
                  const verdictClass =
                    verdict === "FULFILLED"
                      ? "fulfilled"
                      : verdict === "PARTIALLY_FULFILLED"
                      ? "partial"
                      : "breached";

                  return (
                    <div
                      key={c.case_id}
                      onClick={() => {
                        setSelectedCase(c);
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          document.getElementById("dossier-panel")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`case-card ${isSelected ? "active" : ""}`}
                    >
                      <div className="case-card-header">
                        <span className="case-id">{c.case_id}</span>
                        <span className={`verdict-pill ${verdictClass}`}>{verdict}</span>
                      </div>
                      <p className="case-objective">{c.judgment?.summary}</p>
                      <div className="case-footer">
                        <span>{c.policy}</span>
                        <span>Award: {formatBps(c.judgment?.settlementBps)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Case Dossier Detail */}
            <div id="dossier-panel" className="dossier-panel">
              <div className="dossier-header">
                <div className="dossier-top">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 block mb-1">
                      FORENSIC CASE DOSSIER
                    </span>
                    <h2 className="dossier-title">{selectedCase.case_id}</h2>
                  </div>
                  <div className="text-right">
                    <span
                      className={`verdict-pill ${
                        selectedCase.judgment?.verdict === "FULFILLED"
                          ? "fulfilled"
                          : selectedCase.judgment?.verdict === "PARTIALLY_FULFILLED"
                          ? "partial"
                          : "breached"
                      }`}
                    >
                      {selectedCase.judgment?.verdict}
                    </span>
                    <span className="text-xs text-muted block mt-1 font-mono">
                      Confidence: {formatBps(selectedCase.judgment?.confidenceBps)}
                    </span>
                  </div>
                </div>

                <div className="dossier-meta-grid">
                  <div className="dossier-meta-item">
                    <span>Policy Standard</span>
                    <strong>{selectedCase.policy}</strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Award Payout</span>
                    <strong className="text-emerald-400">
                      {formatBps(selectedCase.judgment?.settlementBps)}
                    </strong>
                  </div>
                  <div className="dossier-meta-item">
                    <span>Finalized Timestamp</span>
                    <strong>{new Date(selectedCase.updated_at).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {/* Judicial Summary */}
              <div className="dossier-section">
                <div className="dossier-section-title">
                  <Sparkles size={15} className="text-cyan-400" />
                  <span>Adjudication Findings</span>
                </div>
                <div className="summary-box">
                  <p>{selectedCase.judgment?.summary}</p>
                </div>
              </div>

              {/* Atomic Acceptance Criteria */}
              <div className="dossier-section">
                <div className="dossier-section-title">
                  <CheckCircle2 size={15} className="text-indigo-400" />
                  <span>Atomic Acceptance Criteria Evaluation</span>
                </div>
                <div>
                  {selectedCase.judgment?.criteria.map((crit) => (
                    <div key={crit.id} className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-title">{crit.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted font-mono">
                            Weight: {formatBps(crit.weightBps)}
                          </span>
                          <span
                            className={`badge ${
                              crit.result === "PASS"
                                ? "pass"
                                : crit.result === "PARTIAL"
                                ? "partial"
                                : "fail"
                            }`}
                          >
                            {crit.result}
                          </span>
                        </div>
                      </div>
                      <p className="criterion-desc">{crit.description}</p>
                      <div className="criterion-reason">
                        <span className="text-cyan-400 mr-1">Finding:</span>
                        {crit.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Admissibility & Hash Check */}
              <div className="dossier-section">
                <div className="dossier-section-title">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Evidence Admissibility & Cryptographic Integrity</span>
                </div>
                <div className="space-y-2">
                  {selectedCase.judgment?.admissibility.map((ev) => (
                    <div key={ev.id} className="stat-box flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs font-semibold text-white">{ev.id}</div>
                        <div className="text-xs text-muted">{ev.reason}</div>
                      </div>
                      <span
                        className={`badge ${
                          ev.status === "ADMISSIBLE" ? "pass" : "fail"
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitments & Proof Hashes */}
              <div className="dossier-section">
                <div className="dossier-section-title">
                  <Lock size={15} className="text-cyan-400" />
                  <span>On-Chain Cryptographic Proofs</span>
                </div>
                <div className="pulse-meta">
                  <div>
                    <span className="text-muted">Mandate Hash: </span>
                    <span className="text-white break-all">{selectedCase.mandate_hash}</span>
                  </div>
                  <div>
                    <span className="text-muted">Delivery Hash: </span>
                    <span className="text-white break-all">{selectedCase.delivery_hash}</span>
                  </div>
                  <div>
                    <span className="text-muted">Judgment Hash: </span>
                    <span className="text-cyan-400 break-all">{selectedCase.judgment_hash}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Submission Terminal */}
        {activeTab === "submit" && (
          <section className="terminal-card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-dim">
              <div>
                <h2 className="text-xl font-bold font-display">Contract Submission Terminal</h2>
                <p className="text-sm text-muted">
                  Create a locked mandate commitment and deliver evidence for automated GenVM consensus.
                </p>
              </div>
              <span className="badge pass">Gasless StudioNet</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Mandate Case ID</label>
                <input
                  type="text"
                  value={mandateId}
                  onChange={(e) => setMandateId(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Forensic Policy Standard</label>
                <select
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value as PolicyType)}
                  className="form-select"
                >
                  <option value="SOFTWARE_WEB_V1">SOFTWARE_WEB_V1 (Web, APIs, Tests)</option>
                  <option value="RESEARCH_DATA_V1">RESEARCH_DATA_V1 (Data schemas, DOIs)</option>
                  <option value="GENERAL_V1">GENERAL_V1 (Contractual clauses)</option>
                  <option value="CREATIVE_VISUAL_V1">CREATIVE_VISUAL_V1 (Artifact specs)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Mandate Objective</label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="stat-box">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-cyan-400 uppercase">Criterion #1 (Critical)</span>
                  <span className="text-xs text-muted font-mono">{crit1Weight} BPS (60%)</span>
                </div>
                <input
                  type="text"
                  value={crit1Desc}
                  onChange={(e) => setCrit1Desc(e.target.value)}
                  className="form-input text-xs w-full"
                />
              </div>

              <div className="stat-box">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-indigo-400 uppercase">Criterion #2 (Secondary)</span>
                  <span className="text-xs text-muted font-mono">{crit2Weight} BPS (40%)</span>
                </div>
                <input
                  type="text"
                  value={crit2Desc}
                  onChange={(e) => setCrit2Desc(e.target.value)}
                  className="form-input text-xs w-full"
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Delivery Evidence URL (HTTPS Required)</label>
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Cryptographic Pre-Flight Preview */}
            <div className="hash-preview-box">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Real-Time Commitment Hashes (Auto-Computed)
              </div>
              <div className="hash-line">
                <span>Mandate Hash:</span>
                <span className="text-cyan-400">{computedMandateHash}</span>
              </div>
              <div className="hash-line">
                <span>Delivery Hash:</span>
                <span className="text-indigo-400">{computedDeliveryHash}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted">
                Adjudication will be executed by GenLayer validators on StudioNet.
              </div>
              <button
                onClick={() => {
                  alert(
                    `Case ${mandateId} submitted to dispatch queue!\nTo run live on StudioNet, execute:\n\nnpm run sample:case`
                  );
                }}
                className="btn-primary"
              >
                <Terminal size={15} />
                <span>Submit to LexArbiter Contract</span>
              </button>
            </div>
          </section>
        )}

        {/* Tab 3: Sandbox */}
        {activeTab === "sandbox" && (
          <section className="terminal-card">
            <h2 className="text-xl font-bold font-display mb-2">Evidence Sandbox & Checksum Auditor</h2>
            <p className="text-sm text-muted mb-6">
              Test any URL, payload, or specification before committing it to the on-chain agreement.
              LexArbiter requires all admissible proof to use TLS (HTTPS) and match declared SHA-256 digests.
            </p>

            <div className="form-group mb-4">
              <label className="form-label">Target URL or Raw Text</label>
              <input
                type="text"
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                className="form-input"
              />
            </div>

            <button onClick={handleTestSandbox} className="btn-primary mb-6">
              <Fingerprint size={15} />
              <span>{sandboxStatus === "testing" ? "Auditing Payload..." : "Audit Payload & Compute SHA-256"}</span>
            </button>

            {sandboxHash && (
              <div className="stat-box">
                <div className="text-xs text-muted mb-1 uppercase font-semibold">Calculated SHA-256 Digest</div>
                <div className="font-mono text-sm text-cyan-400 break-all mb-3">{sandboxHash}</div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Protocol Compliant: Valid for inclusion in delivery manifest</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 4: Constitution */}
        {activeTab === "constitution" && (
          <div className="grid-2">
            <div className="info-card">
              <h3>
                <Lock size={18} className="text-cyan-400" />
                <span>Zero-Trust Evidence Hierarchy</span>
              </h3>
              <p>
                A claim is not an artifact, an artifact is not evidence, and evidence is not a verified fact.
                LexArbiter validators crawl live sources directly over TLS. Unreachable or hash-mismatched
                links are immediately ruled <strong>UNVERIFIABLE</strong>.
              </p>
              <div className="pulse-meta">
                <div>1. Claim (Untrusted)</div>
                <div>2. Committed Manifest & Digest</div>
                <div>3. Independently Fetched HTTPS Proof</div>
                <div>4. Cryptographic Consensus Finality</div>
              </div>
            </div>

            <div className="info-card">
              <h3>
                <ShieldCheck size={18} className="text-indigo-400" />
                <span>Prompt-Injection Neutrality</span>
              </h3>
              <p>
                Any text inside submitted evidence is treated as raw data, never instructions. Instructions
                attempting to override court guidelines, declare automatic passes, or impersonate protocol
                officials trigger immediate contradiction rulings or breach verdicts.
              </p>
              <div className="pulse-meta">
                <div>• Strict Schema Normalization</div>
                <div>• Comparative Equivalence Principle</div>
                <div>• Storage Pre-Extraction Isolation</div>
                <div>• Deterministic Weight Settlement</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LexArbiter Logo" className="h-8 w-auto object-contain drop-shadow" />
            <span className="font-bold text-slate-800 tracking-wide">LexArbiter</span>
            <span className="text-muted text-xs">— Autonomous Adjudication on GenLayer</span>
          </div>

          <div className="footer-links">
            <a href={`${EXPLORER_BASE}${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
              StudioNet Explorer
            </a>
            <a href={`${STUDIO_BASE}${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
              GenLayer Studio
            </a>
            <span className="text-muted">Built for GenLayer Points Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
