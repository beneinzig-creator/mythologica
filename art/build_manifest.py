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

HERO_DIR = {'ody': 'odysseus', 'odin': 'odin', 'wukong': 'wukong', 'thoth': 'thoth', 'act3': 'act3'}
TYPE = {'C': 'Army member', 'I': 'Quick spell', 'S': 'Spell', 'E': 'Modifier', 'A': 'Item'}
RARITY = {'C': 'Common', 'U': 'Uncommon', 'R': 'Rare', 'L': 'Legendary'}
SETTING = {
    'ody': 'Greek myth as told in Homer, Hesiod and the Greek tragedies, depicted faithfully to those '
           'stories: bronze armour, crested helmets, round aspis shields, linen chitons, black ships, the '
           'wine-dark Aegean sea, white limestone, temples, cypress, smoke and fire',
    'odin': 'Viking Age Norse myth: iron mail, round wooden shields, furs, runestones, longhalls, '
            'ravens, wolves, fjords, snow and northern sky',
    'thoth': 'Ancient Egyptian myth: temples, tombs, the Nile, papyrus marshes, the desert, the Duat underworld, gods with animal heads, gold, faience and linen',
    'wukong': 'Journey to the West, classical Chinese myth: silk robes, lacquered armour, temples, '
              'clouds, mountains, celestial palaces',
    'thoth': 'Ancient Egyptian myth of the New Kingdom: temples, tombs, papyrus, the Nile, desert, '
             'gods with animal heads, gold, lapis lazuli and faience',
}
# A hero's own look, laid over the shared card style. Same rules as Odysseus (tight framing, one distinct
# shot per card, rarity in the framing), but a different art experience per mythology.
HERO_STYLE = {
    'thoth': ('Egyptian look for this hero: the same 1990s hand-made card art, but painted in the manner of '
              'ancient Egyptian tomb paintings, temple reliefs and illustrated papyri. Crisp, even, dark outlines '
              'around every shape and flat areas of bold mineral colour with very little shading: Egyptian blue, '
              'lapis, malachite green, red and yellow ochre, gold leaf, black and white; the faint texture of painted '
              'plaster, carved limestone or papyrus fibres shows through. Gods and people may keep the strong '
              'Egyptian profile silhouette, but the camera angle still varies from card to card. Ornament comes from '
              'Egypt: lotus and papyrus borders, winged sun discs, broad collars, gold and faience. Warm desert and '
              'Nile light, between Odin\'s darkness and Wukong\'s brightness. Every card has its own strong colour '
              'key (given under Light and colour) that fills the picture; Egyptian art is not only blue and gold, '
              'so many cards are dominated by red ochre, desert yellow, malachite green, black and white, carnelian or rose. '
              'No readable writing: hieroglyphs only as '
              'small decorative carving in the background, never as the subject. Not modern Egyptian-themed fantasy '
              'game art, not a movie poster, no glowing sci-fi pyramids. '
              'Focus over scenery: the card\'s subject is the star of the picture and should look as striking and '
              'powerful as possible, large and unmistakable at a glance. The background is simple, atmospheric and '
              'secondary, and no second large figure or creature competes with the subject unless the card is about '
              'that creature. Only paint Thoth himself (ibis-headed god with a reed pen and palette) when the subject '
              'names him.'),
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
             'wukong': 'Journey to the West and classical Chinese myth',
             'thoth': 'ancient Egyptian myth and the Book of the Dead',
             'act3': 'the War in Heaven, the fall of the rebel angels and the Apocalypse'}
