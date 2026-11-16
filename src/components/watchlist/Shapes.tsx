"use client";

import { useId } from "react";

// Shaded geometric shapes (spheres, isometric columns, cubes) for the case study's
// visual breaks. Each draws its own gradients so it can be dropped into any <svg>.

export type Tone = "purple" | "coral" | "mint" | "amber" | "ink" | "lilac";

// highlight, body, shadow
export const TONES: Record<Tone, [string, string, string]> = {
  purple: ["#D9CCFF", "#5B2EBD", "#22124A"],
  coral: ["#FFE0CC", "#EE6A3C", "#A8321A"],
  mint: ["#E4D8FB", "#8C93EE", "#7B55E8"], // the illustration palette (cyan, blue, violet)
  amber: ["#FFF3CF", "#F4B740", "#B8700E"],
  ink: ["#8C7BA8", "#2A1B3D", "#120A1D"],
  lilac: ["#FFFFFF", "#C9B8F5", "#7C62C9"],
};

export const PAL = { purple: "#5B2EBD", coral: "#EE6A3C", mint: "#3FB58A", amber: "#F4B740", ink: "#2A1B3D", lilac: "#C9B8F5", cream: "#FBF8F3" };

const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

// Spheres and cubes are grainy gradient bitmaps (public/work/watchlist/ill),
// drawn by scratchpad grain.mjs: one crisp edge, the other side dissolving.
const ORBS = ["orb-a", "orb-b", "orb-c"];
const PAD = 1.25; // the bitmaps leave this much room around the shape for the dissolve

export function Sphere({ cx, cy, r, v, className, style }: { cx: number; cy: number; r: number; tone?: Tone; shadow?: boolean; v?: 0 | 1 | 2; className?: string; style?: React.CSSProperties }) {
  const pick = v ?? Math.abs(Math.round(cx * 7 + cy * 3 + r)) % 3;
  const w = r * 2 * PAD;
  return (
    <g className={className} style={style}>
      <image href={`/work/watchlist/ill/${ORBS[pick]}.webp`} x={cx - w / 2} y={cy - w / 2} width={w} height={w} />
    </g>
  );
}

/** Isometric column standing on (x, y): half-width a, height h. */
export function Column({ x, y, a, h, top = "purple", className, style }: { x: number; y: number; a: number; h: number; top?: Tone; className?: string; style?: React.CSSProperties }) {
  const id = uid(useId());
  const t = y - h, d = a * 0.52;
  const [, body, lo] = TONES[top];
  return (
    <g className={className} style={style}>
      <defs>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9E2F7" />
          <stop offset="0.45" stopColor="#FFFFFF" />
          <stop offset="1" style={{ stopColor: TONES[top][0] }} />
        </linearGradient>
        <linearGradient id={`r${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A1029" />
          <stop offset="0.5" style={{ stopColor: lo }} />
          <stop offset="1" style={{ stopColor: body }} />
        </linearGradient>
      </defs>
      <polygon points={`${x - a},${t} ${x},${t + d} ${x},${y + d} ${x - a},${y}`} fill={`url(#l${id})`} />
      <polygon points={`${x},${t + d} ${x + a},${t} ${x + a},${y} ${x},${y + d}`} fill={`url(#r${id})`} />
      <polygon points={`${x - a},${t} ${x},${t - d} ${x + a},${t} ${x},${t + d}`} style={{ fill: body }} />
    </g>
  );
}

/** A cube reads as a hexagon: violet on one side, dissolving into blush on the other. */
export function Cube({ x, y, a, className, style }: { x: number; y: number; a: number; tone?: Tone; className?: string; style?: React.CSSProperties }) {
  const w = a * 2.2 * PAD, cy = y - a * 0.5;
  return (
    <g className={className} style={style}>
      <image href="/work/watchlist/ill/hex.webp" x={x - w / 2} y={cy - w / 2} width={w} height={w} />
    </g>
  );
}
