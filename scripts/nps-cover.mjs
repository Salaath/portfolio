import fs from 'fs';
import { createRequire } from 'module';
import puppeteer from '/Users/admin/Case study/fig-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const require = createRequire('/Users/admin/Case study/portfolio-fable/package.json');
const sharp = require('sharp');
const OUT = process.argv[2];
const SCENE = '/Users/admin/Downloads/Mockups/scene_13_4e11298b10.avif';
const SCREEN = '/Users/admin/Case study/portfolio-fable/public/work/nps/explore.jpg';
const K = 2;
function homography(src, dst) {
  const A = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let i = 0; i < 8; i++) {
    let p = i; for (let r = i; r < 8; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]];
    for (let r = 0; r < 8; r++) if (r !== i) { const f = A[r][i] / A[i][i]; A[r] = A[r].map((c, k) => c - f * A[i][k]); }
  }
  const h = A.map((r, i) => r[8] / r[i]);
  return [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1];
}
const bilinear = (q, u, v) => {
  const a = [q[0][0] + (q[1][0] - q[0][0]) * u, q[0][1] + (q[1][1] - q[0][1]) * u];
  const b = [q[3][0] + (q[2][0] - q[3][0]) * u, q[3][1] + (q[2][1] - q[3][1]) * u];
  return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v];
};
function flood(W, H, seeds, pass) {
  const m = new Uint8Array(W * H); const st = [];
  for (const i of seeds) if (!m[i] && pass(i)) { m[i] = 1; st.push(i); }
  while (st.length) {
    const i = st.pop(), x = i % W;
    for (const n of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) if (n >= 0 && n < W * H && !m[n] && pass(n)) { m[n] = 1; st.push(n); }
  }
  return m;
}
function detect(gray, W, H, c) {
  const seeds = [];
  for (let v = 0.2; v <= 0.8; v += 0.02) for (let u = 0.2; u <= 0.8; u += 0.02) { const [x, y] = bilinear(c.quad, u, v); seeds.push(Math.round(y) * W + Math.round(x)); }
  const inside = flood(W, H, seeds, (i) => gray[i] > c.T);
  // fill text and the island: everything the outside can't reach
  const border = [];
  for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) border.push(y * W, y * W + W - 1);
  const outside = flood(W, H, border, (i) => !inside[i]);
  const filled = new Uint8Array(W * H);
  let area = 0; for (let i = 0; i < W * H; i++) if (!outside[i]) { filled[i] = 255; area++; }
  // refine each edge: march inward from outside the rough line, then fit a line through the hits
  const lines = [];
  const cx = c.quad.reduce((a, p) => a + p[0], 0) / 4, cy = c.quad.reduce((a, p) => a + p[1], 0) / 4;
  for (let e = 0; e < 4; e++) {
    const A = c.quad[e], B = c.quad[(e + 1) % 4];
    const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
    let nx = -dy / len, ny = dx / len;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    if ((cx - mx) * nx + (cy - my) * ny < 0) { nx = -nx; ny = -ny; } // n points inward
    const pts = [];
    for (let t = 0.25; t <= 0.75; t += 0.01) {
      const ox = A[0] + dx * t, oy = A[1] + dy * t;
      for (let d = -45; d <= 70; d += 0.5) {
        const x = Math.round(ox + nx * d), y = Math.round(oy + ny * d);
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        if (filled[y * W + x]) { pts.push([ox + nx * d, oy + ny * d]); break; }
      }
    }
    const n = pts.length, ax = pts.reduce((a, p) => a + p[0], 0) / n, ay = pts.reduce((a, p) => a + p[1], 0) / n;
    let sxx = 0, sxy = 0, syy = 0;
    for (const [x, y] of pts) { sxx += (x - ax) ** 2; sxy += (x - ax) * (y - ay); syy += (y - ay) ** 2; }
    const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    lines.push({ p: [ax, ay], d: [Math.cos(th), Math.sin(th)] });
  }
  const cross = (a, b) => {
    const det = a.d[0] * -b.d[1] + b.d[0] * a.d[1];
    const s = ((b.p[0] - a.p[0]) * -b.d[1] + b.d[0] * (b.p[1] - a.p[1])) / det;
    return [a.p[0] + a.d[0] * s, a.p[1] + a.d[1] * s];
  };
  const quad = [cross(lines[3], lines[0]), cross(lines[0], lines[1]), cross(lines[1], lines[2]), cross(lines[2], lines[3])];
  return { filled, area, quad };
}


