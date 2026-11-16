/**
 * A slim iPhone 15 Pro–style frame for screen recordings that already carry
 * their own status bar and Dynamic Island. Everything is in cqw of the device
 * width, so the titanium band, the black bezel and the screen share one corner
 * centre (concentric radii) at any size.
 *
 *   band 0.75cqw + bezel 2.1cqw → screen is 94.3% of the device width
 *   screen radius 13.4cqw ≈ 14.2% of screen width, matching the recordings
 *
 * Size it with `width` (the device's height follows from the screen aspect).
 */
export function Phone({ children, screen = "666 / 1452", className = "", style }: { children: React.ReactNode; screen?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative [container-type:inline-size] ${className}`} style={style}>
      {/* side buttons, in titanium, tucked behind the band */}
      <span aria-hidden className="absolute -left-[0.55cqw] top-[22cqw] h-[6.5cqw] w-[0.9cqw] rounded-l-[0.5cqw] bg-gradient-to-r from-[#8e8e93] to-[#d4d4d8]" />
      <span aria-hidden className="absolute -left-[0.55cqw] top-[34cqw] h-[12cqw] w-[0.9cqw] rounded-l-[0.5cqw] bg-gradient-to-r from-[#8e8e93] to-[#d4d4d8]" />
      <span aria-hidden className="absolute -left-[0.55cqw] top-[49cqw] h-[12cqw] w-[0.9cqw] rounded-l-[0.5cqw] bg-gradient-to-r from-[#8e8e93] to-[#d4d4d8]" />
      <span aria-hidden className="absolute -right-[0.55cqw] top-[38cqw] h-[19cqw] w-[0.9cqw] rounded-r-[0.5cqw] bg-gradient-to-l from-[#8e8e93] to-[#d4d4d8]" />

      {/* titanium band */}
      <div
        className="relative rounded-[16.25cqw] p-[0.75cqw] shadow-[0_2.5cqw_5cqw_-1cqw_rgba(0,0,0,0.18),0_18cqw_30cqw_-10cqw_rgba(0,0,0,0.38)]"
        style={{ background: "linear-gradient(145deg,#f4f4f6 0%,#a7a7ad 18%,#e9e9ee 38%,#8d8d93 62%,#dcdce1 82%,#9c9ca2 100%)" }}
      >
        {/* black bezel, with a hairline where glass meets band */}
        <div className="rounded-[15.5cqw] bg-[#0a0a0b] p-[2.1cqw] shadow-[inset_0_0_0_0.3cqw_rgba(255,255,255,0.08)]">
          <div className="relative overflow-hidden rounded-[13.4cqw] bg-white [transform:translateZ(0)]" style={{ aspectRatio: screen }}>
            {children}
            {/* a faint sweep of glass glare */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_32%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
