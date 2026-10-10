# Verity — Product Requirements Document (PRD)

**Target:** BitNBuild hackathon · **Source:** `../ps.md`

## 1. Vision

> **Prove the computation, not just the result.**

Verity is a decentralized verifiable-computation network: anyone can commission a computation,
lock payment in on-chain escrow, and receive a result whose correctness is **mathematically
verified on Ethereum/EVM in one transaction** — no trust in the provider, no local re-execution.

## 2. Problem

Outsourced computation (risk models, AI inference, reconciliations) is a black box. Recording a
result on-chain timestamps an **unchecked** output. Clients choose between blind trust
(catastrophic in zero-trust/regulated settings) and full re-execution (destroys outsourcing
value). Verity breaks the tradeoff with succinct validity proofs + bonded economic guarantees.

## 3. Personas & Journeys

- **P-A Requester (DeFi protocol / enterprise).** Posts `codeCommitment + inputCommitment + bounty`,
  receives a verified result + Proof Passport without running infrastructure.
- **P-B Worker (compute provider).** Watches `TaskRequested`, executes off-chain, generates a
  Groth16 proof, stakes collateral, submits. Paid bounty + stake back on verification.
- **P-C Challenger (watchtower).** Bonds a challenge inside the window when something smells;
  earns 50% of a caught liar's stake; loses its own bond if griefing.
- **P-D Judge / Auditor.** Opens the Chaos Lab, fires 1-click attacks, watches each revert with
  decoded errors; exports a self-authenticating Proof Passport for any finalized task.

## 4. Functional Requirements (each maps to a `ps.md` gate)

### FR-1 — Task marketplace & escrow → gates 1, 3
- FR-1.1 `requestComputation(codeCommitment, inputCommitment, timeout)` payable; locks bounty.
- FR-1.2 Emits `TaskRequested(taskId, requester, codeHash, inputHash, bounty, deadline)`.
- FR-1.3 Workers register with slashable stake (`registerWorker`, min 0.05 ETH).
- FR-1.4 `claimTimeoutRefund` returns 100% bounty if no valid submission before deadline.

### FR-2 — On-chain Groth16 verifier → gates 1, 2
- FR-2.1 `VerityVerifier` verifies snarkjs Groth16 proofs over BN254 via precompiles
  `0x06/0x07/0x08` against public signals `[inputCommit, outputCommit, policyHash, w1, w2, w3, threshold]`.
- FR-2.2 Single-transaction verification; gas target 200k–300k (measured, not assumed).
- FR-2.3 Revert `InvalidProof()` on pairing failure (fake-proof attack).
- FR-2.4 Revert `PublicSignalsMismatch()` when submitted output ≠ proven output (bit-flip attack).

### FR-3 — Input/output integrity binding → gate 4
- FR-3.1 All commitments are Poseidon hashes (circuit) / `keccak256` (registry metadata).
- FR-3.2 Circuit constrains `Poseidon(witness, salt) == inputCommit` (public signal 0).
- FR-3.3 Circuit constrains `Poseidon(score, eligible, salt) == outputCommit` (public signal 1)
  and `Poseidon(w1,w2,w3,threshold) == policyHash` (public signal 2) — the agreed rules are bound.
- FR-3.4 Registry rejects submissions whose `publicSignals[0]` ≠ task `inputCommitment`
  with `InputHashMismatch()` (corrupted-input attack).

### FR-4 — Dispute resolution & slashing → gate 5
- FR-4.1 Challenge window of 50 blocks opens on every submission.
- FR-4.2 `challengeResult` requires a 0.02 ETH bond.
- FR-4.3 **Reveal rule:** a challenged worker must call `revealInput(taskId, preimage)` with
  `keccak256(preimage) == inputCommitment` before the window closes.
- FR-4.4 No/incorrect reveal → worker `Slashed`: 50% stake to challenger, 50% to treasury/burn,
  100% bounty refunded to requester. Correct reveal → challenger bond slashed (griefing punished).

### FR-5 — Chaos Lab adversarial suite → gate 6
- FR-5.1 Four 1-click live attacks: (α) output bit-flip forgery, (β) synthetic fake proof,
  (γ) corrupted input substitution, (δ) griefing challenge against a valid proof.
- FR-5.2 Each attack must visibly fail on-chain with its specified custom error and a decoded
  forensic explanation; (δ) ends with the challenger slashed.
- FR-5.3 Auditor scorecard shows per-vector PASS/FAIL; release requires 4/4 PASS.

### FR-6 — Traceability & Proof Passport → gates 3, 7
- FR-6.1 Trace explorer renders the full lineage:
  `input commitment → sandbox execution → witness → Groth16 proof → 0x08 pairing → finality`.
- FR-6.2 Every finalized task exports a self-authenticating Proof Passport (JSON-LD + SVG):
  task id, contract addresses, commitments, proof-system id, tx hash, block, timestamps,
  verifier signature data — re-verifiable without the worker.

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Verification gas | 200k–300k gas, recorded via `forge --gas-report` |
| NFR-2 | Prover latency (demo circuit) | < 2 s on a laptop CPU (`snarkjs fullProve`) |
| NFR-3 | Soundness | BN254 Groth16, ≥ 100-bit security; demo-grade local setup ceremony, documented |
| NFR-4 | Re-entrancy | OZ `ReentrancyGuard` on all fund-moving functions + checks-effects-interactions |
| NFR-5 | Tamper evidence | All state transitions emit indexed events; chain state reconstructible from genesis |
| NFR-6 | Accessibility | ≥ 4.5:1 text contrast, keyboard-navigable flows, live-region tx announcements |
| NFR-7 | Demo reliability | Full happy path + all 4 attacks rehearsed on Anvil; no mainnet/testnet dependency |

## 6. Acceptance Criteria (release gate)

1. `ps.md` gates 1–7 each traceable to a shipped, demonstrated FR above.
2. One Anvil end-to-end cycle with tx hashes; `forge test` green; gas report recorded.
3. Chaos Lab 4/4 PASS with decoded custom errors on screen.
4. One exported Proof Passport that re-verifies against chain state.
5. 3-minute demo script rehearsed (problem hook → live task → Chaos climax).
