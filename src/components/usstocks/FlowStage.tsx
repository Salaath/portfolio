"use client";

import { useEffect, useRef, useState } from "react";

// The opening of the US Stocks page: the end-to-end flow, full width, before any
// words. The recording comes from the coded prototype (public/proto/us-stocks);
// the same phone can switch to the prototype itself.

/** Where each part of the journey starts in the recording, in seconds. */
const STEPS: [number, string][] = [
  [0, "Discover"],
  [8.9, "Activate"],
  [26.5, "Explore"],
  [30.3, "Stock page"],
  [36, "Order"],
  [40.2, "Add money"],
  [60.2, "Complete"],
  [67.2, "Holdings"],
];

const ICON = {
  pause: <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg>,
  play: <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9a.5.5 0 0 0 .77.42l7-4.5a.5.5 0 0 0 0-.84l-7-4.5A.5.5 0 0 0 3 1.5Z" /></svg>,
};

const BRAND = "/work/us-stocks/brand";

/**
 * One piece of the launch artwork (rendered from UP_Branding.fig). `at` is its centre, measured
 * from the middle of the phone in units of the phone's height; `w` is its width in the same unit.
 * Each piece bobs on its own rhythm and shifts against the pointer by `depth` pixels.
 */
function Piece({ src, at, w, depth, float, className = "" }: { src: string; at?: [number, number]; w?: number; depth: number; float?: "a" | "b" | "c"; className?: string }) {
  const style: React.CSSProperties = {
    ...(at ? { left: `calc(var(--u) * ${at[0]})`, top: `calc(var(--u) * ${at[1]})`, width: `calc(var(--u) * ${w})`, marginLeft: `calc(var(--u) * ${-(w ?? 0) / 2})` } : {}),
    transform: `translate3d(calc(var(--mx, 0) * ${-depth}px), calc(var(--my, 0) * ${-depth}px), 0)${at ? " translateY(-50%)" : ""}`,
  };
  return (
    <div aria-hidden style={style} className={`pointer-events-none absolute transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={`${BRAND}/${src}.webp`} className={`block w-full max-w-none drop-shadow-[0_24px_30px_rgba(20,6,50,0.35)] ${float ? `us-float-${float}` : ""}`} />
    </div>
  );
}

/** An Android frame around the prototype's 360 × 800 screen. */
export function Bezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[380/820] rounded-[11.6%/5.4%] bg-[#0b0b0d] shadow-[inset_0_0_0_1.5px_#3a3a3e,0_0_0_3px_#1b1b1e,0_50px_110px_-30px_rgba(120,70,230,0.55)] ${className}`}>
      {/* insets, not padding: a percentage padding would follow the parent's width, not the phone's */}
      <div className="absolute inset-x-[2.63%] inset-y-[1.22%] overflow-hidden rounded-[9.4%/4.25%] bg-white">{children}</div>
    </div>
  );
}

