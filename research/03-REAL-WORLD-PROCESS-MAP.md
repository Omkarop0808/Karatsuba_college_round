# Real-World Process Maps: Verifiable Computation Lifecycle

*Generated: 2026-10-10 | Scope: Real-World Outsourcing vs. Verity Protocol State Machine | Confidence: High*

---

## 1. The Broken Current State: Blind Trust Outsourcing

Today, organizations in finance, healthcare, AI, and Web3 spend billions outsourcing computation. Below is the operational reality of how outsourced computation fails in production:

```
┌────────────────────────────────────────────────────────────────────────┐
│               CURRENT BROKEN PROCESS: "BLIND TRUST"                   │
└────────────────────────────────────────────────────────────────────────┘

  [ Organization / Client ]
             │
             │ 1. Sends raw data + task parameters via HTTP API
             ▼
  [ Cloud Provider / External Worker ] (Black Box)
             │
             │ 2. Executes closed-source script / container
             │    * Possible Failure Points:
             │      - Worker skips 60% of iterations to cut GPU cost
             │      - Worker runs outdated model or quantizes weights
             │      - Man-in-the-middle modifies response payload
             │      - Malicious insider manipulates financial scoring
             ▼
  [ Returns Result JSON: { score: 785 } ]
             │
             ▼
  [ Organization Dilemma ]
       ├── Choice A: Blind Trust
       │   - Accepts result blindly
       │   - Catastrophic risk: Bad loans, medical misdiagnosis, contract exploit
       │
       └── Choice B: Full Re-execution
           - Runs the entire computation in-house to verify
           - Defeats 100% of the cost, time, and scaling benefit of outsourcing
```

---

## 2. The Verity Solution: End-to-End Operational Process Map

Verity replaces blind trust with **cryptographic enforcement** across six distinct phases:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                VERITY PROTOCOL PROCESS FLOW                                   │
└───────────────────────────────────────────────────────────────────────────────────────────────┘

[ CLIENT ]                  [ SMART CONTRACT ]            [ WORKER NODE ]          [ CHALLENGER ]
    │                              │                             │                       │
    │ 1. SubmitTask()              │                             │                       │
    │    - H(Code), H(Input)       │                             │                       │
    │    - Deposit Bounty          │                             │                       │
    ├─────────────────────────────►│                             │                       │
    │                              │ 2. Emit TaskRequested       │                       │
    │                              ├────────────────────────────►│                       │
    │                              │                             │                       │
    │                              │                             │ 3. Execute Off-chain  │
    │                              │                             │    - Computes Y=C(X)  │
    │                              │                             │    - Generates π      │
    │                              │                             │                       │
    │                              │ 4. SubmitResult(Y, π)       │                       │
    │                              │    - Worker Collateral Bond │                       │
    │                              │◄────────────────────────────┤                       │
    │                              │                                                     │
    │                     ┌────────┴────────┐                                            │
    │                     ▼                 ▼                                            │
    │             [ Instant ZK Mode ]  [ Optimistic Mode ]                               │
    │                     │                 │                                            │
    │           On-chain Verifier           │ 5. Start Dispute Window                    │
    │           evaluates π ($O(1)$)        ├───────────────────────────────────────────►│
    │                     │                 │                                            │
    │           ┌─────────┴─────────┐       │                         ┌──────────────────┴──────────────────┐
    │           ▼                   ▼       │                         ▼                                     ▼
    │       [ VALID ]          [ INVALID ]  │                 [ NO CHALLENGE ]                    [ FRAUD CHALLENGE ]
    │           │                   │       │                         │                                     │
    │           │                   │       │                   Window Expires                        Challenger bonds stake
    │           ▼                   ▼       │                         │                                     │
    │   Payout Worker         Slash Worker  │                         ▼                                     ▼
    │   Finalize Task         Refund Client │                  Payout Worker                   Interactive Bisection Game /
    │                                       │                  Finalize Task                   On-Chain Fraud Verification
    │                                       │                                                           │
    │                                       │                                                 ┌─────────┴─────────┐
    │                                       │                                                 ▼                   ▼
    │                                       │                                          [ WORKER FRAUD ]   [ FALSE ALARM ]
    │                                       │                                                 │                   │
    │                                       │                                                 ▼                   ▼
    │                                       │                                          Worker Slashed       Challenger Slashed
    │                                       │                                          Challenger Rewarded  Worker Compensated
    │                                       │                                          Client Refunded
