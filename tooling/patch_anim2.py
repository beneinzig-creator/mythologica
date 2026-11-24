# patch_anim2: fight-start order and the add-to-deck flight.
#
# 1. Fight start. fight() dealt the opening hand at once and its caller rendered the board; the intro (fxIntro)
#    was only scheduled 0.1 s later and its backdrop faded in from transparent over 0.4 s. So the battlefield
#    showed first, the intro covered it, and the deal flew (unseen) behind the intro: by "Begin" the hand was
#    already dealt. Now, when a fight has an intro, the board is hidden (html.fxhold) before anything paints,
#    the intro's backdrop is opaque from its first frame, and every card flight is held. On Begin (click or
#    the intro's own timeout) the board appears with its entry animation and the held opening deal flies in.
#    Fights without an intro are unchanged. Safety: the hold is released if the intro disappears any other way,
#    and only an intro that is still on screen can release it (an older intro's pending auto-close used to).
# 2. Add-to-deck. Cards that join a deck mid-fight now fly face up from where they came from into that deck's
#    pile, staggered, on the same front-loaded curve as the draw flight, for both sides. Detection is generic:
#    after each render the decks are compared with the last render. A card that was on the table or in a hand
#    flies from that spot (Furnace, Ledger); one from the graveyard flies from the graveyard pile (Cloud
#    Somersault); a newly made card flies from the card whose effect made it. That source is recorded by
#    wrapping the effect dispatchers (FX, ETB, DEATH, wkUp, a3Up, a3Phase) and noting which card ids (the global
#    counter U) were created while each one ran: Hair-Born Troop/Legion, Peach Keeper, Peach Tree, Pluck a Hair,
#    A Thousand Hairs, Seventy-Two Changes, Shed a Skin, the Clones, Mountain Weights (into the enemy deck),
#    The Druj's Lie, the Red Dragon's Heads. New cards with no recorded source (e.g. a tutorial building its deck)
#    are not animated. Sizes are measured live (the card clone and the piles), nothing is hard-coded.

_b3("function flyIn(c,s){if(!G||!(G.turn||G.deal69))return;const mine=s===G.p,K=mine?'ft':'fte',deal=!G.turn,",
    "function flyIn(c,s){if(!G||!(G.turn||G.deal69||FXH.rel))return;if(FXH.on){FXH.q.push([c,s]);c.fly=Date.now()+864e5;return}"
    "const mine=s===G.p,K=mine?'ft':'fte',deal=!G.turn||!!FXH.rel,")
_b3("{const _fi=flyIn;flyIn=function(c,s){try{if(s===G.p)SFX.play('slide')}catch(e){}",
    "{const _fi=flyIn;flyIn=function(c,s){try{if(s===G.p&&!FXH.on)SFX.play('slide')}catch(e){}")
_b3("{const _f=fight;fight=function(){const out=_f.apply(this,arguments);try{if(GSOK())gsap.delayedCall(.1,()=>{if(G.boss||G.elt||(G.e&&FIG[G.e.nm]))fxIntro()})}catch(e){}return out}}",
    "{const _f=fight;fight=function(){let hold=false;try{hold=GSOK()}catch(e){}if(FXH.on||FXH.q.length)fxRelease(0);if(hold){FXH.on=1;FXH.q=[]}"
    "let out;try{out=_f.apply(this,arguments)}catch(e){fxRelease(0);throw e}"
    "if(hold){let shown=false;try{if(G.boss||G.elt||(G.e&&FIG[G.e.nm])){fxIntro();shown=!!document.getElementById('fxin')}}catch(e){}"
    "if(shown){FXH.shown=1;document.documentElement.classList.add('fxhold')}else fxRelease(0)}return out}}")
# the intro's backdrop is opaque from its first frame while the board is held (it used to fade in over it)
_b3("const tl=gsap.timeline();tl.from(o,{opacity:0,duration:.4})",
    "const tl=gsap.timeline();tl.from(o,{opacity:FXH.on?1:0,duration:.4})")
_b3("let gone=0;const close=()=>{if(gone)return;gone=1;",
    "let gone=0;const close=()=>{if(gone)return;gone=1;try{if(o.isConnected)fxRelease(1)}catch(e){}")

