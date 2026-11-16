"use client";

import { useState } from "react";
import { useInView } from "../ao/DropOff";

export type Result = { metric: string; when: string; from?: string; to?: string; change: string; up: boolean; note: string };

// direction only: a straight line up or down, not a time series
function spark(up: boolean) {
  return up ? "2,26 94,4" : "2,8 94,24";
}

/** Results laid out like a watchlist: one row per metric, tap a row for the detail. */
export function ResultsBoard({ rows }: { rows: Result[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)]">
      <div className="hidden grid-cols-[1.6fr_1fr_7rem_6.5rem] gap-4 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:grid">
        <span>Metric</span>
        <span>Before → after</span>
        <span>Direction</span>
        <span className="text-right">Change</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.metric} className="border-b border-line last:border-0">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[#FAF9F7] md:grid-cols-[1.6fr_1fr_7rem_6.5rem]"
          >
            <span>
              <b className="block text-lg font-semibold tracking-[-0.02em]">{r.metric}</b>
              <span className="text-xs text-muted">{r.when}</span>
            </span>
            <span className="hidden font-mono text-sm tabular-nums text-muted md:block">{r.from && r.to ? `${r.from} → ${r.to}` : "—"}</span>
            <svg viewBox="0 0 96 30" className="hidden h-8 w-24 md:block" aria-hidden>
              <polyline
                points={spark(r.up)}
                fill="none"
                stroke={r.up ? "#14A363" : "#D93A2B"}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset={on ? 0 : 100}
                style={{ transition: `stroke-dashoffset 1.4s ease ${i * 0.1}s` }}
              />
            </svg>
            <span className="text-right">
              <span className={`inline-block rounded-md px-2.5 py-1.5 font-mono text-[15px] font-semibold tabular-nums ${r.up ? "bg-[#E7F6EE] text-[#0E7A48]" : "bg-[#FDECEA] text-[#B4321F]"}`}>{r.change}</span>
            </span>
          </button>
          <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="max-w-2xl px-6 pb-5 text-[15px] text-muted">{r.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
