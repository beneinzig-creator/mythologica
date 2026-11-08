/* ===== v80: Odin's bosses: Jormungandr, the Wild Hunt, Hrungnir ===== */
const HUNT=['hhnd','hrdr','hwld','hmst'];
let QK=[];
const duelOn=()=>!!(G&&G.e&&G.e.bf&&G.e.bf.some(x=>x.id=='holm'));
const AM=()=>duelOn()?2:5;
const qB=(t,src)=>(t&&t.qy&&src&&HUNT.includes(src.id))?3:0;
const RWORD=()=>((G&&G.ch)||'ody')=='odin'?'the Nine Worlds':'the strait';
const RWC=()=>RWORD().replace(/^t/,'T');
const SAGA=()=>((G&&G.ch)||'ody')=='odin'?'The saga of Ragnarok':'The Odyssey';
Object.assign(D,{
jsnk:['Sea-Snake',1,'C',1,3,'v','','🐍','U',1],
jcrw:['Brine-Wyrm',3,'C',3,5,'z','','🐉','U',2],
jorm:['Jörmungandr, the World Serpent',5,'C',6,9,'vz','When it rises, it is tapped. It swallows the opposing army member that costs the most (4 or more).','🐍','U',3],
jbck:['The Deep Takes Back',2,'S',0,0,'',"Return target army member to its owner's hand.",'🌊','U'],
jgrp:['Drowning Grip',2,'S',0,0,'',"Tap target army member; it doesn't untap next turn.",'🌀','U'],
jspt:['Venom Spray',3,'S',0,0,'','Deal 3 damage to target army member (more in later fights).','☠️','U'],
ouro:['Ouroboros',0,'E',0,0,'w','Ward. Whenever you attack, the attacking army member with the highest cost (3 or more) that survives returns to your hand after combat.','♾️','U'],
hhnd:['Hel-Hound',1,'C',2,1,'h','','🐕','N',1],
hrdr:['Phantom Rider',2,'C',3,2,'f','','👻','N',1],
hwld:['Wild Huntsman',2,'C',3,3,'','','🏇','N',1],
hmst:['Huntmaster of the Gandreid',3,'C',4,4,'fh','','🌩️','N',2],
hhrn:['Horn of the Hunt',1,'S',0,0,'',"Tap target army member; it doesn't untap next turn.",'📯','N'],
hhbt:["Hunter's Spear",2,'S',0,0,'','Deal 3 damage to target army member (more in later fights).','🏹','N'],
hunt:['The Wild Hunt',0,'E',0,0,'w','Ward. At the start of its turn, the Hunt marks your strongest army member as the Quarry. Hunt riders deal 3 extra damage to the Quarry. A rider that kills the Quarry gets +1/+1 for the rest of the fight, and the Hunt draws a card.','🌩️','N'],
htrl:['Rock-Troll',2,'C',3,3,'','','🪨','A',1],
hgrt:['Gravel-Giant',3,'C',4,4,'','','🪨','A',2],
hrung:['Hrungnir, the Stone-Hearted',4,'C',5,6,'z','Stone shield: takes 2 less combat damage from army members that do not fly.','🗿','A',3],
hmokk:['Mökkurkálfi, the Clay Giant',4,'C',3,8,'k','Clay: takes 2 extra combat damage. It can only defend.','🏺','A',2],
hwhet:['Whetstone',3,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','🪨','A'],
hmead:["Giant's Mead",2,'S',0,0,'','Gain 4 life. Restore 2 health to each of your army members.','🍺','A'],
holm:['The Holmgang',0,'E',0,0,'w','Ward. A duel: each side may have only 2 army members in play (one to attack, one to defend), and may attack with only one and block with only one.','⚔️','A']
});
Object.assign(LORE,{jsnk:'Child of the serpent',jcrw:'Sea beast',jorm:'The World Serpent',ouro:'Boss trump',hhnd:'Hound of the Hunt',hrdr:'Pale rider',hwld:'Rider of the Hunt',hmst:'Leader of the Wild Hunt',hunt:'Boss trump',htrl:'Hill giant',hgrt:'Hill giant',hrung:'Strongest of the giants',hmokk:'Giant of clay',holm:'Boss trump'});
Object.assign(SPA,{jbck:'gale',jgrp:'honey',jspt:'javel',hhrn:'honey',hhbt:'javel',hwhet:'hurl',hmead:'gift'});
Object.assign(FX,{jbck:FX.gale,jgrp:FX.honey,jspt:FX.javel,hhrn:FX.honey,hhbt:FX.javel,hwhet:FX.hurl,hmead:FX.gift});
Object.assign(ETBV,{jorm:4});
ETB.jorm=(s,o)=>{const L=cr(o).filter(x=>D[x.id][1]>=4&&!has(x,'w')).sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));if(!L.length)return;const t=L[0];log('Jörmungandr rises and swallows '+D[t.id][0]+'!');t.dmg=th(t)+9;t.vn=1};
ENTD.jorm=(s,c)=>{c.tap=1};
/* Quarry (the Wild Hunt) */
function markQ(){const e=G.e,p=G.p;cr(p).forEach(c=>{c.qy=0});if(!e||!e.bf.some(x=>x.id=='hunt'))return;const Q=best(cr(p));if(Q){Q.qy=1;log('The Wild Hunt marks '+D[Q.id][0]+' as its Quarry.')}}
function qRew(){const L=QK;QK=[];const done=new Set();for(const[t,src]of L){if(done.has(t.u))continue;if([G.p,G.e].some(s=>s.bf.includes(t)))continue;if(!G.e.bf.includes(src))continue;done.add(t.u);src.pa++;src.pd++;draw(G.e,1);log('The Hunt has its Quarry: '+D[src.id][0]+' grows stronger and the Hunt draws a card.')}}
function dAdj(t,n,src){let d=0;if(t.id=='hrung'&&!has(src,'f'))d-=Math.min(n,2);if(t.id=='hmokk')d+=2;if(t.qy&&src&&HUNT.includes(src.id))d+=3;return d}
/* Ouroboros (Jormungandr) */
function coil(c){if(!c||c.side!='p'||!G.e||!G.e.bf.some(x=>x.id=='ouro'))return;const L=c.atk.map(u=>G.p.bf.find(x=>x.u==u)).filter(x=>x&&isC(x)&&D[x.id][1]>=3);if(!L.length)return;L.sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));const t=L[0];log('The coil of the World Serpent carries '+D[t.id][0]+' back to shore.');bounce(t)}
BOSS.push(
{n:'Jörmungandr, the World Serpent',ic:'🐍',l:22,sc:[0,0,0],trump:'ouro',d:ids('jsnk:4,jcrw:3,jorm,jbck:2,jgrp:2,jspt'),
 lore:`Before the first ship was launched, the Allfather cast a child into the sea, and the sea grew round it until it circled the world with its tail in its jaws. Nothing in the deep is in a hurry, and what you raise against the serpent is lifted by the tide and carried back to shore, the greatest weapons first. No small hook has ever tempted it, but when Thor went fishing with an ox's head for bait, it rose and swallowed the finest thing within reach. For one breath it hung above the water with its throat bare, and the Thunderer's hammer was already raised. Cheap hooks it ignores, so bring a bait worth the swallowing and a blow ready for the moment it surfaces.`},
{n:'The Wild Hunt',ic:'🌩️',l:22,sc:[0,0,0],trump:'hunt',d:ids('hhnd:2,hrdr:2,hwld,hmst,hhrn:2,hhbt'),
 lore:`When the Allfather walks the world as the Wanderer, the Wild Hunt rides without its master, a storm of horns, hounds and pale riders loosed across the winter sky. It does not chase the herd; it names the tallest of them, and the whole night turns toward that single name. Once the horn has sounded, the hunted is pinned in place, and what is pinned does not run, it falls. Every kill feeds the riders, who return from each hunt faster and hungrier than before. The old huntsmen of the north said that no man outruns the Hunt, but he who hides among lesser men may be passed over.`},
{n:'Hrungnir, the Stone-Hearted',ic:'🗿',l:24,sc:[0,0,0],mp:3,trump:'holm',d:ids('hrung,hmokk,htrl:3,hgrt:2,hwhet,hmead'),
 lore:`Hrungnir, mightiest of the giants, rode drunk into Asgard and swore that he would carry off Freyja and sink Valhalla into the sea. The gods did not storm his hall; they named a place and an hour and offered him a duel, one champion against one. The giants raised a champion of clay nine leagues tall to stand beside him, but it was given only a mare's heart, and it shook as the thunder came near. Hrungnir had a head of stone, a heart of stone and a shield of stone, and he stood upon that shield because he had been told his enemy would strike from below. Thor came down out of the clouds instead.`});
