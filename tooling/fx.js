/* ===== v102: atmosphere + game-feel effects (visual/audio only, never game state) ===== */
const FXS={offering:0,lunging:0,ph:null,field:null,rv:null,lastMx:null,realm:null};
const fxLayer=()=>{let l=document.getElementById('fxl');if(!l){l=document.createElement('div');l.id='fxl';document.body.appendChild(l)}return l};
const fxRect=el=>el&&el.getBoundingClientRect();
const fxCtr=r=>({x:r.left+r.width/2,y:r.top+r.height/2});
const fxCard=u=>document.querySelector('#app .cd[data-z$=":'+u+'"]');
const fxRealm=()=>!G||G.phase=='char'?'none':(G.a2||G.ch||'ody');

/* ---------- 4. realm particles ---------- */
const PTC=(()=>{let cv,cx,parts=[],realm=null,raf=0,W=0,H=0,last=0;
 const R=Math.random;
 const KIND={
  ody:()=>({x:R()*W,y:H+R()*H*.2,vx:.15+R()*.35,vy:-(.15+R()*.35),r:.6+R()*1.8,a:.15+R()*.35,tw:R()*6.28,c:'200,228,255'}),
  odin:()=>({x:R()*W,y:-10-R()*H,vx:-.2+R()*.4,vy:.35+R()*.8,r:.8+R()*2.4,a:.35+R()*.5,tw:R()*6.28,c:'240,248,255',sway:.4+R()*.8}),
  wukong:()=>({x:R()*W,y:H+R()*40,vx:-.15+R()*.3,vy:-(.3+R()*.9),r:.6+R()*1.6,a:.4+R()*.5,tw:R()*6.28,c:R()<.75?'255,190,90':'255,120,60',ember:1}),
  none:()=>({x:R()*W,y:R()*H,vx:-.08+R()*.16,vy:-.05-R()*.12,r:.5+R()*1.3,a:.08+R()*.18,tw:R()*6.28,c:'255,236,200'}),
 };
 const WISP=()=>({x:-300,y:H*(.15+R()*.7),vx:.15+R()*.25,vy:0,r:120+R()*160,a:.035+R()*.03,c:'255,214,140',wisp:1});
 function size(){if(!cv)return;W=cv.width=innerWidth;H=cv.height=innerHeight}
 function seed(){const n=Math.round((innerWidth*innerHeight)/(realm=='odin'?14000:20000));parts=[];const k=KIND[realm]||KIND.none;
  for(let i=0;i<Math.min(n,140);i++){const p=k();p.y=R()*H;parts.push(p)}if(realm=='wukong')for(let i=0;i<3;i++){const w=WISP();w.x=R()*W;parts.push(w)}}
 function step(t){raf=requestAnimationFrame(step);if(document.hidden)return;const dt=Math.min(3,(t-last)/16.7||1);last=t;cx.clearRect(0,0,W,H);
  const k=KIND[realm]||KIND.none;
  for(let i=0;i<parts.length;i++){let p=parts[i];p.tw+=.03*dt;
   if(p.wisp){p.x+=p.vx*dt;if(p.x-p.r>W){parts[i]=WISP();continue}const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,'rgba('+p.c+','+p.a+')');g.addColorStop(1,'rgba('+p.c+',0)');cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();continue}
   p.x+=(p.vx+(p.sway?Math.sin(p.tw)*p.sway*.5:0))*dt;p.y+=p.vy*dt;
   if(p.y<-20||p.y>H+20||p.x<-20||p.x>W+20){parts[i]=k();if(realm=='odin')parts[i].y=-10;continue}
   const al=p.a*(p.ember?(.6+.4*Math.sin(p.tw*3)):(.7+.3*Math.sin(p.tw)));
   cx.fillStyle='rgba('+p.c+','+al.toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();
   if(p.ember&&p.r>1.2){cx.fillStyle='rgba('+p.c+','+(al*.15).toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,6.283);cx.fill()}}}
 function set(r){if(typeof document==='undefined'||RMO())return;if(!cv){cv=document.createElement('canvas');cv.id='fxp';document.body.insertBefore(cv,document.body.firstChild);cx=cv.getContext('2d');addEventListener('resize',()=>{size();seed()});size()}
  if(r===realm)return;realm=r;seed();if(!raf)raf=requestAnimationFrame(step);cv.dataset.realm=r}
 return{set}})();

