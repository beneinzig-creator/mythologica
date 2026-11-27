// ut59: patch_undocombat. Undo works for actions taken during combat (offering while blocking or before damage),
// keeps the combat as it was, and is only offered in the step it was recorded in.
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
const store={};const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>null,length:0};
const el=()=>({style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return false}},appendChild(){},querySelector:()=>null,querySelectorAll:()=>[],dataset:{},set innerHTML(v){this._h=v},get innerHTML(){return this._h||''}});
const app=el();
const ctx=vm.createContext({window:{},console,localStorage,setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:()=>{},MutationObserver:function(){this.observe=()=>{}},
 document:{getElementById:id=>id=='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:el,body:el(),head:el(),documentElement:el()}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0,n=0;const ok=(m,c)=>{n++;console.log(c?'ok  ':'FAIL',m);if(!c)f++};
const fresh=()=>R("tutStart(TUT.findIndex(L=>L.id=='odin1'));delete G.tut;G.p.bf=[];G.e.bf=[];UND=null;G.phase='main';G.cmb=0;G.pend=0");
// main phase still works
fresh();R("enter(G.p,mk('hird'));G.p.mana=0");R("hd('o:'+G.p.bf[0].u)");
ok('main: offer can be undone',R('uValid()'));R('doUndo()');ok('main: the army member is back, mana restored',R('G.p.bf.length')==1&&R('G.p.mana')==0);
// blocking: the opponent attacks you
fresh();R("enter(G.p,mk('hird'));enter(G.p,mk('fjrd'));enter(G.e,mk('hird'));G.e.bf.forEach(c=>c.sick=0);G.cmb=launch(G.e,[G.e.bf[0]],{});G.phase='blockP';G.blk=0;G.p.mana=0");
const atk=R('G.cmb.atk[0]');
R("hd('o:'+G.p.bf[0].u)");
ok('blocking: offer happened',R('G.p.bf.length')==1&&R('G.p.mana')>0);
ok('blocking: undo is available',R('uValid()'));
R('doUndo()');
ok('blocking: both army members are back and mana restored',R('G.p.bf.length')==2&&R('G.p.mana')==0);
ok('blocking: still in the blocking step with the same attacker',R('G.phase')=='blockP'&&R('G.cmb&&G.cmb.atk[0]')==atk);
// before damage: you attack
fresh();R("enter(G.p,mk('hird'));enter(G.p,mk('fjrd'));G.p.bf.forEach(c=>c.sick=0);G.cmb=launch(G.p,[G.p.bf[0]],{});G.phase='dmgP';G.p.mana=0");
R("hd('o:'+G.p.bf[1].u)");
ok('before damage: offer can be undone',R('uValid()'));R('doUndo()');
ok('before damage: army member back, combat kept',R('G.p.bf.length')==2&&R('G.phase')=='dmgP'&&R('G.cmb.atk.length')==1);
// only in the step it was recorded
fresh();R("enter(G.p,mk('hird'));enter(G.p,mk('fjrd'));G.p.bf.forEach(c=>c.sick=0);G.cmb=launch(G.p,[G.p.bf[0]],{});G.phase='dmgP';G.p.mana=0");
R("hd('o:'+G.p.bf[1].u)");R("G.cmb=0;G.phase='main'");
ok('after combat resolves, a combat undo is no longer offered',!R('uValid()'));
// never with a pending choice
fresh();R("enter(G.p,mk('hird'));G.pend='slinger'");ok('no undo recording while a choice is pending',!R('uOK()'));
console.log(f?'FAILED '+f:'ALL OK ('+n+' checks)');
