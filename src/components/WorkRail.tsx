"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CaseStudy } from "@/content/cases";
import { DESKTOP, MOTION_OK, ScrollTrigger, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";

/**
 * Selected work. On desktop the section pins and the cards travel
 * horizontally as you scroll, with covers parallaxing inside their frames.
 * On mobile it's a vertical stack with scroll reveals.
 */
export function WorkRail({ cases }: { cases: CaseStudy[] }) {
  const ref = useRef<HTMLElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  useGSAP(
    () => {
      const root = ref.current!;
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0] as HTMLElement;
      const cards = q("[data-card]") as HTMLElement[];
      const counter = q("[data-counter]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        const distance = () => track.scrollWidth - window.innerWidth;

        if (desktop) {
          const rail = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const i = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
                counter.textContent = pad(i + 1);
              },
            },
          });
          rail
            .to(track, { x: () => -distance() }, 0)
            .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1 }, 0);
          const travel = rail.getChildren()[0] as gsap.core.Tween;

          cards.forEach((card) => {
            // Cover drifts against the travel direction for depth
            gsap.fromTo(
              card.querySelector("[data-cover]"),
              { xPercent: 10 },
              {
                xPercent: -10,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: travel,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
            // Index numeral counter-drifts faster
            gsap.fromTo(
              card.querySelector("[data-numeral]"),
              { xPercent: 40 },
              {
                xPercent: -40,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: travel,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
            // Title words rise as the card slides into view. The reveal is a
            // paused tween played by its own trigger: a toggle tween bound
            // directly to a containerAnimation stalls when SplitText re-splits.
            let reveal: gsap.core.Tween | undefined;
            SplitText.create(card.querySelector("[data-card-title]"), {
              type: "lines,words",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                padMasks(self);
                reveal = gsap.from(self.words, { yPercent: 120, stagger: 0.05, paused: true });
                return reveal;
              },
            });
            ScrollTrigger.create({
              trigger: card,
              containerAnimation: travel,
              start: "left 75%",
              once: true,
              onEnter: () => reveal?.play(),
            });

            // Tilt toward the pointer
            const frame = card.querySelector<HTMLElement>("[data-tilt]")!;
            gsap.set(frame, { transformPerspective: 1200 });
            const rx = gsap.quickTo(frame, "rotationX", { duration: 0.8, ease: "power3" });
            const ry = gsap.quickTo(frame, "rotationY", { duration: 0.8, ease: "power3" });
            const scale = gsap.quickTo(frame.querySelector("[data-cover]"), "scale", { duration: 1.2, ease: "power3" });
            card.addEventListener("pointermove", (e) => {
              const r = frame.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 10);
              rx(((e.clientY - r.top) / r.height - 0.5) * -10);
              scale(1.06);
            });
            card.addEventListener("pointerleave", () => {
              rx(0);
              ry(0);
              scale(1);
            });
          });
        } else {
          cards.forEach((card) => {
            gsap.from(card, {
              autoAlpha: 0,
              y: 80,
              scale: 0.94,
              duration: 1.4,
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            });
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="work"
      className="relative flex flex-col justify-center gap-10 py-24 md:h-svh md:gap-[4vh] md:overflow-hidden md:py-0"
    >
      <div className="flex items-baseline justify-between px-4 sm:px-10">
        <h2 className="font-serif text-5xl">Selected work</h2>
        <span className="font-mono text-sm text-muted">
          <span data-counter>01</span> / {pad(cases.length)}
        </span>
      </div>

      <div
        data-track
        className="flex flex-col gap-20 px-4 sm:px-10 md:w-max md:flex-row md:gap-[5vw] md:pr-[20vw]"
      >
        {cases.map((c, i) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            data-card
            data-cursor="View"
            className="group block md:w-[min(60vw,100svh)] md:shrink-0"
          >
            <div
              data-tilt
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card will-change-transform md:aspect-[16/9]"
            >
              <div
                data-cover
                className="absolute -inset-x-[14%] inset-y-0"
                style={{ background: `radial-gradient(120% 120% at 20% 10%, ${c.cover[0]}, ${c.cover[1]})` }}
              />
              <span
                data-numeral
                className="absolute bottom-2 right-6 font-serif text-[30vw] leading-none text-white/20 md:text-[14vw]"
              >
                {pad(i + 1)}
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 data-card-title className="font-serif text-3xl leading-tight sm:text-4xl">
                {c.title}
              </h3>
              <span className="shrink-0 text-sm text-muted">
                {c.role} · {c.year}
              </span>
            </div>
            <p className="mt-2 max-w-xl text-muted">{c.tagline}</p>
          </Link>
        ))}
      </div>

      <div className="mx-4 hidden h-px bg-line sm:mx-10 md:block">
        <div data-progress className="h-full origin-left bg-ink" />
      </div>
    </section>
  );
}
