"use client";

import { useEffect, useRef, useState } from "react";
import { warp } from "@/components/AiProjects";

// The US Stocks preview on the home page: the first seconds of the flow
// recording, playing on the phone in Sal's hand mock-up photo. The photo covers
// its tile, centred on the phone; the film is warped onto the display and a
// mask keeps the two fingers that wrap the right edge in front of it.

const PHOTO = { src: "/work/us-stocks/hand-mock.jpg", mask: "/work/us-stocks/hand-mask.png", w: 1072, h: 753 };
/** The point of the photo kept in the middle of the tile. */
const FOCUS: [number, number] = [512, 372];
/** The display's corners in the photo, where its straight edges would meet: top-left, top-right, bottom-right, bottom-left. */
const SCREEN: [number, number][] = [[511.1, 101.9], [721.8, 186.3], [507.4, 643.3], [298.2, 543]];
/** The recording's own size; it is laid out flat, then warped onto the display. */
const FILM: [number, number] = [360, 800];
/** Only the opening of the journey plays here, then it starts again. */
const CLIP_SECONDS = 4;

export function HandScene({ video, poster, label }: { video: string; poster: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [fit, setFit] = useState<{ k: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = box.current!;
    const measure = () => {
      const W = el.clientWidth, H = el.clientHeight;
      const k = Math.max(W / PHOTO.w, H / PHOTO.h);
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      setFit({ k, x: clamp(W / 2 - FOCUS[0] * k, W - PHOTO.w * k), y: clamp(H / 2 - FOCUS[1] * k, H - PHOTO.h * k) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const v = vid.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, [fit]);

  const mask = { maskImage: `url(${PHOTO.mask})`, WebkitMaskImage: `url(${PHOTO.mask})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" };

  return (
    <div ref={box} className="h-full w-full">
      {fit ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO.src} alt="" width={PHOTO.w} height={PHOTO.h} className="absolute inset-0 block h-full w-full" />
          <div className="absolute inset-0" style={mask}>
            {/* the corners are rounded before the warp, so they follow the phone's perspective */}
            <div className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[46px] bg-black" style={{ width: FILM[0], height: FILM[1], transform: warp(SCREEN, FILM) }}>
              <video
                ref={vid}
                src={`${video}#t=0,${CLIP_SECONDS}`}
                poster={poster}
                muted
                playsInline
                preload="metadata"
                aria-label={label}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.currentTime >= CLIP_SECONDS) {
                    v.currentTime = 0;
                    v.play().catch(() => {});
                  }
                }}
                className="absolute inset-0 block h-full w-full max-w-none object-fill"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