const c = { quad: [[733, 300], [1144, 249], [1360, 1044], [944, 1111]], T: 70 };
const base = await sharp(SCENE).removeAlpha().png().toBuffer();
const { data: g, info } = await sharp(base).greyscale().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const { filled, area, quad } = detect(g, W, H, c);
console.log('quad', JSON.stringify(quad.map((p) => p.map((v) => +v.toFixed(1)))), 'area', area);
const m = homography([[0, 0], [720, 0], [720, 1600], [0, 1600]], quad);
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: K });
// square off the screenshot's own rounded corners so the phone's detected shape sets them
const sc = await sharp(SCREEN).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const SW = sc.info.width, SH = sc.info.height, px = sc.data;
const nav = [px[(1590 * SW + 360) * 3], px[(1590 * SW + 360) * 3 + 1], px[(1590 * SW + 360) * 3 + 2]];
for (const [x0, y0, col] of [[0, 0, [255, 255, 255]], [SW - 1, 0, [255, 255, 255]], [0, SH - 1, nav], [SW - 1, SH - 1, nav]]) {
  const R = 66, cx = x0 ? SW - 1 - R : R, cy = y0 ? SH - 1 - R : R;
  for (let y = 0; y <= R; y++) for (let x = 0; x <= R; x++) {
    const X = x0 ? SW - 1 - x : x, Y = y0 ? SH - 1 - y : y;
    if (Math.hypot(X - cx, Y - cy) < R - 4) continue;
    const k = (Y * SW + X) * 3; px[k] = col[0]; px[k + 1] = col[1]; px[k + 2] = col[2];
  }
}
const b64 = 'data:image/png;base64,' + (await sharp(px, { raw: { width: SW, height: SH, channels: 3 } }).png().toBuffer()).toString('base64');
await page.setContent(`<!doctype html><body style="margin:0;background:transparent"><div style="position:absolute;left:0;top:0;width:720px;height:1600px;transform-origin:0 0;transform:matrix3d(${m.join(',')})"><img src="${b64}" style="width:720px;height:1600px;display:block"/></div></body>`, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 400));
const warped = await page.screenshot({ type: 'png', omitBackground: true });
await browser.close();
fs.writeFileSync(OUT.replace('.jpg','-warp.png'), warped);
const BW = W * K, BH = H * K;
const mask = await sharp(Buffer.from(filled), { raw: { width: W, height: H, channels: 1 } }).resize(BW, BH, { kernel: 'cubic' }).blur(3.5).linear(5, -430).raw().toBuffer({resolveWithObject:true});
console.log(mask.info);
const rgba = await sharp(warped).ensureAlpha().raw().toBuffer();
for (let i = 0; i < BW * BH; i++) rgba[i * 4 + 3] = Math.min(rgba[i * 4 + 3], mask.data[i * mask.info.channels]);
const layer = await sharp(rgba, { raw: { width: BW, height: BH, channels: 4 } }).png().toBuffer();
const big = await sharp(base).resize(BW, BH, { kernel: 'lanczos3' }).sharpen({ sigma: 1.1, m1: 0.6, m2: 1.6 }).png().toBuffer();
const comp = await sharp(big).composite([{ input: layer }]).png().toBuffer();
await sharp(comp).resize(3200).modulate({ saturation: 1.08 }).linear(1.06, -6).sharpen({ sigma: 0.6 }).jpeg({ quality: 84, mozjpeg: true }).toFile(OUT);
await sharp(comp).extract({ left: 1300, top: 400, width: 1600, height: 1900 }).resize(800).jpeg().toFile(OUT.replace('.jpg', '-crop.jpg'));
