# Verity: Design System & UX Specification (Impeccable Edition)

*Generated: 2026-10-10 | Skill: Impeccable (Craft Floor v4.1.2) | Surface: Verity Web3 Platform | Modes: Operate + Persuade*

---

## 1. Design Direction & Visual Identity

### The Design Philosophy
Verity is not a generic, sterile corporate dashboard or a toy crypto swap. Verity is **high-assurance cryptographic infrastructure**. The visual aesthetic must evoke the feeling of a **military-grade quantum control terminal combined with modern Swiss high-precision minimalism**:
- **Tone:** Cryptographic, authoritative, precise, tamper-proof, electric.
- **Visual Anchor:** *"Every pixel proves itself."*

---

## 2. Color System & Design Tokens

We avoid generic primary colors (plain red/blue/green) and use curated, harmonious HSL tokens with subtle luminescent depth:

```css
:root {
  /* Surface & Background */
  --bg-deep: #07090e;           /* Deep obsidian void */
  --bg-surface: #0d121d;        /* Raised card elevation */
  --bg-surface-hover: #131a29;  /* Interactive hover surface */
  --border-subtle: #1e293b;     /* Structural separator */
  --border-accent: #2e3d55;     /* Highlighted edge */

  /* Text & Contrast */
  --text-primary: #f8fafc;      /* Crisp high-contrast reading */
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

---

## 3. Typography Hierarchy

- **Display & Headings:** `Space Grotesk` or `Outfit` (tabular, geometric, engineered feel).
- **Body & Data:** `Inter` (optimal legibility, high x-height, clear numeric distinction).
- **Code, Hashes & Proofs:** `JetBrains Mono` or `Fira Code` (for transaction hashes, public signal vectors, and opcode traces).

```css
/* Typography Scale */
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: 0.75rem;    /* 12px - Badges, hashes */
--text-sm: 0.875rem;   /* 14px - Body, table data */
--text-base: 1rem;     /* 16px - Standard text */
--text-lg: 1.125rem;   /* 18px - Card titles */
--text-xl: 1.25rem;    /* 20px - Section headings */
--text-2xl: 1.75rem;   /* 28px - Major metrics */
--text-3xl: 2.5rem;    /* 40px - Hero statements */
```

---

## 4. Dual Surface Modes: Persuade vs. Operate

### Mode 1: Persuade (Hero & Value Proposition)
- **Goal:** The visitor immediately grasps the $10B+ outsourced computation crisis and Verity's revolutionary answer within 5 seconds.
- **Key Elements:**
  - Dynamic interactive simulation comparing *Traditional Blind Trust* vs. *Verity Cryptographic Proof*.
  - Live metric ticker: Total Proofs Generated, Average Verification Gas (`210,480 gas`), Total Collateral Secured, 100% Attack Rejection Rate.

### Mode 2: Operate (Workstation & Chaos Lab)
- **Goal:** Frictionless execution for task submitters, workers, and auditors. High information density without cognitive clutter.
- **Key Surfaces:**
  1. **Task Submission Studio:** Fast, 2-step wizard to upload dataset, inspect auto-computed Poseidon hash, set bounty, and broadcast on-chain.
  2. **Worker Telemetry Console:** Real-time log streamer showing worker node picking up jobs, running witness generator, and generating Groth16 proofs.
  3. **The "Chaos Lab" Attack Deck:** Four high-contrast tactical attack trigger modules with status radar, live EVM revert decoders, and slashing telemetry.
  4. **The Trace Lineage DAG:** Visual interactive node graph rendering cryptographic verification step-by-step.

---

## 5. The Chaos Lab: Interaction & Motion Design

The Chaos Lab is the high-impact visual centerpiece for hackathon judges:
- **Default State:** A clean, armored console labeled *"Adversarial Attack Simulation Engine"*.
- **Interaction (Triggering an Attack):**
  - Clicking **"Inject Bit-Flip Attack"** initiates a warning pulse (amber $\to$ rose pulse wave).
  - The worker console displays red tampered payload telemetry: `Claimed: 999 | Actual: 42`.
  - Transaction dispatch displays broadcast indicator.
  - The smart contract interceptor catches the revert within 400ms:
    ```
    ┌────────────────────────────────────────────────────────┐
    │ ⛔ TRANSACTION REVERTED BY EVM PRECOMPILE             │
    │ Error: PublicSignalsMismatch()                         │
    │ Reason: Submitted output 0x03e7 does not match proof π │
    │ Action: Worker collateral 0.05 ETH Slashed to Escrow   │
    └────────────────────────────────────────────────────────┘
    ```
  - A subtle particle burst or slashing badge transitions the UI into a protected green shield state: *"Security Defense 100% Intact"*.

---

## 6. Impeccable Craft Floor Checklist

- [x] **No Placeholder Text:** Every label, hash, and status code represents actual cryptographic terminology.
- [x] **Zero Raw JSON Dumps:** All contract outputs and proofs are parsed into styled key-value metrics and formatted hex snippets with one-click copy buttons.
- [x] **Responsive Grid System:** 12-column adaptive layout scaling smoothly from widescreen desktop (1920px) to laptop (1366px) down to mobile inspection (375px).
- [x] **Micro-Interactions:** Subtle hover lifts (transform `translateY(-2px)`), smooth border gradient transitions, and monospaced truncated address tooltips.
- [x] **Accessibility (a11y):** Minimum 4.5:1 contrast ratio across all text elements, distinct focus rings for keyboard navigation, and aria-live announcements for transaction states.
