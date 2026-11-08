# Proposal: showing card art in the game

Not implemented yet. The game is built by the patch pipeline in `tooling/`, and that pipeline is being
reworked in a separate session. Once it settles, this should go in as one small patch (or a direct edit,
if `index.html` becomes the source of truth).

## Where the art goes

Cards are drawn by one template in `tooling/n1.html`. The art box is currently just the emoji:

```js
<div class="ar">${d[7]}${so}</div>          // d[7] = emoji, so = 💀 skull badge
```

## Change 1: an art lookup and an image layer over the emoji

```js
// Card ids that have a picture. Generated from the art folder at build time.
const ART = {spear:1, cerb:1, zeus:1, gale:1, leon:1 /* … */};
const artSrc = id => ART[id] ? `art/${CH_DIR[CH]||CH}/${id}.webp` : '';   // CH_DIR = {ody:'odysseus'}

// in the card template:
<div class="ar">${d[7]}${artSrc(c.id)?`<img class="art" src="${artSrc(c.id)}" alt="" loading="lazy" onerror="this.remove()">`:''}${so}</div>
```

```css
.ar{overflow:hidden}
.ar img.art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 40%;pointer-events:none}
.ar .ob{z-index:1}            /* keep the 💀 sacrifice badge above the picture */
```

The emoji fallback is automatic:

- If a card has no entry in `ART`, only the emoji is drawn, as now.
- If the image file is missing or fails to load, `onerror` removes the `<img>`, and the emoji under it
  shows again.
- An image covers the emoji while it loads, so nothing jumps around.

Optionally, add a setting toggle (`art on/off`) that just skips the `<img>`. It's handy for comparing
looks and for slow phones.

## Change 2: shipping the files

The game is currently one self-contained HTML file. There are two options:

1. **Folder next to the HTML (recommended to start).** Ship `index.html` with an `art/` folder beside it.
   This is simple, the browser caches each picture, and the game still works if the folder is missing,
   because the emoji fallback covers it. Most hosting (GitHub Pages, itch.io zip) handles this fine.
2. **Embed in the HTML.** At build time, shrink each picture to about 400×266 webp (around 20–30 KB) and
   inline it as a `data:` URL in the `ART` table, so `ART.spear = 'data:image/webp;base64,…'`. That keeps
   a true single file, but 80 cards add about 2 MB per hero. This is worth doing only if single-file
   distribution matters.

Either way, the full-size 1536×1024 originals stay in `art/<hero>/` as the master copies. A small build
step can make in-game thumbnails from them with macOS `sips`, with no new tools:
`sips -Z 400 -s format jpeg in.webp --out thumb.jpg`, or keep webp through the generator's settings.

## Change 3 (later): enemy and boss art

The manifest builder already works for any hero (`--hero odin`). Enemy cards live in the same `D`
table, so enemy decks can use the same `ART` lookup once their ids are added to the manifest.
