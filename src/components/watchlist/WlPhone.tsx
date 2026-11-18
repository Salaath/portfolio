// A real watchlist screen inside a thin Android bezel. Screens are 720×1600
// captures of the coded prototypes (public/proto/watchlist), which were built
// from the 2026 Figma file and the live app. They carry their own Android
// status and navigation bars, so nothing is cropped.

export const WL_IMG = "/work/watchlist";
// bump when the screenshot files change, so browsers drop cached copies
export const SHOT_V = "?v=8";

export function WlPhone({
  src,
  alt,
  width,
  className = "",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  width?: number | string;
  className?: string;
  priority?: boolean;
  /** Extra layers over the screen, e.g. hotspots. */
  children?: React.ReactNode;
}) {
  // Corners and bezel are sized in container units, so a 100px thumbnail and a
  // 300px hero phone have the same proportions instead of a fixed radius that
  // turns small phones into pills.
  return (
    <div className={`[container-type:inline-size] ${className}`} style={width ? { width } : undefined}>
      <div className="rounded-[13.5cqw] bg-[#16121c] p-[2.4cqw] shadow-[0_40px_80px_-30px_rgba(40,14,80,0.45),inset_0_0_0_1.5px_#2c2833]">
      <div data-native-cursor className="relative aspect-[9/20] w-full overflow-hidden rounded-[11.2cqw] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${WL_IMG}/${src}.jpg${SHOT_V}`}
          alt={alt}
          width={720}
          height={1600}
          // eager: the smooth-scroll wrapper clips lazy loading to the screen, so
          // lazy images only started loading once already in view
          loading="eager"
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {children}
      </div>
      </div>
    </div>
  );
}
