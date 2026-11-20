"use client";

import { useEffect, useRef, useState } from "react";
import { SplitCost, SwitchDemo, WalletTabs } from "./Before";

// The one-pager for US Stocks: four short sections beside one diagram of the
// journey. The diagram starts split across Pro and Invest and closes into a
// single line in Pro as the page is read. Copy is Sal's, from the brief.

const STEPS = ["Explore", "Discover", "Order", "Track", "Manage funds"];
/** Steps from here on were proposed for Invest. */
const SPLIT_AT = 2;

const CAPTIONS = [
  "The proposal: start in Pro, finish in Invest.",
  "A switch of modes, halfway through an order.",
  "One journey, designed in Pro only.",
  "Live. Every step in Pro.",
];

const PRO = "#5b2ebd";
const WARN = "#d9482b";
const ROW = 62;
const TOP = 58;
const X_PRO = 26;
const X_INV = 150;

/** The journey in one of four states: 0 problem, 1 pushback, 2 decision, 3 outcome. */
export function JourneyRail({ state, className = "" }: { state: number; className?: string }) {
  const joined = state >= 2;
  const y = (i: number) => TOP + i * ROW;
  const ease = "transition-[transform,opacity,stroke,fill,stroke-width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  return (
    <figure className={`m-0 ${className}`}>
      <svg viewBox={`0 0 340 ${y(STEPS.length - 1) + 34}`} className="block w-full" role="img" aria-label={joined ? "All five steps of the journey in Pro" : "The journey split in two: Explore and Discover in Pro; Order, Track and Manage funds in Invest"}>
        {/* the two modes */}
        <text x={X_PRO - 6} y="18" className="font-mono" fontSize="10" letterSpacing="1.4" fill={PRO}>PRO</text>
        <g className={ease} style={{ opacity: joined ? 0.28 : 1 }}>
          <text x={X_INV - 6} y="18" className="font-mono" fontSize="10" letterSpacing="1.4" fill="currentColor">INVEST</text>
          <line x1={X_INV - 6} x2={X_INV + 40} y1="14.5" y2="14.5" stroke="currentColor" strokeWidth="1" className={ease} style={{ opacity: joined ? 1 : 0 }} />
        </g>

        {/* split: Pro line, the switch, Invest line */}
        <g className={ease} style={{ opacity: joined ? 0 : 1 }}>
          <path d={`M${X_PRO} ${y(0)} V ${y(SPLIT_AT - 1)}`} stroke={PRO} strokeWidth="1.5" />
          <path
            d={`M${X_PRO} ${y(SPLIT_AT - 1)} C ${X_PRO} ${y(SPLIT_AT - 1) + 40}, ${X_INV} ${y(SPLIT_AT) - 40}, ${X_INV} ${y(SPLIT_AT)}`}
            fill="none"
            strokeDasharray="4 5"
            className={ease}
            style={{ stroke: state === 1 ? WARN : "currentColor", strokeWidth: state === 1 ? 2 : 1.25, opacity: state === 1 ? 1 : 0.55 }}
          />
          <path d={`M${X_INV} ${y(SPLIT_AT)} V ${y(STEPS.length - 1)}`} stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <text x={X_INV - 22} y={y(SPLIT_AT - 1) + 4} className={`font-mono ${ease}`} fontSize="9.5" letterSpacing="1.1" style={{ fill: state === 1 ? WARN : "currentColor", opacity: state === 1 ? 1 : 0.55 }}>
            ↙ SWITCH MODES
          </text>
        </g>
        {/* joined: one line */}
        <path d={`M${X_PRO} ${y(0)} V ${y(STEPS.length - 1)}`} stroke={PRO} strokeWidth="1.5" className={ease} style={{ opacity: joined ? 1 : 0 }} />

        {STEPS.map((s, i) => {
          const moved = i >= SPLIT_AT;
          const inInvest = moved && !joined;
          return (
            <g key={s} className={ease} style={{ transform: `translate(${inInvest ? X_INV : X_PRO}px, ${y(i)}px)`, transitionDelay: moved ? `${(i - SPLIT_AT) * 70}ms` : undefined }}>
              <circle r="5.5" className={ease} style={{ fill: inInvest ? "var(--bg)" : PRO, stroke: inInvest ? "currentColor" : PRO, strokeWidth: 1.5 }} />
              <text x="18" y="5" fontSize="15" fill="currentColor">{s}</text>
            </g>
          );
        })}
        {state === 3 ? <circle cx={X_PRO} cy={y(STEPS.length - 1)} r="5.5" fill="none" stroke={PRO} strokeWidth="1.5" className="origin-center animate-ping [transform-box:fill-box] motion-reduce:hidden" /> : null}
      </svg>
      <figcaption className="relative mt-5 h-10 border-t border-line pt-3 text-sm text-muted">
        {CAPTIONS.map((c, i) => (
          <span key={c} aria-hidden={i !== state} className={`absolute inset-x-0 top-3 transition-opacity duration-500 ${i === state ? "opacity-100" : "opacity-0"}`}>{c}</span>
        ))}
      </figcaption>
    </figure>
  );
}

