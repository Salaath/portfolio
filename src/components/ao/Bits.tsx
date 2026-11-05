"use client";

import { useEffect, useRef, useState } from "react";

/** The live prototype, scaled to fit, loaded only when it comes into view. */
export function ProtoEmbed({ url }: { url: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [show, setShow] = useState(false);
  const W = 1040, H = 900;
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W)));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "400px" });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return (
    <div>
      <div className="overflow-hidden rounded-2xl ring-1 ring-ink/10">
        <div className="flex items-center gap-3 bg-card px-4 py-3">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((d) => <i key={d} className="size-2.5 rounded-full bg-ink/15" />)}
          </span>
          <span className="flex-1 truncate rounded-full bg-bg px-4 py-1 text-center font-mono text-xs text-muted">{url.includes("://") ? url.replace("https://", "") : "Version 3.0 prototype"}</span>
          <a href={url} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium underline-offset-4 hover:underline">Open full screen ↗</a>
        </div>
        <div ref={box} className="relative w-full overflow-hidden bg-[#f1eff6]" style={{ height: H * scale }}>
          {show ? (
            <iframe
              src={url}
              title="Version 3.0 interactive prototype"
              style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0", border: 0 }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** One spotlight screen: the design dims and the frustrated taps glow, Hotjar-style. */
type Heat = { x: number; y: number; r: number; hot?: boolean };
export function HeatScreen({ src, alt, spots, trail, aspect }: { src: string; alt: string; spots: Heat[]; trail?: number[][]; aspect: string }) {
  return (
    <div className="group relative overflow-hidden" style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top saturate-[.65] transition duration-700 group-hover:saturate-100" />
      <div className="absolute inset-0 bg-[#0b0820]/55 transition-opacity duration-700 group-hover:opacity-30" />
      {spots.map((s, i) => (
        <span
          key={i}
          className="heat-spot absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.r}%`,
            aspectRatio: 1,
            transform: "translate(-50%,-50%)",
            background: s.hot
              ? "radial-gradient(circle, #fff6c2 0%, #ffb02e 22%, #ff4d2e 45%, rgba(255,60,60,.35) 62%, transparent 75%)"
              : "radial-gradient(circle, #d9fbff 0%, #39c6ff 26%, #3a6bff 50%, rgba(70,70,255,.3) 65%, transparent 76%)",
            animationDelay: `${i * 0.35}s`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      {trail ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke="#ff8a3c" strokeWidth="0.6" vectorEffect="non-scaling-stroke" className="heat-trail" style={{ strokeWidth: 1.6 }} />
        </svg>
      ) : null}
    </div>
  );
}
