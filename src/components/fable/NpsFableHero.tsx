"use client";

import { NpsHero } from "@/components/nps/NpsHero";
import { ready } from "./Shell";

/** The NPS hero, held until the template's opening curtain has lifted. */
export function NpsFableHero() {
  return <NpsHero wait={ready} />;
}