const Chip = ({ children, on }: { children: React.ReactNode; on?: boolean }) => (
  <span className={`rounded-full border px-3.5 py-1.5 text-sm ${on ? "border-[#5b2ebd] bg-[#5b2ebd] text-white" : "border-ink/20"}`}>{children}</span>
);

const SECTIONS: { id: string; label: string; body: string; extra?: React.ReactNode }[] = [
  {
    id: "problem",
    label: "The problem",
    body: "Upstox has two modes: Invest for long-term investing, Pro for active trading. We designed US stocks on Invest last year, but it never launched. When the new ask came to launch it on Pro, the proposal on the table split the journey in two: explore and discover in Pro, but order, track and manage funds back in Invest.",
    extra: <SwitchDemo />,
  },
  {
    id: "pushback",
    label: "The pushback",
    body: "I didn’t think a trader should have to switch modes halfway through. Holdings, order forms and the order journey should feel the same wherever you trade. And the US wallet counts toward your total portfolio value, so it can’t live in two places at once. I made that case to the product team and then to leadership.",
    extra: (
      <div className="grid gap-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="label mr-1">Made the case to</span>
          <Chip>Product team</Chip>
          <span aria-hidden className="text-muted">→</span>
          <Chip on>Leadership</Chip>
        </div>
        <SplitCost />
      </div>
    ),
  },
  {
    id: "decision",
    label: "The decision",
    body: "Leadership backed it. We took about a month to design the full US stocks journey in Pro only and worked through the open questions together: the overview page, the order book and where the wallet should sit. The US wallet became a second tab, next to the Indian stocks wallet.",
    extra: (
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="label">Open questions, worked through together</p>
          <ul className="mt-4">
            {["The overview page", "The order book", "Where the wallet should sit"].map((q, i) => (
              <li key={q} className="flex items-baseline gap-4 border-t border-line py-3">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Where the wallet landed</p>
          <div className="mt-4">
            <WalletTabs />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "outcome",
    label: "The outcome",
    body: "It’s live. US stocks now runs on the same journey as Indian stocks, the one our traders already know. You explore, order, track and manage your US wallet in Pro without switching modes.",
  },
];

export function Storyline() {
  const [state, setState] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-step]"));
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.55;
      let cur = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) cur = i;
      });
      setState(cur);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(measure));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="grid gap-x-16 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-x-24">
      <div className="hidden md:block">
        <div className="sticky top-[calc(50svh-13.5rem)]">
          <p className="label mb-6">The journey</p>
          <JourneyRail state={state} className="max-w-[21rem]" />
        </div>
      </div>

      <div>
        {SECTIONS.map((s, i) => (
          <article key={s.id} id={s.id} data-step className={`border-t border-ink py-12 md:py-0 md:pt-8 ${i < SECTIONS.length - 1 ? "md:min-h-[70svh] md:pb-24" : "md:pb-4"}`}>
            <p className="label flex gap-4 !text-ink">
              <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </p>
            <JourneyRail state={i} className="mt-8 max-w-[19rem] md:hidden" />
            <p data-fade className="mt-8 max-w-2xl text-[1.35rem] leading-[1.42] tracking-[-0.012em] md:mt-10 md:text-[1.7rem] md:leading-[1.38]">{s.body}</p>
            {s.extra ? <div data-fade className="mt-10 max-w-2xl">{s.extra}</div> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
