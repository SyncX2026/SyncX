"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { CONTENT } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";

export function PlatformsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGsapReveal(titleRef, { delay: 0.2 });
  useGsapReveal(subtitleRef, { delay: 0.4 });

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden bg-zinc-950/50">
      <div className="container mx-auto px-4 text-center">
        <SectionHeading
          eyebrow="Platforms"
          title={CONTENT.platforms.hero.title}
          description={CONTENT.platforms.hero.subtitle}
          align="center"
          className="mb-16"
        />
      </div>
    </section>
  );
}
