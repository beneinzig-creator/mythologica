#!/usr/bin/env python3
"""Fit each regular enemy's base life to hit fight-1 and mid-run targets.
usage: fit.py HTML N PATCHFILE [--deltas -2,0,2] [--t1 33] [--tm 28] [--wm 3] [--heroes ...]
For every regular enemy: run fight 1 (starter deck) and mid-run (banked decks, fights 2-4) at base life + each delta,
fit a straight line per measure, and pick the integer life minimising (f1-t1)^2 + wm*(mid-tm)^2."""
import argparse, json, re
from concurrent.futures import ThreadPoolExecutor
import matrix as M

ap = argparse.ArgumentParser()
ap.add_argument('html'); ap.add_argument('n', type=int); ap.add_argument('patch')
ap.add_argument('--deltas', default='-2,0,2'); ap.add_argument('--t1', type=float, default=33); ap.add_argument('--tm', type=float, default=28)
ap.add_argument('--wm', type=float, default=3); ap.add_argument('--heroes', default='ody,odin,wukong'); ap.add_argument('--out', default='bal/fit.json')
a = ap.parse_args()
P = open(a.patch).read()
# current base life per enemy, read from the patch (falls back to 15)
def base_life(h, i):
    m = re.findall(r'CHARS\.%s\.en\[%d\]\.l=(\d+);' % (h, i), P)
    return int(m[-1]) if m else 15
D = [int(x) for x in a.deltas.split(',')]
J = []
for h in a.heroes.split(','):
    for i in range(6):
        L0 = base_life(h, i)
        for d in D:
            ex = f"CHARS.{h}.en[{i}].l={L0+d};"
            J.append(dict(label=f'{h} {i} {L0+d} f1', CHAR=h, OPP=str(i), extra=ex, h=h, i=i, L=L0+d, kind='f1'))
            J.append(dict(label=f'{h} {i} {L0+d} mid', CHAR=h, OPP=str(i), bank='mid', extra=ex, h=h, i=i, L=L0+d, kind='mid'))
with ThreadPoolExecutor(10) as ex:
    R = list(ex.map(lambda j: (j, M.run(a.html, a.n, j, P + j['extra'])), J))
res = {}
for j, r in R:
    f = M.agg(r)
    res.setdefault((j['h'], j['i']), {}).setdefault(j['kind'], []).append((j['L'], 100 * f['win'], f['turns']))
def line(pts):
    n = len(pts); mx = sum(p[0] for p in pts) / n; my = sum(p[1] for p in pts) / n
    sxx = sum((p[0] - mx) ** 2 for p in pts) or 1
    b = sum((p[0] - mx) * (p[1] - my) for p in pts) / sxx
    return lambda L: my + b * (L - mx), b
out = {}
for (h, i), v in sorted(res.items()):
    f1, b1 = line(v['f1']); fm, bm = line(v['mid'])
    best = min(range(4, 26), key=lambda L: (f1(L) - a.t1) ** 2 + a.wm * (fm(L) - a.tm) ** 2)
    out[f'{h}:{i}'] = dict(L=best, f1=round(f1(best), 1), mid=round(fm(best), 1), slope1=round(b1, 2), slopem=round(bm, 2),
                           pts1=v['f1'], ptsm=v['mid'])
    t1 = sum(p[2] for p in v['f1']) / len(v['f1']); tm = sum(p[2] for p in v['mid']) / len(v['mid'])
    print(f"{h:7} en{i}  life {best:2d}  pred f1 {f1(best):5.1f}  mid {fm(best):5.1f}   (slope/life f1 {b1:5.2f} mid {bm:5.2f})  turns ~{t1:.1f}/{tm:.1f}")
json.dump(out, open(a.out, 'w'), indent=1)
