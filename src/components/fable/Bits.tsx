"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Tracks the pointer into --mx / --my so .f-spot can light its border and surface. */
export function Spot({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  return (
    <Tag
      className={`f-spot ${className}`}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - b.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - b.top}px`);
      }}
    >
      {children}
    </Tag>
  );
}

/** Leans its child toward the pointer in 3D, then settles back. */
export function Tilt({ children, className = "", max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const to = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }>(null);
  useGSAP(
    () => {
      const el = ref.current!.firstElementChild!;
      gsap.set(el, { transformPerspective: 1100, transformStyle: "preserve-3d" });
      to.current = {
        x: gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3" }),
      };
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const b = ref.current!.getBoundingClientRect();
        to.current?.x(((e.clientX - b.left) / b.width - 0.5) * 2 * max);
        to.current?.y(-((e.clientY - b.top) / b.height - 0.5) * 2 * max);
      }}
      onPointerLeave={() => {
        to.current?.x(0);
        to.current?.y(0);
      }}
    >
      {children}
    </div>
  );
}

/** Live Mumbai time. */
export function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now || "--:--:--"}</span>;
}

/** A thin bar across the top that fills as the page is read. */
export function ReadBar() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(ref.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  });
  return <div ref={ref} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-[#a78bfa]" />;
}
