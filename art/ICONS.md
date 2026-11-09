# Emoji → painted icons: spec for Odysseus

Status: **spec only, nothing generated yet** (except the Offering skull, already done).
Scope: Odysseus's runs and his opponents. Odin and Wukong get their own icon sets later, in the style of
their own myths, so nothing here is meant as a shared, general style.

Inventory of `tooling/n1.html` (Nov 2026): 225 different emoji, used 627 times. They fall into four groups:

| Group | What it is | Odysseus count | Plan |
| --- | --- | --- | --- |
| A. Card art | the emoji in each card's art box (`D[id][7]`) | 80 player cards + 84 opponent cards + 11 trumps | Replaced by painted card art (pipeline already built) |
| B. Interface | life, mana, actions, stance, badges, markers | 18 icons | Small painted icons (this spec) |
| C. Map | campfire, forge, altar, start, ship marker | 7 icons | Small painted icons (this spec) |
| D. Opponent portraits | the face of each enemy, elite and boss (`ic`) | 11 + Odysseus's own emblem | Painted round medallions (this spec) |

## How every icon is made

- Same recipe as the Offering skull: the `ICON_BASE` text in `build_manifest.py`. That means rustic 1990s
  hand-painted look (gouache and ink, muted antique colours, slightly worn), bold silhouette that reads at
  16 px, transparent background, no text, no badge behind it.
- Greek and true to the myth wherever it fits (e.g. the Sirens are bird-women, as Greek art shows them, not mermaids).
- Made at 1024×1024 PNG, shrunk to 64 px and 128 px for the game. The game keeps the emoji as fallback.
- Generate with `python3 art/generate.py --icons` once each entry is added to `ICONS` in `build_manifest.py`.

## B. Interface icons (18)

| Now | Meaning | Where it shows | Proposed painted icon |
| --- | --- | --- | --- |
| 💀 | Offering (sacrifice) value | badge on every army member, rules text, tips | **Done:** weathered skull with a laurel sprig |
| ❤ | Life | player bar, map screens, Blood price button | a heart of red enamel set in worn bronze |
| ◆ | Mana | mana orb, enemy panel, quick-spell prompt | a drop of golden ichor (the blood of the gods) |
| ⚡ | Action points (map) | map header and dialogs | a small bronze thunderbolt of Zeus |
| 🏆 | Victory points | map header, victory screen | a laurel wreath |
| ⚔️ | Attack form | stance label above a card | two crossed bronze swords (xiphos) |
| 🛡️ | Defense form | stance label above a card | a round bronze aspis shield |
| ⇄ | Switch stance | stance label and its button | keep as a plain text arrow (it's a control, not a picture) |
| ★ | Upgrade level on a card | next to the card name | a small gold laurel leaf per upgrade |
| 🎯 | "Choose a target" marker | corner of a targetable card | a bronze arrowhead pointing down |
| ✖ | Fight already won (map node) | cleared map nodes | a broken spear |
| ✓ | Upgrade chosen | upgrade screen | keep as plain text |
| ☰ | Menu button | top corner | keep as plain text |
| → | "turns into" in Blood price | Blood price button | keep as plain text |
| ☀️ | Sacrilege counter (Cattle of the Sun elite) | status line in that fight | the sun disc of Helios |
| 🔮 | Foretold (elite trump) | status line | the bronze tripod of the Delphic oracle |
| 💰 | Gold (hoard trump) | status line | a small heap of silver drachmas |
| 🌀 | Whirlpool countdown (Charybdis) | status line in that fight | a churning whirlpool seen from above |

Not in scope: ⛓ Momentum (Wukong only). 🎁 "A Gift from the One True God" (a one-off bonus message; where it appears is still to check).

## C. Map icons (7)

| Now | Meaning | Proposed painted icon |
| --- | --- | --- |
| ⚓ | Starting point (also Odysseus's emblem) | a bronze anchor wrapped in rope |
| ⛵ | "You are here" marker | a small black Greek ship with a square sail and painted eye |
| 🔥 | Campfire | a driftwood fire on beach stones |
| 🔨 | Crafting table | the hammer and anvil of Hephaestus |
| 🏛️ | Altar | a small stone altar with offering smoke |
| 🔱 | The great altar (after 4 victory points) | Poseidon's trident, faintly glowing |
| ✖ | Cleared fight | same broken spear as in B |

## D. Opponent portraits (11 + hero)

Shown on map nodes, hover tips and the fight screen. Proposal: a painted round medallion for each,
like an old coin or a vase roundel, so they read as "who you fight" at a glance.

| Now | Opponent | Type | Proposed medallion |
| --- | --- | --- | --- |
| 🪷 | The Lotus-Eaters | enemy | a drooping lotus flower with sleepy, half-closed petals |
| 🧜 | The Sirens | enemy | a Siren as the Greeks drew her: a woman's head on a bird's body, singing |
| 👁️ | Polyphemus | enemy | the single great eye of the Cyclops, glaring |
| 💀 | The Shades of Hades | enemy | a pale shade's face fading into grey mist (no skull, to keep 💀 for Offering) |
| ⛵ | The Phaeacians | enemy | a swift Phaeacian ship with oars out |
| 🪓 | The Cicones | enemy | a Thracian battle axe |
| 🐖 | Circe, Witch of Aeaea | elite | a pig beside Circe's golden cup |
| 🐂 | Cattle of the Sun | elite | a sacred white cow with a sun disc between her horns |
| 🐴 | Hector, Tamer of Horses | boss | a Trojan horse-hair crested helmet beside a horse's head |
| 🦑 | Scylla | boss | Scylla's snarling dog heads rising from a sea cave (not a squid) |
| 🌀 | Charybdis | boss | the open maw of the whirlpool |
| ⚓ | Odysseus (hero) | hero | the anchor from C, framed as a medallion |

## A. Card art still to plan

- Player cards: all 80 are in `manifest.json` with scenes.
- **Opponent cards (84) and trumps (11):** not in the manifest yet. They need their own scenes in
  `subjects.json` and a manifest section built from each enemy's deck. Same frames as Odysseus's cards.
  Their trumps are `lhz canto mouth hdead blackship hitr cup sacril walls heads whirl`.

## Rough cost

| Batch | Images | Quality | About |
| --- | --- | --- | --- |
| Interface + map + portraits | ~30 | high, 1024×1024 | $1.60 |
| Opponent cards + trumps | 95 | high | $3.90 (medium: $1) |
| Rest of Odysseus's player cards | 75 | your plan: rares/legendaries high, others medium | ~$1.40 |
