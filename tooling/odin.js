/* ===== v72: Odin and the Norse realm ===== */
const TOKE=['sold','ein'];
CO.N='#9fb4c8';CO.M='#a58bc4';CO.F='#d4642a';CO.H='#7f9a9a';
Object.assign(KWT,{u:'Bloodlust.',i:'Battle-rage.',j:'Pack.',t:'Forged.'});
Object.assign(KWL,{u:'Bloodlust: while it has damage on it, it gets +2 power.',i:'Battle-rage: while its controller is Wounded (at half life or less), it gets +2 power.',j:'Pack: it gets +1 power for each other Pack army member you control (up to +2).',t:'Forged: it gets +1/+1 for each item and modifier you control (up to +3).'});
const GLX=[[/\bbloodlust\b/i,'Bloodlust',KWL.u],[/battle-rage/i,'Battle-rage',KWL.i],[/\bwounded\b/i,'Wounded','you are Wounded while your life is half of your maximum or less (10 or less with 20 life). Wounded effects switch on and off as your life changes.'],[/\bcarve\b/i,'Carve','an additional cost: pay that much life to cast it. You cannot Carve if it would leave you with no life. Rune-Carver reduces Carve by 1.'],[/\bfallen\b|have died this fight/i,'Fallen','your army members that have died or been offered this fight. Valhalla cards count them.'],[/\bpack\b/i,'Pack',KWL.j],[/\bforged\b/i,'Forged',KWL.t]];
Object.assign(ARCH,{B:'Berserkers',V:'Valhalla',H:'Runes'});
/* ---- Odin cards ---- */
Object.assign(D,{
hird:['Hirdman',1,'C',2,1,'','','🗡️','N',1],
thrl:['Thrall',1,'C',1,3,'','','🪓','N',1],
gung:["Gungnir's Throw",2,'I',0,0,'','Deal 3 damage to target army member.','🔱','N'],
oath:['Blood Oath',1,'I',0,0,'','Carve 2. Target army member gets +3/+3 until end of turn.','🩸','N'],
/* Berserkers */
ulf:['Ulfhednar Initiate',1,'C',1,2,'u','','🐺','R',1],
bsrk:['Bear-Shirt Berserker',2,'C',2,2,'i','','🐻','R',1],
fjrd:['Fjord Raider',2,'C',3,1,'h','','🛶','R',1],
skar:['Skar the Scarred',2,'C',2,2,'u','','⚔️','R',1],
wulf:['Wolf-Coat Warrior',3,'C',3,2,'i','','🐕','R',2],
gslay:['Giant-Slayer',3,'C',3,3,'u','','🗡️','R',2],
egil:['Egil the Mad',3,'C',3,3,'iu','','🌀','R',2],
blod:['Blood-Drinker',3,'C',4,4,'','When it enters, deal 3 damage to you.','🩸','R',2],
skul:['Skull-Cleaver',4,'C',5,5,'i','','🪓','R',2],
ulfk:['Ulf, the Berserk King',4,'C',4,6,'iu','','👑','R',3],
star:['Starkad the Oathbreaker',5,'C',6,6,'ih','','⚡','R',3],
bldr:['Blood Rite',2,'S',0,0,'','Deal 2 damage to you. Draw 2 cards.','🩸','R'],
howl:['War Howl',1,'I',0,0,'','Target army member gets +2/+0 until end of turn (+3/+0 if you are Wounded).','📣','R'],
rage:['Berserkergang',3,'I',0,0,'','Your army members get +3/+0 until end of turn (+5/+0 if you are Wounded).','💢','R'],
mhall:['Mead-Hall Fury',3,'E',0,0,'','Your army members with Bloodlust or Battle-rage get +1/+1.','🍺','R'],
rend:['Skull-Splitter',4,'S',0,0,'','Deal 6 damage to target army member. Deal 2 damage to you.','🔨','R'],
/* Valhalla */
thegn:['Thegn of the Hall',1,'C',1,2,'','When it dies, draw a card.','🛡️','W',1],
shmd:['Shield-Maiden',2,'C',1,3,'','When it dies, gain 2 life.','🛡️','W',1],
einw:['Einherjar Warrior',2,'C',2,2,'','When it dies, deal 1 damage to each opposing army member.','⚔️','W',1],
skld:['Skald of the Fallen',2,'C',1,2,'','Each time another army member of yours dies, it gets +1/+1 permanently.','🎶','W',1],
valk:['Valkyrie',3,'C',2,2,'f','Gets +1/+1 for every 2 of your army members that have died this fight.','🦅','W',2],
eir:['Eir the Healer',3,'C',2,4,'','When it dies, gain 4 life.','💚','W',2],
huscl:['Housecarl',3,'C',3,3,'','When it dies, deal 3 damage to the opponent.','🛡️','W',2],
jarl:['The Fallen Jarl',3,'C',3,5,'','When it dies, return another random army member from your graveyard to your hand.','⚰️','W',3],
brynh:['Brynhild, the Shield-Maiden',4,'C',3,4,'fd','','🛡️','W',3],
sigur:['Sigurd the Dragon-Slayer',4,'C',4,5,'z','','🐉','W',3],
ghall:['Hall of the Slain',2,'E',0,0,'','Each time one of your army members dies, deal 1 damage to the opponent and gain 1 life (only while you are Wounded).','🏛️','W'],
vfea:['Feast of Heroes',4,'S',0,0,'','Return the most expensive army member in your graveyard to your army. It gets +1/+1 permanently.','🍖','W'],
host:['Host of Valhalla',4,'S',0,0,'','Create a 3/3 Einherjar for every 2 of your army members that have died this fight (at least 1, up to 3).','🌌','W'],
ofr:['Pyre of Heroes',1,'S',0,0,'','Offer one of your army members. Gain 3 life and draw 2 cards.','🔥','W'],
vmar:['Marshal the Dead',2,'I',0,0,'','Your army members get +1/+1 until end of turn for each of your army members that has died (up to +3).','📯','W'],
ein:['Einherjar',0,'C',3,3,'','Token.','⚔️','W',1],
/* Runes and Ravens */
hugi:['Huginn, Raven of Thought',2,'C',1,2,'f','When it enters, draw a card.','🐦','U',1],
muni:['Muninn, Raven of Memory',2,'C',1,2,'f','When it dies, draw a card.','🐦','U',1],
skal:['Skaldic Bard',2,'C',1,3,'','When it enters, gain 3 life.','🎵','U',1],
rser:['Rune-Carver',2,'C',1,3,'','Your Carve costs are reduced by 1.','🪨','U',1],
fylg:['Fylgja, Guardian Spirit',3,'C',2,5,'fw','','👻','U',2],
hrav:['Hrafnagud, the Raven-God',4,'C',3,4,'f','When it enters, draw a card.','🐦','U',3],
ruru:['Uruz, Rune of Strength',1,'E',0,0,'','Carve 3. Your army members get +1/+0.','🪨','U'],
alg:['Algiz, Rune of Protection',1,'E',0,0,'','Carve 2. Your army members get +0/+2.','🪨','U'],
fehu:['Fehu, Rune of Wealth',1,'E',0,0,'','Carve 3. At the start of your turn, gain 1 mana.','🪨','U'],
reir:['Rune of Eir',1,'A',0,0,'','Carve 2. Tap: gain 1 life (only while you are Wounded).','🪨','U'],
mimr:["Mimir's Well",1,'E',0,0,'','At the start of your turn, draw a card. Deal 1 damage to you unless you are Wounded.','⛲','U'],
rfly:['Raven Banner',4,'A',0,0,'','Your flying army members get +1/+1.','🚩','U'],
gald:['Galdr of Winds',1,'I',0,0,'',"Carve 1. Return target army member to its owner's hand.",'🌬️','U'],
seid:['Seidr Hex',2,'S',0,0,'','Carve 1. Target army member gets -3/-3 permanently.','🔮','U'],
ygg:['Yggdrasil, the World-Tree',4,'E',0,0,'','Carve 2. Your army members get +1/+2. At the start of your turn, gain 1 life (only while you are Wounded).','🌳','U'],
norn:['The Norns',5,'S',0,0,'','Draw 3 cards. Gain 4 life.','🧵','U'],
tiwa:['Tiwaz, Rune of Victory',2,'A',0,0,'','Carve 1. Tap: deal 1 damage to target opposing army member.','🪨','U'],
/* Neutral */
slei:['Sleipnir',4,'C',4,3,'fh','','🐴','N',3],
mjol:['Mjolnir',4,'A',0,0,'','Tap: deal 2 damage to target opposing army member.','🔨','N'],
thor:['Thor, the Thunderer',5,'C',6,5,'','When it enters, deal 3 damage to target opposing army member.','⚡','N',3],
loki:["Loki's Snare",2,'I',0,0,'',"Tap target army member; it doesn't untap next turn.",'🕸️','N'],
tyr:['Tyr, the One-Handed',3,'C',3,4,'w','','🐺','N',2],
idun:["Idunn's Apples",3,'A',0,0,'','At the start of your turn, restore 1 health to each of your army members.','🍎','N'],
hela:["Hel's Embrace",3,'S',0,0,'','Destroy target army member that has damage on it.','💀','N'],
vlnd:['Volund the Smith',3,'C',2,4,'','When it enters, destroy target opposing item or modifier.','⚒️','N',1]
});
Object.assign(D,{
sprm:['Spear-Marked Thrall',1,'C',1,2,'u','When it enters, deal 1 damage to it.','🩸','R',1],
gash:['Spear-Gash',1,'I',0,0,'','Deal 2 damage to target army member you control. It gets +2/+2 until end of turn.','🩸','R'],
hamr:['Hamramr the Shape-Shifter',3,'C',2,3,'','While you are Wounded, it gets +2/+2.','🐻','R',2],
lstd:['Last Stand of the Doomed',2,'I',0,0,'','Your army members get +2/+2 until end of turn (+3/+3 if you are Wounded).','⚔️','R'],
scav:['Battlefield Scavenger',2,'C',2,2,'','Each time another army member of yours dies, deal 1 damage to the opponent.','🪶','W',1],
stdb:['Standard-Bearer',2,'C',1,2,'','When it dies, your other army members get +1/+1 permanently.','🚩','W',1],
slst:['Slain-Strike',2,'S',0,0,'','Deal damage to target army member equal to the number of your army members that have died this fight (at least 2, up to 6).','🗡️','W'],
gunn:['Gunnar, Hall-Warden',4,'C',3,4,'','When it enters, create a 3/3 Einherjar.','🏰','W',2],
bald:['Baldr the Beautiful',4,'C',4,5,'','When it dies, return up to 2 random army members from your graveyard to your army.','☀️','W',3],
ansu:['Ansuz, Rune of Speech',1,'E',0,0,'','Carve 1. At the start of your turn, if you have 2 or fewer cards in hand, draw a card.','🪨','U'],
volv:['The Volva',3,'C',1,4,'','When it enters, draw 2 cards and deal 2 damage to you.','🔮','U',2],
hagl:['Hagalaz, Rune of Hail',3,'S',0,0,'','Carve 1. Deal 2 damage to each opposing army member.','🧊','U']
});
Object.assign(D,{
roar:['Roar of the Wolf-Coats',3,'I',0,0,'','Tap all opposing army members.','📣','R'],
hguard:['Hall-Guard of Valhalla',3,'C',2,3,'','When it dies, create a 3/3 Einherjar.','🛡️','W',2],
scrb:['Rune-Scribe',2,'C',1,3,'','When it enters, draw a card for each Rune you control (up to 2).','📜','U',1],
odn:['Odin, the Allfather',5,'C',3,5,'f','When it enters, draw 2 cards and deal 2 damage to you.','👁️','N',3],
mead:['Mead of Poetry',1,'S',0,0,'','Draw a card. If you are Wounded, draw 2 instead.','🍯','N']
});
Object.assign(LORE,{roar:'Battle-cry',hguard:'Hall guardian',scrb:'Rune-scribe',odn:'The Allfather',sprm:'Marked for battle',hamr:'Skin-changer',scav:'Battlefield scavenger',stdb:'Warband standard-bearer',gunn:'Hall-warden',bald:'The fallen light',volv:'Seeress'});
Object.assign(LORE,{hird:'Norse warrior',thrl:'Norse bondsman',ulf:'Wolf-warrior',bsrk:'Bear-warrior',fjrd:'Norse raider',skar:'Scarred veteran',wulf:'Wolf-warrior',gslay:'Giant-hunter',egil:'Mad warrior',blod:'Blood-mad warrior',skul:'Norse champion',ulfk:'Berserk king',star:'Legendary berserker',thegn:'Hall retainer',shmd:'Norse shield-maiden',einw:'Slain hero',skld:'Norse poet',valk:'Chooser of the slain',eir:'Goddess of healing',huscl:'Norse bodyguard',jarl:'Fallen lord',brynh:'Valkyrie queen',sigur:'Legendary hero',ein:'Hero of Valhalla',hugi:'Odin\'s raven',muni:'Odin\'s raven',skal:'Norse poet',rser:'Rune-master',fylg:'Guardian spirit',hrav:'Raven spirit',slei:'Eight-legged steed',thor:'God of thunder',tyr:'God of war',vlnd:'Master smith',
pup:'Wolf pup',wolf:'Great wolf',hati:'Moon wolf',skoll:'Sun wolf',fenr:'Monstrous wolf',ithrl:'Frost spirit',rimew:'Giantess',hgnt:'Mountain giant',fgnt:'Frost giant',ymir:'Primordial giant',dmin:'Dwarf',dsmith:'Dwarf',dxbow:'Dwarf archer',brokk:'Dwarf master smith',golem:'Iron construct',lrav:'Trickster\'s raven',imp:'Trickster spirit',skinw:'Shapechanger',lokis:'Trickster god',ember:'Fire spirit',fraid:'Fire raider',lava:'Lava beast',mgnt:'Fire giant',surtr:'Lord of fire',draug:'Restless corpse',draug2:'Restless corpse',wight:'Barrow-wight',hgrd:'Guardian of Hel',nidh:'Dragon of the dead',hel:'Queen of Niflheim'});
const RARX={C:'scrb mead sprm stdb hird thrl oath ulf bsrk fjrd wulf gslay bldr howl thegn shmd einw huscl ofr hugi muni skal reir gald vlnd',U:'hguard gash hamr scav slst ansu volv gung skar egil skul rage mhall skld valk eir ghall vmar rser fylg ruru alg rfly seid tiwa loki idun hela',R:'roar lstd gunn hagl ulfk blod rend jarl sigur vfea host hrav fehu mimr norn slei mjol tyr',L:'odn bald star brynh ygg thor'};
for(const r in RARX)RARX[r].split(' ').forEach(x=>RAR[x]=r);
const TAGX={B:'roar sprm gash hamr lstd ulf bsrk fjrd skar wulf gslay egil blod skul ulfk star bldr howl rage mhall rend',V:'hguard scav stdb slst gunn bald thegn shmd einw skld valk eir huscl jarl brynh sigur ghall vfea host ofr vmar',H:'scrb ansu volv hagl hugi muni skal rser fylg hrav ruru alg fehu reir mimr rfly gald seid ygg norn tiwa'};
for(const t in TAGX)TAGX[t].split(' ').forEach(x=>TAG[x]=t);
Object.assign(UPS,{mead:n=>`Draw ${1+n} (${2+n} if Wounded)`,gash:n=>`+${2+n}/+${2+n}`,lstd:n=>`+${2+n}/+${2+n} (+${3+n} if Wounded)`,slst:n=>`Deals ${2+n} to ${6+n}`,hagl:n=>`Deals ${2+n} to each`,mhall:n=>`+${1+n}/+${1+n}`,ruru:n=>`+${1+n}/+0`,alg:n=>`+0/+${2+n}`,ygg:n=>`+${1+n}/+${2+n}`,rfly:n=>`+${1+n}/+${1+n}`,gung:n=>`Deals ${3+n} damage`,oath:n=>`+${3+n}/+${3+n}`,howl:n=>`+${2+n}/+0 (+${3+n} if Wounded)`,rage:n=>`+${3+n}/+0 (+${5+n} if Wounded)`,rend:n=>`Deals ${6+n} damage`,seid:n=>`-${3+n}/-${3+n}`,norn:n=>`Draw 3, gain ${4+2*n} life`,ofr:n=>`Gain ${3+n} life`,vmar:n=>`+${1+n} per fallen (max +${3+n})`});
/* ---- engine hooks ---- */
const ENTD={sprm:(s,c)=>{c.dmg=1}};
const wnd=s=>!!s&&s.life*2<=s.max;
function px(c){const s=sideOf(c);if(!s)return 0;let n=0;
 if(c.dmg>0&&has(c,'u'))n+=2;
 if(has(c,'i')&&wnd(s))n+=2;
 if(has(c,'j'))n+=Math.min(2,cr(s).filter(x=>x!==c&&has(x,'j')).length);
 if(c.id=='valk')n+=Math.floor((s.fl||0)/2);
 if(c.id=='hamr'&&wnd(s))n+=2;
 return n+omg(c,'ruru')+omg(c,'ygg')}
