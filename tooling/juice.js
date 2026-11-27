/* ===== v130 (patch_juice): combat feel + the opponent portrait =====
   Visual only: nothing here reads into or changes game state.
   1. Combat feel. Hits shake the screen in proportion to the damage. Big hits (5+) and killing blows get
      hit-stop and slow motion, a flash and a zoom punch. Damage numbers grow with the damage. Every impact
      throws sparks, and a dying army member gives a small jolt.
   2. The opponent portrait. Every fight shows the enemy's head (cropped from its figure painting,
      art/game/figures, using the head positions in FFH) in a medallion at the top left of the fight screen.
      It breathes and looks around while idle. A small face badge on the medallion blinks and pulls faces.
      Hurting the enemy makes it angry (it gets angrier as its life drops). Hurting you makes it laugh. When
      it loses, it weeps, cracks and crumbles before the victory banner. When you lose, it gloats.
   Inactive without GSAP or a document (node tests and sims). Reduced motion keeps a still portrait and face. */
// head position in each figure painting: [centre x %, centre y %, crop size as a share of the painting's height]
const FFH={abaddon:[44,10,.22],ahriman:[50,10,.22],ammit:[47,30,.3],anubis:[48,19,.25],apophis:[56,18,.3],asmodeus:[42,13,.25],
 azazel:[46,11,.25],baal:[44,12,.22],babel:[41,22,.22],beast:[52,20,.35],beelzebub:[47,14,.25],buddhapalm:[58,13,.25],bulldemon:[45,9,.25],
 cattle:[52,18,.25],charybdis:[50,52,.5],cicones:[48,18,.22],circe:[46,10,.2],erlang:[47,11,.2],fafnir:[46,18,.3],fenrir:[45,15,.3],
 forge:[47,12,.22],heavenlyhost:[48,22,.22],hector:[46,18,.22],heka:[46,12,.22],hel:[42,8,.22],hornkings:[50,14,.32],hrungnir:[45,9,.22],
 ironfan:[45,14,.22],jormungandr:[48,18,.3],jotnar:[50,9,.25],legion:[43,9,.22],lilith:[42,12,.22],loki:[42,13,.22],lotus:[41,12,.25],
 lucifer:[51,18,.22],macaque:[45,15,.22],mammon:[47,15,.3],mastema:[50,7,.2],muspelheim:[50,8,.22],nephilim:[47,10,.22],norns:[55,13,.22],
 paimon:[47,15,.22],pairikas:[44,8,.22],phaeacians:[41,10,.2],poly:[39,10,.22],redboy:[45,15,.22],robbers:[48,13,.22],scorpions:[44,13,.22],
 scylla:[28,25,.4],sekhmet:[45,10,.2],servants:[43,10,.2],set:[43,15,.22],shades:[55,9,.2],sirens:[43,11,.22],sobek:[42,12,.25],
 sons:[50,15,.22],sphinx:[57,30,.35],spider:[47,12,.22],watchers:[49,10,.2],whitebone:[46,13,.22],wildhunt:[46,15,.22],yellowwind:[47,10,.22]};
const FFL={
 angry:['You dare?!','Insolent mortal!','That… stung.','You will pay for that!','Enough!','Grrr…!','How DARE you!','A lucky blow.'],
 rage:['I will tear you apart!','No more games!','You will BURN for this!','Now I am angry.'],
 happy:['Ha! Bleed!','Is that all, hero?','Kneel!','Delicious.','Your gods have left you.','Ha ha ha!','Fall, little hero.','Yes… YES!'],
 hurt:['No… not like this!','Impossible!','Stay back!','This cannot be!'],
 dead:['No…!','I… am undone…','This cannot be…','Remember… me…'],
 win:['Your journey ends here.','The fates are mine!','Ha ha ha ha!','Sleep now, hero.'],
 heal:['Run while you can.','Ah… better.'],
 kill:['One fewer.','Ha! Crushed!'],
 lose:['My servant!','You will regret that!'],
 hello:['So. You came.','Another fool.','Come, then.','I have waited for you.']};
const JU={e:null,nm:'',lp:0,le:0,el:null,mood:'idle',back:null,said:0,dead:0,dying:0,rect:null,slow:0,blink:null,idle:null};
const juPick=a=>a[Math.floor(Math.random()*a.length)];
const juOn=()=>typeof document!=='undefined'&&!!document.body;

