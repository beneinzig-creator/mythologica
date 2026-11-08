# ===== 9 new cards: 60 total =====
head=rep(head,"const AC={P:'W'","""D.mino=['Minotaur of Crete',4,'C',4,3,'o','','🐂','B',3];
D.cerb=['Cerberus',5,'C',4,5,'o',"When it dies or is offered, deal 2 damage to each opposing army member.",'🐺','B',4];
D.tbull=['Bull of Poseidon',3,'C',3,3,'o','','🐃','B',2];
D.charon=['Charon the Ferryman',4,'C',2,4,'o','When offered, gain 2 extra mana and draw a card.','⛵','B',2];
D.capt=['Hoplite Captain',4,'C',4,5,'p','','🛡️','W',2];
D.bastion=['Bastion of Sparta',4,'S',0,0,'','Your Phalanx army members get +1/+3 permanently.','🏯','W'];
D.sack=['Sack of Ismarus',4,'S',0,0,'','Deal 2 damage to the opponent for each Raider you control.','🔥','R'];
D.dio2=['Diomedes the Bold',4,'C',4,3,'rh','','🗡️','R',2];
D.muse=["Muse's Inspiration",3,'S',0,0,'','Draw 2 cards.','🎼','A'];
const AC={P:'W'""")
head=rep(head,"const LORE={","const LORE={mino:'Monstrous beast',cerb:'Hound of Hades',tbull:'Sacred beast',charon:'Psychopomp',capt:'Human captain',dio2:'Human hero',")
head=rep(head,"camp:'O',herm:'O',","camp:'O',herm:'O',mino:'O',cerb:'O',tbull:'O',charon:'O',capt:'P',bastion:'P',sack:'R',dio2:'R',")
m=_r5.search(r"POOL='([^']*)'",head);L=m.group(1).split(' ')+['mino','cerb','tbull','charon','capt','bastion','sack','dio2','muse']
head=head.replace(m.group(0),"POOL='"+' '.join(L)+"'")
head=rep(head,"const ids=s=>","RAR.mino='U';RAR.cerb='R';RAR.tbull='C';RAR.charon='U';RAR.capt='U';RAR.bastion='U';RAR.sack='U';RAR.dio2='U';RAR.muse='U';\nconst ids=s=>")
A=rep(A,"drill:s=>","bastion:s=>cr(s).filter(c=>has(c,'p')).forEach(c=>{c.pa++;c.pd+=3}),sack:(s,o)=>{o.life-=2*cr(s).filter(c=>has(c,'r')).length},muse:s=>draw(s,2),drill:s=>")
A=rep(A,"const DEATH=","const cerbFx=(s,o)=>{cr(o).filter(x=>!has(x,'w')).forEach(x=>{x.dmg+=2});log('Cerberus tears into the opposing army.')};\nconst DEATH=")
A=rep(A,"cass:{p:3,fn:cassFx}}","cass:{p:3,fn:cassFx},cerb:{p:3,fn:cerbFx}}")
A=rep(A,"if(c.id=='cass')cassFx(s,o);","if(c.id=='cass')cassFx(s,o);if(c.id=='cerb')cerbFx(s,o);if(c.id=='charon'){s.mana+=2;draw(s,1);log('Charon grants 2 extra mana and a card.')}")
