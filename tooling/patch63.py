# v119 (patch63): Ben's playtest notes on buttons, the tutorial box and tutorial art.
# 1. No plain dark boxes left as buttons. The hero tiles on the start screen and the lesson tiles in
#    How to Play become parchment cards in a painted frame: each hero tile in its own hero's Common frame,
#    the lessons in the frame of the hero whose tab is open.
# 2. The hero tabs in How to Play lose their emojis (just the names now).
# 3. The tutorial and tip box in the corner of a fight is 25% bigger and framed with the current hero's
#    Uncommon card frame, on parchment.
# 4. Thoth's runs get the same parchment boxes (menu, victory, defeat tablets) as the other heroes, in his
#    Common frame. His painted screens don't exist yet, so only the rules without a painting are copied.
# 5. Painted backgrounds for the tutorial: the reading screens (How to Play, a lesson's text pages) show the
#    Hall of Myths, and a tutorial fight shows the training ground of the hero being taught, where it has one
#    (art/game/screens.json: tuttext, tutfight).
import re as _re63

_FR = {'ody': '', 'odin': 'o', 'wukong': 'w', 'thoth': 't'}

# 2. no emoji on the hero tabs
_b3('data-b="tuth:${k}">${C.ic} ${C.n.split(\',\')[0]}', 'data-b="tuth:${k}">${C.n.split(\',\')[0]}')

_css = []
# 1. framed parchment tiles
_tile = ('background:linear-gradient(#efe4c8,#ddcfa9)!important;color:#1b1710!important;border:12px solid #5e4520!important;'
         'border-image:url(art/game/frames/{p}c.jpg) 58 round!important;border-radius:6px!important;'
         'box-shadow:0 8px 22px #000b!important')
_css.append('.htile,.tutl{' + _tile.format(p='') + '}')
for h, p in _FR.items():
    _css.append(f'.htile[data-b="hsel:{h}"]{{border-image-source:url(art/game/frames/{p}c.jpg)!important}}')
    _css.append(f'#app:has(.tuttab.on[data-b="tuth:{h}"]) .tutl{{border-image-source:url(art/game/frames/{p}c.jpg)!important}}')
_css.append('.htile .hnm,.htile .har,.tutl .tutt,.tutl .tuts{color:#1b1710!important;text-shadow:none!important}'
            '.tutl .tutn{color:#8a2a14!important}.tutl .tutok{color:#2f6a2a!important}'
            '.htile.on{box-shadow:0 0 0 3px var(--gold),0 0 26px var(--gl),0 8px 22px #000b!important}'
            '.htile .har{opacity:1!important;color:#4a3618!important;font-weight:600}'
            # the mana drop on the orb was hard to read at 20px
            '.me .orb .ico{width:27px!important;height:27px!important}'
            '.htile:not(.on){opacity:.8!important}.htile:hover,.tutl:hover{filter:brightness(1.06)}')

# 3. the tutorial / tip box: 25% bigger, in the hero's Uncommon frame
_css.append('#tutc{width:min(450px,calc(100vw - 28px))!important;font-size:1.25em;padding:14px 16px!important;'
            'background:linear-gradient(#efe4c8,#ddcfa9)!important;color:#1b1710!important;border:16px solid #5e4520!important;'
            'border-image:url(art/game/frames/u.jpg) 58 round!important;border-radius:6px!important;box-shadow:0 14px 40px #000d!important}'
            '#tutc .tutch{color:#7a2a12!important;font-size:1.15em}#tutc .tutx{color:#4a3a22!important}'
            '#tutc .tutcm b,#tutc .tutcm strong{color:#7a3a08!important}'
            '@media (max-width:700px){#tutc{width:min(375px,75vw)!important;font-size:15px}}')
for h, p in _FR.items():
    _css.append(f'html[data-hero="{h}"] #tutc{{border-image-source:url(art/game/frames/{p}u.jpg)!important}}')

# 4. Thoth's parchment boxes: the Odysseus-scoped rules without a painted screen, in Thoth's Common frame
_rules = []
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _rules += _re63.findall(r'html\[data-hero="ody"\][^{]*\{[^}]*\}', globals()[_nm])
_rules = [r for r in _rules if 'sigil_ody' not in r and 'icons/ui_' not in r]
_css.append(''.join(r.replace('html[data-hero="ody"]', 'html[data-hero="thoth"]')
                    .replace('art/game/frames/c.jpg', 'art/game/frames/tc.jpg') for r in _rules))

_b3('.dft{position:absolute;inset:0;display:flex;', ''.join(_css) + '.dft{position:absolute;inset:0;display:flex;')

# 5. tutorial backgrounds: tuttext for the reading screens, tutfight for a lesson's fight
_b3("if(ph=='draft'||ph=='otg'||ph=='bossp'){",
    "if(ph=='tutmenu'||ph=='tutjourney'||ph=='tutend'){const id=(SCR.ody||{}).tuttext;if(id)u='scenes/'+id+'.jpg'}"
    "else if(G.tut&&(SCR[rl]||{}).tutfight&&['main','enemy','blockP','dmgP','nextf'].includes(ph)){u='scenes/'+SCR[rl].tutfight+'.jpg'}"
    "else if(ph=='draft'||ph=='otg'||ph=='bossp'){")
