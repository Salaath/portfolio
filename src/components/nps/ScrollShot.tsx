// A full-length screen in the iPhone frame, scrollable in place so the whole
// page can be shown, not just the first viewport.
import { IPhone } from "./IPhone";

export function ScrollShot({
  src,
  alt,
  width,
  className = "",
  dark = false,
}: {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={className} style={width ? { width } : undefined}>
      <IPhone src={src} alt={alt} scroll />
      <p className={`mt-2.5 flex items-center justify-center gap-1.5 text-xs ${dark ? "text-white/55" : "text-muted"}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M6 1.5v8m0 0L2.5 6M6 9.5 9.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scroll the screen
      </p>
    </div>
  );
}
