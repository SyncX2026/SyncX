"use client";

import { useRef, useState } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Button } from "@/components/ui/button";

export function CommandTabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(CONTENT.commands.tabs[0].id);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(terminalRef, { delay: 0.4, y: 50 });

  const activeCommand = CONTENT.commands.tabs.find((tab) => tab.id === activeTab);

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950/30 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CONTENT.commands.tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "binance" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="min-w-[120px]"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div ref={terminalRef} className="relative z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-50" />
          
          <TerminalWindow
            title={activeCommand?.cmd || "bash"}
            className="relative bg-[#0c0c0e]/90 backdrop-blur-xl border-zinc-800/50 min-h-[400px]"
          >
            <div className="flex flex-col gap-4 font-mono text-xs md:text-sm p-4">
              <div className="text-zinc-400 select-none">
                <span className="text-emerald-400 mr-2">$</span>
                {activeCommand?.cmd}
              </div>
              
              <div className="space-y-1 text-zinc-400 mt-4">
                {activeCommand?.output.map((line, i) => (
                  <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className={line.includes("[SUCCESS]") || line.includes("[OK]") ? "text-emerald-400" : line.includes("[INFO]") ? "text-blue-400" : ""}>
                      {line}
                    </span>
                  </div>
                ))}
                <div className="animate-pulse text-primary mt-2">_</div>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
