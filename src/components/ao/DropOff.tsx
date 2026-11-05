"use client";

import { useEffect, useRef, useState } from "react";

// Three ways to show where people left Version 2.0. Each stage's figure is the
// share of everyone who started, so they add up with the ~28% who finished.

const RED = "#D93A2B";

export const STAGES = [
  { name: "Mobile & email", short: "Mobile", drop: 0.3, ask: "Two OTPs, one for the phone and one for email" },
  { name: "Verify PAN", short: "PAN", drop: 59, ask: "A “KYC needed” screen, onboarding steps, then PAN and DigiLocker" },
  { name: "Signature", short: "Signature", drop: 0.7, ask: "Draw, confirm, continue" },
  { name: "Bank verification", short: "Bank", drop: 3, ask: "Verify, confirm the fetched details, continue" },
  { name: "Segment activation", short: "Segments", drop: 3.7, ask: "Two more OTPs to fetch bank statements" },
  { name: "Personal details", short: "Personal", drop: 0.7, ask: "Five questions, one per screen" },
  { name: "Add nominee", short: "Nominee", drop: 0.7, ask: "A choice that opens a long form" },
  { name: "Selfie", short: "Selfie", drop: 1.1, ask: "A tutorial, a photo, then confirm" },
  { name: "eSign", short: "eSign", drop: 2.3, ask: "A Plus upsell, then nine taps through Aadhaar eSign" },
];

export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

function Readout({ i }: { i: number | null }) {
  const s = i === null ? null : STAGES[i];
  return (
    <p className="mt-6 min-h-[3.25rem] max-w-2xl text-sm text-muted md:text-base">
      {s ? (
        <>
          <b className="font-semibold text-ink">{s.name}, {s.drop}%.</b> {s.ask}.
        </>
      ) : (
        "Hover a stage to see what it asked people to do."
      )}
    </p>
  );
}

