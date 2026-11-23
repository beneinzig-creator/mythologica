# v124 (patch71): a full-screen map, and a pre-fight screen showing the enemy itself.
# 1. Map: the hero's painted map used to sit in a box with plain dark blue around it. It now fills the whole
#    screen (the painting goes on the fixed background layer, html.mapfull), and the box itself turns clear, so the
#    nodes sit straight on the painting. Text over the painting gets a dark shadow so it stays readable.
# 2. Pre-fight screen: every fight with a figure painting (art/game/figures/<id>.webp, by opponent name from
#    art/game/figures.json) opens with the enemy standing full-length over its own fight background, with its
#    name and hint or lore. Bosses and elites without a figure keep the old icon intro; regular fights without one
#    go straight in, as before.
import json as _json71, os as _os71

_fp = S + '../art/game/figures.json'
_FIG = _json71.load(open(_fp, encoding='utf-8')) if _os71.path.exists(_fp) else {}

# 1. full-screen map
_b3("else if(ph=='remove'||ph=='hub'){",
    "else if(ph=='map'){u='icons/'+(rl=='ody'?'':rl+'/')+'ui_map.jpg';document.documentElement.classList.add('mapfull')}"
    "else if(ph=='remove'||ph=='hub'){")
_b3("classList.remove('scn')}catch(e){}instCap()", "classList.remove('scn','mapfull')}catch(e){}instCap()")

# 2. the enemy figure intro
_b3("if(GSOK()&&(G.boss||G.elt))gsap.delayedCall(.1,fxIntro)",
    # the enemy may not be set up yet when fight() returns, so look for its figure a moment later
    "if(GSOK())gsap.delayedCall(.1,()=>{if(G.boss||G.elt||(G.e&&FIG[G.e.nm]))fxIntro()})")
_b3("function fxIntro(){const B=G.boss?BOSS[G.bi]:ELITES[G.elt-1];if(!B)return;const boss=!!G.boss,",
    'const FIG=' + _json71.dumps(_FIG, ensure_ascii=False, separators=(',', ':')) + ';'
    "function fxIntro(){let B=G.boss?BOSS[G.bi]:G.elt?ELITES[G.elt-1]:null;"
    "if(!B){try{B=fo(G.rt[G.fi])}catch(e){}}if(!B||(G.e&&B.n!==G.e.nm&&FIG[G.e.nm]))B={n:G.e&&G.e.nm,ic:'',hint:''};"
    "const fig=G.e&&FIG[G.e.nm];if(!B||!B.n)return;const boss=!!G.boss,")
_b3("o.id='fxin';o.className=boss?'boss':'elite';", "o.id='fxin';o.className=(boss?'boss':G.elt?'elite':'reg')+(fig?' fig':'');")
_b3(":'Elite foe'}</div><div class=\"fxin-ic\">${B.ic||''}</div>",
    ":G.elt?'Elite foe':'Opponent'}</div>"
    "<div class=\"fxin-ic\">${fig?'':(B.ic||'')}</div>")
# the painting is the intro's own background (an <img> inside the animated icon box would be trapped by its transform)
_b3("document.body.appendChild(o);SFX.play(boss?'gong':'stamp');",
    "if(fig)o.style.backgroundImage=`linear-gradient(#0000 55%,#000b 100%),radial-gradient(ellipse at 50% 45%,#0000 55%,#0007 100%),url(art/game/figures/${fig}.webp)`;"
    "document.body.appendChild(o);SFX.play(boss?'gong':'stamp');")
_b3('.dft{position:absolute;inset:0;display:flex;',
    # full-screen map
    'html.mapfull body::before{background:radial-gradient(ellipse at 50% 50%,#0000 62%,#0008 100%),var(--scn) center/cover no-repeat!important;opacity:1!important}'
    'html.mapfull .tmap,html.mapfull[data-realm][data-hero] .tmap{background:none!important;box-shadow:none!important;border-color:transparent!important;border-image:none!important}'
    'html.mapfull .tmap:before,html.mapfull .tmap:after{display:none!important}'
    'html.mapfull .mapscr .ovt,html.mapfull .mapscr .dsub,html.mapfull .mapscr h1,html.mapfull .mapscr p{text-shadow:0 1px 2px #000,0 0 8px #000,0 0 16px #000c}'
    # figure intro: the fight background shows through, the enemy stands tall
    # round five: the figure is a full painting of the enemy in its scene, shown as the whole screen
    '#fxin.fig{background-color:#0b0908;background-size:cover;background-position:center;place-items:end center;padding-bottom:7vh;box-sizing:border-box}'
    '#fxin.fig .fxin-ic{font-size:0;filter:none}'
    '#fxin.fig .fxin-n,#fxin.fig .fxin-k,#fxin.fig .fxin-l{text-shadow:0 2px 4px #000,0 0 14px #000}'
    '#fxin.reg .fxin-k{color:#d8c79a}'
    '.dft{position:absolute;inset:0;display:flex;')
