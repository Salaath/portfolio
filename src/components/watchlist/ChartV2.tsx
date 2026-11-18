"use client";

import { useEffect, useRef, useState } from "react";
import { WlPhone } from "./WlPhone";

// The live chart mode against the next version, one change at a time. Both
// phones are working prototypes (public/proto/watchlist/r3.html, v4.html);
// picking a change moves both to the state that shows it and from there
// every control can be tapped.

const CHANGES = [
  {
    k: "hl",
    label: "High and low on every card",
    v1: { src: "ex/c1-grid", alt: "Version 1 grid of charts with no high or low marked", note: "The high and low showed only while you pressed and held a chart. Press and hold a card to try it." },
    v2: { src: "ex/v2-grid", alt: "Version 2 grid with the high and low marked on every chart", note: "Every card marks its high and low. No gesture to learn." },
  },
  {
    k: "big",
    label: "Bigger charts in List view",
    v1: { src: "ex/c1-list", alt: "Version 1 list view with three charts on screen", note: "A little over three charts on screen." },
    v2: { src: "ex/v2-list", alt: "Version 2 list view with two tall charts and a price axis", note: "Two charts per screen, even with no indicators on and a price axis on the side." },
  },
  {
    k: "range",
    label: "A range to pick, not only a candle",
    v1: { src: "ex/c1-grid", alt: "Version 1 control bar with a single 1D chip", note: "One 1D chip. It set the candle size and the history you saw came along with it." },
    v2: { src: "ex/v2-grid", alt: "Version 2 with a row of ranges from 1D to 5Y", note: "A row of ranges from 1D to 5Y. Candle size moves to its own button in the floating bar, since that’s all the old chip ever changed." },
  },
  {
    k: "interval",
    label: "A default candle for every range",
    v1: { src: "ex/c1-grid", alt: "Version 1 grid of charts", note: "The candle size was the only setting, so the amount of history on screen was never something you chose." },
    v2: { src: "ex/v2-intsheet", alt: "Version 2 interval sheet listing 5 minutes to 1 week", note: "Each range opens on a sensible candle size. Tap it in the floating bar for the sizes that fit that range." },
  },
] as const;

const PROTOS = ["/proto/watchlist/r3.html?embed&start=chart", "/proto/watchlist/v4.html?embed&start=chart"] as const;

export function ChartV2({ labels = ["Version 1 · live", "Version 2 · with engineering"] }: { labels?: [string, string] } = {}) {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(0);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const c = CHANGES[i];
  const pick = (k: number) => {
    setI(k);
    frames.current.forEach((f) => f?.contentWindow?.postMessage({ wl: "demo", k: CHANGES[k].k }, "*"));
  };
  useEffect(() => { setI(0); }, [run]);
  return (
    <div className="grid gap-8 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-5 md:p-8 lg:grid-cols-[17rem_1fr]">
      {/* a ruled list: the open step turns to ink and a purple rule draws across its hairline */}
      <ol className="flex gap-6 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:self-start lg:overflow-visible lg:pb-0">
        {CHANGES.map((x, k) => (
          <li key={x.k} className="relative shrink-0 border-t border-line lg:last:border-b">
            <span aria-hidden className={`absolute -top-px left-0 h-px w-full origin-left bg-[#5B2EBD] transition-transform duration-700 ease-out ${i === k ? "scale-x-100" : "scale-x-0"}`} />
            <button
              type="button"
              aria-pressed={i === k}
              onClick={() => pick(k)}
              className={`group flex w-full items-baseline gap-4 py-4 text-left text-[15px] leading-snug transition-colors duration-500 ${i === k ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              <span className={`font-mono text-[11px] tabular-nums transition-colors duration-500 ${i === k ? "text-[#5B2EBD]" : "text-muted/60"}`}>0{k + 1}</span>
              <span className="font-medium tracking-[-0.01em]">{x.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {([[labels[0], c.v1], [labels[1], c.v2]] as const).map(([t, s], k) => (
          <figure key={t} className="mx-auto w-full max-w-[15rem]">
            <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.1em] ${k ? "text-[#5B2EBD]" : "text-muted"}`}>{t}</p>
            <WlPhone src={k ? "ex/v2-grid" : "ex/c1-grid"} alt={s.alt}>
              <iframe
                key={run}
                ref={(n) => { frames.current[k] = n; }}
                src={PROTOS[k]}
                title={`${t} prototype`}
                loading="eager"
                className="absolute inset-0 h-full w-full border-0 bg-transparent"
              />
            </WlPhone>
            <figcaption className="mt-3 text-[13px] leading-snug text-muted">{s.note}</figcaption>
          </figure>
        ))}
        <p className="col-span-2 -mt-2 text-center text-[13px] text-muted">
          Both phones work: tap any control, card or tab.{" "}
          <button type="button" onClick={() => setRun((n) => n + 1)} className="font-medium text-ink underline underline-offset-4">Start again</button>
        </p>
      </div>
    </div>
  );
}
