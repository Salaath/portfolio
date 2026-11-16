"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";
import { IPhone } from "@/components/ao/IPhone";
import { LoopVideo } from "@/components/ao/FlowVideo";
import { Tilt } from "./Bits";
import { lockScroll, ready, scrollToId } from "./Shell";

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
 * A glass pill at the bottom of a case study: the chapter being read, how far
 * through the page you are, and the full list on tap. It reads the chapters
 * from the page ([data-chapter] sections), so pages don't have to list them.
 */
export function ChapterDock() {
  const [chapters, setChapters] = useState<Ch[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

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
      ring.current?.style.setProperty("stroke-dashoffset", String(100 - (max > 0 ? (window.scrollY / max) * 100 : 0)));
    };
    const onScroll = () => (raf ||= requestAnimationFrame(measure));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  useEffect(() => () => lockScroll(false), []);

  const cur = chapters[active];
  return (
    <div className={`fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${cur ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"}`}>
      <div className="f-glass relative w-full max-w-sm rounded-[1.75rem] text-[#f2f1ed]">
        <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ol data-lenis-prevent className="max-h-[50svh] overflow-y-auto p-2 pb-0">
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      scrollToId(c.id);
                    }}
                    className={`flex w-full items-baseline gap-4 rounded-2xl px-4 py-2.5 text-left transition-colors hover:bg-white/10 ${i === active ? "text-white" : "text-white/55"}`}
                  >
                    <span className="w-8 font-mono text-[11px]">{c.n}</span>
                    <span className="flex-1">{c.label}</span>
                    {i === active ? <i className="size-1.5 self-center rounded-full bg-[#a78bfa]" /> : null}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 py-2 pl-2 pr-4 text-left text-sm">
          <svg viewBox="0 0 36 36" className="size-9 shrink-0 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5" />
            <circle ref={ring} cx="18" cy="18" r="15.9" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
          </svg>
          <span className="font-mono text-[11px] text-white/50">{cur?.n}</span>
          <span key={cur?.id} className="f-rise flex-1 truncate">{cur?.label}</span>
          <span className={`text-white/50 transition-transform duration-500 ${open ? "rotate-180" : ""}`}>⌃</span>
        </button>
      </div>
    </div>
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
