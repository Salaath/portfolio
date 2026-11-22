"use client";

import { usePathname } from "next/navigation";
import { MOTION_OK, ScrollSmoother, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * Wraps the page in ScrollSmoother. Fixed-position UI (nav, cursor, progress)
 * must live outside this wrapper, because the content layer is transformed.
 */
export function Smoother({ children }: { children: React.ReactNode }) {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {/* Sibling order matters: layout effects run in tree order, so the
            smoother exists before any page creates its ScrollTriggers and
            RouteSync runs after they're all in place. */}
        <SmootherInit />
        {children}
        <RouteSync />
      </div>
    </div>
  );
}

function SmootherInit() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.25,
        smoothTouch: 0.1,
        normalizeScroll: false,
      });
      return () => smoother.kill();
    });
  });
  return null;
}

function RouteSync() {
  const pathname = usePathname();
  useGSAP(
    () => {
      const smoother = ScrollSmoother.get();
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash ? document.querySelector(hash) : null;
      if (target) {
        if (smoother) smoother.scrollTo(target, false, "top top");
        else target.scrollIntoView();
      } else if (smoother) {
        smoother.scrollTop(0);
      }
    },
    { dependencies: [pathname] },
  );
  return null;
}

/** Scroll to an in-page anchor, through the smoother when it's running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const smoother = ScrollSmoother.get();
  if (!smoother) {
    el.scrollIntoView({ behavior: "smooth" });
    return true;
  }
  // On a fresh load images and pins may still be settling, so the first
  // measure can be stale: measure again now, and once the glide ends, finish
  // the trip if the section has moved in the meantime.
  ScrollTrigger.refresh();
  smoother.scrollTo(el, true, "top top");
  let tries = 0;
  let last = -1;
  const settle = () => {
    const target = smoother.offset(el, "top top");
    const still = Math.abs(window.scrollY - last) < 2;
    last = window.scrollY;
    if (!still) return gsap.delayedCall(0.25, settle);
    if (Math.abs(window.scrollY - target) > 4 && tries++ < 3) {
      smoother.scrollTo(el, true, "top top");
      gsap.delayedCall(0.25, settle);
    }
  };
  gsap.delayedCall(0.6, settle);
  return true;
}
