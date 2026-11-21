#!/bin/bash
# Bank decks that really reach Act 3: full runs (regular-fight losses continue, a guardian loss ends the run);
# every run that beats both the Act I and Act II guardians prints its deck. Output: bal/bank3_<hero>.jsonl
# usage: ./bank3.sh RUNS_PER_CHUNK CHUNKS [heroes]
N=${1:-300}; C=${2:-4}; H=${3:-"ody odin wukong thoth"}
cd "$(dirname "$0")"; mkdir -p bal
for h in $H; do for i in $(seq 1 $C); do
  (CHAR=$h CONT=1 CONTALL=1 ACT2=1 BANK3=1 node simx.js n1.html $N 2>/dev/null | grep '^BANK3 ' | cut -c7- > bal/bank3_$h.$i.part) &
done; done; wait
for h in $H; do cat bal/bank3_$h.*.part > bal/bank3_$h.jsonl; rm -f bal/bank3_$h.*.part; echo "$h: $(wc -l < bal/bank3_$h.jsonl) decks"; done
