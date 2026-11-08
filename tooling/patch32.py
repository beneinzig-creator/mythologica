# ===== v69: undo, life cap, Range + opponent answers, rare dup costs 2 =====
# --- Range keyword (reach)
_b3("&&(!has(a,'f')||has(b,'f'));","&&(!has(a,'f')||has(b,'f')||has(b,'a'));")
_b3("const GLS=()=>[","const GLS=()=>[[/\\brange\\b/i,'Range',KWL.a],")
# --- AI: scaled removal thresholds + aliases
_b3("id=c.id,t=D[id][2],M=tg(p)","id=SPA[c.id]||c.id,t=D[c.id][2],M=tg(p)")
_b3("case'lure':{const T=best(M.filter(x=>th(x)-x.dmg<=2))","case'lure':{const T=best(M.filter(x=>th(x)-x.dmg<=2+xb(e)))")
_b3("case'curse':{const T=best(M.filter(x=>th(x)-x.dmg<=2))","case'curse':{const T=best(M.filter(x=>th(x)-x.dmg<=2+xb(e)))")
_b3("case'javel':{const k=M.filter(x=>th(x)-x.dmg<=3)","case'javel':{const k=M.filter(x=>th(x)-x.dmg<=3+xb(e))")
_b3("case'hurl':{const k=M.filter(x=>th(x)-x.dmg<=4)","case'hurl':{const k=M.filter(x=>th(x)-x.dmg<=4+xb(e))")
# --- rare duplicate = 2 actions
_b3("if(G.rmMode=='dup'){p.recs.push({...p.recs[G.rm]});u.d=1}else p.recs.splice(G.rm,1);G.act--}",
    "if(G.rmMode=='dup'){const cs=RAR[p.recs[G.rm].id]=='R'?2:1;if(G.act<cs){G.hubMsg='Duplicating a rare card costs 2 action points.';G.rm=-1;return render()}p.recs.push({...p.recs[G.rm]});u.d=1;G.act-=cs}else{p.recs.splice(G.rm,1);G.act--}}")
_b3("G.hubMsg='Legendary cards cannot be duplicated or upgraded.';return render()}G.rm=+rm.dataset.rm;",
    "G.hubMsg='Legendary cards cannot be duplicated or upgraded.';return render()}if(G.rmMode=='dup'&&RAR[G.p.recs[+rm.dataset.rm].id]=='R'&&G.act<2){G.hubMsg='Duplicating a rare card costs 2 action points.';return render()}G.rm=+rm.dataset.rm;")
