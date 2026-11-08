# ---- patch 3: spells no archetype, glossary hover, library tooltips, creature frequency ----
head=rep(head,"const AC={P:'W',R:'R',O:'B'};for(const k in TAG)if(AC[TAG[k]]&&D[k])D[k][8]=AC[TAG[k]];","const AC={P:'W',R:'R',O:'B'};for(const k in TAG)if(AC[TAG[k]]&&D[k])D[k][8]=AC[TAG[k]];for(const k in TAG)if(D[k]&&'IS'.includes(D[k][2]))delete TAG[k];")
head=rep(head,"const fxp=(c,t)=>","""const GLS=()=>[[/\\bresilient\\b/i,'Resilient',KWL.z],[/\\bbulldoze\\b/i,'Bulldoze',KWL.b],[/\\bdraining\\b/i,'Draining',KWL.d],[/\\bvenomous\\b/i,'Venomous',KWL.v],[/\\bward(ed)?\\b/i,'Ward',KWL.w],[/\\bsiege\\b/i,'Siege',KWL.x],[/\\bsteadfast\\b/i,'Steadfast',KWL.s],[/\\brally\\b/i,'Rally',KWL.y],[/\\bcharge\\b/i,'Charge',KWL.h],[/\\bopportunist\\b/i,'Opportunist',KWL.q],
[/\\bfrenzy\\b/i,'Frenzy','each time you offer an army member, its controller deals 1 damage to the opponent (per Frenzy source).'],
[/\\bphalanx\\b/i,'Phalanx','army members with Phalanx get +2 power while in defense form. Phalanx is the Phalanx archetype.'],
[/\\braiders?\\b/i,'Raider','army members with Raider get +1 power while in attack form.'],
[/\\boffering army/i,'Offering army member','an army member built around being offered (sacrificed) for mana.'],
[/\\bdrowsy\\b/i,'Drowsy','the Lotus-Eaters\\' army members; each has Opportunist.'],
[/\\bcyclops army/i,'Cyclops army member','one of Polyphemus\\'s giant army members.'],
[/\\bflying\\b|\\bflyers?\\b/i,'Flying','only flying army members can block it, and only flyers can attack a tapped flyer.'],
[/defense form/i,'Defense form','+2 health, and it cannot attack. Switching stance is free once per turn, before you attack.'],
[/attack form/i,'Attack form','the normal stance; it can attack.'],
[/\\btapped?\\b/i,'Tapped','cannot attack or block until it untaps. Opposing attackers can target tapped army members.'],
[/\\boffer(ed|s)?\\b|\\boffering\\b/i,'Offer','sacrifice one of your army members for mana equal to its 💀 value.'],
[/\\bpermanently\\b/i,'Permanently','the bonus lasts for the rest of the fight.']];
function GL(c,L){const d=D[c.id],tx=(TXT[c.id]||d[6]||'')+' '+(isC(c)?'':'');const seen=L.join(' ');for(const[re,nm,df]of GLS()){if(re.test(tx)&&!seen.includes(nm+':')&&!seen.includes(df)){L.push('<b>'+nm+'</b>: '+df.replace(/^[A-Za-z ]+: /,m=>m.startsWith(nm)?'':m))}}}
const fxp=(c,t)=>""")
head=rep(head,"\nreturn`<div class=\"fxp${t=='h'||t=='d'?' up':''}\">","\nGL(c,L);return`<div class=\"fxp${t=='h'||t=='d'?' up':''}\">")
head=rep(head,".lib .fxp{display:none!important}",".lib .fxp{display:none!important}#tip{position:fixed;z-index:400;width:190px;background:#14100a;color:#f3ead0;border:1px solid var(--gold);border-radius:6px;padding:6px 9px;font:12px/1.3 Georgia,serif;pointer-events:none;box-shadow:0 4px 14px #000a;display:none}#tip p{margin:0 0 5px}")
tail=rep(tail,"document.onclick=ev=>","""document.onmouseover=ev=>{try{let T=document.getElementById('tip');if(!T){T=document.createElement('div');T.id='tip';document.body.appendChild(T)}const cd=ev.target.closest&&ev.target.closest('.lib .cd'),fx=cd&&cd.querySelector('.fxp');if(!fx){T.style.display='none';return}T.innerHTML=fx.innerHTML;T.style.display='block';const r=cd.getBoundingClientRect(),w=190,x=r.right+10+w>innerWidth?Math.max(4,r.left-w-10):r.right+10;T.style.left=x+'px';T.style.top=Math.max(4,Math.min(r.top,innerHeight-T.offsetHeight-6))+'px'}catch(e){}};
document.onclick=ev=>""")
# draft: creature guarantee + weight
mid=rep(mid,"G.dr.off=off.map(id=>mk(id))}","""if(!off.some(x=>D[x][2]=='C')){const cs=POOL.filter(x=>D[x][2]=='C'&&!off.includes(x)),tot=cs.reduce((n,x)=>n+wt(x),0);let r=Math.random()*tot,id=cs[cs.length-1];for(const x of cs){r-=wt(x);if(r<0){id=x;break}}off[Math.random()*3|0]=id}
G.dr.off=off.map(id=>mk(id))}""")
