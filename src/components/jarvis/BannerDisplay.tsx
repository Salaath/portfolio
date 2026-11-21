"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { warp } from "@/components/AiProjects";

// The display photo on the "Fewer, better campaigns" banner. The photo carries
// a still of the console, but at the size it is shown that still is softer
// than the page around it. So the console's own screenshot is laid over the
// screen at full resolution, mapped onto its four corners, with a touch more
// contrast so the small type holds up.

const PHOTO = { src: "/work/jarvis/console-banner.webp", w: 1800, h: 1348 };
/** The screen's corners in the photo: top-left, top-right, bottom-right, bottom-left. */
const SCREEN: [number, number][] = [[455, 373.8], [1356.9, 256.6], [1316.9, 856.5], [402.2, 945.5]];
/** The screenshot is laid out flat at the display's 16:9, then warped onto it. */
const FILM: [number, number] = [1280, 720];

export function BannerDisplay({ alt, className = "", style }: { alt: string; className?: string; style?: CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);

  useEffect(() => {
    const el = box.current!;
    const measure = () => setK(el.clientWidth / PHOTO.w);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`overflow-hidden ${className}`} style={{ aspectRatio: `${PHOTO.w}/${PHOTO.h}`, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PHOTO.src} alt="" width={PHOTO.w} height={PHOTO.h} loading="lazy" className="block h-auto w-full max-w-none" />
      {k ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `scale(${k})` }}>
          <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-[#edf1f4]" style={{ width: FILM[0], height: FILM[1], transform: warp(SCREEN, FILM) }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/jarvis/console-home.webp" alt="" loading="lazy" className="block h-full w-full object-cover object-top [filter:contrast(1.14)_saturate(1.06)]" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
