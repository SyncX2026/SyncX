"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CommandPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const commandsRef = useRef<HTMLDivElement>(null);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(commandsRef, { delay: 0.4, stagger: 0.2 });

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Commands"
          title={CONTENT.home.commandPreview.title}
          align="center"
          className="mb-16"
        />

        <div ref={commandsRef} className="max-w-4xl mx-auto space-y-8">
          {CONTENT.home.commandPreview.commands.map((cmd, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-mono">{cmd.desc}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  </div>
                </div>
                <code className="block font-mono text-sm md:text-base text-emerald-400 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-nowrap">
                  {cmd.cmd}
                </code>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-12">
            <Link
              href="/commands"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              )}
            >
              {CONTENT.home.commandPreview.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
