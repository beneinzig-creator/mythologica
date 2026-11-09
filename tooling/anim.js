/* ===== v100: GSAP motion layer =====
   Purely visual. Wraps render(): measures cards before, animates after. Never touches game state.
   Inactive when GSAP is missing (node tests) or the viewer prefers reduced motion. */
const RMO=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const GSOK=()=>typeof gsap!=='undefined'&&typeof document!=='undefined'&&!!document.body&&!RMO();
const AN={dm:{},grp:null,eRef:null,lp:null,le:null,mana:null,msg:null,deal:null,hs:null};
const anGrp=ph=>['main','blockP','dmgP','enemy'].includes(ph)?'fight':ph;
const anKey=el=>{const z=el.dataset.z||'',i=z.indexOf(':');return i>0&&'hpe'.includes(z[0])?z.slice(i+1):null};
// tween .cd elements without fighting their CSS transform transition
function cdTw(els,fn){els=gsap.utils.toArray(els).filter(Boolean);if(!els.length)return;els.forEach(e=>e.style.transition='none');
 const v=fn();v.eventCallback('onComplete',()=>els.forEach(e=>{e.style.transition='';gsap.set(e,{clearProps:'transform,opacity,filter'})}));return v}
function cdFrom(els,vars){const a=gsap.utils.toArray(els).filter(Boolean);if(!a.length)return;cdTw(a,()=>gsap.from(a,vars))}
function floatTxt(sel,txt,col){const t=document.querySelector(sel);if(!t)return;const r=t.getBoundingClientRect();if(!r.width)return;
 const s=document.createElement('div');s.textContent=txt;
 s.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top-4}px;z-index:400;pointer-events:none;font:700 24px 'Palatino Linotype',Palatino,Georgia,serif;color:${col};text-shadow:0 2px 6px #000,0 0 14px ${col}99`;
 document.body.appendChild(s);
 gsap.timeline({onComplete:()=>s.remove()}).fromTo(s,{xPercent:-50,y:6,opacity:0,scale:.5},{y:-34,opacity:1,scale:1.15,duration:.4,ease:'back.out(2.2)'}).to(s,{y:-64,opacity:0,duration:.6,delay:.35,ease:'power1.in'})}
function animPre(){if(!GSOK())return null;const m=new Map();
 document.querySelectorAll('#app .cd[data-z]').forEach(el=>{const k=anKey(el);if(k)m.set(k,el.getBoundingClientRect())});
 return{m,dm:AN.dm,ov:!!document.querySelector('#app .ov'),hd:!!document.querySelector('.hdet')}}
function animPost(P){if(!P||!GSOK())return;const ph=G.phase,grp=anGrp(ph),newScreen=grp!==AN.grp;AN.grp=grp;
 document.documentElement.classList.add('gs');
 if(newScreen){screenIn(ph);AN.deal=null}
 else cardMoves(P);
 if(grp=='fight')fightFx(P,newScreen);else{AN.eRef=null}
 {const dm={};if(G&&G.p&&G.e&&G.p.bf&&G.e.bf)[...G.p.bf,...G.e.bf].forEach(c=>dm[c.u]=c.dmg||0);AN.dm=dm}
 if(ph=='draft')dealIn();
 if(ph=='char')heroDetail(P);
 const ov=document.querySelector('#app .ov');if(ov&&!P.ov){gsap.from(ov,{opacity:0,duration:.25});const b=ov.querySelector('.ovb');if(b)gsap.from(b,{y:24,scale:.94,opacity:0,duration:.4,ease:'power3.out',clearProps:'transform,opacity'})}}
// FLIP: same card uid moved between renders (hand -> table, rank change, bounce, blockers)
function cardMoves(P){const moved=[],fresh=[];
 document.querySelectorAll('#app .cd[data-z]').forEach(el=>{const k=anKey(el);if(!k)return;const o=P.m.get(k),r=el.getBoundingClientRect();
  if(!o){if(el.style.visibility!='hidden')fresh.push(el);return}
  let dx=(o.left+o.width/2)-(r.left+r.width/2),dy=(o.top+o.height/2)-(r.top+r.height/2);if(Math.abs(dx)+Math.abs(dy)<3)return;
  const s=Math.sqrt((r.width*r.height)/((el.offsetWidth*el.offsetHeight)||1))||1;dx/=s;dy/=s;
  if(el.classList.contains('tap')&&el.closest('.fld'))[dx,dy]=[dy,-dx]; // tapped cards are rotated 90deg: move in their frame
  moved.push([el,dx,dy])});
 moved.forEach(([el,dx,dy])=>cdTw([el],()=>gsap.from(el,{x:dx,y:dy,duration:.45,ease:'power3.out'})));
 const fe=fresh.filter(e=>e.closest('.fld')),fh=fresh.filter(e=>e.closest('.hand'));
 if(fe.length)cdFrom(fe,{y:i=>fe[i].closest('.fe')?-36:36,scale:1.3,opacity:0,duration:.5,ease:'back.out(1.7)',stagger:.06});
 if(fh.length)cdFrom(fh,{y:70,opacity:0,duration:.4,ease:'power2.out',stagger:.05})}
