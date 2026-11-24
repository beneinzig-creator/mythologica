/* ===== v105: Thoth, Scribe of the Gods — cards, hero, Egyptian realm ===== */
Object.assign(ARCH,{D:'Sundered',I:'Scribes',Y:'Recorder'});
Object.assign(D,{
/* --- staples --- */
tscr:['Temple Scribe',1,'C',1,2,'','When it enters, Inscribe Ward onto target army member you control.','✍️','U',1],
tsun:['Sunder the Soul',1,'S',0,0,'','Sunder target army member: it splits into its Body (half its health, no power) and Spirit (half its power, 1 health, Flying), and you take its Name.','🪓','B'],
tscar:['Scarab Amulet',1,'A',0,0,'','Amulet (equip ◆1). The first time the bearer would die, return it to your hand instead.','🪲','A'],
tpen:['Reed Pen',0,'I',0,0,'','Inscribe Flying onto target army member you control.','🖋️','U'],
tmedj:['Medjay of the Temple',1,'C',1,3,'','','🛡️','N',1],
/* --- Sundered --- */
dsk:['Body-Keeper',1,'C',1,3,'','Your Bodies get +2/+0.','🏺','B',1],
dbal:['Spirit Keeper',2,'C',1,2,'f','Your Spirits get +1/+1.','🦅','B',1],
dcut:['Ritual Knife',1,'S',0,0,'','Sunder target army member you control. Draw a card.','🔪','B'],
dpart:['Parting of Souls',2,'S',0,0,'','Sunder target opposing army member that costs 3 or less. Draw a card.','🌗','B'],
dembal:['Embalmer',2,'C',2,2,'','When it dies, its Body (0/2) stays in your army.','🧻','B',1],
dheart:['Heart Scarab',1,'A',0,0,'','Amulet (equip ◆1). +0/+2. When the bearer is Sundered, its Body and Spirit each get +1/+1.','💚','A'],
dwrap:['Linen Wrappings',1,'A',0,0,'','Amulet (equip ◆1). The bearer has Resilient.','🩹','A'],
dnomad:['Wandering Spirit',1,'C',1,1,'f','When it dies, draw a card.','🕊️','B',1],
dreun:['Reunion in the Field of Reeds',2,'S',0,0,'','Reunite all your Body and Spirit pairs: each becomes its original again with +1/+1. Draw a card for each.','🌾','B'],
dsever:['Sever the Mighty',3,'S',0,0,'','Sunder the opposing army member that costs the most (not one with Ward).','⚔️','B'],
dshade:['Sheut, the Shadow',2,'C',2,2,'','Whenever one of your army members is Sundered, it gets +1/+1 permanently.','👤','B',1],
dcart:['Cartouche Ring',2,'A',0,0,'','Amulet (equip ◆2). At the end of your turn, if the bearer is a Body or Spirit whose other half you control, Reunite them.','💍','A'],
dtwof:['Amulet of the Two Feathers',1,'A',0,0,'','Amulet (equip ◆1). +1/+1, or +2/+2 on a Spirit.','🪶','A'],
dweigh:['Weigher of Souls',3,'C',2,4,'','When it enters, Sunder target opposing army member with 2 or less power.','⚖️','B',2],
dkhep:["Khepri's Rebirth",2,'S',0,0,'','The Body and Spirit of the most expensive army member in your graveyard rise into your army.','🌅','B'],
dakh:['Akh, the Glorified',4,'C',3,3,'','When it enters, Reunite all your Body and Spirit pairs; each gets +1/+1 more.','✨','B',2],
dsplit:['Dismemberment',3,'S',0,0,'','Sunder each opposing army member that costs 2 or less.','🗡️','B'],
dren:['Names of the Dead',2,'S',0,0,'','Put the Name of up to 3 army members from your graveyard into your hand.','📜','B'],
dsoul:['Soul-Collector',2,'C',1,3,'','Whenever an opposing army member is Sundered, draw a card.','🫙','B',2],
dduat:['Gate of the Duat',2,'E',0,0,'','Whenever one of your Bodies or Spirits dies, deal 1 damage to the opponent.','🚪','B'],
dmum:['Mummy of the Old Kingdom',4,'C',3,6,'z','Resilient. When it dies, its Body and Spirit rise into your army.','🧟','B',3],
dosir:['Osiris, Lord of the Dead',5,'C',4,6,'','At the end of your turn, Reunite all your Body and Spirit pairs. Your Akh get +2/+2.','👑','B',3],
dammit:["Ammit's Jaws",3,'S',0,0,'','Sunder target opposing army member. The opponent loses life equal to its remaining health.','🐊','B'],
dbook:['Book of Gates',3,'E',0,0,'','Whenever you Sunder an army member, an extra Spirit of it joins your army.','📕','B'],
/* --- Scribes --- */
iink:['Ink of Seshat',1,'S',0,0,'','Inscribe +1/+1 and Ruthless onto target army member you control.','🖊️','U'],
iscribe:['Apprentice Scribe',2,'C',1,3,'','When it enters, Inscribe +1/+1 onto target army member you control.','📝','U',1],
ichisel:['Chisel',1,'I',0,0,'','Target opposing army member loses all its keywords.','⛏️','U'],
iword:['Amulet of Words',1,'A',0,0,'','Amulet (equip ◆1). Glyphs you Inscribe onto the bearer are written on this amulet instead, so they move with it. It comes with Charge written on it.','📿','A'],
iglyph:['Glyph-Warded Guard',2,'C',1,4,'w','Ward.','🛡️','U',1],
iwas:['Was-Sceptre',1,'A',0,0,'','Amulet (equip ◆1). +1/+0, and +1/+0 more for each glyph on the bearer.','🔱','A'],
ireed:['Reed Brush',1,'I',0,0,'','Inscribe Charge onto target army member you control. Draw a card.','🖌️','U'],
itut:['Tutor of Scribes',1,'C',1,2,'','When it enters, draw a card if any of your army members has a glyph.','📚','U',1],
isac:['Sacred Text',2,'S',0,0,'','Inscribe Ward and Resilient onto target army member you control.','📜','U'],
iliv:['Living Papyrus',2,'C',1,2,'','Gets +1/+1 for each glyph among your army members (up to +4/+4).','🧾','U',2],
ierase:['Damnatio',3,'S',0,0,'','Erase target opposing army member: it loses its name, keywords and abilities.','🪨','U'],
ishen:['Shen Ring',1,'A',0,0,'','Amulet (equip ◆1). +0/+1. The opponent can\'t Sunder or Erase the bearer.','⭕','A'],
idjed:['Djed Pillar',2,'A',0,0,'','Amulet (equip ◆1). +0/+3 and Phalanx.','🏛️','A'],
ikhem:['Keeper of Sacred Texts',2,'C',2,2,'','Your army members with 3 glyphs get +2/+2.','📖','U',1],
iunwr:['Unwriting',0,'S',0,0,'','Remove the newest glyph from target army member you control. If you do, gain 2 mana.','🧽','U'],
iseshat:['Seshat, Mistress of Books',3,'C',2,4,'','The first time you Inscribe each turn, draw a card.','📚','U',2],
ihekau:['Words of Heka',2,'S',0,0,'','Inscribe Flying, Ward and Charge onto target army member you control.','🌟','U'],
ieye:['Eye of Horus',2,'A',0,0,'','Amulet (equip ◆1). +1/+1 and Ward. While it is worn, Foresee 1 at the start of your turn.','👁️','A'],
iobel:['Obelisk of Words',3,'E',0,0,'','At the start of your turn, Inscribe +1/+1 onto your army member with the fewest glyphs.','🗼','U'],
ianx:['Ankh of Life',2,'A',0,0,'','Amulet (equip ◆2). +1/+1 and Draining.','☥','A'],
inarm:['Palette of Narmer',3,'S',0,0,'','Inscribe +1/+1 onto each of your army members.','🎨','U'],
ithoth:['The Book of Thoth',3,'A',0,0,'','At the start of your turn, Inscribe a random keyword onto each of your army members, and you lose 1 life.','📗','U'],
iweret:['Weret-Hekau, Great of Magic',4,'C',3,4,'','Whenever you Inscribe a keyword onto an army member, also Inscribe +1/+1 onto it if it has room.','🐍','U',3],
iname:['The Unspoken Name',2,'S',0,0,'','Erase target opposing army member, then put its Name into your hand.','🤐','U'],
/* --- Recorder --- */
yibis:['Ibis of Thoth',1,'C',1,1,'f','When it enters, Foresee 2.','🐦','U',1],
yread:['Read the Signs',1,'S',0,0,'','Foresee 3. Draw a card.','🔮','U'],
yclerk:['Temple Archivist',2,'C',1,3,'','Whenever they play a Foreseen card, you gain 1 life and they lose 1 life.','🗂️','U',1],
ywatch:['Watcher at the Gate',2,'C',2,3,'','When it enters, Foresee their hand.','🧿','U',1],
ywarn:['Forewarned',1,'I',0,0,'','Your army members get +0/+2 until end of turn. Foresee 1.','⚠️','U'],
ybab:['Baboon of the Dawn',2,'C',2,2,'','When it enters, Foresee 2 and Record them.','🐒','U',1],
yledger:['Ledger of Deeds',1,'S',0,0,'','Record every Foreseen card. Draw a card.','📒','U'],
yprep:['Lay the Snare',2,'S',0,0,'','Foresee 2, then Preempt their most expensive Foreseen card.','🪤','U'],
ypre:['Preempt',2,'I',0,0,'','Preempt their most expensive Foreseen card: when they play it, it fails. Draw a card.','⛔','U'],
yrecall:['Recorded History',2,'S',0,0,'','Put fading copies of two random army members they have played this fight into your hand.','🏺','U'],
ysage:['Sage of Hermopolis',3,'C',2,4,'','When it enters, Foresee 3 and Record them.','🧙','U',2],
ystar:['Star-Reader',2,'C',1,3,'','At the start of your turn, Foresee 1.','⭐','U',1],
yfore:['Foreknowledge',1,'E',0,0,'','Whenever they play a Foreseen card, they lose 2 life.','🗞️','U'],
ycopy:["Scribe's Copy",1,'S',0,0,'','Put a fading copy of the last card they played into your hand (if it was not an army member, draw a card instead).','📄','U'],
ytrap:['Ambush Foretold',2,'I',0,0,'','Tap target opposing army member. Foresee 1.','🎯','U'],
yhall:['Hall of Records',3,'E',0,0,'','Whenever they play a Foreseen card, Record it.','🏛️','U'],
ycount:['Countermeasure',3,'S',0,0,'','Foresee their hand, then Preempt their two most expensive Foreseen cards.','🛑','U'],
ykhon:['Khonsu, the Moon-Traveler',3,'C',2,4,'f','At the start of your turn, Foresee 2.','🌙','U',2],
yvizier:["Vizier's Report",2,'S',0,0,'','Foresee their hand. Draw a card for each army member in it (up to 2).','📋','U'],
yechoes:['Echoes of the Past',3,'S',0,0,'','A fading copy of the last army member they played joins your army.','🔁','U'],
yjudge:['Judge of Words',4,'C',3,5,'','Whenever they play a Foreseen card, deal 1 damage to each opposing army member.','🧑‍⚖️','U',3],
ysenet:['Senet with the Moon',3,'S',0,0,'','Take an extra turn after this one. Disintegrate.','🎲','U'],
ytruth:["Ma'at's Ledger",2,'E',0,0,'','At the start of your turn, Foresee 1 and Record it. Whenever they play a Recorded card, gain 1 mana.','🪶','U'],
yall:['The All-Seeing Scribe',5,'C',4,6,'','When it enters, Foresee their hand and their next 3 cards, then Preempt the most expensive.','🔭','U',3],
/* --- generic --- */
gscroll:['Scroll of Protection',1,'I',0,0,'','Target army member you control gets +2/+2 until end of turn.','🧻','N'],
gfeather:["Feather of Ma'at",1,'A',0,0,'','Amulet (equip ◆1). +1/+1.','🪶','A'],
gpriest:['Priest of Thoth',2,'C',1,3,'','When it enters, draw a card.','🧑‍🦲','N',1],
gnile:['Gift of the Nile',2,'S',0,0,'','Gain 4 life. Draw a card.','🌊','N'],
gcanop:['Canopic Jars',2,'A',0,0,'','Whenever an army member is Sundered, gain 1 mana.','⚱️','N'],
gweigh:['The Weighing of the Heart',4,'S',0,0,'','Destroy each army member whose cost is greater than its number of glyphs plus amulets.','⚖️','N']
});
Object.assign(LORE,{tmedj:'Temple guard',tscr:'Temple scribe',tsun:'Ritual of parting',tscar:'Amulet',tpen:'Scribe\'s tool',dsk:'Keeper of bodies',dbal:'Keeper of spirits',dcut:'Ritual',dpart:'Ritual',dembal:'Embalmer',dheart:'Amulet',dwrap:'Amulet',dnomad:'Wandering spirit',
 dreun:'The Field of Reeds',dsever:'Ritual',dshade:'The shadow-soul',dcart:'Amulet',dtwof:'Amulet',dweigh:'Judge of the dead',dkhep:'The scarab of dawn',dakh:'The glorified soul',dsplit:'Ritual',dren:'True names',dsoul:'Soul-gatherer',dduat:'The underworld',dmum:'The ancient dead',
 dosir:'Lord of the dead',dammit:'The devourer',dbook:'Book of the underworld',iink:'Ritual',iscribe:'Temple scribe',ichisel:'Erasure',iword:'Amulet',iglyph:'Temple guard',iwas:'Amulet',ireed:'Scribe\'s tool',itut:'Teacher',isac:'Sacred writing',iliv:'Living scroll',ierase:'Erasure',ishen:'Amulet',
 idjed:'Amulet',ikhem:'Keeper of texts',iunwr:'Erasure',iseshat:'Goddess of writing',ihekau:'Words of power',ieye:'Amulet',iobel:'Monument',ianx:'Amulet',inarm:'Royal palette',ithoth:'The forbidden book',iweret:'Goddess of magic',iname:'Erasure',
 yibis:'Sacred ibis',yread:'Augury',yclerk:'Archivist',ywatch:'Gatekeeper',ywarn:'Foresight',ybab:'Sacred baboon',yledger:'Record',yprep:'Foresight',ypre:'Foresight',yrecall:'Record',ysage:'Sage',ystar:'Astronomer',yfore:'Foresight',ycopy:'Record',ytrap:'Foresight',yhall:'Archive',
 ycount:'Foresight',ykhon:'God of the moon',yvizier:'Royal vizier',yechoes:'Record',yjudge:'Judge',ysenet:'The moon\'s wager',ytruth:'The record of truth',yall:'The scribe who sees all',gscroll:'Spell',gfeather:'Amulet',gpriest:'Priest',gnile:'Blessing',gcanop:'Funerary jars',gweigh:'Judgement'});
