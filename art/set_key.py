#!/usr/bin/env python3
"""Save your OpenAI API key for generate.py, without it showing on screen.

    python3 art/set_key.py

Paste the key when asked (nothing appears while you paste) and press Return.
It is written to .env at the repo root, which git ignores and only you can read.
"""
import getpass, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(ROOT, '.env')

key = getpass.getpass('Paste your OpenAI key (it stays hidden), then press Return: ')
key = key.strip().strip('"\'“”‘’ ')
if key.startswith('OPENAI_API_KEY='):
    key = key.split('=', 1)[1].strip()
if not key.startswith('sk-'):
    sys.exit('That does not look like an OpenAI key (they start with "sk-"). Nothing was saved.')

fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, 'w') as f:
    f.write(f'OPENAI_API_KEY={key}\n')
os.chmod(path, 0o600)
print(f'Saved (ends in ...{key[-4:]}). You can now run:  python3 art/generate.py --test')
