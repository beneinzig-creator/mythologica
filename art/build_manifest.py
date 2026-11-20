#!/usr/bin/env python3
"""Build art/manifest.json (one image prompt per card) from the game's own data.

    python3 art/build_manifest.py            # Odysseus (default)
    python3 art/build_manifest.py --hero odin

It reads tooling/n1.html and runs the game script once in macOS's built-in
JavaScript engine (osascript -l JavaScript, no Node.js needed), with the
browser parts stubbed out. That gives the real, final D / LORE / TAG / RAR
tables after all patches, and the hero's card list from CHARS.
Prompts = the shared style block (see art/STYLE.md) + a subject line, taken
from art/subjects.json when a card has one there, otherwise built from data.
"""
import argparse, json, os, re, subprocess, sys, tempfile

ART = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(ART)
SRC = os.path.join(ROOT, 'tooling', 'n1.html')

HERO_DIR = {'ody': 'odysseus', 'odin': 'odin', 'wukong': 'wukong'}
TYPE = {'C': 'Army member', 'I': 'Quick spell', 'S': 'Spell', 'E': 'Modifier', 'A': 'Item'}
RARITY = {'C': 'Common', 'U': 'Uncommon', 'R': 'Rare', 'L': 'Legendary'}
SETTING = {
    'ody': 'Greek myth as told in Homer, Hesiod and the Greek tragedies, depicted faithfully to those '
           'stories: bronze armour, crested helmets, round aspis shields, linen chitons, black ships, the '
           'wine-dark Aegean sea, white limestone, temples, cypress, smoke and fire',
    'odin': 'Viking Age Norse myth: iron mail, round wooden shields, furs, runestones, longhalls, '
            'ravens, wolves, fjords, snow and northern sky',
    'wukong': 'Journey to the West, classical Chinese myth: silk robes, lacquered armour, temples, '
              'clouds, mountains, celestial palaces',
}
# A hero's own look, laid over the shared card style. Same rules as Odysseus (tight framing, one distinct
# shot per card, rarity in the framing), but a different art experience per mythology.
HERO_STYLE = {
    'wukong': ('Chinese look for this hero: the same 1990s hand-made card art, but painted in the manner of classical '
               'Chinese painting and the illustrated Ming editions of Journey to the West. Fluid, calligraphic brush '
               'lines that swell and taper, never hard woodcut or pen hatching. Figures in the fine-line gongbi manner '
               'with flat, bold mineral colours (cinnabar red, azurite blue, malachite green, gold); backgrounds in loose '
               'xieyi ink wash: misty peaks, pines, waterfalls, splashed ink. Clouds are '
               'drawn as curling auspicious-cloud scrolls. Faces and poses are bold and theatrical, like Peking opera. '
               'Every card has its own strong colour key (given under Light and colour) that fills the whole picture, '
               'background included: a warm rice-paper ground is only one of many grounds, and most cards should instead be '
               'washed in their own colour, such as deep azurite night, jade bamboo green, cinnabar palace red, violet dusk '
               'or storm-grey ink, so that no two cards share the same cream background. Brighter and more colourful than '
               'the Greek and Norse cards, but never washed out. '
               'Not Japanese, not samurai, not anime, not modern Chinese fantasy game art, no restaurant-style dragons. '
               'Only paint Sun Wukong himself (golden fur, phoenix-feather cap with long plumes, golden armour, red cape) when '
               'the subject names him; any other monkey is an ordinary monkey of Flower-Fruit Mountain with brown or grey fur '
               'and simple clothes, never his cap, armour or face. '
               'Focus over scenery: the card\'s subject is the star of the picture and should look as striking and '
               'powerful as possible, large and unmistakable at a glance. The background is simple, atmospheric and '
               'secondary, and no second large figure or creature competes with the subject unless the card is about '
               'that creature.'),
    'odin': ('Norse look for this hero: the same 1990s hand-made card art, but colder and harder than the Greek '
             'cards. Heavier, rougher black ink lines with a carved, woodcut-like quality, as if cut into wood or '
             'stone; flat areas of colour broken by scratchy hatching. A northern base of slate, iron grey, bone white '
             'and pine, but every card has its own strong colour key (given under Light and colour) that dominates '
             'the picture: bold and saturated, such as deep blood red, aurora green and violet, velvet purple, ember '
             'orange, glacier blue or midnight-sun gold, so the cards never all read as grey-blue. No warm '
             'Mediterranean light, no sunsets over a warm sea, no bronze glow. Weather matters: snow, sleet, sea-spray, mist and '
             'long winter dusk. Where the picture shows objects, give them Viking Age ornament: interlaced beasts '
             'and knotwork carved on wood, iron and runestones in the Urnes and Mammen styles, and the look of the '
             'Gotland picture-stones. People are weathered and heavy, in wool, fur, leather and iron; '
             'no horned helmets, no winged helmets, no fantasy plate armour. '
             'Focus over scenery: the card\'s subject is the star of the picture and should look as striking and '
             'powerful as possible, large and unmistakable at a glance. The background is simple, atmospheric and '
             'secondary, and no second large figure or creature competes with the subject unless the card is '
             'about that creature.'),
}
ACCENT = {
    'W': 'warm gold daylight, white marble and bronze accents',
    'U': 'moonlit sea-teal, cool mist and silver accents',
    'B': 'bone, ash and underworld green-black with ember accents',
    'R': 'firelight, oxblood and burnished copper accents',
    'G': 'olive and deep forest-green accents',
    'A': 'aged bronze, stone and candlelight accents',
}
# Keyword letters (D[id][5]) that change how a figure should be posed.
POSE = {
    'f': 'airborne, wings or flight against an open sky',
    'p': 'braced in a defensive stance behind a shield',
    'r': 'aggressive, mid-charge, weapon raised',
    'h': 'surging forward at speed',
    'o': 'solemn and sacred, with altar smoke or offering-fire nearby',
    'k': 'immovable, planted like a wall',
    'z': 'scarred, battered but unbroken',
}

STYLE = (
    'Fantasy trading-card illustration in the style of early-to-mid 1990s card art: hand-made traditional '
    'media (gouache, acrylic, watercolour and pen-and-ink), visible brushstrokes and pen lines, matte paper '
    'texture, and the slightly soft, faded look of a card printed in the 1990s. Expressive and a little '
    'stylised rather than realistic: strong shapes, bold silhouettes, sometimes inked outlines and flat '
    'patterned colour. Dark overall with near-black shadows, lit by bold, saturated accent colours '
    'taken from the card\'s own light and colour key (no default orange) where they matter. Frame the subject tightly: it fills most of '
    'the picture and may be cropped by the edges, with its face or focal point near the centre; keep the '
    'background minimal, simple and dark. Landscape 3:2 composition. No text, no letters, no '
    'border, no card frame, no logo, no watermark, no signature. Not photorealistic, not 3D render, not '
    'modern digital concept art, not anime.'
)

