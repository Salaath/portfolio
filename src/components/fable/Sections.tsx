"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "@/content/cases";
import { ask } from "./Ask";

/* ---------- work ---------------------------------------------------------- */

const pointer = (e: React.PointerEvent<HTMLElement>) => {
  const b = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--px", ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
  e.currentTarget.style.setProperty("--py", ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
};
const rest = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--px", "0");
  e.currentTarget.style.setProperty("--py", "0");
};
// The cover drifts against the pointer and eases in on hover.
const COVER =
  "h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translate3d(calc(var(--px,0)*-22px),calc(var(--py,0)*-22px),0)_scale(1.05)] group-hover:[transform:translate3d(calc(var(--px,0)*-22px),calc(var(--py,0)*-22px),0)_scale(1.1)]";

/** The lead case: one wide cover with the story set into its empty left half. */
export function WorkFeature({ c, href, index }: { c: CaseStudy; href: string; index: string }) {
  return (
    <Link href={href} data-cursor="Open" onPointerMove={pointer} onPointerLeave={rest} className="group relative block overflow-hidden rounded-[1.75rem] bg-white text-[#0e0e0e] md:rounded-[2.25rem]">
      <div data-wipe className="relative aspect-[4/3] overflow-hidden md:aspect-[16/8.4]">
        <div data-wipe-inner className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.image} alt="" className={`${COVER} object-[78%_50%] md:object-center`} />
        </div>
      </div>
      <div className="relative flex flex-col justify-between gap-8 p-6 md:absolute md:inset-0 md:w-[46%] md:p-12">
        <p className="label flex gap-6 !text-black/55">
          <span>({index})</span>
          <span>{c.tags.join(" / ")}</span>
        </p>
        <div>
          <h3 data-split="lines" className="text-4xl leading-[1] tracking-[-0.03em] md:text-[3.6vw]">{c.title}</h3>
          <p data-fade className="mt-5 max-w-md text-black/65">{c.tagline}</p>
          <dl data-fade data-delay="0.1" className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-black/15 pt-5">
            {c.metrics.map((m) => (
              <div key={m.label}>
                <dd className="whitespace-nowrap text-lg tracking-[-0.03em] text-[#5b2ebd] sm:text-2xl md:text-[2vw]">{m.value}</dd>
                <dt className="mt-1 text-xs leading-snug text-black/55">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <span className="absolute bottom-6 right-6 hidden items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:flex md:bottom-10 md:right-10">
        Read the case study <span className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
      </span>
    </Link>
  );
}

/** Every other case: a clean cover, then the title with its three numbers underneath. */
export function WorkCard({ c, href, index, aspect = "aspect-[4/3]", focus = "50%" }: { c: CaseStudy; href: string; index: string; aspect?: string; focus?: string }) {
  return (
    <Link href={href} data-cursor="Open" onPointerMove={pointer} onPointerLeave={rest} className="group block">
      <div data-wipe className={`relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ${aspect}`}>
        <div data-wipe-inner className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.image} alt="" loading="lazy" className={COVER} style={{ objectPosition: `${focus} 50%` }} />
        </div>
      </div>
      <div className="mt-5 grid gap-x-6 gap-y-2 md:grid-cols-[auto_1fr_auto]">
        <span className="label pt-1.5">({index})</span>
        <div>
          <h3 className="max-w-xl text-2xl leading-[1.1] tracking-[-0.02em] md:text-3xl">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">{c.title}</span>
          </h3>
          <p className="mt-2 max-w-lg text-sm text-muted">{c.tagline}</p>
          <dl data-fade className="mt-6 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-4">
            {c.metrics.map((m) => (
              <div key={m.label}>
                <dd className="whitespace-nowrap text-lg tracking-[-0.03em] text-[var(--accent)] sm:text-2xl md:text-[1.9vw]">{m.value}</dd>
                <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <span className="label pt-1.5">{c.year}</span>
      </div>
    </Link>
  );
}

/* ---------- working with AI ---------------------------------------------- */

// Draft copy: review before launch.
const SESSION: [string, string][] = [
  ["render “UP_AO 2.0.fig”", "Screens rendered straight from the Figma file"],
  ["build prototype --paths happy,pan,bank,manual", "A coded prototype with every fallback path"],
  ["record prototype --path happy", "Walkthrough recorded and cut into 8 clips"],
  ["deploy prototype", "Live and embedded in the case study"],
];

/** A terminal that plays the pipeline behind a case study, one command at a time. */
export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // commands fully run
  const [typed, setTyped] = useState(0); // characters of the current command
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setStep(SESSION.length);
    let ids: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      setStep(0);
      setTyped(0);
      let at = 500;
      SESSION.forEach(([cmd], i) => {
        for (let ch = 1; ch <= cmd.length; ch++) ids.push(setTimeout(() => setTyped(ch), (at += 26)));
        ids.push(setTimeout(() => { setStep(i + 1); setTyped(0); }, (at += 520)));
        at += 380;
      });
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      play();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      ids.forEach(clearTimeout);
      ids = [];
    };
  }, [run]);

  return (
    <div ref={ref} className="f-glass overflow-hidden rounded-3xl font-mono text-[13px] leading-relaxed">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <i key={c} className="size-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
        <span className="ml-3 text-white/40">case-study — claude</span>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="ml-auto text-white/40 transition-colors hover:text-white">↻ replay</button>
      </div>
      <div className="min-h-[19rem] px-5 py-5">
        {SESSION.map(([cmd, out], i) =>
          i > step ? null : (
            <div key={cmd} className="mb-4">
              <p className="text-white/90">
                <span className="text-[#a78bfa]">›</span>{" "}
                <span className={i === step ? "f-caret" : ""}>{i === step ? cmd.slice(0, typed) : cmd}</span>
              </p>
              {i < step ? (
                <p className="f-rise mt-1 flex gap-2 text-white/50">
                  <span className="text-[#4ade80]">✓</span> {out}
                </p>
              ) : null}
            </div>
          ),
        )}
        {step >= SESSION.length ? <p className="text-white/90"><span className="text-[#a78bfa]">›</span> <span className="f-caret" /></p> : null}
      </div>
    </div>
  );
}

