# Repository Cleanup & .gitignore Optimization TODO

## 1. Environment & Secrets Management

- [X] Analyze `bitn build/worker/.env` for sensitive credentials.
- [X] Create `bitn build/worker/.env.example` as a sanitized template.
- [X] Untrack `bitn build/worker/.env` from git index (`git rm --cached`).

## 2. Root .gitignore Consolidation

- [X] Update root `.gitignore` to comprehensively cover:
  - Environment variables, secrets, and cryptographic keys (`.env*`, `*.pem`, `*.key`, preserving `*.zkey`)
  - Node.js / Next.js / Frontend build artifacts (`.next/`, `.turbo/`, `.vercel/`, `node_modules/`, `dist/`)
  - Compiled worker TypeScript outputs (`bitn build/worker/src/*.js`, `*.js.map`, `*.d.ts`, `*.d.ts.map`)
  - Foundry & Solidity build outputs (`out/`, `cache/`, `broadcast/`, `artifacts/`, `typechain/`)
  - Circom / ZK ceremony and witness files (`*.ptau`, `*.wtns`, `*.r1cs`, `*.sym`, `*_cpp/`, intermediate zkeys)
  - Rust & Cargo targets for `reference-app/zkcg-public` (`target/`, `debug/`, `*.pdb`)
  - OS metadata (`.DS_Store`, `Thumbs.db`, `desktop.ini`)
  - IDE and editor artifacts (`.idea/`, `.vscode/*`, `*.swp`, `*.swo`, `*.tmp`)
  - Logs and test coverage reports (`*.log`, `coverage/`, `.nyc_output/`)

## 3. Untrack Existing Build Artifacts & Transpiled Code

- [X] Untrack Foundry artifacts in `reference-app/zkcg-public/out/` (`git rm -r --cached`).
- [X] Untrack compiled TypeScript outputs in `bitn build/worker/src/` (`*.js`, `*.js.map`, `*.d.ts`, `*.d.ts.map`).
- [X] Add `reference-app/` to `.gitignore` and untrack all 242 reference app files from Git index.

## 4. Verification & Validation

- [X] Verify `git status` reflects untracked files as untracked/ignored properly.
- [X] Verify required source code and critical assets (circuits `circuit_final.zkey`, `compute_audit.wasm`, `vkey.json`, worker `.ts` files) remain intact and tracked.
- [X] Run `git check-ignore` on candidate paths to verify ignore rules work as expected.
