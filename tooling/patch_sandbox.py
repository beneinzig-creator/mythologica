# patch_sandbox: a Sandbox mode for balance testing (Ben, Nov 2026). From the home screen, "Sandbox" opens a screen where
# you pick a hero, build a deck by hand from that hero's full card pool, spend a pool of upgrade points (default 10,
# editable) on the same upgrades the altar offers, pick any of the 62 opponents and fight it on the normal fight engine
# (normal intro painting). After the fight you come straight back to the Sandbox screen with the same deck.
# Decks can be saved to a library (name, hero, cards, upgrades) and loaded, renamed, duplicated or deleted.
#
# Separation from normal runs:
# - Everything lives in its own localStorage key, mythologica_sandbox_v1 (saved decks + the deck you are working on).
# - While Sandbox is open (SBX.on), persist() and clearSave() do nothing, so the saved normal run
#   (mythologica_run_v1) is never written or removed, and no run result is sent ('runs' telemetry is skipped).
# - The menu's "End run" reads "Leave fight" in a Sandbox fight (back to Sandbox) and "Leave Sandbox" on the
#   Sandbox screen (back home).
#
# How a fight is set up (mirrors a real run): the opponent's realm decides the act. Your own hero's realm is Act I,
# another hero's realm is Act II (G.a2), the War in Heaven is Act III (G.a3). Regulars and elites scale by the
# "fight number" picked on the screen (1-4, as in a run); guardians, generals and the Beast use their own scaling.
# The fight ends when chk() moves to kleos / victory / a3front / lost; we catch that and return to the Sandbox.
#
# Upgrades: each upgrade costs 1 point (one altar action). The options for a card are every upgrade the altar could
# offer it: the union of many draws of the game's own upgOpts(), so it follows the real rules (no flying twice,
# "costs 1 less" only above cost 1, spell upgrades, abilities...). Legendary cards can't be upgraded, as at the altar.
# Applying an option runs the game's own KO[o][1](rec) and r.k++, exactly like the altar.

