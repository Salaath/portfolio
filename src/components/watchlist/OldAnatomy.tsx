"use client";

import { useState } from "react";
import { WlPhone } from "./WlPhone";

// The old watchlist, annotated. Pin positions are percentages of the 360×800 screen.
// Pins sit beside what they point at, never on top of it.
const PINS = [
  { x: 47, y: 5.7, t: "Lists were hidden", b: "Switching lists, creating one and Discover all lived inside this chevron. Several taps to change lists, so most people didn’t: 18% of monthly visitors ever switched." },
  { x: 91, y: 6, t: "Add looked like Create", b: "It opened search to add a stock. In our review it kept reading as “new list”, which is what people were hunting for." },
  { x: 50, y: 33, t: "Remove relied on a hidden gesture", b: "Managing the stocks in a list depended on a gesture nobody guessed." },
  { x: 64, y: 52.5, t: "Rows showed too little", b: "Name and price. For a chart, an OI number or a dividend date you opened the stock, checked, came back and opened the next one." },
];

const RED = "#E5483A";

export function OldAnatomy() {
  const [on, setOn] = useState(0);
  return (
    <div className="grid items-center gap-14 md:grid-cols-[auto_1fr] md:gap-20 lg:gap-28">
      <div className="relative mx-auto w-[min(300px,74vw)]">
        {/* a faint halo so the phone sits in the dark instead of on it */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[80px]" style={{ background: "radial-gradient(closest-side, rgba(124,63,214,0.55), transparent)" }} />
        <div className="relative">
          <WlPhone src="old-home" alt="The old Upstox watchlist, My favourites, with symbol and price on each row">
            {PINS.map((p, i) => {
              const active = on === i;
              return (
                <button
                  key={p.t}
                  type="button"
                  aria-label={p.t}
                  aria-pressed={active}
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                  onClick={() => setOn(i)}
                  className="absolute grid size-6 place-items-center rounded-full font-mono text-[10px] text-white transition-all duration-500 ease-out"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%,-50%) scale(${active ? 1.12 : 1})`,
                    background: active ? RED : "rgba(14,11,18,0.78)",
                    boxShadow: active ? `0 0 0 5px rgba(229,72,58,0.18), 0 0 0 1px rgba(255,255,255,0.35) inset` : "0 0 0 1px rgba(255,255,255,0.28) inset",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </WlPhone>
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 md:text-white/40">Where the old screen got in the way</p>
        <ol className="mt-6">
          {PINS.map((p, i) => {
            const active = on === i;
            return (
              <li key={p.t} className="relative border-t border-white/10 last:border-b">
                {/* the active row draws a red rule over the hairline */}
                <span aria-hidden className="absolute -top-px left-0 h-px w-full origin-left transition-transform duration-700 ease-out" style={{ background: RED, transform: `scaleX(${active ? 1 : 0})` }} />
                <button
                  type="button"
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                  onClick={() => setOn(i)}
                  className="grid w-full grid-cols-[3rem_1fr] gap-x-4 py-7 text-left md:grid-cols-[4.5rem_1fr]"
                >
                  <span className="font-mono text-sm tabular-nums transition-colors duration-500" style={{ color: active ? RED : "rgba(255,255,255,0.32)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={`block text-2xl leading-tight tracking-[-0.025em] transition-colors duration-500 md:text-[1.75rem] ${active ? "text-white" : "text-white/80 md:text-white/55"}`}>{p.t}</span>
                    <span className={`mt-2.5 block max-w-xl text-[15px] leading-relaxed transition-colors duration-500 ${active ? "text-white/75 md:text-white/65" : "text-white/60 md:text-white/35"}`}>{p.b}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
