/* ===== v105: Thoth engine (Sunder, Ren, glyphs, Erase, Reunite, amulets, Foresee/Record/Preempt) ===== */
let THN=0;const THSRC={};
const KWG='fwhzsrvdxbyqp';
const GLN={f:'Flying',w:'Ward',h:'Charge',z:'Resilient',s:'Steadfast',r:'Ruthless',v:'Venomous',d:'Draining',x:'Siege',b:'Bulldoze',y:'Rally',q:'Opportunist',p:'Phalanx','+':'+1/+1'};
const glName=g=>GLN[g]||(g&&g[0]=='n'&&D[g.slice(2)]?'the name of '+D[g.slice(2)][0]:String(g));
/* ---------- amulets ---------- */
const AMU={tscar:{eq:1},dheart:{eq:1,h:2},dwrap:{eq:1,k:'z'},dcart:{eq:2},dtwof:{eq:1,p:1,h:1},iword:{eq:1},iwas:{eq:1,p:1},ishen:{eq:1,h:1},
 idjed:{eq:1,h:3,k:'p'},ieye:{eq:1,p:1,h:1,k:'w'},ianx:{eq:2,p:1,h:1,k:'d'},gfeather:{eq:1,p:1,h:1}};
const amOf=c=>{const s=c&&sideOf(c);return s?s.bf.filter(a=>a.on===c.u&&AMU[a.id]):[]};
const glyphsOn=c=>(c.gl||[]).length+amOf(c).filter(a=>a.id=='iword').reduce((n,a)=>n+(a.gl||[]).length,0);
function amP(c){if(!isC(c))return 0;let n=0;for(const a of amOf(c)){const A=AMU[a.id];n+=A.p||0;if(a.id=='iwas')n+=glyphsOn(c);if(a.id=='dtwof'&&c.part=='ba')n+=1;if(a.id=='iword')n+=(a.gl||[]).filter(g=>g=='+').length}return n}
function amH(c){if(!isC(c))return 0;let n=0;for(const a of amOf(c)){const A=AMU[a.id];n+=A.h||0;if(a.id=='dtwof'&&c.part=='ba')n+=1;if(a.id=='iword')n+=(a.gl||[]).filter(g=>g=='+').length}return n}
function amK(c,x){if(!c||!c.u||!G||!G.p)return false;const s=sideOf(c);if(!s)return false;for(const a of s.bf){if(a.on!==c.u||!AMU[a.id])continue;if((AMU[a.id].k||'').includes(x))return true;if(a.id=='iword'&&(a.gl||[]).includes(x))return true}return false}
function amFall(){for(const s of [G&&G.p,G&&G.e]){if(!s||!s.bf)continue;for(const a of s.bf)if(a.on&&!s.bf.some(x=>x.u===a.on)){a.on=0;if(s===G.p)log(D[a.id][0]+' falls and lies ready to be equipped again.')}}}
function scarabSave(s,c){const a=s.bf.find(x=>x.on===c.u&&x.id=='tscar');if(!a)return false;s.bf.splice(s.bf.indexOf(c),1);a.on=0;
 Object.assign(c,{dmg:0,tap:0,def:0,att:0,sw:0,sick:1,frz:0,ta:0,td:0,vn:0,rs:0,forced:0});s.hand.push(c);log('The Scarab carries '+D[c.id][0]+' back to '+(s===G.p?'your':'their')+' hand.');return true}
/* ---------- glyphs ---------- */
function inscribe(c,k){if(!c||!isC(c))return 0;const w=amOf(c).find(a=>a.id=='iword'&&(a.gl||[]).length<3);const T=w||c;T.gl=T.gl||[];if(!w&&T.gl.length>=3)return 0;
 T.gl.push(k);if(T===c){if(k=='+'){c.pa++;c.pd++}else if(k[0]=='n'){c.wr=c.wr||[];c.wr.push(k.slice(2))}else{if(!c.f.includes(k))c.f+=k;if(k=='h')c.sick=0}}
 const s=sideOf(c);if(s===G.p)thHook('insc',c);return 1}
