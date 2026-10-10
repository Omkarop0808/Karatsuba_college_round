# Verity: Master Implementation Roadmap & Phase Plan

*Generated: 2026-10-10 | Target: BitNBuild Hackathon | Framework: GSD Ultraplan | Status: ACTIVE*

---

## 1. Overview & Phase Dependency Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VERITY IMPLEMENTATION WAVES                     │
└────────────────────────────────────────────────────────────────────────┘

  [ PHASE 1: SMART CONTRACTS ]  ──►  VerityRegistry, VerityVerifier, Dispute
               │
               ▼
  [ PHASE 2: PROVING ENGINE ]   ──►  Circom Circuits, SnarkJS, Worker Daemon
               │
               ▼
  [ PHASE 3: WEB3 DASHBOARD ]   ──►  Next.js 14, Marketplace, Worker Console
               │
               ▼
  [ PHASE 4: THE CHAOS LAB ]    ──►  Live Adversarial Attack Suite & Slashing
               │
               ▼
  [ PHASE 5: PROOF PASSPORT ]   ──►  Trace Explorer, Verifiable Credentials
```

---

## 2. Phase-by-Phase Detailed Specifications

### 🔷 Phase 1: Smart Contract Core & Verification Engine
**Objective:** Author, deploy, and verify the production-grade Solidity smart contracts on EVM.
**Target Directory:** `c:/dev/BitNBuild/contracts/`

- [ ] **Task 1.1: Framework Setup & Interfaces**
  - Set up Foundry / Hardhat project with Solidity `0.8.24` and OpenZeppelin dependencies.
  - Define `IVerityVerifier.sol`, `IVerityRegistry.sol`, and data structures (`Task`, `TaskStatus`, `ProofPayload`).
- [ ] **Task 1.2: EVM Pairing Verifier (`VerityVerifier.sol`)**
  - Implement Groth16 pairing verifier using EVM precompiles at `0x08`, `0x06`, `0x07`.
  - Recycle and optimize proven verification logic from [reference-app/zkcg-public/contracts/ZKCGVerifier.sol](file:///c:/dev/BitNBuild/reference-app/zkcg-public/contracts/ZKCGVerifier.sol).
  - Add custom errors: `error InvalidProof();`, `error PublicSignalsMismatch();`.
- [ ] **Task 1.3: Task Escrow & Staking Registry (`VerityRegistry.sol`)**
  - Implement task creation with client bounty escrow (`requestComputation`).
  - Implement worker collateral staking (`registerWorker`, `stakeCollateral`).
  - Implement result submission and verifier invocation (`submitResult`).
  - Implement timeout refund mechanism for requesters (`claimTimeoutRefund`).
- [ ] **Task 1.4: Dispute Manager & Slashing (`VerityDispute.sol`)**
  - Implement challenge staking, challenge windows, and slashing distribution (50% challenger reward, 50% burned, 100% client refund).
- [ ] **Task 1.5: Test Suite & Gas Profiling**
  - Write Foundry unit tests (`VerityTest.t.sol`) testing all branches: happy path, invalid proof revert, signal mismatch revert, and timeout claims.
  - Ensure on-chain verification gas is strictly $\le 225,000$ gas.

---

### 🔷 Phase 2: Cryptographic Proving Pipeline & Off-Chain Worker Daemon
**Objective:** Build the Circom circuit, generate proving keys, and implement the autonomous worker node.
**Target Directories:** `c:/dev/BitNBuild/circuits/`, `c:/dev/BitNBuild/prover/`

- [ ] **Task 2.1: Proving Circuit Design (`compute_audit.circom`)**
  - Write Circom circuit for deterministic computation (financial risk model / credit score verification).
  - Enforce Poseidon input hashing: proves witness $X$ matches public input commitment $H(X)$.
  - Enforce computation rules: $Y = \text{Calculate}(X)$, outputting $Y$ as public signal.
- [ ] **Task 2.2: Circuit Compilation & Trusted Setup**
  - Compile circuit to R1CS and WASM using `circom`.
  - Generate Groth16 proving key (`zkey`) and verification key (`vkey.json`).
  - Export Solidity verifier parameters directly into `VerityVerifier.sol`.
- [ ] **Task 2.3: Autonomous Worker Daemon (`worker.ts`)**
  - Build TypeScript daemon subscribing to `TaskRequested` blockchain events.
  - Implement off-chain executor: calculates output $Y$, generates witness, and calls SnarkJS to produce Groth16 proof $(A, B, C)$.
  - Automatically signs and dispatches `submitResult` transaction with worker collateral.
- [ ] **Task 2.4: Adversarial Payload Generator (`attacks.ts`)**
  - Build module capable of synthesizing corrupted proofs, flipped output bits, and mismatched input hashes for testing.

---

### 🔷 Phase 3: Web3 Operator & Marketplace Frontend
**Objective:** Deliver an out-of-distribution, high-craft Web3 frontend adhering to `impeccable` design standards.
**Target Directory:** `c:/dev/BitNBuild/web/`

- [ ] **Task 3.1: Application Scaffold & Design Tokens**
  - Initialize Next.js 14 App Router project with TypeScript and Viem/Wagmi.
  - Implement dark-mode design system with bespoke typography, glassmorphism card surfaces, and dynamic accent glows.
- [ ] **Task 3.2: Task Requester Portal**
  - Input form for job description, dataset upload, and bounty amount.
  - Automated client-side hashing (computes $keccak256$ and $Poseidon$ root in real time).
  - One-click wallet transaction depositing bounty into `VerityRegistry`.
- [ ] **Task 3.3: Decentralized Worker Control Console**
  - Live dashboard showing worker node activity, CPU/memory telemetry, pending task queue, and proving execution status.
  - One-click "Run Worker" simulation mode for judges to see the worker pick up the task and generate proofs live.
- [ ] **Task 3.4: Active Tasks Marketplace & Feed**
  - Live table and card grid displaying all computations across lifecycle states: `REQUESTED`, `PROVING`, `VERIFIED`, `DISPUTED`.

---

### 🔷 Phase 4: The "Verity Chaos Lab" (Adversarial Testing Matrix)
**Objective:** Deliver the interactive attack simulation matrix satisfying Requirement 6 of `ps.md`.
**Target Directory:** `c:/dev/BitNBuild/web/src/components/chaos-lab/`

- [ ] **Task 4.1: Interactive Attack Trigger Matrix**
  - Implement 4 interactive attack buttons with distinct threat indicators:
    1. 🔴 *Attack Alpha: Output Bit-Flip Forgery*
    2. 🟠 *Attack Beta: Synthetic Fake Proof*
    3. 🟡 *Attack Gamma: Corrupted Input Substitution*
    4. 🔵 *Attack Delta: Malicious Dispute Griefing*
- [ ] **Task 4.2: Live Contract Revert Interceptor & Decoder**
  - Hook into Viem/Ethers execution to capture revert error data.
  - Decode 4-byte EVM error selectors into human-readable forensic explanations (`error InvalidProof()`, `error PublicSignalsMismatch()`).
- [ ] **Task 4.3: Security Visualizer & Slashing Animations**
  - Dynamic visual indicator showing worker collateral being slashed in real time.
  - Real-time Auditor Scorecard displaying 100% attack mitigation rate.

---

### 🔷 Phase 5: Execution Trace Explorer & Proof Passport
**Objective:** Complete execution traceability and enterprise compliance deliverables.
**Target Directory:** `c:/dev/BitNBuild/web/src/components/trace/`

- [ ] **Task 5.1: Visual Trace Explorer**
  - Interactive SVG execution DAG showing the cryptographic pipeline:
    `Input Merkle Leaf` $\to$ `Poseidon Hash` $\to$ `Circuit Execution` $\to$ `Groth16 Proof (128B)` $\to$ `EVM 0x08 Pairing` $\to$ `On-Chain Finality`.
- [ ] **Task 5.2: Self-Authenticating Proof Passport**
  - Generate downloadable, tamper-evident Proof Passport (JSON-LD credential and SVG badge).
  - Contains transaction hash, block timestamp, input/output commitments, and verifier contract signature.
- [ ] **Task 5.3: Deployment & Demonstration Assets**
  - Deploy contracts to local Anvil or testnet (Arbitrum Sepolia / Base Sepolia).
  - Record end-to-end demo video and publish GitHub repository documentation.

---

## 3. Exit Criteria & Definition of Done

Every phase must pass verification criteria before advancing:
1. **Phase 1 Done:** `forge test` passes with 0 failures and gas consumption logged $\le 225,000$ gas.
2. **Phase 2 Done:** Prover script successfully generates valid Groth16 proof from input data within 4 seconds.
3. **Phase 3 Done:** Requester can create a job in the UI, and Worker picks it up and submits the result.
4. **Phase 4 Done:** Clicking any Chaos Lab attack button successfully triggers contract revert and displays decoded error.
5. **Phase 5 Done:** Proof Passport is generated and verified against the on-chain contract.
