# Verity — Recommended Technology Stack

## 1. Stack Table (locked)

| Layer | Choice | Version / Detail | Why |
|---|---|---|---|
| Smart contracts | Solidity + Foundry | `0.8.24`, Cancun EVM; `forge` build/test/gas | Native fuzzing, sub-second builds, exact gas reports; custom errors save gas |
| Contract libs | OpenZeppelin | `ReentrancyGuard` | Fund-holding contracts must be re-entrancy safe |
| Proof system | Circom + snarkjs | Circom `2.1`, Groth16/BN254, circomlib (Poseidon, Comparators) | Smallest calldata proof (8 field elements), native EVM precompile support, sub-2 s proving for our circuit |
| Worker runtime | Node.js + TypeScript | viem (chain I/O), snarkjs + circomlibjs (prove), Node `18+` | `which node` confirmed present on this host; single-language stack with web |
| Web app | Next.js App Router + TS | v14, Wagmi + Viem, Tailwind design tokens | Server components for passport pages; wallet-native flows; token-driven craft UI |
| Motion | GSAP + ScrollTrigger | `@gsap/react` | Pinned Chaos telemetry, scrubbed trace reveals (per Taste spec) |
| Local chain | Anvil (Foundry) | chain id `31337` | Zero-cost rehearsals; optional Base/Arbitrum Sepolia deploy later |
| Data availability | Local file store (hackathon) | JSON + preimages on disk | IPFS pinning is out of scope; commitments stay on-chain either way |

## 2. Rejected Alternatives (arena verdict, condensed)

- **Pure zkVM (RISC Zero/SP1):** 60–180 s proving kills the live demo.
- **Pure optimistic (Truebit/Cartesi-style):** multi-hour/day finality + no privacy; unusable in a 3-minute pitch.
- **Hardware TEE (SGX):** broken by side-channel history + centralized silicon trust; violates `ps.md`.
- **Halo2-off-chain + ECDSA attestation (ZKCG pattern):** reuses existing crates but on-chain check
  is a *signature*, not a computation proof — weaker against `ps.md` gates 1–2. Kept as reference only.

## 3. Toolchain Status (probed 2026-10-10 on this Windows host)

| Tool | Status |
|---|---|
| Node.js / npm / git / Python / Go / Docker | ✅ present |
| Foundry (`forge`, `anvil`, `cast`) | ❌ **missing — install first** |
| Circom compiler | ❌ **missing — install first** |
| Rust/Cargo | ❌ missing — **not required** (use prebuilt Circom binary) |

## 4. Install Steps (implementer runs these in Phase 0)

1. Foundry: `curl -L https://foundry.paradigm.xyz | bash` (Git Bash) → `foundryup` → verify
   `forge --version && anvil --version` (Windows: use Git Bash or WSL if the native installer stalls).
2. Circom: download the prebuilt Windows `circom` binary release → place on PATH → verify
   `circom --version` (target 2.1+).
3. snarkjs: `npm i -g snarkjs` → verify `snarkjs --version`.
4. Powers-of-tau file for the ceremony (`pot12_final.ptau` or as snarkjs requires) into
   `circuits/build/` (large; git-ignored).
5. Web/worker deps install only after scaffolds exist (`npm i` per package).
