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
HERO_DIR = {'ody': 'odysseus', 'odin': 'odin', 'wukong': 'wukong', 'thoth': 'thoth', 'act3': 'act3', 'tsoul': 'tsoul'}

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
}, 'odin': {
    # Heights from the parchment bands found automatically; edges read from the frames (Nov 2026).
    'common':    {'name': (108, 86, 826, 158),  'cost': (834, 51, 968, 185),  'type': (102, 866, 922, 930),
                  'text': (100, 974, 925, 1374), 'pt': (794, 1336, 980, 1446)},
    'uncommon':  {'name': (72, 82, 824, 152),   'cost': (827, 49, 955, 177),  'type': (77, 856, 945, 920),
                  'text': (92, 946, 932, 1410), 'pt': (776, 1362, 968, 1464)},
    'rare':      {'name': (97, 63, 822, 120),   'cost': (824, 33, 937, 146),  'type': (97, 878, 927, 932),
                  'text': (113, 965, 911, 1382), 'pt': (740, 1339, 942, 1434)},
    'legendary': {'name': (72, 110, 830, 170),  'cost': (832, 77, 960, 205),  'type': (102, 843, 922, 904),
                  'text': (90, 939, 934, 1385), 'pt': (781, 1362, 978, 1467)},
}, 'wukong': {
    # Read from the frames by eye (Nov 2026); the parchment is too close to the gold for auto-detection.
    'common':    {'name': (130, 95, 830, 172),  'cost': (835, 78, 948, 190),  'type': (112, 872, 915, 945),
                  'text': (92, 975, 940, 1385), 'pt': (752, 1340, 955, 1408)},
    'uncommon':  {'name': (78, 68, 820, 150),   'cost': (832, 70, 950, 182),  'type': (100, 846, 895, 920),
                  'text': (88, 940, 940, 1395), 'pt': (768, 1360, 960, 1448)},
    'rare':      {'name': (95, 98, 830, 170),   'cost': (836, 85, 955, 190),  'type': (115, 868, 912, 940),
                  'text': (78, 960, 948, 1385), 'pt': (765, 1332, 972, 1422)},
    'legendary': {'name': (178, 112, 848, 185), 'cost': (862, 85, 985, 205),  'type': (140, 870, 885, 935),
                  'text': (72, 965, 955, 1350), 'pt': (768, 1328, 962, 1400)},
}, 'thoth': {
    # Read from the frames by eye (Nov 2026). Name and type boxes keep to the clear stretch of each bar, inside the
    # rounded ends and away from the papyrus capitals, cobras and ibis heads, so names never sit on the ornament.
    'common':    {'name': (105, 74, 818, 150),  'cost': (832, 72, 945, 165),  'type': (110, 868, 920, 934),
                  'text': (88, 962, 938, 1380), 'pt': (782, 1342, 975, 1432)},
    'uncommon':  {'name': (110, 108, 828, 180), 'cost': (840, 100, 938, 195), 'type': (110, 870, 920, 940),
                  'text': (100, 968, 930, 1385), 'pt': (775, 1342, 945, 1418)},
    'rare':      {'name': (90, 62, 855, 132),   'cost': (862, 55, 960, 145),  'type': (100, 872, 930, 935),
                  'text': (100, 950, 925, 1365), 'pt': (758, 1315, 960, 1395)},
    'legendary': {'name': (132, 120, 815, 188), 'cost': (828, 110, 918, 195), 'type': (130, 850, 900, 915),
                  'text': (130, 950, 895, 1335), 'pt': (775, 1290, 925, 1360)},
}, 'act3': {
    # Act III (shared by every hero), read from the frames by eye (Nov 2026). The Uncommon was generated without its
    # power plaque; one was painted in with a masked edit (uncommon.png) and measured here.
    'common':    {'name': (115, 62, 856, 135),  'cost': (866, 48, 972, 150),  'type': (138, 822, 886, 895),
                  'text': (80, 925, 948, 1375), 'pt': (762, 1340, 970, 1428)},
    'uncommon':  {'name': (115, 78, 818, 152),  'cost': (832, 62, 932, 162),  'type': (120, 842, 902, 912),
                  'text': (127, 940, 898, 1315), 'pt': (690, 1282, 920, 1365)},
    'rare':      {'name': (98, 138, 830, 205),  'cost': (838, 118, 938, 218), 'type': (128, 870, 898, 932),
                  'text': (132, 950, 893, 1388), 'pt': (735, 1335, 925, 1408)},
    'legendary': {'name': (90, 170, 862, 238),  'cost': (868, 160, 955, 245), 'type': (88, 858, 938, 930),
                  'text': (92, 940, 933, 1350), 'pt': (785, 1300, 950, 1380)},
}, 'tsoul': {
    # Thoth's Body (common slot), Spirit (uncommon slot) and Name (rare slot) frames, read by eye (Nov 2026). The
    # Spirit's name box stays clear of the soul-birds at both ends.
    'common':    {'name': (100, 70, 858, 140),  'cost': (868, 62, 980, 165), 'type': (95, 840, 938, 908),
                  'text': (92, 925, 938, 1320), 'pt': (812, 1318, 980, 1405)},
    'uncommon':  {'name': (185, 90, 722, 158),  'cost': (732, 82, 830, 172), 'type': (152, 868, 872, 940),
                  'text': (90, 955, 934, 1410), 'pt': (775, 1360, 970, 1448)},
    'rare':      {'name': (132, 104, 792, 186), 'cost': (800, 92, 915, 195), 'type': (108, 840, 922, 910),
                  'text': (120, 925, 903, 1368), 'pt': (742, 1322, 925, 1395)},
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


def find_circle(w, h, get, box, thr=135):
    """Flood-fill the light parchment inside the cost medallion from the middle of its box.
    Returns (cx, cy, diameter) in pixels of the painted circle's inner fill."""
    x0, y0, x1, y1 = box
    mx, my = (x1 - x0) // 3, (y1 - y0) // 3
    lim = (max(0, x0 - mx), max(0, y0 - my), min(w, x1 + mx), min(h, y1 + my))
    lum = lambda x, y: sum(get(x, y)) / 3
    sx, sy = (x0 + x1) // 2, (y0 + y1) // 2
    seen, stack = set(), [(sx, sy)]
    while stack:
        x, y = stack.pop()
        if (x, y) in seen or not (lim[0] <= x < lim[2] and lim[1] <= y < lim[3]) or lum(x, y) < thr:
            continue
        seen.add((x, y))
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    if len(seen) < 200 and thr > 70:
        # darker medallions (e.g. Act III's bronze Common) fall below the parchment threshold
        return find_circle(w, h, get, box, thr - 30)
    xs, ys = [p[0] for p in seen], [p[1] for p in seen]
    return (min(xs) + max(xs) + 1) / 2, (min(ys) + max(ys) + 1) / 2, ((max(xs) - min(xs) + 1) + (max(ys) - min(ys) + 1)) / 2


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
            if os.path.exists(src[:-5] + '.png'):  # a frame touched up locally is kept as PNG (no webp encoder here)
                src = src[:-5] + '.png'
            if not os.path.exists(src):
                print(f'skip {r}: no frame image yet')
                continue
            bmp = os.path.join(tmp, f'{r}.bmp')
            subprocess.run(['sips', '-s', 'format', 'bmp', src, '--out', bmp], check=True, capture_output=True)
            w, h, get = read_bmp(bmp)
            art = find_black(w, h, get)
            boxes = {'art': pct(art, w, h)}
            cx, cy, d = find_circle(w, h, get, MANUAL[hero][r]['cost'])
            boxes['costc'] = [round(100 * cx / w, 2), round(100 * cy / h, 2), round(100 * d / w, 2)]
            print(f'{r:10} cost circle centre ({cx:.0f},{cy:.0f}) diameter {d:.0f}px')
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
                cx2, cy2, d2 = find_circle(w2, h2, get2, MANUAL[hero][r]['cost'])
                b2['costc'] = [round(100 * cx2 / w2, 2), round(100 * cy2 / h2, 2), round(100 * d2 / w2, 2)]
                b2['art'] = pct(art2, w2, h2)
                out[f'{r}_spell'] = b2
                print(f'{r + "_spell":10} art window {art2}')
    with open(os.path.join(FR, 'layout.json'), 'w') as f:
        json.dump(out, f, indent=1)
        f.write('\n')
    print(f'Wrote {os.path.relpath(FR, os.path.dirname(ART))}/layout.json')


if __name__ == '__main__':
    main()
