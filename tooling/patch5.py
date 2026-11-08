import re as _r5
# ===== engine_a: Opportunist fix, chorus nerf, draw anim hook, priority sweep, Cassandra on offer =====
A=rep(A,"const qb=c=>{if(!has(c,'q'))return 0;const s=sideOf(c);return s?Math.min(3,cr(oppOf(s)).filter(x=>x.tap).length):0};",
"const inCmb=x=>!!G.cmb&&(G.cmb.atk.includes(x.u)||Object.values(G.cmb.blk).includes(x.u));\nconst qb=c=>{if(!has(c,'q'))return 0;const s=sideOf(c);return s?Math.min(3,cr(oppOf(s)).filter(x=>x.tap&&!inCmb(x)).length):0};")
A=rep(A,"+(has(c,'g')&&own(c,'forge')?1:0)+(has(c,'f')&&own(c,'skies')?1:0);","+(has(c,'g')&&own(c,'forge')?1:0);")
A=rep(A,"+(has(c,'r')&&own(c,'banner')?1:0)+aur(c)+qb(c);","+(has(c,'r')&&own(c,'banner')?1:0)+(has(c,'f')&&own(c,'skies')?1:0)+aur(c)+qb(c);")
A=rep(A,"const draw=(s,n)=>{while(n--&&s.deck.length)s.hand.push(s.deck.pop())};","const draw=(s,n)=>{while(n--&&s.deck.length){const c=s.deck.pop();s.hand.push(c);try{flyIn(c,s)}catch(e){}}};")
i=A.index('function sweep(){')
A=A[:i]+r"""/* ABILITY PRIORITY (never skipped; resolved in this order every time the board changes):
   0. Replacement: Resilient saves a lethal army member.
   1. State-based: every army member with lethal damage / venom / 0 health leaves play at once.
   2. Death triggers, lowest number first, active player's first on ties:
      1 Flock Sheep life gain, 2 Faithful Argus draw, 3 Cassandra's prophecy.
   3. Re-check step 0-2 (triggers can cause more deaths) until nothing changes.
   Offering triggers (Argus, Pythia, Zeus, Telemachus, Frenzy, Cassandra) happen inside offer(); enter-the-battlefield effects inside cast()/enemy play. */
const cassFx=(s,o)=>{const E=cr(o).filter(x=>!has(x,'w')),k=E.filter(x=>th(x)-x.dmg<=3).sort((a,b)=>(pw(b)+th(b))-(pw(a)+th(a)))[0],t=k||best(E);if(t){t.dmg+=3;log("Cassandra's prophecy strikes "+D[t.id][0]+'.')}};
const DEATH={sheep:{p:1,fn:s=>{s.life+=2}},argus:{p:2,fn:s=>draw(s,1)},cass:{p:3,fn:cassFx}};
const actSide=()=>(G.phase=='enemy'||(G.cmb&&G.cmb.side=='e'))?G.e:G.p;
function sweep(){for(let g=0;g<80;g++){const dead=[];
for(const s of[G.p,G.e])for(const c of s.bf.slice()){if(!isC(c))continue;const lethal=th(c)<=0||c.dmg>=th(c)||c.vn;
if(lethal&&th(c)>0&&kw(c,'z')&&!c.rs){c.rs=1;c.vn=0;c.dmg=Math.min(c.dmg,th(c)-1);log(D[c.id][0]+' endures (Resilient).');continue}
if(lethal)dead.push([s,c])}
if(!dead.length)break;
for(const[s,c]of dead){s.bf.splice(s.bf.indexOf(c),1);bury(s,c);log(D[c.id][0]+' dies.')}
const Q=[];dead.forEach(([s,c])=>{const t=DEATH[c.id];if(t)Q.push({p:t.p,a:s===actSide()?0:1,s,fn:t.fn})});
Q.sort((x,y)=>x.p-y.p||x.a-y.a);Q.forEach(q=>q.fn(q.s,oppOf(q.s)))}}
"""
A=rep(A,"if(c.id=='argus')draw(s,1);","if(c.id=='argus')draw(s,1);if(c.id=='cass')cassFx(s,o);")
# ===== engine_b =====
B=rep(B,"p.hand=[];p.bf=[];draw(p,4);draw(G.e,4);G.turn=0;","p.hand=[];p.bf=[];G.turn=0;draw(p,4);draw(G.e,4);")
B=rep(B,"G.fi++;p.life=Math.min(p.max,p.life+2);return fight()","G.fi++;return fight()")
# ===== data =====
head=rep(head,"D.skies=['Chorus of the Deep',2,'E',0,0,'','Your flying army members get +1/+1.'","D.skies=['Chorus of the Deep',2,'E',0,0,'','Your flying army members get +1 power.'")
head=rep(head,"`When it dies, deal 3 damage to target opponent's army member.`","`When it dies or is offered, deal 3 damage to target opponent's army member.`")
head=rep(head,"const AC={P:'W'","""D.owl=[`Athena's Owl`,2,'C',1,2,'fp','','🦉','W',2];
D.iris=['Iris',2,'C',1,2,'fsp','','🌈','W',1];
D.helios=['Helios Charioteer',3,'C',3,2,'fhr','','☀️','R',2];
D.nike=['Nike',3,'C',2,2,'fdr','','🏆','R',2];
D.herm=[`Hermes' Messenger`,2,'C',1,2,'fo','When it enters, draw a card.','🕊️','B',1];
D.eagle=['Eagle of Zeus',4,'C',3,2,'fo','','🦅','B',3];
D.pegasus=['Pegasus',3,'C',2,3,'f','','🐎','A',2];
D.scout=['Siren Scout',1,'C',1,2,'f','','🧜','U',1];
D.song=['Song-Caller',2,'C',2,2,'f','','🎶','U',1];
const AC={P:'W'""")
head=rep(head,"camp:'O',ox:'O',","camp:'O',herm:'O',eagle:'O',owl:'P',iris:'P',helios:'R',nike:'R',ox:'O',")
m=_r5.search(r"POOL='([^']*)'",head);L=m.group(1).split(' ')
L=[x for x in L if x not in('spartan','diom','nestor')]+['owl','iris','helios','nike','herm','eagle','pegasus']
head=head.replace(m.group(0),"POOL='"+' '.join(L)+"'")
head=rep(head,"const ids=s=>","RAR.owl='C';RAR.iris='C';RAR.herm='C';RAR.helios='U';RAR.nike='U';RAR.eagle='U';RAR.pegasus='U';\nconst ids=s=>")
# ===== UI =====
tail=rep(tail,"Continue: draft 2 cards","Continue")
tail=rep(tail,"<div class=\"dsub\">Odysseus recovers 2 life first.</div>","")
tail=rep(tail,"Army ${cr(e).length}/5</span><u style","Army ${cr(e).length}/5</span><div class=\"cn\" style=\"margin-top:3px;opacity:.85\">◆ Mana ${e.mana}</div><u style")
tail=rep(tail,"top:${yo||0}px\" data-z=\"${z}\">","top:${yo||0}px${t=='h'&&c.fly>Date.now()?';visibility:hidden':''}\" data-z=\"${z}\">")
tail=rep(tail,"${e.hand.map(()=>'<div class=\"cb\"></div>').join('')}","${e.hand.map(c=>'<div class=\"cb\"'+(c.fly>Date.now()?' style=\"visibility:hidden\"':'')+'></div>').join('')}")
tail=rep(tail,"function render(){","function render(){render0();fitHand()}\nfunction render0(){")
tail=rep(tail,"function fit(){try{","function fit(){try{fitHand();")
tail=rep(tail,"function fit(){","""function fitHand(){try{const h=document.querySelector('.hand');if(!h)return;const cs=[...h.querySelectorAll('.cd')];cs.forEach(c=>{c.style.margin=''});const n=cs.length;if(n<2)return;const r0=cs[0].getBoundingClientRect(),hr=h.getBoundingClientRect(),st=getComputedStyle(h),z=(r0.width/cs[0].offsetWidth)||1,avail=Math.min(hr.width,innerWidth)-(parseFloat(st.paddingLeft)+parseFloat(st.paddingRight))*z,wv=r0.width;
if(wv*n-14*z*(n-1)<=avail)return;const sp=(avail-wv)/(n-1),m=(wv-sp)/(2*z);cs.forEach(c=>{c.style.margin='0 -'+m+'px'});cs[0].style.marginLeft='0';cs[n-1].style.marginRight='0'}catch(e){}}
function flyIn(c,s){if(!G||!G.turn)return;const mine=s===G.p,now=Date.now(),d=Math.max(0,(G.ft||0)-now);G.ft=now+d+350;c.fly=now+d+1300;const g=G;
setTimeout(()=>{if(g===G)render()},d+1340);
requestAnimationFrame(()=>{try{const src=document.querySelector(mine?'.decks .pile.mine[data-z="lib"]':'.decks .pile:nth-child(2)'),dst=mine?document.querySelector('.hand .cd[data-z="h:'+c.u+'"]'):[...document.querySelectorAll('.eHand .cb')].pop();if(!src||!dst)return;
const a=src.getBoundingClientRect(),b=dst.getBoundingClientRect(),el=document.createElement('div');el.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:0 0';
el.innerHTML=mine?card(c,'v:'+c.u):'<div class="cb" style="margin:0"></div>';document.body.appendChild(el);const w0=el.firstElementChild.offsetWidth||(mine?104:54),s0=a.width/w0,s1=b.width/w0;
const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')'},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')'}],{duration:1300,delay:d,easing:'ease-in-out',fill:'both'});an.onfinish=()=>el.remove();setTimeout(()=>{try{el.remove()}catch(e){}},d+1600)}catch(e){}})}
function fit(){""")
head=rep(head,".rmv{background:#000c}",".rmv{background:#000c}@media(min-width:561px){.rmv .rmw{zoom:1.2}}")
