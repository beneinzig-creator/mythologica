# patch_anim: fight animations — the red/blue blink, the attack lunge, and smooth draws.
#
# Measured frame by frame in headless Chrome (requestAnimationFrame recorder; see the PR for the method).
#
# 1. Blink. Three separate causes, all fixed where they start:
#    a. render() rebuilds the whole board (innerHTML), so every infinite CSS animation on it restarts at 0%
#       on each render: the blue "can block / can be targeted" pulse (fxok, 22px glow -> 8px in one frame),
#       the red dashed "targeted" outline (tf) and the table torchlight (fxtorch). Renders come every few
#       hundred ms in a fight (each drawn card landing, each click), so the glows blinked. Now every infinite,
#       undelayed CSS animation is pinned to the document clock (startTime 0) after each render, so a rebuilt
#       card continues the pulse exactly where the old one was. (The Legendary sweep keeps its own clock.)
#    b. The damage flash eased `filter` with elastic.out, so brightness bounced 1.7 -> .78 -> 1.06 (a red flash
#       then a dark flicker), and at the end clearProps snapped it from full colour to the tapped card's
#       grayscale/brightness(.8): a second blink. The flash now fades from tint to the card's own filter on one
#       smooth curve, and the shake is a separate transform.
#    c. Any render during the 0.5 s flash replaced the element and cut the flash off mid-way. Card animations now
#       carry across renders (re-attached to the rebuilt card at the same elapsed time).
# 2. Attack. The old lunge treated GSAP's x/y as being in the tapped card's rotated frame and swapped them, but
#    GSAP 3.12 folds the CSS `rotate` into its own transform, so x/y are already screen-space: tapped attackers
#    lunged sideways or downwards, and after resolving jumped ~400px before sliding home. The new attack uses the
#    CSS `translate`/`scale` properties (screen-space, independent of the tap rotation, compositor-only):
#    a short ease toward the owner's side, a faster lunge until the card's edge meets the blocker or the health
#    bar, impact, then combat resolves and the card glides back from the impact point to its slot.
# 3. Draw. (a) The flight ease was cubic in-out over 900 ms: the card sat on the library for ~150 ms, then
#    crossed the screen at up to 80px per frame (3x its average speed), then crawled into place — a stutter,
#    then a teleport. Now a front-loaded sine curve (peak ~1.6x average) over 620 ms, with a slight arc.
#    (b) Every landing called render(), rebuilding the board while the next cards were still in the air (and
#    restarting the glows, 1a). A landing now just reveals the card that was already waiting in its slot.
#    (c) The flight follows the library as well as the slot, so the opening deal no longer starts from where the
#    library was before the fight screen slid in.
# Also: the FLIP that slides cards between renders now uses `translate` (+ `rotate` when a card taps or untaps,
# which used to snap), carries across renders, and blockers are lined up under their attacker before the FLIP
# measures them (align() used to run a frame later and jump them sideways).

