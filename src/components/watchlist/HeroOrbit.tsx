"use client";

import { useEffect, useId, useState } from "react";
import { Cube, Sphere } from "./Shapes";

// Background motion for the case study: grainy cyan-blue-violet orbs over
// big hairline ink circles that echo the site header's contour lines.
// - Loop: one hairline circle in the gap between sections.
// - Orbit: tilted rings behind a phone, spheres travelling along them, arcs turning.
// - Drift: a strip of floating shapes for the gaps between sections.
// - Accent: one floating sphere or cube.
// Decorative only; everything holds still with reduced motion.

// stroke colours: faint ring, dotted orbit and the stops of the arc gradient
export const MINT = ["#E4D8FB", "#8C93EE", "#7B55E8"] as const;

// One hairline circle, in the same 1px ink weight as the site header's contour
// lines. Sits in the empty gap between two sections, behind everything, so it
// links them without crossing content; an orb or two travel along it.
const INK = "#2A1B3D";
const LOOP = "M 0.5 50 A 49.5 49.5 0 1 0 99.5 50 A 49.5 49.5 0 1 0 0.5 50";
export function Loop({ className = "", style, dur = 50, orb = 4, at = [0.15, 0.6] }: { className?: string; style?: React.CSSProperties; dur?: number; orb?: number; at?: number[] }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return (
    <div aria-hidden className={`pointer-events-none absolute -z-10 ${className}`} style={style}>
      <svg viewBox="0 0 100 100" className="size-full overflow-visible">
        <path id={`l${id}`} d={LOOP} fill="none" stroke={INK} strokeOpacity="0.13" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {at.map((t, i) => {
          const r = orb * (i ? 0.6 : 1);
          if (still) { const a = Math.PI + t * Math.PI * 2; return <Sphere key={i} cx={50 + 49.5 * Math.cos(a)} cy={50 - 49.5 * Math.sin(a)} r={r} v={i % 3 as 0 | 1 | 2} />; }
          return (
            <g key={i}>
              <Sphere cx={0} cy={0} r={r} v={i % 3 as 0 | 1 | 2} />
              <animateMotion dur={`${dur}s`} begin={`${(-t * dur).toFixed(1)}s`} repeatCount="indefinite"><mpath href={`#l${id}`} /></animateMotion>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const ORBIT = "M 20 330 A 280 92 0 1 1 580 270 A 280 92 0 1 1 20 330";
const ORBIT2 = "M 70 230 A 236 70 0 1 0 530 370 A 236 70 0 1 0 70 230";
const BALLS: [string, number, number, number][] = [
  // path, radius, seconds per lap, start offset
  [ORBIT, 20, 16, 0], [ORBIT, 10, 16, -6], [ORBIT2, 14, 22, -4], [ORBIT2, 8, 22, -15],
];

export function Orbit({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div aria-hidden className={`ho pointer-events-none absolute size-[600px] ${className}`} style={flip ? { scale: "-1 1" } : undefined}>
      <svg viewBox="0 0 600 600" className="absolute inset-0 size-full overflow-visible">
                <path d={ORBIT} fill="none" style={{ stroke: MINT[2] }} strokeOpacity="0.14" strokeWidth="1.2" />
        <path d={ORBIT2} fill="none" style={{ stroke: MINT[1] }} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="0.1 9" strokeLinecap="round" />
        <g className="ho-float"><Cube x={70} y={150} a={24} tone="mint" /></g>
        <g className="ho-float" style={{ animationDelay: "-3s" }}><Sphere cx={540} cy={470} r={34} tone="mint" /></g>
      </svg>
      {BALLS.map(([path, r, sec, off], i) => (
        <svg key={i} viewBox={`0 0 ${r * 2} ${r * 2}`} className="ho-ball absolute left-0 top-0 overflow-visible" style={{ width: r * 2, height: r * 2, offsetPath: `path("${path}")`, animationDuration: `${sec}s`, animationDelay: `${off}s` }}>
          <Sphere cx={r} cy={r} r={r} tone="mint" />
        </svg>
      ))}
      <style>{`
        .ho .ho-ball { offset-rotate: 0deg; animation: ho-lap linear infinite; }
                .ho .ho-float { animation: ho-float 7s ease-in-out infinite; transform-box: fill-box; }
        @keyframes ho-lap { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes ho-spin { to { transform: rotate(360deg); } }
        @keyframes ho-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @media (prefers-reduced-motion: reduce) { .ho .ho-ball, .ho .ho-float { animation: none; } .ho .ho-ball { offset-distance: 30%; } }
      `}</style>
    </div>
  );
}

export const HeroOrbit = Orbit;

/** Background motion for a gap between sections. Each kind is a different motif. */
export type DriftKind = "orbit" | "scatter" | "arcs" | "steps" | "rings" | "dashes";

export function Drift({ kind, flip = false, className = "" }: { kind: DriftKind; flip?: boolean; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const f = (i: number, base = 6) => ({ animationDelay: `${-i * 1.7}s`, animationDuration: `${base + (i % 3) * 1.6}s` });
  return (
    <div aria-hidden className={`dr pointer-events-none absolute overflow-hidden ${className}`}>
      <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" className="size-full">
        <g transform={flip ? "translate(1200 0) scale(-1 1)" : undefined}>
          {kind === "orbit" && (
            <g>
              <path id={`o${id}`} d="M 830 110 A 180 46 0 1 1 1190 90 A 180 46 0 1 1 830 110" fill="none" style={{ stroke: MINT[1] }} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="0.1 9" strokeLinecap="round" />
              <path id={`q${id}`} d="M 900 80 A 112 30 0 1 0 1120 120 A 112 30 0 1 0 900 80" fill="none" style={{ stroke: MINT[2] }} strokeOpacity="0.14" strokeWidth="1.2" />
              <g className="dr-float"><Cube x={1010} y={116} a={20} tone="mint" /></g>
              <g><Sphere cx={0} cy={0} r={11} tone="mint" /><animateMotion dur="14s" repeatCount="indefinite"><mpath href={`#o${id}`} /></animateMotion></g>
              <g><Sphere cx={0} cy={0} r={6} tone="mint" /><animateMotion dur="9s" repeatCount="indefinite"><mpath href={`#q${id}`} /></animateMotion></g>
            </g>
          )}
          {kind === "scatter" && (
            <g>
              {([[90, 70, 9], [230, 140, 18], [360, 60, 5], [610, 120, 7], [770, 50, 14], [930, 150, 6], [1060, 80, 22], [1150, 160, 8]] as const).map(([x, y, r], i) => (
                <g key={i} className="dr-float" style={f(i, 7)}><Sphere cx={x} cy={y} r={r} tone="mint" /></g>
              ))}
              <g className="dr-float" style={f(3)}><Cube x={480} y={150} a={14} tone="mint" /></g>
              <g className="dr-float" style={f(5)}><circle cx={880} cy={96} r={10} fill="none" stroke={INK} strokeOpacity="0.2" strokeWidth="1" /></g>
            </g>
          )}
          {kind === "arcs" && (
            <g>
              <circle id={`c${id}`} cx="40" cy="250" r="186" fill="none" style={{ stroke: MINT[1] }} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 10" strokeLinecap="round" />
              <g className="dr-float" style={f(1)}><Sphere cx={300} cy={70} r={16} tone="mint" /></g>
              <g className="dr-float" style={f(2)}><Sphere cx={380} cy={140} r={6} tone="mint" /></g>
            </g>
          )}
          {kind === "steps" && (
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i} className="dr-float" style={{ animationDelay: `${-i * 0.5}s`, animationDuration: "5s" }}>
                  <Cube x={860 + i * 66} y={176 - i * 30} a={10 + i * 3} tone="mint" />
                </g>
              ))}
              <g className="dr-hop"><Sphere cx={1124} cy={22} r={9} tone="mint" /></g>
              <g className="dr-float" style={f(2, 8)}><Sphere cx={760} cy={70} r={5} tone="mint" /></g>
            </g>
          )}
          {kind === "rings" && (
            <g>
              <g className="dr-spin" style={{ transformOrigin: "1150px 100px", animationDuration: "24s" }}><Sphere cx={1150 - 136} cy={100} r={10} tone="mint" /></g>
              <g className="dr-float" style={f(1, 8)}><Sphere cx={930} cy={46} r={7} tone="mint" /></g>
            </g>
          )}
          {kind === "dashes" && (
            <g>
              <g className="dr-float" style={f(4, 9)}><Sphere cx={560} cy={110} r={8} tone="mint" /></g>
              <g className="dr-float" style={f(1, 8)}><Sphere cx={180} cy={110} r={6} tone="mint" /></g>
            </g>
          )}
        </g>
      </svg>
      <style>{`
        .dr .dr-float { transform-box: fill-box; animation: dr-float 7s ease-in-out infinite; }
        .dr .dr-spin { transform-box: view-box; animation: dr-spin 40s linear infinite; }
        .dr .dr-hop { transform-box: fill-box; animation: dr-hop 2.2s cubic-bezier(.45,0,.55,1) infinite; }
        @keyframes dr-float { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(6px, -10px); } 66% { transform: translate(-5px, -4px); } }
        @keyframes dr-spin { to { transform: rotate(360deg); } }
        @keyframes dr-hop { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(-26px); } }
        @media (prefers-reduced-motion: reduce) { .dr * { animation: none !important; } .dr animateMotion { display: none; } }
      `}</style>
    </div>
  );
}

/** A single floating accent: a grainy sphere or cube that bobs. */
export function Accent({ shape = "sphere", size = 48, className = "", delay = 0 }: { shape?: "sphere" | "cube"; size?: number; className?: string; delay?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="acc size-full overflow-visible" style={{ animationDelay: `${delay}s` }}>
        {shape === "sphere" ? <Sphere cx={50} cy={50} r={50} tone="mint" /> : <Cube x={50} y={80} a={46} tone="mint" />}
      </svg>
      <style>{`.acc { animation: acc-float 7s ease-in-out infinite; } @keyframes acc-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } } @media (prefers-reduced-motion: reduce) { .acc { animation: none; } }`}</style>
    </div>
  );
}

/** Large, faint grainy glow behind a section. Drifts slowly; still with reduced motion. */
export function Glow({ v = "a", className = "", opacity = 0.35, delay = 0 }: { v?: "a" | "b" | "c" | "d" | "e" | "f"; className?: string; opacity?: number; delay?: number }) {
  return (
    <div aria-hidden className={`gl pointer-events-none absolute -z-10 ${className}`} style={{ opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/work/watchlist/ill/glow-${v}.webp`} alt="" className="size-full" style={{ animationDelay: `${delay}s` }} />
      <style>{`.gl img { animation: gl-drift 22s ease-in-out infinite alternate; } @keyframes gl-drift { from { transform: translate(0, 0) scale(1) rotate(0deg); } to { transform: translate(4%, -3%) scale(1.06) rotate(8deg); } } @media (prefers-reduced-motion: reduce) { .gl img { animation: none; } }`}</style>
    </div>
  );
}
