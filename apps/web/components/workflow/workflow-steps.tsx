"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { Settings, Key, Stethoscope, Send } from "lucide-react";

export function WorkflowSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(stepsRef, { delay: 0.4, stagger: 0.2 });

  const icons = [Settings, Key, Stethoscope, Send];

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div ref={stepsRef} className="max-w-4xl mx-auto space-y-16">
          {CONTENT.workflow.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="relative flex flex-col md:flex-row gap-8 items-start group">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-10 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-zinc-900/80 group-hover:scale-110">
                    <Icon className="w-8 h-8 text-zinc-500 group-hover:text-primary transition-colors" />
                  </div>
                  {i < CONTENT.workflow.steps.length - 1 && (
                    <div className="w-px h-full bg-zinc-800 absolute top-16 left-8 -z-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 w-full h-1/2 animate-shimmer-vertical opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                      Step {step.id}
                    </span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 font-mono text-sm text-zinc-300 group-hover:border-zinc-700 transition-colors">
                    <span className="text-primary mr-2">$</span>
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
