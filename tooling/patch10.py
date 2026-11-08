# ===== 10 new creatures, draft creature-frequency normalised; character screen flavor + starting cards =====
head=rep(head,"const AC={P:'W'","""D.peltast=['Argive Peltast',2,'C',2,2,'ps','','🏃','W',1];
D.medic=['Army Surgeon',2,'C',1,3,'p','When it enters, restore 3 health to each of your army members.','⚕️','W',1];
D.pikeman=['Taphian Pikeman',3,'C',2,5,'pw','','🪖','W',2];
D.veteran=['Marathon Veteran',3,'C',3,3,'pz','','🎖️','W',2];
D.corsair=['Cicone Corsair',1,'C',2,1,'rh','','🏴‍☠️','R',1];
D.harrier=['Harbor Harrier',2,'C',2,3,'ry','','📯','R',1];
D.reaver=['Venomous Reaver',3,'C',2,3,'rv','','☠️','R',2];
D.ram=['Siege Ram Crew',3,'C',3,3,'rx','','🐏','R',2];
D.augur=['Delphic Augur',2,'C',1,3,'o','When it dies or is offered, gain 3 life.','🔮','B',2];
D.sphinx=['Sphinx of Thebes',3,'C',2,4,'o','','🦁','B',3];
const AC={P:'W'""")
head=rep(head,"const LORE={","const LORE={peltast:'Human skirmisher',medic:'Human healer',pikeman:'Human guard',veteran:'Human veteran',corsair:'Human pirate',harrier:'Human raider',reaver:'Human assassin',ram:'Human siege crew',augur:'Human seer',sphinx:'Riddling beast',")
head=rep(head,"camp:'O',herm:'O',","camp:'O',herm:'O',peltast:'P',medic:'P',pikeman:'P',veteran:'P',corsair:'R',harrier:'R',reaver:'R',ram:'R',augur:'O',sphinx:'O',")
m=_r5.search(r"POOL='([^']*)'",head);L=m.group(1).split(' ')
NEWC='peltast medic pikeman veteran corsair harrier reaver ram augur sphinx'.split(' ')
head=head.replace(m.group(0),"POOL='"+' '.join(L+NEWC)+"'")
head=rep(head,"const ids=s=>","RAR.peltast='C';RAR.medic='C';RAR.pikeman='U';RAR.veteran='U';RAR.corsair='C';RAR.harrier='C';RAR.reaver='U';RAR.ram='U';RAR.augur='C';RAR.sphinx='U';const NEWC='"+' '.join(NEWC)+"'.split(' ');\nconst ids=s=>")
A=rep(A,"const ETB={herm:s=>draw(s,1),","const ETB={medic:s=>cr(s).forEach(c=>heal(c,3)),herm:s=>draw(s,1),")
A=rep(A,"const ETBV={","const ETBV={medic:1.5,")
A=rep(A,"const DEATH={","const DEATH={augur:{p:1,fn:s=>{s.life+=3}},")
A=rep(A,"if(c.id=='cerb')cerbFx(s,o);","if(c.id=='cerb')cerbFx(s,o);if(c.id=='augur')s.life+=3;")
# draft: keep overall creature frequency the same as before the 10 were added
mid=rep(mid,"const wt=x=>W[RAR[x]]*","const cnm=(()=>{const cs=POOL.filter(x=>D[x][2]=='C'),f=a=>a.reduce((n,x)=>n+W[RAR[x]],0);return f(cs.filter(x=>!NEWC.includes(x)))/f(cs)})(),wt=x=>(D[x][2]=='C'?cnm:1)*W[RAR[x]]*")
# character screen
tail=rep(tail,"""<div class="dsub" style="margin:6px 0 12px">King of Ithaca. 20 life. Starts with a Spearman, Sailor, Goat, Spear-carrier and Aegis, then drafts a deck from the whole pool of archetypes.</div>
<button class="b" data-b="fullib">See full library</button>""","""<div class="dsub" style="margin:6px 0 8px;font-style:italic">"Tell me, Muse, of the man of twists and turns." The cunning king of Ithaca devised the Trojan Horse, then spent ten years and a hundred hardships fighting his way home to Penelope.</div>
<div class="dsub" style="margin:0 0 12px"><b>Playstyle:</b> a small, hand-picked army of two or three creatures. Offer cheap bodies for mana to trade up into bigger threats, then commit to a path: Phalanx walls, Raider aggression, or an Offering engine. 20 life.</div>
<button class="b" data-b="startcards">Starting cards</button> <button class="b" data-b="fullib">See full library</button>""")
tail=rep(tail,"const lib=G.lib?`<div class=\"ov\" style=\"background:#0b1820\"><div class=\"ovb\"><div class=\"ovt\">Odysseus: every card that can appear in your draft (${all.length}), sorted by cost</div><div class=\"lib\">${all.map(c=>card(c,'v:'+c.u)).join('')}</div>","const stc=STAPLES.map(id=>mk(id)),lib=G.lib?`<div class=\"ov\" style=\"background:#0b1820\"><div class=\"ovb\"><div class=\"ovt\">${G.lib==2?'Odysseus starts every run with these '+stc.length+' cards':'Odysseus: every card that can appear in your draft ('+all.length+'), sorted by cost'}</div><div class=\"lib\">${(G.lib==2?stc:all).map(c=>card(c,'v:'+c.u)).join('')}</div>")
B=rep(B,"if(b=='fullib'){G.lib=1;return render()}","if(b=='fullib'){G.lib=1;return render()}if(b=='startcards'){G.lib=2;return render()}")
