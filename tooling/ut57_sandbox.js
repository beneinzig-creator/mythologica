// ut57: Sandbox mode (patch_sandbox). Deck library save / load / rename / duplicate / delete, upgrade points,
// opponent list (62), fight setup per act, and that the normal run's save is never touched.
const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();");
const store={};const localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]||null,get length(){return Object.keys(store).length}};
const el=()=>({style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){}},appendChild(){},querySelector:()=>null,querySelectorAll:()=>[],dataset:{},set innerHTML(v){this._h=v},get innerHTML(){return this._h||''}});
const app=el();
const ctx=vm.createContext({window:{},console,localStorage,setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:()=>{},
 MutationObserver:function(){this.observe=()=>{}},
 document:{getElementById:id=>id=='app'?app:null,querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},createElement:el,body:el(),head:el(),documentElement:el()}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0,n=0;const ok=(m,c)=>{n++;console.log(c?'ok  ':'FAIL',m);if(!c)f++};
// a normal run save that must survive everything below
const RUN=JSON.stringify({v:1,U:5,G:{ch:'ody',fi:2,phase:'map',p:{recs:[{id:'spear',a:0,d:0,c:0,s:0,k:0,fl:0}]}}});
store.mythologica_run_v1=RUN;store.myth_mute='1';
R(`SBX.on=1;sbxRestore();SBX.hero='ody'`);
ok('every hero starts with an empty Sandbox deck',R(`Object.keys(CHARS).every(k=>Array.isArray(SBX.decks[k])&&!SBX.decks[k].length)`));
// building
R(`CHARS.ody.staples.forEach(id=>sbxDeck().push(sbxNew(id)));for(let i=0;i<6;i++)sbxDeck().push(sbxNew('hopl'))`);
ok('deck has 10 cards',R('sbxDeck().length')==10);
ok('every card in the Odysseus pool can be added',R(`sbxPoolCards('ody').length`)>=80&&R(`sbxPoolCards('ody').every(c=>D[c.id])`));
// upgrade points
R(`SBX.pool=3;var hi=sbxDeck().findIndex(r=>r.id=='hopl'),h0=mk('hopl',sbxDeck()[hi]),pw0=h0.a,th0=h0.d`);
ok('Hoplite can take +1 power and +2 health',R(`sbxOpts(sbxDeck()[hi]).includes(0)&&sbxOpts(sbxDeck()[hi]).includes(1)`));
ok('the option list holds the abilities the altar can offer',R(`sbxOpts(sbxDeck()[hi]).some(o=>o>=7)`));
ok('upgrade +1 power spends a point',R(`sbxUpgrade(sbxDeck(),hi,0,SBX.pool)`)==1&&R('sbxSpent(sbxDeck())')==1&&R('sbxLeft()')==2);
ok('the upgraded card is stronger, as at the altar',R(`mk('hopl',sbxDeck()[hi]).a`)==R('pw0')+1&&R(`sbxDeck()[hi].k`)==1);
R(`sbxUpgrade(sbxDeck(),hi,1,SBX.pool);sbxUpgrade(sbxDeck(),hi,0,SBX.pool)`);
ok('three points spent',R('sbxLeft()')==0&&R(`mk('hopl',sbxDeck()[hi]).d`)==R('th0')+2);
ok('no fourth upgrade without points',R(`sbxUpgrade(sbxDeck(),hi,0,SBX.pool)`)==0&&R('sbxSpent(sbxDeck())')==3);
R(`var fl=sbxDeck().findIndex((r,i)=>r.id=='hopl'&&i!=hi);SBX.pool=5;sbxUpgrade(sbxDeck(),fl,4,SBX.pool)`);
ok('once it flies, flying is no longer offered',!R(`sbxOpts(sbxDeck()[fl]).includes(4)`));
ok('an option the card cannot take is refused',R(`sbxUpgrade(sbxDeck(),fl,4,SBX.pool)`)==0);
const leg=R(`Object.keys(RAR).find(k=>RAR[k]=='L'&&D[k])`);
ok('legendary cards cannot be upgraded',!leg||R(`sbxOpts(sbxNew('${leg}')).length`)==0);
const spl=R(`CHARS.ody.pool.find(id=>D[id]&&D[id][2]=='S'&&UPS[id])`);
ok('spells get spell upgrades (Stronger effect)',R(`sbxOpts(sbxNew('${spl}')).includes(6)`));
R(`sbxResetCard(sbxDeck(),hi)`);ok('undoing a card\'s upgrades refunds its points',R('sbxSpent(sbxDeck())')==1);
// sorting: by rarity (default) or by cost, for the pool and the deck
const ordered=(key)=>R(`(()=>{const L=sbxPoolCards('ody');for(let i=1;i<L.length;i++){const a=L[i-1],b=L[i];if(${key})return false}return true})()`);
ok('pool sorts by rarity by default',R('SBX.sort')=='rar'&&ordered("(RSO[RAR[a.id]]||0)>(RSO[RAR[b.id]]||0)"));
R(`sbxDo('sort:cost')`);
ok('pool sorts by cost',R('SBX.sort')=='cost'&&ordered("cost(a)>cost(b)")&&!ordered("(RSO[RAR[a.id]]||0)>(RSO[RAR[b.id]]||0)"));
ok('deck sorts by cost too',R(`(()=>{const g=sbxGroups(sbxDeck());return g.every((x,i)=>!i||cost(g[i-1].c)<=cost(x.c))})()`));
ok('the sort choice is remembered',JSON.parse(store.mythologica_sandbox_v1).cur.sort=='cost');
R(`sbxScreen();render()`);ok('sort buttons show on the screen',/data-sx="sort:rar"/.test(app.innerHTML)&&/data-sx="sort:cost"/.test(app.innerHTML));
R(`sbxDo('sort:rar')`);
// the library pile (as in the draft): count, stats on hover, click to see every card
ok('the deck pane has a library pile with the card count',/data-sx="view:deck"/.test(app.innerHTML)&&new RegExp('<span class="gyn">'+R('sbxDeck().length')+'<').test(app.innerHTML));
ok('hovering it shows the library stats',/Average mana cost/.test(app.innerHTML));
R(`sbxDo('view:deck')`);ok('clicking it lists every card in the deck',/Your deck: \d+ cards?, sorted by rarity/.test(app.innerHTML)&&(app.innerHTML.match(/data-z="v:/g)||[]).length>=R('sbxDeck().length'));
R(`sbxDo('view:')`);
// grouping in the deck view
ok('identical cards group together, upgraded copies apart',R(`sbxGroups(sbxDeck()).filter(g=>g.r.id=='hopl').map(g=>g.ix.length).sort().join(',')`)=='1,5');
// library
R(`var did=sbxSaveDeck('Phalanx test','ody',sbxDeck(),SBX.pool)`);
ok('save: deck stored under its own key',!!R('did')&&JSON.parse(store.mythologica_sandbox_v1).lib.length==1);
const sv=JSON.parse(store.mythologica_sandbox_v1).lib[0];
ok('saved deck keeps name, hero, cards, upgrades and points',sv.name=='Phalanx test'&&sv.hero=='ody'&&sv.recs.length==10&&sv.recs.some(r=>r.fl==1)&&sv.pool==5&&sv.t>0);
R(`sbxDeck().length=0;SBX.hero='odin';SBX.pool=0`);
ok('load: brings back hero, cards and upgrades',R(`sbxLoadDeck(did)`)==1&&R('SBX.hero')=='ody'&&R('sbxDeck().length')==10&&R('sbxSpent(sbxDeck())')==1&&R('SBX.pool')==5);
R(`sbxDeck()[0].a=9`);ok('a loaded deck is a copy (editing it does not change the library)',JSON.parse(store.mythologica_sandbox_v1).lib[0].recs[0].a==0);
ok('rename',R(`sbxRenameDeck(did,'  Wall of bronze ')`)==1&&JSON.parse(store.mythologica_sandbox_v1).lib[0].name=='Wall of bronze');
ok('rename to nothing is refused',R(`sbxRenameDeck(did,'   ')`)==0);
R(`var d2=sbxDupDeck(did)`);const L2=JSON.parse(store.mythologica_sandbox_v1).lib;
ok('duplicate',L2.length==2&&L2[1].name=='Wall of bronze (copy)'&&L2[1].recs.length==10&&L2[1].id!=L2[0].id);
ok('update saves changes to the same entry',R(`sbxUpdateDeck(did,sbxDeck().slice(0,7),4)`)==1&&JSON.parse(store.mythologica_sandbox_v1).lib.find(d=>d.id==R('did')).recs.length==7);
ok('delete',R(`sbxDelDeck(d2)`)==1&&JSON.parse(store.mythologica_sandbox_v1).lib.length==1);
ok('deleting a missing deck does nothing',R(`sbxDelDeck('nope')`)==0);
R(`sbxStore()`);R(`SBX.decks={};SBX.hero='thoth';sbxRestore()`);
ok('the deck being built survives a reload',R('SBX.hero')=='ody'&&R('sbxDeck().length')==10);
store.mythologica_sandbox_v1='{bad json';ok('a broken store reads as empty, not a crash',R('sbxRead().lib.length')==0);
R(`sbxSaveDeck('x','ody',sbxDeck(),1)`);
// opponents
ok('62 opponents',R('sbxFoes().length')==62);
ok('keys are unique',R('new Set(sbxFoes().map(x=>x.k)).size')==62);
ok('Act III: 10 regulars, 4 elites, 3 generals, the Beast',R(`['Regular','Elite','General','The Beast'].map(t=>sbxFoes().filter(x=>x.realm=='a3'&&x.t==t).length).join()`)=='10,4,3,1');
// fights: own realm = Act I, other realm = Act II, War in Heaven = Act III; the run save is untouched
R(`CHARS.ody.staples.forEach(id=>sbxDeck().push(sbxNew(id)))`);
const fightAs=(hero,key,fi)=>{R(`SBX.hero='${hero}';if(sbxDeck().length<SBXMIN)CHARS['${hero}'].staples.concat(CHARS['${hero}'].staples).forEach(id=>sbxDeck().push(sbxNew(id)));SBX.foe='${key}';SBX.fi=${fi||0}`);return R('sbxStartFight()')};
const cases=[['ody','r:ody:0','Act I'],['odin','r:ody:1','Act II'],['wukong','e:odin:3','Act II'],['thoth','b:wukong:7','Act II'],['ody','b:thoth:9','Act II'],['odin','r:a3:0','Act III'],['thoth','b:a3:12','Act III'],['wukong','f:a3:15','Act III']];
for(const [h,k,act] of cases){
 const F=R(`sbxFoe('${k}')`);const r=fightAs(h,k,2);
 ok(`${h} vs ${F.f.n} (${act}) starts`,r==1&&R('G.sbx')==1&&R('G.e.nm')==F.f.n&&R('G.ch')==h&&R('G.p.recs.length')==R('sbxDeck().length'));
 ok(`  act flags right`,act=='Act I'?(!R('G.a2')&&!R('G.a3')):act=='Act II'?R('G.a2')==F.realm&&!R('G.a3'):R('G.a3')==1);
 R(`G.e.life=0;chk()`);
 ok(`  a win returns to the Sandbox with the result`,R('G.phase')=='sbx'&&R('SBX.res.won')===true&&R('SBX.res.nm')==F.f.n);
 R('render()');ok('  the Sandbox screen renders',/Sandbox/.test(app.innerHTML));
}
fightAs('ody','r:ody:2',0);R(`G.p.life=0;chk()`);ok('a loss returns to the Sandbox too',R('G.phase')=='sbx'&&R('SBX.res.won')===false);
fightAs('ody','r:ody:2',0);R(`endRunNow()`);ok('"Leave fight" in the menu returns to the Sandbox',R('G.phase')=='sbx'&&R('SBX.res.left')==1);
ok('the menu reads "Leave fight" in a Sandbox fight',(fightAs('ody','r:ody:2',0),R('sbxMenuTx(0)'))=='Leave fight');
ok('regular strength follows the chosen fight number',(fightAs('ody','r:ody:3',3),R('G.fi'))==3&&R('G.rt[3]')==3);
R(`persist();clearSave()`);
ok('the normal run save is untouched',store.mythologica_run_v1===RUN);
ok('other keys are untouched',store.myth_mute==='1');
R(`G.p.life=0;chk();render()`);ok('still untouched after a lost fight',store.mythologica_run_v1===RUN);
// leaving the Sandbox switches the guards off again
R(`sbxExit()`);ok('back home, Sandbox is off',R('SBX.on')==0&&R('G.phase')=='char'&&R('sbxMenuTx(0)')=='End run');
ok('the home screen offers the Sandbox',/data-sx="open"/.test(R('savedInfo()')));
console.log(f?('FAILS '+f+' of '+n):('ALL OK ('+n+' checks)'));