```

---

## 3. Step-by-Step Technical Protocol Mechanics

### Phase 1: Cryptographic Task Specification & Escrow
1. **Input Commitment:** The client hashes the input dataset $X$:
   $$\text{InputHash} = \text{keccak256}(X) \quad \text{or} \quad \text{PoseidonMerkleRoot}(X_1, \dots, X_n)$$
2. **Code Commitment:** The client specifies the computation program $C$ via its immutable content identifier (IPFS CID or circuit verification key hash $\text{vk}_{\text{hash}}$).
3. **Escrow Deposit:** The client calls `VerityRegistry.requestComputation(codeHash, inputHash, timeout)` and sends `msg.value` (e.g., 0.05 ETH) into smart contract escrow.

### Phase 2: Off-Chain Execution by Decentralized Worker
1. A registered worker node detects the `TaskRequested` event on the blockchain.
2. The worker fetches the program $C$ and inputs $X$ from decentralized storage (IPFS/Arweave).
3. The worker validates that $\text{keccak256}(X) == \text{InputHash}$.
4. The worker executes $Y = C(X)$ inside an isolated deterministic runtime.

### Phase 3: Proof Generation & Cryptographic Binding
1. **Zero-Knowledge Path (ZK-SNARK):**
   - The worker executes the proving circuit using Groth16 / Halo2.
   - The circuit generates proof $\pi = (A, B, C)$ proving knowledge of witness $w$ such that the output $Y$ is strictly derived from $X$ according to rules $C$.
2. **Optimistic Path (Execution Trace):**
   - The worker records intermediate machine state roots ($S_0, S_1, \dots, S_N$).
   - The worker commits to the Merkle root of the execution trace: $\text{TraceRoot} = \text{Merkle}(S_0 \dots S_N)$.

### Phase 4: On-Chain Submission & Stake Binding
1. The worker calls `VerityRegistry.submitResult(taskId, outputCommitment, proofData)` and deposits **Worker Collateral** (e.g., 0.1 ETH).
2. The smart contract validates that the submission occurred before the designated deadline.

### Phase 5: Verification & Dispute Resolution
* **Scenario A — Direct ZK Verification:**
  The `VerityVerifier` contract evaluates the elliptic curve pairing:
  $$e(A, B) \stackrel{?}{=} e(\alpha, \beta) \cdot e(C, \gamma) \cdot \prod e(Pub_i, \delta)$$
  If valid (takes ~210,000 gas), the task immediately transitions to `Finalized`. Escrowed bounty is paid to the worker, and worker collateral is returned with a performance fee.
* **Scenario B — Optimistic Dispute Window:**
  A challenge period (e.g., 100 blocks / ~20 minutes for demo, 24 hours for production) begins.
  - If a challenger detects that $Y$ is incorrect or the trace root is invalid, they call `challengeResult(taskId)` with a **Challenger Bond**.
  - **Resolution Protocol:** The contract demands proof of the disputed step or runs the Groth16 verifier on-chain.
  - If fraud is proven: Worker collateral is **slashed** (50% burned, 50% paid to the whistleblower challenger), and the client receives a full refund.

### Phase 6: Tamper-Evident Settlement & Proof Passport
1. The smart contract permanently emits `TaskFinalized(taskId, outputCommitment, verifierStatus)`.
2. Verity generates a cryptographic **Proof Passport** containing:
   - Transaction hash & block number
   - Input commitment hash
   - Program specification hash
   - Cryptographic verification verdict
   - Digital signature of the verifier contract
3. Any third party can independently authenticate this passport without querying the original worker.

---

## 4. Real-World Enterprise Formalities & Compliance

| Enterprise Standard | How Verity Fulfills It |
|---|---|
| **SOC 2 Type II (Confidentiality & Processing Integrity)** | Verity cryptographically proves processing integrity without exposing sensitive client data, replacing manual auditor sampling with continuous mathematical verification. |
| **HIPAA (Health Insurance Portability & Accountability)** | Zero-knowledge verifiable compute allows medical AI diagnostics on patient data where inputs remain private, but proof of medical model conformity is public on-chain. |
| **Service Level Agreements (SLAs)** | Enforced autonomously via code: If a worker fails to return a valid proof within the contract `timeout`, the client is automatically refunded and the worker loses reputation. |
| **Legal Chain of Custody (Federal Rules of Evidence 902(13)/(14))** | Cryptographic hash binding and blockchain immutability satisfy self-authenticating digital evidence requirements for regulatory audits and legal proceedings. |
