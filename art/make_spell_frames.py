#!/usr/bin/env python3
"""Make the frame variant for cards that aren't army members (spells, items, modifiers):
the same frame with the power/health plaque painted out, using the Images edit endpoint.

    python3 art/make_spell_frames.py              # all rarities that don't have one yet
    python3 art/make_spell_frames.py rare --force # redo one

Writes art/frames/<hero>/<rarity>_spell.webp. The plaque position comes from
measure_frames.MANUAL, so run measure_frames.py again afterwards.
Python standard library + macOS sips only. Key handling as in generate.py.
"""
import argparse, base64, json, os, struct, subprocess, sys, tempfile, time, urllib.request, urllib.error, uuid, zlib

ART = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ART)
import generate  # noqa: E402  (get_key, API, DEFAULT_MODEL)
import measure_frames  # noqa: E402  (MANUAL boxes, HERO_DIR)

PROMPT = ('Remove the small empty plaque in the bottom-right corner of this card frame. Continue the parchment '
          'text box, its border and the outer frame exactly as they look elsewhere on the card, so the text box '
          'is a clean rectangle with an ordinary border and corner at the bottom right. Keep the same worn, '
          'rustic texture. Change nothing else; leave the black art window solid black.')
MARGIN = 18  # px around the plaque that the edit may repaint


def png_mask(w, h, box):
    """RGBA PNG: opaque everywhere (keep) except a transparent rectangle (repaint)."""
    x0, y0, x1, y1 = box
    rows = []
    keep = b'\x00\x00\x00\xff'
    edit = b'\x00\x00\x00\x00'
    for y in range(h):
        if y0 <= y < y1:
            row = keep * x0 + edit * (x1 - x0) + keep * (w - x1)
        else:
            row = keep * w
        rows.append(b'\x00' + row)
    raw = zlib.compress(b''.join(rows), 9)

    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
            + chunk(b'IDAT', raw) + chunk(b'IEND', b''))


def multipart(fields, files):
    b = uuid.uuid4().hex
    out = []
    for k, v in fields.items():
        out.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    for k, (name, data, ctype) in files.items():
        out.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{name}"\r\n'
                   f'Content-Type: {ctype}\r\n\r\n'.encode() + data + b'\r\n')
    out.append(f'--{b}--\r\n'.encode())
    return b''.join(out), f'multipart/form-data; boundary={b}'


def edit(key, model, image_png, mask_png, quality):
    body, ctype = multipart({'model': model, 'prompt': PROMPT, 'size': '1024x1536', 'quality': quality,
                             'output_format': 'webp', 'output_compression': '90', 'n': '1'},
                            {'image': ('frame.png', image_png, 'image/png'), 'mask': ('mask.png', mask_png, 'image/png')})
    req = urllib.request.Request(generate.API + '/images/edits', data=body, method='POST',
                                 headers={'Authorization': 'Bearer ' + key, 'Content-Type': ctype})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read()).get('error', {}).get('message', '')
        except Exception:
            msg = ''
        raise RuntimeError(f'HTTP {e.code}: {msg or e.reason}') from None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('rarities', nargs='*')
    ap.add_argument('--hero', default='ody')
    ap.add_argument('--model', default=generate.DEFAULT_MODEL)
    ap.add_argument('--quality', default='high')
    ap.add_argument('--force', action='store_true')
    a = ap.parse_args()
    boxes = measure_frames.MANUAL[a.hero]
    folder = os.path.join(ART, 'frames', measure_frames.HERO_DIR.get(a.hero, a.hero))
    todo = [r for r in (a.rarities or list(boxes))
            if a.force or not os.path.exists(os.path.join(folder, f'{r}_spell.webp'))]
    print(f'{len(todo)} spell frames to make, about ${0.05 * len(todo):.2f}.')
    if not todo:
        return
    key = generate.get_key()
    for r in todo:
        src = os.path.join(folder, f'{r}.webp')
        with tempfile.TemporaryDirectory() as tmp:
            png = os.path.join(tmp, 'f.png')
            subprocess.run(['sips', '-s', 'format', 'png', src, '--out', png], check=True, capture_output=True)
            x0, y0, x1, y1 = boxes[r]['pt']
            box = (max(0, x0 - MARGIN), max(0, y0 - MARGIN), min(1024, x1 + MARGIN), min(1536, y1 + MARGIN))
            print(f'{r} ...', end=' ', flush=True)
            t = time.time()
            try:
                res = edit(key, a.model, open(png, 'rb').read(), png_mask(1024, 1536, box), a.quality)
            except RuntimeError as e:
                print('FAILED', e)
                continue
        out = os.path.join(folder, f'{r}_spell.webp')
        open(out, 'wb').write(base64.b64decode(res['data'][0]['b64_json']))
        json.dump({'from': f'{r}.webp', 'model': a.model, 'quality': a.quality, 'prompt': PROMPT, 'mask_box': box,
                   'created': time.strftime('%Y-%m-%d %H:%M:%S'), 'usage': res.get('usage')},
                  open(out[:-5] + '.json', 'w'), indent=2)
        print(f'ok ({time.time() - t:.0f}s)')


if __name__ == '__main__':
    main()
