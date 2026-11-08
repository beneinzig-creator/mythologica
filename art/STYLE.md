# Mythologica card art — style guide

This is the one shared look for every card picture. `build_manifest.py` writes it into every prompt
(the `STYLE` block in that script mirrors the "Prompt style block" below), so change both together.

## The look in one line

**Hand-painted fantasy card illustration in the spirit of mid-1990s trading-card art: oil and gouache on
board, visible brushwork, dramatic low light, dark and earthy, one clear subject. Retro, but clean and
readable at thumbnail size.**

## Pillars

1. **Traditional paint, not digital gloss.** Visible brush strokes, slightly soft edges, painted
   texture. No airbrushed 3D render, no photo-realism, no anime, no neon, no lens flares, no glossy
   "concept art" sheen.
2. **Dark palette.** Deep shadows that fall off to near-black at the edges (so the art sits well on the
   game's dark table). Earth tones: umber, ochre, olive, bronze, oxblood, deep sea-teal. One warm light
   source picks out the subject (torch, sunset, divine glow).
3. **One subject, one silhouette.** Cards are shown about 90 px wide. Each picture needs a single,
   instantly readable focal shape, centred, with simple background masses behind it. No crowded scenes
   and no tiny detail that only reads at full size.
4. **Mythic Greek setting (Odysseus).** Bronze Age Aegean: bronze armour, crested helmets, round aspis
   shields, linen chitons, wine-dark sea, white limestone, temples, cypress, smoke and fire. Keep it
   grounded and grim rather than toy-like.
5. **No text, no frame.** The game draws the card frame, the name and the numbers. The image must have no
   letters, runes-as-text, borders, card frames, logos or watermarks.
6. **No artist names.** We describe the era and the technique, never "in the style of <living artist>".

## Framing (the art box)

- **Aspect:** generate at **1536×1024 (3:2 landscape)**. In-game the art box is roughly 3:2 and the image
  is shown with `object-fit: cover`, so a little of the left and right edges may be cropped.
- **Safe area:** keep the subject inside the **central 60%** horizontally and the **middle 70%**
  vertically. Heads and weapons must not touch the edges.
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

## Prompt style block (copied into every prompt)

> Fantasy trading-card illustration in the style of mid-1990s hand-painted card art: traditional oil and
> gouache on illustration board, visible brushwork, painterly texture, slightly muted earthy colours.
> Dark, moody palette with deep shadows falling to near-black at the edges, a single warm key light on
> the subject. One clear focal subject, centred, strong readable silhouette, simple background.
> Landscape 3:2 composition; keep the subject in the central area with dark, uncluttered bottom corners.
> No text, no letters, no border, no card frame, no logo, no watermark. Not photorealistic, not 3D
> render, not anime.

## Reviewing a batch

Open `art/review.html` after a run. Check each picture at small size (how it looks in a hand), not
only at full size. If a card misses, change its line in `art/subjects.json`, delete the image, and run
the generator again for just that card.