const roomOf=c=>c?3-((c.gl||[]).length):0;
function thErase(c,who){const s=sideOf(c);if(!s||!isC(c))return 0;if(has(c,'w')&&s!==who)return 0;if(amOf(c).some(a=>a.id=='ishen')&&s!==who)return 0;
 const d=D[c.id],id='nm'+(++THN);D[id]=['Nameless '+d[0].split(',')[0],d[1],'C',d[3],d[4],'','Its name was chiselled away.','🗿',d[8],d[9]||1];LORE[id]='Erased';TOKE.push(id);
 const was=d[0];c.id=id;c.f='';c.gl=[];c.wr=[];log(was+' is erased: it loses its name, keywords and abilities.');return 1}
/* ---------- Sunder, Ka and Ba, Ren ---------- */
function makeParts(s,src,bonus){const d=D[src.id],nm=d[0].split(',')[0],col=d[8];const kaH=Math.max(1,Math.ceil((src.d+src.pd)/2)),bp0=Math.max(0,src.a+src.pa),baP=bp0>0?Math.max(1,Math.floor(bp0/2)):0;
 const ki='ka'+(++THN),bi='ba'+THN;D[ki]=['Ka of '+nm,0,'C',0,kaH,'n','Ka: the body (half its health). It cannot block. Reunites with its Ba.','🗿',col,1];D[bi]=['Ba of '+nm,0,'C',baP,1,'f','Ba: the spirit (half its power). Reunites with its Ka.','🕊️',col,1];
 LORE[ki]='The body';LORE[bi]='The spirit';TOKE.push(ki,bi);THSRC[src.u]=src;const out=[];
 for(const id of [ki,bi]){if(cr(s).length>=AM())break;const t=mk(id);t.src=src.u;t.part=id[0]=='k'?'ka':'ba';if(bonus){t.pa+=bonus;t.pd+=bonus}enter(s,t);out.push(t)}
 return out}
function makeRen(src){const d=D[src.id],nm=d[0].split(',')[0],keys=[...new Set(src.f.split('').filter(k=>KWG.includes(k)))];const die=DEATH[src.id]?src.id:'';
 const id='ren'+(++THN),what=(keys.length?keys.map(k=>GLN[k]).join(', ')+', ':'')+(die?'its death ability, ':'')+'+1/+1';
 D[id]=['Ren of '+nm,0,'S',0,0,'','Write: target army member you control gains '+what+' (as glyphs). Or speak it (◆+2) for 2 mana.','📜','A'];LORE[id]='A true name';TS[id]='pc';
 FX[id]=(s,o,t)=>{if(!t||typeof t!='object')return;keys.forEach(k=>inscribe(t,k));if(die)inscribe(t,'n:'+die);inscribe(t,'+');log('You write the name of '+nm+' onto '+D[t.id][0]+'.')};
 const c=mk(id);c.ren=1;c.dis=1;return c}
function thSunder(c,by){const s=sideOf(c);if(!s||!isC(c))return 0;if(s!==by&&has(c,'w'))return 0;if(s!==by&&amOf(c).some(a=>a.id=='ishen'))return 0;
 const heart=amOf(c).some(a=>a.id=='dheart');s.bf.splice(s.bf.indexOf(c),1);if(G.cmb){G.cmb.atk=G.cmb.atk.filter(u=>u!==c.u);for(const k in G.cmb.blk)if(G.cmb.blk[k]===c.u||k==c.u)delete G.cmb.blk[k]}
 const parts=makeParts(s,c,heart?1:0);log(D[c.id][0]+' is sundered into its Ka and Ba.');
 if(by===G.p){const r=makeRen(c);G.p.hand.push(r);const bk=nOn(G.p,'dbook');for(let i=0;i<bk&&cr(G.p).length<AM();i++){const b=parts.find(x=>x.part=='ba');const id=b?b.id:null;if(id){const t=mk(id);t.src=c.u;t.part='ba';enter(G.p,t)}}}
 thHook(s===G.p?'sunMine':'sunTheirs',c);amFall();return 1}
