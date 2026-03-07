"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function WorkflowDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useGsapReveal(containerRef, { delay: 0.2 });
  useGsapReveal(detailsRef, { delay: 0.4, stagger: 0.2 });

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Details"
          title="Workflow Details"
          description={CONTENT.workflow.supporting.defaults}
          align="center"
          className="mb-16"
        />

        <div ref={detailsRef} className="grid md:grid-cols-2 gap-8">
          {Object.entries(CONTENT.workflow.supporting).map(([key, value]) => (
            <Card key={key} className="bg-zinc-900/40 border-zinc-800/60 backdrop-blur-sm hover:border-primary/20 hover:bg-zinc-900/60 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <CheckCircle className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors capitalize">
                    {key.replace(/_/g, " ")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {value}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