function fightFx(P,first){const p=G.p,e=G.e;
 if(first||AN.eRef!==e){AN.eRef=e;AN.lp=p.life;AN.le=e.life;AN.mana=p.mana;AN.msg=G.msg;return}
 const dl=p.life-AN.lp,de=e.life-AN.le;AN.lp=p.life;AN.le=e.life;
 if(dl){floatTxt('[data-z="pf"]',(dl>0?'+':'')+dl,dl>0?'#7fdc8a':'#ff6a4a');if(dl<0)gsap.fromTo('#app',{x:0},{keyframes:{x:[-9,8,-6,4,-2,0]},duration:.4,ease:'none',onComplete:()=>gsap.set('#app',{clearProps:'transform'})})}
 if(de){floatTxt('[data-z="ef"]',(de>0?'+':'')+de,de>0?'#7fdc8a':'#ff6a4a');if(de<0)gsap.fromTo('.top',{y:0},{keyframes:{y:[-5,4,-2,0]},duration:.35,ease:'none',onComplete:()=>gsap.set('.top',{clearProps:'transform'})})}
 if(p.mana!==AN.mana){AN.mana=p.mana;gsap.fromTo('.me .orb',{scale:1.3},{scale:1,duration:.5,ease:'back.out(3)',clearProps:'transform'})}
 if(G.msg!==AN.msg){AN.msg=G.msg;gsap.from('.mid',{opacity:0,y:8,duration:.3,ease:'power2.out',clearProps:'transform,opacity'})}
 [...p.bf,...e.bf].forEach(c=>{if((c.dmg||0)>(P.dm[c.u]||0)){const el=document.querySelector('.fld .cd[data-z$=":'+c.u+'"]');
  if(el)cdTw([el],()=>gsap.fromTo(el,{x:-6,filter:'brightness(1.7) sepia(.6) saturate(3) hue-rotate(-25deg)'},{x:0,filter:'brightness(1)',duration:.5,ease:'elastic.out(1,.35)'}))}})}
function dealIn(){const dr=G.dr;if(!dr||!dr.off||!dr.off.length)return;const sig=dr.n+':'+dr.off.map(c=>c.u).join(',');if(sig===AN.deal)return;AN.deal=sig;
 gsap.from('.dw',{opacity:0,y:50,rotationX:-35,duration:.6,ease:'power3.out',stagger:.12,clearProps:'transform,opacity'})}
function heroDetail(P){const d=document.querySelector('.hdet');if(!d){AN.hs=null;return}if(P.hd&&AN.hs===G.hs)return;AN.hs=G.hs;
 gsap.from(d.children,{opacity:0,y:12,duration:.4,ease:'power2.out',stagger:.05,clearProps:'transform,opacity'})}
function screenIn(ph){const tl=gsap.timeline({defaults:{ease:'power3.out',clearProps:'transform,opacity'}});
 if(ph=='char'){tl.from('.dft > div:first-child',{opacity:0,y:-30,scale:1.06,duration:.8})
  .from('.dft > .ovt',{opacity:0,y:10,duration:.5},'-=.45').from('.htile',{opacity:0,y:40,rotationX:-30,duration:.6,stagger:.1},'-=.3').from('.hhint',{opacity:0,duration:.4},'-=.2');return}
 if(ph=='draft'){tl.from('.dhd',{opacity:0,y:-16,duration:.5}).from('.dlibw',{opacity:0,x:-40,duration:.5},'-=.3');return}
 if(ph=='map'){tl.from('#app svg path',{opacity:0,duration:.6,stagger:.006}).from('.wn,.mn',{opacity:0,scale:.6,duration:.45,ease:'back.out(1.8)',stagger:.025},'-=.45');return}
 if(anGrp(ph)=='fight'){tl.from('.top',{opacity:0,y:-30,duration:.5}).from('.fld',{opacity:0,duration:.5},'-=.3');
  cdFrom('.fld .cd',{opacity:0,y:-24,scale:1.2,duration:.5,ease:'back.out(1.6)',stagger:.06,delay:.35});
  cdFrom('.hand .cd',{opacity:0,y:90,duration:.5,ease:'power3.out',stagger:.06,delay:.45});
  tl.from('.me,.decks',{opacity:0,x:-30,duration:.45},'-=.2').from('.ctl > *',{opacity:0,x:30,duration:.4,stagger:.05},'<');return}
 tl.from('#app > *',{opacity:0,y:14,duration:.45,stagger:.05})}
if(typeof window!=='undefined'&&typeof document!=='undefined'&&typeof gsap!=='undefined'){const _R=render;render=function(){let P=null;try{P=animPre()}catch(e){}_R.apply(this,arguments);try{animPost(P)}catch(e){}}}
