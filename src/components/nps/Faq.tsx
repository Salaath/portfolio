"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Habitline-style accordion: one open at a time, height eases open, the + turns into ×. */
export function Faq({ items }: { items: [string, string][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", ref.current);
      panels.forEach((p, i) => {
        gsap.to(p, {
          height: i === open ? "auto" : 0,
          autoAlpha: i === open ? 1 : 0,
          duration: 0.7,
          ease: "expo.out",
          onComplete: () => {
            window.dispatchEvent(new Event("resize"));
          },
        });
      });
    },
    { scope: ref, dependencies: [open] },
  );

  return (
    <div ref={ref} className="flex flex-col gap-3">
      {items.map(([q, a], i) => (
        <div key={q} className="rounded-2xl bg-white px-6 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={() => setOpen(i === open ? -1 : i)}
            className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold tracking-[-0.02em]"
            aria-expanded={i === open}
          >
            {q}
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-bg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: i === open ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>
          <div data-panel className="h-0 overflow-hidden opacity-0">
            <p className="max-w-2xl pb-6 text-muted">{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
