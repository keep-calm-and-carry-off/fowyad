import { createRequire } from "node:module";

const require = createRequire("file:///C:/rzserver/fowyad/package.json");
const sharp = require("sharp");

let seed = 20261109;
function rand() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
}

const RED = [232, 36, 32];
const WHITE = [244, 244, 242];

function createCanvas(width, height) {
  const image = Buffer.alloc(width * height * 4);
  function paint(x, y, r, g, b, a) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= width || py >= height || a <= 1) return;
    const index = (py * width + px) * 4;
    const srcA = Math.min(1, a / 255);
    const dstA = image[index + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA <= 0) return;
    image[index] = Math.round((r * srcA + image[index] * dstA * (1 - srcA)) / outA);
    image[index + 1] = Math.round((g * srcA + image[index + 1] * dstA * (1 - srcA)) / outA);
    image[index + 2] = Math.round((b * srcA + image[index + 2] * dstA * (1 - srcA)) / outA);
    image[index + 3] = Math.round(outA * 255);
  }
  function dot(x, y, radius, r, g, b, a) {
    const rad = Math.ceil(radius);
    for (let dy = -rad; dy <= rad; dy += 1) {
      for (let dx = -rad; dx <= rad; dx += 1) {
        const dist = Math.hypot(dx, dy);
        if (dist > radius) continue;
        paint(x + dx, y + dy, r, g, b, a * (1 - dist / (radius + 0.35)));
      }
    }
  }
  function mist(cx, cy, rx, ry, r, g, b, alpha) {
    for (let y = -ry; y <= ry; y += 1) {
      for (let x = -rx; x <= rx; x += 1) {
        const ellipse = (x * x) / (rx * rx) + (y * y) / (ry * ry);
        if (ellipse > 1) continue;
        const falloff = 1 - ellipse;
        paint(cx + x, cy + y, r, g, b, alpha * falloff * falloff);
      }
    }
  }
  function streak(x0, y0, x1, y1, radius, r, g, b, alpha) {
    const length = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(length));
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const wobble = Math.sin(t * 18) * radius * 0.35;
      dot(x0 + (x1 - x0) * t + wobble, y0 + (y1 - y0) * t, radius * (0.55 + 0.6 * (1 - Math.abs(t - 0.5) * 1.4)), r, g, b, alpha);
    }
  }
  return { image, paint, dot, mist, streak, width, height };
}

