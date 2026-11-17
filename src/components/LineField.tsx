"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { introDone } from "@/lib/intro";

/**
 * Hero backdrop: a drafting sheet of contour lines that drift like a slow
 * swell. The pointer acts as a lens, parting the lines around it and
 * scrolling away flattens them. Canvas 2D, redrawn on GSAP's ticker.
 */
export function LineField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const state = { draw: 0, calm: 0, mx: -9999, my: -9999, lens: 0 };
    let w = 0;
    let h = 0;
    let ink = "#0e0e0e";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || ink;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      const rows = Math.round(h / 22);
      const gap = h / rows;
      const swell = 1 - state.calm;
      for (let i = 0; i <= rows; i++) {
        // lines draw outward from the middle row
        const order = Math.abs(i - rows / 2) / (rows / 2);
        const reveal = gsap.utils.clamp(0, 1, state.draw * 1.6 - order * 0.6);
        if (reveal <= 0) continue;
        const half = (w / 2) * reveal;
        const y0 = i * gap;
        // lines near the middle are a touch darker
        ctx.globalAlpha = (0.05 + 0.13 * (1 - order)) * (0.4 + 0.6 * reveal);
        ctx.beginPath();
        for (let x = w / 2 - half; x <= w / 2 + half; x += 12) {
          let y =
            y0 +
            swell *
              (14 * Math.sin(x * 0.0035 + t * 0.35 + i * 0.22) +
                7 * Math.sin(x * 0.009 - t * 0.5 + i * 0.5));
          const dx = x - state.mx;
          const dy = y - state.my;
          const d = Math.hypot(dx, dy);
          const R = 190;
          if (d < R) {
            const k = (1 - d / R) ** 2;
            y += Math.sign(dy || 1) * k * 46 * state.lens;
          }
          if (x === w / 2 - half) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION_OK }, (c) => {
      const motion = (c.conditions as { motion: boolean }).motion;
      if (!motion) {
        state.draw = 1;
        draw(0);
        return;
      }
      introDone.then(() => gsap.to(state, { draw: 1, duration: 2.6, ease: "expo.inOut", delay: 0.1 }));

      const mx = gsap.quickTo(state, "mx", { duration: 0.9, ease: "power3" });
      const my = gsap.quickTo(state, "my", { duration: 0.9, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        mx(e.clientX - r.left);
        my(e.clientY - r.top);
        gsap.to(state, { lens: 1, duration: 0.6, overwrite: "auto" });
      };
      const leave = () => gsap.to(state, { lens: 0, duration: 1.2, overwrite: "auto" });
      const host = canvas.parentElement!;
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);

      gsap.to(state, {
        calm: 1,
        ease: "none",
        scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: true },
      });

      const tick = (time: number) => draw(time);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", leave);
      };
    });

    return () => window.removeEventListener("resize", resize);
  });

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
