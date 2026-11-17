"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// The competitor review in one place. Left: what each app's watchlist could do
// (Watchlist Insights review, 2025 and the Chart Mode market scan, 28 Jun 2026).
// Right: screenshots of that app and what we noted while using it. Screens come
// from the explorations file (ex/r-*) and the Insights review (cr/*).
// Click a screenshot to open a viewer that steps through every app's screens.

const CAPS = ["Ready-made lists", "Signals on rows", "Lists by trading style", "Option chain shortcut", "Multi-column view", "Chart grid"] as const;

type App = { name: string; where: string; has?: number[]; scan?: string; shots: string[]; good?: string[]; meh?: string[] };

const cr = (k: string, n: number) => Array.from({ length: n }, (_, i) => `cr/${k}-${i + 1}`);

const APPS: App[] = [
  { name: "Dhan", where: "India", has: [0, 1, 3], scan: "9+ ready-made lists, O=H, O=L and corporate-action tags on rows, a quick way to the option chain", shots: ["ex/r-dhan", ...cr("dhan", 3)], good: ["Ready lists for stocks, F&O and more", "A clear + to add stocks"], meh: ["Creating or editing your own list is at the bottom of the page, under settings. Hard to find the first time"] },
  { name: "Sahi", where: "India", has: [0, 2], scan: "20+ technical scanner lists, refreshed every day", shots: cr("sahi", 3) },
  { name: "HDFC Sky", where: "India", has: [0, 2], scan: "Screener-style lists for F&O, intraday traders and investors", shots: ["ex/r-hdfc", ...cr("hdfc", 3)], good: ["Smartlists grouped under Discover", "Create, edit and manage from one top-right menu"], meh: ["You can’t follow a list; you copy stocks into your own by hand"] },
  { name: "Angel One", where: "India", has: [0], scan: "Lists to follow, plus open positions and orders inside the watchlist", shots: ["ex/r-angel", ...cr("angel", 3)], good: ["Your lists and the ready-made ones sit together, up front", "Creating a list is easy to spot"], meh: ["Managing a list is a long-press"] },
  { name: "Kotak Neo", where: "India", has: [0], scan: "Themed lists such as pocket-friendly stocks", shots: cr("kotak", 1) },
  { name: "Groww", where: "India", has: [5], scan: "Up to 8 charts at once in its charts terminal, tied to the watchlist", shots: ["ex/r-groww", ...cr("groww", 1)], good: ["Add with a + and edit from the top right"], meh: ["Only pinned lists get a tab. The rest live on an All watchlists page"] },
  { name: "Zerodha Kite", where: "India", has: [], scan: "Up to 8 charts, on web only; notes and a 52-week toggle on the list", shots: ["ex/r-zerodha", ...cr("zerodha", 1)], good: ["Add stocks with search inside the list"], meh: ["You can’t create lists. Kite gives you fixed empty ones and long-press to edit"] },
  { name: "IndMoney", where: "India", shots: ["ex/r-indmoney"], good: ["Add stocks with a + icon"], meh: ["One list to start and creating another is at the end of a scroll"] },
  { name: "Webull", where: "Global", has: [4, 5], scan: "Multi-column lists with volume, OI and Greeks; chart grids with one indicator applied to all", shots: ["ex/r-webull", ...cr("webull", 3)], good: ["First-time users get stocks to pick from straight away", "Search to add sits at the bottom, in thumb reach"], meh: ["Editing and creating lists hide in a side panel"] },
  { name: "Robinhood", where: "Global", has: [2, 4], scan: "Lists built from 50+ criteria and a multi-column layout", shots: cr("robinhood", 3) },
];

// every screen of every app, in order, so the viewer can walk straight through
const FLAT = APPS.flatMap((a, ai) => a.shots.map((src, si) => ({ ai, si, src })));
const at = (ai: number, si: number) => FLAT.findIndex((f) => f.ai === ai && f.si === si);
const url = (s: string) => `/work/watchlist/${s}.jpg?v=7`;

