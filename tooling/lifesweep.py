#!/usr/bin/env python3
"""Sweep enemy life for given matchups. usage: lifesweep.py HTML N "ody:reg3:9,10,11,12 odin:elite0:12,14" [--patch-file f]"""
import sys, json, argparse
from concurrent.futures import ThreadPoolExecutor
import matrix as M
ap=argparse.ArgumentParser();ap.add_argument('html');ap.add_argument('n',type=int);ap.add_argument('spec');ap.add_argument('--patch-file',default='');ap.add_argument('-j',type=int,default=10)
a=ap.parse_args();base=open(a.patch_file).read() if a.patch_file else ''
J=[]
for item in a.spec.split():
    h,kind,lives=item.split(':')
    for L in lives.split(','):
        if kind.startswith('reg'):
            i=int(kind[3:]);opp=str(i);obj=f"CHARS.{h}.en[{i}]";vet=0;bank=''
        elif kind.startswith('elite'):
            i=int(kind[5:]);opp=str(100+M.IDX[h]['el'][i]);obj=f"ELITES[CHARS.{h}.el[{i}]]";vet=0;bank='mid'
        else:
            i=int(kind[4:]);opp=str(200+M.IDX[h]['bo'][i]);obj=f"BOSS[CHARS.{h}.bo[{i}]]";vet=0;bank='boss'
        J.append(dict(label=f'{h} {kind} L{L}',CHAR=h,OPP=opp,vet=vet,bank=bank,extra=f"{obj}.l={L};"))
def go(j): return M.run(a.html,a.n,j,base+j['extra'])
with ThreadPoolExecutor(a.j) as ex: R=list(ex.map(go,J))
for r in R:
    f=M.agg(r) if 'f' in r else None
    print(f"{r['label']:22} " + (f"win {100*f['win']:5.1f}  turns {f['turns']:5.1f}  stalls {f['stalls']:3d}  eDeckOut {100*f['edo']:3.0f}%  {f['slots']}" if f else r.get('error','?')))
