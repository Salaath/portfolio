"use client";

import { useEffect, useRef, useState } from "react";
import { WlPhone } from "./WlPhone";

// Sal's recording of the My Lists scroll interaction in a phone, with a quiet
// control row under it: play/pause and a progress line you can drag.

const SRC = "/work/watchlist/scroll.mp4?v=3";
const POSTER = "/work/watchlist/scroll-poster.jpg?v=3";

export function ScrollVideo({ alt }: { alt: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [p, setP] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const el = v.current; if (!el) return;
    // reduced motion: start paused, let the reader press play
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.pause(); setPlaying(false); }
    let raf = 0;
    const tick = () => { if (el.duration) { setP(el.currentTime / el.duration); setDur(el.duration); } raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = () => { const el = v.current; if (!el) return; if (el.paused) { el.play(); setPlaying(true); } else { el.pause(); setPlaying(false); } };
  const seek = (x: number) => { const el = v.current; if (el?.duration) el.currentTime = x * el.duration; setP(x); };
  const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center">
      <WlPhone src="scroll-poster" alt={alt} width="min(19rem, 78vw)">
        <video ref={v} src={SRC} poster={POSTER} autoPlay muted loop playsInline preload="auto" aria-hidden
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover object-top" />
      </WlPhone>
      <div className="mt-6 flex w-[min(19rem,78vw)] items-center gap-3">
        <button type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}
          className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#F4F2F7] text-ink transition-colors hover:bg-[#ECE8F2]">
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><rect x="3" y="2" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="8.4" y="2" width="2.6" height="10" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M4 2.4v9.2a.6.6 0 0 0 .9.5l7.4-4.6a.6.6 0 0 0 0-1L4.9 1.9a.6.6 0 0 0-.9.5Z" fill="currentColor" /></svg>
          )}
        </button>
        <input type="range" min={0} max={1000} value={Math.round(p * 1000)} aria-label="Video position"
          onChange={(e) => seek(+e.target.value / 1000)}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-[2px] bg-[#ECE8F2] [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-[3px] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#5B2EBD] [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-[3px] [&::-webkit-slider-thumb]:bg-[#5B2EBD]"
          style={{ background: `linear-gradient(to right, #5B2EBD ${p * 100}%, #ECE8F2 ${p * 100}%)` }} />
        <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">{fmt(p * dur)}</span>
      </div>
    </div>
  );
}
