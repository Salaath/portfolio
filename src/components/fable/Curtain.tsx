"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markReady } from "./Shell";

/** Opening curtain: a short count, then the page is revealed from the bottom up. Once per full load. */
export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const q = gsap.utils.selector(el);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { display: "none" });
        markReady();
        return;
      }
      const n = { v: 0 };
      const num = q("[data-n]")[0];
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q("[data-up]"), { yPercent: 110, duration: 0.9, stagger: 0.06 })
        .to(n, { v: 100, duration: 0.9, ease: "power2.inOut", onUpdate: () => { num.textContent = String(Math.round(n.v)).padStart(3, "0"); } }, 0)
        .to(q("[data-bar]"), { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0)
        .to(q("[data-up]"), { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 }, 0.95)
        .add(markReady, 1.35)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, 1.2)
        .set(el, { display: "none" });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="fixed inset-0 z-[200] flex flex-col justify-between bg-[#08080a] p-4 text-[#f2f1ed] sm:p-10" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
      <div className="label flex justify-between overflow-hidden !text-white/50">
        <span data-up className="block">Salaath Shaikh</span>
        <span data-up className="block">Portfolio — 2026</span>
      </div>
      <div>
        <div className="flex items-end justify-between overflow-hidden">
          <span data-up className="block text-[9vw] leading-[0.9] tracking-[-0.04em] md:text-[5vw]">Loading the work</span>
          <span data-up data-n className="block font-mono text-sm tabular-nums text-white/60">000</span>
        </div>
        <div className="mt-6 h-px bg-white/15">
          <div data-bar className="h-full origin-left scale-x-0 bg-[#a78bfa]" />
        </div>
      </div>
    </div>
  );
}
