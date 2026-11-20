# v113 (patch57): Sun Wukong's chrome, in his Chinese (Ming, Journey to the West) style, shown in his runs.
# 1. Card frames: Wukong's cards use his own frames (codes wc/wu/wr/wl and spell variants wcs/wus/wrs/wls in
#    art/game/cards.json); patch46/patch51 build the frame CSS for every code there. This adds the Legendary
#    shimmer for his Legendary frame.
# 2. Interface icons: a third icon set for the emoji-to-icon swap (art/game/icons/wukong/*.png), as patch55 did
#    for Odin. The start point (⚓ on every hero's map) now shows the hero's own start icon for Odin too.
# 3. Archetype marks: Clones, Staff and Trickster for his own cards (arch_C/W/T), and marks for his eight regular
#    opponents. The letters are nearly all taken (Odysseus, Odin and Thoth), so those use the digits 1 to 8.
#    Cards shared by two opponents (hrope, hbot, hnet, cocn, rflm) get no mark. Tags only change what is shown.
# 4. The red-lacquer button plate, the bronze cash-coin Offering coin, the target marker and the card-back
#    emblem (the somersault cloud, Ben's pick: art/game/back/sigil_wukong.png), scoped to html[data-hero="wukong"].
import json as _json57

_ICMW = {'❤': 'life', '◆': 'mana', '⚡': 'action', '🏆': 'victory', '⚔': 'attack', '🛡': 'defense',
         '⇄': 'switch', '★': 'upgrade', '✖': 'cleared', '✓': 'chosen', '☰': 'menu', '🔮': 'foretold',
         '💰': 'gold', '🎁': 'gift', '⚓': 'start', '🔥': 'camp', '🔨': 'craft', '🏛': 'altar',
         '🔱': 'greataltar', '⛵': 'here', '💀': 'offering',
         '☁': 'med_heavenlyhost', '🕷': 'med_spider', '🏺': 'med_hornkings', '🌪': 'med_yellowwind',
         '👁': 'med_erlang', '🪭': 'med_ironfan', '🐵': 'med_macaque', '👹': 'med_bulldemon', '🖐': 'med_buddhapalm'}
_ICMIW = {'💀': 'med_whitebone', '🔥': 'med_redboy'}
_J = lambda o: _json57.dumps(o, ensure_ascii=False, separators=(',', ':'))

_b3("ICH={ody:{d:'',m:ICM,mi:ICMI},odin:{d:'odin/',m:ICMO,mi:ICMIO}},"
    "ICK=[...new Set([...Object.keys(ICM),...Object.keys(ICMO),...Object.keys(ICMIO)])]",
    'ICMW=' + _J(_ICMW) + ',ICMIW=' + _J(_ICMIW) + ','
    "ICH={ody:{d:'',m:ICM,mi:ICMI},odin:{d:'odin/',m:Object.assign({'⚓':'start'},ICMO),mi:ICMIO},wukong:{d:'wukong/',m:ICMW,mi:ICMIW}},"
    "ICK=[...new Set([...Object.keys(ICM),...Object.keys(ICMO),...Object.keys(ICMIO),...Object.keys(ICMW),...Object.keys(ICMIW)])]")

_TAG57 = {'1': 'bone bsk bghl bhag bsp', '2': 'decree hsd hhd hgn hnz hpg hth', '3': 'cweb spd1 spd2 spd3 spdq',
          '4': 'gourd hsol hcap hsil hgol', '5': 'sfire rimp rgrd rspr rboy', '6': 'ywind ybat ytig ydef ygen ygale',
          '7': 'eye eplum ehnd eerl esw', '8': 'ifan iwnd imaid iguard iprin'}
_ARCH57 = {'1': 'Bone Spirits', '2': 'Heaven', '3': 'Spiders', '4': 'Gourd', '5': 'Samadhi Fire', '6': 'Wind',
           '7': 'Third Eye', '8': 'Fan'}
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",
    'Object.assign(ARCH,' + _json57.dumps(_ARCH57) + ');'
    'for(const [t,ids] of Object.entries(' + _json57.dumps(_TAG57) + '))ids.split(" ").forEach(x=>{if(D[x])TAG[x]=t});'
    "fit();try{addEventListener('resize',fit)}catch(e){}")
_b3("AMK='PROZSKFMEBVHJGAULX'", "AMK='PROZSKFMEBVHJGAULXCWT12345678'")

_b3('.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols{background:', '.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls{background:')
_b3('@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols{animation:none}}',
    '@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls{animation:none}}')

_b3('.dft{position:absolute;inset:0;display:flex;',
    'html[data-hero="wukong"] .cb:not(.gy)::after{background-image:url(art/game/back/sigil_wukong.png)}'
    'html[data-hero="wukong"] .b,html[data-hero="wukong"] .b.gh{border-image-source:url(art/game/icons/wukong/ui_button.png)!important}'
    'html[data-hero="wukong"] .cd.af .ar>.ob{background-image:url(art/game/icons/wukong/coin.png)}'
    'html[data-hero="wukong"].ody-ic .cd.qry::after{background-image:url(art/game/icons/wukong/target.png)}'
    '.dft{position:absolute;inset:0;display:flex;')
