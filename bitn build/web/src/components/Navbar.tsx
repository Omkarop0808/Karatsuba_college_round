"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCode2,
  LayoutGrid,
  Cpu,
  Flame,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Menu,
  X,
  Radio,
} from "lucide-react";
import VerityLogo from "@/components/VerityLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Request", href: "/request", icon: FileCode2, color: "text-cyan-400" },
    { label: "Marketplace", href: "/marketplace", icon: LayoutGrid, color: "text-purple-400" },
    { label: "Worker", href: "/worker", icon: Cpu, color: "text-amber-400" },
    { label: "Chaos Lab", href: "/chaos", icon: Flame, color: "text-rose-400" },
    { label: "Passport", href: "/passport/1", icon: ShieldCheck, color: "text-emerald-400" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-950 bg-white/95 backdrop-blur-2xl shadow-[0_4px_0px_rgba(15,23,42,0.06)]" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between" suppressHydrationWarning>
        
        {/* Brand with VerityLogo Emblem */}
        <Link href="/" className="flex items-center gap-3.5 no-underline group">
          <VerityLogo size={42} showText={true} />
        </Link>

        {/* Desktop Nav Items with Neo-Brutalist Capsule */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a]">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide transition-all no-underline ${
              pathname === "/"
                ? "bg-slate-950 text-white shadow-[2px_2px_0px_#0f172a]"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            Overview
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            // Dynamic colorful active brutalist style per tab
            let activeStyle = "bg-slate-950 text-white shadow-[2px_2px_0px_#0f172a]";
            if (isActive) {
              if (item.href === "/request") activeStyle = "bg-cyan-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]";
              if (item.href === "/marketplace") activeStyle = "bg-purple-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]";
              if (item.href === "/worker") activeStyle = "bg-amber-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]";
              if (item.href === "/chaos") activeStyle = "bg-rose-500 text-white border border-slate-950 shadow-[2px_2px_0px_#0f172a]";
              if (item.href.startsWith("/passport")) activeStyle = "bg-emerald-400 text-slate-950 border border-slate-950 shadow-[2px_2px_0px_#0f172a]";
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide transition-all no-underline ${
                  isActive
                    ? activeStyle
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : item.color.replace("400", "600")}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live Node Telemetry Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border-2 border-slate-950 text-emerald-950 text-xs font-mono font-black shadow-[3px_3px_0px_#0f172a]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-700" />
            <span>Anvil : 8545</span>
          </div>

          {/* High-Contrast Brutalist CTA Button */}
          <Link
            href="/request"
            className="group flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 border-slate-950 shadow-[4px_4px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0f172a] active:translate-x-1 active:translate-y-1 active:shadow-none no-underline"
          >
            <span>Launch Task</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-slate-100 border-2 border-slate-950 text-slate-900 shadow-[3px_3px_0px_#0f172a] cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-6 py-6 flex flex-col gap-3 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl font-mono text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 no-underline font-semibold"
          >
            Overview
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-mono text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 no-underline font-semibold"
              >
                <Icon className={`w-4 h-4 ${item.color.replace("400", "600")}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
            <Link
              href="/request"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-center text-sm uppercase tracking-wider no-underline shadow-md"
            >
              Launch Computation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
