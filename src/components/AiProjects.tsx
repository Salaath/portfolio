"use client";

import { useEffect, useRef, useState } from "react";

type Project = {
  title: string;
  tag: string;
  body: string;
  stack: string[];
  video: string;
  poster: string;
  /** phone: a tall screen floating on a tinted ground. page: the film fills the tile. scene: the film plays on the phone in a mock-up photo. */
  kind: "phone" | "page" | "scene";
  /** Ground colour behind a phone. */
  ground?: string;
  /** The Muse film is a bare screen and needs a bezel; the Chapters film already has one. */
  bezel?: boolean;
  href: string;
  cta: string;
};

// Draft copy: review before launch.
const PROJECTS: Project[] = [
  {
    title: "Muse",
    tag: "iOS app · Web demo",
    body: "A private museum journal. Works hang on a 3D wall, each with its story and boards keep what I have seen in person.",
    stack: ["SwiftUI", "Remotion", "React"],
    video: "/work/ai/muse.mp4",
    poster: "/work/ai/muse-poster.jpg",
    kind: "scene",
    ground: "#e8e2d5",
    href: "https://muse-web-vert.vercel.app/",
    cta: "Open demo",
  },
  {
    title: "Chapters",
    tag: "iOS app · Web demo",
    body: "A personal reading app. Shelves for every book, progress at a glance and recaps to pick a story back up.",
    stack: ["SwiftUI", "Remotion", "React"],
    video: "/work/ai/chapters.mp4",
    poster: "/work/ai/chapters-poster.jpg",
    kind: "scene",
    ground: "#14020a",
    href: "https://chapters-web-five.vercel.app/",
    cta: "Open demo",
  },
  {
    title: "Design onboarding",
    tag: "Microsite · Upstox",
    body: "A microsite that walks a new designer through the team, how we work and their first weeks.",
    stack: ["Claude Design", "HTML"],
    video: "/work/ai/onboarding.mp4",
    poster: "/work/ai/onboarding-poster.jpg",
    kind: "scene",
    ground: "#35b4ea",
    href: "/ai/upstox-design-onboarding.html",
    cta: "Open microsite",
  },
];

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
// The film drifts against the pointer and eases in on hover.
const DRIFT = `transition-transform duration-[1.4s] ${EASE} [transform:translate3d(calc(var(--px,0)*-22px),calc(var(--py,0)*-22px),0)_scale(var(--s,1))] [--s:1] group-hover:[--s:1.04]`;

const pointer = (e: React.PointerEvent<HTMLElement>) => {
  const b = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--px", ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
  e.currentTarget.style.setProperty("--py", ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
};
const rest = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--px", "0");
  e.currentTarget.style.setProperty("--py", "0");
};

/** A muted, looping film that only plays while it is on screen. */
function Film({ src, poster, label, className, style }: { src: string; poster: string; label: string; className: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} loop muted playsInline preload="metadata" aria-label={label} className={className} style={style} />;
}

type Pt = [number, number];
type SceneSpec = {
  /** The mock-up photo and its size in pixels. */
  src: string;
  w: number;
  h: number;
  /** The point of the photo to keep centred when the tile crops it. */
  focus: Pt;
  /** The phone display's four corners in the photo: top-left, top-right, bottom-right, bottom-left (where its straight edges would meet). */
  screen: [Pt, Pt, Pt, Pt];
  /** Anything in the photo that sits in front of the display (a hand), as an alpha mask the size of the photo. */
  mask?: string;
  /**
   * Draw an iPhone over the photo's own phone, for a scene shot with a different handset. The
   * number is how much larger than that phone's display the iPhone's display is drawn, so its
   * rounded body fully covers the square one underneath.
   */
  iphone?: number;
  /** The film's own box before it is warped, when it isn't a phone screen: [width, height] and the corner rounding. */
  film?: [number, number];
  round?: string;
  /** If the film shows more than the bare screen, where the screen sits in it: [x, y, width, height, film width, film height]. */
  crop?: [number, number, number, number, number, number];
};

const SCENES: Record<string, SceneSpec> = {
  Muse: {
    // a flower scene shot with an Android phone; an iPhone is drawn over it
    src: "/work/ai/muse-mock.webp",
    w: 2000,
    h: 1500,
    focus: [986, 835],
    screen: [[741.5, 381.5], [1123, 388.5], [1230.5, 1282], [843.5, 1289]],
    iphone: 1.1,
  },
  Chapters: {
    src: "/work/ai/chapters-mock.webp",
    w: 2000,
    h: 1500,
    focus: [1010, 618],
    // set against the phone's frame (boosted green channel), leaving an even bezel on all four sides
    screen: [[705, 217], [1056.5, 157.5], [1321, 1062], [965, 1148]],
    round: "rounded-[50px]",
    mask: "/work/ai/chapters-mock-mask.png",
    crop: [41, 41, 458, 990, 540, 1080],
  },
  "Design onboarding": {
    src: "/work/ai/onboarding-mock.webp",
    w: 1800,
    h: 1348,
    focus: [930, 600],
    screen: [[587.1, 114.2], [1315, 188.7], [1278, 664.4], [573.5, 590.6]],
    film: [640, 400],
    round: "rounded-t-[7px]",
  },
};

