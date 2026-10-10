"use client";

import React, { useState } from "react";
import Link from "next/link";
import { decodeRevert } from "@/lib/revert-decoder";
import {
  Flame,
  Bug,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  Radio,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Binary,
} from "lucide-react";

export default function ChaosLabPage() {
  const [revertLogs, setRevertLogs] = useState<any[]>([
    {
      vector: "VECTOR α: OUTPUT FORGERY (BIT-FLIP)",
      error: "revert PublicSignalsMismatch() [0x7fd9d54e]",
      reason: "Public signal 1 in proof (0x05321b...) does not match claimed output commitment (0xdeadbeef...).",
      action: "Transaction reverted on-chain. Worker collateral preserved, result rejected.",
      color: "#e11d48",
      time: "Baseline Self-Test",
    },
  ]);

  const [activeVector, setActiveVector] = useState<string | null>(null);
  const [defenseStatus, setDefenseStatus] = useState("ALL PROTOCOL DEFENSES ACTIVE (100%)");

  const fireAttack = (type: string, artificialError: string, name: string) => {
    setActiveVector(type);
    setDefenseStatus("INTERCEPTING MALICIOUS PAYLOAD...");

    setTimeout(() => {
      const decoded = decodeRevert(artificialError);
      if (decoded) {
        setRevertLogs((prev) => [
          {
            ...decoded,
            time: new Date().toLocaleTimeString("en-US"),
          },
          ...prev,
        ]);
        setDefenseStatus("ATTACK MITIGATED &bull; REVERT DECODED (100%)");
      }
      setActiveVector(null);
    }, 700);
  };

  return (
    <main className="w-full min-h-screen py-12 px-4 sm:px-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-950">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500 text-white border-2 border-slate-950 font-mono text-xs font-black tracking-wider uppercase mb-3 shadow-[3px_3px_0px_#0f172a]">
              <Flame className="w-3.5 h-3.5" />
              <span>ADVERSARIAL TESTING &bull; PROBLEM STATEMENT 6</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight font-sans flex items-center gap-3">
              The Verity Chaos Lab
              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-rose-300 text-slate-950 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]">
                LIVE THREAT MATRIX
              </span>
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
              Launch simulated Byzantine attacks against the Verity settlement pipeline. Every corrupted proof coordinate, bit-flipped hash, or fraudulent challenger stake is mathematically intercepted on EVM.
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-emerald-300 border-2 border-slate-950 text-slate-950 font-mono text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#0f172a]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping" />
            <span dangerouslySetInnerHTML={{ __html: defenseStatus }} />
          </div>
        </div>

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: 4 Attack Vectors (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 flex items-center justify-between px-1">
              <span>Select Threat Vector to Execute:</span>
              <span className="text-rose-700 font-black">4 Attacks Available</span>
            </div>

            {/* Vector Alpha */}
            <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-rose-100 shadow-[6px_6px_0px_#9f1239] transition-all">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 border-2 border-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black tracking-wider text-slate-950 bg-rose-300 px-3 py-1 rounded-full border border-slate-950">
                    VECTOR &alpha; &bull; OUTPUT BIT-FLIP
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">Target: signals[1]</span>
                </div>
                <h3 className="text-lg font-black text-slate-950">Output Forgery (Bit-Flip Mutation)</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Worker generates honest proof but alters bits in the claimed output commitment to fake credit approval.
                </p>
                <button
                  onClick={() => fireAttack("alpha", "PublicSignalsMismatch()", "Output Forgery")}
                  disabled={activeVector !== null}
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {activeVector === "alpha" ? "Injecting Attack..." : "Fire Vector \u03b1 Attack \u2192"}
                </button>
              </div>
            </div>

            {/* Vector Beta */}
            <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-amber-100 shadow-[6px_6px_0px_#78350f] transition-all">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 border-2 border-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black tracking-wider text-slate-950 bg-amber-300 px-3 py-1 rounded-full border border-slate-950">
                    VECTOR &beta; &bull; FAKE PROOF POINTS
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">Target: 0x08 ecPairing</span>
                </div>
                <h3 className="text-lg font-black text-slate-950">Synthetic Fake Proof (Bypass Groth16)</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Worker submits random elliptic curve coordinates (A, B, C) attempting to trick the smart contract without running circuit.
                </p>
                <button
                  onClick={() => fireAttack("beta", "InvalidProof()", "Synthetic Fake Proof")}
                  disabled={activeVector !== null}
                  className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {activeVector === "beta" ? "Injecting Attack..." : "Fire Vector \u03b2 Attack \u2192"}
                </button>
              </div>
            </div>

            {/* Vector Gamma */}
            <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-purple-100 shadow-[6px_6px_0px_#581c87] transition-all">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 border-2 border-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black tracking-wider text-slate-950 bg-purple-300 px-3 py-1 rounded-full border border-slate-950">
                    VECTOR &gamma; &bull; INPUT SUBSTITUTION
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">Target: signals[0]</span>
                </div>
                <h3 className="text-lg font-black text-slate-950">Corrupted Input Substitution</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Worker executes circuit with a different, unauthorized dataset than committed by requester.
                </p>
                <button
                  onClick={() => fireAttack("gamma", "InputHashMismatch()", "Corrupted Input")}
                  disabled={activeVector !== null}
                  className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {activeVector === "gamma" ? "Injecting Attack..." : "Fire Vector \u03b3 Attack \u2192"}
                </button>
              </div>
            </div>

            {/* Vector Delta */}
            <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-cyan-100 shadow-[6px_6px_0px_#0284c7] transition-all">
              <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 border-2 border-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black tracking-wider text-slate-950 bg-cyan-300 px-3 py-1 rounded-full border border-slate-950">
                    VECTOR &delta; &bull; DISPUTE GRIEFING
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">Target: VerityDisputeManager</span>
                </div>
                <h3 className="text-lg font-black text-slate-950">Frivolous Dispute Challenge (Griefing)</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  Malicious challenger stakes collateral disputing a verified result. Smart contract re-verifies proof and slashes challenger.
                </p>
                <button
                  onClick={() => fireAttack("delta", "ChallengerSlashed", "Frivolous Challenge")}
                  disabled={activeVector !== null}
                  className="w-full py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] disabled:opacity-50 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {activeVector === "delta" ? "Injecting Attack..." : "Fire Vector \u03b4 Attack \u2192"}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: Live Telemetry & Interceptor Logs (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Defensive Scorecard */}
            <div className="rounded-2xl border-2 border-slate-950 p-6 bg-emerald-100 shadow-[6px_6px_0px_#065f46] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-950 block font-black">
                  Defensive Reliability Metric
                </span>
                <span className="text-3xl font-black font-mono text-emerald-950">
                  100% INTERCEPTED
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono uppercase text-emerald-950 block font-black">
                  Verification Mechanism
                </span>
                <span className="text-xs font-mono text-blue-900 font-black">
                  Deterministic EVM Revert
                </span>
              </div>
            </div>

            {/* Intercept Logs with Mac Window Style Header */}
            <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-slate-950 shadow-[8px_8px_0px_#0f172a]">
              <div className="rounded-[calc(2rem-0.375rem)] bg-slate-950 p-6 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-600 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-600 shadow-xs" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-rose-400" />
                      Live Contract Intercept Telemetry
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-black">
                    {revertLogs.length} Events Logged
                  </span>
                </div>

                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                  {revertLogs.map((log, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 font-mono text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] tracking-wider text-rose-400">
                          {log.vector}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {log.time || "Just now"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-black break-all">
                        &bull; {log.error}
                      </div>

                      <div className="text-slate-300 text-[11px]">
                        <span className="text-slate-400 block font-bold">Root Cause:</span>
                        {log.reason}
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-cyan-300 font-bold text-[11px]">
                        &rarr; {log.action}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
