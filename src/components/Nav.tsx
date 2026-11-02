"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { introDone } from "@/lib/intro";
import { Magnetic } from "./Magnetic";
import { scrollToId } from "./Smoother";

const links = [
  ["Work", "work"],
  ["About", "about"],
  ["Contact", "contact"],
] as const;

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      // Intro: drop in once the preloader has lifted
      const drop = gsap.from(ref.current!.children, { yPercent: -120, autoAlpha: 0, stagger: 0.08, paused: true });
      introDone.then(() => drop.delay(0.5).play());

      // Hide on scroll down, reveal on scroll up. A plain listener (not a
      // ScrollTrigger) so it can exist before the smoother is created.
      let last = window.scrollY;
      let hidden = false;
      const onScroll = () => {
        const y = window.scrollY;
        const hide = y > last && y > 120;
        last = y;
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(ref.current, { yPercent: hide ? -100 : 0, duration: 0.6, ease: "expo.out", overwrite: true });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-5 text-white mix-blend-difference sm:px-10"
    >
      <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
        Salaath Shaikh<sup className="ml-0.5 text-[0.55em] font-medium">®</sup>
      </Link>
      <span className="label hidden !text-white/70 md:block">Product designer — Upstox</span>
      <nav className="flex gap-2 text-sm">
        {links.map(([label, id]) => (
          <Magnetic key={id}>
            <Link
              href={`/#${id}`}
              className="block px-3 py-2"
              onClick={(e) => {
                if (pathname === "/" && scrollToId(id)) e.preventDefault();
              }}
            >
              {label}
            </Link>
          </Magnetic>
        ))}
      </nav>
    </header>
  );
}
