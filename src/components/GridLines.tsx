"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { introDone } from "@/lib/intro";

/**
 * Fixed column grid behind every page, the drafting sheet the layout sits on.
 * Six columns on desktop, two on mobile. Lines drop in once the intro lifts.
 */
export function GridLines() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-gridline]", ref.current);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(lines, { scaleY: 0 });
        introDone.then(() =>
          gsap.to(lines, { scaleY: 1, duration: 1.8, ease: "expo.inOut", stagger: 0.06, delay: 0.2 }),
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 px-4 sm:px-10">
      <div className="grid h-full grid-cols-2 md:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            data-gridline
            className={`h-full origin-top border-l border-[var(--grid)] last:border-r ${i > 1 ? "hidden md:block" : ""} ${i === 1 ? "max-md:border-r" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