MEDAL_LOOK = {'odin': 'a worn silver Viking pendant or a roundel from a Gotland picture-stone',
              'wukong': 'a carved and painted roundel from the Ming dynasty, in the colours given below',
              'thoth': 'an Egyptian gold-and-enamel amulet roundel inlaid with coloured stone, in the colours given below'}

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
    # Ben (playtest, Nov 2026): the first drop looked glossy and odd on the mana orb; this one is flat and bold.
    'mana': 'Mana: a single drop of golden ichor, the blood of the gods, painted flat like a figure on a Greek vase: '
            'a plump teardrop of matte ochre gold with a thick dark brown outline and one small cream highlight, no gloss, '
            'no shine, no glow, no 3D shading, filling most of the frame.',
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
    'grave': 'Graveyard: a single weathered grave marker standing upright, seen straight from the front: a Greek marble grave stele with a small triangular pediment on top and a faint carved relief of a palmette, a little moss at the foot, on a tuft of dry grass. One solid, upright shape that fills most of the frame.',
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
    'thoth': ('Thoth, the ibis-headed Egyptian god of writing, wisdom and the moon, seen in three-quarter view from '
              'slightly below, seated cross-legged like a scribe on the steps of his temple at Hermopolis, a reed pen '
              'raised in one hand and a half-unrolled papyrus across his knees, his long curved ibis beak turned '
              'toward the viewer, a silver moon disc in a gold crescent resting on his head; a broad collar of lapis '
              'and gold over white linen. Night, a starry lapis sky, painted columns behind him and a sacred ibis at '
              'his feet. Colours of lapis blue, gold, white linen and moon silver, with the flat bold colours of '
              'Egyptian tomb painting mixed into the pen-and-ink style.'),
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
    'grave': 'Graveyard: a single weathered grave marker standing upright, seen straight from the front: a grey Viking rune stone, rounded at the top, carved with a serpent band curling around its edge (no readable runes), a little moss and snow at the foot. One solid, upright shape that fills most of the frame.',
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
    'grave': 'Graveyard: a single weathered grave marker standing upright, seen straight from the front: a Chinese stone stele with a carved curling-dragon crown on top, resting on a stone tortoise base, a faded red panel down its face (no readable characters), a little moss at the foot. One solid, upright shape that fills most of the frame.',
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
    'spider': 'The Spider Cave: a spider in a silver web with peach blossom. Colours: jade green, silver and deep night teal, with pale pink blossom; no red.',
    'hornkings': 'The Gold and Silver Horn Kings: a red-gold calabash gourd. Colours: burnished gold and silver on deep indigo blue; no red.',
    'heavenlyhost': 'The Heavenly Host: a celestial soldier\'s helmet with tall pheasant plumes on a cloud. Colours: azure blue, white and gold; no red.',
    'redboy': 'Red Boy: a fire-tipped spear in a ring of flame. Colours: cinnabar red, flame orange and gold.',
    'whitebone': 'The White Bone Spirit: a pale woman\'s face half turned into a skull. Colours: bone white, pale grey and faded violet on misty grey; no red.',
    'yellowwind': 'The Yellow Wind Ridge: a swirling yellow whirlwind. Colours: ochre yellow, sandy brown and dusty amber; no red.',
    'erlang': 'Erlang Shen: a stern face with a glowing third eye on the forehead. Colours: steel blue and silver with a glowing gold eye; no red.',
    'ironfan': 'Princess Iron Fan: a great green palm-leaf fan. Colours: malachite green and teal with a touch of violet; no red.',
    'macaque': 'The Six-Eared Macaque: a fierce monkey face with six ears. Colours: dark teal, moss green and grey fur with gold eyes; no red.',
    'bulldemon': 'The Bull Demon King: a horned bull demon\'s face. Colours: black, smoky crimson and ember orange.',
    'buddhapalm': 'The Buddha\'s Palm: a giant open golden palm on a cloud. Colours: imperial gold and warm cream white clouds; no red.',
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
WK_SCREEN = ('Made by hand like a 1993 fantasy game-book illustration: bold, wobbly black pen-and-ink outlines, thin flat '
             'transparent watercolour washes with blotchy hard edges, a little cross-hatching, rough off-white paper grain '
             'showing through; Chinese, Ming dynasty, Journey to the West; bright and colourful (cinnabar, azurite, malachite, '
             'gold, peach pink) rather than muddy. No Japanese elements.')
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
        'rustic 1990s hand-painted. Fully transparent background around the plate. No text, no characters, no letters.'),    # Wukong's screens, in the rough pen-and-ink-with-washes look Ben chose for his backgrounds, and colourful.
    'ui_map': ('1536x1024', 'opaque',
        'An antique Chinese pilgrim\'s map of the long road to the West, painted on an aged, stained silk scroll: '
        'misty blue-green mountain ranges, winding rivers, tiny pagodas, temples and walled towns, auspicious clouds '
        'and a small dragon at the margins, all in faded ink and soft mineral washes of azurite, malachite, cinnabar '
        'and gold. The centre is mostly open plain and mist with very few marks so game icons can sit on top. '
        + WK_SCREEN + ' No text, no characters, no seals with writing.'),
    'ui_victory': ('1536x1024', 'opaque',
        'Victory: the pilgrims arriving at Thunderclap Monastery on Vulture Peak at dawn, the golden temple glowing on '
        'its mountain above a sea of rose and gold clouds, a rainbow of light, cranes flying, and Sun Wukong seen from '
        'behind on a cloud, staff on his shoulder, looking up at it. ' + WK_SCREEN + ' No text.'),
    'ui_defeat': ('1536x1024', 'opaque',
        'Defeat: Sun Wukong imprisoned beneath the Mountain of Five Elements, only his head and one arm free, grass '
        'growing over his shoulders, under a dusky violet sky with the faint golden seal of the Buddha on the peak, '
        'a lonely pine and falling leaves. ' + WK_SCREEN + ' No text.'),
    'ui_camp': ('1536x1024', 'opaque',
        'A small campfire under an old twisted pine on a mountain ledge at night, the white horse tethered nearby and '
        'the pilgrims asleep on their bundles, a bamboo pack and a monk\'s staff against a rock, misty peaks and a '
        'big silver moon, sparks rising. ' + WK_SCREEN + ' No text. Dark around the edges, calm.'),
    'ui_craft': ('1536x1024', 'opaque',
        'The alchemy hall of Laozi in heaven: the great bronze Eight-Trigram Furnace glowing red-gold in the centre, '
        'gourds of elixir, scrolls, bellows and jade tools on lacquered shelves, red pillars and clouds drifting through '
        'the open doors. ' + WK_SCREEN + ' No text. Dark around the edges, no people.'),
    'ui_altar': ('1536x1024', 'opaque',
        'A quiet mountain Buddhist shrine at dusk: a small red-pillared pavilion with a golden Buddha statue, a bronze '
        'incense burner with smoking sticks, offerings of peaches and lotus flowers, prayer flags and old pines, '
        'misty peaks behind. ' + WK_SCREEN + ' No text. Dark around the edges, no people.'),
}

