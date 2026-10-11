# Verity — Prove the Computation, Not Just the Result

> **Blockchain-Based Verifiable Computation Platform**  
> Verifying computations on-chain via Groth16 zero-knowledge proofs (BN254) with economic escrow, optimistic dispute resolution, and tamper-evident Proof Passports.

---

## 🌟 Overview

Modern organizations and decentralized protocols outsource heavy computational workloads (AI inference, financial risk scoring, zero-knowledge compliance) to third parties. However, verifying whether a computation was faithfully executed currently forces a trade-off: **blindly trust the service provider** or **wastefully re-run the computation locally**.

**Verity eliminates this trade-off.** Requesters lock bounties in smart contract escrow; workers execute tasks off-chain and submit results alongside a mathematical **Groth16 zk-SNARK proof**; smart contracts verify the proof on-chain in $O(1)$ gas complexity (<220k gas) using the BN254 pairing precompile (`0x08`). Tamper-evident **Proof Passports** record the entire execution lineage, while bonded challengers monitor for fraud in a dispute window.

---

## 🏗️ Architecture & Modules

```
├── bitn build/
│   ├── circuits/   # Circom 2.1 circuits & Groth16 prover / Poseidon hash bindings
│   ├── contracts/  # Foundry Solidity contracts (Registry, DisputeManager, Verifier)
│   ├── web/        # Next.js 15 App Router web interface & Chaos Lab
│   └── worker/     # Node.js / TypeScript compute & proof generation worker
├── specs/          # Complete architectural, PRD, and technical specifications
├── research/       # Comparative analysis and domain research papers
├── .planning/      # Project roadmap, design artifacts, and architecture graph
└── ps.md           # Problem statement
```

### Key Modules:
- **`contracts/` (`VerityRegistry.sol`, `VerityVerifier.sol`, `VerityDisputeManager.sol`)**:
  - Escrow management and task lifecycle (Requested → Submitted → Challenged → Finalized / Slashed / Refunded).
  - On-chain Groth16 verification with Poseidon Merkle root binding.
- **`circuits/` (`compute_audit.circom`)**:
  - Proves polynomial credit/risk scoring with zero-knowledge dataset privacy.
- **`worker/` (`src/worker.ts`)**:
  - Autonomous compute daemon listening to contract events, executing jobs, generating witnesses and SNARK proofs.
- **`web/` (`src/app/`)**:
  - Neo-Brutalist dashboard, Chaos Lab for live adversarial stress-testing, and Proof Passport viewer.

---

## 🚀 Quick Start

### 1. Smart Contracts (Foundry)
```bash
cd "bitn build/contracts"
forge install
forge test
```

### 2. Zero-Knowledge Circuits
```bash
cd "bitn build/circuits"
npm install
node demo_prove.js
```

### 3. Off-Chain Worker Node
```bash
cd "bitn build/worker"
cp .env.example .env
npm install
npm run build
npm start
```

### 4. Web Application & Chaos Lab
```bash
cd "bitn build/web"
npm install
npm run dev
```

---

## 📄 Documentation

- 📘 **[Master Technical Documentation](DOCUMENTATION.md)** — Comprehensive architecture, cryptographic specs, contracts, circuits, worker, Chaos Lab, and runbook.
- [PRD (Product Requirements Document)](specs/PRD.md)
- [Technical Specification](specs/TECH-SPEC.md)
- [System Workflow & State Machine](specs/WORKFLOW.md)
- [Implementation Plan](specs/IMPLEMENTATION-PLAN.md)
