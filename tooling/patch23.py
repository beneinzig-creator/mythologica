# ===== v53: draft Back removed, Fleet cap, random Cassandra, 4 starters, Legendary rarity + 10 cards, crafting odds =====
_b3('<button class="b" data-b="hubback">Back</button> <button class="b" data-b="dpass" style="margin-left:12px;background:#555','<button class="b" data-b="dpass" style="background:#555')
_b3("(has(c,'l')?(s=>s?s.bf.filter(x=>x!==c&&isC(x)&&has(x,'l')).length:0)(sideOf(c)):0)","(has(c,'l')?(s=>s?Math.min(3,s.bf.filter(x=>x!==c&&isC(x)&&has(x,'l')).length):0)(sideOf(c)):0)")
_b3("Fleet: this army member gets +1/+1 for each other Fleet army member its controller controls (the Phaeacians).","Fleet: this army member gets +1/+1 for each other Fleet army member its controller controls, up to +3/+3 (the Phaeacians).")
_b3("const cassFx=(s,o)=>{const E=cr(o).filter(x=>!has(x,'w')),k=E.filter(x=>th(x)-x.dmg<=3).sort((a,b)=>(pw(b)+th(b))-(pw(a)+th(a)))[0],t=k||best(E);if(t){t.dmg+=3;log(\"Cassandra's prophecy strikes \"+D[t.id][0]+'.')}};",
 "const cassFx=(s,o,n)=>{n=typeof n=='number'?n:3;const E=cr(o).filter(x=>!has(x,'w')),t=E[Math.random()*E.length|0];if(t){t.dmg+=n;log((n==3?\"Cassandra's prophecy\":'Thanatos')+' strikes '+D[t.id][0]+' for '+n+'.')}};")