/* ---------- 1. combat feel ---------- */
function juLayer(id,css){let o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;if(css)o.style.cssText=css;document.body.appendChild(o)}return o}
// shake #app in proportion to the hit (y and rotation, so it composes with anim.js's own x shake)
function juShake(str,dur){if(!GSOK())return;const a=document.getElementById('app');if(!a)return;str=Math.min(22,str);dur=dur||Math.min(.7,.28+str*.02);
 const n=7,ys=[],rs=[];for(let i=0;i<n;i++){const f=1-i/n;ys.push((i%2?-1:1)*str*f*(.6+Math.random()*.4));rs.push((Math.random()-.5)*str*.09*f)}ys.push(0);rs.push(0);
 gsap.to(a,{keyframes:{y:ys,rotation:rs},duration:dur,ease:'none',overwrite:'auto',onComplete:()=>gsap.set(a,{clearProps:'transform'})})}
// zoom punch toward a point on screen
function juPunch(pt,amt){if(!GSOK())return;const a=document.getElementById('app');if(!a)return;const r=a.getBoundingClientRect();
 const ox=pt?((pt.x-r.left)/r.width*100).toFixed(1)+'%':'50%',oy=pt?((pt.y-r.top)/r.height*100).toFixed(1)+'%':'40%';
 gsap.fromTo(a,{scale:1+(amt||.035),transformOrigin:ox+' '+oy},{scale:1,duration:.5,ease:'power3.out',onComplete:()=>gsap.set(a,{clearProps:'transform'})})}
// hit-stop then slow motion, easing back to full speed in real time (a tween on the global timeline would slow itself down)
function juSlow(scale,hold,back){if(!GSOK())return;const T=gsap.globalTimeline,tok=++JU.slow,R=document.documentElement;T.timeScale(scale);R.classList.add('juslow');
 const v=juLayer('juv');v.style.opacity=1;
 setTimeout(()=>{if(tok!==JU.slow)return;const t0=performance.now(),s0=T.timeScale();
  const step=t=>{if(tok!==JU.slow)return;const k=Math.min(1,(t-t0)/back);T.timeScale(s0+(1-s0)*k*k);v.style.opacity=(1-k).toFixed(2);if(k<1)requestAnimationFrame(step);else{R.classList.remove('juslow');T.timeScale(1)}};
  requestAnimationFrame(step)},hold)}
function juFlash(col,a,dur){if(!GSOK())return;const f=juLayer('juf');f.style.background=col;gsap.fromTo(f,{opacity:a},{opacity:0,duration:dur||.35,ease:'power2.out'})}
function juHurtGlow(n){if(!GSOK())return;const g=juLayer('juh');gsap.fromTo(g,{opacity:Math.min(1,.35+n*.09)},{opacity:0,duration:.5+Math.min(.6,n*.06),ease:'power2.out'})}
function juSparks(c,n,col){if(!GSOK()||!c)return;const L=fxLayer();for(let i=0;i<n;i++){const s=document.createElement('i');s.className='jusp';s.style.background=col||'#ffd27a';L.appendChild(s);
  const a=Math.random()*6.283,d=40+Math.random()*90,w=10+Math.random()*16;
  gsap.fromTo(s,{x:c.x,y:c.y,width:w,rotation:a*57.3,opacity:1},{x:c.x+Math.cos(a)*d,y:c.y+Math.sin(a)*d,width:2,opacity:0,duration:.35+Math.random()*.25,ease:'power2.out',onComplete:()=>s.remove()})}}
// face damage: the bigger the hit, the bigger the feel
function juHit(side,n,lethal){const pt=side=='e'?ffCentre():(()=>{const p=document.querySelector('[data-z="pf"]');return p?fxCtr(fxRect(p)):null})();
 if(lethal){juSlow(.12,140,1100);juFlash('#fff',.55,.6);juPunch(pt,.06);juShake(18,.8);return}
 if(n>=3)juShake(3+n*1.6);
 if(n>=5){juSlow(.15,90,420);juPunch(pt,.025+Math.min(.03,n*.003));juFlash(side=='e'?'#fff':'#ff2a10',side=='e'?.28:.22,.3)}
 if(side=='p')juHurtGlow(n);
 if(pt)juSparks(pt,Math.min(16,4+n*2),side=='e'?'#ffd27a':'#ff7a5a')}

