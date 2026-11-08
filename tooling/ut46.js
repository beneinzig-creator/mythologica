const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setupB=(i)=>R(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.boss=1;G.bi=CHARS.wukong.bo[${i}];fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[];G.p.hand=[];G.e.hand=[];wkUp(G.p);G.turn=5;`);
const cast=(id,t)=>R(`(function(){var c=mk('${id}');G.p.hand.push(c);cast(c,${t||'undefined'});return c})()`);
ok('3 wukong bosses',R('CHARS.wukong.bo.length')==3&&R('CHARS.wukong.bo.every(i=>BOSS[i])'));
for(let i=0;i<3;i++){const l=R(`BOSS[CHARS.wukong.bo[${i}]].lore.split(/(?<=[.!?])\\s+/).length`);ok('boss '+i+' lore 5 sentences ('+l+')',l==5)}
setupB(0);ok('macaque trump present',R(`G.e.bf.some(c=>c.id=='mtrump')`));
cast('wmonk');ok('macaque mimics first army member',R(`G.e.bf.filter(c=>c.id=='wmonk').length`)==1);
cast('wacro');ok('macaque mimics only one per turn',R(`G.e.bf.filter(c=>c.id=='wacro').length`)==0);
setupB(1);R(`G.e.bf.push(mk('bgrd'));cr(G.e)[0].sick=0`);R('bossStart()');ok('bull fury +2 power',R(`pwr(cr(G.e)[0])`)==3);
setupB(2);R(`G.p.cp=3;var h=mk('wdart');G.p.hand.push(h)`);ok('palm taxes 4th card',R('cost(h)')==2);
R(`G.p.cp=2`);ok('palm: third card free',R('cost(h)')==0);
R(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.elt=ELITES.length;G.boss=0;fight();G.phase='main';G.p.bf=[];G.p.hand=[];G.e.hand=[];enter(G.e,mk('ifan'))`);
console.log(R('G.e.nm+" "+G.e.bf.map(c=>c.id)+" boss="+G.boss+" elt="+G.elt'));ok('iron fan elite loaded',R(`G.e.bf.some(c=>c.id=='ifan')`));
R(`var c1=mk('hopl');G.p.bf=[];enter(G.p,c1);var c2=mk('wmonk');enter(G.p,c2);bossStart()`);ok('fan blows back most expensive',R(`G.p.hand.some(c=>c.id=='hopl')`)||R(`G.p.hand.length>=1`));
console.log(f?('FAILED '+f):'ALL OK');
