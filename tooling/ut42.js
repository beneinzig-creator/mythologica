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
// Hungry dead
setup('ody',3);R(`G.e.bf.push(mk('hdead'));var x=mk('hird');x.dmg=9;G.p.bf=[x];sweep();`);
ok('hungry dead counts a death',R('G.e.hd')==1);
R(`for(let i=0;i<4;i++){var y=mk('hird');y.dmg=9;G.p.bf.push(y)}sweep()`);ok('capped at 2',R('G.e.hd')==2);
// Corpse cold
setup('odin',4);R(`G.e.bf.push(mk('corp'));var z=mk('hird');z.d=6;z.dmg=1;var z2=mk('hird');z2.d=6;G.p.bf=[z,z2];upkeep(G.p,G.e)`);
ok('corpse cold +1 dmg on damaged only',R('z.dmg==2&&z2.dmg==0'));
// Scorched
setup('odin',3);R(`G.e.bf.push(mk('bland'));var L0=G.p.life;upkeep(G.p,G.e)`);ok('scorched earth -1',R('G.p.life')==R('L0')-1);
// Pack grows
setup('odin',0);R(`G.e.bf.push(mk('pgrow'));var w1=mk('pup'),w2=mk('fenr');G.e.bf.push(w1,w2);upkeep(G.e,G.p)`);ok('pack grows weakest',R('w1.pa==1&&w1.pd==1&&w2.pa==0'));
// Forge fire
setup('odin',2);R(`G.e.bf.push(mk('ffire'));var d1=mk('dmin');G.e.bf.push(d1);ffGrow(G.e,mk('anvl'));ffGrow(G.e,mk('dmin'))`);ok('forge fire +1/+1 on item only',R('d1.pa==1&&d1.pd==1'));
// Rimewall
setup('odin',1);R(`G.e.bf.push(mk('rwall'));var g=mk('hgnt');G.e.bf.push(g);var z3=mk('hird');var n0=dAdj(g,3,z3)`);ok('rimewall -1 vs giants',R('n0')==-1);
// Hit and run
setup('ody',5);R(`G.e.bf.push(mk('hitr'));var m=mk('mraid');m.sick=0;G.e.bf.push(m);G.cmb=launch(G.e,[m],{});G.cmb.side='e';resolve()`);
ok('hit and run bounces unblocked marauder',R(`G.e.hand.some(c=>c.id=='mraid')&&!G.e.bf.includes(m)`));
process.exit(f?1:0);
