"use client";

import { useEffect, useRef, useState } from "react";

// Why the table had to move to its own page. Counts the extra column values the
// app would request: inline, every landing on My lists refetches them; on demand,
// only opening Table view does. Illustration of the trade-off, not production data.
// Drawn as two grainy, shaded half-discs on one baseline, their areas to scale with each other,
// each called out with a thin leader line.

const INLINE = "#EE6A3C";
const DEMAND = "#5B2EBD";
const INK = "#2A1B3D";
const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

function Slider({ label, value, min, max, step = 1, onChange, hint }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; hint?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[15px]">{label}</span>
        <b className="font-mono text-lg font-medium tabular-nums">{value}</b>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)}
        className="cs-range mt-3 w-full"
        style={{ background: `linear-gradient(to right, ${INK} ${pct}%, rgba(42,27,61,0.12) ${pct}%)` }}
      />
      {hint && <span className="mt-2 block text-xs leading-relaxed text-muted">{hint}</span>}
    </label>
  );
}

// eases displayed numbers toward their targets so shapes, lines and counts move together
function useTween(targets: number[], ms = 520) {
  const [v, setV] = useState(targets);
  const from = useRef(targets);
  const cur = useRef(targets);
  const key = targets.join(",");
  useEffect(() => {
    const to = key.split(",").map(Number);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cur.current = to; setV(to); return; }
    from.current = cur.current; const t0 = performance.now(); let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms); const e = 1 - Math.pow(1 - k, 3);
      const n = to.map((x, i) => from.current[i] + (x - from.current[i]) * e);
      cur.current = n; setV(n);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [key, ms]);
  return v;
}

const X0 = 20, REF = 3000;
// two drawing sizes so the callout text stays readable on a phone
const WIDE = { W: 760, BASE: 380, RMAX: 176, LEN: 236, num: 46, lab: 12, ls: 1.2 };
const NARROW = { W: 400, BASE: 160, RMAX: 150, LEN: 0, num: 0, lab: 0, ls: 0 }; // shapes only; numbers sit below as text
type Geo = typeof WIDE;

// leader runs up from the dot, turns and becomes the underline the number sits on;
// the text starts past the turn so the line never crosses it
function Callout({ g, dot, top, value, label, color }: { g: Geo; dot: [number, number]; top: number; value: number; label: string; color: string }) {
  const [dx, dy] = dot; const { W, LEN } = g;
  const left = dx + LEN + 12 > W; // no room on the right: run the line to the left
  const s = left ? -1 : 1, tx = dx + s * 22, end = dx + s * LEN;
  return (
    <g>
      <path d={`M${dx} ${dy} V${top + 8} Q${dx} ${top} ${dx + s * 8} ${top} H${end}`} stroke={INK} strokeWidth="1.2" fill="none" />
      <circle cx={dx} cy={dy} r="4" fill="#fff" stroke={INK} strokeWidth="1.4" />
      <text x={tx} y={top - 12} textAnchor={left ? "end" : "start"} fontSize={g.num} fontWeight="600" letterSpacing="-2" fill={color} style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(value)}</text>
      <text x={tx} y={top + 22} textAnchor={left ? "end" : "start"} fontSize={g.lab} letterSpacing={g.ls} fill="#6E6E6E" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{label}</text>
    </g>
  );
}

