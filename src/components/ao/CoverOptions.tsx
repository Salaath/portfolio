"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import covers from "./covers.json";

/**
 * Temporary: the hero with each candidate cover mockup, and a switch to compare them.
 * Once one is picked, keep its image and remove the rest. Text colours follow --hero-ink
 * because some covers are dark. The switch is in a portal because the smooth
 * scroller's transform breaks position: fixed.
 */
type Cover = { label: string; w: number; h: number; cx: number; bg: string; dark: boolean };
const LIST = Object.entries(covers as Record<string, Cover>);
const DIR = "/work/ao3/covers";

export function CoverOptions({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(LIST[0][0]);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cover = (covers as Record<string, Cover>)[active];
  return (
    <header
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden px-4 pb-10 pt-28 sm:px-10"
      style={{ background: cover.bg, "--hero-ink": cover.dark ? "#ffffff" : "#141217", color: "var(--hero-ink)" } as React.CSSProperties}
    >
      {LIST.map(([id, c]) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={id}
          src={`${DIR}/${id}.webp`}
          alt={id === active ? `Version 3.0 welcome screen on a phone, ${c.label.toLowerCase()} mockup` : ""}
          aria-hidden={id !== active}
          width={c.w}
          height={c.h}
          className="pointer-events-none absolute top-0 hidden h-full w-auto max-w-none transition-opacity duration-500 [mask-image:linear-gradient(90deg,transparent_0,#000_32%)] md:block"
          style={{ left: "76%", transform: `translateX(${-c.cx * 100}%)`, opacity: id === active ? 1 : 0 }}
        />
      ))}

      {children}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${DIR}/${active}.webp`} alt="" className="relative -mx-4 mt-4 block w-[calc(100%+2rem)] max-w-none sm:-mx-10 sm:w-[calc(100%+5rem)] md:hidden" />

      {show
        ? createPortal(
            <div className="fixed bottom-6 left-1/2 z-[900] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border border-dashed border-ink/30 bg-bg p-1.5 text-sm text-ink shadow-lg">
              <span className="shrink-0 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Cover</span>
              {LIST.map(([id, c]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active === id}
                  onClick={() => setActive(id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 transition-colors ${active === id ? "bg-ink text-bg" : "hover:bg-card"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
