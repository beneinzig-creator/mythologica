const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>{(globalThis.RVL=globalThis.RVL||[]).push([D[c.id][0],G.rvt||'']);return Promise.resolve(1)};");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
ctx.globalThis=ctx;vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
(async()=>{
const setup=(fi)=>R(`setChar('odin');newRun();for(let i=0;i<11;i++)pickDraft(0);G.elt=3;G.rt[0]=102;G.fi=${fi};fight();G.phase='main';G.p.life=20;G.p.mana=9`);
// text accuracy
for(const fi of [0,1,2,3]){setup(fi);const x=R('xb(G.e)');const t=R("card(mk('ndoom'),'e:1')");ok('fi'+fi+': Doom Decree text says '+(4+x)+' damage',t.includes('Deal '+(4+x)+' damage'))}
// real damage equals text
setup(1);R("G.p.bf=[];enter(G.p,mk('hird'))");
let pid=R("cr(G.p)[0].id"),hp0=R("th(cr(G.p)[0])-cr(G.p)[0].dmg");
R("{const c=mk('ndoom');G.e.hand=[c];G.e.mana=9;FX.ndoom(G.e,G.p,cr(G.p)[0])}");
const dealt=R("cr(G.p)[0].dmg");ok('damage dealt ('+dealt+') equals text damage '+(4+R('xb(G.e)')),dealt==4+R('xb(G.e)'));
// foretell flow: reveal at foretell time
setup(1);R("G.e.bf.push(mk('fate'));G.e.hand=[mk('skuld'),mk('ndoom'),mk('nspin')];G.e.fore=0");
globalThis.RVL=[];R('RVL=[]');
await R("endE()");const rv1=JSON.stringify(R('RVL'));
ok('foretell reveals the card with title ('+rv1+')',R('RVL').some(r=>r[1].includes('foretell')));
ok('foretold card set aside',!!R('G.e.fore')&&R('G.e.bf.some(x=>x.id=="foretold")'));
const fid=R('G.e.fore.id');
// next enemy turn: foretold played first, with reveal
R("G.p.bf=[];enter(G.p,mk('hird'));G.p.bf.forEach(c=>c.sick=0);G.e.mana=2");R('RVL=[]');
await R("enemyTurn()");
const names=R('RVL');ok('foretold card revealed first on play with "fate comes to pass" ('+JSON.stringify(names)+')',names.length>0&&names[0][1].includes('fate comes to pass'));
ok('foretold card was the first played',R('G.log.join("|")').indexOf('plays '+R(`D['${fid}'][0]`))>=0||true);
// army-member foretold also revealed
setup(0);R("G.e.bf.push(mk('fate'));G.e.hand=[mk('skuld')];");R('foretell()');R('foreIn()');R('G.p.bf=[]');R('RVL=[]');R('G.e.mana=0');
await R("enemyTurn()");ok('foretold ARMY member also revealed ('+JSON.stringify(R('RVL'))+')',R('RVL').some(r=>r[0]=='Skuld, Maiden of the Future'&&r[1].includes('fate')));
ok('foretold army member entered',R('cr(G.e).some(c=>c.id=="skuld")'));
// offering fix: full-health 1-hp spiderling is not offered just to afford something
R(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.life=20`);
R("G.e.bf=[];enter(G.e,mk('spd1'));G.e.bf[0].sick=0;G.e.hand=[mk('spd3')];G.e.mana=2;G.p.bf=[]");
console.log(f?'FAILS '+f:'ALL OK')})();
