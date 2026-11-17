import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { getCase } from "@/content/cases";
import { ReadBar } from "@/components/fable/Bits";
import { ChapterDock, StatHero } from "@/components/fable/Case";
import { ChapterHead } from "@/components/fable/Kit";
import { NextCase } from "@/components/fable/Sections";
import { AnalyzeHub } from "@/components/watchlist/AnalyzeHub";
import { AppReview } from "@/components/watchlist/AppReview";
import { AsksWeb } from "@/components/watchlist/AsksWeb";
import { BeforeAfter } from "@/components/watchlist/BeforeAfter";
import { R1Proto, ReleaseProto } from "@/components/watchlist/R1Proto";
import { ChartModeDemo } from "@/components/watchlist/ChartModeDemo";
import { ChartV2 } from "@/components/watchlist/ChartV2";
import { CostSim } from "@/components/watchlist/CostSim";
import { FabRule } from "@/components/watchlist/FabRule";
import { FindingTiles } from "@/components/watchlist/FindingTiles";
import { OldAnatomy } from "@/components/watchlist/OldAnatomy";
import { LiveSpark } from "@/components/watchlist/LiveSpark";
import { OptionSwitch, type Opt } from "@/components/watchlist/OptionSwitch";
import { ViewToggle } from "@/components/watchlist/ViewToggle";
import { Accent, Drift, Glow, HeroOrbit, Loop, Orbit } from "@/components/watchlist/HeroOrbit";
import { WlPhone } from "@/components/watchlist/WlPhone";
import { ScrollVideo } from "@/components/watchlist/ScrollVideo";

// The Watchlist case study in the Fable template: same story, figures and components as
// /work/watchlist-revised, with the template's hero, chapter heads and dock.
// A second, data-led telling of the watchlist case study, built from Sal's
// "Watchlist hero case study, revised data-led" brief (11 Nov 2026). The
// original story lives at /work/watchlist and is untouched. Numbers come from
// the impact sheet dated 11 November 2026; before = everything before the June
// 2026 release, after = the June 2026 release to 11 November 2026. The six
// before/after metrics are event counts, not unique users.

const DESCRIPTION =
  "A three-release redesign of the Upstox Watchlist, shaped by trader research and product data.";

export const metadata: Metadata = {
  title: "Watchlist redesign that drove 5.2× more orders — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Watchlist redesign that drove 5.2× more orders", description: DESCRIPTION, type: "article" },
};

const PURPLE = "#5B2EBD";
const GREEN = "#0E7A48";

