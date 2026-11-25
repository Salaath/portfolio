import { DisplayProto } from "./DisplayProto";
import { FlowVideo } from "./FlowVideo";

// Project 03 on the leadership page: one console for every message, in the app or as a notification.
// Copy is Sal's, from the proposal deck of November 2026 ("Fewer, better
// messages in the app"): the problem, why it happens, the proposal and the
// roles. The console screens are captures of the coded prototype
// (public/proto/jarvis); the "today" phone is Sal's recording of the current new-user flow.
// Colleagues named in the deck are left out of the page.

const IMG = "/work/jarvis";
const PROTO = "/proto/jarvis/index.html";

/** The wall in the display photo: the band behind it is this colour from one edge of the page to the other. */
const WALL = "#e6e6e6";

/** The console prototype, live on a desktop display, in a grey band the full width of the page. It comes inside the proposal, once the problem has been told. */
function JarvisStage() {
  return (
    <figure className="m-0">
      {/* breaks out of the page's column to both edges of the window */}
      <div data-band className="mx-[calc(50%-50vw)] overflow-hidden" style={{ background: WALL }}>
       <div className="relative mx-auto max-w-[1800px]">
        {/* says plainly that the screen can be used, with a way to open it full screen in a new tab */}
        <div className="absolute inset-x-0 top-0 z-10 hidden items-center justify-center gap-6 pt-[2.2%] sm:flex">
          <p className="pointer-events-none m-0 font-mono text-xs uppercase tracking-[0.12em] text-muted">Clickable prototype — click the screen to try it</p>
          <a href={PROTO} target="_blank" rel="noopener" data-cursor="Open" className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-bg/70 py-1.5 pl-3.5 pr-3 font-mono text-xs uppercase tracking-[0.12em] text-ink backdrop-blur transition-colors duration-300 hover:bg-ink hover:text-bg">
            Open full screen <span aria-hidden>↗</span>
          </a>
        </div>
        <DisplayProto
          src={PROTO}
          image={`${IMG}/console-display.webp`}
          alt="A desktop display on a shelf, showing the Jarvis console’s home for a product manager"
          title="Jarvis console interactive prototype"
          className=""
        />
       </div>
      </div>
      <figcaption className="mt-5 flex items-baseline gap-4 pt-4">
        <span className="font-mono text-xs text-muted">Prototype</span>
        <span>
          <span className="block text-lg tracking-[-0.01em]">The console, as a product manager sees it</span>
          <span className="mt-1 hidden text-muted sm:block">Click through it on the screen. The name at the bottom left switches to a reviewer or the admin. Sample data, nothing is saved.</span>
          <span className="mt-1 block text-muted sm:hidden">A still on a small screen. The link at the end of this project opens the prototype.</span>
        </span>
      </figcaption>
    </figure>
  );
}

const TODAY = [
  ["1", "Verify the OTP"],
  ["2–4", "Close a SEBI sheet, a notifications sheet and an F&O activation sheet"],
  ["5", "Dismiss a coach mark"],
  ["6", "Land on Home with three banners selling different things"],
];

