# patch_tokens: painted art for the tokens that were still emoji cards, and painted icons for the last emoji markers
# (Ben's playtest, Nov 2026).
# 1. Thoth's Body, Spirit, Name and Nameless are made during play with fresh ids (ka7, ba7, ren8, nm9 ...), so the
#    build-time art table can't list them. tkArt() maps such an id to its picture (art/game/cards/thoth/tk_*.jpg) and
#    adds it to ARTF with Thoth's common frame the first time the card is drawn, so it gets the frame, the picture and
#    the painted Offering badge like every other card.
#    The fixed-id tokens (Shabti, Swine, Foretold Fate, Risen Draugr, Peach of Immortality, Weight of the Mountain) come
#    in through art/game/cards.json like any other card (make_game_assets.py), so they need nothing here.
# 2. Foresee markers (👁 foreseen, ⛔ preempted, ✒ recorded) and Wukong's Momentum (⛓) become small painted icons.
#    Only the glyphs change; the Foresee line's layout is left as it is.
_TK = {'ka': 'body', 'ba': 'spirit', 'ren': 'name', 'nm': 'nameless'}
import json as _jtk
_b3('function artu(id){',
    'const TKA=' + _jtk.dumps(_TK) + ';'
    "function tkArt(id){const m=/^(ka|ba|ren|nm)\\d+$/.exec(id||'');if(!m)return '';"
    "if(typeof ARTF!='undefined'&&!ARTF[id])ARTF[id]=D[id]&&D[id][2]=='C'?'tc':'tcs';return 'art/game/cards/thoth/tk_'+TKA[m[1]]+'.jpg'}"
    'function artu(id){const tk=tkArt(id);if(tk)return tk;')
# card() checks ARTF before calling artu, so register the token's frame at the top of card() as well
_b3('function card(c,z,zi,yo){', 'function card(c,z,zi,yo){try{c&&tkArt(c.id)}catch(e){}')

_TKI = lambda f, alt: f'<img class="tki" src="art/game/icons/{f}.png" alt="{alt}" title="{alt}" draggable="false">'
_b3("(c.pre?'⛔':'')+(c.rc?'✒':'')",
    "(c.pre?'" + _TKI('thoth/preempt', 'Preempted') + "':'')+(c.rc?'" + _TKI('thoth/record', 'Recorded') + "':'')")
_b3('class="cn fsee" style="margin-top:3px">👁 ', 'class="cn fsee" style="margin-top:3px">' + _TKI('thoth/foresee', 'Foreseen') + ' ')
_b3('⛓ Momentum', _TKI('wukong/momentum', 'Momentum') + ' Momentum')
_b3('</style>', '.tki{width:1.25em;height:1.25em;vertical-align:-.28em;margin-right:.12em;pointer-events:none}</style>')