_b3("Duplicate a card (1 action)${u.d?' · used':''}","Duplicate a card (1 action, rares 2)${u.d?' · used':''}")
_b3("Click a card to ${vb[1]} it.","Click a card to ${vb[1]} it.${md=='dup'?' Rare cards cost 2 actions.':''}")
_b3("`<div class=\"ovt\">Are you sure?</div><div class=\"yn\">","`<div class=\"ovt\">Are you sure?${md=='dup'&&RAR[X.id]=='R'?' (costs 2 actions)':''}</div><div class=\"yn\">")
# --- life cap / undo hooks
_b3("function chk(){if(G.e.life<=0)","function chk(){instCap();if(G.e.life<=0)")
_b3("function render(){render0();","function render(){instCap();try{uInv()}catch(e){}render0();")
_b3("function fight(){const f=G.boss","function fight(){instCap();const f=G.boss")
_b3("function bt(b){const p=G.p;if(G.hq&&b=='hqy'","function bt0(b){const p=G.p;if(G.hq&&b=='hqy'")
_b3("function hd(z){if(G.hq)return;","function hd0(z){if(G.hq)return;")
_b3("function newRun(){U=0;","function newRun(){UND=null;U=0;")
_b3("function loadRun(){const o=readSave();","function loadRun(){UND=null;const o=readSave();")
_b3("show('<div class=\"t\">Menu</div><button class=\"b\" id=\"mnu_fb\">","show('<div class=\"t\">Menu</div>'+undoBtn()+'<button class=\"b\" id=\"mnu_fb\">")
_b3(";else if(id=='mnu_end')show(",";else if(id=='mnu_undo'){hide();doUndo()}else if(id=='mnu_end')show(")
# --- main block
_b3("fit();try{addEventListener('resize',fit)}catch(e){}","""/* ---- v69 ---- */
KWT.a='Range.';KWL.a='Range: it can block flying army members.';
ABU.push(['a','Range']);KO.push(['Gains Range',r=>{r.ab=(r.ab||'')+'a'}]);
const BOSSX=2,xb=s=>s===G.e?(G.boss?BOSSX:sclOf(G.fi)[1]):0;
FX.hurl=(s,o,t)=>{t.dmg+=4+mg()+xb(s)};
FX.javel=(s,o,t)=>{t.dmg+=3+mg()+xb(s)};
FX.curse=(s,o,t)=>{t.pa-=2+mg()+xb(s);t.pd-=2+mg()+xb(s)};
FX.lure=(s,o,t)=>{t.pa-=2+mg()+xb(s);t.pd-=2+mg()+xb(s)};
FX.nshade=FX.trident=FX.hurl;
const SPA={nshade:'hurl',trident:'hurl'};
D.lbow=['Poppy Dart-Thrower',2,'C',1,4,'a','','🏹','G',1];D.cbow=['Cicone Slinger',2,'C',2,3,'ma','','🏹','R',1];
D.nshade=['Nightshade Draught',3,'S',0,0,'','Deal 4 damage to target army member. Grows stronger the further you travel.','🌿','G'];
D.trident=["Poseidon's Trident",3,'S',0,0,'',"Deal 4 damage to target army member. Grows stronger the further you travel.",'🔱','W'];
RAR.lbow=RAR.cbow='C';RAR.nshade=RAR.trident='U';TAG.lbow=TAG.nshade='Z';TAG.cbow='M';TAG.trident='F';
LORE.lbow='Lotus-Eater archer';LORE.cbow='Cicone warrior';
D.warden[5]+='a';D.phguard[5]+='a';D.hspr[5]+='a';D.sh3[5]+='a';D.cspa[5]+='a';
EN[0].d.push(...ids('lbow:2,nshade'));EN[3].d.push('curse');EN[4].d.push('trident');EN[5].d.push(...ids('cbow:2,javel'));
D.hurl[6]=D.javel[6]='Deal damage to target army member (opposing casters add more as the run goes on).';
/* life cap */
function instCap(){const p=G&&G.p;if(!p)return;const d=Object.getOwnPropertyDescriptor(p,'life');if(!d||d.get)return;let v=d.value;Object.defineProperty(p,'life',{get:()=>v,set:x=>{v=(x>v&&x>p.max)?Math.max(v,p.max):x},enumerable:true,configurable:true});if(v>p.max)v=p.max}
/* undo */
let UND=null,UD=0;
const UNDO_ON=typeof window!=='undefined';
const USK=new Set(['sel','msg','mode','pend','pc','cur','log','tg','gv','lib','rv','hubMsg','blk','uo','rm']);
const uOK=()=>!!(G&&G.p&&G.p.recs&&!G.pend&&!G.hq&&!G.rv&&!G.cmb&&G.phase=='main'&&!!G.e);
function snapG(){const fight=G.phase=='main',m=new Map();if(fight)G.p.recs.forEach((r,i)=>m.set(r,i));return JSON.stringify(G,function(k,v){if(fight&&k=='recs'&&this===G.p)return undefined;if(k=='rec'&&v&&m.has(v))return{__r:m.get(v)};return v})}
function sigG(){return JSON.stringify(G,(k,v)=>USK.has(k)?undefined:v)}
function unsnap(s,live){const g=JSON.parse(s);if(live){g.p.recs=live;const fix=c=>{if(c&&c.rec&&c.rec.__r!=null)c.rec=live[c.rec.__r]};[g.p,g.e].forEach(S=>S&&['hand','deck','bf','gy'].forEach(z=>(S[z]||[]).forEach(fix)))}return g}
function uAct(f){if(!UNDO_ON||UD||!uOK()){UD++;try{return f()}finally{UD--}}
let s0,g0;try{s0=snapG();g0=sigG()}catch(e){return f()}
const ph=G.phase,turn=G.turn,fi=G.fi,pos=G.pos;UD++;let r;try{r=f()}finally{UD--}
try{if(G&&G.p&&G.e&&G.turn==turn&&!['enemy','kleos','lost','victory'].includes(G.phase)&&sigG()!=g0)UND={s:s0,ph,turn,fi,pos,fight:ph=='main'}}catch(e){}
return r}
function bt(b){return uAct(()=>bt0(b))}
function hd(z){return uAct(()=>hd0(z))}
function uInv(){if(UND&&G&&(G.turn!=UND.turn||['enemy','kleos','lost','victory','map','loc','remove','draft','char'].includes(G.phase)))UND=null}
function uValid(){if(!UND||!G||!G.p||!uOK())return false;return G.phase=='main'&&G.turn==UND.turn&&G.fi==UND.fi}
function undoBtn(){const ok=uValid();return'<button class="b" id="mnu_undo"'+(ok?'':' disabled')+'>Undo last action'+(ok?'':' (none available)')+'</button>'}
function doUndo(){if(!uValid())return;const g=unsnap(UND.s,UND.fight?G.p.recs:null);UND=null;G=g;if(G.phase=='remove'){G.phase='loc';G.rm=-1;G.uo=0}G.mode=0;G.pend=0;G.pc=0;G.hq=0;G.rv=0;G.cmb=0;G.lib=0;G.gv=0;if(G.phase=='main'){G.sel=G.p.bf.filter(c=>c.forced&&canAtk(c)).map(c=>c.u);G.msg='Undid your last action.'}else G.sel=[];instCap();render()}
fit();try{addEventListener('resize',fit)}catch(e){}""")
# ===== v71: berserkers cannot defend; AI takes lethal first =====
_b3("if(!c.def&&c.att)return'It attacked this turn.';","if(!c.def&&c.att)return'It attacked this turn.';if(!c.def&&has(c,'n'))return'It can only attack.';")
_b3("let ns=0;for(let i=0;i<14;i++){const opts=","let ns=0;const lethalNow=()=>{const r=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')),B=cr(p).filter(b=>!b.tap&&!has(b,'n'));return r.length>0&&combatEval(r,B,p.life,{}).dmg>=p.life};for(let i=0;i<14;i++){if(lethalNow())break;const opts=")
_b3("const plan=attackPlan(e,p);if(!plan||!plan.S.length){log(e.nm+' holds position.')","let plan=attackPlan(e,p);{const all=cr(e).filter(canAtk).filter(c=>pwr(c)>0),B=cr(p).filter(b=>!b.tap&&!has(b,'n'));if(all.length&&combatEval(all,B,p.life,{}).dmg>=p.life&&(!plan||combatEval(plan.S,B,p.life,{}).dmg<p.life))plan={S:all,tgm:{}}}if(!plan||!plan.S.length){log(e.nm+' holds position.')")
_b3("fit();try{addEventListener('resize',fit)}catch(e){}","{const _h=FX.hold;FX.hold=(s,o,t)=>{if(has(t,'n')){log('It can only attack.');return}_h(s,o,t)}}\nfit();try{addEventListener('resize',fit)}catch(e){}")
