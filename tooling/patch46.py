# v103: painted card art and rarity frames on cards (Odysseus and his opponents).
# The table of which cards have art, which frame each uses (c/u/r/l = rarity tier, +s = no
# power/health plaque, for spells, items and modifiers), and where each box sits on each frame
# comes from art/game/cards.json, made by art/make_game_assets.py. Cards without art (Odin's,
# Wukong's) keep the old look. Fallbacks: if the card art fails to load, the <img> removes itself
# and the emoji shows; if a frame fails, the card's colour shows behind the same layout; if the
# Offering icon fails, it turns back into 💀.
import json as _json
_AJ = _json.load(open(S + '../art/game/cards.json', encoding='utf-8'))
_ARTF = _AJ['cards']

_b3('function card(c,z,zi,yo){',
    'const ARTF=' + _json.dumps(_ARTF, separators=(',', ':')) + ';'
    'const OBI=`<img class="obi" src="art/game/icons/offering.png" alt="" draggable="false" onerror="this.replaceWith(\'💀\')">`;'
    'function card(c,z,zi,yo){')
_b3("return`<div class=\"cd ${cl.join(' ')}\"",
    "return`<div class=\"cd ${cl.join(' ')}${ARTF[c.id]?' af af-'+ARTF[c.id]:''}\"")
_b3('<div class="ar">${d[7]}${so}</div>',
    '<div class="ar">${d[7]}${ARTF[c.id]?`<img class="aimg" src="art/game/cards/${c.id}.jpg" alt="" draggable="false" onerror="this.remove()">`:\'\'}${so}</div>')
_b3('title="Offer for ${sv(c)} mana">💀${sv(c)}</b>', 'title="Offer for ${sv(c)} mana">${ARTF[c.id]?OBI:\'💀\'}${sv(c)}</b>')
_b3('<b class="ob so">💀${sv(c)}</b>', '<b class="ob so">${ARTF[c.id]?OBI:\'💀\'}${sv(c)}</b>')


def _pos(b):
    return f'left:{b[0]}%;top:{b[1]}%;width:{b[2]}%;height:{b[3]}%'


_css = [
    # The frame is the card: no CSS border or padding, the frame image stretched to the card.
    '.cd.af{border:0;padding:0;border-radius:6px;background:var(--fr) 0 0/100% 100% no-repeat,var(--f)}',
    '.cd.af>.nm{display:contents}',
    '.cd.af .nm b,.cd.af .nm i,.cd.af>.ar,.cd.af>.ty,.cd.af>.tx,.cd.af>.pt{position:absolute;box-sizing:border-box;margin:0;'
    'background:none;border:0;border-radius:0;box-shadow:none;min-height:0}',
    '.cd.af .nm b{display:flex;align-items:center;padding:0 .45em;font-size:.82em;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cd.af .nm i{display:flex;align-items:center;justify-content:center;padding:0;color:#1b1710;font-size:1.05em;line-height:1}',
    '.cd.af>.ar{overflow:hidden;background:#000;display:grid;place-items:center}',
    '.cd.af>.ar>.aimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%;pointer-events:none;-webkit-user-drag:none}',
    '.cd.af>.ty{display:flex;align-items:center;padding:0 .55em;font-size:.72em;white-space:nowrap;overflow:hidden}',
    '.cd.af>.tx{padding:.45em .65em;overflow:hidden}',
    '.cd.af>.tx.c{padding-right:.65em}',
    '.cd.af>.pt{display:flex;align-items:center;justify-content:center;padding:0;right:auto;bottom:auto}',
    '.cd.af .rr{display:none}',  # the frame itself shows the rarity
    '.ob .obi{width:1.15em;height:1.15em;vertical-align:-.22em;margin-right:.1em;pointer-events:none}',
    # Bigger cards in battle (Ben: "cards are too small"). zoom keeps every card's inner proportions,
    # and fitHand() already overlaps the hand when it gets too wide.
    # fit() sets --czf/--czh from the window height (see below); on phones the old sizing stays.
    '@media(min-width:561px){html:not(.ph) .hand .cd{zoom:var(--czh,1)}html:not(.ph) .fld .cd{zoom:var(--czf,1)}}',
    # Hovering a card enlarges it so it can be read at any window size (the battlefield itself is
    # limited by height on laptop screens). Enemy cards grow downward, yours upward, so they stay on screen.
    '@media(hover:hover) and (min-width:561px){html:not(.ph) .fld .cd:hover{scale:1.45;z-index:60}'
    'html:not(.ph) .fld.fe .cd:hover{transform-origin:50% 0}html:not(.ph) .fld.fp .cd:hover{transform-origin:50% 100%}'
    'html:not(.ph) .hand .cd:hover{scale:1.2;transform-origin:50% 100%}}',
]
_kids = {'art': '.ar', 'name': '.nm b', 'cost': '.nm i', 'type': '.ty', 'text': '.tx', 'pt': '.pt'}
for code, boxes in _AJ['boxes'].items():
    _css.append(f'.af-{code}{{--fr:url(art/game/frames/{code}.jpg)}}')
    for k, sel in _kids.items():
        if k in boxes:
            pre = '.cd.af-' + code + (' ' if sel.startswith('.nm') else '>')
            _css.append(f'{pre}{sel}{{{_pos(boxes[k])}}}')
_b3('.dft{position:absolute;inset:0;display:flex;', ''.join(_css) + '.dft{position:absolute;inset:0;display:flex;')

# Card size in battle follows the window: fit() shrinks the battle area to the width (--zc), which
# leaves cards small on narrower windows even when there is height to spare. Grow them back until a
# battlefield card is about 14.5% of the window height (the most that fits two armies without
# overlapping; measured at 851x874 and 1440x900), and never so wide that 5 don't fit in a row.
# Never smaller than before, at most 1.6x.
_b3("R.setProperty('--zc',(1.25*f).toFixed(3));",
    "R.setProperty('--zc',(1.25*f).toFixed(3));{const zc=1.25*f,H=innerHeight,W=innerWidth,b=v=>Math.max(1,Math.min(1.6,v));"
    "R.setProperty('--czf',b(Math.min(.145*H,.8*W/5.5)/(104*zc)).toFixed(3));R.setProperty('--czh',b(.14*H/(104*zc)).toFixed(3))}")
