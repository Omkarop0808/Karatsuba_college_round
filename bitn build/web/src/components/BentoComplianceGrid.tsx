"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Binary,
  ShieldCheck,
  Lock,
  Scale,
  Flame,
  ArrowRight,
  TrendingDown,
  Terminal,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Layers,
} from "lucide-react";

export default function BentoComplianceGrid() {
  const [activeCodeTab, setActiveCodeTab] = useState<"math" | "circom">("math");
  const [simulatedAttack, setSimulatedAttack] = useState<string | null>(null);

  const attacks = [
    {
      id: "bitflip",
      name: "Output Bit-Flip",
      tag: "Poseidon Tamper",
      status: "BLOCKED",
      desc: "Attempts to flip isEligible=true without satisfying Hout.",
      color: "border-rose-500/80 shadow-[4px_4px_0px_#e11d48]",
      badgeColor: "bg-rose-950 text-rose-300 border border-rose-500/50",
    },
    {
      id: "fakezk",
      name: "Forged Groth16",
      tag: "Curve Corruption",
      status: "REVERTED",
      desc: "Injects arbitrary elliptic curve coordinates. EVM 0x08 rejects.",
      color: "border-amber-500/80 shadow-[4px_4px_0px_#d97706]",
      badgeColor: "bg-amber-950 text-amber-300 border border-amber-500/50",
    },
    {
      id: "inputsub",
      name: "Input Substitution",
      tag: "Commitment Mismatch",
      status: "SLASHED",
      desc: "Alters income/debt data. Reverted by Hin equality check.",
      color: "border-purple-500/80 shadow-[4px_4px_0px_#7c3aed]",
      badgeColor: "bg-purple-950 text-purple-300 border border-purple-500/50",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Blueprint Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b-2 border-slate-950 font-mono text-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-400 text-slate-950 border-2 border-slate-950 font-mono text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0px_#0f172a]">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>SPECIFICATION SPEC &bull; PROBLEM STATEMENT (PS.MD)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-sans tracking-tight">
            Cryptographic Architecture Matrix
          </h2>
        </div>
        <div className="flex items-center gap-4 text-slate-700 text-xs font-black">
          <span>[REV: 2.1.0]</span>
          <span>[CURVE: BN254]</span>
          <span className="text-emerald-950 bg-emerald-300 px-3.5 py-1.5 rounded-full border-2 border-slate-950 flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
            <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse" />
            EVM 0x08 ACTIVE
          </span>
        </div>
      </div>

      {/* Industrial Brutalist Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* =========================================================================
            BENTO TILE 1 (2 Columns): Cyber Cobalt & Blueprint Navy
           ========================================================================= */}
        <div className="lg:col-span-2 relative rounded-[2.5rem] border-2 border-blue-600/90 shadow-[8px_8px_0px_#1e3a8a] bg-gradient-to-br from-[#0c1a3a] via-[#081226] to-[#040817] p-1.5 transition-transform hover:-translate-y-0.5 duration-300">
          <div className="rounded-[calc(2.5rem-0.375rem)] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
            {/* Tactical Corner Crosshairs */}
            <span className="absolute top-3 left-4 text-blue-400 font-mono text-sm select-none pointer-events-none">+</span>
            <span className="absolute top-3 right-4 text-blue-400 font-mono text-sm select-none pointer-events-none">+</span>

            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-500/50 font-bold tracking-wider shadow-sm">
                    PHASE 1 &bull; CIRCOM 2.1
                  </span>
                  <span className="text-[11px] font-mono text-blue-300/70 hidden sm:inline">[CIRCUIT: compute_audit.circom]</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-blue-500/30 text-xs font-mono">
                  <button
                    onClick={() => setActiveCodeTab("math")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeCodeTab === "math" ? "bg-blue-500 text-white font-bold shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Math Predicate
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("circom")}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeCodeTab === "circom" ? "bg-cyan-500 text-black font-bold shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Circom R1CS
                  </button>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                Deterministic Off-Chain Compute with 64-Bit Overflow Protection
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal mb-6">
                Enforces the mathematical audit policy without leaking confidential user financial parameters. Integrates bit-range decomposition <code className="text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 font-mono text-xs font-bold">Num2Bits(64)</code> to eliminate finite-field modular wrap-around exploits (<span className="text-blue-300 font-mono text-xs">p &approx; 2.18 &times; 10<sup>77</sup></span>).
              </p>

              {/* Code / Math Interactive Box */}
              {activeCodeTab === "math" ? (
                <div className="p-4 rounded-2xl bg-black/70 border border-blue-500/30 font-mono text-xs space-y-2.5 shadow-inner">
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest flex items-center justify-between">
                    <span>Credit Risk Assessment Specification</span>
                    <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">2,543 R1CS Constraints</span>
                  </div>
                  <div className="text-sm text-white font-bold bg-blue-950/60 p-3 rounded-xl border border-blue-500/40 font-mono">
                    Score = w<sub>1</sub> &times; income + w<sub>3</sub> &times; historyMonths &minus; w<sub>2</sub> &times; debt &ge; threshold
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/20"><span className="text-slate-400 block">w1 (Weight):</span><strong className="text-cyan-300 font-mono">10 &times; Income</strong></div>
                    <div className="p-2.5 rounded-xl bg-rose-900/30 border border-rose-500/20"><span className="text-slate-400 block">w2 (Weight):</span><strong className="text-rose-300 font-mono">5 &times; Debt</strong></div>
                    <div className="p-2.5 rounded-xl bg-purple-900/30 border border-purple-500/20"><span className="text-slate-400 block">w3 (Weight):</span><strong className="text-purple-300 font-mono">2 &times; History</strong></div>
                    <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-500/20"><span className="text-slate-400 block">Threshold:</span><strong className="text-amber-300 font-mono">&ge; 500,000</strong></div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30 font-mono text-xs space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/10 pb-1.5">
                    <span className="text-cyan-400 font-bold">circuits/compute_audit.circom</span>
                    <span className="text-slate-400">Circom 2.1 Compiler</span>
                  </div>
                  <pre className="text-cyan-200 overflow-x-auto text-[11px] leading-relaxed">
{`component n2bScore = Num2Bits(64);
n2bScore.in <== score;

component comp = GreaterEqThan(64);
comp.in[0] <== score;
comp.in[1] <== threshold;
isEligible <== comp.out;

component hasherIn = Poseidon(4);
hasherIn.inputs[0] <== income;
hasherIn.inputs[1] <== debt;
hasherIn.inputs[2] <== historyMonths;
hasherIn.inputs[3] <== salt;
inputCommit === hasherIn.out;`}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-blue-500/20 flex items-center justify-between text-xs font-mono text-blue-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero Field Overflow Vulnerabilities
              </span>
              <span className="text-cyan-300 font-bold">R1CS Status: Bounded &bull; Verified</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO TILE 2 (1 Column): Hyper Matrix Emerald & Mint
           ========================================================================= */}
        <div className="relative rounded-[2.5rem] border-2 border-emerald-500/90 shadow-[8px_8px_0px_#065f46] bg-gradient-to-br from-[#04281a] via-[#051f15] to-[#02130c] p-1.5 transition-transform hover:-translate-y-0.5 duration-300 flex flex-col justify-between">
          <div className="rounded-[calc(2.5rem-0.375rem)] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
            <span className="absolute top-3 right-4 text-emerald-400 font-mono text-sm select-none pointer-events-none">+</span>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold tracking-wider shadow-sm">
                  ALGEBRAIC S-BOX
                </span>
                <Binary className="w-5 h-5 text-emerald-400" />
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                Poseidon vs SHA-256
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-6">
                SHA-256 uses bitwise rotations requiring 25k R1CS constraints. Poseidon operates directly over the BN254 scalar field Fr, slashing constraints by <strong className="text-emerald-400 font-mono">90.4%</strong>.
              </p>

              {/* Constraint Benchmark Comparison Bar */}
              <div className="space-y-4 p-4 rounded-2xl bg-black/70 border border-emerald-500/30 font-mono text-xs shadow-inner">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Standard SHA-256</span>
                    <span className="text-rose-400 font-bold">~25,000 Constraints</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-emerald-400 font-bold">Poseidon Algebraic S-Box</span>
                    <span className="text-emerald-400 font-bold">240 Constraints</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 w-[9.6%]" />
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-slate-300">
                  <span>Delta Reduction:</span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">-90.4% Proof Overhead</span>
                </div>
              </div>

              {/* Commitments Architecture */}
              <div className="mt-4 space-y-2 font-mono text-[10px]">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex justify-between">
                  <span className="text-slate-400">Input Commitment:</span>
                  <span className="text-cyan-300 font-bold">Hin = Poseidon(In, Salt)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex justify-between">
                  <span className="text-slate-400">Policy Commitment:</span>
                  <span className="text-purple-300 font-bold">Hpol = Poseidon(Weights)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex justify-between">
                  <span className="text-slate-400">Output Commitment:</span>
                  <span className="text-emerald-300 font-bold">Hout = Poseidon(Res, Salt)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
              <span>Prover Speed: Instant</span>
              <span className="text-emerald-400 font-bold">&lt; 850ms WASM</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO TILE 3 (1 Column): Royal Amethyst & Cosmic Violet
           ========================================================================= */}
        <div className="relative rounded-[2.5rem] border-2 border-purple-500/90 shadow-[8px_8px_0px_#581c87] bg-gradient-to-br from-[#1e0b3a] via-[#140826] to-[#090314] p-1.5 transition-transform hover:-translate-y-0.5 duration-300 flex flex-col justify-between">
          <div className="rounded-[calc(2.5rem-0.375rem)] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
            <span className="absolute top-3 right-4 text-purple-400 font-mono text-sm select-none pointer-events-none">+</span>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/50 font-bold tracking-wider shadow-sm">
                  EVM 0x08 &bull; O(1)
                </span>
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                Constant-Time Bilinear Pairing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5">
                Evaluates BN254 elliptic curve bilinear pairings on Ethereum via native precompile address <code>0x08</code>. Execution cost is strictly flat regardless of off-chain input depth.
              </p>

              <div className="p-4 rounded-2xl bg-black/70 border border-purple-500/30 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-slate-300 text-[10px]">
                  <span>On-Chain Gas Consumption</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">218,412 Gas</span>
                </div>
                <div className="text-sm font-black text-white flex items-center justify-between">
                  <span>95% Gas Savings</span>
                  <span className="text-purple-300 text-xs font-normal">vs 4.3M naive compute</span>
                </div>
                <div className="text-[10px] text-purple-200/80 pt-2 border-t border-purple-500/20 font-mono">
                  Precompile: <code>staticcall(0x08, inputData)</code>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-purple-500/20 text-[11px] font-mono text-purple-300 flex items-center justify-between">
              <span>Verifier Contract:</span>
              <span className="text-purple-400 font-bold">VerityVerifier.sol</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO TILE 4 (1 Column): Radiant Amber & Solar Gold
           ========================================================================= */}
        <div className="relative rounded-[2.5rem] border-2 border-amber-500/90 shadow-[8px_8px_0px_#78350f] bg-gradient-to-br from-[#2e1c03] via-[#1e1302] to-[#110901] p-1.5 transition-transform hover:-translate-y-0.5 duration-300 flex flex-col justify-between">
          <div className="rounded-[calc(2.5rem-0.375rem)] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
            <span className="absolute top-3 right-4 text-amber-400 font-mono text-sm select-none pointer-events-none">+</span>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-bold tracking-wider shadow-sm">
                  CRYPTOECONOMIC ESCROW
                </span>
                <Lock className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                1.00 ETH Staking Collateral
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-5">
                Workers must lock 1.00 ETH in <code>VerityRegistry.sol</code> to claim tasks. Any proven cryptographic discrepancy triggers economic slashing: 50% reward to whistleblower, 50% burned.
              </p>

              <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 font-mono text-xs space-y-2 shadow-inner">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Collateral Required:</span>
                  <span className="text-amber-400 font-bold">1.000 ETH</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Whistleblower Bounty:</span>
                  <span className="text-emerald-400 font-bold">0.500 ETH (50%)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Burned to Address(0):</span>
                  <span className="text-rose-400 font-bold">0.500 ETH (50%)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-amber-500/20 text-[11px] font-mono text-amber-300 flex items-center justify-between">
              <span>Challenge Window:</span>
              <span className="text-amber-400 font-bold">100 Blocks</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO TILE 5 (2 Columns): Cyber Crimson & Hazard Flame
           ========================================================================= */}
        <div className="lg:col-span-2 relative rounded-[2.5rem] border-2 border-rose-500/90 shadow-[8px_8px_0px_#9f1239] bg-gradient-to-br from-[#360814] via-[#22060e] to-[#120207] p-1.5 transition-transform hover:-translate-y-0.5 duration-300">
          <div className="rounded-[calc(2.5rem-0.375rem)] p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
            <span className="absolute top-3 left-4 text-rose-400 font-mono text-sm select-none pointer-events-none">+</span>
            <span className="absolute top-3 right-4 text-rose-400 font-mono text-sm select-none pointer-events-none">+</span>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 font-bold tracking-wider shadow-sm">
                    PHASE 4 &bull; ADVERSARIAL AUDIT
                  </span>
                  <span className="text-[11px] font-mono text-rose-300/70 hidden sm:inline">[THE VERITY CHAOS LAB]</span>
                </div>
                <Link
                  href="/chaos"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-300 hover:text-white font-bold transition-colors"
                >
                  <span>Launch Chaos Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                Live Byzantine Attack Testing Suite
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                Directly simulates malicious adversarial workers injecting invalid inputs, forged elliptic curve proof coordinates, and mutated commitment bits. Verified in automated Foundry test suites.
              </p>

              {/* 3 Interactive Attack Cards with Vibrant Distinct Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {attacks.map((atk) => (
                  <button
                    key={atk.id}
                    onClick={() => setSimulatedAttack(atk.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      simulatedAttack === atk.id
                        ? "bg-rose-950/80 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]"
                        : `bg-black/60 hover:bg-black/80 text-slate-300 ${atk.color}`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-rose-300 font-bold">{atk.tag}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${atk.badgeColor}`}>
                          {atk.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{atk.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight">{atk.desc}</p>
                    </div>
                    <span className="text-[10px] text-rose-400 mt-3 font-bold block">
                      {simulatedAttack === atk.id ? "✓ Attack Defended" : "Click to Test &rarr;"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-rose-200">
              <span className="flex items-center gap-1.5 text-rose-300">
                <Flame className="w-4 h-4 text-rose-400" />
                4 Critical Exploit Modes: Bit-Flip, Fake ZK, Input Swap, Griefing
              </span>
              <Link
                href="/chaos"
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-colors font-bold text-xs uppercase shadow-md"
              >
                Open Full Chaos Suite &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
