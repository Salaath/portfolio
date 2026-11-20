import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { getCase } from "@/content/cases";
import { ReadBar } from "@/components/fable/Bits";
import { ChapterDock, StatHero } from "@/components/fable/Case";
import { ChapterHead } from "@/components/fable/Kit";
import { NextCase } from "@/components/fable/Sections";
import { LoopVideo } from "@/components/ao/FlowVideo";
import { ThemeStack, type Theme } from "@/components/previous/ThemeStack";

// Before Upstox in the Fable template: same projects, figures and media as /work/previous-work.
// Work from Tata CLiQ, before Upstox, gathered into one page. Facts and
// mock-ups come from the old Framer portfolio (salaath.framer.website/work).
// This page is a showcase: mock-ups first, a few lines and one or two numbers
// per project.

const DESCRIPTION =
  "Four products I designed at Tata CLiQ before Upstox: the Palette beauty homepage, the Luxe editorial hub, marketplace filters and the seller portal.";

export const metadata: Metadata = {
  title: "Before Upstox — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Before Upstox: four products at Tata CLiQ", description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image", title: "Before Upstox: four products at Tata CLiQ", description: DESCRIPTION },
};

const IMG = "/work/previous";

const RANGE = ["Beauty", "Luxury", "Marketplace", "Seller tools", "iOS", "Android", "Web", "Desktop"];

// Screen recordings from the old site, cropped to the device. Their
// background is #FCFCFC, so the frames around them use the same colour.
const THEMES: Theme[] = [
  { src: "vid-palette-home", name: "Homepage", vision: "Discovery and inspiration in balance", look: "Playful, with soft colour and strong imagery", bg: "#F6ECE8", accent: "#E7A3B8" },
  { src: "vid-palette-skincare", name: "Skincare", vision: "Show expertise and teach routines", look: "Fresh, soft colours, real skin, ingredients up front", bg: "#E9EEF0", accent: "#A9C6D6" },
  { src: "vid-palette-mens", name: "Men’s care", vision: "Shop by concern, get to the product fast", look: "Relatable imagery and fresh colours", bg: "#ECE5DA", accent: "#D6B98C" },
  { src: "vid-palette-luxe", name: "Luxe beauty", vision: "Bold and aspirational", look: "Whitespace, subtle colour, brands shown at their best", bg: "#15100F", accent: "#8E2E3C", dark: true },
];

// Palette homepage revamp: facts, figures and pictures from the old case study
// (salaath.framer.website/work/palette-homepage-revamp). Nothing here is new.
const PALETTE_FACTS: [string, string][] = [
  ["5.2 L", "People using Palette every month"],
  ["1,000+", "Beauty brands on the store"],
  ["4.6", "App Store rating, out of 5"],
  ["4.3", "Play Store rating, out of 5"],
];
const PALETTE_GAPS = [
  ["Brands had no good place to pay for", "The page had few formats a brand could sponsor, so brand deals were hard to sell."],
  ["It could not dress up for a sale", "Big events like Diwali needed a different page. The old one could barely change."],
  ["Thumbnails came in one size", "Quick links and carousels were locked to fixed sizes."],
  ["Parts could not be combined", "There was no way to join components into one large category or brand showcase."],
];
const STILLS = [
  { src: "palette-skincare", name: "Skincare", look: "Fresh, soft colours, real skin, ingredients up front" },
  { src: "palette-mens", name: "Men’s care", look: "Relatable imagery and fresh colours, built around the product" },
  { src: "palette-luxe", name: "Luxe beauty", look: "Whitespace, subtle colour, brands shown at their best" },
];

// Filters: quarterly figures from the outcomes slide of the old case study.
const QUARTERS = ["Q4 ’21", "Q1 ’22", "Q2 ’22", "Q3 ’22"];
const FILTER_TRENDS: { title: string; note: string; filter: number[]; none?: number[] }[] = [
  { title: "Filter use", note: "Share of shoppers who used a filter", filter: [19.5, 19.8, 21.7, 25.1] },
  { title: "Click-through", note: "Shoppers who filtered, against those who didn’t", filter: [77.7, 79.6, 80.7, 81.6], none: [62.1, 64.0, 65.5, 63.9] },
  { title: "Conversion", note: "Shoppers who filtered, against those who didn’t", filter: [5.5, 6.4, 6.1, 6.8], none: [3.5, 3.8, 3.5, 3.2] },
];
const FILTER_SCREENS = [
  { src: "filters-multi", w: 720, h: 1791, name: "Recommended filters", body: "A panel inside the listing suggests sizes, colours and materials. Pick several, then view the products." },
  { src: "filters-visual", w: 720, h: 3147, name: "Visual filters", body: "Categories and brands appear as picture tiles between the products, so narrowing down takes one tap." },
];

