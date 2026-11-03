"use client";

import { useEffect, useRef } from "react";
import { LoopVideo } from "./FlowVideo";

// A single titanium phone sunk into a soft cushion, playing a short loop from
// the AO 3.0 prototype. It floats gently and leans toward the cursor; both stop
// when the viewer prefers reduced motion.

const BASE = { x: 6, y: -16, z: 5 };

export function HeroPhone({ src, poster, label }: { src: string; poster: string; label: string }) {
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tilt.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 10;
      ty = (e.clientY / window.innerHeight - 0.5) * -8;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.transform = `rotateX(${BASE.x + cy}deg) rotateY(${BASE.y + cx}deg) rotateZ(${BASE.z}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      {/* soft glow behind */}
      <div className="absolute left-1/2 top-[40%] aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(151,91,212,0.22),rgba(151,91,212,0)_62%)] blur-2xl" />

      {/* the phone */}
      <div className="relative z-10 mx-auto w-[60%] [perspective:1800px] md:w-[46%]" style={{ maxWidth: "31svh" }}>
        <div className="motion-safe:animate-[heroFloat_7s_ease-in-out_infinite]">
          <div
            ref={tilt}
            className="relative [transform-style:preserve-3d]"
            style={{ transform: `rotateX(${BASE.x}deg) rotateY(${BASE.y}deg) rotateZ(${BASE.z}deg)` }}
          >
            {/* side buttons */}
            <span className="absolute -left-[3px] top-[19%] h-[4%] w-[4px] rounded-l-sm bg-gradient-to-b from-[#d9d9de] to-[#9c9ca4]" />
            <span className="absolute -left-[3px] top-[26%] h-[7.5%] w-[4px] rounded-l-sm bg-gradient-to-b from-[#d9d9de] to-[#9c9ca4]" />
            <span className="absolute -left-[3px] top-[35%] h-[7.5%] w-[4px] rounded-l-sm bg-gradient-to-b from-[#d9d9de] to-[#9c9ca4]" />
            <span className="absolute -right-[3px] top-[29%] h-[11%] w-[4px] rounded-r-sm bg-gradient-to-b from-[#e2e2e6] to-[#a2a2aa]" />

            {/* titanium frame */}
            <div className="rounded-[18%/8.4%] bg-[linear-gradient(135deg,#f5f5f7_0%,#b8b8c0_22%,#efeff2_45%,#a5a5ad_70%,#e9e9ed_100%)] p-[1.6%] shadow-[0_50px_70px_-40px_rgba(30,15,60,0.5)]">
              {/* black bezel */}
              <div className="rounded-[17%/7.9%] bg-[#060607] p-[3.4%]">
                <div className="relative aspect-[375/812] overflow-hidden rounded-[14%/6.5%] bg-white">
                  <LoopVideo src={src} poster={poster} label={label} className="absolute inset-0 h-full w-full scale-[1.02] object-cover" />
                  {/* glass reflection */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.08)_100%)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the cushion, drawn over the bottom of the phone so it sits sunk in */}
      <svg viewBox="0 0 600 240" className="relative z-20 mx-auto -mt-[10svh] block w-[82%]" aria-hidden>
        <defs>
          <radialGradient id="cushion" cx="50%" cy="22%" r="80%" fx="50%" fy="10%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.38" stopColor="#f3f1f7" />
            <stop offset="0.7" stopColor="#dcd7e6" />
            <stop offset="1" stopColor="#b8b0c9" />
          </radialGradient>
          <linearGradient id="cushionShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#6d5c92" stopOpacity="0" />
            <stop offset="1" stopColor="#6d5c92" stopOpacity="0.28" />
          </linearGradient>
          <filter id="soft4" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id="soft10" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="10" /></filter>
          <filter id="soft18" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="18" /></filter>
          <clipPath id="cushionClip"><path d="M300 22C470 22 594 62 594 122C594 186 470 222 300 222C130 222 6 186 6 122C6 62 130 22 300 22Z" /></clipPath>
        </defs>
        {/* contact shadow on the floor */}
        <ellipse cx="300" cy="222" rx="240" ry="12" fill="#2d1f4a" opacity="0.28" filter="url(#soft18)" />
        <path d="M300 22C470 22 594 62 594 122C594 186 470 222 300 222C130 222 6 186 6 122C6 62 130 22 300 22Z" fill="url(#cushion)" />
        <g clipPath="url(#cushionClip)">
          <rect x="0" y="0" width="600" height="240" fill="url(#cushionShade)" />
          {/* the dip where the phone presses in */}
          <ellipse cx="292" cy="34" rx="120" ry="26" fill="#6f5d96" opacity="0.32" filter="url(#soft10)" />
          <ellipse cx="292" cy="58" rx="170" ry="16" fill="#ffffff" opacity="0.7" filter="url(#soft10)" />
          {/* piping around the middle: a shadow under a bright edge */}
          <path d="M4 118C110 176 490 176 596 118" fill="none" stroke="#7d6fa0" strokeWidth="7" opacity="0.22" filter="url(#soft4)" transform="translate(0 4)" />
          <path d="M4 118C110 176 490 176 596 118" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" />
          {/* side shading for volume */}
          <ellipse cx="18" cy="130" rx="40" ry="110" fill="#7d6fa0" opacity="0.18" filter="url(#soft18)" />
          <ellipse cx="582" cy="130" rx="40" ry="110" fill="#7d6fa0" opacity="0.18" filter="url(#soft18)" />
        </g>
      </svg>
    </div>
  );
}
