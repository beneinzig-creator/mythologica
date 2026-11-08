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
    'ody': 'Bronze Age Greek myth, the Odyssey: bronze armour, crested helmets, round aspis shields, '
           'linen chitons, the wine-dark Aegean sea, white limestone, temples, cypress, smoke and fire',
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
    'Fantasy trading-card illustration in the style of mid-1990s hand-painted card art: traditional oil '
    'and gouache on illustration board, visible brushwork, painterly texture, slightly muted earthy colours. '
    'Dark, moody palette with deep shadows falling to near-black at the edges, a single warm key light on '
    'the subject. One clear focal subject, centred, strong readable silhouette, simple background. '
    'Landscape 3:2 composition; keep the subject in the central area with dark, uncluttered bottom corners. '
    'No text, no letters, no border, no card frame, no logo, no watermark. Not photorealistic, not 3D '
    'render, not anime.'
)

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
    old.setdefault('heroes', {})[a.hero] = {'name': ch['n'], 'cards': cards}
    old['_note'] = ('Generated by art/build_manifest.py from tooling/n1.html. Do not edit by hand: '
                    'change art/subjects.json or the script, then re-run it.')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(old, f, ensure_ascii=False, indent=2)
        f.write('\n')
    hand = sum(1 for c in cards.values() if c['subject_source'] != 'auto')
    print(f'Wrote {len(cards)} {ch["n"]} cards to art/manifest.json ({hand} with hand-written subjects).')


if __name__ == '__main__':
    main()
