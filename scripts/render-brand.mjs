import sharp from "sharp";
import { writeFileSync } from "node:fs";

const CREAM = "#f4f1ea";
const INK = "#14161a";

await sharp("public/logo.svg").resize({ width: 2400 }).png().toFile("public/logo.png");
await sharp("public/logo.png").webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile("public/logo.webp");
console.log("logo raster ready");

const swoosh = await sharp("scripts/piece-swoosh.png").resize({ width: 780 }).png().toBuffer();
const oMark = await sharp("scripts/piece-o.png").resize({ width: 400 }).png().toBuffer();
const bars = await sharp("scripts/piece-bars.png").resize({ width: 230 }).png().toBuffer();
const disc = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <circle cx="512" cy="512" r="500" fill="${CREAM}"/>
  <circle cx="512" cy="512" r="458" fill="${INK}"/>
</svg>`);
const swooshMeta = await sharp(swoosh).metadata();
const oMeta = await sharp(oMark).metadata();
const barsMeta = await sharp(bars).metadata();
await sharp(disc)
  .composite([
    { input: swoosh, left: Math.round((1024 - swooshMeta.width) / 2), top: 150 },
    { input: oMark, left: 175, top: 1024 - 175 - oMeta.height },
    { input: bars, left: 1024 - 175 - barsMeta.width, top: 1024 - 210 - barsMeta.height },
  ])
  .png()
  .toFile("public/badge.png");
console.log("badge ready");

const icon = await sharp("public/badge.png")
  .resize(430, 430)
  .flatten({ background: "#070708" })
  .extend({ top: 41, bottom: 41, left: 41, right: 41, background: "#070708" })
  .png()
  .toBuffer();
await sharp(icon).resize(512, 512).png().toFile("src/app/icon.png");
await sharp(icon).resize(180, 180).png().toFile("src/app/apple-icon.png");

function ico(pngs) {
  const count = pngs.length;
  const header = 6 + count * 16;
  let offset = header;
  const entries = [];
  const images = [];
  for (const png of pngs) {
    const size = png.width >= 256 ? 0 : png.width;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(png.data);
    offset += png.data.length;
  }
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);
  return Buffer.concat([dir, ...entries, ...images]);
}

const pngs = [];
for (const size of [16, 32, 48]) {
  pngs.push({ width: size, data: await sharp(icon).resize(size, size).ensureAlpha().png().toBuffer() });
}
writeFileSync("src/app/favicon.ico", ico(pngs));
console.log("icons ready");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#070708"/>
  <rect width="10" height="630" fill="#ff3b30"/>
  <radialGradient id="glow" cx="78%" cy="42%" r="48%">
    <stop offset="0%" stop-color="#ff3b30" stop-opacity="0.38"/>
    <stop offset="100%" stop-color="#ff3b30" stop-opacity="0"/>
  </radialGradient>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="72" y="168" fill="#9c978e" font-family="Segoe UI" font-size="22" letter-spacing="8">РОССИЯ</text>
  <text x="72" y="248" fill="#f4f1ea" font-family="Segoe UI" font-weight="700" font-size="64">Фары и кузовные</text>
  <text x="72" y="324" fill="#f4f1ea" font-family="Segoe UI" font-weight="700" font-size="64">детали</text>
  <rect x="72" y="360" width="92" height="6" fill="#ff3b30"/>
  <text x="72" y="420" fill="#f4f1ea" font-family="Segoe UI" font-size="32">Для Opel и Vauxhall</text>
</svg>`;

const logoCard = await sharp("public/logo.png").resize({ width: 620 }).png().toBuffer();
const badgeCard = await sharp("public/badge.png").resize(340, 340).png().toBuffer();
await sharp(Buffer.from(og))
  .composite([
    { input: logoCard, left: 72, top: 450 },
    { input: badgeCard, left: 790, top: 145 },
  ])
  .jpeg({ quality: 90 })
  .toFile("public/og.jpg");
console.log("og ready");
