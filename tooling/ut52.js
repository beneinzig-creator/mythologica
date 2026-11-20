// v110: Odin's Blood price rises by 1 per use each fight and stops at 5
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
R("tutStart(TUT.findIndex(L=>L.id=='odin1'));delete G.tut;G.p.life=60;G.p.max=60");
const paid=[];for(let i=0;i<7;i++){R("G.p.life=40;G.p.bp=0;bt('bp')");paid.push(40-R('G.p.life'))}
ok('price goes 2, 3, 4, 5 and stays at 5: '+paid.join(','),paid.join()=='2,3,4,5,5,5,5');
R("G.p.life=40");R("bt('bp')");ok('still once per turn',R('G.p.bp')==1&&R('G.p.life')==40);
R("G.p.life=5;G.p.bp=0");const m=R('G.p.mana');R("bt('bp')");ok('cannot pay with 5 life left',R('G.p.life')==5&&R('G.p.mana')==m);
// v110 cards
const fresh=()=>R("tutStart(TUT.findIndex(L=>L.id=='odin1'));delete G.tut;G.p.bf=[];G.e.bpn=0;G.p.fl=0;G.p.max=60");
const pay=()=>{R("G.p.life=40");R("bt('bp')");return 40-R('G.p.life')};
fresh();R("G.p.bf.push(mk('blot'))");ok('Blót Bowl: first price 1',pay()==1);R("G.e.bpn=10;G.p.bp=0");ok('Blót Bowl: capped price 4',pay()==4);
fresh();R("G.p.bf.push(mk('hgod'))");pay();const p2=pay();ok('The Hanged God: two payments a turn',p2==3&&R('G.p.bp')==2);R("bt('bp')");ok('…but not three',R('G.p.bp')==2);
fresh();R("enter(G.p,mk('bdrunk'))");pay();ok('Blood-Drunk Berserker grows +1/+1',R("pw(G.p.bf.find(x=>x.id=='bdrunk'))")==3);
fresh();R("G.p.bf.push(mk('tithe'));G.p.max=60");R("G.p.life=40");R("bt('bp')");ok('Tithe: 1 back with few dead',40-R('G.p.life')==1);
fresh();R("G.p.bf.push(mk('tithe'),mk('hgod'));G.p.max=60;G.p.fl=3");R("G.p.life=40");R("bt('bp')");ok('Tithe: 2 back with 3 dead',40-R('G.p.life')==0);R("G.p.life=40");R("bt('bp')");ok('Tithe: only once per turn',40-R('G.p.life')==3);
fresh();R("G.e.bpn=3;G.p.hand=[mk('kvas')];G.p.mana=2");R("hd0('h:'+G.p.hand[0].u)");ok('Mead of Kvasir resets the price to 2',R('bpc()')==2&&R('G.p.hand.length')==1);
fresh();R("enter(G.p,mk('hird'));G.p.hand=[mk('hoff')];G.p.mana=2");R("hd0('h:'+G.p.hand[0].u)");ok('Offering: +1/+0 without Blood price',R("pw(G.p.bf.find(x=>x.id=='hird'))")==3);
fresh();R("enter(G.p,mk('hird'));G.p.hand=[mk('hoff')];G.p.mana=2;G.p.bp=1");R("hd0('h:'+G.p.hand[0].u)");ok('Offering: +2/+0 after Blood price',R("pw(G.p.bf.find(x=>x.id=='hird'))")==4);
ok('Odin pool keeps the 26/24/18/12 shape',R("(()=>{const c={C:0,U:0,R:0,L:0};CHARS.odin.pool.forEach(x=>c[RAR[x]]++);return c.C+'/'+c.U+'/'+c.R+'/'+c.L})()")=='26/24/18/12');
ok('new cards are in the pool, cut cards are not',R("['blot','hgod','bdrunk','hoff','tithe','kvas'].every(x=>CHARS.odin.pool.includes(x))&&!['gash','skar','scav','gald','norn','mead'].some(x=>CHARS.odin.pool.includes(x))"));
console.log(f?'FAILS '+f:'ALL OK');
