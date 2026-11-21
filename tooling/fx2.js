/* ---------- v114: a particle effect of its own for every backdrop ----------
   Replaces the one-per-hero realm particles (PTC in fx.js). fxScene() names the painting on screen:
   a fight background or screen (from --scn), a location, the map, victory or defeat, or the home screen.
   PSPEC gives each one up to three layers. Kinds: mote, ember, spark, snow, ash, petal, leaf, feather,
   rain, sand, spray, bubble, firefly, gold, wisp, smoke, mist, thread, and flash (lightning).
   Colours are "r,g,b" strings. n = particles per million screen pixels. */
const PSPEC=(()=>{
 const W='255,255,255',GOLD=['255,214,120','255,236,170','240,190,80'],EMB=['255,190,90','255,140,60','255,220,140'];
 const FIRE=['255,170,70','255,110,40','255,210,120'],PINK=['255,190,210','255,214,228','250,160,190'],ASH=['150,140,135','110,104,100','185,178,170'];
 const SNOW=['240,248,255','225,235,250'],SEA=['220,240,255','190,225,245'],GHOST=['190,215,230','220,235,240'];
 const L=(k,n,c,o)=>Object.assign({k,n,c},o||{});
 return {
  // Odysseus
  lotus:[L('petal',22,['250,244,236','248,220,230','240,236,250']),L('firefly',16,['255,226,140']),L('mist',2,['250,225,200'])],
  sirens:[L('spray',40,SEA),L('petal',14,PINK.concat(['255,250,240']))],
  polyphemus:[L('ember',38,EMB),L('smoke',4,['90,80,72']),L('mote',18,['255,220,170'])],
  shades:[L('wisp',10,GHOST),L('ash',26,['160,165,170','120,126,132'])],
  phaeacians:[L('firefly',18,['255,200,120','255,230,170']),L('spray',18,SEA),L('mist',2,['200,170,220'])],
  cicones:[L('ember',48,FIRE),L('spark',16,['255,230,150']),L('smoke',4,['70,60,55'])],
  circe:[L('firefly',20,['190,255,180','210,170,255']),L('leaf',12,['120,140,60','160,120,50','90,110,50']),L('gold',10,['220,180,255'])],
  cattle:[L('mote',40,GOLD),L('gold',12,GOLD)],
  hector:[L('sand',30,['210,180,130','180,150,105']),L('ember',14,EMB)],
  scylla:[L('spray',46,SEA),L('mist',3,['200,220,230'])],
  charybdis:[L('spray',50,SEA),L('bubble',14,SEA),L('mist',2,['190,215,225'])],
  s_draft_start:[L('mist',3,['210,220,230']),L('mote',22,['230,235,240'])],
  s_draft_reward:[L('ember',30,EMB),L('gold',12,GOLD)],
  s_otg:[L('ember',40,FIRE),L('spark',10,['255,230,160']),L('gold',8,GOLD)],
  s_bossp:[L('rain',90,['190,205,225']),L('spray',20,SEA),L('flash',1,[W])],
  'ody/ui_map':[L('mote',14,['255,236,200'])],
  'ody/ui_victory':[L('gold',22,GOLD),L('leaf',10,['150,170,70','200,180,80'])],
  'ody/ui_defeat':[L('ash',30,ASH)],
  'ody/ui_camp':[L('ember',40,EMB),L('smoke',3,['90,80,72'])],
  'ody/ui_craft':[L('spark',30,['255,220,140','255,180,90'])],
  'ody/ui_altar':[L('smoke',5,['160,150,140']),L('gold',12,GOLD)],
  // Odin
  jotnar:[L('snow',70,SNOW,{big:1}),L('mist',3,['210,225,240'])],
  fenrir:[L('snow',30,SNOW),L('firefly',8,['170,220,255']),L('mist',2,['150,170,200'])],
  forge:[L('spark',36,['255,220,140','255,170,80']),L('ember',30,FIRE)],
  muspelheim:[L('ember',60,FIRE),L('ash',18,ASH),L('spark',10,['255,230,150'])],
  hel:[L('wisp',10,GHOST),L('snow',22,['200,215,230'])],
  loki:[L('smoke',4,['90,90,80']),L('gold',16,['150,255,150','190,255,120']),L('ember',14,EMB)],
  norns:[L('mote',30,GOLD),L('leaf',10,['170,180,90','200,170,80']),L('gold',8,['200,230,255'])],
  fafnir:[L('gold',26,GOLD),L('mist',3,['140,180,90'])],
  jormungandr:[L('spray',44,SEA),L('rain',50,['180,200,215']),L('flash',1,[W])],
  wildhunt:[L('snow',90,SNOW,{wind:1}),L('feather',6,['30,30,40','50,50,60']),L('flash',1,['200,220,255'])],
  hrungnir:[L('sand',22,['170,165,160','140,135,130']),L('snow',16,SNOW),L('flash',1,['220,230,255'])],
  s_odin_draft_start:[L('snow',40,SNOW),L('mist',3,['210,220,235'])],
  s_odin_draft_reward:[L('ember',30,EMB),L('gold',12,GOLD)],
  s_odin_otg:[L('snow',30,SNOW),L('mote',20,GOLD),L('ember',12,EMB)],
  s_odin_bossp:[L('rain',90,['185,200,220']),L('spray',18,SEA),L('flash',1,[W])],
  'odin/ui_map':[L('snow',26,SNOW)],
  'odin/ui_victory':[L('gold',22,GOLD),L('ember',18,EMB)],
  'odin/ui_defeat':[L('ash',22,ASH),L('snow',20,SNOW)],
  'odin/ui_camp':[L('ember',40,EMB),L('snow',14,SNOW)],
  'odin/ui_craft':[L('spark',32,['255,220,140','255,170,80'])],
  'odin/ui_altar':[L('smoke',5,['140,130,125']),L('ember',18,EMB)],
  // Sun Wukong
  whitebone:[L('mist',4,['230,230,225']),L('wisp',6,['240,236,225']),L('leaf',12,['190,150,80','150,110,60','210,180,110'])],
  heavenlyhost:[L('mote',30,GOLD),L('mist',4,['255,240,215']),L('gold',12,GOLD)],
  spider:[L('thread',14,['240,240,235']),L('smoke',4,['230,235,235']),L('petal',14,PINK)],
  hornkings:[L('gold',20,GOLD),L('smoke',4,['170,150,130']),L('petal',10,['255,180,200','250,150,180'])],
  redboy:[L('ember',56,['255,90,40','255,150,60','140,170,255']),L('spark',14,['255,230,150']),L('ash',12,ASH)],
  yellowwind:[L('sand',80,['230,190,90','210,160,70','245,215,130']),L('mist',3,['220,180,90'])],
  erlang:[L('petal',18,['255,250,250','255,225,235']),L('smoke',3,['200,190,180']),L('mote',14,GOLD)],
  ironfan:[L('leaf',16,['80,150,70','110,170,60','60,120,60'],{wind:1,big:1}),L('sand',24,['200,230,200'])],
  macaque:[L('spray',36,SEA),L('petal',20,['255,180,190','255,205,215'])],
  bulldemon:[L('ember',50,FIRE),L('smoke',4,['80,60,55']),L('spark',10,['255,220,140'])],
  buddhapalm:[L('gold',26,GOLD),L('mote',30,GOLD),L('petal',10,['255,215,120','255,235,180'])],
  'wukong/ui_map':[L('mote',16,GOLD),L('petal',6,PINK)],
  'wukong/ui_victory':[L('gold',22,GOLD),L('petal',14,['255,200,170','255,225,150','250,180,200'])],
  'wukong/ui_defeat':[L('leaf',14,['200,120,60','170,90,50','220,160,80']),L('mist',3,['200,180,220'])],
  'wukong/ui_camp':[L('ember',36,EMB),L('mote',10,['230,235,255'])],
  'wukong/ui_craft':[L('ember',34,FIRE),L('smoke',4,['200,190,180']),L('gold',8,GOLD)],
  'wukong/ui_altar':[L('smoke',5,['190,180,170']),L('petal',10,PINK),L('mote',12,GOLD)],
  // Thoth
  robbers:[L('ember',26,EMB),L('mote',22,['230,200,140']),L('gold',10,GOLD)],
  scorpions:[L('sand',30,['230,170,100','200,130,80']),L('mote',16,['255,200,140'])],
  servants:[L('mote',24,['150,230,230','200,240,240']),L('mist',3,['120,200,200'])],
  sobek:[L('mote',20,['255,236,170']),L('petal',10,['120,150,255','160,190,255']),L('firefly',8,['230,255,200'])],
  anubis:[L('mote',18,['220,230,255']),L('firefly',10,['255,220,120']),L('sand',10,['180,190,210'])],
  heka:[L('smoke',4,['120,220,130']),L('gold',14,['170,255,170','230,200,255']),L('ember',14,EMB)],
  ammit:[L('gold',16,GOLD),L('mist',3,['160,60,40']),L('mote',14,['255,220,180'])],
  sphinx:[L('sand',30,['230,190,130','245,210,160']),L('mote',18,GOLD)],
  apophis:[L('mist',4,['80,160,90']),L('ember',20,['150,255,150','190,120,255']),L('flash',1,['200,255,210'])],
  set:[L('sand',100,['200,90,50','230,130,70','170,70,40']),L('mist',3,['200,90,50'])],
  sekhmet:[L('ember',44,FIRE),L('ash',14,ASH),L('mote',16,['255,230,160'])],
  // Tutorial
  s_tut_text:[L('mote',22,['255,226,170']),L('gold',6,GOLD)],
  s_tut_ground:[L('mote',20,['240,225,190']),L('sand',8,['220,200,160'])],
  s_odin_tut_ground:[L('snow',40,SNOW),L('ember',10,EMB)],
  s_wk_tut_ground:[L('petal',22,PINK),L('mist',2,['230,240,235'])],
  s_th_tut_ground:[L('mote',22,['240,215,160']),L('gold',8,GOLD)],
  // Defaults: home screen and each hero's other screens
  home:[L('mote',16,['255,236,200'])],
  ody:[L('mote',22,['200,228,255'])],
  odin:[L('snow',40,SNOW)],
  wukong:[L('ember',30,EMB),L('mist',3,['255,214,140'])],
  thoth:[L('mote',30,['230,200,140','245,220,160']),L('gold',10,GOLD),L('sand',12,['220,190,130'])],
 }})();

