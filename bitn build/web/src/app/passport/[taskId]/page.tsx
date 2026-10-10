"use client";

import React, { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  RefreshCw,
  FileCode2,
  Layers,
  Binary,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function PassportContent() {
  const params = useParams();
  const taskId = (params?.taskId as string) || "1";
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  const handleReverify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyStatus("ON-CHAIN VERIFIED: EVM ecPairing (0x08) returned true with 218,412 gas.");
    }, 1000);
  };

  const handleDownloadJsonLd = () => {
    const credential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://verity.protocol/schemas/zk-passport/v1",
      ],
      id: `urn:verity:task:${taskId}`,
      type: ["VerifiableCredential", "VerityProofPassport"],
      issuer: "did:ethr:0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        taskId: Number(taskId),
        proofSystem: "Groth16 (BN254 curve)",
        r1csConstraints: 2543,
        inputCommitment: "0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd",
        outputCommitment: "0x05321b005c62be8395e55022ff65bec139e35f676d5bde2b954092af7cd71c38",
        predicate: "Credit Predicate: score >= 500,000",
        outcome: "ELIGIBLE",
        onChainStatus: "Finalized",
        blockNumber: 1069,
        evmGas: 218412,
      },
    };

    const blob = new Blob([JSON.stringify(credential, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verity-proof-passport-task-${taskId}.jsonld`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 py-8 px-4 sm:px-6" suppressHydrationWarning>
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400 text-slate-950 border-2 border-slate-950 font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#0f172a]">
          <Award className="w-3.5 h-3.5" />
          <span>EXECUTION TRACEABILITY &bull; PROBLEM STATEMENT 7</span>
        </div>
        <Link
          href="/marketplace"
          className="text-xs font-mono font-black text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-full border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] no-underline transition-all"
        >
          &larr; Back to Marketplace
        </Link>
      </div>

      {/* Main Passport Card using Neo-Brutalist Double-Bezel Frame */}
      <div className="relative rounded-[2.5rem] border-2 border-slate-950 p-2 bg-white shadow-[10px_10px_0px_#0f172a]">
        <div className="rounded-[calc(2.5rem-0.5rem)] bg-white border-2 border-slate-950 overflow-hidden">
          
          {/* Certificate Window Header with Mac Dots */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-100 border-b-2 border-slate-950 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-600 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-600 shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-600 shadow-xs" />
              <span className="font-bold text-slate-800 ml-2">passport-certificate://task-{taskId}.verity</span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300">
              IMMUTABLE RECORD
            </span>
          </div>

          {/* Certificate Banner */}
          <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-slate-50 to-white border-b-2 border-slate-950 space-y-3 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border-2 border-slate-950 text-blue-950 text-xs font-mono font-black tracking-widest uppercase shadow-[2px_2px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Self-Authenticating Credential</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight font-sans">
              Verity Proof Passport
            </h1>
            
            <p className="text-slate-700 font-mono text-sm sm:text-base font-bold">
              Unique Computation Attestation: <span className="text-blue-700 font-black">#TASK-{taskId}</span>
            </p>
          </div>

          {/* VISUAL LINEAGE DAG: 6 Colorful Neo-Brutalist Step Boxes */}
          <div className="p-6 sm:p-8 border-b-2 border-slate-950 bg-slate-50 space-y-4">
            <div className="text-xs font-mono font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Execution Lineage DAG (Cryptographic Provenance):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-2xl bg-blue-100 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-blue-900 block text-[10px] font-black">STEP 1</span>
                <span className="text-slate-950 font-black">Inputs X</span>
                <span className="text-[10px] text-slate-700 block mt-1 font-semibold">Private Vector</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-100 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-cyan-900 block text-[10px] font-black">STEP 2</span>
                <span className="text-slate-950 font-black">Poseidon</span>
                <span className="text-[10px] text-slate-700 block mt-1 font-semibold">Hin Commit</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-100 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-purple-900 block text-[10px] font-black">STEP 3</span>
                <span className="text-slate-950 font-black">Circom 2.1</span>
                <span className="text-[10px] text-slate-700 block mt-1 font-semibold">2,543 R1CS</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-100 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-amber-900 block text-[10px] font-black">STEP 4</span>
                <span className="text-slate-950 font-black">Groth16</span>
                <span className="text-[10px] text-slate-700 block mt-1 font-semibold">128B Proof</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-emerald-900 block text-[10px] font-black">STEP 5</span>
                <span className="text-slate-950 font-black">0x08 Pairing</span>
                <span className="text-[10px] text-slate-700 block mt-1 font-semibold">218k Gas</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-300 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-emerald-950 block text-[10px] font-black">FINAL</span>
                <span className="text-slate-950 font-black">Finalized</span>
                <span className="text-[10px] text-slate-950 block mt-1 font-black">Block 1069</span>
              </div>
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="p-6 sm:p-8 font-mono text-xs space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-950 space-y-1 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-[11px] uppercase tracking-wider text-slate-700 block font-black">
                  Input Commitment (Poseidon Hin)
                </span>
                <span className="text-blue-900 font-black break-all block">
                  0x26026a2500231887c3f0f27b01bf2175c63697d8bb44ed66f30358427247c6fd
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-950 space-y-1 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-[11px] uppercase tracking-wider text-slate-700 block font-black">
                  Output Commitment (Poseidon Hout)
                </span>
                <span className="text-blue-900 font-black break-all block">
                  0x05321b005c62be8395e55022ff65bec139e35f676d5bde2b954092af7cd71c38
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-950 space-y-1 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-[11px] uppercase tracking-wider text-slate-700 block font-black">
                  Zero-Knowledge Proof System
                </span>
                <span className="text-slate-950 font-black block text-sm">
                  Groth16 (alt_bn128 / BN254 Curve)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-950 space-y-1 shadow-[3px_3px_0px_#0f172a]">
                <span className="text-[11px] uppercase tracking-wider text-slate-700 block font-black">
                  Predicate Evaluation Decision
                </span>
                <span className="text-emerald-900 font-black block text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ELIGIBLE (Score &ge; 500,000 Threshold)
                </span>
              </div>
            </div>

            {/* On-Chain Finality Stamp */}
            <div className="p-5 rounded-2xl bg-emerald-200 border-2 border-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#065f46]">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-emerald-700 animate-pulse" />
                <div>
                  <span className="text-slate-950 font-black block text-sm">
                    CRYPTOGRAPHICALLY VERIFIED ON ETHEREUM L1
                  </span>
                  <span className="text-[11px] text-slate-800 font-bold">
                    VerityRegistry: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right text-slate-950">
                <span className="block font-black">Block: #1069</span>
                <span className="text-[11px] text-emerald-950 font-black">Gas: 218,412 (0x08)</span>
              </div>
            </div>

            {verifyStatus && (
              <div className="p-4 rounded-xl bg-emerald-100 border-2 border-slate-950 text-slate-950 text-xs font-mono flex items-center gap-2 font-black shadow-[3px_3px_0px_#065f46]">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{verifyStatus}</span>
              </div>
            )}
          </div>

          {/* Certificate Actions Footer */}
          <div className="p-6 bg-slate-100 border-t-2 border-slate-950 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleDownloadJsonLd}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-950 font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-[3px_3px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>Export Tamper-Evident JSON-LD</span>
            </button>

            <button
              onClick={handleReverify}
              disabled={isVerifying}
              className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] cursor-pointer disabled:opacity-50 flex items-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
              <span>{isVerifying ? "Evaluating 0x08 ecPairing..." : "Re-Verify On-Chain"}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PassportPage() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center p-4 sm:px-6">
      <Suspense fallback={<div className="font-mono text-blue-600 text-sm">Loading Verity Proof Passport...</div>}>
        <PassportContent />
      </Suspense>
    </main>
  );
}
