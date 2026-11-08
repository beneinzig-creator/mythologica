const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync('n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
let html='';const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,document:{getElementById:()=>({set innerHTML(v){html=v}}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
let degs=[],bad=0;
for(let i=0;i<300;i++){const w=R('genWeb()');const n=w.nodes;if(n.length!=25)bad++;const c={};n.forEach(x=>c[x.t]=(c[x.t]||0)+1);if(c.fight!=15||c.camp!=3||c.craft!=3||c.altar!=3||c.start!=1)bad++;
 const seen=new Set([0]),q=[0];while(q.length){const a=q.shift();n[a].adj.forEach(b=>{if(!seen.has(b)){seen.add(b);q.push(b)}})}if(seen.size!=25)bad++;degs.push(w.edges.length);if(n[0].adj.length<2)bad++}
ok('300 webs: 25 nodes, 15/3/3/3, connected, start deg>=2',bad==0);console.log('edges avg',degs.reduce((a,b)=>a+b)/degs.length,'min',Math.min(...degs),'max',Math.max(...degs));
R(`newRun();for(let i=0;i<11;i++)pickDraft(0)`);ok('map after draft',R('G.phase')=='map'&&R('G.act')==2&&R('G.fi')==0);
// walk to a fight neighbor
R(`var nb=G.web.nodes[0].adj.map(i=>G.web.nodes[i]);var ft=nb.find(n=>n.t=='fight')||null`);
if(R('!!ft')){R(`goNode(ft.id)`);ok('fight started',R('G.phase')=='main'&&R('G.e.max')==R('fo(ft.o).l-3'));R(`G.e.life=0;chk()`);ok('kleos',R('G.phase')=='kleos');R(`G.kl=[];bt('next')`);ok('reward: vp1 ap3 cleared',R('G.fi')==1&&R('G.act')==4+(R('ft.el')?1:0)&&(R('G.phase')=='map'||R('G.phase')=='draft')&&R('G.web.nodes[G.pos].cleared')==1);
 R('G.phase="map";G.dr=0');R(`goNode(0)`);ok('walk back to start',R('G.pos')==0&&R('G.phase')=='map');
 R(`G.fi=2;G.rt[2]=0;G.web.nodes[G.pos].cleared=0;fight()`);ok('scaled enemy life (ody fight-3 adjust)',R('G.e.max')==R('EN[0].l+SCL[2][0]+CFA.ody[2][0]'));}
// locations
for(const t of ['camp','craft','altar']){R(`newRun();for(let i=0;i<11;i++)pickDraft(0);G.act=5;var L=G.web.nodes.find(n=>n.t=='${t}');G.pos=L.id;G.phase='loc';render()`);
 if(t=='camp'){R(`G.p.life=5;bt('hheal');bt('hheal');bt('hheal')`);ok('camp heals 6 twice only',R('G.p.life')==17&&R('G.act')==3);}
 if(t=='craft'){R(`bt('hdraft')`);ok('draft opens',R('G.phase')=='draft');R(`bt('dpass')`);ok('pass costs AP',R('G.act')==4&&R('G.phase')=='loc');R(`bt('hrem');G.rm=0;bt('rmyes')`);ok('remove costs AP',R('G.act')==3&&R('G.p.recs.length')==14);}
 if(t=='altar'){R(`n0=G.p.recs.length;bt('hdup');G.rm=0;bt('rmyes')`);ok('dup once',R('G.p.recs.length')==R('n0')+1&&R('G.act')==4);R(`bt('hdup')`);ok('dup blocked 2nd',R('G.phase')=='loc');
  R(`bt('hupg');G.rm=G.p.recs.findIndex(r=>isC(mk(r.id)));render()`);ok('upg offers options',R('G.uo&&G.uo.length')>0);R(`var k0=G.p.recs[G.rm].k;bt('upg0')`);ok('upgrade applied',R('G.act')==3&&R('G.phase')=='loc'&&R('G.web.nodes[G.pos].used.u')==1);
  R(`bt('hupg')`);ok('upg once',R('G.phase')=='loc');}
 R(`bt('hdone')`);ok(t+' leave marks done',R('G.web.nodes[G.pos].done')==1&&R('G.phase')=='map');}
console.log(f?'FAILS '+f:'ALL OK');
