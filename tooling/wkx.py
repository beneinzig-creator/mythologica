#!/usr/bin/env python3
"""Wukong variant runner: full Act I runs (losses continue) per variant, with flow metrics from wkm.js.
usage: wkx.py VARIANTS.py RUNS [--only a,b] [--hero wukong] [--chunks 4] [--base basepatch.js]
VARIANTS.py defines V = {name: js_patch_string}. Prints one row per variant."""
import json, os, subprocess, argparse, sys
from concurrent.futures import ThreadPoolExecutor
ap=argparse.ArgumentParser();ap.add_argument('vfile');ap.add_argument('n',type=int);ap.add_argument('--only',default='')
ap.add_argument('--hero',default='wukong');ap.add_argument('--chunks',type=int,default=4);ap.add_argument('--base',default='');ap.add_argument('--html',default='n1.html')
ap.add_argument('--act2',action='store_true');ap.add_argument('--json',default='')
a=ap.parse_args();H=os.path.dirname(os.path.abspath(__file__))
ns={};exec(open(a.vfile).read(),ns);V=ns['V']
if a.only:V={k:V[k] for k in a.only.split(',')}
M=open(os.path.join(H,'wkm.js')).read();B=open(a.base).read() if a.base else ''
def go(job):
    name,i=job;env=dict(os.environ,CHAR=a.hero,CONT='1',CONTALL='1',PATCH=B+'\n'+V[name]+'\n'+M,PRINT='"WKM "+JSON.stringify(WKM)');env.pop('OPP',None)
    if a.act2:env['ACT2']='1'
    out=subprocess.run(['node',os.path.join(H,'simx.js'),os.path.join(H,a.html),str(a.n//a.chunks)],env=env,capture_output=True,text=True)
    j=w=None
    for l in out.stdout.splitlines():
        if l.startswith('JSON '):j=json.loads(l[5:])
        if l.startswith('WKM '):w=json.loads(l[4:])
    if j is None:sys.stderr.write(name+' FAILED\n'+out.stderr[-2000:]+'\n')
    return name,j,w
jobs=[(k,i) for k in V for i in range(a.chunks)]
with ThreadPoolExecutor(12) as ex:R=list(ex.map(go,jobs))
agg={}
for name,j,w in R:
    if not j:continue
    A=agg.setdefault(name,{'f':[[0,0,0] for _ in range(6)],'bye':{},'w':None})
    for i,f in enumerate(j['f']):A['f'][i][0]+=f['n'];A['f'][i][1]+=f['win']*f['n'];A['f'][i][2]+=f['turns']*f['n']
    for k,v in j['bye'].items():
        b=A['bye'].setdefault(k,[0,0]);b[0]+=v['n'];b[1]+=v['w']
    if w:
        if A['w'] is None:A['w']=w
        else:
            for k,v in w.items():
                if isinstance(v,(int,float)):A['w'][k]+=v
                elif isinstance(v,list):A['w'][k]=[x+y for x,y in zip(A['w'][k],v)]
                elif isinstance(v,dict):
                    for kk,vv in v.items():
                        if isinstance(vv,dict):
                            d=A['w'][k].setdefault(kk,{x:0 for x in vv})
                            for x in vv:d[x]+=vv[x]
                        else:A['w'][k][kk]=A['w'][k].get(kk,0)+vv
print(f"{'variant':22} {'f1':>4} {'f2':>4} {'f3':>4} {'f4':>4} {'grd':>4} {'reg':>5} {'trn':>5} | {'cp/t':>5} {'mo':>4} {'mo3%':>5} {'dead%':>5} {'big%':>5} {'mana':>5} {'h0':>4} {'empty%':>6} {'crt':>4}")
for name,A in agg.items():
    f=A['f'];w=A['w'] or {};T=max(1,w.get('turns',1))
    reg=[(v[0],v[1]) for k,v in A['bye'].items() if k.startswith('R:')];rn=sum(x for x,_ in reg);rw=sum(y for _,y in reg)
    tr=sum(x[2] for x in f[:5])/max(1,sum(x[0] for x in f[:5]))
    pct=lambda i:100*f[i][1]/max(1,f[i][0])
    print(f"{name:22} {pct(0):4.0f} {pct(1):4.0f} {pct(2):4.0f} {pct(3):4.0f} {pct(4):4.0f} {100*rw/max(1,rn):5.1f} {tr:5.1f} | {w.get('cp',0)/T:5.2f} {w.get('mo',0)/T:4.2f} {100*w.get('mo3',0)/T:5.1f} {100*w.get('dead',0)/T:5.1f} {100*w.get('big',0)/T:5.1f} {w.get('mana',0)/T:5.2f} {w.get('hand0',0)/T:4.1f} {100*w.get('empty',0)/T:6.1f} {w.get('crt',0)/T:4.2f}")
if a.json:json.dump(agg,open(a.json,'w'))
