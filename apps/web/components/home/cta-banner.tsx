"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(contentRef, { delay: 0.4 });

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 text-center">
        <div ref={contentRef} className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            {CONTENT.home.cta.title}
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            {CONTENT.home.cta.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/workflow"
              className={cn(buttonVariants({ variant: "binance", size: "lg" }), "gap-2")}
            >
              {CONTENT.home.cta.primaryCta}
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
              {CONTENT.home.cta.secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
