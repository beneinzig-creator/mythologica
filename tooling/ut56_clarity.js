const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=(ch,i)=>R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=${i};G.fi=0;fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[]`);
// v-clarity: nothing hidden. Statuses wear off as written; strong rules live on killable cards; counters show on trumps.
setup('wukong',5);R(`G.e.bf=[mk('ywind')];var bl=mk('spear');enter(G.p,bl);enter(G.e,mk('ygen'))`);ok('Yellow Wind Monster blinds your army',R('bl.blind')==1);
R(`thEnd(G.p)`);ok('blindness wears off at the end of your next turn',!R('bl.blind'));
R(`G.e.bf=[mk('ywind')];egUp(G.e,G.p)`);ok('the Yellow Wind trump no longer blinds by itself',!R('G.p.bf.some(x=>x.blind)'));
setup('ody',2);R(`G.e.bf=[mk('mouth')];var py=mk('poly');enter(G.e,py);py.tap=0;var at=mk('hopl');enter(G.p,at);at.sick=0;G.e.life=15;G.cmb=launch(G.p,[at],{});resolve();G.cmb=null`);ok('Polyphemus untapped: the boulder holds',R('G.e.life')==15);
R(`py.tap=1;at.tap=0;G.cmb=launch(G.p,[at],{});resolve();G.cmb=null`);ok('Polyphemus out of the cave: your blows land',R('G.e.life')<15);
setup('odin',1);R(`G.e.bf=[mk('rwall')];var ww=mk('hopl');enter(G.p,ww);var pw0=pwr(ww)`);ok('no Rime-Witch: no winter weakness',R('pwr(ww)')==R('pw0'));
R(`enter(G.e,mk('rimew'));enter(G.e,mk('rimew'))`);ok('Rime-Witches: -1/-0 (not stacking)',R('pwr(ww)')==R('pw0')-1);
R(`G.e.winter=2`);ok('the winter counter shows on the trump',/Winter: 2 of 3/.test(R("DYN.rwall(G.e.bf.find(x=>x.id=='rwall'))")));
R(`var cl=mk('spear');cl.callT=G.turn+1;cl.burn=1`);ok('Called and Burning are written on the card',/Called by name/.test(R("kwTx2(cl,'')"))&&/Burning/.test(R("kwTx2(cl,'')")));
R(`var tk=mk('spear');tk.blind=1;tk.burn=1;tk.cursed=1`);ok('status tokens drawn on the card',/stk-blind/.test(R("card(tk,'p')"))&&/stk-burn/.test(R("card(tk,'p')"))&&/stk-curse/.test(R("card(tk,'p')")));
console.log(f?('FAILS '+f):'ALL OK');