Object.assign(TS,{tsun:'c',tscar:'pc',tpen:'pc',dcut:'pc',dpart:'x3',dheart:'pc',dwrap:'pc',dcart:'pc',dtwof:'pc',dammit:'x',iink:'pc',ichisel:'x',iword:'pc',iwas:'pc',ireed:'pc',isac:'pc',ierase:'x',ishen:'pc',idjed:'pc',iunwr:'pc',ihekau:'pc',ieye:'pc',ianx:'pc',iname:'x',ytrap:'x',gscroll:'pc',gfeather:'pc'});
TSM.x3='Choose an opposing army member that costs 3 or less.';
Object.assign(FX,{
 tsun:(s,o,t)=>{if(t&&typeof t=='object')thSunder(t,s)},
 tpen:(s,o,t)=>inscribe(t,'f'),
 dcut:(s,o,t)=>{if(t&&typeof t=='object')thSunder(t,s);draw(s,1)},
 dpart:(s,o,t)=>{if(t&&typeof t=='object'&&D[t.id][1]<=3)thSunder(t,s);draw(s,1)},
 dreun:(s,o)=>{const n=reunite(s);if(n)draw(s,n)},
 dsever:(s,o)=>{const t=tg(o).sort((a,b)=>D[b.id][1]-D[a.id][1]||ev(b)-ev(a))[0];if(t)thSunder(t,s)},
 dkhep:(s,o)=>{const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)).sort((a,b)=>D[b.id][1]-D[a.id][1])[0];if(g){s.gy.splice(s.gy.indexOf(g),1);makeParts(s,g,0);log('Khepri raises the Body and Spirit of '+D[g.id][0]+'.')}},
 dsplit:(s,o)=>{tg(o).filter(x=>D[x.id][1]<=2).forEach(x=>thSunder(x,s))},
 dren:(s,o)=>{s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)).slice(-3).forEach(x=>s.hand.push(makeRen(x)));log('You recall the names of the dead.')},
 dammit:(s,o,t)=>{if(!t||typeof t!='object')return;const h=Math.max(0,th(t)-t.dmg);if(thSunder(t,s)){o.life-=h;log('Ammit devours the heart: they lose '+h+' life.')}},
 iink:(s,o,t)=>{inscribe(t,'+');inscribe(t,'r')},
 ichisel:(s,o,t)=>{if(t&&typeof t=='object'){t.f='';log(D[t.id][0]+' loses all its keywords.')}},
 ireed:(s,o,t)=>{inscribe(t,'h');draw(s,1)},
 isac:(s,o,t)=>{inscribe(t,'w');inscribe(t,'z')},
 ierase:(s,o,t)=>{if(t&&typeof t=='object')thErase(t,s)},
 iunwr:(s,o,t)=>{if(!t||typeof t!='object'||!(t.gl||[]).length)return;const g=t.gl.pop();if(g=='+'){t.pa--;t.pd--}else if(g[0]=='n'){t.wr=(t.wr||[]).filter((x,i,a)=>i!==a.lastIndexOf(g.slice(2)))}else if(!(D[t.id][5]||'').includes(g)){t.f=t.f.split(g).join('')}s.mana+=2;log('You unwrite a glyph: +2 mana.')},
 ihekau:(s,o,t)=>{inscribe(t,'f');inscribe(t,'w');inscribe(t,'h')},
 inarm:(s,o)=>{cr(s).forEach(x=>inscribe(x,'+'))},
 iname:(s,o,t)=>{if(!t||typeof t!='object')return;const r=makeRen(t);if(thErase(t,s))s.hand.push(r)},
 yread:(s,o)=>{foresee(3);draw(s,1)},
 ywarn:(s,o)=>{cr(s).forEach(x=>{x.td+=2});foresee(1)},
 yledger:(s,o)=>{fsAll().forEach(c=>{c.rc=1});draw(s,1)},
 yprep:(s,o)=>{foresee(2);preempt(1)},
 ypre:(s,o)=>{preempt(1);draw(s,1)},
 yrecall:(s,o)=>{const L=(G.thPlayed||[]).filter(id=>D[id]&&D[id][2]=='C'&&!TOKE.includes(id));for(let i=0;i<2&&L.length;i++){const id=L[Math.random()*L.length|0];const c=mk(id);c.dis=1;s.hand.push(c)}},
 ycopy:(s,o)=>{const id=G.thLast;if(id&&D[id]&&D[id][2]=='C'&&!TOKE.includes(id)){const c=mk(id);c.dis=1;s.hand.push(c)}else draw(s,1)},
 ytrap:(s,o,t)=>{if(t&&typeof t=='object')t.tap=1;foresee(1)},
 ycount:(s,o)=>{foreseeHand();preempt(2)},
 yvizier:(s,o)=>{const H=foreseeHand();draw(s,Math.min(2,H.filter(isC).length))},
 yechoes:(s,o)=>{const L=(G.thPlayed||[]).filter(id=>D[id]&&D[id][2]=='C'&&!TOKE.includes(id));const id=L[L.length-1];if(id&&cr(s).length<AM()){const c=mk(id);c.dis=1;enter(s,c);log('An echo of '+D[id][0]+' joins your army.')}},
 ysenet:(s,o)=>{s.xt=1;if(CUR)CUR.dis=1;log('You win five days from the moon: you will take an extra turn.')},
 gscroll:(s,o,t)=>{if(t&&typeof t=='object'){t.ta+=2;t.td+=2}},
 gnile:(s,o)=>{s.life=Math.min(s.max,s.life+4);draw(s,1)},
 gweigh:(s,o)=>{for(const x of [...cr(s),...cr(o)]){if(D[x.id][1]>glyphsOn(x)+amOf(x).length)x.dmg=99}log('The hearts are weighed against the feather.')}
});
const kaOnly=(s,src)=>{if(cr(s).length>=AM())return;const d=D[src.id],ki='ka'+(++THN);D[ki]=['Body of '+d[0].split(',')[0],0,'C',0,2,'n','Body: it cannot block.','🗿',d[8],1];LORE[ki]='The body';TOKE.push(ki);const t=mk(ki);t.part='ka';enter(s,t)};
Object.assign(ETB,{
 itut:s=>{if(cr(s).some(x=>(x.gl||[]).length))draw(s,1)},
 yibis:s=>foresee(2), ywatch:s=>foreseeHand(), ybab:s=>foresee(2,1), ysage:s=>foresee(3,1),
 dakh:s=>{const n=reunite(s,1);if(n)log('Akh glorifies '+n+' reunited soul'+(n>1?'s':'')+'.')},
 gpriest:s=>draw(s,1),
 yall:s=>{foreseeHand();foresee(3);preempt(1)}
});
Object.assign(PEND,{
 tscr:{who:'p',ok:T=>isC(T)&&roomOf(T)>0,fn:T=>inscribe(T,'w'),has:(s,o)=>cr(s).some(x=>roomOf(x)>0),m:'Temple Scribe: click one of your army members to Inscribe Ward onto it.'},
 iscribe:{who:'p',ok:T=>isC(T)&&roomOf(T)>0,fn:T=>inscribe(T,'+'),has:(s,o)=>cr(s).some(x=>roomOf(x)>0),m:'Apprentice Scribe: click one of your army members to Inscribe +1/+1 onto it.'},
 dweigh:{who:'e',ok:T=>isC(T)&&pwr(T)<=2&&!has(T,'w'),fn:T=>thSunder(T,G.p),has:(s,o)=>cr(o).some(x=>pwr(x)<=2&&!has(x,'w')),m:'Weigher of Souls: click an opposing army member with 2 or less power to Sunder it.'}
});
Object.assign(DEATH,{
 dembal:{p:2,fn:(s,o,c)=>kaOnly(s,c)},
 dnomad:{p:2,fn:s=>draw(s,1)},
 dmum:{p:2,fn:(s,o,c)=>{const g=s.gy.indexOf(c);makeParts(s,c,0);log('The Mummy\'s Body and Spirit rise.')}}
});
/* auras for Body/Spirit and glyph payoffs */
function thPx(c){const s=sideOf(c);if(!s)return 0;let n=0;if(c.part=='ka')n+=2*nOn(s,'dsk');if(c.part=='ba')n+=nOn(s,'dbal');
 if(c.id=='iliv')n+=Math.min(4,cr(s).reduce((a,x)=>a+glyphsOn(x),0));if(glyphsOn(c)>=3)n+=2*nOn(s,'ikhem');return n}
