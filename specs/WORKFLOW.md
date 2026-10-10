# Verity — Workflow Map

## 1. End-to-End Sequence (happy path)

```text
REQUESTER                    REGISTRY / VERIFIER / DISPUTE              WORKER                        CHALLENGER
   │  requestComputation(code,input,timeout)+bounty                            │                               │
   ├─────────────────────────────────────────►│                                │                               │
   │                                   TaskRequested                           │                               │
   │                                          ├───────────────────────────────►│                               │
   │                                          │                      execute C(X) → Y, fullProve → π           │
   │                                          │◄── submitResult(Y,π)+stake ────┤                               │
   │                                          │  verifyProof(π, signals) via 0x08                              │
   │                                          │  Submitted · challenge window (50 blocks)                      │
   │                                          ├──────────────────────────────────────────────────────────────►│
   │                                          │◄── (no challenge) ─────────────────────────────────────────────┤
   │  ◄── TaskFinalized · bounty → worker ────┤                                │                               │
   │  Proof Passport exported                 │                                │                               │
```

Disputed path: `challengeResult`+bond → worker `revealInput(preimage)` → correct reveal clips the
griefer's bond; missing/wrong reveal slashes the worker (50% challenger / 50% treasury-or-burn)
and refunds the requester 100%.

## 2. Task State Machine

```mermaid
stateDiagram-v2
    [*] --> Requested: requestComputation + bounty
    Requested --> Submitted: submitResult valid proof + stake
    Requested --> Refunded: claimTimeoutRefund past deadline
    Submitted --> Challenged: challengeResult + bond in window
    Submitted --> Finalized: finalizeTask after window
    Challenged --> Submitted: correct reveal, griefer slashed
    Challenged --> Slashed: bad/missing reveal, worker slashed + refund
    Finalized --> [*]
    Refunded --> [*]
    Slashed --> [*]
```

## 3. Architecture Knowledge Graph (graphify output)

```mermaid
graph TD
    subgraph L1["1 · Requester layer"]
        Req[Requester dApp] --> DS[Dataset X + salt]
        Req --> PC[Policy weights + threshold]
    end
    subgraph L2["2 · Settlement layer · Solidity 0.8.24"]
        REG[VerityRegistry<br/>escrow · staking · lifecycle]
        VER[VerityVerifier<br/>Groth16 BN254 · precompile 0x08]
        DIS[VerityDisputeManager<br/>window · bonds · reveal rule · slash]
        REG --> VER
        REG --> DIS
    end
    subgraph L3["3 · Prover layer · off-chain"]
        WD[Worker daemon<br/>watcher · executor · prover · submitter]
        CIR[compute_audit.circom<br/>Poseidon bindings · score · comparator]
        SNK[snarkjs fullProve<br/>wasm + zkey]
        WD --> CIR
        CIR --> SNK
    end
    subgraph L4["4 · Chaos Lab"]
        CL[Attack deck UI] --> A1[α bit-flip → PublicSignalsMismatch]
        CL --> A2[β fake proof → InvalidProof]
        CL --> A3[γ bad input → InputHashMismatch]
        CL --> A4[δ griefing → ChallengerSlashed]
        A1 -.-> DEC[Revert decoder]
        A2 -.-> DEC
        A3 -.-> DEC
        A4 -.-> DEC
    end
    subgraph L5["5 · Traceability"]
        TR[Trace DAG] --> PP[Proof Passport<br/>JSON-LD + SVG]
        PP --> AUD[Auditor re-verifies]
    end
    Req -->|bounty + commitments| REG
    REG -.->|TaskRequested| WD
    WD -->|submitResult π + signals| REG
    REG -->|TaskFinalized| TR
```

Entity registry: `VerityRegistry` (orchestrates funds/state), `VerityVerifier` (pairing check),
`VerityDisputeManager` (bonds/slash), `compute_audit.circom` (R1CS rules), `worker/*`
(event→prove→submit), `chaos/*` (4 attack vectors + decoder), `trace/*` + `passport/*`
(lineage + credential). Full interface table: `TECH-SPEC.md §2–§6`.

## 4. Chaos-Lab Attack Flows (each must end in the specified revert/slash)

| Vector | Attacker action | Contract reaction | UI shows |
|---|---|---|---|
| α bit-flip | Honest π, `outputCommitment` altered | `PublicSignalsMismatch()` | claimed vs proven output diff |
| β fake proof | Random (a,b,c) points | `InvalidProof()` | pairing equation failure |
| γ bad input | Proof over `X_fake`, task commits `X_real` | `InputHashMismatch()` | commitment comparison |
| δ griefing | Bonded challenge of a *valid* proof | Worker reveals preimage → `ChallengerSlashed` | bond burn animation |

## 5. Real-World Process Contrast

Blind-trust today: raw data over HTTP → black-box container (skipped iterations, stale models,
MITM edits) → bare JSON `{score}` → accept-or-rerun dilemma. Verity replaces every arrow with a
commitment, a proof, or an escrowed bond — the diagram in §1 is the enforceable replacement.
