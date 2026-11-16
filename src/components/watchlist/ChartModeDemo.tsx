"use client";

import { useMemo, useState } from "react";

// A small working copy of Chart mode's control bar. Every setting applies to
// every card, the way the app does it. Prices are made up.

const TF = [
  { k: "5m", day: 12 },
  { k: "15m", day: 8 },
  { k: "1H", day: 6 },
  { k: "1D", day: 0 },
  { k: "1W", day: 0 },
] as const;
type Tf = (typeof TF)[number]["k"];
const OVERLAYS = ["EMA 20", "EMA 50", "VWAP"] as const;
type Ov = (typeof OVERLAYS)[number];
const OV_COLOR: Record<Ov, string> = { "EMA 20": "#5B2EBD", "EMA 50": "#C77700", VWAP: "#1F7AE0" };

const CARDS = [
  { name: "Stock A", seed: 3, index: false },
  { name: "Stock B", seed: 8, index: false },
  { name: "Stock C", seed: 13, index: false },
  { name: "An index", seed: 21, index: true },
];

const SHOWN = 30; // candles on a card
const WARMUP = 60; // extra history so the lines start at the left edge

type C = { o: number; h: number; l: number; c: number; v: number };

function candles(seed: number, tf: Tf): C[] {
  const s = seed * 7 + TF.findIndex((t) => t.k === tf) * 131;
  let r = s;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  const vol = { "5m": 0.004, "15m": 0.006, "1H": 0.009, "1D": 0.016, "1W": 0.03 }[tf];
  const drift = (seed % 3 === 0 ? 1 : seed % 3 === 1 ? -0.6 : 0.3) * vol * 0.25;
  let p = 100 + (seed % 5) * 40;
  const out: C[] = [];
  for (let i = 0; i < SHOWN + WARMUP; i++) {
    const o = p;
    const c = o * (1 + drift + (rnd() - 0.5) * vol * 2);
    const h = Math.max(o, c) * (1 + rnd() * vol * 0.6);
    const l = Math.min(o, c) * (1 - rnd() * vol * 0.6);
    out.push({ o, h, l, c, v: 0.3 + rnd() + Math.abs(c - o) / o / vol });
    p = c;
  }
  return out;
}

function ema(cs: C[], n: number) {
  const k = 2 / (n + 1);
  let e = cs[0].c;
  return cs.map((x) => (e = x.c * k + e * (1 - k)));
}

// resets every trading day on intraday timeframes, runs from the first
// visible candle on 1D and 1W
function vwap(cs: C[], tf: Tf) {
  const day = TF.find((t) => t.k === tf)!.day;
  let pv = 0, vv = 0;
  return cs.map((x, i) => {
    const vis = i - WARMUP;
    if (day ? vis % day === 0 || i === 0 : vis === 0) { pv = 0; vv = 0; }
    const tp = (x.h + x.l + x.c) / 3;
    pv += tp * x.v; vv += x.v;
    return vis < 0 && !day ? NaN : pv / vv;
  });
}

