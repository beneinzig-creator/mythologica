#!/bin/bash
# usage: runset.sh html tag N "ody:0 ody:1 odin:100 ..."   (2 parallel)  -> rs_<tag>.txt
cd "$(dirname "$0")"
H=$1; T=$2; N=$3; shift 3
rm -f rs_$T.txt rs_$T.done
run(){ c=${1%%:*}; o=${1##*:}; r=$(CHAR=$c OPP=$o node sim.js $H $N 2>&1 | grep -E "^fight 1 " | sed -E 's/.*win% ([0-9]+) turns ([0-9.]+).*avgLifeOnWin ([0-9.]+).*stalls ([0-9]+).*/win \1 turns \2 life \3 stalls \4/'); echo "$c $o $r" >> rs_$T.txt; }
set -- $@
while [ $# -gt 0 ]; do
  run $1 & 
  if [ $# -gt 1 ]; then run $2 & fi
  wait
  shift; [ $# -gt 0 ] && shift
done
echo done > rs_$T.done