// The film is laid out flat in its own box, then warped onto the display. This is a phone's box.
const PHONE: [number, number] = [353, 767];

/** The matrix3d that carries the film's box onto four corners of the photo (a homography). */
function warp(q: Pt[], [FILM_W, FILM_H]: [number, number], grow = 1) {
  // push each corner 1.5px out from the centre, so no sliver of the photo's sample screen shows
  const cx = q.reduce((t, c) => t + c[0], 0) / 4, cy = q.reduce((t, c) => t + c[1], 0) / 4;
  const dst = q.map(([x, y]) => {
    const d = Math.hypot(x - cx, y - cy);
    return [cx + (x - cx) * grow + ((x - cx) / d) * 1.5, cy + (y - cy) * grow + ((y - cy) / d) * 1.5];
  });
  const src = [[0, 0], [FILM_W, 0], [FILM_W, FILM_H], [0, FILM_H]];
  const A: number[][] = [], b: number[] = [];
  src.forEach(([x, y], i) => {
    const [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X], [0, 0, 0, x, y, 1, -x * Y, -y * Y]);
    b.push(X, Y);
  });
  for (let i = 0; i < 8; i++) {
    let piv = i;
    for (let r = i + 1; r < 8; r++) if (Math.abs(A[r][i]) > Math.abs(A[piv][i])) piv = r;
    [A[i], A[piv]] = [A[piv], A[i]];
    [b[i], b[piv]] = [b[piv], b[i]];
    for (let r = 0; r < 8; r++) {
      if (r === i) continue;
      const f = A[r][i] / A[i][i];
      for (let k = i; k < 8; k++) A[r][k] -= f * A[i][k];
      b[r] -= f * b[i];
    }
  }
  const [m11, m12, m13, m21, m22, m23, m31, m32] = b.map((v, i) => v / A[i][i]);
  return `matrix3d(${[m11, m21, 0, m31, m12, m22, 0, m32, 0, 0, 1, 0, m13, m23, 0, 1].map((v) => +v.toFixed(7)).join(",")})`;
}

