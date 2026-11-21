"use client";

import { useEffect, useRef } from "react";
import { CIRCUIT_BOX, TRACK } from "./circuit";

// The circuit in 3D, the way race broadcasts show it before a Grand Prix: the
// track raised off a dark ground, its edges lit, seen from above at an angle and
// turning slowly. Drag it to turn it and tilt it. Everything is black, white and
// grey, like the rest of the site. Drawn on a canvas with its own projection, so
// no 3D library is needed.

type P3 = [number, number, number];

const INK = "#f4f2ec";
/** Samples taken along the circuit. */
const N = 520;
/** Half the width of the track, the height it is raised by, in circuit units. */
const HALF = 11;
const RISE = 14;

/** Points along the drawn circuit, centred on the origin, with y pointing away from the viewer. */
function sample(): [number, number][] {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", TRACK);
  svg.appendChild(path);
  svg.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const p = path.getPointAtLength((i / N) * len);
    pts.push([p.x - CIRCUIT_BOX[0] / 2, p.y - CIRCUIT_BOX[1] / 2]);
  }
  svg.remove();
  return pts;
}

export function TrackSpin({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pts = sample();
    // left and right edges of the track, from each point's normal
    const edges = pts.map((p, i) => {
      const a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const l = Math.hypot(nx, ny) || 1;
      nx /= l; ny /= l;
      return { l: [p[0] + nx * HALF, p[1] + ny * HALF] as [number, number], r: [p[0] - nx * HALF, p[1] - ny * HALF] as [number, number] };
    });

    // view: yaw turns the circuit round, pitch tilts the ground away from the viewer
    let yaw = -0.35, pitch = 0.62;
    let vYaw = 0, vPitch = 0;
    let dragging = false, lastX = 0, lastY = 0, idle = 0;
    let W = 0, H = 0, dpr = 1, scale = 1, cam = 1500;
    let car = 0;
    let raf = 0, visible = true, lastT = performance.now();

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = el.clientWidth; H = el.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      scale = Math.min(W / 760, H / 560);
      cam = 1000;
      if (still) draw();
    };

    // World to screen. x runs across the ground, y away from the viewer, z up.
    // yaw turns the ground about its centre; pitch is how far above the ground
    // the viewer sits (90° would be straight down, like a map).
    const P = ([x, y, z]: P3): [number, number, number] => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const rx = x * cy - y * sy, ry = x * sy + y * cy;
      const ce = Math.cos(pitch), se = Math.sin(pitch);
      const up = ry * se + z * ce;
      const depth = ry * ce - z * se;
      const f = cam / (cam + depth);
      return [W / 2 + rx * f * scale, H * 0.56 - up * f * scale, depth];
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // the ground: a fine grid that fades into the distance
      const G = 640, step = 40;
      ctx.lineWidth = 1;
      for (let g = -G; g <= G; g += step) {
        for (const horiz of [true, false]) {
          const a: P3 = horiz ? [-G, g, 0] : [g, -G, 0];
          const b: P3 = horiz ? [G, g, 0] : [g, G, 0];
          const segs = 16;
          for (let s = 0; s < segs; s++) {
            const t0 = s / segs, t1 = (s + 1) / segs;
            const p0 = P([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, 0]);
            const p1 = P([a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1, 0]);
            const mid = (p0[2] + p1[2]) / 2;
            const fade = Math.max(0, Math.min(1, 1 - (mid + 150) / 750));
            const edgeFade = Math.max(0, 1 - Math.hypot(a[0] + (b[0] - a[0]) * (t0 + t1) / 2, a[1] + (b[1] - a[1]) * (t0 + t1) / 2) / G);
            const alpha = 0.16 * fade * edgeFade;
            if (alpha < 0.005) continue;
            ctx.strokeStyle = `rgba(244,242,236,${alpha})`;
            ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
          }
        }
      }

      // the raised track, built from short pieces drawn back to front
      const pieces = edges.map((e, i) => {
        const n = edges[(i + 1) % N];
        const tl = P([e.l[0], e.l[1], RISE]), tr = P([e.r[0], e.r[1], RISE]);
        const nl = P([n.l[0], n.l[1], RISE]), nr = P([n.r[0], n.r[1], RISE]);
        const bl = P([e.l[0], e.l[1], 0]), br = P([e.r[0], e.r[1], 0]);
        const bnl = P([n.l[0], n.l[1], 0]), bnr = P([n.r[0], n.r[1], 0]);
        return { i, depth: (tl[2] + tr[2] + nl[2] + nr[2]) / 4, tl, tr, nl, nr, bl, br, bnl, bnr };
      });
      pieces.sort((a, b) => b.depth - a.depth);
      for (const q of pieces) {
        // the two side walls, darker the further the piece sits
        const shade = Math.max(0, Math.min(1, 1 - (q.depth + 300) / 1000));
        ctx.fillStyle = `rgb(${Math.round(38 + 40 * shade)},${Math.round(38 + 40 * shade)},${Math.round(40 + 40 * shade)})`;
        for (const [t0, t1, b1, b0] of [[q.tl, q.nl, q.bnl, q.bl], [q.tr, q.nr, q.bnr, q.br]]) {
          ctx.beginPath(); ctx.moveTo(t0[0], t0[1]); ctx.lineTo(t1[0], t1[1]); ctx.lineTo(b1[0], b1[1]); ctx.lineTo(b0[0], b0[1]); ctx.closePath(); ctx.fill();
        }
        // the surface
        const g = Math.round(28 + 26 * shade);
        ctx.fillStyle = `rgb(${g},${g},${g + 2})`;
        ctx.beginPath(); ctx.moveTo(q.tl[0], q.tl[1]); ctx.lineTo(q.nl[0], q.nl[1]); ctx.lineTo(q.nr[0], q.nr[1]); ctx.lineTo(q.tr[0], q.tr[1]); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgb(${g},${g},${g + 2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // the lit edges on top of the track
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.75)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      for (const side of ["l", "r"] as const) {
        ctx.beginPath();
        edges.forEach((e, i) => { const p = P([e[side][0], e[side][1], RISE]); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // the car: a bright point with a fading trail, going round
      const trail = 26;
      for (let k = trail; k >= 0; k--) {
        const idx = Math.floor(car - k + N) % N;
        const p = pts[idx];
        const s = P([p[0], p[1], RISE + 0.5]);
        const a = 1 - k / trail;
        ctx.fillStyle = `rgba(255,255,255,${0.85 * a * a})`;
        ctx.beginPath(); ctx.arc(s[0], s[1], k === 0 ? 4.2 : 2.6 * a + 0.4, 0, Math.PI * 2); ctx.fill();
      }
      const head = P([pts[Math.floor(car) % N][0], pts[Math.floor(car) % N][1], RISE + 0.5]);
      ctx.save();
      ctx.shadowColor = "#fff"; ctx.shadowBlur = 18;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(head[0], head[1], 4.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // the start line, with a marker standing above it
      const s0 = pts[0];
      const foot = P([s0[0], s0[1], RISE]), top = P([s0[0], s0[1], RISE + 46]);
      ctx.strokeStyle = "rgba(244,242,236,0.55)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(foot[0], foot[1]); ctx.lineTo(top[0], top[1]); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText("START", top[0], top[1] - 6);
    };

    const loop = (t: number) => {
      raf = 0;
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      if (!dragging) {
        yaw += vYaw; pitch += vPitch;
        vYaw *= 0.94; vPitch *= 0.9;
        idle += dt;
        // after a moment untouched, it turns slowly on its own
        if (idle > 1.6) yaw += dt * 0.12;
      }
      pitch = Math.max(0.32, Math.min(1.3, pitch));
      car = (car + dt * 58) % N;
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const down = (e: PointerEvent) => {
      dragging = true; idle = 0;
      lastX = e.clientX; lastY = e.clientY;
      cv.setPointerCapture(e.pointerId);
      el.dataset.dragging = "";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      vYaw = dx * 0.006; vPitch = -dy * 0.004;
      yaw += vYaw; pitch += vPitch;
      if (still) draw();
    };
    const up = () => {
      dragging = false; idle = 0;
      delete el.dataset.dragging;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    let io: IntersectionObserver | null = null;
    if (still) draw();
    else {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); }
      });
      io.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={box} data-cursor="Drag" className={`group relative select-none ${className}`}>
      <canvas
        ref={canvas}
        role="img"
        aria-label="A race circuit in 3D, raised off a dark ground with its edges lit and a car lapping it. Drag to turn it."
        className="block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
      {/* registration ticks at the four corners, as on a race poster */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        <path d="M0 3V0H3M97 0H100V3M100 97V100H97M3 100H0V97" fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-bg/50 transition-opacity duration-500 group-data-[dragging]:opacity-0">Drag to turn</span>
    </div>
  );
}