function thTx(c){const s=sideOf(c);if(!s)return 0;let n=0;if(c.part=='ba')n+=nOn(s,'dbal');
 if(c.id=='iliv')n+=Math.min(4,cr(s).reduce((a,x)=>a+glyphsOn(x),0));if(glyphsOn(c)>=3)n+=2*nOn(s,'ikhem');return n}

/* ===== Egypt realm (enemies for Thoth's Act I, and for every hero in Act II) ===== */
MT.push('trob','serk','shab','sobk','anub','heka');
Object.assign(D,{
/* mini-trumps */
trob:['Grave-Goods',0,'E',0,0,'w','Ward. At the start of their turn, if they control more army members than you, they steal a random item or modifier you control (or, if you have none, a random card from your hand) for the rest of the fight.','💰','N'],
serk:["Serket's Venom",1,'E',0,0,'w','Ward. Their army members with 1 power have Venomous while in attack form.','🦂','G'],
shab:['Shabti Oath',1,'E',0,0,'w','Ward. The first time each of their non-token army members dies, a 1/1 Shabti takes its place.','🗿','N'],
sobk:['Jaws of Sobek',1,'E',0,0,'w','Ward. Their army members have Ruthless (they get +1 power when they attack).','🐊','G'],
anub:['Guides of the Dead',1,'E',0,0,'w','Ward. Whenever any army member dies, the jackals feed: you lose 1 life.','🐺','B'],
heka:['Execration',1,'E',0,0,'w','Ward. At the start of their turn, a random card in your hand is cursed: it costs 1 more for the rest of the fight.','🏺','B'],
/* elite trumps */
ammt:['Devour the Unworthy',1,'E',0,0,'w','Ward. Whenever one of your army members dies, their strongest army member gets +1/+1 permanently.','🐊','B'],
sphx:['Riddle of the Sphinx',0,'E',0,0,'w','Ward. At the start of their turn, the Sphinx names a card type. At the end of your turn, if you did not play a card of that type, you lose 2 life.','🦁','W'],
/* boss trumps */
apep:['The Unmaking',0,'E',0,0,'w','Ward. At the start of its turn, your strongest army member is Erased: it loses its name, keywords and abilities.','🐍','B'],
setx:['The Dismemberment',0,'E',0,0,'w','Ward. At the start of its turn, your strongest army member that costs 3 or more is Sundered: its Body and Spirit stay with you, but its Name is lost.','🌪️','R'],
sekh:['The Eye of Ra',0,'E',0,0,'w','Ward. At the start of her turn, each of her army members gets +1/+0 permanently, and her rage burns her for 1 per army member she controls.','☀️','R'],
/* tokens and army members */
shabt:['Shabti',0,'C',1,1,'','Token.','🗿','N',1],
grob:['Grave Robber',1,'C',2,1,'h','','🦹','N',1], tdig:['Tunnel Digger',2,'C',3,2,'','','⛏️','N',1], fence:['Black-Market Fence',3,'C',3,3,'','When it enters, draw a card.','🧳','N',2], mthief:['Master of Thieves',4,'C',4,4,'r','When it enters, discard a random card from your opponent\'s hand.','🗝️','N',2],
sbrood:['Scorpion Brood',1,'C',1,1,'h','','🦂','G',1], sstalk:['Sand Stalker',2,'C',2,2,'','','🦂','G',1], squeen:['Serket\'s Handmaiden',3,'C',2,3,'','When it enters, the opponent\'s weakest army member takes 1 damage.','🦂','G',2], sking:['Scorpion King',4,'C',4,4,'v','','👑','G',3],
shbs:['Shabti Servant',1,'C',2,1,'','','🗿','N',1], mumw:['Tomb Mummy',3,'C',3,4,'z','','🧟','N',2], embp:['Embalming Priest',2,'C',1,3,'','When it enters, restore 3 health to each of their army members.','⚱️','N',1], tguard:['Mummy King',4,'C',4,5,'','','👑','N',3],
croc:['Nile Crocodile',2,'C',2,3,'','','🐊','G',1], lurk:['Nile Lurker',2,'C',3,2,'h','','🐊','G',1], sobpr:['Priest of Sobek',3,'C',3,4,'','','🐊','G',2], sobek:['Sobek, Lord of the Waters',5,'C',5,6,'','','🐊','G',3],
jack:['Desert Jackal',1,'C',2,1,'h','','🐺','B',1], jguard:['Jackal Guard',2,'C',2,3,'','','🐺','B',1], wepw:['Wepwawet, Opener of Ways',3,'C',3,3,'r','','🐺','B',2], jpack:['Jackal Packleader',4,'C',4,4,'','When it enters, the opponent\'s weakest army member takes 2 damage.','🐺','B',2],
hekp:['Priest of Heka',1,'C',1,2,'','','🧙','B',1], snake:['Temple Cobra',2,'C',2,2,'v','','🐍','B',1], hekmag:['Magician of the Court',3,'C',2,4,'','When it enters, the opponent\'s strongest army member gets -1/-1 permanently.','🪄','B',2], hekhigh:['High Priest of Heka',4,'C',3,5,'w','','📿','B',3],
ammit:['Ammit, the Devourer',4,'C',4,5,'z','','🐊','B',3], soulw:['Wailing Soul',1,'C',1,2,'','','👻','B',1], unwor:['The Unworthy Dead',2,'C',2,3,'','','💀','B',1], hguard2:['Guardian of the Scales',3,'C',2,5,'','','⚖️','B',2],
sphinx2:['The Great Sphinx',5,'C',5,7,'','','🦁','W',3], sphg:['Sphinx Guardian',3,'C',3,4,'f','','🦁','W',2], sphs:['Desert Sentinel',2,'C',2,3,'','','🏜️','W',1],
apepx:['Apophis, the Serpent of Chaos',5,'C',5,7,'v','','🐍','B',3], apsp:['Spawn of Apophis',1,'C',2,1,'','','🐍','B',1], apcoil:['Chaos Coil',3,'C',3,4,'','','🐍','B',2],
setg:['Set, Lord of the Red Desert',5,'C',5,6,'r','','🌪️','R',3], setb:['Beast of Set',2,'C',3,2,'h','','🐗','R',1], setst:['Storm of the Desert',3,'C',3,3,'','','🌪️','R',2],
sekhg:['Sekhmet, the Eye of Ra',5,'C',5,6,'','','🦁','R',3], lion:['Lioness of Sekhmet',2,'C',2,3,'r','','🦁','R',1], plague:['Bringer of Plague',3,'C',3,3,'','When it enters, each opposing army member takes 1 damage.','🦠','R',2],
/* enemy spells (reuse existing effects) */
torch:['Torchlight',2,'S',0,0,'','Deal damage to target army member (more in later fights).','🔦','N'],
sting:['Sting of Serket',2,'S',0,0,'','Destroy target army member that has damage on it.','🦂','G'],
curse2:['Curse of the Pharaoh',2,'S',0,0,'','Target army member gets -2/-2.','🏺','B'],
drag:['Drag Below',2,'S',0,0,'','Return target army member to its owner\'s hand.','🌊','G'],
heal2:['Waters of the Nile',2,'S',0,0,'','Gain 4 life. Restore 2 health to each of their army members.','🌊','N'],
sand:['Sandstorm',3,'S',0,0,'','Deal 2 damage to each opposing army member.','🌪️','R']
});
Object.assign(SPA,{torch:'javel',sting:'hgrasp',curse2:'curse',drag:'gale',heal2:'gift',sand:'dbrth'});
Object.assign(FX,{torch:FX.javel,sting:FX.hgrasp,curse2:FX.curse,drag:FX.gale,heal2:FX.gift,sand:FX.dbrth});
TOKE.push('shabt');
/* balance: the Egyptian realm hits harder rather than lasting longer (Scorpion Brood stays at 1 power for Serket's Venom; the Tomb Robbers keep their power) */
['sstalk','squeen','sking','shbs','mumw','embp','tguard','croc','lurk','sobpr','sobek','jack','jguard','wepw','jpack','hekp','snake','hekmag','hekhigh','ammit','soulw','unwor','hguard2'].forEach(id=>{D[id][3]+=1});
['trob','serk','shab','sobk','anub','heka','ammt','sphx','apep','setx','sekh'].forEach(k=>{IV[k]=40;LORE[k]=k=='ammt'||k=='sphx'?'Elite trump':['apep','setx','sekh'].includes(k)?'Boss trump':'Opening trump'});
Object.assign(LORE,{shabt:'Servant figure',grob:'Tomb robber',tdig:'Tomb robber',fence:'Tomb robber',mthief:'Tomb robber',sbrood:'Scorpion',sstalk:'Scorpion',squeen:'Scorpion priestess',sking:'Scorpion king',shbs:'Servant figure',mumw:'Mummy',embp:'Embalmer',tguard:'Mummy king',
 croc:'Crocodile',lurk:'Crocodile',sobpr:'Priest of Sobek',sobek:'God of the Nile',jack:'Jackal',jguard:'Jackal',wepw:'Jackal god',jpack:'Jackal',hekp:'Priest',snake:'Cobra',hekmag:'Magician',hekhigh:'High priest',ammit:'The devourer',soulw:'Lost soul',unwor:'The unworthy',hguard2:'Guardian',
 sphinx2:'The riddler',sphg:'Sphinx',sphs:'Sentinel',apepx:'Serpent of chaos',apsp:'Serpent',apcoil:'Serpent',setg:'God of storms',setb:'Beast of Set',setst:'Storm',sekhg:'The Eye of Ra',lion:'Lioness',plague:'Plague-bringer',torch:'Spell',sting:'Spell',curse2:'Curse',drag:'Spell',heal2:'Blessing',sand:'Spell'});
