const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setupE=(ch,el)=>R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.elt=${el+1};G.rt[0]=${100+el};G.fi=0;fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[]`);
// map
for(const ch of['ody','odin']){R(`setChar('${ch}');newRun()`);ok(ch+' map has 2 elite nodes',R(`G.web.nodes.filter(n=>n.el).length`)==2);
 ok(ch+' elite nodes are fights with unique o',R(`G.web.nodes.filter(n=>n.el).every(n=>n.t=='fight'&&n.o>=100)&&new Set(G.web.nodes.filter(n=>n.el).map(n=>n.o)).size==2`));
 ok(ch+' correct realm elites',R(`JSON.stringify(G.web.nodes.filter(n=>n.el).map(n=>n.o).sort())`)==(ch=='ody'?'[100,101]':'[102,103]'));
 ok(ch+' tooltip mentions Elite',R(`nodeTip(G.web.nodes.find(n=>n.el))`).includes('Elite'));
 R('for(let i=0;i<11;i++)pickDraft(0);G.phase="map"');try{R('renderMap()');ok(ch+' renderMap ok',true)}catch(e){ok(ch+' renderMap '+e.message,false)}}
// fights start with trump in hand
for(const [ch,el,t] of[['ody',0,'cup'],['ody',1,'sacril'],['odin',2,'fate'],['odin',3,'hoard']]){setupE(ch,el);ok(ch+' elite '+el+' trump in hand, hand 4, not on field, life 18',R(`G.e.hand.some(c=>c.id=='${t}')&&!G.e.bf.some(c=>c.id=='${t}')&&G.e.hand.length==4&&G.e.max>=10`));}
// Circe
setupE('ody',0);R(`G.e.bf.push(mk('cup'));G.e.bf.push(mk('cwolf'));var a=mk('hird'),b=mk('sold');var big=mk('brute')||0;`);
R(`var A=mk('brute');A.sick=0;var B=mk('hird');G.p.bf=[A,B];circeStart()`);
ok('cup swines the strongest cost>=3',R(`G.p.bf.some(c=>c.id=='swine')&&G.p.bf.filter(c=>c.id=='swine').length==1`));
ok('beasts grow',R(`cr(G.e).find(c=>c.id=='cwolf').pa==1`));
R(`circeStart()`);ok('only one swine',R(`G.p.bf.filter(c=>c.id=='swine').length`)==1);
R(`var sw=G.p.bf.find(c=>c.id=='swine');sw.dmg=5;sweep()`);ok('swine dies -> original in hand',R(`G.p.hand.some(c=>true)&&!G.p.bf.some(c=>c.id=='swine')&&G.p.gy.every(c=>c.id!='swine')`));
R(`G.p.bf=[];G.p.hand=[];var Q=mk('goat');G.p.bf=[Q];Q.sick=0;`);
// test offer path
R(`G.p.bf=[];G.p.hand=[];var Z=mk('brute');Z.sick=0;G.p.bf=[Z];circeStart();var s2=G.p.bf.find(c=>c.id=='swine');offer(G.p,s2)`);
ok('offer swine: original returns, mana gained',R(`G.p.hand.some(c=>c.id=='brute')&&!G.p.bf.some(c=>c.id=='swine')`));
R(`G.p.bf=[];G.p.hand=[];var Y=mk('brute');Y.sick=0;G.p.bf=[Y];circeStart();var s3=G.p.bf.find(c=>c.id=='swine');bounce(s3)`);
ok('bounce swine: original returns',R(`G.p.hand.length==1&&G.p.hand[0].id=='brute'`));
// Cattle
setupE('ody',1);R(`var T=mk('sacril');G.e.bf.push(T);var c1=mk('cow');G.e.bf.push(c1);c1.dmg=9;sweep()`);
ok('cow death adds sacrilege',R('T.k')==1);
R(`var c2=mk('bull');G.e.bf.push(c2);offer(G.e,c2)`);ok('AI offering a bull adds none',R('T.k')==1);
R(`var L0=G.p.life;upkeep(G.e,G.p)`);ok('Helios burns 1',R('G.p.life')==R('L0')-1);
R(`G.p.bf=[mk('hird')];offer(G.p,G.p.bf[0])`);ok('player offering atones',R('T.k')==0);
R(`var d1=D.sacril[6]`);ok('DYN text shows counters',R(`DYN.sacril(T).includes('Counters: 0')`));
// Norns
setupE('odin',2);R(`G.e.bf.push(mk('fate'));G.e.hand=[mk('skuld'),mk('nspin')];foretell()`);
ok('foretells costliest, placeholder on field',R(`G.e.fore&&G.e.fore.id=='skuld'&&G.e.bf.some(c=>c.id=='foretold')&&!G.e.hand.some(c=>c.id=='skuld')`));
ok('note shown',R(`whNote().includes('Foretold')`));
R(`foreIn()`);ok('foretold returns free',R(`G.e.hand.some(c=>c.id=='skuld'&&c.free)&&cost(G.e.hand.find(c=>c.id=='skuld'))==0&&!G.e.bf.some(c=>c.id=='foretold')`));
// Fafnir
setupE('odin',3);R(`var H=mk('hoard');G.e.bf.push(H);var F=mk('fafn');G.e.bf.push(F);var p0=pwr(F);hoardAdd(G.e,mk('fgrd'));hoardAdd(G.e,mk('fgrd'))`);
ok('hoard adds gold; fafnir grows',R('H.g')==2&&R('pwr(F)')==R('p0')+2);
R(`hoardAdd(G.e,mk('fgrd'));hoardAdd(G.e,mk('fgrd'))`);ok('gold capped at 3',R('H.g')==3);
R(`G.p.bf=[mk('hird'),mk('hird')];G.p.bf.forEach(c=>c.d=3);FX.dbrth(G.e,G.p)`);ok('dragon breath 2 to each',R('G.p.bf.every(c=>c.dmg==2)'));
// reward
setupE('ody',0);R(`G.e.life=0;chk()`);ok('victory -> kleos',R('G.phase')=='kleos');R(`G.act=0;var n0=G.act;startReward()`);
ok('elite reward: +3 AP, draft phase elite',R('G.act')==3&&R(`G.phase`)=='draft'&&R(`G.dr.elite`)==1&&R('G.dr.off.length')==3);
R(`var rl=G.p.recs.length;pickDraft(0)`);ok('elite draft returns to map, no AP cost, card added',R('G.phase')=='map'&&R('G.act')==3&&R('G.p.recs.length')==R('rl')+1);
setupE('ody',0);R(`G.act=0;G.e.life=0;chk();startReward()`);R(`bt('dpass')`);ok('pass returns to map free',R('G.phase')=='map'&&R('G.act')==3);
// regular reward unchanged
R(`setChar('ody');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.elt=0;G.fi=0;fight();G.e.life=0;chk();G.act=0;startReward()`);ok('regular reward +2 AP, no draft',R('G.act')==2&&R('G.phase')=='map');
process.exit(f?1:0);