/** One quarterly trend as a small line chart: the filter cohort in colour, the rest in grey. */
function Trend({ title, note, filter, none }: (typeof FILTER_TRENDS)[number]) {
  const all = [...filter, ...(none ?? [])];
  const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.25 || 1;
  const X = (i: number) => 26 + i * 89.3;
  const Y = (v: number) => 132 - ((v - (lo - pad)) / (hi - lo + 2 * pad)) * 108;
  const line = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  return (
    <figure data-fade className="rounded-[1.25rem] bg-white p-6 md:p-7">
      <figcaption>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{title}</span>
        <p className="mt-3 flex items-baseline gap-3">
          <b className="text-5xl font-semibold leading-none tabular-nums tracking-[-0.05em] text-[#E0245E]">{filter[3]}%</b>
          <span className="text-sm text-muted">from {filter[0]}%</span>
        </p>
        <p className="mt-2 text-sm text-muted">{note}</p>
      </figcaption>
      <svg viewBox="0 0 320 172" className="mt-5 block w-full overflow-visible" role="img" aria-label={`${title} by quarter: ${filter.join("%, ")}%${none ? `; without filters: ${none.join("%, ")}%` : ""}`}>
        <line x1="26" x2="294" y1="146" y2="146" stroke="currentColor" strokeOpacity="0.15" />
        {none ? <path d={line(none)} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : null}
        <path d={line(filter)} fill="none" stroke="#E0245E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {filter.map((v, i) => (
          <g key={i}>
            <circle cx={X(i)} cy={Y(v)} r="3.5" fill="#E0245E" />
            <text x={X(i)} y={Y(v) - 10} textAnchor="middle" fontSize="11" fill="currentColor">{v}%</text>
            {none ? <text x={X(i)} y={Y(none[i]) + 18} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.5">{none[i]}%</text> : null}
            <text x={X(i)} y="164" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.5" fontFamily="ui-monospace, monospace">{QUARTERS[i]}</text>
          </g>
        ))}
      </svg>
      {none ? (
        <p className="mt-3 flex gap-5 text-xs text-muted">
          <span className="flex items-center gap-2"><i className="h-0.5 w-4 bg-[#E0245E]" />Used filters</span>
          <span className="flex items-center gap-2"><i className="h-0.5 w-4 bg-ink/30" />Did not</span>
        </p>
      ) : null}
    </figure>
  );
}

const LUXE_PHONES = [
  { src: "vid-luxe-app", label: "The Luxe Life tab in the app" },
  { src: "vid-luxe-story", label: "A shoppable short story" },
  { src: "vid-luxe-article-1", label: "A celebrity-style article" },
  { src: "vid-luxe-article-2", label: "A home décor article" },
];

/** A muted screen recording that plays while on screen, on the recording's own off-white. */
function Clip({ src, label, className = "", wipe, controls }: { src: string; label: string; className?: string; wipe?: boolean; controls?: boolean }) {
  const video = <LoopVideo src={`${IMG}/${src}.mp4`} poster={`${IMG}/${src}.jpg`} label={label} controls={controls} className="block h-full w-full object-contain" />;
  return (
    <div {...(wipe ? { "data-wipe": "" } : { "data-fade": "" })} className={`overflow-hidden rounded-[1.25rem] bg-[#FCFCFC] ${className}`}>
      {wipe ? <div data-wipe-inner className="h-full w-full">{video}</div> : video}
    </div>
  );
}

function Shot({ src, alt, w, h, className = "", wipe }: { src: string; alt: string; w: number; h: number; className?: string; wipe?: boolean }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-wipe-inner={wipe ? "" : undefined}
      src={`${IMG}/hd/${src}.webp`}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
      className="block h-full w-full object-cover"
    />
  );
  return wipe ? (
    <div data-wipe className={`overflow-hidden rounded-[1.25rem] ${className}`}>{img}</div>
  ) : (
    <div data-fade className={`overflow-hidden rounded-[1.25rem] ${className}`}>{img}</div>
  );
}