/* ---------- 10. light that follows the cursor on the table ---------- */
function fxTableLight(){const app=document.getElementById('app');if(!app||app.dataset.lt)return;app.dataset.lt=1;
 app.addEventListener('mousemove',e=>{const f=e.target.closest&&e.target.closest('.fld');document.querySelectorAll('.fld').forEach(x=>{if(x!==f)x.style.removeProperty('--mx')});if(!f)return;
  const r=f.getBoundingClientRect(),z=f.offsetWidth/(r.width||1);FXS.lastMx=[f.classList.contains('fe')?'fe':'fp',(e.clientX-r.left)*z,(e.clientY-r.top)*(f.offsetHeight/(r.height||1))];
  f.style.setProperty('--mx',FXS.lastMx[1].toFixed(0)+'px');f.style.setProperty('--my',FXS.lastMx[2].toFixed(0)+'px')});
 app.addEventListener('mouseleave',()=>{FXS.lastMx=null;document.querySelectorAll('.fld').forEach(x=>x.style.removeProperty('--mx'))})}
function fxRestoreLight(){if(!FXS.lastMx)return;const f=document.querySelector('.fld.'+FXS.lastMx[0]);if(f){f.style.setProperty('--mx',FXS.lastMx[1].toFixed(0)+'px');f.style.setProperty('--my',FXS.lastMx[2].toFixed(0)+'px')}}

/* ---------- 7. effects ---------- */
function fxDust(r,n=10,col='210,190,150'){if(!r||!r.width)return;const L=fxLayer(),c=fxCtr(r);for(let i=0;i<n;i++){const d=document.createElement('i');d.className='fxd';d.style.background=`radial-gradient(circle,rgba(${col},.55),rgba(${col},0) 70%)`;L.appendChild(d);
 const a=(i/n)*6.283+Math.random()*.4,s=18+Math.random()*16;gsap.fromTo(d,{x:c.x-s/2,y:r.bottom-s/2-6,width:s,height:s,opacity:.9,scale:.4},{x:c.x-s/2+Math.cos(a)*(r.width*.7),y:r.bottom-s/2-6+Math.sin(a)*14,scale:1.8,opacity:0,duration:.7+Math.random()*.3,ease:'power2.out',onComplete:()=>d.remove()})}}
function fxSmoke(r){if(!r||!r.width)return;const L=fxLayer(),c=fxCtr(r);SFX.play('smoke');for(let i=0;i<9;i++){const d=document.createElement('i');d.className='fxs';L.appendChild(d);const s=40+Math.random()*40;
 gsap.fromTo(d,{x:c.x-s/2+(Math.random()-.5)*r.width*.6,y:c.y-s/2+(Math.random()-.2)*r.height*.4,width:s,height:s,opacity:0,scale:.4},{keyframes:[{opacity:.7,scale:.9,duration:.25},{y:'-=150',x:'+='+((Math.random()-.5)*60),opacity:0,scale:2.2,duration:1.3,ease:'power1.out'}],delay:i*.04,onComplete:()=>d.remove()})}}
function fxCoins(r,dst,n){if(!r||!dst||!n)return;const L=fxLayer(),a=fxCtr(r),b=fxCtr(fxRect(dst));for(let i=0;i<Math.min(n,6);i++){const d=document.createElement('i');d.className='fxc';L.appendChild(d);
 const tl=gsap.timeline({delay:.15+i*.09,onComplete:()=>{d.remove();SFX.play('coin',0)}});tl.set(d,{x:a.x-9,y:a.y-9,scale:.6,opacity:0}).to(d,{y:a.y-70-i*8,x:a.x-9+(i-n/2)*14,opacity:1,scale:1,duration:.3,ease:'power2.out'}).to(d,{x:b.x-9,y:b.y-9,scale:.7,duration:.45,ease:'power2.in'})}
 gsap.delayedCall(.15+Math.min(n,6)*.09+.75,()=>{const o=document.querySelector('.me .orb');if(o)gsap.fromTo(o,{boxShadow:'0 0 40px #ffd27a'},{boxShadow:'0 0 18px #e0b04a55',duration:.6,clearProps:'boxShadow'})})}