Object.assign(ETB,{fence:s=>draw(s,1),mthief:(s,o)=>{if(o.hand.length){const c=o.hand[Math.random()*o.hand.length|0];o.hand=o.hand.filter(x=>x!==c);o.gy.push(c);log('The Master of Thieves steals '+D[c.id][0]+' from your hand.')}},
 squeen:(s,o)=>{const t=tg(o).sort((a,b)=>(th(a)-a.dmg)-(th(b)-b.dmg))[0];if(t)t.dmg+=1},embp:s=>{cr(s).forEach(c=>heal(c,3))},
 jpack:(s,o)=>{const t=tg(o).sort((a,b)=>(th(a)-a.dmg)-(th(b)-b.dmg))[0];if(t)t.dmg+=2},hekmag:(s,o)=>{const t=tg(o).sort((a,b)=>ev(b)-ev(a))[0];if(t){t.pa--;t.pd--}},plague:(s,o)=>{tg(o).forEach(c=>{c.dmg+=1})}});
function egUp(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;if(!o)return;
 if(n('trob')&&cr(s).length>cr(o).length){const it=o.bf.filter(x=>!isC(x)&&!has(x,'w'));if(it.length){const x=it[Math.random()*it.length|0];o.bf.splice(o.bf.indexOf(x),1);(s.loot=s.loot||[]).push(x);amFall();log('The Tomb Robbers steal '+D[x.id][0]+'.')}else if(o.hand.length){const x=o.hand[Math.random()*o.hand.length|0];o.hand=o.hand.filter(y=>y!==x);(s.loot=s.loot||[]).push(x);log('The Tomb Robbers steal '+D[x.id][0]+' from your hand.')}}
 if(n('heka')&&o.hand.length){const x=o.hand[Math.random()*o.hand.length|0];x.disc=(x.disc||0)-1;log('Execration: '+D[x.id][0]+' is cursed (costs 1 more).')}
 if(n('sphx')){const T=['C','S','A'];G.riddle=T[Math.random()*3|0];G.rdOk=0;log('The Sphinx asks its riddle: play '+({C:'an army member',S:'a spell',A:'an item or modifier'})[G.riddle]+' this turn, or lose 2 life.')}
 if(n('apep')){const t=cr(o).filter(x=>!x.id.startsWith('nm')).sort((a,b)=>ev(b)-ev(a))[0];if(t)thErase(t,s)}
 if(n('setx')){const t=cr(o).filter(x=>!x.part&&D[x.id][1]>=3).sort((a,b)=>ev(b)-ev(a))[0];if(t)thSunder(t,s)}
 if(n('sekh')){cr(s).forEach(c=>{c.pa++});const k=cr(s).length;if(k){s.life-=k;log('The Eye of Ra: her army grows fiercer, and her rage burns her for '+k+'.')}}}
