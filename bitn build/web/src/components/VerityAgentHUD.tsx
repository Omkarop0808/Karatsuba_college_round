"use client";

import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Terminal,
  ShieldCheck,
  Cpu,
  Zap,
  Code2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

interface Message {
  sender: "user" | "agent";
  text: string;
  code?: string;
  time: string;
}

const quickQueries = [
  { label: "Why 0x08 ecPairing?", query: "How does the Ethereum 0x08 precompile verify BN254 Groth16 proofs?" },
  { label: "Poseidon vs SHA-256", query: "Why use Poseidon hash commitments instead of SHA-256?" },
  { label: "2,543 R1CS Constraints", query: "What does the compute_audit.circom arithmetic circuit enforce?" },
  { label: "1.0 ETH Slashing Rule", query: "How does VerityDisputeManager slash fraudulent workers?" },
];

export default function VerityAgentHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "agent",
      text: "Hello! I am the Verity Autonomous Cryptographic Agent. I orchestrate zero-knowledge proving pipelines and Ethereum consensus verifications. Ask me anything or select a prompt below:",
      time: "Just now",
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulate Agent Reasoning & Response
    setTimeout(() => {
      let responseText = "";
      let responseCode = "";

      if (q.includes("0x08") || q.includes("precompile") || q.includes("pairing")) {
        responseText =
          "The Ethereum 0x08 precompile evaluates the bilinear pairing check e(A, B) = e(alpha, beta) * e(C, delta) on the alt_bn128 curve in constant time. Instead of repeating 4,320,000 gas of mathematical computation, Ethereum verifies the Groth16 proof in just 218,412 gas!";
        responseCode = `// contracts/src/VerityVerifier.sol
(bool success, bytes memory result) = address(0x08).staticcall(inputData);
require(success && result[31] == 1, "Invalid ZK Pairing");`;
      } else if (q.includes("Poseidon") || q.includes("SHA-256") || q.includes("hash")) {
        responseText =
          "Standard SHA-256 requires ~25,000 R1CS constraints per 64-byte block due to 32-bit bitwise rotation logic. Poseidon is an algebraic S-box hash designed over the scalar field Fr, requiring only ~240 constraints (~90% reduction)!";
        responseCode = `// circuits/compute_audit.circom
component hasher = Poseidon(4);
hasher.inputs[0] <== income;
hasher.inputs[1] <== debt;
hasher.inputs[2] <== historyMonths;
hasher.inputs[3] <== salt;
inputCommit === hasher.out;`;
      } else if (q.includes("2,543") || q.includes("circuit") || q.includes("compute_audit")) {
        responseText =
          "compute_audit.circom enforces the credit predicate: score = 10*income + 2*historyMonths - 5*debt >= threshold. It integrates Num2Bits(64) bit-range decomposition to prevent finite-field wrap-around attacks, generating exactly 2,543 R1CS non-linear constraints.";
        responseCode = `// Bounded arithmetic guard against field overflow
component n2bScore = Num2Bits(64);
n2bScore.in <== score;
component comp = GreaterEqThan(64);
comp.in[0] <== score;
comp.in[1] <== threshold;
isEligible <== comp.out;`;
      } else if (q.includes("Slash") || q.includes("1.0") || q.includes("Dispute")) {
        responseText =
          "Every worker node must lock 1.00 ETH collateral in VerityRegistry.sol before claiming a task. If the worker submits a forged output or corrupted proof points, the transaction reverts or the dispute window triggers slashing: 50% is rewarded to the challenger and 50% is burned.";
        responseCode = `// contracts/src/VerityDisputeManager.sol
uint256 slashAmount = registry.slashWorker(taskId, worker);
payable(challenger).transfer(slashAmount / 2); // 0.5 ETH reward
payable(address(0)).transfer(slashAmount / 2); // 0.5 ETH burned`;
      } else {
        responseText = `I analyzed your query: "${q}". The Verity protocol utilizes Circom 2.1, Groth16 pairings on BN254, and Ethereum smart contract escrow on Anvil L1 to deliver 100% mathematically verifiable compute with 95% gas savings.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: responseText,
          code: responseCode,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 pl-4 pr-3 py-3 rounded-full bg-[#0a1122]/90 hover:bg-[#0f1a33] border border-cyan-500/40 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Verity Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-cyan-300">Ask Cryptographic Engine</div>
          </div>
        </button>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div className="relative w-[380px] sm:w-[420px] max-h-[580px] rounded-[2rem] border border-cyan-500/30 p-1.5 bg-black/60 backdrop-blur-3xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c1222] border border-white/5 flex flex-col h-[540px] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0a1122] to-[#121c35] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                    Verity Prover Copilot
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Autonomous ZK Agent Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.sender === "user"
                        ? "bg-cyan-500 text-black font-semibold rounded-br-xs"
                        : "bg-[#070b16] border border-white/10 text-slate-200 rounded-bl-xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    {m.code && (
                      <div className="mt-2 p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] text-cyan-300 font-mono overflow-x-auto">
                        <pre><code>{m.code}</code></pre>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-600 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Chips */}
            <div className="px-3 py-2 bg-[#080d1a] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.query)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-[10px] font-mono text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#0a101f] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about circuits, precompiles, proofs..."
                className="flex-1 px-3 py-2 rounded-full bg-[#050811] border border-white/10 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
