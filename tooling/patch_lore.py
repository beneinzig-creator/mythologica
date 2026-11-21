# Lore (Lore session): one lore line for every card, shown under the card only while it is inspected,
# plus lore for regular enemies and elites, hero backstories, and the Thoth bosses' rewritten flavour.
# The text lives in tooling/lore/*.js, one file per realm (see tooling/lore/README.md); this patch only wires it in.
# Also fixes two realm-name bugs: the map's centre altar always said "the strait", and in Act II the altar,
# the guardian's "falls silent" line and the anti-stall clock named the hero's home realm, not the realm you are in.
_LORE_FILES = ['shared', 'greek', 'norse', 'chinese', 'egyptian', 'heaven']
_LORE_JS = (r"""
/* ===== Lore (tooling/lore/*.js) ===== */
const LB={cards:{},foes:{},elites:{},bosses:{},hero:{},dyn:{},realms:{},
 realm(k,o){this.realms[k]=o;for(const f of ['cards','foes','elites','bosses','dyn'])Object.assign(this[f],o[f]||{});if(o.hero)this.hero[k]=o.hero}};
""" + '\n'.join(open(S + 'lore/' + f + '.js', encoding='utf-8').read() for f in _LORE_FILES) + r"""
function cardLore(c){if(!c)return'';const id=c.id;if(LB.cards[id])return LB.cards[id];
 if(c.part=='ka')return LB.dyn.ka;if(c.part=='ba')return LB.dyn.ba;if(c.ren)return LB.dyn.ren;if(/^nm\d/.test(id||''))return LB.dyn.nm;return''}
function foeLore(o){return o?(LB.foes[o.n]||LB.elites[o.n]||o.lore||''):''}
const sent1=t=>(t||'').split(/(?<=[.!?])\s+/)[0]||'';
(function(){try{
 for(const k in LB.hero){const C=CHARS[k],h=LB.hero[k];if(C&&h.quote&&h.story)C.quote=h.quote+' '+h.story}
 BOSS.forEach(b=>{if(LB.bosses[b.n])b.lore=LB.bosses[b.n]});
 ELITES.forEach(e=>{if(LB.elites[e.n])e.lore=LB.elites[e.n]});
}catch(e){}})();
""")
_b3("\nshowChars();\n</script>", _LORE_JS + "\nshowChars();\n</script>")
# inspect: the lore line under the card (the art caption from cards.json is the fallback)
_b3("const my=(typeof HMYTH!='undefined'&&HMYTH[CH]&&HMYTH[CH][c.id])||(typeof MYTH!='undefined'&&MYTH[c.id])||''",
    "const my=cardLore(c)||(typeof HMYTH!='undefined'&&HMYTH[CH]&&HMYTH[CH][c.id])||(typeof MYTH!='undefined'&&MYTH[c.id])||''")
# map tooltip: the first sentence of the opponent's lore
_b3("`<b>${o.n}</b><br>${o.hint}<br><i>${n.el?",
    "`<b>${o.n}</b>${foeLore(o)?`<br><span class=\"flore\">${sent1(foeLore(o))}</span>`:''}<br>${o.hint}<br><i>${n.el?")
# elite intro card: two sentences of lore, then the hint
_b3("const lore=boss&&B.lore?B.lore.split(/(?<=\\.)\\s+/).slice(0,2).join(' '):(B.hint||'')",
    "const lore=boss&&B.lore?B.lore.split(/(?<=\\.)\\s+/).slice(0,2).join(' '):((B.lore?B.lore.split(/(?<=\\.)\\s+/).slice(0,2).join(' ')+'<span class=\"fxin-h\">'+(B.hint||'')+'</span>':(B.hint||'')))")
# realm-name bugs
_b3("const RWORD=()=>({odin:'the Nine Worlds',wukong:'the Western Heaven',thoth:'the Two Lands'})[(G&&G.ch)||'ody']||'the strait';",
    "const RWORD=()=>({odin:'the Nine Worlds',wukong:'the Western Heaven',thoth:'the Two Lands'})[(G&&(G.a2||G.ch))||'ody']||'the strait';")
_b3("to face a guardian of the strait.'", "to face a guardian of '+RWORD()+'.'")
_b3("Ma\\'at tip'})[(G&&G.ch)||'ody']", "Ma\\'at tip'})[(G&&(G.a2||G.ch))||'ody']")
_b3("#insp .myth{", ".wn .tipx .flore{display:block;margin-top:2px;font-style:italic;font-size:11.5px;line-height:1.3;opacity:.8}.fxin-h{display:block;margin-top:12px;font-style:normal;font-size:.85em;opacity:.9}#insp .myth{")
