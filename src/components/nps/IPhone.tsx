// A flat iPhone frame for the NPS screens: bezel, side buttons, Dynamic Island,
// an iOS status bar and the home indicator. Everything is sized in container
// units, so the phone scales with whatever width it's given.
//
// Screens rendered from the prototype are 720×1600 with Android status and
// navigation bars baked in (96px each at 2×); those are cropped off here.
// Version 1 screens (src "v1/…") and full-length final screens (src "full/…")
// were rendered without the bars, at any height.

// Status bar colour for screens whose top isn't white (sampled from the images).
const TOPS: Record<string, string> = {
  byPayTimer: "#f1f1f1",
  byStatus: "#0c503b",
  calc: "#929292",
  plans: "#929292",
  stories: "#e0e0e0",
  storyWorks: "#dfdfdf",
  "v1/plans": "#929292",
};

// Bottom bars (CTA, filter and sort) cut from long version 1 screens, so they
// stay pinned while the page scrolls under them. Each is 720×112.
const BARS: Record<string, string> = {
  "v1/details": "v1/details-bar",
  "v1/all": "v1/all-bar",
  "full/fund": "full/fund-bar",
};

// App bars (title, tabs, filters) cut from full-length final screens, pinned
// above the scrolling page the way they are in the app.
const HEADS: Record<string, string> = {
  "full/exploreSeen": "full/exploreSeen-head",
  "full/allFunds": "full/allFunds-head",
  "full/fund": "full/fund-head",
};

// Home-indicator strip colour for screens whose bottom isn't white, so the
// strip reads as part of the screen (keyboards, grey footers).
const BOTTOMS: Record<string, string> = {
  buyAmount: "#273238",
  byNominee: "#f2f2f2",
  byPayTimer: "#f1f1f1",
  byPersonal: "#f2f2f2",
  "v1/amount": "#273238",
};

const isDark = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
};

export function IPhone({
  src,
  alt,
  width,
  className = "",
  priority = false,
  scroll = false,
  screen,
  statusBar = true,
}: {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  priority?: boolean;
  scroll?: boolean;
  /** Replaces the screen image, e.g. with a video of the flow. It fills the whole
   *  screen (360×775 at 1×), status-bar area included. */
  screen?: React.ReactNode;
  /** false when the screen (a recording) already draws its own iOS status bar */
  statusBar?: boolean;
}) {
  const bare = src.includes("/");
  const top = TOPS[src] ?? "#ffffff";
  const ink = isDark(top) ? "#ffffff" : "#000000";
  const bar = BARS[src];
  const head = HEADS[src];
  const bottom = bar ? "#ffffff" : BOTTOMS[src] ?? "#ffffff";
  return (
    <div className={`[container-type:inline-size] ${className}`} style={width ? { width } : undefined}>
      <div className="relative rounded-[15.5cqw] bg-[#1c1c1e] p-[3.2cqw] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45),inset_0_0_0_0.5cqw_#3a3a3c]">
        {/* side buttons: action, volume up, volume down, power */}
        <span aria-hidden className="absolute -left-[0.8cqw] top-[21cqw] h-[7cqw] w-[1cqw] rounded-l-[0.6cqw] bg-[#2c2c2e]" />
        <span aria-hidden className="absolute -left-[0.8cqw] top-[33cqw] h-[13cqw] w-[1cqw] rounded-l-[0.6cqw] bg-[#2c2c2e]" />
        <span aria-hidden className="absolute -left-[0.8cqw] top-[49cqw] h-[13cqw] w-[1cqw] rounded-l-[0.6cqw] bg-[#2c2c2e]" />
        <span aria-hidden className="absolute -right-[0.8cqw] top-[37cqw] h-[21cqw] w-[1cqw] rounded-r-[0.6cqw] bg-[#2c2c2e]" />

        <div className="relative aspect-[360/775] overflow-hidden rounded-[12.4cqw] bg-white">
          {/* iOS status bar */}
          {statusBar && <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 flex h-[13cqw] items-center justify-between pl-[9.5cqw] pr-[7.5cqw] pt-[1.2cqw]"
            style={{ background: screen ? "transparent" : top, color: ink }}
          >
            <span className="text-[3.9cqw] font-semibold leading-none tracking-[-0.02em]">9:41</span>
            <svg viewBox="0 0 70 13" className="w-[17cqw]" fill="currentColor">
              <rect x="0" y="8" width="3.2" height="4.5" rx="0.8" />
              <rect x="4.8" y="6" width="3.2" height="6.5" rx="0.8" />
              <rect x="9.6" y="3.5" width="3.2" height="9" rx="0.8" />
              <rect x="14.4" y="1" width="3.2" height="11.5" rx="0.8" />
              <path d="M30 3.2a10.6 10.6 0 0 1 7.4 3l1.3-1.3a12.5 12.5 0 0 0-17.4 0l1.3 1.3a10.6 10.6 0 0 1 7.4-3Zm0 3.7a6.9 6.9 0 0 1 4.8 2l1.3-1.3a8.7 8.7 0 0 0-12.2 0l1.3 1.3a6.9 6.9 0 0 1 4.8-2Zm0 3.7a3.2 3.2 0 0 1 2.2.9L30 13.7l-2.2-2.2a3.2 3.2 0 0 1 2.2-.9Z" />
              <rect x="44.5" y="1" width="22" height="11" rx="3.3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
              <rect x="46.5" y="3" width="18" height="7" rx="1.8" />
              <path d="M68 4.5v4a2 2 0 0 0 0-4Z" fillOpacity="0.45" />
            </svg>
          </div>}
          {/* Dynamic Island */}
          <span aria-hidden className="absolute left-1/2 top-[2.4cqw] z-20 h-[8.6cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-black" />

          {/* a video carries its own status-bar area, so it fills the whole screen */}
          <div className={`absolute inset-x-0 flex flex-col ${screen ? "inset-y-0" : "top-[13cqw] bottom-[6cqw]"}`}>
            {head && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/work/nps/${head}.jpg`} alt="" width={720} loading={priority ? "eager" : "lazy"} className="relative z-[5] block h-auto w-full shrink-0" />
            )}
            <div
              tabIndex={scroll ? 0 : undefined}
              aria-label={scroll ? `${alt}. Scroll to see the full screen.` : undefined}
              className={`min-h-0 flex-1 ${scroll ? "overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#7B5CB8] [&::-webkit-scrollbar]:hidden" : "overflow-hidden"}`}
            >
              {screen ?? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/work/nps/${src}.jpg`}
                alt={alt}
                width={720}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="block h-auto w-full"
                style={bare ? undefined : { marginTop: "-13.3333%" }}
              />
              )}
            </div>
            {bar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/work/nps/${bar}.jpg`} alt="" width={720} loading={priority ? "eager" : "lazy"} className="relative z-[5] block h-auto w-full shrink-0 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" />
            )}
          </div>
          {/* home indicator, in its own strip below the screen content */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[6cqw]" style={{ background: screen ? "transparent" : bottom }}>
            <span className="absolute bottom-[2cqw] left-1/2 h-[1.3cqw] w-[36cqw] -translate-x-1/2 rounded-full" style={{ background: isDark(bottom) ? "rgba(255,255,255,0.85)" : "rgba(17,17,17,0.8)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
