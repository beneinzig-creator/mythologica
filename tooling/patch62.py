# v118 (patch62): Thoth's chrome, in his Egyptian style, shown in his runs (as patch55/57 did for Odin and Wukong).
# 1. Card frames: Thoth's cards use his own frames (codes tc/tu/tr/tl and spell variants in art/game/cards.json);
#    patch46/patch51 build their CSS. His Legendary joins the frame gleam list (patch58 adds the gold glisten).
# 2. Interface icons: a fourth icon set for the emoji-to-icon swap (art/game/icons/thoth/*.png).
#    Ammit and the Crocodiles of Sobek both used 🐊, so Ammit now shows the scales of judgement (⚖️) and each
#    gets its own medallion.
# 3. Archetype marks: Sundered, Scribes and Recorder (D/I/Y, Thoth's own archetypes, which had no marks yet),
#    and marks for his six regular opponents and two elites. Letters and digits are all taken, so those use
#    lowercase a-h; their files are arch_xa..arch_xh, since lowercase names would clash with the capitals on
#    macOS. Cards shared by several opponents (torch, drag, sting, curse2, heal2, sand) get no mark.
# 4. The lapis button plate, the gold ring-money Offering coin, the target marker and the card-back emblem (the
#    Eye of the Moon, Ben's pick: art/game/back/sigil_thoth.png), scoped to html[data-hero="thoth"].
import json as _json62

_ICMT = {'❤': 'life', '◆': 'mana', '⚡': 'action', '🏆': 'victory', '⚔': 'attack', '🛡': 'defense',
         '⇄': 'switch', '★': 'upgrade', '✖': 'cleared', '✓': 'chosen', '☰': 'menu', '🔮': 'foretold',
         '💰': 'gold', '🎁': 'gift', '⚓': 'start', '🔥': 'camp', '🔨': 'craft', '🏛': 'altar',
         '🔱': 'greataltar', '⛵': 'here', '💀': 'offering',
         '🦹': 'med_robbers', '🦂': 'med_scorpions', '🗿': 'med_servants', '🐊': 'med_sobek', '🐺': 'med_anubis',
         '🧙': 'med_heka', '⚖': 'med_ammit', '🦁': 'med_sphinx', '🐍': 'med_apophis', '🌪': 'med_set', '☀': 'med_sekhmet'}
_J = lambda o: _json62.dumps(o, ensure_ascii=False, separators=(',', ':'))

_b3("wukong:{d:'wukong/',m:ICMW,mi:ICMIW}},",
    "wukong:{d:'wukong/',m:ICMW,mi:ICMIW},thoth:{d:'thoth/',m:ICMT,mi:{}}},")
_b3("ICMW=", 'ICMT=' + _J(_ICMT) + ',ICMW=')
_b3("...Object.keys(ICMW),...Object.keys(ICMIW)])]", "...Object.keys(ICMW),...Object.keys(ICMIW),...Object.keys(ICMT)])]")
_b3("{n:'Ammit, the Devourer',l:18,ic:'🐊'", "{n:'Ammit, the Devourer',l:18,ic:'⚖️'")

_TAG62 = {'a': 'grob tdig fence mthief', 'b': 'sbrood sstalk squeen sking', 'c': 'shbs mumw embp tguard',
          'd': 'croc lurk sobpr sobek', 'e': 'jack jguard wepw jpack', 'f': 'hekp snake hekmag hekhigh',
          'g': 'ammit soulw unwor hguard2', 'h': 'sphinx2 sphg sphs'}
_ARCH62 = {'a': 'Robbers', 'b': 'Scorpions', 'c': 'Shabti', 'd': 'Crocodiles', 'e': 'Jackals', 'f': 'Heka',
           'g': 'Judgement', 'h': 'Riddles'}
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",
    'Object.assign(ARCH,' + _json62.dumps(_ARCH62) + ');'
    'for(const [t,ids] of Object.entries(' + _json62.dumps(_TAG62) + '))ids.split(" ").forEach(x=>{if(D[x])TAG[x]=t});'
    "fit();try{addEventListener('resize',fit)}catch(e){}")
_b3("AMK='PROZSKFMEBVHJGAULXCWT12345678'", "AMK='PROZSKFMEBVHJGAULXCWT12345678DIYabcdefgh'")
# lowercase marks live in arch_x<letter>.png
_b3("--am:url(art/game/icons/arch_${TAG[c.id]}.png)",
    "--am:url(art/game/icons/arch_${/[a-z]/.test(TAG[c.id])?'x'+TAG[c.id]:TAG[c.id]}.png)")

_b3('.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls{background:',
    '.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls,.cd.af-tl,.cd.af-tls{background:')
_b3('@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls{animation:none}}',
    '@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls,.cd.af-tl,.cd.af-tls{animation:none}}')

_b3('.dft{position:absolute;inset:0;display:flex;',
    'html[data-hero="thoth"] .cb:not(.gy)::after{background-image:url(art/game/back/sigil_thoth.png)}'
    'html[data-hero="thoth"] .b,html[data-hero="thoth"] .b.gh{border-image-source:url(art/game/icons/thoth/ui_button.png)!important}'
    'html[data-hero="thoth"] .cd.af .ar>.ob{background-image:url(art/game/icons/thoth/coin.png)}'
    'html[data-hero="thoth"].ody-ic .cd.qry::after{background-image:url(art/game/icons/thoth/target.png)}'
    '.dft{position:absolute;inset:0;display:flex;')
