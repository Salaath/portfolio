"use client";

import { useEffect, useRef, useState } from "react";
import { warp } from "@/components/AiProjects";

// The campaigns console on the home page: its home screen mapped onto the
// desktop display in Sal's mock-up photo. The photo covers its tile, centred
// on the display.

const PHOTO = { src: "/work/jarvis/display-mock.webp", w: 2000, h: 1500 };
/** The point of the photo kept in the middle of the tile. */
const FOCUS: [number, number] = [1003, 640];
/** The screen's corners in the photo: top-left, top-right, bottom-right, bottom-left. */
const SCREEN: [number, number][] = [[439.5, 254], [1564.5, 146.5], [1567.5, 888], [436, 967]];
/** The screenshot is laid out flat at the display's 16:9, then warped onto it. */
const FILM: [number, number] = [1280, 720];

export function DisplayScene({ image, label }: { image: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={box} role="img" aria-label={label} className="h-full w-full">
      {fit ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO.src} alt="" width={PHOTO.w} height={PHOTO.h} loading="lazy" className="absolute inset-0 block h-full w-full" />
          <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white" style={{ width: FILM[0], height: FILM[1], transform: warp(SCREEN, FILM) }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" loading="lazy" className="block h-full w-full object-cover object-top" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
