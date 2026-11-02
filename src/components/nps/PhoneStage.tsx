"use client";

import { useRef } from "react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { Shot } from "./Shot";

type Tile = { kind: "icon"; icon: string; color: string; label: string } | { kind: "stat"; big: string; label: string; dark?: boolean };

const ROW_A: Tile[] = [
  { kind: "icon", icon: "⚡", color: "#2F5BFF", label: "KYC reused, not retyped" },
  { kind: "stat", big: "₹15,650*", label: "tax saving, shown up front", dark: true },
  { kind: "icon", icon: "◔", color: "#FF6B2C", label: "Plan picked by age" },
  { kind: "icon", icon: "★", color: "#7B3FF2", label: "Top funds, ranked" },
  { kind: "stat", big: "75%", label: "equity, Aggressive plan" },
  { kind: "icon", icon: "∑", color: "#14A363", label: "Contribution calculator" },
  { kind: "icon", icon: "▶", color: "#F0443A", label: "Truths of NPS, as stories" },
  { kind: "stat", big: "17 / 22", label: "PRAN fields already known", dark: true },
];
const ROW_B: Tile[] = [
  { kind: "stat", big: "₹200", label: "one-time account opening" },
  { kind: "icon", icon: "≡", color: "#14A363", label: "Every charge itemised" },
  { kind: "icon", icon: "⇄", color: "#7B3FF2", label: "Shift your PRAN in" },
  { kind: "stat", big: "2.3 Cr", label: "NPS accounts in India", dark: true },
  { kind: "icon", icon: "↗", color: "#2F5BFF", label: "Track in Portfolio" },
  { kind: "icon", icon: "↻", color: "#FF6B2C", label: "Allocation by age" },
  { kind: "stat", big: "UPI", label: "pay in a tap" },
  { kind: "icon", icon: "✓", color: "#F0443A", label: "Order status, live" },
];

function TileCard({ t }: { t: Tile }) {
  if (t.kind === "icon") {
    return (
      <div className="flex size-[9.5rem] shrink-0 flex-col items-center justify-center gap-3 rounded-[1.6rem] bg-white text-center shadow-[0_10px_30px_-18px_rgba(0,0,0,0.3)]">
        <span className="grid size-11 place-items-center rounded-full text-lg font-semibold text-white shadow-[inset_0_-6px_10px_rgba(0,0,0,0.18)]" style={{ background: t.color }}>
          {t.icon}
        </span>
        <span className="px-3 text-sm font-medium leading-tight">{t.label}</span>
      </div>
    );
  }
  return (
    <div className={`flex size-[9.5rem] shrink-0 flex-col justify-end rounded-[1.6rem] p-4 ${t.dark ? "bg-ink text-bg" : "bg-[#FFE9DE] text-ink"}`}>
      <span className="text-2xl font-semibold tracking-[-0.04em]">{t.big}</span>
      <span className="text-xs opacity-70">{t.label}</span>
    </div>
  );
}

/**
 * The signature Habitline moment: the phone holds still in the middle while
 * two rows of feature tiles slide past behind it in opposite directions.
 */
export function PhoneStage() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: desktop ? "top top" : "top bottom",
            end: desktop ? "+=130%" : "bottom top",
            pin: desktop,
            scrub: 0.8,
          },
        });
        tl.fromTo(q("[data-row='a']"), { xPercent: 4 }, { xPercent: -38 }, 0)
          .fromTo(q("[data-row='b']"), { xPercent: -38 }, { xPercent: 4 }, 0)
          .fromTo(q("[data-stage-phone]"), { scale: 0.9 }, { scale: 1 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative flex min-h-svh items-center overflow-hidden py-20">
      <div
        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-4"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)" }}
      >
        {[ROW_A, ROW_B].map((row, i) => (
          <div key={i} data-row={i ? "b" : "a"} className="flex w-max gap-4">
            {[...row, ...row].map((t, k) => (
              <TileCard key={k} t={t} />
            ))}
          </div>
        ))}
      </div>
      <div data-stage-phone className="relative z-10 mx-auto">
        <Shot src="pfInvest" alt="Upstox NPS portfolio with current value, returns and holdings" width={290} />
      </div>
      <p className="label absolute inset-x-0 top-24 text-center">★ Live to 100% of users since 7 Feb 2025</p>
    </section>
  );
}
