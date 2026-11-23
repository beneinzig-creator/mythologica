# v125 (patch_thothui): Thoth UI fixes from Ben's playtest.
# 1. Foresee: the "Hand: ... Next: ..." line sat in the enemy header, wrapped and slid under the face-down enemy
#    hand. It is now its own strip of name chips in the free band above the tilted enemy field (row 2 of the fight
#    grid, out of flow), wrapping cleanly. The marker glyphs stay literal characters (the art session swaps them for
#    icons) but are drawn in the emoji font: in Cinzel's fallback the pen nib (U+2712) looked like a backslash.
# 2. Glyphs: no more "Glyphs: Ruthless, +1/+1" text (the keyword is already in the rules, the +1/+1 in the stats).
#    Each army member with glyphs shows three slots on its left frame edge (filled = glyph, hollow = room left);
#    the full list is in the hover/loupe details.
# 3. Amulets: an equipped amulet leaves the item row and rides on its wearer as a small badge (right frame edge).
#    It is clickable there only when the current spell can target it. When the wearer leaves, amFall puts it back.
# 4. Pending choices (Temple Scribe, Apprentice Scribe, Weigher of Souls, every PEND card): a Skip button, the
#    prompt says so, and End turn explains itself once, then skips the choice and ends the turn when pressed again.
# 5. The Name card's speak tab is its own pill inside the card (it inherited the offering coin's sizing and hung off).
# 6. Keywords already written as a sentence in the card text ("Resilient. When it dies...", "Ward.") are not
#    added a second time by the auto keyword line.

# ---- 1. foresee strip ----
_b3("${foreStrip()}${clkBadge()}", "${clkBadge()}")
_b3('<div class="board"><div class="fld fe">', '${foreStrip()}<div class="board"><div class="fld fe">')
_b3("function foreStrip(){", "function foreStrip(){return foreStrip2()}\nfunction foreStrip0(){")
# ---- 2/6. rules text: no glyph list, no doubled keywords ----
_b3("(isC(c)&&kwTxt(c)?' '+kwTxt(c):'')", "(isC(c)?kwTx2(c,TXT[c.id]||d[6]||''):'')")
_b3("+(isC(c)?glyphTxt(c):amTxt(c));", "+(isC(c)?'':amTxt(c));")
_b3("${rr}${fxp(c,t)}", "${rr}${isC(c)?glPips(c)+amBadge(c,t):''}${fxp(c,t)}")
_b3("GL(c,L);return`<div class=\"fxp", "thFxp(c,L);GL(c,L);return`<div class=\"fxp")
# ---- 3. equipped amulets leave the item row ----
_b3("for(const c of s.bf){if(!isC(c)){it.push(c);continue}",
    "for(const c of s.bf){if(!isC(c)){if(!(AMU[c.id]&&c.on&&s.bf.some(x=>x.u===c.on)))it.push(c);continue}")
# ---- 4. pending choices: Skip, and End turn explains itself ----
_b3("if(pendOpts(P,c).length){G.pend=c.id;G.pc=c;G.msg=P.m}", "if(pendOpts(P,c).length){G.pend=c.id;G.pc=c;G.pendEnd=0;G.msg=pendM(P)}")
_b3("if(!T||!pendOk(P,T,k))return msg(P.m);", "if(!T||!pendOk(P,T,k))return msg(pendM(P));")
_b3("if(G.pend&&b!='new')return msg(PEND[G.pend].m);",
    "if(G.pend&&b!='new'){const P=PEND[G.pend],nm=D[G.pend]?D[G.pend][0]:'That card';"
    "if(b=='pskip'||(b=='end'&&G.pendEnd)){log('You leave '+nm+' without a target.');G.pend=0;G.pc=0;G.pendEnd=0;if(b=='pskip')return msg('Skipped. Your turn.')}"
    "else if(b=='end'){G.pendEnd=1;return msg(nm+' is still waiting for its target. Choose one, press Skip, or press End turn again to skip it and end your turn.')}"
    "else return msg(pendM(P))}")
_b3("if(G.mode&&G.mode.tgt)b+='<button class=\"b\" data-b=\"cancel\">Cancel</button>';",
    "if(G.mode&&G.mode.tgt)b+='<button class=\"b\" data-b=\"cancel\">Cancel</button>';"
    "if(G.pend&&PEND[G.pend]&&ph=='main')b='<button class=\"b\" data-b=\"pskip\">Skip</button><button class=\"b\" data-b=\"end\">End turn</button>';")
# ---- 5. speak tab ----
_b3('<b class="ob spk" data-z=', '<b class="spk" data-z=')

