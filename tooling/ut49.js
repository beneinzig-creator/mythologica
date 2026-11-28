// v105: Thoth engine and the Egyptian realm
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=(ch='thoth')=>R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.elt=0;G.boss=0;G.fi=0;G.rt=[0,1,2,3,4,5];fight();G.phase='main';G.p.hand=[];G.p.bf=[];G.p.mana=30;G.e.bf=G.e.bf.filter(x=>!isC(x))`);
const put=(id,s='p',bf)=>R(`(()=>{const c=mk('${id}');${bf?`c.sick=0;enter(G.${s},c)`:`G.${s}.hand.push(c)`};return c.u})()`);
const card=u=>`[...G.p.bf,...G.e.bf,...G.p.hand].find(x=>x.u==${u})`;

// Sunder an enemy: Body and Spirit on their side, Name in our hand
setup();const gw=put('sking','e',1);R(`cast(mk('tsun'),${card(gw)})`);
ok('Sunder: target leaves play',!R(`G.e.bf.some(x=>x.u==${gw})`));
ok('Sunder: Body (0 power) and Spirit (flying) join their army',R(`cr(G.e).some(x=>x.part=='ka'&&pw(x)==0)&&cr(G.e).some(x=>x.part=='ba'&&has(x,'f'))`));
ok('Sunder: Name of the Scorpion King in our hand',R(`G.p.hand.some(x=>x.ren&&D[x.id][0].includes('Scorpion King'))`));
// Speak the name: +2 mana
R('G.p.mana=0');R(`speak(G.p.hand.find(x=>x.ren))`);ok('Speak the name: +2 mana and the Name is gone',R('G.p.mana')==2&&!R('G.p.hand.some(x=>x.ren)'));
// Write a name: keywords become glyphs
setup();const t1=put('snake','e',1);const me=put('gpriest','p',1);R(`cast(mk('tsun'),${card(t1)})`);
R(`cast(G.p.hand.find(x=>x.ren),${card(me)})`);ok('Name written: Venomous and +1/+1 as glyphs',R(`has(${card(me)},'v')`)&&R(`(${card(me)}).gl.length`)==2);
// Glyph limit of 3
R(`['f','w','h','z'].forEach(k=>inscribe(${card(me)},k))`);ok('Glyph limit: never more than 3',R(`(${card(me)}).gl.length`)==3);
// Erase
setup();const e1=put('mthief','e',1);R(`cast(mk('ierase'),${card(e1)})`);
ok('Erase: loses name and keywords',R(`(${card(e1)}).id.startsWith('nm')`)&&R(`(${card(e1)}).f`)=='');
// Reunite our own Sundered army member
setup();const s1=put('gpriest','p',1);R(`cast(mk('dcut'),${card(s1)})`);ok('Ritual Knife: our Body and Spirit',R(`cr(G.p).filter(x=>x.part).length`)==2);
R(`cast(mk('dreun'))`);ok('Reunion: the Priest returns with +2/+2',R(`cr(G.p).some(x=>x.u==${s1}&&x.pa==2&&x.pd==2)`)&&!R('cr(G.p).some(x=>x.part)'));
// Amulets: attach, bonus, fall, re-equip
setup();const a1=put('gpriest','p',1);R(`cast(mk('ianx'),${card(a1)})`);const am=R(`G.p.bf.find(x=>x.id=='ianx').u`);
ok('Ankh equipped: +1/+1 and Draining',R(`has(${card(a1)},'d')`)&&R(`pwr(${card(a1)})`)==R(`D.gpriest[3]`)+1);
R(`(${card(a1)}).dmg=99;sweep();chk()`);ok('Amulet falls when the bearer dies, and stays on our side',R(`G.p.bf.some(x=>x.u==${am}&&!x.on)`));
const a2=put('gpriest','p',1);R(`G.p.mana=5;hd0('p:${am}');hd0('p:${a2}')`);ok('Re-equip costs its equip cost (2)',R('G.p.mana')==3&&R(`G.p.bf.find(x=>x.u==${am}).on`)==a2);
// Scarab
setup();const b1=put('gpriest','p',1);R(`cast(mk('tscar'),${card(b1)})`);R(`(${card(b1)}).dmg=99;sweep();chk()`);
ok('Scarab: bearer returns to hand instead of dying',R(`G.p.hand.some(x=>x.u==${b1})`)&&!R(`G.p.gy.some(x=>x.u==${b1})`));
// Foresee / Record / Preempt
setup();R(`G.e.deck.push(mk('sking'))`);R(`foresee(1,1)`);ok('Foresee marks their next card',R(`G.e.deck[G.e.deck.length-1].fs`)==1);
R(`preempt(1)`);const pl=R(`G.e.deck[G.e.deck.length-1].u`);R(`(()=>{const c=G.e.deck.pop();G.e.hand.push(c)})()`);
const stop=R(`thEnemyPlay(G.e,G.e.hand.find(x=>x.u==${pl}))`);ok('Preempt: the foreseen card fails',stop===true);
ok('Record: a fading copy joins our hand',R(`G.p.hand.some(x=>x.id=='sking'&&x.dis)`));
// Senet: extra turn
setup();const t0=R('G.turn');R(`cast(mk('ysenet'))`);R(`bt('end')`);ok('Senet: extra turn instead of the enemy turn',R('G.phase')=='main'&&R('G.turn')==t0+1);
// Egyptian realm trumps work against any hero
setup('ody');R(`G.e.bf.push(mk('apep'))`);const o1=put('hopl','p',1);R('upkeep(G.e,G.p)');ok('Apophis Erases Odysseus\'s strongest army member',R(`cr(G.p)[0].id.startsWith('nm')`));
setup('ody');R(`G.e.bf.push(mk('setx'))`);put('hopl','p',1);R('upkeep(G.e,G.p)');ok('Set Sunders it: Body and Spirit stay with Odysseus',R(`cr(G.p).filter(x=>x.part).length`)==2&&!R('G.p.hand.some(x=>x.ren)'));
setup('odin');R(`G.e.bf.push(mk('sphx'))`);R('upkeep(G.e,G.p)');const L0=R('G.p.life');R(`bt('end')`);ok('Sphinx: unanswered riddle costs 2 life',R('G.p.life')<=L0-2||R('G.riddle')==0);
setup('wukong');R(`G.e.bf.push(mk('trob'));enter(G.e,mk('grob'));G.p.hand.push(mk('wrod'))`);R('upkeep(G.e,G.p)');ok('Tomb Robbers steal from Wukong\'s hand when they outnumber him',R('G.p.hand.length')==0&&R('G.e.loot.length')==1);
console.log(f?'FAILS '+f:'ALL OK');
