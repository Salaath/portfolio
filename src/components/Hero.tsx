"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";
import { introDone } from "@/lib/intro";
import { LineField } from "./LineField";
import { Magnetic } from "./Magnetic";
import { RollButton } from "./RollButton";
import { scrollToId } from "./Smoother";

const FOCUS = ["Product design", "Design systems", "Investing UX"];

/** Live Mumbai time, ticking each second. */
function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now || "--:--:--"}</span>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK }, (ctx) => {
        gsap.set(q("[data-hidden]"), { autoAlpha: 1 });
        if (!(ctx.conditions as { motion: boolean }).motion) return;

        const intro = gsap.timeline({ paused: true });
        introDone.then(() => intro.play());

        // The wordmark: characters rise out of the baseline, outside-in
        SplitText.create(q("[data-wordmark]"), {
          type: "chars",
          mask: "chars",
          onSplit(self) {
            padMasks(self);
            intro.from(self.chars, {
              yPercent: 110,
              duration: 1.6,
              ease: "expo.out",
              stagger: { each: 0.035, from: "center" },
            }, 0.05);
          },
        });
        intro
          .from(q("[data-focus]"), { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.35)
          .from(q("[data-rule]"), { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.2)
          .from(q("[data-sub] > *"), { autoAlpha: 0, y: 30, stagger: 0.1 }, 0.7);

        // Scroll-out: the wordmark spreads and sinks, the rest lifts away
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          })
          .to(q("[data-wordmark]"), { letterSpacing: "0.02em", yPercent: 30, autoAlpha: 0.15 }, 0)
          .to(q("[data-sub]"), { yPercent: -80, autoAlpha: 0 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pb-10 pt-28 sm:px-10">
      <LineField />

      {/* focus areas, one per column, plus local time */}
      <div className="relative grid grid-cols-2 gap-y-2 md:grid-cols-6">
        {FOCUS.map((f, i) => (
          <span key={f} className="label overflow-hidden md:col-span-2 md:pl-3 first:md:pl-0">
            <span data-focus data-hidden className="block">
              ({String(i + 1).padStart(2, "0")}) {f}
            </span>
          </span>
        ))}
      </div>

      <div className="relative">
        <h1
          data-wordmark
          data-hidden
          className="whitespace-nowrap text-[15.3vw] font-semibold leading-[0.82] tracking-[-0.06em]"
        >
          Salaath Shaikh
        </h1>
        <div data-rule className="mt-8 h-px origin-left bg-ink/80" />
        <div data-sub className="mt-6 grid gap-8 md:grid-cols-6 md:items-start">
          <p className="max-w-md text-lg leading-snug md:col-span-2">
            I design calm, trustworthy tools for anxious money moments.
          </p>
          <div className="md:col-span-2 md:pl-3">
            <Magnetic strength={0.2}>
              <RollButton
                onClick={() => scrollToId("work")}
                label="See selected work"
                icon="↓"
              />
            </Magnetic>
          </div>
          <div className="label flex flex-col gap-1 md:col-span-2 md:items-end md:pl-3">
            <span>Design lead — Upstox</span>
            <span>
              Mumbai <Clock /> IST
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
