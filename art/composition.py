"""Composition planner: makes every card in a group look different at a glance.

Each card gets a camera shot, an angle, a light/colour key and a sense of power. Within a group
(an archetype of the hero's cards, or one opponent's deck) no two cards share the same shot and
angle, and colour keys don't repeat until the list runs out. Rarity drives the framing: Commons are
humble and at eye level; Legendaries are shot from a very low angle, towering, with dramatic light,
so a legendary hero never reads like a common soldier.

Hand-written direction for specific cards lives in art/compositions.json and wins over the planner.
The plan is deterministic (seeded by group name), so re-running build_manifest.py gives the same prompts.
"""
import hashlib, json, os, random, re

ART = os.path.dirname(os.path.abspath(__file__))

SHOTS = {
    'person': ['a tight close-up of the face', 'a head-and-shoulders portrait', 'a waist-up portrait',
               'a full figure filling the frame', 'a figure caught mid-motion, filling the frame',
               'an extreme close-up of the eyes and helmet'],
    'monster': ['the creature filling the whole frame, head close to the viewer', 'a close-up of the head and jaws',
                'the creature lunging straight at the viewer', 'the full body of the creature filling the frame',
                'an extreme close-up of an eye and part of the face'],
    'spell': ['the moment of impact, close up', 'a hand or weapon in the foreground with the effect bursting beyond',
              'silhouettes against a blast of light', 'the effect swirling around a single figure, close up',
              'a close-up of a face lit by the effect', 'the effect seen at its peak, filling the frame'],
    # items and modifiers: objects, places or standing effects
    'object': ['a close-up of the main subject filling the frame', 'a dramatic close-up of one telling detail',
               'the main subject alone and centred, close up', 'the main subject with a single figure beside it for scale',
               'the main subject partly in silhouette against light'],
}
ANGLES = {
    'person': ['at eye level', 'from a low angle looking up', 'from slightly above', 'in side profile',
               'over the shoulder from behind', 'at a dramatic tilted angle'],
    'monster': ['from a low angle looking up', 'at eye level', 'from slightly above', 'in side profile',
                'at a dramatic tilted angle'],
    'spell': ['from a low angle', 'from directly above', 'at eye level', 'at a dramatic tilted angle'],
    'object': ['from a low angle', 'from directly above', 'at eye level', 'at a dramatic tilted angle'],
}
PALETTES = ['dawn rose and pale gold', 'harsh noon white and ochre', 'deep crimson sunset', 'cold moonlight silver-blue',
            'warm torchlight orange in darkness', 'stormy grey-green', 'underworld green and black', 'deep sea teal',
            'firelight red and black', 'marble white and gold', 'twilight violet', 'smoky amber haze',
            'icy dawn blue', 'dusty bronze and brown']
POWER = {
    'Common': 'an ordinary, humble presence at a modest scale',
    'Staple': 'an ordinary, humble presence at a modest scale',
    'Uncommon': 'a capable, confident presence',
    'Rare': 'an imposing, dramatic presence with strong rim light',
    'Legendary': 'larger than life, monumental and iconic, with divine golden rim light; '
                 'the most dramatic kind of image in the set',
    'common': 'a dangerous but ordinary foe', 'uncommon': 'a formidable foe',
    'rare': 'a terrifying, dominant presence that fills the frame',
    'legendary': 'an overwhelming, mythic sight',
}
MONSTER_WORDS = re.compile(r'beast|hound|bird|serpent|bull|horse|steed|herd|monster|head of|whirlpool|sea spirit|'
                           r'eel|sheep|owl|eagle|raven|wolf|lion|siren|plant|giant|cyclops|dead|shade|spirit', re.I)


def kind_of(card_type, lore, name):
    if card_type in ('Quick spell', 'Spell'):
        return 'spell'
    if card_type in ('Item', 'Modifier'):
        return 'object'
    return 'monster' if MONSTER_WORDS.search(f'{lore} {name}') else 'person'


def _rng(group):
    return random.Random(int(hashlib.md5(group.encode()).hexdigest()[:8], 16))


def plan(groups):
    """groups: {group name: [(card id, card type, lore, name, rarity)]} -> {card id: plan dict}"""
    over_path = os.path.join(ART, 'compositions.json')
    overrides = json.load(open(over_path, encoding='utf-8')) if os.path.exists(over_path) else {}
    order = {'Legendary': 0, 'legendary': 0, 'Rare': 1, 'rare': 1, 'Uncommon': 2, 'uncommon': 2}
    out = {}
    for group, members in groups.items():
        rng = _rng(group)
        pals = PALETTES[:]
        rng.shuffle(pals)
        used, pi = set(), 0
        for cid, ctype, lore, name, rarity in sorted(members, key=lambda m: (order.get(m[4], 3), m[0])):
            k = (overrides.get(cid) or {}).get('kind') or kind_of(ctype, lore, name)
            if rarity in ('Legendary', 'legendary') and k in ('person', 'monster'):
                combos = [('a monumental full figure', 'seen from a very low angle')]
            else:
                combos = [(s, a) for s in SHOTS[k] for a in ANGLES[k]]
                rng.shuffle(combos)
            shot, angle = next((c for c in combos if (k, c) not in used), combos[0])
            used.add((k, (shot, angle)))
            palette = pals[pi % len(pals)]
            pi += 1
            p = {'group': group, 'kind': k, 'shot': shot, 'angle': angle, 'palette': palette,
                 'power': POWER.get(rarity, '')}
            o = overrides.get(cid)
            if o:
                p.update({kk: v for kk, v in o.items() if not kk.startswith('_')})
                p['source'] = 'compositions.json'
            out[cid] = p
    return out


def describe(p):
    """The composition block that goes into the prompt."""
    if p.get('composition'):
        frame = p['composition']
    else:
        frame = f"{p['shot']}, {p['angle']}"
    return (f"Composition: {frame}. Light and colour: {p['palette']}. Presence: {p['power']}. "
            f"The subject fills most of the picture; keep the background minimal.")