function Head({
  n,
  id,
  client,
  title,
  meta,
  dark,
  children,
}: {
  n: string;
  id: string;
  client: string;
  title: React.ReactNode;
  meta: [string, string][];
  dark?: boolean;
  children: React.ReactNode;
}) {
  const muted = dark ? "text-white/60" : "text-muted";
  return (
    <div id={id} data-chapter={n} data-chapter-label={client.replace("Tata CLiQ ", "")} className="scroll-mt-24">
      <ChapterHead n={n} label={client} title={title}>{children}</ChapterHead>
      <dl data-fade className={`mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-5 sm:grid-cols-3 md:ml-[25%] md:w-[62%] ${dark ? "border-white/20" : "border-ink/15"}`}>
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className={`font-mono text-[11px] uppercase tracking-[0.12em] ${muted}`}>{k}</dt>
            <dd className="mt-1 text-[15px] font-medium leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Stat({ value, label, color, dark }: { value: string; label: string; color?: string; dark?: boolean }) {
  return (
    <div data-fade className={`border-t pt-4 ${dark ? "border-white/20" : "border-line"}`}>
      <b data-count className="block text-5xl font-semibold leading-none tabular-nums tracking-[-0.06em] md:text-[4.6vw]" style={color ? { color } : undefined}>
        {value}
      </b>
      <span className={`mt-3 block max-w-[16rem] text-sm ${dark ? "text-white/60" : "text-muted"}`}>{label}</span>
    </div>
  );
}

/** A stat in a solid bento tile: label at the top, number at the bottom. */
function Tile({ label, value, note, valueColor, dark, className = "" }: { label: string; value: string; note?: string; valueColor?: string; dark?: boolean; className?: string }) {
  const muted = dark ? "text-white/60" : "text-muted";
  return (
    <div data-fade className={`flex min-h-[15rem] flex-col justify-between rounded-[1.25rem] p-6 md:p-8 ${className}`}>
      <span className={`font-mono text-[11px] uppercase tracking-[0.12em] ${muted}`}>{label}</span>
      <div>
        <b data-count className="block text-6xl font-semibold leading-none tracking-[-0.06em] md:text-[5.5rem]" style={valueColor ? { color: valueColor } : undefined}>
          {value}
        </b>
        {note ? <p className={`mt-4 max-w-xs text-sm leading-relaxed ${muted}`}>{note}</p> : null}
      </div>
    </div>
  );
}

export default function PreviousWork() {
  return (
    <Choreo className="paper">
      <ReadBar />
      <ChapterDock />
      {/* ---------- hero ---------- */}
      <StatHero
        className="mx-auto max-w-7xl"
        eyebrow="Before Upstox · Tata CLiQ"
        title="Beauty, luxury and a marketplace"
        intro="Before Upstox I designed for the Tata CLiQ family of shopping apps. These are four of the projects I’m proudest of, from a beauty homepage that changes with the season to the portal sellers use to get listed."
        accent="#B8325E"
        stats={[
          { value: "+11.5%", label: "Homepage orders · Palette" },
          { value: "+6.5%", label: "Conversion · Luxe editorial" },
          { value: "+29%", label: "Filter use · Marketplace" },
          { value: "−60%", label: "Seller onboarding time" },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-10">
        <ul data-fade className="flex flex-wrap gap-2">
          {RANGE.map((r) => (
            <li key={r} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Shot wipe src="palette-grid" alt="A grid of Tata CLiQ Palette app screens" w={1792} h={1120} className="aspect-[16/9] !rounded-[2rem]" />
        </div>
      </section>

      {/* ---------- 01 palette ---------- */}
      <section className="mt-28 rounded-t-[2rem] bg-[#F6ECE8] px-4 pt-28 sm:px-10 md:rounded-t-[3rem] md:pt-36">
        <div className="mx-auto max-w-7xl">
          <Head
            n="01"
            id="palette"
            client="Tata CLiQ Palette"
            title="A homepage that can dress up for every sale"
            meta={[
              ["Timeline", "4 weeks"],
              ["Role", "UI/UX, creative direction"],
              ["Platform", "iOS, Android, m-site"],
              ["Client", "Tata CLiQ Palette"],
              ["Shipped", "15 components, on every platform"],
              ["Presented to", "CEO and Business Head"],
            ]}
          >
            Palette had just gone from content-led social commerce to a full beauty store and the homepage couldn’t keep up with brand deals or big sale events. I designed 15 modular components that let the team re-theme the whole page for any season.
          </Head>
          {/* the store in four numbers */}
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {PALETTE_FACTS.map(([v, l], i) => (
              <div key={l} data-fade data-delay={i * 0.06} className="border-t border-ink/20 pt-4">
                <b data-count className="block text-5xl font-semibold leading-none tabular-nums tracking-[-0.05em] md:text-[4.2vw]">{v}</b>
                <span className="mt-3 block max-w-[14rem] text-sm text-muted">{l}</span>
              </div>
            ))}
          </div>

          {/* before: the homepage we started with */}
          <div className="mt-28 grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <div data-pin>
                <p data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted">[ Before ]</p>
                <h3 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">A social feed, asked to do a store’s job</h3>
                <p data-fade className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                  Within four months of its national launch, Palette went from a content-led social app to a full beauty store. The homepage was still a feed of guides and posts.
                </p>
                <ol className="mt-8 border-t border-ink/20">
                  {PALETTE_GAPS.map(([h, b], i) => (
                    <li key={h} data-fade data-delay={i * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4">
                      <span className="pt-0.5 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-medium leading-snug">{h}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{b}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <figure className="relative md:col-span-7">
              <div className="flex items-start gap-3 rounded-[1.25rem] bg-[#EADCD6] px-4 pb-10 pt-16 sm:gap-5 sm:px-8 md:px-10 md:pb-16 md:pt-20">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`w-1/3 ${n === 1 ? "mt-10 md:mt-20" : n === 3 ? "mt-24 md:mt-44" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-parallax={n === 2 ? "0.04" : n === 1 ? "-0.05" : "-0.1"} src={`${IMG}/hd/palette-before-${n}.webp`} alt="The Palette homepage before the revamp" loading="lazy" className="block w-full" />
                  </div>
                ))}
              </div>
              <figcaption className="absolute left-5 top-5 rounded-md bg-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white">Before · Existing homepage</figcaption>
            </figure>
          </div>

          <div className="mt-28 grid gap-6 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
            <span data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted md:col-span-3">After</span>
            <h3 data-split="lines" className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:col-span-6 md:text-5xl">A homepage built from 15 parts that can change shape</h3>
            <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-3 md:pt-2">
              Soft backgrounds, a light glass effect and strong imagery, with room for GIFs and video.
            </p>
          </div>
          {/* bento: two mock-ups on solid tiles, stats as tiles beside them */}
          <div className="mt-10 grid gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
            <figure data-wipe className="relative overflow-hidden rounded-[1.25rem] bg-[#B8325E] md:col-span-7 md:row-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-wipe-inner src={`${IMG}/hd/palette-tile-glossier.webp`} alt="Palette homepage with a Glossier banner and a Lancôme carousel" width={1600} height={1720} loading="lazy" className="block h-full w-full object-cover" />
              <figcaption className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white backdrop-blur">Sale theme · Homepage</figcaption>
            </figure>
            <Tile className="bg-white md:col-span-5" label="Homepage orders, first 30 days" value="+11.5%" valueColor="#B8325E" />
            <Tile className="bg-[#1E0A16] text-white md:col-span-5" dark label="New components, each with variants" value="15" note="Banners, carousels, brand rails, category grids and more, all themeable." />
            <figure data-wipe className="relative overflow-hidden rounded-[1.25rem] bg-[#F2DCD1] md:order-last md:col-span-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-wipe-inner src={`${IMG}/hd/palette-tile-tray.webp`} alt="Palette screens with glass-effect banners" width={2000} height={1240} loading="lazy" className="block h-full w-full object-cover object-bottom" />
              <figcaption className="absolute left-5 top-5 rounded-full bg-ink/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">Glass banners · Skincare</figcaption>
            </figure>
            <div data-fade className="flex min-h-[15rem] flex-col justify-between rounded-[1.25rem] bg-[#EAD6CC] p-6 md:col-span-5 md:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Launch timing</span>
              <div>
                <p className="text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl">Live right before Diwali, Black Friday and wedding season</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Shipping ahead of the peak sale season helped the team reach its annual sales target.</p>
              </div>
            </div>
          </div>

          <div className="mt-28 grid gap-6 border-t border-ink pt-5 pb-16 md:grid-cols-12 md:gap-8">
            <span data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted md:col-span-3">Same components, four looks</span>
            <h3 data-split="lines" className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:col-span-6 md:text-5xl">
              One set of parts, a different store each time
            </h3>
            <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-3 md:pt-2">
              Each category got its own vision and visual theme, built from the same 15 components.
            </p>
          </div>
        </div>
      </section>
      <ThemeStack themes={THEMES} base={IMG} />

      {/* the themes as stills: the mock-ups sit on their own blush, so the section matches it */}
      <section className="overflow-hidden bg-[#F5EDE9] pb-28 pt-24 md:pt-32">
        <p aria-hidden data-slide="-30" className="whitespace-nowrap pl-4 text-[17vw] font-semibold leading-[0.85] tracking-[-0.06em] text-ink/[0.07] sm:pl-10">
          Skincare — Men’s care — Luxe beauty —
        </p>
        <div className="mx-auto -mt-[6vw] flex max-w-7xl flex-col gap-10 px-4 sm:px-10 md:gap-0">
          {STILLS.map((m, i) => (
            <figure key={m.src} className={`grid items-end gap-4 md:grid-cols-12 md:gap-8 ${i ? "md:mt-10" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-fade src={`${IMG}/hd/${m.src}.webp`} alt={`Three Palette ${m.name} screens`} width={3000} height={1875} loading="lazy" className={`block w-full ${i === 2 ? "md:col-span-10 md:col-start-2" : i === 1 ? "md:order-2 md:col-span-8 md:col-start-5" : "md:col-span-8"}`} />
              <figcaption data-fade className={`pb-6 md:pb-24 ${i === 2 ? "md:col-span-6 md:col-start-4 md:pb-0 md:text-center" : i === 1 ? "md:order-1 md:col-span-4 md:row-start-1" : "md:col-span-4"}`}>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{String(i + 2).padStart(2, "0")} / 04</span>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{m.name}</p>
                <p className={`mt-2 max-w-xs text-[15px] leading-relaxed text-muted ${i === 2 ? "md:mx-auto" : ""}`}>{m.look}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- 02 luxe ---------- */}
      <section className="bg-[#0e0d0b] px-4 py-28 text-white sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Head
            n="02"
            id="luxe"
            client="Tata CLiQ Luxury"
            title="Slow commerce: a magazine you can shop from"
            dark
            meta={[
              ["Timeline", "8 weeks, design and build"],
              ["Role", "UI/UX, creative direction"],
              ["Platform", "iOS, Android, m-site, desktop"],
            ]}
          >
            Luxury wanted a place for stories, videos and podcasts that still led to products. We added an Editorial tab to the main navigation, with long reads, shoppable looks and short stories.
          </Head>
          <div className="mt-16">
            <Clip wipe src="vid-luxe-web-home" label="The Luxe Life editorial home on desktop" className="aspect-[16/10]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
            {LUXE_PHONES.map((p) => (
              <figure key={p.src}>
                <Clip src={p.src} label={p.label} className="aspect-[23/42] p-2" />
                <figcaption className="mt-3 text-sm text-white/60">{p.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <Stat dark value="+6.5%" label="Product conversion after the tab launched" color="#D8B676" />
            <Stat dark value="+12%" label="Average time people spent in the app" />
            <Stat dark value="5 min" label="Average time on gifting stories, the most-clicked topic" />
          </div>
          <div className="mt-16">
            <Clip wipe src="vid-luxe-web-article" label="An editorial article on desktop, scrolling" className="aspect-[16/10]" />
          </div>
        </div>
      </section>

      {/* ---------- 03 filters ---------- */}
      <section className="px-4 pt-28 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <Head
            n="03"
            id="filters"
            client="Tata CLiQ Marketplace"
            title="Filters people actually use"
            meta={[
              ["Timeline", "12 weeks"],
              ["Role", "Research, UI/UX, usability testing"],
              ["Surface", "Product listing pages"],
            ]}
          >
            Filters on our listing pages were hard to find and slow to use. After research and testing, we rebuilt the panel with multi-select and smarter filters right on the listing page.
          </Head>
          <div className="mt-16 grid items-center gap-10 md:grid-cols-12">
            <Shot wipe src="filters-phones" alt="Three phones showing the new filters on product listings" w={1600} h={1200} className="aspect-[4/3] bg-[#F1F1F3] md:col-span-7" />
            <div className="grid gap-8 md:col-span-5">
              <Stat value="+29%" label="Growth in filter use, from 19.5% to 25.1% of shoppers (Q4 ’21 → Q3 ’22)" color="#E0245E" />
              <Stat value="+5%" label="Click-through on filtered results, from 77.7% to 81.6%" />
              <Stat value="6.8%" label="Conversion for shoppers who filter, up from 5.5%. Shoppers who didn’t filter converted at 3.2%" />
            </div>
          </div>

          {/* the final design: filters inside the listing itself */}
          <div className="mt-28 grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <div data-pin>
                <p data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted">[ Final design ]</p>
                <h3 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">Filters that come to you as you scroll</h3>
                <dl className="mt-8 border-t border-ink/20">
                  {FILTER_SCREENS.map((f, i) => (
                    <div key={f.src} data-fade data-delay={i * 0.06} className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-ink/20 py-4">
                      <span className="pt-0.5 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <dt className="font-medium leading-snug">{f.name}</dt>
                        <dd className="mt-1 text-sm leading-relaxed text-muted">{f.body}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[1.25rem] bg-[#F1F1F3] px-5 py-10 sm:gap-8 sm:px-10 md:col-span-8 md:px-16 md:py-16">
              {FILTER_SCREENS.map((f, i) => (
                <figure key={f.src} className={`w-1/2 ${i ? "" : "mt-16 md:mt-32"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-parallax={i ? "0.03" : "-0.06"} src={`${IMG}/hd/${f.src}.webp`} alt={`${f.name} on a product listing`} width={f.w} height={f.h} loading="lazy" className="block w-full rounded-[1.1rem] shadow-[0_30px_60px_-30px_rgba(20,20,40,0.35)] md:rounded-[1.6rem]" />
                </figure>
              ))}
            </div>
          </div>

          {/* four quarters of data */}
          <div className="mt-24 grid gap-6 border-t border-ink pt-5 md:grid-cols-12 md:gap-8">
            <span data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted md:col-span-3">Four quarters on</span>
            <h3 data-split="lines" className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:col-span-6 md:text-5xl">More people filtered and those who did bought more</h3>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FILTER_TRENDS.map((t) => <Trend key={t.title} {...t} />)}
          </div>
        </div>
      </section>

      {/* ---------- 04 seller portal ---------- */}
      <section className="mx-2 mt-28 rounded-[2rem] bg-[#EEF0F5] px-4 py-28 sm:px-8 md:mx-4 md:rounded-[3rem] md:py-36">
        <div className="mx-auto max-w-7xl">
          <Head
            n="04"
            id="seller"
            client="Tata CLiQ Seller Portal"
            title="From weeks of email to onboarding online"
            meta={[
              ["Timeline", "3 months"],
              ["Role", "Research, UI/UX, usability testing"],
              ["Platform", "Desktop"],
            ]}
          >
            Getting a new seller live took weeks of calls and email between sellers, account managers, finance and legal. Seller Portal 2.0 put sign-up, approvals and product listing in one place, with steps running side by side.
          </Head>
          <div className="mt-16">
            <Shot wipe src="seller-hero" alt="Seller Portal 2.0 dashboard and sign-up" w={2000} h={1500} className="aspect-[16/10]" />
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <Stat value="−60%" label="Time it takes to onboard a seller" color="#D3263F" />
            <Stat value="25–30" label="Days it used to take a seller to reach their first listing" />
            <Stat value="4" label="Flows redesigned: sign-up, onboarding, back-office approval, listing" />
          </div>
          <div className="mt-16">
            <Clip wipe controls src="vid-seller-signup" label="A new seller signing up on Seller Portal 2.0" className="aspect-[2878/1794] !bg-black" />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Shot src="seller-listing" alt="Product listing screens" w={2000} h={1500} className="aspect-[4/3]" />
            <Shot src="seller-sites" alt="Site performance dashboard" w={2000} h={1500} className="aspect-[4/3]" />
            <Shot src="seller-backoffice" alt="Back-office approval screens" w={2000} h={1500} className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <NextCase c={getCase("account-opening")!} href="/work/account-opening" label="Back to Upstox" foot="Before Upstox · Tata CLiQ" focus="78%" />
    </Choreo>
  );
}
