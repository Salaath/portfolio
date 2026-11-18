// Muse, laid out as a small exhibition, in the site's own typeface: an entrance,
// a curator's note, then four rooms, one per motion, all on one paper ground
// with paintings from the same museums drifting past behind (see FloatingArt). Every clip is cut from
// Sal's own screen recording of the app and carries a wall label, the way a
// work in a museum does. Works, artists and years are the ones the app shows.
import Link from "next/link";
import { Choreo } from "@/components/Choreo";
import { FloatingArt } from "./FloatingArt";
import { Phone, type Clip } from "./Phone";

const V = "/work/ai/pages";
const DEMO = "https://muse-web-vert.vercel.app/";

// gallery wall, paper, ink and the gilt of a frame
const WALL = "#15130f";
const PAPER = "#f1ebdf";
const INK = "#1b1813";
const GILT = "#a8813c";
const DIM = "#8d8674"; // quiet text on the wall
const SOFT = "#6d6657"; // quiet text on paper

const CLIPS: Record<"hero" | "wall" | "zoom" | "board" | "visit", Clip> = {
  // four moments joined with hard cuts: the opening, the wall, the close-up and the polaroids
  hero: { src: `${V}/muse-hero.mp4`, label: "Muse in four moments: painting cards drifting in the opening, swiping along the gallery wall, opening Transfiguration full screen and dragging polaroids in Your visit" },
  wall: { src: `${V}/muse-wall.mp4`, label: "Swiping along the gallery wall past the Mona Lisa, Lady with an Ermine, Saint Jerome, Madonna of Humility and the Discobolus" },
  zoom: { src: `${V}/muse-zoom.mp4`, label: "Tapping Raphael’s Transfiguration, opening it full screen and zooming into the figures" },
  // recorded from the web demo on a Mac; the recording includes a phone outline, so only its screen is shown
  board: { src: `${V}/muse-board.mp4?v=2`, label: "The Seen in person board in its default grid, then cards dragged across it and dropped on top of each other", crop: [31 / 638, 45 / 1366, 576 / 638, 1248 / 1366] },
  visit: { src: `${V}/muse-visit.mp4`, label: "Opening Your visit at the Van Gogh Museum and dragging polaroid photos around the pile" },
};

// Eight of the works on the wall, with the year the app files each one under.
const WORKS: [string, string, string][] = [
  ["1440", "Madonna of Humility", "Fra Angelico"],
  ["1503", "Mona Lisa", "Leonardo da Vinci"],
  ["1508", "Sistine Chapel Ceiling", "Michelangelo"],
  ["1518", "Transfiguration", "Raphael"],
  ["1563", "The Wedding at Cana", "Paolo Veronese"],
  ["1602", "The Entombment of Christ", "Caravaggio"],
  ["1660", "The Milkmaid", "Johannes Vermeer"],
  ["1889", "Sunflowers", "Vincent van Gogh"],
];

const mono = "font-mono text-[11px] uppercase tracking-[0.18em]";

/** A museum wall label for a clip: title, what it is and one line about it. */
function Placard({ title, medium, children, dark = false }: { title: string; medium: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="max-w-[300px] border-l pl-5" style={{ borderColor: GILT }}>
      <p className="text-xl leading-tight tracking-[-0.02em]" style={{ color: dark ? PAPER : INK }}>{title}</p>
      <p className={`${mono} mt-2`} style={{ color: dark ? DIM : SOFT }}>{medium}</p>
      <p className="mt-3 text-[15px] leading-snug" style={{ color: dark ? "#c9c1af" : "#4a4539" }}>{children}</p>
    </div>
  );
}

/** The heading of a room: its numeral, its name and a line of introduction. `stack` is for a room that shares a row. */
function Room({ n, name, children, dark = false, stack = false }: { n: string; name: string; children: React.ReactNode; dark?: boolean; stack?: boolean }) {
  return (
    <header className={`grid gap-8 border-t pt-8 ${stack ? "md:gap-6" : "md:grid-cols-[auto_1fr_1fr] md:gap-16"}`} style={{ borderColor: dark ? "#3a352a" : "#d5cbb8" }}>
      <p data-fade className={mono} style={{ color: GILT }}>Room {n}</p>
      <h2 data-split="lines" className={`text-6xl leading-[0.9] tracking-[-0.045em] ${stack ? "md:text-[5.6vw]" : "md:text-[7vw]"}`} style={{ color: dark ? PAPER : INK }}>{name}</h2>
      <p data-fade data-delay="0.1" className={`max-w-md text-lg leading-snug ${stack ? "" : "self-end md:justify-self-end"}`} style={{ color: dark ? "#c9c1af" : "#4a4539" }}>{children}</p>
    </header>
  );
}

