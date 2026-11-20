# v114 (patch58): every backdrop gets particles of its own, and every Legendary glistens gold.
# 1. Particles: the old system (PTC in fx.js) had one effect per hero (sea motes, snow, embers). fx2.js
#    adds PTC2 and a table, PSPEC, with up to three layers for every fight background, screen, location,
#    map, victory and defeat painting: embers and sparks over fire, petals where flowers bloom, sea spray,
#    snow, sand, ghost wisps, fireflies, gold glints, rain with lightning in storms, and so on.
#    fxScene() works out which painting is on screen; render's fx hook now calls PTC2 instead of PTC.
#    Off with prefers-reduced-motion, as before.
# 2. Legendary glisten: patch52's gleam crossed only the frame's border, under the card picture, in pale
#    white at low strength, so it was easy to miss. Every Legendary card (with or without a picture, any
#    hero) now gets a warm gold sweep over the whole card, a soft gold glow around it, and twinkling glints
#    on the picture. The cards' rarity tag (s.rr.rL) picks them out.
_b3("function fxPost(){if(!GSOK())return;PTC.set(fxRealm());",
    open(S + 'fx2.js', encoding='utf-8').read() + "\nfunction fxPost(){if(!GSOK())return;PTC2.set(fxScene());")

_LG = '.cd:has(>s.rr.rL)'
_b3('.dft{position:absolute;inset:0;display:flex;',
    _LG + '::before{content:"";position:absolute;inset:-3px;border-radius:9px;z-index:6;pointer-events:none;'
    'background:linear-gradient(115deg,#0000 38%,#ffd06a00 41%,#ffd36e8c 47%,#fff4d0d9 50%,#ffd36e8c 53%,#ffd06a00 59%,#0000 62%) 140% 0/280% 100% no-repeat;'
    'mix-blend-mode:screen;box-shadow:0 0 8px 1px #ffc24f80,inset 0 0 6px #ffd77a66;animation:lglint 4.2s ease-in-out infinite}'
    + _LG + '>.ar::after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;'
    'background:radial-gradient(circle at 22% 30%,#fff8dc 0 1px,#ffd86a99 2px,#0000 5px),'
    'radial-gradient(circle at 74% 22%,#fff8dc 0 1px,#ffd86a99 2px,#0000 6px),'
    'radial-gradient(circle at 62% 74%,#fff8dc 0 1px,#ffd86a99 2px,#0000 5px),'
    'radial-gradient(circle at 34% 80%,#fff8dc 0 1px,#ffd86a99 2px,#0000 4px);'
    'animation:lspark 3.1s ease-in-out infinite}'
    '@keyframes lglint{0%{background-position:140% 0;box-shadow:0 0 6px 0 #ffc24f66,inset 0 0 5px #ffd77a4d}'
    '45%{box-shadow:0 0 14px 3px #ffc24fb3,inset 0 0 8px #ffd77a80}'
    '60%,100%{background-position:-40% 0;box-shadow:0 0 6px 0 #ffc24f66,inset 0 0 5px #ffd77a4d}}'
    '@keyframes lspark{0%,100%{opacity:0;transform:scale(.8)}25%{opacity:1;transform:scale(1)}50%{opacity:.2}75%{opacity:.9;transform:scale(1.05)}}'
    '@media (prefers-reduced-motion:reduce){' + _LG + '::before,' + _LG + '>.ar::after{animation:none}}'
    '.dft{position:absolute;inset:0;display:flex;')
