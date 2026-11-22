"use client";

import { useRef, type ReactNode } from "react";
import { DESKTOP, MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

// The leadership projects on the home page as one horizontal row. On desktop
// the row holds still in the window while the page scroll slides it sideways,
// until the last project is in view; then the page carries on down. On a
// phone the projects stack one below the other.
export function LeadRail({ header, children }: { header: ReactNode; children: ReactNode; count?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const track = q("[data-track]")[0] as HTMLElement;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion || !desktop) return;
        const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
        // The thumbnails sit on the inside of a curved wall that the viewer stands
        // in front of: one shared vanishing point in the middle of the window, each
        // thumbnail a flat panel on a cylinder. Out towards the edges a panel
        // turns inwards and comes closer, so it reads taller; in the middle it is
        // flat. As the row slides, the cards travel round the curve.
        const tiles = q("[data-curve]") as HTMLElement[];
        const bend = () => {
          const vw = window.innerWidth;
          const R = vw * 0.72;
          const box = track.getBoundingClientRect();
          // the horizon sits low on the thumbnails, so they grow upwards and stay clear of the titles
          track.style.perspective = `${vw * 1.15}px`;
          track.style.perspectiveOrigin = `${vw / 2 - box.left}px ${tiles[0].offsetHeight * 0.78}px`;
          tiles.forEach((t) => {
            const card = t.parentElement!.getBoundingClientRect();
            const x = card.left + card.width / 2 - vw / 2;
            const a = Math.max(-1.2, Math.min(1.2, x / R));
            gsap.set(t, { x: R * Math.sin(a) - R * a, z: R * (1 - Math.cos(a)), rotateY: (-a * 180) / Math.PI });
          });
        };
        const rail = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            // a little more scroll than the row travels, so it doesn't rush past
            end: () => `+=${distance() * 1.6}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: bend,
          },
        });
        rail.to(track, { x: () => -distance(), onUpdate: bend }, 0);

        // Text above settles after the fonts load and can move this row down the
        // page; measure again when the page height changes, so the row holds
        // exactly at the top of the window.
        const main = document.querySelector("main");
        let last = main?.scrollHeight ?? 0;
        let timer = 0;
        const ro = new ResizeObserver(() => {
          const h = main?.scrollHeight ?? 0;
          if (h === last) return;
          last = h;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
        });
        if (main) ro.observe(main);
        bend();
        return () => {
          gsap.set(tiles, { clearProps: "transform" });
          track.style.perspective = "";
          track.style.perspectiveOrigin = "";
          ro.disconnect();
          window.clearTimeout(timer);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="mb-12 md:mb-0">{header}</div>
      {/* desktop: one window tall and held in place while the row travels */}
      <div data-stage className="-mx-4 sm:-mx-10 md:relative md:flex md:h-svh md:flex-col md:justify-center md:overflow-x-clip md:overflow-y-visible md:pt-12">
        <div
          data-track
          className="flex flex-col gap-16 px-4 sm:px-10 md:grid md:w-max md:auto-cols-[38vw] md:grid-flow-col md:grid-rows-[repeat(4,auto)] md:gap-x-6 md:gap-y-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
