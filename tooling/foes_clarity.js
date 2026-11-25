/* ===== Clarity: every hidden counter is shown on its trump card, and every status is written on the card it affects ===== */
/* counters on the trump: the trump's own text, then a live line. s = the trump's side, o = the other side */
const TRC={
 rwall:s=>'Winter: '+Math.min(3,s.winter||0)+' of 3.',
 corp:s=>s.sailed?'Naglfar has sailed.':'Nails: '+(s.nails||0)+' of 8.',
 serk:s=>'Venom: '+Math.min(7,s.venom||0)+' of 7.',
 bone:(s,o)=>'Your guilt: '+Math.min(3,o.guilt||0)+' of 3.',
 bfury:s=>s.white?'The white bull is loose.':'Rage: '+Math.min(6,s.rage||0)+' of 6.',
 xbab:s=>'Tower: '+(s.tower||0)+' floors.',
 hdead:s=>'Blood in the pit: '+Math.min(4,s.blood||0)+' of 4.',
 xmast:s=>'Ledger: '+(s.ledger||0)+' points (charges '+Math.floor((s.ledger||0)/(s.bf.some(x=>x.id=='xmastg')?2:3))+' life).',
 xpaim:s=>'Heralds: '+s.bf.filter(x=>x.id=='xher').length+' in play.',
 sobk:s=>'Held in the river: '+(s.river||[]).length+'.',
 anub:s=>'Souls they hold: '+(typeof fSouls=='function'?fSouls(s):0)+'.',
 hitr:s=>s.dawn?'Dawn has come.':'Dawn comes on turn 6 (now turn '+(G.turn||0)+').',
 blackship:s=>{const g=['boxing (strongest army member)','the footrace (most army members)','the discus (costliest army member)'];return'Next contest: '+g[(s.games||0)%3]+'.'},
 cweb:(s,o)=>{const n=cr(o).filter(x=>x.silk).length;return n?'Your army members with silk: '+n+'.':''},
 ywind:(s,o)=>{const n=cr(o).filter(x=>x.blind).length;return n?'Your blinded army members: '+n+'.':''}
};
{const _d=(typeof DYN!='undefined')?DYN:null;if(_d)for(const k in TRC){const base=_d[k];_d[k]=c=>{let t=base?base(c):(TXT[k]||D[k][6]||'');try{const s=sideOf(c)||(G&&G.e&&G.e.bf&&G.e.bf.includes(c)?G.e:null);if(s){const x=TRC[k](s,oppOf(s));if(x)t+=' <b>'+x+'</b>'}}catch(e){}return t}}}

/* statuses written on the face of the card they affect (Blinded and Sealed are already written by the glossary patch) */
if(typeof kwTx2=='function'){const _k=kwTx2;kwTx2=function(c,b){let t=_k.apply(this,arguments);try{if(c&&G){const A=[];if(c.callT&&c.callT>=G.turn)A.push('Called by name.');if(c.burn)A.push('Burning.');if(c.mk)A.push('Marked.');if(c.poss)A.push('Possessed.');if(c.coc)A.push('Cocooned.');if(A.length)t+=' '+A.join(' ')}}catch(e){}return t}}

/* the live hover lines follow the new rules */
if(typeof stFxp=='function'){const _s=stFxp;stFxp=function(c,L){const r=_s.apply(this,arguments);try{for(let i=0;i<L.length;i++){if(/^<b>Blinded<\/b>/.test(L[i]))L[i]='<b>Blinded</b>: it can\'t block until the end of its owner\'s next turn.';if(/^<b>Possessed<\/b>/.test(L[i]))L[i]='<b>Possessed</b>: it fights for the demons. Killing the Herd of Swine frees it; if it dies, it goes to its owner\'s graveyard.'}if(c&&c.frz&&c.tap&&G&&G.e&&G.e.bf.some(x=>x.id=='lhz'||x.id=='titan')&&!L.some(y=>/Asleep/.test(y)))L.push('<b>Asleep</b>: tapped, and it doesn\'t untap next turn.')}catch(e){}return r}}

/* status tokens on the card (like the silk pips): one labelled token per status, with its rule on hover */
const STOK=[
 ['blind','Blind','#e8c34a',c=>c.blind,'Blinded: it can\'t block until the end of its owner\'s next turn.'],
 ['call','Called','#d9822b',c=>c.callT&&G&&c.callT>=G.turn,'Called by the gourd: if it attacks or blocks before their next turn, it is swallowed.'],
 ['burn','Burning','#e0502d',c=>c.burn,'Burning: it takes 1 damage at the start of each of its controller\'s turns.'],
 ['mark','Marked','#b04ad9',c=>c.mk,'Marked: it can\'t attack on its controller\'s next turn.'],
 ['poss','Possessed','#8a3bd0',c=>c.poss,'Possessed: it fights for the demons. Killing the Herd of Swine frees it; if it dies, it goes to its owner\'s graveyard.'],
 ['seal','Sealed','#c9a44a',c=>c.seal,'Sealed by the talisman: it can\'t attack while the Mountain Warden lives.'],
 ['curse','Cursed','#7a2a2a',c=>c.cursed,'Cursed: it costs 1 more for the rest of the fight.'],
 ['sleep','Asleep','#5a8ad8',c=>c.tap&&c.frz,'Asleep / frozen: it is tapped and doesn\'t untap next turn.'],
 ['qry','Quarry','#c23b3b',c=>c.qy,'Quarry: the Wild Hunt is hunting it. Hunt riders deal 2 extra damage to it.'],
 ['erase','Erased','#6e6e6e',c=>LORE[c.id]=='Erased','Erased: it has lost its name, keywords and abilities.']
];
{const _cd=card;card=function(c){let h=_cd.apply(this,arguments);try{if(c&&G){const T=STOK.filter(x=>{try{return x[3](c)}catch(e){return false}});if(T.length){const tok=T.map(x=>'<i class="stk stk-'+x[0]+'" style="--sc:'+x[2]+'" title="'+x[4].replace(/"/g,'&quot;')+'">'+x[1]+'</i>').join('');const i=h.indexOf('>');h=h.slice(0,i+1)+'<b class="stks">'+tok+'</b>'+h.slice(i+1)}}}catch(e){}return h}}
try{if(typeof document!='undefined'&&document.createElement&&document.head){const st=document.createElement('style');st.textContent='.cd .stks{position:absolute;left:4px;top:24%;z-index:7;display:flex;flex-direction:column;gap:3px;pointer-events:auto}.cd .stk{font:600 9px/1 Georgia,serif;font-style:normal;letter-spacing:.02em;color:#fff;padding:3px 6px;border-radius:9px;background:rgba(18,14,20,.82);border:1.5px solid var(--sc);box-shadow:0 0 5px var(--sc);text-shadow:0 1px 1px #000;white-space:nowrap}';document.head.appendChild(st)}}catch(e){}