# ---- Thoth (ancient Egyptian) ----
EGYPT_LOOK = ('Ancient Egyptian look, New Kingdom, like Egyptian temple and tomb painting and the jewellery of '
              'Tutankhamun: lapis lazuli blue, turquoise and faience green, carnelian and red ochre, gold leaf, black '
              'and limestone white; lotus and papyrus friezes, block borders of coloured bars, winged sun discs, '
              'decorative pattern bands with no readable hieroglyphs. No Greek, Norse or Chinese elements.')
FRAMES['thoth'] = {
    'common': 'Common rarity: a plain frame of sun-bleached sandstone with a simple painted border of alternating blue, '
              'red and green bars (the Egyptian block border) and small papyrus-bud corners, modest and unornamented. '
              + EGYPT_LOOK,
    'uncommon': 'Uncommon rarity: a frame of turquoise faience tiles set in dark ebony, with a fine lotus-and-papyrus '
                'frieze along the edges and small blue lotus flowers at the corners. ' + EGYPT_LOOK,
    # Ben (Nov 2026): the first Rare looked too like the Uncommon, so the Rare blends it with the first Legendary,
    # and the Legendary is redone with far more gold.
    'rare': 'Rare rarity: a frame of hammered gold inlaid with lapis lazuli, turquoise and carnelian like a royal pectoral, '
            'a pair of colourful outspread vulture wings (lapis, turquoise and red feathers edged in gold) wrapping the '
            'upper sides of the card, a small winged sun disc above the art window, and a frieze of blue lotus flowers '
            'along the bottom; richer than the common and uncommon, but not yet the full glory of a legendary. '
            + EGYPT_LOOK,
    'legendary': 'Legendary rarity, the grandest frame of all, made almost entirely of radiant burnished gold, like the '
                 'golden shrine and mask of Tutankhamun: thick sculpted gold borders glowing with warm light, the great '
                 'golden outspread wings of the sacred ibis of Thoth sweeping all the way down both sides, every feather '
                 'of beaten gold with thin inlays of lapis and turquoise; at the top centre a large glowing silver moon '
                 'disc in a golden crescent, sending out golden rays; gold cobras and gold lotus flowers, jewels of '
                 'carnelian and lapis set into the corners, a band of gold stars on deep lapis along the top, and gold '
                 'hieroglyph-like ornament (no readable signs) along the bottom. It shines like treasure in torchlight. '
                 'Hand-painted, never glossy or 3D-rendered. ' + EGYPT_LOOK,
}
ICONS['thoth'] = {k: v + ' Ancient Egyptian style, colourful.' for k, v in {
    'life': 'Life: a golden ankh inlaid with red carnelian.',
    'mana': 'Mana: a single glowing drop of blue Nile water falling from a small gold libation vase.',
    'action': 'Action points: a gold-and-turquoise scarab beetle with its wings open, mid-flight.',
    'victory': 'Victory points: a gold feather of Maat standing upright.',
    'attack': 'Attack form: an ancient Egyptian khopesh with a curved bronze blade, lying diagonally, as painted on a temple wall.',
    'defense': 'Defense form: a tall Egyptian cowhide shield, rounded at the top, dappled brown and white with a gold rim.',
    'switch': 'Switch stance: two curved golden arrows chasing each other in a circle, one tipped lapis blue, one carnelian red.',
    'upgrade': 'Upgrade level: a single golden lotus bud.',
    'target': 'Choose a target: a golden arrowhead pointing straight down, with a faint blue glow.',
    'cleared': 'Fight won: a broken Egyptian spear, snapped in two, the halves crossed.',
    'chosen': 'Chosen: a tick mark painted in gold with one confident reed-pen stroke.',
    'menu': 'Menu: three short horizontal lapis-blue bars edged in gold, stacked neatly.',
    'foretold': 'Foretold: a gold-rimmed bronze scrying bowl of dark water with the reflection of a crescent moon.',
    'gold': 'Gold: a small heap of gold rings and gold nuggets beside a gold collar.',
    'gift': 'Gift: a small painted wooden casket with a gold lid, slightly open with warm light inside.',
    'grave': 'Graveyard: a single weathered grave marker standing upright, seen straight from the front: an ancient Egyptian limestone funerary stela, rounded at the top, with a faded painted winged sun disc in the curve and faint painted bands below (no readable hieroglyphs), sand at the foot. One solid, upright shape that fills most of the frame.',
    'start': 'Starting point and emblem of Thoth: a silver moon disc resting in a golden crescent.',
    'here': 'You are here: a small Egyptian reed boat with a white sail, seen from the side.',
    'camp': 'Campfire: a small fire in a ring of stones beside a palm tree.',
    'craft': 'Crafting table: a scribe\'s low wooden table with a papyrus roll, palette and reed pens.',
    'altar': 'Altar: a small stone offering table with a loaf, a jar and a lotus, and a thin column of incense smoke.',
    'greataltar': 'The great altar: a golden pyramid capstone (pyramidion) glowing at its tip.',
    'coin': 'The Offering coin: a single worn gold Egyptian ring-money disc seen perfectly straight-on, filling the frame, '
            'tarnished and nicked, a faint low-relief skull struck in the centre. Matte, painted like the weathered frames '
            'of an old trading card; no shine, no text, no hieroglyphs, no numbers.',
    'offering': 'The icon for the Offering (sacrifice) value on an Egyptian-mythology card: a weathered, bone-white human '
                'skull seen from the front, aged and slightly cracked, with a blue lotus flower beside it. Solid and opaque, '
                'no glow, no smoke.',
}.items()}
MEDALS['thoth'] = {
    'robbers': 'The Tomb Robbers: a masked thief\'s face lit by a torch, gold glinting. Colours: torch orange, umber and gold.',
    'scorpions': 'The Scorpions of Serket: a black scorpion with raised tail on golden sand. Colours: black, sand gold and amber.',
    'servants': 'Servants of the Tomb: a little blue faience shabti figure with folded arms. Colours: turquoise blue and black.',
    'sobek': 'The Crocodiles of Sobek: a green crocodile head rising from the Nile among papyrus. Colours: Nile green and teal.',
    'anubis': 'The Jackals of Anubis: a black jackal head with gold collar and gold-lined ears. Colours: black, gold and '
              'deep lapis blue.',
    'heka': 'The Priests of Heka: two entwined cobras around a magician\'s staff. Colours: violet, black and gold.',
    'ammit': 'Ammit, the Devourer: a monster with a crocodile head and lion\'s mane beside the scales of judgement. Colours: '
             'dark red, ochre and gold.',
    'sphinx': 'The Great Sphinx: the face of the Sphinx in profile with the striped nemes headdress. Colours: warm sandstone '
              'and dusk rose.',
    'apophis': 'Apophis, the Serpent of Chaos: a huge coiling serpent in darkness. Colours: deep black, poison green and violet.',
    'set': 'Set, Lord of the Red Desert: the head of the Set animal with tall square ears in a red sandstorm. Colours: red '
           'ochre and rust.',
    'sekhmet': 'Sekhmet, the Eye of Ra: a lioness head crowned with a blazing sun disc. Colours: blazing orange, red and gold.',
}
STAMPS['thoth'] = {
    'D': 'Sundered: a small human figure splitting into its shadow and a bird-soul.',
    'I': 'Scribes: a scribe\'s palette with two ink wells and a reed pen.',
    'Y': 'Recorder: a papyrus scroll half unrolled.',
    # Marks for Thoth's six regular opponents and two elites. Letters and digits are all taken, so these use
    # lowercase letters; their files are named arch_xa..arch_xh (lowercase alone would clash with capitals on macOS).
    'xa': 'Robbers: a burning torch.',
    'xb': 'Scorpions: a scorpion seen from above.',
    'xc': 'Shabti: a small mummiform shabti figure.',
    'xd': 'Crocodile: a crocodile seen from the side.',
    'xe': 'Jackal: a reclining black jackal.',
    'xf': 'Heka: a rearing cobra.',
    'xg': 'Judgement: a pair of balance scales.',
    'xh': 'Riddle: a small sphinx lying down.',
}
TH_SCREEN = ('Made by hand like a 1993 fantasy game-book illustration: bold, wobbly black pen-and-ink outlines, thin flat '
             'transparent watercolour washes with blotchy hard edges, a little cross-hatching, rough off-white paper grain '
             'showing through; ancient Egyptian, New Kingdom, with the flat bright colours of tomb painting (lapis, turquoise, '
             'red ochre, gold, palm green); colourful rather than muddy. No Greek, Norse or Chinese elements.')
