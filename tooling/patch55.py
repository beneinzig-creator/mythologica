# v111 (patch55): Odin's chrome, in his Norse style, shown in Odin's runs.
# 1. Card frames: Odin's cards use his own frames (codes oc/ou/or/ol and spell variants ocs/ous/ors/ols in
#    art/game/cards.json). patch46/patch51 already build the frame CSS for every code they find there, so
#    this only adds the Legendary shimmer for Odin's Legendary frame.
# 2. Interface icons: the emoji-to-icon swap (patch47) learns a second icon set and picks it by hero
#    (art/game/icons/odin/*.png). Map nodes for locations (.wn.loc) keep their location icon even where an
#    opponent shares the emoji (Muspelheim 🔥, Hel 💀, the Norns 🔮). Emoji with no Odin icon stay emoji.
# 3. Archetype marks Berserkers, Valhalla and Runes (art/game/icons/arch_B/V/H.png).
# 4. The oak-and-iron button plate, the Norse Offering coin and target marker, and the card-back emblem
#    (Gungnir in a rune ring, Ben's pick: art/game/back/sigil_odin.png), all scoped to html[data-hero="odin"].
import json as _json55

_ICMO = {'❤': 'life', '◆': 'mana', '⚡': 'action', '🏆': 'victory', '⚔': 'attack', '🛡': 'defense',
         '⇄': 'switch', '★': 'upgrade', '✖': 'cleared', '✓': 'chosen', '☰': 'menu', '🔮': 'foretold',
         '💰': 'gold', '🎁': 'gift', '👁': 'start', '🔥': 'camp', '🔨': 'craft', '🏛': 'altar',
         '🔱': 'greataltar', '⛵': 'here', '💀': 'offering',
         '🐺': 'med_fenrir', '🏔': 'med_jotnar', '⚒': 'med_forge', '🎭': 'med_loki', '🐲': 'med_fafnir',
         '🐍': 'med_jormungandr', '🌩': 'med_wildhunt', '🗿': 'med_hrungnir'}
_ICMIO = {'🔥': 'med_muspelheim', '💀': 'med_hel', '🔮': 'med_norns'}
_J = lambda o: _json55.dumps(o, ensure_ascii=False, separators=(',', ':'))

_b3("const ICK=Object.keys(ICM).sort(",
    'const ICMO=' + _J(_ICMO) + ',ICMIO=' + _J(_ICMIO) + ','
    "ICH={ody:{d:'',m:ICM,mi:ICMI},odin:{d:'odin/',m:ICMO,mi:ICMIO}},"
    "ICK=[...new Set([...Object.keys(ICM),...Object.keys(ICMO),...Object.keys(ICMIO)])].sort(")
_b3("if(typeof CH=='undefined'||CH!='ody'){R.classList.remove('ody-ic');return}R.classList.add('ody-ic');",
    "const HI=(typeof CH!='undefined')&&ICH[CH];if(!HI){R.classList.remove('ody-ic');return}R.classList.add('ody-ic');")
_b3("const mi=!!n.parentElement.closest('.mi'),",
    "const mi=!!n.parentElement.closest('.mi')&&!n.parentElement.closest('.wn.loc'),")
_b3("const nm=(mi&&ICMI[k])||ICM[k];",
    # an emoji with no icon for this hero is wrapped in .noic (skipped by the swap), so re-adding it
    # doesn't trigger the MutationObserver again
    "const nm=(mi&&HI.mi[k])||HI.m[k];if(!nm){const sp=document.createElement('span');sp.className='noic';sp.textContent=m;f.append(sp);last=off+m.length;return m}")
_b3("im.src='art/game/icons/'+nm+'.png';",
    "im.src='art/game/icons/'+HI.d+nm+'.png';")

_b3("AMK='PROZSKFME'", "AMK='PROZSKFMEBVH'")
_b3('.cd.af-l,.cd.af-ls{background:', '.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols{background:')
_b3('@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls{animation:none}}',
    '@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols{animation:none}}')

_b3('.dft{position:absolute;inset:0;display:flex;',
    'html[data-hero="odin"] .cb:not(.gy)::after{background-image:url(art/game/back/sigil_odin.png)}'
    'html[data-hero="odin"] .b,html[data-hero="odin"] .b.gh{border-image-source:url(art/game/icons/odin/ui_button.png)!important}'
    'html[data-hero="odin"] .cd.af .ar>.ob{background-image:url(art/game/icons/odin/coin.png)}'
    'html[data-hero="odin"].ody-ic .cd.qry::after{background-image:url(art/game/icons/odin/target.png)}'
    '.dft{position:absolute;inset:0;display:flex;')
