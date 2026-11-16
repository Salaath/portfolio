import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A separate build folder per dev server (NEXT_DIST_DIR) so parallel servers
  // on this project don't overwrite each other's cache. Default stays .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
