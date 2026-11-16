"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Smooth scrolling for the Fable template. Lenis eases the real scroll position
 * (nothing is transformed), so position: sticky and fixed keep working, and
 * ScrollTrigger reads the same value on GSAP's own ticker.
 */
let lenis: Lenis | null = null;

/** Resolves once the opening curtain has lifted, so entrances never play under it. */
let done: () => void = () => {};
let lifted = false;
export const ready: Promise<void> = typeof window === "undefined" ? Promise.resolve() : new Promise((r) => (done = r));
export const isReady = () => lifted;
export function markReady() {
  lifted = true;
  done();
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
export const lockScroll = (on: boolean) => (on ? lenis?.stop() : lenis?.start());

export function Shell() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      requestAnimationFrame(() => scrollToId(hash));
    } else {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
