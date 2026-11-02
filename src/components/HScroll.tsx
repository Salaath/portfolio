"use client";

import { useRef } from "react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Pinned horizontal rail: on desktop the section pins while its track slides
 * sideways under the intro column, each item easing up into line as it
 * enters. On mobile the track scrolls sideways natively.
 */
export function HScroll({
  intro,
  children,
  className = "",
}: {
  intro: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const track = q("[data-track]")[0] as HTMLElement;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion || !desktop) return;
        const distance = () => Math.max(0, track.offsetLeft + track.scrollWidth - window.innerWidth + 40);
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
        (q("[data-track] > *") as HTMLElement[]).forEach((item) => {
          gsap.fromTo(
            item,
            { yPercent: 14, rotate: 2.5 },
            {
              yPercent: 0,
              rotate: 0,
              ease: "none",
              scrollTrigger: { trigger: item, containerAnimation: travel, start: "left right", end: "left 60%", scrub: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className={`relative flex flex-col gap-12 overflow-hidden py-24 md:h-svh md:flex-row md:items-center md:gap-0 md:py-0 ${className}`}
    >
      <div className="relative z-10 shrink-0 bg-inherit px-4 sm:px-10 md:flex md:w-[34vw] md:flex-col md:justify-center md:self-stretch">
        {intro}
      </div>
      <div
        data-track
        className="flex gap-5 overflow-x-auto px-4 pb-4 sm:px-10 md:w-max md:overflow-visible md:pb-0 md:pl-0"
      >
        {children}
      </div>
    </section>
  );
}
