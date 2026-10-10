# Verity: Architectural Knowledge Graph & Dependency Topology

*Generated: 2026-10-10 | Framework: GSD Graphify | Entity Count: 28 Nodes, 42 Edges | Confidence: High*

---

## 1. System Topology Overview (Mermaid Knowledge Graph)

```mermaid
graph TD
    subgraph ClientLayer ["1. Client & Requester Layer"]
        User["Client Application / DeFi Protocol"]
        Dataset["Raw Input Dataset (X)"]
        ProgramCID["Algorithm Code / Circuit (C)"]
    end

    subgraph BlockchainCore ["2. Smart Contract Settlement Layer (Solidity 0.8.24)"]
        Registry["VerityRegistry.sol<br/>(Task Escrow & State Machine)"]
        Verifier["VerityVerifier.sol<br/>(BN254 Pairing Precompile 0x08)"]
        Dispute["VerityDispute.sol<br/>(Bonds, Slashing & Whistleblower)"]
        EVMPrecompile["EVM Native ecPairing Precompile<br/>(Address 0x08)"]
    end

    subgraph ProverEngine ["3. Off-Chain Execution & Prover Subsystem"]
        WorkerDaemon["Verity Worker Daemon (TypeScript)"]
        Sandbox["Deterministic Runtime Sandbox"]
        Circuit["compute_audit.circom<br/>(R1CS Constraint System)"]
        SnarkJS["SnarkJS / Groth16 Prover"]
        ProofPayload["Proof Payload π (128 Bytes: A, B, C)"]
    end

    subgraph AdversarialHarness ["4. Chaos Lab & Adversarial Engine"]
        ChaosLab["The Verity Chaos Lab (UI)"]
        AttackBitFlip["Vector 1: Output Bit-Flip Forgery"]
        AttackFakeProof["Vector 2: Synthetic Fake Proof"]
        AttackBadInput["Vector 3: Corrupted Input Substitution"]
        AttackGriefing["Vector 4: Malicious Dispute Griefing"]
        ErrorDecoder["Custom Error Revert Decoder"]
    end

    subgraph TracePassport ["5. Traceability & Compliance Layer"]
        TraceExplorer["Visual Trace Lineage DAG"]
        Passport["Verity Proof Passport<br/>(JSON-LD & SVG Soulbound Receipt)"]
        Auditor["Enterprise Auditor / Regulatory Officer"]
    end

    %% Client Interactions
    User -->|1. Uploads X & C| Dataset
    User -->|2. Hashes X -> H_in| ProgramCID
    User -->|3. Calls requestComputation + Bounty| Registry

    %% Worker Execution
    Registry -.->|Emits TaskRequested| WorkerDaemon
    WorkerDaemon -->|Fetches X & C| Sandbox
    Sandbox -->|Executes Y = C(X)| Circuit
    Circuit -->|Generates Witness| SnarkJS
    SnarkJS -->|Produces Proof π| ProofPayload
    WorkerDaemon -->|Calls submitResult + Collateral| Registry

    %% Verification & EVM
    Registry -->|Invokes verifyProof(π, signals)| Verifier
    Verifier -->|Staticcall to 0x08| EVMPrecompile
    EVMPrecompile -->|Returns 1 (Valid) or 0 (Invalid)| Verifier

    %% Dispute & Slashing
    Verifier -.->|If Invalid -> Reverts with InvalidProof| Registry
    Dispute -->|Slashes Collateral on Fraud| Registry

    %% Chaos Lab Attack Flow
    ChaosLab -->|Triggers Attack| AttackBitFlip
    ChaosLab -->|Triggers Attack| AttackFakeProof
    ChaosLab -->|Triggers Attack| AttackBadInput
    ChaosLab -->|Triggers Attack| AttackGriefing
    AttackBitFlip -.->|Reverts: PublicSignalsMismatch| ErrorDecoder
    AttackFakeProof -.->|Reverts: InvalidProof| ErrorDecoder
    AttackBadInput -.->|Reverts: InputHashMismatch| ErrorDecoder

    %% Trace & Passport
    Registry -->|Emits TaskFinalized| TraceExplorer
    TraceExplorer -->|Compiles Execution Tree| Passport
    Passport -->|Verifies Self-Authenticating Proof| Auditor
```

