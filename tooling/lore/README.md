# Lore

All of Mythologica's story text lives here, one file per realm. `tooling/patch_lore.py` (the last patch in `build.py`) splices these files into the game, so to change lore you edit a file here and rebuild.

| File | Realm | Hero |
|---|---|---|
| `greek.js` | the strait (Homer first) | Odysseus |
| `norse.js` | the Nine Worlds (the Eddas and sagas) | Odin |
| `chinese.js` | the Western Heaven (Journey to the West) | Sun Wukong |
| `egyptian.js` | the Two Lands (the Book of the Dead and the temple texts) | Thoth |
| `heaven.js` | Act III, the War in Heaven (the Bible, Enoch, Jubilees, the War Scroll, Tobit, the Avesta, the Goetia) | all |
| `shared.js` | cards every hero can draft | all |

Each file calls `LB.realm(key, {...})` with these sections:

- **`hero`**: `quote` plus `story`, a 3-sentence backstory. Together they replace `CHARS[key].quote` on the character-select screen. `CHARS[key].play`, the how-to-play blurb, is gameplay text and stays in the game code.
- **`cards`**: card id → one lore line. It appears **only while a card is inspected** (hold on it), under the card. The short phrase on the card's type line is the separate `LORE` table in the game code, kept short so the cards stay uncluttered.
- **`dyn`** (Egyptian only): lines for cards made during a fight: Body, Spirit, Name and Nameless.
- **`foes`**: regular enemy name → 2–3 sentences. The map tooltip shows the first sentence. The full text is meant for the future pre-fight screen with each enemy's big art.
- **`elites`**: elite name → 3 sentences. The elite intro card shows the first two, then the mechanical hint.
- **`bosses`**: boss name → exactly 5 sentences (`ut41` checks this). They hint at the boss's strategy and its weakness. Leave a boss out to keep the text already in the game; only Thoth's bosses are overridden so far.

Style: descriptive first, then esoteric or philosophical where the myth supports it. Keep each card line to one or two sentences, true to the source myth. No backticks inside strings.

Check coverage after a rebuild (every card id in `D` should have a line):

```bash
node -e "const vm=require('vm'),fs=require('fs');const s=fs.readFileSync('n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];const c=vm.createContext({console,setTimeout(){},requestAnimationFrame(){},innerWidth:1400,innerHeight:900,localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:()=>({}),querySelector:()=>null,addEventListener(){}},addEventListener(){}});vm.runInContext(s,c);console.log(vm.runInContext('Object.keys(D).filter(i=>!LB.cards[i])',c))"
```

Run it from `tooling/`.