/* ---------- 2. the opponent portrait ---------- */
// the face badge: one ink face whose brows, eyes and mouth change with the mood
const FFP={idle:['M10 12.5L17 12.5M23 12.5L30 12.5','M14 27Q20 28.5 26 27',0],
 angry:['M9.5 9.5L17.5 14M22.5 14L30.5 9.5','M13 29.5Q20 24 27 29.5',0],
 rage:['M9 9L18 15M22 15L31 9','M12 30L15 27L18 29.5L20 26.5L22 29.5L25 27L28 30',0],
 happy:['M10 11.5Q13.5 8 17 11.5M23 11.5Q26.5 8 30 11.5','M12 24Q20 35 28 24Z',1],
 worry:['M10 13.5L17 10.5M23 10.5L30 13.5','M14 28.5Q17 27 20 28.5T26 28.5',0],
 sad:['M10 14L17 10M23 10L30 14','M13 31Q20 25 27 31',0],
 dead:['M10 12L17 12M23 12L30 12','M14 29Q17 27 20 29T26 29',0]};
const FFACE='<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" class="fk"/><g class="fe"><ellipse cx="14" cy="18" rx="2.2" ry="2.9"/><ellipse cx="26" cy="18" rx="2.2" ry="2.9"/></g>'
 +'<g class="fx"><path d="M11.5 15.5l5 5M16.5 15.5l-5 5M23.5 15.5l5 5M28.5 15.5l-5 5"/></g><path class="fb" d=""/><path class="fm" d=""/>'
 +'<g class="ft"><path d="M13 21q-1.6 3 0 4.2q1.6-1.2 0-4.2z"/><path d="M27 21q-1.6 3 0 4.2q1.6-1.2 0-4.2z"/></g><path class="fs" d="M32 6q-2.4 3.6 0 5.2q2.4-1.6 0-5.2z"/></svg>';
const FANG='<svg viewBox="0 0 24 24"><path d="M9 2v5.5L3.5 9M15 2v5.5L20.5 9M2 15h5.5L9 20.5M22 15h-5.5L15 20.5" fill="none" stroke="#e8321e" stroke-width="3" stroke-linecap="round"/></svg>';
function ffDef(){try{if(G.boss)return BOSS[G.bi];if(G.elt)return ELITES[G.elt-1];return fo(G.rt[G.fi])}catch(e){return null}}
function ffFig(){return G&&G.e&&typeof FIG!='undefined'?FIG[G.e.nm]:null}
function ffEnsure(){if(JU.el)return JU.el;const d=document.createElement('div');d.id='ffp';
 d.innerHTML='<div class="ffp-in"><div class="ffp-img"></div><i class="ffp-ic"></i><i class="ffp-tint"></i><i class="ffp-crk"></i></div><div class="ffp-emo">'+FFACE+'</div><div class="ffp-ang">'+FANG+'</div><div class="ffp-say"></div>';
 // click the portrait to target the enemy's face, same as clicking its life
 d.addEventListener('click',()=>{const t=document.querySelector('#app [data-z="ef"]');if(t&&G&&G.mode&&G.mode.tgt=='xf')t.click()});
 JU.el=d;return d}
function ffSetup(){const d=ffEnsure(),img=d.querySelector('.ffp-img'),ic=d.querySelector('.ffp-ic'),fig=ffFig(),inn=d.querySelector('.ffp-in');
 if(typeof gsap!='undefined'){if(JU.back){JU.back.kill();JU.back=null}if(JU.end){JU.end.kill();JU.end=null}gsap.killTweensOf([d,inn,img,d.querySelector('.ffp-say'),d.querySelector('.ffp-emo'),d.querySelector('.ffp-ang')]);gsap.set([d,inn,img],{clearProps:'all'})}
 d.className='';d.style.cssText='';d.querySelector('.ffp-crk').style.opacity='';JU.dead=0;
 if(fig){const h=FFH[fig]||[50,15,.25],x=h[0]/100,y=h[1]/100,s=h[2],kx=1.5/s,ky=1/s;
  img.style.backgroundImage='url(art/game/figures/'+fig+'.webp)';img.style.backgroundSize=(kx*100).toFixed(1)+'% auto';
  img.style.backgroundPosition=Math.max(0,Math.min(100,(x*kx-.5)/(kx-1)*100)).toFixed(1)+'% '+Math.max(0,Math.min(100,(y*ky-.5)/(ky-1)*100)).toFixed(1)+'%';ic.textContent=''}
 else{img.style.backgroundImage='none';const B=ffDef();ic.textContent=(B&&B.ic)||'⚔'}
 JU.dying=0;JU.mood='';ffMood('idle',0,1);
 if(GSOK()){gsap.set(inn,{scale:.3,opacity:0,rotation:-20});ffIdle();
  // wait out the fight intro (html.fxhold hides the board) before the portrait pops in
  const pop=()=>{if(JU.el!==d||JU.dead)return;if(document.documentElement.classList.contains('fxhold')){gsap.delayedCall(.25,pop);return}
   gsap.to(inn,{scale:1,opacity:1,rotation:0,duration:.6,delay:.45,ease:'back.out(1.8)'});if(Math.random()<.6)gsap.delayedCall(1.8,()=>ffSay(juPick(FFL.hello)))};pop()}}
