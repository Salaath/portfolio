"use client";

import { useEffect, useRef, useState } from "react";
import { IPhone } from "./IPhone";

// The AO 3.0 happy path, recorded from the interactive prototype, with full
// controls: play/pause, jump back and forward, a scrubber, and chapters that
// seek. It starts when scrolled into view, and never overrides a manual pause.

export type Chapter = { at: number; label: string; note: string };

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function FlowVideo({ src, poster, chapters }: { src: string; poster: string; chapters: Chapter[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    let raf = 0;
    const tick = () => {
      setT(v.currentTime);
      if (v.duration) setDur(v.duration);
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

  const seek = (at: number, play = true) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || at, at));
    if (play) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const ctrl = "grid size-11 shrink-0 place-items-center rounded-full border border-bg/30 transition-colors duration-300 hover:bg-bg hover:text-ink";

  return (
    <div className="grid items-start gap-12 md:grid-cols-[auto_1fr] md:gap-16">
      <ol className="order-2">
        {chapters.map((c, i) => {
          const span = Math.max(0.001, end(i) - c.at);
          const fill = i < active ? 1 : i === active ? Math.min(1, (t - c.at) / span) : 0;
          return (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => seek(c.at + 0.05)}
                className={`relative grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-3 py-3 text-left transition-colors duration-500 ${
                  i === active ? "text-bg" : "text-bg/45 hover:text-bg/80"
                }`}
              >
                <span className="absolute inset-x-0 top-0 h-px bg-bg/15" />
                <span className="absolute left-0 top-0 h-px bg-bg" style={{ width: `${fill * 100}%` }} />
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-semibold tracking-[-0.02em] md:text-lg">{c.label}</span>
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
                <span className="font-mono text-[11px] tabular-nums text-bg/40">{clock(c.at)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="order-1 mx-auto w-[58vw] max-w-[300px] md:sticky md:top-6 md:w-[calc((100svh-170px)*0.45)]">
        <IPhone dark>
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={toggle}
            aria-label="Screen recording of the Version 3.0 prototype, from the welcome screen to the home screen"
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          />
        </IPhone>

        <div className="mt-4 text-bg">
          <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums text-bg/60">
            <span>{clock(t)}</span>
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={dur || 1}
              step={0.1}
              value={Math.min(t, dur || 1)}
              onChange={(e) => seek(Number(e.target.value), false)}
              className="h-1 flex-1 cursor-pointer accent-white"
            />
            <span>{clock(dur)}</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button type="button" onClick={() => seek(t - 5, false)} aria-label="Back 5 seconds" className={ctrl}>
              <span className="font-mono text-[11px]">−5s</span>
            </button>
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={`${ctrl} size-12 bg-bg text-ink hover:bg-bg/80`}>
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" rx="1" /><rect x="7" y="1" width="3" height="10" rx="1" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9a.5.5 0 0 0 .77.42l7-4.5a.5.5 0 0 0 0-.84l-7-4.5A.5.5 0 0 0 3 1.5Z" /></svg>
              )}
            </button>
            <button type="button" onClick={() => seek(t + 5, false)} aria-label="Forward 5 seconds" className={ctrl}>
              <span className="font-mono text-[11px]">+5s</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A muted loop that only plays while visible. */
export function LoopVideo({ src, poster, label, className = "" }: { src: string; poster?: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className={className} />;
}
