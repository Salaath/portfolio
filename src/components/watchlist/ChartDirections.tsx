"use client";

import { useState } from "react";

// The three Chart mode directions we weighed (Chart Mode directions and
// design-ready spec, May–Jun 2026), each drawn as a 2×2 grid of mini charts.

const DIRS = [
  {
    name: "Just price lines",
    tag: "Quickest to build",
    risk: "Quick to build and light on the phone. But the first thing chart readers asked was where their EMA and RSI had gone and this had no answer.",
    meters: [1, 1, 3],
    kind: "plain",
  },
  {
    name: "Full charts, everywhere",
    tag: "Most powerful",
    risk: "Every study on every chart sounds great until you picture twenty live charts loading at once on a mid-range Android phone, which is what a lot of our users carry. It was the riskiest option by a distance.",
    meters: [3, 3, 1],
    kind: "full",
  },
  {
    name: "Light charts, shared indicators",
    tag: "What we shipped",
    risk: "Up to two overlays, volume and one oscillator, picked once and applied to the whole grid. Enough to spot a breakout. For anything deeper, tap the chart and you get the full one.",
    meters: [3, 2, 3],
    kind: "light",
  },
] as const;

const METERS = ["Value to the trader", "Build effort", "Phone performance"];

// a deterministic wiggly price path inside a w×h box
function path(seed: number, w: number, h: number, n = 28) {
  let y = h * 0.6;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.sin(seed * 13.7 + i * 2.3) * 0.5 + Math.sin(seed * 3.1 + i * 0.7) * 0.5;
    y = Math.min(h - 4, Math.max(4, y - r * h * 0.09 - (seed % 2 ? 0.5 : -0.3)));
    pts.push(`${((i / (n - 1)) * w).toFixed(1)},${y.toFixed(1)}`);
  }
  return pts;
}

function Cell({ seed, kind }: { seed: number; kind: string }) {
  const w = 120, h = kind === "light" ? 52 : 70;
  const pts = path(seed, w, h);
  const up = seed % 3 !== 1;
  return (
    <div className="relative rounded-xl border border-line bg-white p-2.5">
      <div className="flex items-baseline justify-between text-[10px]">
        <b className="font-semibold">{["RELIANCE", "TATASTEEL", "SUZLON", "IRFC"][seed % 4]}</b>
        <span className={up ? "text-[#14A363]" : "text-[#D93A2B]"}>{up ? "+" : "−"}{(0.4 + (seed % 5) * 0.31).toFixed(2)}%</span>
      </div>
      <svg viewBox={`0 0 ${w} ${kind === "light" ? 78 : 70}`} className="mt-1.5 block w-full">
        {kind === "full" &&
          [0.3, 0.55, 0.8].map((k) => <line key={k} x1="0" x2={w} y1={h * k} y2={h * k} stroke="#eee" />)}
        {kind !== "plain" && (
          <g opacity={kind === "full" ? 0.5 : 0.35}>
            {pts.map((p, i) => {
              const bh = 4 + Math.abs(Math.sin(seed + i)) * 10;
              return <rect key={i} x={(i / 27) * w - 1.2} y={h - bh} width="2.4" height={bh} fill="#9a91b3" />;
            })}
          </g>
        )}
        <polyline points={pts.join(" ")} fill="none" stroke={up ? "#14A363" : "#D93A2B"} strokeWidth="1.6" />
        {kind !== "plain" && (
          <polyline points={pts.map((p) => { const [x, y] = p.split(",").map(Number); return `${x},${(y + 4).toFixed(1)}`; }).join(" ")} fill="none" stroke="#E79D0D" strokeWidth="1.1" strokeDasharray={kind === "light" ? "3 2" : undefined} />
        )}
        {kind === "full" && (
          <>
            <polyline points={pts.map((p) => { const [x, y] = p.split(",").map(Number); return `${x},${(y - 6).toFixed(1)}`; }).join(" ")} fill="none" stroke="#2E7DD1" strokeWidth="1" />
            <polyline points={pts.map((p) => { const [x, y] = p.split(",").map(Number); return `${x},${(y + 9).toFixed(1)}`; }).join(" ")} fill="none" stroke="#7B5CB8" strokeWidth="1" />
          </>
        )}
        {kind === "light" && (
          <g>
            <line x1="0" x2={w} y1="58" y2="58" stroke="#eee" />
            <polyline points={pts.map((p, i) => `${p.split(",")[0]},${(66 + Math.sin(seed + i * 0.6) * 7).toFixed(1)}`).join(" ")} fill="none" stroke="#5B2EBD" strokeWidth="1.1" />
          </g>
        )}
      </svg>
      {kind === "full" && (
        <span className="absolute inset-0 grid place-items-center rounded-xl bg-white/55 text-[10px] font-medium text-muted backdrop-blur-[1px]" style={{ animation: `wlLoad 2.4s ease-in-out ${seed * 0.3}s infinite` }}>
          Loading chart…
        </span>
      )}
    </div>
  );
}

export function ChartDirections() {
  const [i, setI] = useState(2);
  const d = DIRS[i];
  return (
    <div className="rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:p-10">
      <div role="tablist" className="flex flex-wrap gap-2">
        {DIRS.map((x, k) => (
          <button
            key={x.name}
            role="tab"
            aria-selected={i === k}
            onClick={() => setI(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${i === k ? "bg-ink text-bg" : "bg-[#F3F3F1] text-muted hover:text-ink"}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div key={i} className="grid grid-cols-2 gap-2.5 rounded-[1.5rem] bg-[#F3F3F1] p-3 [animation:wlIn_.5s_ease_both]">
          {[0, 1, 2, 3].map((s) => (
            <Cell key={s} seed={s + 1} kind={d.kind} />
          ))}
        </div>
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${i === 2 ? "bg-[#EFE9FA] text-[#5B2EBD]" : "bg-[#F3F3F1] text-muted"}`}>{d.tag}</span>
          <p className="mt-4 text-lg leading-snug tracking-[-0.01em]">{d.risk}</p>
          <ul className="mt-8 grid gap-4">
            {METERS.map((m, k) => (
              <li key={m}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{m}</span>
                  <span className="font-medium">{["Low", "Medium", "High"][d.meters[k] - 1]}</span>
                </div>
                <span className="mt-1.5 flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <i key={n} className="h-2 flex-1 rounded-full transition-colors duration-500" style={{ background: n <= d.meters[k] ? (k === 1 ? "#E79D0D" : "#5B2EBD") : "#ECEAE6", transitionDelay: `${n * 0.04}s` }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">My read of the trade-offs we discussed, not measured scores. For build effort, lower is better.</p>
        </div>
      </div>
      <style>{`@keyframes wlIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes wlLoad{0%,100%{opacity:.9}50%{opacity:.25}}@media (prefers-reduced-motion:reduce){[style*="wlLoad"]{animation:none!important}}`}</style>
    </div>
  );
}
