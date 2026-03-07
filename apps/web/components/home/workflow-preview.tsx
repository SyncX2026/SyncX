"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Settings, Key, Stethoscope, Send } from "lucide-react";

export function WorkflowPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(stepsRef, { delay: 0.4, stagger: 0.2 });

  const icons = [Settings, Key, Stethoscope, Send];

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Workflow"
          title={CONTENT.home.workflowPreview.title}
          align="center"
          className="mb-16"
        />

        <div ref={stepsRef} className="grid md:grid-cols-4 gap-8 relative">
          {CONTENT.home.workflowPreview.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 z-10 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-zinc-900/80 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-zinc-500 group-hover:text-primary transition-colors" />
                </div>
                
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-zinc-800 -z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 w-1/2 h-full animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-zinc-200 mb-2 group-hover:text-white transition-colors">
                  {step}
                </h3>
                <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                  Step 0{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
