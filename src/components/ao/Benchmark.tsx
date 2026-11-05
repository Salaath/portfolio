"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./DropOff";

// Three ways to compare how many minutes each app takes to open an account.

const RED = "#D93A2B";

// [name, fastest minutes, slowest minutes, happy-path steps, kind]
const APPS = [
  ["Upstox Version 3.0", 1, 2, 7, "new"],
  ["Grip", 3, 4, 8, ""],
  ["mStock", 3, 4, 10, ""],
  ["SAHI", 4, 5, 9, ""],
  ["Dhan", 4, 5, 10, ""],
  ["Lemonn", 5, 6, 12, ""],
  ["RIISE", 6, 7, 12, ""],
  ["Groww", 6, 8, 10, ""],
  ["Angel One", 6, 8, 11, ""],
  ["Upstox Version 2.0", 8, 12, 11, "old"],
] as const;

const colour = (k: string) => (k === "old" ? RED : k === "new" ? "var(--ink)" : "#b9b5ac");
const Note = () => <p className="mt-5 text-sm text-muted">Happy path, timed on each app. Steps in the end column.</p>;

/* A: a race. A clock counts the minutes, and each app finishes when it finishes. */
export function BenchRace() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [m, setM] = useState(0);
  const raf = useRef(0);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (t: number) => {
      const v = Math.min(12, ((t - t0) / 9000) * 12);
      setM(v);
      if (v < 12) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => {
    if (on) run();
    return () => cancelAnimationFrame(raf.current);
  }, [on]);

  return (
    <div ref={ref}>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div className="flex items-baseline gap-3">
          <b className="text-7xl font-semibold tabular-nums tracking-[-0.05em] md:text-8xl">{m.toFixed(1)}</b>
          <span className="text-xl text-muted">minutes on the clock</span>
        </div>
        <button type="button" onClick={run} className="shrink-0 rounded-full border border-ink/25 px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-bg">↺ Race again</button>
      </div>
      {APPS.map(([name, a, b, , k]) => {
        const done = m >= b;
        return (
          <div key={name} className="grid grid-cols-[7.5rem_1fr_5rem] items-center gap-3 border-t border-line py-2.5 text-sm md:grid-cols-[11rem_1fr_7rem]">
            <span className={k ? "font-semibold" : ""}>{name}</span>
            <span className="relative h-5 overflow-hidden rounded-full bg-card">
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(Math.min(m, b) / 12) * 100}%`, background: colour(k) }} />
            </span>
            <span className={`text-right tabular-nums transition-opacity duration-300 ${done ? "opacity-100" : "opacity-25"}`}>
              <b className="font-semibold">{a}–{b} min</b>
            </span>
          </div>
        );
      })}
      <div className="grid grid-cols-[7.5rem_1fr_5rem] gap-3 border-t border-line pt-2 font-mono text-[11px] text-muted md:grid-cols-[11rem_1fr_7rem]">
        <span />
        <span className="flex justify-between">{[0, 2, 4, 6, 8, 10, 12].map((t) => <span key={t}>{t}m</span>)}</span>
        <span />
      </div>
    </div>
  );
}

/* B: a leaderboard. The minutes are the biggest thing on each row. */
export function BenchBoard() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      {[...APPS].reverse().map(([name, a, b, steps, k], i) => (
        <div key={name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-t border-line py-3 md:grid-cols-[13rem_10rem_1fr_4.5rem] md:items-center">
          <span className={`md:text-lg ${k ? "font-semibold" : ""}`}>{name}</span>
          <b className="whitespace-nowrap text-right text-3xl font-semibold tabular-nums tracking-[-0.04em] md:text-left md:text-4xl" style={k === "old" ? { color: RED } : undefined}>
            {a}–{b}<span className="ml-1 text-base font-normal tracking-normal text-muted">min</span>
          </b>
          <span className="col-span-2 mt-2 block h-2.5 overflow-hidden rounded-full bg-card md:col-span-1 md:mt-0">
            <span
              className="block h-full rounded-full"
              style={{ width: on ? `${(b / 12) * 100}%` : 0, background: colour(k), transition: `width 1.1s cubic-bezier(.2,.8,.2,1) ${i * 0.06}s` }}
            />
          </span>
          <span className="hidden text-right font-mono text-xs text-muted md:block">{steps} steps</span>
        </div>
      ))}
      <Note />
    </div>
  );
}

/* C: clock faces. Each dial is 12 minutes, and the wedge is the time taken. */
function arc(cx: number, cy: number, r: number, mins: number) {
  if (mins >= 12) mins = 11.999;
  const t = (mins / 12) * Math.PI * 2 - Math.PI / 2;
  const x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
  return `M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${mins > 6 ? 1 : 0} 1 ${x} ${y} Z`;
}
export function BenchClocks() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
      {APPS.map(([name, a, b, , k], i) => (
        <figure key={name} className="text-center">
          <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[150px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "rotate(-40deg) scale(.8)", transition: `all .8s cubic-bezier(.2,1,.3,1) ${i * 0.06}s` }}>
            <circle cx="60" cy="60" r="56" fill="var(--card)" />
            <path d={arc(60, 60, 56, b)} fill={colour(k)} opacity="0.35" />
            <path d={arc(60, 60, 56, a)} fill={colour(k)} />
            {Array.from({ length: 12 }, (_, t) => {
              const r = (t / 12) * Math.PI * 2;
              return <line key={t} x1={60 + 50 * Math.sin(r)} y1={60 - 50 * Math.cos(r)} x2={60 + 55 * Math.sin(r)} y2={60 - 55 * Math.cos(r)} stroke="#fff" strokeWidth="1.5" opacity="0.8" />;
            })}
          </svg>
          <figcaption className="mt-3">
            <b className="block text-2xl font-semibold tabular-nums tracking-[-0.04em]" style={k === "old" ? { color: RED } : undefined}>{a}–{b} min</b>
            <span className={`text-sm ${k ? "font-semibold" : "text-muted"}`}>{name}</span>
          </figcaption>
        </figure>
      ))}
      <p className="col-span-full text-sm text-muted">Each dial is 12 minutes. The solid wedge is the fastest time, the lighter wedge is the slowest.</p>
    </div>
  );
}