function fxRune(c,R=120){const L=fxLayer(),d=document.createElement('div');d.className='fxr';const g=[...'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'].sort(()=>Math.random()-.5).slice(0,16);
 d.innerHTML=`<svg viewBox="-110 -110 220 220" width="${R*2}" height="${R*2}"><defs><path id="rc" d="M0,-84a84,84 0 1,1 -.1,0"/></defs><circle r="100" fill="none" stroke="#ffd98a" stroke-width="2" opacity=".8"/><circle r="70" fill="none" stroke="#ffd98a" stroke-width="1.2" opacity=".7"/><path d="M0-70L60.6 35-60.6 35Z M0 70L60.6-35-60.6-35Z" fill="none" stroke="#ffd98a" stroke-width="1.2" opacity=".55"/><text font-size="15" fill="#ffe7b0"><textPath href="#rc">${g.join(' ')}</textPath></text></svg>`;
 L.appendChild(d);gsap.timeline({onComplete:()=>d.remove()}).fromTo(d,{x:c.x-R,y:c.y-R,scale:.3,opacity:0,rotation:-40},{scale:1,opacity:1,rotation:0,duration:.45,ease:'back.out(1.6)'}).to(d,{rotation:60,duration:.9,ease:'none'},'<').to(d,{scale:1.25,opacity:0,duration:.45,ease:'power2.in'},'-=.35');SFX.play('chime')}