function ffHp(){return G&&G.e&&G.e.max?Math.max(0,G.e.life/G.e.max):1}
// the resting face follows the enemy's life: calm, then worried, then desperate
function ffRest(){return ffHp()<.35?'worry':'idle'}
function ffFace(m){const d=JU.el;if(!d)return;const P=FFP[m]||FFP.idle,b=d.querySelector('.fb'),mo=d.querySelector('.fm');b.setAttribute('d',P[0]);mo.setAttribute('d',P[1]);mo.classList.toggle('op',!!P[2]);
 d.querySelector('.fe').style.display=m=='dead'?'none':'';d.querySelector('.fx').style.display=m=='dead'?'':'none';
 d.querySelector('.ft').style.display=m=='sad'||m=='dead'?'':'none';d.querySelector('.fs').style.display=m=='worry'||m=='hurt'?'':'none'}
function ffTint(){const d=JU.el;if(!d)return;const f=ffHp(),hurt=1-f;d.style.setProperty('--hurt',(hurt*.32).toFixed(3));d.classList.toggle('low',f<.35)}
function ffMood(m,n,still){const d=JU.el;if(!d||JU.dead&&m!=='dead'&&m!=='sad')return;n=n||1;
 if(m=='angry'&&(ffHp()<.4||n>=6))m='rage';
 JU.mood=m;['idle','angry','rage','happy','worry','sad','dead'].forEach(k=>d.classList.toggle('m-'+k,k==m));ffFace(m);ffTint();
 if(JU.back){JU.back.kill();JU.back=null}
 if(still||!GSOK())return;const inn=d.querySelector('.ffp-in'),emo=d.querySelector('.ffp-emo');
 gsap.fromTo(emo,{scale:1.6,rotation:m=='angry'||m=='rage'?-12:m=='happy'?10:0},{scale:1,rotation:0,duration:.45,ease:'back.out(3)'});
 if(m=='angry'||m=='rage'){const k=m=='rage'?1.6:1;
  gsap.fromTo(inn,{scale:1+.08*k},{scale:1,duration:.5,ease:'elastic.out(1,.4)'});
  gsap.fromTo(inn,{x:0},{keyframes:{x:[-4*k,4*k,-3*k,3*k,-2,2,0]},duration:.5,ease:'none'});
  const a=d.querySelector('.ffp-ang');gsap.fromTo(a,{scale:0,opacity:1,rotation:-30},{scale:1,rotation:0,duration:.3,ease:'back.out(3)'});gsap.to(a,{opacity:0,duration:.4,delay:.9});
  gsap.fromTo(d,{'--flush':.55*k},{'--flush':0,duration:1.2,ease:'power2.out'});
  if(m=='rage')ffSteam()}
 if(m=='happy'){gsap.fromTo(inn,{y:0,scaleY:1},{keyframes:{y:[-9,0,-7,0,-5,0,-2,0],scaleY:[1.05,.94,1.04,.96,1.02,.98,1,1]},duration:.9,ease:'none'});
  gsap.fromTo(d,{'--glow':.7},{'--glow':0,duration:1.4,ease:'power2.out'});ffHaha(n)}
 if(m=='sad'){gsap.to(inn,{rotation:-7,y:5,duration:.8,ease:'power2.out'});ffTears(6)}
 if(m!=='dead'&&m!=='sad')JU.back=gsap.delayedCall(1.6+Math.min(1,n*.08),()=>{JU.back=null;if(!JU.dead)ffMood(ffRest(),0,1)})}
function ffSay(t,force){const d=JU.el;if(!d||!t||!GSOK())return;const now=Date.now();if(!force&&now-JU.said<2600)return;JU.said=now;const b=d.querySelector('.ffp-say');b.textContent=t;
 gsap.killTweensOf(b);gsap.timeline().fromTo(b,{opacity:0,scale:.6,y:-6},{opacity:1,scale:1,y:0,duration:.3,ease:'back.out(2.4)'}).to(b,{opacity:0,y:-4,duration:.4,delay:1.5+t.length*.03})}
