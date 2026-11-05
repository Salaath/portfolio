"use client";

import { useInView } from "./DropOff";

// How many minutes each app takes to open an account, slowest to fastest, ending
// on Version 3.0. Each dial is 12 minutes and the wedge is the time taken.

const RED = "#D93A2B";
const GREEN = "#1F8A4C";

// [name, fastest minutes, slowest minutes, kind]
const APPS = [
  ["Upstox Version 2.0", 10, 12, "old"],
  ["Angel One", 6, 8, ""],
  ["Groww", 6, 8, ""],
  ["RIISE", 6, 7, ""],
  ["Lemonn", 5, 6, ""],
  ["Dhan", 4, 5, ""],
  ["SAHI", 4, 5, ""],
  ["mStock", 3, 4, ""],
  ["Grip", 3, 4, ""],
  ["Upstox Version 3.0", 2, 3, "new"],
] as const;

const colour = (k: string) => (k === "old" ? RED : k === "new" ? GREEN : "#b9b5ac");

function arc(cx: number, cy: number, r: number, mins: number) {
  if (mins >= 12) mins = 11.999;
  const t = (mins / 12) * Math.PI * 2 - Math.PI / 2;
  const x = (cx + r * Math.cos(t)).toFixed(2), y = (cy + r * Math.sin(t)).toFixed(2);
  return `M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${mins > 6 ? 1 : 0} 1 ${x} ${y} Z`;
}

export function BenchClocks() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
      {APPS.map(([name, a, b, k], i) => (
        <figure key={name} className={`rounded-2xl p-3 text-center ${k === "new" ? "bg-[#1F8A4C]/10 ring-1 ring-[#1F8A4C]/25" : ""}`}>
          <svg viewBox="0 0 120 120" className="mx-auto block w-full max-w-[150px]" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "rotate(-40deg) scale(.8)", transition: `all .8s cubic-bezier(.2,1,.3,1) ${i * 0.06}s` }}>
            <circle cx="60" cy="60" r="56" fill={k === "new" ? "#fff" : "var(--card)"} />
            <path d={arc(60, 60, 56, b)} fill={colour(k)} opacity="0.35" />
            <path d={arc(60, 60, 56, a)} fill={colour(k)} />
            {Array.from({ length: 12 }, (_, t) => {
              const r = (t / 12) * Math.PI * 2;
              return <line key={t} x1={(60 + 50 * Math.sin(r)).toFixed(2)} y1={(60 - 50 * Math.cos(r)).toFixed(2)} x2={(60 + 55 * Math.sin(r)).toFixed(2)} y2={(60 - 55 * Math.cos(r)).toFixed(2)} stroke="#fff" strokeWidth="1.5" opacity="0.8" />;
            })}
          </svg>
          <figcaption className="mt-3">
            <b className="block text-2xl font-semibold tabular-nums tracking-[-0.04em]" style={k ? { color: colour(k) } : undefined}>{a}–{b} min</b>
            <span className={`text-sm ${k ? "font-semibold" : "text-muted"}`}>{name}</span>
          </figcaption>
        </figure>
      ))}
      <p className="col-span-full text-sm text-muted">Each dial is 12 minutes. The solid wedge is the fastest time, the lighter wedge is the slowest.</p>
    </div>
  );
}
