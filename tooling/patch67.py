# v121 (patch67): Thoth's painted screens in his runs, as patch56/patch60 did for Odin and Wukong.
# patch63 already copied the Odysseus-scoped parchment rules for Thoth (those without a painting). This copies the
# rest, the ones that show a painting (map, victory, defeat, campfire, crafting table, altar), with Thoth's own
# paintings (art/game/icons/thoth/ui_*.jpg), and gives his remove/duplicate/upgrade screen and hub his location
# paintings (patch53's LOCUI). His and Wukong's draft, boss-pick and One True God screens need nothing here:
# patch53 reads them from art/game/screens.json.
import re as _re67

_rules = []
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _rules += _re67.findall(r'html\[data-hero="ody"\][^{]*\{[^}]*\}', globals()[_nm])
_rules = [r for r in _rules if 'icons/ui_' in r]
assert len(_rules) >= 5, len(_rules)
_th = ''.join(r.replace('html[data-hero="ody"]', 'html[data-hero="thoth"]')
               .replace('art/game/icons/ui_', 'art/game/icons/thoth/ui_')
               .replace('art/game/frames/c.jpg', 'art/game/frames/tc.jpg') for r in _rules)
_b3('.dft{position:absolute;inset:0;display:flex;', _th + '.dft{position:absolute;inset:0;display:flex;')

_b3('"wukong":{"camp":"icons/wukong/ui_camp.jpg","craft":"icons/wukong/ui_craft.jpg","altar":"icons/wukong/ui_altar.jpg"}}',
    '"wukong":{"camp":"icons/wukong/ui_camp.jpg","craft":"icons/wukong/ui_craft.jpg","altar":"icons/wukong/ui_altar.jpg"},'
    '"thoth":{"camp":"icons/thoth/ui_camp.jpg","craft":"icons/thoth/ui_craft.jpg","altar":"icons/thoth/ui_altar.jpg"}}')
