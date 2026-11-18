"use client";

import { useEffect, useState } from "react";

// The four NPS stories drawn in the Upstox invest-story style (reference: the Gold and SGB
// stories): white ground, deep plum headings, a teal kicker, flat teal and hairline isometric
// shapes, halftone dots, pale-teal icon discs and flat bar charts. Each piece arrives on its
// own beat, as in the originals. The player (NpsStories.tsx) supplies the frame and chrome.

export const STORY_BG = "#FFFFFF";
const PLUM = "#2A0E4E";
const INK = "#262626";
const GREY = "#6A6A6A";
const TEAL = "#7DCFCF";
const TEAL_TEXT = "#16939B";
const DISC = "#E2EEF1";
const BAR = "#C5E4E6";
const GREEN = "#1E8E6B";
const LINE = "#1F2A2E";
// Hairline weight for the illustrations.
const HAIR = 0.6;

/** Animation delay in seconds, as an inline style. */
const at = (s: number): React.CSSProperties => ({ animationDelay: `${s}s` });

function Rise({ d = 0, children, className = "" }: { d?: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`story-rise ${className}`} style={at(d)}>
      {children}
    </div>
  );
}

/* ---------- background elements ---------- */

function Halftone({ size, className = "", dark = false, d = 0 }: { size: number; className?: string; dark?: boolean; d?: number }) {
  return (
    <span
      aria-hidden
      className={`story-fade absolute rounded-full ${className}`}
      style={{
        ...at(d),
        width: size,
        height: size,
        backgroundImage: `radial-gradient(${dark ? "#3b3f4a" : "#c9c5d2"} 1.3px, transparent 1.6px)`,
        backgroundSize: "7px 7px",
        maskImage: "radial-gradient(circle at 65% 40%, #000 30%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(circle at 65% 40%, #000 30%, transparent 72%)",
      }}
    />
  );
}

/** The folded teal shard from the Gold intro. */
function Shard({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 124"
      className={`story-drift absolute ${className}`}
      style={{ ...at(0.1), "--dx": "-26px", "--dy": "18px" } as React.CSSProperties}
      fill="none"
      stroke={LINE}
      strokeWidth={HAIR}
      strokeLinejoin="round"
    >
      <polygon points="76,2 2,96 20,120" fill={TEAL} />
      <polygon points="76,2 20,120 48,112" fill="#fff" />
    </svg>
  );
}

function Sparkle({ className = "", size = 12, d = 0 }: { className?: string; size?: number; d?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" width={size} height={size} className={`story-twinkle absolute ${className}`} style={at(d)}>
      <path d="M10 0 C10.8 6 14 9.2 20 10 C14 10.8 10.8 14 10 20 C9.2 14 6 10.8 0 10 C6 9.2 9.2 6 10 0Z" fill="#F0A64A" />
    </svg>
  );
}

/* ---------- isometric icons ---------- */

/** A stack of n coins: white top, teal edge, hairline outline and a flat shadow. Coins drop in one by one from `d`. */
function Coins({ n, x = 0, y = 0, r = 13, d = 0 }: { n: number; x?: number; y?: number; r?: number; d?: number }) {
  const ry = r * 0.5;
  const t = 4.5;
  return (
    <g transform={`translate(${x} ${y})`} stroke={LINE} strokeWidth={HAIR} strokeLinejoin="round">
      <ellipse className="story-fade" style={at(d)} cx={r * 0.3} cy={ry * 0.5} rx={r} ry={ry} fill={LINE} stroke="none" />
      {Array.from({ length: n }, (_, i) => {
        const cy = -i * t;
        return (
          <g key={i} className="story-drop" style={at(d + i * 0.09)}>
            <path d={`M${-r} ${cy - t} v${t} a${r} ${ry} 0 0 0 ${2 * r} 0 v${-t}`} fill={TEAL} />
            <ellipse cx="0" cy={cy - t} rx={r} ry={ry} fill="#fff" />
            {i === n - 1 && <ellipse cx="0" cy={cy - t} rx={r * 0.55} ry={ry * 0.55} fill="none" />}
          </g>
        );
      })}
    </g>
  );
}

