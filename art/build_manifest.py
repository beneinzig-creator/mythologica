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
 CHARS:Object.fromEntries(Object.keys(CHARS).map(function(k){return [k,{n:CHARS[k].n,staples:CHARS[k].staples,pool:CHARS[k].pool}]}))})
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
    old.setdefault('heroes', {})[a.hero] = {'name': ch['n'], 'cards': cards, 'frames': frames}
    old['_note'] = ('Generated by art/build_manifest.py from tooling/n1.html. Do not edit by hand: '
                    'change art/subjects.json or the script, then re-run it.')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(old, f, ensure_ascii=False, indent=2)
        f.write('\n')
    hand = sum(1 for c in cards.values() if c['subject_source'] != 'auto')
    print(f'Wrote {len(cards)} {ch["n"]} cards to art/manifest.json ({hand} with hand-written subjects).')


if __name__ == '__main__':
    main()