function ffBits(cls,txt,n,dx,dy,dur){const d=JU.el;if(!d)return;const r=d.querySelector('.ffp-in').getBoundingClientRect();if(!r.width)return;const L=fxLayer();
 for(let i=0;i<n;i++){const s=document.createElement('i');s.className=cls;if(txt)s.textContent=typeof txt=='function'?txt(i):txt;L.appendChild(s);
  const x=r.left+r.width*(.25+Math.random()*.5),y=r.top+r.height*(.25+Math.random()*.4);
  gsap.fromTo(s,{x,y,opacity:1,scale:.6},{x:x+dx(i),y:y+dy(i),opacity:0,scale:1.1,rotation:(Math.random()-.5)*50,duration:dur,delay:i*.08,ease:'power1.out',onComplete:()=>s.remove()})}}
const ffHaha=n=>ffBits('ffha',i=>i%2?'HA':'ha',Math.min(5,2+Math.floor((n||1)/2)),()=>40+Math.random()*50,()=>-30-Math.random()*40,1.1);
const ffSteam=()=>ffBits('ffst','',5,()=>(Math.random()-.5)*60,()=>-50-Math.random()*30,1);
const ffTears=n=>ffBits('fftr','',n,()=>(Math.random()-.5)*20,()=>50+Math.random()*30,1.2);
// idle: slow breathing, a drifting gaze, and a blink on the face badge every few seconds
function ffIdle(){const d=JU.el;if(!d||!GSOK())return;const img=d.querySelector('.ffp-img');if(JU.idle)JU.idle.kill();
 JU.idle=gsap.timeline({repeat:-1});JU.idle.to(img,{scale:1.06,duration:2.2,ease:'sine.inOut'}).to(img,{scale:1,duration:2.2,ease:'sine.inOut'});
 gsap.to(img,{x:'random(-4,4)',y:'random(-3,2)',duration:'random(2.5,4)',ease:'sine.inOut',repeat:-1,repeatRefresh:true});
 const blink=()=>{if(!JU.el||JU.dead)return;const e=d.querySelector('.fe');gsap.fromTo(e,{scaleY:1},{scaleY:.1,duration:.07,yoyo:true,repeat:1,transformOrigin:'50% 60%'});JU.blink=gsap.delayedCall(2+Math.random()*3.5,blink)};
 if(JU.blink)JU.blink.kill();JU.blink=gsap.delayedCall(1.5+Math.random()*2,blink)}
function ffCentre(){const d=JU.el&&JU.el.isConnected&&JU.el.querySelector('.ffp-in');if(d){const r=d.getBoundingClientRect();if(r.width)return fxCtr(r)}const t=document.querySelector('[data-z="ef"]');return t?fxCtr(fxRect(t)):null}
// the enemy loses: it weeps, cracks and crumbles, then the victory banner plays
// lift the portrait out of the board (which the next screen replaces) onto its own layer, where it last stood
function ffSolo(){const d=JU.el,q=d.isConnected?d.getBoundingClientRect():null,r=q&&q.width?{left:q.left,top:q.top}:JU.rect;if(!r)return 0;
 document.body.appendChild(d);d.classList.add('solo');gsap.set(d,{left:r.left,top:r.top});return 1}
function ffDie(){const d=JU.el;if(!d||JU.dead)return;JU.dead=1;if(!GSOK()){ffMood('dead',0,1);return}
 if(JU.idle)JU.idle.kill();if(JU.blink)JU.blink.kill();if(!ffSolo())return;JU.dying=1;
 const inn=d.querySelector('.ffp-in'),img=d.querySelector('.ffp-img'),W=d.offsetWidth||96;
 ffMood('sad',3);ffSay(juPick(FFL.dead),1);
 const tl=JU.end=gsap.timeline({onComplete:()=>{d.remove();JU.dying=0}});
 tl.to(d,{left:innerWidth/2-W/2,top:innerHeight*.26-W/2,scale:1.7,duration:.7,ease:'power3.inOut'},0)
  .to(img,{filter:'grayscale(.85) brightness(.8)',duration:1.2},0)
  .call(()=>ffTears(8),null,.9)
  .to(inn,{keyframes:{x:[-3,3,-3,3,-2,2,0]},duration:.5,ease:'none'},1.3)
  .call(()=>{ffMood('dead',0,1);d.classList.add('broke');try{SFX.play('crack')}catch(e){}},null,1.6)
  .to(d.querySelector('.ffp-crk'),{opacity:1,duration:.15},1.6)
  .to(inn,{scale:1.06,duration:.1,yoyo:true,repeat:1},1.6)
  .call(()=>{try{const q=inn.getBoundingClientRect();fxDust(q,26,'120,110,100');fxDust(q,14,'200,180,140')}catch(e){}},null,2)
  .to(d,{y:70,rotation:14,opacity:0,duration:.7,ease:'power2.in'},2)
  .to(img,{filter:'grayscale(1) brightness(.3) blur(2px)',duration:.7},2)}
