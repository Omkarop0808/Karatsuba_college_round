"use client";

import React, { useState } from "react";
import {
  FileCode2,
  Cpu,
  Binary,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  TrendingDown,
  Layers,
  Terminal,
} from "lucide-react";

interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  color: "cyan" | "purple" | "emerald" | "amber" | "rose";
  icon: React.ElementType;
  badge: string;
  description: string;
  details: {
    label: string;
    value: string;
  }[];
  codeSnippet?: string;
}

const pipelineSteps: PipelineStep[] = [
  {
    id: 1,
    title: "1. Computation Request",
    subtitle: "Privacy-Preserving Commitment",
    category: "Client Side",
    color: "cyan",
    icon: FileCode2,
    badge: "Poseidon Hash",
    description:
      "The client securely hashes private credentials (monthly income, total debt, credit history) into Poseidon commitments. The raw financial inputs never touch the blockchain or public mempool.",
    details: [
      { label: "Public Input Commitment", value: "0x28f7...a19c" },
      { label: "Policy Model Hash", value: "0x19a0...44fe" },
      { label: "Off-Chain Reward Escrow", value: "0.05 ETH" },
    ],
    codeSnippet: `// Poseidon hash commitment
const inputCommit = poseidon([income, debt, historyMonths, salt]);
const policyHash = poseidon([w1, w2, w3, threshold]);
await verityRegistry.createTask(inputCommit, policyHash, { value: reward });`,
  },
  {
    id: 2,
    title: "2. Worker Pickup & Staking",
    subtitle: "Collateralized Execution",
    category: "Worker Network",
    color: "amber",
    icon: Lock,
    badge: "1.0 ETH Bond",
    description:
      "A decentralized worker node claims the task by locking 1.0 ETH collateral in escrow. If the worker behaves maliciously or attempts Byzantine collusion, their bond is slashed immediately.",
    details: [
      { label: "Worker Node Address", value: "0x7099...79C8" },
      { label: "Locked Collateral", value: "1.000 ETH" },
      { label: "Execution Timeout", value: "3,600 Seconds" },
    ],
    codeSnippet: `// Worker claims task with bond
await verityRegistry.claimTask(taskId, {
  value: ethers.parseEther("1.0") // Slashing Bond
});`,
  },
  {
    id: 3,
    title: "3. ZK Proof Synthesis",
    subtitle: "Circom 2.1 & Groth16 SnarkJS",
    category: "Proving Engine",
    color: "purple",
    icon: Cpu,
    badge: "2,543 Constraints",
    description:
      "The worker executes the complex credit scoring predicate within the compute_audit.circom arithmetic circuit. Groth16 generates a succinct 128-byte proof using the BN254 elliptic curve.",
    details: [
      { label: "R1CS Constraint Count", value: "2,543 Non-linear" },
      { label: "Proving Time", value: "842 ms (WASM)" },
      { label: "Proof Size", value: "128 Bytes (A, B, C Points)" },
    ],
    codeSnippet: `// Circom Groth16 Proving
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  circuitInput,
  "compute_audit_js/compute_audit.wasm",
  "circuit_final.zkey"
);`,
  },
  {
    id: 4,
    title: "4. On-Chain Verification",
    subtitle: "EVM Precompile 0x08 Pairing",
    category: "Ethereum Consensus",
    color: "emerald",
    icon: ShieldCheck,
    badge: "218,412 Gas",
    description:
      "The smart contract invokes the Ethereum alt_bn128 pairing engine at precompile 0x08. It verifies the bilinear pairing e(A, B) = e(alpha, beta) * e(C, delta) in constant time.",
    details: [
      { label: "Off-Chain Gas Needed", value: "~4,320,000 Gas" },
      { label: "ZK Verification Cost", value: "218,412 Gas" },
      { label: "Gas Reduction", value: "94.9% Savings" },
    ],
    codeSnippet: `// On-chain precompile verification
bool valid = verifier.verifyProof(a, b, c, publicSignals);
require(valid, "Invalid ZK Proof: Slashed");
task.status = TaskStatus.Verified;`,
  },
  {
    id: 5,
    title: "5. Verifiable Passport",
    subtitle: "Tamper-Proof State Attestation",
    category: "Trust Layer",
    color: "cyan",
    icon: Award,
    badge: "NFT / Soulbound",
    description:
      "An immutable computation passport is minted to the client. Third-party DeFi protocols, DAOs, and lending markets can query the result trustlessly without re-executing any computations.",
    details: [
      { label: "Audit Attestation ID", value: "PASSPORT-#000042" },
      { label: "Audit Status", value: "Cryptographically Approved" },
      { label: "Verification Timestamp", value: "Block #19482012" },
    ],
    codeSnippet: `// Downstream dApp trust query
(bool verified, bytes32 outputCommit) = verityRegistry.getPassport(taskId);
if (verified) {
  grantUncollateralizedLoan(client, outputCommit);
}`,
  },
];

