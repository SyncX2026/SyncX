"use client";

import { useSyncExternalStore } from "react";

export function usePrefersReducedMotion() {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  const getSnapshot = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
