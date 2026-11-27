// ut60: patch_anytype. A card that counts as any type satisfies "if the card you played just before this one was a
// Strike / Trick / Leap" (Counter-Strike, Slip Away), and the bonus doesn't leak past the next card or turn.
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
const store={};const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>null,length:0};
const el=()=>({style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return false}},appendChild(){},querySelector:()=>null,querySelectorAll:()=>[],dataset:{},set innerHTML(v){this._h=v},get innerHTML(){return this._h||''}});
const app=el();
const ctx=vm.createContext({window:{},console,localStorage,setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:()=>{},MutationObserver:function(){this.observe=()=>{}},
 document:{getElementById:id=>id=='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:el,body:el(),head:el(),documentElement:el()}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0,n=0;const ok=(m,c)=>{n++;console.log(c?'ok  ':'FAIL',m);if(!c)f++};
const fresh=()=>R("tutStart(TUT.findIndex(L=>L.id=='odin1'));delete G.tut;G.ch='wukong';CH='wukong';G.p.bf=[];G.e.bf=[];G.phase='main';G.cmb=0;G.pend=0;wkUp(G.p);G.p.mana=20;G.p.deck=Array.from({length:10},()=>mk('wmonk'))");
const play=(id,tgt)=>{R(`G.p.hand.push(mk('${id}'))`);const u=R('G.p.hand[G.p.hand.length-1].u');R(`hd0('h:${u}')`);if(tgt&&R('!!G.mode'))R(`hd0('${tgt}')`)};
const foe=()=>{R("G.e.bf=[mk('wgate')];G.e.bf[0].dmg=0");return 'e:'+R('G.e.bf[0].u')};
fresh();let t=foe();play('wskin');play('wcounter',t);ok('Shed a Skin, then Counter-Strike: 3 damage',R('G.e.bf[0]?G.e.bf[0].dmg:0')==3);
fresh();t=foe();play('wchamel');play('wcounter',t);ok('Chameleon Monkey, then Counter-Strike: 3 damage',R('G.e.bf[0]?G.e.bf[0].dmg:0')==3);
fresh();t=foe();play('wcounter',t);ok('Counter-Strike with nothing before: 1 damage',R('G.e.bf[0]?G.e.bf[0].dmg:0')==1);
fresh();R("G.p.mana=5");play('wskin');const m0=R('G.p.mana');play('wslip');ok('Shed a Skin, then Slip Away: +1 mana',R('G.p.mana')-m0==1);
fresh();t=foe();play('wskin');play('wcounter',t);R("G.e.bf=[mk('wgate')]");t='e:'+R('G.e.bf[0].u');play('wcounter',t);ok('bonus only for the very next card',R('G.e.bf[0]?G.e.bf[0].dmg:0')==1);
fresh();play('wskin');R('wkUp(G.p)');t=foe();play('wcounter',t);ok('bonus does not carry into the next turn',R('G.e.bf[0]?G.e.bf[0].dmg:0')==1);
fresh();play('wskin');ok('Momentum still counts Shed a Skin as one type',R('G.p.mo')==1&&Object.keys(R('G.p.tys')).length==1);
console.log(f?'FAILED '+f:'ALL OK ('+n+' checks)');
