import re as _r
# ---------- engine_a aura / keyword patches ----------
A=rep(A,"const pwr=c=>pw(c)+(has(c,'r')&&!c.def?1:0)+(has(c,'p')&&c.def?2:0)+(c.def&&own(c,'doct')?1:0)+(!c.def&&own(c,'banner')?1:0)+(has(c,'f')&&own(c,'skies')?1:0);",
"const qb=c=>{if(!has(c,'q'))return 0;const s=sideOf(c);return s?Math.min(3,cr(oppOf(s)).filter(x=>x.tap).length):0};\nconst aur=c=>(has(c,'p')&&own(c,'wall')?1:0)+(has(c,'o')&&own(c,'ossuary')?1:0)+(has(c,'q')&&own(c,'garden')?1:0)+(has(c,'g')&&own(c,'forge')?1:0)+(has(c,'f')&&own(c,'skies')?1:0);\nconst pwr=c=>pw(c)+(has(c,'r')&&!c.def?1:0)+(has(c,'p')&&c.def?2:0)+(c.def&&own(c,'doct')?1:0)+(has(c,'r')&&own(c,'banner')?1:0)+aur(c)+qb(c);")
A=rep(A,"+(c.def?2+(ramp(c)?1:0):0)+(has(c,'f')&&own(c,'skies')?1:0);","+(c.def?2+(ramp(c)?1:0):0)+aur(c);")
A=rep(A,"||(k=='b'&&own(c,'club')&&pwr(c)>=3);","||(k=='b'&&own(c,'club')&&pwr(c)>=3)||(k=='b'&&has(c,'r')&&own(c,'ares'))||(k=='z'&&has(c,'p')&&own(c,'shield'));")
A=rep(A,"!(has(b,'z')&&!b.rs)","!(kw(b,'z')&&!b.rs)")
A=rep(A,"has(c,'z')&&!c.rs","kw(c,'z')&&!c.rs")
A=rep(A,"hammer:(s,o,t)=>destroyIt(o,t),","requiem:(s,o)=>{o.life-=Math.min(8,s.gy.length)},dream:(s,o)=>cr(o).forEach(c=>{c.tap=1;c.frz=1}),dirge:(s,o)=>{o.life-=cr(s).filter(c=>has(c,'f')).reduce((n,c)=>n+pwr(c),0)},drill:s=>cr(s).filter(c=>has(c,'p')).forEach(c=>{c.pa++;c.pd++}),spoils:(s,o)=>{o.life-=cr(s).filter(c=>has(c,'r')).length;draw(s,1)},hammer:(s,o,t)=>destroyIt(o,t),")
A=rep(A,"const IV={","const IV={garden:6,forge:7,wall:6,ossuary:6,shield:7,ares:7,")
# ---------- engine_b: AI + hub ----------
B=rep(B,"if((id=='censer'||id=='haze'||id=='canto')","const AU={garden:'q',forge:'g',skies:'f'};if(AU[id]){const n=cr(e).filter(x=>has(x,AU[id])).length;s=n>=2?8:n==1?5:2}\nif((id=='censer'||id=='haze'||id=='canto')")
B=rep(B,"case'breeze':","case'dream':{const n=cr(p).filter(x=>!x.tap).length;if(!nr||n<1)return null;const win=combatEval(rdy,[],p.life,{}).dmg>=p.life;return win?{s:80}:n>=2?{s:8+n*2}:null}\ncase'dirge':{const d=cr(e).filter(x=>has(x,'f')).reduce((n,x)=>n+pwr(x),0);return d>=p.life?{s:90}:d>=5?{s:4+d*.8}:null}\ncase'breeze':")
B=rep(B,"if(b=='rmyes'){if(G.rm>=0)p.recs.splice(G.rm,1);G.rm=-1;G.phase='nextf';return render()}",
"""if(b=='hheal'){if(G.used.h||p.life>=p.max)return;p.life=Math.min(p.max,p.life+6);G.used.h=1;G.act--;return hubNext()}
if(b=='hdraft'){G.dr={mode:'reward',rounds:1,n:0,picks:[],off:[],busy:0,pause:0};G.phase='draft';G.lib=0;dealDraft();return render()}
if(b=='hrem'){if(p.recs.length<=5){G.hubMsg='Your library is too small to remove from.';return render()}G.rmMode='rem';G.phase='remove';G.rm=-1;return render()}
if(b=='hdup'){if(G.used.d)return;G.rmMode='dup';G.phase='remove';G.rm=-1;return render()}
if(b=='hdone'){G.act=0;return hubNext()}
if(b=='hubback'){G.phase='hub';G.rm=-1;G.dr=0;return render()}
if(b=='rmyes'){if(G.rm>=0){if(G.rmMode=='dup'){p.recs.push({...p.recs[G.rm]});G.used.d=1}else p.recs.splice(G.rm,1);G.act--}G.rm=-1;G.phase='hub';return hubNext()}""")
B=rep(B,"if(b=='fight'){G.fi++;","if(b=='fight'){G.hubMsg='';G.fi++;")
# ---------- mid / tail UI ----------
mid=rep(mid,"G.p.recs.push(nr(id)));G.phase='remove';G.rm=-1;return render()}","G.p.recs.push(nr(id)));G.act--;G.phase='hub';G.dr=0;return hubNext()}")
mid=rep(mid,"function startReward(){G.dr={mode:'reward',rounds:2,n:0,picks:[],off:[],busy:0,pause:0};G.phase='draft';G.lib=0;dealDraft();render()}",
"""function startReward(){G.act=4;G.used={h:0,d:0};G.hubMsg='';G.phase='hub';G.lib=0;render()}
function hubNext(){if(G.act<=0)G.phase='nextf';render()}
function renderHub(){const p=G.p,n=G.act,u=G.used;document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:28px">Spoils of victory</div><div class="dsub">${n} action${n==1?'':'s'} remaining · Odysseus ❤ ${p.life}/${p.max} · ${p.recs.length} cards in your library</div><div class="hub">
<button class="b" data-b="hheal"${u.h||p.life>=p.max?' disabled':''}>Heal 6 life${u.h?' (used)':' (once)'}</button>
<button class="b" data-b="hdraft">Draft a card</button>
<button class="b" data-b="hrem">Remove a card</button>
<button class="b" data-b="hdup"${u.d?' disabled':''}>Duplicate a card${u.d?' (used)':' (once)'}</button>
<button class="b" data-b="hdone" style="background:#555;color:#efe6cf;box-shadow:none">Skip remaining actions</button></div><div class="dsub">${G.hubMsg||'Each choice uses one action. Drafting and removing can be repeated.'}</div></div>`}
""")
mid=rep(mid,"${rw?'<div class=\"dsub\">After this you will remove one card from your library.</div>':","${rw?(dr.n==0&&!dr.busy?'<div class=\"dsub\"><button class=\"b\" data-b=\"hubback\">Back</button></div>':''):")
tail=rep(tail,"if(ph=='remove')return renderRemove();","if(ph=='remove')return renderRemove();if(ph=='hub')return renderHub();")
tail=rep(tail,"<div class=\"ovt\">Remove one card from your library</div>","<div class=\"ovt\">${G.rmMode=='dup'?'Duplicate one card in your library':'Remove one card from your library'}</div>")
tail=rep(tail,"Click a card to remove it.</div></div></div>","Click a card to ${G.rmMode=='dup'?'duplicate':'remove'} it. <button class=\"b\" data-b=\"hubback\" style=\"margin-left:12px\">Back</button></div></div></div>")
tail=rep(tail,"<div class=\"ovt\">Remove ${D[X.id][0]}?</div>","<div class=\"ovt\">${G.rmMode=='dup'?'Duplicate':'Remove'} ${D[X.id][0]}?</div>")
head=rep(head,"</style>","")if False else head
# ---------- data ----------
m=_r.search(r"const ARCH=\{[^\n]*\};\n",head);assert m
head=head.replace(m.group(0),"const ARCH={P:'Phalanx',R:'Raiders',O:'Offerings',Z:'Slumber',S:'Song',K:'Cyclops'};\n")
m=_r.search(r"const TAG=\{[^\n]*\};\n",head);assert m
head=head.replace(m.group(0),"""const TAG={sent:'P',spartan:'P',hopl:'P',gate:'P',ajax:'P',rampart:'P',doct:'P',hearth:'P',drill:'P',wall:'P',testudo:'P',shield:'P',
thess:'R',zerk:'R',diom:'R',agam:'R',achil:'R',fury:'R',rally:'R',spoils:'R',banner:'R',ares:'R',
ox:'O',argus:'O',pythia:'O',telem:'O',cass:'O',hecat:'O',altar:'O',zeus:'O',pyre:'O',ossuary:'O',requiem:'O',
isl:'Z',lot:'Z',priest:'Z',reaper:'Z',titan:'Z',sip:'Z',honey:'Z',fog:'Z',dream:'Z',haze:'Z',censer:'Z',garden:'Z',
scout:'S',song:'S',siren:'S',eel:'S',melody:'S',lure:'S',undertow:'S',dirge:'S',lyre:'S',canto:'S',skies:'S',shoal:'S',
sheep:'K',cscout:'K',cave:'K',brute:'K',elder:'K',poly:'K',hurl:'K',mouth:'K',club:'K',forge:'K'};
""")
m=_r.search(r"STAPLES='spear sailor goat myrm herm'\.split\(' '\),POOL='[^']*'\.split\(' '\)",head);assert m
head=head.replace(m.group(0),"STAPLES='spear sailor goat spearc aegis'.split(' '),POOL='sent spartan hopl gate ajax rampart doct hearth drill wall testudo shield thess zerk diom agam achil fury rally spoils banner ares ox argus pythia telem cass hecat altar zeus pyre ossuary requiem nestor sapper salve gale hammer plunder thunder bow'.split(' ')")
# rarity map: reset after definition
head=rep(head,"const ids=s=>","""for(const k in RAR)delete RAR[k];
'sent spartan hopl rampart doct hearth drill thess fury rally spoils ox argus pythia hecat sapper salve hammer spear sailor goat aegis'.split(' ').forEach(x=>RAR[x]='C');
'gate wall testudo zerk diom banner telem cass pyre ossuary nestor gale plunder spearc'.split(' ').forEach(x=>RAR[x]='U');
'ajax shield agam achil ares requiem altar zeus thunder bow'.split(' ').forEach(x=>RAR[x]='R');
const ids=s=>""")
m=_r.search(r"const EN=\[.*\];\n",head);assert m
head=head.replace(m.group(0),"""const EN=[{n:'The Lotus-Eaters',l:20,d:ids('isl,lot:2,priest,reaper:2,titan,sip:2,honey,dream,haze,censer,garden,fog,breeze')},{n:'The Sirens',l:20,d:ids('scout,song:2,siren:2,eel,lyre,canto,skies,shoal,melody:2,lure,undertow,dirge,tide')},{n:'Polyphemus',l:20,d:ids('sheep:2,cscout,cave,brute:2,elder,poly,hurl:3,milk:2,mouth,club,forge')}];
""")
JS=r"""
Object.assign(D,{
wall:['Aspis Wall',3,'E',0,0,'','Your Phalanx army members get +1/+1.','🧱','W'],
shield:['Shield of Achilles',3,'A',0,0,'','Your Phalanx army members have Resilient.','🔰','W'],
drill:['Phalanx Drill',3,'S',0,0,'','Your Phalanx army members get +1/+1 permanently.','🥁','W'],
ares:['Spear of Ares',3,'A',0,0,'','Your Raiders have Bulldoze.','🪓','R'],
spoils:['Spoils of War',2,'S',0,0,'','Deal 1 damage to the opponent for each Raider you control. Draw a card.','🪙','R'],
ossuary:['Ossuary of Heroes',2,'E',0,0,'','Your Offering army members get +1/+1.','🪦','B'],
requiem:['Requiem',5,'S',0,0,'','Deal damage to the opponent equal to the cards in your graveyard (up to 8).','🎺','B'],
dream:['Dreamless Sleep',5,'S',0,0,'',`Tap all of your opponent's army members. They don't untap next turn.`,'💤','G'],
garden:['Lotus Garden',2,'E',0,0,'','Your Drowsy army members get +1/+1.','🪷','G'],
dirge:['Dirge of the Deep',5,'S',0,0,'','Deal damage to the opponent equal to the total power of your flying army members.','🔔','U'],
forge:['Forge of the Cyclopes',3,'A',0,0,'','Your Cyclops army members get +1/+1.','🌋','R']});
D.skies=['Chorus of the Deep',2,'E',0,0,'','Your flying army members get +1/+1.','☁️','U'];
D.banner=['Banner of the Argives',3,'A',0,0,'','Your Raiders get +1 power.','🚩','R'];
D.ajax=['Ajax the Great',5,'C',3,9,'pz','','🏺','W',3];
D.achil=['Achilles',5,'C',5,5,'rb','','🦶','R',3];
D.sent=['Argive Sentinel',2,'C',1,5,'pk','','🗼','W',1];
D.pyre=['Eternal Pyre',2,'A',0,0,'','Frenzy: each time you offer an army member, deal 1 damage to the opponent.','♨️','B'];
const FLG={argus:'o',pythia:'o',ox:'o',telem:'o',cass:'o',pyrep:'o',isl:'q',lot:'q',priest:'q',reaper:'q',titan:'q',cscout:'g',cave:'g',brute:'g',elder:'g',poly:'g'};
for(const k in FLG)D[k][5]+=FLG[k];
KWT.q='Opportunist.';KWL.q='Opportunist: +1 power for each tapped opposing army member (up to 3).';
"""
head=rep(head,"const KO=",JS.replace('KWT.q','//').replace("='Opportunist.';KWL.q=","") if False else "const KO=")
# KWT/KWL are defined before STAPLES; add q there
head=rep(head,"k:'Can only defend.',n:'Can only attack.'}","k:'Can only defend.',n:'Can only attack.',q:'Opportunist.'}")
head=rep(head,"n:'Berserker: it can only attack; it cannot block.'}","n:'Berserker: it can only attack; it cannot block.',q:'Opportunist: +1 power for each tapped opposing army member (up to 3).'}")
JS=JS.replace("KWT.q='Opportunist.';KWL.q='Opportunist: +1 power for each tapped opposing army member (up to 3).';\n","")
# color players' cards by archetype, insert after TAG and D exist: put JS before 'const KO='
JS+="const AC={P:'W',R:'R',O:'B'};for(const k in TAG)if(AC[TAG[k]]&&D[k])D[k][8]=AC[TAG[k]];['nestor','sapper','salve','gale','hammer','plunder','thunder','bow','spearc','aegis'].forEach(k=>{if(D[k][2]!='A')D[k][8]='A'});\n"
head=rep(head,"const KO=",JS+"const KO=")
head=rep(head,"if(TAG[c.id]&&t!='e')L.push('<b>Archetype</b>: '+TAG[c.id].split('').map(k=>ARCH[k]).join(' · ')+'.');","if(TAG[c.id])L.push('<b>Archetype</b>: '+ARCH[TAG[c.id]]+'.');")
head=rep(head,".pn{font-size:15px","/*x*/.pn{font-size:15px") if False else head
# ---- balance pass 2 ----
head=rep(head,"ids('isl,lot:2,priest,reaper:2,titan,sip:2,honey,dream,haze,censer,garden,fog,breeze')","ids('isl:2,lot:2,priest,reaper:2,titan,sip:2,dream,haze,censer,garden,fog,breeze')")
head=rep(head,"ids('scout,song:2,siren:2,eel,lyre,canto,skies,shoal,melody:2,lure,undertow,dirge,tide')","ids('scout:2,song:2,siren:2,eel,lyre,canto,skies,shoal,melody:2,lure,dirge,tide')")
head=rep(head,"ids('sheep:2,cscout,cave,brute:2,elder,poly,hurl:3,milk:2,mouth,club,forge')","ids('sheep:3,cscout,cave,brute:2,elder,poly,hurl:2,milk:2,mouth,club,forge')")
head=rep(head,"reaper:['Slumber Reaper',3,'C',3,3,'x'","reaper:['Slumber Reaper',3,'C',3,4,'x'")
head=rep(head,"titan:['Drowsy Titan',4,'C',3,5,","titan:['Drowsy Titan',4,'C',4,6,")
head=rep(head,"lot:['Lotus-Eater',2,'C',3,4,'r'","lot:['Lotus-Eater',2,'C',3,5,'r'")
head=rep(head,"priest:['Poppy Priest',3,","priest:['Poppy Priest',2,")
head=rep(head,"censer:['Poppy Censer',3,","censer:['Poppy Censer',2,")
head=rep(head,"fog:['Narcotic Fog',4,","fog:['Narcotic Fog',3,")
