// v111: Act III, the War in Heaven: flow, opening trumps, elites, generals' phases and the Beast
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const store={};const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e.replace(/\bconst /g,"var "),ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const A3=()=>R("setChar('ody');newRun();G.p.recs=[...'spear,spear,sailor,sailor,peltast,peltast,hopl,hopl,thess,thess,ox,ox,camp,argus,charon'.split(',')].map(id=>({id,a:0,d:0,c:0,s:0,k:0,fl:0}));G.a2='odin';A2R='odin';G.p.life=10;startAct3()");
const reg=(name)=>R(`(()=>{const i=A3.en.findIndex(x=>x.n==${JSON.stringify(name)});G.rt[G.fi]=i;G.elt=0;G.boss=0;fight();G.e.bf.push(mk(A3.en[i].mt));return i})()`);
const elite=(name)=>R(`(()=>{const k=ELITES.findIndex(x=>x.n==${JSON.stringify(name)});G.elt=k+1;G.boss=0;fight();G.e.bf.push(mk(ELITES[k].mt));return k})()`);
const boss=(k)=>R(`G.boss=1;G.bi=A3.bo[${k}];G.elt=0;fight()`);
// --- flow ---
A3();ok('startAct3: Act III flag, 10 regular decks, life healed by 10',R('G.a3')==1&&R('EN.length')==10&&R('G.p.life')==20&&R('G.phase')=='map');
ok('the Act III map has 2 elites from the Act III pool',R('G.web.nodes.filter(n=>n.el).length')==2&&R('G.web.nodes.filter(n=>n.el).every(n=>A3.el.includes(n.el-1))'));
ok('Act III fights use the Act III ramp (SCL 8+)',R('SCL.length')>=12&&R("(()=>{G.fi=0;G.rt[0]=0;G.elt=0;G.boss=0;fight();return G.e.max})()")==R('A3.en[0].l+SCL[8][0]+A3H.ody[0]'));
R('G.fi=4;otgOffer()');ok('the altar offers 2 of the 3 generals',R('G.phase')=='bossp'&&R('G.bs.length')==2&&R('G.bs.every(i=>A3.bo.includes(i))'));
// --- regular decks ---
A3();reg('Legion');R("enter(G.e,mk('xlgn'))");ok('Legion: a 1-cost Legionnaire comes alone',R("G.e.bf.filter(x=>x.id=='xpos').length")==0);R("enter(G.e,mk('xger'))");ok('Legion: a Possessed joins a Gerasene Demon',R("G.e.bf.filter(x=>x.id=='xpos').length")==1);
R("enter(G.e,mk('xpos'))");ok('Legion: Possessed bring no one',R("G.e.bf.filter(x=>x.id=='xpos').length")==2);
R("G.e.bf=G.e.bf.filter(x=>!isC(x));enter(G.e,mk('xger'))");ok('Legion: only army members costing 2+ bring a Possessed',R("G.e.bf.filter(x=>x.id=='xpos').length")==1);
A3();reg('The Watchers');R("G.e.wd=0;G.p.mana=9");const h0=R('G.e.hand.length');for(let i=0;i<3;i++)R("cast(mk('spearc'),G.e.bf.find(x=>isC(x))||G.e)");ok('Watchers: they draw for your spells, at most 2 a turn',R('G.e.hand.length')-h0==2);
A3();reg('The Nephilim');R("ETB.xneph(G.e,G.p)");ok('Nephilim: their army members costing 3+ cost 1 less, the small ones do not',R("G.e.deck.filter(c=>isC(c)&&D[c.id][1]>=3).every(c=>c.disc>=1)&&G.e.deck.filter(c=>isC(c)&&D[c.id][1]<3).every(c=>!c.disc)"));
A3();reg('The Cult of Moloch');R("enter(G.e,mk('xcult'));enter(G.e,mk('xfire'))");const p0=R("pwr(G.e.bf.find(x=>x.id=='xcult'))");R("const v=G.e.bf.find(x=>x.id=='xfire');v.dmg=9;sweep()");ok('Moloch: a death makes the others stronger',R("pwr(G.e.bf.find(x=>x.id=='xcult'))")==p0+1);
A3();reg('The Builders of Babel');R("G.p.hand=[mk('spear'),mk('hopl'),mk('charon')]");const c0=R("G.p.hand.map(cost).sort().join()");R('a3Up(G.e,G.p)');ok('Babel: hand costs are shuffled, not changed',R("G.p.hand.map(cost).sort().join()")==c0);
A3();reg("Mastema's Spirits");R("const a=mk('hopl');enter(G.p,a);a.att=1;const b=mk('spear');enter(G.p,b)");R('a3Up(G.e,G.p)');ok('Mastema: only the attacker takes 1 damage',R("G.p.bf.find(x=>x.id=='hopl').dmg")==1&&R("G.p.bf.find(x=>x.id=='spear').dmg")==0);
A3();reg("Mammon's Hoard");R("enter(G.e,mk('xhoard'));G.p.mana=2;thEnd(G.p);a3Up(G.e,G.p)");ok('Mammon: 2 unspent mana = +2/+0 next turn',R("G.e.bf.find(x=>x.id=='xhoard').ta")==2);
A3();reg("King Paimon's Procession");R("enter(G.e,mk('xlegs'))");const pp=R("pwr(G.e.bf.find(x=>x.id=='xlegs'))");R("enter(G.e,mk('xher'))");ok('Paimon: a Herald gives his army +1/+0',R("pwr(G.e.bf.find(x=>x.id=='xlegs'))")==pp+1);
A3();reg('The Pairikas');R("enter(G.p,mk('hopl'));G.p.bf.forEach(c=>c.tap=0);a3Up(G.e,G.p)");ok('Pairikas: one of your army members is tapped',R("G.p.bf.find(x=>x.id=='hopl').tap")==1);
A3();reg('Sons of Darkness');R("enter(G.e,mk('xline'));G.turn=3;a3Up(G.e,G.p)");ok('Sons of Darkness: +2/+0 on every third turn',R("G.e.bf.find(x=>x.id=='xline').ta")==2);
// --- elites ---
A3();elite('Beelzebub, Lord of the Flies');R("const c=mk('xbaal');enter(G.e,c);c.dmg=9;sweep()");ok('Beelzebub: a Fly takes the place of the fallen',R("G.e.bf.filter(x=>x.id=='xfly').length")==1);
A3();elite('Asmodeus');R("G.p.asm=0;enter(G.p,mk('hopl'));enter(G.p,mk('spear'))");ok('Asmodeus: only the first army member each turn takes 2',R("G.p.bf.find(x=>x.id=='hopl').dmg")==2&&R("G.p.bf.find(x=>x.id=='spear').dmg")==0);
A3();elite('Lilith');R("G.e.life=5;const c=mk('spear');enter(G.p,c);c.dmg=9;sweep()");ok('Lilith: she gains 2 when your army member dies',R('G.e.life')==7);
A3();elite('Azazel, the Scapegoat');R("const a=mk('hopl');enter(G.p,a);const c=mk('xsmith');enter(G.e,c);c.dmg=9;sweep()");ok('Azazel: his losses fall on your strongest',R("G.p.bf.find(x=>x.id=='hopl').dmg")==2);
// --- generals ---
A3();boss(0);ok('Lucifer starts with the Bargain',R("G.e.bf.some(x=>x.id=='xbarg')"));R("G.phase='main';G.p.mana=2;G.p.barg=0");R("bt('a3barg')");ok('Bargain: +1 mana and Lucifer gains a Fallen Angel',R('G.p.mana')==3&&R("G.e.bf.filter(x=>x.id=='xfang'&&x.barg).length")==1);
R("bt('a3barg')");ok('Bargain: once per turn',R('G.p.mana')==3);
R("G.e.life=Math.floor(G.e.max/2);chk()");ok('Lucifer phase 2: the Red Dragon at half life',R('G.ph2')==1&&R("G.e.bf.some(x=>x.id=='xdrag')")&&!R("G.e.bf.some(x=>x.id=='xbarg')")&&/Red Dragon/.test(R('G.e.nm')));
ok('…three Heads of the Dragon wait in his deck, the bargained angel grew',R("G.e.deck.filter(x=>x.id=='xdhead').length")==3&&R("pwr(G.e.bf.find(x=>x.barg))")>=3);
A3();boss(1);R("G.p.deck=[];a3Up(G.e,G.p);a3Up(G.e,G.p)");ok('Ahriman: the Druj shuffles a Lie into your deck each turn',R("G.p.deck.filter(x=>x.id=='xlie').length")==2);
R("G.e.bf=G.e.bf.filter(x=>!isC(x));G.e.life=Math.floor(G.e.max/2);chk()");ok('Ahriman phase 2: one Khrafstra per Lie you still hold',R("G.e.bf.filter(x=>x.id=='xkhr').length")==2&&R("G.e.bf.some(x=>x.id=='xassa')"));
R("const c=mk('spear');enter(G.p,c);c.dmg=9;sweep()");ok('…and one more for each of your dead',R("G.e.bf.filter(x=>x.id=='xkhr').length")==3);
A3();boss(2);R("enter(G.p,mk('hopl'));enter(G.p,mk('spear'))");ok('Abaddon phase 1: the smoke takes 1 power from army members with 3+ power only',R("pwr(G.p.bf.find(x=>x.id=='hopl'))")==R("D.hopl[3]")-1&&R("pwr(G.p.bf.find(x=>x.id=='spear'))")==R("D.spear[3]"));
R("G.e.bf=G.e.bf.filter(x=>!isC(x));G.turn=2;a3Up(G.e,G.p)");ok('…and a Locust rises every other turn',R("G.e.bf.filter(x=>x.id=='xloc').length")==1);
R("G.e.life=Math.floor(G.e.max/2);chk()");ok('Abaddon phase 2: the smoke clears, Locusts get +1/+1 and Venomous',R("pwr(G.p.bf.find(x=>x.id=='hopl'))")==R("D.hopl[3]")&&R("(()=>{const l=G.e.bf.find(x=>x.id=='xloc');return pwr(l)==2&&l.f.includes('v')})()"));
R("G.p.bf.find(x=>x.id=='hopl').dmg=1;a3Up(G.p,G.e)");ok('…and torment: damaged army members take 1 more',R("G.p.bf.find(x=>x.id=='hopl').dmg")==2);
// --- general victory, the other fronts, the Beast ---
A3();boss(0);R("G.e.life=0;chk()");ok('beating a general leads to the other fronts, not the end',R('G.phase')=='a3front'&&R('G.front')=='Michael');
R("bt('a3fin')");ok('then the Last Battle: the Beast with the False Prophet and a Head',R('G.fin')==1&&R('G.bi')==R('A3.fin')&&R("G.e.bf.some(x=>x.id=='xproph'&&!x.boss)")&&R("G.e.bf.some(x=>x.id=='xhb')"));
R("G.e.life=0;chk()");ok('the mortal wound heals while the Prophet lives',R('G.phase')=='main'&&R('G.rose')==1&&R('G.e.life')==R('Math.ceil(G.e.max/2)'));
R("G.e.life=0;chk()");ok('the second time, the Beast falls: the run is won',R('G.phase')=='victory');
A3();boss(0);R("G.e.life=0;chk();bt('a3fin')");R("G.e.bf=G.e.bf.filter(x=>x.id!='xproph');G.e.life=0;chk()");ok('with the Prophet dead, the Beast falls the first time',R('G.phase')=='victory');
// --- save ---
A3();R("G.phase='map';persist()");ok('Act III runs are saved',!!store.mythologica_run_v1);R("loadRun()");ok('loading an Act III run restores its enemies',R('G.a3')==1&&R('EN[0].n')=='Legion');
A3();boss(0);R("G.e.life=0;chk();bt('a3fin');G.e.bf=G.e.bf.filter(x=>x.id!='xproph');G.e.life=0;chk();persist()");ok('the final victory clears the save',!store.mythologica_run_v1);
// --- the Lie and the bot ---
A3();boss(1);R("G.phase='main';G.p.life=10;G.p.hand=[mk('xlie')];G.p.mana=0");R("hd0('h:'+G.p.hand[0].u)");ok('the Lie: casting it costs 1 life and clears it',R('G.p.life')==9&&R('G.p.hand.length')==0);
ok('every Act III deck card exists',R("[...A3.en,...A3.el.map(i=>ELITES[i]),...A3.bo.map(i=>BOSS[i]),BOSS[A3.fin]].every(x=>x.d.every(id=>D[id])&&(!x.mt||D[x.mt])&&(!x.trump||D[x.trump])&&(!x.trump2||D[x.trump2]))"));
console.log(f?'FAILS '+f:'ALL OK');