_JS = r"""
/* ===== patch_anim2: fight-start order, add-to-deck flight ===== */
try{const st=document.createElement('style');st.id='pa2';st.textContent='html.fxhold #app{visibility:hidden}';document.head.appendChild(st)}catch(e){}
// the board appears and the held deal flies in only after the intro
function fxRelease(show){const q=FXH.q,R=document.documentElement,was=R.classList.contains('fxhold');FXH.q=[];FXH.on=0;FXH.shown=0;R.classList.remove('fxhold');
 if(show&&was)try{if(GSOK()&&G&&anGrp(G.phase)=='fight')screenIn(G.phase)}catch(e){}
 const g=G,go=()=>{if(g!==G||!G||!q.length)return;G.ft=G.fte=0;FXH.rel=1;try{q.forEach(([c,s])=>{if(s.hand.includes(c))flyIn(c,s);else c.fly=0})}finally{FXH.rel=0}};
 if(show&&was)setTimeout(go,380);else go()}
// --- add-to-deck: where each new card came from ---
const PAD={src:[],dk:null,ef:null};
const padRect=u=>{try{if(u==null||typeof document=='undefined')return null;const el=document.querySelector('#app .cd[data-z$=":'+u+'"]');if(!el)return null;const r=el.getBoundingClientRect();return r.width?{left:r.left,top:r.top,width:r.width,height:r.height}:null}catch(e){return null}};
function padWrap(f,who){if(typeof f!='function'||f.__pad)return f;const w=function(){const u0=U;try{return f.apply(this,arguments)}finally{if(U>u0)try{const x=who.apply(this,arguments)||{};
 PAD.src.push({lo:u0,hi:U,u:x.u,r:padRect(x.u),side:x.s?(x.s===(G&&G.p)?'p':'e'):null});if(PAD.src.length>60)PAD.src.splice(0,PAD.src.length-60)}catch(e){}}};w.__pad=1;return w}
const padOn=(s,id)=>{const c=s&&s.bf&&[...s.bf].reverse().find(x=>x.id==id);return c?c.u:null};
try{for(const k in FX)FX[k]=padWrap(FX[k],function(s){return{s,u:typeof CUR!='undefined'&&CUR&&CUR.id==k?CUR.u:padOn(s,k)}})}catch(e){}
try{for(const k in ETB)ETB[k]=padWrap(ETB[k],function(s){return{s,u:padOn(s,k)}})}catch(e){}
try{for(const k in DEATH)if(DEATH[k]&&DEATH[k].fn)DEATH[k].fn=padWrap(DEATH[k].fn,function(s,o,c){return{s,u:c&&c.u}})}catch(e){}
try{wkUp=padWrap(wkUp,function(s){return{s,u:padOn(s,'wtree')}})}catch(e){}
try{if(typeof a3Up=='function')a3Up=padWrap(a3Up,function(s){return{s,u:padOn(s,'xdruj')}})}catch(e){}
try{if(typeof a3Phase=='function')a3Phase=padWrap(a3Phase,function(){const b=G&&G.e&&G.e.bf.find(x=>x.boss);return{s:G&&G.e,u:b&&b.u}})}catch(e){}
const padSnap=()=>({p:new Set(G.p.deck.map(c=>c.u)),e:new Set(G.e.deck.map(c=>c.u)),gp:new Set(G.p.gy.map(c=>c.u)),ge:new Set(G.e.gy.map(c=>c.u)),U});
const padPile=k=>document.querySelector(k=='p'?'#app .decks .pile.mine[data-z="lib"]':'#app .decks .pile:not(.mine)');
// no visible source card (an enemy spell): the middle of the caster's side of the field, at 60% card size
const padSide=k=>{const f=document.querySelector(k=='p'?'#app .fld.fp':'#app .fld.fe');if(!f)return null;const r=f.getBoundingClientRect();return r.width?{left:r.left+r.width/2,top:r.top+r.height/2,width:0,height:0,fb:1}:null};
function padPre(){const m=new Map();try{document.querySelectorAll('#app .cd[data-z]').forEach(el=>{const z=el.dataset.z||'',i=z.indexOf(':');if(i<1||!'hpe'.includes(z[0]))return;const r=el.getBoundingClientRect();if(r.width)m.set(z.slice(i+1),{left:r.left,top:r.top,width:r.width,height:r.height})})}catch(e){}
 const gr=k=>{const el=document.querySelector('#app [data-z="'+k+'"]');if(!el)return null;const r=el.getBoundingClientRect();return r.width?{left:r.left,top:r.top,width:r.width,height:r.height}:null};return{m,gp:gr('gyp'),ge:gr('gye')}}
function padPost(P){if(!G||!G.p||!G.e||!G.p.deck||!G.e.deck||typeof anGrp!='function'||anGrp(G.phase)!='fight'){PAD.dk=null;PAD.ef=null;PAD.src=[];return}
 if(PAD.ef!==G.e||!PAD.dk){PAD.ef=G.e;PAD.dk=padSnap();PAD.src=[];return}
 const old=PAD.dk,now=padSnap();PAD.dk=now;let ok=false;try{ok=GSOK()&&!FXH.on}catch(e){}if(!ok)return;
 ['p','e'].forEach(k=>{const s=k=='p'?G.p:G.e,list=[];
  s.deck.forEach(c=>{if(old[k].has(c.u))return;let r=null,from=null;const su=String(c.u);
   if(P&&P.m.has(su))r=P.m.get(su);
   else if(old.gp.has(c.u)||old.ge.has(c.u)){r=old.gp.has(c.u)?P&&P.gp:P&&P.ge;from='gy'}
   else if(c.u>old.U){let b=null;for(const x of PAD.src)if(c.u>x.lo&&c.u<=x.hi&&(!b||x.hi-x.lo<b.hi-b.lo))b=x;if(!b)return;r=padRect(b.u)||b.r||padSide(b.side||k);if(!r)return}
   else return;
   if(r)list.push([c,r,from])});
  if(list.length)padFly(k,list)})}
// the flight: face up, from the source to the pile, staggered, same curve as the draw
function padFly(k,list){const g=G;list.slice(0,8).forEach(([c,r,from],i)=>{let el=null,fin=false;const DUR=700,D0=i*140;
 const done=()=>{fin=true;try{el&&el.remove()}catch(e){}};setTimeout(()=>{if(!fin)done()},D0+DUR+4000);
 requestAnimationFrame(()=>{try{if(g!==G)return;const pile=padPile(k);if(!pile)return;
  el=document.createElement('div');el.className='pa2fly';el.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:50% 50%;visibility:hidden;will-change:transform,opacity';
  el.innerHTML=card(c,'v:'+c.u);const cd=el.firstElementChild;if(cd){cd.style.margin='0';cd.style.transition='none';cd.style.translate='none';cd.style.scale='none'}document.body.appendChild(el);
  const r0=el.getBoundingClientRect(),w0=r0.width||1,h0=r0.height||1,sA=r.fb?.6:Math.sqrt((r.width*r.height)/(w0*h0))||1,ax=r.left+r.width/2,ay=r.top+r.height/2,rot0=(k=='p'?6:-6)*(i%2?-1:1);
  const ease=t=>.5-.5*Math.cos(Math.PI*Math.pow(t,.82));let t0=-D0,last=null;
  const step=ts=>{if(fin)return;if(g!==G)return done();{const dt=last==null?0:Math.max(0,ts-last);t0+=dt>45?17:dt}last=ts;if(t0<0){requestAnimationFrame(step);return}
   const p=padPile(k);if(!p)return done();const b=p.getBoundingClientRect(),bx=b.left+b.width/2,by=b.top+b.height/2,s1=Math.sqrt((b.width*b.height)/(w0*h0))||sA;
   const t=Math.min(1,t0/DUR),pop=Math.min(1,t/.18),pk=Math.sin(Math.PI*pop/2),u=Math.max(0,(t-.12)/.88),q=ease(u);
   const x=ax+(bx-ax)*q,y=ay+(by-ay)*q-Math.sin(Math.PI*q)*Math.min(30,Math.hypot(bx-ax,by-ay)*.08)-(1-q)*14*pk,sc=(sA*(1+.08*pk))+(s1-sA*(1+.08*pk))*q,op=u>.82?Math.max(0,1-(u-.82)/.18):1;
   el.style.visibility='visible';el.style.opacity=from=='gy'&&t<.12?(t/.12).toFixed(3):op.toFixed(3);
   el.style.transform='translate('+(x-w0/2-r0.left).toFixed(1)+'px,'+(y-h0/2-r0.top).toFixed(1)+'px) rotate('+(rot0*(1-q)).toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
   if(t<1){requestAnimationFrame(step);return}
   done();try{if(GSOK())gsap.fromTo(p,{scale:1.12},{scale:1,duration:.35,ease:'back.out(2.5)',clearProps:'scale,transform'})}catch(e){}};
  requestAnimationFrame(step)}catch(e){done()}})})}
{const _R=render;render=function(){let P=null;try{P=padPre()}catch(e){}const out=_R.apply(this,arguments);
 try{if(FXH.on&&FXH.shown&&!document.getElementById('fxin'))fxRelease(0)}catch(e){}try{padPost(P)}catch(e){}return out}}
"""
_b3("showChars();\n</script>", _JS + "showChars();\n</script>")
# FXH lives at the top of the script so engine code that runs during load can read it
_b3("let G,U=0;", "let G,U=0;const FXH={on:0,q:[],rel:0,shown:0};")