function fxScene(){try{
 if(!G||G.phase=='char')return 'home';
 const hero=G.a2||G.ch||'ody',st=document.documentElement.style;
 if(st.getPropertyValue('--scno').trim()=='1'){
  const m=/(scenes|icons)\/(?:(odin|wukong)\/)?([a-z0-9_]+)\.jpg/.exec(st.getPropertyValue('--scn'));
  if(m)return m[1]=='scenes'?m[3]:(m[2]||'ody')+'/'+m[3]}
 const ph=G.phase,nd=G.web&&G.web.nodes&&G.web.nodes[G.pos];
 if(ph=='map')return hero+'/ui_map';
 if(ph=='victory')return hero+'/ui_victory';
 if(ph=='lost')return hero+'/ui_defeat';
 if((ph=='loc'||ph=='remove'||ph=='hub')&&nd&&['camp','craft','altar'].includes(nd.t))return hero+'/ui_'+nd.t;
 return hero}catch(e){return 'home'}}

const PTC2=(()=>{let cv,cx,parts=[],key=null,spec=null,raf=0,W=0,H=0,last=0,flash=0,nextFlash=0;
 const R=Math.random,rr=(a,b)=>a+R()*(b-a),pick=a=>a[(R()*a.length)|0];
 function make(L,init){const c=pick(L.c),k=L.k,b=L.big?1.6:1,w=L.wind?1:0,p={k,c,tw:R()*6.283,L};
  switch(k){
   case 'ember':Object.assign(p,{x:R()*W,y:H+R()*40,vx:rr(-.2,.2),vy:-rr(.4,1.2),r:rr(.7,2),a:rr(.5,.9)});break;
   case 'spark':Object.assign(p,{x:R()*W,y:H+10,vx:rr(-.8,.8),vy:-rr(1.8,3.6),r:rr(.6,1.3),a:1,life:rr(60,140)});break;
   case 'snow':Object.assign(p,{x:R()*W,y:-10,vx:w?rr(1.6,3.2):rr(-.2,.3),vy:w?rr(1,2.2):rr(.4,1.2)*b,r:rr(.8,2.6)*b,a:rr(.45,.9),sway:rr(.3,1)});break;
   case 'ash':Object.assign(p,{x:R()*W,y:-10,vx:rr(-.3,.4),vy:rr(.3,.8),r:rr(1,2.4),a:rr(.35,.7),sway:rr(.3,.9),rot:R()*6.283,vr:rr(-.05,.05)});break;
   case 'petal':Object.assign(p,{x:R()*W*1.2-W*.2,y:-12,vx:rr(.3,1),vy:rr(.5,1.1),r:rr(3,5.5),a:rr(.65,.95),sway:rr(.5,1.3),rot:R()*6.283,vr:rr(-.04,.04)});break;
   case 'leaf':Object.assign(p,{x:w?-12:R()*W,y:w?R()*H:-14,vx:w?rr(2.5,5):rr(-.4,.6),vy:w?rr(-.3,.9):rr(.6,1.3),r:rr(4,7)*b,a:rr(.7,.95),sway:rr(.6,1.4),rot:R()*6.283,vr:rr(-.06,.06)});break;
   case 'feather':Object.assign(p,{x:R()*W,y:-14,vx:rr(.8,2),vy:rr(.7,1.3),r:rr(6,10),a:rr(.6,.85),sway:rr(.8,1.6),rot:R()*6.283,vr:rr(-.03,.03)});break;
   case 'rain':Object.assign(p,{x:R()*W*1.3-W*.15,y:-20,vx:-rr(2.5,3.5),vy:rr(14,20),r:rr(10,22),a:rr(.18,.35)});break;
   case 'sand':Object.assign(p,{x:-20,y:R()*H,vx:rr(4,9),vy:rr(-.4,.6),r:rr(.7,1.8),a:rr(.35,.75),len:rr(6,18)});break;
   case 'spray':Object.assign(p,{x:R()*W,y:H+R()*30,vx:rr(-.6,.9),vy:-rr(.6,1.6),r:rr(.8,2.2),a:rr(.35,.7),life:rr(160,320)});break;
   case 'bubble':Object.assign(p,{x:R()*W,y:H+10,vx:0,vy:-rr(.4,1),r:rr(2,6),a:rr(.3,.55),sway:rr(.4,1)});break;
   case 'firefly':Object.assign(p,{x:R()*W,y:R()*H,vx:rr(-.3,.3),vy:rr(-.3,.3),r:rr(1.2,2.4),a:rr(.6,1)});break;
   case 'gold':Object.assign(p,{x:R()*W,y:R()*H,vx:rr(-.08,.08),vy:-rr(.05,.25),r:rr(2.5,5),a:rr(.6,1),life:rr(120,300)});break;
   case 'mote':Object.assign(p,{x:R()*W,y:R()*H,vx:rr(-.15,.25),vy:-rr(.05,.3),r:rr(.6,1.8),a:rr(.2,.5)});break;
   case 'wisp':Object.assign(p,{x:R()*W,y:H+60,vx:rr(-.2,.2),vy:-rr(.25,.6),r:rr(28,60),a:rr(.05,.1),sway:rr(.3,.7)});break;
   case 'smoke':Object.assign(p,{x:R()*W,y:H+80,vx:rr(-.15,.25),vy:-rr(.3,.7),r:rr(60,120),a:rr(.06,.12),grow:rr(.08,.2)});break;
   case 'mist':Object.assign(p,{x:-300,y:H*rr(.15,.9),vx:rr(.15,.4),vy:0,r:rr(140,280),a:rr(.04,.07)});break;
   case 'thread':Object.assign(p,{x:R()*W,y:-30,vx:rr(-.2,.3),vy:rr(.2,.5),r:rr(18,40),a:rr(.2,.4),rot:rr(-.6,.6),vr:rr(-.004,.004),sway:rr(.3,.8)});break;
   default:Object.assign(p,{x:R()*W,y:R()*H,vx:0,vy:-.1,r:1,a:.3});}
  if(['ember','spark','snow','mote','spray','firefly','sand','gold'].includes(k))p.r*=1.5;
  p.a0=p.a;p.age=0;
  if(init){if(['mist'].includes(k))p.x=R()*W;else if(['snow','ash','petal','feather','rain','thread','ember','spray','bubble','wisp','smoke','spark'].includes(k))p.y=R()*H;else if(k=='leaf'||k=='sand'){if(p.vx>2)p.x=R()*W;else p.y=R()*H}}
  return p}
 function seed(){parts=[];nextFlash=performance.now()+rr(4000,9000);if(!spec)return;const area=W*H/1e6;
  for(const L of spec){if(L.k=='flash')continue;const n=Math.min(170,Math.max(1,Math.round(L.n*area*2.5)));for(let i=0;i<n;i++)parts.push(make(L,true))}}
 function size(){if(!cv)return;W=cv.width=innerWidth;H=cv.height=innerHeight}
 function out(p){const m=p.r*2+40;return p.y<-m-20||p.y>H+m||p.x<-m-320||p.x>W+m+20}
 function draw(p,al){const c='rgba('+p.c+',';cx.fillStyle=c+al.toFixed(3)+')';
  switch(p.k){
   case 'ember':case 'firefly':{cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();cx.fillStyle=c+(al*.18).toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,p.r*(p.k=='firefly'?5:3.5),0,6.283);cx.fill();break}
   case 'spark':{cx.strokeStyle=c+al.toFixed(3)+')';cx.lineWidth=p.r;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*4,p.y-p.vy*4);cx.stroke();break}
   case 'rain':{cx.strokeStyle=c+al.toFixed(3)+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x+p.vx*p.r/p.vy,p.y+p.r);cx.stroke();break}
   case 'sand':{cx.strokeStyle=c+al.toFixed(3)+')';cx.lineWidth=p.r;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.len,p.y-p.vy*2);cx.stroke();break}
   case 'petal':case 'leaf':case 'feather':case 'ash':{cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.scale(1,.35+.65*Math.abs(Math.sin(p.tw)));cx.beginPath();
    if(p.k=='ash')cx.rect(-p.r/2,-p.r/2,p.r,p.r*.8);else if(p.k=='feather')cx.ellipse(0,0,p.r,p.r*.22,0,0,6.283);else cx.ellipse(0,0,p.r,p.r*(p.k=='leaf'?.42:.6),0,0,6.283);cx.fill();
    if(p.k=='leaf'||p.k=='feather'){cx.strokeStyle='rgba(0,0,0,'+(al*.25).toFixed(3)+')';cx.lineWidth=.6;cx.beginPath();cx.moveTo(-p.r,0);cx.lineTo(p.r,0);cx.stroke()}cx.restore();break}
   case 'bubble':{cx.strokeStyle=c+al.toFixed(3)+')';cx.lineWidth=1;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.stroke();cx.fillStyle=c+(al*.5).toFixed(3)+')';cx.beginPath();cx.arc(p.x-p.r*.35,p.y-p.r*.35,p.r*.22,0,6.283);cx.fill();break}
   case 'gold':{const s=p.r*(.6+.4*Math.sin(p.tw*2));cx.beginPath();cx.moveTo(p.x,p.y-s);cx.lineTo(p.x+s*.22,p.y-s*.22);cx.lineTo(p.x+s,p.y);cx.lineTo(p.x+s*.22,p.y+s*.22);cx.lineTo(p.x,p.y+s);cx.lineTo(p.x-s*.22,p.y+s*.22);cx.lineTo(p.x-s,p.y);cx.lineTo(p.x-s*.22,p.y-s*.22);cx.closePath();cx.fill();
    cx.fillStyle=c+(al*.2).toFixed(3)+')';cx.beginPath();cx.arc(p.x,p.y,s*1.3,0,6.283);cx.fill();break}
   case 'wisp':case 'smoke':case 'mist':{const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,c+al.toFixed(3)+')');g.addColorStop(1,c+'0)');cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();break}
   case 'thread':{cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.strokeStyle=c+al.toFixed(3)+')';cx.lineWidth=.7;cx.beginPath();cx.moveTo(0,-p.r);cx.quadraticCurveTo(p.r*.3*Math.sin(p.tw),0,0,p.r);cx.stroke();cx.restore();break}
   default:{cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}}}
 function step(t){raf=requestAnimationFrame(step);if(document.hidden)return;const dt=Math.min(3,(t-last)/16.7||1);last=t;cx.clearRect(0,0,W,H);
  for(let i=0;i<parts.length;i++){const p=parts[i];p.tw+=.03*dt;p.age+=dt;
   const sw=p.sway?Math.sin(p.tw)*p.sway*.5:0;p.x+=(p.vx+sw)*dt;p.y+=p.vy*dt;if(p.vr)p.rot+=p.vr*dt;
   if(p.k=='firefly'){p.vx+=(R()-.5)*.04*dt;p.vy+=(R()-.5)*.04*dt;p.vx=Math.max(-.4,Math.min(.4,p.vx));p.vy=Math.max(-.4,Math.min(.4,p.vy))}
   if(p.k=='smoke')p.r+=p.grow*dt;
   if(p.k=='spray')p.vy+=.006*dt;
   if(p.k=='spark')p.vy+=.02*dt;
   let al=p.a;
   if(p.life){const f=p.age/p.life;if(f>=1){parts[i]=make(p.L);continue}al*=Math.sin(Math.PI*f)}
   if(p.k=='ember')al*=.6+.4*Math.sin(p.tw*3);else if(p.k=='firefly')al*=Math.max(0,Math.sin(p.tw*1.3));else if(p.k=='mote'||p.k=='snow')al*=.7+.3*Math.sin(p.tw);
   if(p.k=='smoke'||p.k=='wisp')al*=Math.max(0,Math.min(1,p.y/H*1.4));
   if(p.k=='firefly'||p.k=='mote'||p.k=='gold'){if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10}
   else if(out(p)){parts[i]=make(p.L);continue}
   if(al>.004)draw(p,al)}
  const fl=spec&&spec.find(L=>L.k=='flash');
  if(fl&&t>nextFlash){flash=1;nextFlash=t+rr(5000,12000)}
  if(flash>0){cx.fillStyle='rgba('+fl.c[0]+','+(flash*.22).toFixed(3)+')';cx.fillRect(0,0,W,H);flash-=.06*dt}}
 function set(k){if(typeof document==='undefined'||RMO())return;
  if(!cv){cv=document.createElement('canvas');cv.id='fxp';document.body.insertBefore(cv,document.body.firstChild);cx=cv.getContext('2d');addEventListener('resize',()=>{size();seed()});size()}
  if(k===key)return;key=k;spec=PSPEC[k]||PSPEC[String(k).split('/')[0]]||PSPEC.home;seed();if(!raf)raf=requestAnimationFrame(step);cv.dataset.scene=k}
 return{set,get key(){return key}}})();
