# ===== character select =====
tail=rep(tail,"function renderNextf(){","""function showChars(){U=0;G={phase:'char',lib:0,log:[],fi:0,sel:[],tg:{},p:side([],20)};render()}
function renderChar(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
const all=[...new Set([...STAPLES,...POOL])].map(id=>mk(id)).sort((a,b)=>D[a.id][1]-D[b.id][1]||(TAG[a.id]||'~').localeCompare(TAG[b.id]||'~')||D[a.id][0].localeCompare(D[b.id][0]));
const lib=G.lib?`<div class="ov" style="background:#0b1820"><div class="ovb"><div class="ovt">Odysseus: every card that can appear in your draft (${all.length}), sorted by cost</div><div class="lib">${all.map(c=>card(c,'v:'+c.u)).join('')}</div><button class="b" data-b="okl">Close</button></div></div>`:'';
document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:30px">Choose your character</div><div class="dsub">Act 1: Lotus-Eaters, Sirens, Polyphemus</div>
<div style="border:2px solid #d8b45a;border-radius:14px;padding:18px 26px;margin:14px 0;background:#0008;max-width:420px;text-align:center"><div style="font-size:54px">⚓</div><div class="ovt" style="font-size:26px">Odysseus</div><div class="dsub" style="margin:6px 0 12px">King of Ithaca. 20 life. Starts with a Spearman, Sailor, Goat, Spear-carrier and Aegis, then drafts a deck from the whole pool of archetypes.</div>
<button class="b" data-b="fullib">See full library</button> <button class="b" data-b="pickod">Choose Odysseus</button></div></div>${lib}`}
function renderNextf(){""")
tail=rep(tail,"function render0(){const p=G.p,e=G.e,ph=G.phase;","function render0(){const p=G.p,e=G.e,ph=G.phase;if(ph=='char')return renderChar();")
B=rep(B,"function bt(b){const p=G.p;","function bt(b){const p=G.p;if(b=='fullib'){G.lib=1;return render()}if(b=='pickod')return newRun();")
B=rep(B,"if(b=='new')return newRun();","if(b=='new')return showChars();")
tail=rep(tail,"\nnewRun();","\nshowChars();")
