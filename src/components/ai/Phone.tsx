"use client";

// Mock-ups for the Muse and Chapters pages. Every one plays a short muted clip
// cut from a screen recording of the app: upright in a phone, tilted in space,
// or cropped in close on the part that moves. A clip plays while it is on
// screen, holds on its last frame, fades to its first and starts again.
import { useEffect, useRef, useState } from "react";
import { warp } from "@/components/AiProjects";

/** `crop` is the part of the video that is the screen, as fractions [x, y, width, height], when a recording shows more than the screen. */
export type Clip = { src: string; label: string; crop?: [number, number, number, number] };

const poster = (src: string) => src.replace(/\.mp4(\?.*)?$/, ".jpg$1");

function useClip() {
  const ref = useRef<HTMLVideoElement>(null);
  // null until the visitor presses the button; then their choice wins while the clip is on screen
  const manual = useRef<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState(true);

  useEffect(() => {
    const v = ref.current!;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const auto = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !conn?.saveData;
    let on = false;
    let t: ReturnType<typeof setTimeout>;
    const sync = () => ((manual.current ?? auto) && on ? v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(
      ([e]) => {
        on = e.intersectionRatio >= 0.35;
        if (!e.isIntersecting) manual.current = null;
        sync();
      },
      { threshold: [0, 0.35, 0.6] },
    );
    // watch the mock-up, not the video: a cropped video is mostly hidden by design
    io.observe(v.closest("[data-mock]") ?? v);
    const onPlay = () => { setPlaying(true); setCover(false); };
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      t = setTimeout(() => {
        setCover(true);
        t = setTimeout(() => { v.currentTime = 0; sync(); }, 600);
      }, 900);
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    return () => {
      clearTimeout(t);
      io.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const v = ref.current!;
    manual.current = v.paused;
    if (v.paused) {
      if (v.ended) v.currentTime = 0;
      v.play().catch(() => {});
    } else v.pause();
  };
  return { ref, playing, cover, toggle };
}

function Toggle({ playing, onClick, label, className = "" }: { playing: boolean; onClick: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${playing ? "Pause" : "Play"}: ${label}`}
      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-black/70 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${className}`}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
        {playing ? <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" /> : <path d="M3 1.2v9.6L10.5 6z" />}
      </svg>
    </button>
  );
}

/** The clip and its first frame, stacked. The parent sets the box. */
function Film({ clip, c }: { clip: Clip; c: ReturnType<typeof useClip> }) {
  const k = clip.crop;
  // a cropped recording is scaled up and shifted so only its screen fills the box
  const box = k ? { left: `${(-k[0] / k[2]) * 100}%`, top: `${(-k[1] / k[3]) * 100}%`, width: `${100 / k[2]}%`, height: `${100 / k[3]}%` } : undefined;
  const fit = k ? "absolute block max-w-none object-fill" : "absolute inset-0 block h-full w-full object-cover";
  return (
    <>
      <video ref={c.ref} src={clip.src} poster={poster(clip.src)} muted playsInline preload="none" aria-label={clip.label} className={fit} style={box} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster(clip.src)} alt="" aria-hidden loading="lazy" className={`pointer-events-none ${fit} transition-opacity duration-500 ${c.cover ? "opacity-100" : "opacity-0"}`} style={box} />
    </>
  );
}

/**
 * A phone playing a clip. `tilt` turns it in space; the body gets a visible
 * side so it reads as an object and not a flat card.
 */
export function Phone({ clip, className = "", tilt, edge = "#3a3a3c" }: { clip: Clip; className?: string; tilt?: string; edge?: string }) {
  const c = useClip();
  return (
    <div data-mock className={`group/phone relative [container-type:inline-size] ${className}`} style={tilt ? { perspective: "1800px" } : undefined}>
      <div
        className="relative rounded-[14.5cqw] bg-[#0b0b0c] p-[2.6cqw] [transform-style:preserve-3d]"
        style={{
          transform: tilt,
          boxShadow: tilt
            ? `-1px 1px 0 ${edge}, -2px 2px 0 ${edge}, -3px 3px 0 ${edge}, -4px 4px 0 ${edge}, -5px 5px 0 ${edge}, -6px 6px 0 ${edge}, -30px 60px 90px -20px rgba(0,0,0,0.55)`
            : `inset 0 0 0 0.5cqw ${edge}, 0 50px 90px -40px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="relative aspect-[1290/2796] overflow-hidden rounded-[12cqw] bg-[#f3f3f1]">
          <Film clip={clip} c={c} />
          {/* the phone's Dynamic Island, which also covers the recording dot */}
          <span aria-hidden className="absolute left-[28.8%] top-[1%] z-10 h-[4.3%] w-[40.8%] rounded-full bg-black" />
        </div>
      </div>
      <Toggle playing={c.playing} onClick={c.toggle} label={clip.label} className="absolute bottom-[4%] left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity group-hover/phone:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
    </div>
  );
}

/**
 * A close crop of a clip: only the band between `from` and `to` (fractions of
 * the screen's height) shows, at full tile width, so a small motion fills a tile.
 */
export function Crop({ clip, from, to, className = "" }: { clip: Clip; from: number; to: number; className?: string }) {
  const c = useClip();
  const H = 2796 / 1290; // screen height over its width
  return (
    <div data-mock className={`group/phone relative overflow-hidden ${className}`} style={{ aspectRatio: `1 / ${((to - from) * H).toFixed(4)}` }}>
      <div className="absolute inset-x-0 top-0 aspect-[1290/2796]" style={{ transform: `translateY(${(-from * 100).toFixed(2)}%)` }}>
        <Film clip={clip} c={c} />
      </div>
      <Toggle playing={c.playing} onClick={c.toggle} label={clip.label} className="absolute bottom-3 right-3 z-20 opacity-0 transition-opacity group-hover/phone:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
    </div>
  );
}

// The meadow scene: a 2000×1500 photo of a phone standing in grass. The photo's
// phone is an Android handset, so an iPhone is drawn over it and the clip is
// warped onto its display. The grass in front of the phone is kept in front
// with an alpha mask the size of the photo.
const SCENE = {
  src: "/work/ai/pages/scene-meadow.webp",
  mask: "/work/ai/pages/scene-meadow-mask.png?v=2",
  w: 2000,
  h: 1500,
  focus: [975, 860],
  // the display's corners in the photo: top-left, top-right, bottom-right, bottom-left
  screen: [[818, 507], [1178, 512], [1132, 1290], [765, 1284]] as [number, number][],
};
const BOX: [number, number] = [353, 767];

/** A clip playing on the phone in the meadow photo. The photo covers the tile, centred on the phone. */
export function SceneMock({ clip, className = "" }: { clip: Clip; className?: string }) {
  const c = useClip();
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ k: number; x: number; y: number } | null>(null);
  useEffect(() => {
    const el = ref.current!;
    const measure = () => {
      const W = el.clientWidth, H = el.clientHeight;
      const k = Math.max(W / SCENE.w, H / SCENE.h);
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      setFit({ k, x: clamp(W / 2 - SCENE.focus[0] * k, W - SCENE.w * k), y: clamp(H / 2 - SCENE.focus[1] * k, H - SCENE.h * k) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const mask = { maskImage: `url(${SCENE.mask})`, WebkitMaskImage: `url(${SCENE.mask})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" };
  return (
    <div ref={ref} data-mock className={`group/phone relative overflow-hidden bg-[#b9c4ee] ${className}`}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: SCENE.w, height: SCENE.h, transform: fit ? `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` : undefined, visibility: fit ? "visible" : "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SCENE.src} alt="" width={SCENE.w} height={SCENE.h} loading="lazy" className="absolute inset-0 block h-full w-full" />
        <div className="absolute inset-0" style={mask}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: BOX[0], height: BOX[1], transform: warp(SCENE.screen, BOX, 1.03) }}>
            {/* the iPhone's body: a dark side, a titanium rim, then the black bezel */}
            <span className="absolute -inset-[15px] translate-x-[5px] translate-y-[3px] rounded-[61px] bg-[#101010] shadow-[0_30px_60px_-20px_rgba(10,30,10,0.5)]" />
            <span className="absolute -inset-[15px] rounded-[61px] bg-[linear-gradient(135deg,#6b6b6d,#2c2c2e_30%,#59595b_55%,#232325_80%,#4a4a4c)]" />
            <span className="absolute -inset-[11.5px] rounded-[57.5px] bg-[#0b0b0c]" />
            <div className="absolute inset-0 overflow-hidden rounded-[46px] bg-black">
              <Film clip={clip} c={c} />
              <span aria-hidden className="absolute left-[28.8%] top-[1%] z-10 h-[4.3%] w-[40.8%] rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
      <Toggle playing={c.playing} onClick={c.toggle} label={clip.label} className="absolute bottom-4 right-4 z-20 opacity-0 transition-opacity group-hover/phone:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
    </div>
  );
}
