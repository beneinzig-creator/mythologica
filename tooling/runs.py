#!/usr/bin/env python3
"""Real-run stats per enemy (CONT+CONTALL: keep going after losses so every run reaches the boss).
usage: runs.py HTML RUNS_PER_HERO [--patch-file f] [--heroes ody,odin,wukong] [--chunks 4]"""
import json, os, subprocess, argparse
from concurrent.futures import ThreadPoolExecutor
ap=argparse.ArgumentParser();ap.add_argument('html');ap.add_argument('n',type=int);ap.add_argument('--patch-file',default='');ap.add_argument('--heroes',default='ody,odin,wukong');ap.add_argument('--chunks',type=int,default=4);ap.add_argument('--out',default='')
a=ap.parse_args();P=open(a.patch_file).read() if a.patch_file else ''
H=os.path.dirname(os.path.abspath(__file__))
def go(h):
    env=dict(os.environ,CHAR=h,CONT='1',CONTALL='1',PATCH=P);env.pop('OPP',None)
    out=subprocess.run(['node',os.path.join(H,'simx.js'),a.html,str(a.n//a.chunks)],env=env,capture_output=True,text=True).stdout
    l=[x for x in out.splitlines() if x.startswith('JSON ')]
    return h,json.loads(l[0][5:]) if l else None
jobs=[h for h in a.heroes.split(',') for _ in range(a.chunks)]
with ThreadPoolExecutor(12) as ex: R=list(ex.map(go,jobs))
agg={}
for h,r in R:
    if not r: continue
    A=agg.setdefault(h,{'bye':{},'f':[[0,0] for _ in range(6)]})
    for k,v in r['bye'].items():
        b=A['bye'].setdefault(k,{'n':0,'w':0,'fi':0});b['n']+=v['n'];b['w']+=v['w'];b['fi']+=v['fi']
    for i,f in enumerate(r['f']): A['f'][i][0]+=f['n'];A['f'][i][1]+=f['win']*f['n']
if a.out: json.dump(agg,open(a.out,'w'),indent=1)
for h,A in agg.items():
    print(f"== {h}  by fight: "+'  '.join(f"f{i+1} {100*w/max(1,n):.0f}% (n{n})" for i,(n,w) in enumerate(A['f'][:5])))
    for k,v in sorted(A['bye'].items(),key=lambda kv:(kv[0][0]!='R',kv[0])):
        print(f"   {k:40} n{v['n']:5} win {100*v['w']/v['n']:5.1f}  avgFight {v['fi']/v['n']+1:.2f}")
