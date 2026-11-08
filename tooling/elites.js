/* ===== v82: elite fights ===== */
Object.assign(D,{
cup:['Circe\'s Cup',1,'E',0,0,'w','Ward. At the start of her turn, if you have no Swine, your strongest untapped army member that costs 3 or more (not a token) is turned into a Swine (1/1), and each Fawning Wolf and Mountain Lion she controls gets +1/+1 for the rest of the fight. When the Swine dies, is offered or leaves play, the original returns to your hand and costs 1 less to play.','🍷','G'],
swine:['Swine',0,'C',1,1,'','Turned by Circe\'s cup. When it dies or leaves play, the original army member returns to your hand and costs 1 less to play.','🐖','G',1],
cwolf:['Fawning Wolf',2,'C',3,2,'r','','🐺','G',1],
clion:['Mountain Lion of Aeaea',3,'C',4,4,'r','','🦁','G',2],
cmaid:['Handmaid of Circe',1,'C',1,3,'','When it enters, restore 2 health to each of your army members.','🌿','G',1],
circe:['Circe, Daughter of Helios',4,'C',3,5,'z','When it enters, tap the strongest opposing army member; it doesn\'t untap next turn.','🧙‍♀️','G',3],
cwand:['Circe\'s Wand',2,'S',0,0,'','Tap target army member; it doesn\'t untap next turn.','🪄','G'],
cdraft:['Draught of Forgetting',3,'S',0,0,'','Target army member gets -2/-2.','🧪','G'],
sacril:['The Sun God\'s Tally',0,'E',0,0,'w','Ward.','☀️','F'],
cow:['Sacred Cow',1,'C',0,4,'k','Sacred: when it dies, the Sun God\'s tally grows (unless its owner offers it).','🐄','F',1],
bull:['Bull of Helios',3,'C',1,7,'k','Sacred: when it dies, the Sun God\'s tally grows (unless its owner offers it).','🐂','F',2],
lamp:['Lampetia, the Shining',3,'C',3,3,'f','','🌞','F',2],
neith:['Phaethusa, the Radiant',2,'C',3,3,'f','','🌅','F',1],
helios:['Helios, the Sun',4,'C',5,5,'f','','☀️','F',3],
scorch:['Sun-Scorch',3,'S',0,0,'','Deal damage to target army member (opposing casters add more as the run goes on).','🔆','F'],
fate:['The Well of Urd',1,'E',0,0,'w','Ward.','🌳','U'],
foretold:['Foretold Fate',0,'E',0,0,'w','','🔮','U'],
urd:['Urd, Keeper of the Past',3,'C',2,4,'','When it enters, return a random army member from your graveyard to your hand.','🕰️','U',2],
verd:['Verdandi, Weaver of the Present',2,'C',2,3,'a','When it enters, tap the strongest opposing army member.','🧵','U',1],
skuld:['Skuld, Maiden of the Future',4,'C',3,5,'z','When it enters, draw a card.','🔮','U',3],
nspin:['Thread-Spinner',1,'C',1,3,'','','🧶','U',1],
nward:['Well-Warden',2,'C',1,5,'k','','🛡️','U',1],
nwarr:['Doomed Warrior',2,'C',3,3,'r','','⚔️','U',1],
ndoom:['Doom Decree',3,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','📜','U'],
ncut:['Cut the Thread',2,'S',0,0,'','Target army member gets -2/-2.','✂️','U'],
hoard:['The Hoard of Andvari',1,'E',0,0,'w','Ward.','💰','A'],
fafn:['Fáfnir, the Hoard-Dragon',4,'C',4,5,'rvz','Gets +1/+1 for each Gold in the Hoard.','🐲','A',3],
fgrd:['Hoard-Guard',1,'C',1,2,'','','🪙','A',1],
fworm:['Lindworm',2,'C',3,2,'r','','🐍','A',1],
regin:['Regin, the Smith',3,'C',3,4,'','When it enters, draw a card.','⚒️','A',2],
dbrth:['Dragon\'s Breath',4,'S',0,0,'','Deal 2 damage to each opposing army member.','🔥','A'],
fspit:['Venom Spit',2,'S',0,0,'','Deal damage to target army member (opposing casters add more as the run goes on).','🧪','A']
});
Object.assign(LORE,{cup:'Elite trump',sacril:'Elite trump',fate:'Elite trump',hoard:'Elite trump',swine:'Token',foretold:'Foretold',cow:'Sacred herd',bull:'Sacred herd'});
MT.push('cup','sacril','fate','hoard');
Object.assign(IV,{cup:40,sacril:40,fate:40,hoard:40});
D.sacril[1]=0;
TOKE.push('swine');
Object.assign(SPA,{cwand:'honey',cdraft:'curse',scorch:'hurl',ndoom:'hurl',ncut:'curse',fspit:'hurl'});
Object.assign(FX,{cwand:FX.honey,cdraft:FX.curse,scorch:FX.hurl,ndoom:FX.hurl,ncut:FX.curse,fspit:FX.hurl,dbrth:(s,o)=>{tg(o).forEach(c=>{c.dmg+=2});log('Dragon\'s Breath scorches the opposing army.')}});
Object.assign(ETB,{cmaid:s=>{cr(s).forEach(c=>heal(c,2))},circe:(s,o)=>{const t=best(tg(o).filter(x=>!x.tap))||best(tg(o));if(t){t.tap=1;t.frz=1;log('Circe\'s glance stills '+D[t.id][0]+'.')}},verd:(s,o)=>{const t=best(tg(o).filter(x=>!x.tap));if(t){t.tap=1;log('Verdandi ties '+D[t.id][0]+' to the present.')}},skuld:s=>draw(s,1),regin:s=>draw(s,1),
 urd:s=>{const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id));if(!g.length)return;const x=g[Math.random()*g.length|0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;s.hand.push(x);log('Urd draws '+D[x.id][0]+' back from the past.')}});