HERO_UI['thoth'] = {
    # Ben's pick (Nov 2026) from seven ideas: the Eye of the Moon.
    'sigil_thoth': ('1024x1024', 'transparent',
        'A single emblem for the back of every card in Thoth\'s deck: the Eye of the Moon, the wadjet eye that Thoth '
        'healed, drawn as a bold Egyptian eye with its long cosmetic line and the curling spiral and teardrop marks beneath, '
        'inlaid in lapis lazuli and gold like Tutankhamun\'s jewellery, with a silver crescent moon cradled beneath it. '
        'Rustic 1990s hand-painted style, symmetrical and centred on a fully transparent background. No letters, no '
        'hieroglyphs, no circle or badge behind it.'),
    # Thoth's screens, in the pen-and-ink-with-washes look of his backgrounds.
    'ui_map': ('1536x1024', 'opaque',
        'An ancient Egyptian map of the Nile and the lands of the dead painted on an aged, stained papyrus: the river '
        'winding from top to bottom, small pyramids, temples, palms and boats along it, the desert in faded ochre, '
        'ibises and a small sun-boat in the margins, in faded ink and soft washes of lapis, turquoise, ochre and gold. The '
        'centre is mostly open desert and river with very few marks so game icons can sit on top. ' + TH_SCREEN +
        ' No text, no readable hieroglyphs.'),
    'ui_victory': ('1536x1024', 'opaque',
        'Victory: the golden sun-boat of Ra rising over the Nile at dawn, the temple of Thoth at Hermopolis glowing on '
        'the bank, ibises flying across a sky of rose and gold, the Field of Reeds green and gold beyond. ' + TH_SCREEN +
        ' No text.'),
    'ui_defeat': ('1536x1024', 'opaque',
        'Defeat: a ruined temple half buried in desert sand at dusk, a toppled ibis statue of Thoth and a broken '
        'scribe\'s palette in the sand, the scales of judgement tipped over, jackals watching from the dunes under a '
        'violet sky. ' + TH_SCREEN + ' No text.'),
    'ui_camp': ('1536x1024', 'opaque',
        'A small campfire beside a palm grove on the bank of the Nile at night: a reed boat pulled up on the mud, a '
        'bedroll and a scribe\'s satchel by the fire, the river reflecting a big silver moon and stars, the desert dark '
        'beyond. ' + TH_SCREEN + ' No text. Dark around the edges, calm.'),
    'ui_craft': ('1536x1024', 'opaque',
        'A temple workshop of scribes and craftsmen: low tables with papyrus rolls, ink palettes and reed pens; an '
        'artisan\'s bench with gold, faience amulets and a small furnace glowing; painted walls and oil lamps. '
        + TH_SCREEN + ' No text. Dark around the edges, no people.'),
    'ui_altar': ('1536x1024', 'opaque',
        'A quiet temple sanctuary at dusk: a stone offering table with bread, jars of beer and blue lotus flowers before '
        'a gilded shrine holding an ibis statue of Thoth, incense smoke rising, painted columns with papyrus capitals. '
        + TH_SCREEN + ' No text. Dark around the edges, no people.'),
    'ui_button': ('1536x1024', 'transparent',
        'One long, empty horizontal button plate for a game interface, seen perfectly flat and straight-on, filling the '
        'width of the image: a gold-edged lapis-blue plaque with a thin band of coloured block border and small gold '
        'lotus caps at both ends, worn and scratched; the centre is plain and flat for a label. Ancient Egyptian style, '
        'rustic 1990s hand-painted. Fully transparent background around the plate. No text, no hieroglyphs, no letters.'),
}

