"use client";

import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

// The four "Truths of NPS" stories from the More page (Figma: UP_NPS →
// NPS – Discovery), redrawn and played as a live story. Screens use the
// Upstox type scale (Inter) and system palette; brand purple is kept for the
// CTA only, green carries gains, teal and blue carry the infographics.

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const PURPLE = "#5A298B";
const DURATION = 6; // seconds per story

type Blob = { w: number; h: number; x: string; y: number; color: string; radius: string };

type Story = {
  key: "intro" | "life" | "rules" | "returns";
  chapter: string;
  title: string;
  why: string;
  glow: string;
  blobs: Blob[];
};

const STORIES: Story[] = [
  {
    key: "intro",
    chapter: "The tax saving",
    title: "Lead with the reward",
    why: "One hero number, with green for gains as everywhere on Upstox. The extra 80C saving sits in a single card underneath.",
    glow: "#CDEDE2",
    blobs: [
      { w: 320, h: 280, x: "right:-140px", y: 150, color: "#E1F3EE", radius: "58% 42% 47% 53%/45% 55% 45% 55%" },
      { w: 200, h: 180, x: "left:-90px", y: 330, color: "#EAF6F1", radius: "40% 60% 55% 45%/60% 40% 60% 40%" },
    ],
  },
  {
    key: "life",
    chapter: "How it works",
    title: "A life in three stops",
    why: "Three life stages on one teal rail, each with an action and how it’s taxed. The teal deepens as the payout gets closer.",
    glow: "#CDEBEF",
    blobs: [
      { w: 300, h: 300, x: "left:-150px", y: 120, color: "#E3F4F6", radius: "45% 55% 60% 40%/50% 45% 55% 50%" },
      { w: 240, h: 220, x: "right:-120px", y: 380, color: "#EFF8FA", radius: "60% 40% 45% 55%/40% 60% 40% 60%" },
    ],
  },
  {
    key: "rules",
    chapter: "Getting money out",
    title: "Rules on one pillar",
    why: "The pillar from the original, cleaned up: when each rule unlocks sits inside the block, with one title and short rules beside it.",
    glow: "#D6E3F4",
    blobs: [
      { w: 280, h: 320, x: "right:-150px", y: 110, color: "#EAF0F8", radius: "52% 48% 40% 60%/55% 45% 55% 45%" },
      { w: 220, h: 200, x: "left:-110px", y: 400, color: "#EFF8FA", radius: "45% 55% 58% 42%/48% 52% 48% 52%" },
    ],
  },
  {
    key: "returns",
    chapter: "Returns vs risk",
    title: "Compared to what they know",
    why: "PPF is the benchmark our users already hold, so returns are shown against it first, then the mix that earns them.",
    glow: "#CDEDE2",
    blobs: [
      { w: 340, h: 260, x: "left:-120px", y: 130, color: "#E1F3EE", radius: "48% 52% 62% 38%/52% 40% 60% 48%" },
      { w: 220, h: 240, x: "right:-110px", y: 360, color: "#EAF6F1", radius: "60% 40% 45% 55%/45% 60% 40% 55%" },
    ],
  },
];

/* ---------- shared pieces ---------- */

const CARD = "rounded-2xl border border-[#F1F1F1] bg-white shadow-[0_14px_30px_-16px_rgba(16,24,40,0.22),0_1px_2px_rgba(16,24,40,0.05)]";
const META = "text-[12px] font-medium leading-4 text-[#6A6A6A]";

function Rise({ d = 0, children, className = "", style }: { d?: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`story-rise ${className}`} style={{ ...style, animationDelay: `${d}s` }}>
      {children}
    </div>
  );
}