function tx(c){const s=sideOf(c);if(!s)return 0;let n=0;
 if(c.id=='valk')n+=Math.floor((s.fl||0)/2);
 if(c.id=='hamr'&&wnd(s))n+=2;
 const a=omg(c,'alg');if(a)n+=1+a;const y=omg(c,'ygg');if(y)n+=1+y;return n}
function au2(c){const s=sideOf(c);if(!s)return 0;let n=0;
 if(has(c,'u')||has(c,'i'))n+=omg(c,'mhall');
 if(has(c,'j'))n+=omg(c,'pbn');
 if(has(c,'c'))n+=omg(c,'winter');
 if(has(c,'t'))n+=Math.min(3,s.bf.filter(x=>!isC(x)).length)+omg(c,'anvl');
 if(has(c,'f'))n+=omg(c,'rfly');
 return n}
function onDie(s,c){const sc=s.bf.filter(x=>x.id=='scav'&&x!==c).length;if(sc){oppOf(s).life-=sc;log('Scavengers feast: '+sc+' damage to the opponent.')}cr(s).filter(x=>x.id=='skld'&&x!==c).forEach(x=>{x.pa++;x.pd++});const g=s.bf.filter(x=>x.id=='ghall').length;if(g){s.life+=hcap(s,g);oppOf(s).life-=g;log('The Hall of the Slain strikes for '+g+'.')}}
const jarlFx=(s,o,c)=>{const g=s.gy.filter(x=>x!==c&&isC(x)&&!TOKE.includes(x.id));if(g.length){const x=g[Math.random()*g.length|0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;s.hand.push(x);log('The Fallen Jarl calls '+D[x.id][0]+' back to its owner\'s hand.')}};
Object.assign(DEATH,{thegn:{p:2,fn:s=>draw(s,1)},muni:{p:2,fn:s=>draw(s,1)},shmd:{p:1,fn:s=>{s.life+=2}},eir:{p:1,fn:s=>{s.life+=4}},einw:{p:3,fn:(s,o)=>{tg(o).forEach(c=>{c.dmg+=1});log('The Einherjar\'s last blow cuts the opposing army.')}},huscl:{p:3,fn:(s,o)=>{o.life-=3;log('The Housecarl\'s last blow strikes for 3.')}},jarl:{p:3,fn:jarlFx},hguard:{p:2,fn:s=>{if(cr(s).length<5)enter(s,mk('ein'))}},stdb:{p:2,fn:s=>{cr(s).forEach(c=>{c.pa++;c.pd++});log('The standard rallies the army: +1/+1.')}},bald:{p:3,fn:s=>{for(let i=0;i<2&&cr(s).length<5;i++){const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)&&x.id!='bald');if(!g.length)break;const x=g[Math.random()*g.length|0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;enter(s,x);log('Baldr\'s light returns '+D[x.id][0]+'.')}}}});
Object.assign(ETB,{skal:s=>{s.life+=3},hugi:s=>draw(s,1),hrav:s=>draw(s,1),scrb:s=>{const n=Math.min(2,s.bf.filter(x=>LC[x.id]).length);if(n)draw(s,n)},odn:s=>{draw(s,2);s.life-=2;log('Odin pays in blood for knowledge: you lose 2 life.')},volv:s=>{draw(s,2);s.life-=2;log('The Volva sees far: you lose 2 life.')},gunn:s=>{if(cr(s).length<5)enter(s,mk('ein'))},blod:s=>{s.life-=3;log('Blood-Drinker drinks deep: you lose 3 life.')}});
PEND.thor={who:'e',ok:T=>isC(T),fn:T=>{T.dmg+=3},has:(s,o)=>cr(o).length>0,m:"Thor: click an opposing army member to deal 3 damage to it."};
PEND.vlnd={...PEND.sapper,m:"Volund: click an opposing item or modifier to destroy it."};
Object.assign(FX,{
gung:(s,o,t)=>{t.dmg+=3+mg()},
oath:(s,o,t)=>{t.ta+=3+mg();t.td+=3+mg()},
bldr:s=>{s.life-=2;draw(s,2)},
howl:(s,o,t)=>{t.ta+=(wnd(s)?3:2)+mg()},
rage:s=>{const n=(wnd(s)?5:3)+mg();cr(s).forEach(c=>{c.ta+=n})},
rend:(s,o,t)=>{t.dmg+=6+mg();s.life-=2},
ofr:(s,o,t)=>{offer(s,t);s.life+=3+mg();draw(s,2)},
vmar:s=>{const n=Math.min(3,s.fl||0)+mg();cr(s).forEach(c=>{c.ta+=n;c.td+=n})},
vfea:s=>{if(cr(s).length>=5){log('The army is full.');return}let j=-1,bc=-1;for(let i=s.gy.length-1;i>=0;i--){const x=s.gy[i];if(isC(x)&&!TOKE.includes(x.id)&&D[x.id][1]>bc){bc=D[x.id][1];j=i}}if(j<0){log('No one in the graveyard answers the call.');return}const c=s.gy.splice(j,1)[0];enter(s,c);c.pa+=1+mg();c.pd+=1+mg();log(D[c.id][0]+' returns from Valhalla, stronger.')},
host:s=>{const n=Math.max(1,Math.min(3,Math.floor((s.fl||0)/2)+mg()));let k=0;for(let i=0;i<n&&cr(s).length<5;i++){enter(s,mk('ein'));k++}log('Valhalla opens: '+k+' Einherjar join the battle.')},
gald:(s,o,t)=>bounce(t),roar:(s,o)=>{cr(o).forEach(c=>{c.tap=1});log('The roar freezes the enemy line.')},mead:s=>{draw(s,(wnd(s)?2:1)+mg())},gash:(s,o,t)=>{t.dmg+=2;t.ta+=2+mg();t.td+=2+mg()},lstd:s=>{const n=(wnd(s)?3:2)+mg();cr(s).forEach(c=>{c.ta+=n;c.td+=n})},slst:(s,o,t)=>{t.dmg+=Math.max(2,Math.min(6,s.fl||0))+mg()},hagl:(s,o)=>{tg(o).forEach(c=>{c.dmg+=2+mg()})},
seid:(s,o,t)=>{t.pa-=3+mg();t.pd-=3+mg()},
norn:s=>{draw(s,3);s.life+=4+2*mg()},
loki:(s,o,t)=>{t.tap=1;t.frz=1},
hela:(s,o,t)=>{const z=sideOf(t);if(z)destroyIt(z,t)}
});
Object.assign(TS,{gung:'c',oath:'c',howl:'c',rend:'c',gald:'c',seid:'c',loki:'c',hela:'d',ofr:'pc',gash:'pc',slst:'c'});TSM.d='Choose an army member that has damage on it.';
const LC={oath:2,ruru:3,alg:2,fehu:3,reir:2,gald:1,seid:1,ygg:2,tiwa:1,ansu:1,hagl:1};
const lcost=c=>{const b=LC[c.id]||0;return b?Math.max(0,b-((G&&G.p&&G.p.bf.some(x=>x.id=='rser'))?1:0)):0};
const TAPA={reir:{fn:s=>{s.life+=hcap(s,1);log('The Rune of Eir restores 1 life.')}},tiwa:{dmg:1},mjol:{dmg:2}};
const hcap=(s,n)=>Math.max(0,Math.min(n,Math.floor(s.max/2)-s.life));const BPMAX=1,BPB=1;const bpc=()=>BPB+((G.e&&G.e.bpn)||0)+1;
function bloodPrice(){const p=G.p;if(G.ch!='odin'||!['main','blockP','dmgP'].includes(G.phase))return;if((p.bp||0)>=BPMAX)return msg('Blood price: at most '+BPMAX+' per turn.');const c=bpc();if(p.life<=c)return msg('You cannot spare any more life.');p.life-=c;G.e.bpn=(G.e.bpn||0)+1;p.mana+=1;p.bp=(p.bp||0)+1;log('Blood price: you pay '+c+' life for 1 mana.');chk();render()}
const bpBtn=()=>G.ch=='odin'&&G.p?`<button class="b" data-b="bp" title="Pay ${bpc()} life to gain 1 mana (the price rises each time this fight) (up to ${BPMAX} times per turn)"${(G.p.bp||0)>=BPMAX||G.p.life<=bpc()?' disabled':''}>Blood price ${bpc()}❤→◆ (${G.p.bp||0}/${BPMAX})</button>`:'';
function upk2(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;
 if(n('fehu')){s.mana+=n('fehu');log('Fehu grants extra mana.')}
 if(n('drpn')){s.mana+=n('drpn');log('Draupnir grants extra mana.')}
 if(n('ansu')&&s.hand.length<=2){draw(s,n('ansu'));log('Ansuz whispers: you draw a card.')}
 if(n('mimr')){if(!wnd(s))s.life-=n('mimr');draw(s,n('mimr'));log("Mimir's Well: a card, at a cost in blood.")}
 if(n('ygg')){s.life+=hcap(s,n('ygg'));log('Yggdrasil restores 1 life.')}
 if(n('idun')&&cr(s).some(c=>c.dmg>0)){cr(s).forEach(c=>heal(c,n('idun')));log("Idunn's Apples mend the army.")}}
