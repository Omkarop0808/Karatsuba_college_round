# Verity — Design System (Impeccable + Taste + Frontend-Design principles)

**Modes:** `/` hero = Persuade (decide: trust Verity). App surfaces = Operate (complete tasks fast).
Trace/passport = Read (understand lineage). Identity: military-grade quantum terminal × Swiss
precision minimalism. Anchor: *"Every pixel proves itself."*

## 1. Grounding & Aesthetic Direction

Verity is **high-assurance cryptographic infrastructure**. It is neither a corporate template nor a standard crypto token dashboard.
- Tone: Cryptographic, authoritative, precise, tamper-proof, electric.
- Palette: Deep obsidian void base, luminescent cyan verification signals, emerald proof status, rose attack alerts.

```css
:root {
  /* Surface & Background */
  --bg-deep: #07090e;           /* Deep obsidian void */
  --bg-surface: #0d121d;        /* Raised card elevation */
  --bg-surface-hover: #131a29;  /* Interactive hover surface */
  --border-subtle: #1e293b;     /* Structural separator */
  --border-accent: #2e3d55;     /* Highlighted edge */

  /* Text & Contrast */
  --text-primary: #f8fafc;      /* High-contrast reading */
  --text-secondary: #94a3b8;    /* Muted structural labels */
  --text-tertiary: #64748b;     /* Micro-captions and timestamps */

  /* Semantic Accents */
  --accent-cyan: #06b6d4;       /* Primary verification & proof signal */
  --accent-cyan-glow: rgba(6, 182, 212, 0.18);
  --accent-emerald: #10b981;    /* Valid proof / verified state */
  --accent-emerald-glow: rgba(16, 185, 129, 0.2);
  --accent-amber: #f59e0b;      /* Pending / dispute window active */
  --accent-rose: #f43f5e;       /* Adversarial attack / slashed state */
  --accent-rose-glow: rgba(244, 63, 94, 0.22);
  --accent-indigo: #6366f1;     /* Smart contract / cryptographic opcode */
}
```

## 2. Typography Hierarchy (Taste + Frontend-Design rules)

- Display: `Space Grotesk` or `Outfit` (tabular, geometric, engineered feel).
- Body & Data: `Inter` or system sans (optimal legibility).
- Code, Hashes & Proofs: `JetBrains Mono` or `Fira Code`.

**Hero Layout & Line Limits:**
- H1 container width: `max-w-5xl` or `max-w-6xl` to allow natural horizontal text flow.
- H1 line limit: Must NOT exceed 2 to 3 lines.
- Type Scale: xs 12px · sm 14px · base 16px · lg 18px · xl 20px · 2xl 28px · 3xl 40px–56px.
- Avoid typographic anti-patterns:
  - NO single-word italic/color accenting in headlines.
  - NO tracked-out all-caps labels above headings ("SECTION 01").
  - NO '→' appended to every link/button text.

## 3. Layout Laws & Grid Execution

- AIDA Page Structure:
  - **Attention (Hero):** Cinematic, wide layout with background wash, clear headline, high-contrast CTAs.
  - **Interest (Bento):** High-density, gapless grid (`grid-flow-dense`) showing live verification stats and features.
  - **Desire (GSAP Scroll):** Pinned telemetry or scrubbed text reveal for execution lineage.
  - **Action (Footer/CTA):** High-contrast CTA and clean navigation links.
- Spacing: Large vertical padding between major sections (`py-32 md:py-48`).
- Page Root: Wrapped in `<main className="overflow-x-hidden w-full max-w-full">` to prevent horizontal scrollbars.
- Gapless Bento Grid: Apply `grid-auto-flow: dense` with exact `col-span` and `row-span` alignment so zero empty cells exist.

## 4. Operate Surfaces (App Dashboard & Workstation)

- **Requester Studio:** 2-step wizard to upload dataset, inspect auto-computed Poseidon hash preview, set bounty, and broadcast on-chain.
- **Worker Console:** Real-time log streamer showing worker node picking up jobs, generating witness, and submitting Groth16 proofs.
- **Marketplace Feed:** Status-grouped task view (`REQUESTED`, `PROVING`, `VERIFIED`, `DISPUTED`).
- **Data presentation:** Parsed key-value metrics and formatted hex chips with copy buttons — zero raw JSON dumps.

## 5. Chaos Lab Interaction & Motion (GSAP + ScrollTrigger)

- Default state: Armored tactical console labeled *"Adversarial Attack Simulation Engine"*.
- Triggering an attack:
  1. Trigger button initiates amber-to-rose warning pulse.
  2. Worker console logs tampered payload telemetry (`Claimed: 999 | Proven: 42`).
  3. Smart contract revert captured within 400ms:
     ```
     ┌────────────────────────────────────────────────────────┐
     │ ⛔ TRANSACTION REVERTED BY EVM PRECOMPILE             │
     │ Error: PublicSignalsMismatch()                         │
     │ Reason: Submitted output does not match proof π        │
     │ Action: Worker collateral 0.05 ETH Slashed            │
     └────────────────────────────────────────────────────────┘
     ```
  4. Slashing animation updates collateral state, transitioning to protected green shield: *"Security Defense 100% Intact"*.
- Auditor Scorecard displays 4/4 attack mitigation status in real time.

## 6. Claude Design Principles Applied

- Purposeful motion: Non-user-triggered motion used sparingly to draw attention; motion answers user action.
- Content-first copywriting: Plain verbs, sentence case, direct active voice ("Request Computation", "Submit Proof", "Run Attack Vector").
- Accessible & Responsive: Minimum 4.5:1 contrast, visible focus rings, responsive grid down to mobile screens.
- Zero AI-slop: No generic purple/pink gradients, no soft grey cards with identical shadows, no gratuitous glassmorphism.