function Card({ card, tf, line, ovs, volume, big, cls }: { card: (typeof CARDS)[number]; tf: Tf; line: boolean; ovs: Ov[]; volume: boolean; big: boolean; cls: string }) {
  const all = useMemo(() => candles(card.seed, tf), [card.seed, tf]);
  const lines = useMemo(() => {
    const m: Partial<Record<Ov, number[]>> = {};
    for (const o of ovs) m[o] = (o === "VWAP" ? vwap(all, tf) : ema(all, o === "EMA 20" ? 20 : 50)).slice(WARMUP);
    return m;
  }, [all, ovs, tf]);
  const cs = all.slice(WARMUP);
  const W = big ? 640 : 300, H = big ? 96 : 120, VH = volume && !card.index ? 26 : 0, PH = H - VH - 4;
  const vals = [...cs.flatMap((x) => [x.h, x.l]), ...Object.values(lines).flat().filter((v) => !Number.isNaN(v))];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const y = (v: number) => 4 + (1 - (v - lo) / (hi - lo || 1)) * (PH - 8);
  const step = W / cs.length, bw = Math.min(step * 0.62, 9);
  const vmax = Math.max(...cs.map((x) => x.v));
  const last = cs[cs.length - 1], first = cs[0];
  const chg = ((last.c - first.o) / first.o) * 100;
  const up = chg >= 0;
  return (
    <div className={`px-1 md:px-5 ${big ? "py-3.5" : "py-5"} [animation:cmIn_.45s_ease_both] ${cls}`} key={`${tf}${line}${ovs.join()}${volume}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-2">
        <b className="text-sm font-semibold tracking-[-0.01em]">{card.name}</b>
        <span className="flex items-center gap-2 text-xs tabular-nums">
          <span className="text-ink">{last.c.toFixed(2)}</span>
          <span className={`rounded-[5px] px-1.5 py-0.5 text-[11px] font-medium ${up ? "bg-[#E6F5EE] text-[#0E7A48]" : "bg-[#FCEBE8] text-[#B4321F]"}`}>{up ? "+" : "−"}{Math.abs(chg).toFixed(2)}%</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block w-full" aria-hidden>
        {line ? (
          <polyline fill="none" stroke={up ? "#0E7A48" : "#B4321F"} strokeWidth="1.6" points={cs.map((x, i) => `${(i + 0.5) * step},${y(x.c)}`).join(" ")} />
        ) : (
          cs.map((x, i) => {
            const g = x.c >= x.o, cx = (i + 0.5) * step;
            return (
              <g key={i} stroke={g ? "#0E7A48" : "#D93A2B"} fill={g ? "#0E7A48" : "#D93A2B"}>
                <line x1={cx} x2={cx} y1={y(x.h)} y2={y(x.l)} strokeWidth="1" />
                <rect x={cx - bw / 2} y={y(Math.max(x.o, x.c))} width={bw} height={Math.max(1, Math.abs(y(x.o) - y(x.c)))} />
              </g>
            );
          })
        )}
        {ovs.map((o) => (
          <polyline key={o} fill="none" stroke={OV_COLOR[o]} strokeWidth="1.5" points={lines[o]!.map((v, i) => (Number.isNaN(v) ? null : `${(i + 0.5) * step},${y(v)}`)).filter(Boolean).join(" ")} />
        ))}
        {VH > 0 &&
          cs.map((x, i) => (
            <rect key={i} x={(i + 0.5) * step - bw / 2} y={H - (x.v / vmax) * VH} width={bw} height={(x.v / vmax) * VH} fill={x.c >= x.o ? "#0E7A48" : "#D93A2B"} opacity="0.3" />
          ))}
      </svg>
      {card.index && volume && <p className="mt-1 text-[10px] text-muted">No volume bars: an index has no traded volume.</p>}
    </div>
  );
}

// segmented control: a soft track with the selected option lifted onto white
const track = "inline-flex rounded-[10px] bg-[#F4F2F7] p-1";
const seg = (on: boolean) =>
  `px-3 py-1.5 text-xs font-medium transition-all duration-200 ${on ? "rounded-[7px] bg-white text-ink shadow-[0_0_0_1px_rgba(42,27,61,0.08)]" : "rounded-[7px] text-muted hover:text-ink"}`;
const ind = (on: boolean) =>
  `inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs font-medium transition-colors ${on ? "bg-[#F4F2F7] text-ink" : "text-muted hover:text-ink"}`;

function Ctl({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 lg:col-span-1" : ""}>
      <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</p>
      {children}
    </div>
  );
}

export function ChartModeDemo() {
  const [tf, setTf] = useState<Tf>("1D");
  const [line, setLine] = useState(false);
  const [grid, setGrid] = useState(true);
  const [ovs, setOvs] = useState<Ov[]>([]);
  const [volume, setVolume] = useState(false);
  const full = ovs.length >= 2;
  const toggle = (o: Ov) => setOvs(ovs.includes(o) ? ovs.filter((x) => x !== o) : full ? ovs : [...ovs, o]);
  const n = ovs.length + (volume ? 1 : 0);

  const shown = grid ? CARDS : CARDS.slice(0, 3);
  return (
    <div className="grid gap-6 rounded-[1.5rem] bg-white p-5 shadow-[0_0_0_1px_rgba(42,27,61,0.05),0_30px_70px_-34px_rgba(42,27,61,0.35)] md:p-7 lg:grid-cols-[12.5rem_1fr] lg:gap-10">
      <div className="grid grid-cols-2 content-start gap-5 lg:grid-cols-1">
        <Ctl label="Layout">
          <div className={track} role="group" aria-label="Layout">
            <button type="button" aria-pressed={grid} onClick={() => setGrid(true)} className={seg(grid)}>Grid</button>
            <button type="button" aria-pressed={!grid} onClick={() => setGrid(false)} className={seg(!grid)}>List</button>
          </div>
        </Ctl>
        <Ctl label="Chart">
          <div className={track} role="group" aria-label="Chart type">
            <button type="button" aria-pressed={!line} onClick={() => setLine(false)} className={seg(!line)}>Candles</button>
            <button type="button" aria-pressed={line} onClick={() => setLine(true)} className={seg(line)}>Line</button>
          </div>
        </Ctl>
        <Ctl label="Interval" wide>
          <div className={track} role="group" aria-label="Interval">
            {TF.map((t) => (
              <button key={t.k} type="button" aria-pressed={tf === t.k} onClick={() => setTf(t.k)} className={`${seg(tf === t.k)} !px-2.5`}>{t.k}</button>
            ))}
          </div>
        </Ctl>
        <Ctl wide label={`Indicators${n ? ` · ${n}` : ""}`}>
          <div className="-ml-2.5 flex flex-wrap gap-1 lg:grid lg:justify-items-start">
            {OVERLAYS.map((o) => {
              const on = ovs.includes(o), off = !on && full;
              return (
                <button key={o} type="button" aria-pressed={on} disabled={off} onClick={() => toggle(o)} className={`${ind(on)} disabled:cursor-not-allowed disabled:opacity-35`}>
                  <span className="size-2 rounded-full transition-all" style={on ? { background: OV_COLOR[o] } : { boxShadow: `inset 0 0 0 1.5px ${OV_COLOR[o]}` }} />{o}
                </button>
              );
            })}
            <button type="button" aria-pressed={volume} onClick={() => setVolume(!volume)} className={ind(volume)}>
              <span className="size-2 rounded-[2px] transition-all" style={volume ? { background: "#9A93A6" } : { boxShadow: "inset 0 0 0 1.5px #9A93A6" }} />Volume
            </button>
          </div>
          <span className="mt-1 block min-h-4 text-[11px] text-muted">{full ? "Two overlays is the limit." : ""}</span>
        </Ctl>
        <p className="hidden text-[11px] leading-relaxed text-muted lg:block">Made-up prices. Change anything here and every chart redraws with it.</p>
      </div>

      <div className="min-w-0">
        <div className={`grid ${grid ? "grid-cols-2" : "grid-cols-1"}`}>
          {shown.map((c, i) => (
            <Card key={c.name} card={c} tf={tf} line={line} ovs={ovs} volume={volume} big={!grid}
              cls={`${i < shown.length - (grid ? 2 : 1) ? "border-b border-line" : ""} ${grid && i % 2 === 0 ? "border-r border-line md:pl-0" : ""} ${grid && i % 2 === 1 ? "md:pr-0" : ""} ${grid ? "" : "md:!px-0"} ${i < (grid ? 2 : 1) ? "!pt-0" : ""}`} />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted lg:hidden">Made-up prices. Change anything above and every chart redraws with it.</p>
      </div>
      <style>{`@keyframes cmIn{from{opacity:.25}to{opacity:1}}`}</style>
    </div>
  );
}