# Fight backgrounds: one per opponent, settings in art/scenes.json. Deliberately rougher than the
# card art: Ben wants these clearly hand-painted, not polished or realistic (Nov 2026).
SCENE_BASE = (
    'A wide background illustration for the battle screen of a mythology card game, made by hand like a 1993 fantasy '
    'trading-card or game-book illustration: bold, wobbly black pen-and-ink outlines around every shape, filled with '
    'thin, flat, transparent watercolour and gouache washes. Big simple flat shapes of colour with almost no '
    'shading or modelling, a little ink cross-hatching in the shadows, blotchy uneven washes with hard dried edges, '
    'splatters and visible brush marks, and the rough off-white paper texture and grain clearly showing through the '
    'paint. Naive, slightly clumsy, decorative and stylised, like an old printed card with slightly faded, misregistered '
    'colour. A limited palette of 4 or 5 colours, dark overall. Absolutely not realistic: no realistic lighting, no '
    'glow, no soft gradients, no depth of field, no fine detail or texture rendering, no oil-painting look, no 3D, no '
    'digital painting, not modern concept art. '
    'Composition for a game board: low contrast, all the interesting shapes at the edges and in the bottom corners; '
    'the centre is a calm, empty, evenly dark area, because game cards sit on top of it. No figures or creatures in the '
    'centre. No text, no letters, no border, no frame, no logo, no signature.'
)

# Card frames: one blank template per rarity, per hero. Each hero's frames follow their own
# mythology (only Odysseus's Greek set exists so far); a hero's opponents share their frames.
# Card frames: one blank template per rarity. The game draws name, cost, type, rules and
# power/health on top, and puts the card art in the black window.
FRAME_BASE = (
    'A blank, empty trading-card frame template for a card game based on the Odyssey and Greek myth, seen perfectly flat and '
    'straight-on, filling the whole image edge to edge, portrait orientation. Layout from top to bottom: '
    'a narrow horizontal title bar across the top with a round empty medallion at its right end; below it a '
    'large rectangular art window taking up about the upper half of the card, filled with solid flat pure '
    'black (#000000) with crisp straight edges; below that a thin horizontal type bar; below that a large '
    'empty rectangular text box of pale aged parchment; at the bottom right a small empty plaque overlapping '
    'the corner of the text box. The title bar, medallion, type bar, text box and plaque are completely '
    'blank. Style: a rustic, retro 1990s hand-painted trading-card frame, gouache and ink texture, worn and '
    'weathered like an old printed card, muted colours, matte with no glossy highlights, no glow, no light '
    'rays, no sky, symmetrical with clean edges. Absolutely no text, no letters, no numbers, no symbols, no logo, no '
    'watermark, and nothing inside the black window.'
)
FRAMES = {'ody': {
    'common': 'Common rarity: a plain frame of dark weathered bronze and grey stone with a simple thin '
              'Greek key (meander) border, modest and unornamented.',
    'uncommon': 'Uncommon rarity: a frame of polished silver and dark bronze with a fine Greek key border '
                'and small laurel-leaf ornaments at the corners.',
    'rare': 'Rare rarity: a frame of burnished gold over dark marble with an elegant Greek key border, small '
            'inset garnet gems at the corners and a laurel motif above the art window.',
    'legendary': 'Legendary rarity: an aged, hand-tooled frame of dull antique gold leaf over dark tarnished '
                 'bronze, worn at the edges, a restrained Greek key border and a single small laurel wreath at '
                 'the top centre, like a weathered relic in a museum case; richer than the other rarities but '
                 'still rustic and understated.',
}}

# Odin (Norse). The shared FRAME_BASE / MEDAL_BASE text names Greek myth; for other heroes it is swapped
# (see HERO_MYTH / MEDAL_LOOK), so Odysseus's prompts stay exactly as they were.
NORSE_LOOK = ('Norse, Viking Age look, colder and harder than the Greek set: heavy, rough carved lines like wood or '
              'stone cut with a knife, a northern palette of iron grey, slate blue, dark pine and bone white with '
              'sparing tarnished gold or blood red; no warm Mediterranean light, no glow, no Greek key, no laurel.')
FRAMES['odin'] = {
    'common': 'Common rarity: a plain frame of dark weathered pine boards bound with black iron straps and nail heads, '
              'a simple thin carved rope-twist border, modest and unornamented. ' + NORSE_LOOK,
    'uncommon': 'Uncommon rarity: a frame of dark iron and worn silver with a fine border of interlaced knotwork '
                '(Borre-style ring chain) and small silver rivets at the corners. ' + NORSE_LOOK,
    'rare': 'Rare rarity: a frame of gilded bronze over dark oak with a border of gripping-beast knotwork in the '
            'Urnes style, small garnet cloisonne studs at the corners and a carved interlaced beast above the art '
            'window. ' + NORSE_LOOK,
    'legendary': 'Legendary rarity: an aged, hand-tooled frame of dull antique gold over dark tarnished iron, worn at '
                 'the edges, a restrained border of Mammen-style interlace and a single small carved raven head at the '
                 'top centre, like a weathered grave-goods relic in a museum case; richer than the other rarities but '
                 'still rustic and understated. ' + NORSE_LOOK,
}
HERO_MYTH = {'ody': 'the Odyssey and Greek myth', 'odin': 'the Norse Eddas and sagas',
             'wukong': 'Journey to the West and classical Chinese myth'}
MEDAL_LOOK = {'odin': 'a worn silver Viking pendant or a roundel from a Gotland picture-stone',
              'wukong': 'a carved cinnabar-lacquer or jade roundel from the Ming dynasty'}

# How played each rarity looks: cheaper cards have been shuffled more.
CONDITION = {
    'common': 'Heavily played condition: whitened, rounded and slightly dog-eared corners, frayed edges, a '
              'soft crease or two across the frame, small scuffs and scratches, light grime and faded ink, '
              'like a much-loved card shuffled hundreds of times.',
    'uncommon': 'Moderately played condition: whitened corners, light wear along the edges, a few small '
                'scuffs, slightly faded ink.',
    'rare': 'Lightly played condition: faint whitening on the corners and a few tiny nicks along the edges.',
    'legendary': 'Near-mint condition: aged and antique, but no play wear, creases or scuffs.',
}
WEAR_NOTE = 'The wear is on the frame only; the black art window stays solid, untouched black.'

