"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Magnetic } from "@/components/Magnetic";
import { Spark, ask } from "./Ask";
import { ready, scrollToId } from "./Shell";

const LINKS = [
  ["Work", "work"],
  ["About", "about"],
  ["AI", "ai"],
  ["Contact", "contact"],
] as const;

/** Name on the left, a glass pill of sections in the middle, Ask on the right. Hides on the way down. */
export function FNav() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const home = pathname === "/fable";

  useGSAP(
    () => {
      const bar = gsap.utils.toArray<HTMLElement>("[data-nav]", ref.current);
      const drop = gsap.from(bar, { y: -80, autoAlpha: 0, stagger: 0.08, duration: 1.2, paused: true });
      ready.then(() => drop.delay(0.35).play());

      let last = window.scrollY;
      let hidden = false;
      const onScroll = () => {
        const y = window.scrollY;
        const hide = y > last && y > 160;
        last = y;
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(bar, { y: hide ? -90 : 0, duration: 0.7, ease: "expo.out", overwrite: true });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      {/* The name sits outside the header so it can blend with the page: white on dark, black on white. */}
      <Link href="/fable" data-nav className="fixed left-4 top-[1.35rem] z-50 text-lg tracking-[-0.02em] text-white mix-blend-difference sm:left-10">
        Salaath Shaikh
      </Link>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 text-[#f2f1ed] sm:px-10">
      <span />

      <nav data-nav className="f-glass pointer-events-auto hidden items-center gap-1 rounded-full p-1.5 text-sm md:flex">
        {LINKS.map(([label, id]) => (
          <Link
            key={id}
            href={`/fable#${id}`}
            onClick={(e) => {
              if (home && scrollToId(id)) e.preventDefault();
            }}
            className="rounded-full px-4 py-1.5 text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
          >
            {label}
          </Link>
        ))}
      </nav>
      <span className="md:hidden" />

      <div data-nav className="pointer-events-auto justify-self-end">
        <Magnetic strength={0.25}>
          <button type="button" onClick={() => ask()} className="f-glass group flex items-center gap-2.5 rounded-full py-2 pl-3.5 pr-2 text-sm">
            <Spark className="!size-4 transition-transform duration-700 group-hover:rotate-180" />
            Ask
            <kbd className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/60">⌘K</kbd>
          </button>
        </Magnetic>
      </div>
    </header>
    </div>
  );
}
