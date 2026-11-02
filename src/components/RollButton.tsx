"use client";

import Link from "next/link";

/**
 * Pill button whose ink fill rises from below on hover while the label rolls
 * up and is replaced by a copy. Pure CSS so it works without GSAP.
 */
export function RollButton({
  label,
  icon = "↗",
  href,
  onClick,
  invert = false,
  className = "",
}: {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  invert?: boolean;
  className?: string;
}) {
  const tone = invert ? "border-bg/30 text-bg" : "border-ink/20 text-ink";
  const fill = invert ? "bg-bg" : "bg-ink";
  const hoverText = invert ? "text-ink" : "text-bg";
  const hoverIcon = invert ? "group-hover:text-ink" : "group-hover:text-bg";
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-[101%] rounded-full ${fill} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0`}
      />
      <span className="relative block h-[1.25em] overflow-hidden leading-[1.25em]">
        <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {label}
        </span>
        <span className={`block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full ${hoverText}`}>
          {label}
        </span>
      </span>
      <span className={`relative grid size-7 place-items-center rounded-full transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-45deg] ${hoverIcon}`}>
        {icon}
      </span>
    </>
  );
  const cls = `group relative inline-flex items-center gap-4 overflow-hidden rounded-full border py-2.5 pl-6 pr-3 text-sm font-medium ${tone} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