# Small game icons that replace emoji, per hero (each hero's icons follow their own mythology).
ICON_BASE = (
    'A single small game icon, painted in a rustic 1990s hand-painted trading-card style (gouache and ink, '
    'muted antique colours, matte, slightly worn), with a bold, simple silhouette that still reads at 16 '
    'pixels. Centred with generous empty margin, on a fully transparent background. No text, no letters, no '
    'numbers, no border, no badge or circle behind it, no drop shadow.'
)
ICONS = {'ody': {
    # interface
    'life': 'Life: a heart of deep red enamel set in a worn bronze rim.',
    'mana': 'Mana: a single glowing drop of golden ichor, the blood of the gods, with a soft inner light.',
    'action': 'Action points: a small bronze thunderbolt of Zeus, a jagged zig-zag with a few sparks.',
    'victory': 'Victory points: a green-and-gold laurel wreath closed into a ring.',
    'attack': 'Attack form: two crossed bronze Greek short swords (xiphos) with leather-wrapped grips.',
    'defense': 'Defense form: a round bronze Greek aspis shield with a raised rim and a simple painted emblem.',
    'switch': 'Switch stance: two curved bronze arrows chasing each other in a circle, one tipped red and one tipped blue.',
    'upgrade': 'Upgrade level: a single small golden laurel leaf, glinting.',
    'target': 'Choose a target: a bronze arrowhead pointing straight down, with a faint red glow.',
    'cleared': 'Fight won: a broken Greek spear, snapped in two, the halves crossed.',
    'chosen': 'Chosen: a tick mark painted in gold leaf with one confident brush stroke.',
    'menu': 'Menu: three short horizontal bronze bars stacked neatly, like ridges on an old bronze plaque.',
    'sacrilege': 'The sun god\'s anger: the blazing sun disc of Helios with fierce rays.',
    'foretold': 'Foretold: the bronze three-legged tripod of the Delphic oracle with a thin wisp of vapour.',
    'gold': 'Gold: a small heap of silver drachma coins stamped with owls.',
    'whirlpool': 'Whirlpool: a churning dark-blue whirlpool seen from above, spiralling inward.',
    'gift': 'Gift: a small wooden chest bound in bronze, its lid slightly open with warm golden light inside.',
    # map
    'start': 'Starting point and emblem of Odysseus: a bronze anchor wrapped with rope.',
    'here': 'You are here: a small black Greek ship with a square sail and a painted eye on the prow, seen from the side.',
    'camp': 'Campfire: a small driftwood fire burning on beach stones.',
    'craft': 'Crafting table: the hammer and anvil of Hephaestus with a glowing ember.',
    'altar': 'Altar: a small stone altar with a thin column of offering smoke.',
    'greataltar': 'The great altar: the trident of Poseidon standing upright, faintly glowing.',
    'coin': 'The Offering coin: a single antique silver Greek drachma seen perfectly straight-on, filling the frame, '
            'worn and tarnished with a raised rim, small nicks and scratches, dark grime in the recesses and soft '
            'rubbed highlights, its face mostly smooth with a faint, low-relief skull wreathed in laurel struck in the '
            'centre. Matte, painted like the weathered frames of an old trading card; no shine, no text, no letters, no numbers.',
    'offering': 'The icon for the Offering (sacrifice) value on a Greek-mythology card: a weathered, '
                'bone-white human skull seen from the front, aged and slightly cracked like an ancient relic, '
                'with a thin sprig of laurel leaves tucked behind it. Solid and opaque, no glow, no smoke.',
}}

# Home screen ("Choose your character"): one portrait per hero in their own mythology's style,
# plus the background painting.
PORTRAIT_BASE = (
    'A hero portrait for a card game\'s character-select screen, made by hand like a 1993 fantasy trading-card or '
    'game-book illustration, the same look as the game\'s cards: confident black pen-and-ink outlines around every '
    'shape, ink hatching in the shadows, filled with flat, slightly blotchy gouache and watercolour washes, visible '
    'brush marks and the rough off-white paper grain showing through, colours a little faded and misregistered like '
    'an old printed card. A limited palette of 4 or 5 colours, dark overall. Stylised and graphic with bold simple '
    'shapes, not realistic: no smooth skin rendering, no soft glow, no rim light, no sunset glare, no depth of field, '
    'no oil-painting polish, no 3D, not modern digital concept art, not a heroic movie poster. '
    'Not head-on and not looking at the viewer: the figure is seen from an angle, caught in a moment of their story. '
    'Head and upper body fill the square and may be cropped by the edges; the background is simple and dark and '
    'falls to near-black at the edges so it sits on a dark screen. No text, no letters, no border, no frame, no logo.'
)
HOME = {
    'ody': ('Odysseus, king of Ithaca, seen in three-quarter view from slightly below and to the side, standing at '
            'the stern of his black Greek ship and gripping the steering oar, his head turned away over his shoulder '
            'as he looks back across the wine-dark sea, eyes narrowed and calculating. A weathered, bearded man in a '
            'simple felt sailor\'s cap and a patched, salt-stained cloak over plain bronze armour. Night sea, a '
            'single pale moon, the ship\'s painted eye on the hull at the edge of the picture. Greek in every detail, '
            'colours of deep sea blue, black and dull bronze.'),
    'odin': ('Odin the Allfather of Norse myth, seen in profile from the side, walking into a cold wind with his head '
             'bowed, the brim of his wide hat hiding his single eye in shadow, his long grey beard and dark blue '
             'cloak blown sideways, leaning on the spear Gungnir like a wanderer\'s staff. One raven perched on his '
             'shoulder and a second flying past. Snowy northern night, a carved runestone with knotwork beside him. '
             'Colours of slate blue, grey and bone white.'),
    'wukong': ('Sun Wukong, the Monkey King of Journey to the West, seen from above and behind at a steep angle, '
               'crouched on a curling cloud and turning his head back toward the viewer with a sly grin, his '
               'red-and-gold staff balanced across his shoulders, golden fur, the golden fillet on his brow and a '
               'phoenix-feather cap. Misty ink-wash mountain peaks far below. Colours of red, dull gold and ink '
               'black, with the brush rhythm of classical Chinese ink painting mixed into the pen-and-ink style.'),
}
HOME_BG = (
    'A wide, very dark, atmospheric background painting for the title screen of a mythology card game: a vast '
    'night sea under stars, with faint distant silhouettes along the horizon from three mythologies: a Greek '
    'temple on a cliff at the left, a Norse longhall beneath the great world tree in the middle distance, '
    'Chinese mountain peaks and a pagoda among clouds at the right. Low contrast and dark overall, most of the '
    'detail near the edges and bottom, the centre calm and empty so a title and buttons can sit on top. '
    'Rustic 1990s hand-painted style, gouache, matte. No text, no letters, no people in the foreground.'
)

