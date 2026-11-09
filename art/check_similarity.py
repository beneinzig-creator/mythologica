#!/usr/bin/env python3
"""Flag card pictures that look too alike, within each group (an archetype, or one opponent's deck).

    python3 art/check_similarity.py                 # current art
    python3 art/check_similarity.py --dir art/archive/v1   # an older set, for comparison

Every picture is shrunk to a tiny thumbnail (macOS sips) and compared two ways:
  layout  - correlation of the brightness pattern (where the light and dark shapes sit), 0..1
  colour  - average colour difference per pixel, 0..255 (lower = more alike)
A pair is flagged when the palettes are nearly identical (colour <= --twin), or when the layout is
similar AND the colours are close; either makes two cards hard to tell apart at a glance. Measured on
the first art set: the three Siren cards that looked alike scored colour 17-20, layout only ~0.3.
(The planner in composition.py does the real work: different shot, angle and light per card; this
check catches what slips through.) Python standard library + sips only.
"""
import argparse, json, math, os, struct, subprocess, sys, tempfile

ART = os.path.dirname(os.path.abspath(__file__))
W, H = 24, 16


def thumb(path, tmp):
    out = os.path.join(tmp, os.path.basename(path) + '.bmp')
    subprocess.run(['sips', '-s', 'format', 'bmp', '-z', str(H), str(W), path, '--out', out], check=True, capture_output=True)
    b = open(out, 'rb').read()
    off, = struct.unpack_from('<I', b, 10)
    w, h = struct.unpack_from('<ii', b, 18)
    bpp, = struct.unpack_from('<H', b, 28)
    step, row, flip, h = bpp // 8, (w * (bpp // 8) + 3) & ~3, h > 0, abs(h)
    px = []
    for y in range(h):
        yy = h - 1 - y if flip else y
        for x in range(w):
            i = off + yy * row + x * step
            px.append((b[i + 2], b[i + 1], b[i]))
    return px


def layout_sim(a, b):
    ga = [0.3 * r + 0.59 * g + 0.11 * bl for r, g, bl in a]
    gb = [0.3 * r + 0.59 * g + 0.11 * bl for r, g, bl in b]
    ma, mb = sum(ga) / len(ga), sum(gb) / len(gb)
    da, db = [v - ma for v in ga], [v - mb for v in gb]
    num = sum(x * y for x, y in zip(da, db))
    den = math.sqrt(sum(x * x for x in da) * sum(y * y for y in db)) or 1
    return num / den


def colour_dist(a, b):
    return sum(abs(p - q) for pa, pb in zip(a, b) for p, q in zip(pa, pb)) / (3 * len(a))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hero', default='ody')
    ap.add_argument('--dir', default=None, help='folder of <id>.webp files (default: each card\'s output)')
    ap.add_argument('--twin', type=float, default=21, help='flag when colour difference is at most this (same palette)')
    ap.add_argument('--layout', type=float, default=0.60, help='or when layout similarity is at least this ...')
    ap.add_argument('--colour', type=float, default=32, help='... and colour difference is at most this')
    ap.add_argument('--top', type=int, default=0, help='also list the N most similar pairs overall')
    a = ap.parse_args()
    hero = json.load(open(os.path.join(ART, 'manifest.json'), encoding='utf-8'))['heroes'][a.hero]
    groups = {}
    for cid, c in hero['cards'].items():
        groups.setdefault(c['archetype'], []).append((cid, c))
    for cid, c in (hero.get('opponents') or {}).items():
        groups.setdefault(c['opponent'], []).append((cid, c))
    flagged, allpairs = [], []
    with tempfile.TemporaryDirectory() as tmp:
        for g, members in groups.items():
            th = {}
            for cid, c in members:
                p = os.path.join(a.dir, f'{cid}.webp') if a.dir else os.path.join(os.path.dirname(ART), c['output'])
                if os.path.exists(p):
                    th[cid] = thumb(p, tmp)
            ids = sorted(th)
            for i in range(len(ids)):
                for j in range(i + 1, len(ids)):
                    ls, cd = layout_sim(th[ids[i]], th[ids[j]]), colour_dist(th[ids[i]], th[ids[j]])
                    allpairs.append((ls - cd / 255, g, ids[i], ids[j], ls, cd))
                    if cd <= a.twin or (ls >= a.layout and cd <= a.colour):
                        flagged.append((g, ids[i], ids[j], ls, cd))
    for g, x, y, ls, cd in sorted(flagged, key=lambda t: -t[3]):
        print(f'TOO ALIKE  {g:28} {x:9} ~ {y:9}  layout {ls:.2f}  colour diff {cd:4.0f}')
    print(f'{len(flagged)} pairs flagged across {len(groups)} groups.')
    for s, g, x, y, ls, cd in sorted(allpairs, reverse=True)[:a.top]:
        print(f'   close: {g:28} {x:9} ~ {y:9}  layout {ls:.2f}  colour diff {cd:4.0f}')


if __name__ == '__main__':
    main()
