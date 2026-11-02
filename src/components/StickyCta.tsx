"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { Magnetic } from "./Magnetic";
import { RollButton } from "./RollButton";
import { scrollToId } from "./Smoother";

/**
 * Fixed "Let's talk" pill in the corner. Slides in once the hero is behind
 * you and tucks away again when the contact section itself is on screen.
 */
export function StickyCta() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.set(el, { yPercent: 160 });
      // Driven by ScrollTrigger so it reads positions after the smoother
      // has moved the content, not from the raw native scroll.
      let pastHero = false;
      let atContact = false;
      let shown = false;
      const update = () => {
        const show = pastHero && !atContact;
        if (show === shown) return;
        shown = show;
        gsap.to(el, { yPercent: show ? 0 : 160, duration: 0.9, ease: show ? "expo.out" : "expo.in", overwrite: true });
      };
      const hero = ScrollTrigger.create({
        start: () => window.innerHeight * 0.8,
        onEnter: () => ((pastHero = true), update()),
        onLeaveBack: () => ((pastHero = false), update()),
      });
      const contact = document.getElementById("contact");
      const near = contact
        ? ScrollTrigger.create({
            trigger: contact,
            start: "top 70%",
            onEnter: () => ((atContact = true), update()),
            onLeaveBack: () => ((atContact = false), update()),
          })
        : null;
      return () => {
        hero.kill();
        near?.kill();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="fixed bottom-5 right-4 z-50 sm:bottom-8 sm:right-10">
      <Magnetic strength={0.3}>
        <RollButton
          label="Let’s talk"
          className="bg-bg shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          onClick={() => {
            if (!scrollToId("contact")) window.location.href = "/#contact";
          }}
        />
      </Magnetic>
    </div>
  );
}