# Opponent medallions: round portraits shown on map nodes, tips and the fight screen.
MEDAL_BASE = (
    'A round medallion portrait for a game map, painted like an old bronze coin or a roundel from a Greek '
    'vase: a circular picture with a worn bronze rim that fills the frame, on a fully transparent '
    'background outside the circle. Rustic 1990s hand-painted style, gouache, bold and readable at 32 '
    'pixels. No text, no letters.'
)
MEDALS = {'ody': {
    'lotus': 'The Lotus-Eaters: a drooping lotus flower with sleepy, half-closed petals.',
    'sirens': 'The Sirens: a Siren as the Greeks painted her, a woman\'s head on a bird\'s body, singing.',
    'poly': 'Polyphemus: the single great glaring eye of the Cyclops in a craggy face.',
    'shades': 'The Shades of Hades: a pale, mournful ghostly face fading into grey mist.',
    'phaeacians': 'The Phaeacians: a swift Phaeacian ship with oars out on a calm sea.',
    'cicones': 'The Cicones: a Thracian battle axe with a painted round shield behind it.',
    'circe': 'Circe: a pig beside a golden cup.',
    'cattle': 'The Cattle of the Sun: a sacred white cow with a golden sun disc between her horns.',
    'hector': 'Hector: a Trojan helmet with a tall horse-hair crest.',
    'scylla': 'Scylla: snarling dog-like heads on long necks rising from a sea cave.',
    'charybdis': 'Charybdis: the open maw of a whirlpool, dark water spiralling down.',
}}
# Game-wide card back and its sigil options (the sigil is a separate layer so Ben can pick one).
BACK = (
    'The back of a trading card for Mythologica, a card game of world mythologies, seen perfectly flat and '
    'straight-on, filling the whole image: a sleek, minimal design. A deep, dark sea-blue field with a subtle '
    'worn texture, one thin bronze border inset from the edge with small, simple corner ornaments, and a plain, '
    'slightly darker circular medallion in the centre, left empty for an emblem. Elegant and restrained, with '
    'lots of empty space; not busy, no patterns filling the field. Hand-painted matte finish, lightly worn like '
    'an old card. No text, no letters, no numbers, no logo.'
)
SIGIL_BASE = (
    'A single emblem for the back of every card in Mythologica, a card game of world mythologies: painted in '
    'gold leaf and bronze on a fully transparent background, rustic 1990s hand-painted style, worn, bold '
    'simple silhouette, symmetrical and centred. No text, no letters, no numbers, no circle or badge behind it.'
)
SIGILS = {
    'ouroboros': 'An ouroboros: a serpent biting its own tail, forming a ring around a small flame.',
    'eye': 'A single watchful eye, like the painted eye on a Greek ship\'s prow, within a ring of short rays.',
    'labyrinth': 'A circular Cretan labyrinth.',
    'tree': 'A world tree whose roots and branches curve round to meet in a circle.',
    'threads': 'Three threads of fate, those of the Greek Moirai and the Norse Norns, woven into one interlaced knot.',
    'sunmoon': 'A sun and a crescent moon joined into a single disc, one half gold and one half silver.',
}

# Archetype marks, printed on the card's type line like a set symbol in worn ink. The game blends them
# with the parchment (multiply), so each card's own wear and texture shows through the ink.
STAMP_BASE = (
    'A small emblem printed in worn dark umber ink, like a set symbol on an old trading card: flat single-colour '
    'ink, slightly uneven and worn with tiny gaps, a bold simple silhouette readable at 12 pixels, centred on a '
    'fully transparent background. No text, no letters, no border, no circle behind it.'
)
STAMPS = {'ody': {
    'P': 'Phalanx: a round hoplite shield seen face-on with a spear standing behind it.',
    'R': 'Raiders: the head of a charging horse with a flowing mane.',
    'O': 'Offerings: a shallow libation bowl on a short stand with a flame rising from it.',
    'Z': 'Slumber (the Lotus-Eaters): a lotus flower with drooping petals.',
    'S': 'Song (the Sirens): a lyre.',
    'K': 'Cyclops: a single staring eye.',
    'F': 'Fleet (the Phaeacians): the curved prow of a swift ship.',
    'M': 'Marauders (the Cicones): a Thracian battle axe.',
    'E': 'Shades: a wisp of smoke in the shape of a mournful face.',
}}
# Hero-specific card-back sigil and interface paintings (map, victory, defeat, button plate).
HERO_UI = {'ody': {
    'sigil_ody': ('1024x1024', 'transparent',
        'A single emblem for the back of every card in Odysseus\'s deck: a Greek black ship in side profile as painted '
        'on ancient Greek pottery, black-figure style: a long low hull with a curved prow and a painted eye, one mast '
        'with a square sail, a row of oars, stylised waves beneath. Rendered in worn gold leaf and bronze, rustic 1990s '
        'hand-painted style, symmetrical and centred on a fully transparent background. No text, no letters, no circle behind it.'),
    'ui_map': ('1536x1024', 'opaque',
        'An antique sea chart of the Aegean and the wanderings of Odysseus, painted on aged, stained and creased '
        'parchment: faint coastlines and islands, a compass rose, small sea monsters and ships drawn in faded ink at the '
        'margins, wind heads in the corners; muted sepia, umber and faded sea-green. The centre is mostly open sea with '
        'very few marks so game icons can sit on top. Rustic 1990s hand-painted style. No text, no letters, no labels.'),
    'ui_victory': ('1536x1024', 'opaque',
        'Odysseus home at last: he stands on the shore of Ithaca at dawn beside his beached black ship, seen from '
        'behind, looking up at his palace on the hill where a single lamp burns in a window; golden morning light over '
        'a calm sea. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. No text.'),
    'ui_defeat': ('1536x1024', 'opaque',
        'Shipwreck: the broken black ship of Odysseus sinking among towering dark waves at night, its mast snapped, '
        'a lone figure clinging to a floating spar, lightning in the storm clouds. Fantasy trading-card painting in the '
        'style of 1990s card art: gouache and ink, rustic, matte, dark. No text.'),
    'ui_camp': ('1536x1024', 'opaque',
        'A small campfire of driftwood burning on a pebble beach at night, a beached black Greek ship and sleeping '
        'sailors in the darkness behind, sparks rising to the stars. Fantasy trading-card painting in the style of 1990s '
        'card art: gouache and ink, rustic, matte, dark around the edges, calm. No text.'),
    'ui_craft': ('1536x1024', 'opaque',
        'The forge of Hephaestus inside a volcano: a great anvil with a hammer resting on it, glowing embers and molten '
        'light, tools hanging on the rock walls. Fantasy trading-card painting in the style of 1990s card art: gouache '
        'and ink, rustic, matte, dark around the edges. No text, no people.'),
    'ui_altar': ('1536x1024', 'opaque',
        'A quiet stone altar in a ruined Greek sanctuary at dusk, a thin column of offering smoke rising past broken '
        'columns, olive trees and a few votive cups. Fantasy trading-card painting in the style of 1990s card art: '
        'gouache and ink, rustic, matte, dark around the edges. No text, no people.'),
    'ui_button': ('1536x1024', 'transparent',
        'One long, empty horizontal button plate for a game interface, seen perfectly flat and straight-on, filling the '
        'width of the image: weathered dark bronze with a raised engraved border line, small rivets at both ends, worn '
        'edges and green-brown patina; the centre is plain and flat for a label. Rustic 1990s hand-painted style. '
        'Fully transparent background around the plate. No text, no letters.'),
}}

