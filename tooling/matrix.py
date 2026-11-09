#!/usr/bin/env python3
"""Balance matrix: runs simx.js jobs in parallel and prints a table.

usage: python3 matrix.py HTML N SUITE [--tag T] [--patch JS] [--out file.json]
SUITE: comma list of  reg | elite | boss | curve | act2   (default reg,elite,boss,curve)
  reg   fight 1 vs each regular enemy (starter deck)
  elite each elite with the veteran deck (starter + 8 top-rated pool cards)
  boss  each boss with the veteran deck
  curve full runs with CONT=1 (keep going after a loss) -> fights 1-4 win%
  act2  veteran deck vs each other realm's regulars at Act II scaling (+4)
"""
import json, os, subprocess, sys, argparse
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
HEROES = ['ody', 'odin', 'wukong']
IDX = {'ody': {'el': [0, 1], 'bo': [0, 1, 2]}, 'odin': {'el': [2, 3], 'bo': [3, 4, 5]}, 'wukong': {'el': [4, 5], 'bo': [6, 7, 8]}}
VET = ("var _fd=finishDraft;finishDraft=function(){_fd();if(!G.vx){G.vx=1;const pl=CHARS[G.ch].pool.slice()"
       ".sort((a,b)=>(RATE[b]||0)-(RATE[a]||0)).slice(0,22);for(let i=0;i<8;i++)G.p.recs.push({id:pl[Math.random()*pl.length|0],a:0,d:0,c:0,s:0,k:0,fl:0})}};")

def agg(r):
    F = [f for f in r['f'] if f['n']]
    n = sum(f['n'] for f in F) or 1
    w = sum(f['win'] * f['n'] for f in F)
    eo = sum(f['edo'] * f['n'] for f in F)
    return dict(n=n, win=w / n, turns=sum(f['turns'] * f['n'] for f in F) / n, stalls=sum(f['stalls'] for f in F),
                edo=eo / n, edt=sum(f['edt'] * f['edo'] * f['n'] for f in F) / (eo or 1), pdo=sum(f['pdo'] * f['n'] for f in F) / n,
                life=sum(f['life'] * f['win'] * f['n'] for f in F) / (w or 1),
                slots=' '.join(f"f{i+1}:{100*f['win']:.0f}%/{f['n']}" for i, f in enumerate(r['f']) if f['n']))

def jobs(suite, heroes):
    J = []
    for h in heroes:
        if 'reg' in suite:
            J += [dict(label=f'{h} reg{o}', CHAR=h, OPP=str(o)) for o in range(6)]
        if 'breg' in suite:
            J += [dict(label=f'{h} breg{o}', CHAR=h, OPP=str(o), bank='mid') for o in range(6)]
        if 'vreg' in suite:
            J += [dict(label=f'{h} vreg{o}', CHAR=h, OPP=str(o), vet=1) for o in range(6)]
        if 'elite' in suite:
            J += [dict(label=f'{h} elite{o}', CHAR=h, OPP=str(100+IDX[h]['el'][o]), bank='mid') for o in range(2)]
        if 'boss' in suite:
            J += [dict(label=f'{h} boss{o}', CHAR=h, OPP=str(200+IDX[h]['bo'][o]), bank='boss') for o in range(3)]
        if 'curve' in suite:
            J += [dict(label=f'{h} curve', CHAR=h, CONT='1')]
        if 'act2' in suite:
            for r in HEROES:
                if r != h:
                    for o in range(6):
                        J += [dict(label=f'{h} a2:{r}{o}', CHAR=h, REALM=r, OPP=str(o), vet=1, a2=1)]
    return J

def run(html, n, job, patch):
    env = dict(os.environ)
    for k in ('BANK', 'BANKFILE'): env.pop(k, None)
    if job.get('bank'):
        env['BANK'] = job['bank']; env['BANKFILE'] = os.path.join(HERE, 'bal', 'bank_' + job['CHAR'] + '.jsonl')
    for k in ('CHAR', 'OPP', 'CONT', 'REALM'):
        env.pop(k, None)
        if k in job: env[k] = job[k]
    p = patch or ''
    if job.get('vet'): p = VET + p
    if job.get('a2'): p += "var _sc=sclOf;sclOf=function(v){return _sc(v+4)};"
    env['PATCH'] = p
    out = subprocess.run(['node', os.path.join(HERE, 'simx.js'), html, str(n)], env=env, capture_output=True, text=True, timeout=3600).stdout
    line = next((l for l in out.splitlines() if l.startswith('JSON ')), None)
    r = json.loads(line[5:]) if line else {'error': out[-400:]}
    r['label'] = job['label']
    return r

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('html'); ap.add_argument('n', type=int); ap.add_argument('suite', nargs='?', default='reg,elite,boss,curve')
    ap.add_argument('--heroes', default=','.join(HEROES)); ap.add_argument('--patch', default='')
    ap.add_argument('--out', default=''); ap.add_argument('-j', type=int, default=10)
    a = ap.parse_args()
    J = jobs(a.suite.split(','), a.heroes.split(','))
    with ThreadPoolExecutor(a.j) as ex:
        R = list(ex.map(lambda j: run(a.html, a.n, j, a.patch), J))
    if a.out: json.dump(R, open(a.out, 'w'), indent=1)
    print(f"{'matchup':16} {'win%':>5} {'turns':>6} {'stall':>5} {'eDeckOut%':>9} {'@turn':>6} {'pDeckOut%':>9} {'lifeOnWin':>9}")
    for r in R:
        if 'error' in r: print(r['label'], 'ERROR', r['error']); continue
        if r['opp'] < 0:
            print(f"{r['label']:16} " + '  '.join(f"f{i+1} {100*f['win']:.0f}% (n{f['n']})" for i, f in enumerate(r['f'][:4])) + f"  stalls {r['stall']}")
            continue
        f = agg(r)
        print(f"{r['label']:16} {100*f['win']:5.1f} {f['turns']:6.1f} {f['stalls']:5d} {100*f['edo']:9.0f} {f['edt']:6.1f} {100*f['pdo']:9.0f} {f['life']:9.1f}  {f['slots'] if r.get('opp',-1)>=0 and len(f['slots'].split())>1 else ''}")

if __name__ == '__main__':
    main()
