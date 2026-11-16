import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { RollButton } from "@/components/RollButton";
import { Shot } from "@/components/nps/Shot";
import { BeforeAfter } from "@/components/watchlist/BeforeAfter";
import { AppReview } from "@/components/watchlist/AppReview";
import { AnalyzeHub } from "@/components/watchlist/AnalyzeHub";
import { AsksWeb } from "@/components/watchlist/AsksWeb";
import { ChapterIndex } from "@/components/watchlist/ChapterIndex";
import { CostSim } from "@/components/watchlist/CostSim";
import { FabRule } from "@/components/watchlist/FabRule";
import { ChartDirections } from "@/components/watchlist/ChartDirections";
import { ChartModeDemo } from "@/components/watchlist/ChartModeDemo";
import { ChartV2 } from "@/components/watchlist/ChartV2";
import { SourceBars, UsageFunnel, WebControl } from "@/components/watchlist/Charts";
import { Findings, type Finding } from "@/components/watchlist/Findings";
import { OldAnatomy } from "@/components/watchlist/OldAnatomy";
import { PersonaTable } from "@/components/watchlist/PersonaTable";
import { OptionSwitch, type Opt } from "@/components/watchlist/OptionSwitch";
import { PhoneDeck, type DeckFeature } from "@/components/watchlist/PhoneDeck";
import { ResultsBoard, type Result } from "@/components/watchlist/ResultsBoard";
import { RoundRail, type Release } from "@/components/watchlist/RoundRail";
import { TaskRace } from "@/components/watchlist/TaskRace";
import { Ticker } from "@/components/watchlist/Ticker";
import { ViewToggle } from "@/components/watchlist/ViewToggle";
import { WlPhone } from "@/components/watchlist/WlPhone";

// The 2026 watchlist revamp. Facts come from the Watchlist PRD, Watchlist
// Insights (Nov 2025 cohort), the V2 multi-column brief, the Chart Mode briefs
// and spec, and Mixpanel (Android). Copy is written fresh for this page; the
// deck was reference only. Layout deliberately differs from the NPS page:
// light hero with a compare slider, ruled chapter heads, a findings explorer,
// one phone deck for the features and results laid out as a watchlist.

const DESCRIPTION =
  "How I redesigned the Upstox watchlist: what the data and our traders told us, what other apps already did, and the lists, tabs, table and chart views that came out of it.";

