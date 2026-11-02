"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Reading-progress bar on case study pages. Lives outside the smoother so it can stay fixed. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const show = pathname.startsWith("/work/");

  useGSAP(
    () => {
      if (!show) return;
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } },
      );
    },
    { dependencies: [show, pathname], revertOnUpdate: true },
  );

  if (!show) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
    />
  );
}
