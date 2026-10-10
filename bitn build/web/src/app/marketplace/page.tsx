"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Cpu,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  Lock,
  ArrowRight,
  Flame,
  Radio,
  FileCode2,
  Terminal,
  ExternalLink,
} from "lucide-react";

export default function MarketplacePage() {
  const [filter, setFilter] = useState("ALL");

  const tasks = [
    {
      id: 1,
      requester: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      worker: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      bounty: "0.10 ETH",
      status: "SUBMITTED",
      predicate: "Credit Risk Assessment (score >= 500k)",
      time: "Just now",
      gasUsed: "218,412",
      proofStatus: "ZK Proof Valid (BN254 Pairing 0x08)",
      theme: "emerald",
      bgGradient: "from-[#042f24] via-[#022119] to-[#01140f]",
      borderColor: "border-2 border-emerald-400 shadow-[8px_8px_0px_#065f46]",
      tagColor: "bg-emerald-400 text-slate-950 font-black",
      bountyColor: "text-emerald-300",
      accentText: "text-emerald-400",
      accentBg: "bg-emerald-950/80 border-emerald-500/50",
    },
    {
      id: 101,
      requester: "0x12a9918237bba88291040375a34901844f88",
      worker: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      bounty: "1.00 ETH",
      status: "FINALIZED",
      predicate: "DeFi Lending Eligibility Predicate",
      time: "15 min ago",
      gasUsed: "218,910",
      proofStatus: "Consensus Verified & Finalized",
      theme: "blue",
      bgGradient: "from-[#0c1f44] via-[#08152e] to-[#030914]",
      borderColor: "border-2 border-blue-400 shadow-[8px_8px_0px_#1e3a8a]",
      tagColor: "bg-blue-400 text-slate-950 font-black",
      bountyColor: "text-cyan-300",
      accentText: "text-blue-400",
      accentBg: "bg-blue-950/80 border-blue-500/50",
    },
    {
      id: 100,
      requester: "0xab426177092bbfa84803920199182049c11",
      worker: "0x3e88104820104820184029402849102922a1",
      bounty: "2.50 ETH",
      status: "REQUESTED",
      predicate: "RWA Risk Tier Assessment Engine",
      time: "42 min ago",
      gasUsed: "Pending (In Mempool)",
      proofStatus: "Awaiting Worker Prover Synthesis",
      theme: "amber",
      bgGradient: "from-[#3b2304] via-[#241501] to-[#120a00]",
      borderColor: "border-2 border-amber-400 shadow-[8px_8px_0px_#78350f]",
      tagColor: "bg-amber-400 text-slate-950 font-black",
      bountyColor: "text-amber-300",
      accentText: "text-amber-400",
      accentBg: "bg-amber-950/80 border-amber-500/50",
    },
    {
      id: 99,
      requester: "0x77c1048201928401928401928401928bb90",
      worker: "0xdead...beef (Malicious Node)",
      bounty: "0.50 ETH",
      status: "SLASHED",
      predicate: "Financial Audit Model v2 (Byzantine Attack)",
      time: "2 hrs ago",
      gasUsed: "Reverted (0x08 Reject)",
      proofStatus: "Fraud Caught: 1.0 ETH Bond Slashed",
      theme: "rose",
      bgGradient: "from-[#420817] via-[#29040e] to-[#140106]",
      borderColor: "border-2 border-rose-500 shadow-[8px_8px_0px_#9f1239]",
      tagColor: "bg-rose-500 text-white font-black",
      bountyColor: "text-rose-300",
      accentText: "text-rose-400",
      accentBg: "bg-rose-950/80 border-rose-500/50",
    },
  ];

  const filteredTasks = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FINALIZED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-blue-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            FINALIZED
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            PROVED &bull; LOCKED
          </span>
        );
      case "REQUESTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]">
            <Clock className="w-3.5 h-3.5" />
            OPEN IN MARKET
          </span>
        );
      case "SLASHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500 text-white border border-slate-950 shadow-[2px_2px_0px_#0f172a]">
            <AlertTriangle className="w-3.5 h-3.5" />
            SLASHED (1.0 ETH BOND)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-black bg-slate-200 text-slate-800">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="w-full min-h-screen py-12 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-400 text-slate-950 border-2 border-slate-950 font-mono text-xs font-black tracking-wider uppercase mb-3 shadow-[3px_3px_0px_#0f172a]">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>TAMPER-EVIDENT RECORDS &bull; PROBLEM STATEMENT 3</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans">
              Computation Marketplace
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
              Live immutable ledger of outsourced tasks, escrowed bonds, Groth16 proof submissions, and dispute verdicts.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/request"
              className="group flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
            >
              <span>+ Launch Task</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
        </div>

        {/* 4 Brutalist KPI Indicator Ribbons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Total Escrow Pool</span>
            <span className="text-2xl font-mono font-black text-amber-400 mt-1">4.10 ETH</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">VerityRegistry.sol</span>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Precompile Gas Verified</span>
            <span className="text-2xl font-mono font-black text-emerald-400 mt-1">749,377 Gas</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">Native 0x08 ecPairing</span>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Byzantine Mitigations</span>
            <span className="text-2xl font-mono font-black text-rose-400 mt-1">100% Defense</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">1 Slashed (1.0 ETH Bond)</span>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Active Worker Mesh</span>
            <span className="text-2xl font-mono font-black text-cyan-400 mt-1">14 Daemons</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">Anvil L1 Block #1084</span>
          </div>
        </div>

        {/* Filter Navigation Pills with Brutalist Shadows */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: "ALL", label: "ALL TASKS", count: 4 },
            { id: "SUBMITTED", label: "PROVED / LOCKED", count: 1 },
            { id: "FINALIZED", label: "FINALIZED", count: 1 },
            { id: "REQUESTED", label: "OPEN IN MARKET", count: 1 },
            { id: "SLASHED", label: "BYZANTINE SLASHED", count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-black tracking-wide transition-all cursor-pointer border-2 border-slate-950 ${
                filter === tab.id
                  ? "bg-slate-950 text-white shadow-[3px_3px_0px_#0f172a]"
                  : "bg-white text-slate-800 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:translate-x-0.5 hover:translate-y-0.5"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Task Cards List: Maximalist Morphism Bento Cards with High Visual Variety */}
        <div className="space-y-6">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`relative rounded-[2rem] p-1 bg-gradient-to-br ${t.bgGradient} ${t.borderColor} transition-transform hover:-translate-y-1 duration-200 overflow-hidden`}
            >
              {/* Tactical Blueprint Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="rounded-[calc(2rem-0.25rem)] p-6 sm:p-7 relative z-10 text-white">
                
                {/* Terminal Window Header Bar (macOS style dots) */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {/* Mac Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-600 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-600 shadow-xs" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white/80">
                      verity-task://0xAnvil/task-{t.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/60 font-semibold">{t.time}</span>
                    {getStatusBadge(t.status)}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Task Meta & Title */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white font-extrabold uppercase tracking-wider">
                          TASK #{t.id}
                        </span>
                        <span className={`text-xs font-mono ${t.accentText} font-bold`}>
                          [CIRCUIT: 2,543 R1CS &bull; BN254]
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {t.predicate}
                      </h3>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-white/50 block text-[10px] font-bold uppercase tracking-wider">Requester</span>
                        <span className="text-white/90 font-bold truncate block">
                          {t.requester.slice(0, 8)}...{t.requester.slice(-4)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-white/50 block text-[10px] font-bold uppercase tracking-wider">Assigned Worker</span>
                        <span className="text-cyan-400 font-bold truncate block">
                          {t.worker.slice(0, 8)}...{t.worker.slice(-4)}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-white/50 block text-[10px] font-bold uppercase tracking-wider">EVM Precompile Gas</span>
                        <span className="text-emerald-400 font-bold block">
                          {t.gasUsed}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                        <span className="text-white/50 block text-[10px] font-bold uppercase tracking-wider">Proof Integrity</span>
                        <span className="text-purple-300 font-bold truncate block">
                          {t.proofStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bounty & Passport Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] font-mono text-white/60 block uppercase font-bold tracking-wider">Escrow Bounty</span>
                      <span className={`text-3xl font-black font-mono ${t.bountyColor} tracking-tight`}>
                        {t.bounty}
                      </span>
                    </div>

                    <Link
                      href={`/passport/${t.id}`}
                      className="group flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 border-2 border-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[3px_3px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
                    >
                      <span>Proof Passport</span>
                      <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
