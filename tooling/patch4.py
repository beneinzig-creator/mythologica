import re as _r2
# camp joins pool as cheap Offerings fodder
head=rep(head,"STAPLES='spear sailor goat spearc aegis'.split(' '),POOL='sent ","STAPLES='spear sailor goat spearc aegis'.split(' '),POOL='camp sent ")
head=rep(head,"for(const k in RAR)delete RAR[k];","for(const k in RAR)delete RAR[k];RAR.camp='C';")
head=rep(head,"ox:'O',argus:'O',","camp:'O',ox:'O',argus:'O',")
head=rep(head,"const FLG={argus:'o',","const FLG={camp:'o',argus:'o',")
# creature cost controller in dealDraft
mid=rep(mid,"const wt=x=>W[RAR[x]]*(1+Math.min(.9,.14*(TAG[x]||'').split('').reduce((n,k)=>n+(cnt[k]||0),0)));",
"const T0=2.7,cur=((G.cs||0)+T0*3)/((G.cn||0)+3),cf=x=>{if(D[x][2]!='C')return 1;const c=D[x][1],sb=c>=4?1.5:c==3?1.35:c<=1?.7:1;return sb*(cur>T0?(c<=2?1.8:c==3?.9:.5):(c<=2?.6:c==3?1.8:2.5))};\nconst wt=x=>W[RAR[x]]*(1+Math.min(2,.3*(TAG[x]||'').split('').reduce((n,k)=>n+(cnt[k]||0),0)))*cf(x);")
mid=rep(mid,"G.dr.off=off.map(id=>mk(id))}","off.filter(x=>D[x][2]=='C').forEach(x=>{G.cs=(G.cs||0)+D[x][1];G.cn=(G.cn||0)+1});G.dr.off=off.map(id=>mk(id))}")
# library stats tooltip in draft
mid=rep(mid,"function renderDraft(){","""function libStats(have){const T={C:0,I:0,S:0,E:0,A:0},Ar={P:0,R:0,O:0,N:0};let sum=0;have.forEach(c=>{T[D[c.id][2]]++;Ar[TAG[c.id]||'N']++;sum+=cost(c)});
return`<b>Your library: ${have.length} card${have.length==1?'':'s'}</b><br>Army members ${T.C} · Quick spells ${T.I} · Spells ${T.S} · Modifiers ${T.E} · Items ${T.A}<br>Phalanx ${Ar.P} · Raiders ${Ar.R} · Offerings ${Ar.O} · No archetype ${Ar.N}<br>Average mana cost: ${(sum/Math.max(1,have.length)).toFixed(2)}<br><i>Click to view.</i>`}
function renderDraft(){""")
mid=rep(mid,"<div class=\"tip\">Your library: ${have.length} card${have.length==1?'':'s'}. Click to view.</div></div><small>Library</small>","<div class=\"tip\">${libStats(have)}</div></div><small>Library</small>")
head=rep(head,".dlibw{position:absolute;",".dlibw{zoom:1.3}.dlibw .tip{left:0;top:auto;bottom:calc(100% + 12px);transform:none;white-space:normal;width:250px;line-height:1.5}.dlibw{position:absolute;")
# tooltip fitting
m=_r2.search(r"document\.onmouseover=ev=>\{.*?\};\n(?=document\.onclick)",tail,_r2.S);assert m
tail=tail.replace(m.group(0),"""function fitTip(fx,dx){fx.style.transform='';const r=fx.getBoundingClientRect(),z=fx.offsetWidth?r.width/fx.offsetWidth:1,H=innerHeight-10,s=r.height>H?H/r.height:1,h=r.height*s,top=Math.max(5,Math.min(r.top,innerHeight-5-h)),dy=(top-r.top)/z;fx.style.transformOrigin='0 0';fx.style.transform=(dy?'translateY('+dy+'px) ':'')+(s<1?'scale('+s+')':'')}
document.onmouseover=ev=>{try{let T=document.getElementById('tip');if(!T){T=document.createElement('div');T.id='tip';document.body.appendChild(T)}const cd=ev.target.closest&&ev.target.closest('.cd'),fx=cd&&cd.querySelector('.fxp');if(!cd||!fx){T.style.display='none';return}
if(cd.closest('.lib')){T.innerHTML=fx.innerHTML;T.style.display='block';T.style.transform='';const r=cd.getBoundingClientRect(),w=190,x=r.right+10+w>innerWidth?Math.max(4,r.left-w-10):r.right+10;T.style.left=x+'px';T.style.top=r.top+'px';const q=T.getBoundingClientRect(),H=innerHeight-10,s=q.height>H?H/q.height:1,top=Math.max(5,Math.min(q.top,innerHeight-5-q.height*s));T.style.top=top+'px';T.style.transformOrigin='0 0';T.style.transform=s<1?'scale('+s+')':''}else{T.style.display='none';fitTip(fx);setTimeout(()=>{try{fitTip(fx)}catch(e){}},170)}}catch(e){}};
""")
# ---- balance pass 3 ----
head=rep(head,"lot:['Lotus-Eater',2,'C',3,5,'r'","lot:['Lotus-Eater',2,'C',3,4,'r'")
head=rep(head,"titan:['Drowsy Titan',4,'C',4,6,","titan:['Drowsy Titan',4,'C',3,6,")
head=rep(head,"song:['Song-Caller',2,'C',2,4,","song:['Song-Caller',2,'C',2,3,")
