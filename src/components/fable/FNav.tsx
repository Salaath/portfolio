"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  // Set when the page moves by itself (a new page, a jump to a section), so
  // that move doesn't count as the reader scrolling down and hide the bar.
  const holdUntil = useRef(0);
  const showBar = useRef<() => void>(() => {});
  // The template serves the case studies under the main site, whose home is "/". The Fable
  // home at /fable is a concept page with its own sections, so links follow whichever is in use.
  const base = pathname.startsWith("/fable") ? "/fable" : "/";
  const home = pathname === "/fable";

  useGSAP(
    () => {
      const bar = gsap.utils.toArray<HTMLElement>("[data-nav]", ref.current);
      const drop = gsap.from(bar, { y: -80, autoAlpha: 0, stagger: 0.08, duration: 1.2, paused: true });
      ready.then(() => drop.delay(0.35).play());

      let last = window.scrollY;
      let hidden = false;
      showBar.current = () => {
        last = window.scrollY;
        if (!hidden) return;
        hidden = false;
        gsap.to(bar, { y: 0, duration: 0.7, ease: "expo.out", overwrite: true });
      };
      const onScroll = () => {
        const y = window.scrollY;
        // a jump of more than a screen in one step is the page moving itself, not the reader
        const jumped = Math.abs(y - last) > window.innerHeight * 0.8;
        const held = performance.now() < holdUntil.current;
        const hide = !jumped && !held && y > last && y > 160;
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

  // Every new page, and every jump to a section, starts with the bar in view.
  useEffect(() => {
    const show = () => {
      holdUntil.current = performance.now() + 2500;
      showBar.current();
    };
    show();
    window.addEventListener("hashchange", show);
    return () => window.removeEventListener("hashchange", show);
  }, [pathname]);

  // Case studies: the plain bar from the earlier site. Name and three links, no pill, no Ask.
  if (base === "/")
    return (
      <div ref={ref}>
        <header data-nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-5 text-white mix-blend-difference sm:px-10">
          <Link href="/" className="text-lg font-medium tracking-[-0.03em]">
            Salaath Shaikh<sup className="ml-0.5 text-[0.55em]">®</sup>
          </Link>
          <nav className="flex gap-2 text-sm">
            {LINKS.filter(([, id]) => id !== "ai").map(([label, id]) => (
              <Magnetic key={id}>
                <Link href={id === "about" ? "/about" : `/#${id}`} className="block px-3 py-2">{label}</Link>
              </Magnetic>
            ))}
          </nav>
        </header>
      </div>
    );

  return (
    <div ref={ref}>
      {/* The name sits outside the header so it can blend with the page: white on dark, black on white. */}
      <Link href={base} data-nav className="fixed left-4 top-[1.35rem] z-50 text-lg tracking-[-0.02em] text-white mix-blend-difference sm:left-10">
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
