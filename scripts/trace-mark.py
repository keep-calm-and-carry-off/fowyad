"""Vector-trace the original FOWYAD mark. Letter shapes stay the source pixels; only the color flips to light so the mark reads on the dark site."""

import numpy as np
import cv2
from PIL import Image
from potrace import Bitmap

SOURCE = r"C:\Users\skipe\.cursor\projects\c-rzserver-ECLIPSE\assets\image-71622d9d-496f-4f68-9177-3413393bdb35.png"
SCALE = 10
LETTER = "#f4f1ea"
RED = "#c4160c"


def point(value):
    if hasattr(value, "x"):
        return float(value.x), float(value.y)
    return float(value[0]), float(value[1])


def curve_path(curve):
    start = point(curve.start_point)
    commands = [f"M{start[0]:.2f} {start[1]:.2f}"]
    for segment in curve:
        end = point(segment.end_point)
        if segment.is_corner:
            corner = point(segment.c)
            commands.append(f"L{corner[0]:.2f} {corner[1]:.2f} L{end[0]:.2f} {end[1]:.2f}")
        else:
            c1 = point(segment.c1)
            c2 = point(segment.c2)
            commands.append(
                f"C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {end[0]:.2f} {end[1]:.2f}"
            )
    commands.append("Z")
    return " ".join(commands)


def trace_mask(mask):
    # Bitmap flips its input once, so the ink has to be passed inverted.
    bitmap = Bitmap(np.ascontiguousarray(~mask))
    curves = bitmap.trace(turdsize=SCALE * 4, alphamax=1.2, opticurve=True, opttolerance=0.8)
    return " ".join(curve_path(curve) for curve in curves if curve.start_point is not None)


def save_piece(mask, path, color):
    ys, xs = np.where(mask)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    sub = mask[y0 : y1 + 1, x0 : x1 + 1]
    image = np.zeros((sub.shape[0], sub.shape[1], 4), dtype=np.uint8)
    image[sub, 0] = color[0]
    image[sub, 1] = color[1]
    image[sub, 2] = color[2]
    image[sub, 3] = 255
    Image.fromarray(image).save(path)


def save_pieces(letters, red):
    count, labels, stats, _ = cv2.connectedComponentsWithStats(red.astype(np.uint8), 8)
    order = sorted(range(1, count), key=lambda index: stats[index, cv2.CC_STAT_AREA], reverse=True)
    save_piece(labels == order[0], r"C:\rzserver\fowyad\scripts\piece-swoosh.png", (196, 22, 12))
    bars = np.zeros(red.shape, dtype=bool)
    for index in order[1:]:
        bars |= labels == index
    save_piece(bars, r"C:\rzserver\fowyad\scripts\piece-bars.png", (196, 22, 12))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(letters.astype(np.uint8), 8)
    mark_o = np.zeros(letters.shape, dtype=bool)
    for index in range(1, count):
        center = stats[index, cv2.CC_STAT_LEFT] + stats[index, cv2.CC_STAT_WIDTH] / 2
        if 500 <= center <= 1150:
            mark_o |= labels == index
    save_piece(mark_o, r"C:\rzserver\fowyad\scripts\piece-o.png", (244, 241, 234))


def main():
    source = np.array(Image.open(SOURCE).convert("RGB"))
    height, width = source.shape[:2]
    luminance = source.mean(axis=2)
    red = (source[:, :, 0] > 140) & (source[:, :, 1] < 120) & (source[:, :, 0] > source[:, :, 1] + 30)
    letters = (luminance < 165) & ~red
    def smooth(mask, sigma):
        big = cv2.resize(mask.astype(np.uint8) * 255, (width * SCALE, height * SCALE), interpolation=cv2.INTER_NEAREST)
        blurred = cv2.GaussianBlur(big, (0, 0), sigma)
        return blurred > 127

    red_big = smooth(red, 18)
    letter_big = smooth(letters, 18)
    # The ® is a two-pixel stroke. The letter blur erases it, so it is restored from a lighter pass.
    light = smooth(letters, 5)
    y1 = 32 * SCALE
    x0 = 300 * SCALE
    window = np.zeros(light.shape, dtype=np.uint8)
    window[:y1, x0:] = light[:y1, x0:]
    count, labels, stats, _ = cv2.connectedComponentsWithStats(window, 8)
    letter_big[:y1, x0:] = False
    if count > 1:
        mark = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        letter_big[labels == mark] = True
    save_pieces(letter_big, red_big)
    letters_d = trace_mask(letter_big)
    red_d = trace_mask(red_big)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width * SCALE} {height * SCALE}">
  <path fill="{LETTER}" fill-rule="evenodd" d="{letters_d}"/>
  <path fill="{RED}" fill-rule="evenodd" d="{red_d}"/>
</svg>
"""
    with open(r"C:\rzserver\fowyad\public\logo.svg", "w", encoding="utf-8") as handle:
        handle.write(svg)
    print("wrote logo.svg", width * SCALE, height * SCALE)


if __name__ == "__main__":
    main()