# ---- Odin (Norse): icons, opponent medallions, archetype marks, card-back emblem and button plate ----
ICONS['odin'] = {k: v + ' Norse, Viking Age style.' for k, v in {
    'life': 'Life: a heart carved from dark red amber set in a ring of hammered iron.',
    'mana': 'Mana: a single drop of the glowing mead of poetry, pale gold, falling from a carved drinking horn tip.',
    'action': 'Action points: a small iron hammer of Thor (Mjolnir pendant) with a crackle of white lightning.',
    'victory': 'Victory points: a valknut, three interlocked triangles, carved in grey stone.',
    'attack': 'Attack form: two crossed Viking swords with simple brass-inlaid hilts.',
    'defense': 'Defense form: a round wooden Viking shield, painted with a simple divided pattern, iron boss in the centre.',
    'switch': 'Switch stance: two curved iron arrows chasing each other in a circle, one tipped red and one tipped blue.',
    'upgrade': 'Upgrade level: a single carved rune stave (the rune Tiwaz, an upward arrow) inlaid with gold.',
    'target': 'Choose a target: an iron spearhead pointing straight down, with a faint red glow.',
    'cleared': 'Fight won: a broken Viking spear, snapped in two, the halves crossed.',
    'chosen': 'Chosen: a tick mark carved and painted in tarnished gold, one confident stroke.',
    'menu': 'Menu: three short horizontal iron bars stacked neatly, like ridges on an old iron plate.',
    'foretold': 'Foretold: three spindles of the Norns with a single glowing thread running between them.',
    'gold': 'Gold: a small heap of hacksilver and twisted gold arm-rings.',
    'gift': 'Gift: a small wooden chest bound in black iron, its lid slightly open with pale cold light inside.',
    'blood': 'Blood price: a single drop of dark red blood falling onto a carved rune stone.',
    'start': 'Starting point and emblem of Odin: two black ravens, Huginn and Muninn, perched back to back.',
    'here': 'You are here: a small Viking longship with a striped square sail and a dragon prow, seen from the side.',
    'camp': 'Campfire: a small fire burning in a ring of stones on snowy ground.',
    'craft': 'Crafting table: a dwarven hammer resting on an iron anvil with a glowing ember.',
    'altar': 'Altar: a small standing runestone with a bowl of offering smoke before it.',
    'greataltar': 'The great altar: the spear Gungnir standing upright, faintly glowing with cold blue light.',
    'coin': 'The Offering coin: a single worn Viking silver coin seen perfectly straight-on, filling the frame, tarnished '
            'with a raised rim, small nicks and grime in the recesses, a faint low-relief skull struck in the centre '
            'ringed with tiny runes. Matte, painted like the weathered frames of an old trading card; no shine, no text, '
            'no letters, no numbers.',
    'offering': 'The icon for the Offering (sacrifice) value on a Norse-mythology card: a weathered, bone-white human '
                'skull seen from the front, aged and slightly cracked, with a sprig of yew tucked behind it. Solid and '
                'opaque, no glow, no smoke.',
}.items()}
MEDALS['odin'] = {
    'fenrir': "Fenrir's Brood: a snarling wolf's head with bared fangs.",
    'jotnar': 'The Jotnar: the bearded face of a frost giant crusted with ice.',
    'forge': 'The Dwarven Forge: a dwarf smith\'s hammer crossed with tongs over an anvil.',
    'muspelheim': 'Muspelheim: a flaming sword rising from fire.',
    'hel': "Hel's Legion: the goddess Hel's face, one half pale and living, the other half dark and dead.",
    'loki': "Loki's Court: a sly grinning trickster's mask with a serpent coiled around it.",
    'norns': 'The Norns: three hooded women spinning one thread.',
    'fafnir': 'Fafnir: a coiled serpent-dragon on a heap of gold rings.',
    'jormungandr': 'Jormungandr: a great sea serpent biting its own tail.',
    'wildhunt': 'The Wild Hunt: a ghostly rider on a galloping horse among storm clouds.',
    'hrungnir': 'Hrungnir: a giant\'s head of grey stone with a three-cornered stone heart.',
}
STAMPS['odin'] = {
    'B': 'Berserkers: the head of a snarling bear.',
    'V': 'Valhalla: the gabled front of a great Viking hall whose roof is thatched with round shields.',
    'H': 'Runes: a single carved rune stave, the rune Ansuz.',
    # Odin's regular opponents (like Odysseus's Z/S/K/F/M/E): archetype letters added in patch56
    'J': "Pack (Fenrir's Brood): the head of a howling wolf.",
    'G': 'Giants (the Jotnar): a jagged mountain peak crowned with ice.',
    'A': 'Forge (the Dwarven Forge): a dwarven hammer resting on an anvil.',
    'U': 'Fire (Muspelheim): a flame shaped like a sword blade.',
    'L': "Draugr (Hel's Legion): a skull wearing a rusted Viking helmet.",
    'X': "Trickery (Loki's Court): a sly grinning mask.",
}
HERO_UI['odin'] = {
    'sigil_odin': ('1024x1024', 'transparent',
        'A single emblem for the back of every card in Odin\'s deck: the spear Gungnir standing perfectly upright through '
        'the centre, its long leaf-shaped iron blade at the top, the shaft carved with knotwork, inside a circular ring '
        'of carved Elder Futhark runes, as if cut into a stone or a silver disc. Rendered in worn gold leaf and dark iron, '
        'rustic 1990s hand-painted style, symmetrical and centred on a fully transparent background. No letters of the '
        'Latin alphabet, no words, no circle or badge behind the ring.'),
    'ui_map': ('1536x1024', 'opaque',
        'An antique Norse sea chart of the northern seas and the Nine Worlds, painted on aged, stained and creased '
        'vellum: faint fjord coastlines and islands, a knotwork compass rose, small longships, sea serpents and a world '
        'tree drawn in faded ink at the margins, wind faces in the corners; muted sepia, umber and faded sea-green. The '
        'centre is mostly open sea with very few marks so game icons can sit on top. Rustic 1990s hand-painted style. '
        'No text, no letters, no labels, no runes.'),
    'ui_victory': ('1536x1024', 'opaque',
        'Victory: the great shield-roofed hall of Valhalla at dawn on a mountain, its doors open and golden light '
        'spilling out, ravens circling, a lone warrior seen from behind climbing the last steps towards it. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. Norse, Viking Age: no Greek elements. No text.'),
    'ui_defeat': ('1536x1024', 'opaque',
        'Defeat: a Viking ship funeral at night, a longship burning as it drifts out onto a dark fjord, embers rising '
        'into a sky of faint green aurora, black mountains around. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. Norse, Viking Age: no Greek elements. No text.'),
    'ui_camp': ('1536x1024', 'opaque',
        'A small campfire in a ring of stones on a snowy shore at night, a longship drawn up behind it and warriors '
        'asleep under furs, dark pines, sparks rising to the stars. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. Norse, Viking Age: no Greek elements. No text. Dark around the edges, calm.'),
    'ui_craft': ('1536x1024', 'opaque',
        'A Viking smithy in a turf-roofed hut: a glowing hearth forge with bellows, an iron anvil with a hammer and tongs, '
        'half-made axe heads and a sword blade, tools hung on the timber walls. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. Norse, Viking Age: no Greek elements. No text. Dark around the edges, no people.'),
    'ui_altar': ('1536x1024', 'opaque',
        'A quiet Norse sacred grove in snow at dusk: a heap-stone altar (horgr) with a carved runestone, offering bowls '
        'and a thin column of smoke, ancient yew and ash trees around it. Fantasy trading-card painting in the style of 1990s card art: gouache and ink, rustic, matte. Norse, Viking Age: no Greek elements. No text. Dark around the edges, no people.'),
    'ui_button': ('1536x1024', 'transparent',
        'One long, empty horizontal button plate for a game interface, seen perfectly flat and straight-on, filling the '
        'width of the image: a dark weathered oak board bound with black hammered-iron strap ends and round iron rivets '
        'at both ends, a thin carved knotwork line along the edges, worn and scratched; the centre is plain and flat for '
        'a label. Norse, Viking Age style, rustic 1990s hand-painted. Fully transparent background around the plate. '
        'No text, no letters.'),
}

