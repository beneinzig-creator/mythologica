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
    'patterned colour. Dark overall with near-black shadows, lit by bold, saturated accent colours (ember '
    'orange, deep violet, sea teal, blood red) where they matter. The subject fills the frame and may be '
    'cropped by the edges, with its face or focal point near the centre, against a simple atmospheric '
    'background. Landscape 3:2 composition with dark, uncluttered bottom corners. No text, no letters, no '
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
    'offering': 'The icon for the Offering (sacrifice) value on a Greek-mythology card: a weathered, '
                'bone-white human skull seen from the front, aged and slightly cracked like an ancient relic, '
                'with a thin sprig of laurel leaves tucked behind it. Solid and opaque, no glow, no smoke.',
}}

# Home screen ("Choose your character"): one portrait per hero in their own mythology's style,
# plus the background painting.
PORTRAIT_BASE = (
    'A hero portrait for a card game\'s character-select screen, painted in the style of early-to-mid 1990s '
    'trading-card art: traditional gouache and ink, visible brushwork, matte and slightly worn like an old '
    'printed card, rustic rather than glossy. Head and shoulders, nearly facing the viewer, strong readable '
    'silhouette, centred, with the background fading to near-black at the edges so it sits on a dark screen. '
    'No text, no letters, no border, no frame, no logo.'
)
HOME = {
    'ody': ('Odysseus, king of Ithaca and the cunning wanderer of Homer\'s Odyssey: a weathered, bearded man in '
            'his forties with sharp, clever eyes and a faint knowing smile, a simple felt sailor\'s cap, bronze '
            'armour under a salt-stained cloak, a black Greek ship and the wine-dark sea behind him at dusk. '
            'Greek in every detail.'),
    'odin': ('Odin the Allfather of Norse myth: one-eyed, a long grey beard, a wide-brimmed hat and a dark blue '
             'cloak, the spear Gungnir in hand, his two ravens Huginn and Muninn on his shoulders, a snowy northern '
             'night with a faint aurora, subtle Norse knotwork carved into a standing stone behind him.'),
    'wukong': ('Sun Wukong, the Monkey King of Journey to the West: a monkey warrior with golden fur and fierce '
               'golden eyes, the golden fillet around his head, a phoenix-feather cap, golden chain armour and '
               'his red-and-gold staff, standing on a swirling cloud, misty Chinese mountains behind, with the '
               'feel of classical Chinese ink painting.'),
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

    out = os.path.join(ART, 'manifest.json')
    old = {}
    if os.path.exists(out):
        try:
            old = json.load(open(out, encoding='utf-8'))
        except ValueError:
            pass
    frames = {r: {'name': f'{r.title()} frame', 'prompt': f'{FRAME_BASE}\n\n{t}\n{CONDITION[r]} {WEAR_NOTE}',
                  'output': f'art/frames/{folder}/{r}.webp', 'size': '1024x1536'}
              for r, t in FRAMES.get(a.hero, {}).items()}
    old.pop('frames', None)
    icons = {k: {'name': f'{k.title()} icon', 'prompt': f'{ICON_BASE}\n\nSubject: {t}',
                 'output': f'art/icons/{folder}/{k}.png', 'size': '1024x1024', 'format': 'png',
                 'background': 'transparent'}
             for k, t in ICONS.get(a.hero, {}).items()}
    for k, t in MEDALS.get(a.hero, {}).items():
        icons[f'med_{k}'] = {'name': f'{k} medallion', 'prompt': f'{MEDAL_BASE}\n\nSubject: {t}',
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
                scenes[sid] = {'name': f'{s["name"]} background', 'hero': hero,
                               'prompt': f'{SCENE_BASE}\n\nSetting: {s["setting"]}.\nColour: {s["palette"]}.',
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
