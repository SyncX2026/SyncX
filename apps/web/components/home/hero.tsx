"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useGsapReveal(titleRef, { delay: 0.2 });
  useGsapReveal(subtitleRef, { delay: 0.4 });
  useGsapReveal(ctaRef, { delay: 0.6 });
  useGsapReveal(terminalRef, { delay: 0.8, y: 50 });

  return (
    <section ref={containerRef} className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8 max-w-2xl">
          <div className="flex items-center gap-4">
             <div className="relative w-12 h-12">
               <Image 
                 src="/syncx-pixel-icon.png" 
                 alt="SyncX Logo" 
                 fill 
                 sizes="48px"
                 className="object-contain pixelated" 
               />
             </div>
             <div className="flex items-center gap-2 text-primary font-pixel text-xs uppercase tracking-wider">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {CONTENT.home.hero.eyebrow}
             </div>
          </div>
          
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            {CONTENT.home.hero.title}
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-xl text-zinc-400 leading-relaxed max-w-xl"
          >
            {CONTENT.home.hero.subtitle}
          </p>
          
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Link
              href="/workflow"
              className={cn(buttonVariants({ variant: "binance", size: "lg" }), "gap-2")}
            >
              {CONTENT.home.hero.primaryCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/commands"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              )}
            >
              <Terminal className="w-4 h-4" />
              {CONTENT.home.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div ref={terminalRef} className="relative z-10 lg:ml-auto w-full max-w-lg">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-50" />
          
          <TerminalWindow title="sync-x" className="relative bg-[#0c0c0e]/90 backdrop-blur-xl border-zinc-800/50">
            <div className="flex flex-col gap-4 font-mono text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 border-b border-zinc-800/50 bg-zinc-900/20 rounded-lg mb-2">
                {Object.entries(CONTENT.home.hero.terminal.status).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-zinc-500 capitalize">{key.replace('_', ' ')}</span>
                    <StatusPill 
                      status={
                        value === 'ready' ? 'success' : 
                        value === 'alternate' ? 'warning' : 
                        value === 'optional' ? 'neutral' : 'default'
                      }
                    >
                      {value}
                    </StatusPill>
                  </div>
                ))}
              </div>
              
              <div className="space-y-1 text-zinc-400">
                {CONTENT.home.hero.terminal.output.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 select-none">{i + 1}</span>
                    <span className={line.includes("[SUCCESS]") ? "text-emerald-400" : line.includes("[DONE]") ? "text-primary" : ""}>
                      {line}
                    </span>
                  </div>
                ))}
                <div className="animate-pulse text-primary">_</div>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
