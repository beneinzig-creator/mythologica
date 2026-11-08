#!/usr/bin/env python3
"""Generate card art with the OpenAI Images API, from art/manifest.json.

    python3 art/generate.py --test            # the 5-card style test batch
    python3 art/generate.py --ids ajax,achil  # just these cards
    python3 art/generate.py --all             # every card in the manifest
    python3 art/generate.py --all --dry-run   # show what would run, spend nothing
    python3 art/generate.py --list-models     # image models your key can use

Existing images are skipped (use --force to redo one). Each image also gets a
small .json note next to it with the model and prompt that made it, and
art/review.html is rebuilt so you can look at the results.

The API key is read ONLY from the OPENAI_API_KEY environment variable (or a
gitignored .env file at the repo root with one line OPENAI_API_KEY=...).
It is never printed or written anywhere by this script.
Python 3 standard library only: nothing to install.
"""
import argparse, base64, html, json, os, sys, time, urllib.error, urllib.request

ART = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(ART)
API = 'https://api.openai.com/v1'
# GPT Image 2.5 is what OpenAI's docs recommend for new integrations (Nov 2026).
# "sunburst" = higher quality, "flare" = faster. Try --model gpt-image-2.6-sunburst too.
DEFAULT_MODEL = 'gpt-image-2.5-sunburst'
TEST_BATCH = ['spear', 'cerb', 'zeus', 'gale', 'leon']  # soldier, beast, item, spell, legend


def get_key():
    key = os.environ.get('OPENAI_API_KEY', '').strip()
    env = os.path.join(ROOT, '.env')
    if not key and os.path.exists(env):
        for line in open(env, encoding='utf-8'):
            line = line.strip()
            if line.startswith('export '):
                line = line[7:]
            if line.startswith('OPENAI_API_KEY='):
                key = line.split('=', 1)[1].strip().strip('"\'')
    if not key:
        sys.exit('OPENAI_API_KEY is not set. In Terminal run:  export OPENAI_API_KEY="sk-..."\n'
                 '(or see art/README.md for a permanent setup). Never paste the key into chat.')
    return key


