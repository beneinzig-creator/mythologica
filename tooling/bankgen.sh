#!/bin/bash
# usage: bankgen.sh HTML RUNS_PER_CHUNK CHUNKS PATCHFILE -> bal/bank_<hero>.jsonl
cd "$(dirname "$0")"
for h in ody odin wukong thoth; do rm -f bal/bank_$h.jsonl; done
for h in ody odin wukong thoth; do for c in $(seq 1 $3); do
  (CHAR=$h CONT=1 CONTALL=1 BANKOUT=1 PATCH="$(cat $4)" node simx.js $1 $2 2>/dev/null | grep '^BANK ' | cut -c6- > bal/bank_${h}_$c.part) &
done; done; wait
for h in ody odin wukong thoth; do cat bal/bank_${h}_*.part > bal/bank_$h.jsonl; rm -f bal/bank_${h}_*.part; done; wc -l bal/bank_*.jsonl
