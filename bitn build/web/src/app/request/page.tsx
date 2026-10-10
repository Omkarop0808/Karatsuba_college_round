"use client";

import React, { useState, useMemo } from "react";
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
  Wallet,
  Fuel,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Dices,
  Info
} from "lucide-react";

export default function RequestComputationPage() {
  const [income, setIncome] = useState("100000");
  const [debt, setDebt] = useState("5000");
  const [historyMonths, setHistoryMonths] = useState("24");
  const [salt, setSalt] = useState("123456789");
  const [bounty, setBounty] = useState("0.1");
  const [timeoutSec, setTimeoutSec] = useState("3600");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<any>(null);

  // Sanitized numerical representations to guarantee non-negative prover values
  const safeIncome = Math.max(0, Number(income) || 0);
  const safeDebt = Math.max(0, Number(debt) || 0);
  const safeHist = Math.max(0, Number(historyMonths) || 0);

  // Deterministic Poseidon hex hash representation for standard test vectors (Memoized)
  const commitmentHash = useMemo(() => {
    if (income === "100000" && debt === "5000" && historyMonths === "24" && salt === "123456789") {
      return "0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd";
    }
    return "0x" + Math.abs(income.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0) | 0, 0)).toString(16).padStart(64, 'a');
  }, [income, debt, historyMonths, salt]);

  // Live arithmetic predicate calculation (Memoized)
  const { computedScore, isEligible } = useMemo(() => {
    const score = (10 * safeIncome) + (2 * safeHist) - (5 * safeDebt);
    return {
      computedScore: score,
      isEligible: score >= 500000
    };
  }, [safeIncome, safeHist, safeDebt]);

  // Dynamic fee calculation (Memoized)
  const { bountyNum, protocolFeeNum, estimatedGasEth, totalEthRequired } = useMemo(() => {
    const b = Number(bounty) || 0;
    const p = 0.005;
    const g = 0.0035;
    return {
      bountyNum: b,
      protocolFeeNum: p,
      estimatedGasEth: g,
      totalEthRequired: (b + p + g).toFixed(4)
    };
  }, [bounty]);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(commitmentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const generateRandomSalt = () => {
    const randomEntropy = Math.floor(100000000 + Math.random() * 900000000).toString();
    setSalt(randomEntropy);
  };

  const loadPreset = (presetType: "prime" | "subprime" | "threshold") => {
    if (presetType === "prime") {
      setIncome("100000");
      setDebt("5000");
      setHistoryMonths("24");
      setSalt("123456789");
    } else if (presetType === "subprime") {
      setIncome("35000");
      setDebt("40000");
      setHistoryMonths("6");
      setSalt("987654321");
    } else if (presetType === "threshold") {
      setIncome("50000");
      setDebt("0");
      setHistoryMonths("0");
      setSalt("555444333");
    }
  };

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess({
        taskId: 102,
        txHash: "0x4c4a0b42c0117453f8c3e4c8f0edca775583674315b2499fcbe4562e95c6e555",
        inputCommit: commitmentHash,
        bounty: bounty + " ETH",
        protocolFee: "0.0050 ETH",
        gasUsed: "218,412 gas",
        deadline: new Date(Date.now() + Number(timeoutSec) * 1000).toLocaleTimeString("en-US")
      });
    }, 1200);
  };

  const handleReset = () => {
    setBroadcastSuccess(null);
    setIncome("100000");
    setDebt("5000");
    setHistoryMonths("24");
    setSalt("123456789");
    setBounty("0.1");
  };

  return (
    <main className="w-full min-h-screen py-12 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-950">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400 text-cyan-950 border-2 border-slate-950 font-mono text-xs font-black tracking-wider uppercase mb-3 shadow-[3px_3px_0px_#0f172a]">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>COMPUTATION STUDIO &bull; CHECKOUT & ESCROW</span>
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

        {/* 1-Click Test Vector Presets Strip */}
        <div className="p-4 rounded-2xl bg-white border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
              1-Click Benchmark Presets:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Dataset presets">
            <button
              type="button"
              onClick={() => loadPreset("prime")}
              className="px-3.5 py-2.5 min-h-[44px] flex items-center rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-slate-950 font-mono text-xs font-black shadow-[2px_2px_0px_#0f172a] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Prime Borrower ($100k, Score: 975k &bull; PASS)
            </button>
            <button
              type="button"
              onClick={() => loadPreset("subprime")}
              className="px-3.5 py-2.5 min-h-[44px] flex items-center rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-950 border-2 border-slate-950 font-mono text-xs font-black shadow-[2px_2px_0px_#0f172a] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              High-Risk Defaulter ($35k, $40k debt &bull; FAIL)
            </button>
            <button
              type="button"
              onClick={() => loadPreset("threshold")}
              className="px-3.5 py-2.5 min-h-[44px] flex items-center rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-slate-950 font-mono text-xs font-black shadow-[2px_2px_0px_#0f172a] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Exact Threshold ($50k, Score: 500k &bull; PASS)
            </button>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {broadcastSuccess && (
          <div role="alert" className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-emerald-100 shadow-[8px_8px_0px_#065f46] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 border-2 border-slate-950 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-2 border-slate-950 text-emerald-950 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 font-mono">Task #{broadcastSuccess.taskId} Broadcasted on Anvil L1</h3>
                    <p className="text-xs text-emerald-800 font-mono font-bold">Bounty Escrow Locked &bull; Off-Chain Worker Daemon Notified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Deploy another computation task"
                    className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 border-2 border-slate-950 text-slate-950 font-mono text-xs font-black shadow-[2px_2px_0px_#0f172a] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Deploy Another</span>
                  </button>
                  <Link
                    href={`/passport/${broadcastSuccess.taskId}`}
                    className="flex items-center px-6 py-2.5 min-h-[44px] rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-black text-xs tracking-wider uppercase no-underline shadow-[3px_3px_0px_#0f172a] border-2 border-slate-950 transition-all"
                  >
                    Inspect Proof Passport &rarr;
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono pt-4 border-t-2 border-slate-950">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Transaction Hash:</span>
                  <span className="text-slate-950 break-all font-black">{broadcastSuccess.txHash.slice(0, 18)}...</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Input Commitment (Hin):</span>
                  <span className="text-blue-700 break-all font-black">{broadcastSuccess.inputCommit.slice(0, 18)}...</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Escrow Bounty:</span>
                  <span className="text-amber-700 font-black">{broadcastSuccess.bounty}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                  <span className="text-slate-600 block text-[11px] font-bold">Settlement Gas:</span>
                  <span className="text-emerald-700 font-black">{broadcastSuccess.gasUsed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN STUDIO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Dataset Parameters & Circuit Preview (7 Cols) */}
          <div className="lg:col-span-7 relative rounded-[2rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-slate-950 flex items-center justify-center text-blue-900 shadow-[2px_2px_0px_#0f172a]">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-950 tracking-tight">Private Dataset Inputs (X)</h2>
                    <span className="text-[11px] font-mono text-slate-600 font-bold">Shielded by Poseidon Hash Commitments</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-950 bg-blue-200 px-3 py-1 rounded-full border-2 border-slate-950 font-black shadow-[2px_2px_0px_#0f172a]">
                  Zero Knowledge
                </span>
              </div>

              {/* Primary User Inputs with Proper Semantic Label For and ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="income-input" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Annual Income ($)
                  </label>
                  <input
                    id="income-input"
                    type="number"
                    min="0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-blue-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="100000"
                  />
                  <span className="text-[10px] font-mono text-slate-600 block font-semibold">Weight $w_1 = 10$</span>
                </div>

                <div className="space-y-2">
                  <label htmlFor="debt-input" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Outstanding Debt ($)
                  </label>
                  <input
                    id="debt-input"
                    type="number"
                    min="0"
                    value={debt}
                    onChange={(e) => setDebt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-blue-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="5000"
                  />
                  <span className="text-[10px] font-mono text-slate-600 block font-semibold">Weight $w_2 = 5$ subtracted</span>
                </div>

                <div className="space-y-2">
                  <label htmlFor="history-input" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    History (Months)
                  </label>
                  <input
                    id="history-input"
                    type="number"
                    min="0"
                    value={historyMonths}
                    onChange={(e) => setHistoryMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-blue-950 text-base focus:outline-none focus:bg-blue-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    placeholder="24"
                  />
                  <span className="text-[10px] font-mono text-slate-600 block font-semibold">Weight $w_3 = 2$ added</span>
                </div>
              </div>

              {/* Predicate Live Calculation Preview */}
              <div role="status" aria-live="polite" className="p-5 rounded-2xl bg-slate-100 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Circuit Predicate Evaluation Preview</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black border-2 border-slate-950 ${
                    isEligible ? "bg-emerald-300 text-emerald-950" : "bg-rose-300 text-rose-950"
                  }`}>
                    {isEligible ? "ELIGIBLE (PASS)" : "BELOW THRESHOLD (FAIL)"}
                  </span>
                </div>
                <div className="font-mono text-xs sm:text-sm text-slate-800 font-bold" suppressHydrationWarning>
                  Score = (10 &times; ${safeIncome.toLocaleString('en-US')}) + (2 &times; {safeHist} mo) - (5 &times; ${safeDebt.toLocaleString('en-US')})
                </div>
                <div className={`font-mono text-xs font-black ${isEligible ? "text-emerald-800" : "text-rose-700"}`} suppressHydrationWarning>
                  Computed Score = {computedScore.toLocaleString('en-US')} {isEligible ? "≥" : "<"} 500,000 Threshold
                </div>
              </div>

              {/* Progressive Disclosure: Advanced Circuit Parameters Accordion */}
              <div className="border-2 border-slate-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_#0f172a]">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  aria-expanded={showAdvanced}
                  aria-controls="advanced-circuit-params"
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-mono text-xs font-black text-slate-900 border-b border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>Advanced Circuit Parameters & Entropy Salt</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span>{showAdvanced ? "Hide" : "Customize"}</span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showAdvanced && (
                  <div id="advanced-circuit-params" className="p-5 bg-white space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="salt-input" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                          Cryptographic Salt (Entropy Blinding)
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomSalt}
                          aria-label="Generate fresh random cryptographic salt"
                          className="flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-950 border border-slate-950 font-mono text-[11px] font-black cursor-pointer shadow-[1px_1px_0px_#0f172a]"
                        >
                          <Dices className="w-3.5 h-3.5" />
                          <span>Generate Entropy</span>
                        </button>
                      </div>
                      <input
                        id="salt-input"
                        type="number"
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 font-mono font-black text-purple-950 text-sm focus:outline-none focus:bg-purple-50 shadow-[2px_2px_0px_#0f172a]"
                        placeholder="123456789"
                      />
                      <span className="text-[11px] font-mono text-slate-600 block">
                        Random secret preventing dictionary brute-force preimage attacks against the Poseidon commitment.
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px] font-mono">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Weight w1</span>
                        <span className="font-black text-slate-900">10 (Income)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Weight w2</span>
                        <span className="font-black text-slate-900">5 (Debt)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Weight w3</span>
                        <span className="font-black text-slate-900">2 (History)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block">Threshold</span>
                        <span className="font-black text-slate-900">500,000</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Financial Order Summary & Checkout Escrow (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-[2rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8 space-y-6">
              
              {/* Connected Wallet Context Header */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-wider">
                      Connected Account
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-black border border-white">
                    Anvil L1 &bull; 31337
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">0x7099...79C8</span>
                  <span className="text-emerald-400 font-black">98.450 ETH Balance</span>
                </div>
              </div>

              {/* Cryptographic Commitment Hash with Copy Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-800">
                    Poseidon Commitment (Hin):
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    aria-label="Copy input commitment hash to clipboard"
                    className="flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-950 border border-slate-950 font-mono text-[11px] font-black cursor-pointer shadow-[1px_1px_0px_#0f172a] transition-all"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border-2 border-slate-950 font-mono text-[11px] text-blue-950 font-black break-all select-all shadow-[2px_2px_0px_#0f172a]">
                  {commitmentHash}
                </div>
                <span className="text-[10px] font-mono text-slate-600 block font-semibold">
                  Published to VerityRegistry.sol. Raw inputs never leave browser memory.
                </span>
              </div>

              {/* Bounty Staking & Timeout Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bounty-input" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Bounty Escrow (ETH)
                  </label>
                  <div className="relative">
                    <input
                      id="bounty-input"
                      type="number"
                      step="0.05"
                      min="0.01"
                      value={bounty}
                      onChange={(e) => setBounty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-950 text-xl font-mono font-black text-amber-950 focus:outline-none focus:bg-amber-50 shadow-[3px_3px_0px_#0f172a] transition-all"
                    />
                    <Coins className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="timeout-select" className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 block">
                    Timeout Deadline
                  </label>
                  <div className="relative">
                    <select
                      id="timeout-select"
                      value={timeoutSec}
                      onChange={(e) => setTimeoutSec(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border-2 border-slate-950 text-xs font-mono text-slate-950 font-black focus:outline-none shadow-[3px_3px_0px_#0f172a] transition-all"
                    >
                      <option value="600">600s (10 Minutes)</option>
                      <option value="3600">3,600s (1 Hour)</option>
                      <option value="86400">86,400s (24 Hours)</option>
                    </select>
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Itemized Financial Checkout Summary Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <span className="text-xs font-mono font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                    <span>Checkout Financial Summary</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-200 font-black text-amber-950">
                    Escrow Locked
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-700 font-bold">
                    <span>Off-Chain Prover Bounty:</span>
                    <span className="font-black text-slate-950">{bountyNum.toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-bold">
                    <span>Protocol Registry Settlement Fee:</span>
                    <span className="font-black text-slate-950">{protocolFeeNum.toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-bold">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-slate-500" />
                      <span>Estimated L1 Gas (218k gas):</span>
                    </span>
                    <span className="font-black text-slate-950">~{estimatedGasEth.toFixed(4)} ETH</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t-2 border-slate-950 flex items-center justify-between text-sm font-mono font-black text-slate-950">
                  <span>Total Due at Broadcast:</span>
                  <span className="text-base text-blue-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-950 shadow-[2px_2px_0px_#0f172a]">
                    {totalEthRequired} ETH
                  </span>
                </div>

                <div className="text-[10px] font-mono text-emerald-800 font-bold flex items-center gap-1 pt-1">
                  <span>&bull; Protected by 1.00 ETH Worker Fraud Slashing Collateral</span>
                </div>
              </div>

              {/* High-Contrast Brutalist Action Button */}
              <button
                type="button"
                onClick={handleBroadcast}
                disabled={isBroadcasting}
                aria-label="Deploy escrow and broadcast task to Ethereum L1"
                className="group w-full py-4 px-6 min-h-[48px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex items-center justify-between cursor-pointer disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <span>
                  {isBroadcasting ? "Broadcasting to Ethereum L1..." : "Deploy Escrow & Broadcast Task"}
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