Object.assign(ETBV,{cmaid:1,circe:3,verd:1.5,skuld:2,regin:1.5,urd:2});
/* --- cattle: sacrilege tally and atonement --- */
const sacTrump=s=>s.bf.find(x=>x.id=='sacril');
function sacrilege(s){const t=sacTrump(s);if(!t)return;t.k=(t.k||0)+1;log('Sacrilege! The Sun God\'s tally grows to '+t.k+'.')}
Object.assign(DEATH,{cow:{p:2,fn:s=>sacrilege(s)},bull:{p:2,fn:s=>sacrilege(s)}});
function atoneHook(s,c){if(s!==G.p||!isC(c)||!G.e||!G.e.bf)return;const t=sacTrump(G.e);if(t&&(t.k||0)>0){t.k--;log('Your offering atones: the Sun God\'s tally falls to '+t.k+'.')}}
/* --- Circe --- */
function circeStart(){const e=G.e,p=G.p;if(!e||!e.bf.some(x=>x.id=='cup')||p.bf.some(x=>x.id=='swine'))return;const L=tg(p).filter(c=>!c.tap&&D[c.id][1]>=3&&!TOKE.includes(c.id)).sort((a,b)=>ev(b)-ev(a));const t=L[0];if(!t)return;const sw=mk('swine');sw.orig=t;sw.sick=t.sick;sw.tap=0;sw.def=t.def;p.bf[p.bf.indexOf(t)]=sw;log('Circe\'s cup turns '+D[t.id][0]+' into a Swine!');cr(e).filter(c=>c.id=='cwolf'||c.id=='clion').forEach(c=>{c.pa++;c.pd++});sweep()}
function swineBack(s,c){if(!c.orig)return;const o=c.orig;c.orig=0;Object.assign(o,{tap:0,dmg:0,def:0,att:0,sw:0,sick:1,frz:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,forced:0,disc:1});s.hand.push(o);log(D[o.id][0]+' is restored and returns to '+(s===G.p?'your':'its')+' hand.')}
/* --- Norns --- */
function foretell(){const e=G.e;if(!e||!e.bf.some(x=>x.id=='fate')||e.fore||!e.hand.length)return;const L=e.hand.filter(c=>D[c.id][1]>=2&&(D[c.id][2]!='C'||cr(e).length<AM())).sort((a,b)=>D[b.id][1]-D[a.id][1]);const c=L[0];if(!c)return;e.hand=e.hand.filter(x=>x!==c);e.fore=c;const ph=mk('foretold');ph.fc=c;e.bf.push(ph);log('The Norns foretell '+D[c.id][0]+': it will be played free at the start of their next turn.');return c}
function foreIn(){const e=G.e;if(!e||!e.fore)return;const c=e.fore;e.fore=0;e.bf=e.bf.filter(x=>x.id!='foretold');c.free=1;c.fcome=1;e.hand.push(c);log('The foretold '+D[c.id][0]+' comes to pass.')}
/* --- Fafnir --- */
const goldN=s=>{const h=s.bf.find(x=>x.id=='hoard');return h?(h.g||0):0};
function hoardAdd(e,pl){if(!isC(pl))return;const h=e.bf.find(x=>x.id=='hoard');if(h&&(h.g||0)<3){h.g=(h.g||0)+1;log('Gold glitters in the Hoard of Andvari ('+h.g+'/3).')}}
/* --- upkeep hook (owner s, opponent o) --- */
function eliteUp(s,o){const t=sacTrump(s);if(t&&(t.k||0)>0&&o){o.life-=t.k;log('Helios burns '+(o==G.p?'you':o.nm)+' for '+t.k+'.')}}
/* --- live card text --- */
const DYN={
 sacril:c=>'Ward. Sacred cattle are the herd of Helios. Whenever one dies (not offered by their owner), a Sacrilege counter is added. At the start of their turn, Helios burns you for 1 per counter. Offering one of your army members removes a counter. <b>Counters: '+(c.k||0)+'</b>',
 hoard:c=>'Ward. Whenever they play an army member, a Gold is added (up to 3). Fáfnir gets +1/+1 for each Gold. <b>Gold: '+(c.g||0)+'/3</b>',
 fate:c=>'Ward. At the end of their turn, they foretell the most expensive card in their hand that they could play (cost 2 or more): it is shown to you, set aside face up, and played free at the start of their next turn, before anything else.',
 foretold:c=>{if(!c.fc)return'';const d=D[c.fc.id],t=DYN[c.fc.id]?DYN[c.fc.id](c.fc):(TXT[c.fc.id]||d[6]||'');return'<b>'+d[0]+'</b> (cost '+d[1]+')'+(d[2]=='C'?' '+c.fc.a+'/'+c.fc.d:'')+'. '+t+' Played free at the start of their next turn, before anything else.'}
};
{const _w=whNote;whNote=function(){let t='';const e=G&&G.e;if(e&&e.bf){const s=sacTrump(e);if(s)t+=' ☀️ Sacrilege: '+(s.k||0)+(s.k?' (Helios burns you for '+s.k+' next turn; offering an army member atones).':'.');const f=e.bf.find(x=>x.id=='foretold');if(f&&f.fc)t+=' 🔮 Foretold: '+D[f.fc.id][0]+'.';const h=e.bf.find(x=>x.id=='hoard');if(h)t+=' 💰 Gold: '+(h.g||0)+'/3.'}return _w()+t}}
Object.assign(DYN,{
 hurl:c=>'Deal '+(4+xb(G&&G.e))+' damage to target army member.',ndoom:c=>'Deal '+(4+xb(G&&G.e))+' damage to target army member.',scorch:c=>'Deal '+(4+xb(G&&G.e))+' damage to target army member.',fspit:c=>'Deal '+(4+xb(G&&G.e))+' damage to target army member.',
 javel:c=>'Deal '+(3+xb(G&&G.e))+' damage to target army member.',
 ncut:c=>'Target army member gets -'+(2+xb(G&&G.e))+'/-'+(2+xb(G&&G.e))+'.'
});
function fo(o){return o>=100?ELITES[o-100]:EN[o]}
const ELITES=[
{n:'Circe, Witch of Aeaea',l:17,ic:'🐖',hint:'Her cup turns your strongest army member that costs 3 or more into a Swine. Offer the Swine, or let it die, and the original returns to your hand for 1 less mana',bg:['#160d1c','#7a4a8a'],d:ids('cwolf:2,clion:2,cmaid:3,circe,cwand:2,cdraft:2'),mt:'cup'},
{n:'Cattle of the Sun',l:18,ic:'🐂',hint:'Killing the sacred herd brings Helios\' wrath. Offer your own army members to atone; flyers pass over the cattle',bg:['#241606','#d19a2a'],d:ids('cow:4,bull:2,lamp:2,neith:2,helios,scorch:2'),mt:'sacril'},
{n:'The Norns',l:13,ic:'🔮',hint:'Each turn they foretell their costliest card, and it is played free next turn. Plan around what is coming',bg:['#0b1222','#5c7fb0'],d:ids('urd,verd:2,skuld,nspin:4,nwarr:1,ndoom:1'),mt:'fate'},
{n:'Fáfnir, the Hoard-Dragon',l:21,ic:'🐲',hint:'Every army member he plays adds Gold to the Hoard, and the Dragon grows with it. Kill the Dragon before the Hoard fills',bg:['#1a1405','#b38a1d'],d:ids('fafn,fgrd:4,fworm:3,regin:2,dbrth,fspit:2'),mt:'hoard'}];
CHARS.ody.el=[0,1];CHARS.odin.el=[2,3];

/* --- cross-realm balance: adjustments when a realm's enemies face the other character (player:realm) --- */
const XADJ={'ody:odin':[0,-1,0],'odin:ody':[5,1,0],'odin:wukong':[6,0,0],'ody:wukong':[-2,0,0],'wukong:odin':[-3,0,0],'wukong:ody':[4,0,0]};
SCL.push([0,0,0],[3,0,0],[6,0,0],[8,1,0]);/* Act 2 (other realm) proxy table: bot data show +1 power costs ~15 points, +3 life ~4 */
function realmOf(f){for(const k of Object.keys(CHARS)){const C=CHARS[k];if(C.en.includes(f)||(C.el||[]).some(i=>ELITES[i]===f))return k}return''}
function xAdj(f){const c=(G&&G.ch)||CH,r=realmOf(f);return r&&r!==c?XADJ[c+':'+r]:0}
