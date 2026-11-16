"use client";

import { useRef, useState } from "react";
import { SHOT_V, WL_IMG } from "./WlPhone";

/**
 * One phone, two watchlists. Drag the handle (or use the arrow keys) to wipe
 * between the old screen and the new one.
 */
export function BeforeAfter({ width = 320 }: { width?: number }) {
  const [pos, setPos] = useState(58);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div style={{ width }} className="max-w-full">
      <div className="rounded-[2.6rem] bg-[#16121c] p-[8px] shadow-[0_50px_90px_-40px_rgba(40,14,80,0.55),inset_0_0_0_1.5px_#2c2833]">
        <div
          ref={box}
          className="relative aspect-[9/20] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[2.1rem] bg-white"
          onPointerDown={(e) => {
            drag.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            move(e.clientX);
          }}
          onPointerMove={(e) => drag.current && move(e.clientX)}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${WL_IMG}/home.jpg${SHOT_V}`} alt="The new watchlist" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${WL_IMG}/old-home.jpg${SHOT_V}`} alt="The old watchlist" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
          </div>
          <div className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${pos}%` }}>
            <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[13px] font-semibold text-ink shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
              ‹ ›
            </span>
          </div>
          <span className="pointer-events-none absolute left-3 top-[13%] rounded-md bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white" style={{ opacity: pos > 18 ? 1 : 0 }}>
            2023
          </span>
          <span className="pointer-events-none absolute right-3 top-[13%] rounded-md bg-[#5B2EBD] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white" style={{ opacity: pos < 82 ? 1 : 0 }}>
            2026
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Compare the old and new watchlist"
            className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted">Drag across the screen to compare</p>
    </div>
  );
}
