"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Temporary: compare centred and left-aligned sub text in the redesign section.
 * Remove once one is picked. The switch floats on screen while the section is in view.
 * Rendered in a portal because the smooth scroller's transform breaks position: fixed.
 */
export function AlignPicker({ children }: { children: React.ReactNode }) {
  const [align, setAlign] = useState<"center" | "left">("center");
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-align={align} className="group/align">
      {children}
      {show
        ? createPortal(
            <div className="fixed bottom-6 left-1/2 z-[900] flex -translate-x-1/2 items-center gap-1 rounded-full border border-dashed border-ink/30 bg-bg p-1.5 text-sm text-ink shadow-lg">
              <span className="px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Sub text</span>
              {(["center", "left"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={align === a}
                  onClick={() => setAlign(a)}
                  className={`rounded-full px-4 py-1.5 transition-colors ${align === a ? "bg-ink text-bg" : "hover:bg-card"}`}
                >
                  {a === "center" ? "Centred" : "Left"}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
