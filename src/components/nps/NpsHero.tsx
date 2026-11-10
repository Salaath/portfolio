"use client";

import { useRef } from "react";
import { MOTION_OK, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";
import { Magnetic } from "../Magnetic";
import { RollButton } from "../RollButton";
import { scrollToId } from "../Smoother";
import { Shot } from "./Shot";

/**
 * Dark hero, centred like Habitline: headline, two actions, a phone rising
 * out of the bottom with floating cards either side. As you scroll away a
 * soft curve of the page colour rises and swallows the bottom of the hero.
 */
export function NpsHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK }, (ctx) => {
        gsap.set(q("[data-hidden]"), { autoAlpha: 1 });
        if (!(ctx.conditions as { motion: boolean }).motion) return;

        const tl = gsap.timeline({ delay: 0.2 });
        SplitText.create(q("[data-h1]"), {
          type: "lines,words",
          mask: "lines",
          onSplit(self) {
            padMasks(self);
            tl.from(
              self.words,
              { yPercent: 115, duration: 1.4, stagger: 0.06, ease: "expo.out" },
              0,
            );
          },
        });
        tl.from(q("[data-pill]"), { autoAlpha: 0, y: 14, duration: 0.8 }, 0)
          .from(
            q("[data-sub], [data-actions] > *"),
            { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1 },
            0.45,
          )
          .from(
            q("[data-phone]"),
            { yPercent: 40, autoAlpha: 0, duration: 1.8, ease: "expo.out" },
            0.55,
          )
          .from(
            q("[data-float]"),
            {
              autoAlpha: 0,
              scale: 0.85,
              y: 40,
              stagger: 0.12,
              duration: 1.4,
              ease: "back.out(1.6)",
            },
            0.95,
          );

        // scroll away: the curve rises, the phone lifts, the cards drift apart
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .fromTo(q("[data-curve]"), { yPercent: 62 }, { yPercent: 8 }, 0)
          .to(q("[data-phone]"), { yPercent: -12 }, 0)
          .to(q("[data-float='l']"), { xPercent: -30, yPercent: -40 }, 0)
          .to(q("[data-float='r']"), { xPercent: 30, yPercent: -60 }, 0)
          .to(q("[data-copy]"), { yPercent: -30, autoAlpha: 0 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className="relative overflow-hidden bg-[#0f0e0d] pt-32 text-white"
    >
      {/* warm glow behind the phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] size-[90vmax] -translate-x-1/2 rounded-full opacity-60 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,44,0.55), rgba(91,46,189,0.25) 40%, transparent 65%)",
        }}
      />

      <div
        data-copy
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center"
      >
        <span
          data-pill
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 backdrop-blur"
        >
          Upstox · 0-to-1 product launch · 2025
        </span>
        <h1
          data-h1
          data-hidden
          className="mt-7 text-[13vw] font-semibold leading-[0.92] tracking-[-0.055em] md:text-[6.4vw]"
        >
          Building NPS from 0 to 1 on Upstox
        </h1>
        <p data-sub className="mt-6 max-w-xl text-lg text-white/65">
          I led the design of NPS on Upstox, from product vision to launch:
          education, account setup, fund selection, contributions and
          portfolio, in one journey. It went live to every Upstox user in
          March 2025, before tax season. A first contribution now takes under
          3 minutes.
        </p>
        <div data-actions className="mt-9 flex flex-wrap justify-center gap-3">
          <Magnetic strength={0.2}>
            <RollButton
              invert
              label="See how"
              icon="↓"
              onClick={() => scrollToId("opportunity")}
              className="bg-white/5"
            />
          </Magnetic>
          <Magnetic strength={0.2}>
            <RollButton
              invert
              label="Jump to results"
              icon="↓"
              onClick={() => scrollToId("results")}
            />
          </Magnetic>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex justify-center">
        <div
          data-float="l"
          className="absolute left-1/2 top-24 hidden -translate-x-[155%] md:block"
        >
          <div
            className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
            style={{ animation: "bob 6s ease-in-out infinite" }}
          >
            <span className="grid size-11 place-items-center rounded-full bg-[#FF6B2C] text-lg font-semibold">
              ₹
            </span>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
              ₹15,650*
            </p>
            <p className="text-sm text-white/65">tax saved, shown up front</p>
          </div>
        </div>
        <div
          data-float="r"
          className="absolute left-1/2 top-56 hidden translate-x-[60%] md:block"
        >
          <div
            className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
            style={{ animation: "bob 7s ease-in-out -2s infinite" }}
          >
            <p className="text-sm text-white/65">PRAN details on file</p>
            <p className="text-lg font-semibold">17 of 22, already known</p>
            <div className="mt-3 flex gap-2">
              {["PAN", "Bank", "KYC", "Nominee"].map((s, i) => (
                <span
                  key={s}
                  className="grid size-10 place-items-center rounded-full text-[10px] font-semibold"
                  style={{
                    background: i < 3 ? "#14A363" : "rgba(255,255,255,0.15)",
                  }}
                >
                  {i < 3 ? "✓" : s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div data-phone>
          <Shot src="explore" alt="Upstox NPS Explore screen: truths of investing, tax saving meter and top NPS funds" width={300} priority />
        </div>
      </div>

      {/* the rising curve */}
      <div
        aria-hidden
        data-curve
        className="pointer-events-none absolute -bottom-[38vh] left-1/2 z-20 h-[70vh] w-[170vw] -translate-x-1/2 rounded-[50%] bg-[#F3F3F1] blur-[30px]"
      />
      <div className="h-[22vh]" />
    </header>
  );
}
