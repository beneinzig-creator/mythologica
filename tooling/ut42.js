const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=(ch,i)=>R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=${i};G.fi=0;fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[]`);
for(const [ch,names] of [['ody','lhz canto mouth hdead blackship hitr'],['odin','pgrow rwall ffire bland corp ltax']]){names.split(' ').forEach((t,i)=>{
 setup(ch,i);
 ok(ch+' '+t+' in enemy hand, not on field, hand=4',R(`G.e.hand.some(c=>c.id=='${t}')&&!G.e.bf.some(c=>c.id=='${t}')&&G.e.hand.length==4`));
 ok(ch+' '+t+' not duplicated in deck',R(`G.e.deck.every(c=>c.id!='${t}')`));
});}
// Lotus Haze
setup('ody',0);R(`G.e.bf.push(mk('lhz'));var a=mk('hird'),b=mk('hird');enter(G.p,a);enter(G.p,b)`);
ok('lotus haze: first enters tapped, second not',R('a.tap==1&&b.tap==0'));
R(`G.turn++;var c=mk('hird');enter(G.p,c)`);ok('next turn first tapped again',R('c.tap==1'));
// Loki toll
setup('odin',5);R(`G.e.bf.push(mk('ltax'));var sp=mk('hurl');G.p.hand=[sp,mk('hurl')];`);
ok('first spell costs +1',R(`cost(G.p.hand[0])==D.hurl[1]+1`));
R(`G.p.hand=[];`);
// The blood pit
setup('ody',3);R(`G.e.bf.push(mk('hdead'));G.e.blood=0;var x=mk('hird');enter(G.p,x);x.dmg=9;sweep();`);
ok('blood pit: a death fills a drop',R('G.e.blood')==1);
R(`var shd=mk('mourner');enter(G.e,shd)`);ok('a Shade drinks and speaks (+1/+1, unblockable Mourner)',R('G.e.blood')==0&&R('shd.spoke==1&&shd.ub==1&&pwr(shd)==4'));
// Naglfar
setup('odin',4);R(`G.e.bf.push(mk('corp'));G.e.nails=7;var z=mk('draug');enter(G.e,z);var zz=mk('hgrd');enter(G.e,zz);z.dmg=9;sweep()`);
ok('Naglfar sails at 8 of their own dead',R('G.e.sailed')==1&&R("pwr(G.e.bf.find(x=>x.id=='hgrd'))")==4);
// Scorched
setup('odin',3);R(`G.e.bf.push(mk('bland'));var L0=G.p.life;upkeep(G.p,G.e)`);ok('scorched earth -1',R('G.p.life')==R('L0')-1);
// Pack grows
setup('odin',0);R(`G.e.bf.push(mk('pgrow'));var w1=mk('pup'),w2=mk('fenr');G.e.bf.push(w1,w2);upkeep(G.e,G.p)`);ok('pack grows weakest',R('w1.pa==1&&w1.pd==1'));
// Forge fire
setup('odin',2);R(`G.e.bf.push(mk('ffire'));var d1=mk('dmin');G.e.bf.push(d1);ffGrow(G.e,mk('anvl'));ffGrow(G.e,mk('dmin'))`);ok('forge fire +1/+1 on item only',R('d1.pa==1&&d1.pd==1'));
// Rimewall
setup('odin',1);R(`G.e.bf.push(mk('rwall'));var g=mk('hgnt');G.e.bf.push(g);var z3=mk('hird');var n0=dAdj(g,3,z3)`);ok('rimewall -1 vs giants',R('n0')==-1);
// Dawn counterattack
setup('ody',5);R(`G.e.bf.push(mk('hitr'));G.e.dawn=0;var m=mk('mraid');enter(G.e,m);G.turn=4;egUp(G.e,G.p)`);ok('no counterattack before dawn',!R('G.e.dawn'));
R(`G.turn=5;egUp(G.e,G.p)`);ok('dawn: two Raiders join and the army surges',R('G.e.dawn')==1&&R("G.e.bf.filter(x=>x.id=='mraid').length")>=3&&R("m.pa>=1&&m.f.includes('h')"));
console.log(f?'FAILS '+f:'ALL OK');process.exit(f?1:0);
