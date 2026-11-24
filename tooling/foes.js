/* ===== v120: the opponent rework, shared ability layer =====
   Every enemy card keeps its id, name and art; F(id,{...}) rewrites what it does.
   Fields: c cost, a power, h health, f keyword letters, t rules text, v offering value, tag (theme tribe),
   etb(s,o,c) when it enters, die(s,o,c) when it dies, sac(s,o,c) when it is offered,
   up(s,o,c) at the start of its controller's turn, oup(s,o,c) at the start of the opponent's turn,
   end(s,o,c) at the end of its controller's turn, oend(s,o,c) at the end of the opponent's turn,
   atk(s,o,c) when it attacks, dfd(s,o,c,S) when the opponent attacks, hit(s,o,c,n) when it deals combat damage to the opponent,
   allyDie(s,o,c,x) / oppDie(s,o,c,x) when another of its side's / the opponent's army members dies,
   allyEnter(s,o,c,x) / oppEnter(s,o,c,x) when another army member enters on its side / the opponent's side,
   oppCast(s,o,c,x) when the opponent casts a spell,
   self(c) -> [power,health] bonus for itself, aura(x,c) -> [power,health] for each other army member on its side,
   oaura(x,c) -> [power,health] for each opposing army member,
   ai(s,o,c) -> {s:score,t:target} | null  (spells; creatures and permanents may use it too), fx(s,o,t) the spell's effect.
   s is always the card's own side, o the other side. */
const FOE={};
function F(id,o){const d=D[id];if(!d){try{console.warn('foes: no card',id)}catch(e){}return}FOE[id]=o;
 if(o.c!=null)d[1]=o.c;if(o.a!=null)d[3]=o.a;if(o.h!=null)d[4]=o.h;if(o.f!=null)d[5]=o.f;if(o.t!=null)d[6]=o.t;if(o.v!=null)d[9]=o.v;
 if(typeof ETB!='undefined')delete ETB[id];if(typeof DEATH!='undefined')delete DEATH[id];if(typeof ETBV!='undefined')delete ETBV[id];
 if(o.fx){FX[id]=(s,op,t)=>o.fx(s,op,t);SPA[id]=id}if(o.iv!=null)IV[id]=o.iv;if(o.ev!=null)ETBV[id]=o.ev}
