"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";
import { Spark, ask } from "./Ask";
import { Clock } from "./Bits";
import { ShaderField } from "./ShaderField";
import { ready, scrollToId } from "./Shell";

const PROMPTS = [
  "How did account opening go from 12 minutes to 2?",
  "What changed in the Watchlist?",
  "How do you work with AI?",
  "What did you do before Upstox?",
];

/** The placeholder types a question, holds, deletes it and moves to the next. */
function useTyped(lines: string[], paused: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setText(lines[0]);
    let line = 0, n = 0, dir = 1, id: ReturnType<typeof setTimeout>;
    const step = () => {
      const full = lines[line];
      n += dir;
      setText(full.slice(0, n));
      let wait = dir > 0 ? 38 + Math.random() * 40 : 14;
      if (dir > 0 && n === full.length) [dir, wait] = [-1, 2200];
      else if (dir < 0 && n === 0) [dir, line, wait] = [1, (line + 1) % lines.length, 350];
      id = setTimeout(step, wait);
    };
    id = setTimeout(step, 1800);
    return () => clearTimeout(id);
  }, [lines, paused]);
  return text;
}

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const typed = useTyped(PROMPTS, focused || value !== "");

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK }, (ctx) => {
        gsap.set(q("[data-hidden]"), { autoAlpha: 1 });
        if (!(ctx.conditions as { motion: boolean }).motion) return;
        const intro = gsap.timeline({ paused: true });
        ready.then(() => intro.play());

        SplitText.create(q("[data-headline]"), {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            padMasks(self);
            // a re-split (fonts arriving, a resize) after the intro has started just shows the text
            if (intro.time() > 0) return;
            return intro.from(self.words, { yPercent: 115, rotate: 5, transformOrigin: "0% 100%", duration: 1.5, stagger: 0.045 }, 0.1);
          },
        });
        intro
          .from(q("[data-field]"), { autoAlpha: 0, scale: 1.12, duration: 2.6, ease: "power2.out" }, 0)
          .from(q("[data-meta] > *"), { yPercent: 120, autoAlpha: 0, stagger: 0.07, duration: 1 }, 0.5)
          .from(q("[data-ask]"), { y: 40, autoAlpha: 0, duration: 1.3 }, 0.85)
          .from(q("[data-chip]"), { y: 16, autoAlpha: 0, stagger: 0.06, duration: 0.9 }, 1.1)
          .from(q("[data-foot] > *"), { autoAlpha: 0, y: 14, stagger: 0.08 }, 1.25);

        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
          .to(q("[data-field]"), { yPercent: 18, scale: 1.08 }, 0)
          .to(q("[data-content]"), { yPercent: -14, autoAlpha: 0 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pb-8 pt-28 sm:px-10">
      <div data-field data-hidden className="absolute inset-0">
        <ShaderField focus={[0.74, 0.5]} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08080a] to-transparent" />
      </div>

      <div data-content className="relative flex flex-1 flex-col justify-between">
        <div data-meta data-hidden className="label flex flex-wrap items-center gap-x-8 gap-y-2 overflow-hidden !text-white/60">
          <span className="flex items-center gap-2.5"><i className="f-live" /> Design lead — Upstox</span>
          <span>Mumbai <Clock /> IST</span>
          <span className="hidden sm:inline">8 years in design</span>
        </div>

        <div className="py-10">
          <h1 data-headline data-hidden className="max-w-[16ch] text-[12.5vw] leading-[0.95] tracking-[-0.04em] md:text-[7.6vw]">
            I design calm, trustworthy tools for anxious money moments.
          </h1>

          <form
            data-ask
            data-hidden
            onSubmit={(e) => {
              e.preventDefault();
              ask(value || typed || PROMPTS[0]);
              setValue("");
            }}
            className={`f-glass mt-10 flex max-w-2xl items-center gap-3 rounded-full py-2 pl-5 pr-2 transition-shadow duration-500 ${focused ? "ring-1 ring-[#a78bfa]/70" : ""}`}
          >
            <Spark />
            <div className="relative min-w-0 flex-1">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Ask about my work"
                className="w-full bg-transparent py-2 text-base outline-none md:text-lg"
              />
              {value === "" ? (
                <span aria-hidden className={`pointer-events-none absolute inset-0 flex items-center truncate text-base text-white/45 md:text-lg ${focused ? "" : "f-caret"}`}>
                  {focused ? "Ask about my work…" : typed}
                </span>
              ) : null}
            </div>
            <button type="submit" aria-label="Ask" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f2f1ed] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:rotate-[-45deg]">
              →
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Account Opening", "Watchlist", "NPS", "Working with AI"].map((c, i) => (
              <button
                key={c}
                data-chip
                data-hidden
                type="button"
                onClick={() => ask([PROMPTS[0], PROMPTS[1], "What was the NPS project?", PROMPTS[2]][i])}
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/65 transition-colors duration-300 hover:border-white/50 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div data-foot data-hidden className="label flex items-end justify-between !text-white/50">
          <button type="button" onClick={() => scrollToId("work")} className="group flex items-center gap-3 uppercase tracking-[0.14em]">
            <span className="grid size-9 place-items-center rounded-full border border-white/20 transition-transform duration-500 group-hover:translate-y-1">↓</span>
            Selected work
          </button>
          <span className="hidden md:block">Previously — Tata CLiQ</span>
        </div>
      </div>
    </section>
  );
}
