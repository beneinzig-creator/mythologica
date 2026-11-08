#!/bin/bash
# usage: dv.sh char idx "deck" N  -> win% fight1 with that enemy deck override
cd "$(dirname "$0")"
python3 - "$1" "$2" "$3" <<'PY'
import sys
c,i,d=sys.argv[1:4]
s=open('n1.html').read()
k="fit();try{addEventListener('resize',fit)}catch(e){}"
assert s.count(k)==1
s=s.replace(k,"CHARS."+c+".en["+i+"].d=ids("+repr(d)+");"+k)
open('dv_%s_%s.html'%(c,i),'w').write(s)
PY
r=$(CHAR=$1 OPP=$2 node sim.js dv_$1_$2.html ${4:-200} 2>&1 | grep "^fight 1 " | sed -E 's/.*win% ([0-9]+).*/\1/'); echo "$1:$2 [$3] => $r"
