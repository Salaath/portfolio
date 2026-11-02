"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Cover that wipes open on load, then shrinks into a rounded card and
 * parallaxes as you scroll past it.
 */
export function CaseHero({ cover }: { cover: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const [frame] = q("[data-frame]");
        const [fill] = q("[data-fill]");

        gsap
          .timeline({ delay: 0.5 })
          .fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          )
          .from(fill, { scale: 1.4, duration: 2.2, ease: "expo.out" }, "<0.2");

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
          })
          .to(frame, { scale: 0.86, borderRadius: 32 }, 0)
          .to(fill, { yPercent: 18 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="h-[85svh]">
      <div data-frame className="relative h-full overflow-hidden will-change-transform">
        <div
          data-fill
          className="absolute -inset-y-[12%] inset-x-0"
          style={{ background: `radial-gradient(120% 120% at 20% 10%, ${cover[0]}, ${cover[1]})` }}
        />
      </div>
    </div>
  );
}