function Title({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <Rise>
      <p className="mt-7 text-[12px] font-medium leading-4 text-[#929292]">{kicker}</p>
      <h4 className="mt-1 text-[24px] font-semibold leading-8 tracking-[-0.47px] [text-wrap:balance]">{children}</h4>
    </Rise>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="mr-1.5 inline-block size-2 rounded-[2px]" style={{ background: color }} />;
}

/* ---------- the four story bodies ---------- */

function Intro() {
  return (
    <>
      <Title kicker="Introducing">National Pension Scheme</Title>
      <Rise d={0.05}>
        <p className={`${META} mt-1.5`}>Government-backed retirement savings</p>
      </Rise>
      <Rise d={0.12} className="mt-11">
        <p className={META} style={{ color: "#347B54" }}>Save tax up to</p>
        <p className="mt-0.5 text-[60px] font-semibold leading-[66px] tracking-[-2.4px]">₹15,600</p>
        <p className={`${META} mt-1`}>On ₹50k, under 80CCD(1)</p>
      </Rise>
      <Rise d={0.24} className={`${CARD} mt-[30px] p-4`}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#6A6A6A]">Additionally, save up to</span>
          <span className="text-[19px] font-bold leading-6 tracking-[-0.4px]">₹46,800</span>
        </div>
        <div className="story-grow mt-3.5 h-2 rounded" style={{ background: "linear-gradient(90deg,#8DD5B8,#347B54)", animationDelay: "0.4s" }} />
        <p className={`${META} mt-3 !text-[#929292]`}>Using ₹1.5 L as an alternate to 80C</p>
      </Rise>
    </>
  );
}

function Life() {
  const stops = [
    { age: "Today", bg: "#A7D9DF", ink: "#0F3A41", act: "Invest up to ₹50k a year", note: "Tax exemption up to ₹15,600 u/s 80CCD(1)", lock: true },
    { age: "At 60", bg: "#3E8A95", ink: "#fff", act: "Withdraw 60% of your corpus", note: "All tax-free" },
    { age: "After 60", bg: "#1F5A63", ink: "#fff", act: "Monthly or yearly pension", note: "Taxed as per your slab" },
  ];
  const clips = [
    "polygon(0 0,100% 0,100% calc(100% - 9px),50% 100%,0 calc(100% - 9px))",
    "polygon(0 0,50% 9px,100% 0,100% calc(100% - 9px),50% 100%,0 calc(100% - 9px))",
    "polygon(0 0,50% 9px,100% 0,100% 100%,0 100%)",
  ];
  return (
    <>
      <Title kicker="How NPS works">Invest now, get paid after 60</Title>
      <div className="mt-[22px] flex h-[380px] gap-3">
        <Rise d={0.1} className="flex w-10 flex-col drop-shadow-[0_6px_10px_rgba(16,24,40,0.12)]">
          {stops.map((s, i) => (
            <div
              key={s.age}
              className={`flex flex-1 items-center justify-center ${i ? "-mt-[5px]" : "rounded-t-[10px]"} ${i === 2 ? "rounded-b-[10px]" : ""}`}
              style={{ background: s.bg, clipPath: clips[i] }}
            >
              <span className="-rotate-90 whitespace-nowrap text-[12px] font-bold uppercase tracking-[1.2px]" style={{ color: s.ink }}>
                {s.age}
              </span>
            </div>
          ))}
        </Rise>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {stops.map((s, i) => (
            <Rise key={s.age} d={0.14 + i * 0.1} className={`${CARD} flex flex-1 flex-col justify-center border-l-[3px] px-3.5 py-3`} style={{ borderLeftColor: s.bg }}>
              <p className="text-[15px] font-semibold leading-5 tracking-[-0.2px]">{s.act}</p>
              <p className={`${META} mt-1.5`}>{s.note}</p>
              {s.lock && (
                <p className={`${META} mt-2 flex items-center gap-1`} style={{ color: "#2F7783" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Locked till 60
                </p>
              )}
            </Rise>
          ))}
        </div>
      </div>
    </>
  );
}

function Rules() {
  // [label in block, block height, side colour, title, rule lines]
  const blocks: [string, number, string, string, string[]][] = [
    ["3 YRS", 70, "#EAF0F8", "Partial withdrawal", ["Allowed 3 times, 5 yrs", "apart, in special cases"]],
    ["10 YRS", 88, "#D6E3F4", "Premature exit", ["100% lump sum under ₹1L", "Above ₹1L: 80% lump sum,", "rest as pension"]],
    ["AT 60", 88, "#8FAEDE", "On maturity", ["100% lump sum under ₹5L", "Above ₹5L: 60% lump sum,", "rest as pension"]],
    ["ANY", 44, "#3F6CBC", "On death", ["100% to your nominee"]],
  ];
  let y = 14;
  return (
    <>
      <Title kicker="Withdrawal rules">When money comes out</Title>
      <Rise d={0.12} className="ml-1.5 mt-6">
        <svg viewBox="0 0 236 344" width="236" height="344" className="block overflow-visible" role="img" aria-label="NPS withdrawal rules as a stacked pillar">
          <defs>
            <filter id="story-pillar-shadow" x="-30%" y="-10%" width="160%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#10182B" floodOpacity="0.16" />
            </filter>
          </defs>
          {blocks.map(([tag, h, side, title, lines], i) => {
            const top = y;
            y += h + 12;
            return (
              <g key={title}>
                <g filter="url(#story-pillar-shadow)" stroke="#262626" strokeWidth="0.7" strokeLinejoin="round">
                  <polygon points={`0,${top} 14,${top - 8} 46,${top - 8} 32,${top}`} fill="#F9F8FD" />
                  <rect x="0" y={top} width="32" height={h} fill="#fff" />
                  <polygon points={`32,${top} 46,${top - 8} 46,${top + h - 8} 32,${top + h}`} fill={side} />
                </g>
                <text transform={`translate(20,${top + h / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fontWeight="600" fill="#3F6CBC">
                  {tag}
                </text>
                {i > 0 && <line x1="62" y1={top - 6} x2="228" y2={top - 6} stroke="#D9E1EC" />}
                <text x="62" y={top + 18} fontSize="14" fontWeight="600" fill="#262626">{title}</text>
                {lines.map((l, k) => (
                  <text key={l} x="62" y={top + 36 + k * 17} fontSize="12" fontWeight="500" fill="#6A6A6A">{l}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </Rise>
    </>
  );
}

function Returns() {
  const mix = [
    ["Equity", "#3F6CBC", 43],
    ["Corporate bonds", "#8DD5B8", 28],
    ["Govt. bonds", "#8AD5DE", 24],
  ] as const;
  let offset = 0;
  return (
    <>
      <Title kicker="Returns vs risk">High returns at low risk</Title>
      <div className="mt-[26px] flex flex-col gap-3.5">
        <Rise d={0.12} className={`${CARD} p-4`}>
          <div className="grid grid-cols-[34px_1fr_52px] items-center gap-x-2.5 gap-y-2">
            {[
              ["NPS", "100%", "36%", "10–13%"],
              ["PPF", "66%", "55%", "7.1%"],
            ].map(([n, w, inv, r], i) => (
              <div key={n} className="contents">
                <span className={`${META} !font-semibold !text-[#262626]`}>{n}</span>
                <span className="story-grow flex h-[22px] overflow-hidden rounded-md" style={{ width: w, animationDelay: `${0.3 + i * 0.1}s` }}>
                  <i style={{ width: inv, background: "#E1E1E1" }} />
                  <i className="flex-1" style={{ background: "#8DD5B8" }} />
                </span>
                <span className={`text-right text-[13px] ${i ? "font-semibold text-[#6A6A6A]" : "font-bold text-[#347B54]"}`}>{r}</span>
              </div>
            ))}
          </div>
          <div className={`${META} mt-3 flex gap-3.5`}>
            <span><Swatch color="#E1E1E1" />Invested</span>
            <span><Swatch color="#8DD5B8" />Profit</span>
          </div>
          <p className={`${META} mt-2.5 border-t border-[#F0F0F0] pt-2.5`}>Up to 12% a year with an aggressive plan, higher than PPF</p>
        </Rise>
        <Rise d={0.24} className={`${CARD} flex items-center gap-4 p-4`}>
          <svg viewBox="0 0 42 42" width="84" height="84" className="shrink-0 -rotate-90 drop-shadow-[0_4px_6px_rgba(16,24,40,0.12)]" aria-hidden>
            {mix.map(([n, c, p]) => {
              const el = <circle key={n} cx="21" cy="21" r="15.9" fill="none" stroke={c} strokeWidth="6.5" strokeDasharray={`${p} ${100 - p}`} strokeDashoffset={offset} />;
              offset -= p + 1.5;
              return el;
            })}
          </svg>
          <div className={`${META} leading-[22px]`}>
            {mix.map(([n, c]) => (
              <div key={n} className="text-[#262626]"><Swatch color={c} />{n}</div>
            ))}
            <div className="mt-1 leading-4">Diversified as per your age</div>
          </div>
        </Rise>
      </div>
    </>
  );
}

const BODIES = { intro: Intro, life: Life, rules: Rules, returns: Returns };

/* ---------- player ---------- */

export function NpsStories() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.45 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const go = (i: number) => setActive((i + STORIES.length) % STORIES.length);
  const playing = inView && !held && !reduced;
  const story = STORIES[active];
  const Body = BODIES[story.key];

  return (
    <div ref={ref} className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
      {/* chapters */}
      <ol className="order-2 flex flex-col gap-2 md:order-1">
        {STORIES.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={on}
                className={`group w-full rounded-[1.6rem] p-5 text-left transition-colors duration-500 md:p-6 ${on ? "bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]" : "hover:bg-white/60"}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`grid size-7 place-items-center rounded-full font-mono text-[11px] transition-colors ${on ? "bg-ink text-bg" : "bg-black/[0.06] text-muted"}`}>{i + 1}</span>
                  <span className="label">{s.chapter}</span>
                </span>
                <span className={`mt-3 block text-2xl font-semibold tracking-[-0.035em] transition-colors md:text-[1.7rem] ${on ? "" : "text-black/35"}`}>{s.title}</span>
                <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <span className="overflow-hidden">
                    <span className="block max-w-md pt-2 text-[15px] text-muted">{s.why}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* phone */}
      <div className="relative order-1 mx-auto md:order-2">
        <div aria-hidden className="absolute -inset-10 rounded-full opacity-70 blur-3xl transition-colors duration-700" style={{ background: story.glow }} />
        <div
          className="relative rounded-[34px] bg-[#111] p-[6px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.5)]"
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
        >
          <div
            className={`${inter.className} relative isolate flex h-[628px] w-[288px] flex-col [&_p]:[text-wrap:balance] overflow-hidden rounded-[28px] bg-white px-5 pb-5 pt-3.5 text-[#262626] antialiased`}
            role="group"
            aria-roledescription="story"
            aria-label={`Story ${active + 1} of ${STORIES.length}: ${story.chapter}`}
          >
            {/* background blobs */}
            {story.blobs.map((b, i) => {
              const [side, val] = b.x.split(":");
              return (
                <div
                  key={`${story.key}-${i}`}
                  aria-hidden
                  className="story-blob"
                  style={{ width: b.w, height: b.h, top: b.y, [side]: val, backgroundColor: b.color, borderRadius: b.radius }}
                />
              );
            })}

            {/* top scrim, close and progress, as in the prototype's story chrome */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[104px] bg-gradient-to-b from-black/[0.24] to-transparent" />
            <div className="relative flex items-center gap-4 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <div className="flex h-[2px] flex-1 gap-[2px] drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]">
                {STORIES.map((s, i) => (
                  <span key={s.key} className="flex-1 overflow-hidden rounded-[1px] bg-white">
                    <span
                      key={i === active ? `on-${active}` : "off"}
                      className="block h-full w-full origin-left"
                      style={{
                        background: PURPLE,
                        ...(i < active || (i === active && reduced)
                          ? {}
                          : i === active
                            ? { animation: `story-progress ${DURATION}s linear forwards`, animationPlayState: playing ? "running" : "paused" }
                            : { transform: "scaleX(0)" }),
                      }}
                      onAnimationEnd={() => go(active + 1)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* body */}
            <div key={story.key} className="flex min-h-0 flex-1 flex-col">
              <Body />
            </div>

            {/* cta */}
            <div
              className="mt-4 flex h-12 items-center justify-center rounded-full text-[16px] font-medium tracking-[-0.1px] text-white shadow-[0_10px_22px_-12px_rgba(90,41,139,0.55)]"
              style={{ background: PURPLE }}
            >
              Save ₹15,600 in taxes
            </div>

            {/* tap zones */}
            <button type="button" aria-label="Previous story" onClick={() => go(active - 1)} className="absolute inset-y-16 left-0 w-1/3" />
            <button type="button" aria-label="Next story" onClick={() => go(active + 1)} className="absolute inset-y-16 right-0 w-2/3" />
          </div>
        </div>
        <p className="label relative mt-6 text-center">{reduced ? "Tap to move between stories" : "Tap to skip · hold to pause"}</p>
      </div>
    </div>
  );
}
