"use client";

import { useRef } from "react";
import { DESKTOP, MOTION_OK, ScrollTrigger, SplitText, gsap, padMasks, useGSAP } from "@/lib/gsap";

/**
 * Page-level choreographer. Server-rendered markup opts into motion with
 * data attributes, and this component wires them up with GSAP:
 *
 *   data-split="lines|words|chars"  masked SplitText rise (on scroll, or on load with data-load)
 *   data-fade                       fade + lift (on scroll, or on load with data-load)
 *   data-delay="0.2"                delay for either of the above
 *   data-clip                       clip-path wipe from the bottom on scroll
 *   data-scrub-words                words light up one by one, scrubbed to scroll
 *   data-parallax="0.15"            scrubbed vertical drift relative to its parent
 *   data-pin                        desktop: pin while the parent section scrolls past
 *   data-label                      mono eyebrow that decodes (scramble) into place
 *   data-slide="-40"                scrubbed sideways drift in xPercent, for giant titles
 *   data-wipe                       media opens from an angled clip, scrubbed; zooms [data-wipe-inner]
 *   data-count                      the number inside counts up from zero on enter
 *   data-grow                       scaleX from the left edge on enter (bars, rules)
 */
export function Choreo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const all = <T extends HTMLElement = HTMLElement>(sel: string) =>
        Array.from(root.querySelectorAll<T>(sel));
      const delayOf = (el: HTMLElement) => Number(el.dataset.delay ?? 0);
      const onScroll = (el: HTMLElement) =>
        el.hasAttribute("data-load")
          ? undefined
          : { trigger: el, start: "top 88%", once: true };

      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };

        if (!motion) {
          gsap.set(all("[data-split],[data-fade],[data-clip]"), { autoAlpha: 1 });
          return;
        }

        all("[data-split]").forEach((el) => {
          const type = el.dataset.split as "lines" | "words" | "chars";
          SplitText.create(el, {
            type: "lines,words,chars",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              padMasks(self);
              gsap.set(el, { autoAlpha: 1 });
              return gsap.from(self[type], {
                yPercent: 120,
                rotate: type === "lines" ? 0 : 6,
                transformOrigin: "0% 100%",
                duration: 1.4,
                stagger: { lines: 0.12, words: 0.05, chars: 0.022 }[type],
                delay: delayOf(el),
                scrollTrigger: onScroll(el),
              });
            },
          });
        });

        all("[data-fade]").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, delay: delayOf(el), scrollTrigger: onScroll(el) },
          );
        });

        all("[data-clip]").forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.inOut",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

        all("[data-scrub-words]").forEach((el) => {
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.14 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
                },
              ),
          });
        });

        all("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) * 100;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        all("[data-label]").forEach((el) => {
          const text = el.textContent ?? "";
          el.textContent = " ";
          gsap.to(el, {
            scrambleText: { text, chars: "01/—_[]", speed: 0.6, revealDelay: 0.15 },
            duration: 1.1,
            ease: "none",
            delay: delayOf(el),
            scrollTrigger: onScroll(el),
          });
        });

        all("[data-slide]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 0 },
            {
              xPercent: Number(el.dataset.slide),
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Media opens from an angled sliver to full frame as it scrolls up,
        // while the picture inside settles from a slight zoom.
        all("[data-wipe]").forEach((el) => {
          const inner = el.querySelector("[data-wipe-inner]");
          gsap.set(el, { autoAlpha: 1 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top 98%", end: "top 40%", scrub: 0.6 },
          });
          tl.fromTo(
            el,
            { clipPath: "polygon(8% 26%, 92% 6%, 92% 100%, 8% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
            0,
          );
          if (inner) tl.fromTo(inner, { scale: 1.16 }, { scale: 1 }, 0);
        });

        // Numbers count up from zero, keeping their units ("~28%", "18 min")
        all("[data-count]").forEach((el) => {
          // This setup re-runs when the window crosses a breakpoint, by which time the
          // text may already read zero, so keep the real value from the first run.
          const text = (el.dataset.countText ??= el.textContent ?? "");
          const m = text.match(/\d+(\.\d+)?/);
          if (!m) return;
          const target = parseFloat(m[0]);
          const decimals = m[1] ? m[1].length - 1 : 0;
          const o = { v: 0 };
          // The real number stays on screen until the count starts, so a trigger
          // that never fires can't leave a stat reading zero.
          el.textContent = text;
          gsap.to(o, {
            v: target,
            duration: 1.6,
            ease: "power3.out",
            delay: delayOf(el),
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
              onEnter: () => {
                el.textContent = text.replace(m[0], (0).toFixed(decimals));
              },
            },
            onUpdate: () => {
              el.textContent = text.replace(m[0], o.v.toFixed(decimals));
            },
            onComplete: () => {
              el.textContent = text;
            },
          });
        });

        // Bars and rules grow from their left edge
        all("[data-grow]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 1.4,
            ease: "expo.out",
            delay: delayOf(el),
            scrollTrigger: onScroll(el),
          });
        });

        // Lazy images can change the page height after triggers are measured;
        // re-measure (debounced) whenever one finishes loading.
        // Only when the page actually got taller or shorter: images inside
        // fixed-size frames (phone mockups) don't move anything, and a refresh
        // while a pinned section is mid-scroll makes it jump.
        const content = () => document.getElementById("smooth-content") ?? document.body;
        let measured = content().scrollHeight;
        let pending: ReturnType<typeof setTimeout> | undefined;
        const remeasure = () => {
          clearTimeout(pending);
          pending = setTimeout(() => {
            const h = content().scrollHeight;
            if (Math.abs(h - measured) < 2) return;
            measured = h;
            ScrollTrigger.refresh();
          }, 150);
        };
        all<HTMLImageElement>("img").forEach((img) => {
          if (!img.complete) img.addEventListener("load", remeasure, { once: true });
        });

        if (desktop) {
          all("[data-pin]").forEach((el) => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 112px",
              endTrigger: el.parentElement,
              end: () => `bottom ${112 + el.offsetHeight}px`,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className={className}>
      {children}
    </main>
  );
}
