# Verity — Complete Implementation Plan

Execute phases in order. Each task names its exact file path. A phase is done only when its exit
criterion's evidence exists. DevFleet mapping: M1→Phase 1, M2→Phase 2, M3→Phase 3, M4→Phase 4,
M5→Phase 5a, M6→Phase 5b (+ Phase 0 setup, manual).

## Phase 0 — Environment & Scaffolds (manual, before DevFleet)

- [ ] 0.1 Install Foundry, Circom binary, snarkjs per `STACK.md §4`; record versions.
- [ ] 0.2 Create folders `bitn build/{contracts,circuits,worker,web}`; init `contracts/` with
      `forge init --no-git`; init `worker/` + `web/` with `npm` + TypeScript configs.
- [ ] 0.3 Append `circuits/build/` (keys, wasm, zkey) to the repo `.gitignore` — proving keys are
      large generated artifacts, never committed.
- [ ] 0.4 Start Anvil (`anvil --block-time 2`) and record the default funded keys for scripts.
- **Exit:** `forge --version`, `circom --version`, `snarkjs --version`, `anvil` mining locally.

## Phase 1 — Proving Pipeline (M1)

- [ ] 1.1 Write `circuits/compute_audit.circom` per `TECH-SPEC.md §3` (Poseidon bindings, score
      equation, 64-bit range checks, `LessThan` eligibility, policy binding).
- [ ] 1.2 Write `circuits/input.json` demo vector (income, debt, historyMonths, salt, weights, threshold).
- [ ] 1.3 Compile: `circom compute_audit.circom --r1cs --wasm -o build/`; run ceremony
      (`snarkjs powersoftau` + `zkey` contribute) → `build/*.zkey`, `vkey.json`.
- [ ] 1.4 Export verifier: `snarkjs zkey export solidityverifier build/circuit.zkey contracts/src/VerityVerifier.sol.raw`.
- [ ] 1.5 Sanity: `snarkjs groth16 fullProve input.json build/...wasm build/...zkey` → verify with
      `vkey.json` off-chain; assert public-signal order matches `TECH-SPEC.md §3`.
- **Exit:** off-chain `fullProve` < 2 s on demo input + `vkey` verification `OK`; raw verifier exported.

## Phase 2 — Settlement Layer (M2, depends on M1)

- [ ] 2.1 Adapt raw verifier into `contracts/src/VerityVerifier.sol` + `IVerityVerifier.sol`
      (pragma `0.8.24`, named struct, 7-signal length check) per `TECH-SPEC.md §2.1`.
- [ ] 2.2 Write `contracts/src/VerityRegistry.sol` (escrow, staking, submit/finalize/refund, events,
      custom errors) per `TECH-SPEC.md §2.2`.
- [ ] 2.3 Write `contracts/src/VerityDisputeManager.sol` (window, bond, reveal rule, slashing
      splits) per `TECH-SPEC.md §2.3`.
- [ ] 2.4 Write `contracts/test/Verity.t.sol`: happy path, 3 submit-time reverts, timeout refund,
      griefing slash, fraud slash, re-entrancy attempt, signal-length fuzz.
- [ ] 2.5 `forge test --gas-report`; save gas table to `contracts/GAS-REPORT.md`; deploy script to
      Anvil; record addresses in `web/.env.local` + `worker/.env`.
- **Exit:** `forge test` 100% green; gas report recorded; Anvil deployment addresses saved.

## Phase 3 — Worker Daemon (M3, depends on M1+M2)

- [ ] 3.1 `worker/src/watcher.ts` — event subscription + boot backfill (`TECH-SPEC.md §4`).
- [ ] 3.2 `worker/src/executor.ts` — BigInt circuit mirror + Poseidon commitments; assert-before-prove.
- [ ] 3.3 `worker/src/prover.ts` — `fullProve` wrapper with timing log + signal-order assertion.
- [ ] 3.4 `worker/src/submitter.ts` — `submitResult` sender with gas estimate, retry, tx-hash log.
- [ ] 3.5 `worker/src/attacks.ts` — 4 Chaos payload builders (α, β, γ, δ).
- [ ] 3.6 Dry run on Anvil: request → worker auto-proves → submits → finalizes; capture tx hashes.
- **Exit:** unmanned end-to-end cycle on Anvil with recorded tx hashes; proving time logged < 2 s.

## Phase 4 — Web Shell + Core Surfaces (M4, parallel after M1)

- [ ] 4.1 Scaffold Next.js 14 app; install design tokens/typography per `DESIGN.md §2–§3`.
- [ ] 4.2 `lib/contracts.ts`, `lib/hashing.ts`; Anvil chain config + addresses from Phase 2.
- [ ] 4.3 `/request` wizard (dataset → auto-hash preview → bounty → broadcast + receipt).
- [ ] 4.4 `/worker` console (status, logs, 1-click simulated run) and `/marketplace` (status-grouped tasks).
- [ ] 4.5 `/` hero (Persuade) + live metric ticker (proofs, median gas, collateral, rejection rate).
- **Exit:** judge can request a task and watch the worker finalize it, entirely in the UI.

## Phase 5a — Chaos Lab (M5, depends on M2+M4)

- [ ] 5a.1 Attack deck UI: 4 trigger cards with arming state + telemetry strip.
- [ ] 5a.2 `lib/revert-decoder.ts`: 4-byte selector → error name + forensic explanation + docs link.
- [ ] 5a.3 Wire α/β/γ to failing `submitResult` calls; wire δ to `challengeResult` on a valid task
      followed by worker `revealInput` and `resolveChallenge`.
- [ ] 5a.4 Auditor scorecard (4 vectors PASS/FAIL) + slashing animations per `DESIGN.md §5`.
- **Exit:** all 4 attacks demonstrably fail on-chain with decoded errors; scorecard 4/4 PASS.

## Phase 5b — Trace, Passport, Pitch (M6, depends on M3+M5)

- [ ] 5b.1 `/trace/[taskId]` lineage DAG (commitment → execution → witness → proof → pairing → finality).
- [ ] 5b.2 `/passport/[taskId]` JSON-LD + SVG export per `TECH-SPEC.md §6`, with re-verify instructions.
- [ ] 5b.3 Re-verify one passport against Anvil state; record the verification transcript.
- [ ] 5b.4 3-minute demo script + repo docs; final full rehearsal on a fresh Anvil instance.
- **Exit:** exported passport re-verifies; demo runs clean end-to-end twice in a row.

## 7. Global Exit Criteria (project done)

1. `forge test` green + `GAS-REPORT.md`; 2. sub-2 s prove logged; 3. Anvil E2E tx hashes;
2. Chaos 4/4 PASS screenshots; 5. re-verified passport file; 6. rehearsed 3-minute demo.
