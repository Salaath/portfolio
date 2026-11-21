"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { DESKTOP, MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

// The leadership projects on the home page as one horizontal row. On desktop
// the row holds still in the window while the page scroll slides it sideways,
// until the last project is in view; then the page carries on down. On a
// phone the row is swiped sideways.
export function LeadRail({ header, children, count }: { header: ReactNode; children: ReactNode; count: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const track = q("[data-track]")[0] as HTMLElement;
      const counter = q("[data-counter]")[0] as HTMLElement;
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
            onUpdate(self) {
              counter.textContent = pad(Math.min(count, Math.floor(self.progress * count) + 1));
            },
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

  // phones: the counter follows the swipe
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>("[data-track]");
    const counter = root.current?.querySelector<HTMLElement>("[data-counter]");
    if (!el || !counter) return;
    const read = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0 || getComputedStyle(el).overflowX === "visible") return;
      counter.textContent = pad(Math.round((el.scrollLeft / max) * (count - 1)) + 1);
    };
    el.addEventListener("scroll", read, { passive: true });
    return () => el.removeEventListener("scroll", read);
  }, [count]);

  return (
    <div ref={root}>
      <div className="mb-12 md:mb-0">{header}</div>
      {/* desktop: one window tall and held in place while the row travels */}
      <div data-stage className="-mx-4 sm:-mx-10 md:relative md:flex md:h-svh md:flex-col md:justify-center md:overflow-x-clip md:overflow-y-visible md:pt-12">
        <div
          data-track
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:scroll-px-10 sm:px-10 md:grid md:w-max md:snap-none md:auto-cols-[38vw] md:grid-flow-col md:grid-rows-[repeat(4,auto)] md:gap-x-6 md:gap-y-0 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
        <div className="mt-8 flex items-center gap-5 px-4 sm:px-10 md:hidden">
          <span className="label tabular-nums"><span data-counter>01</span> / {pad(count)}</span>
        </div>
      </div>
    </div>
  );
}
