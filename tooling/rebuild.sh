#!/bin/bash
cd "$(dirname "$0")"
python3 build.py n1.html && python3 -c "
import re
s=open('n1.html',encoding='utf-8').read()
open('g.js','w',encoding='utf-8').write(re.search(r'<script>([\s\S]*)</script>',s).group(1))" && node --check g.js
