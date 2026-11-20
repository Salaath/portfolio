"use client";

import { useEffect, useRef, useState } from "react";
import { warp } from "@/components/AiProjects";

// The onboarding guide on a laptop, in Sal's mock-up photo (the laptop held up in two
// hands, on orange). The laptop plays Sal's own screen recording of the guide
// (20 Nov 2026) in a small browser window: clicking the screen pauses and plays it, and
// a thin strip along the bottom of the screen has the same button and a bar to jump
// along. The photo runs to the bottom edge of the stage, the way the sleeves leave it.

const FILM: [number, number] = [640, 400];
const VIDEO = "/work/ai/onboarding-guide.mp4";
const POSTER = "/work/ai/onboarding-guide-poster.jpg";
const PHOTO = { src: "/work/ai/onboarding-hands.webp", w: 1800, h: 1348, ground: "#f8620b" };
/** The laptop screen's corners in the photo: top-left, top-right, bottom-right, bottom-left. */
const SCREEN: [number, number][] = [[528.9, 123.6], [1286.8, 119.8], [1281.5, 597.9], [536.6, 602.4]];

export function GuideStage({ href }: { href: string }) {
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  /** true once the viewer has paused it themselves, so scrolling back does not restart it */
  const held = useRef(false);

  useEffect(() => {
    const el = box.current!;
    const measure = () => setK(el.clientWidth / PHOTO.w);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // plays while the stage is on screen, unless the viewer paused it
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) held.current = true;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !held.current) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [k]);

  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) { held.current = false; v.play().catch(() => {}); } else { held.current = true; v.pause(); }
  };
  /** Clicking the bar jumps the recording to that point. */
  const seek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const v = vid.current, r = e.currentTarget.getBoundingClientRect();
    if (!v || !v.duration) return;
    const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    v.currentTime = p * v.duration; setProgress(p);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] text-[#111] md:rounded-[2.75rem]" style={{ background: PHOTO.ground }}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 px-5 pt-6 md:px-10 md:pt-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]">The guide, scrolling by itself</p>
        <a href={href} target="_blank" rel="noreferrer" data-cursor="Open" className="group inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
          Open design guide
          <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </a>
      </div>
      {/* the photo is the last thing in the stage, flush with its bottom edge */}
      <div ref={box} className="relative mx-auto mt-4 aspect-[1800/1348] w-full max-w-[1500px] md:mt-0">
        {k ? (
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `scale(${k})` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PHOTO.src} alt="" width={PHOTO.w} height={PHOTO.h} className="absolute inset-0 block h-full w-full" />
            <div data-native-cursor className="absolute left-0 top-0 flex origin-top-left flex-col overflow-hidden rounded-t-[7px] bg-[#efebf8]" style={{ width: FILM[0], height: FILM[1], transform: warp(SCREEN, FILM) }}>
              {/* the recording is wider than the laptop's screen, so it sits in a browser window and only a sliver of each side is trimmed */}
              <div aria-hidden className="flex h-[44px] shrink-0 items-center gap-[14px] border-b border-black/10 bg-[#f6f4f9] px-[14px]">
                <span className="flex gap-[6px]">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => <i key={c} className="size-[10px] rounded-full" style={{ background: c }} />)}
                </span>
                <span className="mx-auto flex h-[24px] w-[52%] items-center justify-center rounded-full bg-black/[0.06] text-[11px] text-black/60">Upstox Design · Your Journey</span>
                <span className="w-[42px]" />
              </div>
              <button type="button" onClick={toggle} aria-label={playing ? "Pause the recording of the guide" : "Play the recording of the guide"} className="relative block min-h-0 flex-1 cursor-pointer">
                <video
                  ref={vid}
                  src={VIDEO}
                  poster={POSTER}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration); }}
                  className="absolute inset-0 block h-full w-full max-w-none object-cover object-[40%_50%]"
                />
                {/* a play mark over the screen while it is paused */}
                <span aria-hidden className={`absolute left-1/2 top-1/2 grid size-[54px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#111]/80 text-white transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}>
                  <svg width="18" height="18" viewBox="0 0 12 12"><path d="M3 1.3v9.4a.6.6 0 0 0 .92.5l7.2-4.7a.6.6 0 0 0 0-1L3.92.8A.6.6 0 0 0 3 1.3Z" fill="currentColor" /></svg>
                </span>
              </button>
              {/* play, pause and a bar to jump along the recording */}
              <div className="flex h-[18px] shrink-0 items-center gap-[7px] bg-[#111] pl-[7px] pr-[9px] text-white">
                <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid size-[14px] shrink-0 place-items-center">
                  {playing ? (
                    <svg width="8" height="8" viewBox="0 0 12 12" aria-hidden><rect x="1.5" y="1" width="3.2" height="10" rx="0.8" fill="currentColor" /><rect x="7.3" y="1" width="3.2" height="10" rx="0.8" fill="currentColor" /></svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 12 12" aria-hidden><path d="M3 1.3v9.4a.6.6 0 0 0 .92.5l7.2-4.7a.6.6 0 0 0 0-1L3.92.8A.6.6 0 0 0 3 1.3Z" fill="currentColor" /></svg>
                  )}
                </button>
                <button type="button" onClick={seek} aria-label="Jump to a point in the recording" className="relative h-full flex-1">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/25" />
                  <span className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