_JSTH = r"""
/* ===== v125 (patch_thothui): foresee strip, glyph pips, amulet badges, pending Skip, speak tab, keyword dedupe ===== */
function pendM(P){const m=(P&&P.m)||'Choose a target.';return m.replace(/\.?\s*$/,', or press Skip.')}
function kwTx2(c,b){const L=[...new Set(c.f.split(''))].filter(k=>KWT[k]&&!new RegExp('(^|[.!?]\\s+)'+KWT[k].replace(/\.$/,'')+'[.,]').test(b)).map(k=>KWT[k]);return L.length?' '+L.join(' '):''}
const GLAB={f:'Fl',w:'Wa',h:'Ch',z:'Re',s:'St',r:'Ru',v:'Ve',d:'Dr',x:'Si',b:'Bu',y:'Ra',q:'Op',p:'Ph','+':'+1'};
function glPips(c){const g=c.gl||[];if(!g.length)return'';let h='';for(let i=0;i<3;i++){const k=g[i];
 h+=k?`<i class="gp" title="Glyph: ${glName(k)}">${GLAB[k]||(k[0]=='n'?'☥':'?')}</i>`:'<i class="gp e" title="Room for one more glyph"></i>'}
 return`<div class="glp" title="Glyphs (${g.length}/3): ${g.map(glName).join(', ')}">${h}</div>`}
function amBadge(c,t){if(typeof amOf!='function')return'';const A=amOf(c);if(!A.length)return'';const M=G&&G.mode;
 return`<div class="amw">${A.map(a=>{const d=D[a.id],tz=M&&M.tgt&&(t=='p'||t=='e')&&typeof tsOk=='function'&&tsOk(M.tgt,a,t);
  return`<b class="amb${tz?' tok':''}"${tz?` data-z="${t}:${a.u}"`:''} title="${d[0]}: ${String(TXT[a.id]||d[6]).replace(/"/g,'&quot;')}">${d[7]}</b>`}).join('')}</div>`}
function thFxp(c,L){if(!isC(c))return;const g=c.gl||[];if(g.length)L.push('<b>Glyphs</b> ('+g.length+'/3): '+g.map(glName).join(', ')+'.');
 if(typeof amOf=='function')amOf(c).forEach(a=>{const d=D[a.id];L.push('<b>Wears '+d[0]+'</b>: '+(TXT[a.id]||d[6])+((a.gl||[]).length?' Glyphs: '+a.gl.map(glName).join(', ')+'.':''))})}
function foreStrip2(){const e=G.e;if(!e||!G.p)return'';const top=e.deck.filter(c=>c.fs).slice().reverse(),hd=e.hand.filter(c=>c.fs);if(!top.length&&!hd.length)return'';
 const f=c=>{const n=D[c.id][0];return`<span class="fsc${c.pre?' pre':''}" title="${n}${c.pre?' (Preempted: it will fail)':''}${c.rc?' (Recorded: you get a copy when they play it)':''}">${c.pre?'<i class="fsm">⛔</i>':''}${c.rc?'<i class="fsm">✒\uFE0F</i>':''}${n}</span>`};
 return`<div class="fsee"><i class="fsm fse" title="Foreseen">👁</i>${hd.length?'<b>Hand</b>'+hd.map(f).join(''):''}${top.length?'<b>Next</b>'+top.map(f).join(''):''}</div>`}
try{const st=document.createElement('style');st.id='pthui';st.textContent=`
.fsee{position:absolute;grid-row:2;grid-column:1/-1;align-self:start;justify-self:center;top:6px;max-width:min(1000px,calc(100% - 200px));z-index:6;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 5px;pointer-events:none;font:13px/1.25 "Palatino Linotype",Palatino,Georgia,serif;color:#efe4c8;margin:0}
.fsee b{font:700 11px/1 "Palatino Linotype",Palatino,Georgia,serif;color:#e0b04a;text-transform:uppercase;letter-spacing:.08em;margin:0 1px 0 8px}
.fsee .fsc{background:#0d0a07d9;border:1px solid #c9a24c70;border-radius:10px;padding:1px 8px;white-space:nowrap;box-shadow:0 1px 3px #0009;pointer-events:auto}
.fsee .fsc.pre{color:#c9bfae;text-decoration:line-through;text-decoration-color:#e05a4a}
.fsm{font-style:normal;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;font-size:.9em;margin-right:3px}
.fsee .fse{font-size:15px;margin-right:0;filter:drop-shadow(0 1px 2px #000)}
@media (max-height:620px){.fsee{justify-self:start;left:92px;top:3px;max-width:calc(100% - 430px);justify-content:flex-start;font-size:10.5px;gap:2px 3px}.fsee b{font-size:9px;margin-left:4px}.fsee .fsc{padding:0 5px}.fsee .fse{font-size:12px}}
.cd .glp{position:absolute;left:3px;top:22px;display:flex;flex-direction:column;gap:3px;z-index:3;pointer-events:auto}
.cd .gp{display:grid;place-items:center;width:15px;height:15px;border-radius:50%;font:700 7.5px/1 "Palatino Linotype",Palatino,Georgia,serif;font-style:normal;color:#2a1c06;
 background:radial-gradient(circle at 38% 30%,#ffe9a8,#e0b04a 55%,#9a7020);border:1px solid #3a2a0c;box-shadow:0 1px 2px #000b}
.cd .gp.e{background:#1b1408cc;border:1px dashed #e0b04a99;box-shadow:none}
.cd .amw{position:absolute;right:3px;top:22px;display:flex;flex-direction:column;gap:3px;z-index:3}
.cd .amb{display:grid;place-items:center;width:19px;height:19px;border-radius:5px 50% 50% 5px;font-size:11px;line-height:1;background:linear-gradient(135deg,#3a2a10,#1a1208);border:1px solid #e0b04a;box-shadow:0 1px 3px #000c;cursor:help}
.cd .amb.tok{outline:2px solid #7be08a;cursor:pointer}
.cd .spk{position:absolute;top:22px;right:6px;z-index:4;font:700 11px/1.2 "Palatino Linotype",Palatino,Georgia,serif;padding:2px 6px;border-radius:9px;background:#2a1f08;color:#ffd98a;border:1px solid #e0b04a;box-shadow:0 1px 4px #000c;cursor:pointer;white-space:nowrap}
.cd .spk:hover{background:#4a3410}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSTH + "showChars();\n</script>")
