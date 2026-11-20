"use client";

// A 3×3×3 cube of city pictures for the Outside work section. Left alone it
// tumbles while its layers turn, one after another; drag it to look around.
// Built from plain elements with CSS 3D transforms, so every square is an
// ordinary image and swapping the pictures needs no 3D tooling.
import { useEffect, useRef } from "react";
import { serif } from "./serif";

// One picture per square, used in this order and repeated to fill all 54
// squares. Placeholders for now, from Wikimedia Commons (see CREDITS.md beside
// the files): replace them in public/about/cities with Sal's own photos and
// list the new file names here.
const IMAGES = [
  "amsterdam-2",
  "barcelona-1",
  "berlin-1",
  "colombo-1",
  "madrid-2",
  "paris-1",
  "prague-3",
  "salzburg-2",
  "vienna-1",
  "zurich-1",
  "barcelona-2",
  "berlin-4",
  "colombo-2",
  "madrid-4",
  "paris-4",
  "prague-4",
  "salzburg-3",
  "vienna-2",
  "zurich-3",
  "barcelona-5",
  "berlin-5",
  "colombo-4",
  "prague-6",
  "salzburg-4",
  "vienna-5",
  "zurich-5",
  "berlin-6",
  "colombo-5",
  "salzburg-5",
  "salzburg-6",
].map((n) => `/about/cities/${n}.jpg`);

type V3 = [number, number, number];
type M3 = [V3, V3, V3];

const I3 = (): M3 => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const mul = (a: M3, b: M3): M3 =>
  a.map((r) => [0, 1, 2].map((c) => r[0] * b[0][c] + r[1] * b[1][c] + r[2] * b[2][c])) as M3;
const apply = (m: M3, v: V3): V3 => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]) as V3;
/** Rotation about a main axis (0 x, 1 y, 2 z), the way CSS rotateX/Y/Z turn. */
const rot = (axis: number, a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a);
  if (axis === 0) return [[1, 0, 0], [0, c, -s], [0, s, c]];
  if (axis === 1) return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
};
/** Rotation about any unit axis. */
const rotAbout = ([x, y, z]: V3, a: number): M3 => {
  const c = Math.cos(a), s = Math.sin(a), t = 1 - c;
  return [
    [t * x * x + c, t * x * y - s * z, t * x * z + s * y],
    [t * x * y + s * z, t * y * y + c, t * y * z - s * x],
    [t * x * z - s * y, t * y * z + s * x, t * z * z + c],
  ];
};
const css = (m: M3) =>
  `matrix3d(${m[0][0]},${m[1][0]},${m[2][0]},0,${m[0][1]},${m[1][1]},${m[2][1]},0,${m[0][2]},${m[1][2]},${m[2][2]},0,0,0,0,1)`;
const round = (m: M3): M3 => m.map((r) => r.map(Math.round)) as M3;
/** Pull a matrix that has drifted after many small turns back to a pure rotation. */
const tidy = (m: M3): M3 => {
  const n = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const x = n(m[0]);
  const d = x[0] * m[1][0] + x[1] * m[1][1] + x[2] * m[1][2];
  const y = n([m[1][0] - d * x[0], m[1][1] - d * x[1], m[1][2] - d * x[2]]);
  const z: V3 = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
  return [x, y, z];
};

// Sizes are in container units, so the cube scales with the box it is given.
const S = 18; // one small cube's edge, as a share of the box width
const FACES = [
  { dir: [1, 0, 0] as V3, t: "rotateY(90deg)" },
  { dir: [-1, 0, 0] as V3, t: "rotateY(-90deg)" },
  { dir: [0, 1, 0] as V3, t: "rotateX(-90deg)" },
  { dir: [0, -1, 0] as V3, t: "rotateX(90deg)" },
  { dir: [0, 0, 1] as V3, t: "" },
  { dir: [0, 0, -1] as V3, t: "rotateY(180deg)" },
];

// The cube is styled like the book beside it: paper-white, square-cornered,
// black-and-white pictures, with a few squares set in type instead.
const PAPER = "#f1efe9";
const INK = "#131313";
const NAMES = ["Barcelona", "Madrid", "Paris", "Prague", "Berlin", "Amsterdam", "Vienna", "Salzburg", "Zurich", "Colombo"];
// where the light comes from: above, a little left, in front
const LIGHT: V3 = [-0.33, -0.55, 0.77];

type Square = { img: string } | { name: string; no: number } | { no: number };