function fxCrack(r){if(!r||!r.width)return;const L=fxLayer(),d=document.createElement('div');d.className='fxk';d.style.cssText=`left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
 d.innerHTML='<svg viewBox="0 0 100 140" preserveAspectRatio="none" width="100%" height="100%"><path d="M48 0L52 30 40 52 58 78 46 104 54 140M52 30L72 44M40 52L18 60M58 78L84 92M46 104L24 118" fill="none" stroke="#1a120a" stroke-width="2.4" stroke-linejoin="bevel"/><path d="M48 0L52 30 40 52 58 78 46 104 54 140" fill="none" stroke="#fff3" stroke-width="1" transform="translate(1 1)"/></svg>';L.appendChild(d);
 const ps=d.querySelectorAll('path');ps.forEach(p=>{const l=p.getTotalLength?p.getTotalLength():300;p.style.strokeDasharray=l;p.style.strokeDashoffset=l});
 gsap.timeline({onComplete:()=>d.remove()}).to(ps,{strokeDashoffset:0,duration:.18,ease:'power1.in'}).to(d,{opacity:0,duration:.5,delay:.35});
 for(let i=0;i<7;i++){const s=document.createElement('i');s.className='fxsh';L.appendChild(s);const w=6+Math.random()*10;gsap.fromTo(s,{x:r.left+r.width*(.3+Math.random()*.4),y:r.top+r.height*(.2+Math.random()*.6),width:w,height:w*1.3,rotation:Math.random()*180,opacity:1},{x:'+='+((Math.random()-.5)*160),y:'+='+(40+Math.random()*90),rotation:'+=240',opacity:0,duration:.8,delay:.15,ease:'power2.in',onComplete:()=>s.remove()})}
 fxDust(r,8,'120,110,100');SFX.play('crack')}
function fxImpact(r){if(!r||!r.width)return;const L=fxLayer(),c=fxCtr(r),d=document.createElement('i');d.className='fxi';L.appendChild(d);
 gsap.fromTo(d,{x:c.x-60,y:c.y-60,scale:.2,opacity:1},{scale:1.6,opacity:0,duration:.45,ease:'power2.out',onComplete:()=>d.remove()});SFX.play('hit')}
// attack: attackers lunge at their blocker or the opposing face, then combat resolves at impact
function fxLunge(done){const c=G&&G.cmb;if(!c||FXS.lunging)return done();const side=c.side,opp=side=='p'?'e':'p',T=[];
 c.atk.forEach(u=>{const el=document.querySelector('#app .cd[data-z="'+side+':'+u+'"]');if(!el)return;const bu=c.blk&&c.blk[u],tEl=bu?document.querySelector('#app .cd[data-z="'+opp+':'+bu+'"]'):document.querySelector('[data-z="'+(opp=='e'?'ef':'pf')+'"]');if(tEl)T.push([el,tEl])});
 if(!T.length)return done();FXS.lunging=1;SFX.play('swing');
 T.forEach(([el,tEl],i)=>{const a=fxRect(el),b=fxRect(tEl),s=Math.sqrt((a.width*a.height)/((el.offsetWidth*el.offsetHeight)||1))||1;let dx=(fxCtr(b).x-fxCtr(a).x)*.55/s,dy=(fxCtr(b).y-fxCtr(a).y)*.55/s;if(el.classList.contains('tap'))[dx,dy]=[dy,-dx];
  el.style.transition='none';el.style.zIndex=60;gsap.timeline({delay:i*.06}).to(el,{x:-dx*.08,y:-dy*.08,scale:1.04,duration:.12,ease:'power2.out'}).to(el,{x:dx,y:dy,scale:1.08,duration:.16,ease:'power3.in'})});
 gsap.delayedCall(.3+(T.length-1)*.06,()=>{T.forEach(([,tEl])=>fxImpact(fxRect(tEl)));FXS.lunging=0;done()})}

/* ---------- 8. boss / elite intro + trump stamp ---------- */
function fxIntro(){const B=G.boss?BOSS[G.bi]:ELITES[G.elt-1];if(!B)return;const boss=!!G.boss,old=document.getElementById('fxin');if(old)old.remove();
 const lore=boss&&B.lore?B.lore.split(/(?<=\.)\s+/).slice(0,2).join(' '):(B.hint||''),tn=boss&&B.trump&&D[B.trump]?D[B.trump][0]:(B.mt&&D[B.mt]?D[B.mt][0]:'');
 const o=document.createElement('div');o.id='fxin';o.className=boss?'boss':'elite';
 o.innerHTML=`<div class="fxin-in"><div class="fxin-k">${boss?(G.a2?'Act II guardian':'Guardian of '+RWORD()):'Elite foe'}</div><div class="fxin-ic">${B.ic||''}</div><div class="fxin-n">${B.n}</div>${lore?`<div class="fxin-l">${lore}</div>`:''}${tn?`<div class="fxin-t"><span>Trump</span>${tn}</div>`:''}<div class="fxin-c">Click to begin</div></div>`;
 document.body.appendChild(o);SFX.play(boss?'gong':'stamp');
 const tl=gsap.timeline();tl.from(o,{opacity:0,duration:.4}).from(o.querySelector('.fxin-k'),{opacity:0,letterSpacing:'1em',duration:.8,ease:'power2.out'},'-=.1').from(o.querySelector('.fxin-ic'),{scale:2.6,opacity:0,filter:'blur(8px)',duration:.7,ease:'power3.out'},'-=.6').from(o.querySelector('.fxin-n'),{y:30,opacity:0,duration:.6,ease:'power3.out'},'-=.35');
 if(lore)tl.from(o.querySelector('.fxin-l'),{opacity:0,y:10,duration:.6},'-=.2');if(tn)tl.from(o.querySelector('.fxin-t'),{scale:2.2,opacity:0,rotation:-8,duration:.32,ease:'power4.in',onComplete:()=>SFX.play('stamp')},'+=.1');tl.from(o.querySelector('.fxin-c'),{opacity:0,duration:.5},'+=.3');
 let gone=0;const close=()=>{if(gone)return;gone=1;gsap.to(o,{opacity:0,duration:.45,onComplete:()=>{o.remove();if(boss)fxStampTrump()}})};
 o.addEventListener('click',close);gsap.delayedCall(boss?7:4.5,close)}
function fxStampTrump(){const t=G&&G.e&&G.e.bf.find(x=>x.boss);const el=t&&fxCard(t.u);if(!el)return;el.style.transition='none';
 gsap.fromTo(el,{scale:2.6,opacity:0,rotation:-10},{scale:1,opacity:1,rotation:0,duration:.38,ease:'power4.in',onComplete:()=>{el.style.transition='';gsap.set(el,{clearProps:'transform,opacity'});SFX.play('stamp');fxDust(fxRect(el),14,'200,180,140');
  const b=document.querySelector('.board');if(b)gsap.fromTo('#app',{y:0},{keyframes:{y:[6,-4,2,0]},duration:.3,onComplete:()=>gsap.set('#app',{clearProps:'transform'})})}})}

/* ---------- 9. victory / defeat ---------- */
const LAUREL=(()=>{let L='';for(let i=0;i<9;i++){const A=(198+i*17)*Math.PI/180,x=120+Math.cos(A)*86,y=112+Math.sin(A)*86,t=198+i*17+90;
 [[t+32,7],[t-32,-7]].forEach(([r,o])=>{const ox=x+Math.cos(A)*o*.6,oy=y+Math.sin(A)*o*.6;L+=`<ellipse cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" rx="10" ry="4" transform="rotate(${r.toFixed(0)} ${ox.toFixed(1)} ${oy.toFixed(1)})"/><ellipse cx="${(240-ox).toFixed(1)}" cy="${oy.toFixed(1)}" rx="10" ry="4" transform="rotate(${(180-r).toFixed(0)} ${(240-ox).toFixed(1)} ${oy.toFixed(1)})"/>`})}
 return'<svg class="fxlaurel" viewBox="0 0 240 124" width="220"><path d="M34 112A86 86 0 0 1 108 27M206 112A86 86 0 0 0 132 27" fill="none" stroke="#a87a28" stroke-width="2.2" stroke-linecap="round"/><g fill="#e0b04a" stroke="#7a5216" stroke-width=".7">'+L+'</g></svg>'})();
