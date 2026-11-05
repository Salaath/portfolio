"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// An image you can open full screen and inspect: scroll or the buttons to
// zoom, drag to pan, Esc to close. Rendered in a portal because the page's smooth
// scroller transforms its content, which would break position: fixed.

export function Zoomable({
  src,
  alt,
  width,
  height,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  const zoomAt = useCallback((factor: number, cx = 0, cy = 0) => {
    setView((v) => {
      const s = Math.min(6, Math.max(1, v.s * factor));
      const k = s / v.s;
      if (s === 1) return { s: 1, x: 0, y: 0 };
      return { s, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "+" || e.key === "=") zoomAt(1.4);
      if (e.key === "-") zoomAt(1 / 1.4);
    };
    const el = stage.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!el) return;
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.002), e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    };
    window.addEventListener("keydown", onKey);
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("wheel", onWheel);
    };
  }, [open, zoomAt]);

  const close = () => {
    setOpen(false);
    setView({ s: 1, x: 0, y: 0 });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Zoom"
        aria-label={`Open and zoom: ${alt}`}
        className={`group relative block w-full cursor-zoom-in text-left ${className}`}
      >
        {children ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading="lazy" width={width} height={height} className="block h-auto w-full" />
        )}
        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink/85 px-3.5 py-2 text-xs font-medium text-bg backdrop-blur transition duration-300 group-hover:scale-105">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5M7 5v4M5 7h4" />
          </svg>
          Click to zoom
        </span>
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[1000] flex flex-col bg-[#0b0b0d] text-white" style={{ cursor: "auto" }} role="dialog" aria-modal="true" aria-label={alt}>
              <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <span className="truncate text-white/70">{alt}</span>
                <div className="flex shrink-0 items-center gap-2">
                  {[
                    ["−", "Zoom out", () => zoomAt(1 / 1.4)],
                    [`${Math.round(view.s * 100)}%`, "Reset zoom", () => setView({ s: 1, x: 0, y: 0 })],
                    ["+", "Zoom in", () => zoomAt(1.4)],
                    ["✕", "Close", close],
                  ].map(([l, a, f]) => (
                    <button
                      key={a as string}
                      type="button"
                      aria-label={a as string}
                      onClick={f as () => void}
                      className="min-w-10 rounded-full border border-white/25 px-3 py-2 font-mono text-xs tabular-nums transition-colors hover:bg-white hover:text-black"
                    >
                      {l as string}
                    </button>
                  ))}
                </div>
              </div>
              <div
                ref={stage}
                className="relative flex-1 touch-none select-none overflow-hidden"
                style={{ cursor: view.s > 1 ? (drag.current ? "grabbing" : "grab") : "zoom-in" }}
                onClick={(e) => {
                  if (view.s === 1 && !drag.current) {
                    const r = e.currentTarget.getBoundingClientRect();
                    zoomAt(2.4, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
                  }
                }}
                onPointerDown={(e) => {
                  if (view.s === 1) return;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (d) setView((v) => ({ ...v, x: d.vx + e.clientX - d.x, y: d.vy + e.clientY - d.y }));
                }}
                onPointerUp={() => {
                  drag.current = null;
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  draggable={false}
                  className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-4"
                  style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, transformOrigin: "center" }}
                />
              </div>
              <p className="px-5 py-3 text-center text-xs text-white/50">Scroll or click to zoom · drag to move · Esc to close</p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
