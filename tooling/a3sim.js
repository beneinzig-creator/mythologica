// v111: replay banked Act III arrival decks through Act III.
// usage: node a3sim.js n1.html BANKFILE RUNS [opts via env: OPP=<EN index>|100+<elite>|200+<boss>  (force every fight), PICK=0|1|r (general choice)]
// Regular-fight losses continue (life refilled, like runs.py); a general or Beast loss ends the run.
const vm=require('vm'),fs=require('fs'),path=require('path');
const [html,bankf,Ns]=process.argv.slice(2);const N=+Ns||50;
let src=fs.readFileSync(html,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'bot.js'),'utf8'),ctx);const R=e=>vm.runInContext(e,ctx);
const BANK=fs.readFileSync(bankf,'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const OPP=process.env.OPP!=null?+process.env.OPP:-1;R('var FOPP='+OPP+';FOSET=0');
const tick=()=>new Promise(r=>setImmediate(r));
const BY={},F=[...Array(6)].map(()=>({n:0,w:0,t:0}));let won=0,gen={n:0,w:0},fin={n:0,w:0},stall=0,errs=0;
(async()=>{for(let i=0;i<N;i++){const b=BANK[i%BANK.length];
 R(`setChar('${b.ch}');newRun();G.p.recs=${JSON.stringify(b.recs)};G.p.max=${b.max};G.p.life=${b.life};G.a2='${b.a2}';A2R='${b.a2}';FOSET=0;startAct3()`);
 let g=0;for(;;){const ph=R('G.phase');const key=()=>(R('G.boss')?(R('G.fin')?'F:':'G:'):R('G.elt')?'E:':'R:')+(R('G.boss')?R('BOSS[G.bi].n'):R('G.e.nm'));
  const done=w=>{const k=key(),t=R('G.turn'),fi=R('G.boss')?(R('G.fin')?5:4):R('G.fi');const o=BY[k]||(BY[k]={n:0,w:0,t:0});o.n++;o.w+=w;o.t+=t;F[fi].n++;F[fi].w+=w;F[fi].t+=t};
  try{
  if(R('G.turn')>45&&['main','blockP','dmgP','enemy'].includes(ph)){stall++;done(0);if(!R('G.boss')){R("G.p.life=G.p.max;G.web.nodes[G.pos].cleared=1;G.fi++;G.act+=2;G.phase=G.fi>=FLOORS?'otg':'map'");continue}break}
  if(ph=='map'){if(R('G.act')<=0)R('G.act+=2');R('botMap()')}else if(ph=='loc')R('botLoc()');else if(ph=='draft')R('botDraft()');else if(ph=='remove')R('botRemove()');
  else if(ph=='otg')R('otgOffer()');else if(ph=='bossp'){const pk=process.env.PICK||'r';R(pk=='r'?'bossPick(G.bs[Math.random()*2|0])':'bossPick(G.bs['+pk+'])');gen.n++}
  else if(ph=='a3front'){gen.w++;F[4].n++;F[4].w++;{const k='G:'+R('BOSS[G.bi].n');const o=BY[k]||(BY[k]={n:0,w:0,t:0});o.n++;o.w++;o.t+=R('G.turn')}R('startFinale()');fin.n++}
  else if(ph=='main')R('botMain()');else if(ph=='blockP')R('botBlock()');else if(ph=='dmgP')R("bt('res')");
  else if(ph=='kleos'){done(1);R('botKleos()')}
  else if(ph=='victory'){done(1);fin.w++;won++;break}
  else if(ph=='lost'){done(0);if(!R('G.boss')){R("G.p.life=G.p.max;G.web.nodes[G.pos].cleared=1;G.fi++;G.act+=2;G.phase=G.fi>=FLOORS?'otg':'map'");continue}break}
  }catch(e){errs++;if(errs<4)console.log('ERR',ph,e.message);break}
  await tick();if(++g>20000){console.log('STUCK',ph);break}}}
 const pc=(w,n)=>n?(100*w/n).toFixed(1):'-';
 console.log('fights 1-4, general, Beast:',F.map(f=>pc(f.w,f.n)+'%(n'+f.n+')').join('  '));
 console.log('generals won',pc(gen.w,gen.n)+'%','Beast won',pc(fin.w,fin.n)+'%','runs won',pc(won,N)+'%','stalls',stall,'errors',errs);
 Object.keys(BY).sort().forEach(k=>{const o=BY[k];console.log('  '+k.padEnd(40),'n'+String(o.n).padStart(4),'win '+pc(o.w,o.n).padStart(5),'turns '+(o.t/o.n).toFixed(1))});
 console.log('JSON '+JSON.stringify({by:BY,F,gen,fin,won,N,stall,errs}))})();
