import json,re,subprocess,html
a=json.load(open('tnew_0.json'));b=json.load(open('tnew_1.json'))
base={T:(a['base'][T][0]+b['base'][T][0])/(a['base'][T][1]+b['base'][T][1]) for T in 'PRO'}
res={}
for d in (a,b):
    for k,v in d['card'].items():
        if '_T' not in k: res[k]=v
info=json.loads(subprocess.check_output(['node','-e','''
const vm=require("vm"),fs=require("fs");let src=fs.readFileSync("tier_cur.html","utf8").match(/<script>([\\s\\S]*)<\\/script>/)[1];
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});vm.runInContext(src,ctx);
console.log(JSON.stringify(vm.runInContext("[...new Set([...STAPLES,...POOL])].map(id=>({id,n:D[id][0],c:D[id][1],t:D[id][2],r:RAR[id],g:TAG[id]||''}))",ctx)))''']))
inf={x['id']:x for x in info}
rows=[]
for k,(w,n) in res.items():
    if k not in inf: continue
    x=inf[k];kind='C' if x['t']=='C' else 'S'
    rows.append(dict(id=k,name=x['n'],cost=x['c'],rar=x['r'],arch=x['g'][:1],kind=kind,p=w/n,n=n))
grp={}
for r in rows: grp.setdefault((r['arch'],r['kind']),[]).append(r['p'])
for r in rows:
    g=grp[(r['arch'],r['kind'])];r['d']=(r['p']-sum(g)/len(g))*100
rows.sort(key=lambda r:-r['d'])
json.dump(dict(rows=rows,base=base),open('tier_data2.json','w'))
def tier(d): return 'S' if d>=8 else 'A' if d>=4 else 'B' if d>=0.5 else 'C' if d>=-3 else 'D'
AN={'P':'Phalanx','R':'Raiders','O':'Offerings','':'Generic'};RN={'C':'Common','U':'Uncommon','R':'Rare','L':'Legendary'}
old=open('tier_page.html').read();head=old[:old.index('<main>')]
sec=''
for t in 'SABCD':
    ch=''
    for r in rows:
        if tier(r['d'])!=t: continue
        nm=html.escape(r['name']);cls='a'+(r['arch'] or 'G')+' r'+r['rar']
        ch+=f'<li class="c {cls}" title="{nm}: {r["p"]*100:.0f}% win, {r["d"]:+.1f} vs peers"><span class="n">{nm}</span><span class="m">{AN[r["arch"]]} · {RN[r["rar"]]} · {r["cost"]}</span><b>{r["d"]:+.1f}</b></li>'
    sec+=f'<section class="t t{t}"><h2><span>{t}</span></h2><ul>{ch}</ul></section>'
note=f'<p class="note">Baseline bot win rate in fight 1 by deck type: Phalanx {base["P"]*100:.0f}%, Raiders {base["R"]*100:.0f}%, Offerings {base["O"]*100:.0f}%. The bot plays Raiders much better than the other two, so Raider cards bunch up near the top and combat tricks (Fury, Rally, Spoils, Charge of the Amazons) look worse than they would in human hands. Differences under about 3 points are within noise. This list was re-run after the latest buffs (Charon, Siege Ram Crew, the Offering creatures and the Eternal Pyre rework).</p>'
page=head+'<main>\n<h1>Odysseus card tiers</h1>\n<p class="lede">Each card was forced into about 400 simulated first fights with a deck built around its archetype, then compared with the average of its archetype peers (creatures with creatures, spells with spells). The number on each chip is the win-rate difference in percentage points.</p>\n'+re.search(r'<div class="key">.*?</div>',old,re.S).group(0)+'\n'+sec+note+'\n</main>\n'
open('tier_page2.html','w').write(page)
for r in rows[:12]+rows[-8:]: print(f"{r['name'][:28]:28s} {r['arch'] or '-'} {r['kind']} {r['rar']} {r['p']*100:5.1f} {r['d']:+5.1f}")
print(len(rows),{t:sum(1 for r in rows if tier(r['d'])==t) for t in 'SABCD'})