function Disc({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  return (
    <span className="story-pop relative z-10 grid size-[62px] shrink-0 place-items-center rounded-full" style={{ ...at(d), background: DISC }}>
      <svg viewBox="-31 -31 62 62" width="62" height="62" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

/** The check-on-a-coin bullet from the "Benefits" story. */
function CheckCoin() {
  return (
    <svg viewBox="0 0 36 36" width="34" height="34" aria-hidden className="shrink-0">
      <ellipse cx="15" cy="18.5" rx="9.5" ry="13" transform="rotate(18 15 18.5)" fill="#F08A6B" stroke={LINE} strokeWidth={HAIR} />
      <ellipse cx="19" cy="18" rx="9.5" ry="13" transform="rotate(18 19 18)" fill="#fff" stroke={LINE} strokeWidth={HAIR} />
      <path className="story-check" style={at(1.55)} pathLength={1} d="M14.5 19.5l3 3.2 5.2-8" fill="none" stroke={TEAL_TEXT} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Counts up to `to` once, starting after `delay` seconds. Shows the final number at once under reduced motion. */
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 900));
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delay]);
  return <>{v.toLocaleString("en-IN")}</>;
}

/* ---------- the four stories ---------- */

function Intro() {
  return (
    <>
      <Shard className="-left-5 top-[70px] w-[58px]" />
      <Halftone dark size={170} className="-right-[104px] top-[58px]" d={0.15} />
      <span
        aria-hidden
        className="story-drift absolute -left-[70px] bottom-[36px] size-[150px] rounded-full"
        style={{ ...at(0.2), background: TEAL, "--dx": "-40px", "--dy": "40px" } as React.CSSProperties}
      />

      <div className="relative mt-[78px] text-center">
        <Rise d={0.1}>
          <p className="text-[14px] font-medium" style={{ color: TEAL_TEXT }}>Introducing</p>
        </Rise>
        <Rise d={0.22}>
          <h4 className="mt-2 text-[27px] font-[700] leading-[32px] tracking-[-0.9px]" style={{ color: PLUM }}>
            National Pension
            <br />
            Scheme
          </h4>
        </Rise>
        <Rise d={0.4}>
          <p className="mt-3 text-[13px] leading-5" style={{ color: INK }}>Government-backed retirement savings</p>
        </Rise>

        <Rise d={0.7}>
          <p className="mt-9 text-[13px] font-medium" style={{ color: TEAL_TEXT }}>Save tax up to</p>
          <p className="relative mx-auto mt-1 w-fit tabular-nums leading-[56px]" style={{ color: PLUM, fontSize: 50, fontWeight: 700, letterSpacing: "-2px" }}>
            ₹<CountUp to={15600} delay={0.75} />
            <Sparkle className="-left-4 -top-1" size={14} d={1.5} />
            <Sparkle className="-right-4 bottom-1" size={9} d={1.8} />
            <Sparkle className="-right-2 bottom-4" size={6} d={2.1} />
          </p>
          <p className="mt-1 text-[12px]" style={{ color: GREY }}>On ₹50k, under 80CCD(1)</p>
        </Rise>
      </div>

      <Rise d={1.25} className="relative mt-7 flex items-center gap-3 rounded-2xl bg-[#F4F8F9] px-3.5 py-3">
        <CheckCoin />
        <p className="text-[12.5px] font-[600] leading-[17px]" style={{ color: INK }}>
          Additionally, save up to ₹46,800
          <span className="block font-normal" style={{ color: GREY }}>Using ₹1.5 L as an alternate to 80C</span>
        </p>
      </Rise>
    </>
  );
}