def call(key, path, body=None, timeout=300):
    req = urllib.request.Request(API + path, method='POST' if body else 'GET',
                                 data=json.dumps(body).encode() if body else None,
                                 headers={'Authorization': 'Bearer ' + key,
                                          'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read()).get('error', {}).get('message', '')
        except Exception:
            msg = ''
        raise RuntimeError(f'HTTP {e.code}: {msg or e.reason}') from None


def load_cards(hero):
    path = os.path.join(ART, 'manifest.json')
    if not os.path.exists(path):
        sys.exit('art/manifest.json is missing. Run:  python3 art/build_manifest.py')
    m = json.load(open(path, encoding='utf-8'))
    if hero not in m.get('heroes', {}):
        sys.exit(f'No {hero!r} section in the manifest. Run:  python3 art/build_manifest.py --hero {hero}')
    return m['heroes'][hero]['cards']


def write_review(cards):
    """art/review.html: each generated picture next to the emoji it replaces, at full and hand size."""
    tiles = []
    for cid, c in cards.items():
        p = os.path.join(ROOT, c['output'])
        if not os.path.exists(p):
            continue
        rel = os.path.relpath(p, ART)
        tiles.append(f'''<figure><img class=big src="{html.escape(rel)}" alt="">
<div class=row><div class=mini><div class=nm>{html.escape(c['name'])}</div><div class=ar>
<span class=emo>{c['emoji']}</span><img src="{html.escape(rel)}" alt="" onerror="this.remove()"></div>
<div class=ty>{html.escape(c['lore'] or c['type'])}</div></div>
<figcaption><b>{html.escape(c['name'])}</b> <code>{cid}</code><br>{html.escape(c['rarity'])} · {html.escape(c['archetype'])} · was {c['emoji']}</figcaption></div></figure>''')
    page = f'''<!doctype html><meta charset=utf-8><title>Card art review</title>
<style>body{{background:#0b1820;color:#efe6cf;font:14px system-ui;margin:24px}}h1{{font-weight:600}}
main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px}}
figure{{margin:0;background:#12242e;padding:12px;border-radius:8px}}.big{{width:100%;border-radius:4px;display:block}}
.row{{display:flex;gap:14px;margin-top:10px;align-items:center}}figcaption{{color:#c9bfa6}}code{{color:#e0b04a}}
.mini{{width:104px;height:146px;flex:none;background:#e4dbb8;border:3px solid #0c0a07;border-radius:8px;padding:3px;display:flex;flex-direction:column;font-size:9px;color:#1b1710}}
.nm{{font-weight:700;white-space:nowrap;overflow:hidden}}.ty{{font-style:italic;padding:2px 0 40px}}
.ar{{position:relative;flex:1;display:grid;place-items:center;font-size:30px;border:1px solid #0009;margin:2px 0;overflow:hidden}}
.ar img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}</style>
<h1>Card art review ({len(tiles)} images)</h1><p>Left: full image. Small card: roughly how it looks in a hand, with the emoji as fallback underneath.</p>
<main>{''.join(tiles)}</main>'''
    open(os.path.join(ART, 'review.html'), 'w', encoding='utf-8').write(page)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = ap.add_mutually_exclusive_group()
    g.add_argument('--test', action='store_true', help='the 5-card test batch: ' + ', '.join(TEST_BATCH))
    g.add_argument('--ids', help='comma-separated card ids')
    g.add_argument('--all', action='store_true', help='every card in the manifest')
    g.add_argument('--list-models', action='store_true', help='list image models your key can use')
    ap.add_argument('--hero', default='ody')
    ap.add_argument('--model', default=os.environ.get('MYTHO_IMAGE_MODEL', DEFAULT_MODEL))
    ap.add_argument('--quality', default='high', help='low, medium, high (default), auto')
    ap.add_argument('--size', default='1536x1024', help='default 1536x1024 (3:2 landscape)')
    ap.add_argument('--force', action='store_true', help='regenerate even if the image exists')
    ap.add_argument('--dry-run', action='store_true', help='print what would be generated, call nothing')
    a = ap.parse_args()

    if a.list_models:
        models = call(get_key(), '/models')['data']
        names = sorted(m['id'] for m in models if 'image' in m['id'] or 'dall' in m['id'])
        print('\n'.join(names) or 'No image models visible for this key.')
        return

    cards = load_cards(a.hero)
    if a.test:
        ids = TEST_BATCH
    elif a.ids:
        ids = [i.strip() for i in a.ids.split(',') if i.strip()]
    elif a.all:
        ids = list(cards)
    else:
        ap.print_help()
        return
    bad = [i for i in ids if i not in cards]
    if bad:
        sys.exit('Not in the manifest: ' + ', '.join(bad))

    todo = [i for i in ids if a.force or not os.path.exists(os.path.join(ROOT, cards[i]['output']))]
    print(f'{len(ids)} cards selected, {len(ids) - len(todo)} already have art, {len(todo)} to generate '
          f'with {a.model} ({a.quality}, {a.size}).')
    if a.dry_run:
        for i in todo:
            print(f'  {i:10} -> {cards[i]["output"]}')
        return
    if not todo:
        write_review(cards)
        return
    key = get_key()

    failed = []
    for n, cid in enumerate(todo, 1):
        c = cards[cid]
        out = os.path.join(ROOT, c['output'])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        print(f'[{n}/{len(todo)}] {cid} ({c["name"]}) ...', end=' ', flush=True)
        t = time.time()
        body = {'model': a.model, 'prompt': c['prompt'], 'size': a.size, 'quality': a.quality,
                'n': 1, 'output_format': 'webp', 'output_compression': 85}
        for attempt in range(3):
            try:
                r = call(key, '/images/generations', body)
                break
            except RuntimeError as e:
                err = str(e)
                # 429 / 5xx are worth retrying; anything else (bad key, unverified org,
                # moderation block, unknown model) will not get better by waiting.
                if attempt < 2 and (err.startswith('HTTP 429') or err.startswith('HTTP 5')):
                    time.sleep(10 * (attempt + 1))
                    continue
                r = None
                break
            except Exception as e:  # network trouble, timeout
                err = f'{type(e).__name__}: {e}'
                r = None
                if attempt < 2:
                    time.sleep(10)
                    continue
                break
        if not r or not r.get('data'):
            print('FAILED  ' + err)
            failed.append(cid)
            if err.startswith(('HTTP 401', 'HTTP 403', 'HTTP 404')):
                print('Stopping: this error will repeat for every card. See art/README.md, "If something goes wrong".')
                break
            continue
        with open(out, 'wb') as f:
            f.write(base64.b64decode(r['data'][0]['b64_json']))
        meta = {'id': cid, 'model': a.model, 'quality': a.quality, 'size': a.size,
                'created': time.strftime('%Y-%m-%d %H:%M:%S'), 'prompt': c['prompt'],
                'revised_prompt': r['data'][0].get('revised_prompt'), 'usage': r.get('usage')}
        with open(os.path.splitext(out)[0] + '.json', 'w', encoding='utf-8') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)
        print(f'ok ({time.time() - t:.0f}s)')

    write_review(cards)
    print(f'\nDone. {len(todo) - len(failed)} made, {len(failed)} failed{": " + ", ".join(failed) if failed else ""}.')
    print('Open the review page:  open art/review.html')


if __name__ == '__main__':
    main()