function Demo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href={DEMO}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      className="group inline-flex items-center gap-3 rounded-full border py-3 pl-6 pr-5 text-sm transition-colors duration-500"
      style={{ borderColor: dark ? "#5a5343" : "#b9ad95", color: dark ? PAPER : INK }}
    >
      Open the Muse web demo <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
    </a>
  );
}

export function MusePage() {
  return (
    <Choreo>
      <div className="relative" style={{ background: PAPER, color: INK }}>
        <FloatingArt />
        <div className="relative z-10">
        {/* entrance: the title, the app and its wall label, with the works drifting past behind */}
        <section className="relative px-5 pb-16 pt-28 md:min-h-svh md:px-10 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex items-baseline justify-between gap-6">
              <p data-fade className={mono} style={{ color: GILT }}>Built with AI · iOS app</p>
              <p data-fade className={`${mono} hidden md:block`} style={{ color: SOFT }}>A private museum journal</p>
            </div>
            <h1 data-split="chars" className="mt-6 text-center text-[30vw] leading-[0.8] tracking-[-0.06em] md:mt-2 md:text-[17vw]">
              Muse
            </h1>
            <div className="-mt-[8vw] grid items-end gap-12 md:-mt-[7vw] md:grid-cols-[1fr_auto_1fr]">
              <div data-fade className="order-2 md:order-1 md:pb-6">
                <p className="max-w-xs text-2xl leading-[1.15] tracking-[-0.02em]">The art I have seen in person, hung on a wall I can walk again.</p>
                <div className="mt-8">
                  <Demo />
                </div>
              </div>
              <div data-fade data-delay="0.1" className="order-1 mx-auto w-[min(280px,74vw,36svh)] md:order-2 md:w-[min(330px,24vw,34svh)]">
                <Phone clip={CLIPS.hero} edge="#4a4436" />
              </div>
              <div data-fade data-delay="0.2" className="order-3 md:justify-self-end md:pb-6">
                <Placard title="Muse" medium="iOS app, with a web demo">
                  Designed and built by Salaath Shaikh with Claude Code. A personal project.
                </Placard>
              </div>
            </div>
          </div>
        </section>

        {/* curator's note: held in the middle of the window while the paintings pass behind it */}
        <section className="relative h-[220svh]">
          <div className="sticky top-0 flex h-svh flex-col items-center justify-center px-5 text-center">
            <p data-label className={`${mono} mb-10`} style={{ color: GILT }}>Curator’s note</p>
            <p data-fade className="mx-auto max-w-4xl text-3xl leading-[1.1] tracking-[-0.03em] md:text-[3.4vw]">
              After a trip to Italy I wasn’t done with the art. An album on my phone turned into a museum of my own, where every painting keeps its frame, its year and the day I stood in front of it.
            </p>
          </div>
        </section>

        {/* room I: the wall, beside the works on it */}
        <section className="mx-auto max-w-[1100px] px-5 pb-32 md:px-10 md:pb-52">
          <Room n="I" name="The wall">Frames turn on a curved wall as you swipe. The title, the year and a timeline below change with whatever hangs in front of you.</Room>
          <div className="mt-20 grid items-center gap-16 md:mt-28 md:grid-cols-[auto_1fr] md:gap-24">
            <div data-fade className="mx-auto w-[min(290px,78vw,36svh)] md:w-[min(340px,26vw,34svh)]">
              <Phone clip={CLIPS.wall} edge="#4a4436" />
            </div>
            <div>
              <p data-fade className={mono} style={{ color: SOFT }}>On the wall · eight of twenty works</p>
              <ol className="mt-6 border-t" style={{ borderColor: "#d5cbb8" }}>
                {WORKS.map(([year, title, artist], i) => (
                  <li key={title} data-fade data-delay={(i * 0.04).toFixed(2)} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b py-3.5 md:grid-cols-[6rem_1fr_auto]" style={{ borderColor: "#d5cbb8" }}>
                    <span className="font-mono text-sm tabular-nums" style={{ color: GILT }}>{year}</span>
                    <span className="text-xl leading-tight tracking-[-0.02em] md:text-2xl">{title}</span>
                    <span className="col-start-2 text-sm md:col-start-3" style={{ color: SOFT }}>{artist}</span>
                  </li>
                ))}
              </ol>
              <p data-fade className="mt-5 text-sm" style={{ color: SOFT }}>A sculpture gets no frame. The Discobolus stands on the wall on its own.</p>
            </div>
          </div>
        </section>

        {/* room II: the close-up */}
        <section className="mx-auto max-w-[1100px] px-5 pb-32 md:px-10 md:pb-52">
          <Room n="II" name="The close-up">Tap a frame and the painting leaves it to fill the screen. Zoom in and you are standing among the figures.</Room>
          <div className="mt-20 grid items-end gap-14 md:mt-28 md:grid-cols-[1fr_auto_1fr]">
            <p data-fade className="hidden max-w-xs text-3xl leading-[1.1] tracking-[-0.03em] md:block">
              From across the room to the brushwork in one tap.
            </p>
            <div data-fade className="mx-auto w-[min(300px,80vw,36svh)] md:w-[min(380px,28vw,35svh)]">
              <Phone clip={CLIPS.zoom} edge="#4a4436" />
            </div>
            <div data-fade data-delay="0.1" className="md:justify-self-end">
              <Placard title="Transfiguration" medium="Raphael · 1518 · as filed in Muse">
                The frame, the caption and the timeline step back. Only the painting is left.
              </Placard>
            </div>
          </div>
        </section>

        {/* rooms III and IV: what I saw and the day I saw it */}
        <section className="mx-auto max-w-[1100px] px-5 pb-32 md:px-10 md:pb-52">
          <div className="grid gap-28 md:grid-cols-2 md:gap-16">
            <article>
              <Room stack n="III" name="The board">Works I have seen in person sit on a board like prints on a table. Pick one up and drop it wherever you like.</Room>
              <div data-fade className="mx-auto mt-16 w-[min(290px,78vw,36svh)] md:w-[min(330px,60%,33svh)]">
                <Phone clip={CLIPS.board} edge="#4a4436" />
              </div>
              <div data-fade className="mx-auto mt-10 w-[min(290px,78vw,36svh)] md:w-[min(330px,60%,33svh)]">
                <Placard title="Seen in person" medium="Memory board · web demo">
                  Each card tilts as it is lifted and settles on top of its neighbours.
                </Placard>
              </div>
            </article>
            <article className="md:mt-56">
              <Room stack n="IV" name="The visit">Each museum keeps the photos I took there as polaroids. Drag one and the pile shuffles around it.</Room>
              <div data-fade className="mx-auto mt-16 w-[min(290px,78vw,36svh)] md:w-[min(330px,60%,33svh)]">
                <Phone clip={CLIPS.visit} edge="#4a4436" />
              </div>
              <div data-fade className="mx-auto mt-10 w-[min(290px,78vw,36svh)] md:w-[min(330px,60%,33svh)]">
                <Placard title="Your visit" medium="Van Gogh Museum · 12 photos">
                  The day stays with the collection it belongs to.
                </Placard>
              </div>
            </article>
          </div>
        </section>

        {/* colophon and the way out */}
        <section className="relative px-5 pb-10 pt-24 md:px-10 md:pt-36" style={{ background: WALL, color: PAPER }}>
          <div className="mx-auto max-w-[1400px]">
            <p data-fade className={mono} style={{ color: GILT }}>Colophon</p>
            <div className="mt-8 grid gap-10 border-t pt-10 md:grid-cols-4" style={{ borderColor: "#3a352a" }}>
              {[
                ["Design and build", "Salaath Shaikh"],
                ["Built with", "Claude Code, SwiftUI"],
                ["Platform", "iOS, with a web demo"],
                ["Kind", "Personal project"],
              ].map(([k, v]) => (
                <div key={k} data-fade>
                  <p className={mono} style={{ color: DIM }}>{k}</p>
                  <p className="mt-3 text-xl leading-tight tracking-[-0.02em]">{v}</p>
                </div>
              ))}
            </div>
            <p data-fade className="mt-10 max-w-xl text-sm leading-snug" style={{ color: DIM }}>
              The paintings in the background are other works from the Rijksmuseum, the Van Gogh Museum, the Louvre and the Vatican Museums. Public-domain reproductions from Wikimedia Commons.
            </p>
            <div data-fade className="mt-10">
              <Demo dark />
            </div>
            <Link href="/work/chapters" data-cursor="Open" className="group mt-28 flex items-end justify-between gap-6 border-t pt-8 md:mt-40" style={{ borderColor: "#3a352a" }}>
              <span className={mono} style={{ color: DIM }}>Next project</span>
              <span className="flex items-center gap-4 text-6xl tracking-[-0.05em] md:text-[9vw]">
                Chapters <span aria-hidden className="text-[0.5em] transition-transform duration-500 group-hover:translate-x-3">→</span>
              </span>
            </Link>
          </div>
        </section>
        </div>
      </div>
    </Choreo>
  );
}
