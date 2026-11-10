import sharp from "sharp";

const names = ["livery-side", "livery-hood", "livery-rear", "livery-spray"];

for (const name of names) {
  const input = `public/${name}.png`;
  const output = `public/${name}.webp`;
  await sharp(input).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(name, meta.width, meta.height);
}