export default function InteractivePipeline() {
  const [activeStepId, setActiveStepId] = useState<number>(3);
  const activeStep = pipelineSteps.find((s) => s.id === activeStepId) || pipelineSteps[0];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border-2 border-slate-950 text-blue-950 font-mono text-xs tracking-wider uppercase mb-3 font-black shadow-[2px_2px_0px_#0f172a]">
          <Layers className="w-3.5 h-3.5 text-blue-700" />
          <span>End-to-End Cryptographic Flow</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          How Verity Eliminates{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 whitespace-nowrap">
            Execution Trust
          </span>
        </h2>
        <p className="mt-3 text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto">
          Click any step to inspect the cryptographic parameters, zero-knowledge arithmetic constraints, and gas economics.
        </p>
      </div>

      {/* Step Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {pipelineSteps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === activeStepId;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`relative p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-2 cursor-pointer ${
                isActive
                  ? "border-2 border-slate-950 bg-white text-slate-950 shadow-[4px_4px_0px_#0f172a]"
                  : "border border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">{step.category}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {step.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 scale-110" : "text-slate-500"}`} />
                <span className="text-xs font-bold font-mono tracking-tight text-slate-900">{step.title.split(". ")[1]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Double-Bezel Interactive Detail Inspection Card */}
      <div className="relative rounded-[2rem] border-2 border-slate-950 p-2 bg-white shadow-[8px_8px_0px_#0f172a]">
        <div className="rounded-[calc(2rem-0.5rem)] bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8 border border-slate-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Info Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                  {React.createElement(activeStep.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-700 uppercase tracking-widest font-bold">{activeStep.category}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs font-mono text-slate-500">{activeStep.subtitle}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5">{activeStep.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {activeStep.description}
              </p>

              {/* Parameter Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeStep.details.map((detail, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col">
                    <span className="text-[11px] font-mono text-slate-500">{detail.label}</span>
                    <span className="text-sm font-mono font-bold text-slate-900 mt-1">{detail.value}</span>
                  </div>
                ))}
              </div>

              {/* Economic Advantage Highlight (Gas Savings) */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-emerald-900 font-bold uppercase tracking-wider">Gas Delta Benchmark</div>
                    <div className="text-xs text-emerald-800 mt-0.5">Off-Chain 4.3M gas ➔ On-Chain 218K gas (95% saved)</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-extrabold text-emerald-700">-$74.20</span>
                  <div className="text-[10px] font-mono text-emerald-600 font-semibold">Per Audit Run</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Code / Proof Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 px-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verity Cryptographic Payload</span>
                </div>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Syntax Verified
                </span>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
                <pre className="text-slate-200 leading-relaxed font-mono">
                  <code>{activeStep.codeSnippet}</code>
                </pre>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-2 font-medium">
                <span>Curve: alt_bn128 (BN254)</span>
                <span>Proof Protocol: Groth16</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
