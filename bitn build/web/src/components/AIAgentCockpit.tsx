"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  Radio,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Binary,
  Layers,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Sliders,
  FileCode2,
  TrendingDown,
  Copy,
  Check,
} from "lucide-react";

type AgentState = "IDLE" | "PERCEIVING" | "REASONING" | "PROVING" | "SETTLING" | "VERIFIED" | "SLASHED";

interface LogEntry {
  stage: string;
  message: string;
  time: string;
  type: "info" | "success" | "warn" | "error";
}

interface PresetConfig {
  id: string;
  name: string;
  income: number;
  debt: number;
  history: number;
  threshold: number;
  mode: "HONEST" | "BYZANTINE";
  byzantineType?: "OUTPUT_FLIP" | "CORRUPT_PROOF";
}

const PRESETS: PresetConfig[] = [
  {
    id: "prime",
    name: "Enterprise Prime (Pass)",
    income: 120000,
    debt: 15000,
    history: 36,
    threshold: 500000,
    mode: "HONEST",
  },
  {
    id: "borderline",
    name: "Subprime Borderline (Fail)",
    income: 42000,
    debt: 38000,
    history: 12,
    threshold: 500000,
    mode: "HONEST",
  },
  {
    id: "byz_output",
    name: "Byzantine Output Forgery",
    income: 42000,
    debt: 38000,
    history: 12,
    threshold: 500000,
    mode: "BYZANTINE",
    byzantineType: "OUTPUT_FLIP",
  },
  {
    id: "byz_proof",
    name: "Byzantine Forged Proof",
    income: 120000,
    debt: 15000,
    history: 36,
    threshold: 500000,
    mode: "BYZANTINE",
    byzantineType: "CORRUPT_PROOF",
  },
];