function speak(c){const p=G.p;if(!c||!c.ren)return;p.hand=p.hand.filter(x=>x!==c);p.mana+=2;log('You speak the name aloud: +2 mana.');thHook('speak',c)}
function reunite(s,extra){let n=0;const by={};for(const t of cr(s))if(t.src&&t.part)(by[t.src]=by[t.src]||{})[t.part]=t;
 for(const k in by){const P=by[k];if(!P.ka||!P.ba||!THSRC[k]||cr(s).length<1)continue;const src=THSRC[k];
  s.bf.splice(s.bf.indexOf(P.ka),1);s.bf.splice(s.bf.indexOf(P.ba),1);{const gi=s.gy.indexOf(src);if(gi>=0)s.gy.splice(gi,1)}
  Object.assign(src,{dmg:0,tap:0,def:0,att:0,sw:0,sick:1,frz:0,ta:0,td:0,vn:0,rs:0,forced:0});src.pa+=1+(extra||0);src.pd+=1+(extra||0);src.akh=1;
  const gs=[...(P.ka.gl||[]),...(P.ba.gl||[])];enter(s,src);gs.forEach(g=>inscribe(src,g));
  const os=s.bf.filter(x=>x.id=='dosir').length;if(os){src.pa+=2*os;src.pd+=2*os}n++;log(D[src.id][0]+' is reunited as an Akh, the glorified soul (+1/+1).')}
 amFall();return n}
/* ---------- Foresee, Record, Preempt ---------- */
function foresee(n,rec){const e=G.e;if(!e)return [];const L=e.deck.slice(-n).reverse();L.forEach(c=>{c.fs=1;if(rec)c.rc=1});if(L.length)log('You foresee: '+L.map(c=>D[c.id][0]).join(', ')+'.');return L}
function foreseeHand(rec){const e=G.e;if(!e)return [];e.hand.forEach(c=>{c.fs=1;if(rec)c.rc=1});log('You foresee their hand: '+(e.hand.map(c=>D[c.id][0]).join(', ')||'empty')+'.');return e.hand}
const fsAll=()=>G.e?[...G.e.hand,...G.e.deck].filter(c=>c.fs):[];
function preempt(n){const L=fsAll().filter(c=>!c.pre).sort((a,b)=>D[b.id][1]-D[a.id][1]).slice(0,n||1);L.forEach(c=>{c.pre=1});if(L.length)log('Preempted: '+L.map(c=>D[c.id][0]).join(', ')+'.');return L.length}
function record(pl){const p=G.p;if(isC(pl)&&!TOKE.includes(pl.id)){const c=mk(pl.id);c.dis=1;p.hand.push(c);log('You record '+D[pl.id][0]+': a fading copy joins your hand.')}else{draw(p,1);log('You record '+D[pl.id][0]+': you draw a card.')}}
function thEnemyPlay(e,pl){const p=G.p;if(!p||!pl)return false;G.thLast=pl.id;(G.thPlayed=G.thPlayed||[]).push(pl.id);if(!pl.fs)return false;
 thHook('fsPlay',pl);if(pl.rc||p.bf.some(x=>x.id=='yhall'))record(pl);if(p.bf.some(x=>x.id=='ytruth')&&pl.rc){p.mana+=1}
 if(pl.pre){bury(e,pl);log('Preempted: '+D[pl.id][0]+' fails.');return true}return false}
