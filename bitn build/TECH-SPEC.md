# Verity — Technical Specifications

Solidity `0.8.24` · Circom `2.1` + circomlib · snarkjs (Groth16/BN254) · TypeScript worker (viem) ·
Next.js 14 (TypeScript, Wagmi/Viem, Tailwind tokens). Chain: Anvil (default).

## 1. Cryptographic Design

- **Proof system:** Groth16 over BN254. On-chain check
  `e(A,B) ≟ e(α,β)·e(C,γ)·∏e(Sᵢ,δ)` via precompiles `0x06` (ecAdd), `0x07` (ecMul), `0x08` (ecPairing).
- **Calldata proof size:** 8 field elements (`a[2], b[2][2], c[2]`) = **256 bytes**.
- **Hashing:** Poseidon inside circuits (∼350 constraints vs ∼25k for SHA-256); `keccak256` for
  registry metadata and the reveal-rule preimage check.
- **Setup:** per-circuit Phase-2 powers-of-tau; hackathon uses a local ceremony — documented as
  demo-grade in UI copy and passport metadata. Never claim production ceremony.

## 2. Smart Contracts (`contracts/`)

### 2.1 `VerityVerifier.sol` (+ `IVerityVerifier.sol`)
- Source: `snarkjs zkey export solidityverifier`, adapted: `pragma 0.8.24`, named
  `VerityVerifier`, wrapped as
  `verifyProof(ProofPoints(a,b,c), uint256[] signals) → bool` with
  `require(signals.length == 7, PublicSignalsMismatch())`.
- `ProofPoints { uint256[2] a; uint256[2][2] b; uint256[2] c; }`
- Pure/view; pairing failure returns `false` and the caller reverts `InvalidProof()`.

### 2.2 `VerityRegistry.sol`
- Constants: `MIN_WORKER_STAKE = 0.05 ether`, `CHALLENGE_WINDOW_BLOCKS = 50`,
  `CHALLENGE_BOND = 0.02 ether`, discoverable getters for all of them.
- `enum Status { None, Requested, Submitted, Challenged, Finalized, Refunded, Slashed }`
- `struct Task { address requester; bytes32 codeCommitment; bytes32 inputCommitment; uint256 bounty; uint64 deadline; address worker; bytes32 outputCommitment; uint64 challengeEnd; Status status; }`
- `requestComputation(bytes32 codeCommitment, bytes32 inputCommitment, uint64 timeoutSec) payable
  → taskId`. Requires `msg.value > 0`. Emits `TaskRequested`.
- `registerWorker() payable`. Requires `msg.value >= MIN_WORKER_STAKE`. Emits `WorkerRegistered`.
- `submitResult(uint256 taskId, bytes32 outputCommitment, ProofPoints, uint256[] signals)`.
  Requires worker staked, `status == Requested`, `block.timestamp <= deadline`,
  `signals[0] == uint256(task.inputCommitment)` else `InputHashMismatch()`,
  `verifier.verifyProof(...)` else `InvalidProof()`. Sets `Submitted`, `challengeEnd = block.number + 50`. Emits `TaskSubmitted`.
- `finalizeTask(taskId)`. Requires `Submitted`, `block.number > challengeEnd`. Pays bounty to
  worker (CEI + `nonReentrant`), sets `Finalized`. Emits `TaskFinalized`.
- `claimTimeoutRefund(taskId)`. Requires `Requested`, past deadline. Refunds bounty. Emits `Refunded`.
- Custom errors: `InvalidProof, PublicSignalsMismatch, InputHashMismatch, TaskNotFound, BadStatus,
  DeadlinePassed, WindowOpen, WindowClosed, InsufficientStake, NotRequester, TransferFailed`.

### 2.3 `VerityDisputeManager.sol`
- `challengeResult(taskId) payable` (bond = `CHALLENGE_BOND`, inside window, status `Submitted` →
  `Challenged`). Emits `TaskChallenged`.
- `revealInput(taskId, bytes preimage)` by the submitting worker: `keccak256(preimage)` must equal
  `inputCommitment` (preimage = abi-encoded raw inputs + salt).
