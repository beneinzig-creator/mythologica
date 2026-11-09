# Mythologica card art — style guide

This is the one shared look for every card picture. `build_manifest.py` writes it into every prompt
(the `STYLE` block in that script mirrors the "Prompt style block" below), so change both together.

## The look in one line

**Hand-made fantasy card illustration in the spirit of early-to-mid 1990s trading-card art: gouache,
watercolour and pen-and-ink, dark with bold accent colours, one clear subject that fills the frame, and
every scene taken from the real myth.**

## Reference cards (from Ben, Nov 2026)

These four 1990s cards set the target. We describe what we like about them in words; we never send them
to the image API or copy them.

| Card | What to take from it |
| --- | --- |
| Ihsan's Shade (1995) | Near-black figure filling the frame, glowing eyes, blood-orange sky behind, menace through silhouette alone |
| Kaysa (1996) | Watercolour and fine ink: pale washes, flowing hair and cloak, an airy misty background, elegant figure |
| Earthbind (1993) | Bold black ink outlines with flat, decorative colour, almost stained glass |
| Scaled Wurm (1999) | Bold, saturated, slightly whimsical colour (violet, orange, ivory) and a speckled starry background |

Common thread: traditional media with visible texture, stylised rather than realistic, strong shapes,
and the matte, slightly faded look of a printed 1990s card.

## Pillars

1. **Traditional media, not digital gloss.** Gouache, acrylic, watercolour and pen-and-ink, with visible
   strokes and paper texture. Stylised is good: inked outlines and flat patterned colour are welcome. No 3D
   render, no photo-realism, no anime, no glossy modern "concept art" sheen.
2. **Dark, with bold accents.** Near-black shadows (so the art sits well on the game's dark table), lit by
   a few saturated accents: ember orange, deep violet, sea teal, blood red.
3. **One subject, one silhouette.** Cards are shown about 90 px wide. Each picture needs a single,
   instantly readable focal shape, centred, with simple background masses behind it. No crowded scenes
   and no tiny detail that only reads at full size.
4. **True to the myth.** Each card shows its figure or moment as the ancient stories tell it (Homer,
   Hesiod, the tragedians): Argus recognising Odysseus, Charon on the Styx, the bag of winds of Aeolus.
   The scenes are in `subjects.json`. Setting for Odysseus: the Bronze Age Aegean: bronze armour, crested helmets, round aspis
   shields, linen chitons, wine-dark sea, white limestone, temples, cypress, smoke and fire. Keep it
   grounded and grim rather than toy-like.
5. **No text, no frame.** The game draws the card frame, the name and the numbers. The image must have no
   letters, runes-as-text, borders, card frames, logos or watermarks.
6. **No artist names.** We describe the era and the technique, never "in the style of <living artist>".

## Framing (the art box)

- **Aspect:** generate at **1536×1024 (3:2 landscape)**. In-game the art box is roughly 3:2 and the image
  is shown with `object-fit: cover`, so a little of the left and right edges may be cropped.
- **Fill the frame:** the subject may be cropped by the edges (like Ihsan's Shade), but its face or
  focal point stays near the centre, because the left and right edges may be cropped in-game.
- **Corners:** keep the **bottom-left and bottom-right corners dark and simple**. The 💀 sacrifice badge
  and other icons sit on the art.
- **Camera:** eye level or slightly low (heroic) for people and beasts; a close still-life for items;
  a dramatic moment of action for spells.
- **Light:** a single key light from upper left or behind (rim light); background darker than subject.

## Colour accent by card colour

Each card's frame colour (`D[id][8]`) adds a small accent to the palette. The base palette stays dark.

| Code | Frame | Accent in the art |
| --- | --- | --- |
| W | ivory | warm gold daylight, white marble, bronze |
| U | sea blue | moonlit sea-teal, cool mist, silver |
| B | ash grey | bone, ash, underworld green-black, ember |
| R | red | firelight, oxblood, burnished copper |
| G | green | olive groves, deep forest green |
| A | grey-gold | aged bronze and stone, candlelight |

## Subject rules by card type

- **Army member (creature):** full or three-quarter figure of the being, posed to match its keywords
  (Phalanx = braced behind a shield; Raider = mid-charge; Flying = airborne against sky; Offering =
  solemn, sacred, often with altar smoke).
- **Spell / Quick spell:** the moment the magic happens. One dramatic effect with a hint of who is
  casting it or who it hits.
- **Item / Modifier:** a still-life or place. The object or site, centred, lit like a relic.

## Prompt style block

The exact wording sent with every prompt is the `STYLE` string in `build_manifest.py`. It is kept in one
place so the guide and the prompts can't drift apart.

## Reviewing a batch

Open `art/review.html` after a run. Check each picture at small size (how it looks in a hand), not
only at full size. If a card misses, change its line in `art/subjects.json`, delete the image, and run
the generator again for just that card.

## Every card must look different (Ben, Nov 2026)

At a glance, no two cards in a group (an archetype, or one opponent's deck) should be confusable, and a
card's power should show in its picture. This is built into how prompts are made:

- **Composition planner** (`art/composition.py`): each card gets its own camera shot (face close-up,
  head and shoulders, full figure, creature lunging at the viewer, the moment of impact...), angle (low,
  eye level, above, side profile, from behind, tilted) and light/colour key. Within a group no shot+angle
  repeats, and colour keys don't repeat until the list runs out.
- **Power shows in the framing:** Commons are humble and at eye level; Rares imposing with rim light;
  Legendaries monumental, seen from a very low angle with divine light.
- **Tight framing:** the subject fills most of the picture; monsters especially get little background.
- **Hand direction** (`art/compositions.json`) for named and easily confused cards wins over the planner,
  e.g. the Hoplite seen from behind in the shield line vs Leonidas monumental from below vs the Spearman's
  face close-up.
- **Check after generating:** `python3 art/check_similarity.py` flags pairs in a group whose palettes are
  near-identical, or whose layout and colours are both close. The first set had 175 such pairs.

Safety-filter notes: the image model sometimes blocks heroic violence ("spear thrust at the viewer",
"blood-red", "towering over the viewer"). Calm, dignified wording ("spear held high", "deep crimson",
"monumental") gets the same picture through.
