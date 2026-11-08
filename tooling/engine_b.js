const tg=o=>cr(o).filter(c=>!has(c,'w'));
const look=u=>[...G.p.bf,...G.e.bf].find(x=>x.u==u);
function pendOpts(P,c){return(P.who=='e'?G.e:G.p).bf.filter(T=>P.ok(T,c)&&(P.who!='e'||!has(T,'w')))}
const pendOk=(P,T,k)=>typeof T=='object'&&P.ok(T,G.pc)&&(P.who=='e'?k=='e'&&!has(T,'w'):k=='p');
function upkeep(s,o){if(s.bf.some(x=>x.id=='hearth')&&cr(s).some(c=>c.dmg>0)){cr(s).forEach(c=>heal(c,1));log('Hearth of Ithaca mends '+(s==G.p?'your':'its')+' army.')}
if(s.bf.some(x=>x.id=='censer')){const t=best(tg(o).filter(c=>!c.tap));if(t){t.tap=1;log('Poppy smoke lulls '+D[t.id][0]+' to sleep.')}}}
function fight(){const f=EN[G.fi],p=G.p;G.e=side(f.d,f.l);G.e.nm=f.n;p.deck=sh(p.recs.map(r=>mk(r.id,r)));p.gy=[];p.hand=[];p.bf=[];draw(p,4);draw(G.e,4);G.turn=0;G.cmb=0;G.sel=[];G.mode=0;G.blk=0;G.lib=0;G.pend=0;G.pc=0;G.endstep=0;log('Fight '+(G.fi+1)+' of 3: '+f.n);startP()}
function startP(){const p=G.p;G.turn++;p.mana=2;G.endstep=0;
for(const c of p.bf.slice()){if(c.frz)c.frz--;else c.tap=0;c.sick=0;c.att=0;c.sw=0;if(c.id=='horse'&&++c.t>=2){p.bf.splice(p.bf.indexOf(c),1);bury(p,c);const room=Math.max(0,5-cr(p).length);for(let i=0;i<Math.min(2,room);i++)enter(p,mk('sold'));log(room<2?'The Trojan Horse opens, but the army is full ('+room+' Soldier'+(room==1?'':'s')+').':'The Trojan Horse opens: two Soldiers!')}}
upkeep(p,G.e);draw(p,1);G.atkd=0;G.tg={};G.cur=0;G.phase='main';G.mode=0;G.blk=0;G.sel=p.bf.filter(c=>c.forced&&canAtk(c)).map(c=>c.u);G.msg='Your turn. Mana refills to 2; offer army members (💀) for more.';render()}
function cast(c,t){const p=G.p,d=D[c.id];p.mana-=cost(c);p.hand=p.hand.filter(x=>x!==c);log('You cast '+d[0]+'.');
if('CEA'.includes(d[2])){enter(p,c);const P=PEND[c.id];if(P){if(pendOpts(P,c).length){G.pend=c.id;G.pc=c;G.msg=P.m}}else ETB[c.id]&&ETB[c.id](p,G.e)}else{FX[c.id](p,G.e,t);bury(p,c)}sweep();chk();render()}
/* ---- combat evaluation shared by both sides ---- */
function pickBlocks(at,bl,life,tgm){const used=new Set(),out={},tot=at.filter(a=>!tgm[a.u]).reduce((n,a)=>n+pwr(a),0),danger=tot>=life?3:tot>=life*.6?1.6:1;
for(const a of at.slice().sort((x,y)=>pwr(y)-pwr(x))){if(pwr(a)<=0)continue;let bb=null,bg=0;const T=tgm[a.u]&&look(tgm[a.u]);
for(const b of bl){if(used.has(b.u)||!canBlock(b,a))continue;const kA=kills(b,a),kB=kills(a,b);let g=(kA?ev(a)+1:0)-(kB?ev(b)+1:0);
if(T){if(kills(a,T)||cdmg(a)>=th(T)-T.dmg)g+=ev(T)+1}else g+=pwr(a)*danger;
if(kw(a,'b')&&kB)g-=Math.max(0,pwr(a)-(th(b)-b.dmg));if(g>bg){bg=g;bb=b}}
if(bb){used.add(bb.u);out[a.u]=bb.u}}return out}
function combatEval(at,bl,life,tgm){const blk=pickBlocks(at,bl,life,tgm);let dmg=0,gain=0,loss=0;
for(const a of at){const b=bl.find(x=>x.u==blk[a.u]);if(b){if(kills(a,b))gain+=ev(b)+1;if(kills(b,a))loss+=ev(a)+1;if(kw(a,'b'))dmg+=Math.max(0,pwr(a)-(th(b)-b.dmg))}
else{const T=tgm[a.u]&&look(tgm[a.u]);if(T){if(cdmg(a)>=th(T)-T.dmg||kw(a,'v'))gain+=ev(T)+1;else gain+=cdmg(a)*.3}else dmg+=pwr(a)}}return{dmg,gain,loss,blk}}
function aiBlock(at){const e=G.e;Object.assign(G.cmb.blk,pickBlocks(at,cr(e).filter(b=>!b.tap&&!has(b,'n')),e.life,G.cmb.tg||{}))}
function launch(s,S,tgm){S.forEach(c=>{if(!has(c,'s'))c.tap=1;c.att=1;if(c.id=='titan')c.frz=1;if(!has(c,'f')&&shoal())s.life--});
const R=S.filter(c=>has(c,'y'));if(R.length){S.forEach(x=>{x.ta+=R.filter(r=>r!==x).length});log('Rally: the other attackers gain power.')}
return{side:s==G.p?'p':'e',atk:S.map(c=>c.u),blk:{},tg:tgm}}
function resolve(){const c=G.cmb,A=c.side=='p'?G.p:G.e,N=c.side=='p'?G.e:G.p,H=[];let aGain=0,nGain=0;
for(const u of c.atk){const a=A.bf.find(x=>x.u==u);if(!a)continue;const bu=c.blk[u],b=bu&&N.bf.find(x=>x.u==bu),da=pwr(a);
if(b){const db=pwr(b);H.push([b,da,a]);H.push([a,db,b]);if(kw(a,'b')&&da>0){const ex=da-(kw(a,'v')?1:th(b)-b.dmg);if(ex>0)N.life-=ex}if(kw(a,'d'))aGain+=da;if(kw(b,'d'))nGain+=db}
else{const T=c.tg&&c.tg[u]&&N.bf.find(x=>x.u==c.tg[u]);if(T){const dd=cdmg(a);H.push([T,dd,a]);if(kw(a,'d'))aGain+=dd}else{N.life-=da;if(kw(a,'d'))aGain+=da}}}
for(const[t,n,src]of H)if(n>0){t.dmg+=n;if(kw(src,'v'))t.vn=1}
A.life+=aGain;N.life+=nGain;
sweep();G.cmb=0;G.blk=0;G.sel=[];if(chk())return render();if(c.side=='p'){G.phase='main';G.msg='Combat resolved.';if(idle()){G.msg='Nothing left to do. Ending your turn…';const g=G;setTimeout(()=>{if(g==G&&G.phase=='main')bt('end')},1800)}render()}else endE()}
async function aiEnd(){const e=G.e,g=G,dm=cr(e).filter(c=>c.td>0&&c.dmg>=th(c)-c.td);if(!dm.length)return;
const alt=e.bf.some(x=>x.id=='altar')?1:0;for(const c of dm){if(!e.bf.includes(c))continue;const gain=sv(c)+alt,pl=e.hand.filter(x=>'CEA'.includes(D[x.id][2])&&cost(x)>e.mana&&cost(x)<=e.mana+gain&&(D[x.id][2]!='C'||cr(e).length-1<5)).sort((a,b)=>cost(b)-cost(a))[0];
if(!pl)continue;offer(e,c);await wait(1200);if(g!=G)return;e.mana-=cost(pl);e.hand=e.hand.filter(x=>x!==pl);log(e.nm+' plays '+D[pl.id][0]+' in its end step.');if(D[pl.id][2]!='C'){if(!await reveal(pl))return}enter(e,pl);ETB[pl.id]&&ETB[pl.id](e,G.p);render();await wait(1200);if(g!=G)return}}
async function endE(){const g=G;await aiEnd();if(g!=G)return;clean();sweep();if(chk())return render();startP()}
/* ---- AI planning ---- */
function planScore(c){const e=G.e,p=G.p,id=c.id,t=D[id][2],M=tg(p),rdy=cr(e).filter(canAtk),nr=rdy.length,hurt=cr(e).some(x=>x.dmg>0);
if(t=='C')return cr(e).length>=5?null:{s:ev(c)+1+(cr(e).length==0?4:0)};
if(t=='E'||t=='A'){if(e.bf.some(x=>x.id==id))return null;let s=IV[id]||5;
if(id=='shoal'&&!cr(p).some(x=>!has(x,'f')))return null;if(id=='mouth'&&!cr(p).some(x=>pwr(x)<=2))s=3;
if(id=='club'){const n=cr(e).filter(x=>pw(x)>=2).length;s=n>=2?8:n==1?5:2}
if(id=='lyre'){const n=cr(e).filter(x=>has(x,'f')).length;s=n>=2?8:n==1?5:2}
if((id=='censer'||id=='haze'||id=='canto')&&!cr(p).length&&p.hand.length<2)s-=3;if(!cr(e).length)s*=.4;return{s}}
const open=M.filter(x=>!x.tap);
switch(id){
case'honey':case'sip':case'undertow':{const T=best(open);if(!T||!nr||pw(T)<2)return null;return{s:3+pwr(T)*.8+nr,t:T}}
case'fog':{const n=cr(p).filter(x=>!x.tap).length;if(!nr||n<2)return null;const win=combatEval(rdy,[],p.life,{}).dmg>=p.life;return{s:win?60:2+n*1.5}}
case'breeze':return e.life<=e.max-3?{s:3+(e.max-e.life)/2+(cr(p).reduce((n,x)=>n+pwr(x),0)>=e.life-3?4:0)}:null;
case'milk':return(e.life<=e.max-4||hurt)?{s:3+(e.max-e.life)/2.5+(cr(p).reduce((n,x)=>n+pwr(x),0)>=e.life-4?4:0)}:null;
case'tide':{const T=cr(e).filter(x=>x.dmg>=2).sort((a,b)=>b.dmg-a.dmg)[0];return T?{s:3+T.dmg,t:T}:null}
case'melody':{const T=best(open.filter(x=>x.def))||best(open);if(!T||!cr(e).some(x=>!x.tap))return null;return{s:T.def?5:3,t:T}}
case'lure':{const T=best(M.filter(x=>th(x)-x.dmg<=2));return T?{s:3+ev(T)*.6,t:T}:null}
case'hurl':{const k=M.filter(x=>th(x)-x.dmg<=4).sort((a,b)=>ev(b)-ev(a))[0];return k?{s:2.5+ev(k)*.8,t:k}:null}}
return null}
function enemyHits(e,p,S,Bp){return combatEval(S,Bp,p.life,{})}
function attackPlan(e,p){const Bp=cr(p).filter(b=>!b.tap&&!has(b,'n')),ready=cr(e).filter(canAtk).filter(c=>pwr(c)>0);
const must=ready.filter(c=>c.id=='poly'||c.forced),free=ready.filter(c=>!must.includes(c));
const pAtk=cr(p).filter(c=>!has(c,'k')&&pw(c)>0&&!(c.tap&&c.frz));
const counter=S=>combatEval(pAtk,cr(e).filter(b=>!b.tap&&!has(b,'n')&&(!S.includes(b)||has(b,'s'))),e.life,{}).dmg;
const FUT=counter([])>=e.life&&combatEval(ready,Bp,p.life,{}).dmg<p.life;
const tgts=cr(p).filter(t=>t.tap&&ev(t)>=5).sort((a,b)=>ev(b)-ev(a));
const mkT=S=>{const tgm={},pool=S.slice().sort((x,y)=>cdmg(y)-cdmg(x));for(const T of tgts){const h=th(T)-T.dmg,use=[];let s=0;for(const a of pool){if(s>=h)break;if(tgm[a.u]||cdmg(a)<=0||!canHit(a,T))continue;use.push(a);s+=cdmg(a)}if(s>=h)use.forEach(a=>{tgm[a.u]=T.u})}return tgm};
let bestS=null,bs=-1e9;const n=free.length;
for(let m=0;m<(1<<n);m++){const S=[...must,...free.filter((_,i)=>m>>i&1)];if(!S.length&&must.length)continue;
for(const tgm of S.length?[{},mkT(S)]:[{}]){const r=S.length?combatEval(S,Bp,p.life,tgm):{dmg:0,gain:0,loss:0};
let sc;if(r.dmg>=p.life)sc=5000;else{const w=FUT?3:p.life<=8?2:1.2,ret=FUT?0:(()=>{const c=counter(S);return c>=e.life?1000:c*(e.life<=12?1.2:.6)})();sc=w*r.dmg+r.gain-(FUT?.5:1)*r.loss-ret+(S.length?.01:0)}
if(sc>bs){bs=sc;bestS={S,tgm}}}}
return bestS}
async function enemyTurn(){const e=G.e,p=G.p,g=G;G.phase='enemy';e.mana=2;G.sel=[];G.mode=0;
for(const c of e.bf){if(c.frz)c.frz--;else c.tap=0;c.sick=0;c.att=0;c.sw=0}upkeep(e,p);sweep();draw(e,1);G.msg=e.nm+' takes its turn…';
const pause=async()=>{render();await wait(3000);return g==G};if(!await pause())return;
let ns=0;for(let i=0;i<14;i++){const opts=e.hand.map(c=>({c,pl:planScore(c)})).filter(x=>x.pl&&x.pl.s>0),aff=opts.filter(x=>cost(x.c)<=e.mana).sort((a,b)=>b.pl.s-a.pl.s||cost(b.c)-cost(a.c)),top=aff[0];
{let s=0;if(ns<2)for(const x of opts.filter(x=>cost(x.c)>e.mana&&(!top||x.pl.s>=top.pl.s+3&&cost(x.c)>=3)).sort((a,b)=>b.pl.s-a.pl.s)){const c=x.c,tgtOk=D[c.id][2]!='C'||cr(e).length<=5;
const alt=e.bf.some(y=>y.id=='altar')?1:0,need=cost(c)-e.mana,val=y=>ev(y),S=[];let gn=0;for(const y of cr(e).sort((a,b)=>val(a)-val(b))){if(gn>=need)break;S.push(y);gn+=sv(y)+alt}
const ok=tgtOk&&gn>=need&&S.length<=2&&(D[c.id][2]!='C'||cr(e).length-S.length<5)&&(S.every(y=>th(y)-y.dmg<=1)||x.pl.s>=S.reduce((n,y)=>n+val(y),0)+4);
if(ok){S.forEach(y=>{offer(e,y);ns++});s=1;break}}
if(s){if(!await pause())return;continue}if(!top)break}
const pl=top.c,P=top.pl,d=D[pl.id];e.mana-=cost(pl);e.hand=e.hand.filter(x=>x!==pl);log(e.nm+' plays '+d[0]+'.');if(d[2]!='C'){if(!await reveal(pl))return}
if('CEA'.includes(d[2])){enter(e,pl);ETB[pl.id]&&ETB[pl.id](e,p)}else{FX[pl.id](e,p,P.t);bury(e,pl)}
sweep();if(chk())return render();if(!await pause())return}
/* stances */
const Bp0=cr(p).filter(b=>!b.tap&&!has(b,'n')),r0=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')),LETHAL=r0.length&&combatEval(r0,Bp0,p.life,{}).dmg>=p.life;
const pA=cr(p).filter(c=>!has(c,'k')&&pw(c)>0&&!(c.tap&&c.frz)),myA=Math.max(0,...cr(p).filter(x=>!x.def).map(x=>pwr(x)));
const FUT0=!LETHAL&&combatEval(pA,cr(e).filter(b=>!b.tap&&!has(b,'n')),e.life,{}).dmg>=e.life;
for(const c of cr(e)){const want=has(c,'k')?1:has(c,'n')?0:(LETHAL||FUT0)&&pw(c)>0?0:(c.id=='poly'||c.forced)?0:pw(c)==0?1:th(c)-c.dmg<=1?1:(e.life<=6&&myA>0&&th(c)-c.dmg<=myA)?1:0;
if(!!c.def!=!!want&&!c.sw&&!(want&&c.att)){if(!stance(e,c)){log(e.nm+' sets '+D[c.id][0]+' to '+(c.def?'defense.':'attack.'));if(!await pause())return}}}
const plan=attackPlan(e,p);if(!plan||!plan.S.length){log(e.nm+' holds position.');return endE()}
G.cmb=launch(e,plan.S,plan.tgm);G.phase='blockP';G.blk=0;G.msg='They attack! Click your army member, then the attacker to block. Quick spells and offerings work now. A dashed red outline marks a targeted army member.';chk();render()}
function hd(z){if(['enemy','kleos','lost','victory','draft','remove','nextf'].includes(G.phase))return;const[k,u]=z.split(':'),p=G.p,e=G.e,M=G.mode,sf=s=>s.bf.find(c=>c.u==u);
if(G.pend){const P=PEND[G.pend],T=k=='e'?sf(e):k=='p'?sf(p):0;if(!T||!pendOk(P,T,k))return msg(P.m);P.fn(T);G.pend=0;G.pc=0;G.msg='Your turn.';sweep();chk();return render()}
if(M&&M.tgt){const t=k=='e'?sf(e):k=='p'?sf(p):(k=='ef'||k=='pf')?k:0;G.mode=0;
if(M.tgt===2){if(!t||(typeof t=='object'&&(!isC(t)||(k=='e'&&has(t,'w'))))){G.msg=t&&typeof t=='object'&&has(t,'w')?'That army member is warded.':'Cancelled.';return render()}M.b.tap=1;if(t=='ef')e.life--;else if(t=='pf')p.life--;else t.dmg++;log('The Bow strikes.');sweep();chk();return render()}
if(!t||typeof t=='string'||!tsOk(M.tgt,t,k)){G.msg='Cancelled.';return render()}if(k=='e'&&M.tgt!='ei'&&has(t,'w')){G.msg='That army member is warded: it cannot be targeted.';return render()}return cast(M.c,t)}
if(k=='s'||k=='o'){const c=sf(p);if(!c||!isC(c))return;
if(k=='s'){if(G.phase!='main')return msg('Shift stances on your own turn.');const r=stance(p,c);return msg(r||(c.def?'Holding in defense.':'Back to attack.'))}
if(!['main','blockP','dmgP'].includes(G.phase))return;offer(p,c);G.sel=G.sel.filter(x=>x!=c.u);if(G.blk==c.u)G.blk=0;sweep();chk();return render()}
if(k=='h'){const c=p.hand.find(x=>x.u==u),d=D[c.id];if(cost(c)>p.mana)return msg('Not enough mana. Offer an army member (💀) for more.');if(d[2]=='C'&&cr(p).length>=5)return msg('Your army is full (5 army members). Offer one first.');
if(!(G.phase=='main'||(d[2]=='I'&&['blockP','dmgP'].includes(G.phase))))return msg('Only quick spells can be cast now.');
const code=TS[c.id];if(code){const ok=[...p.bf.map(x=>['p',x]),...e.bf.map(x=>['e',x])].some(([k2,x])=>tsOk(code,x,k2)&&!(k2=='e'&&has(x,'w')&&code!='ei'));if(!ok)return msg('No legal target for '+d[0]+'.');G.mode={tgt:code,c};return msg(TSM[code])}return cast(c)}
if(k=='p'){const c=sf(p);if(c.id=='bow'){if(c.tap)return msg('The Bow is tapped.');G.mode={tgt:2,b:c};return msg('Bow: choose an army member or a player.')}
if(!isC(c))return;
if(G.phase=='main'){if(!canAtk(c))return msg(has(c,'k')?'Sentinels can only defend.':c.sick?'Fatigue: it just arrived.':c.tap?'Tapped.':c.def?'Army members in defense form cannot attack. Shift stance first.':'Cave Mouth stops army members with power 2 or less.');if(c.forced)return msg('Forced to attack.');if(G.sel.includes(c.u)){G.sel=G.sel.filter(x=>x!=c.u);delete G.tg[c.u];G.cur=G.sel[G.sel.length-1]}else{G.sel=[...G.sel,c.u];G.cur=c.u}return render()}
if(G.phase=='blockP'){if(c.tap)return msg('Tapped.');if(has(c,'n'))return msg('Berserkers can only attack; they cannot block.');G.blk=c.u;return msg('Now click the attacker to block.')}}
if(k=='ef'&&G.phase=='main'){const a=G.cur&&G.sel.includes(G.cur)?G.cur:G.sel[G.sel.length-1];if(a)delete G.tg[a];return msg('Attackers hit the player unless you pick a tapped army member.')}
if(k=='e'&&G.phase=='main'){const T=sf(e),a=G.cur&&G.sel.includes(G.cur)?G.cur:G.sel[G.sel.length-1];if(!T||!isC(T)||!T.tap)return msg('Only tapped army members can be targeted.');if(!a)return msg('Select an attacker first.');const A=p.bf.find(x=>x.u==a);if(has(T,'w'))return msg('Warded: it cannot be targeted.');if(has(T,'f')&&!has(A,'f'))return msg('Only a flying army member can attack a flying target.');if(G.tg[a]==T.u){delete G.tg[a];return msg('That attacker will hit the player instead.')}G.tg[a]=T.u;G.cur=a;return msg(D[A.id][0]+' will attack '+D[T.id][0]+' for '+cdmg(A)+' damage'+(kw(A,'x')?' (Siege: full damage).':pwr(A)>1?' (one less than its power of '+pwr(A)+', because it is hitting an army member).':' (attacks on army members deal 1 less damage, minimum 1).'))}
if(k=='e'&&G.phase=='blockP'&&G.blk){const a=sf(e),b=p.bf.find(x=>x.u==G.blk);if(!a||!b||!G.cmb.atk.includes(a.u))return;if(!canBlock(b,a))return msg('Only flyers can block a flyer.');
for(const q in G.cmb.blk)if(G.cmb.blk[q]==b.u)delete G.cmb.blk[q];G.cmb.blk[a.u]=b.u;G.blk=0;msg(D[b.id][0]+' blocks '+D[a.id][0]+'.')}}
function bt(b){const p=G.p;if(b=='okl'){G.lib=0;G.gv=0;return render()}if(b=='ok'){const r=G.rv;G.rv=0;r&&r.res(1);return render()}if(G.phase=='enemy')return;if(G.pend&&b!='new')return msg(PEND[G.pend].m);
if(b=='new')return newRun();
if(b=='next')return startReward();
if(b=='fight'){G.fi++;p.life=Math.min(p.max,p.life+2);return fight()}
if(b=='rmyes'){if(G.rm>=0)p.recs.splice(G.rm,1);G.rm=-1;G.phase='nextf';return render()}
if(b=='rmno'){G.rm=-1;return render()}
if(b=='cancel'){G.mode=0;return msg('Cancelled.')}
if(b=='res')return resolve();
if(b=='end'){const dm=cr(p).filter(c=>c.td>0&&c.dmg>=th(c)-c.td);if(dm.length&&!G.endstep){G.endstep=1;return msg('End step: '+dm.map(c=>D[c.id][0]).join(', ')+' will die when the +2/+2 fades. Offer it now for mana, or end your turn again.')}G.endstep=0;clean();sweep();if(chk())return render();G.sel=[];return enemyTurn()}
if(b=='atkall'){if(G.atkd)return msg('You already attacked this turn.');const all=cr(p).filter(canAtk);if(!all.length)return msg('Nothing can attack right now.');G.sel=all.map(c=>c.u);return bt('atk')}
if(b=='atk'){if(G.atkd)return msg('You already attacked this turn.');const at=G.sel.map(u=>p.bf.find(c=>c.u==u)).filter(c=>c&&canAtk(c));if(!at.length)return msg('Select attackers first.');
G.atkd=1;p.bf.forEach(c=>c.forced=0);const tgm={};for(const a of at)if(G.tg[a.u]){const T=G.e.bf.find(x=>x.u==G.tg[a.u]);if(T&&canHit(a,T))tgm[a.u]=T.u}G.cmb=launch(p,at,tgm);aiBlock(at);G.phase='dmgP';G.msg='Blocks are set. Cast quick spells or offer army members, then resolve.';chk();render()}}