function egDie(s,c){for(const side of [G.p,G.e]){if(!side||!side.bf)continue;if(side.bf.some(x=>x.id=='anub')){const o=oppOf(side);if(o)o.life-=1}}
 /* ammt: the weighing now lives in foes_egypt.js */
 if(s.bf.some(x=>x.id=='shab')&&!TOKE.includes(c.id)&&!c.shb&&cr(s).length<AM()){const t=mk('shabt');enter(s,t);log('A Shabti takes the place of '+D[c.id][0]+'.')}}
function egPx(c){const s=sideOf(c);if(!s)return 0;let n=0;if(!c.def&&s.bf.some(x=>x.id=='sobk')&&G.cmb&&G.cmb.atk.includes(c.u))n+=1;return n}
const egVen=c=>{if(!c||!c.u||!G||!G.e||c.def)return false;const s=sideOf(c);return!!s&&pw(c)<=1&&s.bf.some(x=>x.id=='serk')};
function sphCheck(){if(!G||!G.riddle||!G.p||!G.e||!G.e.bf.some(x=>x.id=='sphx'))return;if(!G.rdOk){G.p.life-=2;G.rdFail=(G.rdFail||0)+1;try{cr(G.e).forEach(c=>{if(c.id=='sphs'||c.id=='sphinx2'){c.pa++;c.pd++}})}catch(e){}log('You failed the riddle of the Sphinx: you lose 2 life, and the guardians grow.')}else{draw(G.p,1);log('You answer the riddle: the Sphinx keeps its bargain (you draw a card).')}G.riddle=0}
function sphPlay(c){if(G&&G.riddle){const t=D[c.id][2];if((G.riddle=='C'&&t=='C')||(G.riddle=='S'&&(t=='S'||t=='I'))||(G.riddle=='A'&&(t=='A'||t=='E')))G.rdOk=1}}