/* ---------- helpers ---------- */
const fRoom=s=>cr(s).length<AM();
const fCnt=(s,id)=>s.bf.filter(x=>x.id==id).length;
const fTag=(s,tag,ex)=>cr(s).filter(x=>x!==ex&&FOE[x.id]&&FOE[x.id].tag==tag);
const fTop=L=>L.slice().sort((a,b)=>ev(b)-ev(a))[0];
const fLow=L=>L.slice().sort((a,b)=>ev(a)-ev(b))[0];
const fRnd=L=>L.length?L[Math.random()*L.length|0]:null;
const fNm=c=>D[c.id][0];
const fHp=c=>th(c)-c.dmg;
function fHurt(o,n,why){if(n<=0)return;o.life-=n;log((why||'')+(o===G.p?'You take ':G.e.nm+' takes ')+n+'.')}
function fGain(s,n,why){if(n<=0)return;s.life=Math.min(s.max+((s.ovr)||0),s.life+n);if(why)log(why)}
function fSum(s,id,n,mods){let k=0;for(let i=0;i<(n||1)&&fRoom(s);i++){const t=mk(id);if(mods)Object.assign(t,mods);enter(s,t);k++}return k}
function fBuff(c,a,h,perm){if(perm){c.pa+=a;c.pd+=h}else{c.ta+=a;c.td+=h}}
function fKey(c,k){if(!c.f.includes(k))c.f+=k;if(k=='h')c.sick=0}
function fTap(c,frz){c.tap=1;if(frz)c.frz=Math.max(c.frz||0,1)}
function fShuffle(s,id,n){for(let i=0;i<n;i++)s.deck.splice(Math.random()*(s.deck.length+1)|0,0,mk(id))}
function fRaise(s,pick){const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)&&(!pick||pick(x)));if(!g.length||!fRoom(s))return null;const x=fRnd(g);s.gy.splice(s.gy.indexOf(x),1);Object.assign(x,{dmg:0,tap:0,def:0,sick:1,frz:0,ta:0,td:0,vn:0,rs:0,att:0,sw:0});enter(s,x);return x}
function fDestroy(c){c.dmg=Math.max(c.dmg,th(c)+50)}
/* the player's own targeting rules: an enemy effect that "targets" respects Ward on the player's cards */
const fTg=o=>tg(o);
/* ---------- hooks ---------- */
const fOn=(s,k)=>s&&s.bf?s.bf.filter(x=>FOE[x.id]&&FOE[x.id][k]):[];
function fRun(k,s,o,...a){for(const c of fOn(s,k).slice()){if(!s.bf.includes(c))continue;try{FOE[c.id][k](s,o,c,...a)}catch(e){try{console.warn('foes',k,c.id,e)}catch(_){}}}}
let FEN=0;
const fNew=o=>cr(o).filter(x=>x.eT===G.turn).sort((a,b)=>(b.eN||0)-(a.eN||0));
const fNewest=o=>cr(o).slice().sort((a,b)=>(b.eN||0)-(a.eN||0))[0];
{const _e=enter;enter=function(s,c){const r=_e.apply(this,arguments);try{if(c){c.eN=++FEN;c.eT=G&&G.turn}}catch(e){}try{if(G&&G.e&&s&&s.bf.includes(c)){const o=oppOf(s);const F0=FOE[c.id];if(F0&&F0.etb)F0.etb(s,o,c);if(isC(c)){for(const x of fOn(s,'allyEnter'))if(x!==c&&s.bf.includes(x))FOE[x.id].allyEnter(s,o,x,c);for(const x of fOn(o,'oppEnter'))FOE[x.id].oppEnter(o,s,x,c)}}}catch(e){try{console.warn('foes etb',c&&c.id,e)}catch(_){}}return r}}
{const _d=egDie;egDie=function(s,c){_d(s,c);try{if(!G||!G.e)return;const o=oppOf(s);const F0=FOE[c.id];if(F0&&F0.die)F0.die(s,o,c);if(isC(c)){for(const x of fOn(s,'allyDie'))if(x!==c)FOE[x.id].allyDie(s,o,x,c);for(const x of fOn(o,'oppDie'))FOE[x.id].oppDie(o,s,x,c)}}catch(e){try{console.warn('foes die',c&&c.id,e)}catch(_){}}}}
{const _o=offer;offer=function(s,c){const F0=FOE[c&&c.id];const r=_o.apply(this,arguments);try{if(G&&G.e){const o=oppOf(s);if(F0&&F0.sac)F0.sac(s,o,c);if(isC(c))for(const x of fOn(s,'allySac'))if(x!==c)FOE[x.id].allySac(s,o,x,c)}}catch(e){}return r}}
{const _u=egUp;egUp=function(s,o){_u(s,o);try{if(!G||!G.e||!o)return;fRun('up',s,o);fRun('oup',o,s)}catch(e){}}}
{const _l=launch;launch=function(s,S,tgm){const r=_l.apply(this,arguments);try{const o=oppOf(s);for(const a of S)if(FOE[a.id]&&FOE[a.id].atk&&s.bf.includes(a))FOE[a.id].atk(s,o,a);for(const x of fOn(o,'dfd'))FOE[x.id].dfd(o,s,x,S)}catch(e){}return r}}
{const _r=resolve;resolve=function(){let hits=[];try{const c=G.cmb;if(c){const A=c.side=='p'?G.p:G.e;for(const u of c.atk){const a=A.bf.find(x=>x.u==u);if(!a||c.blk[u]||(c.bx&&c.bx[u])||(c.tg&&c.tg[u]))continue;if(FOE[a.id]&&FOE[a.id].hit)hits.push([A,a,pwr(a)])}
   for(const u of Object.values(c.blk||{})){const N=c.side=='p'?G.e:G.p;const b=N.bf.find(x=>x.u==u);if(b&&FOE[b.id]&&FOE[b.id].blk)hits.push([N,b,-1])}}}catch(e){}
 const r=_r.apply(this,arguments);
 try{if(G&&G.e&&G.p&&!['victory','lost','kleos'].includes(G.phase)){for(const[A,a,n]of hits){const o=oppOf(A);if(n>=0){if(n>0)FOE[a.id].hit(A,o,a,n)}else if(A.bf.includes(a))FOE[a.id].blk(A,o,a)}if(hits.length){sweep();chk()}}}catch(e){try{console.warn('foes hit',e)}catch(_){}}return r}}
{const _t=thEnd;thEnd=function(s){try{if(G&&G.e&&s===G.p){fRun('end',G.p,G.e);fRun('oend',G.e,G.p)}}catch(e){}return _t.apply(this,arguments)}}
{const _x=endE;endE=function(){try{if(G&&G.e){fRun('end',G.e,G.p);fRun('oend',G.p,G.e);sweep()}}catch(e){}return _x.apply(this,arguments)}}
{const _c=cast;cast=function(c,t){const r=_c.apply(this,arguments);try{if(G&&G.e&&c&&'SI'.includes(D[c.id][2]))fRun('oppCast',G.e,G.p,c)}catch(e){}return r}}
{const _p=px;px=function(c){let n=_p(c);try{const s=sideOf(c);if(!s||!G.e)return n;const F0=FOE[c.id];if(F0&&F0.self)n+=F0.self(c)[0]||0;for(const x of s.bf)if(x!==c&&FOE[x.id]&&FOE[x.id].aura)n+=FOE[x.id].aura(c,x)[0]||0;for(const x of oppOf(s).bf)if(FOE[x.id]&&FOE[x.id].oaura)n+=FOE[x.id].oaura(c,x)[0]||0}catch(e){}return n}}
{const _h=tx;tx=function(c){let n=_h(c);try{const s=sideOf(c);if(!s||!G.e)return n;const F0=FOE[c.id];if(F0&&F0.self)n+=F0.self(c)[1]||0;for(const x of s.bf)if(x!==c&&FOE[x.id]&&FOE[x.id].aura)n+=FOE[x.id].aura(c,x)[1]||0;for(const x of oppOf(s).bf)if(FOE[x.id]&&FOE[x.id].oaura)n+=FOE[x.id].oaura(c,x)[1]||0}catch(e){}return n}}
{const _s=planScore;planScore=function(c){const F0=FOE[c&&c.id];if(F0&&F0.ai){try{return F0.ai(G.e,G.p,c)}catch(e){return null}}return _s.apply(this,arguments)}}
/* combat damage adjustment: FOE[t].dmgIn(t,n,src) -> change to damage taken; FOE[src].dmgOut(src,n,t) -> change to damage dealt */
{const _d=dAdj;dAdj=function(t,n,src){let d=_d(t,n,src);try{if(FOE[t.id]&&FOE[t.id].dmgIn)d+=FOE[t.id].dmgIn(t,n,src)||0;if(src&&FOE[src.id]&&FOE[src.id].dmgOut)d+=FOE[src.id].dmgOut(src,n,t)||0}catch(e){}return d}}
/* buffs that last until the start of the giving side's next turn (survive the end-of-turn clean-up) */
function fHold(c,a,h,s){c.pa+=a;c.pd+=h;(c.hold=c.hold||[]).push([a,h,s===G.p?'p':'e'])}
function fUnhold(side){for(const s of[G.p,G.e])for(const c of s.bf){if(!c.hold)continue;c.hold=c.hold.filter(([a,h,k])=>{if(k!==side)return true;c.pa-=a;c.pd-=h;if(h>0)c.dmg=Math.min(c.dmg,Math.max(0,th(c)-1));return false})}}
{const _u=egUp;egUp=function(s,o){try{if(G&&G.e&&s)fUnhold(s===G.p?'p':'e')}catch(e){}return _u.apply(this,arguments)}}
/* the player's cards cost more: FOE[x].tax(c) on any enemy permanent returns extra cost for card c in the player's hand */
{const _l=ltx;ltx=function(c){let n=_l(c);try{if(G&&G.e&&G.p&&G.p.hand&&G.p.hand.includes(c))for(const x of G.e.bf)if(FOE[x.id]&&FOE[x.id].tax)n+=FOE[x.id].tax(c,x)||0}catch(e){}return n}}
/* decks: find an opponent by name anywhere (regular, elite, boss) and set its deck, life, hint and opening trump */
function fFoe(n){for(const k of Object.keys(CHARS)){const x=CHARS[k].en.find(e=>e.n==n);if(x)return x}const all=[...ELITES,...BOSS,...(typeof A3!='undefined'?A3.en:[])];return all.find(e=>e.n==n)}
function DK(n,o){const x=fFoe(n);if(!x){try{console.warn('foes: no opponent',n)}catch(e){}return}if(o.d)x.d=ids(o.d);if(o.l!=null)x.l=o.l;if(o.hint)x.hint=o.hint;if(o.mt)x.mt=o.mt;if(o.trump)x.trump=o.trump;if(o.mp)x.mp=o.mp;if(o.sb)x.sb=o.sb}
/* common AI scores for auto-targeted enemy spells */
const fAiKill=(o,dmg,min)=>{const T=fTop(fTg(o).filter(x=>fHp(x)<=dmg));return T&&ev(T)>=(min||2.5)?{s:2.5+ev(T)*.8,t:T}:null};
const fAiAlways=s=>({s});