// you lose: it gloats
function ffWin(){const d=JU.el;if(!d||JU.dead)return;if(!GSOK()){JU.dead=1;ffMood('happy',0,1);return}
 if(!ffSolo())return;JU.dead=1;JU.dying=1;const W=d.offsetWidth||96;
 const tl=JU.end=gsap.timeline({onComplete:()=>{d.remove();JU.dying=0}});
 tl.to(d,{left:innerWidth/2-W/2,top:innerHeight*.26-W/2,scale:1.7,duration:.6,ease:'power3.inOut'},0);
 tl.call(()=>{JU.mood='';['idle','angry','rage','worry','sad','dead'].forEach(k=>d.classList.remove('m-'+k));d.classList.add('m-happy');ffFace('happy');
  const inn=d.querySelector('.ffp-in');gsap.fromTo(inn,{y:0},{keyframes:{y:[-10,0,-8,0,-6,0,-3,0]},duration:1,ease:'none'});gsap.fromTo(d,{'--glow':.8},{'--glow':0,duration:1.6});ffHaha(8);ffSay(juPick(FFL.win),1)},null,.5);
 tl.call(()=>ffHaha(8),null,1.2).to(d,{opacity:0,duration:.4},1.7)}
function ffPlace(){const top=document.querySelector('#app .top');const R=document.documentElement;
 if(!top||JU.dead){R.classList.remove('ffon');return}
 const d=ffEnsure();if(d.parentNode!==top)top.insertBefore(d,top.firstChild);
 // fit the medallion to the top bar, which is much shorter on small screens
 const h=top.clientHeight,sz=Math.round(Math.max(40,Math.min(96,h-6)));if(R.style.getPropertyValue('--ffs')!==sz+'px')R.style.setProperty('--ffs',sz+'px');d.classList.toggle('sm',sz<70);R.classList.add('ffon');
 const q=d.getBoundingClientRect();if(q.width)JU.rect={left:q.left,top:q.top}}
// after every render: place the portrait and react to life changes
function juPost(){if(!juOn()||!G)return;const fight=typeof anGrp=='function'&&anGrp(G.phase)=='fight',e=G.e,p=G.p;
 if(fight&&e&&(JU.e!==e||JU.nm!==e.nm)){const turn=JU.e===e;JU.e=e;JU.nm=e.nm;JU.lp=p.life;JU.le=e.life;ffPlace();ffSetup();
  if(turn&&GSOK()){juFlash('#fff',.5,.6);juShake(10);ffSay(juPick(FFL.rage),1)}return}
 if(!e||JU.e!==e){if(!fight)document.documentElement.classList.remove('ffon');return}
 const dl=p.life-JU.lp,de=e.life-JU.le;JU.lp=p.life;JU.le=e.life;
 if(fight)ffPlace();else document.documentElement.classList.remove('ffon');
 if(JU.dead)return;
 if(e.life<=0&&de<0){juHit('e',-de,1);ffDie();return}
 if(p.life<=0&&dl<0){juHit('p',-dl,1);ffWin();return}
 if(de<0){juHit('e',-de);if(dl<0)juHit('p',-dl);ffMood('angry',-de);if(ffHp()<.25&&Math.random()<.5)ffSay(juPick(FFL.hurt));else if(-de>=5||Math.random()<.45)ffSay(juPick(JU.mood=='rage'?FFL.rage:FFL.angry))}
 else if(dl<0){juHit('p',-dl);ffMood('happy',-dl);if(-dl>=4||Math.random()<.5)ffSay(juPick(FFL.happy))}
 else if(dl>0){ffMood('angry',1);if(Math.random()<.3)ffSay(juPick(FFL.angry))}
 else if(de>0){ffMood('happy',1);if(Math.random()<.4)ffSay(juPick(FFL.heal))}
 else ffTint()}

