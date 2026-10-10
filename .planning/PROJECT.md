# Verity: Product Requirements Document (PRD) & Master Specification

**Project:** Verity — Blockchain-Based Verifiable Computation Platform  
**Target:** BitNBuild Hackathon | Problem Statement: `ps.md`  
**Version:** 1.0.0 (Hackathon Edition)  
**Status:** READY FOR IMPLEMENTATION  

---

## 1. Executive Summary & Vision

Modern enterprises and decentralized protocols increasingly outsource critical computations (AI inferences, financial risk modeling, credit evaluations, zero-knowledge compliance) to third-party cloud services or decentralized worker nodes. However, verifying that the returned result faithfully executed the agreed code on authentic inputs currently requires either:
1. **Blind trust** in the external provider (catastrophic for zero-trust environments and regulatory compliance), or
2. **Repeating the entire computation locally** (defeating the cost, time, and scalability advantages of outsourcing).

**Verity** solves this fundamental dilemma with a decentralized verifiable computation network that guarantees:
> **"Prove the Computation, Not Just the Result."**

Through on-chain cryptographic verification (Groth16 zk-SNARKs and optimistic dispute bisections), smart contract escrow, and bonded economic incentives, Verity allows any party to commission arbitrary computation and independently verify its correctness on Ethereum/EVM in milliseconds without repeating the heavy processing.

---

## 2. Core Personas & User Journeys

### Persona A: The Compute Requester (DeFi Protocol / Enterprise Client)
- **Goal:** Outsource heavy financial risk scoring or data reconciliation.
- **Journey:** Deposits bounty into `VerityRegistry.sol`, uploads input dataset $X$, specifies algorithm $C$ via IPFS CID. Receives mathematically verified result $Y$ and an immutable **Proof Passport** without running high-spec servers.

### Persona B: The Decentralized Worker (Compute Provider)
- **Goal:** Monetize idle GPU/CPU compute by solving jobs.
- **Journey:** Listens to `TaskRequested` blockchain events, executes $C(X) \to Y$ off-chain, generates cryptographic proof $\pi$, stakes collateral bond, and submits on-chain. Receives bounty + return of collateral + performance reward upon verification.

### Persona C: The Challenger / Watchtower (Whistleblower Node)
- **Goal:** Monitor the network for dishonest workers and earn bounty slashes.
- **Journey:** Detects manipulated outputs or corrupted execution claims during the dispute window, submits a bonded challenge, triggers contract fraud checks, slashes the malicious worker, and claims 50% of the forfeited stake.

### Persona D: The Hackathon Judge / Auditor
- **Goal:** Validate that the system actually protects against malicious adversaries.
- **Journey:** Opens the **Verity Chaos Lab** in the browser, clicks 1-click attack buttons (Bit-Flip Forgery, Fake Proof, Corrupted Input), and watches Verity detect the attack on-chain, revert the transaction, and preserve computational integrity.

---

## 3. Product Requirements & Feature Specifications

### FR-1: Verifiable Task Marketplace & Escrow (`VerityRegistry.sol`)
- **FR-1.1:** Requesters can create tasks by specifying `codeCommitment` (bytes32 IPFS CID/hash), `inputCommitment` (bytes32 keccak256 hash), timeout (uint256), and depositing ETH bounty.
- **FR-1.2:** Contract locks client bounty in escrow; emits `TaskRequested(taskId, requester, codeHash, inputHash, bounty, timeout)`.
- **FR-1.3:** Workers register by depositing a minimum slashable collateral stake (e.g. 0.05 ETH).
- **FR-1.4:** Requesters can claim a full refund if no worker submits a valid proof before the specified timeout.

### FR-2: Modular Cryptographic Verifier (`VerityVerifier.sol`)
- **FR-2.1:** Implements EVM pairing precompiles (`0x08`) over the BN254 elliptic curve for Groth16 zero-knowledge proofs.
- **FR-2.2:** Verifies 128-byte proof payload $(A \in G_1, B \in G_2, C \in G_1)$ against public inputs $(H_{\text{code}}, H_{\text{input}}, H_{\text{output}})$ in $O(1)$ gas complexity (< 220,000 gas).
- **FR-2.3:** Reverts with custom error `InvalidProof()` if pairing checks fail, preventing fake proof attacks.
- **FR-2.4:** Reverts with custom error `PublicSignalsMismatch()` if the worker claims an output value inconsistent with the proven public signals.

