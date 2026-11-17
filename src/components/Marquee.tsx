"use client";

import { useRef } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * Endless marquee that reacts to scroll: scrolling speeds it up, flips its
 * direction to match and skews the type with velocity.
 */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = ref.current!.querySelector<HTMLElement>("[data-track]")!;
        const setX = gsap.quickSetter(track, "x", "px");
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3" });

        let x = 0;
        let dir = 1;
        let boost = 0;
        let speed = 1;

        const tick = (_time: number, dt: number) => {
          speed += (dir * (1 + boost) - speed) * 0.08;
          boost *= 0.93;
          x -= speed * dt * 0.08;
          setX(gsap.utils.wrap(-track.scrollWidth / 2, 0, x));
        };
        gsap.ticker.add(tick);

        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            dir = self.direction;
            boost = Math.min(Math.abs(v) / 120, 12);
            skewTo(gsap.utils.clamp(-10, 10, -v / 250));
          },
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        });

        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: ref },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-[3vw] text-[11vw] font-semibold leading-none tracking-[-0.04em] sm:text-[6vw]">{item}</span>
          <span aria-hidden className="font-mono text-[3vw] text-muted sm:text-[1.6vw]">/</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="overflow-hidden border-y border-line py-10" aria-label={items.join(", ")}>
      <div data-track className="flex w-max will-change-transform" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
