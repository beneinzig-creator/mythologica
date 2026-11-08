#!/bin/bash
# usage: cfa.sh tag N char 'CFA-literal'   -> cf_<tag>.txt  (fights 1-4 win%)
cd "$(dirname "$0")"
T=$1; N=$2; C=$3; L=$4
python3 - "$T" "$L" <<'PY'
import sys,re
s=open('n1.html').read()
i=s.index("const CFA=");j=s.index(";",i)
s=s[:i]+"const CFA="+sys.argv[2]+s[j:]
open('cf_'+sys.argv[1]+'.html','w').write(s)
PY
echo "$T $C $(CHAR=$C CONT=1 node sim.js cf_$T.html $N 2>&1 | grep -E '^fight [1-4] ' | sed -E 's/fight ([0-9]) reached ([0-9]+) win% ([0-9]+) turns ([0-9.]+).*/f\1 \3%/' | tr '\n' ' ')" >> cf_all.txt
