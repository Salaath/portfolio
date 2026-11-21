"use client";

import { useEffect, useRef, useState } from "react";
import { IPhone } from "@/components/ao/IPhone";

// A silent screen recording with its own controls: play or pause, a bar to
// scrub through it and the time. It plays while it is on screen, until the
// viewer pauses it themselves. `phone` sets it inside the site's iPhone frame,
// with the screen at that aspect ratio.

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function FlowVideo({ src, poster, label, className = "", videoClassName = "", phone }: { src: string; poster: string; label: string; className?: string; videoClassName?: string; phone?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.4 },
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
  const seek = (to: number) => {
    const v = ref.current;
    if (v) v.currentTime = to;
  };

  const pct = dur ? (t / dur) * 100 : 0;

  const video = (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onClick={toggle}
      aria-label={label}
      className={`block cursor-pointer ${phone ? "absolute inset-0 h-full w-full object-cover" : "w-full"} ${videoClassName}`}
    />
  );

  return (
    <div data-native-cursor="" className={className}>
      {phone ? <IPhone aspect={phone}>{video}</IPhone> : video}
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={toggle} aria-label={playing ? "Pause the recording" : "Play the recording"} className="grid size-9 flex-none place-items-center rounded-full border border-ink/25 transition-colors duration-300 hover:bg-ink hover:text-bg">
          {playing ? (
            <svg aria-hidden width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect width="3.2" height="12" rx="0.6" /><rect x="6.8" width="3.2" height="12" rx="0.6" /></svg>
          ) : (
            <svg aria-hidden width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0.5 0.7v10.6a0.5 0.5 0 0 0 .76.43l8.5-5.3a0.5 0.5 0 0 0 0-.86L1.26.27A0.5 0.5 0 0 0 .5.7Z" /></svg>
          )}
        </button>
        <span className="relative block h-9 flex-1">
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ink/15" />
          <span aria-hidden className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ink" style={{ width: `${pct}%` }} />
          <span aria-hidden className="absolute top-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${pct}%` }} />
          <input
            type="range"
            min={0}
            max={dur || 1}
            step={0.05}
            value={t}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Position in the recording"
            aria-valuetext={`${clock(t)} of ${clock(dur)}`}
            className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
          />
        </span>
        <span className="flex-none font-mono text-[11px] tabular-nums text-muted">{clock(t)} / {clock(dur)}</span>
      </div>
    </div>
  );
}