export const metadata: Metadata = {
  title: "Watchlist revamp — Salaath Shaikh",
  description: DESCRIPTION,
  robots: { index: false },
  openGraph: { title: "Making the Upstox watchlist worth opening", description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image", title: "Making the Upstox watchlist worth opening", description: DESCRIPTION },
};

const PURPLE = "#5B2EBD";

function Chapter({ n, id, label, title, children, dark }: { n: string; id?: string; label: string; title: React.ReactNode; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div id={id} className={`grid gap-6 border-t pt-5 md:grid-cols-12 md:gap-8 ${dark ? "border-white/40" : "border-ink"}`}>
      <span data-label className={`font-mono text-xs uppercase tracking-[0.12em] md:col-span-3 ${dark ? "text-white/60" : "text-muted"}`}>
        {n} — {label}
      </span>
      <h2 data-split="lines" className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:col-span-6 md:text-[3.3rem]">
        {title}
      </h2>
      {children && <div className={`text-[15px] leading-relaxed md:col-span-3 md:pt-2 ${dark ? "text-white/60" : "text-muted"}`}>{children}</div>}
    </div>
  );
}

// Marks the design that actually went out, so a scanning reader can find the
// three shipped releases without reading the explorations around them.
function Live({ release, meta, title }: { release: string; meta?: string; title: string }) {
  return (
    <div data-fade className="border-t-2 border-[#0E7A48] pt-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#0E7A48] px-3 py-1 text-[13px] font-semibold text-white">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          Went live
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#0E7A48]">{release}{meta ? ` · ${meta}` : ""}</span>
      </div>
      <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">{title}</h3>
    </div>
  );
}

function ToAdd({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-[#E79D0D]/60 bg-[#FFF8EC] p-5 text-sm text-[#8a5a00]">
      <b className="font-semibold">To add · </b>
      {children}
    </div>
  );
}

const RELEASES: Release[] = [
  { n: "1", title: "Lists", status: "Shipped", img: "rr-r1", to: "lists", steps: [
    ["Tried", "A new floating bar, with + New sitting among the list chips"],
    ["Why it changed", "It broke our design-system rule: a tab’s main action lives in the floating bar"],
    ["Shipped", "Add list moved into the bar, and the chips went back to being lists"],
  ] },
  { n: "2", title: "Multi-column view", status: "Shipped", img: "rr-4", to: "columns", steps: [
    ["Tried", "An icon that turns My lists into a table, remembered between visits"],
    ["Why it changed", "Engineering showed it meant loading every column on every visit"],
    ["Shipped", "Their suggestion: a table on its own page, loaded only when opened"],
  ] },
  { n: "3", title: "Chart mode", status: "Shipped", img: "rr-6", to: "charts", steps: [
    ["Drew first", "Chart mode tucked into the ⋮ menu, with a New tag and a red dot"],
    ["Why it changed", "The PMs wanted it out in the open, as its own icon, which would break the bar rule"],
    ["Shipped", "One Analyze button in the bar, opening Chart mode and Table view"],
  ] },
  { n: "4", title: "Chart mode, version 2", status: "In build", img: "rr-7", to: "v2", steps: [
    ["Why", "Three months after launch, traders asked for more"],
    ["What changes", "High and low on every card, bigger list charts and a range to pick"],
  ] },
];

const SHORTLIST: Opt[] = [
  {
    label: "Option 1",
    verdict: "Dropped",
    shots: [
      { src: "ex/s-o1a", caption: "Lists as tabs. Add scrip, Manage and % change in a floating bar." },
      { src: "ex/s-o1b", caption: "Long-press a tab to edit, delete or reorder it." },
      { src: "ex/s-createsheet", caption: "The icon at the top right opens Create or Discover." },
    ],
    notes: ["Adding, managing and sorting stocks all start from the bottom of the screen", "Lists are managed with a long-press", "Making a new list is an icon at the top"],
  },
  {
    label: "Option 2",
    verdict: "Dropped",
    shots: [
      { src: "ex/s-o2a", caption: "A search bar at the bottom, with manage and sort beside it." },
      { src: "ex/s-o2b", caption: "Long-press opens a Manage lists page." },
      { src: "ex/s-disc", caption: "Discover lists to follow, grouped by what they track." },
    ],
    notes: ["Search opens from the bottom, with stock management and sorting next to it", "Long-press takes list management to its own page", "A more compact index bar at the top", "Making a new list is still an icon at the top"],
  },
];

const V1: [string, string][] = [
  ["ex/v1-home", "Lists as chips, with + New at the end."],
  ["ex/v1-sortsheet", "Sort by % change, price, name, volume or market cap."],
  ["ex/v1-filter", "Filters for market cap, sector, index and, for F&O, expiry and call or put."],
  ["ex/v1-buy", "Swipe right to buy, left to sell."],
  ["ex/v1-managesheet", "⋯ opens list and stock management."],
];

const R1_FINAL: [string, string][] = [
  ["ex/r1-after", "Add list sits in the middle of the floating bar, with Sort and More on either side."],
  ["addlist", "Add list opens one page: make your own list or start from a ready-made one."],
  ["create", "Making a list asks for a name and nothing else."],
  ["sort", "Sort keeps its own button in the bar."],
  ["more", "More holds the rest: baskets, managing and editing lists, alerts."],
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

const MC_FINAL: [string, string][] = [
  ["ex/m5-home", "Table view sits above the list, next to the number of scrips."],
  ["ex/m5-table", "Multi column view: one list, its own page, columns that scroll sideways."],
  ["ex/m5-style", "Choose a trading style and its columns tick themselves. Add one more and the style unticks, but your columns stay."],
  ["ex/m5-long", "Long-press any row for Buy and Sell."],
];

const CHART_RULES = [
  "Two overlays and one oscillator at most. Pick two overlays and the rest grey out until you drop one.",
  "Lines start at the left edge. EMA, RSI and MACD are worked out with about 60 extra candles of history, so no card opens on a blank stretch.",
  "VWAP follows the timeframe. It resets every trading day on 5 minute, 15 minute and 1 hour charts, and runs from the first candle on screen for 1 day and 1 week.",
  "Indicator settings are fixed: EMA 9, 20 and 50, RSI 14 and MACD 12, 26, 9. Fewer choices on a card that small.",
  "Index cards never show volume bars, because an index has no traded volume.",
  "The first time, you get Grid view, candles, 1 day and no indicators. After that the phone keeps your setup, even after the app is closed.",
  "Charts load as their cards scroll into view, and the price on each card stays live.",
];

const TICKET = [
  ["Role", "Lead product designer"],
  ["App", "Upstox, Android 3.19 → 3.33"],
  ["Research and design", "Nov 2025 – Jun 2026"],
  ["Live", "From June 2026"],
];

const CHAPTERS: [string, string][] = [
  ["Why", "why"], ["Before", "before"], ["Listening", "listening"], ["Findings", "findings"], ["Others", "others"], ["Releases", "rounds"],
  ["Lists", "lists"], ["Columns", "columns"], ["Charts", "charts"], ["Shipped", "design"], ["Race", "race"], ["Results", "results"], ["Version 2", "v2"],
];

const ASKS = [
  { text: "Give me a list to start with, I don’t know what to add", topic: "Ready-made lists" },
  { text: "Let me jump between my lists without opening a menu", topic: "Switching lists" },
  { text: "Show OI and IV in the list, not three screens deep", topic: "More columns" },
  { text: "I want to see all my charts together before the market opens", topic: "Charts" },
  { text: "Let me buy five stocks in one go", topic: "Baskets" },
  { text: "Put the option chain next to my lists", topic: "Option chain" },
];

const SOURCES = [
  ["1,19,080", "new accounts tracked from sign-up to first order", "Nov 2025"],
  ["69,850 / 3,94,600", "F&O traders and other users who added stocks, compared side by side", "Nov 2025"],
  ["Jan–Apr 2026", "four months of watchlist events on Android, before we shipped anything", "Mixpanel"],
  ["9", "other watchlists we used properly, Indian and international", "Review"],
  ["2.5%", "of new customers made a watchlist in their first 45 days", "Nov 2025"],
];

const FINDINGS: Finding[] = [
  {
    title: "First orders are small, and they come fast",
    who: "New customers",
    text: "New customers placed their first order about two and a half days after opening the account, usually in equity, and half the time for under ₹500. They searched for stocks that had just listed, big names under ₹100, gold and silver ETFs. Our default lists showed none of that.",
    changed: "Lists like IPO access, Top traded and Nifty 50 ETFs, and a ready list in every new account.",
    visual: (
      <div className="grid grid-cols-2 gap-3">
        {[
          ["56%", "activated with an equity order"],
          ["~51%", "of first orders under ₹500"],
          ["~2.5 days", "from account to first order"],
          ["69%", "of list-makers activated in 45 days"],
        ].map(([v, l]) => (
          <div key={v} className="rounded-xl border border-line p-5">
            <b className="block text-3xl font-semibold tracking-[-0.045em]">{v}</b>
            <span className="mt-6 block text-sm text-muted">{l}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Lists get built everywhere except the watchlist",
    who: "Everyone who adds stocks",
    text: "People rarely sat down in the watchlist tab to build a list. They added a stock while looking at something else: a search result, a stock page, an option chain. The tab itself was for checking prices.",
    changed: "The option chain and ready-made lists moved into the watchlist, and adding a list takes two taps.",
    visual: <SourceBars />,
  },
  {
    title: "A million visits a month, very little action",
    who: "Watchlist visitors",
    text: "Over a million people opened the watchlist every month. Fewer of them added stocks each month, 403K in January down to 305K in April. The ones who did trade from it were a small, intense group, mostly F&O traders.",
    changed: "Switching lists became a tap, lists could be followed instead of built, and heavy traders got sorting and baskets on top of swipe.",
    visual: <UsageFunnel />,
  },
  {
    title: "An options trader and an investor want different columns",
    who: "Active traders",
    text: "People opened stock after stock to check one number: OI, a dividend, the day’s range. Other apps either showed every column at once or only the price. Try reading the same five stocks the way each kind of trader would.",
    changed: "Table view, with a preset per trading style and 20+ columns to choose from.",
    visual: <PersonaTable />,
  },
  {
    title: "Charts were one stock at a time",
    who: "Chart readers",
    text: "Active traders keep 10 to 30 stocks in a list and look at their charts before the open. On the old app that meant tap a stock, tap Chart, go back, and repeat for every row.",
    changed: "Chart mode: the whole list as charts, with one set of indicators for all of them.",
    visual: (
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-line text-center">
        <div className="p-8">
          <b className="block text-7xl font-semibold tracking-[-0.06em] text-[#D93A2B]">~60</b>
          <span className="mt-2 block text-sm text-muted">taps to check a 20-stock list, before</span>
        </div>
        <div className="border-l border-line bg-[#F1ECFA] p-8">
          <b className="block text-7xl font-semibold tracking-[-0.06em]" style={{ color: PURPLE }}>1</b>
          <span className="mt-2 block text-sm text-muted">tap, after</span>
        </div>
      </div>
    ),
  },
];

const FEATURES: DeckFeature[] = [
  {
    name: "List chips",
    short: "Every list on screen",
    stat: "18%",
    statLabel: "of monthly visitors had ever switched lists",
    because: "Switching was hidden behind the list name, so most people stayed on whatever list opened first. Now every list is a chip under the tabs.",
    screens: [
      { shot: "home", caption: "Lists sit in a row of chips. Tap to switch, long-press to rename, reorder or delete." },
      { shot: "create", caption: "Creating a list asks for a name, but “Maybe later” skips it and goes straight to adding stocks." },
      { shot: "search", caption: "Search is at the top with a + on every result, because that’s where 70% of adds already happened." },
    ],
  },
  {
    name: "Discover lists",
    short: "64 lists to follow",
    stat: "6%",
    statLabel: "of stocks were added from the old Discover page",
    because: "New customers wanted ideas and the old app hid them two screens away. Ready-made lists now open from the same place you create your own.",
    screens: [
      { shot: "addlist", caption: "Add list shows your own list and 64 ready ones in 8 groups, from F&O to fundamentals." },
      { shot: "disc", caption: "Each list leads with the number that defines it, like OI change for build-ups." },
      { shot: "followed", caption: "Follow turns it into a chip. It refreshes itself and doesn’t use up one of your list slots." },
    ],
  },
  {
    name: "Options and Commodity",
    short: "Chains inside the tab",
    stat: "23%",
    statLabel: "of F&O traders’ adds came from the option chain",
    because: "F&O traders were building lists from a screen that lived somewhere else. We brought it into the watchlist as its own tab, and did the same for MCX.",
    screens: [
      { shot: "options", caption: "Option chains for 6 indices, calls or puts, any expiry, tagged ITM, ATM or OTM." },
      { shot: "commodity", caption: "11 MCX contracts with their 10 most-traded strikes. The app reopens on whichever tab you used last." },
    ],
  },
  {
    name: "Sort and baskets",
    short: "Act on a whole list",
    stat: "~29",
    statLabel: "orders a month from each person trading off a row",
    because: "The people who traded from the list traded a lot. We kept swipe-to-trade exactly as they knew it and added ways to act on many stocks at once.",
    screens: [
      { shot: "sort", caption: "Sort by % change, price, volume, market cap or name. Each list remembers its own sort." },
      { shot: "more", caption: "A floating bar keeps Sort, Add list, Analyze and More in reach. More has baskets, alerts and Chart 360." },
      { shot: "basket", caption: "Tick up to 20 stocks and place them as one basket order." },
    ],
  },
  {
    name: "Table view",
    short: "Columns per trading style",
    stat: "20+",
    statLabel: "columns to choose from, with presets",
    because: "Scrip stays pinned on the left, price and change always come first, and the rest scrolls sideways. A preset fills the columns so nobody starts with an empty grid.",
    screens: [
      { shot: "table", caption: "Overview preset: returns, PE, market cap and yield, with sortable headers." },
      { shot: "tablefo", caption: "The F&O preset swaps in OI, OI change, PCR and IV." },
      { shot: "tablecols", caption: "Manage columns to tick, untick and drag your own set into order." },
    ],
  },
  {
    name: "Chart mode",
    short: "The whole list as charts",
    stat: "1 tap",
    statLabel: "to every chart in a list, instead of ~60",
    because: "Analyze opens the list as live charts. One timeframe and one set of indicators apply to all of them, and tapping a chart opens the full version with the same settings.",
    screens: [
      { shot: "chart", caption: "Grid view, two charts a row, for scanning." },
      { shot: "chartlist", caption: "List view, one wide chart per row, for reading." },
      { shot: "indsheet", caption: "One overlay, volume bars and one oscillator. Short on purpose." },
      { shot: "chartind", caption: "EMA, volume and RSI on every chart at once." },
    ],
  },
];

const TASKS = [
  ["Switch lists", "2 taps", "1 tap"],
  ["Follow a ready-made list", "Leave the tab for Discover", "3 taps, in the tab"],
  ["Check charts across 20 stocks", "~60 taps", "1 tap"],
  ["Buy several stocks", "One order each", "One basket, up to 20"],
  ["See OI, PE or yield for a list", "Open every stock", "2 taps"],
  ["Get to an option chain", "Leave the watchlist", "1 tap"],
];

const RESULTS: Result[] = [
  { metric: "People opening the watchlist", when: "Launch month, May → June 2026", change: "+53%", up: true, note: "The first thing we saw after release. Some of that is curiosity about a new screen, which is why we kept measuring for six more months." },
  { metric: "People creating a new list", when: "Launch month", change: "+32%", up: true, note: "Two-tap creation and the optional name did what they were meant to: fewer people gave up halfway through making a list." },
  { metric: "People switching lists", when: "Sep–Oct vs Feb–Mar 2026", change: "+13%", up: true, note: "It jumped 34% in the first month and settled 13% higher. Chips stuck." },
  { metric: "Orders from Discover lists", when: "Sep–Oct vs Feb–Mar 2026", from: "3,101", to: "5,782", change: "+86%", up: true, note: "Monthly orders placed from a followed list. Ready-made lists turned into a real way to trade, not just to browse." },
  { metric: "Orders from the Commodity Options list", when: "September 2026", from: "0", to: "6,829", change: "New", up: true, note: "A list that didn’t exist before the revamp, now placing thousands of orders a month." },
  { metric: "People adding stocks", when: "Android vs web, same period", change: "−14%", up: false, note: "Adding fell everywhere this year. On Android, with the new watchlist, it fell 14%. On web, still on the old design, it fell 25%. The gap is the closest thing we have to a control group." },
];

export default function WatchlistCase() {
  return (
    <Choreo className="bg-white">
      {/* ---------- hero ---------- */}
      <header className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-10 md:pt-40">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[42rem] rounded-full opacity-25 blur-[100px]" style={{ background: PURPLE }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.25fr_auto]">
          <div>
            <p data-fade data-load className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Upstox · Watchlist revamp · 2026</p>
            <h1 data-split="words" data-load data-delay="0.1" className="mt-6 text-[13vw] font-semibold leading-[0.9] tracking-[-0.06em] sm:text-[9vw] lg:text-[6.6rem]">
              Making the watchlist worth opening
            </h1>
            <p data-fade data-load data-delay="0.5" className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              Over a million people opened the Upstox watchlist every month, and most of them only looked at prices. I spent the better part of a year with our data, our traders’ requests and the other apps on their phones, then shipped the redesign in three releases: lists first, then a multi-column view, then Chart mode. Each one changed shape before it went out, because of a design-system rule, a backend limit or a usage number. A second version of Chart mode is with engineering now.
            </p>
            <dl data-fade data-load data-delay="0.7" className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
              {TICKET.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-fade data-load data-delay="0.4" className="mx-auto">
            <BeforeAfter width={310} />
          </div>
        </div>
      </header>

      <Ticker />
      <ChapterIndex items={CHAPTERS} />

      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <div className="mt-6">
          <ToAdd>Team and credits: product manager, other designers, engineering leads.</ToAdd>
        </div>
      </div>

      {/* ---------- 01 why ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-10">
        <Chapter n="01" id="why" label="Why touch it" title="The people who used it traded three times as much">
          That was the number I kept coming back to. If a watchlist made that much difference, why did so few people have one?
        </Chapter>
        <dl data-fade className="mt-14 grid grid-cols-2 border-t border-ink md:grid-cols-4">
          {([
            ["Orders in 45 days", "65 vs 22", "with a watchlist, against everyone else", ""],
            ["Made a watchlist", "2.5%", "of 1,19,080 new customers. 3,094 people.", "text-[#D93A2B]"],
            ["Opened it", "0.68%", "tapped into the watchlist in their first week", ""],
            ["Ordered from it", "0.18%", "placed a first order from the watchlist. Search managed 3%.", ""],
          ] as const).map(([k, v, note, tone], i) => (
            <div key={k} className={`pb-2 pr-4 pt-6 ${i % 2 ? "border-l border-line pl-5 md:pl-6" : ""} ${i === 2 ? "md:border-l md:border-line md:pl-6" : ""} ${i >= 2 ? "max-md:border-t max-md:border-line" : ""}`}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{k}</dt>
              <dd className={`mt-4 text-4xl font-semibold leading-none tracking-[-0.04em] md:text-5xl ${tone}`}>{v}</dd>
              <dd className="mt-3 max-w-[15rem] text-sm leading-snug text-muted">{note}</dd>
            </div>
          ))}
        </dl>
        <p data-fade className="mt-6 text-xs text-muted">New customers who signed up in November 2025, tracked for their first 45 days.</p>
      </section>

      {/* ---------- 02 before ---------- */}
      <section className="mt-32 bg-[#0e0b12] px-4 py-28 text-white sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Chapter n="02" id="before" label="The old one" title="It had barely changed since 2023" dark>
            Three years of new users, new products and new competitors, and the watchlist still worked the way it did on day one. Tap the numbers.
          </Chapter>
          <div className="mt-16">
            <OldAnatomy />
          </div>
        </div>
      </section>
      <Ticker dark />

      {/* ---------- 03 listening ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-10">
        <Chapter n="03" id="listening" label="Listening" title="Before drawing anything, we asked what people were already doing">
          Two kinds of evidence: what the numbers showed people doing, and what traders kept telling us they wanted.
        </Chapter>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div data-fade>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">What we measured</p>
            <ul className="mt-4">
              {SOURCES.map(([v, l, s]) => (
                <li key={v} className="grid grid-cols-[8.5rem_1fr] gap-4 border-t border-line py-4 last:border-b">
                  <b className="text-lg font-semibold tracking-[-0.02em]">{v}</b>
                  <span className="text-[15px]">
                    {l}
                    <span className="mt-0.5 block font-mono text-[11px] text-muted">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div data-fade data-delay="0.08">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">What traders kept asking for</p>
            <p className="mt-4 flex items-baseline gap-4 border-t border-ink pt-4">
              <b className="text-4xl font-semibold tracking-[-0.04em]">65</b>
              <span className="text-[17px] leading-snug">user sessions at our office, gathered over six months</span>
            </p>
            <div className="mt-5">
              <AsksWeb asks={ASKS} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 04 findings ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="04" id="findings" label="Findings" title="Five things we didn’t know when we started">
          Each one ended up as a feature. Click through them in order or jump around.
        </Chapter>
        <div data-fade className="mt-14">
          <Findings items={FINDINGS} />
        </div>
      </section>

      {/* ---------- 05 others ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="05" id="others" label="Other apps" title="Our users had other broker apps, and they noticed the gaps">
          We used seven other watchlists the way our traders would and screenshotted every step, then scanned nine apps for the features traders kept bringing up. If Dhan puts O=H on a row, a trader notices when we don’t. Pick an app to see its watchlist and our notes, and flip the switch to see Upstox before and after.
        </Chapter>
        <div data-fade className="mt-14">
          <AppReview />
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line md:grid-cols-3">
          {[
            ["Took from Dhan, Sahi, HDFC Sky", "Lists that update themselves. We grouped ours the way traders describe what they’re looking for."],
            ["Took from Webull, Robinhood", "Columns you choose. We added presets so nobody faces a blank grid."],
            ["Did differently from Groww, Zerodha", "Their multi-chart views live on web or in a separate terminal. Ours is inside the watchlist and built for a phone."],
          ].map(([k, v]) => (
            <div key={k} data-fade className="bg-white p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: PURPLE }}>{k}</p>
              <p className="mt-3 text-[15px] leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 06 rounds ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="06" id="rounds" label="How it got here" title="Three releases, and a fourth in build">
          Lists, then columns, then charts. Each release started as one design and shipped as another, and the reason is on each card. Click one to jump to it.
        </Chapter>
        <div data-fade className="mt-14">
          <RoundRail releases={RELEASES} />
        </div>
      </section>

      {/* ---------- 07 lists: release 1 ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="07" id="lists" label="Release 1 · Lists" title="Our own design broke the rule we’d set for the floating bar">
          Research left us with four jobs: making and finding lists, managing them, switching between them, and managing the stocks inside. We shortlisted two layouts for those, then built the stronger one out in full.
        </Chapter>
        <div data-fade className="mt-14">
          <OptionSwitch
            title="Shortlisted layouts"
            options={SHORTLIST}
            footer="Both put the floating bar to work on stocks, and both left making a list up at the top of the screen."
          />
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-4">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>The first full design</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Every state drawn, then sent back</h3>
            <p className="mt-3 text-[15px] text-muted">
              Lists as chips, filter and sort in a floating bar, swipe a row to buy or sell, and loading, error and empty states for each. It was close. The problem was one chip.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white md:col-span-8">
          <div className="flex gap-5 overflow-x-auto px-5 pb-12 pt-6 md:px-8 md:pt-8">
            {V1.map(([src, cap]) => (
              <figure key={src} data-fade className="w-[10.5rem] shrink-0">
                <WlPhone src={src} alt={cap} />
                <figcaption className="mt-3 text-[13px] leading-snug text-muted">{cap}</figcaption>
              </figure>
            ))}
          </div>
          </div>
        </div>

        <div data-fade className="mt-12">
          <FabRule />
        </div>
        <div className="mt-16">
          <Live release="Release 1 · Lists" meta="June 2026" title="Add list in the floating bar, and chips that are only lists" />
          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-line bg-white">
            <div className="flex gap-5 overflow-x-auto px-5 pb-12 pt-6 md:px-8 md:pt-8 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible">
              {R1_FINAL.map(([src, cap]) => (
                <figure key={src} data-fade className="w-[11rem] shrink-0 lg:w-auto">
                  <WlPhone src={src} alt={cap} />
                  <figcaption className="mt-3 text-[13px] leading-snug text-muted">{cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <p data-fade className="mt-6 max-w-3xl text-[15px] text-muted">
          The rule isn’t only for My lists. Home, Orders, Positions, My lists and Holdings all keep their main action in the floating bar, so someone moving between tabs always knows where to look. Creating a list moved into the bar as Add list, and the chips went back to being lists. That’s the version we shipped, and every release after it keeps the same bar.
        </p>
      </section>

      {/* ---------- 08 columns: release 2 ---------- */}
      <section className="mt-32 bg-[#F6F5F2] px-4 py-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Chapter n="08" id="columns" label="Release 2 · Multi-column" title="The table we drew first would have cost too much to load">
            Then the multi-column requirement came in: let traders see more than price and change without opening each stock.
          </Chapter>

          <div className="mt-14 grid items-center gap-10 md:grid-cols-12">
            <div data-fade className="md:col-span-5">
              <p className="font-mono text-xs" style={{ color: PURPLE }}>Our first design · Columns on My lists</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">One icon, and the list becomes a table</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                The obvious answer. An icon at the end of the chips flips the list into columns, and the app remembers your choice, so switching tabs or reopening the app brings you back to the table. We drew five versions of the icon and handed the designs to engineering.
              </p>
            </div>
            <div data-fade className="rounded-[1.25rem] border border-line bg-white px-6 pb-6 pt-8 md:col-span-7 md:pt-10">
              <ViewToggle />
            </div>
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-12">
            <div data-fade className="md:col-span-5">
              <p className="font-mono text-xs text-[#B4321F]">The feasibility call</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Remembering the view meant fetching everything, every time</h3>
            </div>
            <div data-fade className="grid gap-4 text-[15px] leading-relaxed md:col-span-7">
              <p>The backend engineers raised it. Some people keep more than 50 stocks in one list. Upstox reopens on the tab you left, so a remembered table would pull every extra column for every stock the moment the app opened.</p>
              <p>And traders hop between Orders and My lists all session. Each hop back would call for all of that data again. The backend wasn’t built to return that many data points for a list, and calling for them on every landing was expensive.</p>
              <p>We argued for keeping the table on My lists, because it’s what users would want. We lost that argument for a good reason. The table would open on demand, on a page of its own, for one list at a time.</p>
            </div>
          </div>
          <div data-fade className="mt-10">
            <CostSim />
          </div>

          <div data-fade className="mt-20">
            <OptionSwitch
              title="Engineering’s suggestion · Getting to a table on its own page"
              options={AFTER_CALL}
            />
          </div>

          <div className="mt-16">
            <Live release="Release 2 · Multi-column view" title="Table view, on a page of its own" />
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-line bg-white">
              <div className="flex gap-5 overflow-x-auto px-5 pb-12 pt-6 md:px-8 md:pt-8 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible">
                {MC_FINAL.map(([src, cap]) => (
                  <figure key={src} data-fade className="w-[12rem] shrink-0 lg:w-auto">
                    <WlPhone src={src} alt={cap} />
                    <figcaption className="mt-3 text-[13px] leading-snug text-muted">{cap}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 09 charts: release 3 ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="09" id="charts" label="Release 3 · Chart mode" title="Chart mode was drawn into a menu, and launched behind one button for analysis">
          With the table settled, charts were next. Traders who read charts wanted to see a whole list that way, not one stock at a time.
        </Chapter>

        <div className="mt-14 grid items-start gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-4">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Why Chart mode</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Thirty stocks meant thirty charts, opened one by one</h3>
            <div className="mt-3 grid gap-3 text-[15px] leading-relaxed text-muted">
              <p>Say a swing trader wants to know which stocks in their list are trading above the 20 and 50-day averages. Before Chart mode, that meant opening each chart, setting it up, going back, and holding the last few in their head.</p>
              <p>Chart mode draws the whole list as small charts. The bigger decision was the control bar: timeframe, chart type and indicators are set once and apply to every card. Every chart is read the same way, so comparing them is fair. The phone remembers the setup, so the next list opens the same way.</p>
              <p>Tap a card when something stands out and you’re on that stock’s full chart.</p>
            </div>
          </div>
          <div data-fade className="md:col-span-8">
            <ChartModeDemo />
          </div>
        </div>

        <div className="mt-20 grid items-start gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-4">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Our first design · Behind the ⋮</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">A menu row, a New tag and a red dot</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Our first design put Chart mode in the ⋮ menu. It would carry a New tag for its first four weeks, and the ⋮ button would show a red dot until you’d opened Chart mode once. It never shipped this way. Before launch, the PMs and the business team asked for something more visible.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-white md:col-span-8">
          <div className="flex gap-5 overflow-x-auto px-5 pb-12 pt-6 md:px-8 md:pt-8">
            <figure data-fade className="w-[12rem] shrink-0">
              <WlPhone src="ex/c-list" alt="My lists with a red dot on the more button" />
              <figcaption className="mt-3 text-[13px] leading-snug text-muted">The red dot on ⋮ would have been the only sign on My lists.</figcaption>
            </figure>
            <figure data-fade className="w-[15rem] shrink-0 self-center">
              <div className="overflow-hidden rounded-2xl border border-line shadow-[0_20px_40px_-25px_rgba(40,14,80,0.4)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/work/watchlist/ex/c-more-row.jpg" alt="The more menu, with Chart Mode at the top under a New tag" width={720} height={200} loading="lazy" className="block w-full" />
              </div>
              <figcaption className="mt-3 text-[13px] leading-snug text-muted">Inside: Chart Mode, first of five rows.</figcaption>
            </figure>
            <figure data-fade className="w-[12rem] shrink-0">
              <WlPhone src="ex/c-mode" alt="Chart mode grid of candlestick charts" />
              <figcaption className="mt-3 text-[13px] leading-snug text-muted">And once you got there, every stock as a chart.</figcaption>
            </figure>
          </div>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>The pushback</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">They asked for a Chart icon in the bar. We said no, and offered something else.</h3>
          </div>
          <div data-fade className="grid gap-4 text-[15px] leading-relaxed md:col-span-7">
            <p>The PMs and the business team wanted another icon in the floating bar, just for charts. We pushed back. A bar that takes one more icon for one feature will take the next one too, and every new feature after that would come asking for space.</p>
            <p>Looking at the two features together, Table view and Chart mode do the same job: they help you analyse a list. So we proposed one Analyze button in the bar that opens both. It fixes discovery for both, and the next analysis feature joins the sheet instead of the bar. Both teams agreed, and that’s what’s live.</p>
            <p>Chart mode went out in Android 3.31.0 on 3 August 2026 and reached every user by 15 August. Analyze opens a screen with two tabs, Chart mode first and Table view second, sharing one list picker.</p>
          </div>
        </div>
        <div className="mt-16">
          <Live release="Release 3 · Chart mode" meta="Android 3.31.0, 3 Aug 2026" title="One Analyze button for Chart mode and Table view" />
        </div>
        <div data-fade className="mt-6">
          <AnalyzeHub />
        </div>
        <p data-fade className="mt-6 max-w-3xl text-[15px] text-muted">
          It’s already paying off: watchlist news is being discussed as the next thing to sit under Analyze, next to Table view and Chart mode.
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-12">
          <div data-fade className="md:col-span-4">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Inside Chart mode</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">The decisions inside every card</h3>
            <ul className="mt-5 grid gap-3 text-[15px] leading-snug text-muted">
              {CHART_RULES.map((r) => (
                <li key={r} className="border-l-2 border-line pl-3">{r}</li>
              ))}
            </ul>
          </div>
          <div data-fade className="md:col-span-8">
            <ChartDirections />
          </div>
        </div>

      </section>

      {/* ---------- 10 shipped ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="10" id="design" label="What shipped" title="Six changes, one tab">
          Where the three releases landed. Pick a feature on the left, then step through its screens.
        </Chapter>
        <div data-fade className="mt-14">
          <PhoneDeck features={FEATURES} />
        </div>
        <p data-fade className="mt-6 max-w-3xl text-[15px] text-muted">
          New accounts, and anyone who joined after January 2025 with three lists or fewer, start with ready lists such as Trending and Nifty 50. We can update those without an app release, so the tab is never empty on someone’s first day.
        </p>
      </section>

      {/* ---------- 11 race ---------- */}
      <section className="mt-32 bg-[#F6F5F2] px-4 py-28 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Chapter n="11" id="race" label="Try it" title="Do the same job on both, and count">
            Both phones are working prototypes built from the Figma files. Pick a task, finish it on each, and the counters keep score.
          </Chapter>
          <div data-fade className="mt-14 hidden md:block">
            <TaskRace />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:hidden">
            <RollButton href="/proto/watchlist/old.html" label="Open the old watchlist" />
            <RollButton href="/proto/watchlist/new.html" label="Open the new watchlist" />
          </div>
          <div data-fade className="mt-6 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {TASKS.map(([t, a, b]) => (
              <div key={t} className="bg-white p-5">
                <p className="font-semibold tracking-[-0.01em]">{t}</p>
                <p className="mt-3 flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted line-through decoration-[#D93A2B]/50">{a}</span>
                  <span className="font-semibold" style={{ color: PURPLE }}>{b}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 12 results ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-10">
        <Chapter n="12" id="results" label="Results" title="Six months on, read like a watchlist">
          February and March 2026 against September and October, once every release had reached everyone. Tap a row for the story behind it.
        </Chapter>
        <div data-fade className="mt-14">
          <ResultsBoard rows={RESULTS} />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-12">
          <div data-fade className="rounded-[1.25rem] border border-line p-6 md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">The control group we didn’t plan</p>
            <div className="mt-5">
              <WebControl />
            </div>
          </div>
          <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-7 md:pt-2">
            Some of this is undercounted. Orders placed from Chart mode and Table view don’t carry a watchlist tag yet, and since July untagged orders are up 73%. Baskets from a list are counted with every other basket, and the iOS events haven’t been mapped. Fixing the tracking is next on the list, so the real number is probably better than what’s shown here.
          </p>
        </div>
      </section>

      {/* ---------- 13 chart mode version 2 ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <Chapter n="13" id="v2" label="Release 4 · In build" title="Chart mode, version 2">
          The watchlist shipped, and the work didn’t stop there. This is the release that’s with engineering now.
        </Chapter>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Why version 2</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">Three months after launch, traders wanted to read the charts faster</h3>
          </div>
          <div data-fade className="grid gap-4 text-[15px] leading-relaxed md:col-span-7">
            <p>Chart mode did well after launch, and users asked for more. The brief for version 2 was short: help people read charts faster and compare stocks better.</p>
            <p>Two of the changes undo calls we made in version 1. The high and low used to appear only while you pressed and held a chart; now they’re on every card. And the single timeframe chip mixed two choices into one: how big each candle is, and how far back you look. Version 2 splits them into a range and an interval.</p>
          </div>
        </div>
        <div data-fade className="mt-10">
          <ChartV2 />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-12">
          <div data-fade className="md:col-span-5">
            <p className="font-mono text-xs" style={{ color: PURPLE }}>Also in version 2 · Table view</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">The Performance tab gets 3-month returns next to the 1-month ones, as a toggle or its own column (still being decided), and a quarterly sales growth column in the horizontal scroll.</p>
          </div>
          <p data-fade className="text-[15px] leading-relaxed text-muted md:col-span-7">
            Version 2 went to engineering in November 2026, so it isn’t in the results above. Those cover version 1 only.
          </p>
        </div>
      </section>

      {/* ---------- next + reflection ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-9">
            <p data-label className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Looking back</p>
            <p data-scrub-words className="mt-6 text-3xl font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.4rem]">
              Most of the arguments in this project were settled by a number someone could check. That made it easier to say no to features that looked good in other apps and easier to defend the ones that didn’t look like much, like a chip row.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="px-4 pb-10 pt-32 sm:px-10">
        <div className="mx-auto grid max-w-6xl items-end gap-10 border-t border-ink pt-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Next case study</p>
            <h2 data-split="lines" className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">Making NPS feel simple</h2>
            <div data-fade className="mt-8 flex flex-wrap items-center gap-4">
              <RollButton href="/work/nps" label="Read it" />
              <span className="text-sm text-muted">The new watchlist is live: open Upstox and tap My lists.</span>
            </div>
          </div>
          <div data-fade data-parallax="-0.08" className="mx-auto">
            <Shot src="explore" alt="NPS on Upstox: the Explore screen" width={220} />
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-6xl justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <span>Sal · Lead product designer, Upstox</span>
          <span>Watchlist · 2026</span>
        </div>
      </section>
    </Choreo>
  );
}