/* ---- Norse opponents ---- */
Object.assign(D,{
pup:['Wolf Pup',1,'C',1,2,'j','','🐺','B',1],
wolf:['Grey Wolf',2,'C',2,3,'j','','🐺','B',1],
hati:['Hati, the Moon-Chaser',3,'C',3,4,'ja','','🌙','B',2],
skoll:['Skoll, the Sun-Chaser',3,'C',3,3,'jh','','☀️','B',2],
fenr:['Fenrir, the Unbound',5,'C',6,6,'jb','','🐺','B',4],
pbn:['Pack Banner',2,'E',0,0,'','Your Pack army members get +1/+1.','🚩','B'],
maul:['Maul',3,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','🦷','B'],
ithrl:['Frost Thrall',1,'C',2,3,'','','🥶','U',1],
rimew:['Rime-Witch',2,'C',2,3,'','When it enters, tap target army member.','❄️','U',1],
hgnt:['Hill Giant',2,'C',3,5,'c','','🏔️','U',2],
fgnt:['Frost Giant',3,'C',5,6,'cx','','🧊','U',3],
ymir:['Ymir, Father of Giants',4,'C',7,8,'cz','','🏔️','U',4],
winter:['Fimbulwinter',2,'E',0,0,'','Your Giants get +1/+1. Opposing army members enter tapped.','🌨️','U'],
icesp:['Ice Spear',2,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','🧊','U'],
dmin:['Dwarf Miner',1,'C',1,2,'t','','⛏️','A',1],
dsmith:['Dwarf Smith',2,'C',1,3,'t','','🔨','A',1],
dxbow:['Dwarf Crossbowman',2,'C',2,2,'ta','','🏹','A',1],
brokk:['Brokkr, the Master Smith',3,'C',2,4,'t','When it enters, draw a card.','⚒️','A',2],
golem:['Iron Golem',4,'C',3,6,'tz','','🗿','A',3],
anvl:['Anvil of Eitri',2,'A',0,0,'','Your Forged army members get +1/+1.','⚒️','A'],
dshld:['Dwarf-Forged Shield',3,'A',0,0,'','Your Forged army members have Resilient.','🛡️','A'],
drpn:['Draupnir, Ring of Gold',4,'A',0,0,'','At the start of your turn, gain 1 extra mana.','💍','A'],
dbolt:['Dwarven Bolt',3,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','🔩','A'],
lrav:["Loki's Raven",2,'C',1,2,'f','When it enters, draw a card.','🐦','M',1],
imp:['Sly Imp',2,'C',2,2,'','','😈','M',1],
skinw:['Skin-Changer',3,'C',3,3,'',"When it enters, return the strongest opposing army member to its owner's hand.",'🎭','M',2],
lokis:['Loki, the Shapeshifter',5,'C',4,5,'',"When it enters, return the strongest opposing army member to its owner's hand and draw a card.",'🎭','M',3],
lsnare:["Loki's Trick",2,'S',0,0,'',"Tap target army member; it doesn't untap next turn.",'🕸️','M'],
lcurse:["Loki's Mischief",2,'S',0,0,'','Target army member gets -2/-2 permanently (more in later fights).','🃏','M'],
lgale:['Wind of Mischief',2,'S',0,0,'',"Return target army member to its owner's hand.",'🌬️','M'],
lokib:['Barbed Words',3,'S',0,0,'','Deal 3 damage to target army member (more in later fights).','🗯️','M'],
ember:['Ember Sprite',1,'C',2,1,'h','','🔥','F',1],
fraid:['Flame Raider',2,'C',3,2,'h','','🔥','F',1],
lava:['Lava Hound',2,'C',2,3,'r','','🌋','F',1],
mgnt:['Muspel Giant',3,'C',4,4,'r','','🌋','F',2],
surtr:['Surtr, Lord of Muspelheim',4,'C',5,5,'rh','','🔥','F',4],
fbolt:['Searing Bolt',2,'S',0,0,'','Deal 3 damage to the opposing player (more in later fights).','🔥','F'],
mspear:['Molten Spear',2,'S',0,0,'','Deal 3 damage to target army member (more in later fights).','🌋','F'],
draug:['Draugr',1,'C',1,3,'','When it dies, return it to your hand as a Risen Draugr.','🧟','H',1],
draug2:['Risen Draugr',1,'C',1,3,'','','🧟','H',1],
wight:['Barrow-Wight',2,'C',2,2,'d','','🧟','H',1],
hgrd:['Hel-Guard',2,'C',2,4,'z','','🛡️','H',1],
nidh:['Nidhogg, the Corpse-Gnawer',4,'C',4,5,'dv','','🐉','H',3],
hel:['Hel, Queen of the Dead',4,'C',3,6,'dz','When it enters, return a random army member from your graveyard to your army.','👑','H',3],
hgrasp:['Grasp of the Grave',2,'S',0,0,'','Destroy target army member that has damage on it.','💀','H']
});
Object.assign(SPA,{maul:'hurl',icesp:'hurl',dbolt:'hurl',lokib:'javel',lcurse:'curse',lsnare:'honey',lgale:'gale'});
Object.assign(FX,{maul:FX.hurl,icesp:FX.hurl,dbolt:FX.hurl,lokib:FX.javel,lcurse:FX.curse,lsnare:FX.honey,lgale:FX.gale});
Object.assign(ETB,{rimew:ETB.priest,brokk:s=>draw(s,1),lrav:ETB.herm,skinw:(s,o)=>{const t=best(tg(o));if(t){log('The Skin-Changer sends '+D[t.id][0]+' back to its owner\'s hand.');bounce(t)}},lokis:(s,o)=>{const t=best(tg(o));if(t){log('Loki sends '+D[t.id][0]+' back to its owner\'s hand.');bounce(t)}draw(s,1)}});
Object.assign(ETBV,{rimew:1.5,brokk:1.5,lrav:1.5,skinw:3,lokis:4});
Object.assign(SPA,{mspear:'javel'});
Object.assign(FX,{mspear:FX.javel,fbolt:(s,o)=>{const n=3+xb(s);o.life-=n;log((s==G.p?'You burn ':s.nm+' burns ')+(o==G.p?'you':o.nm)+' for '+n+'.')},hgrasp:FX.hela});
Object.assign(ETB,{hel:s=>{if(cr(s).length>=5)return;const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)&&x.id!='hel');if(!g.length)return;const x=g[Math.random()*g.length|0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;enter(s,x);log('Hel calls '+D[x.id][0]+' back from the dead.')}});
Object.assign(ETBV,{hel:3});
Object.assign(DEATH,{draug:{p:2,fn:(s,o,c)=>{const i=s.gy.indexOf(c);if(i>=0)s.gy.splice(i,1);const n=mk('draug2');n.sick=1;s.hand.push(n);log('The Draugr claws its way back to its owner\'s hand.')}}});
Object.assign(IV,{pbn:6,winter:7,anvl:6,dshld:6,drpn:8});
const NOR=[
{n:'Fenrir\'s Brood',l:15,ic:'🐺',hint:'A pack that grows stronger together',bg:['#160c0c','#6a3a30'],d:ids('pup:3,wolf:4,hati,skoll,fenr,pbn,maul')},
{n:'The Jotnar',l:15,ic:'🏔️',hint:'Huge frost giants and endless winter',bg:['#0b1622','#4f87ad'],d:ids('ithrl:3,rimew:2,hgnt:2,fgnt:2,ymir,winter,icesp')},
{n:'The Dwarven Forge',l:15,ic:'⚒️',hint:'Items and modifiers that forge their army',bg:['#1a1309','#8a6a2a'],d:ids('dmin:2,dsmith:3,dxbow:3,brokk,golem,anvl,dshld,drpn,dbolt:2')},
{n:'Muspelheim',l:15,ic:'🔥',hint:'Fire giants and burning blades: a race against your life',bg:['#240a05','#d4642a'],d:ids('ember:3,fraid:3,lava:2,mgnt:2,surtr,fbolt:3,mspear')},
{n:"Hel's Legion",l:15,ic:'💀',hint:'The restless dead drain and refuse to stay down',bg:['#0c1214','#7f9a9a'],d:ids('draug:4,wight:3,hgrd:3,nidh,hel,hgrasp:2')},
{n:"Loki's Court",l:15,ic:'🎭',hint:'Bounce, tap and trickery',bg:['#150c20','#7a4a9a'],d:ids('lrav:2,imp:3,skinw:2,lokis,lsnare,lcurse,lgale:2,lokib:2')}];
/* ---- characters ---- */
const CHARS={
ody:{n:'Odysseus',ic:'⚓',quote:'"Tell me, Muse, of the man of twists and turns." The cunning king of Ithaca devised the Trojan Horse, then spent ten years and a hundred hardships fighting his way home to Penelope.',play:'Offer cheap bodies for mana to trade up into bigger threats. His three archetypes are built to work together: Phalanx walls hold the line while Raiders strike, and Offerings turn fallen and sacrificed army members into mana, cards and damage. The best runs blend all three. 20 life.',arch:[['P','Phalanx'],['R','Raiders'],['O','Offerings']],staples:STAPLES.slice(),pool:POOL.slice(),en:EN.slice()},
odin:{n:'Odin',ic:'👁️',quote:'"Nine nights I hung from the windswept tree, wounded by my own spear, given to Odin, myself to myself." The Allfather gave an eye and hung from Yggdrasil to learn the runes.',play:'Life is a resource. Pay life for 1 mana (once per turn; costs 2, 3, 4... as the fight goes on) and grow stronger when you are Wounded. Berserkers hit hardest when hurt, Valhalla turns the fallen into a mighty host, and Runes carve permanent power at a cost in blood. A few cards heal, but never enough to be safe. 20 life.',arch:[['B','Berserkers'],['V','Valhalla'],['H','Runes']],staples:'hird thrl gung oath'.split(' '),pool:'ulf bsrk fjrd skar wulf gslay egil blod skul ulfk star bldr howl rage mhall rend thegn shmd einw skld valk eir huscl jarl brynh sigur ghall vfea host ofr vmar hugi muni skal rser fylg hrav ruru alg fehu reir mimr rfly gald seid ygg norn tiwa slei mjol thor loki tyr idun hela vlnd karma roar hguard scrb odn mead sprm gash hamr lstd scav stdb slst gunn bald ansu volv hagl'.split(' '),en:NOR}};
let CH='ody';
function setChar(k){if(!CHARS[k])k='ody';CH=k;const c=CHARS[k];STAPLES.length=0;STAPLES.push(...c.staples);POOL.length=0;POOL.push(...c.pool);EN.length=0;EN.push(...c.en)}
const CHN=()=>(CHARS[(G&&G.ch)||CH]||CHARS.ody).n;
function renderChar(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
const cv=G.cv&&CHARS[G.cv]?G.cv:'ody',C=CHARS[cv];
const all=[...new Set([...C.staples,...C.pool])].map(id=>mk(id)).sort((a,b)=>(RSO[RAR[a.id]]||0)-(RSO[RAR[b.id]]||0)||D[a.id][1]-D[b.id][1]||(TAG[a.id]||'~').localeCompare(TAG[b.id]||'~')||D[a.id][0].localeCompare(D[b.id][0]));
const stc=C.staples.map(id=>mk(id)),lib=G.lib?`<div class="ov" style="background:#0b1820"><div class="ovb"><div class="ovt">${G.lib==2?C.n+' starts every run with these '+stc.length+' cards':C.n+': every card that can appear in your draft ('+all.length+'), sorted by rarity, then cost'}</div><div class="lib">${(G.lib==2?stc:all).map(c=>card(c,'v:'+c.u)).join('')}</div><button class="b" data-b="okl">Close</button></div></div>`:'';
const boxes=Object.keys(CHARS).map(k=>{const c=CHARS[k];return`<div style="border:2px solid #d8b45a;border-radius:14px;padding:18px 22px;background:#0008;width:min(400px,86vw);box-sizing:border-box;text-align:center"><div style="font-size:48px">${c.ic}</div><div class="ovt" style="font-size:26px">${c.n}</div><div class="dsub" style="margin:6px 0 8px;font-style:italic">${c.quote}</div><div class="dsub" style="margin:0 0 12px"><b>Playstyle:</b> ${c.play}</div><button class="b" data-b="startcards:${k}">Starting cards</button> <button class="b" data-b="fullib:${k}">See full library</button> <button class="b" data-b="pick:${k}">Choose ${c.n}</button></div>`}).join('');
document.getElementById('app').innerHTML=`<div class="dft" style="gap:20px"><div style="font-size:clamp(30px,8vw,76px);font-weight:700;letter-spacing:.08em;color:var(--gold);text-shadow:0 0 24px var(--gl),0 3px 0 #000a;line-height:1;text-align:center">MYTHOLOGICA</div><div class="ovt" style="font-size:24px">Choose your character</div>${savedInfo()}<div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-items:stretch;margin:10px 0">${boxes}</div></div>${lib}`}