export function CostSim() {
  const [stocks, setStocks] = useState(50);
  const [cols, setCols] = useState(6);
  const [visits, setVisits] = useState(10);
  const [opens, setOpens] = useState(2);
  const inline = stocks * cols * visits;
  const op = Math.min(opens, visits); // Table view opens from My lists, so never more often than landing there
  const demand = stocks * cols * op;
  const [vi, vd] = useTween([inline, demand]);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 640px)"); const on = () => setNarrow(m.matches);
    on(); m.addEventListener("change", on); return () => m.removeEventListener("change", on);
  }, []);
  const g = narrow ? NARROW : WIDE; const { W, BASE, RMAX } = g;

  // Areas stay to scale with each other. Below a typical session the shapes grow
  // with the sliders; past it the larger one holds its size and the smaller shrinks.
  const M = Math.max(vi, vd, REF);
  let R1 = RMAX * Math.sqrt(vi / M), R2 = RMAX * Math.sqrt(vd / M);
  const k = Math.min(1, (W - 2 * X0 - 16) / (2 * R1 + 2 * R2 || 1)); R1 *= k; R2 *= k; // both always fit side by side
  const c1 = X0 + R1, c2 = c1 + R1 + 16 + R2;
  const onShape = (cx: number, r: number, a: number): [number, number] => [cx + r * 0.6 * Math.cos(a), BASE - r * 0.6 * Math.sin(a)];
  const d1 = onShape(c1, R1, 1.05);
  const d2: [number, number] = R2 > 2 ? onShape(c2, R2, 1.2) : [c2, BASE - 1];
  const ratio = demand ? inline / demand : null;

  return (
    <div className="grid gap-10 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:p-10 lg:grid-cols-[17rem_1fr] lg:gap-14">
      <div className="grid content-start gap-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">One trader, one session</p>
        <Slider label="Stocks in the list" value={stocks} min={10} max={100} step={5} onChange={setStocks} hint="Lists of more than 50 were common." />
        <Slider label="Extra columns picked" value={cols} min={1} max={15} onChange={setCols} />
        <Slider label="Times they land on My lists" value={visits} min={1} max={30} onChange={setVisits} hint="Every switch back from Orders and every app reopen." />
        <Slider label="Times they open Table view" value={op} min={0} max={Math.min(10, visits)} onChange={setOpens} hint="Never more than they land on My lists." />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 border-b border-line pb-5">
          <p className="text-[4.5rem] font-semibold leading-[0.85] tracking-[-0.06em] md:text-[6rem]" style={{ color: DEMAND }}>
            {ratio === null ? "0" : ratio >= 10 ? Math.round(ratio) : Math.round(ratio * 10) / 10}
            <span className="text-[0.45em] tracking-[-0.02em]">{ratio === null ? "" : "×"}</span>
          </p>
          <p className="max-w-[17rem] pb-1 text-[15px] leading-snug text-muted">
            {ratio === null ? "column values fetched for the table when nobody opens it." : ratio > 1 ? "fewer column values to fetch when the table opens on demand." : "Open Table view on every visit and the two cost the same. Most people don’t."}
          </p>
        </div>

        <svg viewBox={`0 0 ${W} ${BASE + 4}`} className="mt-4 w-full overflow-visible" role="img" aria-label={`Table loads with My lists: ${fmt(inline)} column values. Table opens on demand: ${fmt(demand)}.`}>
          <defs>
            <clipPath id="cs-up"><rect x="0" y="0" width={W} height={BASE} /></clipPath>
            {/* the illustration shading: a pale highlight up left, the colour, a deeper shade low right */}
            <radialGradient id="cs-g1" cx="0.3" cy="0.12" r="0.95"><stop offset="0" stopColor="#FFD9C2" /><stop offset="0.45" stopColor={INLINE} /><stop offset="1" stopColor="#C9373F" /></radialGradient>
            <radialGradient id="cs-g2" cx="0.3" cy="0.12" r="0.95"><stop offset="0" stopColor="#9DB6F7" /><stop offset="0.45" stopColor="#7B55E8" /><stop offset="1" stopColor={DEMAND} /></radialGradient>
            {/* chalky finish, like the illustrations: the edge breaks up into speckle
                (spread evenly either side of the true edge, so areas stay comparable)
                and light and dark grain runs through the body */}
            <filter id="cs-grain" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="soft" />
              <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="col" />
              <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="4" stitchTiles="stitch" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 0 0 0 -0.2" result="nz" />
              <feComposite in="soft" in2="nz" operator="arithmetic" k2="1" k3="-1" result="diff" />
              <feComponentTransfer in="diff" result="mask"><feFuncA type="linear" slope="40" intercept="0" /></feComponentTransfer>
              <feComposite in="col" in2="mask" operator="in" result="body" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.35" result="lite" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0 0.25  0 0 0 -1.5 0.5" result="dark" />
              <feMerge result="specks"><feMergeNode in="lite" /><feMergeNode in="dark" /></feMerge>
              <feComposite in="specks" in2="body" operator="in" result="inside" />
              <feMerge><feMergeNode in="body" /><feMergeNode in="inside" /></feMerge>
            </filter>
          </defs>
          <g clipPath="url(#cs-up)">
            <circle cx={c1} cy={BASE} r={R1} fill="url(#cs-g1)" filter="url(#cs-grain)" />
            {R2 > 0.5 && <circle cx={c2} cy={BASE} r={R2} fill="url(#cs-g2)" filter="url(#cs-grain)" />}
          </g>
          <line x1="0" x2={W} y1={BASE + 0.5} y2={BASE + 0.5} stroke={INK} strokeOpacity="0.2" />
          {!narrow && <>
          <Callout g={g} dot={d1} top={Math.min(d1[1] - 60, 84)} value={vi} label="TABLE LOADS WITH MY LISTS" color={INLINE} />
          <Callout g={g} dot={d2} top={Math.min(d2[1] - 60, BASE - 150)} value={vd} label="TABLE OPENS ON DEMAND" color={DEMAND} />
          </>}
        </svg>
        {narrow && (
          <dl className="mt-5 grid grid-cols-2 gap-5">
            {([[vi, "Table loads with My lists", INLINE], [vd, "Table opens on demand", DEMAND]] as const).map(([v, t, c]) => (
              <div key={t}>
                <dd className="border-b pb-1 text-3xl font-semibold tabular-nums tracking-[-0.04em]" style={{ color: c, borderColor: INK }}>{fmt(v)}</dd>
                <dt className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.1em] text-muted">{t}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 grid gap-5 border-t border-line pt-5 text-sm leading-relaxed text-muted sm:grid-cols-2">
          <p><span className="mr-2 inline-block size-2.5 rounded-full align-middle" style={{ background: INLINE }} /><b className="font-semibold text-ink">What we designed first.</b> Remembering the view meant every landing pulled every column for every stock.</p>
          <p><span className="mr-2 inline-block size-2.5 rounded-full align-middle" style={{ background: DEMAND }} /><b className="font-semibold text-ink">What shipped.</b> Column data is fetched only when someone asks for it, for one list.</p>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">Column values requested = stocks × columns × loads. The two shapes’ areas are to scale with each other. An illustration of the argument, not production numbers. Live prices stream either way.</p>
      </div>

      <style>{`
        .cs-range { -webkit-appearance: none; appearance: none; height: 2px; border-radius: 2px; outline: none; cursor: pointer; }
        .cs-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 1.5px solid ${INK}; cursor: grab; }
        .cs-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 1.5px solid ${INK}; cursor: grab; }
        .cs-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(91,46,189,0.2); }
      `}</style>
    </div>
  );
}
