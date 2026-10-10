"use client";

import React from "react";

interface VerityLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function VerityLogo({
  size = 40,
  className = "",
  showText = false,
}: VerityLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Cryptographic Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 group"
        style={{ width: size, height: size }}
      >
        {/* Ambient Backlight Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-purple-500/20 to-emerald-500/20 blur-md group-hover:blur-lg transition-all" />

        {/* Outer Machined Bezel Frame */}
        <div className="relative w-full h-full rounded-2xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-white/0 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-[#080e1c] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4/5 h-4/5"
            >
              <defs>
                <linearGradient id="verityCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="verityEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="verityGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Hexagonal Cryptographic Ring Boundary */}
              <polygon
                points="50,6 88,28 88,72 50,94 12,72 12,28"
                stroke="url(#verityCyanGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
              />

              {/* Inner Bilinear Pairing Torus Loop */}
              <circle
                cx="50"
                cy="50"
                r="30"
                stroke="url(#verityEmeraldGrad)"
                strokeWidth="2"
                strokeDasharray="4 6"
                className="opacity-60 animate-[spin_12s_linear_infinite]"
                style={{ transformOrigin: "50% 50%" }}
              />

              {/* Central Geometric 'V' Monogram + Sigma Summation */}
              <path
                d="M26 32 L50 74 L74 32"
                stroke="url(#verityCyanGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#verityGlow)"
              />

              {/* Horizontal Cryptographic Binding Bar */}
              <line
                x1="36"
                y1="46"
                x2="64"
                y2="46"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* Center Zero-Knowledge Point Dot */}
              <circle
                cx="50"
                cy="50"
                r="4.5"
                fill="#06b6d4"
                className="animate-ping"
                style={{ transformOrigin: "50% 50%" }}
              />
              <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white font-sans">
              VERITY
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-bold tracking-wider">
              BN254 &bull; 0x08
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono tracking-tight">
            Decentralized Verifiable Compute
          </span>
        </div>
      )}
    </div>
  );
}
