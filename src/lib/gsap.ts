"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 1.2 });

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px)";

/** Give line masks a little breathing room so serif ascenders, descenders and italics aren't clipped. */
export function padMasks(split: SplitText) {
  if (split.masks?.length) {
    gsap.set(split.masks, {
      padding: "0.08em 0.08em 0.14em 0",
      margin: "-0.08em -0.08em -0.14em 0",
    });
  }
}

// Dev only: expose GSAP so the timeline can be inspected from the console.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { gsap: typeof gsap }).gsap = gsap;
}