/* ---------- hooks run by Thoth cards on the board ---------- */
const nOn=(s,id)=>s.bf.filter(x=>x.id==id).length;
function thHook(ev,c){const p=G.p,e=G.e;if(!p||!e)return;
 if(ev=='insc'){if(nOn(p,'iseshat')&&p.ses!==G.turn){p.ses=G.turn;draw(p,1);log('Seshat records your glyph: you draw a card.')}}
 if(ev=='sunMine'){cr(p).filter(x=>x.id=='dshade').forEach(x=>{x.pa++;x.pd++});if(nOn(p,'gcanop'))p.mana+=nOn(p,'gcanop')}
 if(ev=='sunTheirs'){if(nOn(p,'dsoul'))draw(p,nOn(p,'dsoul'));if(nOn(p,'gcanop'))p.mana+=nOn(p,'gcanop')}
 if(ev=='fsPlay'){const n1=nOn(p,'yfore');if(n1){e.life-=2*n1;log('Foreknowledge: they take '+(2*n1)+'.')}const n2=nOn(p,'yclerk');if(n2){e.life-=n2;p.life=Math.min(p.max,p.life+n2)}
  const n3=nOn(p,'yjudge');if(n3)tg(e).forEach(x=>{x.dmg+=n3})}}
function thDie(s,c){const p=G.p,e=G.e;if(!p)return;if(c.part&&s===p){const n=nOn(p,'dduat');if(n){e.life-=n;log('The Gate of the Duat: they take '+n+'.')}}}
function thUp(s,o){const p=G.p;if(s!==p)return;
 const n1=nOn(p,'ystar')+2*nOn(p,'ykhon');if(n1)foresee(n1);
 if(p.bf.some(a=>a.id=='ieye'&&a.on))foresee(1);
 if(nOn(p,'ytruth'))foresee(nOn(p,'ytruth'),1);
 for(let i=0;i<nOn(p,'iobel');i++){const L=cr(p).filter(x=>roomOf(x)>0).sort((a,b)=>(a.gl||[]).length-(b.gl||[]).length);if(L[0])inscribe(L[0],'+')}
 if(nOn(p,'ithoth')){cr(p).forEach(x=>{const ks='fwhzrd'.split('').filter(k=>!x.f.includes(k));if(ks.length)inscribe(x,ks[Math.random()*ks.length|0])});p.life-=1;log('The Book of Thoth writes on your army; it costs you 1 life.')}}
function thEnd(s){if(s!==G.p)return;let n=0;
 for(const a of s.bf.filter(x=>x.id=='dcart'&&x.on)){const b=s.bf.find(x=>x.u===a.on);if(b&&b.src)n+=reunite(s)}
 if(nOn(s,'dosir'))n+=reunite(s);return n}
/* ---------- UI helpers ---------- */
function foreStrip(){const e=G.e;if(!e||!G.p)return'';const top=e.deck.filter(c=>c.fs).slice().reverse(),hd=e.hand.filter(c=>c.fs);if(!top.length&&!hd.length)return'';
 const f=c=>(c.pre?'⛔':'')+(c.rc?'✒':'')+D[c.id][0];return`<div class="cn fsee" style="margin-top:3px">👁 ${hd.length?'Hand: '+hd.map(f).join(', '):''}${hd.length&&top.length?' · ':''}${top.length?'Next: '+top.map(f).join(', '):''}</div>`}
function glyphTxt(c){const g=(c.gl||[]).map(glName);const am=amOf(c).map(a=>D[a.id][0]);return(g.length?' Glyphs: '+g.join(', ')+'.':'')+(am.length?' Wears: '+am.join(', ')+'.':'')}
function amTxt(c){if(!AMU[c.id])return'';const s=sideOf(c),b=s&&c.on&&s.bf.find(x=>x.u===c.on);return(b?' Worn by '+D[b.id][0]+'.':' Not equipped: click it to equip (◆'+AMU[c.id].eq+').')+((c.gl||[]).length?' Glyphs: '+c.gl.map(glName).join(', ')+'.':'')}
