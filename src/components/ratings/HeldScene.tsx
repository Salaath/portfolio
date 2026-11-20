"use client";

import { useEffect, useRef, useState } from "react";
import { warp } from "@/components/AiProjects";

// The ratings preview on the home page: the prototype's order flow, playing on the
// phone in Sal's mock-up photo (a hand holding the phone up, seen from above). The
// photo covers its tile, centred on the phone, and the screen is fitted onto the
// display, which faces the camera square on in this photo.

const PHOTO = { src: "/work/ratings/held-mock.webp", w: 1800, h: 1348 };
/** The point of the photo kept in the middle of the tile. */
const FOCUS: [number, number] = [900, 674];
/** The display's corners in the photo, where its straight edges would meet: top-left, top-right, bottom-right, bottom-left. */
const SCREEN: [number, number][] = [[720, 128], [1080, 128], [1080, 897], [720, 897]];
/** The prototype's own screen; it is laid out flat, then warped onto the display. */
const FILM: [number, number] = [360, 800];
const PROTO = "/proto/in-app-rating/index.html#demo-order-bare";

export function HeldScene({ label }: { label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ k: number; x: number; y: number } | null>(null);
  const [seen, setSeen] = useState(false);

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
    // the prototype only loads once the tile is on screen
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div ref={box} className="h-full w-full">
      {fit ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO.src} alt="" width={PHOTO.w} height={PHOTO.h} className="absolute inset-0 block h-full w-full" />
          {/* the corners are rounded before the warp, so they follow the phone's perspective */}
          <div className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[46px] bg-white" style={{ width: FILM[0], height: FILM[1], transform: warp(SCREEN, FILM) }}>
            {seen ? <iframe src={PROTO} title={label} tabIndex={-1} className="pointer-events-none absolute inset-0 block h-full w-full border-0" /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
