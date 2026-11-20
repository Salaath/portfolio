import cv from "./cv.json";

// Contact links, defined once. The email and LinkedIn handle come from the CV
// (cv.json), so the site and the résumé always agree.
export const EMAIL = cv.email;
/** Shown on the site only; the CV keeps its own copy. */
export const PHONE = "+91 8652711381";
export const TEL = "tel:+918652711381";
export const MAILTO = `mailto:${cv.email}`;
export const LINKEDIN_URL = `https://www.${cv.linkedin}`;
/** The one-page résumé PDF in public/. */
export const RESUME_PDF = "/resume.pdf";
