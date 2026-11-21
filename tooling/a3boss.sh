#!/bin/bash
# usage: ./a3boss.sh BOSS RUNS_PER_HERO  -> win % per hero for one Act III boss fight
B=$1;N=${2:-90};cd "$(dirname "$0")"
for h in ody odin wukong thoth; do for i in 1 2 3; do (node a3boss.js n1.html bal/bank3p_$h.jsonl $((N/3)) $B > /tmp/a3b_$h.$i 2>/dev/null) & done; done; wait
for h in ody odin wukong thoth; do cat /tmp/a3b_$h.* | python3 -c "
import sys,json;L=[json.loads(l) for l in sys.stdin if l.startswith('{')];w=sum(x['w'] for x in L);n=sum(x['N'] for x in L);t=sum(x['t'] for x in L)
print('$h',f'{100*w/max(1,n):.0f}% in {t/max(1,n):.1f} turns (n{n})')"; done; rm -f /tmp/a3b_*