- `resolveChallenge(taskId)`: correct reveal → challenger bond slashed to treasury, status back to
  `Submitted` (fresh window), emit `ChallengerSlashed`; missing/wrong reveal → worker stake slashed
  50% challenger / 50% treasury-or-burn, bounty refunded, status `Slashed`, emit `WorkerSlashed`.
- Reads task state from the registry via interface (no duplicated storage).

### 2.4 Tests (`test/Verity.t.sol`, Foundry)
Happy path; fake-proof revert; bit-flip revert; input-mismatch revert; timeout refund;
griefing-challenge slash; worker-fraud slash; re-entrancy attempt; fuzz `signals.length ≠ 7`;
`--gas-report` recorded into `contracts/GAS-REPORT.md`.

## 3. Circuit (`circuits/compute_audit.circom`)

- **Demo computation (credit-eligibility predicate):**
  `score = w1·income + w3·historyMonths − w2·debt`; `eligible = (score ≥ threshold)`.
- **Signals.** Private: `income, debt, historyMonths, salt`. Public (7, fixed order):
  `[inputCommit, outputCommit, policyHash, w1, w2, w3, threshold]`.
- **Constraints.** `Poseidon(income,debt,historyMonths,salt) == inputCommit`;
  `Poseidon(score,eligible,salt) == outputCommit`; `Poseidon(w1,w2,w3,threshold) == policyHash`;
  score equation; range-check each private input to 64 bits (`Num2Bits`); `eligible` via
  `circomlib` `LessThan` (score ≥ threshold ⟺ ¬(score < threshold)).
- **Artifacts** (`circuits/build/`): `compute_audit.r1cs`, `.wasm`, `*.zkey`, `vkey.json`,
  `verifier.sol` (moved to contracts), `input.json` demo vector. Proving key is large — never
  commit `build/` to git (see `.gitignore` rule in `IMPLEMENTATION-PLAN.md`).

## 4. Worker Daemon (`worker/`, TypeScript)

- `watcher.ts` — viem `watchContractEvent(TaskRequested)` with backfill on boot.
- `executor.ts` — pure BigInt mirror of the circuit math + Poseidon (circomlibjs) to compute
  `(score, eligible, commitments)`; asserts local recomputation matches before proving.
- `prover.ts` — `snarkjs.groth16.fullProve(witness, wasm, zkey)` → `{proof, publicSignals}`;
  asserts `publicSignals` order/length; target < 2 s.
- `submitter.ts` — builds `submitResult` calldata, estimates gas, sends with retry + nonce
  management; records tx hash for the trace explorer.
- `attacks.ts` — builders for the 4 Chaos payloads (flipped `outputCommitment`, random
  `a/b/c` points, wrong-input signals, griefing `challengeResult` on a finalized-valid task).

## 5. Web App (`web/`, Next.js 14 App Router)

- Routes: `/` (Persuade hero + live metrics), `/request` (2-step wizard: dataset → auto-hash →
  bounty → broadcast), `/worker` (telemetry console + 1-click simulated run), `/marketplace`
  (task cards/table by status), `/chaos` (attack deck + revert decoder + scorecard),
  `/trace/[taskId]` (lineage DAG), `/passport/[taskId]` (export JSON-LD + SVG).
- `lib/contracts.ts` — ABIs + addresses (Anvil `31337` default, env-overridable);
  `lib/hashing.ts` — client-side `keccak256`/Poseidon preview; `lib/revert-decoder.ts` —
  maps 4-byte selectors to `InvalidProof / PublicSignalsMismatch / InputHashMismatch` + copy.
- No raw JSON dumps: proofs/hashes render as truncated mono chips with copy buttons.

## 6. Proof Passport Schema (JSON-LD, v1)

`{ taskId, registry, verifier, chainId, txHash, blockNumber, timestamp, codeCommitment,
inputCommitment, outputCommitment, policyHash, proofSystem: "groth16-bn254",
publicSignals[7], verification: { verifier, gasUsed, result }, worker, requester }`
+ human-readable SVG badge with the same fields. Re-verification = recompute commitments from
revealed inputs and `eth_call` the verifier with stored proof+signals.