_CSSSBX = r"""
html .ov.sbx{z-index:90}
html .ov.sbx .ovb.sbxb{zoom:1;width:min(1500px,98vw);height:calc(var(--vh,100vh) - 16px);max-height:none;gap:8px;padding:8px 6px;box-sizing:border-box;justify-content:flex-start}
.sbx .sbxt{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center;width:100%;padding:0 96px;box-sizing:border-box}
.sbx .sbxt .ovt{font-size:26px!important;margin:0;color:var(--gold)}
.sbx .sbxs{font-size:13px;opacity:.8;text-align:center}
.sbx .sbxh{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.sbx .b.on{filter:drop-shadow(0 0 8px #ffd45a) brightness(1.25)}
.sbx .sbxbar{display:flex;gap:10px 16px;align-items:center;flex-wrap:wrap;justify-content:center;font-size:14px;background:#0008;border:1px solid #d8b45a44;border-radius:10px;padding:6px 12px}
.sbx .sbxbar b{color:var(--gold)}
.sbx .sbxbar .neg{color:#ff8a7a}
.sbx input{background:#06101a;color:#efe6cf;border:1px solid #d8b45a88;border-radius:6px;padding:4px 8px;font:14px var(--fb)}
.sbx input[type=number]{width:56px}
.sbx .sbxm{display:flex;gap:10px;flex:1 1 auto;min-height:0;width:100%}
.sbx .sbxp{flex:3 1 0;min-width:0;display:flex;flex-direction:column;background:#0006;border:1px solid #d8b45a33;border-radius:10px}
.sbx .sbxd{flex:2 1 0;min-width:0;display:flex;flex-direction:column;background:#0006;border:1px solid #d8b45a33;border-radius:10px}
.sbx .sbxph{font-family:var(--fd);font-weight:700;letter-spacing:.05em;padding:6px 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:space-between;border-bottom:1px solid #d8b45a33}
html .ov.sbx .lib{flex:1 1 auto;max-height:none;max-width:none;min-height:0;overflow-y:auto;padding:12px 8px 16px;gap:10px 8px;align-content:flex-start}
html .ov.sbx .lib>div.sbw>.cd{zoom:.8!important}
html .ov.sbx .sbxp .lib>div.sbw>.cd{zoom:var(--sbz,1.1)!important}
html.ph .ov.sbx .lib>div.sbw>.cd{zoom:.6!important}
html.ph .ov.sbx .sbxp .lib>div.sbw>.cd{zoom:var(--sbz,.8)!important}
.sbx .sbw{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px}
.sbx .sbw .sbq{position:absolute;top:-6px;right:-6px;z-index:5;background:var(--gold);color:#1d150b;font:700 14px var(--fb);border-radius:12px;padding:1px 8px;box-shadow:0 0 6px #000}
.sbx .sbw .sbk{position:absolute;top:-6px;left:-6px;z-index:5;background:#4a8a3a;color:#fff;font:700 13px var(--fb);border-radius:12px;padding:1px 7px;box-shadow:0 0 6px #000}
.sbx .sbw .sbbs{display:flex;gap:4px}
.sbx .sbw .b.gh{font-size:12px!important;border-width:5px 9px!important;padding:0 2px!important;min-height:0}
html .ov.sbx .sbxd .lib>div.sbw>.cd{zoom:.7!important}
.sbx .sbpk{cursor:pointer}
.sbx .sbr{color:#ff8a7a;font-size:13px}
.sbx .sbres{font-size:16px;text-align:center;padding:6px 14px;border-radius:10px;background:#0009;border:1px solid #d8b45a66}
.sbx .sbres.w{border-color:#8ad86a;color:#d8f7c8}
.sbx .sbres.l{border-color:#d86a5a;color:#f7d0c8}
.ov.sbxo{z-index:120}
.ov.sbxv{z-index:120}
.sbx .sbxd>.sbxph{position:relative;z-index:20}
.sbx .sbxdh{display:flex;align-items:center;gap:10px}
.sbx .sbxlw{display:flex;flex-direction:column;align-items:center;gap:2px}
.sbx .sbxlw small{opacity:.7;letter-spacing:.08em;font-size:10px;font-family:var(--fb);font-weight:400}
html .sbx .sbxlw .pile.dlib{width:40px!important;height:56px!important;margin:0!important;display:grid}
html .sbx .sbxlw .pile.dlib .gyn{font-size:11px;right:auto;bottom:3px}
html .sbx .sbxlw .tip{left:0;right:auto;top:calc(100% + 8px);bottom:auto;transform:none;white-space:normal;width:270px;line-height:1.5;z-index:60;font-family:var(--fb);font-weight:400;letter-spacing:0;text-align:left}
.ov.sbxo .ovb{zoom:1;max-height:calc(var(--vh,100vh) - 24px);overflow-y:auto;width:min(1200px,96vw);padding:12px;box-sizing:border-box;background:#0b1820ee;border:1px solid #d8b45a66;border-radius:14px;gap:10px;justify-content:flex-start}
.sbxo .sbg{width:100%}
.sbxo .sbg h3{font-family:var(--fd);color:var(--gold);margin:8px 0 2px;font-size:19px;letter-spacing:.05em}
.sbxo .sbg h4{margin:6px 0 4px;font-size:13px;opacity:.8;font-weight:400;letter-spacing:.08em;text-transform:uppercase}
.sbxo .sbfs{display:flex;flex-wrap:wrap;gap:6px}
.sbxo .sbfs .b.gh{font-size:14px!important}
.sbxo table{border-collapse:collapse;width:100%;font-size:14px}
.sbxo td,.sbxo th{padding:5px 8px;border-bottom:1px solid #d8b45a33;text-align:left}
.sbxo th{color:var(--gold);font-weight:700}
.sbxo td .b.gh{font-size:12px!important;margin:1px}
.sbxo input{background:#06101a;color:#efe6cf;border:1px solid #d8b45a88;border-radius:6px;padding:4px 8px;font:14px var(--fb)}
.ov.sbxu .yn{flex-wrap:wrap;justify-content:center;gap:8px;max-width:min(900px,94vw)}
.ov.sbxu .b[disabled]{opacity:.4}
.hsbx{margin:4px 0;text-align:center}
"""

