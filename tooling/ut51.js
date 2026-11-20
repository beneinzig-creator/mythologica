// v109: anti-stall clock
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const store={};const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
// a normal fight: start a lesson fight, then drop the lesson flag
const fightAt=(t,pl,el)=>{R(`tutStart(0);delete G.tut;G.turn=${t-1};G.p.life=${pl};G.e.life=${el};G.e.max=20`);R('startP()')};
fightAt(19,20,20);ok('no loss before turn 20',R('G.turn')==19&&R('G.p.life')==20&&R('G.e.life')==20);
ok('badge counts down from turn 15',/in 1 turn</.test(R('clkBadge()')));
R("G.turn=14");ok('no badge before turn 15',R('clkBadge()')=='');
fightAt(20,20,20);ok('turn 20: both lose 1',R('G.p.life')==19&&R('G.e.life')==19);
fightAt(21,20,20);ok('turn 21: both lose 2',R('G.p.life')==18&&R('G.e.life')==18);
ok('message names the clock',/both sides lose 2 life/.test(R('G.msg')));
fightAt(23,4,4);ok('tie goes to the player',R('G.phase')=='kleos');
fightAt(23,4,9);ok('player falls when only they reach 0',R('G.phase')=='lost');
fightAt(22,9,3);ok('enemy falls when only they reach 0',R('G.phase')=='kleos');
fightAt(20,20,20);R("G.ch='odin'");ok('Odin flavour',/Ragnar/.test(R('CLKN()')));
R("tutStart(0);G.turn=24;G.p.life=20;G.e.life=20;startP()");ok('lessons have no clock',R('G.p.life')==20&&R('clkBadge()')=='');
console.log(f?'FAILS '+f:'ALL OK');
