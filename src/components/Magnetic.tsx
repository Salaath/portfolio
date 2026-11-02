"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Pulls its child toward the pointer while hovered, then springs back. */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const to = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }>(null);

  useGSAP(
    () => {
      const opts = { duration: 0.9, ease: "elastic.out(1, 0.35)" };
      to.current = {
        x: gsap.quickTo(ref.current, "x", opts),
        y: gsap.quickTo(ref.current, "y", opts),
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="inline-block"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        to.current?.x((e.clientX - (r.left + r.width / 2)) * strength);
        to.current?.y((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        to.current?.x(0);
        to.current?.y(0);
      }}
    >
      {children}
    </div>
  );
}
