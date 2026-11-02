"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { finishIntro, introPlayed } from "@/lib/intro";

/**
 * First-load curtain on the home page: the name decodes, a counter runs to
 * 100, then the ink sheet wipes upward and hands over to the hero. Every
 * other entry point (and every later visit to "/") skips straight past it.
 */
export function Preloader() {
  const pathname = usePathname();
  const [show] = useState(() => pathname === "/" && !introPlayed());
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!show) {
        finishIntro();
        return;
      }
      const root = ref.current!;
      const q = gsap.utils.selector(root);
      const html = document.documentElement;
      html.classList.add("is-loading");
      const done = () => {
        html.classList.remove("is-loading");
        gsap.set(root, { display: "none" });
      };

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK }, (ctx) => {
        if (!(ctx.conditions as { motion: boolean }).motion) {
          gsap.to(root, { autoAlpha: 0, duration: 0.4, onStart: finishIntro, onComplete: done });
          return;
        }

        const count = { v: 0 };
        const [counter] = q("[data-count]");
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q("[data-meta]"), { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.8 })
          .to(q("[data-name]"), {
            duration: 1.3,
            scrambleText: { text: "Salaath Shaikh", chars: "upperAndLowerCase", speed: 0.6, revealDelay: 0.3 },
            ease: "none",
          }, 0.1)
          .to(count, {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              counter.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          }, 0)
          .fromTo(q("[data-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
          .to(q("[data-out]"), { yPercent: -110, duration: 0.8, ease: "expo.in", stagger: 0.04 }, ">-0.05")
          .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, ">-0.15")
          .call(finishIntro, [], "<0.35")
          .call(done);
      });
      return () => html.classList.remove("is-loading");
    },
    { scope: ref },
  );

  if (!show) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-4 text-bg sm:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex justify-between font-mono text-xs uppercase tracking-[0.14em] opacity-60">
        <span className="overflow-hidden"><span data-meta data-out className="block">Portfolio — 2026</span></span>
        <span className="overflow-hidden"><span data-meta data-out className="block">Mumbai, IN</span></span>
      </div>
      <div className="overflow-hidden text-center">
        <span data-name data-out className="block text-2xl font-medium tracking-tight sm:text-3xl">&nbsp;</span>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <span className="overflow-hidden"><span data-meta data-out className="block font-mono text-xs uppercase tracking-[0.14em] opacity-60">Loading the work</span></span>
          <span className="overflow-hidden">
            <span data-count data-out className="block text-[18vw] font-semibold leading-[0.8] tracking-[-0.05em] tabular-nums sm:text-[11vw]">000</span>
          </span>
        </div>
        <div className="mt-6 h-px bg-bg/20">
          <div data-bar className="h-full origin-left bg-bg" />
        </div>
      </div>
    </div>
  );
}