/* A: the journey as a river. Its height is the number of people still in it. */
export function DropRiver() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000, TOP = 46, K = 3.1, n = STAGES.length;
  const xs = Array.from({ length: n + 1 }, (_, i) => 30 + (i * (W - 60)) / n);
  let rem = 100;
  const left = [100, ...STAGES.map((s) => (rem -= s.drop))];
  const y = (r: number) => TOP + r * K;
  const seg = (i: number, f: (r: number) => number) => {
    const mx = (xs[i] + xs[i + 1]) / 2;
    return `C${mx} ${f(left[i])} ${mx} ${f(left[i + 1])} ${xs[i + 1]} ${f(left[i + 1])}`;
  };
  let river = `M${xs[0]} ${TOP} L${xs[n]} ${TOP} L${xs[n]} ${y(left[n])} `;
  for (let i = n - 1; i >= 0; i--) {
    const mx = (xs[i] + xs[i + 1]) / 2;
    river += `C${mx} ${y(left[i + 1])} ${mx} ${y(left[i])} ${xs[i]} ${y(left[i])} `;
  }
  river += "Z";
  const panSpill = `M${xs[1]} ${y(left[1])} ${seg(1, y)} L${xs[2]} ${y(left[1]) + 4} L${xs[1]} ${y(left[1]) + 4} Z`;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} 440`} className="block w-full" role="img" aria-label="River chart: 100 people start, 59 leave at PAN verification, about 28 finish">
        <defs>
          <clipPath id="riverReveal">
            <rect x="0" y="0" height="440" width={on ? W : 0} style={{ transition: "width 2s cubic-bezier(.3,.7,.2,1)" }} />
          </clipPath>
          <linearGradient id="riverInk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#141217" />
            <stop offset="1" stopColor="#3a2a66" />
          </linearGradient>
        </defs>
        <g clipPath="url(#riverReveal)">
          <path d={panSpill} fill={RED} />
          <path d={river} fill="url(#riverInk)" />
          {hover !== null ? <rect x={xs[hover]} y={TOP - 10} width={xs[hover + 1] - xs[hover]} height={330} fill="#fff" opacity="0.08" /> : null}
          <text x={xs[2] + 22} y={y(72)} fill={RED} fontSize="92" fontWeight="600" letterSpacing="-5">59%</text>
          <text x={xs[2] + 26} y={y(72) + 30} fill={RED} fontSize="20" fontWeight="500">of everyone who started left at Verify PAN</text>
          <text x={xs[0] + 12} y={TOP + 34} fill="#fff" fontSize="22" fontWeight="600">100 start</text>
          <text x={xs[n] - 12} y={TOP + 34} fill="#fff" fontSize="22" fontWeight="600" textAnchor="end">~28 finish</text>
        </g>
        {STAGES.map((s, i) => (
          <g key={s.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "default" }}>
            <rect x={xs[i]} y="0" width={xs[i + 1] - xs[i]} height="440" fill="transparent" />
            <line x1={xs[i + 1]} x2={xs[i + 1]} y1={TOP - 12} y2={TOP} stroke="currentColor" opacity="0.25" />
            <text x={(xs[i] + xs[i + 1]) / 2} y="18" textAnchor="middle" fontSize="16" fontWeight={i === 1 ? 700 : 500} fill={i === 1 ? RED : "currentColor"}>{s.short}</text>
            <text x={(xs[i] + xs[i + 1]) / 2} y="36" textAnchor="middle" fontSize="15" opacity="0.6" fill={i === 1 ? RED : "currentColor"}>{s.drop}%</text>
          </g>
        ))}
      </svg>
      <Readout i={hover} />
    </div>
  );
}

/* B: a field of circles. Area is proportional to the share of people lost. */
const BUBBLES = [
  [84, 330], [355, 245], [632, 96], [690, 244], [810, 150], [612, 372], [716, 410], [810, 342], [904, 268],
];
export function DropCircles() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-2xl bg-card">
        <svg viewBox="0 0 980 480" className="block w-full" role="img" aria-label="Circles sized by drop-off. Verify PAN at 59% dwarfs every other stage.">
          {STAGES.map((s, i) => {
            const r = 205 * Math.sqrt(s.drop / 59);
            const [cx, cy] = BUBBLES[i];
            const big = r > 34;
            const pan = i === 1;
            return (
              <g
                key={s.name}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transformBox: "view-box",
                  transform: on ? (hover === i ? "scale(1.06)" : "scale(1)") : "scale(0)",
                  transition: `transform ${hover === null ? 1 : 0.35}s cubic-bezier(.2,1.2,.3,1) ${on && hover === null ? i * 0.07 : 0}s`,
                }}
              >
                <circle cx={cx} cy={cy} r={r} fill={pan ? RED : "#141217"} opacity={pan ? 1 : hover === i ? 1 : 0.88} />
                {pan ? (
                  <>
                    <text x={cx} y={cy + 8} textAnchor="middle" fill="#fff" fontSize="96" fontWeight="600" letterSpacing="-5">59%</text>
                    <text x={cx} y={cy + 44} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="500">Verify PAN</text>
                  </>
                ) : big ? (
                  <>
                    <text x={cx} y={cy + 6} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="600">{s.drop}%</text>
                    <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="13" fill="currentColor">{s.short}</text>
                  </>
                ) : (
                  <>
                    <text x={cx} y={cy + r + 17} textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">{s.drop}%</text>
                    <text x={cx} y={cy + r + 33} textAnchor="middle" fontSize="13" fill="currentColor" opacity="0.7">{s.short}</text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <Readout i={hover} />
    </div>
  );
}

/* C: out of every 100 people. One dot, one person, rounded to whole people. */
const WHOLE = [0, 59, 1, 3, 4, 1, 1, 1, 2];
export function DropDots() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const dots: number[] = [];
  WHOLE.forEach((c, i) => {
    for (let k = 0; k < c; k++) dots.push(i);
  });
  while (dots.length < 100) dots.push(-1);
  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="mb-5 text-sm text-muted">Out of every 100 people who started</p>
        <div className="grid grid-cols-10 gap-[6px] sm:gap-2">
          {dots.map((d, i) => {
            const dim = hover !== null && hover !== d;
            return (
              <span
                key={i}
                className="aspect-square rounded-full"
                style={{
                  background: d === -1 ? "var(--ink)" : d === 1 ? RED : "#c9c4bb",
                  opacity: on ? (dim ? 0.15 : 1) : 0,
                  transform: on ? "scale(1)" : "scale(.3)",
                  transition: `opacity .4s, transform .6s cubic-bezier(.2,1.3,.3,1) ${hover === null ? i * 0.012 : 0}s`,
                }}
              />
            );
          })}
        </div>
      </div>
      <ul className="self-end">
        <li className="flex items-baseline justify-between pb-5">
          <span>
            <b className="block text-6xl font-semibold tracking-[-0.05em]" style={{ color: RED }}>59</b>
            <span className="text-sm text-muted">left at Verify PAN</span>
          </span>
          <span className="text-right">
            <b className="block text-6xl font-semibold tracking-[-0.05em]">~28</b>
            <span className="text-sm text-muted">reached the end</span>
          </span>
        </li>
        {STAGES.map((s, i) => (
          <li
            key={s.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex justify-between border-t border-line py-2 text-sm transition-colors ${hover === i ? "text-ink" : "text-muted"}`}
          >
            <span className={i === 1 ? "font-semibold text-ink" : ""}>{s.name}</span>
            <span className="tabular-nums" style={i === 1 ? { color: RED, fontWeight: 600 } : undefined}>{s.drop}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
