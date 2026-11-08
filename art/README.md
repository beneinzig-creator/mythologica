# Card art pipeline

AI card art for Mythologica, made with the OpenAI Images API. It starts with Odysseus.

| File | What it is |
| --- | --- |
| `STYLE.md` | The shared look: 1990s hand-painted card art, dark palette, art-box framing |
| `subjects.json` | Optional hand-written scene per card (you can edit this) |
| `build_manifest.py` | Reads the game data and writes `manifest.json` |
| `manifest.json` | One entry per card: name, lore line, prompt and output path (generated, don't hand-edit) |
| `generate.py` | Calls OpenAI for each card and saves `art/odysseus/<id>.webp` |
| `INTEGRATION.md` | Proposal for showing the art in the game, with the emoji as fallback |

Everything uses the Python 3 that's already on your Mac. There's nothing to install.

## One-time setup: your API key

Your key stays on your Mac. Don't paste it into a chat, a file in this folder, or GitHub.

1. Open **Terminal**.
2. Run `touch ~/.zshrc && open -e ~/.zshrc` to open your shell settings in TextEdit.
3. Add this line at the bottom, with your real key between the quotes:
   `export OPENAI_API_KEY="sk-your-key-here"`
4. Save, quit TextEdit, then **open a new Terminal window**.
5. Check it. This prints only whether the key is set, never the key itself:
   `python3 -c "import os;print('key is set' if os.environ.get('OPENAI_API_KEY') else 'key NOT set')"`

To remove the key later, delete that line from `~/.zshrc`. If you think the key has leaked, revoke it
at platform.openai.com → API keys.

## Making pictures

Run these from the repo folder (`cd ~/Desktop/Mythologica`, or whichever folder has this branch):

```bash
python3 art/generate.py --test          # the 5-card style test: spear, cerb, zeus, gale, leon
open art/review.html                     # look at the results
```

When you're happy with the style:

```bash
python3 art/generate.py --all --dry-run # shows what would be made, costs nothing
python3 art/generate.py --all           # makes every card that has no picture yet
```

- Each picture takes about 20 to 60 seconds. Cards that already have a picture are skipped, so you can
  stop with Ctrl+C at any time and run it again later.
- To redo one card: edit its line in `subjects.json`, run `python3 art/build_manifest.py`, then
  `python3 art/generate.py --ids cerb --force`.
- Cost: images are billed by output size and quality. A high-quality 1536×1024 image costs roughly
  $0.20 (check your usage page at platform.openai.com). `--quality medium` costs about a quarter of that.
- Model: the default is `gpt-image-2.5-sunburst`, which OpenAI recommends for new integrations.
  `python3 art/generate.py --list-models` shows what your key can use. To try another model:
  `python3 art/generate.py --test --force --model gpt-image-2.6-sunburst`.

## If something goes wrong

- **"OPENAI_API_KEY is not set"**: open a *new* Terminal window after editing `~/.zshrc`.
- **HTTP 401**: the key is wrong or revoked. Make a new one at platform.openai.com → API keys.
- **HTTP 403, mentioning verification**: GPT Image models need a verified organization. Verify it at
  platform.openai.com → Settings → Organization → General, then wait a few minutes.
- **HTTP 429, or "billing"/"quota"**: add a payment method or credit under Settings → Billing.
- **HTTP 400 that mentions safety**: the prompt was blocked. Soften that card's line in `subjects.json`.

## When the game data changes

Run `python3 art/build_manifest.py` again after cards are added or renamed. Existing pictures are kept,
and only cards without a picture get generated.
