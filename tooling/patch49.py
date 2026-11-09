# v104: painted fight backgrounds, one per opponent (Odysseus's realm so far).
# The table {opponent name: scene id} comes from art/game/scenes.json, made by
# art/make_game_assets.py from art/scenes.json. Keyed by name, so a realm's backgrounds also
# show when it is another hero's Act 2. Opponents without a painting keep the old colour gradient.
# The painting sits on a fixed layer behind everything (body::before, z-index -1) under a dark wash
# so cards stay readable; it is only switched on while a fight is drawn (render() resets it, the
# fight screen turns it back on). If the image fails to load, the old gradient shows through.
import json as _json
_SCN = _json.load(open(S + '../art/game/scenes.json', encoding='utf-8'))

_b3('function render(){instCap();',
    'const SCN=' + _json.dumps(_SCN, separators=(',', ':'), ensure_ascii=False) + ';'
    'function render(){try{document.documentElement.style.setProperty(\'--scno\',\'0\')}catch(e){}instCap();')

_b3("try{const BG=(fo(G.rt[G.fi])||{}).bg||['#0b1820','#1d4452'],R=document.documentElement.style;R.setProperty('--b1',BG[0]);R.setProperty('--b2',BG[1])}catch(e){}",
    "try{const BG=(fo(G.rt[G.fi])||{}).bg||['#0b1820','#1d4452'],R=document.documentElement.style;R.setProperty('--b1',BG[0]);R.setProperty('--b2',BG[1]);"
    "const SC=SCN[e.nm];R.setProperty('--scn',SC?`url(art/game/scenes/${SC}.jpg)`:'none');R.setProperty('--scno',SC?'1':'0')}catch(e){}")

_b3('.dft{position:absolute;inset:0;display:flex;',
    'body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;'
    'background:radial-gradient(ellipse at 50% 50%,#0000 35%,#000b 100%),linear-gradient(#0009,#0005 30%,#0005 70%,#000a),'
    'var(--scn,none) center/cover no-repeat;opacity:var(--scno,0);transition:opacity .5s}'
    '.dft{position:absolute;inset:0;display:flex;')