### FR-3: Input & Output Integrity Binding
- **FR-3.1:** Input datasets are authenticated using Poseidon Merkle roots or keccak256 leaf commitments.
- **FR-3.2:** The prover circuit ingests the private dataset $X$ as witness and public input hash $H(X)$ as a public signal, enforcing mathematical binding $H(X) == \text{Hash}(X)$.
- **FR-3.3:** Output results $Y$ are bound directly into the public signal vector, making output substitution cryptographically impossible.

### FR-4: Dispute Resolution & Bonded Slashing (`VerityDisputeManager.sol`)
- **FR-4.1:** For optimistic mode jobs, a challenge window (configurable, e.g., 50 blocks) is opened upon result submission.
- **FR-4.2:** Challengers deposit a dispute bond (e.g., 0.02 ETH) to dispute a submitted result.
- **FR-4.3:** Fraud adjudication: If the worker fails to provide a valid ZK refutation proof or if on-chain single-step verification fails, the worker is marked `Slashed`.
- **FR-4.4:** Penalty distribution: 50% of worker collateral is paid to the honest challenger; 50% is burned or sent to protocol treasury; client receives a 100% bounty refund.

### FR-5: The "Verity Chaos Lab" (Adversarial Testing Suite)
- **FR-5.1:** Interactive attack console in the frontend with 4 pre-configured live attack payloads:
  1. *Bit-Flip Output Attack:* Modifying output from honest calculation before submission.
  2. *Synthetic Fake Proof Attack:* Submitting mock random elliptic curve points.
  3. *Corrupted Input Substitution Attack:* Running code on a tampered dataset.
  4. *Griefing Challenge Attack:* Submitting a frivolous challenge against a valid proof.
- **FR-5.2:** Real-time feedback displaying transaction status, raw EVM revert selectors, decoded custom errors, and slashing animations.

### FR-6: Execution Traceability & "Proof Passport"
- **FR-6.1:** Visual trace explorer rendering the complete lifecycle tree: `Input Commitment` $\to$ `Off-Chain Sandbox Execution` $\to$ `Witness & Proof Generation` $\to$ `On-Chain Verifier Call` $\to$ `Finality Settlement`.
- **FR-6.2:** Generates a downloadable, self-authenticating **Verity Proof Passport** (JSON-LD credential and SVG token) containing full cryptographic metadata compliant with enterprise audit standards.

---

## 4. Non-Functional & Security Requirements

| Requirement | Metric / Specification |
|---|---|
| **On-Chain Gas Efficiency** | Groth16 verification $\le 225,000$ gas. Task creation $\le 85,000$ gas. Settlement payout $\le 45,000$ gas. |
| **Off-Chain Prover Latency** | Proof generation for benchmark financial model $\le 3.5$ seconds on standard laptop CPU. |
| **Security & Soundness** | Zero tolerance for false positives (cryptographic security parameter $\ge 100$ bits on BN254). |
| **Re-entrancy Protection** | All fund-holding contracts inherit OpenZeppelin `ReentrancyGuard` or use Checks-Effects-Interactions (CEI). |
| **Tamper Evidence** | All state changes emit indexed events, enabling deterministic reconstruction from genesis. |

---

## 5. Technology Stack & Directory Conventions

```
c:/dev/BitNBuild/
├── contracts/               # Foundry / Hardhat Solidity 0.8.24 Contracts
│   ├── VerityRegistry.sol   # Task marketplace, escrow, worker staking
│   ├── VerityVerifier.sol   # Groth16 BN254 pairing verifier
│   ├── VerityDispute.sol    # Dispute resolution & slashing logic
│   └── test/                # Foundry tests (*.t.sol) & gas benchmarks
├── circuits/                # Circom 2.1 Cryptographic Circuits
│   ├── compute_audit.circom # Deterministic financial/scoring circuit
│   └── build/               # Generated r1cs, wasm, and zkey proving keys
├── prover/                  # Off-Chain Prover & Worker Node (TypeScript/Node.js)
│   ├── worker.ts            # Autonomous task listener and execution daemon
│   ├── generate_proof.ts    # Witness generation and Groth16 prover runner
│   └── attacks.ts           # Adversarial payload generator for Chaos Lab
├── web/                     # Web3 Next.js 14 Operator & Chaos Dashboard
│   ├── src/app/             # App router pages (Marketplace, Worker, Chaos, Trace)
│   ├── src/components/      # Impeccable craft UI components
│   └── src/lib/             # Viem / Ethers contract connectors
└── .planning/               # GSD Roadmap, specs, and architectural graphs
```
