"use client";

import { useEffect, useState } from "react";

// A strip of watchlist rows that drifts sideways, prices nudging every couple
// of seconds. Sample prices, the same ones the prototypes use.

const BASE: [string, number, number][] = [
  ["NIFTY 50", 25911.7, 0.42], ["RELIANCE", 1487.6, 0.64], ["TATASTEEL", 171.62, 1.04], ["HDFCBANK", 991.45, 0.54],
  ["SUZLON", 58.36, -1.29], ["IRFC", 128.45, 1.06], ["SBIN", 918.35, 1.15], ["ETERNAL", 318.7, 2.0],
  ["BANKNIFTY", 58293.4, -0.17], ["CRUDEOIL", 5450, 0.86], ["GOLDBEES", 109.2, 0.31], ["ICICIBANK", 1392.8, -0.41],
];

export function Ticker({ dark = false }: { dark?: boolean }) {
  const [rows, setRows] = useState(BASE);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setRows((r) => r.map(([s, p, c]) => { const d = (Math.random() - 0.5) * 0.0012; return [s, p * (1 + d), c + d * 100]; }));
    }, 2200);
    return () => window.clearInterval(t);
  }, []);
  const list = [...rows, ...rows];
  return (
    <div className={`relative overflow-hidden border-y py-3.5 ${dark ? "border-white/10 bg-[#0e0b12] text-white" : "border-line bg-white"}`} aria-hidden>
      <div className="flex w-max gap-10 whitespace-nowrap [animation:wlTick_60s_linear_infinite] motion-reduce:[animation:none]">
        {list.map(([s, p, c], i) => (
          <span key={i} className="flex items-baseline gap-2.5 font-mono text-[13px]">
            <b className="font-semibold">{s}</b>
            <span className="tabular-nums">{p.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`tabular-nums ${c >= 0 ? "text-[#14A363]" : "text-[#D93A2B]"}`}>{c >= 0 ? "▲" : "▼"} {Math.abs(c).toFixed(2)}%</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes wlTick{to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
