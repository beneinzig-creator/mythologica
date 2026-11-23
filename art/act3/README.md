Act III card pictures (art/act3/<card id>.webp, with <id>.json holding the prompt, look and role) live here. Act III is shared by every hero; its cards are all opponents', framed by tier with the x* frames: regular decks xc, elites xu, generals and the Last Battle xr, trumps xl (art/act3/cards.json lists each card's name, type and tier).

Looks (Ben, Nov 2026), all generated at high quality: B hand-coloured 1500s Bible woodcut for every boss-deck card and the elite leaders and trumps; D grotesque Romanesque fresco as the main look for regular and elite decks; A illuminated Apocalypse manuscript and C cathedral stained glass for variety (glass never on a scary card). Everything should look intimidating; no Christ, God or saints in the pictures.

To refresh the game copies: python3 art/build_manifest.py --hero act3, then python3 art/make_game_assets.py --hero act3, then rebuild tooling/n1.html.
