# patch_cardhero: hero-specific cards show the right hero's art (Ben, Nov 2026).
# - Divine Intervention and Divine Karma (and the training dummy) have their own painting and frame for each hero:
#   art/game/cards/<hero>/<id>.jpg in that hero's Legendary frame (ols, wls, tls; Odysseus keeps ls).
# - The art lookup (artu, afc) and the hover description (HMYTH) followed the hero you are playing (CH). On the hero
#   select screen CH is still the default (Odysseus) until you press Begin, so "Starting cards" and "Full card pool" for
#   Odin, Sun Wukong or Thoth showed Odysseus's paintings and frames on those cards.
# - ARH() is the hero whose cards are on screen: the hero a library view was opened for (G.cv while G.lib is set),
#   otherwise the hero being played.
_b3("function afc(id){const h=typeof CH!='undefined'&&HARTF[CH];",
    "function ARH(){try{if(typeof G!='undefined'&&G&&G.lib&&G.cv&&CHARS[G.cv])return G.cv}catch(e){}return typeof CH!='undefined'?CH:'ody'}"
    "function afc(id){const h=HARTF[ARH()];")
_b3("function artu(id){const tk=tkArt(id);if(tk)return tk;const h=typeof CH!='undefined'&&HARTF[CH];return h&&h[id]?'art/game/cards/'+HDIR[CH]+'/'+id+'.jpg'",
    "function artu(id){const tk=tkArt(id);if(tk)return tk;const ah=ARH(),h=HARTF[ah];return h&&h[id]?'art/game/cards/'+HDIR[ah]+'/'+id+'.jpg'")
_b3("(typeof HMYTH!='undefined'&&HMYTH[CH]&&HMYTH[CH][c.id])",
    "(typeof HMYTH!='undefined'&&HMYTH[ARH()]&&HMYTH[ARH()][c.id])")
# The in-run deck view (click your library) shows the hero being played, so it resets G.cv to CH; otherwise a pool
# you browsed on the hero select screen before pressing Begin could leave another hero's G.cv behind.
_b3("if(z&&z.dataset.z=='lib'){G.lib=1;", "if(z&&z.dataset.z=='lib'){G.lib=1;G.cv=CH;")