/** A film playing on the phone inside a mock-up photo. The photo covers the tile, centred on the phone. */
function Scene({ p, spec }: { p: Project; spec: SceneSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ k: number; x: number; y: number } | null>(null);
  useEffect(() => {
    const el = ref.current!;
    const measure = () => {
      const W = el.clientWidth, H = el.clientHeight;
      const k = Math.max(W / spec.w, H / spec.h);
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      setFit({ k, x: clamp(W / 2 - spec.focus[0] * k, W - spec.w * k), y: clamp(H / 2 - spec.focus[1] * k, H - spec.h * k) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [spec]);
  const c = spec.crop;
  const [FILM_W, FILM_H] = spec.film ?? PHONE;
  const mask = spec.mask ? { maskImage: `url(${spec.mask})`, WebkitMaskImage: `url(${spec.mask})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } : undefined;
  return (
    <div ref={ref} className={`h-full w-full ${DRIFT}`}>
      {fit ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: spec.w, height: spec.h, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.k})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={spec.src} alt="" width={spec.w} height={spec.h} className="absolute inset-0 block h-full w-full" />
          <div className="absolute inset-0" style={mask}>
            {/* the corners are rounded before the warp, so they follow the phone's perspective */}
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: FILM_W, height: FILM_H, transform: warp(spec.screen, [FILM_W, FILM_H], spec.iphone) }}>
              {spec.iphone ? (
                <>
                  {/* the side of the phone, seen from the left as the photo's own phone is */}
                  <span className="absolute -inset-[15px] -translate-x-[9px] translate-y-[2px] rounded-[61px] bg-[linear-gradient(180deg,#d9d2c4,#8f887b_18%,#cfc8ba_50%,#857e72_82%,#c9c2b4)] shadow-[0_30px_60px_-20px_rgba(60,50,20,0.45)]" />
                  {/* titanium rim, then the black bezel */}
                  <span className="absolute -inset-[15px] rounded-[61px] bg-[linear-gradient(135deg,#f3eee2,#b9b2a4_30%,#ebe5d8_55%,#a8a193_80%,#e4ddd0)]" />
                  <span className="absolute -inset-[11.5px] rounded-[57.5px] bg-[#0b0b0c]" />
                </>
              ) : null}
              <div className={`absolute inset-0 overflow-hidden bg-black ${spec.round ?? "rounded-[46px]"}`}>
              <Film
                src={p.video}
                poster={p.poster}
                label={`${p.title} walkthrough`}
                className="absolute block max-w-none object-fill"
                style={c ? { left: (-c[0] / c[2]) * FILM_W, top: (-c[1] / c[3]) * FILM_H, width: (c[4] / c[2]) * FILM_W, height: (c[5] / c[3]) * FILM_H } : { left: 0, top: 0, width: FILM_W, height: FILM_H }}
              />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The picture half of a project: its scene (or film) in a rounded tile, with the tag and the stack chips. */
function Media({ p, aspect, className = "" }: { p: Project; aspect: string; className?: string }) {
  return (
    <div data-wipe className={`relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ${aspect} ${className}`} style={{ background: p.ground }}>
      <div data-wipe-inner className="absolute inset-0">
        {p.kind === "scene" ? (
          <Scene p={p} spec={SCENES[p.title]} />
        ) : p.kind === "page" ? (
          <div className={`h-full w-full ${DRIFT}`}>
            <Film src={p.video} poster={p.poster} label={`${p.title} walkthrough`} className="h-full w-full scale-[1.06] object-cover object-top" />
          </div>
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${DRIFT}`}>
            <Film
              src={p.video}
              poster={p.poster}
              label={`${p.title} walkthrough`}
              className={
                p.bezel
                  ? "h-[84%] w-auto rounded-[2.4rem] border-[7px] border-[#16130f] shadow-[0_40px_80px_-30px_rgba(40,25,5,0.55)] md:rounded-[3rem] md:border-[9px]"
                  : "h-[96%] w-auto [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent),linear-gradient(to_bottom,transparent,#000_3%,#000_96%,transparent)]"
              }
            />
          </div>
        )}
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-black/75 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-md md:left-6 md:top-6">
        {p.tag}
      </span>
      <div className={`absolute inset-x-4 bottom-4 flex translate-y-3 flex-wrap gap-2 opacity-0 transition-[opacity,transform] duration-500 ${EASE} group-hover:translate-y-0 group-hover:opacity-100 md:inset-x-6 md:bottom-6`}>
        {p.stack.map((s) => (
          <span key={s} className="rounded-full bg-white/90 px-3 py-1.5 text-xs text-black backdrop-blur-md">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The words of a project at display size, beside its picture. */
function Words({ p, index }: { p: Project; index: string }) {
  return (
    <>
      <span data-fade className="label block">({index}) — {p.tag}</span>
      <h3 data-split="lines" className="mt-6 text-5xl leading-[0.95] tracking-[-0.04em] md:text-[4.6vw]">{p.title}</h3>
      <p data-fade data-delay="0.1" className="mt-6 max-w-sm text-lg leading-snug text-muted">{p.body}</p>
      <ul data-fade data-delay="0.16" className="mt-6 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <li key={s} className="rounded-full border border-ink/15 px-3 py-1 text-xs">{s}</li>
        ))}
      </ul>
      <span data-fade data-delay="0.22" className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/25 py-2.5 pl-5 pr-4 text-sm transition-colors duration-500 group-hover:bg-ink group-hover:text-bg">
        {p.cta} <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
      </span>
    </>
  );
}

/**
 * Built with AI: three side projects, one wide row each. The words sit beside the scene and the
 * sides alternate; on desktop the words hold in place while their scene scrolls past.
 */
export function AiProjects() {
  return (
    <section id="ai" className="px-4 pb-32 pt-28 sm:px-10 md:pt-40">
      <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
        <div>
          <p data-label className="label mb-6">[ 04 — Built with AI ]</p>
          <h2 data-split="lines" className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-[6vw]">
            From idea to working app
          </h2>
        </div>
        <p data-fade className="hidden max-w-xs pb-3 text-muted md:block">
          Side projects I designed and built end to end with Claude.
        </p>
      </div>
      <div className="flex flex-col gap-24 md:gap-40">
        {PROJECTS.map((p, i) => (
          <a key={p.title} href={p.href} target="_blank" rel="noreferrer" data-cursor="Open" onPointerMove={pointer} onPointerLeave={rest} className="group grid gap-10 md:grid-cols-12 md:gap-6">
            {/* the column is as tall as the scene, so the words have room to stay pinned inside it */}
            <div className={`md:col-span-4 ${i % 2 ? "md:order-2 md:col-start-9" : ""}`}>
              <div data-pin>
                <Words p={p} index={`0${i + 1}`} />
              </div>
            </div>
            <div className={`md:col-span-7 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-6"}`}>
              <Media p={p} aspect="aspect-[4/3]" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
