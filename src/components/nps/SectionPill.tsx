"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { scrollToId } from "../Smoother";

/**
 * Floating pill nav for the page's sections (Habitline's centred menu), docked
 * at the bottom. A highlight glides to whichever section is on screen. It is
 * portalled to <body> because fixed elements can't live inside the smoother.
 */
export function SectionPill({ items }: { items: [string, string][] }) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const hl = useRef<HTMLSpanElement>(null);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      if (!mounted) return;
      const el = ref.current!;
      gsap.set(el, { yPercent: 200, xPercent: -50 });
      const show = ScrollTrigger.create({
        start: () => window.innerHeight * 0.9,
        end: "max",
        onToggle: (s) => gsap.to(el, { yPercent: s.isActive ? 0 : 200, duration: 0.9, ease: "expo.out", overwrite: true }),
      });
      const triggers = items.map(([, id], i) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (s) => s.isActive && setActive(i),
        }),
      );
      return () => {
        show.kill();
        triggers.forEach((t) => t.kill());
      };
    },
    { dependencies: [mounted] },
  );

  // glide the highlight under the active link
  useEffect(() => {
    if (!mounted || active < 0) return;
    const link = ref.current?.querySelectorAll("button")[active];
    if (!link || !hl.current) return;
    gsap.to(hl.current, { x: link.offsetLeft, width: link.offsetWidth, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
  }, [active, mounted]);

  if (!mounted) return null;
  return createPortal(
    <div ref={ref} className="fixed bottom-6 left-1/2 z-50 hidden rounded-full bg-white/80 p-1.5 shadow-[0_14px_40px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl md:block">
      <div className="relative flex">
        <span ref={hl} className="invisible absolute inset-y-0 left-0 rounded-full bg-ink" />
        {items.map(([label, id], i) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-500 ${i === active ? "text-bg" : "text-ink/70 hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
