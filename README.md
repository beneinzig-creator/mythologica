# Mythologica

A mythology-based roguelike deck-builder. Pick a hero, journey across a map of mythic encounters, draft cards between fights, and build your deck around an archetype.

## Play

Open `index.html` in a browser. The whole game is a single self-contained HTML/JS file with no build step.

## What's here

| Path | Contents |
| --- | --- |
| `index.html` | The game: card data, enemies, map, combat, AI and UI |
| `docs/balance/odysseus-tiers.html` | Simulated win-rate tiers for Odysseus's cards (Phalanx, Raiders, Offerings) |
| `docs/balance/odin-tiers.html` | Simulated win-rate tiers for Odin's cards (Berserkers, Valhalla, Runes) |
| `HANDOFF.md` | Full design and developer handoff: rules, every card, enemies, balance, architecture and roadmap |
| `tooling/` | The patch pipeline that builds the game, plus unit tests, Playwright scripts and the balance simulator |

## Heroes

Odysseus (Greek), Odin (Norse) and Sun Wukong (Chinese) are playable. An Egyptian hero is planned. See `HANDOFF.md` for details.

## Building

The game is a build product. `tooling/build.py` starts from `before_step12.html`, splices in the engine and hero scripts, and applies `patch_data.py` and `patch2.py` through `patch40.py` in order.

```bash
python3 tooling/build.py n1.html
```

This writes `tooling/n1.html`, the raw game. `index.html` is the same game wrapped in a full HTML page. `tooling/rebuild.sh` also syntax-checks the output, and the tests (`ut41`–`ut47`, `t19`) and the simulator (`sim.js`, `runset.sh`) need [Node.js](https://nodejs.org).
