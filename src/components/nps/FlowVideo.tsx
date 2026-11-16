"use client";

import { useEffect, useRef, useState } from "react";
import { IPhone } from "./IPhone";

/**
 * A recorded flow in the iPhone frame. It plays (muted, looping) while it's on
 * screen and pauses when it scrolls away; play/pause and a seekable progress bar
 * sit underneath.
 */
export function FlowVideo({
  src,
  poster,
  title,
  caption,
  dark = false,
  statusBar = true,
  className = "max-w-[17rem]",
  threshold = 0.4,
}: {
  src: string;
  poster: string;
  title: string;
  caption?: string;
  /** light controls, for a dark background */
  dark?: boolean;
  /** false when the recording draws its own iOS status bar */
  statusBar?: boolean;
  className?: string;
  /** how much of it must be on screen before it plays */
  threshold?: number;
}) {
  const v = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = v.current, wrap = box.current;
    if (!el || !wrap) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) el.play().catch(() => {});
      else if (!e.isIntersecting) el.pause();
    }, { threshold });
    io.observe(wrap);
    let raf = 0;
    // read play state from the element too: playback can start before React's handlers attach
    const tick = () => { if (el.duration) setP(el.currentTime / el.duration); setPlaying(!el.paused); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [threshold]);

  const toggle = () => {
    const el = v.current; if (!el) return;
    if (el.paused) { userPaused.current = false; el.play().catch(() => {}); }
    else { userPaused.current = true; el.pause(); }
  };
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = v.current; if (!el || !el.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * el.duration;
  };

  return (
    <figure ref={box} className={`mx-auto w-full ${className}`}>
      <IPhone
        src="video"
        alt={title}
        statusBar={statusBar}
        screen={
          <video
            ref={v}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={toggle}
            aria-label={caption ? `${title}: ${caption}` : title}
            className="block h-full w-full cursor-pointer object-cover object-top"
          />
        }
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className={`grid size-9 shrink-0 place-items-center rounded-full transition-transform active:scale-95 ${dark ? "bg-white text-[#0f0e0d]" : "bg-ink text-bg"}`}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><rect x="2" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /><rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.8v8.4a.6.6 0 0 0 .9.5l7-4.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5Z" fill="currentColor" /></svg>
          )}
        </button>
        <div
          role="slider"
          aria-label={`${title} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
          tabIndex={0}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e); }}
          onPointerMove={(e) => { if (e.buttons) seek(e); }}
          onKeyDown={(e) => { const el = v.current; if (!el) return; if (e.key === "ArrowRight") el.currentTime += 1; if (e.key === "ArrowLeft") el.currentTime -= 1; }}
          className="group relative h-6 flex-1 cursor-pointer touch-none"
        >
          <span className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full ${dark ? "bg-white/20" : "bg-ink/10"}`} />
          <span className={`absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full ${dark ? "bg-white" : "bg-ink"}`} style={{ width: `${p * 100}%` }} />
          <span className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${dark ? "bg-white" : "bg-ink"}`} style={{ left: `${p * 100}%` }} />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
}
