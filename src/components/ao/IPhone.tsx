// A titanium iPhone frame. The screen keeps the design's own aspect ratio, so
// nothing gets cropped at the edges. Pass the screen as children.

export function IPhone({
  aspect = "375/812",
  children,
  className = "",
  dark = false,
}: {
  aspect?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -left-[1px] top-[19%] h-[3.5%] w-[2px] rounded-l-sm bg-[#a9a9b0]" />
      <span className="absolute -left-[1px] top-[26%] h-[7%] w-[2px] rounded-l-sm bg-[#a9a9b0]" />
      <span className="absolute -left-[1px] top-[35%] h-[7%] w-[2px] rounded-l-sm bg-[#a9a9b0]" />
      <span className="absolute -right-[1px] top-[29%] h-[10%] w-[2px] rounded-r-sm bg-[#a9a9b0]" />
      <div
        className={`rounded-[15%/7%] bg-[linear-gradient(135deg,#f2f2f4_0%,#b4b4bc_25%,#ececef_50%,#a4a4ac_75%,#e6e6ea_100%)] p-[1.1%] ${
          dark ? "shadow-[0_40px_90px_-30px_rgba(130,80,230,0.5)]" : "shadow-[0_30px_50px_-28px_rgba(20,10,40,0.45)]"
        }`}
      >
        <div className="rounded-[14%/6.5%] bg-[#070708] p-[2.6%]">
          <div className="relative overflow-hidden rounded-[11.5%/5.3%] bg-white" style={{ aspectRatio: aspect }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
