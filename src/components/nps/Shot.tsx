// A real screen from the NPS prototype (rendered to /public/work/nps) inside
// a thin device bezel. Images are 720×1600, so the frame keeps 9:20.

export function Shot({
  src,
  alt,
  width,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`rounded-[2.4rem] bg-[#111] p-[7px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] ${className}`}
      style={width ? { width } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/work/nps/${src}.jpg`}
        alt={alt}
        width={720}
        height={1600}
        loading={priority ? "eager" : "lazy"}
        className="block aspect-[9/20] h-auto w-full rounded-[2rem] bg-white object-cover object-top"
      />
    </div>
  );
}