_rng69("function flyIn(c,s){if(!G||!(G.turn||G.deal69))return;", "requestAnimationFrame(step)}catch(e){land()}})}",
    r"""function flyIn(c,s){if(!G||!(G.turn||G.deal69))return;const mine=s===G.p,K=mine?'ft':'fte',deal=!G.turn,now=Date.now(),d=Math.max(0,(G[K]||0)-now),DUR=deal?640:620;G[K]=now+d+(deal?190:260);c.fly=now+d+DUR+60000;const g=G;
let wrap=null,fin=false;
const done=()=>{fin=true;try{wrap&&wrap.remove()}catch(e){}};
const dstOf=()=>{if(mine)return document.querySelector('#app .hand .cd[data-z="h:'+c.u+'"]');const i=s.hand.indexOf(c);return i<0?null:(document.querySelectorAll('#app .eHand .cb')[i]||null)};
// landing reveals the card already waiting (hidden) in its slot; no re-render while other cards are in the air
const land=()=>{if(fin)return;fin=true;c.fly=0;let shown=false;try{if(g===G){const el=dstOf();if(el){el.style.visibility='';shown=true}}}catch(e){}
 if(!shown)try{if(g===G)render()}catch(e){}try{wrap&&wrap.remove()}catch(e){}};
setTimeout(()=>{if(!fin&&(!wrap||!wrap.isConnected))land()},d+DUR+2500);setTimeout(land,d+DUR+9000);
const srcOf=()=>document.querySelector(mine?'.decks .pile.mine[data-z="lib"]':'.decks .pile:nth-child(2)');
requestAnimationFrame(()=>{try{const src=srcOf(),dst0=dstOf();if(!src||!dst0)return land();
wrap=document.createElement('div');wrap.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:50% 50%;visibility:hidden;will-change:transform';
const inr=document.createElement('div');inr.className=mine?'hand':'eHand';inr.style.cssText='position:static;inset:auto;margin:0;padding:0;width:max-content;height:auto;max-width:none;display:block;overflow:visible;transform:none;translate:none;scale:none';
const cl=dst0.cloneNode(true);cl.removeAttribute('data-z');cl.removeAttribute('data-cu');cl.style.visibility='inherit';cl.style.margin='0';cl.style.transition='none';cl.style.translate='none';inr.appendChild(cl);wrap.appendChild(inr);document.body.appendChild(wrap);
const r0=wrap.getBoundingClientRect(),w0=r0.width||1,h0=r0.height||1,rot0=mine?-8:8;let a=src.getBoundingClientRect();
let bx=null,by=0,s1=1,el=-d,last=null;
// front-loaded sine: leaves the library at once, never faster than ~1.6x its average speed, settles softly
const ease=t=>.5-.5*Math.cos(Math.PI*Math.pow(t,.82));
const step=ts=>{if(fin)return;if(g!==G)return done();if(!document.body.contains(wrap))return land();
 el+=last==null?0:Math.min(50,Math.max(0,ts-last));last=ts;c.fly=Date.now()+60000;
 if(el<0){requestAnimationFrame(step);return}
 const sN=srcOf();if(sN){const q=sN.getBoundingClientRect();if(q.width)a=q}
 const ax=a.left+a.width/2,ay=a.top+a.height/2,s0=a.width/w0;
 const dst=dstOf();if(!dst){if(!s.hand.includes(c)){c.fly=0;return done()}}else{const b=dst.getBoundingClientRect();if(b.width){bx=b.left+b.width/2;by=b.top+b.height/2;s1=b.width/w0}}
 if(bx==null){bx=ax;by=ay;s1=s0}
 const t=Math.min(1,el/DUR),k=ease(t),arc=Math.sin(Math.PI*k)*Math.min(26,Math.hypot(bx-ax,by-ay)*.06)*(mine?1:-1),x=ax+(bx-ax)*k,y=ay+(by-ay)*k-arc,sc=s0+(s1-s0)*k;
 wrap.style.visibility='visible';wrap.style.transform='translate('+(x-w0/2-r0.left).toFixed(1)+'px,'+(y-h0/2-r0.top).toFixed(1)+'px) rotate('+(rot0*(1-k)).toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
 if(t<1){requestAnimationFrame(step);return}
 land()};
requestAnimationFrame(step)}catch(e){land()}})}""")