_b3("const DEATH={","const DEATH={thanat:{p:3,fn:s=>cassFx(s,oppOf(s),5)},")
_b3("const STAPLES='spear sailor goat spearc aegis'","const STAPLES='spear sailor spearc aegis'")
_b3("augur sphinx'.split(' '),ROUNDS=10;","augur sphinx leon thermo brasidas pent horde eury iph hades thanat games'.split(' '),ROUNDS=11;")
_b3("Your army is assembled.","Your deck is assembled.")
_b3("const RARN={C:'Common',U:'Uncommon',R:'Rare'},RW={C:6,U:3,R:1},RW2={C:3,U:4,R:3},RAR={};","const RARN={C:'Common',U:'Uncommon',R:'Rare',L:'Legendary'},RW={C:6,U:3,R:1,L:.18},RW2={C:1,U:4,R:3.5,L:1.1},RAR={};")
_b3("const ids=s=>s.split(',')","""Object.assign(D,{
leon:['Leonidas, King of Sparta',4,'C',4,6,'pz','Your other Phalanx army members get +2/+2.','🦁','W',3],
thermo:['Last Stand at Thermopylae',4,'E',0,0,'','Your Phalanx army members get +2/+2. In defense form they get +2/+2 more and have Resilient.','⛰️','W'],
brasidas:['Brasidas, Spartan General',3,'C',2,5,'p','When it enters, your Phalanx army members get +1/+1 permanently.','⚜️','W',2],
pent:['Penthesilea, Amazon Queen',4,'C',5,4,'rh','Your other Raiders have Charge and get +1 power.','🏹','R',3],
horde:['Charge of the Amazons',2,'I',0,0,'','Your Raiders get +4/+0 until end of turn.','🌪️','R'],
eury:['Eurylochus, Raid Captain',3,'C',4,3,'rh','When it enters, your other Raiders get +1/+1 permanently.','🏴‍☠️','R',2],
iph:['Iphigenia',3,'C',2,4,'o','When offered, gain 3 extra mana and draw 2 cards.','🦌','B',4],
hades:['Hades, Lord of the Dead',4,'C',4,6,'o','Each time you offer another army member, draw a card and deal 3 damage to the opponent.','🌑','B',4],
thanat:['Thanatos',3,'C',3,3,'o','When it dies or is offered, deal 5 damage to a random opponent army member.','🦇','B',3],
games:['Funeral Games',2,'S',0,0,'','Offer one of your army members. Your army members get +1/+1 permanently and you draw a card.','🏺','B']});
Object.assign(TAG,{leon:'P',thermo:'P',brasidas:'P',pent:'R',horde:'R',eury:'R',iph:'O',hades:'O',thanat:'O',games:'O'});
Object.assign(LORE,{leon:'Spartan king',thermo:'The hot gates',brasidas:'Spartan general',pent:'Queen of the Amazons',horde:'The Amazon charge',eury:'Odysseus\\' lieutenant',iph:'The willing daughter',hades:'God of the dead',thanat:'Death itself',games:'Rites for the fallen'});
const ids=s=>s.split(',')""")
_b3("RAR.shade1=RAR.mourner=","'leon thermo pent horde iph hades'.split(' ').forEach(x=>RAR[x]='L');'brasidas eury thanat games'.split(' ').forEach(x=>RAR[x]='R');\nRAR.shade1=RAR.mourner=")
# engine hooks
_b3("(has(c,'e')?omg(c,'shroud'):0)+","(has(c,'e')?omg(c,'shroud'):0)+(has(c,'p')&&c.id!='leon'&&own(c,'leon')?2:0)+(has(c,'p')&&own(c,'thermo')?1+omg(c,'thermo'):0)+(has(c,'p')&&c.def&&own(c,'thermo')?1+omg(c,'thermo'):0)+")
_b3("+(has(c,'r')?omg(c,'banner'):0)","+(has(c,'r')?omg(c,'banner'):0)+(has(c,'r')&&c.id!='pent'&&own(c,'pent')?1:0)")
_b3("(k=='z'&&has(c,'p')&&own(c,'shield'))","(k=='z'&&has(c,'p')&&own(c,'shield'))||(k=='z'&&has(c,'p')&&c.def&&own(c,'thermo'))")
_b3("c.sick=has(c,'h')?0:1;if(has(c,'k'))c.def=1;","c.sick=(has(c,'h')||(has(c,'r')&&s.bf.some(x=>x.id=='pent')))?0:1;if(has(c,'k'))c.def=1;")
_b3("if(c.id=='cass')cassFx(s,o);","if(c.id=='cass')cassFx(s,o);if(c.id=='thanat')cassFx(s,o,5);if(c.id=='iph'){s.mana+=3;draw(s,2);log('Iphigenia grants 3 extra mana and 2 cards.')}")
_b3("if(s.bf.some(x=>x.id=='zeus'))draw(s,1);cr(s).filter(x=>x.id=='telem')","if(s.bf.some(x=>x.id=='zeus'))draw(s,1);s.bf.filter(x=>x.id=='hades').forEach(()=>{draw(s,1);o.life-=3;log('Hades claims 3 life.')});cr(s).filter(x=>x.id=='telem')")
_b3("const FX={","const FX={horde:s=>cr(s).filter(c=>has(c,'r')).forEach(c=>{c.ta+=4+mg()}),games:(s,o,t)=>{offer(s,t);cr(s).forEach(c=>{c.pa+=1+mg();c.pd+=1+mg()});draw(s,1)},")
_b3("const ETB={","const ETB={brasidas:s=>cr(s).filter(c=>has(c,'p')).forEach(c=>{c.pa++;c.pd++}),eury:s=>{const me=s.bf[s.bf.length-1];cr(s).filter(c=>c!==me&&has(c,'r')).forEach(c=>{c.pa++;c.pd++})},")
_b3("hecat:'pc'};","hecat:'pc',games:'pc'};")
_b3("const ETBV={","const ETBV={brasidas:2.5,eury:2,")
_b3("const IV={","const IV={thermo:7,")
_b3("const UPS={","const UPS={horde:n=>`Raiders +${4+n}/+0`,games:n=>`+${1+n}/+${1+n} permanently`,thermo:n=>`Phalanx +${2+n}/+${2+n}, defense +${2+n}/+${2+n} more`,")
_b3(".rR{color:#f4c542}",".rR{color:#f4c542}.rL{color:#f08cff;text-shadow:0 0 6px #b04be0}")
_b3("const SCL=[[0,0,0],[6,1,0],[8,1,2],[12,3,3]];","const SCL=[[-3,0,0],[4,1,0],[7,1,2],[9,3,3]];")