function fxRays(big){const o=document.createElement('div');o.className='fxrays'+(big?' big':'');o.innerHTML='<i></i>';document.body.appendChild(o);
 gsap.fromTo(o,{opacity:0},{opacity:1,duration:.6});gsap.to(o.firstChild,{rotation:360,duration:40,ease:'none',repeat:-1});
 for(let i=0;i<(big?40:18);i++){const l=document.createElement('b');l.className='fxleaf';o.appendChild(l);gsap.fromTo(l,{x:innerWidth*Math.random(),y:-20,rotation:Math.random()*360,opacity:1},{y:innerHeight+30,x:'+='+((Math.random()-.5)*240),rotation:'+='+(360+Math.random()*540),duration:3+Math.random()*3,delay:Math.random()*(big?2.5:1),ease:'none',repeat:big?-1:0})}
 return o}
function fxVictory(){SFX.play('fanfare');const rays=fxRays(true);rays.id='fxvr';
 const v=document.getElementById('vico'),box=v&&v.querySelector('.box');if(box&&!box.querySelector('.fxlaurel')){box.insertAdjacentHTML('afterbegin',LAUREL);gsap.from(box,{scale:.85,y:30,opacity:0,duration:.6,ease:'back.out(1.6)'});gsap.from(box.querySelector('.fxlaurel'),{scale:.4,opacity:0,rotation:-20,duration:.8,delay:.25,ease:'back.out(2)'})}}
function fxFightWon(){SFX.play('win');const rays=fxRays(false),t=document.createElement('div');t.className='fxwon';t.innerHTML=LAUREL+'<span>Victory</span>';rays.appendChild(t);
 gsap.timeline({onComplete:()=>rays.remove()}).from(t,{scale:.6,opacity:0,duration:.5,ease:'back.out(2)'}).to(rays,{opacity:0,duration:.6,delay:1.4})}
function fxLost(){if(document.getElementById('fxlost'))return;SFX.play('dirge');const o=document.createElement('div');o.id='fxlost';
 o.innerHTML=`<div class="fxtab"><div class="fxtab-h l"><span>Fallen</span></div><div class="fxtab-h r"><span>Fallen</span></div><svg class="fxcr" viewBox="0 0 400 220" preserveAspectRatio="none"><path d="M205 0L190 40 214 78 186 118 210 160 196 220" fill="none" stroke="#120c08" stroke-width="3"/><path d="M190 40L150 52M214 78L262 70M186 118L140 132M210 160L250 176" fill="none" stroke="#120c08" stroke-width="2"/></svg><div class="fxtab-s">${typeof CHN=='function'?CHN():'Your hero'} has fallen</div></div>`;
 document.body.appendChild(o);const p=o.querySelectorAll('.fxcr path');p.forEach(x=>{const l=x.getTotalLength();x.style.strokeDasharray=l;x.style.strokeDashoffset=l});
 gsap.timeline().from(o,{opacity:0,duration:.8}).from(o.querySelector('.fxtab'),{y:-40,opacity:0,duration:.7,ease:'power3.out'},'-=.4').to(p,{strokeDashoffset:0,duration:.5,ease:'power2.in',stagger:.05,onStart:()=>SFX.play('crack')}).to(o.querySelector('.fxtab-h.l'),{x:-14,y:6,rotation:-3,duration:.6,ease:'power2.out'}).to(o.querySelector('.fxtab-h.r'),{x:14,y:10,rotation:4,duration:.6,ease:'power2.out'},'<').to(o.querySelector('.fxcr'),{opacity:0,duration:.3},'<').from(o.querySelector('.fxtab-s'),{opacity:0,y:8,duration:.6})}

