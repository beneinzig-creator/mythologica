# v116 (patch60): Sun Wukong's painted screens in his runs, as patch56 did for Odin.
# patch52 styles Odysseus's map, victory and defeat screens, location screens (campfire, crafting table, altar),
# the parchment boxes and the menu under html[data-hero="ody"]. This copies each of those rules for Wukong
# with his paintings (art/game/icons/wukong/ui_*.jpg) and his Common frame (frames/wc.jpg) for the parchment
# borders. The card-back sigil rule is skipped (patch57 has Wukong's). The remove/duplicate/upgrade screen and
# the hub show his location paintings too (patch53's LOCUI).
import re as _re60

_rules = []
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _rules += _re60.findall(r'html\[data-hero="ody"\][^{]*\{[^}]*\}', globals()[_nm])
_rules = [r for r in _rules if 'sigil_ody' not in r]
assert len(_rules) >= 15, len(_rules)
_wk = ''.join(r.replace('html[data-hero="ody"]', 'html[data-hero="wukong"]')
               .replace('art/game/icons/ui_', 'art/game/icons/wukong/ui_')
               .replace('art/game/frames/c.jpg', 'art/game/frames/wc.jpg') for r in _rules)
_b3('.dft{position:absolute;inset:0;display:flex;', _wk + '.dft{position:absolute;inset:0;display:flex;')

_b3('"odin":{"camp":"icons/odin/ui_camp.jpg","craft":"icons/odin/ui_craft.jpg","altar":"icons/odin/ui_altar.jpg"}}',
    '"odin":{"camp":"icons/odin/ui_camp.jpg","craft":"icons/odin/ui_craft.jpg","altar":"icons/odin/ui_altar.jpg"},'
    '"wukong":{"camp":"icons/wukong/ui_camp.jpg","craft":"icons/wukong/ui_craft.jpg","altar":"icons/wukong/ui_altar.jpg"}}')