# ---- Sun Wukong (Chinese, Journey to the West) ----
CHINESE_LOOK = ('Chinese look, Ming dynasty, in the spirit of Journey to the West: rich and colourful, with cinnabar and '
                'vermilion lacquer, jade green, imperial gold and deep indigo, auspicious ruyi cloud scrolls and Chinese '
                'fret (huiwen) borders; the brush rhythm of Chinese ink painting in the lines. No Japanese, Greek or Norse '
                'elements, no Greek key, no knotwork.')
FRAMES['wukong'] = {
    'common': 'Common rarity: a plain frame of dark weathered wood with a simple thin Chinese fret (huiwen) border and '
              'small bronze corner caps, modest and unornamented. ' + CHINESE_LOOK,
    'uncommon': 'Uncommon rarity: a frame of black lacquer and pale jade with a fine border of curling ruyi clouds and small '
                'jade discs at the corners. ' + CHINESE_LOOK,
    # Ben (Nov 2026): the first Legendary became the Rare; the Legendary is a new, grander frame.
    'rare': 'Rare rarity: an aged, hand-tooled frame of antique gold over dark red lacquer, worn at the edges, a '
            'restrained cloud-and-fret border and a single small golden peach of immortality with two leaves at the '
            'top centre, like a treasured relic in a temple; richer than the common and uncommon but still rustic and '
            'understated. ' + CHINESE_LOOK,
    'legendary': 'Legendary rarity, the grandest frame of all, fit for the Jade Emperor\'s Celestial Palace: radiant '
                 'burnished gold and imperial yellow over cinnabar lacquer, set with jade, coral and pearls; a golden '
                 'dragon and a vermilion phoenix curling up the two sides toward a flaming pearl at the top centre, '
                 'framed by a glowing golden halo of light; bands of five-coloured auspicious clouds (azure, jade, '
                 'cinnabar, gold, white) rolling along the top and bottom; a peach of immortality on a lotus at the '
                 'bottom centre. Warm golden light seems to shine from the frame itself. Rich and celestial, still hand-'
                 'painted, never glossy or 3D-rendered. ' + CHINESE_LOOK,
}
ICONS['wukong'] = {k: v + ' Chinese, Journey to the West style, colourful.' for k, v in {
    'life': 'Life: a heart carved from red cinnabar lacquer set in a thin gold rim.',
    'mana': 'Mana: a single glowing drop of golden elixir falling from the mouth of a small calabash gourd.',
    'action': 'Action points: a small golden somersault cloud with a speed trail.',
    'victory': 'Victory points: a ripe peach of immortality with two green leaves.',
    'attack': 'Attack form: the golden-banded iron staff Ruyi Jingu Bang held diagonally, with a flick of motion lines.',
    'defense': 'Defense form: a round lacquered Chinese shield, red and gold, with a tiger face boss.',
    'switch': 'Switch stance: two curved golden arrows chasing each other in a circle, one tipped red and one tipped blue.',
    'upgrade': 'Upgrade level: a single golden lotus petal.',
    'target': 'Choose a target: a golden arrowhead pointing straight down, with a faint red glow.',
    'cleared': 'Fight won: a broken Chinese halberd (ji), snapped in two, the halves crossed.',
    'chosen': 'Chosen: a tick mark painted in gold with one confident Chinese brush stroke.',
    'menu': 'Menu: three short horizontal jade bars stacked neatly.',
    'foretold': 'Foretold: a jade tortoise shell with a glowing crack (an oracle shell).',
    'gold': 'Gold: a small heap of gold ingots (yuanbao) and a string of square-holed coins.',
    'gift': 'Gift: a small red lacquer box with a gold clasp, its lid slightly open with warm light inside.',
    'start': 'Starting point and emblem of Sun Wukong: the golden fillet, his golden headband circlet.',
    'here': 'You are here: a small monkey riding a curling golden cloud, seen from the side.',
    'camp': 'Campfire: a small fire in a stone ring beside a pilgrim\'s bamboo pack.',
    'craft': 'Crafting table: the Eight-Trigram Furnace of Laozi, a bronze cauldron with a glowing fire.',
    'altar': 'Altar: a small bronze incense burner with three sticks of smoking incense.',
    'greataltar': 'The great altar: a golden Buddhist dharma wheel standing upright, faintly glowing.',
    'coin': 'The Offering coin: a single worn Chinese bronze cash coin with a square hole, seen perfectly straight-on, '
            'filling the frame, tarnished with green patina, small nicks and grime, a faint low-relief skull struck beside '
            'the square hole. Matte, painted like the weathered frames of an old trading card; no shine, no text, no '
            'characters, no numbers.',
    'offering': 'The icon for the Offering (sacrifice) value on a Chinese-mythology card: a weathered, bone-white human skull '
                'seen from the front, aged and slightly cracked, with a sprig of peach blossom tucked behind it. Solid and '
                'opaque, no glow, no smoke.',
}.items()}
MEDALS['wukong'] = {
    'spider': 'The Spider Cave: a spider in a silver web with peach blossom.',
    'hornkings': 'The Gold and Silver Horn Kings: a red-gold calabash gourd.',
    'heavenlyhost': 'The Heavenly Host: a celestial soldier\'s helmet with tall pheasant plumes on a cloud.',
    'redboy': 'Red Boy: a fire-tipped spear in a ring of flame.',
    'whitebone': 'The White Bone Spirit: a pale woman\'s face half turned into a skull.',
    'yellowwind': 'The Yellow Wind Ridge: a swirling yellow whirlwind.',
    'erlang': 'Erlang Shen: a stern face with a glowing third eye on the forehead.',
    'ironfan': 'Princess Iron Fan: a great green palm-leaf fan.',
    'macaque': 'The Six-Eared Macaque: a fierce monkey face with six ears.',
    'bulldemon': 'The Bull Demon King: a horned bull demon\'s face.',
    'buddhapalm': 'The Buddha\'s Palm: a giant open golden palm on a cloud.',
}
STAMPS['wukong'] = {
    'C': 'Clones: a single monkey hair curling into the shape of a small monkey.',
    'W': 'Staff: a staff with golden bands at both ends.',
    'T': 'Trickster: a mischievous monkey face.',
    # Marks for Wukong's eight regular opponents. The letters are nearly used up, so these use digits.
    '1': 'Bone Spirits: a small pale skull with a curling wisp of white smoke.',
    '2': 'Heaven: a celestial halberd standing on a small cloud.',
    '3': 'Spiders: a spider hanging on a single silk thread.',
    '4': 'Gourd: a magic calabash gourd with its stopper popping out.',
    '5': 'Samadhi Fire: a ring of red and blue flame.',
    '6': 'Wind: a spiralling yellow whirlwind.',
    '7': 'Third Eye: a single glowing vertical eye.',
    '8': 'Fan: a green palm-leaf fan.',
}
HERO_UI['wukong'] = {
    'sigil_wukong': ('1024x1024', 'transparent',
        'A single emblem for the back of every card in Sun Wukong\'s deck: his somersault cloud (jindou yun), drawn as a '
        'classic Chinese auspicious cloud scroll curling into a bold, round, balanced shape with spiralling ruyi heads and '
        'a short trailing tail, as carved on a Ming dynasty lacquer box. Rendered in worn gold leaf with touches of jade '
        'and cinnabar red, rustic 1990s hand-painted style, symmetrical and centred on a fully transparent background. '
        'No characters, no letters, no words, no circle or badge behind it.'),
    'ui_button': ('1536x1024', 'transparent',
        'One long, empty horizontal button plate for a game interface, seen perfectly flat and straight-on, filling the '
        'width of the image: a red cinnabar lacquer board with a thin carved gold fret border and small gold cloud-scroll '
        'caps at both ends, worn and scratched; the centre is plain and flat for a label. Chinese, Ming dynasty style, '
        'rustic 1990s hand-painted. Fully transparent background around the plate. No text, no characters, no letters.'),
}