export function FlowStage({ video, poster, proto }: { video: string; poster: string; proto: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    let raf = 0;
    const tick = () => {
      setT(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [live]);

  // the prototype is drawn at 360 × 800 and scaled to the screen it sits in
  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 360));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const active = STEPS.reduce((a, [at], i) => (t >= at ? i : a), 0);
  const end = (i: number) => STEPS[i + 1]?.[0] ?? dur;

  const seek = (at: number) => {
    setLive(false);
    userPaused.current = false;
    // the video is remounted when leaving the prototype, so wait for it
    requestAnimationFrame(() => {
      const v = vid.current;
      if (!v) return;
      v.currentTime = at;
      v.play().catch(() => {});
    });
  };
  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <header
      className="night us-stage relative flex min-h-svh flex-col overflow-hidden px-4 pb-6 pt-24 [--u:min(74svh,820px)] sm:px-10"
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
        e.currentTarget.style.setProperty("--my", ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
      }}
    >
      {/* the launch artwork's ground: textured purple shapes, dark at the top for the bar and at the foot for the controls */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img aria-hidden alt="" src={`${BRAND}/bg.webp`} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#08080a_0,rgba(8,8,10,0.5)_80px,rgba(8,8,10,0)_230px,rgba(8,8,10,0)_62%,rgba(8,8,10,0.9)_86%,#08080a_100%)]" />
      {/* a stock card that runs off the right edge of the page */}
      <Piece src="card-sbux" depth={26} className="right-0 top-[9%] hidden w-[calc(var(--u)*0.38)] xl:block" float="b" />

      <div className="relative flex flex-1 items-center justify-center">
        {/* everything is placed from the middle of the phone, in units of its height */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-0">
          <Piece src="arch" depth={8} at={[0, 0.03]} w={1.12} className="opacity-80" />
          <Piece src="card-tsla" depth={22} at={[-0.45, -0.17]} w={0.54} className="hidden md:block" float="a" />
          <Piece src="card-amzn" depth={30} at={[0.66, 0.24]} w={0.68} className="hidden md:block" float="b" />
        </div>

        <Bezel className="h-[var(--u)]">
          <div ref={screen} className="absolute inset-0">
            {live ? (
              scale ? (
                <iframe
                  key={run}
                  src={proto}
                  title="US Stocks interactive prototype"
                  style={{ width: 360, height: 800, transform: `scale(${scale})`, transformOrigin: "0 0", border: 0 }}
                />
              ) : null
            ) : (
              <video
                ref={vid}
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onClick={toggle}
                aria-label="Recording of the US Stocks journey in Upstox Pro: discovering US stocks, activating the account, opening Apple, adding money while ordering and landing in Holdings"
                className="absolute inset-0 h-full w-full cursor-pointer object-cover"
              />
            )}
          </div>
        </Bezel>
        {/* the tiles sit in front of the phone and cross its edges */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-0">
          <Piece src="tile-aapl" depth={46} at={[0.33, -0.53]} w={0.2} float="a" />
          <Piece src="tile-nflx" depth={54} at={[-0.38, 0.39]} w={0.2} float="b" />
          <Piece src="tile-meta" depth={38} at={[0.52, -0.3]} w={0.16} className="hidden sm:block" float="c" />
          <Piece src="tile-nvda" depth={34} at={[-0.82, 0.4]} w={0.15} className="hidden md:block" float="c" />
        </div>
      </div>

      {/* the journey as one line: every step seeks the recording */}
      <div className="relative mx-auto mt-8 w-full max-w-5xl">
        <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70 md:hidden">
          {live ? "Prototype" : `${String(active + 1).padStart(2, "0")} · ${STEPS[active][1]}`}
        </p>
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={live ? () => setRun((n) => n + 1) : toggle}
            aria-label={live ? "Start the prototype again" : playing ? "Pause" : "Play"}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors duration-300 hover:bg-ink hover:text-bg"
          >
            {live ? <span className="text-sm leading-none">↺</span> : playing ? ICON.pause : ICON.play}
          </button>
          <ol className="grid min-w-0 flex-1 grid-cols-8 gap-1 sm:gap-1.5">
            {STEPS.map(([at, label], i) => {
              const span = Math.max(0.001, end(i) - at);
              const fill = live ? 0 : i < active ? 1 : i === active ? Math.min(1, (t - at) / span) : 0;
              const on = !live && i === active;
              return (
                <li key={label} className="min-w-0">
                  <button type="button" onClick={() => seek(at + 0.05)} aria-label={`Play from ${label}`} aria-current={on ? "step" : undefined} className="group block w-full py-2 text-left">
                    <span className="relative block h-[2px] overflow-hidden rounded-full bg-ink/15 transition-colors group-hover:bg-ink/30">
                      <span className="absolute inset-0 origin-left bg-[#a78bfa]" style={{ transform: `scaleX(${fill})` }} />
                    </span>
                    <span className={`mt-2 hidden truncate font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300 md:block ${on ? "text-ink" : "text-ink/40 group-hover:text-ink/75"}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => {
              setLive((v) => !v);
              setRun((n) => n + 1);
            }}
            aria-pressed={live}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition-colors duration-300 ${live ? "border-ink bg-ink text-bg" : "border-ink/25 hover:bg-ink hover:text-bg"}`}
          >
            {live ? "Back to the recording" : "Try it yourself"}
          </button>
        </div>
      </div>
    </header>
  );
}
