// v104: new pool cards and universal Divine Intervention
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=ch=>R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.elt=0;G.boss=0;G.fi=0;G.rt=[0,1,2,3,4,5];fight();G.phase='main';G.p.hand=[];G.p.bf=[];G.p.mana=20;G.e.bf=G.e.bf.filter(x=>!isC(x))`);
const put=(id,s='p')=>R(`(()=>{const c=mk('${id}');G.${s}.hand.push(c);return c.u})()`);
const castId=(id,t)=>R(`(()=>{const c=G.p.hand.find(x=>x.id=='${id}');cast(c${t?','+t:''});return 1})()`);

// Divine Intervention
setup('ody');put('dint');castId('dint');R(`G.p.life=2;G.p.life-=6;chk()`);
ok('Divine Intervention: life becomes 5',R('G.p.life')==5&&R('G.phase')!=='lost');
ok('Divine Intervention: destroyed after use',!R(`G.p.bf.some(x=>x.id=='dint')`));
R(`G.p.life=-1;chk()`);ok('Divine Intervention: only once',R('G.phase')=='lost');

// Bodvar: +3/+3 while Wounded
setup('odin');put('bodvar');castId('bodvar');const b=R(`G.p.bf.find(x=>x.id=='bodvar')`);
const p0=R(`pwr(G.p.bf.find(x=>x.id=='bodvar'))`),h0=R(`th(G.p.bf.find(x=>x.id=='bodvar'))`);R('G.p.life=8');
ok('Bodvar: +3/+3 while Wounded',R(`pwr(G.p.bf.find(x=>x.id=='bodvar'))`)==p0+3&&R(`th(G.p.bf.find(x=>x.id=='bodvar'))`)==h0+3);

// Myrmidon Shield-Bearer and Close Ranks
setup('ody');put('hopl');castId('hopl');put('myrsh');castId('myrsh');
const hp=R(`th(G.p.bf.find(x=>x.id=='hopl'))`);ok('Myrmidon: other Phalanx +0/+2',R(`G.p.bf.find(x=>x.id=='hopl').pd`)==2);
ok('Myrmidon: not itself',R(`G.p.bf.find(x=>x.id=='myrsh').pd`)==0);
put('closer');castId('closer');ok('Close Ranks: Phalanx to defense form, +1/+1',R(`G.p.bf.filter(x=>has(x,'p')).every(x=>x.def&&x.pa>=1)`));

// Freyja returns the two most expensive army members
setup('odin');R(`G.p.gy=[mk('thegn'),mk('sigur'),mk('bald'),mk('hird')]`);put('freyja');castId('freyja');
ok('Freyja: two priciest return to hand',R(`G.p.hand.map(x=>x.id).sort().join(',')`)=='bald,sigur'&&R('G.p.gy.length')==2);

// Bragi draws per Rune and reduces Carve
setup('odin');R(`['alg','ruru'].forEach(id=>{const c=mk(id);G.p.bf.push(c)})`);const d0=R('G.p.deck.length');put('bragi');castId('bragi');
ok('Bragi: draws 2 for 2 Runes',R('d0=G.p.deck.length')==d0-2||R('G.p.hand.length')==2);
ok('Bragi: Carve cost reduced',R(`lcost(mk('othala'))`)==1);

// Othala: draw and +1 life at upkeep
setup('odin');R(`G.p.bf.push(mk('othala'));G.p.life=10`);const hd0=R('G.p.hand.length');R('upkeep(G.p,G.e)');
ok('Othala: draws a card and gains 1 life',R('G.p.hand.length')==hd0+1&&R('G.p.life')==11);

// Valhalla Initiate death trigger
setup('odin');R(`G.e.bf.push(mk('pup'))`);put('vinit');castId('vinit');R(`(()=>{const c=G.p.bf.find(x=>x.id=='vinit');c.dmg=99;sweep()})()`);
ok('Valhalla Initiate: 2 damage on death',R(`cr(G.e).some(x=>x.dmg>=2)||!cr(G.e).length`));

// Trojan Horse: three Soldiers
setup('ody');put('horse');castId('horse');R('startP()');R('startP()');
ok('Trojan Horse: three Soldiers',R(`G.p.bf.filter(x=>x.id=='sold').length`)==3);

console.log(f?'FAILS '+f:'ALL OK');
