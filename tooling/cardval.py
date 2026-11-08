import sys,collections
rows=[]
for fn in sys.argv[1:]:
    for l in open(fn):
        if l.startswith('DECK '):
            p=l.split();rows.append((p[1:-1],int(p[-1])))
n=len(rows);base=sum(w for _,w in rows)/n
print('games',n,'overall win %.3f'%base)
inc=collections.defaultdict(lambda:[0,0]);cnt=collections.defaultdict(lambda:collections.Counter())
for d,w in rows:
    for c in set(d):
        inc[c][0]+=1;inc[c][1]+=w
res=[]
for c,(k,w) in inc.items():
    res.append((w/k-base,c,k,w/k))
res.sort(reverse=True)
for diff,c,k,r in res: print('%-9s n=%4d win %.3f  diff %+.3f'%(c,k,r,diff))
