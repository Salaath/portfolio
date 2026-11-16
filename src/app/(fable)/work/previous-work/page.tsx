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
// per project. The full process lives on the old site.

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

const LUXE_PHONES = [
  { src: "vid-luxe-app", label: "The Luxe Life tab in the app" },
  { src: "vid-luxe-story", label: "A shoppable short story" },
  { src: "vid-luxe-article-1", label: "A celebrity-style article" },
  { src: "vid-luxe-article-2", label: "A home décor article" },
];

/** A muted screen recording that plays while on screen, on the recording's own off-white. */
function Clip({ src, label, className = "", wipe }: { src: string; label: string; className?: string; wipe?: boolean }) {
  const video = <LoopVideo src={`${IMG}/${src}.mp4`} poster={`${IMG}/${src}.jpg`} label={label} className="block h-full w-full object-contain" />;
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
            ]}
          >
            Palette had just gone from content-led social commerce to a full beauty store, and the homepage couldn’t keep up with brand deals or big sale events. I designed 15 modular components that let the team re-theme the whole page for any season.
          </Head>
          {/* bento: two mock-ups on solid tiles, stats as tiles beside them */}
          <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
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
            <Tile className="bg-[#EAD6CC] md:col-span-5" label="People using Palette every month" value="5.2 L" note="Across iOS, Android and the mobile site." />
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
            </div>
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
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <Shot src="seller-listing" alt="Product listing screens" w={2000} h={1500} className="aspect-[4/3]" />
            <Shot src="seller-sites" alt="Site performance dashboard" w={2000} h={1500} className="aspect-[4/3]" />
            <Shot src="seller-backoffice" alt="Back-office approval screens" w={2000} h={1500} className="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-10">
        <a data-fade href="https://salaath.framer.website/work" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-lg underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
          The full process for these projects is on my old site <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
        </a>
      </section>
      <NextCase c={getCase("account-opening")!} href="/work/account-opening" label="Back to Upstox" foot="Before Upstox · Tata CLiQ" focus="78%" />
    </Choreo>
  );
}
