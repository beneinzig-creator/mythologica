# ===== double blocks: two blockers on one attacker, full damage both ways =====
_b3("return{side:s==G.p?'p':'e',atk:S.map(c=>c.u),blk:{},tg:tgm}}","return{side:s==G.p?'p':'e',atk:S.map(c=>c.u),blk:{},bx:{},tg:tgm}}")
_b3("const inCmb=x=>!!G.cmb&&(G.cmb.atk.includes(x.u)||Object.values(G.cmb.blk).includes(x.u));","const bAll=cu=>[...Object.values(cu.blk),...Object.values(cu.bx||{})];const inCmb=x=>!!G.cmb&&(G.cmb.atk.includes(x.u)||bAll(G.cmb).includes(x.u));")
_b3("Object.values(cu.blk).includes(c.u))cl.push('bk')","bAll(cu).includes(c.u))cl.push('bk')")
_b3("bk=cu?Object.values(cu.blk):[]","bk=cu?bAll(cu):[]")
_b3("const bu=cu.blk&&cu.blk[c.u],B=bu&&O.bf.find(x=>x.u==bu);if(B)L.push('Blocked by '+D[B.id][0]+'.')","for(const bu of [cu.blk&&cu.blk[c.u],cu.bx&&cu.bx[c.u]]){const B=bu&&O.bf.find(x=>x.u==bu);if(B)L.push('Blocked by '+D[B.id][0]+'.')}")
_b3("for(const a in cu.blk)if(cu.blk[a]==c.u){","for(const a in cu.blk)if(cu.blk[a]==c.u||(cu.bx&&cu.bx[a]==c.u)){")
_b3(""",B=document.querySelector(`.cd[data-z="${sd[1]}:${c.blk[a]}"]`);
if(A&&B){const ra=A.getBoundingClientRect(),rb=B.getBoundingClientRect();B.style.left=(ra.left+ra.width/2-rb.left-rb.width/2)+'px'}}}""",""";const bs=[c.blk[a],c.bx&&c.bx[a]].filter(Boolean);bs.forEach((bu,i)=>{const B=document.querySelector(`.cd[data-z="${sd[1]}:${bu}"]`);if(A&&B){const ra=A.getBoundingClientRect(),rb=B.getBoundingClientRect(),off=bs.length>1?(i?.55:-.55)*rb.width:0;B.style.left=(ra.left+ra.width/2-rb.left-rb.width/2+off)+'px'}})}}""")
_b3("const bu=c.blk[u],b=bu&&N.bf.find(x=>x.u==bu),da=pwr(a);","const bu=c.blk[u],b=bu&&N.bf.find(x=>x.u==bu),b2=c.bx&&c.bx[u]&&N.bf.find(x=>x.u==c.bx[u]),da=pwr(a);")
_b3("if(b){const db=pwr(b);H.push([b,da,a]);H.push([a,db,b]);if(kw(a,'b')&&da>0){const ex=da-(kw(a,'v')?1:th(b)-b.dmg);if(ex>0)N.life-=ex}if(kw(a,'d'))aGain+=da;if(kw(b,'d'))nGain+=db}","if(b){const db=pwr(b);H.push([b,da,a]);H.push([a,db,b]);if(kw(a,'d'))aGain+=da;if(kw(b,'d'))nGain+=db;let mx=kw(a,'v')?1:th(b)-b.dmg;if(b2){const d2=pwr(b2);H.push([b2,da,a]);H.push([a,d2,b2]);if(kw(a,'d'))aGain+=da;if(kw(b2,'d'))nGain+=d2;mx=Math.max(mx,kw(a,'v')?1:th(b2)-b2.dmg)}if(kw(a,'b')&&da>0){const ex=da-mx;if(ex>0)N.life-=ex}}")
_b3("for(const q in G.cmb.blk)if(G.cmb.blk[q]==b.u)delete G.cmb.blk[q];G.cmb.blk[a.u]=b.u;G.blk=0;msg(D[b.id][0]+' blocks '+D[a.id][0]+'.')}}","""const C=G.cmb;C.bx=C.bx||{};for(const q in C.blk)if(C.blk[q]==b.u){if(C.bx[q]){C.blk[q]=C.bx[q];delete C.bx[q]}else delete C.blk[q]}for(const q in C.bx)if(C.bx[q]==b.u)delete C.bx[q];
if(!C.blk[a.u])C.blk[a.u]=b.u;else C.bx[a.u]=b.u;G.blk=0;msg(D[b.id][0]+' blocks '+D[a.id][0]+(C.bx[a.u]?' (double block: both deal and take full damage).':'.'))}}""")
_b3("if(kills(a,b))gain+=ev(b)+1;if(kills(b,a))loss+=ev(a)+1;","if(kills(a,b))gain+=ev(b)+1;{const b2=bl.find(x=>x.u==blk['x'+a.u]);if(b2&&kills(a,b2))gain+=ev(b2)+1;const s=pwr(b)+(b2?pwr(b2):0);if(s>0&&!(kw(a,'z')&&!a.rs)&&(kw(b,'v')||(b2&&kw(b2,'v'))||s>=th(a)-a.dmg))loss+=ev(a)+1}")
_b3("if(bb){used.add(bb.u);out[a.u]=bb.u}}return out}","""if(bb){used.add(bb.u);out[a.u]=bb.u}}
const gOf=(a,B)=>{const T=tgm[a.u]&&look(tgm[a.u]),s=B.reduce((n,b)=>n+pwr(b),0),k=s>0&&!(kw(a,'z')&&!a.rs)&&(B.some(b=>kw(b,'v')&&pwr(b)>0)||s>=th(a)-a.dmg);let g=k?ev(a)+1:0;for(const b of B)if(kills(a,b))g-=ev(b)+1;if(T){if(kills(a,T)||cdmg(a)>=th(T)-T.dmg)g+=ev(T)+1}else g+=pwr(a)*danger;return g};
for(const a of at.slice().sort((x,y)=>pwr(y)-pwr(x))){if(pwr(a)<=0)continue;const b1=bl.find(x=>x.u==out[a.u]),free=bl.filter(x=>!used.has(x.u)&&canBlock(x,a));let best=null,bgp=b1?gOf(a,[b1])+1:1.5;
if(b1){for(const b2 of free){const g=gOf(a,[b1,b2]);if(g>bgp){bgp=g;best=[b1,b2]}}}else for(let i=0;i<free.length;i++)for(let j=i+1;j<free.length;j++){const g=gOf(a,[free[i],free[j]]);if(g>bgp){bgp=g;best=[free[i],free[j]]}}
if(best){out[a.u]=best[0].u;out['x'+a.u]=best[1].u;used.add(best[0].u);used.add(best[1].u)}}
return out}""")
_b3("Object.assign(G.cmb.blk,pickBlocks(at,cr(e).filter(b=>!b.tap&&!has(b,'n')),e.life,G.cmb.tg||{}))","{const P=pickBlocks(at,cr(e).filter(b=>!b.tap&&!has(b,'n')),e.life,G.cmb.tg||{});G.cmb.bx=G.cmb.bx||{};for(const k in P){if(k[0]=='x')G.cmb.bx[k.slice(1)]=P[k];else G.cmb.blk[k]=P[k]}}")
_b3("Click your army member, then the attacker to block. Quick spells","Click your army member, then the attacker to block (two blockers can gang up on one attacker). Quick spells")
