"use client";

import { useEffect, useRef, useState } from "react";

// The AO 3.0 happy path, recorded from the interactive prototype. Chapters on
// the left seek the video; the active one fills as it plays. Plays only while
// on screen, and waits for a tap when the viewer prefers reduced motion.

export type Chapter = { at: number; label: string; note: string };

export function FlowVideo({ src, poster, chapters }: { src: string; poster: string; chapters: Chapter[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
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
  }, []);

  const active = chapters.reduce((a, c, i) => (t >= c.at ? i : a), 0);
  const end = (i: number) => chapters[i + 1]?.at ?? dur;

  const seek = (at: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = at + 0.05;
    v.play().catch(() => {});
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-20">
      <ol className="order-2 md:order-1">
        {chapters.map((c, i) => {
          const span = Math.max(0.001, end(i) - c.at);
          const fill = i < active ? 1 : i === active ? Math.min(1, (t - c.at) / span) : 0;
          return (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => seek(c.at)}
                data-cursor="Play"
                className={`group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-4 text-left transition-colors duration-500 ${
                  i === active ? "text-bg" : "text-bg/45 hover:text-bg/80"
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-px bg-bg/15" />
                <span className="absolute left-0 top-0 h-px bg-bg" style={{ width: `${fill * 100}%` }} />
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-lg font-semibold tracking-[-0.02em] md:text-xl">{c.label}</span>
                  <span
                    className={`grid text-sm text-bg/60 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-1">{c.note}</span>
                    </span>
                  </span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-bg/40">
                  {Math.floor(c.at / 60)}:{String(Math.floor(c.at % 60)).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="order-1 mx-auto w-[68vw] max-w-[340px] md:order-2 md:w-[24vw]">
        <div className="relative rounded-[2.6rem] bg-[#0b0b0d] p-[8px] shadow-[0_0_0_1.5px_#3a3a3e_inset,0_50px_100px_-30px_rgba(120,70,220,0.45)]">
          <div className="relative aspect-[375/812] overflow-hidden rounded-[2.1rem] bg-white">
            <video
              ref={ref}
              src={src}
              poster={poster}
              muted
              playsInline
              loop
              preload="metadata"
              onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              aria-label="Screen recording of the AO 3.0 prototype, from the welcome screen to the home screen"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4 text-bg">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-bg/30 transition-colors duration-300 hover:bg-bg hover:text-ink"
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9a.5.5 0 0 0 .77.42l7-4.5a.5.5 0 0 0 0-.84l-7-4.5A.5.5 0 0 0 3 1.5Z" /></svg>
            )}
          </button>
          <span className="relative h-px flex-1 bg-bg/20">
            <span className="absolute inset-y-0 left-0 bg-bg" style={{ width: dur ? `${(t / dur) * 100}%` : 0 }} />
          </span>
          <span className="font-mono text-[11px] tabular-nums text-bg/50">
            {Math.floor(t / 60)}:{String(Math.floor(t % 60)).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

/** A muted loop that only plays while visible. */
export function LoopVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className={className} />
  );
}
