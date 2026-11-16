"use client";

import { useRef } from "react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { LoopVideo } from "@/components/ao/FlowVideo";
import { Phone } from "./Phone";

export type Theme = {
  src: string;
  name: string;
  vision: string;
  look: string;
  bg: string;
  accent: string;
  dark?: boolean;
};

/**
 * The four Palette themes, one full screen each. On desktop the block pins and
 * each theme wipes up over the last (the CaseStack mechanic); on mobile they
 * are plain full-height panels. Videos are cropped to the phone screen, so the
 * bezel here is drawn in CSS.
 */
export function ThemeStack({ themes, base }: { themes: Theme[]; base: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const panels = q("[data-theme]") as HTMLElement[];
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion || !desktop) return;
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
            .fromTo(p.querySelector("[data-phone]"), { yPercent: 18, rotate: 4 }, { yPercent: 0, rotate: 0, ease: "power3.out" }, i)
            .from(p.querySelectorAll("[data-lift]"), { yPercent: 110, stagger: 0.05, ease: "power3.out", duration: 0.6 }, i + 0.3)
            .fromTo(prev, { scale: 1, filter: "brightness(1)" }, { scale: 0.92, filter: "brightness(0.5)", ease: "power2.inOut", immediateRender: false }, i);
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative md:h-svh md:overflow-hidden">
      {themes.map((t, i) => {
        const muted = t.dark ? "text-white/60" : "text-ink/55";
        const rule = t.dark ? "border-white/25" : "border-ink/20";
        return (
          <article
            key={t.name}
            data-theme
            className={`relative min-h-svh overflow-hidden md:absolute md:inset-0 md:min-h-0 ${t.dark ? "text-white" : "text-ink"}`}
            style={{ background: t.bg }}
          >
            <div className="mx-auto grid h-full max-w-6xl gap-8 px-4 pb-12 pt-20 sm:px-10 md:grid-cols-12 md:gap-10 md:py-0">
              {/* left: tabs at the top, the theme at the bottom */}
              <div className="order-2 flex flex-col justify-between gap-12 md:order-1 md:col-span-6 md:pb-14 md:pt-28">
                <ol className={`grid grid-cols-4 border-t ${rule}`}>
                  {themes.map((o, j) => (
                    <li key={o.name} className={`pt-3 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-[11px] ${j === i ? "" : muted}`}>
                      <span className="block">{pad(j + 1)}</span>
                      <span className={`mt-1 inline-block ${j === i ? "border-b pb-0.5" : ""}`} style={j === i ? { borderColor: t.accent } : undefined}>
                        {o.name}
                      </span>
                    </li>
                  ))}
                </ol>
                <div>
                  <p className={`overflow-hidden font-mono text-xs uppercase tracking-[0.12em] ${muted}`}>
                    <span data-lift className="block">Theme {pad(i + 1)} / {pad(themes.length)}</span>
                  </p>
                  <h4 className="mt-4 overflow-hidden pb-[0.14em] text-[16vw] font-semibold leading-[0.88] tracking-[-0.06em] md:text-[6.2vw] xl:text-[5.6rem]">
                    <span data-lift className="block">{t.name}</span>
                  </h4>
                  <dl className={`mt-8 grid gap-5 border-t pt-5 sm:grid-cols-2 ${rule}`}>
                    <div className="overflow-hidden">
                      <div data-lift>
                        <dt className={`font-mono text-[11px] uppercase tracking-[0.12em] ${muted}`}>Vision</dt>
                        <dd className="mt-2 text-lg font-medium leading-snug tracking-[-0.01em]">{t.vision}</dd>
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <div data-lift>
                        <dt className={`font-mono text-[11px] uppercase tracking-[0.12em] ${muted}`}>Look</dt>
                        <dd className={`mt-2 text-[15px] leading-relaxed ${muted}`}>{t.look}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>

              {/* right: the phone, nearly full height (device is 0.4733 × its height) */}
              <div className="relative order-1 flex items-center justify-center md:order-2 md:col-span-6">
                <div aria-hidden className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[90px]" style={{ background: t.accent }} />
                <div data-phone className="relative will-change-transform">
                  <Phone className="w-[min(74vw,calc(66svh*0.4733))] md:mt-8 md:w-[calc(min(84svh,100svh-8rem)*0.4733)]">
                    <LoopVideo src={`${base}/${t.src}.mp4`} poster={`${base}/${t.src}.jpg`} label={`Palette ${t.name} page, scrolling`} className="absolute inset-0 block h-full w-full object-cover" />
                  </Phone>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
