// v112: bosses cast their trump like any other card (it starts in their hand, not on the battlefield)
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{const NB=R('BOSS.length');let start=0,cast=0;
 for(let i=0;i<NB;i++){R(`setChar('ody');newRun();G.p.recs='spear,spear,sailor,sailor,hopl,hopl,ox,ox,camp,argus'.split(',').map(id=>({id,a:0,d:0,c:0,s:0,k:0,fl:0}));G.boss=1;G.bi=${i};fight()`);
  const tr=R(`BOSS[${i}].trump`);if(!R(`G.e.bf.some(x=>x.id=='${tr}')`)&&R(`G.e.hand.some(x=>x.id=='${tr}'&&x.boss)`))start++;
  R("bt('end')");for(let g=0;g<400&&R('G.phase')=='enemy';g++)await tick();if(R(`G.e.bf.some(x=>x.id=='${tr}'&&x.boss)`))cast++;else console.log('  not cast:',R(`BOSS[${i}].n`))}
 ok(`all ${NB} bosses start with their trump in hand, not on the battlefield`,start==NB);
 ok(`all ${NB} bosses cast their trump on their first turn`,cast==NB);
 R("setChar('ody');newRun();G.p.recs=[{id:'spear',a:0,d:0,c:0,s:0,k:0,fl:0}];G.elt=1;G.boss=0;fight()");ok('elites still open with their trump in hand',R("G.e.hand.some(x=>x.id==ELITES[0].mt)")&&!R("G.e.bf.length"));
 console.log(f?'FAILS '+f:'ALL OK')})();