# ---- Act III, the War in Heaven (shared by every hero; its cards are all opponents') ----
# Opponent cards are framed by tier: regular decks Common, elites Uncommon, the generals Rare, trumps Legendary.
APOC_LOOK = ('The look of a medieval illuminated Apocalypse manuscript (like the Beatus and Angers Apocalypse): gold leaf, '
             'deep ultramarine, vermilion and black; flames, falling stars, scorched angel feathers and broken halos; dark '
             'and ominous, the host of the fallen. No Greek, Norse, Chinese or Egyptian elements.')
# Ben (Nov 2026): the first set looked too alike. Each rarity now has its own material and colour, and they get more
# epic as they climb: bronze and feathers, obsidian and hellfire, storm silver and lightning, the gold-and-crimson dragon.
FRAMES['act3'] = {
    'common': 'Common rarity: a frame of tarnished dark bronze, worn and dented, with a few scorched black angel feathers '
              'laid along the two sides and small dull ember-red stones at the corners; restrained and simple. Colours: '
              'dark bronze, black and a little ember red. ' + APOC_LOOK,
    'uncommon': 'Uncommon rarity: a frame of black obsidian veined with glowing red-orange cracks like cooling lava, heavy '
                'iron chains wrapped around the corners with broken shackles, small horned skulls at the four corners, '
                'flames licking up from the bottom edge. Colours: glossy black and glowing hellfire orange. Clearly '
                'different in colour and material from a bronze frame. ' + APOC_LOOK,
    'rare': 'Rare rarity: a frame of storm silver and deep ultramarine: torn silver-edged angel wings, battered and '
            'bleeding light, rising up both sides; storm clouds and forked lightning crackling around the border; seven '
            'small golden trumpets along the top edge and a cracked silver halo above the art window. Colours: silver, '
            'stormy blue, white lightning, touches of gold. Epic and dramatic. ' + APOC_LOOK,
    'legendary': 'Legendary rarity, the most epic frame of all: the great red dragon of the Apocalypse, with seven crowned '
                 'heads and ten horns, coiled all the way around the card in blazing gold and crimson scales, its heads '
                 'rearing over the top edge, its tail sweeping a third of the stars from the sky along one side; a burning '
                 'halo of golden light behind the art window, gold leaf everywhere, fire and falling stars. Colours: '
                 'blazing gold and deep crimson on black. Overwhelming and climactic, still hand-painted, never glossy or '
                 '3D-rendered. IMPORTANT: the border is exactly as thin as on an ordinary card frame, so the art window '
                 'and the text box are just as large as on the other rarities: the dragon\'s body is drawn slim and '
                 'tight along the outer edges only, and its seven heads are small, kept inside the thin band above the '
                 'title bar; nothing pushes the title bar, art window or text box inwards or downwards. ' + APOC_LOOK,
}