function Life() {
  const stops = [
    { age: "Today", act: "Invest up to ₹50k a year", note: "Tax exemption up to ₹15,600 u/s 80CCD(1)", lock: true, icon: (d: number) => <Coins n={1} y={6} d={d} /> },
    { age: "At 60", act: "Withdraw 60% of your corpus", note: "All tax-free", icon: (d: number) => <Coins n={5} y={14} d={d} /> },
    {
      age: "After 60",
      act: "Monthly or yearly pension",
      note: "Taxed as per your slab",
      icon: (d: number) => (
        <>
          <Coins n={2} x={-11} y={2} r={8} d={d} />
          <Coins n={2} x={10} y={4} r={8} d={d + 0.12} />
          <Coins n={2} x={-1} y={15} r={8} d={d + 0.24} />
        </>
      ),
    },
  ];
  return (
    <>
      <Halftone size={190} className="-right-[110px] top-[40px]" d={0.1} />
      <Halftone size={150} className="-left-[100px] bottom-[70px]" d={0.2} />

      <Rise d={0.05} className="relative mt-9">
        <p className="text-[13px] font-medium" style={{ color: TEAL_TEXT }}>How NPS works</p>
        <h4 className="mt-1.5 text-[25px] font-[700] leading-[30px] tracking-[-0.8px]" style={{ color: PLUM }}>
          Invest now, get
          <br />
          paid after 60
        </h4>
      </Rise>

      <div className="relative mt-9 flex flex-col gap-[34px]">
        <span aria-hidden className="story-growy absolute bottom-8 left-[30px] top-8 border-l border-dashed" style={{ ...at(0.6), borderColor: "#8FB9BE", animationDuration: "1.5s" }} />
        {stops.map((s, i) => {
          const d = 0.4 + i * 0.6;
          return (
            <div key={s.age} className="flex items-center gap-3.5">
              <Disc d={d}>{s.icon(d + 0.15)}</Disc>
              <Rise d={d + 0.2} className="min-w-0">
                <p className="text-[10.5px] font-[700] uppercase tracking-[1.1px]" style={{ color: TEAL_TEXT }}>{s.age}</p>
                <p className="mt-0.5 text-[15px] font-[600] leading-5 tracking-[-0.2px]" style={{ color: INK }}>{s.act}</p>
                <p className="mt-0.5 text-[12px] leading-4" style={{ color: GREY }}>
                  {s.note}
                  {s.lock && <span className="block font-medium" style={{ color: TEAL_TEXT }}>Locked till 60</span>}
                </p>
              </Rise>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Rules() {
  // [label in block, block height, side colour, title, rule lines]
  const blocks: [string, number, string, string, string[]][] = [
    ["3 YRS", 70, "#DDF1F1", "Partial withdrawal", ["Allowed 3 times, 5 yrs", "apart, in special cases"]],
    ["10 YRS", 88, "#B5E2E2", "Premature exit", ["100% lump sum under ₹1L", "Above ₹1L: 80% lump sum,", "rest as pension"]],
    ["AT 60", 88, TEAL, "On maturity", ["100% lump sum under ₹5L", "Above ₹5L: 60% lump sum,", "rest as pension"]],
    ["ANY", 44, "#2F9AA0", "On death", ["100% to your nominee"]],
  ];
  let y = 14;
  const base = 14 + blocks.reduce((t, b) => t + b[1], 0) + 12 * (blocks.length - 1);
  return (
    <>
      <Halftone size={180} className="-right-[112px] top-[34px]" d={0.1} />
      <Halftone size={140} className="-left-[96px] bottom-[60px]" d={0.2} />

      <Rise d={0.05} className="relative mt-9">
        <p className="text-[13px] font-medium" style={{ color: TEAL_TEXT }}>Withdrawal rules</p>
        <h4 className="mt-1.5 text-[25px] font-[700] leading-[30px] tracking-[-0.8px]" style={{ color: PLUM }}>
          When money
          <br />
          comes out
        </h4>
      </Rise>

      <svg viewBox="0 0 244 344" width="244" height="344" className="relative ml-1 mt-7 block overflow-visible" role="img" aria-label="NPS withdrawal rules as a stacked pillar">
        {/* one shadow for the whole pillar, cast on the ground to the right of its base */}
        <polygon className="story-fade" style={at(0.35)} points={`32,${base} 46,${base - 8} 58,${base - 8} 44,${base}`} fill={LINE} opacity="0.9" />
        {blocks.map(([tag, h, side, title, lines], i) => {
          const top = y;
          y += h + 12;
          const d = 0.4 + i * 0.45;
          return (
            <g key={title}>
              <g className="story-drop" style={at(d)}>
                <g stroke={LINE} strokeWidth={HAIR} strokeLinejoin="round">
                  <polygon points={`0,${top} 14,${top - 8} 46,${top - 8} 32,${top}`} fill="#fff" />
                  <rect x="0" y={top} width="32" height={h} fill="#fff" />
                  <polygon points={`32,${top} 46,${top - 8} 46,${top + h - 8} 32,${top + h}`} fill={side} />
                </g>
                <text transform={`translate(20,${top + h / 2}) rotate(-90)`} textAnchor="middle" fontSize="10.5" fontWeight="700" letterSpacing="0.6" fill={TEAL_TEXT}>
                  {tag}
                </text>
              </g>
              <g className="story-rise" style={at(d + 0.15)}>
                <text x="66" y={top + 16} fontSize="14.5" fontWeight="600" fill={INK}>{title}</text>
                {lines.map((l, k) => (
                  <text key={l} x="66" y={top + 34 + k * 17} fontSize="12" fill={GREY}>{l}</text>
                ))}
              </g>
            </g>
          );
        })}
      </svg>
    </>
  );
}

function Returns() {
  const dots = { backgroundImage: "radial-gradient(rgba(0,0,0,0.28) 0.8px, transparent 1px)", backgroundSize: "4px 4px" };
  const mix = [
    ["Equity", "#2F9AA0", 43],
    ["Corporate bonds", TEAL, 28],
    ["Govt. bonds", "#C5E4E6", 24],
  ] as const;
  return (
    <>
      <Rise d={0.05} className="relative mt-9">
        <h4 className="text-[25px] font-[600] leading-[30px] tracking-[-0.7px]" style={{ color: INK }}>
          High returns
          <br />
          at low risk
        </h4>
      </Rise>

      <Rise d={0.3}>
        <p className="relative mt-7 text-[12px] font-[600]" style={{ color: INK }}>Money invested vs profit</p>
      </Rise>
      <div className="relative mt-2.5 grid grid-cols-[1fr_64px] gap-x-3 gap-y-1.5">
        {[
          ["NPS", "100%", "36%", "10–13%", "a year"],
          ["PPF", "66%", "55%", "7.1%", "a year"],
        ].map(([n, w, inv, r, sub], i) => (
          <div key={n} className="contents">
            <div className="flex h-[52px]" style={{ width: w }}>
              <span className="story-grow flex items-center pl-3 text-[11.5px] font-[600]" style={{ ...at(0.45 + i * 0.12), width: inv, background: BAR, color: INK }}>{n}</span>
              <span className="story-grow flex-1 border-l border-dashed border-black/60" style={{ ...at(1.0 + i * 0.3), backgroundColor: GREEN, ...dots }} />
            </div>
            <Rise d={1.35 + i * 0.3} className="self-center">
              <p className="text-[11.5px] font-[600] leading-[14px]" style={{ color: i ? GREY : INK }}>
                {r}
                <span className="block font-normal">{sub}</span>
              </p>
            </Rise>
          </div>
        ))}
      </div>
      <Rise d={1.5} className="relative mt-2.5 flex gap-4 text-[11px]">
        <span className="flex items-center gap-1.5" style={{ color: GREY }}><i className="size-2" style={{ background: BAR }} />Invested</span>
        <span className="flex items-center gap-1.5" style={{ color: GREY }}><i className="size-2" style={{ backgroundColor: GREEN }} />Profit</span>
      </Rise>

      <Rise d={2.0}>
        <p className="relative mt-8 text-[12px] font-[600]" style={{ color: INK }}>Where your money goes</p>
      </Rise>
      <div className="relative mt-2.5 flex h-[30px] gap-[2px]">
        {mix.map(([n, c, p], i) => (
          <span key={n} className="story-grow" style={{ ...at(2.15 + i * 0.22), width: `${p}%`, background: c }} />
        ))}
      </div>
      <Rise d={2.8}>
        <div className="relative mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[11px]" style={{ color: INK }}>
          {mix.map(([n, c]) => (
            <span key={n} className="flex items-center gap-1.5"><i className="size-2" style={{ background: c }} />{n}</span>
          ))}
        </div>
        <p className="relative mt-1.5 text-[11px]" style={{ color: GREY }}>Diversified as per your age</p>
      </Rise>

      <Rise d={3.1} className="relative mt-auto">
        <p className="text-[10.5px] leading-[14px]" style={{ color: "#929292" }}>*Up to 12% a year with an aggressive plan, higher than PPF</p>
      </Rise>
    </>
  );
}

export const STORY_BODIES = { intro: Intro, life: Life, rules: Rules, returns: Returns };
