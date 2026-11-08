#!/bin/bash
# usage: act2.sh html tag N "char:realm:k ..."   proxy: veteran deck (+8 top-rated pool cards) vs realm enemies at scaling index k
cd "$(dirname "$0")"
H=$1; T=$2; N=$3; shift 3
rm -f a2_$T.txt
run(){ IFS=: read c r k <<< "$1"
 P="var _fd=finishDraft;finishDraft=function(){_fd();if(!G.vx){G.vx=1;const pl=CHARS[G.ch].pool.slice().sort((a,b)=>(RATE[b]||0)-(RATE[a]||0)).slice(0,22);for(let i=0;i<8;i++)G.p.recs.push({id:pl[Math.random()*pl.length|0],a:0,d:0,c:0,s:0,k:0,fl:0})}};var _sc=sclOf;sclOf=function(v){return _sc(v+$k)};"
 res=$(CHAR=$c REALM=$r PATCH="$P" node sim.js $H $N 2>&1 | grep -E "^fight 1 " | sed -E 's/.*win% ([0-9]+) turns ([0-9.]+).*avgLifeOnWin ([0-9.]+).*/win \1 turns \2 life \3/'); echo "$c vs $r k=$k $res" >> a2_$T.txt; }
set -- $@
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & fi; wait; shift; [ $# -gt 0 ] && shift; done
echo done > a2_$T.done