_JSSBX = r"""
/* ===== patch_sandbox: Sandbox mode (hand-built decks vs any opponent; separate from normal runs) ===== */
const SBXK='mythologica_sandbox_v1',SBXMIN=5,SBXPOST=['kleos','victory','a3front','lost'];
const SBXRN={ody:'Greek realm',odin:'Norse realm',wukong:'Chinese realm',thoth:'Egyptian realm'};
const SBX={on:0,hero:'ody',decks:{},pool:10,foe:'',fi:0,loaded:'',sort:'rar',view:'',up:-1,ren:'',del:'',clr:0,msg:'',res:null};
const sbxH=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const sbxClone=o=>JSON.parse(JSON.stringify(o));
function sbxRead(){let o=null;try{o=JSON.parse(localStorage.getItem(SBXK))}catch(e){}if(!o||o.v!=1)o={v:1,lib:[],cur:null};if(!Array.isArray(o.lib))o.lib=[];
 o.lib=o.lib.filter(d=>d&&d.id&&CHARS[d.hero]&&Array.isArray(d.recs));o.lib.forEach(d=>{d.recs=d.recs.filter(r=>r&&D[r.id])});return o}
function sbxWrite(o){try{localStorage.setItem(SBXK,JSON.stringify(o));return 1}catch(e){return 0}}
function sbxStore(){const o=sbxRead();o.cur={hero:SBX.hero,decks:SBX.decks,pool:SBX.pool,foe:SBX.foe,fi:SBX.fi,loaded:SBX.loaded,sort:SBX.sort};return sbxWrite(o)}
function sbxRestore(){const o=sbxRead(),c=o.cur;SBX.decks={};Object.keys(CHARS).forEach(k=>SBX.decks[k]=[]);
 if(c){if(CHARS[c.hero])SBX.hero=c.hero;Object.keys(CHARS).forEach(k=>{const d=c.decks&&c.decks[k];if(Array.isArray(d))SBX.decks[k]=d.filter(r=>r&&D[r.id])});
  if(c.pool>=0)SBX.pool=c.pool|0;SBX.foe=c.foe||'';SBX.fi=c.fi|0;SBX.loaded=c.loaded||'';SBX.sort=c.sort=='cost'?'cost':'rar'}
 if(SBX.loaded&&!o.lib.some(d=>d.id==SBX.loaded))SBX.loaded=''}
const sbxDeck=()=>SBX.decks[SBX.hero]||(SBX.decks[SBX.hero]=[]);
const sbxSpent=recs=>(recs||[]).reduce((n,r)=>n+(r.k|0),0);
const sbxLeft=()=>SBX.pool-sbxSpent(sbxDeck());
const sbxNew=id=>({id,a:0,d:0,c:0,s:0,k:0,fl:0});
/* every upgrade the altar could offer this card: the union of many draws of the game's own upgOpts() */
function sbxOpts(r){if(!r||RAR[r.id]=='L')return [];const S=new Set();for(let i=0;i<600;i++){try{upgOpts(r).forEach(o=>S.add(o))}catch(e){break}}return [...S].sort((a,b)=>a-b)}
/* spend one point: the altar's own upgrade (KO[o][1] and r.k++) */
function sbxUpgrade(recs,i,o,pool){const r=recs&&recs[i];if(!r||sbxSpent(recs)>=pool)return 0;if(!sbxOpts(r).includes(o))return 0;KO[o][1](r);r.k=(r.k|0)+1;return 1}
function sbxResetCard(recs,i){const r=recs&&recs[i];if(!r)return 0;recs[i]=sbxNew(r.id);return 1}
/* ---- deck library ---- */
function sbxSaveDeck(name,hero,recs,pool){const o=sbxRead(),id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 o.lib.push({id,name:String(name||'').trim().slice(0,40)||'Untitled deck',hero,recs:sbxClone(recs||[]),pool:pool|0,t:Date.now()});return sbxWrite(o)?id:''}
function sbxUpdateDeck(id,recs,pool){const o=sbxRead(),d=o.lib.find(x=>x.id==id);if(!d)return 0;d.recs=sbxClone(recs||[]);d.pool=pool|0;d.t=Date.now();return sbxWrite(o)}
function sbxRenameDeck(id,name){const o=sbxRead(),d=o.lib.find(x=>x.id==id),n=String(name||'').trim().slice(0,40);if(!d||!n)return 0;d.name=n;return sbxWrite(o)}
function sbxDupDeck(id){const o=sbxRead(),d=o.lib.find(x=>x.id==id);if(!d)return '';return sbxSaveDeck(d.name+' (copy)',d.hero,d.recs,d.pool)}
function sbxDelDeck(id){const o=sbxRead(),n=o.lib.length;o.lib=o.lib.filter(x=>x.id!=id);if(o.lib.length==n)return 0;return sbxWrite(o)}
function sbxLoadDeck(id){const d=sbxRead().lib.find(x=>x.id==id);if(!d)return 0;SBX.hero=d.hero;SBX.decks[d.hero]=sbxClone(d.recs);SBX.pool=d.pool|0;SBX.loaded=id;return 1}
/* ---- opponents: every realm's regulars, elites and guardians, then the War in Heaven ---- */
function sbxFoes(){const L=[];Object.keys(CHARS).forEach(k=>{const C=CHARS[k];
  (C.en||[]).forEach((f,i)=>L.push({k:'r:'+k+':'+i,f,i,realm:k,t:'Regular'}));
  (C.el||[]).forEach(i=>ELITES[i]&&L.push({k:'e:'+k+':'+i,f:ELITES[i],i,realm:k,t:'Elite'}));
  (C.bo||[]).forEach(i=>BOSS[i]&&L.push({k:'b:'+k+':'+i,f:BOSS[i],i,realm:k,t:'Guardian'}))});
 if(typeof A3!='undefined'){A3.en.forEach((f,i)=>L.push({k:'r:a3:'+i,f,i,realm:'a3',t:'Regular'}));
  A3.el.forEach(i=>ELITES[i]&&L.push({k:'e:a3:'+i,f:ELITES[i],i,realm:'a3',t:'Elite'}));
  A3.bo.forEach(i=>BOSS[i]&&L.push({k:'b:a3:'+i,f:BOSS[i],i,realm:'a3',t:'General'}));
  if(BOSS[A3.fin])L.push({k:'f:a3:'+A3.fin,f:BOSS[A3.fin],i:A3.fin,realm:'a3',t:'The Beast'})}
 return L}
const sbxFoe=k=>sbxFoes().find(x=>x.k==k)||null;
const sbxAct=(realm,hero)=>realm=='a3'?'Act III':realm==hero?'Act I':'Act II';
const sbxScaled=F=>F&&(F.t=='Regular'||F.t=='Elite');
/* ---- the fight ---- */
function sbxStartFight(){const F=sbxFoe(SBX.foe),h=SBX.hero,recs=sbxDeck();if(!F||recs.length<SBXMIN)return 0;
 setChar(h);A2R='';UND=null;U=0;
 G={ch:h,sbx:1,fi:0,log:[],sel:[],tg:{},p:side([],20),rt:[],lanes:[],web:genWeb(),pos:0,act:2,trail:{},hist:[],boss:0,elt:0,bi:0,a2:'',a3:0,fin:0,phase:'main'};
 G.p.recs=sbxClone(recs);
 if(F.realm=='a3'){G.a3=1;applyA3()}else if(F.realm!==h){G.a2=F.realm;A2R=F.realm;applyRealm(F.realm)}
 const fi=Math.max(0,Math.min(FLOORS-1,SBX.fi|0));
 if(F.t=='Regular'){G.fi=fi;G.rt[fi]=F.i}else if(F.t=='Elite'){G.fi=fi;G.elt=F.i+1}else{G.fi=FLOORS;G.boss=1;G.bi=F.i;if(F.t=='The Beast')G.fin=1}
 SBX.res=null;SBX.view='';sbxStore();try{document.querySelectorAll('.fxrays').forEach(o=>{try{gsap.killTweensOf(o);gsap.killTweensOf(o.querySelectorAll('*'))}catch(e){}o.remove()})}catch(e){}fight();return 1}
function sbxScreen(){G={phase:'sbx',sbx:1,ch:SBX.hero,lib:0,log:[],fi:0,sel:[],tg:{},p:side([],20)};try{setChar(SBX.hero)}catch(e){}
 try{document.documentElement.classList.remove('fxhold','phlost')}catch(e){}}
function sbxFinish(){const won=G.phase!='lost',nm=(G.e&&G.e.nm)||'';
 SBX.res={won,nm,turn:G.turn|0,life:Math.max(0,(G.p&&G.p.life)|0),max:(G.p&&G.p.max)|0};
 G.phase='sbx';G.cmb=0;G.sel=[];G.tg={};G.mode=0;G.pend=0;G.rv=0;G.hq=0;G.lib=0;G.kl=0;
 try{document.documentElement.classList.remove('fxhold')}catch(e){}
 try{if(won&&typeof GSOK=='function'&&GSOK())fxFightWon();else if(!won)SFX.play('dirge')}catch(e){}
 try{setTimeout(()=>{if(G&&G.phase=='sbx')render()},0)}catch(e){}}
function sbxOpen(){SBX.on=1;sbxRestore();SBX.view='';SBX.up=-1;SBX.ren='';SBX.del='';SBX.clr=0;SBX.msg='';SBX.res=null;sbxScreen();render()}
function sbxExit(){SBX.on=0;SBX.view='';showChars()}
function sbxLeaveFight(){SBX.res={left:1,nm:(G&&G.e&&G.e.nm)||''};sbxScreen();render()}
/* ---- the screen ---- */
function sbxPoolCards(h){const C=CHARS[h];return [...new Set([...C.staples,...C.pool])].filter(id=>D[id]).map(id=>mk(id)).sort(sbxCmp)}
/* sort order for both panes: by rarity (then cost), or by cost (then rarity); SBX.sort = 'rar' | 'cost' */
function sbxCmp(a,b){const r=(RSO[RAR[a.id]]||0)-(RSO[RAR[b.id]]||0),c=cost(a)-cost(b),t=(TAG[a.id]||'~').localeCompare(TAG[b.id]||'~')||D[a.id][0].localeCompare(D[b.id][0]);return (SBX.sort=='cost'?(c||r):(r||c))||t}
const sbxSortBtns=()=>`<span>Sort by: ${[['rar','Rarity'],['cost','Cost']].map(([k,l])=>`<button class="b gh${SBX.sort==k?' on':''}" data-sx="sort:${k}">${l}</button>`).join('')}</span>`;
function sbxGroups(recs){const M=new Map();recs.forEach((r,i)=>{const k=JSON.stringify(r);if(!M.has(k))M.set(k,{r,ix:[]});M.get(k).ix.push(i)});
 return [...M.values()].map(g=>(g.c=mk(g.r.id,g.r),g)).sort((a,b)=>sbxCmp(a.c,b.c)||(a.r.k|0)-(b.r.k|0))}
function sbxRender(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
 const h=SBX.hero,C=CHARS[h],recs=sbxDeck(),spent=sbxSpent(recs),left=SBX.pool-spent,F=sbxFoe(SBX.foe),cnt={};recs.forEach(r=>cnt[r.id]=(cnt[r.id]||0)+1);
 const pool=sbxPoolCards(h),grp=sbxGroups(recs),ld=SBX.loaded&&sbxRead().lib.find(d=>d.id==SBX.loaded);
 const heroes=Object.keys(CHARS).map(k=>`<button class="b gh${k==h?' on':''}" data-sx="hero:${k}">${CHARS[k].n} (${(SBX.decks[k]||[]).length})</button>`).join('');
 const res=SBX.res?(SBX.res.left?`<div class="sbres">You left the fight against ${sbxH(SBX.res.nm)}.</div>`:`<div class="sbres ${SBX.res.won?'w':'l'}">${SBX.res.won?`Victory against ${sbxH(SBX.res.nm)} on turn ${SBX.res.turn}, with ${SBX.res.life} of ${SBX.res.max} life left.`:`${sbxH(C.n)} fell to ${sbxH(SBX.res.nm)} on turn ${SBX.res.turn}.`}</div>`):'';
 const fiSel=sbxScaled(F)?`<span>Strength: as fight ${[0,1,2,3].map(i=>`<button class="b gh${(SBX.fi|0)==i?' on':''}" data-sx="fi:${i}">${i+1}</button>`).join('')} of ${FLOORS}</span>`:'';
 const can=F&&recs.length>=SBXMIN;
 const bar=`<div class="sbxbar"><span>Opponent: <b>${F?sbxH(F.f.n):'none chosen'}</b>${F?` <span style="opacity:.75">(${F.realm=='a3'?'The War in Heaven':SBXRN[F.realm]} · ${sbxAct(F.realm,h)} · ${F.t})</span>`:''}</span><button class="b gh" data-sx="view:foe">${F?'Change opponent':'Choose opponent'}</button>${fiSel}<button class="b" data-sx="fight"${can?'':' disabled'}>${SBX.res&&F&&SBX.res.nm==F.f.n?'Fight again':'Fight'}</button>${!can?`<span class="sbr">${!F?'Choose an opponent.':'Your deck needs at least '+SBXMIN+' cards.'}</span>`:''}</div>`;
 const bar2=`<div class="sbxbar"><span>Upgrade points: <input type="number" id="sbxpts" min="0" max="999" value="${SBX.pool}"> · spent <b>${spent}</b> · left <b class="${left<0?'neg':''}">${left}</b></span><span><input id="sbxnm" maxlength="40" placeholder="Deck name" value="${sbxH(ld?ld.name:'')}"> ${ld?`<button class="b gh" data-sx="savecur">Save changes to “${sbxH(ld.name)}”</button>`:''}<button class="b gh" data-sx="savenew">${ld?'Save as new deck':'Save to library'}</button><button class="b gh" data-sx="view:lib">Deck library</button></span>${SBX.msg?`<span style="color:var(--gold)">${sbxH(SBX.msg)}</span>`:''}</div>`;
 const pcards=pool.map(c=>`<div class="sbw sbpk" data-sx="add:${c.id}" title="Click to add to your deck">${cnt[c.id]?`<span class="sbq">×${cnt[c.id]}</span>`:''}${card(c,'v:'+c.u)}</div>`).join('');
 const dcards=grp.map((g,j)=>`<div class="sbw">${g.ix.length>1?`<span class="sbq">×${g.ix.length}</span>`:''}${g.r.k?`<span class="sbk">+${g.r.k}</span>`:''}${card(g.c,'v:'+g.c.u)}<div class="sbbs"><button class="b gh" data-sx="dadd:${j}" title="Add a plain copy">+</button><button class="b gh" data-sx="drem:${j}" title="Remove one">−</button>${RAR[g.r.id]=='L'?'':`<button class="b gh" data-sx="upg:${j}" title="Spend points on this card">Upgrade</button>`}</div></div>`).join('');
 const clr=SBX.clr?`<span>Remove all ${recs.length} cards? <button class="b gh" data-sx="clryes">Yes</button><button class="b gh" data-sx="clrno">No</button></span>`:`<span><button class="b gh" data-sx="staples">Add starting cards</button>${recs.length?'<button class="b gh" data-sx="clr">Clear deck</button>':''}</span>`;
 let html=`<div class="ov ovlib sbx"><div class="ovb sbxb"><div class="sbxt"><div class="ovt">Sandbox</div><div class="sbxh">${heroes}</div><button class="b gh" data-sx="home">Back to home</button></div>
<div class="sbxs">Build any deck and fight any opponent. Nothing here touches your saved run. A normal run starts with ${C.staples.length+ROUNDS} cards.</div>${res}${bar}${bar2}
<div class="sbxm"><div class="sbxp"><div class="sbxph"><span>${sbxH(C.n)}'s card pool (${pool.length}) · click a card to add it</span>${sbxSortBtns()}</div><div class="lib">${pcards}</div></div>
<div class="sbxd"><div class="sbxph"><span class="sbxdh"><span class="sbxlw"><span class="cb pile mine dlib" data-sx="view:deck" title=""><span class="gyn">${recs.length}</span><span class="tip">${libStats(recs.map(r=>mk(r.id,r)))}</span></span><small>Library</small></span>Your deck: ${recs.length} card${recs.length==1?'':'s'}</span>${clr}</div><div class="lib">${dcards||'<div class="dsub">Click cards on the left to add them.</div>'}</div></div></div></div></div>`;
 html+=sbxOverlay();
 document.getElementById('app').innerHTML=html;sbxFit()}
/* the card pool shows exactly SBXCOLS cards per row, whatever the window width */
const SBXCOLS=5;
function sbxFit(){try{const L=document.querySelector('.sbx .sbxp .lib'),c=L&&L.querySelector('.sbw>.cd');if(!c)return;const cs=getComputedStyle(L),gap=parseFloat(cs.columnGap)||8,w=L.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-gap*(SBXCOLS-1)-2;
  const z=Math.max(.5,w/SBXCOLS/(c.offsetWidth||104));L.style.setProperty('--sbz',z.toFixed(4))}catch(e){}}
if(typeof addEventListener=='function')addEventListener('resize',()=>{if(SBX.on&&G&&G.phase=='sbx')sbxFit()});
function sbxOverlay(){const h=SBX.hero,recs=sbxDeck();
 if(SBX.view=='upg'&&recs[SBX.up]){const r=recs[SBX.up],X=mk(r.id,r),O=sbxOpts(r),left=sbxLeft();
  return `<div class="ov cfm sbxu" style="z-index:120"><div class="ovb"><div class="ovt">Upgrade ${sbxH(D[X.id][0])}${r.k?' (+'+r.k+')':''}</div><div class="big">${card(X,'v:0')}</div><div class="ovt" style="font-size:18px">${left>0?`Choose an upgrade · ${left} point${left==1?'':'s'} left`:'No upgrade points left'}</div><div class="yn">${O.length?O.map(o=>`<button class="b" data-sx="uo:${o}"${left>0?'':' disabled'}>${koLabel(o,X)}</button>`).join(''):'<div class="dsub">This card has no available upgrade.</div>'}</div><div class="yn">${r.k?'<button class="b gh" data-sx="ureset">Undo this card\'s upgrades</button>':''}<button class="b" data-sx="uclose">Done</button></div></div></div>`}
 if(SBX.view=='deck'){const have=recs.map(r=>mk(r.id,r)).sort(sbxCmp);
  return `<div class="ov ovlib sbxv"><div class="ovb"><div class="ovt">Your deck: ${have.length} card${have.length==1?'':'s'}, sorted by ${SBX.sort=='cost'?'cost, then rarity':'rarity, then cost'}</div><div class="lib">${have.map(c=>card(c,'v:'+c.u)).join('')||'<p>No cards yet.</p>'}</div><button class="b" data-sx="view:">OK</button></div></div>`}
 if(SBX.view=='foe'){const L=sbxFoes(),grp=[...Object.keys(CHARS),'a3'];
  const sec=g=>{const its=L.filter(x=>x.realm==g),T=[...new Set(its.map(x=>x.t))];
   const ttl=g=='a3'?'The War in Heaven · Act III':`${SBXRN[g]||CHARS[g].n} (${CHARS[g].n}) · ${sbxAct(g,h)} for ${CHARS[h].n}`;
   return `<div class="sbg"><h3>${ttl}</h3>${T.map(t=>`<h4>${t=='The Beast'?t:t+'s'}</h4><div class="sbfs">${its.filter(x=>x.t==t).map(x=>`<button class="b gh${x.k==SBX.foe?' on':''}" data-sx="foe:${x.k}">${sbxH(x.f.n)}</button>`).join('')}</div>`).join('')}</div>`};
  return `<div class="ov sbxo"><div class="ovb"><div class="ovt" style="font-size:22px!important">Choose an opponent (${L.length})</div>${grp.map(sec).join('')}<button class="b" data-sx="view:">Close</button></div></div>`}
 if(SBX.view=='lib'){const lib=sbxRead().lib.slice().sort((a,b)=>b.t-a.t);
  const row=d=>SBX.ren==d.id?`<tr><td colspan="5"><input id="sbxren" maxlength="40" value="${sbxH(d.name)}"> <button class="b gh" data-sx="renok:${d.id}">Save name</button><button class="b gh" data-sx="renno">Cancel</button></td></tr>`
   :`<tr><td>${sbxH(d.name)}${d.id==SBX.loaded?' <span style="opacity:.7">(open)</span>':''}</td><td>${sbxH((CHARS[d.hero]||{}).n||d.hero)}</td><td>${d.recs.length} cards${sbxSpent(d.recs)?' · '+sbxSpent(d.recs)+' upgrades':''}</td><td>${new Date(d.t).toLocaleDateString()}</td><td><button class="b gh" data-sx="load:${d.id}">Load</button><button class="b gh" data-sx="ren:${d.id}">Rename</button><button class="b gh" data-sx="dup:${d.id}">Duplicate</button><button class="b gh" data-sx="del:${d.id}">Delete</button></td></tr>`;
  const D0=SBX.del&&lib.find(d=>d.id==SBX.del);
  return `<div class="ov sbxo"><div class="ovb"><div class="ovt" style="font-size:22px!important">Deck library (${lib.length})</div>${lib.length?`<table><tr><th>Name</th><th>Hero</th><th>Cards</th><th>Saved</th><th></th></tr>${lib.map(row).join('')}</table>`:'<div class="dsub">No saved decks yet. Name your deck on the Sandbox screen and press Save to library.</div>'}<div class="dsub">Loading a deck replaces the deck you are building for that hero. Save it first if you want to keep it.</div><button class="b" data-sx="view:">Close</button></div></div>${D0?`<div class="ov cfm" style="z-index:130"><div class="ovb"><div class="ovt">Delete “${sbxH(D0.name)}”?</div><div class="dsub">This cannot be undone.</div><div class="yn"><button class="b" data-sx="delyes:${D0.id}">Delete</button><button class="b" data-sx="delno">Keep it</button></div></div></div>`:''}`}
 return ''}
function sbxDo(a){const i=a.indexOf(':'),c=i<0?a:a.slice(0,i),v=i<0?'':a.slice(i+1),recs=sbxDeck();SBX.msg='';
 if(c=='open')return sbxOpen();
 if(!SBX.on)return;
 if(c=='home')return sbxExit();
 if(c=='hero'&&CHARS[v]){SBX.hero=v;SBX.loaded='';SBX.clr=0;sbxScreen()}
 else if(c=='add'&&D[v]){recs.push(sbxNew(v))}
 else if(c=='dadd'||c=='drem'||c=='upg'){const g=sbxGroups(recs)[+v];if(!g)return render();
  if(c=='dadd')recs.push(sbxNew(g.r.id));else if(c=='drem')recs.splice(g.ix[g.ix.length-1],1);else{SBX.view='upg';SBX.up=g.ix[0]}}
 else if(c=='uo'){if(!sbxUpgrade(recs,SBX.up,+v,SBX.pool))SBX.msg='No upgrade points left.'}
 else if(c=='ureset'){sbxResetCard(recs,SBX.up)}
 else if(c=='uclose'){SBX.view='';SBX.up=-1}
 else if(c=='staples'){CHARS[SBX.hero].staples.forEach(id=>recs.push(sbxNew(id)))}
 else if(c=='clr')SBX.clr=1;else if(c=='clrno')SBX.clr=0;else if(c=='clryes'){recs.length=0;SBX.clr=0;SBX.loaded=''}
 else if(c=='sort')SBX.sort=v=='cost'?'cost':'rar';
 else if(c=='fi')SBX.fi=Math.max(0,Math.min(3,+v|0));
 else if(c=='view'){SBX.view=v;SBX.ren='';SBX.del=''}
 else if(c=='foe'){if(sbxFoe(v)){SBX.foe=v;SBX.view=''}}
 else if(c=='fight'){sbxStore();if(sbxStartFight())return;SBX.msg=!sbxFoe(SBX.foe)?'Choose an opponent first.':'Your deck needs at least '+SBXMIN+' cards.'}
 else if(c=='savenew'||c=='savecur'){const el=document.getElementById('sbxnm'),nm=el&&el.value||'';
  if(!recs.length)SBX.msg='Add some cards first.';
  else if(c=='savecur'&&SBX.loaded){if(sbxUpdateDeck(SBX.loaded,recs,SBX.pool)){if(nm.trim())sbxRenameDeck(SBX.loaded,nm);SBX.msg='Saved.'}else SBX.msg='Could not save.'}
  else{const id=sbxSaveDeck(nm||(CHARS[SBX.hero].n+' deck'),SBX.hero,recs,SBX.pool);if(id){SBX.loaded=id;SBX.msg='Saved to the library.'}else SBX.msg='Could not save (storage full or blocked).'}}
 else if(c=='load'){if(sbxLoadDeck(v)){SBX.view='';SBX.clr=0;sbxScreen();SBX.msg='Deck loaded.'}}
 else if(c=='ren')SBX.ren=v;else if(c=='renno')SBX.ren='';
 else if(c=='renok'){const el=document.getElementById('sbxren');if(el&&sbxRenameDeck(v,el.value))SBX.ren=''}
 else if(c=='dup')sbxDupDeck(v);
 else if(c=='del')SBX.del=v;else if(c=='delno')SBX.del='';
 else if(c=='delyes'){sbxDelDeck(v);if(SBX.loaded==v)SBX.loaded='';SBX.del=''}
 sbxStore();render()}
/* ---- hooks into the game ---- */
{const _r=render0;render0=function(){if(G&&G.phase=='sbx')return sbxRender();return _r.apply(this,arguments)}}
{const _k=chk;chk=function(){const r=_k.apply(this,arguments);try{if(SBX.on&&G&&G.sbx&&SBXPOST.includes(G.phase))sbxFinish()}catch(e){}return r}}
{const _p=persist;persist=function(){if(SBX.on||(G&&G.sbx))return;return _p.apply(this,arguments)}}
{const _c=clearSave;clearSave=function(){if(SBX.on||(G&&G.sbx))return;return _c.apply(this,arguments)}}
{const _s=sendRec;sendRec=function(kind){if((SBX.on||(G&&G.sbx))&&kind=='runs')return Promise.resolve(0);return _s.apply(this,arguments)}}
{const _e=endRunNow;endRunNow=function(){if(SBX.on){if(G&&G.phase=='sbx')return sbxExit();return sbxLeaveFight()}return _e.apply(this,arguments)}}
{const _si=savedInfo;savedInfo=function(){return _si.apply(this,arguments)+'<div class="hsbx"><button class="b gh" data-sx="open">Sandbox: test any deck against any opponent</button></div>'}}
function sbxMenuTx(k){const on=SBX.on,f=on&&G&&G.phase!='sbx';
 if(k==0)return !on?'End run':f?'Leave fight':'Leave Sandbox';
 if(k==1)return !on?'End this run?':f?'Leave this fight?':'Leave the Sandbox?';
 if(k==2)return !on?'Your progress will be lost and you will return to the home screen.':f?'You will return to the Sandbox screen with the same deck.':'You will return to the home screen. Your Sandbox decks stay saved.';
 return !on?'Yes, end the run':f?'Yes, leave the fight':'Yes, leave'}
if(typeof document!='undefined'&&typeof document.addEventListener=='function'){
 document.addEventListener('click',ev=>{const t=ev.target&&ev.target.closest&&ev.target.closest('[data-sx]');if(!t||t.disabled)return;ev.stopPropagation();ev.preventDefault();try{SFX.play('click')}catch(e){}sbxDo(t.dataset.sx)},true);
 document.addEventListener('change',ev=>{if(!SBX.on||!ev.target||ev.target.id!='sbxpts')return;const n=Math.max(0,Math.min(999,parseInt(ev.target.value,10)||0));SBX.pool=n;sbxStore();render()},true);
 document.addEventListener('keydown',ev=>{if(!SBX.on||ev.key!='Enter'||!ev.target)return;const id=ev.target.id;if(id=='sbxren'&&SBX.ren){ev.preventDefault();sbxDo('renok:'+SBX.ren)}else if(id=='sbxnm'){ev.preventDefault();sbxDo(SBX.loaded?'savecur':'savenew')}else if(id=='sbxpts'){ev.target.blur()}},true)}
try{const st=document.createElement('style');st.id='psbx';st.textContent=SBXCSS;document.body.appendChild(st)}catch(e){}
"""

_b3('id="mnu_end">End run</button>', 'id="mnu_end">\'+sbxMenuTx(0)+\'</button>')
_b3('<div class="t">End this run?</div><div>Your progress will be lost and you will return to the home screen.</div><button class="b" id="mnu_yes">Yes, end the run</button>',
    '<div class="t">\'+sbxMenuTx(1)+\'</div><div>\'+sbxMenuTx(2)+\'</div><button class="b" id="mnu_yes">\'+sbxMenuTx(3)+\'</button>')
_b3("showChars();\n</script>", "const SBXCSS=" + repr(_CSSSBX) + ";\n" + _JSSBX + "showChars();\n</script>")
