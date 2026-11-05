"use client";

import { useEffect, useRef, useState } from "react";

// Where people left Version 2.0: circles sized by loss, with the same numbers as
// an easy-to-read list beside them. Each stage's figure is the share of everyone
// who started, so they add up with the ~28% who finished.

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

// circle centres in the 980 × 500 chart, in STAGES order
const BUBBLES = [
  [84, 330], [355, 245], [632, 96], [690, 244], [810, 150], [612, 372], [716, 410], [810, 342], [904, 268],
];

export function DropOff() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const s = hover === null ? null : STAGES[hover];

  return (
    <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-start">
      <div>
        <div className="overflow-hidden rounded-2xl bg-card">
          <svg viewBox="0 0 980 500" className="block w-full" role="img" aria-label="Circles sized by drop-off. Verify PAN at 59% dwarfs every other stage.">
            {STAGES.map((st, i) => {
              const r = 205 * Math.sqrt(st.drop / 59);
              const [cx, cy] = BUBBLES[i];
              const big = r > 34;
              const pan = i === 1;
              return (
                <g
                  key={st.name}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transformBox: "view-box",
                    transform: on ? (hover === i ? "scale(1.06)" : "scale(1)") : "scale(0)",
                    opacity: hover !== null && hover !== i ? 0.35 : 1,
                    transition: `opacity .3s, transform ${hover === null ? 1 : 0.35}s cubic-bezier(.2,1.2,.3,1) ${on && hover === null ? i * 0.07 : 0}s`,
                  }}
                >
                  <circle cx={cx} cy={cy} r={r} fill={pan ? RED : "#141217"} opacity={pan ? 1 : 0.88} />
                  {pan ? (
                    <>
                      <text x={cx} y={cy + 8} textAnchor="middle" fill="#fff" fontSize="96" fontWeight="600" letterSpacing="-5">59%</text>
                      <text x={cx} y={cy + 46} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="500">Verify PAN</text>
                    </>
                  ) : big ? (
                    <>
                      <text x={cx} y={cy + 8} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="600">{st.drop}%</text>
                      <text x={cx} y={cy + r + 25} textAnchor="middle" fontSize="21" fill="currentColor">{st.short}</text>
                    </>
                  ) : (
                    <>
                      <text x={cx} y={cy + r + 24} textAnchor="middle" fontSize="21" fontWeight="600" fill="currentColor">{st.drop}%</text>
                      <text x={cx} y={cy + r + 47} textAnchor="middle" fontSize="21" fill="currentColor" opacity="0.7">{st.short}</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-5 min-h-[3.25rem] max-w-2xl text-sm text-muted md:text-base">
          {s ? (
            <>
              <b className="font-semibold text-ink">{s.name}, {s.drop}%.</b> {s.ask}.
            </>
          ) : (
            "Hover a stage to see what it asked people to do."
          )}
        </p>
      </div>

      <ul>
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
        {STAGES.map((st, i) => (
          <li
            key={st.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex justify-between border-t border-line py-2 text-sm transition-colors ${hover === i ? "text-ink" : "text-muted"}`}
          >
            <span className={i === 1 ? "font-semibold text-ink" : ""}>{st.name}</span>
            <span className="tabular-nums" style={i === 1 ? { color: RED, fontWeight: 600 } : undefined}>{st.drop}%</span>
          </li>
        ))}
        <li className="border-t border-line pt-3 text-xs text-muted">Out of every 100 people who started</li>
      </ul>
    </div>
  );
}