export function AskButton({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => ask(q)} className="group flex items-center gap-2 text-left text-ink underline-offset-4 hover:underline">
      {children} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </button>
  );
}

/* ---------- what I do ------------------------------------------------------ */

export function Disciplines({ items }: { items: { title: string; body: string; tags: string[] }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-b border-line">
      {items.map((d, i) => {
        const on = open === i;
        return (
          <li key={d.title} onMouseEnter={() => setOpen(i)} className="border-t border-line">
            <button type="button" aria-expanded={on} onClick={() => setOpen(i)} className="grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[6rem_1fr_auto]">
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <span className={`text-4xl tracking-[-0.03em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-[5vw] md:leading-[1] ${on ? "translate-x-2 text-ink md:translate-x-6" : "text-ink/35"}`}>{d.title}</span>
              <span className={`grid size-10 place-items-center rounded-full border border-line text-lg transition-transform duration-500 ${on ? "rotate-45 bg-ink text-bg" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="grid gap-6 pb-9 pl-[4rem] md:grid-cols-2 md:pl-[8.5rem]">
                  <p className="max-w-md text-lg text-muted">{d.body}</p>
                  <div className="flex flex-wrap content-start gap-2">
                    {d.tags.map((t) => <span key={t} className="rounded-full border border-line px-3 py-1 text-xs">{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- next case ------------------------------------------------------ */

/**
 * The way on to the next case study: one wide card with the cover shown whole and the
 * story (title, line and three numbers) set into the cover's quiet left side.
 */
export function NextCase({ c, href, label = "Next case study", foot, focus = "74%" }: { c: CaseStudy; href: string; label?: string; foot: string; focus?: string }) {
  const light = c.coverInk !== "dark"; // photo covers carry white text on desktop
  return (
    <section className="px-4 pb-8 pt-32 sm:px-10 md:pt-48">
      <div className="flex items-center justify-between border-t border-ink/80 pt-6">
        <p data-label className="label">[ {label} ]</p>
        <p className="label">{c.year}</p>
      </div>
      <Link href={href} data-cursor="Open" className={`group relative mt-8 block overflow-hidden rounded-[1.75rem] text-[#0e0e0e] md:rounded-[2.25rem] ${light ? "bg-[#e9e7e0]" : "bg-white"}`}>
        <div data-wipe className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9]">
          <div data-wipe-inner className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" style={{ objectPosition: `${focus} 40%` }} />
          </div>
          {light ? <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(0,0,0,0.55),transparent_58%)] md:block" /> : null}
        </div>
        <div className={`relative flex flex-col justify-end gap-6 p-6 md:absolute md:inset-0 md:w-[44%] md:p-12 ${light ? "md:text-white" : ""}`}>
          <h2 data-split="lines" className="text-4xl leading-[0.98] tracking-[-0.035em] md:text-[4vw]">{c.title}</h2>
          <p data-fade className="max-w-md opacity-70">{c.tagline}</p>
          <dl data-fade data-delay="0.1" className={`grid max-w-md grid-cols-3 gap-4 border-t pt-5 ${light ? "border-black/15 md:border-white/30" : "border-black/15"}`}>
            {c.metrics.map((m) => (
              <div key={m.label}>
                <dd className={`whitespace-nowrap text-lg tracking-[-0.03em] sm:text-2xl md:text-[2vw] ${light ? "text-[#5b2ebd] md:text-white" : "text-[#5b2ebd]"}`}>{m.value}</dd>
                <dt className="mt-1 text-xs leading-snug opacity-60">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <span className={`absolute right-6 top-6 hidden items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:right-10 md:top-10 md:flex ${light ? "bg-white text-black" : "bg-black text-white"}`}>
          Read the case study <span className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </span>
      </Link>
      <div className="label mt-10 flex justify-between gap-4">
        <span>Sal · Lead product designer, Upstox</span>
        <span>{foot}</span>
      </div>
    </section>
  );
}