def build_act3():
    """Act III has no hero in CHARS: write only its frames into manifest.json (scenes come from scenes.json)."""
    out = os.path.join(ART, 'manifest.json')
    old = json.load(open(out, encoding='utf-8'))
    fbase = FRAME_BASE.replace('the Odyssey and Greek myth', HERO_MYTH['act3'])
    frames = {r: {'name': f'{r.title()} frame', 'prompt': f'{fbase}\n\n{t}\n{CONDITION[r]} {WEAR_NOTE}',
                  'output': f'art/frames/act3/{r}.webp', 'size': '1024x1536'}
              for r, t in FRAMES['act3'].items()}
    # The 109 card pictures (art/act3/<id>.webp, each with a .json holding its prompt) were painted outside this
    # script in four sacred-art looks (woodcut, grotesque fresco, manuscript, stained glass; see each .json).
    # art/act3/cards.json gives each card's name, type and frame tier, and make_game_assets frames them from it.
    opp = {}
    cj = os.path.join(ART, 'act3', 'cards.json')
    for cid, c in (json.load(open(cj, encoding='utf-8')) if os.path.exists(cj) else {}).items():
        side = os.path.join(ART, 'act3', f'{cid}.json')
        prompt = json.load(open(side, encoding='utf-8')).get('prompt', '') if os.path.exists(side) else ''
        opp[cid] = {'name': c['name'], 'type': c['type'], 'frame': c['frame'], 'prompt': prompt,
                    'output': f'art/act3/{cid}.webp'}
    old.setdefault('heroes', {})['act3'] = {'name': 'Act III', 'cards': {}, 'opponents': opp, 'tutorial': {},
                                            'frames': frames, 'icons': {}}
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(old, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('Wrote Act III frames to art/manifest.json.')

# ---- Enemy figures: full-length art of each opponent, shown over its fight background on the pre-fight screen ----
FIGURE_BASE = (
    'A full-length figure of an enemy for a mythology card game\'s pre-fight screen, made by hand like a 1993 fantasy '
    'game-book illustration at its very best: confident black pen-and-ink outlines, rich ink hatching, flat gouache and '
    'watercolour washes with visible brush marks, bold and colourful where the subject allows. Highly detailed, '
    'dramatic and menacing, a powerful pose full of character, facing the viewer as an opponent about to fight. The '
    'whole figure fits inside the frame with a little room around it, standing on nothing. Cut out cleanly on a fully '
    'transparent background: no ground, no scenery, no frame, no text, no glow behind it.'
)
# hero -> id -> (opponent name exactly as in the game, subject)
FIGURES = {
    'ody': {'poly': ('Polyphemus', 'Polyphemus the Cyclops of Homer\'s Odyssey: a towering, hairy shepherd giant with a '
                     'single huge glaring eye in the middle of his brow, wild black beard, a sheepskin over his shoulders, '
                     'gripping a club made from a whole olive trunk, a ram at his feet, roaring. Greek in every detail.')},
    'odin': {'fenrir': ('Fenrir\'s Brood', 'The wolf-brood of Fenrir from Norse myth: a gigantic black wolf with burning '
                        'yellow eyes and bared fangs, frost on its fur, a broken silken fetter hanging from its neck, two '
                        'snarling wolf cubs at its paws, lunging forward. Norse in every detail.')},
    'wukong': {'bulldemon': ('The Bull Demon King', 'The Bull Demon King of Journey to the West: a huge demon king with '
                             'the head of a black bull and great curved horns, burning eyes, in red-and-gold lacquered '
                             'armour and a flowing cape, swinging an iron cudgel, flames curling around him. Chinese, Ming '
                             'dynasty, with the brush rhythm of Chinese painting.')},
    'thoth': {'sekhmet': ('Sekhmet, the Eye of Ra', 'Sekhmet, the lioness-headed Egyptian goddess of war and plague: '
                          'a tall powerful woman with the head of a fierce lioness crowned by a blazing red sun disc and a '
                          'rearing cobra, in a red linen dress and a broad collar of gold and lapis, holding a sceptre, '
                          'mouth open in a roar, desert heat rippling around her. Ancient Egyptian in every detail.')},
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
    if a.hero == 'act3':
        return build_act3()

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

    # Tutorial cards: the training targets and tokens in this hero's tutorial lessons (tooling/tutorial.js)
    # that are not already in the hero's pool or decks. Kept in their own table and planned last, so they
    # never change the shots of the hero's other cards.
    tutorial = {}
    tj = os.path.join(ROOT, 'tooling', 'tutorial.js')
    if os.path.exists(tj):
        import re as _re
        src = open(tj, encoding='utf-8').read()
        for m in _re.finditer(r"\{id:'[^']+',h:'(\w+)'(.*?)(?=\n\{id:'|\nconst JOURNEY)", src, _re.S):
            if m.group(1) != a.hero:
                continue
            body = m.group(2).replace('DUMMIES', "'tdum'")
            want = set()
            for dm in _re.finditer(r"(?:deck|edeck):(\[[^\]]*\]|Array\(\d+\)\.fill\('(\w+)'\))", body):
                want |= set(_re.findall(r"'([a-z0-9]+)'", dm.group(0)))
            want |= set(_re.findall(r"S\.atk\(\['(\w+)'", body)) & {'ein'}
            for cid in sorted(want):
                if cid in cards or cid in opponents or cid not in g['D']:
                    continue
                d = g['D'][cid]
                lore = g['LORE'].get(cid) or ''
                subject = subjects.get(cid) or auto_subject(cid, d, lore, g['TXT'].get(cid) or d[6])
                tutorial[cid] = {
                    'name': d[0], 'lore': lore, 'type': TYPE.get(d[2], d[2]),
                    'rarity': RARITY.get(g['RAR'].get(cid), 'Common'),
                    'archetype': 'Tutorial', 'colour': d[8], 'emoji': d[7],
                    'subject_source': 'subjects.json' if cid in subjects else 'auto',
                    'prompt': f'Subject: {subject}', 'output': f'art/{folder}/{cid}.webp',
                }

    # Composition plan: a distinct shot, angle, light and power level per card within each group,
    # so cards don't look alike at a glance (see composition.py and compositions.json).
    import composition
    groups = {}
    for cid, c in cards.items():
        groups.setdefault('hero:' + c['archetype'], []).append((cid, c['type'], c['lore'], c['name'], c['rarity']))
    for cid, c in opponents.items():
        groups.setdefault('opp:' + c['opponent'], []).append((cid, c['type'], c['lore'], c['name'], c['frame']))
    for cid, c in tutorial.items():
        groups.setdefault('tutorial', []).append((cid, c['type'], c['lore'], c['name'], c['rarity']))
    plans = composition.plan(groups, a.hero)
    for table in (cards, opponents, tutorial):
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
    for k, (nm, t) in FIGURES.get(a.hero, {}).items():
        icons[f'fig_{k}'] = {'name': f'{nm} figure', 'opponent': nm, 'prompt': f'{FIGURE_BASE}\n\nSubject: {t}',
                             # webp keeps transparency at a fraction of a png's size (this Mac can't encode webp)
                             'output': f'art/icons/{folder}/fig_{k}.webp', 'size': '1024x1536', 'format': 'webp',
                             'background': 'transparent'}
    for k, t in MEDALS.get(a.hero, {}).items():
        icons[f'med_{k}'] = {'name': f'{k} medallion', 'prompt': f'{mbase}\n\nSubject: {t}',
                             'output': f'art/icons/{folder}/med_{k}.png', 'size': '1024x1024', 'format': 'png',
                             'background': 'transparent'}
    old.setdefault('heroes', {})[a.hero] = {'name': ch['n'], 'cards': cards, 'opponents': opponents, 'tutorial': tutorial,
                                            'frames': frames, 'icons': icons}
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
    print(f'Wrote {len(tutorial)} tutorial cards: {", ".join(tutorial) or "none"}.')
    print(f'Wrote {len(opponents)} opponent cards ({ohand} with hand-written subjects).')


if __name__ == '__main__':
    main()