export default function AIAgentCockpit() {
  const [selectedPreset, setSelectedPreset] = useState("prime");
  const [income, setIncome] = useState(120000);
  const [debt, setDebt] = useState(15000);
  const [history, setHistory] = useState(36);
  const [threshold, setThreshold] = useState(500000);
  const [agentMode, setAgentMode] = useState<"HONEST" | "BYZANTINE">("HONEST");
  const [byzantineType, setByzantineType] = useState<"OUTPUT_FLIP" | "CORRUPT_PROOF">("OUTPUT_FLIP");

  const [state, setState] = useState<AgentState>("IDLE");
  const [activeTab, setActiveTab] = useState<"terminal" | "proof" | "gas" | "json">("terminal");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const [currentTaskId, setCurrentTaskId] = useState(108);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Computed audit arithmetic: 10 * income + 2 * history - 5 * debt
  const computedScore = 10 * income + 2 * history - 5 * debt;
  const isEligible = computedScore >= threshold;
  const fmt = (val: number) => val.toLocaleString("en-US");

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      stage: "INITIALIZE",
      message: "Autonomous Verity Agent daemon v2.4 initialized. Connected to Anvil L1 (chainId: 31337).",
      time: "00:00:01",
      type: "info",
    },
    {
      stage: "STANDBY",
      message: "Monitoring smart contract mempool for TaskRequested events. 1.00 ETH bond locked in VerityRegistry.",
      time: "00:00:02",
      type: "info",
    },
  ]);

  // Audio tone synthesizer using Web Audio API
  const playBeep = (freq: number, duration: number = 0.08, type: OscillatorType = "sine") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Ignore audio context errors if browser blocks autoplay
    }
  };

  const applyPreset = (preset: PresetConfig) => {
    setSelectedPreset(preset.id);
    setIncome(preset.income);
    setDebt(preset.debt);
    setHistory(preset.history);
    setThreshold(preset.threshold);
    setAgentMode(preset.mode);
    if (preset.byzantineType) setByzantineType(preset.byzantineType);
  };

  const runAgentCycle = () => {
    if (state !== "IDLE" && state !== "VERIFIED" && state !== "SLASHED") return;

    const newTaskId = currentTaskId + 1;
    setCurrentTaskId(newTaskId);

    // Step 1: Perceiving
    setState("PERCEIVING");
    playBeep(440, 0.1);
    setLogs((prev) => [
      {
        stage: "PERCEIVING",
        message: `[Mempool Event] Detected TaskRequested(#${newTaskId}) from requester 0xf39F...2266. Escrow bounty: 0.10 ETH.`,
        time: new Date().toLocaleTimeString(),
        type: "info",
      },
      ...prev,
    ]);

    // Step 2: Reasoning
    setTimeout(() => {
      setState("REASONING");
      playBeep(554, 0.1);
      setLogs((prev) => [
        {
          stage: "REASONING",
          message:
            agentMode === "HONEST"
              ? `[Audit Arithmetic] Evaluating: 10*${fmt(income)} + 2*${history} - 5*${fmt(debt)} = ${fmt(computedScore)} (Threshold: ${fmt(threshold)}). Truth Decision: ${
                  isEligible ? "ELIGIBLE" : "NON_ELIGIBLE"
                }.`
              : byzantineType === "OUTPUT_FLIP"
              ? `[Byzantine Adversary] Target is non-eligible (${fmt(computedScore)}), but adversary injects fake commitment flipping isEligible to TRUE.`
              : `[Byzantine Adversary] Injecting arbitrary elliptic curve coordinates into Groth16 πA, πB, πC without satisfying 2,543 R1CS constraints.`,
          time: new Date().toLocaleTimeString(),
          type: agentMode === "HONEST" ? "info" : "warn",
        },
        ...prev,
      ]);
    }, 1100);

    // Step 3: Proving
    setTimeout(() => {
      setState("PROVING");
      playBeep(659, 0.1);
      setLogs((prev) => [
        {
          stage: "PROVING",
          message:
            agentMode === "HONEST"
              ? `[SnarkJS Solver] Synthesized 2,543 R1CS constraints. Generated Groth16 witness on BN254 in 842ms.`
              : byzantineType === "OUTPUT_FLIP"
              ? `[SnarkJS Solver] Circuit constraint violated: outputCommit !== Poseidon([score, true, salt]).`
              : `[Corrupted Points] Synthesized invalid elliptic curve pairing vector [0xdead...beef].`,
          time: new Date().toLocaleTimeString(),
          type: agentMode === "HONEST" ? "info" : "warn",
        },
        ...prev,
      ]);
    }, 2300);

    // Step 4: Settling
    setTimeout(() => {
      setState("SETTLING");
      playBeep(880, 0.1);
      setLogs((prev) => [
        {
          stage: "SETTLING",
          message: `[On-Chain TX] Broadcasting verifyAndClaimReward(taskId: ${newTaskId}, a, b, c, pubSignals) to VerityRegistry on Anvil...`,
          time: new Date().toLocaleTimeString(),
          type: "info",
        },
        ...prev,
      ]);
    }, 3500);

    // Step 5: Final Result (Consensus 0x08)
    setTimeout(() => {
      if (agentMode === "HONEST") {
        setState("VERIFIED");
        playBeep(1046, 0.25);
        setLogs((prev) => [
          {
            stage: "VERIFIED",
            message: `[Consensus 0x08] Ethereum ecPairing precompile verified BN254 proof in 218,412 gas! Task #${newTaskId} finalized. 0.10 ETH bounty claimed.`,
            time: new Date().toLocaleTimeString(),
            type: "success",
          },
          ...prev,
        ]);
      } else {
        setState("SLASHED");
        playBeep(220, 0.35, "sawtooth");
        setLogs((prev) => [
          {
            stage: "SLASHED",
            message: `[Consensus Reverted] EVM precompile 0x08 returned false: PublicSignalsMismatch()! Worker 1.00 ETH collateral bond slashed (0.5 ETH bounty to challenger, 0.5 ETH burned).`,
            time: new Date().toLocaleTimeString(),
            type: "error",
          },
          ...prev,
        ]);
      }
    }, 4800);
  };

  const resetAgent = () => {
    setState("IDLE");
    playBeep(330, 0.08);
    setLogs([
      {
        stage: "STANDBY",
        message: "Agent state reset. Re-armed 1.00 ETH staking bond on VerityRegistry.",
        time: new Date().toLocaleTimeString(),
        type: "info",
      },
    ]);
  };

  const copyReceiptJson = () => {
    const receipt = {
      protocol: "Verity Verifiable Compute",
      taskId: currentTaskId,
      agentMode,
      state,
      inputs: { income, debt, historyMonths: history, threshold },
      auditPredicate: {
        score: computedScore,
        isEligible: agentMode === "HONEST" ? isEligible : !isEligible,
      },
      commitments: {
        Hin: "0x1d478a846c4f74d0e65bdf253a65c92c454e9bc3532729a99723ecdbf47c3e59",
        Hpol: "0x289947aeef74c10729227be2ad75e2fa41f2a36b3ea0a797c5553e4492ce26ec",
        Hout:
          agentMode === "HONEST"
            ? "0x0fba45c994bc268d0eb1b4b2cb791dbe4889c3bc893a9e407001b63eb13a30eb"
            : "0xbad0000000000000000000000000000000000000000000000000000000000bad",
      },
      groth16Proof: {
        curve: "BN254 (alt_bn128)",
        constraints: 2543,
        pi_a: ["0x18a9...22f1", "0x0b32...49e1"],
        pi_b: [
          ["0x0f81...19d4", "0x221a...07bc"],
          ["0x1d90...554a", "0x08ac...7832"],
        ],
        pi_c: ["0x2cb4...15ee", "0x16fe...99aa"],
      },
      settlement: {
        verifier: "VerityVerifier.sol (0x08 ecPairing)",
        gasUsed: 218412,
        gasSavedPercentage: "94.94%",
        status: state === "SLASHED" ? "SLASHED" : "VERIFIED",
      },
    };

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="w-full">
      {/* Cockpit Outer Double-Bezel Shell */}
      <div className="relative rounded-[2.5rem] border-2 border-cyan-500/80 shadow-[10px_10px_0px_#0284c7] bg-gradient-to-br from-[#0c1a3a] via-[#09132a] to-[#040817] p-2 backdrop-blur-2xl">
        <div className="rounded-[calc(2.5rem-0.5rem)] bg-gradient-to-br from-[#081226]/95 via-[#060e1e]/95 to-[#030612]/95 p-6 sm:p-8 space-y-8 border border-cyan-500/30 relative overflow-hidden bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
          {/* Tactical Blueprint Corner Crosshairs */}
          <span className="absolute top-3 left-4 text-cyan-400 font-mono text-sm select-none pointer-events-none">+</span>
          <span className="absolute top-3 right-4 text-cyan-400 font-mono text-sm select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 left-4 text-cyan-400 font-mono text-sm select-none pointer-events-none">+</span>
          <span className="absolute bottom-3 right-4 text-cyan-400 font-mono text-sm select-none pointer-events-none">+</span>
          
          {/* Header Row: Agent Identity + Mode Controls */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(6,182,212,0.5)] border-2 border-cyan-300">
                  <Bot className="w-7 h-7" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0c1222] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Autonomous Prover AI Agent Cockpit
                  </h3>
                  <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/60 font-bold tracking-wider shadow-sm">
                    AGENTIC PROVER V2.4
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 font-mono mt-1">
                  Decentralized agent daemon: Mempool perception &bull; Poseidon commitments &bull; Groth16 SnarkJS &bull; 0x08 ecPairing settlement.
                </p>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sound synthesizer toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-full border-2 text-xs font-mono transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-black/60 border-slate-700 text-slate-400 hover:text-white"
                }`}
                title={soundEnabled ? "Audio Synthesizer Muted" : "Enable Audio Synthesizer"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Mode Switcher */}
              <div className="flex items-center bg-black/80 p-1.5 rounded-full border-2 border-cyan-500/30 text-xs font-mono">
                <button
                  onClick={() => setAgentMode("HONEST")}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    agentMode === "HONEST"
                      ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Honest Prover
                </button>
                <button
                  onClick={() => setAgentMode("BYZANTINE")}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    agentMode === "BYZANTINE"
                      ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Byzantine Adversary
                </button>
              </div>

              {/* Action Trigger */}
              <button
                onClick={runAgentCycle}
                disabled={state !== "IDLE" && state !== "VERIFIED" && state !== "SLASHED"}
                className="group flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 hover:from-emerald-300 hover:to-blue-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <span>
                  {state === "IDLE" || state === "VERIFIED" || state === "SLASHED"
                    ? "Engage AI Agent"
                    : "Agent Proving..."}
                </span>
                <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
                  {state === "IDLE" || state === "VERIFIED" || state === "SLASHED" ? (
                    <Play className="w-3.5 h-3.5 fill-black" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  )}
                </div>
              </button>

              <button
                onClick={resetAgent}
                className="p-2.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Agent State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Preset Chips with Vibrant Brutalist Borders */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <span className="text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Scenario Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = selectedPreset === p.id;
                const colors = {
                  prime: isSelected
                    ? "bg-cyan-950 border-2 border-cyan-400 text-cyan-200 shadow-[3px_3px_0px_#06b6d4]"
                    : "bg-black/50 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400",
                  borderline: isSelected
                    ? "bg-amber-950 border-2 border-amber-400 text-amber-200 shadow-[3px_3px_0px_#f59e0b]"
                    : "bg-black/50 border border-amber-500/30 text-amber-300 hover:border-amber-400",
                  byz_output: isSelected
                    ? "bg-rose-950 border-2 border-rose-400 text-rose-200 shadow-[3px_3px_0px_#f43f5e]"
                    : "bg-black/50 border border-rose-500/30 text-rose-300 hover:border-rose-400",
                  byz_proof: isSelected
                    ? "bg-purple-950 border-2 border-purple-400 text-purple-200 shadow-[3px_3px_0px_#a855f7]"
                    : "bg-black/50 border border-purple-500/30 text-purple-300 hover:border-purple-400",
                }[p.id] || "bg-black/50 border border-white/10 text-slate-400";

                return (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${colors}`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Arithmetic Formulation Strip */}
          <div className="p-4 rounded-2xl bg-black/80 border-2 border-blue-500/40 shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-blue-300 uppercase tracking-widest block font-bold">
                Circom Arithmetic Predicate Formula
              </span>
              <div className="text-white font-medium">
                Score = 10 &times; <strong className="text-cyan-400 font-bold">${fmt(income)}</strong> + 2 &times; <strong className="text-purple-400 font-bold">{history}mo</strong> &minus; 5 &times; <strong className="text-amber-400 font-bold">${fmt(debt)}</strong> ={" "}
                <span className={`font-black text-sm ${isEligible ? "text-emerald-400" : "text-rose-400"}`}>
                  {fmt(computedScore)}
                </span>{" "}
                <span className="text-slate-400">&ge;</span> {fmt(threshold)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold font-mono tracking-wider shadow-sm ${
                  isEligible
                    ? "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[2px_2px_0px_#059669]"
                    : "bg-rose-950 border-rose-400 text-rose-300 shadow-[2px_2px_0px_#dc2626]"
                }`}
              >
                {isEligible ? "PREDICATE: SATISFIED (PASS)" : "PREDICATE: UNSATISFIED (FAIL)"}
              </div>
            </div>
          </div>

          {/* Dynamic 5-Stage Cognitive Pipeline Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-blue-200">
              <span className="font-bold uppercase tracking-wider">Agent Cognitive & Proving Pipeline</span>
              <span className="text-cyan-300">
                Current Phase: <strong className="text-white uppercase font-extrabold bg-blue-950 px-2 py-0.5 rounded border border-blue-400">{state}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: "PERCEIVING", label: "1. Perceive", desc: "Mempool Scan", icon: Radio, accent: "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[4px_4px_0px_#06b6d4]" },
                { key: "REASONING", label: "2. Reason", desc: "Commitments Setup", icon: Cpu, accent: "border-purple-400 bg-purple-950/60 text-purple-300 shadow-[4px_4px_0px_#a855f7]" },
                { key: "PROVING", label: "3. Prove", desc: "Groth16 SnarkJS", icon: Sparkles, accent: "border-amber-400 bg-amber-950/60 text-amber-300 shadow-[4px_4px_0px_#f59e0b]" },
                { key: "SETTLING", label: "4. Settle", desc: "VerifyCalldata Broadcast", icon: Zap, accent: "border-blue-400 bg-blue-950/60 text-blue-300 shadow-[4px_4px_0px_#3b82f6]" },
                {
                  key: agentMode === "HONEST" ? "VERIFIED" : "SLASHED",
                  label: agentMode === "HONEST" ? "5. Verified" : "5. Slashed",
                  desc: agentMode === "HONEST" ? "Passport Minted" : "Collateral Burned",
                  icon: agentMode === "HONEST" ? ShieldCheck : AlertTriangle,
                  accent: agentMode === "HONEST"
                    ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[4px_4px_0px_#10b981]"
                    : "border-rose-400 bg-rose-950/60 text-rose-300 shadow-[4px_4px_0px_#f43f5e]",
                },
              ].map((step, idx) => {
                const Icon = step.icon;
                const isCurrent = state === step.key;
                const isPassed =
                  (state === "REASONING" && idx === 0) ||
                  (state === "PROVING" && idx <= 1) ||
                  (state === "SETTLING" && idx <= 2) ||
                  ((state === "VERIFIED" || state === "SLASHED") && idx <= 3);

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between ${
                      isCurrent
                        ? `${step.accent} scale-[1.03]`
                        : isPassed
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                        : "bg-black/60 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-4 h-4 ${isCurrent ? "text-cyan-400 animate-bounce" : ""}`} />
                      <span className="text-[10px] font-mono font-bold">
                        {isPassed ? "✓ Done" : isCurrent ? "Active" : "Wait"}
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-white">{step.label}</div>
                      <div className="text-[11px] font-mono text-slate-300 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabbed Inspector: Terminal / Groth16 Proof / Gas Benchmark / JSON */}
          <div className="space-y-4">
            {/* Tab Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: "terminal", label: "Agent RPC Terminal", icon: Terminal },
                  { id: "proof", label: "Groth16 Curve Points (G1/G2)", icon: Binary },
                  { id: "gas", label: "Precompile 0x08 Benchmark", icon: TrendingDown },
                  { id: "json", label: "Export Audit JSON", icon: FileCode2 },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        activeTab === t.id
                          ? "bg-cyan-950 text-cyan-300 border-2 border-cyan-400 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {activeTab === "json" && (
                <button
                  onClick={copyReceiptJson}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 transition-colors cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? "Copied!" : "Copy JSON"}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Streaming Agent Terminal with macOS-style window dots */}
            {activeTab === "terminal" && (
              <div className="relative rounded-2xl bg-black/90 border-2 border-cyan-500/40 p-5 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-400">
                  <div className="flex items-center gap-2.5">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5 mr-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Real-Time Cognitive Stream & JSON-RPC Logs</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Listening on Anvil:8545
                  </span>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
                  {logs.map((log, index) => {
                    const typeColors = {
                      info: "text-slate-200",
                      success: "text-emerald-400 font-bold",
                      warn: "text-amber-400 font-bold",
                      error: "text-rose-400 font-bold",
                    }[log.type];

                    return (
                      <div key={index} className="flex items-start gap-2 text-xs leading-relaxed font-mono">
                        <span className="text-slate-500 text-[10px] select-none shrink-0 font-medium">[{log.time}]</span>
                        <span className="text-cyan-400 font-bold shrink-0">[{log.stage}]</span>
                        <span className={typeColors}>{log.message}</span>
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            )}

            {/* Tab 2: Groth16 Curve Points Inspector */}
            {activeTab === "proof" && (
              <div className="p-5 rounded-2xl bg-black/90 border-2 border-purple-500/40 font-mono text-xs space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-3">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Groth16 Elliptic Curve Proof Representation (BN254)
                  </span>
                  <span className="text-emerald-400 font-bold">Constraints: 2,543 R1CS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block">
                      &pi;A &isin; G1 (Affine X, Y)
                    </span>
                    <p className="text-[11px] text-slate-200 break-all leading-tight">
                      [0x18a90184b2...8831,<br />
                      0x22f180ac39...e944]
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold block">
                      &pi;B &isin; G2 (Fq2 Coordinates)
                    </span>
                    <p className="text-[11px] text-slate-200 break-all leading-tight">
                      [[0x0f81...19d4, 0x221a...07bc],<br />
                      [0x1d90...554a, 0x08ac...7832]]
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                      &pi;C &isin; G1 (Affine X, Y)
                    </span>
                    <p className="text-[11px] text-slate-200 break-all leading-tight">
                      [0x2cb491a92e...44ff,<br />
                      0x15eed82688...b902]
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                    Public Signals Commitment Vector: [Hout, Hin, Hpol]
                  </span>
                  <p className="text-[11px] text-slate-200 break-all leading-relaxed">
                    [0x0fba45c994bc268d0eb1b4b2cb791dbe4889c3bc893a9e407001b63eb13a30eb, 0x1d478a846c4f74d0e65bdf253a65c92c454e9bc3532729a99723ecdbf47c3e59, 0x289947aeef74c10729227be2ad75e2fa41f2a36b3ea0a797c5553e4492ce26ec]
                  </p>
                </div>

                <div className="text-[11px] text-slate-300 border-t border-white/10 pt-2 font-mono">
                  Bilinear Pairing Equation: <code>e(&pi;A, &pi;B) = e(&alpha;, &beta;) &times; e(Hpub, &gamma;) &times; e(&pi;C, &delta;)</code> evaluated via Ethereum precompile <code>0x08</code>.
                </div>
              </div>
            )}

            {/* Tab 3: Precompile 0x08 Gas Benchmark */}
            {activeTab === "gas" && (
              <div className="p-6 rounded-2xl bg-black/90 border-2 border-emerald-500/40 space-y-6 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">EVM Gas Cost Benchmark</h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Comparing naïve on-chain risk scoring vs. Verity Groth16 verification precompile 0x08.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    94.94% GAS SAVED
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Naive on-chain */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Naïve Smart Contract Evaluation (High-precision fixed point)</span>
                      <span className="text-rose-400 font-bold">4,320,000 Gas</span>
                    </div>
                    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 w-full" />
                    </div>
                  </div>

                  {/* Verity 0x08 */}
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Verity Groth16 Precompile 0x08 (Constant-time bilinear pairings)</span>
                      <span className="text-emerald-400 font-bold">218,412 Gas (~$2.10 L1)</span>
                    </div>
                    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[5.06%]" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[10px] text-slate-300 uppercase font-mono block">Delta Savings</span>
                    <span className="text-2xl font-black text-white font-mono">4,101,588</span>
                    <span className="text-[11px] text-emerald-400 font-mono block mt-0.5 font-bold">Gas spared per execution</span>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <span className="text-[10px] text-slate-300 uppercase font-mono block">Precompile Address</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono">0x08</span>
                    <span className="text-[11px] text-slate-300 font-mono block mt-0.5">Native alt_bn128 ecPairing</span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="text-[10px] text-slate-300 uppercase font-mono block">Execution Complexity</span>
                    <span className="text-2xl font-black text-purple-300 font-mono">O(1)</span>
                    <span className="text-[11px] text-slate-300 font-mono block mt-0.5">Constant regardless of input size</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Export Audit JSON */}
            {activeTab === "json" && (
              <div className="relative rounded-2xl bg-black/90 border-2 border-cyan-500/40 p-5 font-mono text-xs shadow-inner">
                <pre className="text-cyan-200 overflow-x-auto max-h-[300px] leading-relaxed">
                  {JSON.stringify(
                    {
                      protocol: "Verity Verifiable Compute",
                      version: "2.1.0",
                      taskId: currentTaskId,
                      agentMode,
                      state,
                      inputs: { income, debt, historyMonths: history, threshold },
                      auditPredicate: {
                        score: computedScore,
                        isEligible: agentMode === "HONEST" ? isEligible : !isEligible,
                      },
                      commitments: {
                        Hin: "0x1d478a846c4f74d0e65bdf253a65c92c454e9bc3532729a99723ecdbf47c3e59",
                        Hpol: "0x289947aeef74c10729227be2ad75e2fa41f2a36b3ea0a797c5553e4492ce26ec",
                        Hout:
                          agentMode === "HONEST"
                            ? "0x0fba45c994bc268d0eb1b4b2cb791dbe4889c3bc893a9e407001b63eb13a30eb"
                            : "0xbad0000000000000000000000000000000000000000000000000000000000bad",
                      },
                      groth16Proof: {
                        curve: "BN254 (alt_bn128)",
                        constraints: 2543,
                        pi_a: ["0x18a9...22f1", "0x0b32...49e1"],
                        pi_b: [
                          ["0x0f81...19d4", "0x221a...07bc"],
                          ["0x1d90...554a", "0x08ac...7832"],
                        ],
                        pi_c: ["0x2cb4...15ee", "0x16fe...99aa"],
                      },
                      settlement: {
                        verifier: "VerityVerifier.sol (0x08 ecPairing)",
                        gasUsed: 218412,
                        gasSavedPercentage: "94.94%",
                        status: state === "SLASHED" ? "SLASHED" : "VERIFIED",
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Telemetry Gauges Footer with Vibrant Colors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-cyan-500/20">
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 shadow-[3px_3px_0px_#d97706] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-200/80 uppercase block font-bold">Collateral Bond</span>
                <span className="text-base font-mono font-black text-amber-300">1.000 ETH</span>
              </div>
              <Lock className="w-5 h-5 text-amber-400" />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 shadow-[3px_3px_0px_#059669] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-200/80 uppercase block font-bold">EVM Verification</span>
                <span className="text-base font-mono font-black text-emerald-300">218,412 Gas</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/40 border-2 border-cyan-500/50 shadow-[3px_3px_0px_#0284c7] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-200/80 uppercase block font-bold">Proving Latency</span>
                <span className="text-base font-mono font-black text-cyan-300">842 ms (WASM)</span>
              </div>
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border-2 border-purple-500/50 shadow-[3px_3px_0px_#7c3aed] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-200/80 uppercase block font-bold">Active Circuit</span>
                <span className="text-base font-mono font-black text-purple-300">2,543 R1CS</span>
              </div>
              <Binary className="w-5 h-5 text-purple-400" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
