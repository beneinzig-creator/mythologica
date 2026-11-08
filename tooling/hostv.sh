#!/bin/bash
# usage: hostv.sh idx "deck"  -> win rate for wukong en[idx] with deck
cd "$(dirname "$0")"
python3 - "$2" "$1" <<'PY'
import sys,re
s=open('n1.html').read()
k="CHARS.wukong.en["+sys.argv[2]+"].d=ids("
i=s.index(k);j=s.index(");",i)
s=s[:i]+k+repr(sys.argv[1])+s[j:]
open('hv_'+str(abs(hash(sys.argv[1]))%99999)+'.html','w').write(s)
print(abs(hash(sys.argv[1]))%99999)
PY