/* ===== the Egyptian realm: regular enemies, elites, bosses ===== */
CHARS.thoth={n:'Thoth',ic:'📜',
 quote:'"What is written is made real, and what is erased was never so." Thoth gave the gods their words and kept the record of every soul, and whoever holds the pen holds the world.',
 play:'Take things apart and rewrite them. Sunder army members into their Body and Spirit and take their Names, Inscribe new abilities onto your own, and Foresee the enemy\'s cards to turn their plans against them. Speak a stolen Name for 2 mana when you need it. 20 life.',
 arch:[['D','Sundered'],['I','Scribes'],['Y','Recorder']],staples:['tscr','tmedj','tsun','tscar'],pool:[],
 en:[
  {n:'The Tomb Robbers',l:15,ic:'🦹',hint:'Thieves who steal what you set down when they outnumber you',bg:['#1a1408','#a07a3a'],d:ids('grob:5,tdig:3,fence:2,mthief,torch:2,drag'),mt:'trob'},
  {n:'The Scorpions of Serket',l:21,ic:'🦂',hint:'A swarm whose smallest stingers are deadly',bg:['#1c1a08','#8a7a2a'],d:ids('sbrood:5,sstalk:3,squeen:2,sking,sting:2,curse2:2'),mt:'serk'},
  {n:'Servants of the Tomb',l:13,ic:'🗿',hint:'The dead who keep returning as Shabti servants',bg:['#14120e','#6a5e48'],d:ids('shbs:5,mumw:3,embp,tguard,curse2:2,heal2,torch:2'),mt:'shab'},
  {n:'The Crocodiles of Sobek',l:14,ic:'🐊',hint:'Ambushers who bite hardest when you attack them',bg:['#081a14','#2f6a4a'],d:ids('croc:4,lurk:3,sobpr:3,sobek,drag:2,torch:2'),mt:'sobk'},
  {n:'The Jackals of Anubis',l:13,ic:'🐺',hint:'Guides of the dead who grow stronger with every death',bg:['#0e0c0a','#4a3a2a'],d:ids('jack:4,jguard:4,wepw:2,jpack,sting:2,torch:2'),mt:'anub'},
  {n:'The Priests of Heka',l:16,ic:'🧙',hint:'Magicians whose execrations curse the cards in your hand',bg:['#120a18','#5a3a7a'],d:ids('hekp:4,snake:4,hekmag:2,hekhigh,curse2:3,heal2'),mt:'heka'}],
 bo:[],el:[]};
