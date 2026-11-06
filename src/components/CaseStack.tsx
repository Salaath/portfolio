"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CaseStudy } from "@/content/cases";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Selected work as a deck of full-screen covers. On desktop the section pins
 * and each next case wipes up over the last, which sinks back and dims; the
 * cover inside settles from a slight zoom as it lands. Mobile is a plain stack.
 */
export function CaseStack({ cases }: { cases: CaseStudy[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const panels = q("[data-panel]") as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        if (!desktop) {
          panels.forEach((p) =>
            gsap.from(p.querySelector("[data-cover]"), {
              scale: 1.2,
              duration: 1.6,
              scrollTrigger: { trigger: p, start: "top 85%", once: true },
            }),
          );
          return;
        }

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (panels.length - 1) * 1.1}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.set(panels.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        panels.slice(1).forEach((p, i) => {
          const prev = panels[i];
          tl.to(p, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" }, i)
            .fromTo(p.querySelector("[data-cover]"), { scale: 1.25, yPercent: 8 }, { scale: 1, yPercent: 0 }, i)
            .from(p.querySelectorAll("[data-lift]"), { yPercent: 120, stagger: 0.04, ease: "power3.out", duration: 0.6 }, i + 0.35)
            .fromTo(prev, { scale: 1, filter: "brightness(1)" }, { scale: 0.9, filter: "brightness(0.45)", ease: "power2.inOut", immediateRender: false }, i);
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative md:h-svh">
      {cases.map((c, i) => {
        const dark = c.coverInk === "dark";
        return (
        <article
          key={c.slug}
          data-panel
          className="relative h-[90svh] overflow-hidden md:absolute md:inset-0 md:h-auto"
        >
          <Link href={`/work/${c.slug}`} data-cursor="View" className="absolute inset-0 block">
            <div
              data-cover
              className="absolute inset-0 will-change-transform"
              style={{ background: `radial-gradient(120% 120% at 20% 10%, ${c.cover[0]}, ${c.cover[1]})` }}
            >
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className={`h-full w-full object-cover ${dark ? "object-[91%_50%] md:object-[82%_50%]" : "object-[82%_50%]"}`} />
              ) : null}
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-[#f6f6f6] from-45% via-[#f6f6f6]/70 via-55% to-transparent to-72% md:hidden" : "from-black/55 via-transparent to-black/20"}`} />
            <div className={`relative flex h-full flex-col justify-between p-4 sm:p-10 ${dark ? "text-ink" : "text-white"}`}>
              <div className={`label flex justify-between ${dark ? "!text-ink/60" : "!text-white/70"}`}>
                <span>({pad(i + 1)}) — {pad(cases.length)}</span>
                <span>{c.year}</span>
              </div>
              <div>
                <h3 className="max-w-5xl overflow-hidden text-balance text-[9vw] md:max-w-[48vw] font-semibold leading-[0.95] tracking-[-0.045em] md:text-[6vw]">
                  <span data-lift className="block">{c.title}</span>
                </h3>
                <div className={`mt-8 grid gap-4 border-t pt-5 md:grid-cols-6 ${dark ? "border-ink/20" : "border-white/25"}`}>
                  <p className="overflow-hidden md:col-span-2"><span data-lift className={`block ${dark ? "text-ink/75" : "text-white/85"}`}>{c.tagline}</span></p>
                  <p className={`label overflow-hidden md:col-span-2 md:pl-3 ${dark ? "!text-ink/60" : "!text-white/70"}`}><span data-lift className="block">{c.role} · {c.tags.join(" / ")}</span></p>
                  <p className="overflow-hidden text-sm font-medium md:col-span-2 md:pl-3 md:text-right"><span data-lift className="block">View case study ↗</span></p>
                </div>
              </div>
            </div>
          </Link>
        </article>
        );
      })}
    </div>
  );
}
