"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Custom cursor. Any element with `data-cursor="Label"` grows the cursor
 * into a disc showing that label; links and buttons get a smaller ring.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;
      const el = ref.current!;
      const label = labelRef.current!;
      document.documentElement.classList.add("has-cursor");

      gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

      let state = "";
      let hidden = false;
      const move = (e: PointerEvent) => {
        if ((e.target as HTMLElement).tagName === "IFRAME") return;
        // inside a prototype or phone mock-up the browser's own arrow and hand take over:
        // they don't lag and show exactly where a click will land
        if ((e.target as HTMLElement).closest?.("[data-native-cursor]")) {
          if (!hidden) leave();
          gsap.set(el, { x: e.clientX, y: e.clientY });
          return;
        }
        if (hidden) enter();
        xTo(e.clientX);
        yTo(e.clientY);

        const target = e.target as HTMLElement;
        const labelled = target.closest<HTMLElement>("[data-cursor]");
        const text = labelled?.dataset.cursor ?? "";
        const next = labelled ? `label:${text}` : target.closest("a, button") ? "link" : "";
        if (next === state) return;
        state = next;

        const size = labelled ? 104 : next === "link" ? 48 : 12;
        gsap.to(el, { width: size, height: size, duration: 0.7, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
        if (text) label.textContent = text;
        gsap.to(label, {
          autoAlpha: text ? 1 : 0,
          scale: text ? 1 : 0.5,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const leave = () => {
        hidden = true;
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };
      const enter = () => {
        hidden = false;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      };
      // the parent stops getting pointer events inside an iframe, so the cursor would freeze over it
      const over = (e: PointerEvent) => {
        if ((e.target as HTMLElement).tagName === "IFRAME") leave();
      };

      window.addEventListener("pointermove", move);
      document.addEventListener("pointerleave", leave);
      document.addEventListener("pointerenter", enter);
      document.addEventListener("pointerover", over);
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", leave);
        document.removeEventListener("pointerenter", enter);
        document.removeEventListener("pointerover", over);
        document.documentElement.classList.remove("has-cursor");
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex h-3 w-3 items-center justify-center rounded-full bg-white text-black mix-blend-difference"
    >
      <span ref={labelRef} className="invisible text-xs font-medium tracking-wide" />
    </div>
  );
}
