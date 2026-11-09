#!/usr/bin/env python3
"""Make the small, game-ready copies of the art and the card -> frame table the game build reads.

    python3 art/make_game_assets.py            # Odysseus (default)

Writes (all loaded by the game by relative path):
  art/game/cards/<id>.jpg     card art, 480 px wide
  art/game/frames/<code>.jpg  rarity frames, 640 px wide (code: c u r l, plus s = no power/health plaque)
  art/game/icons/offering.png the Offering skull, 96 px
  art/game/cards.json         {card id: frame code} for every card that has art
Then rebuild the game:  cd tooling && python3 build.py n1.html   (patch46 reads cards.json)
Python standard library + macOS sips only. Only files that are missing or older than their source are redone.
"""
import argparse, json, os, subprocess

ART = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.join(ART, 'game')
HERO_DIR = {'ody': 'odysseus', 'odin': 'odin', 'wukong': 'wukong'}
TIER = {'Staple': 'c', 'Common': 'c', 'Uncommon': 'u', 'Rare': 'r', 'Legendary': 'l',
        'common': 'c', 'uncommon': 'u', 'rare': 'r', 'legendary': 'l'}
FRAME_NAME = {'c': 'common', 'u': 'uncommon', 'r': 'rare', 'l': 'legendary'}


def shrink(src, dst, width, fmt='jpeg', quality='78'):
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        return False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    cmd = ['sips', '-s', 'format', fmt]
    if fmt == 'jpeg':
        cmd += ['-s', 'formatOptions', quality]
    cmd += ['--resampleWidth', str(width), src, '--out', dst]
    subprocess.run(cmd, check=True, capture_output=True)
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--hero', default='ody')
    a = ap.parse_args()
    folder = HERO_DIR.get(a.hero, a.hero)
    hero = json.load(open(os.path.join(ART, 'manifest.json'), encoding='utf-8'))['heroes'][a.hero]

    table, made = {}, 0
    entries = [(cid, c, TIER.get(c.get('rarity'), 'c')) for cid, c in hero['cards'].items()]
    entries += [(cid, c, TIER.get(c.get('frame'), 'c')) for cid, c in (hero.get('opponents') or {}).items()]
    for cid, c, tier in entries:
        src = os.path.join(os.path.dirname(ART), c['output'])
        if not os.path.exists(src):
            continue
        made += shrink(src, os.path.join(GAME, 'cards', f'{cid}.jpg'), 480)
        army = c.get('type') == 'Army member'
        table[cid] = tier + ('' if army else 's')

    fr = os.path.join(ART, 'frames', folder)
    for code, name in FRAME_NAME.items():
        for suffix, tag in (('', ''), ('s', '_spell')):
            src = os.path.join(fr, f'{name}{tag}.webp')
            if os.path.exists(src):
                made += shrink(src, os.path.join(GAME, 'frames', f'{code}{suffix}.jpg'), 640, quality='82')
    icon = os.path.join(ART, 'icons', folder, 'offering.png')
    if os.path.exists(icon):
        made += shrink(icon, os.path.join(GAME, 'icons', 'offering.png'), 96, fmt='png')

    # layout.json uses the frame names; give the game the same boxes keyed by frame code.
    layout = json.load(open(os.path.join(fr, 'layout.json')))
    boxes = {}
    for code, name in FRAME_NAME.items():
        if name in layout:
            boxes[code] = layout[name]
        if f'{name}_spell' in layout:
            boxes[code + 's'] = layout[f'{name}_spell']
    with open(os.path.join(GAME, 'cards.json'), 'w', encoding='utf-8') as f:
        json.dump({'cards': table, 'boxes': boxes}, f, indent=0, sort_keys=True)
        f.write('\n')
    print(f'{len(table)} cards with art, {made} files (re)made. Wrote art/game/cards.json.')


if __name__ == '__main__':
    main()
