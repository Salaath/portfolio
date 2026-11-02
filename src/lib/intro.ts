"use client";

/**
 * The preloader plays once per full page load. Anything with an entrance
 * (hero, nav, sticky CTA) waits on this so nothing animates under the curtain.
 */
let resolve: () => void = () => {};
export const introDone: Promise<void> =
  typeof window === "undefined" ? Promise.resolve() : new Promise((r) => (resolve = r));

let played = false;
export const introPlayed = () => played;
export function finishIntro() {
  played = true;
  resolve();
}