if(typeof window!=='undefined'&&typeof document!=='undefined'&&typeof gsap!=='undefined'){
 try{const st=document.createElement('style');st.id='juice';st.textContent=`
#juv{position:fixed;inset:0;pointer-events:none;z-index:390;opacity:0;background:radial-gradient(ellipse at 50% 50%,#0000 45%,#0008 100%)}
#juf{position:fixed;inset:0;pointer-events:none;z-index:391;opacity:0;mix-blend-mode:screen}
#juh{position:fixed;inset:0;pointer-events:none;z-index:389;opacity:0;background:radial-gradient(ellipse at 50% 50%,#0000 50%,#b0140acc 100%)}
.jusp{position:fixed;left:0;top:0;height:2px;border-radius:2px;pointer-events:none;z-index:402;transform-origin:0 50%;box-shadow:0 0 6px #ffb347}
html.ffon .top{position:relative;padding-left:calc(var(--ffs) + 26px)!important}
#ffp{--hurt:0;--flush:0;--glow:0;position:absolute;left:12px;top:50%;margin-top:calc(var(--ffs) / -2);width:var(--ffs);height:var(--ffs);z-index:30;cursor:default}
html{--ffs:96px}
#ffp.solo{position:fixed;margin:0;z-index:460;pointer-events:none}
.ffp-in{position:absolute;inset:0;border-radius:50%;overflow:hidden;background:#140e0a;border:3px solid #b48a3c;box-shadow:0 0 0 2px #2a1c0c,0 4px 14px #000c,inset 0 0 18px #000c,0 0 calc(var(--glow) * 40px) calc(var(--glow) * 10px) #ffd27a}
.ffp-img{position:absolute;inset:-6%;background-repeat:no-repeat;will-change:transform}
.ffp-ic{position:absolute;inset:0;display:grid;place-items:center;font-size:calc(var(--ffs) * .55);font-style:normal}
.ffp-tint{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 45%,#ff200000 30%,#c81400 100%);opacity:calc(var(--hurt) + var(--flush));mix-blend-mode:multiply}
.ffp-in::after{content:'';position:absolute;inset:0;border-radius:50%;background:#ff3a1e;opacity:calc(var(--flush) * .45);mix-blend-mode:color;pointer-events:none}
.ffp-crk{position:absolute;inset:0;opacity:0;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0L46 22 58 38 44 56 54 72 48 100M46 22L26 30M58 38L80 34M44 56L20 66M54 72L76 84' fill='none' stroke='%23140c06' stroke-width='3'/%3E%3C/svg%3E") center/100% 100%}
#ffp.low .ffp-crk{opacity:.45}
.ffp-emo{position:absolute;right:-8px;bottom:-6px;width:calc(var(--ffs) * .42);height:calc(var(--ffs) * .42);filter:drop-shadow(0 2px 3px #000a)}
.ffp-emo svg{width:100%;height:100%;overflow:visible}
.ffp-emo .fk{fill:#ead5a4;stroke:#7a5216;stroke-width:2}
.ffp-emo .fe ellipse{fill:#1a120a}.ffp-emo .fe{transform-box:fill-box}
.ffp-emo .fx path,.ffp-emo .fb,.ffp-emo .fm{fill:none;stroke:#1a120a;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ffp-emo .fm.op{fill:#5a1a10}
.ffp-emo .ft path{fill:#6ab8ff;stroke:#2a6aa8;stroke-width:.6}
.ffp-emo .fs{fill:#9fd6ff;stroke:#2a6aa8;stroke-width:.6}
#ffp.m-angry .fk,#ffp.m-rage .fk{fill:#f0a080}#ffp.m-rage .fk{fill:#ff7a5a}
#ffp.m-happy .fk{fill:#f6e0a0}#ffp.m-sad .fk,#ffp.m-dead .fk{fill:#c8c8c0}
.ffp-ang{position:absolute;right:-6px;top:-8px;width:calc(var(--ffs) * .36);height:calc(var(--ffs) * .36);opacity:0;filter:drop-shadow(0 0 4px #ff3a1e)}
.ffp-say{position:absolute;left:4px;top:calc(100% + 10px);white-space:nowrap;padding:5px 10px;border-radius:10px;background:#f1e2bd;color:#2a1a0c;border:2px solid #7a5216;font:italic 700 14px 'Palatino Linotype',Palatino,Georgia,serif;opacity:0;pointer-events:none;box-shadow:0 3px 10px #000a;transform-origin:20px 0;z-index:3}
.ffp-say::before{content:'';position:absolute;left:18px;top:-9px;border:8px solid transparent;border-bottom-color:#7a5216;border-top:0}
#ffp.solo .ffp-say{left:50%;transform-origin:50% 0;translate:-50% 0;font-size:11px}
#ffp.sm .ffp-say{font-size:11px;padding:3px 7px;top:calc(100% + 7px)}#ffp.sm .ffp-emo{right:-10px;bottom:-8px;width:24px;height:24px}#ffp.sm .ffp-ang{width:20px;height:20px}#ffp.sm .ffp-in{border-width:2px}
.ffha{position:fixed;left:0;top:0;pointer-events:none;z-index:470;font:900 18px 'Palatino Linotype',Palatino,Georgia,serif;color:#ffd27a;text-shadow:0 2px 3px #000,0 0 8px #000}
.ffst{position:fixed;left:0;top:0;width:16px;height:16px;border-radius:50%;pointer-events:none;z-index:470;background:radial-gradient(circle,#fff9 0,#fff0 70%)}
.fftr{position:fixed;left:0;top:0;width:6px;height:9px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;pointer-events:none;z-index:470;background:#7cc4ff;box-shadow:0 0 4px #7cc4ff}
@media (prefers-reduced-motion: reduce){#ffp *{transition:none!important}}
`;document.head.appendChild(st)}catch(e){}
 // bigger hits, bigger numbers; the enemy's numbers burst from its portrait
 {const _ft=floatTxt;floatTxt=function(sel,txt,col){try{const n=Math.abs(parseInt(txt,10))||0,c=sel=='[data-z="ef"]'&&ffCentre();
  if(n>=3||c){const t=c?null:document.querySelector(sel),r=c?{left:c.x,top:c.y+10,width:1}:t&&t.getBoundingClientRect();if(!r||!r.width)return _ft.apply(this,arguments);
   const big=n>=5,sz=24+Math.min(34,n*3),s=document.createElement('div');s.textContent=txt+(big?'!':'');
   s.style.cssText=`position:fixed;left:${c?r.left:r.left+r.width/2}px;top:${r.top-4}px;z-index:480;pointer-events:none;font:900 ${sz}px 'Palatino Linotype',Palatino,Georgia,serif;color:${col};text-shadow:0 2px 6px #000,0 0 ${big?24:14}px ${col}${big?'':'99'};-webkit-text-stroke:${big?1.5:0}px #2a0a04`;
   document.body.appendChild(s);const dx=c?40+Math.random()*30:0;
   gsap.timeline({onComplete:()=>s.remove()}).fromTo(s,{xPercent:-50,x:0,y:6,opacity:0,scale:big?2.4:.5,rotation:big?-8:0},{x:dx,y:-30,opacity:1,scale:big?1.25:1.1,rotation:0,duration:big?.32:.4,ease:big?'power4.in':'back.out(2.2)'})
    .to(s,{x:dx*1.3,y:-64-(big?20:0),opacity:0,duration:.7,delay:big?.55:.35,ease:'power1.in'});return}}catch(e){}return _ft.apply(this,arguments)}}
 // sparks and a jolt at every attack impact
 {const _i=fxImpact;fxImpact=function(r){const out=_i.apply(this,arguments);try{if(GSOK()&&r&&r.width){juSparks(fxCtr(r),7,'#ffe2a0');juShake(3,.22)}}catch(e){}return out}}
 // a dying army member jolts the table; the portrait reacts to its own and your losses
 {const _g=gyFly;gyFly=function(s,c){try{if(GSOK()&&!FXS.offering&&isC(c)&&G&&G.e&&!JU.dead&&anGrp(G.phase)=='fight'){juShake(5,.3);
   if(s===G.e){ffMood('angry',2);if(Math.random()<.35)ffSay(juPick(FFL.lose))}else if(s===G.p){ffMood('happy',2);if(Math.random()<.35)ffSay(juPick(FFL.kill))}}}catch(e){}return _g.apply(this,arguments)}}
 // the victory banner and the defeat tablet wait for the portrait's last moment
 // the game can announce the result a moment before juPost sees the killing blow, so a death still to come counts too.
 // Slow motion stretches the scene, so wait for it to actually finish (at most 5 seconds).
 const juBusy=()=>{if(JU.dying)return 1;try{return !JU.dead&&G&&G.e&&JU.e===G.e&&JU.el&&(G.e.life<=0||(G.p&&G.p.life<=0))?1:0}catch(e){return 0}};
 const juWait=f=>function(){const a=arguments,self=this,t0=Date.now();if(!GSOK()||!juBusy())return f.apply(self,a);
  const go=()=>{if(juBusy()&&Date.now()-t0<5000){setTimeout(go,100);return}f.apply(self,a)};setTimeout(go,100)};
 fxFightWon=juWait(fxFightWon);fxVictory=juWait(fxVictory);fxLost=juWait(fxLost);
 {const _R=render;render=function(){_R.apply(this,arguments);try{juPost()}catch(e){}}}
}
