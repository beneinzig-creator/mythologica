// ut58: patch_overheal. Your healing can go above your maximum life; opponents' healing stays capped;
// Odin's half-life heals (hcap) keep their own rule.
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const store={};const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]||null,get length(){return Object.keys(store).length}};
const el=()=>({style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){}},appendChild(){},querySelector:()=>null,querySelectorAll:()=>[],dataset:{},set innerHTML(v){this._h=v},get innerHTML(){return this._h||''}});
const app=el();
const ctx=vm.createContext({window:{},console,localStorage,setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:()=>{},
 MutationObserver:function(){this.observe=()=>{}},
 document:{getElementById:id=>id=='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:el,body:el(),head:el(),documentElement:el()}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0,n=0;const ok=(m,c)=>{n++;console.log(c?'ok  ':'FAIL',m);if(!c)f++};
R(`G={p:{life:20,max:20,ovr:0},e:{life:30,max:30,ovr:0}}`);
ok('no cap for you',R(`healCapX(G.p)`)===Infinity);
ok('opponent capped at its maximum',R(`healCapX(G.e)`)===30);
R(`fGain(G.p,5)`);ok('fGain takes you from 20 to 25',R(`G.p.life`)===25);
R(`fGain(G.e,5)`);ok('fGain leaves a full opponent at 30',R(`G.e.life`)===30);
R(`G.p.life=8`);ok("Odin's half-life heal still stops at half (10)",R(`hcap(G.p,5)`)===2);
ok('no heal clamp to max left for you in the code',!/Math\.min\((?:G\.)?p\.max,/.test(src));
ok('Rest / Heal buttons no longer disabled at full life',!/\|\|p\.life>=p\.max/.test(src));
console.log(f?'FAILED '+f:'ALL OK ('+n+' checks)');
