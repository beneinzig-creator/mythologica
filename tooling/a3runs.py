#!/usr/bin/env python3
"""Act III balance with proven decks: replays bal/bank3p_<hero>.jsonl through Act III (a3sim.js) in parallel.
usage: a3runs.py HTML RUNS_PER_HERO [--chunks 3] [--heroes ody,odin,wukong,thoth] [--out file.json] [--env K=V ...]"""
import json, os, subprocess, argparse
from concurrent.futures import ThreadPoolExecutor
ap=argparse.ArgumentParser();ap.add_argument('html');ap.add_argument('n',type=int);ap.add_argument('--chunks',type=int,default=3)
ap.add_argument('--heroes',default='ody,odin,wukong,thoth');ap.add_argument('--out',default='');ap.add_argument('--env',nargs='*',default=[]);ap.add_argument('--bank',default='bank3p')
a=ap.parse_args();H=os.path.dirname(os.path.abspath(__file__))
def go(h):
    env=dict(os.environ);env.update(dict(x.split('=',1) for x in a.env))
    out=subprocess.run(['node',os.path.join(H,'a3sim.js'),a.html,os.path.join(H,'bal',f'{a.bank}_{h}.jsonl'),str(a.n//a.chunks)],env=env,capture_output=True,text=True).stdout
    l=[x for x in out.splitlines() if x.startswith('JSON ')]
    return h,json.loads(l[0][5:]) if l else None
jobs=[h for h in a.heroes.split(',') for _ in range(a.chunks)]
with ThreadPoolExecutor(12) as ex: R=list(ex.map(go,jobs))
agg={}
for h,r in R:
    if not r: continue
    A=agg.setdefault(h,{'by':{},'F':[{'n':0,'w':0,'t':0} for _ in range(6)],'gen':{'n':0,'w':0},'fin':{'n':0,'w':0},'won':0,'N':0,'stall':0,'errs':0})
    for k,v in r['by'].items():
        b=A['by'].setdefault(k,{'n':0,'w':0,'t':0})
        for kk in b: b[kk]+=v[kk]
    for i,f in enumerate(r['F']):
        for kk in f: A['F'][i][kk]+=f[kk]
    for k in ('gen','fin'):
        for kk in ('n','w'): A[k][kk]+=r[k][kk]
    for k in ('won','N','stall','errs'): A[k]+=r[k]
if a.out: json.dump(agg,open(a.out,'w'),indent=1)
pc=lambda w,n: f"{100*w/n:4.0f}%" if n else "   -"
for h,A in agg.items():
    print(f"== {h}: fights 1-4 "+' '.join(pc(f['w'],f['n']) for f in A['F'][:4])+f" | general {pc(A['gen']['w'],A['gen']['n'])} | Beast {pc(A['fin']['w'],A['fin']['n'])} | runs won {pc(A['won'],A['N'])} | stalls {A['stall']} errors {A['errs']}")
names=sorted({k for A in agg.values() for k in A['by']},key=lambda k:('RE GF'.index(k[0]),k))
print(f"{'enemy':42}"+''.join(f"{h:>14}" for h in agg))
for k in names:
    print(f"{k:42}"+''.join((f"{pc(agg[h]['by'][k]['w'],agg[h]['by'][k]['n'])} {agg[h]['by'][k]['t']/agg[h]['by'][k]['n']:4.1f}t" if k in agg[h]['by'] else '             -').rjust(14) for h in agg))
