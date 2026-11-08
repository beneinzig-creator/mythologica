import json,re
a=json.load(open('tier_0.json'));b=json.load(open('tier_1.json'))
base={T:(a['base'][T][0]+b['base'][T][0])/(a['base'][T][1]+b['base'][T][1]) for T in 'PRO'}
nt=dict(pent='R',eury='R',horde='R',leon='P',thermo='P',brasidas='P',iph='O',hades='O',thanat='O',games='O')
res={}
for f in ('tier_0.json','tier_1.json'):
    for k,v in json.load(open(f))['card'].items():
        if '_T' not in k: res[k]=v
for f in ('tier2_0.json','tier2_1.json'):
    for k,v in json.load(open(f))['card'].items():
        if '_T' not in k: res[k]=v
res['horde']=[json.load(open('t3.json'))['card']['horde'][0],json.load(open('t3.json'))['card']['horde'][1]]
s=open('n1.html',encoding='utf-8').read()
tg=dict(re.findall(r"(\w+):'([PRO])'",re.search(r"const TAG=\{.*?\};",s,re.S).group(0)));tg.update(nt)
# card info from game
import subprocess
info=json.loads(subprocess.check_output(['node','-e','''
const vm=require("vm"),fs=require("fs");let src=fs.readFileSync("n1.html","utf8").match(/<script>([\\s\\S]*)<\\/script>/)[1];
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});vm.runInContext(src,ctx);
console.log(JSON.stringify(vm.runInContext("[...new Set([...STAPLES,...POOL])].map(id=>({id,n:D[id][0],c:D[id][1],t:D[id][2],r:RAR[id],g:TAG[id]||''}))",ctx)))''']))
inf={x['id']:x for x in info}
rows=[]
for k,(w,n) in res.items():
    if k not in inf: continue
    x=inf[k];t=tg.get(k,'');kind='C' if x['t']=='C' else 'S'
    rows.append(dict(id=k,name=x['n'],cost=x['c'],type=x['t'],rar=x['r'],arch=t,kind=kind,p=w/n,n=n))
grp={}
for r in rows: grp.setdefault((r['arch'],r['kind']),[]).append(r['p'])
for r in rows:
    g=grp[(r['arch'],r['kind'])]; m=sum(g)/len(g)
    r['d']=(r['p']-m)*100
rows.sort(key=lambda r:-r['d'])
json.dump(dict(rows=rows,base=base),open('tier_data.json','w'))
for r in rows: print(f"{r['name'][:26]:26s} {r['arch'] or '-'} {r['kind']} {r['rar']} {r['p']*100:5.1f} {r['d']:+5.1f}")