BOSS[0].lore=`Son of Priam and the last wall of Ilium, Hector never struck first; he stood before the gates among his spearmen and made every Greek pay a toll for each man he sent against them. For ten years the Achaeans learned that Troy cost more to attack with many hands than with few. Old Priam and the women of the city tended the wounded behind the line, so a slow siege only gave them time to mend. No storm ever took those walls; they fell to a single gift, wheeled in through the gate while the guards slept. They called him tamer of horses, and it was a horse that ended his city.`;
BOSS[1].lore=`High in a cave above the strait waits Scylla, six long necks and six hungry heads, each with three rows of teeth crowded as a hound's. Circe warned Odysseus that no armor answers her and that to stand and fight is to lose the whole ship. Every blow that lands on a crew costs it a sailor, and the heads always seize the weakest man first. "Better to lose six than all," said the sorceress, and a crew with a few poor men to spare may yet sail on. Her heads are many but each one is small and easily cut, and only the ones that reach the deck do harm.`;
BOSS[2].lore=`Beneath the great fig tree on the far rock, Charybdis drinks the sea three times each day and spews it back three times. Whatever the water holds, ship, oar and man alike, is dragged down and flung up again where it began. Odysseus clung to the fig tree and waited, for she gives back what she swallows, and only the patient recover what they lost. Not even Poseidon could pull a ship from her grasp once the third hour had come. So do not pour everything you own into one tide, and remember that she turns on a rhythm you can count.`;
CHARS.ody.bo=[0,1,2];CHARS.odin.bo=[3,4,5];
try{const st=document.createElement('style');st.textContent='.cd.qry{outline:3px solid #ff5a3c;outline-offset:2px;box-shadow:0 0 18px 4px #ff5a3caa}.cd.qry::after{content:"🎯";position:absolute;top:4px;right:6px;font-size:22px;filter:drop-shadow(0 0 4px #000)}';document.head.appendChild(st)}catch(e){}
