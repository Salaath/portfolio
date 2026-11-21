"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";
import { IPhone } from "@/components/ao/IPhone";
import { LoopVideo } from "@/components/ao/FlowVideo";
import { Tilt } from "./Bits";
import { ready, scrollToId } from "./Shell";

/* ---------- case study hero ------------------------------------------------ */

export function CaseHero({
  eyebrow,
  title,
  intro,
  meta,
  reel,
  poster,
  reelLabel,
  from,
  to,
  unit,
  caption,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  meta: [string, string][];
  reel: string;
  poster: string;
  reelLabel: string;
  /** The headline number counts from `from` down to `to`. */
  from: number;
  to: number;
  unit: string;
  caption: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK }, (ctx) => {
        gsap.set(q("[data-hidden]"), { autoAlpha: 1 });
        const num = q("[data-num]")[0];
        if (!(ctx.conditions as { motion: boolean }).motion) {
          num.textContent = String(to);
          return;
        }
        const intro = gsap.timeline({ paused: true });
        ready.then(() => intro.play());

        SplitText.create(q("[data-title]"), {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            padMasks(self);
            // a re-split (fonts arriving, a resize) after the intro has started just shows the text
            if (intro.time() > 0) return;
            return intro.from(self.words, { yPercent: 115, rotate: 5, transformOrigin: "0% 100%", duration: 1.4, stagger: 0.03 }, 0.1);
          },
        });
        const n = { v: from };
        intro
          .from(q("[data-phone]"), { yPercent: 28, rotate: 8, autoAlpha: 0, duration: 1.8 }, 0.15)
          .from(q("[data-in]"), { y: 28, autoAlpha: 0, stagger: 0.08, duration: 1.1 }, 0.6)
          .from(q("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.4, stagger: 0.06, ease: "expo.inOut" }, 0.7)
          .from(q("[data-timer]"), { x: 40, autoAlpha: 0, duration: 1.2 }, 0.9)
          .to(n, { v: to, duration: 2.2, ease: "power3.inOut", onUpdate: () => { num.textContent = String(Math.round(n.v)); } }, 1.3)
          .fromTo(q("[data-sweep]"), { scaleX: 1 }, { scaleX: to / from, transformOrigin: "0% 50%", duration: 2.2, ease: "power3.inOut" }, 1.3);

        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
          .to(q("[data-stage]"), { yPercent: -12, scale: 1.06 }, 0)
          .to(q("[data-copy]"), { yPercent: -10, autoAlpha: 0 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="relative overflow-hidden bg-bg px-4 pb-10 pt-28 text-ink sm:px-10 lg:min-h-svh">

      <div className="relative grid gap-12 lg:min-h-[calc(100svh-9.5rem)] lg:grid-cols-12 lg:items-center lg:gap-6">
        <div data-copy className="lg:col-span-7">
          <p data-in data-hidden className="label mb-8 flex items-center gap-3 !text-ink/60">
            <i className="size-[7px] rounded-full bg-[#5b2ebd]" /> {eyebrow}
          </p>
          <h1 data-title data-hidden className="text-[9.5vw] leading-[1] tracking-[-0.035em] lg:text-[4.3vw]">{title}</h1>
          <p data-in data-hidden className="mt-7 max-w-xl text-lg text-ink/65">{intro}</p>
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 md:grid-cols-3">
            {meta.map(([k, v]) => (
              <div key={k} className={`relative py-4 ${v.includes("\n") ? "col-span-full" : ""}`}>
                <span data-rule className="absolute inset-x-0 top-0 h-px bg-ink/20" />
                <dt data-in data-hidden className="label !text-ink/50">{k}</dt>
                <dd data-in data-hidden className={`mt-1 whitespace-pre-line text-sm ${v.includes("\n") ? "md:columns-2" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-stage className="relative mx-auto w-[64vw] max-w-[19rem] lg:col-span-5 lg:w-[21vw] lg:max-w-[22rem]">
          <Tilt max={9}>
            <div data-phone data-hidden style={{ animation: "f-float 7s ease-in-out infinite" }}>
              <IPhone>
                <LoopVideo src={reel} poster={poster} label={reelLabel} className="absolute inset-0 h-full w-full object-cover" />
              </IPhone>
            </div>
          </Tilt>

          {/* the number the whole project was about */}
          <div data-timer data-hidden className="absolute -left-[38%] bottom-[9%] w-[13.5rem] rounded-3xl bg-[#0e0e0e] p-5 text-white shadow-[0_30px_60px_-25px_rgba(20,10,40,0.55)] max-lg:-left-[22%] max-lg:w-[11.5rem]">
            <p className="label !text-[10px] !text-white/55">Time to open an account</p>
            <p className="mt-2 flex items-baseline gap-2">
              <b data-num className="text-7xl tabular-nums leading-none tracking-[-0.05em] max-lg:text-6xl">{from}</b>
              <span className="text-lg text-white/60">{unit}</span>
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div data-sweep className="h-full rounded-full bg-[#a78bfa]" />
            </div>
            <p className="mt-3 text-xs leading-snug text-white/55">{caption}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- chapter dock ---------------------------------------------------- */

type Ch = { id: string; n: string; label: string };

/**
 * The chapters of a case study as one bare line at the bottom of the screen: every
 * chapter number is always on show, the one being read opens out to its name and a
 * hairline along its base fills as the page is read. It sits on a thin pane of clear glass,
 * so it stays readable over any section. It reads the chapters from the page ([data-chapter]).
 */
/* `always` keeps it on screen from the top of the page, `labels` spells every
 * chapter out (for a short list) and `tone="dark"` is a dark bar that reads
 * over both light and dark sections. */
export function ChapterDock({ always = false, labels = false, tone = "light", name = "Chapters" }: { always?: boolean; labels?: boolean; tone?: "light" | "dark"; name?: string } = {}) {
  const shown = (active: number) => always || active >= 0;
  const dark = tone === "dark";
  const [chapters, setChapters] = useState<Ch[]>([]);
  const [active, setActive] = useState(-1);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    setChapters(els.map((el) => ({ id: el.id, n: el.dataset.chapter!, label: el.dataset.chapterLabel ?? "" })));
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      let cur = -1;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) cur = i;
      });
      setActive(cur);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => (raf ||= requestAnimationFrame(measure));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label={name}
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${dark ? "text-[#f2f1ed]" : "text-[#0e0e0e]"} ${shown(active) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    >
      <div className={`relative overflow-hidden rounded-[10px] px-1.5 py-0.5 backdrop-blur-2xl backdrop-saturate-[1.8] sm:px-2 ${dark ? "bg-[#131316]/75 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.14)]" : "bg-white/35 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.55),inset_0_1px_0_rgba(255,255,255,0.8)]"} ${shown(active) ? "pointer-events-auto" : ""}`}>
        <ol className="flex items-baseline">
          {chapters.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => scrollToId(c.id)}
                  title={c.label}
                  className={`flex items-baseline px-1.5 py-1.5 transition-opacity duration-500 sm:px-2 ${on ? "opacity-100" : labels ? "opacity-50 hover:opacity-100" : "opacity-40 hover:opacity-100"}`}
                >
                  <span className="font-mono text-[11px] tabular-nums">{c.n}</span>
                  <span className={`hidden overflow-hidden whitespace-nowrap text-[13px] transition-[max-width,margin,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:block ${on || labels ? "ml-2.5 mr-1 max-w-[16rem] opacity-100" : "max-w-0 opacity-0"}`}>{c.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <span aria-hidden className={`absolute inset-x-0 bottom-0 h-px ${dark ? "bg-white/10" : "bg-black/[0.06]"}`}>
          <span ref={bar} className={`absolute inset-0 origin-left scale-x-0 ${dark ? "bg-[#a78bfa]" : "bg-[#0e0e0e]"}`} />
        </span>
      </div>
    </nav>
  );
}

/* ---------- stat hero -------------------------------------------------------- */

type HeroStat = { value: string; label: string; note?: React.ReactNode };

/**
 * A hero that leads with the numbers: eyebrow, a display title, a short intro and
 * a mock-up beside them, then up to four results that count up along one rule.
 */
export function StatHero({
  eyebrow,
  title,
  intro,
  stats,
  accent = "#5B2EBD",
  footnote,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  stats: HeroStat[];
  accent?: string;
  footnote?: string;
  /** The mock-up or picture that sits beside the title. */
  children?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK }, (ctx) => {
        gsap.set(q("[data-hidden]"), { autoAlpha: 1 });
        if (!(ctx.conditions as { motion: boolean }).motion) return;
        const intro = gsap.timeline({ paused: true });
        ready.then(() => intro.play());

        SplitText.create(q("[data-title]"), {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            padMasks(self);
            if (intro.time() > 0) return;
            return intro.from(self.words, { yPercent: 115, rotate: 5, transformOrigin: "0% 100%", duration: 1.5, stagger: 0.04 }, 0.1);
          },
        });
        intro
          .from(q("[data-in]"), { y: 28, autoAlpha: 0, stagger: 0.09, duration: 1.1 }, 0.55)
          .from(q("[data-media]"), { y: 70, autoAlpha: 0, scale: 0.94, duration: 1.8 }, 0.3)
          .from(q("[data-rule]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.6, ease: "expo.inOut" }, 0.7)
          .from(q("[data-stat]"), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1.1 }, 0.95);

        // numbers count up, keeping their sign, unit and digit grouping
        (q("[data-num]") as HTMLElement[]).forEach((el, i) => {
          const text = el.textContent ?? "";
          const m = text.match(/[\d,]+(\.\d+)?/);
          if (!m) return;
          const target = parseFloat(m[0].replace(/,/g, ""));
          const dec = m[1] ? m[1].length - 1 : 0;
          const fmt = (v: number) => (m[0].includes(",") ? v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec));
          const o = { v: 0 };
          intro.to(o, { v: target, duration: 2, ease: "power3.out", onUpdate: () => { el.textContent = text.replace(m[0], fmt(o.v)); }, onComplete: () => { el.textContent = text; } }, 1 + i * 0.1);
        });

        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
          .to(q("[data-media]"), { yPercent: -10 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className={`relative overflow-hidden px-4 pb-12 pt-28 sm:px-10 md:pt-32 ${className}`}>
      <div className="relative grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className={children ? "lg:col-span-8" : "lg:col-span-12"}>
          <p data-in data-hidden className="label flex items-center gap-3">
            <i className="size-[7px] rounded-full" style={{ background: accent }} /> {eyebrow}
          </p>
          <h1 data-title data-hidden className="mt-7 max-w-[15ch] text-[13vw] leading-[0.92] tracking-[-0.045em] lg:text-[min(6.2vw,6.6rem)]">{title}</h1>
          <p data-in data-hidden className="mt-8 max-w-2xl text-xl leading-snug tracking-[-0.01em] text-ink/75">{intro}</p>
        </div>
        {children ? (
          <div data-media data-hidden className="relative mx-auto lg:col-span-4 lg:justify-self-end">
            {children}
          </div>
        ) : null}
      </div>

      <div data-rule className="relative mt-10 h-[2px] bg-ink" />
      <dl className={`relative grid ${stats.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        {stats.map((s, i) => (
          <div key={s.label} data-stat data-hidden className={`py-7 md:pr-8 ${i ? "border-t border-line md:border-l md:border-t-0 md:pl-8" : ""}`}>
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{s.label}</dt>
            <dd data-num className="mt-4 whitespace-nowrap text-6xl leading-none tabular-nums tracking-[-0.05em] md:text-[min(4.6vw,4.6rem)]" style={{ color: accent }}>{s.value}</dd>
            {s.note ? <dd className="mt-4 font-mono text-sm tabular-nums text-muted">{s.note}</dd> : null}
          </div>
        ))}
      </dl>
      {footnote ? <p data-in data-hidden className="relative border-t border-line pt-3 text-xs leading-relaxed text-muted">{footnote}</p> : null}
    </header>
  );
}
