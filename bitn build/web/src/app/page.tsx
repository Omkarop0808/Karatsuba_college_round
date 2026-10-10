import React from "react";
import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Binary,
  Coins,
  Flame,
  Zap,
  Award,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Layers,
  Terminal,
  Scale,
  Bug,
  Bot,
  ArrowDown,
} from "lucide-react";
import InteractivePipeline from "@/components/InteractivePipeline";
import Hero3DNode from "@/components/Hero3DNode";
import AIAgentCockpit from "@/components/AIAgentCockpit";
import BentoComplianceGrid from "@/components/BentoComplianceGrid";
import VerityLogo from "@/components/VerityLogo";

export default function Home() {
  const metrics = [
    { label: "Circuit Constraints", value: "2,543 R1CS", detail: "64-bit Num2Bits finite-field bounded", icon: Cpu, color: "text-blue-600" },
    { label: "EVM Verification", value: "218,412 Gas", detail: "Native 0x08 ecPairing precompile", icon: ShieldCheck, color: "text-emerald-600" },
    { label: "Gas Savings", value: "95% Reduction", detail: "4.3M off-chain vs 218K on-chain", icon: TrendingDown, color: "text-purple-600" },
    { label: "Worker Collateral", value: "1.00 ETH", detail: "Cryptoeconomic fraud slashing bond", icon: Coins, color: "text-amber-600" },
  ];

  return (
    <main className="w-full min-h-screen text-slate-900 flex flex-col" suppressHydrationWarning>
      {/* HERO SECTION WITH 3D WEBGL NODE */}
      <section className="relative w-full pt-12 pb-24 px-4 sm:px-6 overflow-hidden" suppressHydrationWarning>
        {/* Subtle Ambient Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10" suppressHydrationWarning>
          
          {/* Hero Left Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6" suppressHydrationWarning>
            
            {/* Swiss Brutalist Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-mono font-bold tracking-wider shadow-sm" suppressHydrationWarning>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>BITNBUILD 2026 &bull; PROVABLE OFF-CHAIN COMPUTE</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-slate-950" suppressHydrationWarning>
              Prove the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                computation.
              </span>
              <br />
              Not just the result.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal" suppressHydrationWarning>
              Verity allows decentralized applications to offload expensive financial risk scoring and AI predicates off-chain, verifying zero-knowledge validity on Ethereum in <span className="text-blue-600 font-mono font-bold">218k gas</span> via EVM precompile 0x08.
            </p>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2" suppressHydrationWarning>
              <Link
                href="/request"
                className="group flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
              >
                <span>Launch Computation</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>

              <a
                href="#ai-agent-cockpit"
                className="group flex items-center gap-3 pl-5 pr-2 py-2.5 rounded-full bg-emerald-300 hover:bg-emerald-200 text-slate-950 border-2 border-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
                  <Bot className="w-4 h-4 text-slate-950" />
                  <span>Prover AI Cockpit</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-950/15 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </a>

              <Link
                href="/chaos"
                className="group flex items-center gap-3 pl-5 pr-2 py-2.5 rounded-full bg-rose-400 hover:bg-rose-300 text-slate-950 border-2 border-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  <span>Chaos Lab Attacks</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-950/15 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-slate-950" />
                </div>
              </Link>
            </div>

            {/* Quick Trust Signals */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-slate-700 border-t-2 border-slate-300 w-full font-bold" suppressHydrationWarning>
              <div className="flex items-center gap-1.5" suppressHydrationWarning>
                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                <span>Circom 2.1 Verified</span>
              </div>
              <div className="flex items-center gap-1.5" suppressHydrationWarning>
                <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                <span>Groth16 BN254 Pairings</span>
              </div>
              <div className="flex items-center gap-1.5" suppressHydrationWarning>
                <CheckCircleIcon className="w-4 h-4 text-purple-600" />
                <span>Anvil Localnet Live</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column (6 cols): Live 3D Cryptographic Core */}
          <div className="lg:col-span-6 w-full" suppressHydrationWarning>
            {/* Bold Brutalist Double-Bezel Frame for 3D Viewport */}
            <div className="relative rounded-[2.5rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-gradient-to-b from-slate-100 to-white border border-slate-300 overflow-hidden shadow-inner">
                <Hero3DNode />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* METRICS BENCHMARK STRIP: 4 Colorful Neo-Brutalist Bento Tiles */}
      <section className="w-full border-y-2 border-slate-950 bg-white py-10 px-6" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Circuit Constraints", value: "2,543 R1CS", detail: "64-bit Num2Bits finite-field bounded", icon: Cpu, bg: "bg-blue-100", border: "border-2 border-slate-950 shadow-[5px_5px_0px_#1e3a8a]", tag: "text-blue-950" },
            { label: "EVM Verification", value: "218,412 Gas", detail: "Native 0x08 ecPairing precompile", icon: ShieldCheck, bg: "bg-emerald-100", border: "border-2 border-slate-950 shadow-[5px_5px_0px_#065f46]", tag: "text-emerald-950" },
            { label: "Gas Savings", value: "95% Reduction", detail: "4.3M off-chain vs 218K on-chain", icon: TrendingDown, bg: "bg-purple-100", border: "border-2 border-slate-950 shadow-[5px_5px_0px_#581c87]", tag: "text-purple-950" },
            { label: "Worker Collateral", value: "1.00 ETH", detail: "Cryptoeconomic fraud slashing bond", icon: Coins, bg: "bg-amber-100", border: "border-2 border-slate-950 shadow-[5px_5px_0px_#78350f]", tag: "text-amber-950" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl p-5 ${m.bg} ${m.border} flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-[11px] uppercase font-mono tracking-wider ${m.tag} font-black`}>
                    {m.label}
                  </span>
                  <Icon className="w-4 h-4 text-slate-950" />
                </div>
                <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                  {m.value}
                </span>
                <span className="text-[11px] text-slate-700 mt-1 font-mono font-semibold">
                  {m.detail}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW PIPELINE GRAPH */}
      <section className="w-full py-20 px-4 sm:px-6 border-b-2 border-slate-950 bg-white" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-3.5 py-1.5 rounded-full border-2 border-slate-950 w-fit shadow-[3px_3px_0px_#0f172a]">
            <span>PHASE 2 &bull; PROOF PIPELINE ARCHITECTURE</span>
          </div>
          <InteractivePipeline />
        </div>
      </section>

      {/* AUTONOMOUS PROVER AI AGENT COCKPIT */}
      <section id="ai-agent-cockpit" className="w-full py-24 px-4 sm:px-6 border-b-2 border-slate-950 relative overflow-hidden bg-slate-100" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-950 font-black bg-emerald-300 px-4 py-1.5 rounded-full border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] inline-block">
              AUTONOMOUS PROVER AGENT COCKPIT &bull; V2.4
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Watch Real-Time Prover AI Execution
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-medium">
              Simulate decentralized AI worker daemons scanning mempools, computing 2,543 R1CS constraints, and submitting Groth16 proofs to Ethereum consensus.
            </p>
          </div>
          <AIAgentCockpit />
        </div>
      </section>

      {/* ASYMMETRICAL INDUSTRIAL BENTO GRID: ARCHITECTURAL COMPLIANCE (PS.MD) */}
      <section className="w-full py-24 px-4 sm:px-6 border-b-2 border-slate-950 relative overflow-hidden bg-white" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto">
          <BentoComplianceGrid />
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="w-full py-24 px-6 text-center border-b-2 border-slate-950 relative overflow-hidden bg-gradient-to-b from-slate-100 to-white" suppressHydrationWarning>
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 border-2 border-slate-950 flex items-center justify-center text-white mx-auto shadow-[4px_4px_0px_#0f172a]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans">
            Ready to test decentralized proof verification?
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Submit a computation job in the Studio, watch our autonomous worker daemon synthesize the Groth16 proof in real time, or inject Byzantine attacks in the Chaos Lab.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/request"
              className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 no-underline active:shadow-none"
            >
              Start in Studio &rarr;
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-3.5 rounded-full bg-purple-400 hover:bg-purple-300 text-slate-950 border-2 border-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 no-underline active:shadow-none"
            >
              Explore Active Marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
