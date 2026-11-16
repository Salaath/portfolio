"use client";

import { useEffect, useRef, useState } from "react";
import { WlPhone } from "./WlPhone";

// Release 2, first design: one icon on My lists flips the list into columns, in place.
// Table mode scrolls the way the final multi-column design does: the whole
// table moves, the Scrip column slides away with it, and each row keeps a
// light grey name tag (#F1F1F1, 12/16 Inter, as in the shipped Table view)
// pinned at its top left so you never lose which stock you're on. The table is the full 608pt-wide Figma frame.
const F = (v: number, of: number) => `${(v / of) * 100}%`;
const TOP = 264, BOTTOM = 729, FAB_TOP = 661, FAB_H = 68, TABLE_W = 608;
const HEADER = 32, ROW = 61; // pt, inside the table
const NAMES = ["TCS", "HUL", "KOTAKBANK", "BHARTIAIRTEL", "SBI", "L&T", "TCS"];
// 1pt of the 360pt-wide screen, in container units of the phone (screen is 95.2cqw)
const pt = (v: number) => `calc(${v} * 0.26444cqw)`;

export function ViewToggle() {
  const [on, setOn] = useState(false);
  const [moved, setMoved] = useState(false);
  const [tag, setTag] = useState(0); // 0 → 1 as the Scrip column leaves
  const sc = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  // a small nudge the first time the table opens, so the sideways scroll is visible
  useEffect(() => {
    const el = sc.current;
    if (!on || !el || moved) return;
    const t1 = setTimeout(() => el.scrollTo({ left: el.clientWidth * 0.45, behavior: "smooth" }), 500);
    const t2 = setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [on, moved]);

  useEffect(() => { if (!on) setTag(0); }, [on]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[min(250px,70vw)]">
        <WlPhone src={on ? "ex/m4-b1" : "ex/m4-a1"} alt={on ? "The same list as columns: scrip, price, % change, signals and low" : "My lists with a grid icon at the end of the chips"}>
          {on && (
            <>
              <div
                ref={sc}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  // tags arrive over the first ~15% of a screen width of scroll
                  setTag(Math.min(1, el.scrollLeft / (el.clientWidth * 0.15)));
                }}
                // mouse users can't swipe, so let them drag; touch and trackpads scroll natively
                onWheel={() => setMoved(true)}
                onPointerDown={(e) => { setMoved(true); if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft }; e.currentTarget.setPointerCapture(e.pointerId); }}
                onPointerMove={(e) => { if (drag.current) e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x); }}
                onPointerUp={() => { drag.current = null; }}
                onPointerCancel={() => { drag.current = null; }}
                className="absolute inset-x-0 cursor-grab select-none overflow-x-auto overflow-y-hidden overscroll-x-contain active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ top: F(TOP, 800), height: F(BOTTOM - TOP, 800) }}
                tabIndex={0}
                aria-label="Columns, scroll sideways"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/watchlist/ex/m4-tbl-full.jpg" alt="Scrip, price, % change, signals and low for each stock" className="block h-full max-w-none" style={{ width: F(TABLE_W, 360) }} draggable={false} />
              </div>

              {/* pinned name tags, one per row */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0" style={{ top: F(TOP, 800), height: F(BOTTOM - TOP, 800), opacity: tag, transition: "opacity .12s linear" }}>
                {NAMES.map((n, i) => (
                  <span
                    key={i}
                    className="absolute overflow-hidden text-ellipsis whitespace-nowrap bg-[#F1F1F1] font-medium text-[#777]"
                    style={{ left: pt(12), top: pt(HEADER + i * ROW + 4), fontSize: pt(12), lineHeight: pt(16), padding: `0 ${pt(4)}`, borderRadius: pt(4), maxWidth: pt(100) }}
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/watchlist/ex/m4-fab.png" alt="" className="pointer-events-none absolute left-0 w-full" style={{ top: F(FAB_TOP, 800), height: F(FAB_H, 800) }} />
            </>
          )}
          <button
            type="button"
            onClick={() => setOn(!on)}
            aria-pressed={on}
            aria-label="Switch view"
            className="absolute rounded-lg"
            style={{ left: "86.5%", top: "28%", width: "11%", height: "4.6%" }}
          />
        </WlPhone>
      </div>
      <p className="mt-3 h-5 text-[13px] text-muted">{on ? "Swipe or drag sideways. Each row keeps a name tag." : ""}</p>
      <button type="button" onClick={() => setOn(!on)} className="mt-1 text-sm font-medium underline-offset-4 hover:underline">
        {on ? "Back to the list" : "Tap the grid icon, or here"}
      </button>
    </div>
  );
}
