/**
 * One-off asset preparation.
 *
 * Generates responsive AVIF/WebP/JPEG variants of the source portrait plus a
 * social-sharing (Open Graph) image. Run with `npm run images` after replacing
 * a source file in src/assets/images/. Output is committed, so `sharp` is only
 * ever a development dependency and never ships to the browser.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'src/assets/images/portrait-original.jpg';
const OUT = 'public/media';
const WIDTHS = [400, 640, 900];

await mkdir(OUT, { recursive: true });

const base = sharp(SRC).rotate();
const { width, height } = await base.metadata();
console.log(`source: ${width}x${height}`);

for (const w of WIDTHS) {
  // 4:5 portrait crop, biased toward the top so the face is never cut off.
  const pipeline = () =>
    sharp(SRC)
      .rotate()
      .resize({
        width: w,
        height: Math.round(w * 1.25),
        fit: 'cover',
        position: sharp.strategy.attention,
      });

  await pipeline().avif({ quality: 50, effort: 8 }).toFile(path.join(OUT, `portrait-${w}.avif`));
  await pipeline().webp({ quality: 72, effort: 6 }).toFile(path.join(OUT, `portrait-${w}.webp`));
  await pipeline().jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, `portrait-${w}.jpg`));
  console.log(`  wrote portrait-${w}.{avif,webp,jpg}`);
}

// A tiny blurred placeholder, inlined as a data URI to avoid an extra request.
const blur = await sharp(SRC).rotate().resize(20, 25, { fit: 'cover' }).webp({ quality: 40 }).toBuffer();
console.log(`\nblur placeholder (${blur.length}B):`);
console.log(`data:image/webp;base64,${blur.toString('base64')}`);

// Open Graph card: 1200x630, portrait composited on the near-black brand
// background so link previews match the site rather than showing a bare crop.
const portraitLayer = await sharp(SRC)
  .rotate()
  .resize({ width: 500, height: 630, fit: 'cover', position: sharp.strategy.attention })
  .toBuffer();

// Soft blue vignette + typography, drawn as SVG so no font files are needed
// beyond the system stack the renderer already has.
const textLayer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="20%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#00BFFF" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#00BFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#030507" stop-opacity="1"/>
      <stop offset="62%" stop-color="#030507" stop-opacity="1"/>
      <stop offset="100%" stop-color="#030507" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="940" height="630" fill="url(#fade)"/>
  <g font-family="Segoe UI, Helvetica Neue, Arial, sans-serif">
    <text x="80" y="250" fill="#00BFFF" font-size="19" letter-spacing="4.5" font-weight="600">SANDEEPKUMAR S</text>
    <text x="78" y="330" fill="#F5F9FF" font-size="60" font-weight="700" letter-spacing="-1.6">Web Developer</text>
    <text x="78" y="398" fill="#F5F9FF" font-size="60" font-weight="700" letter-spacing="-1.6">&amp; AI/ML Enthusiast</text>
    <text x="80" y="462" fill="#9AA7B4" font-size="23">Undergraduate IT student, Coimbatore</text>
  </g>
  <rect x="80" y="500" width="54" height="2" fill="#00BFFF"/>
</svg>`);

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#030507' },
})
  .composite([
    { input: portraitLayer, left: 700, top: 0 },
    { input: textLayer, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OUT, 'og-image.jpg'));
console.log('wrote og-image.jpg');
