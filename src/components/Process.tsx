"use client";

import { useRef } from "react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

// Draft copy: review before launch.
const STEPS = [
  { title: "Understand the real problem", body: "Sit with the data, the support tickets and the people. Find what is actually making the moment hard.", tag: "Discovery" },
  { title: "Define a clear direction", body: "Turn the mess into one sharp bet the team can rally behind, with the trade-offs written down.", tag: "Strategy" },
  { title: "Build it with engineering", body: "Prototype in the real medium, sweat the edge cases and the motion, and ship in slices.", tag: "Craft" },
  { title: "Launch, measure, refine", body: "Watch what people do, not what they say, and keep tuning until the numbers and the feel agree.", tag: "Growth" },
];

/**
 * How I work: on desktop the section pins and the step cards travel sideways,
 * each one easing up into line as it crosses into view.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const track = q("[data-track]")[0] as HTMLElement;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion || !desktop) return;
        const distance = () => track.offsetLeft + track.scrollWidth - window.innerWidth + 40;
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        (q("[data-step]") as HTMLElement[]).forEach((card) => {
          gsap.fromTo(
            card,
            { yPercent: 18, rotate: 3 },
            {
              yPercent: 0,
              rotate: 0,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: travel, start: "left right", end: "left 55%", scrub: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex flex-col gap-12 overflow-hidden py-28 md:h-svh md:flex-row md:items-center md:gap-0 md:py-0">
      <div className="relative z-10 shrink-0 bg-bg px-4 sm:px-10 md:flex md:w-[34vw] md:flex-col md:justify-center md:self-stretch">
        <p data-label className="label mb-6">[ 04 — How I work ]</p>
        <h2 data-split="lines" className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-[4.6vw]">
          From brief to launch
        </h2>
        <p data-fade className="mt-6 max-w-sm text-muted">
          From first conversations to tested, shipped product, end to end.
        </p>
      </div>
      <div data-track className="flex flex-col gap-4 px-4 sm:px-10 md:w-max md:flex-row md:gap-5 md:pl-0">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            data-step
            className={`flex min-h-[22rem] flex-col justify-between rounded-2xl p-7 md:h-[62svh] md:w-[30vw] md:shrink-0 ${i % 2 ? "bg-card" : "bg-ink text-bg"}`}
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-9 min-w-9 place-items-center rounded-full px-2 font-mono text-xs ${i % 2 ? "bg-ink text-bg" : "bg-bg text-ink"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] opacity-60">{s.tag}</span>
            </div>
            <div>
              <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-4 max-w-sm opacity-70">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
