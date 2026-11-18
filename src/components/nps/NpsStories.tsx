"use client";

import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { STORY_BG, STORY_BODIES } from "./NpsStoriesV2";

// The four "Truths of NPS" stories that open from NPS on Home (Figma: UP_NPS →
// NPS – Discovery), played as a live story. The screens themselves are drawn in
// NpsStoriesV2.tsx, in the style of the other Upstox invest stories; this file is
// the player: chapters on the left, the phone, its progress bar and the CTA.

// The site forces Satoshi on everything; .story-ui (globals.css) hands the screens back to Inter.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

const PURPLE = "#5A298B";
const DURATION = 6; // seconds per story

type Story = {
  key: "intro" | "life" | "rules" | "returns";
  chapter: string;
  title: string;
  why: string;
  glow: string;
};

const STORIES: Story[] = [
  {
    key: "intro",
    chapter: "The tax saving",
    title: "Lead with the reward",
    why: "One hero number in the centre, the way every Upstox invest story opens. The extra 80C saving sits in a single card underneath.",
    glow: "#CDEBEF",
  },
  {
    key: "life",
    chapter: "How it works",
    title: "A life in three stops",
    why: "Three life stages, one row each, with an action and how it’s taxed. The coins stack up as the payout gets closer.",
    glow: "#CDEBEF",
  },
  {
    key: "rules",
    chapter: "Getting money out",
    title: "Rules on one pillar",
    why: "The pillar from the original, cleaned up: when each rule unlocks sits inside the block, with one title and short rules beside it. The teal deepens towards maturity.",
    glow: "#CDEBEF",
  },
  {
    key: "returns",
    chapter: "Returns vs risk",
    title: "Compared to what they know",
    why: "PPF is the benchmark our users already hold, so returns are shown against it first, then the mix that earns them.",
    glow: "#CDEBEF",
  },
];

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
  const Body = STORY_BODIES[story.key];

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
                className={`group w-full rounded-[1.6rem] p-5 text-left transition-colors duration-400 md:p-6 ${on ? "bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]" : "hover:bg-white/60"}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`grid size-7 place-items-center rounded-full font-mono text-[11px] transition-colors ${on ? "bg-ink text-bg" : "bg-black/[0.06] text-muted"}`}>{i + 1}</span>
                  <span className="label">{s.chapter}</span>
                </span>
                <span className={`mt-3 block text-2xl font-semibold tracking-[-0.035em] transition-colors md:text-[1.7rem] ${on ? "" : "text-black/35"}`}>{s.title}</span>
                <span className={`grid transition-[grid-template-rows,opacity] duration-400 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
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
        <div aria-hidden className="absolute -inset-10 rounded-full opacity-70 blur-3xl transition-colors duration-[560ms]" style={{ background: story.glow }} />
        <div
          className="relative rounded-[34px] bg-[#111] p-[6px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.5)]"
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
        >
          <div
            className={`${inter.variable} story-ui relative isolate flex h-[628px] w-[288px] flex-col overflow-hidden rounded-[28px] px-5 pb-5 pt-3.5 text-[#262626] antialiased`}
            style={{ background: STORY_BG }}
            role="group"
            aria-roledescription="story"
            aria-label={`Story ${active + 1} of ${STORIES.length}: ${story.chapter}`}
          >
            {/* close and progress, as in the prototype's story chrome */}
            <div className="relative z-10 flex items-center gap-4 pt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <div className="flex h-[2px] flex-1 gap-[3px]">
                {STORIES.map((s, i) => (
                  <span key={s.key} className="flex-1 overflow-hidden rounded-[1px] bg-[#E4E4E4]">
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
              className="relative mt-4 flex h-12 shrink-0 items-center justify-center rounded-full text-[16px] font-medium tracking-[-0.1px] text-white"
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
