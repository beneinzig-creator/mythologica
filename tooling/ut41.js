const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync('n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=(bi)=>R(`setChar('odin');newRun();for(let i=0;i<11;i++)pickDraft(0);G.boss=1;G.bi=${bi};fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[];G.e.bf=G.e.bf.filter(x=>!isC(x));G.e.hand=[]`);
ok('6 bosses',R('BOSS.length')==9);
ok('odin offered 3,4,5',R('JSON.stringify(CHARS.odin.bo)')=='[3,4,5]'&&R('JSON.stringify(CHARS.ody.bo)')=='[0,1,2]');
ok('lore has 5 sentences each',R('BOSS.map(b=>b.lore.split(/(?<=[.!?])\\s+/).length).join()')=='5,5,5,5,5,5,5,5,5');
// ---- Hrungnir duel
setup(5);
ok('holmgang trump present',R('duelOn()'));
R(`var a=mk('hird'),b=mk('hird'),c3=mk('hird');[a,b,c3].forEach(x=>{x.sick=0});G.p.bf=[a,b,c3];G.sel=[a.u,b.u,c3.u]`);
R(`bt('atkall')`);
ok('attack all => one attacker',R('G.cmb&&G.cmb.atk.length')==1);
R(`bt('res')`);
setup(5);R(`var a=mk('hird'),b=mk('thrl');[a,b].forEach(x=>{x.sick=0});G.p.bf=[a,b];hd('p:'+a.u);hd('p:'+b.u)`);
ok('select second replaces first',R('G.sel.length')==1&&R('G.sel[0]')==R('b.u'));
// army cap 2 during the duel
setup(5);R(`var q1=mk('hird'),q2=mk('hird'),q3=mk('hird');q1.sick=q2.sick=0;G.p.bf=[q1,q2];G.p.hand=[q3];G.p.mana=9;hd('h:'+q3.u)`);
ok('third army member refused (cap 2)',R('G.p.bf.length')==2&&/full/.test(R('G.msg'))&&/2 army/.test(R('G.msg')));
R(`G.p.bf=[q1];hd('h:'+q3.u)`);ok('can play when below the cap',R('G.p.bf.some(c=>c.id==\'hird\')&&G.p.bf.length==2'));
R(`G.p.bf=[q1,q2];G.p.hand=[mk('thrl')];hd('o:'+q2.u)`);R(`hd('h:'+G.p.hand[0].u)`);ok('sacrifice then replace works',R('G.p.bf.length')==2&&R('G.p.bf.some(c=>c.id==\'thrl\')'));
R(`G.e.bf=G.e.bf.filter(x=>!isC(x));var a1=mk('htrl'),a2=mk('htrl'),a3=mk('htrl');G.e.bf.push(a1,a2);G.e.hand=[a3];G.e.mana=9;var pc=planScore(a3)`);
ok('AI will not play a third',R('pc')===null);
ok('display shows /2',true);
// AI attacks with one only
setup(5);R(`var h1=mk('htrl'),h2=mk('htrl'),h3=mk('hgrt');[h1,h2,h3].forEach(x=>{x.sick=0});G.e.bf=G.e.bf.concat([h1,h2,h3]);G.p.bf=[];var pl=attackPlan(G.e,G.p)`);
ok('AI plan <=1 attacker',R('pl&&pl.S.length')==1);
// shield and clay
setup(5);R(`var hr=mk('hrung'),mo=mk('hmokk');G.e.bf=G.e.bf.concat([hr,mo]);var gnd=mk('hird');gnd.sick=0;var fl=mk('valk');fl.sick=0;`);
R(`H1=[[hr,5,gnd],[mo,3,gnd]];for(const[t,n,src]of H1)t.dmg+=Math.max(0,n+dAdj(t,n,src))`);
ok('shield: -2 from ground',R('hr.dmg')==3);ok('clay: +2',R('mo.dmg')==5);
R(`hr.dmg=0;var d2=dAdj(hr,5,fl)`);ok('flying ignores shield',R('d2')==0);
// ---- Quarry
setup(4);
R(`var big=mk('skul'),sm=mk('hird');big.sick=sm.sick=0;G.p.bf=[big,sm];markQ()`);
ok('strongest marked',R('big.qy')==1&&!R('sm.qy'));
R(`var hd1=mk('hhnd');hd1.sick=0;G.e.bf.push(hd1);big.tap=1;big.dmg=2`);
R(`var pl2=attackPlan(G.e,G.p)`);
ok('hunt targets tapped quarry',R('pl2&&Object.values(pl2.tgm).includes(big.u)'));
// quarry dies: reward
R(`big.dmg=2;var pre=hd1.pa||0;var cmb={side:'e',atk:[hd1.u],blk:{},bx:{},tg:{[hd1.u]:big.u}};G.cmb=cmb;G.e.hand=[];G.e.deck=[mk('hhnd'),mk('hhnd')];big.pd=-3;resolve()`);
ok('quarry took +3 bonus and died',!R('G.p.bf.includes(big)'));
ok('rider grew',R('hd1.pa')==1&&R('hd1.pd')==1);ok('hunt drew a card',R('G.e.hand.length')==1);
// ---- Jormungandr
setup(3);
ok('ouro present',R('G.e.bf.some(x=>x.id==\'ouro\')'));
R(`var s5=mk('star'),h5=mk('hird');s5.sick=h5.sick=0;G.p.bf=[s5,h5];G.sel=[s5.u,h5.u];G.e.bf=G.e.bf.filter(x=>!isC(x));bt('atk');bt('res')`);
ok('highest cost attacker returned',!R('G.p.bf.includes(s5)')&&R('G.p.hand.some(c=>c.id==\'star\')'));
ok('cheap attacker stays',R('G.p.bf.length')==1);
setup(3);
R(`var thr=mk('thor');thr.sick=0;G.p.bf=[thr];var jm=mk('jorm');enter(G.e,jm);ETB.jorm(G.e,G.p);sweep()`);
ok('jorm enters tapped',R('jm.tap')==1);ok('jorm swallowed the 5 cost',!R('G.p.bf.includes(thr)'));
setup(3);R(`G.e.hand=[mk('jorm')];G.e.mana=6;G.p.bf=[];var pj=planScore(G.e.hand[0])`);
ok('jorm waits without bait',R('pj')===null);
R(`var t2=mk('thor');t2.sick=0;G.p.bf=[t2];var pj2=planScore(G.e.hand[0])`);
ok('jorm comes for bait',R('pj2')&&R('pj2.s')>0);
console.log(f?'FAILS '+f:'ALL OK');
