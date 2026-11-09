#!/usr/bin/env python3
"""Find where things sit on each card frame and write art/frames/layout.json.

    python3 art/measure_frames.py              # Odysseus
    python3 art/measure_frames.py --hero odin  # once Odin has frames

The art window is found automatically: it's the big solid-black rectangle the
frame prompt asks for. The title bar, cost medallion, type bar, rules box and
power/health plaque come from MANUAL below. They were measured by eye from the
generated frames, so re-check them if a frame is regenerated.
All boxes are stored as percentages of the frame (left, top, width, height),
which is what CSS needs to place things on a card of any size.
Uses only Python and macOS `sips`.
"""
import argparse, json, os, struct, subprocess, sys, tempfile

ART = os.path.dirname(os.path.abspath(__file__))
HERO_DIR = {'ody': 'odysseus', 'odin': 'odin', 'wukong': 'wukong'}

# x0, y0, x1, y1 in pixels on the 1024x1536 frame
MANUAL = {'ody': {
    'common':    {'name': (70, 78, 858, 155),  'cost': (858, 62, 968, 168),  'type': (78, 868, 948, 945),
                  'text': (86, 962, 940, 1420), 'pt': (792, 1368, 972, 1455)},
    'uncommon':  {'name': (75, 62, 860, 152),  'cost': (858, 58, 950, 160),  'type': (72, 868, 948, 945),
                  'text': (75, 960, 948, 1408), 'pt': (790, 1362, 950, 1450)},
    'rare':      {'name': (88, 78, 830, 152),  'cost': (832, 52, 945, 172),  'type': (68, 876, 958, 946),
                  'text': (90, 962, 935, 1398), 'pt': (764, 1350, 958, 1438)},
    'legendary': {'name': (78, 88, 852, 165),  'cost': (852, 75, 965, 188),  'type': (62, 852, 968, 935),
                  'text': (70, 948, 955, 1418), 'pt': (782, 1370, 968, 1445)},
}}


def read_bmp(path):
    """Decode the 24/32-bit BMP that sips writes. Returns (w, h, get(x, y) -> (r, g, b))."""
    b = open(path, 'rb').read()
    off, = struct.unpack_from('<I', b, 10)
    w, h = struct.unpack_from('<ii', b, 18)
    bpp, = struct.unpack_from('<H', b, 28)
    step = bpp // 8
    row = (w * step + 3) & ~3
    flip = h > 0
    h = abs(h)

    def get(x, y):
        yy = h - 1 - y if flip else y
        i = off + yy * row + x * step
        return b[i + 2], b[i + 1], b[i]
    return w, h, get


def find_black(w, h, get, thr=14):
    """Grow out from the centre-top area while rows/columns stay mostly black."""
    def dark(x, y):
        r, g, bl = get(x, y)
        return r < thr and g < thr and bl < thr
    cx, cy = w // 2, int(h * 0.33)
    if not dark(cx, cy):
        sys.exit('No black art window at the expected spot; check the frame image.')
    x0 = cx
    while x0 > 0 and dark(x0 - 1, cy):
        x0 -= 1
    x1 = cx
    while x1 < w - 1 and dark(x1 + 1, cy):
        x1 += 1
    y0 = cy
    while y0 > 0 and dark(cx, y0 - 1):
        y0 -= 1
    y1 = cy
    while y1 < h - 1 and dark(cx, y1 + 1):
        y1 += 1
    return x0, y0, x1 + 1, y1 + 1


def pct(box, w, h):
    x0, y0, x1, y1 = box
    return [round(100 * x0 / w, 2), round(100 * y0 / h, 2), round(100 * (x1 - x0) / w, 2), round(100 * (y1 - y0) / h, 2)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hero', default='ody')
    hero = ap.parse_args().hero
    if hero not in MANUAL:
        sys.exit(f'No frame measurements for {hero} yet.')
    FR = os.path.join(ART, 'frames', HERO_DIR.get(hero, hero))
    out = {'_note': 'Boxes are [left, top, width, height] in % of the frame. Made by art/measure_frames.py.'}
    with tempfile.TemporaryDirectory() as tmp:
        for r in MANUAL[hero]:
            src = os.path.join(FR, f'{r}.webp')
            if not os.path.exists(src):
                print(f'skip {r}: no frame image yet')
                continue
            bmp = os.path.join(tmp, f'{r}.bmp')
            subprocess.run(['sips', '-s', 'format', 'bmp', src, '--out', bmp], check=True, capture_output=True)
            w, h, get = read_bmp(bmp)
            art = find_black(w, h, get)
            boxes = {'art': pct(art, w, h)}
            boxes.update({k: pct(v, w, h) for k, v in MANUAL[hero][r].items()})
            out[r] = boxes
            print(f'{r:10} art window {art} of {w}x{h}')
            # Variant for spells/items/modifiers: same layout, no power/health plaque.
            sp = os.path.join(FR, f'{r}_spell.webp')
            if os.path.exists(sp):
                bmp2 = os.path.join(tmp, f'{r}_spell.bmp')
                subprocess.run(['sips', '-s', 'format', 'bmp', sp, '--out', bmp2], check=True, capture_output=True)
                w2, h2, get2 = read_bmp(bmp2)
                art2 = find_black(w2, h2, get2)
                b2 = {k: v for k, v in boxes.items() if k != 'pt'}
                b2['art'] = pct(art2, w2, h2)
                out[f'{r}_spell'] = b2
                print(f'{r + "_spell":10} art window {art2}')
    with open(os.path.join(FR, 'layout.json'), 'w') as f:
        json.dump(out, f, indent=1)
        f.write('\n')
    print(f'Wrote {os.path.relpath(FR, os.path.dirname(ART))}/layout.json')


if __name__ == '__main__':
    main()