function Chapter({ n, label, title, children }: { n: string; label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return <ChapterHead n={n} label={label} title={title}>{children}</ChapterHead>;
}

/** Opens the design which actually went live: no box, just a green rule underneath. */
function LiveRule({ release, meta }: { release: string; meta: string }) {
  return (
    <div data-fade data-live className="mt-20 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b pb-3" style={{ borderColor: GREEN }}>
      <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
        <p className="flex items-end gap-2.5 text-xl font-semibold leading-none tracking-[-0.035em] md:text-2xl" style={{ color: GREEN }}>
          <LiveSpark className="h-7 w-[50px] shrink-0 overflow-visible md:h-8 md:w-[57px]" />
          Went live
        </p>
        <span aria-hidden className="hidden h-5 w-px bg-line md:block" />
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink">{release}</p>
      </div>
      <p className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Live since</span>
        <span className="text-xl font-semibold tracking-[-0.03em] text-ink md:text-2xl">{meta}</span>
      </p>
    </div>
  );
}

// One row of a phone strip, straight on the page. Shadows need the bottom padding.
function PhoneRow({ items, cols }: { items: [string, string][]; cols: string }) {
  return (
    <div>
      <div className={`-mx-4 flex gap-5 overflow-x-auto px-4 pb-12 sm:mx-0 sm:px-0 lg:grid lg:gap-6 lg:overflow-visible ${cols}`}>
        {items.map(([src, cap]) => (
          <figure key={src} data-fade className="w-[11rem] shrink-0 lg:w-auto">
            <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"><WlPhone src={src} alt={cap} /></div>
            <figcaption className="mt-3 text-[13px] leading-snug text-muted">{cap}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// A strip of absolute numbers for features with no before baseline.
const HERO: [string, string, string, string][] = [
  ["+420.8%", "Orders from Watchlist rows", "2,34,492", "12,21,288"],
  ["+138%", "Watchlist tab opens", "11,89,390", "28,30,703"],
  ["+2,038.2%", "New lists created", "29,166", "6,23,631"],
];

const TEAM: [string, string][] = [
  ["Salaath", "Lead product designer"],
  ["Gitika", "Product designer"],
  ["Jayesh", "Product manager"],
];

const SNAPSHOT: [string, string | [string, string][]][] = [
  ["Team", TEAM],
  ["Releases", [["Release 1", "June 2026"], ["Release 2", "August 2026"], ["Release 3", "October 2026"]]],
  ["Status", "Three live, a fourth in build"],
];

const INPUTS = [
  ["1,19,080", "new customers followed from sign-up to first order", "Nov 2025 cohort"],
  ["43 vs 16", "stocks added per person by F&O traders vs everyone else", "Nov 2025"],
  ["Jan–Apr 2026", "four months of watchlist events on Android", "Mixpanel"],
  ["65", "trader sessions at our office, over six months", "Sessions"],
];

const ASKS = [
  { text: "Give me a list to start with, I don’t know what to add", topic: "Ready-made lists" },
  { text: "Let me jump between my lists without opening a menu", topic: "Switching lists" },
  { text: "I don’t know where to make a new list from", topic: "Creating lists" },
  { text: "Show OI and IV in the list, not three screens deep", topic: "More columns" },
  { text: "I want to see all my charts together before the market opens", topic: "Charts" },
  { text: "Put the option chain next to my lists", topic: "Option chain" },
];

// evidence → finding → so we…
const INSIGHTS: [string, string, string][] = [
  ["2.5% of new customers made a watchlist in their first 45 days and about half of first orders were under ₹500.", "People needed a faster start.", "Made creating and discovering lists easier."],
  ["Over a million people opened the watchlist every month, yet only 0.18% of new customers placed a first order from it. Search managed 3%.", "People returned to check and act.", "Brought more useful information and actions into the list."],
  ["Traders opened stock after stock to check one number: OI, a dividend, the day’s range.", "Different traders needed different information.", "Introduced configurable multicolumn layouts."],
  ["Checking the charts of a 20-stock list took around 60 taps, one stock at a time.", "Traders compared stocks one at a time.", "Let them scan many stocks at once in Charts view."],
  ["F&O traders and investors built and used lists differently. 23% of F&O traders’ adds came from the option chain.", "One watchlist had to support varied workflows.", "Kept organisation simple and made deeper analysis available on demand."],
];

// the number each finding leads with, taken from its evidence
const STATS = [
  { stat: "2.5%", statLabel: "of new customers made a watchlist in their first 45 days", rest: "About half of first orders were under ₹500." },
  { stat: "0.18%", statLabel: "of new customers placed a first order from the watchlist", rest: "Over a million people opened it every month. Search managed 3%." },
  { stat: "One", statLabel: "number per stock opened", rest: "Traders opened stock after stock to check OI, a dividend or the day’s range." },
  { stat: "~60", statLabel: "taps to check the charts of a 20-stock list", rest: "One stock at a time." },
  { stat: "23%", statLabel: "of F&O traders’ adds came from the option chain", rest: "F&O traders and investors built and used lists differently." },
];

const R1_METRICS: [string, string, string, string][] = [
  ["Watchlist tab opens", "11,89,390", "28,30,703", "+138.0%"],
  ["Added a stock", "33,64,006", "48,07,095", "+42.9%"],
  ["Created a new list", "29,166", "6,23,631", "+2,038.2%"],
  ["Switched between lists", "21,12,600", "43,08,756", "+104.0%"],
  ["Orders from Watchlist rows", "2,34,492", "12,21,288", "+420.8%"],
  ["Discovered a list and added it", "13,101", "11,05,782", "+8,340.4%"],
  ["Orders from the Options list", "—", "5,04,939", "New"],
];

const R1_FINAL: [string, string][] = [
  ["ex/r1-after", "Add list sits in the middle of the floating bar, with Sort and More on either side."],
  ["addlist", "Add list opens one page: make your own list or start from a ready-made one."],
  ["create", "Making a list asks for a name and nothing else."],
  ["ex/r1-sort", "Sort keeps its own button in the bar."],
  ["ex/r1-more", "More holds the rest: managing and editing lists and alerts."],
];

const MC_FINAL: [string, string][] = [
  ["ex/m5-home", "Table view sits above the list, next to the number of scrips."],
  ["ex/m5-table", "One list on its own page, with columns that scroll sideways."],
  ["ex/m5-style", "Pick a trading style and its columns tick themselves."],
  ["ex/m5-long", "Long-press any row for Buy and Sell."],
];

const AFTER_CALL: Opt[] = [
  {
    label: "Icon",
    verdict: "Not picked",
    shots: [
      { src: "ex/m41-1a", caption: "A column icon at the end of the chips." },
      { src: "ex/m41-1b", caption: "It opens the table as a page of its own." },
      { src: "ex/m41-1c", caption: "Manage columns starts from a trading style." },
    ],
    notes: ["Same icon as our first design, but it now leads to a separate page instead of changing My lists"],
  },
  {
    label: "Text link",
    verdict: "Closest to what shipped",
    picked: true,
    shots: [
      { src: "ex/m41-2a", caption: "“Multicolumn” spelled out at the end of the chips." },
      { src: "ex/m41-2b", caption: "Same table page." },
    ],
    notes: ["Spelled out in words instead of an icon", "This became the Table view link in the shipped version"],
  },
  {
    label: "Checkbox",
    verdict: "Not picked",
    shots: [
      { src: "ex/m41-3a", caption: "A Multi view checkbox after the chips." },
      { src: "ex/m41-3b", caption: "Ticked: the list turns into columns where it is." },
    ],
    notes: ["Columns still appear on My lists itself, the setup we had just moved away from"],
  },
];

const CHART_DECISIONS = [
  ["Shared controls", "Timeframe, chart type and indicators, set once for every card."],
  ["Readable at card size", "At most two overlays and one oscillator. No volume on index cards."],
  ["A route into the full chart", "Tap a card for that stock’s full chart, same settings."],
];

const V4: [string, string][] = [
  ["Hard to read key price levels quickly", "High and low markers on every chart card"],
  ["Charts need more room in the list", "Bigger charts in List view"],
  ["Range and candle interval are different decisions", "Separate range and interval controls"],
  ["Defaults should suit the selected range", "A default candle interval for each range"],
];

const LEARNINGS: [string, string][] = [
  ["Treat technical constraints as design input", "The table we first put inside My lists would have reloaded every column on every visit. Instead of pushing for it, we took engineering’s idea of a separate page and tried three ways to reach it from My lists."],
  ["Protect the screen and find an answer both sides can live with", "Designers own the experience. When a PM wanted a Chart icon of its own in the floating bar, every visit would have carried one more choice and every later feature would have asked for the same. One Analyze button for Table and Charts gave the feature a clear home and kept the bar calm."],
];

const SUMMARY: [string, string, string][] = [
  ["Engagement", "The Watchlist tab was opened more often", "+138% Watchlist tab opens"],
  ["Organisation", "More lists created and switched", "+2,038.2% lists, +104% switching"],
  ["Action", "More orders from within the Watchlist", "+420.8% row orders"],
  ["Discovery", "More people discovered and added a list", "+8,340.4% discovery adds"],
  ["Analysis", "Multicolumn and Charts views adopted", "36% open Table view, 24.69% use Charts daily"],
];

// A hairline circle centred on the left or right edge of the screen, so only
// half of it shows, curving into an empty part of the layout. `inset` is how far
// the positioned parent sits from that screen edge. Desktop only.
const SIX = "max(0px, 50vw - 40rem)"; // a max-w-7xl section
const SIX_IN = `${SIX} + 2.5rem`; // inside its sm:px-10 padding
const WIDE_IN = "max(0px, 50vw - 42.5rem) + 2.5rem"; // inside Release 2's centred column
function Edge({ side, inset, top, size, at, dur }: { side: "left" | "right"; inset: string; top: string; size: number; at?: number[]; dur?: number }) {
  return <Loop className="hidden xl:block" style={{ [side]: `calc(-1 * (${inset}) - ${size / 2}rem)`, top, width: `${size}rem`, height: `${size}rem` }} at={at} dur={dur} orb={3} />;
}

export default function WatchlistRevised() {
  return (
    <Choreo className="paper isolate overflow-x-clip">
      <ReadBar />
      <ChapterDock />
      {/* ---------- 01 data-led hero ---------- */}
      <StatHero
        className="mx-auto max-w-7xl"
        eyebrow="Upstox · Watchlist · Data as of 11 November 2026"
        title="Watchlist redesign that drove 5.2× more orders"
        intro="A three-release redesign of the Upstox Watchlist, shaped by trader research and product data."
        accent={PURPLE}
        stats={HERO.map(([value, label, from, to]) => ({ value, label, note: <>{from} <span className="text-ink">→ {to}</span></> }))}
        footnote="Mixpanel event counts, not unique users. Watchlist tab opens counts every time someone tapped the Watchlist tab. Before: everything before the June 2026 release. After: the June 2026 release to 11 November 2026."
      >
        <Glow v="a" opacity={0.3} className="left-1/2 top-1/2 size-[40rem] -translate-x-[45%] -translate-y-1/2" />
        <HeroOrbit className="left-1/2 top-1/2 -translate-x-[40%] -translate-y-1/2 scale-[0.78]" />
        <div className="relative"><BeforeAfter width={250} /></div>
      </StatHero>

      <section id="impact" className="mx-auto max-w-7xl px-4 pb-10 sm:px-10">
        <div>
          <div className="mt-6 grid gap-10 md:grid-cols-12">
            <p data-fade className="text-xl leading-relaxed md:col-span-7">
              After the June 2026 redesign, orders placed directly from Watchlist rows increased by 420.8%. New lists created grew from 29,166 to 6,23,631. I led the work from research through launch, rethinking how traders create and switch lists, discover what to track and analyse multiple stocks. We shipped the redesign in three releases between June and October 2026. A fourth iteration is now in development, based on feedback from traders using the new experience.
            </p>
            <dl data-fade className="grid grid-cols-2 content-start gap-x-6 gap-y-5 md:col-span-5">
              {SNAPSHOT.map(([k, v]) => (
                <div key={k} className={`border-t border-line pt-3 ${typeof v === "string" ? "col-span-2" : ""}`}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium leading-snug">
                    {typeof v === "string" ? v : (
                      <ul className="grid gap-2">
                        {v.map(([name, role]) => <li key={name}>{name}<span className="block text-[13px] font-normal text-muted">{role}</span></li>)}
                      </ul>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- 02 baseline ---------- */}
      <section id="baseline" data-chapter="02" data-chapter-label="Baseline" className="relative mx-2 mt-20 overflow-hidden rounded-[2rem] bg-[#0e0b12] px-4 py-28 text-white sm:px-8 md:mx-4 md:rounded-[3rem] md:py-36">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[22rem] rounded-full border border-white/10" />
        <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-[14rem] rounded-full border border-dashed border-white/15" />
        <Accent size={64} className="right-[9%] top-6 hidden md:block" />
        <Accent size={22} delay={-2} className="right-[17%] top-16 hidden md:block" />
        <div className="mx-auto max-w-7xl">
          <Chapter n="02" label="Baseline and opportunity" title="People could open the Watchlist. The hard part was getting things done.">
            The old Watchlist made common tasks harder to find than they needed to be. Switching lists and discovering ready-made lists sat inside a menu. The plus button opened stock search, even when people expected to create a list. Removing a stock depended on a long-press and checking more than a name and price meant opening stocks one by one. Tap the numbers on the old screen.
          </Chapter>
          <div className="mt-16">
            <OldAnatomy />
          </div>
        </div>
      </section>

      {/* ---------- 03 research ---------- */}
      <section id="research" data-chapter="03" data-chapter-label="Research" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Edge side="right" inset={SIX} top="-7rem" size={16} at={[0.3, 0.55]} />
        <Glow v="b" opacity={0.28} className="-left-48 top-40 size-[24rem] md:-left-72 md:size-[44rem]" />
        <Drift kind="orbit" className="-inset-x-24 top-0 h-48" />
        <Chapter n="03" label="Research and findings" title="The research pointed to five jobs the Watchlist wasn’t supporting well.">
          We looked at four months of Android Watchlist events, followed 1,19,080 new customers from sign-up to first order and spoke with 65 traders across six months of office sessions. The patterns were consistent: new customers needed help getting started, active traders needed faster ways to organise lists and different trading styles called for different levels of information.
        </Chapter>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Research inputs</p>
            <ul className="mt-4">
              {INPUTS.map(([v, l, s]) => (
                <li key={l} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-line py-3.5 last:border-b">
                  <b className="font-semibold tracking-[-0.02em]">{v}</b>
                  <span className="text-[14px] leading-snug">
                    {l}
                    <span className="mt-1 block font-mono text-[10.5px] text-muted">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div data-fade data-delay="0.08" className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">What traders kept asking for · paraphrased from sessions</p>
            <div className="mt-4">
              <AsksWeb asks={ASKS} />
            </div>
          </div>
        </div>

        {/* evidence → finding → so we… */}
        <div className="relative mt-20">
          <Edge side="left" inset={SIX_IN} top="-9rem" size={30} at={[0.2, 0.45]} />
          <Edge side="right" inset={SIX_IN} top="-5rem" size={24} at={[0.3, 0.6]} dur={60} />
          <FindingTiles items={INSIGHTS.map(([, finding, so], i) => ({ finding, so, stat: STATS[i].stat, statLabel: STATS[i].statLabel, evidence: STATS[i].rest }))} />
        </div>

        <div data-fade className="mt-16">
          <AppReview />
        </div>
      </section>

      {/* ---------- 04 release 1 ---------- */}
      <section id="r1" data-chapter="04" data-chapter-label="Release 1" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Glow v="c" opacity={0.3} delay={-4} className="-left-40 top-[34rem] size-[22rem] md:-left-56 md:size-[36rem]" />
        <Edge side="right" inset={SIX} top="-5rem" size={22} at={[0.3, 0.55]} />
        <Drift kind="scatter" className="-inset-x-24 top-0 h-48" />
        <ChapterHead n="04" label="Release 1 · June 2026" title="The first release made everyday Watchlist tasks easier to find.">
            We started with the tasks traders performed most often: adding stocks, creating and switching lists, discovering ready-made lists and placing orders. The redesign brought these actions closer to the list instead of hiding them behind menus or unclear gestures.
          </ChapterHead>

        <div className="relative mt-14 grid gap-10 md:grid-cols-12">
          <Edge side="left" inset={SIX_IN} top="16rem" size={25} at={[0.15, 0.4]} />
          <div data-fade className="md:col-span-4">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>The key decision</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Keep the main action in the floating bar</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Our first design put + New beside the chips. Every Upstox tab keeps its main action in the floating bar, so it moved there as Add list.
            </p>
          </div>
          <div data-fade className="md:col-span-8">
            <FabRule />
          </div>
        </div>
        <LiveRule release="Release 1 · What shipped" meta="June 2026" />
        <div className="mt-6">
          <PhoneRow items={R1_FINAL} cols="lg:grid-cols-5" />
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
          <div data-fade className="relative mx-auto">
            <Orbit flip className="left-1/2 top-[45%] -translate-x-[78%] -translate-y-1/2" />
            <div className="relative">
            <R1Proto width={270} /></div>
          </div>
          <div data-fade>
            <h3 className="mb-8 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-[2.75rem]">After launch in June 2026</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {([["+420.8%", "row orders"], ["20×", "lists created"], ["+138%", "Watchlist tab opens"]] as const).map(([v, l]) => (
                <div key={l} className="min-w-0 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-3 sm:p-5">
                  <b data-count className="block text-[1.4rem] font-semibold tabular-nums tracking-[-0.05em] sm:text-3xl md:text-5xl" style={{ color: PURPLE }}>{v}</b>
                  <span className="mt-2 block text-sm text-muted">{l}</span>
                </div>
              ))}
            </div>
            <table className="mt-6 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  <th className="py-2.5 text-left font-normal">Behaviour</th>
                  <th className="py-2.5 text-right font-normal">Before</th>
                  <th className="py-2.5 text-right font-normal">After</th>
                  <th className="py-2.5 text-right font-normal">Change</th>
                </tr>
              </thead>
              <tbody>
                {R1_METRICS.map(([k, b, a, c]) => (
                  <tr key={k} className="border-b border-line">
                    <td className="py-3 pr-3">{k}</td>
                    <td className="py-3 pl-3 text-right tabular-nums text-muted">{b}</td>
                    <td className="py-3 pl-3 text-right tabular-nums">{a}</td>
                    <td className="py-3 pl-3 text-right font-semibold tabular-nums" style={{ color: GREEN }}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted">Event counts, before and after the June 2026 release.</p>
          </div>
        </div>

      </section>

      {/* ---------- 05 release 2 ---------- */}
      <section id="r2" data-chapter="05" data-chapter-label="Release 2" className="relative mt-48 px-4 pt-0 sm:px-10">
        <Edge side="right" inset="0px" top="-10rem" size={18} at={[0.3, 0.55]} />
        <Glow v="a" opacity={0.26} delay={-8} className="-right-40 top-[28rem] size-[26rem] md:-right-64 md:size-[48rem]" />
        <Drift kind="arcs" className="inset-x-0 -top-48 h-48" />
        <div className="mx-auto max-w-7xl">
          <ChapterHead n="05" label="Release 2 · August 2026" title="A multicolumn view, without loading data traders hadn’t asked for.">
            Traders wanted to compare more information across a list. Our first direction kept the table inside My lists, but engineering flagged the cost: every return to the screen would fetch every selected column for every stock. We changed the approach. Table view became a separate page and column data loaded only when someone opened it.
          </ChapterHead>

          <div className="mt-14 grid items-center gap-10 md:grid-cols-12">
            <div data-fade className="md:col-span-5">
              <p className="font-mono text-xs" style={{ color: PURPLE }}>The initial idea</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Keep the table inside My lists</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                One icon flips the list into columns and the choice sticks. Engineering flagged the cost: every reopen would load every column for every stock.
              </p>
            </div>
            <div data-fade className="pb-6 md:col-span-7">
              <ViewToggle />
            </div>
          </div>
          <div data-fade className="relative mt-10">
            <Glow v="d" opacity={0.34} delay={-3} className="-right-24 top-1/3 size-[20rem] md:-right-52 md:size-[34rem]" />
            <CostSim />
          </div>
          <div className="mt-20 grid gap-10 md:grid-cols-12">
            <div data-fade className="md:col-span-5">
              <p className="font-mono text-xs" style={{ color: PURPLE }}>Engineering’s suggestion</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Table view on its own page, columns fetched on demand</h3>
            </div>
            <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-7 md:pt-7">We tried three ways in from My lists: an icon, a text link and a checkbox.</p>
          </div>
          <div data-fade className="mt-8">
            <OptionSwitch title="Three ways to reach the table" options={AFTER_CALL} />
          </div>
          <LiveRule release="Release 2 · What shipped" meta="August 2026" />
          <div className="mt-6">
            <PhoneRow items={MC_FINAL} cols="lg:grid-cols-4" />
          </div>

          <div className="relative mt-20 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
            <Edge side="right" inset={WIDE_IN} top="-6rem" size={16} at={[0.3, 0.6]} />
            <div data-fade className="relative mx-auto">
            <Orbit flip className="left-1/2 top-[45%] -translate-x-[78%] -translate-y-1/2" />
            <div className="relative">
              <ReleaseProto build="r2" width={270} /></div>
            </div>
            <div data-fade>
              <h3 className="mb-8 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-[2.75rem]">After launch in August 2026</h3>
              <dl className="border-t border-ink">
                {([["36%", "of watchlist users open Table view"], ["6,32,446", "users on the multicolumn layout"], ["15.5+ min", "average time spent in the view"], ["89,426", "orders placed from the view"]] as const).map(([v, l]) => (
                  <div key={l} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-6">
                    <dd data-count className="text-5xl font-semibold leading-none tabular-nums tracking-[-0.05em] md:text-6xl">{v}</dd>
                    <dt className="text-[15px] text-muted">{l}</dt>
                  </div>
                ))}
              </dl>
              <p className="pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Multicolumn view · as of 11 November 2026 · no earlier version to compare</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 06 release 3 ---------- */}
      <section id="r3" data-chapter="06" data-chapter-label="Release 3" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Edge side="right" inset={SIX} top="-5rem" size={20} at={[0.3, 0.55]} />
        <Glow v="b" opacity={0.22} delay={-5} className="-left-48 bottom-40 size-[24rem] md:-left-80 md:size-[46rem]" />
        <Drift kind="steps" className="-inset-x-24 top-0 h-48" />
        <ChapterHead n="06" label="Release 3 · October 2026" title="Charts for the whole list, with one place for analysis tools.">
            Traders told us they were opening stocks one at a time to compare charts. We introduced Charts view so they could scan multiple charts together. We also chose not to add another Chart icon to the floating bar. Table and Charts were both ways to analyse a list, so we brought them under one Analyze entry point.
          </ChapterHead>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>The Analyze decision</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">No Chart icon in the bar. One Analyze button for both views.</h3>
          </div>
          <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-7">
            A Chart icon would crowd the bar and every later feature would want one too. Table and Charts both analyse a list, so they share Analyze and future analysis tools join them there.
          </p>
        </div>
        <div data-fade className="mt-10">
          <AnalyzeHub />
        </div>
        <div className="mt-16">
          <div data-fade>
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Try the shared controls</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Set it once and every card follows</h3>
          </div>
          <div data-fade className="relative mt-8">
            <Glow v="e" opacity={0.24} delay={-7} className="-left-24 top-1/4 size-[18rem] md:-left-48 md:size-[30rem]" />
            <ChartModeDemo />
          </div>
        </div>

        <LiveRule release="Release 3 · What shipped" meta="October 2026" />
        <div className="relative mt-6 grid items-center gap-12 md:grid-cols-12">
          <Edge side="right" inset={SIX_IN} top="4rem" size={26} at={[0.3, 0.6]} />
          <div data-fade className="flex justify-center pb-12 md:col-span-5">
            <WlPhone src="chart" alt="Charts view: the whole list as a grid of candlestick charts" width={300} />
          </div>
          <div className="md:col-span-7">
            <ul data-fade className="grid gap-5">
              {CHART_DECISIONS.map(([k, v]) => (
                <li key={k} className="border-l-2 pl-4" style={{ borderColor: PURPLE }}>
                  <b className="block font-semibold">{k}</b>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
          <div data-fade className="relative mx-auto">
            <Orbit flip className="left-1/2 top-[45%] -translate-x-[78%] -translate-y-1/2" />
            <div className="relative">
            <ReleaseProto build="r3" width={270} /></div>
          </div>
          <div data-fade>
            <h3 className="mb-8 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-[2.75rem]">After launch in October 2026</h3>
            <dl className="border-t border-ink">
              {([["24.69%", "of watchlist users use Charts view daily"], ["96,864", "people opening Charts view every day"], ["43,872", "orders placed from Charts view since launch"]] as const).map(([v, l]) => (
                <div key={l} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-6">
                  <dd data-count className="text-5xl font-semibold leading-none tabular-nums tracking-[-0.05em] md:text-6xl">{v}</dd>
                  <dt className="text-[15px] text-muted">{l}</dt>
                </div>
              ))}
            </dl>
            <p className="pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Charts view · as of 11 November 2026 · no earlier version to compare</p>
          </div>
        </div>
      </section>

      {/* ---------- 07 version 4 ---------- */}
      <section id="v4" data-chapter="07" data-chapter-label="Version 4" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Glow v="f" opacity={0.32} delay={-9} className="-right-40 top-[22rem] size-[22rem] md:-right-60 md:size-[38rem]" />
        <Edge side="left" inset={SIX} top="-3rem" size={18} at={[0.15, 0.4]} />
        <Drift kind="rings" className="-inset-x-24 top-0 h-48" />
        <Chapter n="07" label="Version 4 · In development" title="The next changes came from using the charts, not from adding more features.">
          Feedback on Charts view was specific: key price levels were hard to read, charts needed more room in List view and range and candle interval were being treated as the same control. The next version addresses those issues with high/low markers, larger charts, separate controls and a default interval for each range. After launch, we’ll measure orders placed from Charts view and time spent on charts.
        </Chapter>
        <div className="mt-14 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)]">
          <div className="hidden grid-cols-[1fr_auto_1fr] gap-6 border-b border-line px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:grid md:px-8">
            <span>What traders told us</span>
            <span />
            <span>What version 4 changes</span>
          </div>
          {V4.map(([need, change]) => (
            <div key={need} data-fade className="grid items-center gap-2 border-b border-line px-6 py-5 last:border-b-0 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-8">
              <span className="text-[15px] text-muted">{need}</span>
              <span aria-hidden className="hidden text-muted md:block">→</span>
              <span className="text-[15px] font-semibold">{change}</span>
            </div>
          ))}
        </div>
        <div data-fade className="mt-8">
          <ChartV2 labels={["Release 3 · live", "Version 4 · in development"]} />
        </div>
        <div className="mt-24 grid items-center gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Ships with version 4</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">More of the list on screen while you scroll</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Traders asked to see more stocks at once. Scroll down My Lists and the search bar and top tabs slide away and the floating bar shrinks to its icons. Scroll back up and everything returns.
            </p>
          </div>
          <div data-fade className="flex justify-center md:col-span-7">
            <ScrollVideo alt="My Lists scrolling: the search bar and tabs hide and the floating bar shrinks, then everything returns" />
          </div>
        </div>
      </section>

      {/* ---------- 08 impact summary ---------- */}
      <section id="summary" data-chapter="08" data-chapter-label="Impact summary" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Edge side="left" inset={SIX} top="-5rem" size={22} />
        <Glow v="a" opacity={0.24} delay={-12} className="-right-40 top-24 size-[24rem] md:-right-72 md:size-[40rem]" />
        <Drift kind="dashes" className="-inset-x-24 top-0 h-48" />
        <Chapter n="08" label="Impact summary" title="The change showed up across the Watchlist journey.">
          More people opened the tab, created and switched lists, discovered lists and placed orders without leaving the Watchlist. The later releases extended the experience from organising stocks to comparing them in a table or across charts.
        </Chapter>
        <div data-fade className="mt-14">
          {SUMMARY.map(([area, what, signal]) => (
            <div key={area} className="grid gap-2 border-b border-line py-5 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-8">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{area}</span>
              <span className="text-lg">{what}</span>
              <b className="text-lg font-semibold tracking-[-0.02em] md:text-right" style={{ color: PURPLE }}>{signal}</b>
            </div>
          ))}
        </div>
        <p data-scrub-words className="mt-16 max-w-4xl text-3xl font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.4rem]">
          The Watchlist started as a place to keep an eye on prices. Across three releases, it became easier to organise stocks, compare them and act from the list. The work also changed how I approached the product: each new capability had to fit the way traders already worked, the technical cost of supporting it and the space available on the screen.
        </p>
      </section>


      {/* ---------- 09 learnings ---------- */}
      <section id="learnings" data-chapter="09" data-chapter-label="Learnings" className="relative mx-auto max-w-7xl px-4 pt-48 sm:px-10">
        <Glow v="c" opacity={0.22} delay={-6} className="-left-32 top-40 size-[18rem] md:-left-48 md:size-[28rem]" />
        <Chapter n="09" label="What I learned" title="Two decisions shaped the work beyond the screens.">
          The first was treating engineering constraints as part of the design problem. The second was giving new capabilities a clear place to live, rather than adding another action every time the product grew.
        </Chapter>
        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {LEARNINGS.map(([title, body], i) => (
            <div key={title} data-fade data-delay={String(i * 0.08)} className="border-t border-line pt-6">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em]">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <NextCase c={getCase("nps")!} href="/work/nps" foot="Watchlist · 2026" focus="54%" />
    </Choreo>
  );
}
