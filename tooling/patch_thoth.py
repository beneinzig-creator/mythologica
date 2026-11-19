# v105: Thoth, the 4th hero, and the Egyptian realm.
# Engine: thoth.js (Sunder/Ka/Ba/Ren, glyphs and Erase, Reunite, amulets as equipment, Foresee/Record/Preempt).
# Cards, hero and realm: thoth_cards.js. Pool uses the shared layout (24/24/24 + 8, 26/24/18/12).
THOTH_POOL = {
 'D': {'C': 'dsk dbal dcut dpart dembal dheart dwrap dnomad', 'U': 'dreun dsever dshade dcart dtwof dweigh dkhep',
       'R': 'dakh dsplit dren dsoul dduat dmum', 'L': 'dosir dammit dbook'},
 'I': {'C': 'iink iscribe ichisel iword iguard iwas tpen itut', 'U': 'isac iliv ierase ishen idjed ikhem iunwr',
       'R': 'iseshat ihekau ieye iobel ianx inarm', 'L': 'ithoth iweret iname'},
 'Y': {'C': 'yibis yread yclerk ywatch ywarn ybab yledger yprep', 'U': 'ypre yrecall ysage ystar yfore ycopy ytrap',
       'R': 'yhall ycount ykhon yvizier yechoes yjudge', 'L': 'ysenet ytruth yall'},
 '-': {'C': 'gscroll gfeather', 'U': 'gpriest gnile gcanop', 'L': 'karma dint gweigh'}}
_seen = set()
for _a, _rar in THOTH_POOL.items():
    _shape = {'C': 2, 'U': 3, 'R': 0, 'L': 3} if _a == '-' else {'C': 8, 'U': 7, 'R': 6, 'L': 3}
    for _r, _n in _shape.items():
        _ids = _rar.get(_r, '').split()
        assert len(_ids) == _n, ('thoth', _a, _r, len(_ids))
        for _x in _ids:
            assert _x not in _seen, _x
            _seen.add(_x)
assert len(_seen) == 80

import json as _json
TH = open(S+'thoth.js', encoding='utf-8').read() + "\n" + open(S+'thoth_cards.js', encoding='utf-8').read() + r"""
{const P=__TP__;const pool=[];for(const a in P)for(const r in P[a])P[a][r].split(' ').filter(Boolean).forEach(x=>{RAR[x]=r;if(a=='-')delete TAG[x];else TAG[x]=a;pool.push(x)});CHARS.thoth.pool=pool;
 RAR.tscr=RAR.tsun=RAR.tscar=RAR.tmedj='C';}
""".replace('__TP__', _json.dumps(THOTH_POOL))
_b3("/* ===== v104: shared pool layout", TH + "\n/* ===== v104: shared pool layout")

# ---- rules hooks ----
_b3("const has=(c,x)=>c.f.includes(x)||(x=='w'&&c.f.includes('l')&&own(c,'blackship')),",
    "const has=(c,x)=>c.f.includes(x)||(x=='w'&&c.f.includes('l')&&own(c,'blackship'))||(typeof amK=='function'&&amK(c,x))||(x=='v'&&typeof egVen=='function'&&egVen(c)),")
_b3("if(c.id=='bodvar'&&wnd(s))n+=3;\n return n+omg(c,'ruru')+omg(c,'ygg')}",
    "if(c.id=='bodvar'&&wnd(s))n+=3;\n return n+omg(c,'ruru')+omg(c,'ygg')+amP(c)+thPx(c)+egPx(c)}")
_b3("const y=omg(c,'ygg');if(y)n+=1+y;return n}", "const y=omg(c,'ygg');if(y)n+=1+y;return n+amH(c)+thTx(c)}")
_b3("function chk(){instCap();dintChk();", "function chk(){instCap();dintChk();amFall();")
_b3("if(lethal)dead.push([s,c])}", "if(lethal&&scarabSave(s,c))continue;if(lethal)dead.push([s,c])}")
_b3("const Q=[];dead.forEach(([s,c])=>{const t=DEATH[c.id];if(t)Q.push({p:t.p,a:s===actSide()?0:1,s,c,fn:t.fn})});",
    "const Q=[];dead.forEach(([s,c])=>{const t=DEATH[c.id];if(t)Q.push({p:t.p,a:s===actSide()?0:1,s,c,fn:t.fn});(c.wr||[]).forEach(w=>{const t2=DEATH[w];if(t2)Q.push({p:t2.p,a:s===actSide()?0:1,s,c,fn:t2.fn})})});")
_b3("function onDie(s,c){hdDie();", "function onDie(s,c){hdDie();thDie(s,c);egDie(s,c);")
_b3("function mtUp(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;", "function mtUp(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;egUp(s,o);")
_b3("function upk2(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;mtUp(s,o);", "function upk2(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;mtUp(s,o);thUp(s,o);")
_b3("function cast(c,t){const p=G.p,d=D[c.id];", "function cast(c,t){const p=G.p,d=D[c.id];sphPlay(c);")
_b3("if('CEA'.includes(d[2])){enter(p,c);const P=PEND[c.id];",
    "if('CEA'.includes(d[2])){enter(p,c);if(AMU[c.id]&&t&&typeof t=='object'){c.on=t.u;if(c.id=='iword')c.gl=['h']}const P=PEND[c.id];")
