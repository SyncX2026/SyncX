"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function useGsapReveal(
  triggerRef: React.RefObject<HTMLElement | null>,
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    start?: string;
  } = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    delay = 0,
    duration = 0.8,
    y = 30,
    stagger = 0,
    start = "top 85%",
  } = options;

  useEffect(() => {
    if (!triggerRef.current) return;

    const el = triggerRef.current;
    if (prefersReducedMotion) {
      gsap.set(el, {
        clearProps: "transform,filter",
        opacity: 1,
      });
      return;
    }

    const tween = gsap.fromTo(
      el,
      {
        opacity: 0,
        y: y,
        filter: "blur(5px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: start,
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [triggerRef, prefersReducedMotion, delay, duration, y, stagger, start]);
}
