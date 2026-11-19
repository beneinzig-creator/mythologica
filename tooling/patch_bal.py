# v103: balance pass.
# - Bigger enemy decks so they stop running dry (bal/decks.js).
# - One visible enemy ramp for every hero (bal/tune_vis.js): Act I enemies get -4/-2/+1/+3 life in fights 1-4,
#   no hidden per-hero (CFA/CFAE) corrections; per-enemy base life fitted to it; elite and boss life.
# - Two rule tweaks: Wild Hunt riders deal +2 (was +3) to the Quarry; the Iron Fan only blows back
#   army members that cost 3 or more (was 2).
# The JS files are the exact text the simulator was run with. Tools: simx.js, matrix.py, runs.py, lifesweep.py, fit.py, bankgen.sh.
BAL = open(S+'bal/decks.js', encoding='utf-8').read() + "\n" + open(S+'bal/tune_vis.js', encoding='utf-8').read()
_b3("fit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();",
    "/* ===== v103 balance pass ===== */\n" + BAL + "\nfit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();")

_b3("const qB=(t,src)=>(t&&t.qy&&src&&HUNT.includes(src.id))?3:0;", "const qB=(t,src)=>(t&&t.qy&&src&&HUNT.includes(src.id))?2:0;")
_b3("Hunt riders deal 3 extra damage to the Quarry", "Hunt riders deal 2 extra damage to the Quarry")
_b3("Hunt riders deal 3 extra damage to it", "Hunt riders deal 2 extra damage to it")
_b3("const L=cr(p).filter(x=>D[x.id][1]>=2).sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));",
    "const L=cr(p).filter(x=>D[x.id][1]>=3).sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));")
_b3("the most expensive army member you control that costs 2 or more is blown back",
    "the most expensive army member you control that costs 3 or more is blown back")
_b3("return(G.p.ep===G.turn||!G.e.bf.some(x=>x.id=='decree'))?0:1}", "return(G.p.ep===G.turn||D[c.id][1]>2||!G.e.bf.some(x=>x.id=='decree'))?0:1}")
_b3("'Ward. The first army member you play each turn costs 1 more.'", "'Ward. The first army member that costs 2 or less you play each turn costs 1 more.'")
_b3("cr(e).filter(c=>c.id=='cwolf'||c.id=='clion').forEach(c=>{c.pa++;c.pd++});", "")
_b3(", and each Fawning Wolf and Mountain Lion she controls gets +1/+1 for the rest of the fight.", ".")
