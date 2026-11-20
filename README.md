# Mythologica

A mythology-based roguelike deck-builder. Pick a hero, journey across a map of mythic encounters, draft cards between fights, and build your deck around an archetype.

**Play it:** [mythologica.vercel.app](https://mythologica.vercel.app), or open `index.html` in a browser (keep the `art/game/` folder next to it for the painted art).

## What's here

| Path | Contents |
| --- | --- |
| `index.html` | The game: card data, enemies, map, combat, AI and UI, in one file |
| `art/game/` | Game-ready painted art: cards, frames, icons, fight backgrounds, screens, home screen, card backs |
| `art/` | The art pipeline (OpenAI Images API): style guides, prompts, manifests and source images. See `art/README.md` |
| `docs/balance/` | Simulated win-rate tiers for Odysseus's and Odin's cards (older than the current balance) |
| `docs/ui/ui-board.html` | UI inspiration board |
| `HANDOFF.md` | Full design and developer handoff: rules, every card, enemies, balance, architecture, art status and roadmap |
| `tooling/` | The patch pipeline that builds the game, plus unit tests, Playwright scripts and the balance simulator |

## Heroes

| Hero | Realm | Archetypes | Painted art |
| --- | --- | --- | --- |
| Odysseus | Greek | Phalanx, Raiders, Offerings | Done |
| Odin | Norse | Berserkers, Valhalla, Runes | Done |
| Sun Wukong | Chinese | Staff, Clones, Trickster | Not started |
| Thoth | Egyptian | Sundered, Scribes, Recorder | Not started |

Each hero drafts from an 80-card pool. See `HANDOFF.md` for the details.

## Building

The game is a build product. `tooling/build.py` starts from `before_step12.html`, splices in the engine and hero scripts, and applies the patches in order: `patch_data.py`, `patch2.py` to `patch44.py`, `patch_fx.py`, the gameplay patches (`patch_bal`, `patch_pool`, `patch_thoth`, `patch_tut`, `patch_names`), then the art patches `patch45.py` to `patch56.py`.

```bash
cd tooling && ./rebuild.sh
```

This writes `tooling/n1.html`, the raw game, and syntax-checks it. Run the build from inside `tooling/`, because it writes relative to the current folder. `index.html` is the same game wrapped in a full HTML page. The tests (`ut41` to `ut50`, `t19`) and the simulator (`sim.js`, `simx.js`, `runset.sh`) need [Node.js](https://nodejs.org).

## Making changes

1. Branch from `main`.
2. Add your change as a new patch at the end of `tooling/build.py`, rebuild, rewrap `index.html`, and run the tests.
3. Open a pull request. Vercel builds a preview for every PR and deploys `main` to the live site when it's merged.

Don't deploy with `vercel --prod` from a local folder; it replaces the live site with whatever is in that folder.
