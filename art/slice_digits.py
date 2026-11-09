#!/usr/bin/env python3
"""Cut a generated numeral sheet (0-9 and '/', black ink on white, one row) into one image per glyph.

    python3 art/slice_digits.py art/digits/sheet_woodcut.png

Writes art/game/digits/0.png ... 9.png and slash.png: black glyphs whose transparency follows the
ink (worn edges kept), all cut to the same band so they share a baseline. The game uses them as CSS
masks, so each number can still take any colour (e.g. green when buffed, red when damaged).
Python standard library + macOS sips only.
"""
import os, struct, subprocess, sys, tempfile, zlib

ART = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ART, 'game', 'digits')
NAMES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'slash']


def load_gray(path):
    with tempfile.TemporaryDirectory() as t:
        bmp = os.path.join(t, 's.bmp')
        subprocess.run(['sips', '-s', 'format', 'bmp', path, '--out', bmp], check=True, capture_output=True)
        b = open(bmp, 'rb').read()
    off, = struct.unpack_from('<I', b, 10)
    w, h = struct.unpack_from('<ii', b, 18)
    bpp, = struct.unpack_from('<H', b, 28)
    step, row, flip, h = bpp // 8, (w * (bpp // 8) + 3) & ~3, h > 0, abs(h)
    g = []
    for y in range(h):
        yy = h - 1 - y if flip else y
        base = off + yy * row
        g.append([(b[base + x * step + 2] * 30 + b[base + x * step + 1] * 59 + b[base + x * step] * 11) // 100 for x in range(w)])
    return w, h, g


def write_png(path, w, h, alpha_rows):
    raw = b''.join(b'\x00' + b''.join(bytes((0, 0, 0, a)) for a in row) for row in alpha_rows)

    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
                           + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def main(sheet):
    w, h, g = load_gray(sheet)
    ink = lambda v: v < 128
    rows = [y for y in range(h) if any(ink(v) for v in g[y])]
    top, bot = rows[0], rows[-1]
    cols = [any(ink(g[y][x]) for y in range(top, bot + 1)) for x in range(w)]
    spans, x = [], 0
    while x < w:
        if cols[x]:
            s = x
            while x < w and cols[x]:
                x += 1
            spans.append([s, x])
        x += 1
    # merge specks that sit within a few pixels of a glyph
    merged = []
    for s in spans:
        if merged and s[0] - merged[-1][1] < 12:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    merged = [s for s in merged if s[1] - s[0] > 8]
    if len(merged) != len(NAMES):
        sys.exit(f'Expected {len(NAMES)} glyphs, found {len(merged)}: {merged}')
    os.makedirs(OUT, exist_ok=True)
    pad = 6
    y0, y1 = max(0, top - pad), min(h, bot + 1 + pad)
    for name, (s, e) in zip(NAMES, merged):
        x0, x1 = max(0, s - pad), min(w, e + pad)
        alpha = [[0 if v > 215 else 255 if v < 70 else int((215 - v) * 255 / 145) for v in g[y][x0:x1]] for y in range(y0, y1)]
        write_png(os.path.join(OUT, f'{name}.png'), x1 - x0, y1 - y0, alpha)
    print(f'Wrote {len(NAMES)} glyphs, band {y1 - y0}px tall, widths ' + ' '.join(str(e - s) for s, e in merged))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ART, 'digits', 'sheet_woodcut.png'))
