# v112 (patch56): Odin's painted screens, in his runs.
# patch52 styles Odysseus's map (sea chart), victory and defeat screens, location screens (campfire,
# crafting table, altar), the parchment boxes and the menu, all under html[data-hero="ody"]. This gives
# Odin the same treatment with his own paintings (art/game/icons/odin/ui_*.jpg) and his Norse Common
# frame (frames/oc.jpg) for the parchment borders: every Odysseus-scoped rule except the card-back sigil
# (patch55 has Odin's) is copied for Odin with those two swaps. The remove/duplicate/upgrade screen and
# the hub show Odin's location paintings too (patch53's LOCUI). The draft, boss-pick and One True God
# screens need nothing here: patch53 reads Odin's entries from art/game/screens.json.
import re as _re56, json as _json56

_rules = []
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _rules += _re56.findall(r'html\[data-hero="ody"\][^{]*\{[^}]*\}', globals()[_nm])
_rules = [r for r in _rules if 'sigil_ody' not in r]
assert len(_rules) >= 15, len(_rules)
_odin = ''.join(r.replace('html[data-hero="ody"]', 'html[data-hero="odin"]')
                 .replace('art/game/icons/ui_', 'art/game/icons/odin/ui_')
                 .replace('art/game/frames/c.jpg', 'art/game/frames/oc.jpg') for r in _rules)
_b3('.dft{position:absolute;inset:0;display:flex;', _odin + '.dft{position:absolute;inset:0;display:flex;')

_b3('LOCUI={"ody":{"camp":"icons/ui_camp.jpg","craft":"icons/ui_craft.jpg","altar":"icons/ui_altar.jpg"}}',
    'LOCUI={"ody":{"camp":"icons/ui_camp.jpg","craft":"icons/ui_craft.jpg","altar":"icons/ui_altar.jpg"},'
    '"odin":{"camp":"icons/odin/ui_camp.jpg","craft":"icons/odin/ui_craft.jpg","altar":"icons/odin/ui_altar.jpg"}}')

# Archetype marks for Odin's six regular opponents, as Odysseus's six have (Z/S/K/F/M/E): each card in
# those decks gets its opponent's archetype letter, which shows the mark on the type line and the
# "Archetype" line in the card's pop-up. Tags only change what is shown (the draft weighting reads tags
# of the hero's own cards, never an opponent's), and none of these cards appears in any other deck.
_TAG56 = {'J': 'pup wolf hati skoll fenr', 'G': 'ithrl rimew hgnt icesp',
          'A': 'dmin dsmith dxbow brokk golem anvl dshld drpn dbolt', 'U': 'ember fraid lava mgnt surtr fbolt mspear',
          'L': 'draug wight hgrd nidh hgrasp', 'X': 'lrav imp skinw lokis lsnare lcurse lgale lokib'}
_ARCH56 = {'J': 'Pack', 'G': 'Giants', 'A': 'Forge', 'U': 'Fire', 'L': 'Draugr', 'X': 'Trickery'}
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",
    'Object.assign(ARCH,' + _json56.dumps(_ARCH56) + ');'
    'for(const [t,ids] of Object.entries(' + _json56.dumps(_TAG56) + '))ids.split(" ").forEach(x=>{if(D[x])TAG[x]=t});'
    "fit();try{addEventListener('resize',fit)}catch(e){}")
_b3("AMK='PROZSKFMEBVH'", "AMK='PROZSKFMEBVHJGAULX'")

# patch52 updates <html data-hero> from CH a moment after each redraw (MutationObserver), so the first
# frame of an Odin run briefly used Odysseus's styling and fetched his images. Set it at the start of
# every render() as well.
_b3("function render(){try{const R=document.documentElement;R.style.setProperty('--scno','0');",
    "function render(){try{const R=document.documentElement;if(typeof CH!='undefined'&&R.dataset.hero!==CH)R.dataset.hero=CH;R.style.setProperty('--scno','0');")
