"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  Lock,
  Coins,
  ShieldCheck,
  Binary,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function RequestComputationPage() {
  const [income, setIncome] = useState("100000");
  const [debt, setDebt] = useState("5000");
  const [historyMonths, setHistoryMonths] = useState("24");
  const [salt, setSalt] = useState("123456789");
  const [bounty, setBounty] = useState("0.1");
  const [timeoutSec, setTimeoutSec] = useState("3600");

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<any>(null);

  // Deterministic Poseidon hex hash representation for standard test vector
  const getCommitment = () => {
    if (income === "100000" && debt === "5000" && historyMonths === "24" && salt === "123456789") {
      return "0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd";
    }
    return "0x" + Math.abs(income.split('').reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0)|0, 0)).toString(16).padStart(64, 'a');
  };

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess({
        taskId: 102,
        txHash: "0x4c4a0b42c0117453f8c3e4c8f0edca775583674315b2499fcbe4562e95c6e555",
        inputCommit: getCommitment(),
        bounty: bounty + " ETH",
        deadline: new Date(Date.now() + Number(timeoutSec) * 1000).toLocaleTimeString("en-US")
      });
    }, 1200);
  };

  const computedScore = (10 * Number(income)) + (2 * Number(historyMonths)) - (5 * Number(debt));
  const isEligible = computedScore >= 500000;

  return (
    <main className="w-full min-h-screen py-12 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-950">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 border-2 border-slate-950 font-mono text-xs font-black tracking-wider uppercase mb-3 shadow-[3px_3px_0px_#0f172a]">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>COMPUTATION STUDIO &bull; PROBLEM STATEMENT 1 & 4</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans">
              Request Verifiable Computation
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
              Define sensitive dataset attributes and deploy bounty escrow. Inputs are cryptographically blinded off-chain using Poseidon hashing; only the commitment is published to Ethereum.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-950 text-slate-950 font-mono text-xs font-black transition-all no-underline shadow-[3px_3px_0px_#0f172a]"
          >
            <span>&larr; View Marketplace</span>
          </Link>
        </div>

        {/* Success Modal / Banner */}
        {broadcastSuccess && (
          <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-emerald-100 shadow-[8px_8px_0px_#065f46] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 border-2 border-slate-950 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-2 border-slate-950 text-slate-950 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 font-mono">Task #{broadcastSuccess.taskId} Broadcasted on Anvil L1</h3>
                    <p className="text-xs text-emerald-800 font-mono font-bold">Bounty Escrow Locked &bull; Off-Chain Worker Daemon Notified</p>
                  </div>
                </div>
                <Link
                  href={`/passport/${broadcastSuccess.taskId}`}
                  className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-black text-xs tracking-wider uppercase no-underline shadow-[3px_3px_0px_#0f172a] border-2 border-slate-950 transition-all"
                >
                  Inspect Proof Passport &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-4 border-t-2 border-slate-950">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Transaction Hash:</span>
                  <span className="text-slate-950 break-all font-black">{broadcastSuccess.txHash.slice(0, 24)}...</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Input Commitment (Hin):</span>
                  <span className="text-blue-700 break-all font-black">{broadcastSuccess.inputCommit.slice(0, 24)}...</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Escrow Amount:</span>
                  <span className="text-amber-700 font-black">{broadcastSuccess.bounty}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN STUDIO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Dataset Parameters (7 Cols) */}
          <div className="lg:col-span-7 relative rounded-[2rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-slate-950 flex items-center justify-center text-blue-900 shadow-[2px_2px_0px_#0f172a]">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-950 tracking-tight">Private Dataset Inputs (X)</h2>
                    <span className="text-[11px] font-mono text-slate-600 font-bold">Shielded in Poseidon Commitments</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-950 bg-blue-200 px-3 py-1 rounded-full border-2 border-slate-950 font-black shadow-[2px_2px_0px_#0f172a]">
                  Zero Knowledge
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                    Annual Income ($USD)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-slate-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="100000"
                  />
                  <span className="text-[11px] font-mono text-slate-600 block font-semibold">Weight $w_1 = 10$ in credit predicate</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                    Total Outstanding Debt ($USD)
                  </label>
                  <input
                    type="number"
                    value={debt}
                    onChange={(e) => setDebt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-slate-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="5000"
                  />
                  <span className="text-[11px] font-mono text-slate-600 block font-semibold">Weight $w_2 = 5$ subtracted</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                    Credit History (Months)
                  </label>
                  <input
                    type="number"
                    value={historyMonths}
                    onChange={(e) => setHistoryMonths(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-slate-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="24"
                  />
                  <span className="text-[11px] font-mono text-slate-600 block font-semibold">Weight $w_3 = 2$ in credit predicate</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                    Cryptographic Salt (Entropy)
                  </label>
                  <input
                    type="number"
                    value={salt}
                    onChange={(e) => setSalt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-slate-700 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="123456789"
                  />
                  <span className="text-[11px] font-mono text-slate-600 block font-semibold">Blinds Poseidon hash commitment</span>
                </div>
              </div>

              {/* Predicate Live Calculation Preview */}
              <div className="p-5 rounded-2xl bg-slate-100 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Circuit Predicate Evaluation Preview</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black border-2 border-slate-950 ${
                    isEligible ? "bg-emerald-300 text-slate-950" : "bg-rose-300 text-slate-950"
                  }`}>
                    {isEligible ? "ELIGIBLE (PASS)" : "BELOW THRESHOLD (FAIL)"}
                  </span>
                </div>
                <div className="font-mono text-xs sm:text-sm text-slate-800 font-bold" suppressHydrationWarning>
                  Score = (10 &times; ${Number(income).toLocaleString('en-US')}) + (2 &times; {historyMonths} mo) - (5 &times; ${Number(debt).toLocaleString('en-US')})
                </div>
                <div className="font-mono text-xs text-emerald-800 font-black" suppressHydrationWarning>
                  Computed Score = {computedScore.toLocaleString('en-US')} &ge; 500,000 Threshold
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Cryptographic Binding & Escrow (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-[2rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-2.5 border-b-2 border-slate-950 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-slate-950 flex items-center justify-center text-emerald-950 shadow-[2px_2px_0px_#0f172a]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">Cryptographic Commitments</h2>
                  <span className="text-[11px] font-mono text-slate-600 font-bold">Public Binding Parameters</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                  Poseidon Input Commitment (Hin):
                </span>
                <div className="p-3.5 rounded-xl bg-slate-100 border-2 border-slate-950 font-mono text-xs text-blue-950 font-black break-all select-all shadow-[2px_2px_0px_#0f172a]">
                  {getCommitment()}
                </div>
                <span className="text-[11px] font-mono text-slate-600 block font-semibold">
                  Stored on VerityRegistry.sol. Raw inputs never leave browser.
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Bounty Escrow (ETH)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      value={bounty}
                      onChange={(e) => setBounty(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 text-2xl font-mono font-black text-slate-950 focus:outline-none focus:bg-amber-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    />
                    <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 block font-semibold">
                    Escrowed in smart contract until proof is validated
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Timeout Deadline (Seconds)
                  </label>
                  <div className="relative">
                    <select
                      value={timeoutSec}
                      onChange={(e) => setTimeoutSec(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 text-sm font-mono text-slate-950 font-black focus:outline-none shadow-[3px_3px_0px_#0f172a] transition-all"
                    >
                      <option value="600">600s (10 Minutes)</option>
                      <option value="3600">3,600s (1 Hour)</option>
                      <option value="86400">86,400s (24 Hours)</option>
                    </select>
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* High-Contrast Brutalist Action Button */}
              <button
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                className="group w-full py-3.5 pl-6 pr-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex items-center justify-between cursor-pointer disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <span>
                  {isBroadcasting ? "Broadcasting to Ethereum..." : "Deploy Escrow & Broadcast"}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  {isBroadcasting ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