---

## 2. Entity Dictionary & Dependency Registry

### Core Blockchain Contracts
| Entity ID | Type | Interfaces / Methods | Dependencies | Role |
|---|---|---|---|---|
| `VerityRegistry.sol` | Smart Contract | `requestComputation`, `submitResult`, `claimTimeoutRefund` | `VerityVerifier.sol`, `VerityDispute.sol` | Orchestrates bounty escrow, worker collateral, task state transitions. |
| `VerityVerifier.sol` | Smart Contract | `verifyProof(ProofPoints proof, uint256[] signals)` | `Groth16Verifier.sol`, EVM Precompile `0x08` (`ecPairing`) | Evaluates Groth16 pairings on the BN254 curve in ~252k gas. Tested in `VerityVerifier.t.sol`. |
| `Groth16Verifier.sol` | Smart Contract | `verifyProof(uint[2] _pA, uint[2][2] _pB, uint[2] _pC, uint[7] _pubSignals)` | EVM Precompiles `0x06`, `0x07`, `0x08` | Direct Groth16 pairing verifier contract generated via SnarkJS. |
| `VerityDispute.sol` | Smart Contract | `challengeResult`, `resolveDispute`, `slashWorker` | `VerityRegistry.sol` | Manages dispute challenge window, challenger bonds, and 50/50 slashing payouts. |

### Cryptographic Proving Pipeline
| Entity ID | Type | Formats / Standards | Inputs / Outputs | Role |
|---|---|---|---|---|
| `compute_audit.circom` | Circom Circuit | Circom 2.1 / R1CS | 2,543 constraints, 4 private inputs, 7 public inputs | Credit eligibility predicate ($score = w_1 \cdot \text{inc} + w_3 \cdot \text{hist} - w_2 \cdot \text{debt} \ge T$) bound via 3 Poseidon hashes. |
| `demo_prove.js` | Demo Runner | Node.js / SnarkJS | In: CLI parameters $\to$ Out: Proof + OK | Unified 1-step live proving runner executing commitment, witness, proof, and verify in ~3.5s total. |
| `generate_input.js` | Helper Tool | Node.js / CircomlibJS | In: CLI arguments $\to$ Out: `input.json` | Computes dynamic Poseidon hash commitments ($H_{in}, H_{out}, H_{pol}$) preventing assertion crashes. |
| `worker.ts` | Daemon Script | TypeScript / Node.js | In: WebSocket RPC $\to$ Out: Ethereum Tx | Autonomous worker watching for new tasks, executing code, and generating proofs. |
| `attacks.ts` | Attack Harness | TypeScript | In: Task ID $\to$ Out: Tampered Tx Payload | Synthesizes mutated proofs and corrupted payloads for the Chaos Lab. |

| `ChaosLabDeck` | React Component | Next.js 14 / Viem | OnClick $\to$ Triggers simulated attack tx | Tactical control deck allowing judges to trigger 4 live attack vectors. |
| `TraceLineageDAG` | React Component | SVG / D3 / Tailwind | In: Task Metadata $\to$ Out: Visual DAG | Step-by-step visual proof explorer showing full execution provenance. |
| `ProofPassportCard` | React Component | JSON-LD / SVG | In: Finalized Task $\to$ Out: Verifiable Token | Self-authenticating digital proof credential exportable for auditors. |
| `RequestCheckoutStudio` | React Component | Next.js / React 19 / Viem | In: Dataset Inputs, Escrow $\to$ Out: L1 Task Broadcast | Verifiable computation studio with live arithmetic predicate preview, escrow breakdown, and progressive entropy disclosure. |