STUB = r'''
var __h={get:function(t,k){if(k===Symbol.toPrimitive)return function(){return 0};if(k==='length')return 0;return __p},
 apply:function(){return __p},construct:function(){return __p},set:function(){return true}};
var __p=new Proxy(function(){},__h);
var window=__p,document=__p,localStorage=__p,sessionStorage=__p,navigator=__p,location=__p,
 setTimeout=function(){},setInterval=function(){},clearTimeout=function(){},requestAnimationFrame=function(){},
 addEventListener=function(){},matchMedia=function(){return __p},
 console={log:function(){},warn:function(){},error:function(){},info:function(){}};
'''
DUMP = r'''
;JSON.stringify({D:D,LORE:LORE,TXT:TXT,TAG:TAG,RAR:RAR,ARCH:ARCH,
 CHARS:Object.fromEntries(Object.keys(CHARS).map(function(k){var c=CHARS[k];
  function g(o){return o?{n:o.n,d:o.d,t:o.mt||o.trump}:null}
  function pick(list,idx){return (idx||[]).map(function(i){return g(typeof i=='number'?list[i]:i)})}
  return [k,{n:c.n,staples:c.staples,pool:c.pool,en:(c.en||[]).map(g),el:pick(ELITES,c.el),bo:pick(BOSS,c.bo)}]}))})
'''


def load_game():
    if not os.path.exists(SRC):
        sys.exit(f'Cannot find {SRC}. Run this from the Mythologica repo.')
    html = open(SRC, encoding='utf-8').read()
    m = re.search(r'<script>(.*?)</script>', html, re.S)
    if not m:
        sys.exit('No <script> block found in tooling/n1.html')
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(STUB + m.group(1) + DUMP)
        path = f.name
    try:
        r = subprocess.run(['osascript', '-l', 'JavaScript', path], capture_output=True, text=True)
    except FileNotFoundError:
        sys.exit('osascript not found. This script needs macOS (or port the loader to Node).')
    finally:
        os.unlink(path)
    if r.returncode != 0:
        sys.exit('Running the game data failed:\n' + r.stderr[-2000:])
    return json.loads(r.stdout)


def as_list(v):
    return v.split(' ') if isinstance(v, str) else list(v or [])


