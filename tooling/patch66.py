# v112 (patch66): bosses cast their trump like any other card instead of starting with it on the battlefield.
# The trump starts in the boss's hand (as elites' and regular decks' opening trumps already do), the AI plays it
# first (it costs 0 or 1), and the trump stamp effect plays when it lands rather than at the intro.
_b3("if(f.trump){const tt=mk(f.trump);tt.boss=1;G.e.bf.push(tt)}", "")
_b3("function startHand(f){const e=G.e;if(!G.boss&&f.mt){e.hand.push(mk(f.mt));draw(e,3)}else draw(e,4)}",
    "function startHand(f){const e=G.e,t=G.boss?f.trump:f.mt;if(t){const c=mk(t);if(G.boss)c.boss=1;e.hand.push(c);draw(e,3)}else draw(e,4)}")
_b3("if(MT.includes(id))s=40;", "if(MT.includes(id)||c.boss)s=40;")
_b3("if('CEA'.includes(d[2])){enter(e,pl);",
    "if('CEA'.includes(d[2])){enter(e,pl);if(pl.boss){try{render();if(typeof fxStampTrump=='function'&&typeof GSOK=='function'&&GSOK())fxStampTrump()}catch(e2){}}")
_b3("o.remove();if(boss)fxStampTrump()", "o.remove()")
