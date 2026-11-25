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
