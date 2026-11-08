NEWD = r"""
thess:['Thessalian Rider',2,'C',2,2,'h','','🏇','W',1],
zerk:['Berserker of Ares',2,'C',3,3,'rn','','😡','R',1],
boar:['Calydonian Boar',3,'C',3,3,'b','','🐗','R',2],
diom:['Diomedes',3,'C',2,3,'y','','🤺','W',2],
agam:['Agamemnon',4,'C',3,4,'yh','','👑','W',2],
nike:['Nike',3,'C',2,3,'fd','','🏆','U',2],
iris:['Iris',2,'C',1,2,'fs','','🌈','U',1],
helios:['Helios Charioteer',3,'C',3,2,'fh','','☀️','U',2],
athena:['Athena',5,'C',4,5,'fs','','🌟','U',4],
pyrep:['Pyre Priestess',2,'C',1,3,'','Frenzy: each time you offer an army member, 1 damage to the opponent.','🕯️','W',2],
ox:['Sacred Ox',1,'C',1,2,'','Meant to be offered.','🐃','W',3],
sent:['Argive Sentinel',2,'C',1,5,'k','','🗼','W',1],
gate:['Gatekeeper of Mycenae',3,'C',2,6,'pk','','🚪','W',2],
hydra:['Hydra Hatchling',2,'C',1,2,'v','','🐍','U',1],
sinon:['Sinon',3,'C',2,3,'','When it enters, return another of your army members to your hand.','🎭','W',1],
tires:['Tiresias',2,'C',1,3,'w','','🧙','U',1],
sapper:['Trojan Sapper',3,'C',2,3,'',`When it enters, destroy target opponent's item or modifier.`,'⛏️','W',1],
pyre:['Eternal Pyre',2,'A',0,0,'','Frenzy: each time you offer an army member, deal 1 damage to the opponent.','♨️','A'],
doct:['Phalanx Doctrine',2,'E',0,0,'','Your army members in defense form get +1 power.','📐','W'],
banner:['Banner of the Argives',3,'A',0,0,'','Your army members in attack form get +1 power.','🚩','A'],
skies:['Favor of Olympus',2,'E',0,0,'','Your flying army members get +1/+1.','☁️','U'],
net:['Net of Hephaestus',2,'E',0,0,'',`Opponent's army members enter tapped.`,'🕸️','A'],
hearth:['Hearth of Ithaca',2,'A',0,0,'','At the start of your turn, restore 1 health to each of your army members.','🏠','W'],
hammer:[`Hephaestus' Hammer`,2,'I',0,0,'',`Destroy target opponent's item or modifier.`,'⚒️','A'],
plunder:['Temple Plunder',3,'S',0,0,'',`Destroy target opponent's item or modifier. Draw a card.`,'💰','A'],
hecat:['Hecatomb',2,'S',0,0,'','Offer one of your army members, then draw 2 cards.','🪔','W'],
fury:['Fury of Ares',1,'I',0,0,'','Target army member gets +3/+0 until end of turn.','💢','R'],
testudo:['Testudo',2,'I',0,0,'','Your army members in defense form get +2/+2 until end of turn.','🐢','W'],
thunder:['Thunderbolt of Zeus',3,'S',0,0,'','Deal 4 damage to target army member (6 if it has flying).','🌩️','U'],
labyr:['The Labyrinth',4,'S',0,0,'',`Tap all of your opponent's army members.`,'🧩','A'],
reaper:['Slumber Reaper',3,'C',3,3,'x','','🌾','G',2],
sip:['Hypnotic Sip',2,'I',0,0,'',`Tap target opponent's army member; it doesn't untap next turn.`,'🍵','G'],
fog:['Narcotic Fog',4,'S',0,0,'',`Tap all of your opponent's untapped army members.`,'💨','G'],
haze:['Drowsy Haze',2,'E',0,0,'',`Opponent's army members enter tapped.`,'😪','G'],
censer:['Poppy Censer',3,'A',0,0,'',`At the start of your turn, tap your opponent's strongest untapped army member.`,'⚱️','G'],
eel:['Moray Eel',2,'C',2,3,'vk','','🐟','U',1],
canto:['Song of the Sirens',2,'E',0,0,'',`Opponent's army members can't switch to defense form.`,'🎼','U'],
lyre:['Lyre of the Deep',3,'A',0,0,'','Your flying army members have Draining.','🎻','U'],
elder:['Cyclops Elder',4,'C',4,6,'z','','🧔','R',3],
club:['Great Olive Club',3,'A',0,0,'','Your army members with power 3 or more have Bulldoze.','🏏','R']
"""
head=rep(head,"'⚡','A']};","'⚡','A'],"+NEWD+"};")
head=rep(head,"poly:['Polyphemus',5,'C',5,8,'r',","poly:['Polyphemus',5,'C',5,8,'rbz',")
head=rep(head,"const LORE={","const LORE={thess:'Human cavalry',zerk:'Frenzied warrior',boar:'Divine beast',diom:'Human hero',agam:'Human king',nike:'Goddess of victory',iris:'Divine messenger',helios:'Sun spirit',athena:'Olympian goddess',pyrep:'Human priestess',ox:'Sacrificial beast',sent:'Human guard',gate:'Human guard',hydra:'Serpent',sinon:'Human trickster',tires:'Blind prophet',sapper:'Human saboteur',reaper:'Plant monster',eel:'Sea beast',elder:'Cyclops elder',")
head=rep(head,"const STAPLES=","""const KWT={b:'Bulldoze.',v:'Venomous.',d:'Draining.',h:'Charge.',s:'Steadfast.',w:'Ward.',x:'Siege.',z:'Resilient.',y:'Rally.',k:'Can only defend.',n:'Can only attack.'};
const KWL={b:"Bulldoze: when it is blocked, damage beyond the blocker's remaining health hits the defending player.",v:'Venomous: any damage it deals to an army member destroys it.',d:'Draining: its controller gains life equal to the damage it deals.',h:'Charge: it can attack the turn it arrives.',s:'Steadfast: it does not tap when it attacks, so it can still block.',w:'Ward: opposing spells, abilities and attacks cannot target it.',x:'Siege: it deals its full power to army members it attacks.',z:'Resilient: the first time it would be destroyed, it survives with 1 health instead.',y:'Rally: when it attacks, the other attackers get +1 power.',k:'Sentinel: it can only defend; it cannot attack.',n:'Berserker: it can only attack; it cannot block.'};
const kwTxt=c=>c.f.split('').filter(k=>KWT[k]).map(k=>KWT[k]).join(' ');
const ARCH={O:'Offerings',P:'Phalanx',R:'Raiders',Y:'Olympus',C:'Cunning'};
const TAG={hopl:'P',owl:'Y',tela:'P',salve:'P',gale:'CY',feast:'P',altar:'O',horse:'CO',bow:'CY',aegis:'R',camp:'O',argus:'O',pythia:'O',slinger:'CR',healer:'P',spartan:'P',telem:'O',bull:'R',cass:'O',nestor:'C',pegasus:'Y',ajax:'P',achil:'R',eagle:'Y',hold:'P',mist:'C',rally:'R',rampart:'P',zeus:'O',thess:'R',zerk:'R',boar:'R',diom:'R',agam:'R',nike:'Y',iris:'Y',helios:'YR',athena:'Y',pyrep:'O',ox:'O',sent:'P',gate:'P',hydra:'PC',sinon:'C',tires:'C',sapper:'C',pyre:'O',doct:'P',banner:'R',skies:'Y',net:'C',hearth:'P',plunder:'C',hecat:'O',fury:'R',testudo:'P',thunder:'Y',labyr:'C'};
const STAPLES=""")
import re as _re
m=_re.search(r"STAPLES='spear sailor goat myrm herm'\.split\(' '\),POOL='[^']*'\.split\(' '\)",head)
assert m
head=head.replace(m.group(0),"STAPLES='spear sailor goat myrm herm'.split(' '),POOL='hopl owl tela salve spearc gale feast altar horse bow aegis camp argus pythia slinger healer spartan telem bull cass nestor pegasus ajax achil eagle hold mist rally rampart zeus thess zerk boar diom agam nike iris helios athena pyrep ox sent gate hydra sinon tires sapper pyre doct banner skies net hearth hammer plunder hecat fury testudo thunder labyr'.split(' ')")
head=rep(head,"'bull pegasus spearc slinger tela ajax nestor telem pythia rally'.split(' ').forEach(x=>RAR[x]='U');","'bull pegasus spearc slinger tela ajax nestor telem pythia rally zerk boar diom nike helios pyrep gate hydra sinon banner skies net plunder hecat testudo'.split(' ').forEach(x=>RAR[x]='U');'thess iris ox sent tires sapper doct hearth hammer fury'.split(' ').forEach(x=>RAR[x]='C');'agam athena pyre thunder labyr'.split(' ').forEach(x=>RAR[x]='R');")
m=_re.search(r"const EN=\[.*\];\n",head); assert m
head=head.replace(m.group(0),"""const EN=[{n:'The Lotus-Eaters',l:20,d:ids('isl:3,lot:3,priest,reaper:2,titan,sip:2,fog,breeze,haze,censer')},{n:'The Sirens',l:22,d:ids('scout:2,song:2,siren:2,nymph,reef,eel,melody:2,lure,undertow,shoal,canto,lyre')},{n:'Polyphemus',l:22,d:ids('sheep:4,cscout:2,cave,brute:2,poly,elder,hurl:2,milk,mouth,club')}];\n""")
# dealDraft
m=_re.search(r"function dealDraft\(\)\{.*?\n(?=function pickDraft)",mid,_re.S); assert m
mid=mid.replace(m.group(0),"""function dealDraft(){const off=[],W=G.dr.mode=='reward'?RW2:RW,have=[...(G.dr.mode=='reward'?G.p.recs.map(r=>r.id):[]),...G.dr.picks].filter(x=>!STAPLES.includes(x)),cnt={};have.forEach(id=>(TAG[id]||'').split('').forEach(k=>cnt[k]=(cnt[k]||0)+1));
const wt=x=>W[RAR[x]]*(1+Math.min(.9,.14*(TAG[x]||'').split('').reduce((n,k)=>n+(cnt[k]||0),0)));
while(off.length<3){const rest=POOL.filter(x=>!off.includes(x)),tot=rest.reduce((n,x)=>n+wt(x),0);let r=Math.random()*tot,id=rest[rest.length-1];for(const x of rest){r-=wt(x);if(r<0){id=x;break}}off.push(id)}
G.dr.off=off.map(id=>mk(id))}
""")
head=rep(head,"L.push(...atkLines(c,t));","L.push(...atkLines(c,t));if(TAG[c.id]&&t!='e')L.push('<b>Archetype</b>: '+TAG[c.id].split('').map(k=>ARCH[k]).join(' · ')+'.');")
head=rep(head,"if(SELF[c.id])L.push(SELF[c.id]);","for(const k of c.f)if(KWL[k])L.push(KWL[k]+(k=='z'&&c.rs?' (already used)':''));if(SELF[c.id])L.push(SELF[c.id]);")
tail=rep(tail,"+(has(c,'p')?' +2 power while in defense form.':'');","+(has(c,'p')?' +2 power while in defense form.':'')+(isC(c)&&kwTxt(c)?' '+kwTxt(c):'');")
# ---- balance pass 1 ----
head=rep(head,"scout:['Siren Scout',1,'C',2,4,","scout:['Siren Scout',1,'C',1,3,")
head=rep(head,"song:['Song-Caller',2,'C',3,4,","song:['Song-Caller',2,'C',2,4,")
head=rep(head,"siren:['Siren of Anthemoessa',3,'C',3,4,","siren:['Siren of Anthemoessa',3,'C',3,3,")
head=rep(head,"lot:['Lotus-Eater',2,'C',3,3,'r'","lot:['Lotus-Eater',2,'C',3,4,'r'")
head=rep(head,"poly:['Polyphemus',5,'C',5,8,'rbz',","poly:['Polyphemus',5,'C',5,8,'rb',")
head=rep(head,"{n:'The Lotus-Eaters',l:20,d:ids('isl:3,lot:3,priest,reaper:2,titan,sip:2,fog,breeze,haze,censer')}","{n:'The Lotus-Eaters',l:24,d:ids('isl:2,lot:3,priest,reaper:2,titan:2,sip:2,fog,haze,censer,honey')}")
head=rep(head,"{n:'Polyphemus',l:22,","{n:'Polyphemus',l:18,")
head=rep(head,"mouth:['Cave Mouth',2,'E',0,0,'',`Creatures with power 2 or less can't attack.`","mouth:['Cave Mouth',2,'E',0,0,'',`Creatures with power 1 or less can't attack.`")
head=rep(head,"mouth:`Opponent's army members with power 2 or less can't attack.`","mouth:`Opponent's army members with power 1 or less can't attack.`")
A=A.replace("x.id=='mouth')&&pw(c)<=2","x.id=='mouth')&&pw(c)<=1")
B=B.replace("pwr(x)<=2))s=3","pwr(x)<=1))s=3")
B=B.replace('Cave Mouth stops army members with power 2 or less.','Cave Mouth stops army members with power 1 or less.')
head=rep(head,"{n:'The Sirens',l:22,","{n:'The Sirens',l:19,")
