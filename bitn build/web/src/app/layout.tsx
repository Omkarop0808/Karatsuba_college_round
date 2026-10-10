import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import VerityAgentHUD from "@/components/VerityAgentHUD";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verity | Decentralized Verifiable Computation Platform",
  description: "Prove the computation, not just the result. Trustless cryptographic verification for smart contracts on Ethereum using Circom 2.1 & Groth16 pairings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${sansFont.variable} ${monoFont.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  function cleanAttr(el) {
                    if (!el || !el.attributes) return;
                    for (var i = el.attributes.length - 1; i >= 0; i--) {
                      var n = el.attributes[i].name;
                      if (n.indexOf('rtrvr') !== -1 || n.indexOf('data-rtrvr') !== -1) {
                        el.removeAttribute(n);
                      }
                    }
                  }
                  var obs = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes') {
                        cleanAttr(m.target);
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          var node = m.addedNodes[j];
                          if (node.nodeType === 1) {
                            cleanAttr(node);
                            var descendants = node.getElementsByTagName('*');
                            for (var k = 0; k < descendants.length; k++) {
                              cleanAttr(descendants[k]);
                            }
                          }
                        }
                      }
                    }
                  });
                  obs.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-slate-900 font-sans" suppressHydrationWarning>
        <Suspense fallback={<div className="h-20 w-full border-b-2 border-slate-950 bg-white" />}>
          <Navbar />
        </Suspense>
        <div className="flex-1 w-full" suppressHydrationWarning>{children}</div>
        <VerityAgentHUD />
        <footer className="w-full border-t-2 border-slate-950 bg-white py-8 text-center text-xs text-slate-800 font-mono font-bold shadow-[0_-4px_0px_rgba(15,23,42,0.04)]" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              VERITY PROTOCOL &bull; BITNBUILD 2026 &bull; BN254 GROTH16 &bull; EVM PRECOMPILE 0x08
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-black">
              <a href="/request" className="hover:text-blue-600 no-underline">Request</a>
              <a href="/marketplace" className="hover:text-purple-600 no-underline">Marketplace</a>
              <a href="/worker" className="hover:text-amber-600 no-underline">Worker</a>
              <a href="/chaos" className="hover:text-rose-600 no-underline">Chaos Lab</a>
              <a href="/passport/1" className="hover:text-emerald-600 no-underline">Passport</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