_b3("code=='x'||code=='xf')?(k=='e'&&isC(T)):", "code=='x'||code=='xf')?(k=='e'&&isC(T)):code=='x3'?(k=='e'&&isC(T)&&D[T.id][1]<=3):")
_b3("G.endstep=0;clean();sweep();if(chk())return render();G.sel=[];return enemyTurn()}",
    "G.endstep=0;thEnd(G.p);sphCheck();clean();sweep();if(chk())return render();G.sel=[];if(G.p.xt){G.p.xt=0;log('Senet with the Moon: you take an extra turn.');startP();return render()}return enemyTurn()}")
_b3("e.mana-=cost(pl);e.hand=e.hand.filter(x=>x!==pl);log(e.nm+' plays '+d[0]+'.');",
    "e.mana-=cost(pl);e.hand=e.hand.filter(x=>x!==pl);log(e.nm+' plays '+d[0]+'.');if(typeof thEnemyPlay=='function'&&thEnemyPlay(e,pl)){sweep();if(chk())return;if(!await pause())return;continue}")
# ---- input: speak a Ren, equip an amulet ----
_b3("if(k=='h'){const c=p.hand.find(x=>x.u==u),d=D[c.id];",
    "if(k=='spk'){const c=p.hand.find(x=>x.u==u);if(!c||!c.ren||!['main','blockP','dmgP'].includes(G.phase))return;speak(c);return render()}\nif(k=='h'){const c=p.hand.find(x=>x.u==u),d=D[c.id];")
_b3("if(k=='p'){const c=sf(p);if(TAPA[c.id]){",
    "if(k=='p'){const c=sf(p);if(c&&AMU[c.id]&&!c.on){if(G.phase!='main')return msg('Equip amulets during your main phase.');const q=AMU[c.id].eq;if(p.mana<q)return msg('Equipping '+D[c.id][0]+' costs '+q+' mana.');if(!cr(p).length)return msg('You have no army member to equip.');G.mode={tgt:'eq',am:c};return msg('Choose one of your army members to wear '+D[c.id][0]+' (◆'+q+').')}if(TAPA[c.id]){")
_b3("if(M.tgt===3){", "if(M.tgt==='eq'){if(!t||typeof t!='object'||k!='p'||!isC(t)){G.msg='Cancelled.';return render()}p.mana-=AMU[M.am.id].eq;M.am.on=t.u;log('You equip '+D[M.am.id][0]+' to '+D[t.id][0]+'.');return render()}if(M.tgt===3){")
# ---- display ----
_b3("+(c.dis&&!WDIS.includes(c.id)?' Disintegrate.':'');\nconst rr", "+(c.dis&&!WDIS.includes(c.id)?' Disintegrate.':'')+(isC(c)?glyphTxt(c):amTxt(c));\nconst rr")
_b3("data-z=\"${z}\">${bs}${rr", "data-z=\"${z}\">${bs}${t=='h'&&c.ren?`<b class=\"ob spk\" data-z=\"spk:${c.u}\" title=\"Speak the name: gain 2 mana\">◆+2</b>`:''}${rr")
_b3("<div class=\"cn\" style=\"margin-top:3px;opacity:.85\">◆ Mana ${e.mana}</div>", "<div class=\"cn\" style=\"margin-top:3px;opacity:.85\">◆ Mana ${e.mana}</div>${foreStrip()}")
_b3("const RWORD=()=>((G&&G.ch)||'ody')=='odin'?'the Nine Worlds':((G&&G.ch)==='wukong'?'the Western Heaven':'the strait');",
    "const RWORD=()=>({odin:'the Nine Worlds',wukong:'the Western Heaven',thoth:'the Two Lands'})[(G&&G.ch)||'ody']||'the strait';")
_b3("const SAGA=()=>((G&&G.ch)||'ody')=='odin'?'The saga of Ragnarok':((G&&G.ch)==='wukong'?'The Journey to the West':'The Odyssey');",
    "const SAGA=()=>({odin:'The saga of Ragnarok',wukong:'The Journey to the West',thoth:'The Book of the Dead'})[(G&&G.ch)||'ody']||'The Odyssey';")
# realm particles: drifting sand and gold for Egypt
_b3("  none:()=>({x:R()*W,y:R()*H,vx:-.08", "  thoth:()=>({x:-10,y:R()*H,vx:.35+R()*.6,vy:-.05+R()*.1,r:.5+R()*1.4,a:.18+R()*.35,tw:R()*6.28,c:R()<.7?'226,196,130':'255,226,160'}),\n  none:()=>({x:R()*W,y:R()*H,vx:-.08")
THCSS = (".ob.spk{background:#2a1f08;color:#ffd98a;border-color:#e0b04a;cursor:pointer;left:auto;right:4px;top:4px}.ob.spk:hover{background:#4a3410}"
 ".fsee{color:#cfe0ff;max-width:420px;white-space:normal}"
 ".rl-thoth::before,.rl-thoth::after{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='24'%3E%3Cpath d='M0 16L6 8L12 16L18 8L24 16L30 8L36 16' fill='none' stroke='%23e0b04a55' stroke-width='2.5' transform='translate(0 1.5)'/%3E%3Cpath d='M0 16L6 8L12 16L18 8L24 16L30 8L36 16' fill='none' stroke='%23000000aa' stroke-width='2.5'/%3E%3C/svg%3E\")}")
_b3("html.gs .hdet{animation:none}\n", "html.gs .hdet{animation:none}\n" + THCSS + "\n")