/** What a new user goes through today, as a recording, with the six steps beside it. */
function Today() {
  return (
    <figure className="m-0 grid items-center gap-x-16 gap-y-10 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-x-24">
      <div className="grid place-items-center rounded-[1.75rem] bg-[#f1eef7] py-8 md:rounded-[2.25rem] md:py-10">
        <FlowVideo
          src={`${IMG}/today.mp4`}
          poster={`${IMG}/today-poster.jpg`}
          label="Screen recording of a new user opening the Upstox app: verifying an OTP, closing a SEBI sheet, a notifications sheet and an F&O activation sheet, dismissing a coach mark, then landing on Home where three banners are marked 1 to 3"
          className="w-[min(68%,15rem)]"
          phone="720/1600"
        />
      </div>
      <div>
        <figcaption className="label">What a new user sees today</figcaption>
        <p className="mt-4 max-w-xl text-2xl leading-snug tracking-[-0.015em] md:text-3xl">Four screens to close, then three banners on Home</p>
        <ol className="mt-8 max-w-xl">
          {TODAY.map(([n, t]) => (
            <li key={n} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-line py-3 last:border-b">
              <span className="font-mono text-xs text-muted">{n}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

const Rows = ({ label, items }: { label: string; items: [string, string][] }) => (
  <div>
    <p className="label">{label}</p>
    <ol className="mt-4">
      {items.map(([h, p], i) => (
        <li key={h} className="grid grid-cols-[1.75rem_1fr] items-baseline gap-4 border-t border-line py-4 last:border-b">
          <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span className="block">{h}</span>
            <span className="mt-1 block text-muted">{p}</span>
          </span>
        </li>
      ))}
    </ol>
  </div>
);

const HOW: [string, string, string][] = [
  ["Plan", "One page, four questions", "What it’s for, who sees it, where it shows and when. It flags audiences already getting other messages before anything is built."],
  ["Approve", "Three reviewers, one round", "The head, Design and CRM review at the same time. CRM’s approval schedules it. Every decision and comment is on record."],
  ["Protect", "Fewer repeat messages", "A message stops once the customer acts on it and skips people who already use the product. Messages that aren’t urgent wait until after market hours. Results are measured against a held-back group."],
];

const SCREENS = [
  ["laptop-new.webp", "Raising a request takes one page", "Paste a brief and Jarvis fills the form. It warns when the audience is already busy. The preview shows exactly what customers will see.", "The New request page: a pasted brief has filled in the initiative and goal, with a phone preview on the right showing the message as a push notification on the lock screen"],
  ["laptop-detail.webp", "Three reviewers approve in one round", "The head, Design and CRM see it at the same time and every step is on record.", "A request in review: three reviewer cards side by side, two approved and one not opened yet, above the request’s details"],
  ["laptop-nc.webp", "Every message a customer gets, in one place", "Pick an audience to see every message planned for them, in the app and as push, email, WhatsApp or SMS. Use it to find a quiet week before you plan yours.", "The Notification center: a day of messages for F&O traders from five teams, with a count by channel and the teams that send the most push"],
];

/** Plan, approve and protect, then the three screens that carry them. */
function How() {
  return (
    <div>
      <ol className="grid gap-x-8 md:grid-cols-3">
        {HOW.map(([k, h, p]) => (
          <li key={k} className="border-t border-ink pb-8 pt-5">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{k}</span>
            <h3 className="mt-5 text-2xl tracking-[-0.02em]">{h}</h3>
            <p className="mt-3 max-w-sm text-muted">{p}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 md:mt-14">
        <JarvisStage />
      </div>
      <div className="mt-14 grid gap-x-6 gap-y-12 md:mt-20 md:grid-cols-2 xl:grid-cols-3">
        {SCREENS.map(([src, h, p, alt]) => (
          <figure key={src} className="m-0">
            {/* the screen on a white laptop, cut out of its backdrop so it sits straight on the page; the fine shadow gives the white lid an edge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/${src}`} alt={alt} width={2800} height={1640} loading="lazy" className="block h-auto w-full [filter:drop-shadow(0_0_1px_rgba(15,30,60,0.28))_drop-shadow(0_28px_36px_rgba(15,30,60,0.12))]" />
            <figcaption className="mt-5 border-t border-line pt-4">
              <span className="block text-lg tracking-[-0.01em]">{h}</span>
              <span className="mt-1 block max-w-md text-muted">{p}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

const ROLES = [
  ["PM or marketer", "New request, their campaigns and a calendar of what their users will see"],
  ["Vertical head", "Requests waiting for their approval, all campaigns and results"],
  ["CRM", "Reviews, stop requests and what goes live this week"],
  ["Design", "Design reviews only, with checks for copy length, layout and accessibility"],
  ["Admin", "Rules, people and system health, in one settings area"],
];

function Roles() {
  return (
    <div>
      <p className="label">Who sees what</p>
      <dl className="mt-4">
        {ROLES.map(([who, what]) => (
          <div key={who} className="grid gap-x-6 gap-y-1 border-t border-line py-4 last:border-b sm:grid-cols-[10rem_1fr]">
            <dt>{who}</dt>
            <dd className="text-muted">{what}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const SECTIONS: { id: string; label: string; body: string[]; extra?: React.ReactNode; wide?: boolean }[] = [
  {
    id: "messages-problem",
    label: "The problem",
    body: [
      "Customers open the app to do something and we interrupt them several times first. Today one customer can get more than 10 messages from Upstox in a day.",
      "A new user sees several pop-ups and bottom sheets before they can act. On Home, banners, widgets and trending stocks compete for the same screen, much of it not relevant to that user.",
    ],
    extra: <Today />,
    wide: true,
  },
  {
    id: "messages-why",
    label: "Why it happens",
    body: ["Every team sends on its own."],
    extra: (
      <Rows
        label="Four causes"
        items={[
          ["No shared view of what’s live", "Teams can’t see which campaigns are already running for which users."],
          ["Audiences overlap", "The same customer is targeted by Product, Marketing, Revenue and CRM in the same week."],
          ["Approvals happen offline", "A quick nod from a vertical head, one campaign at a time, with no common rules or record."],
          ["Little shared learning", "Results aren’t compared in one place, so the next campaign starts from scratch."],
        ]}
      />
    ),
  },
  {
    id: "messages-proposal",
    label: "The proposal",
    body: ["One console where every message, in the app or as a notification, is planned, approved and measured. It is designed to feel lighter than today’s offline approval, not heavier."],
    extra: <How />,
    wide: true,
  },
  {
    id: "messages-roles",
    label: "Built around roles",
    body: ["Each person sees only their part."],
    extra: <Roles />,
  },
  {
    id: "messages-next",
    label: "Where it stands",
    body: ["Proposed in November 2026 to all senior leadership and stakeholders across four teams. It is now in testing within internal teams."],
  },
];

/** Five short sections: problem, cause, proposal, roles and where it stands. */
export function JarvisStory() {
  return (
    <div>
      {SECTIONS.map((s, i) => (
        <article key={s.id} id={s.id} className="grid gap-x-16 border-t border-ink pb-16 pt-8 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:pb-28 lg:gap-x-24">
          <div>
            <p className="label flex gap-4 !text-ink">
              <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </p>
          </div>
          <div>
            {s.body.map((p, k) =>
              k ? (
                <p key={k} data-fade className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted">{p}</p>
              ) : (
                <p key={k} data-fade className="mt-8 max-w-2xl text-[1.35rem] leading-[1.42] tracking-[-0.012em] md:mt-0 md:text-[1.7rem] md:leading-[1.38]">{p}</p>
              ),
            )}
            {s.extra && !s.wide ? <div data-fade className="mt-12 max-w-2xl">{s.extra}</div> : null}
          </div>
          {s.extra && s.wide ? <div data-fade className="mt-12 md:col-span-2 md:mt-16">{s.extra}</div> : null}
        </article>
      ))}
    </div>
  );
}
