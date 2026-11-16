"use client";

import { useEffect, useId, useState } from "react";
const MINT = ["#DDF7EA", "#3FB58A", "#0B4D36"]; // matches the green "Went live" label, not the illustration palette

// The "went live" mark: a hairline draws itself upward with a small dot riding its
// tip and a faint wash filling in underneath. When it lands the dot sends out one
// soft pulse, holds for a beat, fades and runs again. Still with reduced motion.

const LINE = "M3 32 C9 28 13 22 19 18 S26 14 30 18 S36 22 41 19 S47 10 52 9 L60 8";
const AREA = `${LINE} L60 36 L3 36 Z`;
const DUR = "3.4s";
const KT = "0;0.5;0.86;1"; // draw, hold, fade out, (restart)
const SPL = ".45 0 .25 1;0 0 1 1;0 0 1 1";

export function LiveSpark({ className = "" }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [still, setStill] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setStill(m.matches);
    on(); m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  return (
    <svg viewBox="0 0 64 36" aria-hidden className={className} fill="none">
      <defs>
        <linearGradient id={`l${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={MINT[1]} />
          <stop offset="1" stopColor={MINT[2]} />
        </linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={MINT[1]} stopOpacity="0.16" />
          <stop offset="1" stopColor={MINT[0]} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`r${id}`}>
          <rect x="0" y="0" height="36" width={still ? 64 : 0}>
            {!still && <animate attributeName="width" dur={DUR} repeatCount="indefinite" keyTimes={KT} values="0;64;64;64" calcMode="spline" keySplines={SPL} />}
          </rect>
        </clipPath>
      </defs>
      <g>
        {!still && <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes={KT} values="1;1;1;0" />}
        <path d={AREA} fill={`url(#f${id})`} clipPath={`url(#r${id})`} />
        <path d={LINE} pathLength={1} stroke={`url(#l${id})`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={still ? 0 : 1}>
          {!still && <animate attributeName="stroke-dashoffset" dur={DUR} repeatCount="indefinite" keyTimes={KT} values="1;0;0;0" calcMode="spline" keySplines={SPL} />}
        </path>
        <g transform={still ? "translate(60 8)" : undefined}>
          {!still && <animateMotion dur={DUR} repeatCount="indefinite" path={LINE} keyPoints="0;1;1;1" keyTimes={KT} calcMode="spline" keySplines={SPL} />}
          {/* one soft pulse once the line lands */}
          <circle r="2" fill="none" stroke={MINT[1]} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0">
            {!still && <animate attributeName="r" dur={DUR} repeatCount="indefinite" keyTimes="0;0.5;0.78;1" values="2;2;7;7" calcMode="spline" keySplines="0 0 1 1;.2 .6 .3 1;0 0 1 1" />}
            {!still && <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes="0;0.49;0.5;0.78;1" values="0;0;0.6;0;0" />}
          </circle>
          <circle r="2.1" fill={MINT[2]} />
        </g>
      </g>
    </svg>
  );
}
