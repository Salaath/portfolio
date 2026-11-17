"use client";

import { useState } from "react";
import { useInView } from "../ao/DropOff";

// Small data pieces for the research and results sections. All figures come
// from Watchlist Insights (Nov 2025 cohort) and Mixpanel (Android, 2026).

const PURPLE = "#5B2EBD";
const GREEN = "#14A363";

/** Where stocks get added to a watchlist, by cohort. */
const SOURCES = [
  ["Search", 70, 66.8],
  ["Option chain", 23, 18.5],
  ["Stock page", 1.8, 8.5],
  ["Discover tab", 6, 6.2],
] as const;

export function SourceBars() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [fo, setFo] = useState(true);
  return (
    <div ref={ref} className="rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label">Where stocks were added from</p>
        <div role="tablist" className="flex rounded-full bg-[#F3F3F1] p-1 text-sm">
          {[
            ["Active F&O traders", true],
            ["Everyone else", false],
          ].map(([l, v]) => (
            <button
              key={String(l)}
              role="tab"
              aria-selected={fo === v}
              onClick={() => setFo(v as boolean)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${fo === v ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-8 grid gap-5">
        {SOURCES.map(([name, a, b], i) => {
          const v = fo ? a : b;
          const hot = name === "Option chain" || name === "Discover tab";
          return (
            <li key={name} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-4 text-[15px]">
              <span className={hot ? "font-semibold" : "text-muted"}>{name}</span>
              <span className="h-7 overflow-hidden rounded-lg bg-[#F3F3F1]">
                <span
                  className="block h-full rounded-lg"
                  style={{
                    width: on ? `${v}%` : 0,
                    background: name === "Option chain" ? PURPLE : name === "Discover tab" ? "#E79D0D" : "#c9c5bd",
                    transition: `width 1s cubic-bezier(.2,1,.3,1) ${i * 0.07}s`,
                  }}
                />
              </span>
              <b className="text-right tabular-nums">{v}%</b>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
        <p>
          <b className="text-2xl font-semibold tracking-[-0.03em]">{fo ? 43 : 16}</b>
          <span className="text-muted"> stocks added per person</span>
        </p>
        <p className="text-muted">
          F&O traders added a quarter of their stocks straight from the option chain. Discover, which existed to give people ideas, managed about 6% for both groups.
        </p>
      </div>
    </div>
  );
}

/** Orders per customer in the first 45 days, with and without a watchlist. */
export function OpcBars() {
  const [ref, on] = useInView<HTMLDivElement>();
  const rows = [
    ["With a watchlist", 65, GREEN],
    ["Without one", 22, "#c9c5bd"],
  ] as const;
  return (
    <div ref={ref} className="grid gap-4">
      {rows.map(([l, v, c], i) => (
        <div key={l}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-white/60">{l}</span>
            <b className="text-2xl font-semibold tabular-nums tracking-[-0.03em]">{v}</b>
          </div>
          <span className="mt-2 block h-3 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full" style={{ width: on ? `${(v / 65) * 100}%` : 0, background: c, transition: `width 1.2s cubic-bezier(.2,1,.3,1) ${i * 0.12}s` }} />
          </span>
        </div>
      ))}
      <p className="text-xs text-white/45">Orders per customer, first 45 days, new customers onboarded in Nov 2025</p>
    </div>
  );
}

/** Monthly watchlist viewers and how few went further. Feb–Mar 2026 averages. */
export function UsageFunnel() {
  const [ref, on] = useInView<HTMLDivElement>();
  const steps = [
    ["Opened the watchlist", "1.19M", 100],
    ["Ever switched lists", "211K", 18],
    ["Traded straight from a row", "~8K", 0.7],
  ] as const;
  return (
    <div ref={ref} className="grid gap-3">
      {steps.map(([l, v, pct], i) => (
        <div key={l} className="relative overflow-hidden rounded-2xl bg-[#F3F3F1] p-5">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-2xl"
            style={{ width: on ? `${Math.max(pct, 2.5)}%` : 0, background: i === 0 ? "#ddd4f1" : i === 1 ? "#c4b2ea" : PURPLE, transition: `width 1.2s cubic-bezier(.2,1,.3,1) ${i * 0.15}s` }}
          />
          <div className="relative flex items-baseline justify-between gap-4">
            <span className="font-medium">{l}</span>
            <span className="flex items-baseline gap-2">
              <b className="text-2xl font-semibold tabular-nums tracking-[-0.03em]">{v}</b>
              <span className="text-sm text-muted">{pct >= 1 ? `${pct}%` : "<1%"}</span>
            </span>
          </div>
        </div>
      ))}
      <p className="text-sm text-muted">Monthly, Android, Feb–Mar 2026. That small last group was busy though: about 29 orders a month each.</p>
    </div>
  );
}

/** Android (revamped) against web (not revamped): fall in people adding stocks. */
export function WebControl() {
  const [ref, on] = useInView<HTMLDivElement>();
  const rows = [
    ["Android, revamped", 14, PURPLE],
    ["Web, not revamped", 25, "#c9c5bd"],
  ] as const;
  return (
    <div ref={ref} className="grid gap-4">
      {rows.map(([l, v, c], i) => (
        <div key={l} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
          <span className="text-sm text-muted">{l}</span>
          <b className="text-right text-xl font-semibold tabular-nums tracking-[-0.03em]">−{v}%</b>
          <span className="col-span-2 block h-3 overflow-hidden rounded-full bg-[#F3F3F1]">
            <span className="block h-full rounded-full" style={{ width: on ? `${(v / 25) * 100}%` : 0, background: c, transition: `width 1.1s cubic-bezier(.2,1,.3,1) ${i * 0.12}s` }} />
          </span>
        </div>
      ))}
    </div>
  );
}
