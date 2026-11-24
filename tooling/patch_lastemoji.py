# patch_lastemoji: the last emoji still on screen become painted icons (Ben's playtest, round 2, Nov 2026).
# 1. Thoth's amulet badge on the wearer showed each amulet's emoji, and the icon swap turned three of them
#    (🔱 🏛️ 👁️) into unrelated interface icons. Every amulet now has its own small painted icon
#    (art/game/icons/thoth/am_<id>.png); the card art itself is unchanged.
# 2. The anti-stall clock line ("⏳ The scales of Ma'at tip ...") gets a painted icon that matches its wording in each
#    realm: an hourglass (Greek), Gjallarhorn (Norse), an incense-stick clock (Chinese), the scales of Ma'at (Egyptian)
#    and the seventh trumpet (Act III): art/game/icons/[<realm>/]clock.png.
# 3. A written Name's glyph pip showed ☥; it is now a small painted cartouche mark (art/game/icons/thoth/gl_name.png).
# Each image falls back to the old glyph if it can't load.
_AM = ['tscar', 'dheart', 'dwrap', 'dcart', 'dtwof', 'iword', 'iwas', 'ishen', 'idjed', 'ieye', 'ianx', 'gfeather']
import json as _jle
_b3("${d[7]}</b>`}).join('')}</div>`}",
    "${AMI.has(a.id)?`<img class=\"ambi\" src=\"art/game/icons/thoth/am_${a.id}.png\" alt=\"\" draggable=\"false\" onerror=\"this.replaceWith(document.createTextNode('${d[7]}'))\">`:d[7]}</b>`}).join('')}</div>`}")
_b3("(k[0]=='n'?'☥':'?')",
    "(k[0]=='n'?'<img class=\"gpi\" src=\"art/game/icons/thoth/gl_name.png\" alt=\"Name\" draggable=\"false\" onerror=\"this.replaceWith(document.createTextNode(\\'☥\\'))\">':'?')")
_b3('">⏳ ${CLKN()}', '">${CLKI()} ${CLKN()}')
_b3('function amBadge(c,t){',
    'const AMI=new Set(' + _jle.dumps(_AM) + ');'
    "function CLKI(){let r='ody';try{r=typeof RLM=='function'?RLM():((G&&G.a3)?'act3':((G&&(G.a2||G.ch))||'ody'))}catch(e){}"
    "const d={ody:'',odin:'odin/',wukong:'wukong/',thoth:'thoth/',act3:'act3/'}[r];if(d==null)return '⏳';"
    "return '<img class=\"tki clki\" src=\"art/game/icons/'+d+'clock.png\" alt=\"\" draggable=\"false\" onerror=\"this.replaceWith(document.createTextNode(\\'⏳\\'))\">'}"
    'function amBadge(c,t){')
_b3('</style>', '.cd .amb .ambi{width:16px;height:16px;object-fit:contain;display:block;pointer-events:none}'
    '.cd .gp .gpi{width:12px;height:12px;object-fit:contain;display:block;pointer-events:none}'
    '.clk .clki{width:1.6em;height:1.6em;vertical-align:-.42em;margin-right:.05em;filter:drop-shadow(0 0 1px #000) drop-shadow(0 1px 2px #000c)}</style>')
