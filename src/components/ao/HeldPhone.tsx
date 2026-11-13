"use client";

import { useEffect, useRef, useState } from "react";
import { LoopVideo } from "./FlowVideo";

// The held-phone mockup is 2000x1498. The screen's box and the homography that maps a 375x812
// screen onto it come from proto-video/hero_reel.mjs.
const W = 2000;
const H = 1498;
const BOX = [268, 180, 720, 1036];
const MATRIX = "1.191646,-0.077383,0,0.000089,0.387595,1.211169,0,-0.00002,0,0,1,0,255,216.5,0,1";

/**
 * A photo of a phone in someone's hands, with a looping recording playing on its screen.
 * The video is warped into the photo's perspective and cut to the screen's exact shape.
 */
export function HeldPhone({
  still,
  src,
  poster,
  mask,
  label,
  className = "",
  style,
}: {
  still: string;
  src: string;
  poster: string;
  mask: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => setK(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [bx, by, bw, bh] = BOX;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${W} / ${H}`, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={still} alt="" width={W} height={H} className="absolute inset-0 block h-full w-full" />
      {k > 0 && (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${k})` }}>
          <div
            className="absolute overflow-hidden"
            style={{
              left: bx,
              top: by,
              width: bw,
              height: bh,
              maskImage: `url(${mask})`,
              WebkitMaskImage: `url(${mask})`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          >
            <div className="absolute origin-top-left" style={{ left: -bx, top: -by, width: 375, height: 812, transform: `matrix3d(${MATRIX})` }}>
              <LoopVideo src={src} poster={poster} label={label} className="block h-full w-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
