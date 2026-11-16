"use client";

import { useEffect, useRef, useState } from "react";

// Traders' requests as a slow, living web: each ask hangs off a thin line
// from one hub, drifts a little, and every few seconds one of them moves to
// an empty spot. Hover (or focus) an ask to stop the motion and trace its line.

type Ask = { text: string; topic: string };

// Anchor slots (top-left of a card, in % of the box), chosen so cards never
// overlap and the hub in the middle stays clear. More slots than cards, so
// there's always somewhere to move to.
const SLOTS: [number, number][] = [
  [2, 3], [67, 3], [2, 37], [67, 37], [2, 70], [67, 70], [34.5, 3], [34.5, 71],
];

export function AsksWeb({ asks }: { asks: Ask[] }) {
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const lines = useRef<(SVGLineElement | null)[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  hoverRef.current = hover;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = el.clientWidth, h = el.clientHeight;
    const ro = new ResizeObserver(() => { w = el.clientWidth; h = el.clientHeight; });
    ro.observe(el);

    // card i sits in slot slot[i]; positions are in %, eased toward the slot
    const slot = [0, 1, 2, 3, 4, 7].slice(0, asks.length);
    const pos = slot.map((s) => [...SLOTS[s]] as [number, number]);
    const phase = asks.map((_, i) => i * 1.7);

    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.15 });
    io.observe(el);

    const t0 = performance.now();
    let last = 0, raf = 0, nextMove = 2200;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible && last) { last = now; return; }
      const dt = Math.min(64, now - (last || now)); last = now;
      const paused = hoverRef.current !== null;
      if (!paused && !still) {
        nextMove -= dt;
        if (nextMove <= 0) {
          nextMove = 2600 + Math.random() * 1200;
          const free = SLOTS.map((_, s) => s).filter((s) => !slot.includes(s));
          const i = Math.floor(Math.random() * asks.length);
          slot[i] = free[Math.floor(Math.random() * free.length)];
        }
      }
      const t = (now - t0) / 1000;
      const cx = w / 2, cy = h / 2;
      for (let i = 0; i < asks.length; i++) {
        const [tx, ty] = SLOTS[slot[i]];
        if (!paused || still) {
          const k = still ? 1 : 1 - Math.pow(0.0025, dt / 1000); // ~1.2s settle
          pos[i][0] += (tx - pos[i][0]) * k;
          pos[i][1] += (ty - pos[i][1]) * k;
        }
        const fx = still ? 0 : Math.sin(t * 0.45 + phase[i]) * 5;
        const fy = still ? 0 : Math.cos(t * 0.37 + phase[i]) * 4;
        const x = (pos[i][0] / 100) * w + fx, y = (pos[i][1] / 100) * h + fy;
        const c = cards.current[i], l = lines.current[i];
        if (c) c.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (l) { l.setAttribute("x1", String(cx)); l.setAttribute("y1", String(cy)); l.setAttribute("x2", String(x + 3)); l.setAttribute("y2", String(y + 3)); }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [asks]);

  return (
    <div ref={box} className="relative h-[46rem] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] sm:h-[36rem]">
      {/* faint column guides, like a layout grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-4">
        {[0, 1, 2, 3].map((i) => <span key={i} className="border-r border-black/[0.04] last:border-r-0" />)}
      </div>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
        {asks.map((_, i) => (
          <line key={i} ref={(n) => { lines.current[i] = n; }} stroke={hover === i ? "#111" : "rgba(0,0,0,0.14)"} strokeWidth={hover === i ? 1.25 : 1} style={{ transition: "stroke .25s" }} />
        ))}
      </svg>
      <span aria-hidden className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-[#bdbdbd]" />
      <ul className="absolute inset-0">
        {asks.map((a, i) => (
          <li
            key={a.text}
            ref={(n) => { cards.current[i] = n; }}
            tabIndex={0}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="absolute left-0 top-0 w-[31%] outline-none will-change-transform"
            style={{ zIndex: hover === i ? 2 : 1 }}
          >
            <span aria-hidden className="block size-1.5 bg-ink" />
            <span
              className={`ml-2 mt-1 block rounded-[3px] border bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors duration-200 ${hover === i ? "border-ink" : "border-black/10"}`}
            >
              <span className="block text-[12.5px] leading-snug text-ink sm:text-[13px]">{a.text}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{a.topic}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