// The 27 small cubes with what each outward square carries: mostly pictures,
// with one city name and one number on every face of the solved cube.
const CUBIES = (() => {
  const out: { pos: V3; faces: (Square | null)[] }[] = [];
  let n = 0;
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const pos: V3 = [x, y, z];
        out.push({
          pos,
          faces: FACES.map((f) => {
            if (!f.dir.some((d, i) => d !== 0 && d === pos[i])) return null;
            const k = n++;
            if (k % 9 === 4) return { name: NAMES[Math.floor(k / 5) % NAMES.length], no: Math.floor(k / 5) % NAMES.length + 1 };
            if (k % 9 === 7) return { no: Math.floor(k / 9) + 1 };
            return { img: IMAGES[k % IMAGES.length] };
          }),
        });
      }
  return out;
})();

const START = mul(rot(0, -0.5), rot(1, -0.65));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function CityCube({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = box.current!, el = cube.current!;
    const els = [...el.children] as HTMLElement[];
    // the darkening layer over each outward square, by small cube and by side
    const shades = els.map((c) => FACES.map((_, k) => c.querySelector<HTMLElement>(`[data-shade="${k}"]`)));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = CUBIES.map((c) => ({ pos: [...c.pos] as V3, o: I3() }));
    const place = (i: number, pre = "") => {
      const { pos, o } = state[i];
      els[i].style.transform = `${pre}translate3d(${pos[0] * S}cqw,${pos[1] * S}cqw,${pos[2] * S}cqw) ${css(o)}`;
    };
    state.forEach((_, i) => place(i));

    let g = START; // the whole cube's orientation
    let dragging = false, lx = 0, ly = 0, vx = 0, vy = 0;
    let auto = still ? 0 : 1; // how much of the idle tumble is mixed in, 0 to 1
    let visible = false, raf = 0, last = 0, clock = 0, turns = 0;
    // the layer turn in progress: axis, layer, direction, progress and the pause before the next one
    let twist: { axis: number; layer: number; dir: number; t: number; ids: number[] } | null = null;
    let rest = 0.6, prev = "";

    const startTwist = () => {
      let axis = 0, layer = 0, dir = 1;
      do {
        axis = Math.floor(Math.random() * 3);
        layer = Math.floor(Math.random() * 3) - 1;
        dir = Math.random() < 0.5 ? 1 : -1;
      } while (`${axis}${layer}` === prev); // never straight back on the same layer
      prev = `${axis}${layer}`;
      twist = { axis, layer, dir, t: 0, ids: state.flatMap((s, i) => (s.pos[axis] === layer ? [i] : [])) };
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      clock += dt;

      // the whole cube: thrown by the last drag, then easing back into its own tumble
      if (!dragging) {
        if (Math.abs(vx) + Math.abs(vy) > 0.0002) {
          g = mul(mul(rot(1, vx), rot(0, -vy)), g);
          vx *= 0.94; vy *= 0.94;
        }
        if (!still) auto = Math.min(1, auto + dt * 0.5);
        if (auto > 0) {
          const ax: V3 = [Math.sin(clock * 0.31) * 0.7, 1, Math.cos(clock * 0.23) * 0.5];
          const l = Math.hypot(...ax);
          g = mul(rotAbout([ax[0] / l, ax[1] / l, ax[2] / l], 0.55 * dt * auto * auto), g);
        }
      }
      if (++turns % 240 === 0) g = tidy(g);
      el.style.transform = css(g);
      const lit = () => {
        // each square is darker the further it faces from the light
        const turning = twist && twist.t < 1 ? rot(twist.axis, (ease(twist.t) * Math.PI / 2) * twist.dir) : null;
        state.forEach((c, i) => {
          let m = c.o;
          if (turning && twist!.ids.includes(i)) m = mul(turning, m);
          m = mul(g, m);
          shades[i].forEach((sh, k) => {
            if (!sh) return;
            const nrm = apply(m, FACES[k].dir);
            const d = nrm[0] * LIGHT[0] + nrm[1] * LIGHT[1] + nrm[2] * LIGHT[2];
            sh.style.opacity = Math.max(0, Math.min(0.6, 0.2 * (1 - d) * (1 - d) + 0.02)).toFixed(3);
          });
        });
      };

      // one layer at a time turns a quarter
      if (!still) {
        if (twist) {
          twist.t = Math.min(1, twist.t + dt / 0.85);
          const a = ease(twist.t) * 90 * twist.dir;
          const v = [0, 0, 0]; v[twist.axis] = 1;
          if (twist.t < 1) twist.ids.forEach((i) => place(i, `rotate3d(${v.join(",")},${a.toFixed(2)}deg) `));
          else {
            const q = round(rot(twist.axis, (Math.PI / 2) * twist.dir));
            twist.ids.forEach((i) => {
              state[i].pos = apply(q, state[i].pos);
              state[i].o = mul(q, state[i].o);
              place(i);
            });
            twist = null;
            rest = 0.35;
          }
        } else if ((rest -= dt) <= 0) startTwist();
      }
      lit();
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    }, { rootMargin: "100px" });
    io.observe(root);
    document.addEventListener("visibilitychange", wake);

    const down = (e: PointerEvent) => {
      dragging = true; auto = 0; vx = vy = 0;
      lx = e.clientX; ly = e.clientY;
      root.setPointerCapture(e.pointerId);
      root.dataset.drag = "1";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const k = 2.6 / root.offsetWidth; // about a half turn across the box
      vx = (e.clientX - lx) * k; vy = (e.clientY - ly) * k;
      lx = e.clientX; ly = e.clientY;
      g = mul(mul(rot(1, vx), rot(0, -vy)), g);
    };
    const up = () => {
      dragging = false;
      delete root.dataset.drag;
    };
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerup", up);
    root.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div
      ref={box}
      role="img"
      aria-label="A cube of pictures from cities I have walked. Drag to turn it."
      data-cursor="Drag"
      className={`relative aspect-square cursor-grab touch-pan-y select-none [container-type:inline-size] data-[drag]:cursor-grabbing ${className}`}
    >
      <div className="absolute inset-0 grid place-items-center" style={{ perspective: "240cqw" }}>
        <div ref={cube} className="size-0 [transform-style:preserve-3d]" style={{ transform: css(START) }}>
          {CUBIES.map((c, i) => (
            <div
              key={i}
              className="absolute left-0 top-0 size-0 [transform-style:preserve-3d]"
              style={{ transform: `translate3d(${c.pos[0] * S}cqw,${c.pos[1] * S}cqw,${c.pos[2] * S}cqw)` }}
            >
              {FACES.map((f, k) => {
                const sq = c.faces[k];
                const dark = sq && !("img" in sq) && !("name" in sq);
                return (
                  <div
                    key={k}
                    className="absolute overflow-hidden [backface-visibility:hidden]"
                    style={{
                      width: `${S}cqw`,
                      height: `${S}cqw`,
                      left: `${-S / 2}cqw`,
                      top: `${-S / 2}cqw`,
                      // an inner side of a small cube is plain card, a shade darker
                      background: sq ? PAPER : "#cfccc4",
                      color: INK,
                      transform: `${f.t} translateZ(${S / 2 - 0.02}cqw)`,
                    }}
                  >
                    {sq && "img" in sq && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sq.img}
                        alt=""
                        draggable={false}
                        className="absolute object-cover"
                        style={{ inset: "0.55cqw", width: `${S - 1.1}cqw`, height: `${S - 1.1}cqw`, filter: "grayscale(1) contrast(1.08)" }}
                      />
                    )}
                    {sq && "name" in sq && (
                      <span className="absolute flex flex-col justify-between" style={{ inset: "0.55cqw", padding: "1cqw" }}>
                        <span className="flex justify-between font-mono uppercase" style={{ fontSize: "0.95cqw", letterSpacing: "0.12em" }}>
                          <span>No. {String(sq.no).padStart(2, "0")}</span>
                          <span>On foot</span>
                        </span>
                        <span>
                          <span className="block" style={{ height: "0.14cqw", background: INK, marginBottom: "0.9cqw" }} />
                          <span className={serif.className} style={{ display: "block", width: "128%", fontSize: `${sq.name.length > 8 ? 3.5 : 4.4}cqw`, lineHeight: 0.86, textTransform: "uppercase", letterSpacing: "-0.02em", transform: "scaleX(0.78)", transformOrigin: "left bottom" }}>
                            {sq.name}
                          </span>
                        </span>
                      </span>
                    )}
                    {dark && (
                      <span className="absolute flex items-end justify-between" style={{ inset: "0.55cqw", padding: "1cqw", background: INK, color: PAPER }}>
                        <span className={serif.className} style={{ fontSize: "9cqw", lineHeight: 0.8, fontStyle: "italic" }}>{sq.no}</span>
                        <span className="font-mono uppercase" style={{ fontSize: "0.95cqw", letterSpacing: "0.12em" }}>Cities</span>
                      </span>
                    )}
                    {sq && <span data-shade={k} className="absolute inset-0 bg-black" style={{ opacity: 0.1 }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