_JSANIM = r"""
/* ===== patch_anim: fight animations (blink, attack, draw) ===== */
const PA={l:[],ret:null};
const paEl=u=>document.querySelector('#app .fld .cd[data-z$=":'+u+'"]')||document.querySelector('#app .cd[data-z$=":'+u+'"]');
const paSc=(el,r)=>{r=r||el.getBoundingClientRect();return Math.sqrt((r.width*r.height)/((el.offsetWidth*el.offsetHeight)||1))||1};
// card animations that survive render(): re-attached to the rebuilt card at the same elapsed time
function paStop(u,tag){PA.l=PA.l.filter(e=>{if(e.uid==u&&e.tag==tag){try{e.a.cancel()}catch(_){}return false}return true})}
function paRun(u,tag,kf,opt,el){el=el||paEl(u);if(!el||!el.animate)return null;paStop(u,tag);const e={uid:u,tag,kf,opt,t0:performance.now(),el,a:el.animate(kf,opt)};PA.l.push(e);return e}
function paPost(){const now=performance.now();PA.l=PA.l.filter(e=>{if(now>=e.t0+(e.opt.delay||0)+e.opt.duration&&!e.opt.fill)return false;
 if(e.el.isConnected)return true;const n=paEl(e.uid);if(!n||!n.animate)return false;e.el=n;e.a=n.animate(e.kf,e.opt);e.a.currentTime=now-e.t0;return true})}
// infinite CSS animations (glow pulses, dashed target outline, torchlight) keep their phase across renders
function paSync(){try{if(!document.getAnimations||typeof CSSAnimation=='undefined')return;for(const a of document.getAnimations()){if(!(a instanceof CSSAnimation)||a.startTime===0)continue;
 const t=a.effect&&a.effect.getTiming&&a.effect.getTiming();if(t&&t.iterations===Infinity&&!t.delay)a.startTime=0}}catch(e){}}
{const _af=applyFlash;applyFlash=function(){const r=_af.apply(this,arguments);paSync();return r}}
// blockers line up under their attacker before the FLIP measures them (it used to happen a frame later)
align=function(){const c=G&&G.cmb;if(!c)return;const sd=c.side=='p'?['p','e']:['e','p'];
 for(const a in c.blk){const A=document.querySelector(`#app .cd[data-z="${sd[0]}:${a}"]`);const bs=[c.blk[a],c.bx&&c.bx[a]].filter(Boolean);bs.forEach((bu,i)=>{const B=document.querySelector(`#app .cd[data-z="${sd[1]}:${bu}"]`);
  if(A&&B&&!B.dataset.pal){const ra=A.getBoundingClientRect(),rb=B.getBoundingClientRect(),off=bs.length>1?(i?.55:-.55)*rb.width:0;B.style.left=(ra.left+ra.width/2-rb.left-rb.width/2+off)/paSc(B,rb)+'px';B.dataset.pal=1}})}};
{const _ap=animPre;animPre=function(){const P=_ap.apply(this,arguments);if(P){P.rot=new Map();document.querySelectorAll('#app .fld .cd[data-z]').forEach(el=>{const k=anKey(el);if(k)P.rot.set(k,getComputedStyle(el).rotate)})}return P}}
// FLIP: cards slide (and tap/untap) between renders using translate/rotate, so the tap rotation never skews them
cardMoves=function(P){try{align()}catch(e){}const moved=[],fresh=[];
 document.querySelectorAll('#app .cd[data-z]').forEach(el=>{const k=anKey(el);if(!k)return;const o=P.m.get(k);
  if(!o){if(el.style.visibility!='hidden')fresh.push(el);return}
  if(PA.ret&&PA.ret.has(k))return;
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,r0=P.rot&&P.rot.get(k),r1=r0!=null?getComputedStyle(el).rotate:null,turn=r0!=null&&r0!==r1;
  const cur=PA.l.find(e=>e.uid==k&&e.tag=='mv');if(cur&&!turn&&Math.abs(cur.bx-cx)+Math.abs(cur.by-cy)<3)return;
  const s=paSc(el,r),dx=((o.left+o.width/2)-cx)/s,dy=((o.top+o.height/2)-cy)/s;if(Math.abs(dx)+Math.abs(dy)<3/s&&!turn)return;
  moved.push([el,k,dx,dy,cx,cy,turn?[r0=='none'?'0deg':r0,r1=='none'?'0deg':r1]:null])});
 moved.forEach(([el,k,dx,dy,cx,cy,rt])=>{const f={translate:dx.toFixed(1)+'px '+dy.toFixed(1)+'px'},t={translate:'0px 0px'};if(rt){f.rotate=rt[0];t.rotate=rt[1]}
  const e=paRun(k,'mv',[f,t],{duration:450,easing:'cubic-bezier(.22,.9,.3,1)'},el);if(e){e.bx=cx;e.by=cy}});
 const fe=fresh.filter(e=>e.closest('.fld')),fh=fresh.filter(e=>e.closest('.hand'));
 if(fe.length)cdFrom(fe,{y:i=>fe[i].closest('.fe')?-36:36,scale:1.3,opacity:0,duration:.5,ease:'back.out(1.7)',stagger:.06});
 if(fh.length)cdFrom(fh,{y:70,opacity:0,duration:.4,ease:'power2.out',stagger:.05})};
// damage: a warm flash that fades into the card's own filter on one curve, plus a small shake
function paHit(u){const el=document.querySelector('#app .fld .cd[data-z$=":'+u+'"]');if(!el)return;let b=getComputedStyle(el).filter;b=!b||b=='none'?'':b+' ';
 paRun(u,'hf',[{filter:b+'brightness(1.7) sepia(.6) saturate(3) hue-rotate(-25deg)'},{filter:b+'brightness(1) sepia(0) saturate(1) hue-rotate(0deg)'}],{duration:520,easing:'cubic-bezier(.25,.6,.3,1)'},el);
 paRun(u,'hs',[{transform:'translateX(-7px)'},{transform:'translateX(5px)',offset:.25},{transform:'translateX(-3px)',offset:.5},{transform:'translateX(1px)',offset:.75},{transform:'none'}],{duration:420,easing:'ease-out'},el)}
{const _ff=fightFx;fightFx=function(P,first){const keep=P&&P.dm;if(P&&!first)P.dm=new Proxy({},{get:()=>Infinity});try{_ff.call(this,P,first)}finally{if(P)P.dm=keep}
 if(first||!P||!G||!G.p||!G.e)return;[...G.p.bf,...G.e.bf].forEach(c=>{if((c.dmg||0)>((keep&&keep[c.u])||0))paHit(c.u)})}}
// attack: ease toward the owner's side, lunge until the card meets its target, impact, resolve, glide home
fxLunge=function(done){const c=G&&G.cmb;if(!c||FXS.lunging)return done();const side=c.side,opp=side=='p'?'e':'p',T=[];
 c.atk.forEach(u=>{const el=document.querySelector('#app .cd[data-z="'+side+':'+u+'"]');if(!el)return;const bu=c.blk&&c.blk[u],ts=bu?'#app .cd[data-z="'+opp+':'+bu+'"]':'[data-z="'+(opp=='e'?'ef':'pf')+'"]',tEl=document.querySelector(ts);if(tEl)T.push([u,el,ts,tEl])});
 if(!T.length)return done();FXS.lunging=1;try{SFX.play('swing')}catch(e){}
 const own=side=='p'?1:-1,WU=210,LG=150,ST=70;
 T.forEach(([u,el,,tEl],i)=>{const a=el.getBoundingClientRect(),b=tEl.getBoundingClientRect(),s=paSc(el,a),ax=a.left+a.width/2,ay=a.top+a.height/2,vx=b.left+b.width/2-ax,vy=b.top+b.height/2-ay,dist=Math.hypot(vx,vy)||1,ux=vx/dist,uy=vy/dist;
  const ext=r=>Math.min(Math.abs(ux)>.001?r.width/2/Math.abs(ux):1e9,Math.abs(uy)>.001?r.height/2/Math.abs(uy):1e9);
  const go=Math.max(dist*.3,dist-ext(a)-ext(b)+Math.min(14,ext(b)*.3)),tx=ux*go/s,ty=uy*go/s,wx=-ux*5/s,wy=own*16/s;
  el.style.zIndex=60;
  paRun(u,'lg',[{translate:'0px 0px',scale:'1',easing:'cubic-bezier(.33,0,.25,1)'},{translate:wx.toFixed(1)+'px '+wy.toFixed(1)+'px',scale:'1.04',offset:WU/(WU+LG),easing:'cubic-bezier(.5,0,.8,.45)'},{translate:tx.toFixed(1)+'px '+ty.toFixed(1)+'px',scale:'1.08'}],{duration:WU+LG,delay:i*ST,fill:'forwards'},el)});
 // impact when every lunge has really finished (WAAPI starts on the next frame, so a timer fires early)
 const t0=performance.now(),hit=(T.length-1)*ST+WU+LG,ready=()=>T.every(([u])=>{const e=PA.l.find(x=>x.uid==u&&x.tag=='lg');return !e||!e.el.isConnected||e.a.playState=='finished'});
 const wait=()=>{if(ready()||performance.now()-t0>hit+600)impact();else requestAnimationFrame(wait)};setTimeout(wait,hit-20);
 const impact=()=>{const imp=new Map(),old=new Map();
  T.forEach(([u,,ts])=>{const e=PA.l.find(x=>x.uid==u&&x.tag=='lg');if(e){PA.l.splice(PA.l.indexOf(e),1);if(e.el.isConnected){const r=e.el.getBoundingClientRect();imp.set(String(u),[r.left+r.width/2,r.top+r.height/2]);old.set(String(u),e)}}
   try{fxImpact(fxRect(document.querySelector(ts)))}catch(e){}});
  PA.ret=imp;FXS.lunging=0;try{done()}finally{PA.ret=null}
  imp.forEach(([x0,y0],u)=>{const o=old.get(u);if(o&&o.el.isConnected){try{o.a.cancel()}catch(e){}o.el.style.zIndex=''}
   paStop(u,'mv');const el=document.querySelector('#app .fld .cd[data-z="'+side+':'+u+'"]');if(!el)return;
   const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,s=paSc(el,r),dx=(x0-cx)/s,dy=(y0-cy)/s,zi=el.style.zIndex;el.style.zIndex=50;
   const e=paRun(u,'mv',[{translate:dx.toFixed(1)+'px '+dy.toFixed(1)+'px',scale:'1.08'},{translate:'0px 0px',scale:'1'}],{duration:440,easing:'cubic-bezier(.2,.7,.25,1)'},el);
   if(e){e.bx=cx;e.by=cy;e.a.finished.then(()=>{if(e.el===el)el.style.zIndex=zi}).catch(()=>{})}})}};
{const _R=render;render=function(){const out=_R.apply(this,arguments);try{paPost()}catch(e){}paSync();return out}}
"""
_b3("showChars();\n</script>", _JSANIM + "showChars();\n</script>")
