"use client";

// Paintings drifting behind the Muse page, after the Getty "Tracing Art" site.
// They are other works from the museums in the app (Rijksmuseum, Van Gogh
// Museum, Louvre, Vatican Museums), not the ones on Muse's own wall; the
// images are public-domain reproductions from Wikimedia Commons.
//
// Every tile sits at its own depth. Depth sets its size, how fast it passes as
// the page scrolls and how far it shifts against the cursor. A few tiles at the
// page margins show their painting; the rest are blank plates that reveal
// theirs while the cursor is over them. The field loops for the page's length.
import { useEffect, useRef } from "react";

type Item = {
  /** bg-NN.webp and its height over its width. */
  n: number;
  r: number;
  /** Left edge as a share of the window's width, start as a share of the loop, width in vw. */
  x: number;
  y: number;
  w: number;
  /** Depth, 0.25 (far) to 1.2 (near). */
  d: number;
  /** Shown from the start; otherwise a plate until hovered. */
  lit?: boolean;
};

// Lit paintings keep to the outer margins, clear of the words (the column is
// 1100px wide; the frame loop below holds them out of it at any window width).
// Plates go anywhere, the middle included.
const ITEMS: Item[] = [
  { n: 4, r: 0.48, x: -0.02, y: 0.02, w: 13, d: 1.1, lit: true },
  { n: 8, r: 1.145, x: 0.915, y: 0.08, w: 8, d: 0.8, lit: true },
  { n: 12, r: 0.775, x: 0.895, y: 0.3, w: 12, d: 1.2, lit: true },
  { n: 2, r: 1.191, x: 0.015, y: 0.27, w: 7, d: 0.6, lit: true },
  { n: 7, r: 0.8, x: -0.03, y: 0.5, w: 12, d: 1.0, lit: true },
  { n: 20, r: 1.325, x: 0.93, y: 0.52, w: 6, d: 0.5, lit: true },
  { n: 18, r: 0.725, x: 0.9, y: 0.72, w: 11, d: 0.95, lit: true },
  { n: 1, r: 1.155, x: 0.03, y: 0.74, w: 6.5, d: 0.55, lit: true },
  { n: 9, r: 0.627, x: 0.905, y: 0.9, w: 10, d: 0.7, lit: true },
  { n: 5, r: 0.691, x: 0.0, y: 0.92, w: 9, d: 0.85, lit: true },
  { n: 3, r: 0.675, x: 0.17, y: 0.1, w: 8, d: 0.45 },
  { n: 10, r: 1.136, x: 0.72, y: 0.16, w: 5, d: 0.35 },
  { n: 6, r: 0.491, x: 0.4, y: 0.22, w: 9, d: 0.55 },
  { n: 13, r: 1.659, x: 0.6, y: 0.36, w: 4.5, d: 0.3 },
  { n: 11, r: 0.775, x: 0.22, y: 0.42, w: 7, d: 0.5 },
  { n: 14, r: 0.752, x: 0.76, y: 0.46, w: 6, d: 0.4 },
  { n: 17, r: 0.682, x: 0.34, y: 0.62, w: 8, d: 0.6 },
  { n: 19, r: 1.323, x: 0.66, y: 0.66, w: 5, d: 0.32 },
  { n: 21, r: 0.72, x: 0.18, y: 0.84, w: 6, d: 0.38 },
  { n: 22, r: 0.659, x: 0.52, y: 0.86, w: 7.5, d: 0.52 },
];

export function FloatingArt({ plate = "#e5ddcc" }: { plate?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = [...ref.current!.children] as HTMLElement[];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eased copies of the scroll position and the cursor, so the field glides after them
    let sy = window.scrollY;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let px = -1, py = -1;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY;
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const frame = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const loop = vh * 3; // the field comes round again after this much travel
      const k = still ? 1 : 0.09;
      sy += (window.scrollY - sy) * k;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      els.forEach((el, i) => {
        const it = ITEMS[i];
        const w = el.offsetWidth, h = el.offsetHeight;
        const travel = it.y * loop - sy * it.d;
        // wrap within the loop, entering from one tile-height below the window
        const y = ((travel % loop) + loop) % loop - h - vh * 0.5 - my * it.d * 60;
        let x = it.x * vw - mx * it.d * 70;
        // A lit painting never crosses into the text column: it stops short of
        // the column's edge and hangs off the side of the window instead.
        if (it.lit) {
          const gutter = Math.max(vw < 768 ? 20 : 40, (vw - 1100) / 2);
          const gap = Math.min(20, gutter * 0.4);
          x = it.x < 0.5 ? Math.min(x, gutter - gap - w) : Math.max(x, vw - gutter + gap);
        }
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        if (!it.lit) el.dataset.on = px >= x && px <= x + w && py >= y && py <= y + h ? "1" : "0";
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} data-float aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {ITEMS.map((it) => (
        <div
          key={it.n}
          data-on={it.lit ? "1" : "0"}
          className={`group/tile absolute left-0 top-0 will-change-transform ${it.lit ? "max-md:opacity-45" : ""}`}
          style={{ width: `max(${it.w}vw, ${it.w * 6}px)`, aspectRatio: `1 / ${it.r}`, background: plate, opacity: it.lit ? undefined : 0.45 + it.d * 0.7, boxShadow: it.lit ? `0 ${22 * it.d}px ${50 * it.d}px -${20 * it.d}px rgba(60,45,20,0.5)` : undefined }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/work/ai/pages/bg-${String(it.n).padStart(2, "0")}.webp`}
            alt=""
            loading={it.lit ? "eager" : "lazy"}
            className="block h-full w-full object-cover opacity-0 transition-opacity duration-500 group-data-[on='1']/tile:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}
