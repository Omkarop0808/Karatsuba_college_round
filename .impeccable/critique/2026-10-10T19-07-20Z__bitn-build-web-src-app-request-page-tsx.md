---
target: the checkout page
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-10-10T19-07-20Z
slug: bitn-build-web-src-app-request-page-tsx
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No wallet connection status, account balance, or real-time gas estimate shown before broadcast. |
| 2 | Match System / Real World | 3 | Credit predicate math is clear, but "Cryptographic Salt (Entropy)" and timeout in seconds leak low-level internals. |
| 3 | User Control and Freedom | 2 | No "Reset Form" or "Create Another Task" action once a task has been broadcast. |
| 4 | Consistency and Standards | 3 | Solid Neo-Brutalist styling, but pill CTA conflicts with rectangular inputs; escrow color accents diverge. |
| 5 | Error Prevention | 2 | No input constraints against negative values or inputs causing underflow in the off-chain prover. |
| 6 | Recognition Rather Than Recall | 3 | Live predicate evaluation recalculates dynamically, but lacks total transaction cost breakdown. |
| 7 | Flexibility and Efficiency | 2 | No test vector presets or keyboard shortcuts for rapid demonstration and operator workflow. |
| 8 | Aesthetic and Minimalist Design | 3 | Bento structure is clean and bold, but right column suffers from vertical imbalance and unformatted raw hex box. |
| 9 | Error Recovery | 2 | Broadcast simulation lacks transaction revert explanations and fallback error boundaries. |
| 10 | Help and Documentation | 2 | Lacks contextual tooltips explaining zero-knowledge privacy guarantees and Poseidon commitment mechanics. |
| **Total** | | **24/40** | **Acceptable** |

### Design Specificity Verdict

**LLM assessment**: The Computation Studio (`/request`) succeeds in embodying a functional Web3 ZK-EVM workflow with high-contrast Swiss Neo-Brutalism, tactile offset shadows, and live mathematical previewing. However, as a "checkout page" where value is transferred and escrowed on-chain, it misses essential financial reassurance patterns: connected wallet attribution, gas overhead estimation, order summary breakdown, and preset test vectors.

**Deterministic scan**: The AST detector flagged 8 instances of `gray-on-color` (e.g. `text-slate-950 on bg-cyan-400`, `text-slate-950 on bg-emerald-500`, `text-slate-950 on bg-amber-50`). While high-contrast ink-on-color is a standard trope in Neo-Brutalist design, using tinted deep tones (e.g. `text-cyan-950`, `text-emerald-950`) enhances tonal harmony and eliminates wash-out artifacts.

### Overall Impression
A visually striking, highly technical crypto-native interface that handles arithmetic simulation well, but currently behaves more like a developer playground than a polished Web3 checkout experience. Adding wallet context, financial itemization, and 1-click test vectors will elevate it to production-grade quality.

### What's Working
1. **Live Predicate Calculation Preview**: Instantly shows applicants and auditors how `(10 * income) + (2 * history) - (5 * debt)` evaluates against the 500,000 threshold with dynamic PASS/FAIL badge feedback.
2. **Tactile Neo-Brutalist Language**: Strong borders (`border-2 border-slate-950`), hard offset drop shadows (`shadow-[8px_8px_0px_#0f172a]`), and crisp typography ground the page in authentic industrial design.
3. **On-Chain Passport Linkage**: Immediate direct route from successful task broadcast into the Proof Passport verification view.

### Priority Issues
- **[P1] Missing Total Checkout Financial Breakdown & Wallet Context**:
  - *Why it matters*: Users staking ETH in smart contract escrow must know which wallet is signing, their available balance, and the total cost (Bounty + Protocol Fee + L1 Gas).
  - *Fix*: Implement an "Escrow Checkout Summary" card displaying connected account (`0x7099...`), balance, gas cushion, and total ETH due.
  - *Suggested command*: `$impeccable layout` / `$impeccable harden`.
- **[P1] Lack of 1-Click Test Vector Presets**:
  - *Why it matters*: Manually retyping numbers to satisfy or stress-test circuit constraints creates high friction for hackathon evaluators and demo operators.
  - *Fix*: Add quick-fill preset chips ("Prime Borrower", "High-Risk Defaulter", "Borderline Threshold").
  - *Suggested command*: `$impeccable clarify` / `$impeccable delight`.
- **[P2] Unstructured Cryptographic Entropy & Jargon**:
  - *Why it matters*: Exposing "Cryptographic Salt" alongside loan parameters creates confusion for business users.
  - *Fix*: Move Entropy Salt and weight coefficients into an expandable "Advanced Circuit Parameters" accordion with a "Regenerate Salt" button.
  - *Suggested command*: `$impeccable distill`.
- **[P2] Lack of Post-Broadcast Reset Affordance**:
  - *Why it matters*: After broadcasting, the user cannot easily clear state to dispatch a new task without page reloads.
  - *Fix*: Add a "Create Another Task" secondary action next to "Inspect Proof Passport".
  - *Suggested command*: `$impeccable polish`.

### Persona Red Flags
- **Alex (Impatient Power User / Web3 Operator)**: Must manually re-enter 5 numeric fields every single time. No keyboard shortcut (`Cmd + Enter`) to dispatch. High friction during repeated benchmark runs.
- **Jordan (Confused First-Timer / Business User)**: Sees "Cryptographic Salt (Entropy) = 123456789" and a 66-character raw hex string `Hin` with no explanation of what to do with it. No copy button.
- **Riley (Stress Tester / Security Auditor)**: Enters negative numbers or debt exceeding income; the UI does not proactively validate bounds before triggering off-chain prover underflow errors.

### Minor Observations
- The Poseidon hex commitment block lacks a 1-click "Copy Hash" button with clipboard feedback.
- The timeout selection uses raw seconds in option values rather than clear human-readable time labels.
- The right column is noticeably shorter than the left column on desktop displays, creating an awkward whitespace gap.

### Questions to Consider
- Should we add a dedicated "Checkout Summary" panel that details Escrow Bounty (0.1 ETH) + Estimated Gas (~0.003 ETH) + Slashing Penalty Protection?
- Would collapsible "Advanced Cryptography Settings" make the form feel dramatically more approachable for non-cryptographers?
- Would adding 1-click demo presets make live evaluation and testing significantly faster?
