"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CaseStudy } from "@/content/cases";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Selected work as a deck of full-screen covers. On desktop the section pins
 * and each next case wipes up over the last, which sinks back and dims; the
 * cover inside settles from a slight zoom as it lands. On a phone each case is a
 * picture with its text underneath.
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
          className="relative overflow-hidden md:absolute md:inset-0"
        >
          {/* Phone: the picture sits on top and the text below it on the section's solid
              background, so nothing is ever read over the photo. Desktop: full-bleed cover. */}
          <Link href={`/work/${c.slug}`} data-cursor="View" className="relative block md:absolute md:inset-0">
            <div className="relative aspect-[4/5] overflow-hidden md:static md:aspect-auto md:overflow-visible">
            <div
              data-cover
              className="absolute inset-0 will-change-transform"
              style={{ background: `radial-gradient(120% 120% at 20% 10%, ${c.cover[0]}, ${c.cover[1]})` }}
            >
              {c.image && c.coverFit ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" aria-hidden className="cover-fit-back absolute inset-0 hidden h-full w-full object-cover" />
              ) : null}
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" style={{ "--cover-x": c.coverX ?? (dark ? "68%" : "82%") } as React.CSSProperties} className={`relative h-full w-full object-cover object-[var(--cover-x)_50%] md:object-[82%_50%] ${c.coverFit ? "cover-fit" : ""}`} />
              ) : null}
            </div>
            </div>
            {dark ? null : (
              <div className="absolute inset-0 hidden md:block md:bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_30%),linear-gradient(to_right,rgba(0,0,0,0.42),transparent_52%)]" />
            )}
            <div className={`relative flex flex-col justify-between gap-6 px-4 pb-14 pt-5 text-bg sm:px-10 md:h-full md:gap-0 md:p-10 md:pb-[4.75rem] ${dark ? "md:text-ink" : "md:text-white"}`}>
              <div className={`label flex justify-between max-md:!text-bg/60 ${dark ? "md:!text-ink/60" : "md:!text-white/70"}`}>
                <span>({pad(i + 1)}) — {pad(cases.length)}</span>
                <span>{c.year}</span>
              </div>
              <div>
                <h3 className={`-mb-[0.12em] max-w-5xl overflow-hidden pb-[0.12em] text-balance font-semibold leading-[0.95] tracking-[-0.045em] ${c.titleFit ? `text-[9vw] ${c.titleFit}` : `md:max-w-[48vw] ${dark ? "text-[9vw] md:text-[4.6vw]" : "text-[9vw] md:text-[6vw]"}`}`}>
                  <span data-lift className="block">{c.title}</span>
                </h3>
                <dl className="mt-6 grid max-w-md grid-cols-3 gap-4 md:mt-8 md:flex md:max-w-none md:gap-[3.4vw]">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="overflow-hidden">
                      <div data-lift>
                        <dd className={`whitespace-nowrap text-xl tracking-[-0.03em] sm:text-3xl md:text-[2.6vw] md:leading-none ${dark ? "md:text-[#5b2ebd]" : ""}`}>{m.value}</dd>
                        <dt className={`mt-1 text-[13px] leading-snug text-bg/65 md:mt-2 md:text-sm ${dark ? "md:text-ink/60" : "md:text-white/75"}`}>{m.label}</dt>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className={`mt-6 grid gap-4 border-t border-bg/20 pt-5 md:mt-8 md:grid-cols-6 ${dark ? "md:border-ink/20" : "md:border-white/25"}`}>
                  <p className="overflow-hidden md:col-span-2"><span data-lift className={`block text-bg/85 ${dark ? "md:text-ink/75" : "md:text-white/85"}`}>{c.tagline}</span></p>
                  <p className={`label overflow-hidden max-md:!text-bg/60 md:col-span-2 md:pl-3 ${dark ? "md:!text-ink/60" : "md:!text-white/70"}`}><span data-lift className="block">{c.role} · {c.tags.join(" / ")}</span></p>
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
