"use client";

import { useEffect, useRef, useState } from "react";

// The Jarvis console prototype (public/proto/jarvis), live on the screen of a
// desktop display photo. The photo is laid out in its own pixels and scaled to
// the width it is given; the prototype is an iframe mapped onto the screen's
// four corners, so it can be clicked through where it sits. The photo already
// carries a still of the console's home, which is what shows until the
// prototype has loaded, and on a phone, where it would be too small to use.

const PHOTO = { w: 2000, h: 1500 };
/** The part of the photo shown: the whole width on a desktop, closer in on a small screen. */
const WIDE = { x: 0, y: 60, w: 2000, h: 1150 };
const TIGHT = { x: 240, y: 90, w: 1520, h: 1130 };
/** A 1168 × 710 box at the photo's top left, mapped onto the screen (homography from its four corners). */
const SCREEN = { w: 1168, h: 710 };
const MATRIX = "matrix3d(1.0409788,0.001417604,0,0.000024519836,0.0020718282,1.0151701,0,0.0000019586895,0,0,1,0,481.7,194.3,0,1)";
/** The prototype is laid out for a 1360px window; it is drawn at that size and scaled into the screen box. */
const APP_W = 1360;
const APP_SCALE = SCREEN.w / APP_W;
const APP_H = Math.round(SCREEN.h / APP_SCALE);

export function DisplayProto({ src, image, alt, title, className = "" }: { src: string; image: string; alt: string; title: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const crop = width && width < 768 ? TIGHT : WIDE;
  const scale = width / crop.w;
  // under about 560px of screen the console is too small to click
  const live = seen && SCREEN.w * scale >= 560;

  return (
    <div ref={box} data-native-cursor="" className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${crop.w}/${crop.h}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: PHOTO.w, height: PHOTO.h, transform: `scale(${scale}) translate(${-crop.x}px, ${-crop.y}px)`, visibility: width ? "visible" : "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} width={PHOTO.w} height={PHOTO.h} loading="lazy" className="absolute inset-0 block h-full w-full max-w-none" />
        {live ? (
          <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-[#edf1f4]" style={{ width: SCREEN.w, height: SCREEN.h, transform: MATRIX }}>
            <iframe src={src} title={title} data-lenis-prevent className="absolute left-0 top-0 block origin-top-left border-0" style={{ width: APP_W, height: APP_H, transform: `scale(${APP_SCALE})` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
