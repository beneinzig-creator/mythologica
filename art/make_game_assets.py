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
    ap.add_argument('--sigil', default=None, help='which card-back sigil the game uses (e.g. ouroboros); '
                    'remembered in art/game/back/sigil.txt')
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
    # every painted icon for this hero (interface, map, opponent medallions)
    idir = os.path.join(ART, 'icons', folder)
    for fn in sorted(os.listdir(idir)) if os.path.isdir(idir) else []:
        if fn.endswith('.png'):
            made += shrink(os.path.join(idir, fn), os.path.join(GAME, 'icons', fn), 128 if fn.startswith('med_') else 96, fmt='png')
    # card back (game-wide) and the sigil on it
    bdir = os.path.join(ART, 'back')
    if os.path.exists(os.path.join(bdir, 'back.webp')):
        made += shrink(os.path.join(bdir, 'back.webp'), os.path.join(GAME, 'back', 'back.jpg'), 400, quality='80')
    pick_file = os.path.join(GAME, 'back', 'sigil.txt')
    pick = a.sigil or (open(pick_file).read().strip() if os.path.exists(pick_file) else 'ouroboros')
    for fn in sorted(os.listdir(bdir)) if os.path.isdir(bdir) else []:
        if fn.startswith('sigil_') and fn.endswith('.png'):
            made += shrink(os.path.join(bdir, fn), os.path.join(GAME, 'back', fn), 256, fmt='png')
    chosen = os.path.join(GAME, 'back', f'sigil_{pick}.png')
    if os.path.exists(chosen):
        import shutil
        shutil.copyfile(chosen, os.path.join(GAME, 'back', 'sigil.png'))
        open(pick_file, 'w').write(pick + '\n')
        print(f'Card-back sigil: {pick}')

    # Fight backgrounds (all heroes that have any): art/game/scenes/<id>.jpg, plus
    # art/game/scenes.json {opponent name: {id, bg?}}, which patch49 reads at build time.
    sj = os.path.join(ART, 'scenes.json')
    scene_map = {}
    if os.path.exists(sj):
        for hero, items in json.load(open(sj, encoding='utf-8')).items():
            if hero.startswith('_'):
                continue
            for sid, s in items.items():
                src = os.path.join(ART, 'scenes', hero, f'{sid}.webp')
                if os.path.exists(src):
                    made += shrink(src, os.path.join(GAME, 'scenes', f'{sid}.jpg'), 1536, quality='72')
                    scene_map[s['name']] = {'id': sid, **({'bg': s['bg']} if s.get('bg') else {})}
        with open(os.path.join(GAME, 'scenes.json'), 'w', encoding='utf-8') as f:
            json.dump(scene_map, f, indent=0, sort_keys=True, ensure_ascii=False)
            f.write('\n')
        print(f'{len(scene_map)} fight backgrounds. Wrote art/game/scenes.json.')

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
