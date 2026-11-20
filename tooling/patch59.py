# v115 (patch59): each hero's own picture for the cards that several heroes share.
# Divine Karma and Divine Intervention appear in every hero's pool. Odysseus's picture stays at
# art/game/cards/<id>.jpg; Odin's and Sun Wukong's own versions (painted in their style) are at
# art/game/cards/<hero>/<id>.jpg, listed in cards.json under "hero": {hero: {id: frame code}}, with their
# inspect captions under "hero_myth". When the current hero has its own version, the card shows that
# picture in that hero's frame; otherwise everything is as before.
import json as _json59

_CJ59 = _json59.load(open(S + '../art/game/cards.json', encoding='utf-8'))
_HARTF = _CJ59.get('hero', {})
_HMYTH = _CJ59.get('hero_myth', {})
_HDIR = {'odin': 'odin', 'wukong': 'wukong', 'thoth': 'thoth'}

_b3("""${ARTF[c.id]?' af af-'+ARTF[c.id]:''}""", """${ARTF[c.id]?' af af-'+afc(c.id):''}""")
_b3('''style="--art:url(art/game/cards/${c.id}.jpg)"''', '''style="--art:url(${artu(c.id)})"''')
_b3("""const my=(typeof MYTH!='undefined'&&MYTH[c.id])||''""",
    """const my=(typeof HMYTH!='undefined'&&HMYTH[CH]&&HMYTH[CH][c.id])||(typeof MYTH!='undefined'&&MYTH[c.id])||''""")

_JS59 = (
    'const HARTF=' + _json59.dumps(_HARTF, separators=(',', ':')) + ';'
    'const HMYTH=' + _json59.dumps(_HMYTH, ensure_ascii=False, separators=(',', ':')) + ';'
    'const HDIR=' + _json59.dumps(_HDIR, separators=(',', ':')) + ';'
    "function afc(id){const h=typeof CH!='undefined'&&HARTF[CH];return (h&&h[id])||ARTF[id]}"
    "function artu(id){const h=typeof CH!='undefined'&&HARTF[CH];return h&&h[id]?'art/game/cards/'+HDIR[CH]+'/'+id+'.jpg':'art/game/cards/'+id+'.jpg'}"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS59 + "fit();try{addEventListener('resize',fit)}catch(e){}")