/* ---------- render hook: realm, field arrivals, phase moments, enemy spell reveals ---------- */
function fxPost(){if(!GSOK())return;PTC.set(fxRealm());SFX.btn();fxTableLight();fxRestoreLight();
 const ph=G.phase,grp=anGrp(ph);
 if(grp=='fight'&&G.p&&G.e){const now=new Set([...G.p.bf,...G.e.bf].filter(isC).map(c=>c.u));
  if(FXS.field&&FXS.ph&&anGrp(FXS.ph)=='fight'){now.forEach(u=>{if(!FXS.field.has(u)){const el=fxCard(u);if(el)gsap.delayedCall(.35,()=>{fxDust(fxRect(el));SFX.play('thud')})}})}FXS.field=now}else FXS.field=null;
 if(G.rv&&G.rv!==FXS.rv&&G.rv.c&&!isC(G.rv.c)){const card=document.querySelector('#app .ov .cd');if(card)gsap.delayedCall(.2,()=>fxRune(fxCtr(fxRect(card)),130))}FXS.rv=G.rv||null;
 if(ph!==FXS.ph){if(ph=='victory')gsap.delayedCall(.05,fxVictory);if(ph=='kleos')fxFightWon();if(ph=='lost')gsap.delayedCall(.4,fxLost)}
 if(ph!=='lost'){const l=document.getElementById('fxlost');if(l)l.remove()}
 if(ph!=='victory'){const r=document.getElementById('fxvr');if(r)r.remove()}
 FXS.ph=ph}

if(typeof window!=='undefined'&&typeof document!=='undefined'&&typeof gsap!=='undefined'){
 {const _R=render;render=function(){_R.apply(this,arguments);try{fxPost()}catch(e){}}}
 {const _o=offer;offer=function(s,c){let r=null,m0=s&&s.mana;try{const el=fxCard(c.u);r=el&&fxRect(el)}catch(e){}FXS.offering=1;let out;try{out=_o.apply(this,arguments)}finally{FXS.offering=0}
  try{if(GSOK()&&r){fxSmoke(r);fxCoins(r,s===G.p?document.querySelector('.me .orb'):document.querySelector('.eh b'),(s.mana-m0)||1)}}catch(e){}return out}}
 {const _c=cast;cast=function(c,t){let r=null;try{if(!isC(c)){const el=fxCard(c.u);r=el&&fxRect(el)}}catch(e){}const out=_c.apply(this,arguments);
  try{if(GSOK()&&r){const m=document.querySelector('.mid'),tc=t&&typeof t=='object'&&fxCard(t.u);fxRune(tc?fxCtr(fxRect(tc)):m?fxCtr(fxRect(m)):fxCtr(r),tc?95:120)}}catch(e){}return out}}
 {const _g=gyFly;gyFly=function(s,c){try{if(GSOK()&&!FXS.offering&&isC(c)){const el=document.querySelector('.fld .cd[data-z$=":'+c.u+'"]');if(el)fxCrack(fxRect(el))}}catch(e){}return _g.apply(this,arguments)}}
 {const _fi=flyIn;flyIn=function(c,s){try{if(s===G.p)SFX.play('slide')}catch(e){}return _fi.apply(this,arguments)}}
 {const _f=fight;fight=function(){const out=_f.apply(this,arguments);try{if(GSOK()&&(G.boss||G.elt))gsap.delayedCall(.1,fxIntro)}catch(e){}return out}}
 {const _rs=resolve;resolve=function(){if(!GSOK()||!G.cmb)return _rs.apply(this,arguments);if(FXS.lunging)return;const a=arguments,self=this;fxLunge(()=>{const lp=G.p.life;_rs.apply(self,a);try{if(G.p.life<lp)SFX.play('hurt')}catch(e){}})}}
}
