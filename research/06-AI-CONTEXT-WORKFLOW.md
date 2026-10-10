# AI Context Workflow: The Autonomous Execution Guide for Verity

*Generated: 2026-10-10 | Target: Deterministic Operational Workflow for AI Coding Agents | Confidence: High*

---

## 1. Purpose & How to Trigger This Workflow

This document is the **standard operating procedure (SOP)** that any AI agent must trigger and execute sequentially whenever working on the BitNBuild project. Following these 6 steps guarantees zero context drift, eliminates hallucinations, and ensures strict adherence to the competition problem statement (`ps.md`).

---

## 2. The 6-Step Autonomous Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI EXECUTION SEQUENCE                           │
└────────────────────────────────────────────────────────────────────────┘

  STEP 1: INGEST PROBLEM STATEMENT (`ps.md`)
          ▼
  STEP 2: LOAD MASTER BLUEPRINT (`research/00-PROJECT-OVERVIEW.md`)
          ▼
  STEP 3: RECYCLE REFERENCE CODE ASSETS (`reference-app/`)
          ▼
  STEP 4: INTERNALIZE NOVEL INNOVATIONS (`research/07-VERITY-INNOVATIONS-AND-ROADMAP.md`)
          ▼
  STEP 5: APPLY KARPATHY SURGICAL IMPLEMENTATION RULES
          ▼
  STEP 6: RUN EVIDENCE-BASED VERIFICATION LOOP
```

---

### Step 1: Ingest the Problem Statement (`ps.md`)
**Action:** View and internalize `c:/dev/BitNBuild/ps.md`.
**Verification Checklist:**
- [ ] Confirm project name: **Verity** — Blockchain-based verifiable computation platform.
- [ ] Understand the core thesis: "Prove the computation, not just the result."
- [ ] Memorize the 7 mandatory feature gates:
  1. Verifiable Computation
  2. Independent Verification
  3. Tamper-Evident Records
  4. Input and Output Integrity
  5. Dispute Resolution
  6. Adversarial Testing
  7. Execution Traceability

---

### Step 2: Load the Architectural Blueprint
**Action:** View `research/00-PROJECT-OVERVIEW.md` and `research/04-TECHNOLOGY-STACK-ANALYSIS.md`.
**Key Mental Model:**
> *"Never invent a parallel architecture. Verity connects off-chain provers with on-chain EVM verifiers using Groth16 zk-SNARKs and optimistic dispute games."*
**Technical Anchors:**
- Solidity `0.8.24` (`VerityRegistry.sol`, `VerityVerifier.sol`, `VerityDisputeManager.sol`).
- Circom / SnarkJS prover emitting Groth16 proofs on BN254.
- Next.js 14 Web3 dashboard with integrated Chaos Lab.

---

### Step 3: Inspect Reusable Code Assets
**Action:** Locate pre-existing modules in `reference-app/` before writing code from scratch:
- **Verifiers:** `c:/dev/BitNBuild/reference-app/zkcg-public/contracts/ZKCGVerifier.sol` (working Groth16 pairing verifier).
- **Merkle Roots:** `c:/dev/BitNBuild/reference-app/hackathon/` (Circom circuits and hashing).
- **Adversarial Test Payloads:** `c:/dev/BitNBuild/reference-app/AuditVector/` (manipulated inputs, corrupted proofs, bit-flip injectors).
- **Provenance & Signing:** `c:/dev/BitNBuild/reference-app/veritas/` (cryptographic non-repudiation).

---

### Step 4: Review Novel Innovations (`research/07-VERITY-INNOVATIONS-AND-ROADMAP.md`)
**Action:** Review the four designated innovation pillars that make Verity a hackathon winner:
1. **Dual-Mode Verification Engine:** Fast ZK validity for micro-tasks; optimistic bonded dispute games for heavy compute.
2. **The "Verity Chaos Lab":** An interactive UI matrix where judges trigger live attacks and watch Verity detect, challenge, and slash malicious actors.
3. **Execution Trace Explorer & Proof Passport:** Visual cryptographic lineage and downloadable verifiable credentials.
4. **Zero-Knowledge Privacy Gateways:** Processing sensitive private inputs while verifying public computation conformity.

---

### Step 5: Surgical Implementation Rules
**Guiding Principles:**
- **Think Before Coding:** State assumptions explicitly; verify file paths before modifications.
- **Simplicity First:** Smallest elegant solution that fulfills the specification; no speculative dependencies.
- **Surgical Edits:** Preserve existing styles, contracts, and comments; avoid unprompted refactoring.
- **Goal-Driven Milestones:** Each PR or phase must directly implement one of the 7 requirements in `ps.md`.

---

### Step 6: Evidence-Based Verification Loop
**Action:** Never claim a phase or task is complete without running verification commands and presenting terminal proof:
1. **Contract Tests:** Run `forge test` or `npx hardhat test` to prove all verifier paths pass.
2. **Adversarial Test Script:** Run the chaos suite to confirm that 100% of injected corrupted proofs and tampered outputs are rejected with expected custom errors (`InvalidProof()`, `InputMismatch()`).
3. **End-to-End Flow:** Trigger a full task lifecycle: `requestTask` $\to$ `submitResult` $\to$ `verifyProof` $\to$ `finalizeTask`.
4. **Evidence Capture:** Present gas reports, transaction hashes, and terminal outputs.

---

## 3. Quick Reference Cheat Sheet for Common Sub-Tasks

| If You Need To... | Check File... | Command / Pattern to Run |
|---|---|---|
| Verify Groth16 Precompile Gas | `reference-app/zkcg-public/contracts/test/ZKCGVerifier.t.sol` | `forge test --gas-report` |
| Add an Adversarial Attack Case | `research/07-VERITY-INNOVATIONS-AND-ROADMAP.md` | Check Chaos Lab Attack Matrix |
| Understand Dispute Bisection | `research/03-REAL-WORLD-PROCESS-MAP.md` | Section 3, Phase 5 |
| Inspect Market Competitors | `research/05-COMPETITIVE-ANALYSIS.md` | Section 3 Comparison Matrix |
