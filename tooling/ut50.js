// v106-112: tutorial lessons. Every lesson is scripted to a win: following the guide step by step (tutAuto)
// must defeat the dummies within 3 turns, and every hero has at least 3 lessons (one per archetype).
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const store={};const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
 ok('every hero has at least 3 lessons',['ody','odin','wukong','thoth'].every(h=>R(`tutOf('${h}').length`)>=3));
 ok('lesson ids are unique',R("new Set(TUT.map(L=>L.id)).size==TUT.length"));
 ok('every lesson card exists',R("TUT.every(L=>[...L.deck,...L.edeck].every(id=>D[id]))"));
 ok('every step names its action',R("TUT.every(L=>L.steps.every(s=>s.k||s.done))"));
 store.myth_tut_done='[0,2,9]';ok('old numeric progress migrates to ids',R("tutDone().join()")=='ody1,ody3,journey');delete store.myth_tut_done;
 R('tutStart(0)');R("bt('tutnext');bt('tutnext')");ok('info steps advance with Next',R('G.tut.s')==2);R("bt('end')");ok('End turn is blocked while a step needs doing',R('G.phase')=='main'&&R('G.turn')==1);
 for(let L=0;L<R('TUT.length');L++){const id=R(`TUT[${L}].id`);R(`tutStart(${L})`);let g=0;
  for(;;){const ph=R('G.phase');if(ph=='tutend'||++g>3000)break;if(ph=='main')R('tutAuto()');else if(ph=='blockP')R('tutAutoBlock()');else if(ph=='dmgP')R("bt('res')");await tick()}
  ok(`${id}: following the guide wins (turn ${R('G.turn')}, step ${R('G.tut.s')+1}/${R(`TUT[${L}].steps.length`)})`,R('G.phase')=='tutend'&&R('G.tut.won')==1&&R('G.turn')<=3&&R('G.tut.s')>=R(`TUT[${L}].steps.length`)-1)}
 ok('the saved run is untouched by lessons',!('mythologica_run_v1' in store));
 console.log(f?'FAILS '+f:'ALL OK')})();
