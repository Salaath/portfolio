"use client";

import { useState } from "react";
import { WlPhone } from "./WlPhone";

export type DeckFeature = {
  name: string;
  short: string;
  because: string;
  stat: string;
  statLabel: string;
  screens: { shot: string; caption: string }[];
};

/**
 * The new watchlist, feature by feature, on one phone. Features run down the
 * left; the screens of the open feature sit to the right of the phone as a
 * numbered list you can step through.
 */
export function PhoneDeck({ features }: { features: DeckFeature[] }) {
  const [f, setF] = useState(0);
  const [s, setS] = useState(0);
  const feat = features[f];
  const scr = feat.screens[s];
  const pick = (k: number) => {
    setF(k);
    setS(0);
  };
  return (
    <div className="grid gap-8 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-5 md:p-8 lg:grid-cols-[15rem_auto_1fr] lg:gap-10">
      <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {features.map((x, k) => (
          <li key={x.name} className="shrink-0">
            <button
              type="button"
              aria-pressed={f === k}
              onClick={() => pick(k)}
              className={`flex w-full items-baseline gap-3 rounded-xl px-3.5 py-3 text-left transition-colors ${f === k ? "bg-[#5B2EBD] text-white" : "hover:bg-[#F6F5F2]"}`}
            >
              <span className={`font-mono text-[11px] ${f === k ? "text-white/60" : "text-muted"}`}>{String(k + 1).padStart(2, "0")}</span>
              <span>
                <span className="block whitespace-nowrap font-semibold tracking-[-0.01em]">{x.name}</span>
                <span className={`hidden text-xs lg:block ${f === k ? "text-white/70" : "text-muted"}`}>{x.short}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mx-auto w-[min(270px,72vw)]">
        <div key={`${f}-${s}`} className="[animation:wlIn_.45s_ease_both]">
          <WlPhone src={scr.shot} alt={scr.caption} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <div key={f} className="[animation:wlIn_.45s_ease_both]">
          <div className="flex items-baseline gap-3 border-b border-line pb-5">
            <b className="text-5xl font-semibold tracking-[-0.05em] text-[#5B2EBD]">{feat.stat}</b>
            <span className="text-sm leading-snug text-muted">{feat.statLabel}</span>
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">{feat.because}</p>
        </div>
        <ol className="mt-6 grid gap-1">
          {feat.screens.map((x, k) => (
            <li key={x.shot}>
              <button
                type="button"
                aria-pressed={s === k}
                onClick={() => setS(k)}
                className={`flex w-full gap-3 rounded-xl p-3 text-left text-[15px] leading-snug transition-colors ${s === k ? "bg-[#F1ECFA]" : "hover:bg-[#F6F5F2]"}`}
              >
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px] ${s === k ? "bg-[#5B2EBD] text-white" : "bg-ink/10"}`}>{k + 1}</span>
                <span className={s === k ? "" : "text-muted"}>{x.caption}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-auto flex gap-2 pt-6">
          <button type="button" onClick={() => (s > 0 ? setS(s - 1) : f > 0 && (setF(f - 1), setS(features[f - 1].screens.length - 1)))} className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-bg">←</button>
          <button
            type="button"
            onClick={() => (s < feat.screens.length - 1 ? setS(s + 1) : pick((f + 1) % features.length))}
            className="rounded-full bg-ink px-4 py-2 text-sm text-bg transition-opacity hover:opacity-85"
          >
            {s < feat.screens.length - 1 ? "Next screen →" : `Next: ${features[(f + 1) % features.length].name} →`}
          </button>
        </div>
      </div>
      <style>{`@keyframes wlIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
