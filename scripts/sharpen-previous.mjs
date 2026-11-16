// node scripts/sharpen-previous.mjs
// Makes the /hd copies of the Before Upstox stills used by the Fable page: each JPEG is
// enlarged 1.5× with Lanczos (cleaner than the browser's own upscaling on a 2× screen),
// lightly sharpened, and saved as a high-quality WebP. Video posters are left alone.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = "public/work/previous";
const out = path.join(dir, "hd");
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".jpg") || f.startsWith("vid-")) continue;
  const img = sharp(path.join(dir, f));
  const { width } = await img.metadata();
  await img
    .resize({ width: Math.round(width * 1.5), kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.6 })
    .webp({ quality: 88, effort: 5 })
    .toFile(path.join(out, f.replace(".jpg", ".webp")));
  console.log("ok", f);
}
