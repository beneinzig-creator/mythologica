#!/bin/bash
# usage: bossv.sh html tag N "char:bossIdx ..."  vet deck vs boss ; writes bv_<tag>.txt
cd "$(dirname "$0")"
H=$1; T=$2; N=$3; shift 3
rm -f bv_$T.txt
run(){ IFS=: read c b <<< "$1"
 P="var _fd=finishDraft;finishDraft=function(){_fd();if(!G.vx){G.vx=1;const pl=CHARS[G.ch].pool.slice().sort((a,b)=>(RATE[b]||0)-(RATE[a]||0)).slice(0,22);for(let i=0;i<8;i++)G.p.recs.push({id:pl[Math.random()*pl.length|0],a:0,d:0,c:0,s:0,k:0,fl:0})}};"
 res=$(CHAR=$c OPP=$((200+b)) PATCH="$P" node sim.js $H $N 2>&1 | grep -E "^fight 1 " | sed -E 's/.*win% ([0-9]+) turns ([0-9.]+).*avgLifeOnWin ([0-9.]+).*/win \1 turns \2 life \3/'); echo "$c boss $b $res" >> bv_$T.txt; }
set -- $@
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & fi; wait; shift; [ $# -gt 0 ] && shift; done