def auto_subject(cid, d, lore, rules):
    name, typ, flags = d[0], d[2], d[5] or ''
    if typ == 'C':
        what = f'"{name}"' + (f', {lore.lower()}' if lore else '')
        if 'f' in flags:  # a flyer is not braced behind a shield
            flags = flags.replace('p', '').replace('k', '')
        poses = [POSE[c] for c in flags if c in POSE]
        s = f'A full or three-quarter portrait of {what}'
        if poses:
            s += ', ' + '; '.join(poses)
        return s + '.'
    rules = (rules or '').strip().rstrip('.')
    if typ in ('I', 'S'):
        s = f'The dramatic moment of the spell "{name}" taking effect'
    else:
        s = f'A still-life or place: "{name}", a sacred object or site lit like a relic'
    if lore:
        s += f' ({lore.lower()})'
    if rules:
        s += f'. What it does in the game, for mood only: {rules}'
    return s + '.'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hero', default='ody', help='hero key in CHARS: ody, odin, wukong')
    a = ap.parse_args()

    g = load_game()
    if a.hero not in g['CHARS']:
        sys.exit(f"Unknown hero {a.hero!r}. Known: {', '.join(g['CHARS'])}")
    ch = g['CHARS'][a.hero]
    ids = []
    for i in as_list(ch['staples']) + as_list(ch['pool']):
        if i and i not in ids:
            ids.append(i)

    subj_path = os.path.join(ART, 'subjects.json')
    subjects = json.load(open(subj_path, encoding='utf-8')).get(a.hero, {}) if os.path.exists(subj_path) else {}
    folder = HERO_DIR.get(a.hero, a.hero)
    staples = set(as_list(ch['staples']))

    cards = {}
    for cid in ids:
        d = g['D'].get(cid)
        if not d:
            print(f'warning: {cid} is in the card list but not in D; skipped', file=sys.stderr)
            continue
        lore = g['LORE'].get(cid) or ''
        subject = subjects.get(cid) or auto_subject(cid, d, lore, g['TXT'].get(cid) or d[6])
        accent = ACCENT.get(d[8], '')
        prompt = (f'{STYLE}\n\nSetting: {SETTING.get(a.hero, "")}.\n'
                  f'Colour accent: {accent}.\n\nSubject: {subject}')
        cards[cid] = {
            'name': d[0],
            'lore': lore,
            'type': TYPE.get(d[2], d[2]),
            'rarity': 'Staple' if cid in staples else RARITY.get(g['RAR'].get(cid), ''),
            'archetype': g['ARCH'].get(g['TAG'].get(cid, ''), 'Generic'),
            'colour': d[8],
            'emoji': d[7],
            'subject_source': 'subjects.json' if cid in subjects else 'auto',
            'prompt': prompt,
            'output': f'art/{folder}/{cid}.webp',
        }

    # Opponent cards: every card in this hero's enemy, elite and boss decks, plus their trumps.
    # They share the hero's frames: regular enemies Common, elites Uncommon, bosses Rare, trumps Legendary.
    opponents = {}
    for grp, tier in (('en', 'common'), ('el', 'uncommon'), ('bo', 'rare')):
        for o in ch.get(grp) or []:
            if not o:
                continue
            deck = list(dict.fromkeys(o['d'] if isinstance(o['d'], list) else []))
            trump = o.get('t') if isinstance(o.get('t'), str) else None
            for cid in deck + ([trump] if trump else []):
                if cid in cards or cid in opponents or cid not in g['D']:
                    continue
                d = g['D'][cid]
                lore = g['LORE'].get(cid) or ''
                subject = subjects.get(cid) or auto_subject(cid, d, lore, g['TXT'].get(cid) or d[6])
                opponents[cid] = {
                    'name': d[0], 'lore': lore, 'type': TYPE.get(d[2], d[2]), 'opponent': o['n'],
                    'frame': 'legendary' if cid == trump else tier, 'colour': d[8], 'emoji': d[7],
                    'subject_source': 'subjects.json' if cid in subjects else 'auto',
                    'prompt': (f'{STYLE}\n\nSetting: {SETTING.get(a.hero, "")}.\n'
                               f'Colour accent: {ACCENT.get(d[8], "")}.\n\nSubject: {subject}'),
                    'output': f'art/{folder}/{cid}.webp',
                }

    # Composition plan: a distinct shot, angle, light and power level per card within each group,
    # so cards don't look alike at a glance (see composition.py and compositions.json).
    import composition
    groups = {}
    for cid, c in cards.items():
        groups.setdefault('hero:' + c['archetype'], []).append((cid, c['type'], c['lore'], c['name'], c['rarity']))
    for cid, c in opponents.items():
        groups.setdefault('opp:' + c['opponent'], []).append((cid, c['type'], c['lore'], c['name'], c['frame']))
    plans = composition.plan(groups, a.hero)
    for table in (cards, opponents):
        for cid, c in table.items():
            subject = c['prompt'].split('Subject: ', 1)[1].split('\n\nComposition:', 1)[0]
            c['composition'] = plans[cid]
            hs = f'\n\n{HERO_STYLE[a.hero]}' if a.hero in HERO_STYLE else ''
            c['prompt'] = (f'{STYLE}{hs}\n\nSetting: {SETTING.get(a.hero, "")}.\n\nSubject: {subject}\n\n'
                           + composition.describe(plans[cid]))

    out = os.path.join(ART, 'manifest.json')
    old = {}
    if os.path.exists(out):
        try:
            old = json.load(open(out, encoding='utf-8'))
        except ValueError:
            pass
    fbase = FRAME_BASE.replace('the Odyssey and Greek myth', HERO_MYTH.get(a.hero, 'the Odyssey and Greek myth'))
    mbase = MEDAL_BASE.replace('an old bronze coin or a roundel from a Greek vase', MEDAL_LOOK[a.hero]) if a.hero in MEDAL_LOOK else MEDAL_BASE
    frames = {r: {'name': f'{r.title()} frame', 'prompt': f'{fbase}\n\n{t}\n{CONDITION[r]} {WEAR_NOTE}',
                  'output': f'art/frames/{folder}/{r}.webp', 'size': '1024x1536'}
              for r, t in FRAMES.get(a.hero, {}).items()}
    old.pop('frames', None)
    icons = {k: {'name': f'{k.title()} icon', 'prompt': f'{ICON_BASE}\n\nSubject: {t}',
                 'output': f'art/icons/{folder}/{k}.png', 'size': '1024x1024', 'format': 'png',
                 'background': 'transparent'}
             for k, t in ICONS.get(a.hero, {}).items()}
    for k, t in STAMPS.get(a.hero, {}).items():
        icons[f'arch_{k}'] = {'name': f'{k} archetype mark', 'prompt': f'{STAMP_BASE}\n\nSubject: {t}',
                              'output': f'art/icons/{folder}/arch_{k}.png', 'size': '1024x1024', 'format': 'png',
                              'background': 'transparent'}
    for k, (size, bg, prompt) in HERO_UI.get(a.hero, {}).items():
        icons[k] = {'name': k, 'prompt': prompt, 'output': f'art/icons/{folder}/{k}.png', 'size': size,
                    'format': 'png', 'background': bg}
    for k, t in MEDALS.get(a.hero, {}).items():
        icons[f'med_{k}'] = {'name': f'{k} medallion', 'prompt': f'{mbase}\n\nSubject: {t}',
                             'output': f'art/icons/{folder}/med_{k}.png', 'size': '1024x1024', 'format': 'png',
                             'background': 'transparent'}
    old.setdefault('heroes', {})[a.hero] = {'name': ch['n'], 'cards': cards, 'opponents': opponents, 'frames': frames, 'icons': icons}
    back = {'back': {'name': 'Card back', 'prompt': BACK, 'output': 'art/back/back.webp', 'size': '1024x1536'}}
    for k, t in SIGILS.items():
        back[f'sigil_{k}'] = {'name': f'{k} sigil', 'prompt': f'{SIGIL_BASE}\n\nSubject: {t}',
                              'output': f'art/back/sigil_{k}.png', 'size': '1024x1024', 'format': 'png',
                              'background': 'transparent'}
    old['back'] = back
    home = {f'portrait_{k}': {'name': f'{k} portrait', 'prompt': f'{PORTRAIT_BASE}\n\nSubject: {t}',
                              'output': f'art/home/{k}.webp', 'size': '1024x1024'} for k, t in HOME.items()}
    home['background'] = {'name': 'Home background', 'prompt': HOME_BG, 'output': 'art/home/background.webp',
                          'size': '1536x1024'}
    old['home'] = home
    sp = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scenes.json')
    scenes = {}
    if os.path.exists(sp):
        for hero, items in json.load(open(sp, encoding='utf-8')).items():
            if hero.startswith('_'):
                continue
            for sid, s in items.items():
                scenes[sid] = {'name': f'{s["name"]} background', 'hero': hero, **({'screen': s['screen']} if s.get('screen') else {}),
                               'prompt': ((SCENE_BASE.replace('battle screen', 'menu screen').replace('game cards sit on top of it', 'a title, text and buttons sit on top of it') if s.get('screen') else SCENE_BASE)
                           + f'\n\nSetting: {s["setting"]}.\nColour: {s["palette"]}.'),
                               'output': f'art/scenes/{hero}/{sid}.webp', 'size': '1536x1024'}
    old['scenes'] = scenes
    old['_note'] = ('Generated by art/build_manifest.py from tooling/n1.html. Do not edit by hand: '
                    'change art/subjects.json or the script, then re-run it.')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(old, f, ensure_ascii=False, indent=2)
        f.write('\n')
    hand = sum(1 for c in cards.values() if c['subject_source'] != 'auto')
    print(f'Wrote {len(cards)} {ch["n"]} cards to art/manifest.json ({hand} with hand-written subjects).')
    ohand = sum(1 for c in opponents.values() if c['subject_source'] != 'auto')
    print(f'Wrote {len(opponents)} opponent cards ({ohand} with hand-written subjects).')


if __name__ == '__main__':
    main()