const BEFORE = [0];
const AFTER = [0, 1, 2, 3, 4, 5];

const pad = (n: number) => String(n).padStart(2, "0");
const svg = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const navBtn = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 ring-1 ring-white/15 backdrop-blur transition hover:bg-white hover:text-black";

// Full view, laid out like the NPS journeys: progress by app on top, the screen
// on the left, the notes on the right, every screen as a thumbnail underneath.
function Viewer({ start, onClose, onApp }: { start: number; onClose: () => void; onApp: (ai: number) => void }) {
  const [k, setK] = useState(start);
  const strip = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const f = FLAT[k];
  const a = APPS[f.ai];
  const go = (d: number) => setK((x) => (x + d + FLAT.length) % FLAT.length);

  useEffect(() => { onApp(f.ai); }, [f.ai, onApp]);
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-k="${k}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [k]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const stop = (e: WheelEvent) => { if (!strip.current?.contains(e.target as Node)) { e.preventDefault(); e.stopPropagation(); } };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", stop, { passive: false, capture: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", stop, { capture: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex flex-col bg-[#0b0b0d] text-white" style={{ cursor: "auto" }} role="dialog" aria-modal="true" aria-label="Other apps, screen by screen">
      {/* top bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">Other apps’ watchlists</p>
          <p className="truncate text-xs text-white/45">{APPS.length} apps, {FLAT.length} screens</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-xs tabular-nums text-white/60">{pad(k + 1)} / {FLAT.length}</span>
          <button type="button" aria-label="Close" autoFocus onClick={onClose} className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-black">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3 3 13" /></svg>
          </button>
        </div>
      </div>

      {/* progress, one segment per app */}
      <div className="flex gap-1.5 px-4 sm:px-6">
        {APPS.map((x, ai) => {
          const first = at(ai, 0);
          const fill = ai < f.ai ? 100 : ai === f.ai ? ((f.si + 1) / x.shots.length) * 100 : 0;
          return (
            <button key={x.name} type="button" onClick={() => setK(first)} className="group/st min-w-0 text-left" style={{ flexGrow: x.shots.length, flexBasis: 0 }}>
              <span className="block h-[3px] overflow-hidden rounded-full bg-white/12">
                <span className="block h-full rounded-full bg-white transition-[width] duration-500 ease-out" style={{ width: `${fill}%` }} />
              </span>
              <span className={`mt-2 hidden truncate text-[11px] uppercase tracking-[0.12em] transition-colors md:block ${ai === f.ai ? "text-white" : "text-white/40 group-hover/st:text-white/70"}`}>{x.name}</span>
            </button>
          );
        })}
      </div>

      {/* screen + notes */}
      <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5 px-4 pb-3 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-1 lg:gap-10">
        <div
          className="relative order-2 min-h-[16rem] touch-pan-y select-none lg:order-1"
          onPointerDown={(e) => { swipe.current = e.clientX; }}
          onPointerUp={(e) => { if (swipe.current === null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={f.src} src={url(f.src)} alt={`${a.name} watchlist, screen ${f.si + 1}`} draggable={false} className="max-h-full max-w-full rounded-[1.4rem] object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 [animation:arIn_.3s_ease_both]" />
          </div>
          <button type="button" aria-label="Previous screen" onClick={() => go(-1)} className={`${navBtn} left-2 lg:left-[8%]`}>{svg("M10 3 5 8l5 5")}</button>
          <button type="button" aria-label="Next screen" onClick={() => go(1)} className={`${navBtn} right-2 lg:right-[8%]`}>{svg("m6 3 5 5-5 5")}</button>
        </div>

        <div key={a.name} className="order-1 max-h-[34vh] overflow-y-auto [animation:arIn_.3s_ease_both] lg:order-2 lg:max-h-none lg:self-center" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/45">{a.where} · Screen {f.si + 1} of {a.shots.length}</p>
          <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl lg:mt-4 lg:text-[1.75rem]">{a.name}</h3>
          {a.scan && <p className="mt-2 text-[15px] leading-relaxed text-white/65 lg:mt-4">{a.scan}</p>}
          {a.good && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-1">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5FD39A]">Worth taking</p>
                <ul className="mt-2 grid gap-1.5 text-[14px] leading-snug text-white/85">{a.good.map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#FF8A7A]">Where it gets in the way</p>
                <ul className="mt-2 grid gap-1.5 text-[14px] leading-snug text-white/85">{a.meh!.map((g) => <li key={g}>{g}</li>)}</ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* every screen */}
      <div ref={strip} className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 [scrollbar-width:none] sm:px-6">
        {FLAT.map((x, j) => (
          <button
            key={x.src}
            data-k={j}
            type="button"
            onClick={() => setK(j)}
            aria-label={`${APPS[x.ai].name}, screen ${x.si + 1}`}
            aria-current={j === k ? "step" : undefined}
            className={`h-16 w-[2.2rem] shrink-0 overflow-hidden rounded-md ring-1 transition duration-300 md:h-20 md:w-[2.75rem] ${x.si === 0 && j > 0 ? "ml-3" : ""} ${j === k ? "opacity-100 ring-2 ring-white" : "opacity-40 ring-white/10 hover:opacity-80"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url(x.src)} alt="" className="h-full w-full object-cover object-top" loading="eager" decoding="async" />
          </button>
        ))}
      </div>
      <p className="px-4 pb-4 text-center text-[11px] text-white/35 sm:px-6">
        Screens from our hands-on review and the 2025 Watchlist Insights review.<span className="hidden md:inline"> ← → to move · Esc to close</span>
      </p>
    </div>,
    document.body,
  );
}

export function AppReview() {
  const [row, setRow] = useState(0);
  const [after, setAfter] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const a = APPS[row];
  const ours = after ? AFTER : BEFORE;

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
        <p className="label">What each app’s watchlist could do</p>
        <button
          type="button"
          role="switch"
          aria-checked={after}
          onClick={() => setAfter((x) => !x)}
          className="flex items-center gap-3 rounded-[10px] bg-[#F4F2F7] py-1.5 pl-4 pr-1.5 text-sm font-medium"
        >
          Upstox {after ? "after the revamp" : "before the revamp"}
          <span className={`relative h-6 w-11 rounded-full transition-colors ${after ? "bg-[#5B2EBD]" : "bg-ink/20"}`}>
            <span className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-300 ${after ? "translate-x-5" : ""}`} />
          </span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_17rem]">
        {/* matrix: each row is also the app picker */}
        <div className="min-w-0 lg:border-r lg:border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-36 px-5 py-2.5 text-left text-xs font-medium text-muted md:pl-8">App</th>
                  {CAPS.map((c) => (
                    <th key={c} className="px-1.5 py-2.5 text-center text-[11px] font-medium leading-tight text-muted">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {APPS.map((x, k) => (
                  <tr
                    key={x.name}
                    onClick={() => setRow(k)}
                    onMouseEnter={() => setRow(k)}
                    className={`cursor-pointer border-b border-line transition-colors ${row === k ? "bg-ink text-bg" : "hover:bg-[#FAFAF8]"}`}
                  >
                    <td className="px-5 py-2.5 md:pl-8">
                      <button type="button" aria-pressed={row === k} onFocus={() => setRow(k)} className="flex items-baseline gap-2 whitespace-nowrap text-left outline-none">
                        <b className="font-semibold">{x.name}</b>
                        <span className={`text-[11px] ${row === k ? "text-bg/55" : "text-muted"}`}>{x.where}</span>
                      </button>
                    </td>
                    {CAPS.map((c, i) => (
                      <td key={c} className="px-1.5 py-2.5 text-center">
                        {!x.has ? (
                          <span aria-label="Not in the feature scan" className={`text-[11px] ${row === k ? "text-bg/40" : "text-ink/25"}`}>–</span>
                        ) : x.has.includes(i) ? (
                          <span aria-label="Yes" className={`inline-block size-2.5 rounded-full ${row === k ? "bg-bg" : "bg-ink/80"}`} />
                        ) : (
                          <span aria-label="Not seen" className={`inline-block size-1 rounded-full ${row === k ? "bg-bg/30" : "bg-ink/15"}`} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className={`transition-colors duration-500 ${after ? "bg-[#F4F0FB]" : "bg-[#FBF3F2]"}`}>
                  <td className="px-5 py-3 md:pl-8">
                    <b className="font-semibold">Upstox</b>
                    <span className={`ml-2 text-[11px] font-medium ${after ? "text-[#5B2EBD]" : "text-[#B4321F]"}`}>{after ? "2026" : "2023–25"}</span>
                  </td>
                  {CAPS.map((c, i) => (
                    <td key={c} className="px-1.5 py-3 text-center">
                      <span
                        className="inline-block rounded-full align-middle transition-all duration-500"
                        style={{
                          width: ours.includes(i) ? 12 : 5,
                          height: ours.includes(i) ? 12 : 5,
                          background: ours.includes(i) ? "#5B2EBD" : "#D93A2B",
                          opacity: ours.includes(i) ? 1 : 0.5,
                          transitionDelay: `${i * 0.06}s`,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="px-5 py-4 text-xs text-muted md:px-8">
            A dash means the app wasn’t part of the feature scan. Old Upstox gets a dot for ready-made lists because smartlists existed; hardly anyone found them.
          </p>
        </div>

        {/* the selected app: screenshots only; notes live in the full view */}
        <div key={a.name} className="flex items-start gap-5 border-t border-line p-5 [animation:arIn_.35s_ease_both] lg:flex-col lg:items-center lg:border-t-0 lg:p-6">
          <div className="w-[9.5rem] shrink-0 lg:w-[12.5rem]">
            <button type="button" onClick={() => setOpen(at(row, 0))} aria-label={`Open ${a.name} screenshots and notes`} data-cursor="View" className="group relative block w-full cursor-zoom-in [container-type:inline-size]">
              <span className="block overflow-hidden rounded-[13.5cqw] bg-[#16121c] p-[2.4cqw] transition-transform duration-300 group-hover:-translate-y-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url(a.shots[0])} alt={`${a.name} watchlist, from our review`} className="block aspect-[720/1560] w-full rounded-[11.2cqw] object-cover object-top" loading="eager" decoding="async" />
              </span>
              <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-ink/85 px-2.5 py-1.5 text-[11px] font-medium text-bg backdrop-blur">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" /></svg>
                {a.shots.length > 1 ? `${a.shots.length} screens` : "Expand"}
              </span>
            </button>
            {a.shots.length > 1 && (
              <div className="mt-3 flex gap-1.5">
                {a.shots.slice(1).map((s, i) => (
                  <button key={s} type="button" onClick={() => setOpen(at(row, i + 1))} aria-label={`Open ${a.name} screen ${i + 2}`} className="h-12 flex-1 overflow-hidden rounded-md border border-line opacity-80 transition-opacity hover:opacity-100 lg:h-14">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url(s)} alt="" className="h-full w-full object-cover object-top" loading="eager" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0 lg:w-[12.5rem]">
            <p className="text-lg font-semibold leading-tight">{a.name} <span className="text-xs font-normal text-muted">{a.where}</span></p>
            <button type="button" onClick={() => setOpen(at(row, 0))} className="mt-1.5 text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">Screens and notes →</button>
          </div>
        </div>
      </div>
      {open !== null && <Viewer start={open} onClose={() => setOpen(null)} onApp={setRow} />}
      <style>{`@keyframes arIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
