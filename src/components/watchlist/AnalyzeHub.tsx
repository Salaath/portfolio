"use client";

import { useState } from "react";

// The FAB argument, as a toy. Add watchlist-analysis features one by one and
// watch where they go: one icon each (what was asked for) or one Analyze entry
// (what shipped). News is marked as being discussed, not built.

// Icons are the Upstox design-system glyphs, exported from the watchlist Figma
// file (public/work/watchlist/ds), drawn as masks so they take the text colour.
const FEATURES = [
  { name: "Table view", icon: "column", state: "Shipped" },
  { name: "Chart mode", icon: "candle", state: "Shipped" },
  { name: "Watchlist news", icon: "info", state: "Being discussed" },
  { name: "The next idea", icon: "addcircle", state: "Whatever comes next" },
];

function Ico({ name, className = "size-5" }: { name: string; className?: string }) {
  const url = `url(/work/watchlist/ds/${name}.svg)`;
  return <span aria-hidden className={`block shrink-0 bg-current ${className}`} style={{ WebkitMask: `${url} center / contain no-repeat`, mask: `${url} center / contain no-repeat` }} />;
}

const Btn = ({ name, title }: { name: string; title?: string }) => (
  <span className="grid h-9 w-8 place-items-center [animation:ahIn_.35s_ease_both]" title={title}>
    <Ico name={name} />
  </span>
);

export function AnalyzeHub() {
  const [mode, setMode] = useState<"icons" | "analyze">("icons");
  const [n, setN] = useState(2);
  const [open, setOpen] = useState(true);
  const list = FEATURES.slice(0, n);
  return (
    <div className="grid gap-10 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:grid-cols-2 md:p-10">
      <div>
        <div role="tablist" className="inline-flex flex-wrap rounded-[10px] bg-[#F4F2F7] p-1 text-sm">
          {([
            ["icons", "One icon per feature"],
            ["analyze", "One Analyze button"],
          ] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`px-4 py-1.5 font-medium transition-all ${mode === k ? "rounded-[7px] bg-white text-ink shadow-[0_0_0_1px_rgba(42,27,61,0.08)]" : "rounded-[7px] text-muted hover:text-ink"}`}>
              {l}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          {mode === "icons"
            ? "What the PMs and the business team asked for before launch: give Chart mode its own icon in the floating bar. It fixes one feature and sets the rule for every feature after it."
            : "What we proposed instead. Table view and Chart mode are both ways of analysing a list, so they share one entry. The next feature joins the sheet and the bar stays the same."}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setN(Math.min(FEATURES.length, n + 1))} disabled={n === FEATURES.length} className="rounded-lg bg-[#5B2EBD] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-30">
            + Add the next feature
          </button>
          <button type="button" onClick={() => setN(2)} className="text-sm text-muted underline-offset-4 hover:underline">
            Reset
          </button>
        </div>
        <ol className="mt-6 grid gap-1.5 text-sm">
          {FEATURES.map((f, k) => (
            <li key={f.name} className={`flex justify-between border-t border-line pt-1.5 ${k < n ? "" : "opacity-30"}`}>
              <span>{f.name}</span>
              <span className={`font-mono text-[11px] ${f.state === "Shipped" ? "text-[#0E7A48]" : "text-muted"}`}>{f.state}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* My lists, drained to black and white so only the floating bar reads */}
      <div className="relative mx-auto flex h-[25rem] w-full max-w-[20rem] flex-col justify-end overflow-hidden rounded-[2rem] border border-line bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/work/watchlist/ex/r1-after.jpg" alt="" aria-hidden className="absolute inset-x-0 top-0 w-full opacity-60 [filter:grayscale(1)_contrast(0.85)_brightness(1.05)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-white/0 via-white/85 to-white" />

        {mode === "analyze" && open && (
          <div className="relative mx-3 mb-3 rounded-2xl border border-line bg-white p-3 shadow-lg [animation:ahIn_.35s_ease_both]">
            <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Analyze this list</p>
            {list.map((f) => (
              <p key={f.name} className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm [animation:ahIn_.35s_ease_both] ${f.state === "Shipped" ? "text-[#262626]" : "text-muted"}`}>
                <span className="flex items-center gap-2.5"><Ico name={f.icon} className="size-[18px]" />{f.name}</span>
                {f.state !== "Shipped" && <span className="rounded border border-dashed border-line px-1.5 text-[10px]">{f.state === "Being discussed" ? "Later" : "?"}</span>}
              </p>
            ))}
          </div>
        )}

        <div className="relative mb-5 flex items-center justify-center gap-2 text-[#262626]">
          <div className={`flex h-10 items-center rounded-[9px] border border-[#EEEEEE] bg-white pl-1.5 pr-1 shadow-[0_2px_6px_rgba(12,12,12,0.13)] transition-all duration-500 ${mode === "icons" && n > 3 ? "ring-2 ring-[#D93A2B]/50" : ""}`}>
            <Btn name="sort" title="Sort" />
            <span className="mx-1 h-4 w-px bg-[#CFCFCF]" />
            <span className="flex items-center gap-1 whitespace-nowrap px-1.5 text-[13px] font-semibold"><Ico name="addlist" className="size-[18px]" />Add list</span>
            <span className="mx-1 h-4 w-px bg-[#CFCFCF]" />
            {mode === "icons" ? (
              list.map((f) => <Btn key={f.name} name={f.icon} title={f.name} />)
            ) : (
              <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Analyze" className="grid size-8 place-items-center rounded-md bg-[#EFE9FA] text-[#542087]" title="Analyze">
                <Ico name="analyze" />
              </button>
            )}
          </div>
          <span className="grid size-10 place-items-center rounded-[9px] border border-[#EEEEEE] bg-white shadow-[0_2px_6px_rgba(12,12,12,0.13)]"><Ico name="more" /></span>
        </div>
        {mode === "icons" && n > 3 && <p className="absolute inset-x-0 bottom-20 text-center text-xs font-medium text-[#B4321F]">Every new feature makes the bar longer</p>}
      </div>
      <style>{`@keyframes ahIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
