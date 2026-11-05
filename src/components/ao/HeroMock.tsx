"use client";

import { useEffect, useRef, useState } from "react";
import { LoopVideo } from "./FlowVideo";

// The mockup photograph with the prototype clip warped onto its tilted screen.
// The matrix maps the 375×812 video onto the screen's corners in the 2000×1498 image.

const MATRIX = "matrix3d(0.908511,-0.090883,0,-0.000121,-0.210009,1.093056,0,-0.000058,0,0,1,0,864,246,0,1)";

export function HeroMock({ image, src, poster, label, className = "" }: { image: string; src: string; poster: string; label: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / 2000));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className={`overflow-hidden ${className}`} style={{ aspectRatio: "2000/1498" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="absolute inset-0 h-full w-full" />
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 2000, height: 1498, transform: `scale(${k})` }}>
        <div className="absolute left-0 top-0 origin-top-left overflow-hidden bg-white" style={{ width: 375, height: 812, transformOrigin: "0 0", transform: MATRIX, borderRadius: 50 }}>
          <LoopVideo src={src} poster={poster} label={label} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
