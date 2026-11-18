import type { Metadata } from "next";
import { MusePage } from "@/components/ai/MusePage";

const DESCRIPTION = "A private museum journal. The art I have seen in person, hung on a wall I can walk again.";

export const metadata: Metadata = {
  title: "Muse — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Muse: a private museum journal", description: DESCRIPTION, type: "article" },
};

export default function Page() {
  return <MusePage />;
}
