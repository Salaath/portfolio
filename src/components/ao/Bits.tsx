"use client";

import { useEffect, useRef, useState } from "react";

const PATHS = [
  ["happy", "Happy path", "Everything is fetched. You only confirm."],
  ["pan", "PAN not found", "PAN is typed in by hand, the rest is fetched."],
  ["bank", "Bank not found", "Bank is added by hand, the rest is fetched."],
  ["manual", "Nothing found", "Every manual fallback, one after another."],
] as const;

const STEPS = [
  ["welcome", "Welcome"], ["phone", "Mobile"], ["email", "Email"], ["review", "Review cards"], ["signature", "Signature"],
  ["selfieIntro", "Selfie"], ["questions", "Questions"], ["esign", "eSign"], ["segments", "F&O"], ["waiting", "Status"], ["stocks", "Watchlist"], ["home", "Home"],
] as const;

/**
 * The live prototype: only the phone, always fitting the window, with its scenarios
 * as a plain list beside it. It's served from this site, so the page drives the
 * prototype's own controls, which stay hidden here and remain in the full-screen view.
 */
export function ProtoEmbed({ url }: { url: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);
  const [show, setShow] = useState(false);
  const [path, setPath] = useState<string>("happy");
  // The iframe stays wide enough to keep the desktop layout (phone with its bezel); only the phone is shown.
  const W = 415, H = 890, FRAME = 830;
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, (window.innerHeight - 170) / H, (window.innerWidth - 80) / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "400px" });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  const doc = () => frame.current?.contentDocument ?? null;
  const press = (selector: string) => doc()?.querySelector<HTMLElement>(selector)?.click();
  const onLoad = () => {
    const d = doc();
    if (!d) return;
    const st = d.createElement("style");
    st.textContent = "html,body{background:transparent!important}.panel{display:none!important}.stage{padding:0!important;gap:0!important}.device{box-shadow:0 0 0 1.5px #3a3a3e inset,0 0 0 3px #1b1b1e!important}";
    d.head.appendChild(st);
  };
  return (
    <div className="grid gap-8 rounded-3xl bg-card p-6 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-10">
      <div className="min-w-0">
        <p className="label">Choose a path</p>
        <ul className="mt-4">
          {PATHS.map(([id, h, p]) => (
            <li key={id} className="border-t border-ink/10">
              <button
                type="button"
                aria-pressed={path === id}
                onClick={() => {
                  setPath(id);
                  press(`[data-preset="${id}"]`);
                }}
                className="group flex w-full items-start gap-3 py-3 text-left"
              >
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full border transition-colors ${path === id ? "border-ink bg-ink" : "border-ink/30 group-hover:border-ink"}`} />
                <span>
                  <b className={`block font-semibold ${path === id ? "text-ink" : "text-ink/70"}`}>{h}</b>
                  <span className="text-sm text-muted">{p}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="label mt-8">Jump to a step</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {STEPS.map(([id, l]) => (
            <button key={id} type="button" onClick={() => press(`[data-j="${id}"]`)} className="text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
              {l}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <button type="button" onClick={() => press("#restart")} className="rounded-full border border-ink/25 px-4 py-2 transition-colors hover:bg-ink hover:text-bg">↺ Start again</button>
          <a href={url} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">Open full screen ↗</a>
        </div>
      </div>

      <div ref={box} className="mx-auto">
        <div className="relative mx-auto overflow-hidden" style={{ width: W * scale, height: H * scale }}>
          {show ? (
            <iframe
              ref={frame}
              src={url}
              onLoad={onLoad}
              title="Version 3.0 interactive prototype"
              style={{ width: FRAME, height: H, transform: `scale(${scale}) translateX(${-(FRAME - W) / 2}px)`, transformOrigin: "0 0", border: 0, background: "transparent" }}
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
