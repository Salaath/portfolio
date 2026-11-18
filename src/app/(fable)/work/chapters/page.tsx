import type { Metadata } from "next";
import { ProjectPage, type Project } from "@/components/ai/ProjectPage";

// Chapters as a motion showcase. Every clip is cut from Sal's own screen
// recordings of the app (24 Oct 2026); the copy only describes what they show.
// Keep the claims modest: spoiler controls by chapter and a recap that is a memory aid.

const DESCRIPTION = "My own reading library, with a companion that gets me back into a fantasy series between books.";

export const metadata: Metadata = {
  title: "Chapters — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Chapters: a reading library and fantasy companion", description: DESCRIPTION, type: "article" },
};

const V = "/work/ai/pages";

const CHAPTERS: Project = {
  title: "Chapters",
  kind: "iOS app",
  intro: DESCRIPTION,
  meta: ["Personal project", "iOS app with a web demo", "Designed and built with Claude Code"],
  demo: "https://chapters-web-five.vercel.app/",
  theme: { ground: "#f1f0ec", word: "#e3e2dd" },
  hero: { src: `${V}/chapters-fan.mp4?v=2`, label: "Chapters opening: a fan of book covers turns and dissolves into the Read shelf, then the Reading, DNF and Want shelves follow" },
  why: "I wanted my own version of Goodreads and a way back into the worlds I had left between books. So the shelves are mine and the story waits at the chapter where I stopped.",
  motions: {
    heading: "Four motions carry the app",
    body: "Type does most of the work in Chapters, so the motion is kept for the moments where something changes state.",
    items: [
      { name: "The cover", body: "Pick a book and its cover lifts off the shelf to head its own page.", clip: { src: `${V}/chapters-open.mp4`, label: "Tapping a book on the Read shelf: the cover grows into the book’s page and the details scroll" } },
      { name: "Spoiler Shield", body: "Drag to your chapter. The number blurs through the ones you pass and the hint below rewrites itself.", clip: { src: `${V}/chapters-shield.mp4`, label: "Spoiler Shield: dragging the chapter slider from 30 to 21 to 45" } },
      { name: "The scan", body: "Point the camera at a page. Names light up where they sit in the text, then line up below.", clip: { src: `${V}/chapters-scan.mp4`, label: "Scanning a printed page: names are highlighted, listed below, then the Spring Court page opens" } },
      { name: "The journey", body: "The book retold as seven steps across the map. Each step moves the marker and rewrites the caption beneath it.", clip: { src: `${V}/chapters-journey.mp4`, label: "Journey: stepping through six of the seven steps on the map of Prythian, from The Forest to Taken by Rhysand" } },
    ],
  },
  stage: {
    label: "The world",
    heading: "A map turns into a web of who knows whom",
    body: "Each place has a map, its lore and its characters. One tap redraws the map as the links between the people in it.",
    note: "Series recaps in the app are written by Claude as a memory aid.",
    clip: { src: `${V}/chapters-web.mp4`, label: "The Spring Court map switching to the Web tab and then the Characters tab" },
  },
  next: { title: "Muse", href: "/work/muse" },
};

export default function ChaptersPage() {
  return <ProjectPage p={CHAPTERS} />;
}
