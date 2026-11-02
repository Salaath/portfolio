// A real Upstox Loans screen inside a thin device bezel. Screens are rendered
// from the shipped Figma file to /public/work/loans at 720 wide; layers stack
// on top of each other, and `anim` puts the looping money background
// (the app's own lottie, exported as a webp) underneath them all.

export const LOANS_IMG = "/work/loans";

export function LoansPhone({
  layers,
  alt,
  anim = false,
  width,
  className = "",
  priority = false,
}: {
  layers: string[];
  alt: string;
  anim?: boolean;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`rounded-[2.4rem] bg-[#111] p-[7px] shadow-[0_40px_80px_-30px_rgba(40,10,80,0.5)] ${className}`}
      style={width ? { width } : undefined}
    >
      <div
        role="img"
        aria-label={alt}
        className="relative aspect-[9/20] w-full overflow-hidden rounded-[2rem]"
        style={{ background: anim ? "#4b0f96" : "#fff" }}
      >
        {anim ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${LOANS_IMG}/bg-anim.webp`} alt="" loading={priority ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {layers.map((l) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={l}
            src={`${LOANS_IMG}/${l}.webp`}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ))}
      </div>
    </div>
  );
}