async function loadLogo(width) {
  const meta = await sharp("C:/rzserver/fowyad/public/logo.png").metadata();
  const height = Math.max(1, Math.round(meta.height * (width / meta.width)));
  return sharp("C:/rzserver/fowyad/public/logo.png").resize(width, height).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function stampLogo(canvas, logo, offsetX, offsetY, splatter) {
  const drawW = logo.info.width;
  const drawH = logo.info.height;
  const left = offsetX;
  const top = offsetY;
  for (let y = 0; y < drawH; y += 1) {
    for (let x = 0; x < drawW; x += 1) {
      const source = (y * drawW + x) * 4;
      const alpha = logo.data[source + 3];
      if (alpha < 16) continue;
      const px = left + x;
      const py = top + y;
      const red = logo.data[source] > 150 && logo.data[source + 1] < 100;
      canvas.paint(px, py, logo.data[source], logo.data[source + 1], logo.data[source + 2], alpha);
      if (splatter && rand() < 0.045) {
        const angle = rand() * Math.PI * 2;
        const jitter = 4 + rand() * 14;
        canvas.dot(
          px + Math.cos(angle) * jitter,
          py + Math.sin(angle) * jitter,
          0.7 + rand() * 1.6,
          red ? RED[0] : WHITE[0],
          red ? RED[1] : WHITE[1],
          red ? RED[2] : WHITE[2],
          80 + rand() * 110,
        );
      }
      const below = y + 1 < drawH ? logo.data[((y + 1) * drawW + x) * 4 + 3] : 0;
      if (splatter && below < 16 && rand() < 0.018) {
        const drip = 10 + Math.floor(rand() * 36);
        for (let step = 1; step <= drip; step += 1) {
          canvas.paint(
            px + Math.sin(step * 0.4) * 0.6,
            py + step,
            logo.data[source],
            logo.data[source + 1],
            logo.data[source + 2],
            alpha * (1 - step / drip) * 0.8,
          );
        }
      }
    }
  }
  return { left, top, drawW, drawH };
}

function sprayField(canvas, cx, cy, spread) {
  for (let i = 0; i < 70; i += 1) {
    const angle = rand() * Math.PI * 2;
    const dist = Math.pow(rand(), 0.55) * spread;
    const red = rand() > 0.42;
    canvas.dot(
      cx + Math.cos(angle) * dist,
      cy + Math.sin(angle) * dist * 0.72,
      1.2 + rand() * 3.4,
      red ? RED[0] : WHITE[0],
      red ? RED[1] : WHITE[1],
      red ? RED[2] : WHITE[2],
      50 + rand() * 90,
    );
  }
}

async function save(canvas, name) {
  await sharp(canvas.image, { raw: { width: canvas.width, height: canvas.height, channels: 4 } })
    .png()
    .toFile(`C:/rzserver/fowyad/public/${name}.png`);
  console.log(name, canvas.width, canvas.height);
}

const side = createCanvas(1800, 760);
side.mist(900, 340, 760, 250, RED[0], RED[1], RED[2], 42);
side.streak(180, 560, 1620, 590, 7, RED[0], RED[1], RED[2], 150);
side.streak(260, 180, 1500, 150, 3.5, WHITE[0], WHITE[1], WHITE[2], 90);
sprayField(side, 900, 360, 780);
stampLogo(side, await loadLogo(1460), 170, 175, false);
await save(side, "livery-side");

const hood = createCanvas(1500, 900);
hood.mist(750, 430, 640, 340, RED[0], RED[1], RED[2], 50);
hood.streak(120, 250, 1380, 210, 8, RED[0], RED[1], RED[2], 130);
hood.streak(180, 700, 1320, 760, 5, WHITE[0], WHITE[1], WHITE[2], 80);
sprayField(hood, 750, 460, 680);
stampLogo(hood, await loadLogo(1180), 160, 230, true);
await save(hood, "livery-hood");

const rear = createCanvas(1700, 620);
rear.mist(850, 280, 700, 210, RED[0], RED[1], RED[2], 46);
rear.streak(140, 470, 1560, 500, 6, RED[0], RED[1], RED[2], 140);
sprayField(rear, 850, 300, 700);
stampLogo(rear, await loadLogo(1360), 170, 110, true);
await save(rear, "livery-rear");

const spray = createCanvas(720, 720);
spray.mist(360, 340, 250, 210, RED[0], RED[1], RED[2], 70);
spray.streak(80, 180, 640, 260, 16, RED[0], RED[1], RED[2], 160);
spray.streak(140, 420, 600, 390, 6, WHITE[0], WHITE[1], WHITE[2], 120);
for (let i = 0; i < 90; i += 1) {
  const angle = rand() * Math.PI * 2;
  const dist = rand() * 280;
  const red = rand() > 0.5;
  spray.dot(
    360 + Math.cos(angle) * dist,
    340 + Math.sin(angle) * dist,
    1 + rand() * 4,
    red ? RED[0] : WHITE[0],
    red ? RED[1] : WHITE[1],
    red ? RED[2] : WHITE[2],
    70 + rand() * 120,
  );
}
for (let i = 0; i < 8; i += 1) {
  const x = 180 + rand() * 360;
  const drip = 24 + rand() * 70;
  for (let step = 0; step < drip; step += 1) {
    spray.paint(x, 460 + step, RED[0], RED[1], RED[2], 140 * (1 - step / drip));
  }
}
await save(spray, "livery-spray");
