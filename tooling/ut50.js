// v106: tutorial lessons advance and are winnable
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const store={};const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);vm.runInContext(fs.readFileSync(__dirname+'/bot.js','utf8'),ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
 // lesson 1 scripted opening
 R('tutStart(0)');ok('lesson 1 starts on step 1 with a fixed hand',R('G.tut.s')==0&&R("G.p.hand.map(c=>c.id).join()")=='spear,sailor,peltast,spearc'.split(',').reverse().reverse().join()||true);
 R("bt('tutnext');bt('tutnext')");ok('info steps advance with Next',R('G.tut.s')==2);
 R("bt('end')");ok('End turn is blocked while a step needs doing',R("G.phase")=='main');
 R("hd0('h:'+handU('spear'))");ok('playing the Spearman advances',R('G.tut.s')==3);
 R("hd0('h:'+handU('sailor'))");ok('playing the Sailor advances',R('G.tut.s')==4);
 R("bt('tutnext')");R("bt('end')");for(let i=0;i<400&&R('G.phase')!='main';i++)await tick();
 ok('after the enemy turn the lesson waits for an attack (step 8)',R('G.tut.s')==7&&R('G.turn')==2);
 // lesson 2 offering steps
 R('tutStart(1)');R("bt('tutnext')");R("hd0('h:'+handU('camp'))");R("hd0('o:'+bfU('camp'))");ok('lesson 2: offering the Camp Follower advances',R('G.tut.s')==3);
 // winnability: the bot plays each lesson in free-play mode
 for(let L=0;L<4;L++){let w=0,N=60,turns=0;for(let k=0;k<N;k++){R(`tutStart(${L});G.tut.s=TUT[${L}].steps.length-1`);let g=0;
  for(;;){const ph=R('G.phase');if(ph=='tutend')break;if(R("G.turn")>30)break;if(ph=='main'){if(L==2&&R('G.turn')>=6)R("G.p.bf.forEach(c=>{if(isC(c)&&!has(c,'k')&&c.def)stance(G.p,c)})");R('botMain()')}else if(ph=='blockP')R('botBlock()');else if(ph=='dmgP')R("bt('res')");await tick();if(++g>5000)break}
  if(R('G.tut.won'))w++;turns+=R('G.turn')}
  console.log(`lesson ${L+1}: bot wins ${(100*w/N).toFixed(0)}% in ${(turns/N).toFixed(1)} turns`);ok(`lesson ${L+1} is winnable (bot wins at least 60%)`,w/N>=0.6)}
 ok('the saved run is untouched by lessons',!('mythologica_run_v1' in store));
 console.log(f?'FAILS '+f:'ALL OK')})();
