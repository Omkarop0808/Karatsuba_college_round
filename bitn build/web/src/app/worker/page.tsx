"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Radio,
  Zap,
  Coins,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function WorkerConsolePage() {
  const [logs, setLogs] = useState<string[]>([
    "[$] Booting Verity Zero-Knowledge Off-Chain Worker Daemon (v1.0.0)...",
    "[$] Loading Circom 2.1.6 R1CS constraint matrix & WASM calculator...",
    "[$] Connecting to Ethereum JSON-RPC provider at ws://127.0.0.1:8545...",
    "[$] Worker Wallet loaded: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "[$] Verifying stake: 1.00 ETH confirmed in VerityRegistry.sol (Tx: 0xb3076ef...)",
    "[$] SUCCESS: Listening for TaskRequested events on 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "[$] Awaiting computational workload from smart contract...",
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [taskCount, setTaskCount] = useState(1);

  const simulateLiveTask = () => {
    if (isRunning) return;
    setIsRunning(true);

    const nextId = taskCount + 1;
    setTaskCount(nextId);

    setLogs((prev) => [
      ...prev,
      "",
      `[EVENT] ⚡ TaskRequested detected! ID: #${nextId} (Bounty: 0.1 ETH)`,
      `[INPUTS] Private: { income: $100,000, debt: $5,000, history: 24mo, salt: 123456789 }`,
      `[HASH] Computing Poseidon input commitment: 0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd`,
      `[COMPUTE] Executing credit predicate in WASM runtime...`,
      `[SCORE] Calculated Score = 975,048 >= 500,000 => ELIGIBLE (1)`,
      `[WITNESS] Witness vector generated in 256 ms (2,543 R1CS constraints)`,
      `[PROVER] Generating Groth16 Zero-Knowledge Proof (BN254 curve)...`,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[PROVER] ✅ Proof generated in 842 ms! ProofPoints { pi_a: 2, pi_b: 4, pi_c: 2 }`,
        `[ETH] Calling VerityRegistry.submitResult(taskId: ${nextId}, outputCommit, proofPoints, signals)...`,
        `[TX] Transaction Broadcast: 0x18937c1a623ab16e4fd0d7975930f4a42f5dec21c57843ddc55251ab5765dcd0`,
        `[EVM] Gas Consumed: 218,412 gas (Precompile 0x08 validated pairing!)`,
        `[STATE] Task #${nextId} status updated to SUBMITTED. 3600s dispute challenge window active.`,
        `[WORKER] Resuming event listener on block 1070...`,
      ]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <main className="w-full min-h-screen py-12 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-950">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 border-2 border-slate-950 font-mono text-xs font-black tracking-wider uppercase mb-3 shadow-[3px_3px_0px_#0f172a]">
              <Cpu className="w-3.5 h-3.5" />
              <span>PROVER SUBSYSTEM &bull; PROBLEM STATEMENT 1 & 2</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans">
              Worker Node Telemetry
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
              Autonomous TypeScript prover daemon watching Ethereum events and compiling SnarkJS Groth16 proofs.
            </p>
          </div>
          <button
            onClick={simulateLiveTask}
            disabled={isRunning}
            className="group flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] cursor-pointer disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span>{isRunning ? "Synthesizing Proof..." : "Simulate Task Execution"}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              {isRunning ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-white" />
              )}
            </div>
          </button>
        </div>

        {/* 4 Colorful Neo-Brutalist Status Ribbon Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border-2 border-slate-950 p-5 bg-emerald-100 shadow-[4px_4px_0px_#065f46] flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase text-emerald-950 block font-black">Node Status</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-lg font-mono font-black text-emerald-950">ONLINE</span>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-950 p-5 bg-cyan-100 shadow-[4px_4px_0px_#0284c7] flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase text-cyan-950 block font-black">Worker Wallet</span>
            <span className="text-sm font-mono font-black text-cyan-950 mt-2 block truncate">
              0x709979...79C8
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-950 p-5 bg-amber-100 shadow-[4px_4px_0px_#78350f] flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase text-amber-950 block font-black">Locked Collateral</span>
            <span className="text-lg font-mono font-black text-amber-950 mt-2 block">
              1.000 ETH
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-950 p-5 bg-purple-100 shadow-[4px_4px_0px_#581c87] flex flex-col justify-between">
            <span className="text-[11px] font-mono uppercase text-purple-950 block font-black">Proving Engine</span>
            <span className="text-lg font-mono font-black text-purple-950 mt-2 block">
              BN254 Groth16
            </span>
          </div>
        </div>

        {/* Live Terminal Console using Brutalist Window Frame */}
        <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-slate-950 shadow-[8px_8px_0px_#0f172a]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-slate-950 p-6 sm:p-8 space-y-4">
            
            {/* Terminal Window Header Bar (macOS style dots) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-600 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-600 shadow-xs" />
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>zsh &bull; verity-prover-daemon.service</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PID #714 (worker/src/index.ts)</span>
              </div>
            </div>

            <div className="font-mono text-xs space-y-1.5 max-h-[460px] overflow-y-auto pr-2 text-slate-300 leading-relaxed">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.includes("✅") || log.includes("SUCCESS")
                      ? "text-emerald-400 font-bold"
                      : log.includes("⚡") || log.includes("EVENT")
                      ? "text-cyan-300 font-bold"
                      : log.includes("PROVER") || log.includes("SCORE")
                      ? "text-purple-300"
                      : log.includes("TX") || log.includes("ETH")
                      ? "text-amber-300"
                      : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