ELITES.push({n:'Ammit, the Devourer',l:18,ic:'🐊',hint:'She grows with every soul that falls on her side',bg:['#140808','#6a2a2a'],d:ids('ammit,soulw:5,unwor:4,hguard2:3,sting:2'),mt:'ammt'});
CHARS.thoth.el.push(ELITES.length-1);
ELITES.push({n:'The Great Sphinx',l:12,ic:'🦁',hint:'Answer its riddle each turn, or pay in blood',bg:['#1a1406','#b8944a'],d:ids('sphinx2,sphg:3,sphs:5,heal2,torch:3'),mt:'sphx'});
CHARS.thoth.el.push(ELITES.length-1);
{const b0=BOSS.length;
BOSS.push({n:'Apophis, the Serpent of Chaos',ic:'🐍',l:24,sc:[0,0,0],trump:'apep',d:ids('apepx,apsp:5,apcoil:4,curse2:2,sand:2,torch:2'),
 lore:`Every night the sun sails through the underworld, and every night Apophis rises from the dark waters to swallow it. He is not a god of evil but of unmaking, older than the names the gods gave the world. What he coils around forgets what it was. The scribes struck his name from the walls so that he could not be called. Keep what you love nameless, or watch him take it.`},
 {n:'Set, Lord of the Red Desert',ic:'🌪️',l:18,sc:[0,0,0],trump:'setx',d:ids('setg,setb:5,setst:4,sand:2,drag:2,torch:2'),
 lore:`Set murdered his brother Osiris, tore him into fourteen pieces and scattered them across Egypt. He is the god of storms, deserts and foreigners, strong enough to defend the sun from Apophis and cruel enough to betray his own blood. What he cannot rule, he breaks apart. His storms tear the soul from the body and leave both wandering. Gather your pieces quickly, before the desert takes them.`},
 {n:'Sekhmet, the Eye of Ra',ic:'☀️',l:21,sc:[0,0,0],trump:'sekh',d:ids('sekhg,lion:6,plague:4,sand:2,torch:2'),
 lore:`When humanity plotted against Ra, he tore out his eye and it became Sekhmet, the lioness who drinks blood. She slaughtered until the fields ran red, and the gods could only stop her by flooding the land with beer dyed the colour of blood. Her fury grows with every hour she fights. It burns her as fiercely as it burns her enemies. Survive the first onslaught and her own rage will undo her.`});
CHARS.thoth.bo=[b0,b0+1,b0+2]}
A2INTRO.thoth='Act II: you cross into the Two Lands of Egypt. Tomb robbers, scorpions, the jackals of Anubis and the serpent Apophis wait along the Nile.';
RLMC.thoth=['#140f06','#6a4f1c'];
