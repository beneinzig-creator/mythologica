/* ===== v83: Sun Wukong ===== */
const WTN={st:'Strike',tr:'Trick',lp:'Leap'};
const WT={};
const WDIS=['whair','wpeach','wwine','wsomer'];
Object.assign(ARCH,{C:'Clones',W:'Staff',T:'Trickster'});
Object.assign(D,{
/* --- starting cards --- */
wmonk:['Mountain Monkey',1,'C',1,2,'','When it enters, draw a card.','🐒','W',1],
wdart:['Hair Dart',0,'I',0,0,'','Deal 1 damage to target opposing army member or the opponent.','🪶','R'],
wrod:['Iron Rod',1,'S',0,0,'','Deal 2 damage to target opposing army member or the opponent.','🦯','R'],
wstep:['Cloud Step',0,'I',0,0,'','Return target army member you control to your hand.','☁️','W'],
/* --- Clones --- */
wpluck:['Pluck a Hair',1,'S',0,0,'','Shuffle 2 Spare Hairs into your deck. Draw a card.','🪶','U'],
wvolley:['Hair Volley',1,'S',0,0,'','Deal damage to target opposing army member equal to half the cards you have played this turn (rounded down, at least 1).','🌾','R'],
whstorm:['Hair Storm',2,'S',0,0,'','Deal 1 damage to each opposing army member (2 damage if your Momentum is 3 or more).','🌪️','R'],
wclone:['Clone of the Great Sage',1,'C',1,1,'h','When it dies, shuffle a Spare Hair into your deck.','🐵','R',1],
wthou:['A Thousand Hairs',2,'S',0,0,'','Shuffle 4 Spare Hairs into your deck. Draw 2 cards.','✨','U'],
wcloudh:['Hair Whirl',1,'S',0,0,'','Draw a card for every 2 cards you have played this turn (at least 1).','🌀','U'],
wmirror:['Mirror Hair',1,'S',0,0,'','The next spell you cast this turn is cast twice.','🪞','U'],
wacro:['Acrobat Monkey',2,'C',1,2,'','Gets +1/+0 until end of turn each time your Momentum rises.','🤸','W',1],
/* --- Staff --- */
wspin:['Staff Spin',2,'S',0,0,'','Deal damage to target opposing army member equal to your Momentum plus 1.','🌀','R'],
wgrow:['Grow Tall',1,'S',0,0,'','Target army member you control gets +X/+0 until end of turn, where X is your Momentum (at least 1).','📏','R'],
wruyi:['Ruyi Jingu Bang',2,'E',0,0,'','Whenever you play your 3rd, 6th or 9th card in a turn, the Staff strikes the opponent for damage equal to your Momentum.','🦯','R'],
wsplit:['Heaven-Splitting Blow',2,'S',0,0,'','Deal damage to the opponent equal to your Momentum plus half the cards you have played this turn (rounded down).','⚡','R'],
wsmash:['Staff Smash',2,'S',0,0,'','Deal 2 damage to target opposing army member and 1 damage to each other opposing army member.','💥','R'],
wking:['Sun Wukong, the Great Sage',3,'C',3,4,'h','Gets +1/+1 until end of turn each time your Momentum rises.','🐲','R',3],
wcloudr:['Somersault Strike',1,'S',0,0,'','Target army member you control gets +1/+0 and cannot be blocked this turn.','🌥️','W'],
wsent:['Monkey Sentry',2,'C',1,4,'k','','🙈','R',1],
wpierce:['Fire-Eyed Gaze',2,'S',0,0,'','Deal 3 damage to target opposing army member.','👁️','R'],
wflurry:['Flurry of Blows',1,'S',0,0,'','Deal damage to the opponent equal to half the cards you have played this turn (rounded down, at least 1).','🥋','R'],
wrout:['Rout the Heavenly Host',2,'S',0,0,'','Deal 1 damage to each opposing army member, plus 1 more for every 3 cards you have played this turn.','🏯','R'],
wblock:['Whirling Staff',1,'I',0,0,'','Target army member you control gets +X/+X until end of turn, where X is your Momentum (at least 1).','🌀','R'],
/* --- Trickster --- */
wpocket:['Shrink to a Needle',1,'S',0,0,'',"Return target army member you control to your hand. It costs 1 less to play this time.",'🪡','W'],
wsomer:['Cloud Somersault',2,'S',0,0,'','Shuffle your graveyard into your deck, then draw a card. Disintegrate.','☁️','W'],
wchange:['Seventy-Two Changes',2,'S',0,0,'','Shuffle 2 copies of the card you played just before this one into your deck. The copies Disintegrate when played.','🎭','U'],
wxform:['Transformation',2,'S',0,0,'','Target army member you control becomes a copy of the opposing army member that costs the most.','🦎','U'],
wheist:['Heavenly Heist',2,'S',0,0,'','Put a copy of the top card of the opponent\'s library into your hand. It costs 1 less and Disintegrates.','🍑','U'],
wpeachc:['Peaches of Immortality',2,'S',0,0,'','Shuffle 3 Peaches into your deck.','🍑','U'],
wfurn:['Eight-Trigram Furnace',1,'S',0,0,'','Shuffle target army member you control into your deck. It gets +1/+1 for the rest of the fight.','🔥','U'],
wledger:['Erased from the Ledger',1,'S',0,0,'','Target army member you control: when it dies or is offered this fight, it is shuffled into your deck instead. Draw a card.','📜','U'],
wmount:['Five Elements Mountain',2,'S',0,0,'','Shuffle 3 Weights of the Mountain into the opponent\'s library. They are useless cards.','⛰️','U'],
wsix:['Six-Eared Macaque',2,'C',1,1,'','When it enters, it becomes a copy of the opposing army member that costs the most among those costing 4 or less.','🐒','U',1],
wdrink:['Stolen Elixir',1,'S',0,0,'','Gain 3 life. Draw a card (2 cards if your Momentum is 3 or more).','🍶','U'],
wdance:['Dancing Away',1,'I',0,0,'','Tap target opposing army member.','💃','W'],
wfan:['Banana-Leaf Fan',2,'S',0,0,'','Return all opposing army members to their owner\'s hand.','🍃','W'],
/* --- order cards and neutrals --- */
wfeint:['Feint',0,'S',0,0,'','Draw a card. If the card you played just before this one was a Strike, draw another card.','🎯','U'],
wslip:['Slip Away',0,'S',0,0,'','Draw a card. If the card you played just before this one was a Trick, gain 1 mana.','💨','W'],
wcounter:['Counter-Strike',0,'S',0,0,'','Deal 1 damage to target opposing army member (3 damage if the card you played just before this one was a Leap).','🗡️','R'],
wcycle:['Full Circle',0,'S',0,0,'','If you have played a Strike, a Trick and a Leap this turn (including this card), deal 4 damage to the opponent.','☯️','R'],
wdodge:['Quick Dodge',0,'I',0,0,'','Target army member you control gets +0/+3 until end of turn.','🛡️','W'],
wpig:['Zhu Bajie, the Pig',2,'C',3,3,'','','🐗','R',2],
wwine:['Heavenly Wine',0,'S',0,0,'','Draw a card. Disintegrate.','🍶','U'],
/* --- expansion --- */
wtypes:['Three Forms',1,'S',0,0,'','Deal damage to target opposing army member equal to the number of different types (Strike, Trick, Leap) you have played this turn.','👤','R'],
wtroop:['Hair-Born Troop',2,'C',1,2,'','When it enters, shuffle a Spare Hair into your deck.','🐵','U',1],
worchard:['Orchard Raid',1,'S',0,0,'','Shuffle a Peach into your deck for every 2 cards you have played this turn (at least 1).','🍑','U'],
wfoot:['Nimble Footwork',0,'S',0,0,'','If you have played 3 or more cards this turn (including this one), gain 1 mana.','👣','W'],
wmyriad:['Myriad Staffs',2,'S',0,0,'','Deal damage to the opponent and to each opposing army member equal to half your Momentum (rounded up, at least 1).','🎋','R'],
wwind:['Windborne Monkey',1,'C',1,1,'f','When it enters, if your Momentum is 2 or more, draw a card.','🪁','W',1],
wseal:['Five-Finger Seal',2,'S',0,0,'','Tap target opposing army member. It does not untap during their next untap step.','🖐️','U'],
waugury:['Peach-Pit Augury',0,'S',0,0,'','Draw a card. Draw another if the top card of your library is a Spare Hair or a Peach.','🔮','U'],
wecho:['Afterimage',1,'S',0,0,'','Cast the effect of the card you played just before this one again, if it was an untargeted spell costing 1 or less.','🌫️','U'],
wtang:['Tang Sanzang, the Pilgrim',2,'C',1,3,'','Whenever you play the 3rd card of a turn, draw a card.','🧘','R',1],
/* --- tokens and statuses --- */
whair:['Spare Hair',0,'S',0,0,'','Deal 1 damage to target opposing army member or the opponent. Disintegrate.','🪶','R'],
wpeach:['Peach of Immortality',0,'S',0,0,'','Gain 1 mana. Draw a card. Disintegrate.','🍑','U'],
wwt:['Weight of the Mountain',9,'S',0,0,'','A crushing weight. It cannot be cast.','⛰️','B']
});
/* type tags */
[['st','wdart wrod wvolley whstorm wclone wspin wgrow wruyi wsplit wsmash wking wcloudr wpierce wflurry wrout wblock wcounter wcycle wpig whair wtypes wmyriad'],
 ['tr','wpluck wthou wcloudh wmirror wsent wchange wxform wheist wpeachc wfurn wledger wmount wsix wdrink wfeint wwine wpeach wtroop worchard waugury wseal wtang'],
 ['lp','wmonk wstep wacro wpocket wsomer wdance wfan wslip wdodge wfoot wwind wecho']].forEach(([t,s])=>s.split(' ').forEach(x=>WT[x]=t));
{const sub={wmonk:'Monkey',wclone:'Clone',wacro:'Monkey',wking:'Monkey king',wsent:'Monkey',wsix:'Impostor',wtroop:'Monkey',wwind:'Monkey',wtang:'Pilgrim',wpig:'Pilgrim',whair:'Token',wpeach:'Token',wwt:'Status',wruyi:'Staff'};
 for(const id in WT)LORE[id]=WTN[WT[id]]+' · '+(sub[id]||TY[D[id][2]])}
LORE.wwt='Status';
/* rarity, archetypes, ratings */
{const R={C:'wmonk wdart wrod wsomer wstep wpluck wvolley wclone wacro wspin wgrow wsent wpierce wblock wdrink wdance wfeint wslip wcounter wdodge wwine wfoot waugury',U:'whstorm wcloudh wmirror wsmash wcloudr wflurry wpocket wchange wpeachc wfurn wledger wpig wtroop worchard wwind wecho wseal',R:'wthou wruyi wsplit wrout wxform wheist wmount wsix wfan wcycle wmyriad wtang wtypes',L:'wking'};
 for(const r in R)R[r].split(' ').forEach(x=>RAR[x]=r);
 const T={C:'wpluck wvolley whstorm wclone wthou wcloudh wmirror wacro wfeint wwine wtroop worchard waugury',W:'wtypes wmyriad wspin wgrow wruyi wsplit wsmash wking wcloudr wsent wpierce wflurry wrout wblock wcounter wdodge wpig',T:'wpocket wsomer wchange wxform wheist wpeachc wfurn wledger wmount wsix wdrink wdance wfan wslip wcycle wfoot wwind wseal wecho wtang'};
 for(const t in T)T[t].split(' ').forEach(x=>TAG[x]=t)}
/* keyword tooltips */
GLX.push([/\bdisintegrate[ds]?\b/i,'Disintegrate','After it is played, it is removed from the game for the rest of the fight instead of going to your graveyard. Cloud Somersault and other graveyard effects cannot bring it back.'],[/\bmomentum\b/i,'Momentum','Rises by 1 each time you play a card of a different type (Strike, Trick or Leap) than the card you played just before it. It resets at the start of each of your turns.']);
/* targeting */
Object.assign(TS,{wdart:'xf',whair:'xf',wrod:'xf',wvolley:'x',wspin:'x',wpierce:'x',wsmash:'x',wcounter:'x',wdance:'x',wgrow:'pc',wcloudr:'pc',wblock:'pc',wdodge:'pc',wtypes:'x',wseal:'x',wstep:'pc',wpocket:'pc',wxform:'pc',wfurn:'pc',wledger:'pc'});
TSM.x='Choose an opposing army member.';TSM.xf='Choose an opposing army member, or click the opponent\'s life.';
function wkHit(o,t,n){if(t==='ef'){o.life-=n;log('The opponent takes '+n+' damage.')}else t.dmg+=n}
/* helpers */
var WKD=0;const wkDraw=()=>G.ch=='wukong'?WKD:0;
const wkMo=s=>s.mo||0,wkCp=s=>s.cp||0;
function wkShuffle(s,id,n,o){for(let i=0;i<n;i++){const c=mk(id);if(o)Object.assign(c,o);s.deck.splice(Math.random()*(s.deck.length+1)|0,0,c)}}
function wkMom(p){cr(p).forEach(c=>{if(c.id=='wacro')c.ta++;if(c.id=='wking'){c.ta++;c.td++}})}
function wkPlay(p,c){p.cp=(p.cp||0)+1;p.pid=p.lid||'';p.lid=c.id;p.pl=p.lt||'';let t=WT[c.id];if(t==='any'){const oo=['st','tr','lp'].filter(x=>x!==p.lt);t=oo.find(x=>!(p.tys&&p.tys[x]))||oo[0]}
 if(D[c.id][2]=='C')p.ep=G.turn;
 if(t){p.tys=p.tys||{};p.tys[t]=1;if(t!==p.lt){p.mo=(p.mo||0)+1;wkMom(p)}p.lt=t}
 if(p.cp===3&&p.bf.some(x=>x.id=='wtang'))draw(p,1);
 if(p.cp%3===0&&p.bf.some(x=>x.id=='wruyi')){const d=Math.max(1,p.mo||0);G.e.life-=d;log('The Ruyi Jingu Bang strikes for '+d+'.')}}
function wkUp(s){if(s!==G.p)return;s.cp=0;s.mo=0;s.lt='';s.pl='';s.pid='';s.lid='';s.tys={};s.mir=0;cr(s).forEach(c=>{c.ub=0});if(s.bf.some(x=>x.id=='wtree')){s.life+=2;wkShuffle(s,'wpeach',1);log('The Peach Tree blooms: you gain 2 life.')}}
function wkCopy(t,src){const n=mk(src.id);t.id=n.id;t.a=n.a+(t.rec?t.rec.a:0);t.d=n.d+(t.rec?t.rec.d:0);t.f=n.f;t.pa=t.pd=t.ta=t.td=0;t.vn=0;t.def=has(t,'k')?1:0}
function fxRun(p,c,t){
 if(G.e.bf.some(x=>x.id=='gourd')&&t&&typeof t=='object'&&G.e.bf.includes(t)&&p.gt!==G.turn){p.gt=G.turn;log('The Gourd of Names swallows '+D[c.id][0]+'!');return}
 FX[c.id](p,G.e,t);
 if(p.mir&&c.id!='wmirror'){p.mir=0;log('Mirror Hair: it is cast again!');FX[c.id](p,G.e,t)}}
function wkBar(){const p=G.p;if(!p||G.ch!='wukong')return'';return`<span class="cn" title="Momentum rises each time you play a card of a different type (Strike, Trick, Leap) than the card before it. It resets every turn.">⛓ Momentum ${p.mo||0} · ${p.cp||0} played${p.lt?' · last: '+WTN[p.lt]:''}</span>`}
function dcx(c){if(!G||!G.e||!G.p||!G.e.bf||!G.p.hand)return 0;if(D[c.id][2]!='C')return 0;if(!G.p.hand.includes(c))return 0;return(G.p.ep===G.turn||!G.e.bf.some(x=>x.id=='decree'))?0:1}
function webHook(c){if(!c||c.side!='p'||!G.e.bf.some(x=>x.id=='cweb'))return;const L=c.atk.map(u=>G.p.bf.find(x=>x.u==u)).filter(Boolean);if(!L.length)return;const a=L.sort((x,y)=>pwr(y)-pwr(x))[0];a.tap=1;a.frz=1;log('The Cobweb binds '+D[a.id][0]+': it will not untap next turn.')}
function sFire(c){if(!c||c.side!='e'||!G.e.bf.some(x=>x.id=='sfire'))return;const seen=new Set();for(const u of c.atk){for(const bu of[c.blk[u],c.bx&&c.bx[u]]){if(!bu||seen.has(bu))continue;seen.add(bu);const b=G.p.bf.find(x=>x.u==bu);if(b){b.dmg++;log('True Samadhi Fire scorches '+D[b.id][0]+' for 1.')}}}}
/* effects */
Object.assign(FX,{
wdart:(s,o,t)=>wkHit(o,t,1+mg()),whair:(s,o,t)=>wkHit(o,t,1),wrod:(s,o,t)=>wkHit(o,t,2+mg()),
wstep:(s,o,t)=>bounce(t),
wpluck:s=>{wkShuffle(s,'whair',2+mg());draw(s,1)},
wvolley:(s,o,t)=>{t.dmg+=Math.max(1,Math.floor(wkCp(s)/2))+mg()},
whstorm:(s,o)=>{const n=(wkMo(s)>=3?2:1)+mg();tg(o).forEach(c=>{c.dmg+=n})},
wthou:s=>{wkShuffle(s,'whair',4+mg());draw(s,2)},
wcloudh:s=>draw(s,Math.max(1,Math.floor(wkCp(s)/2))+mg()),
wmirror:s=>{s.mir=1},
wspin:(s,o,t)=>{t.dmg+=wkMo(s)+1+mg()},
wgrow:(s,o,t)=>{t.ta+=Math.max(1,wkMo(s))+mg()},
wsplit:(s,o)=>{const d=wkMo(s)+Math.floor(wkCp(s)/2)+mg();o.life-=d;log('Heaven-Splitting Blow: '+d+' damage to the opponent.')},
wsmash:(s,o,t)=>{t.dmg+=2+mg();tg(o).filter(c=>c!==t).forEach(c=>{c.dmg+=1})},
wcloudr:(s,o,t)=>{t.ta+=1+mg();t.ub=1},
wpierce:(s,o,t)=>{t.dmg+=3+mg()},
wflurry:(s,o)=>{const d=Math.max(1,Math.floor(wkCp(s)/2))+mg();o.life-=d;log('Flurry of Blows: '+d+' damage to the opponent.')},
wrout:(s,o)=>{const n=1+Math.floor(wkCp(s)/3)+mg();tg(o).forEach(c=>{c.dmg+=n})},
wblock:(s,o,t)=>{const x=Math.max(1,wkMo(s))+mg();t.ta+=x;t.td+=x},
wpocket:(s,o,t)=>{bounce(t);const h=s.hand[s.hand.length-1];if(h)h.disc=(h.disc||0)+1},
wsomer:s=>{s.gy.forEach(c=>Object.assign(c,{dmg:0,tap:0,def:0,sick:1,frz:0,ta:0,td:0}));s.deck.push(...s.gy);s.gy=[];sh(s.deck);log('Cloud Somersault: your graveyard is shuffled into your deck.');draw(s,1)},
wchange:s=>{if(s.pid){wkShuffle(s,s.pid,2+mg(),{dis:1});log('Seventy-Two Changes: two copies of '+D[s.pid][0]+' are shuffled into your deck.')}},
wxform:(s,o,t)=>{const src=cr(o).slice().sort((a,b)=>D[b.id][1]-D[a.id][1])[0];if(src){wkCopy(t,src);log(D[t.id][0]+' transforms!')}},
wheist:(s,o)=>{const top=o.deck[o.deck.length-1];if(!top){log('Their library is empty.');return}const c=mk(top.id);c.dis=1;c.disc=1+mg();s.hand.push(c);log('You steal a copy of '+D[c.id][0]+'.')},
wpeachc:s=>wkShuffle(s,'wpeach',3+mg()),
wpeach:s=>{s.mana+=1;draw(s,1)},
wfurn:(s,o,t)=>{const i=s.bf.indexOf(t);if(i<0)return;s.bf.splice(i,1);Object.assign(t,{dmg:0,tap:0,def:0,sick:1,frz:0,ta:0,td:0,vn:0,forced:0});t.pa++;t.pd++;s.deck.splice(Math.random()*(s.deck.length+1)|0,0,t);log(D[t.id][0]+' is reforged in the furnace and shuffled into your deck.')},
wledger:(s,o,t)=>{t.led=1;draw(s,1)},
wmount:(s,o)=>{wkShuffle(o,'wwt',3+mg());log('Three Weights of the Mountain are shuffled into their library.')},
wdrink:s=>{s.life+=3;draw(s,(wkMo(s)>=3?2:1)+mg())},
wdance:(s,o,t)=>{t.tap=1},
wfan:(s,o)=>{cr(o).slice().forEach(c=>bounce(c));log('The Banana-Leaf Fan blows their army away.')},
wfeint:s=>{draw(s,1+mg());if(s.pl=='st')draw(s,1)},
wslip:s=>{draw(s,1);if(s.pl=='tr')s.mana+=1+mg()},
wcounter:(s,o,t)=>{t.dmg+=(s.pl=='lp'?3:1)+mg()},
wcycle:(s,o)=>{const y=s.tys||{};if(y.st&&y.tr&&y.lp){const d=4+mg();o.life-=d;log('Full Circle: '+d+' damage to the opponent.')}},
wdodge:(s,o,t)=>{t.td+=3+mg()},
wwine:s=>draw(s,1+mg()),
wtypes:(s,o,t)=>{t.dmg+=Object.keys(s.tys||{}).length+mg()},
worchard:s=>wkShuffle(s,'wpeach',Math.max(1,Math.floor(wkCp(s)/2))+mg()),
wfoot:s=>{if(wkCp(s)>=3)s.mana+=1+mg()},
wmyriad:(s,o)=>{const d=Math.max(1,Math.ceil(wkMo(s)/2))+mg();o.life-=d;tg(o).forEach(c=>{c.dmg+=d});log('Myriad Staffs: '+d+' damage to the opponent and each of their army members.')},
wseal:(s,o,t)=>{t.tap=1;t.frz=1;if(mg())draw(s,mg())},
waugury:s=>{const tp=s.deck[s.deck.length-1];draw(s,1+(tp&&(tp.id=='whair'||tp.id=='wpeach')?1:0)+mg())},
wecho:s=>{const id=s.pid;if(id&&D[id][2]=='S'&&D[id][1]<=1&&!TS[id]&&FX[id]&&id!='wecho'&&id!='wmirror'&&id!='wwt'){log('Afterimage: '+D[id][0]+' takes effect again.');FX[id](s,G.e,null)}},
wwt:()=>{}
});
Object.assign(UPS,{wrod:n=>`Deals ${2+n} damage`,wpierce:n=>`Deals ${3+n} damage`,wdart:n=>`Deals ${1+n} damage`,wpluck:n=>`Shuffle ${2+n} hairs`,wvolley:n=>`+${n} damage`,whstorm:n=>`${1+n} damage (${2+n} at Momentum 3+)`,wthou:n=>`Shuffle ${4+n} hairs`,wcloudh:n=>`Draw ${n} more`,wspin:n=>`Momentum + ${1+n}`,wgrow:n=>`+${n} more power`,wsplit:n=>`+${n} damage`,wsmash:n=>`Deals ${2+n} to the target`,wcloudr:n=>`+${1+n}/+0`,wflurry:n=>`+${n} damage`,wrout:n=>`+${n} damage`,wblock:n=>`+${n} more`,wchange:n=>`${2+n} copies`,wheist:n=>`Costs ${1+n} less`,wpeachc:n=>`Shuffle ${3+n} peaches`,wmount:n=>`Shuffle ${3+n} weights`,wdrink:n=>`Draw ${n} more`,wfeint:n=>`Draw ${1+n}`,wslip:n=>`Gain ${1+n} mana`,wcounter:n=>`+${n} damage`,wcycle:n=>`Deals ${4+n}`,wdodge:n=>`+0/+${3+n}`,wwine:n=>`Draw ${1+n}`,wtypes:n=>`+${n} damage`,worchard:n=>`+${n} peach`,wfoot:n=>`Gain ${1+n} mana`,wmyriad:n=>`+${n} damage`,wseal:n=>`Draw ${n} card`,waugury:n=>`Draw ${1+n}`});
Object.assign(ETB,{wmonk:s=>draw(s,1),wtroop:s=>wkShuffle(s,'whair',1),wwind:s=>{if((s.mo||0)>=2)draw(s,1)},wsix:s=>{const c=s.bf[s.bf.length-1],o=oppOf(s);if(!c||c.id!='wsix')return;const src=cr(o).filter(x=>D[x.id][1]<=4).sort((a,b)=>D[b.id][1]-D[a.id][1]||(pw(b)+th(b))-(pw(a)+th(a)))[0];if(src){wkCopy(c,src);log('The Macaque becomes a copy of '+D[src.id][0]+'.')}}});
Object.assign(DEATH,{wclone:{p:2,fn:s=>{wkShuffle(s,'whair',1);log('The Clone vanishes in a puff of hair: a Spare Hair is shuffled into your deck.')}}});
/* ---- characters: the Journey to the West ---- */
Object.assign(D,{
cweb:['Cobweb',1,'E',0,0,'w','Ward. The first army member that attacks each turn does not untap next turn.','🕸️','G'],
gourd:['Gourd of Names',1,'E',0,0,'w','Ward. The first spell you cast each turn that targets one of their army members is swallowed: it does nothing.','🏺','A'],
decree:['Heavenly Decree',0,'E',0,0,'w','Ward. The first army member you play each turn costs 1 more.','📜','W'],
sfire:['True Samadhi Fire',1,'E',0,0,'w','Ward. Army members that block their army members take 1 damage first.','🔥','R'],
spd1:['Cave Spiderling',1,'C',2,1,'f','','🕷️','G',1],
spd2:['Silk-Spinner',2,'C',2,3,'w','','🕸️','G',1],
spd3:['Web-Weaver',3,'C',3,3,'r','','🕷️','G',2],
spdq:['Spider-Spirit Matron',4,'C',4,5,'r','','🕷️','G',2],
cocn:['Cocoon',2,'S',0,0,'',"Tap target army member; it doesn't untap next turn.",'🕸️','G'],
hsol:['Horn Soldier',1,'C',2,1,'','','🗡️','A',1],
hcap:['Cave Captain',2,'C',2,3,'','','🛡️','A',1],
hsil:['Silver Horn King',3,'C',3,3,'r','','🦬','A',2],
hgol:['Gold Horn King',4,'C',4,5,'','','🐃','A',3],
hrope:['Humbling Rope',2,'S',0,0,'','Target army member gets -2/-2.','🪢','A'],
hbot:['Jade-Purity Bottle',3,'S',0,0,'','Deal 4 damage to target army member.','🍶','A'],
hsd:['Heavenly Soldier',1,'C',2,3,'f','','🪖','W',1],
hhd:['Celestial Hound',2,'C',3,3,'q','','🐕','W',1],
hgn:['Heavenly General',3,'C',4,4,'w','','⚔️','W',2],
hnz:['Nezha, the Third Prince',3,'C',3,3,'h','','🔱','W',2],
hpg:['Pagoda-Bearing King',4,'C',3,6,'z','','🏯','W',3],
hth:['Thunder Decree',3,'S',0,0,'','Deal 4 damage to target army member.','⚡','W'],
hnet:['Heaven-and-Earth Net',3,'S',0,0,'',"Tap all opposing army members.",'🕸️','W'],
rimp:['Fire-Wheel Imp',1,'C',2,1,'h','','🔥','R',1],
rgrd:['Samadhi Guard',2,'C',2,2,'','','🛡️','R',1],
rspr:['Fire-Cloud Spearman',2,'C',3,2,'r','','🔱','R',2],
rboy:['Red Boy, the Holy Infant King',3,'C',4,4,'h','','👹','R',3],
rflm:['Fire-Cloud Blast',2,'S',0,0,'','Deal 3 damage to target army member.','🔥','R'],
bone:['Corpse-Shedding Form',1,'E',0,0,'w','Ward. The first of their army members to die each turn returns to their hand instead.','💀','B'],
bsk:['Bone Soldier',1,'C',2,1,'','','☠️','B',1],
bghl:['Wandering Corpse',2,'C',2,3,'','','🧟','B',1],
bhag:['The Old Hag',3,'C',3,4,'','','👵','B',2],
bsp:['The White Bone Spirit',4,'C',4,5,'z','','🦴','B',3],
ywind:['The Yellow Wind',1,'E',0,0,'w','Ward. All of their army members have Charge.','🌪️','Y'],
ybat:['Wind-Riding Bat',1,'C',2,1,'fh','','🦇','Y',1],
ytig:['Tiger Vanguard',2,'C',3,2,'h','','🐯','Y',1],
ydef:['Ridge Guard',2,'C',2,3,'h','','🛡️','Y',1],
ygen:['The Yellow Wind Monster',4,'C',4,4,'fh','','👺','Y',3],
ygale:['Three-Sacrifice Gale',2,'S',0,0,'','Deal 3 damage to target army member.','🌬️','Y'],
eye:['The Third Eye',1,'E',0,0,'w','Ward. Spells and instants that cost 0 cost 1 more for you.','👁️','E'],
eplum:['Plum Mountain Brother',2,'C',2,3,'','','🗡️','E',1],
ehnd:['The Howling Celestial Hound',2,'C',3,3,'q','','🐕','E',1],
eerl:['Erlang Shen, the Illustrious Sage',4,'C',4,5,'z','','👁️','E',3],
esw:['Three-Pointed Blade',3,'S',0,0,'','Deal 4 damage to target army member.','🔱','E']
});
Object.assign(SPA,{ygale:'javel',esw:'hurl',cocn:'honey',hrope:'curse',hbot:'hurl',hth:'hurl',hnet:'fog',rflm:'javel'});
Object.assign(FX,{cocn:FX.honey,hrope:FX.curse,hbot:FX.hurl,hth:FX.hurl,hnet:FX.fog,rflm:FX.javel,ygale:FX.javel,esw:FX.hurl});
Object.assign(TS,{cocn:'c',hrope:'c',hbot:'c',hth:'c',rflm:'c',ygale:'c',esw:'c'});
MT.push('cweb','gourd','decree','sfire','bone','ywind','eye');
Object.assign(LORE,{cweb:'Opening trump',gourd:'Opening trump',decree:'Opening trump',sfire:'Opening trump',spd1:'Spider spirit',spd2:'Spider spirit',spd3:'Spider spirit',spdq:'Spider queen',hsol:'Cave soldier',hcap:'Cave captain',hsil:'Demon king',hgol:'Demon king',hsd:'Celestial soldier',hhd:'Heavenly hound',hgn:'Celestial general',hnz:'God of war',hpg:'Heavenly king',rimp:'Fire imp',rgrd:'Fire guard',rspr:'Fire guard',rboy:'Demon prince',bone:'Opening trump',ywind:'Opening trump',eye:'Elite trump',bsk:'Bone soldier',bghl:'Corpse',bhag:'Bone spirit',bsp:'Bone spirit',ybat:'Wind demon',ytig:'Tiger demon',ydef:'Ridge guard',ygen:'Wind demon king',eplum:'Sworn brother',ehnd:'Celestial hound',eerl:'God of war'});
['cweb','gourd','decree','sfire','bone','ywind','eye'].forEach(k=>IV[k]=40);
CHARS.wukong={n:'Sun Wukong',ic:'🐒',
quote:'"What is bound by a name is bound by its master; I have no name that holds." The Stone Monkey struck his own name from the Book of Life and Death, and learned that nothing can be pinned that is already somewhere else.',
play:'Chain cards of different types (Strike, Trick, Leap) to build Momentum, and the more cards you play in a turn, the harder your payoffs hit. Spare Hairs and Peaches shuffle into your deck to keep the chain alive, and Disintegrated cards vanish for good. A swarm of small monkeys and a hand full of spells. 20 life.',
arch:[['C','Clones'],['W','Staff'],['T','Trickster']],
staples:'wmonk wdart wrod wsomer'.split(' '),
pool:'wtypes wtroop worchard wfoot wmyriad wwind wseal waugury wecho wtang wpluck wvolley whstorm wclone wthou wcloudh wmirror wacro wfeint wwine wspin wgrow wruyi wsplit wsmash wking wcloudr wsent wpierce wflurry wrout wblock wcounter wdodge wpig wpocket wstep wchange wxform wheist wpeachc wfurn wledger wmount wsix wdrink wdance wfan wslip wcycle'.split(' '),
en:[
{n:'The Spider Cave',l:22,ic:'🕷️',hint:'Webs bind your attackers and silk wards off your spells',bg:['#0c1410','#4f7a3a'],d:ids('spd1:2,spd2:3,spd3:3,spdq:2,cocn:1,hbot:2'),mt:'cweb'},
{n:'The Gold and Silver Horn Kings',l:13,ic:'🏺',hint:'A gourd that swallows the first spell aimed at them',bg:['#1a1409','#a88a3a'],d:ids('hsol:3,hcap:3,hsil:2,hgol,hrope:2,hbot:2'),mt:'gourd'},
{n:'The Heavenly Host',l:17,ic:'☁️',hint:'Celestial soldiers under a decree that taxes your first army member',bg:['#101826','#8aa6c8'],d:ids('hsd:2,hhd:3,hgn:2,hnz:2,hpg,hbot:2,hth'),mt:'decree'},
{n:'Red Boy',l:22,ic:'🔥',hint:'True Samadhi Fire scorches every blocker',bg:['#240a05','#d4642a'],d:ids('rimp:3,rgrd:2,rspr:3,rboy:3,rflm:2'),mt:'sfire'}],
bo:[0,1,2]};
CHARS.wukong.en.push(
{n:'The White Bone Spirit',l:16,ic:'💀',hint:'She sheds her corpse and returns: the first of her fallen each turn comes back to her hand',bg:['#15151a','#b8b2a0'],d:ids('bsk:3,bghl:3,bhag:3,bsp,hrope:2'),mt:'bone'},
{n:'The Yellow Wind Ridge',l:20,ic:'🌪️',hint:'Everything the wind carries strikes the moment it lands',bg:['#241d07','#c9a227'],d:ids('ybat:3,ytig:4,ydef:2,ygen:2,ygale:2'),mt:'ywind'});
ELITES.push({n:'Erlang Shen, the Three-Eyed',l:21,ic:'👁️',hint:'His third eye sees through every clone and feint: spells that cost 0 cost 1 more for you',bg:['#0e1824','#9ab8d8'],d:ids('eplum:4,ehnd:3,eerl:2,esw:2,hnet'),mt:'eye'});
CHARS.wukong.el=[ELITES.length-1];
function boneBack(s,c){if(!isC(c)||TOKE.includes(c.id)||!s.bf||s===G.p||!s.bf.some(x=>x.id=='bone')||s.bn===G.turn)return 0;s.bn=G.turn;Object.assign(c,{tap:0,dmg:0,def:0,att:0,sw:0,sick:1,frz:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,forced:0});s.hand.push(c);log(D[c.id][0]+' sheds its corpse and returns to their hand.');return 1}
function ecx(c){if(!G||!G.e||!G.p||!G.e.bf||!G.p.hand)return 0;const t=D[c.id][2];if(t=='C'||t=='E'||D[c.id][1]!==0)return 0;return G.p.hand.includes(c)&&G.e.bf.some(x=>x.id=='eye')?1:0}

/* ===== UI: instant offer-skull tooltip (left, 15% larger); counter-zoom for draft card tooltips ===== */
(function(){try{
 const st=document.createElement('style');st.textContent='#otip{position:fixed;display:none;z-index:500;pointer-events:none;background:#14100a;color:#f3ead0;border:1px solid #e0b04a;border-radius:6px;padding:5px 10px;font:13.8px/1.3 Georgia,serif;white-space:nowrap;box-shadow:0 4px 14px #000a}.dw .fxp{zoom:calc(1.15/var(--ds,1.6))}';document.head.appendChild(st);
 const T=document.createElement('div');T.id='otip';document.body.appendChild(T);
 document.addEventListener('mouseover',ev=>{const o=ev.target.closest&&ev.target.closest('.ob');if(!o){T.style.display='none';return}
  if(o.title){o.dataset.t=o.title;o.removeAttribute('title')}const tx=o.dataset.t;if(!tx){T.style.display='none';return}
  T.textContent=tx;T.style.display='block';const r=o.getBoundingClientRect(),w=T.offsetWidth,h=T.offsetHeight;
  let x=r.left-w-8;if(x<4)x=Math.min(innerWidth-w-4,r.right+8);T.style.left=x+'px';T.style.top=Math.max(4,Math.min(innerHeight-h-4,r.top+r.height/2-h/2))+'px'},true);
}catch(e){}})();
/* ===== one health for every regular enemy (fight 1 = BASE_L-3 etc.); balance comes from decks, not life ===== */
const BASE_L=15;
Object.keys(CHARS).forEach(k=>CHARS[k].en.forEach(e=>{e.l=BASE_L}));
/* ===== Act II: the other realm (playtest version) ===== */
var A2R='';
function applyRealm(r){EN.length=0;EN.push(...CHARS[r].en)}
const A2INTRO={odin:'Act II: you cross the rainbow bridge into the Nine Worlds. Wolves, giants and the dead of Helheim wait beyond the frost.',ody:'Act II: your ship leaves the shore for the wine-dark sea. Sirens, cyclopes and the shades of the underworld wait beyond the strait.',wukong:'Act II: you set out on the road to the Western Heaven. Spirits, demon kings and the host of Heaven itself bar the way.'};
function a2Realm(){const me=G.ch||'ody',O=Object.keys(CHARS).filter(k=>k!=me&&CHARS[k].en&&CHARS[k].en.length);return O[Math.random()*O.length|0]}
function startAct2(){const p=G.p,r=a2Realm();G.a2=r;A2R=r;applyRealm(r);G.web=genWeb();Object.assign(G,{pos:0,fi:0,rt:[],lanes:[],trail:{},act:2,spent:0,gift:0,boss:0,elt:0,bi:0,bs:0,dr:0,rep:0,hubMsg:'',msg:'',lib:0,mode:0,pend:0,phase:'map',hubMsg:A2INTRO[r]||'',msg:A2INTRO[r]||''});p.life=Math.min(p.max,p.life+10);try{vicVis()}catch(e){}render()}

/* ===== Wukong army expansion (10 army members) ===== */
Object.assign(D,{
wjug:['Juggler Monkey',2,'C',2,2,'','Whenever your Momentum rises, it deals 1 damage to the opponent.','🤹','W',1],
wlegion:['Hair-Born Legion',3,'C',2,3,'','When it enters, shuffle 2 Spare Hairs into your deck.','🐵','U',2],
wmirm:['Mirror Monkey',2,'C',1,3,'','When it dies, draw a card and shuffle a Spare Hair into your deck.','🪞','U',1],
wbear:['Staff-Bearer',2,'C',2,2,'','When it enters, the opponent takes damage equal to your Momentum (at most 3).','🎋','R',1],
wbreak:['Heaven-Breaker',4,'C',3,4,'','When it enters, deal 1 damage to each opposing army member (2 if your Momentum is 2 or more).','⚒️','R',3],
wvang:['Whirlwind Vanguard',2,'C',2,1,'h','Gets +1/+0 until end of turn each time your Momentum rises.','🌪️','W',1],
wpeachk:['Peach Keeper',2,'C',1,3,'','When it enters, shuffle a Heavenly Peach into your deck.','🍑','R',1],
wcloudm:['Cloud Rider',3,'C',2,3,'f','When it dies, draw a card.','☁️','U',2],
wdrum:['Drum-Beater Monkey',2,'C',1,2,'','When it enters, your Momentum rises by 1.','🥁','W',1],
wdisc:['Disciple of the Sage',3,'C',2,4,'','Gets +2/+0 until end of turn when you play your 3rd card in a turn.','🧘','R',2]
});
[['tr','wjug wlegion wmirm wdisc'],['st','wbear wbreak wvang'],['lp','wpeachk wcloudm wdrum']].forEach(([t,x])=>x.split(' ').forEach(i=>{WT[i]=t;LORE[i]=WTN[t]+' · Monkey'}));
{const R={C:'wvang wdrum wpeachk wbear',U:'wjug wlegion wmirm wcloudm',R:'wdisc wbreak'};for(const r in R)R[r].split(' ').forEach(x=>RAR[x]=r);
 const T={C:'wlegion wmirm wdisc',W:'wbear wbreak wvang',T:'wpeachk wcloudm wdrum wjug'};for(const t in T)T[t].split(' ').forEach(x=>TAG[x]=t)}
Object.assign(ETB,{
wlegion:s=>wkShuffle(s,'whair',2),
wbear:s=>{const d=Math.min(3,wkMo(s));if(d>0){oppOf(s).life-=d;log('The Staff-Bearer strikes the opponent for '+d+'.')}},
wbreak:s=>{const d=wkMo(s)>=2?2:1;tg(oppOf(s)).forEach(c=>{c.dmg+=d});log('Heaven-Breaker: '+d+' damage to each opposing army member.')},
wpeachk:s=>wkShuffle(s,'wpeach',1),
wdrum:s=>{s.mo=(s.mo||0)+1;wkMom(s)}});
Object.assign(DEATH,{
wmirm:{p:2,fn:s=>{draw(s,1);wkShuffle(s,'whair',1)}},
wcloudm:{p:2,fn:s=>draw(s,1)}});
{const om=wkMom;wkMom=function(p){om(p);cr(p).forEach(c=>{if(c.id=='wvang')c.ta++;if(c.id=='wjug'){oppOf(p).life-=1}})}}
{const op=wkPlay;wkPlay=function(p,c){op(p,c);if(p.cp===3)cr(p).forEach(x=>{if(x.id=='wdisc')x.ta+=2})}}
CHARS.wukong.pool.push('wjug','wlegion','wmirm','wbear','wbreak','wvang','wpeachk','wcloudm','wdrum','wdisc');
/* ===== livelier Wukong-realm enemy army members ===== */
{const T={
spd2:'When it enters, tap the strongest army member the opponent controls.',
spd3:'When it dies, deal 1 damage to each opposing army member.',
spdq:'When it enters, two Cave Spiderlings join the army if there is room.',
hsol:'When it dies, the opponent takes 1 damage.',
hcap:'When it enters, draw a card.',
hsil:'When it enters, deal 2 damage to the opposing army member with the least life.',
hgol:'When it dies, the opponent takes 3 damage.',
hsd:'When it dies, the opponent takes 1 damage.',
hhd:'When it enters, deal 1 damage to the opposing army member with the least life.',
hgn:'When it enters, your other army members get +1/+0 until end of turn.',
hnz:'',
hpg:'When it enters, tap the strongest army member the opponent controls.',
rimp:'When it dies, the opponent takes 1 damage.',
rgrd:'When it enters, the opponent takes 1 damage.',
rspr:'When it enters, deal 1 damage to the opposing army member with the least life.',
rboy:'When it enters, deal 1 damage to each opposing army member.',
bghl:'When it enters, draw a card.',
bhag:'When it enters, the strongest opposing army member takes 2 damage.',
bsp:'When it enters, return an army member from your graveyard to your hand.',
ybat:'When it enters, the opponent takes 1 damage.',
ytig:'When it dies, draw a card.',
ydef:'When it enters, the opponent takes 1 damage.',
ygen:'When it enters, deal 1 damage to each opposing army member and tap the strongest one.'};
for(const k in T)D[k][6]=T[k]}
{const weak=o=>cr(o).slice().sort((a,b)=>(th(a)-a.dmg)-(th(b)-b.dmg))[0],strong=o=>cr(o).slice().sort((a,b)=>pw(b)-pw(a))[0];
const lg=m=>log(m);
Object.assign(ETB,{
spd2:s=>{const c=strong(oppOf(s));if(c){c.tap=1;lg('A web snares '+D[c.id][0]+'.')}},
spdq:s=>{for(let i=0;i<2;i++)if(cr(s).length<5){const c=mk('spd1');enter(s,c);c.sick=1}},
hcap:s=>draw(s,1),
hsil:s=>{const c=weak(oppOf(s));if(c)c.dmg+=2},
hhd:s=>{const c=weak(oppOf(s));if(c)c.dmg+=1},
hgn:s=>{cr(s).forEach(c=>{if(c.id!='hgn')c.ta=(c.ta||0)+1})},
hpg:s=>{const c=strong(oppOf(s));if(c)c.tap=1},
rgrd:s=>{oppOf(s).life-=1},
rspr:s=>{const c=weak(oppOf(s));if(c)c.dmg+=1},
rboy:s=>{tg(oppOf(s)).forEach(c=>{c.dmg+=1})},
bghl:s=>draw(s,1),
bhag:s=>{const c=strong(oppOf(s));if(c)c.dmg+=2},
bsp:s=>{const i=s.gy.findIndex(c=>isC(c));if(i>=0){s.hand.push(s.gy.splice(i,1)[0])}},
ybat:s=>{oppOf(s).life-=1},
ydef:s=>{oppOf(s).life-=1},
ygen:s=>{const o=oppOf(s);tg(o).forEach(c=>{c.dmg+=1});const c=strong(o);if(c)c.tap=1}});
Object.assign(DEATH,{
spd3:{p:2,fn:s=>{tg(oppOf(s)).forEach(c=>{c.dmg+=1})}},
hsol:{p:2,fn:s=>{oppOf(s).life-=1}},
hgol:{p:2,fn:s=>{oppOf(s).life-=3}},
hsd:{p:2,fn:s=>{oppOf(s).life-=1}},

rimp:{p:2,fn:s=>{oppOf(s).life-=1}},
ytig:{p:2,fn:s=>draw(s,1)}})}
/* ===== PHONE MODE: mini cards that grow on touch ===== */
var PHON=false,PHSIG='',PHBYP=0;
try{(function(){
const css=document.createElement('style');css.id='phcss';css.textContent=`html{--vh:100vh}@supports (height:100dvh){html{--vh:100dvh}}

html.ph{--fw:min(66px,calc((100vw - 66px)/5 - 6px));--hw:min(66px,calc((100vw - 20px)/6))}

html.ph #app{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto minmax(0,1fr) calc(var(--hw)*1.42 + 14px)}
html.ph .top{padding:4px 10px;gap:6px}html.ph .top>div:last-child{display:none}
html.ph .eh{min-width:0;flex:1 1 auto;font-size:14px}
html.ph .eHand{flex:none;max-width:40%;overflow:hidden}html.ph .eHand .cb{width:24px;height:34px;margin:0 -5px;font-size:10px}
html.ph .fld{padding:6px 6px 6px 40px;gap:5px;min-width:0;overflow:hidden}
html.ph .mid{padding:2px 8px;font-size:11.5px;line-height:1.25}html.ph .mid small{font-size:9.5px;line-height:1.2}
html.ph .hand{padding:0 4px 4px 4px;min-height:0}
html.ph .fld .cd,html.ph .hand .cd{border-width:2px;padding:2px;border-radius:6px;transition:transform .2s}
html.ph .fld .cd{width:var(--fw);height:calc(var(--fw)*1.42);font-size:calc(var(--fw)/7)}
html.ph .hand .cd{width:var(--hw);height:calc(var(--hw)*1.42);font-size:calc(var(--hw)/7);margin:0 -4px}
html.ph :is(.fld,.hand) .cd .tx,html.ph :is(.fld,.hand) .cd .ty,html.ph :is(.fld,.hand) .cd .rr,html.ph :is(.fld,.hand) .cd .fxp{display:none!important}
html.ph :is(.fld,.hand) .cd .nm{font-size:1em;line-height:1.15;padding:0 2px}html.ph :is(.fld,.hand) .cd .nm b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}
html.ph :is(.fld,.hand) .cd .nm i{font-size:.95em;padding:0 3px}
html.ph :is(.fld,.hand) .cd .ar{font-size:calc(var(--fw)*.46);margin:1px 0}
html.ph .hand .cd .ar{font-size:calc(var(--hw)*.46)}
html.ph :is(.fld,.hand) .cd .pt{font-size:calc(var(--fw)/5);padding:0 3px;right:1px;bottom:1px}
html.ph .hand .cd .pt{font-size:calc(var(--hw)/5)}
html.ph :is(.fld,.hand) .cd .ar>.ob,html.ph :is(.fld,.hand) .cd .ob{font-size:calc(var(--fw)/7);padding:0 3px;top:auto;bottom:2px;left:2px;right:auto;border-width:1px;line-height:1.2}
html.ph :is(.fld,.hand) .cd .sb{font-size:calc(var(--fw)/9);padding:0 4px;top:-8px;border-width:1px}
html.ph :is(.fld,.hand) .cd:hover{scale:1;translate:none}html.ph .hand .cd:hover{translate:none}
html.ph .cd.phz{outline:3px solid #fff;z-index:60!important}
html.ph .decks{left:3px;gap:4px;top:44%}html.ph .decks .pile{width:30px;height:42px;font-size:12px;box-shadow:1px 1px 0 #3a1a0c,2px 2px 0 #2a1208,0 3px 6px #000a}html.ph .gy .gyc{font-size:15px}html.ph .gy .gyn,html.ph .pile .gyn{font-size:9px;right:3px;bottom:2px}
html.ph .me{left:6px;bottom:calc(var(--hw)*1.42 + 16px);flex-direction:row;gap:6px;align-items:center;background:#000a;border-radius:18px;padding:2px 10px 2px 3px}html.ph .me{flex-wrap:wrap;max-width:calc(100vw - 232px);row-gap:0}html.ph .me .pn{display:none}html.ph .me .orb{width:32px;height:32px;font-size:12px}html.ph .me .hp{font-size:13px}html.ph .me .cn{font-size:9px}
html.ph .ctl{right:6px;bottom:calc(var(--hw)*1.42 + 16px);flex-direction:row;flex-wrap:nowrap;justify-content:flex-end;max-width:70%;gap:4px}html.ph .ctl .b{padding:5px 7px;font-size:11px;white-space:nowrap}
html.ph.phl .ctl{flex-direction:column;right:6px;bottom:8px;max-width:none}html.ph.phl .me{bottom:8px}
html.ph.phl .hand{padding:0 130px 2px 120px}
html.ph :is(.eh,.me,.decks,.ctl,.fld,.hand,.eHand,.mid){zoom:1!important}
html.ph .ovb{zoom:1}html.ph .dft{zoom:1}
#rotp{display:none;position:fixed;inset:0;z-index:2000;background:#0b1820;color:#f3ead0;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;font-family:Georgia,serif}
html.phr #rotp{display:flex}html.phr #app,html.phr #loupe{visibility:hidden}
#rotp .rph{width:44px;height:74px;border:3px solid #d8b45a;border-radius:9px;animation:rotph 2.4s ease-in-out infinite;position:relative}
#rotp .rph:after{content:'';position:absolute;left:50%;bottom:4px;width:12px;height:3px;margin-left:-6px;background:#d8b45a;border-radius:2px}
@keyframes rotph{0%,25%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}
#rotp .rt1{font-size:22px;color:#d8b45a;letter-spacing:.04em;margin-top:18px}#rotp .rt2{font-size:14px;opacity:.75}
#loupe{position:fixed;left:50%;top:max(54px,env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:700;pointer-events:none;display:none;flex-direction:column;align-items:center;gap:6px}
#loupe.on{display:flex}
#loupe .cd{--lw:min(60vw,230px,calc((var(--vh) - 150px)/1.95));width:var(--lw)!important;height:calc(var(--lw)*1.42)!important;font-size:calc(var(--lw)/12)!important;transform:none!important;scale:1!important;translate:none!important;margin:0!important;top:0!important;visibility:visible!important;opacity:1!important;filter:none!important;border-width:3px;padding:4px;outline:none;box-shadow:0 8px 30px #000d,0 0 0 2px var(--gold)}
#loupe .cd .tx,#loupe .cd .ty{display:block!important}#loupe .cd .rr{display:block!important}
#loupe .cd .tx{font-size:1.12em!important;line-height:1.2;min-height:0;padding:3px 4px}
#loupe .cd .ty{font-size:1em}
#loupe .cd .nm{font-size:1.2em}#loupe .cd .nm b{white-space:normal;display:block}
#loupe .cd .ar{font-size:calc(var(--lw)*.34)}
#loupe .cd .pt{font-size:1.5em;padding:0 6px}
#loupe .cd .ob{font-size:calc(var(--lw)*.068)!important;padding:0 7px!important;bottom:5px!important;top:auto!important;left:auto!important;right:5px!important;border-width:1px}#loupe .cd .sb{font-size:.8em!important;top:-10px!important}
html.phl #loupe{flex-direction:row;align-items:flex-start;top:6px;gap:10px;max-width:96vw}html.phl #loupe .cd{--lw:min(240px,calc((var(--vh) - 24px)/1.42))}html.phl #loupe .lside{display:flex;flex-direction:column;gap:6px;width:min(42vw,300px);pointer-events:none}html.phl #loupe .lx{width:100%;max-height:70vh;font-size:12.5px;box-sizing:border-box}html.phl #loupe .lacts{display:flex;flex-direction:column;gap:5px;pointer-events:auto}html.phl #loupe .lacts .b{pointer-events:auto;font-size:13px;min-height:36px;width:100%}
#loupe .cd .fxp{display:none!important}
#loupe .lx{width:min(60vw,230px);background:#14100af2;color:#f3ead0;border:1px solid var(--gold);border-radius:8px;padding:6px 9px;font-size:12px;line-height:1.3;max-height:30vh;overflow:hidden}
#loupe .lx p{margin:0 0 4px}#loupe .lx p:last-child{margin:0}
#loupe .lh{font-size:11px;color:#ffd878;text-shadow:0 1px 4px #000,0 0 6px #000}
/* ---- landscape-only v2 ---- */
html.ph{--fw:min(64px,calc((var(--vh) - 150px)/4.3));--hw:var(--fw)}
html.ph .top{padding:2px 10px}
html.ph .eh{display:flex;align-items:baseline;gap:8px;flex-wrap:nowrap;white-space:nowrap;font-size:13px}
html.ph .eh .cn{display:inline!important;margin:0!important;font-size:12px}
html.ph .eh u{bottom:-3px}
html.ph #app{grid-template-rows:auto minmax(0,1fr) auto minmax(0,1fr) calc(var(--hw)*1.42 + 8px)}
html.ph .fld{align-items:center;padding-top:14px;padding-bottom:4px}
html.ph .fld.fe{padding-top:30px;padding-bottom:4px}
html.ph :is(.fld,.hand) .cd .sb{font-size:9px;padding:1px 5px;top:-20px;white-space:nowrap}
html.ph .fld{padding-right:136px}
html.ph :is(.fld,.hand) .cd .nm{font-size:max(8.5px,1em)}
html.ph :is(.fld,.hand) .cd .ar>.ob,html.ph :is(.fld,.hand) .cd .ob{font-size:max(9.5px,calc(var(--fw)/7))}
html.ph .dft{gap:10px;padding:8px 24px;justify-content:safe center;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;box-sizing:border-box}
html.ph .dft .ovt{font-size:22px!important}html.ph .dft .dsub{font-size:12.5px}
html.ph .hub{gap:8px}html.ph .hub .b{min-height:34px}
html.ph .top{padding-right:54px}
html.ph .dft>div[style*="clamp(30px"]{font-size:22px!important}html.ph .dft:has(.chrow){gap:3px;padding-top:4px;padding-bottom:4px}html.ph .dft:has(.chrow)>.ovt{font-size:13px!important}html.ph .dft>.ovt:first-of-type{margin:0}
html.ph .chrow{flex-wrap:nowrap!important;gap:8px!important;margin:0!important;width:100%!important}
html.ph .chbox{padding:8px 10px!important;min-width:0!important;border-radius:10px!important;display:flex!important;flex-wrap:wrap;gap:4px;justify-content:center;align-content:flex-start}
html.ph .chbox>div{flex:1 1 100%}html.ph .chbox>div:first-child{font-size:22px!important;line-height:1}
html.ph .chbox .ovt{font-size:17px!important}
html.ph .chbox .dsub{font-size:10px!important;margin:1px 0!important;line-height:1.3}
html.ph .chbox .b{flex:1 1 40%;min-height:27px;padding:3px 6px;font-size:11px}
html.ph .chbox .b[data-b^=pick]{flex:1 1 100%;order:9;font-size:13px}
html.ph .mapscr{display:grid!important;grid-template-columns:196px minmax(0,1fr);grid-auto-rows:min-content;align-content:start;justify-items:stretch;gap:5px 8px;padding:6px 8px!important;text-align:left}
html.ph .mapscr .ovt{font-size:18px!important;grid-column:1}
html.ph .mapscr>.dsub,html.ph .mapscr>.b{grid-column:1;font-size:11.5px!important;margin:0}
html.ph .mapscr .tmap{grid-column:2;grid-row:1/9;align-self:center;justify-self:center}
html.ph .mapscr .ninfo{grid-column:1;font-size:11.5px;line-height:1.35;background:#0007;border:1px solid #d8b45a88;border-radius:8px;padding:6px 8px;color:#f3e6c1}
html.ph .mapscr .ninfo b{color:#ffd878}
html.ph .tipx{display:none!important}
html.ph .wn .hit{position:absolute;inset:-5px;border-radius:50%;display:block}
html.ph .decks .pile{width:34px;height:47px}
html.phk .fld.fe,html.phk .hand,html.phk .me,html.phk .decks{display:none!important}
html.phk #app{grid-template-rows:auto auto minmax(0,1fr)}
html.phk .fld.fp{align-items:center;padding:6px 20px;gap:14px;overflow-y:auto}
html.phk .kc{gap:6px}html.phk .ko .b{min-height:32px;font-size:12px;padding:4px 10px;white-space:normal;line-height:1.15;max-width:150px}html.phk .ko em{font-size:12px}
html.phk .fld .cd{width:calc(var(--fw)*1.25);height:calc(var(--fw)*1.775);font-size:calc(var(--fw)*1.25/7)}
html.phk .ctl{bottom:8px}
html.ph .bsp{flex-wrap:nowrap!important;gap:8px!important;width:100%!important;max-width:none!important;margin:0!important;align-items:stretch}
html.ph .bsc{min-width:0!important;flex:1 1 0!important;width:auto!important;padding:6px 10px!important;gap:3px!important;display:flex;flex-direction:column;align-items:center;justify-content:center}
html.ph .bsc .ic{font-size:26px!important;line-height:1}html.ph .bsc .nm2{font-size:15px!important}html.ph .bsc .lr{font-size:10.5px!important;line-height:1.3!important;margin:2px 0!important}
html.ph .bsc .b{min-height:30px;font-size:12px}
#lbk{display:none;position:fixed;inset:0;z-index:690;background:#0008}#lbk.on{display:block}
#loupe .cd,#loupe .lx{pointer-events:auto}
html.ph .cd .ob[data-z]:before,html.ph .cd .sb[data-z]:before{content:'';position:absolute;inset:-6px}
html.ph .mid{font-size:11.5px;line-height:1.2;padding:1px 52px 1px 52px}html.ph .mid small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:9.5px;opacity:.75}
html.ph .ctl{width:140px;max-width:none}html.ph .ctl .b{width:100%;white-space:normal;line-height:1.15;padding:4px 6px;font-size:11.5px;min-height:30px}
html.ph.phl .hand{padding:0 148px 2px 120px}
html.ph .eh .hp,html.ph .me .hp{padding:8px 10px;margin:-8px -2px}
html.ph .eh .hp[style*=outline]{animation:phface 1s ease-in-out infinite}@keyframes phface{50%{outline-color:#fff}}
#loupe.hintonly{top:auto;bottom:4px;left:50%;transform:translateX(-50%)}#loupe.hintonly .lh{background:#000c;border:1px solid #d8b45a;border-radius:12px;padding:3px 12px;font-size:12px}
html.ph .ov .ovb{max-height:var(--vh);gap:3px;zoom:1;min-height:0;padding-bottom:4px}
html.ph .ov .ovt{font-size:16px!important;margin-top:4px}
html.ph .ov .lib{flex:1 1 auto;min-height:0;max-height:none;padding:20px 10px 6px;gap:10px;max-width:98vw}
html.ph .rmv .rmw{zoom:1}
html.ph .ov .ovb>.dsub{font-size:12px;margin:0}html.ph .ov .ovb>.dsub .b{min-height:30px}
html.ph .ov{background:#0b1820f5}html.ph .cfm{background:#0b1820f0}
html.ph .ov .ovt{font-size:13px!important}
html.ph .cfm .ovb{gap:4px}html.ph .cfm .ovt{font-size:14px!important}
html.ph .big{padding:0!important}html.ph .ov .big{display:flex;justify-content:center}html.ph .ov .big .cd .tx{font-size:1.15em!important}html.ph .ov .big .cd .nm{font-size:1.15em}
html.ph .ov .big .cd{--lw:calc((var(--vh) - 122px)/1.42);width:var(--lw)!important;height:calc(var(--lw)*1.42)!important;font-size:calc(var(--lw)/12)!important;zoom:1!important;scale:1!important;margin:0!important}
html.ph .cfm .yn{gap:10px}
html.ph .dhd{top:4px}html.ph .dhd .ovt{font-size:18px!important}html.ph .dhd .dsub{font-size:11px;margin-top:1px}
html.ph .dcards{gap:22px;margin-top:44px;min-height:0}
html.ph .dlibw{zoom:1!important;left:10px;top:auto;bottom:10px;transform:none;gap:3px}html.ph .dlibw .tip{display:none!important}html.ph .dlibw small{font-size:10px}html.ph .dlibw .gyn{font-size:9px}html.ph .dlibw .pile{width:44px;height:62px}
@media(max-height:395px){html.ph .chbox .dsub[style*=italic]{display:none}}
html.ph .wn.phsel:before{content:'';position:absolute;inset:-3px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px #fff;pointer-events:none;z-index:5}
html.ph .me{max-width:116px}html.ph .me .cn,html.ph .me .wkb{font-size:10px}
html.ph .ctl .b,html.ph .b{min-height:30px;padding:5px 10px;font-size:12px}
html.ph .ctl{gap:5px}
html.ph .mid{font-size:12px}

html.ph,html.ph body{overscroll-behavior:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
html.ph .cd,html.ph .b,html.ph .wn,html.ph #loupe{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html.ph #app{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right);box-sizing:border-box}
html.ph :is(.fld,.hand) .cd .ob{font-size:max(9px,calc(var(--fw)/7))}
`;document.head.appendChild(css);
const L=document.createElement('div');L.id='loupe';document.body.appendChild(L);const BK=document.createElement('div');BK.id='lbk';document.body.appendChild(BK);let LSRC=null;const actSrc=src=>{if(src&&document.contains(src)&&!(src.closest('.lib')&&!src.closest('.rmw'))){PHBYP=1;try{src.click()}finally{PHBYP=0}}};BK.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();const src=LSRC;let hit=false;try{const r=src.getBoundingClientRect();hit=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}catch(x){}hideLoupe();if(hit)actSrc(src)},true);const RO=document.createElement('div');RO.id='rotp';RO.innerHTML='<div class="rph"></div><div class="rt1">Turn your phone sideways</div><div class="rt2">Mythologica is played in landscape.</div>';document.body.appendChild(RO);
const sigOf=cd=>{const n=cd.querySelector('.nm b');return (cd.dataset.z||'')+'|'+(n?n.textContent:'')+'|'+[...cd.parentNode.children].indexOf(cd)+'|'+(cd.closest('.hand')?'h':cd.closest('.fld')?'f':'')};
window.hideLoupe=function(){BK.classList.remove('on');LSRC=null;L.classList.remove('on');L.innerHTML='';PHSIG='';document.querySelectorAll('.cd.phz').forEach(x=>x.classList.remove('phz'))};
window.showLoupe=function(cd){hideLoupe();if(cd.closest('.dcards')){const h=document.createElement('div');h.className='lh';h.textContent='Tap again to pick this card';L.appendChild(h);L.classList.add('on','hintonly');cd.classList.add('phz');PHSIG=sigOf(cd);return}L.classList.remove('hintonly');BK.classList.add('on');LSRC=cd;const cl=cd.cloneNode(true);cl.classList.remove('phz','sel','tgt','atk','bsel');cl.style.cssText=cl.style.cssText.replace(/z-index:[^;]*;?/,'').replace(/top:[^;]*;?/,'');cl.querySelectorAll('.sb').forEach(x=>x.remove());const fx=cl.querySelector('.fxp');let lx='';if(fx){lx=fx.innerHTML;fx.remove()}
 L.appendChild(cl);const side=document.createElement('div');side.className='lside';L.appendChild(side);if(lx){const d=document.createElement('div');d.className='lx';d.innerHTML=lx;side.appendChild(d)}
 const acts=document.createElement('div');acts.className='lacts';const addA=(txt,el)=>{const b=document.createElement('button');b.className='b';b.textContent=txt;b.addEventListener('click',ev=>{ev.stopPropagation();hideLoupe();PHBYP=1;try{el.click()}finally{PHBYP=0}});acts.appendChild(b)};
 const mine=cd.closest('.fp');if(mine){const ob=cd.querySelector('.ob[data-z]:not(.so)');if(ob)addA('💀 Offer for '+ob.textContent.replace(/\D/g,'')+' mana',ob);const sb=cd.querySelector('.sb[data-z]:not(.lk)');if(sb)addA(sb.classList.contains('d')?'⇄ Switch to Attack':'⇄ Switch to Defense',sb)}
 if(acts.children.length)side.appendChild(acts);
 const h=document.createElement('div');h.className='lh';h.textContent=cd.closest('.rmw')?'Tap again to choose this card':cd.closest('.lib')?'Tap anywhere to close':cd.closest('.hand')?'Tap the card again to play':cd.closest('.fp')?'Tap the card again to select':'Tap anywhere to close';side.appendChild(h);L.classList.add('on');cd.classList.add('phz');PHSIG=sigOf(cd)};
function upd(){const w=innerWidth,h=innerHeight,dev=(matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0||/[?&]ph=1/.test(location.search))&&Math.min(w,h)<=620,on=dev&&w>h;PHON=on;const r=document.documentElement.classList;r.toggle('ph',on);r.toggle('phl',on);r.toggle('phr',dev&&w<=h);if(!on)hideLoupe()}
upd();addEventListener('resize',()=>{upd();try{fit()}catch(e){}});addEventListener('orientationchange',upd);
document.addEventListener('click',e=>{if(!PHON||PHBYP)return;const t=e.target;if(t.id=='lbk')return;const wn=t.closest&&t.closest('.wn');if(wn){if(!WASSEL||!wn.dataset.b){e.stopPropagation();e.preventDefault()}return}if(t.closest&&t.closest('#loupe'))return;const cd=t.closest&&t.closest('.cd');
 if(!cd||!(cd.closest('.hand')||cd.closest('.fld')||cd.closest('.lib')||(document.documentElement.classList.contains('phl')&&cd.closest('.dcards')))){hideLoupe();return}
 if(cd.classList.contains('tgt')){hideLoupe();return}
 if(PHSIG&&PHSIG===sigOf(cd)){hideLoupe();return}
 e.stopPropagation();e.preventDefault();showLoupe(cd)},true);
let WASSEL=false;
const selNode=wn=>{document.querySelectorAll('.wn.phsel').forEach(x=>x.classList.remove('phsel'));wn.classList.add('phsel');let ni=document.querySelector('.ninfo');const tp=wn.querySelector('.tipx');if(!ni){const m=document.querySelector('.mapscr');if(!m)return;ni=document.createElement('div');ni.className='ninfo';m.appendChild(ni)}ni.innerHTML=(tp?tp.innerHTML:'')+(wn.dataset.b?'<div style="margin-top:4px;opacity:.8">Tap again to go here.</div>':'')};
document.addEventListener('pointerdown',e=>{if(!PHON)return;const wn=e.target.closest&&e.target.closest('.wn');WASSEL=!!(wn&&wn.classList.contains('phsel'))},true);
document.addEventListener('pointerup',e=>{if(!PHON)return;const wn=e.target.closest&&e.target.closest('.wn');if(wn&&!WASSEL)selNode(wn)},true);
document.addEventListener('touchstart',e=>{if(!PHON)return;const t=e.target;if(!(t.closest&&(t.closest('.cd')||t.closest('#loupe')||t.id=='lbk')))hideLoupe()},{passive:true});
L.addEventListener('click',e=>{if(e.target.closest('.lacts'))return;const src=LSRC,onCard=!!e.target.closest('.cd');e.stopPropagation();e.preventDefault();hideLoupe();if(onCard)actSrc(src)},true);
const R0=render;render=function(){try{hideLoupe()}catch(e){}const rv=R0.apply(this,arguments);try{document.documentElement.classList.toggle('phk',!!(PHON&&G&&G.phase=='kleos'))}catch(e){}if(PHON)try{document.querySelectorAll('.wn').forEach(w=>{if(!w.querySelector('.hit')){const i=document.createElement('i');i.className='hit';w.appendChild(i)}})}catch(e){}if(PHON)try{const K=.36;document.querySelectorAll('.fld .cd').forEach(x=>{const t=parseFloat(x.style.top)||0;if(t)x.style.top=(t*K).toFixed(1)+'px'})}catch(e){}if(PHON)try{const wk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let nd;while(nd=wk.nextNode()){const v=nd.nodeValue;if(/[Cc]lick|[Hh]over/.test(v)&&!nd.parentNode.closest('script,style'))nd.nodeValue=v.replace(/\bClick\b/g,'Tap').replace(/\bclick\b/g,'tap').replace(/\bClicking\b/g,'Tapping').replace(/\bhover(ing)? over\b/gi,'tap')}}catch(e){}if(PHON)try{document.querySelectorAll('.sb').forEach(x=>{if(x.textContent.includes(' form'))x.textContent=x.textContent.replace(' form','')})}catch(e){}return rv};
})()}catch(e){}

/* ===== Wukong expansion II: 20 more cards (pool 80) ===== */
Object.assign(D,{
wpyre:['Funeral Pyre',1,'E',0,0,'','Whenever one of your cards Disintegrates, deal 2 damage to the opponent.','🔥','R'],
wtree:['Immortal Peach Tree',2,'E',0,0,'','At the start of your turn, gain 2 life and shuffle a Heavenly Peach into your deck.','🌳','G'],
wnull:['Nothingness Monk',2,'C',1,3,'','Whenever one of your cards Disintegrates, it gets +1/+1 until end of turn.','🧎','U',1],
wburn:['Burn the Ledger',1,'S',0,0,'','Disintegrate the top card of your library. Deal damage to the opponent equal to its cost plus 1.','📜','R'],
wunravel:['Unravel Existence',2,'S',0,0,'','Deal damage to target opposing army member equal to the number of your cards that have Disintegrated this fight (at least 2).','🌫️','U'],
wskin:['Shed a Skin',0,'S',0,0,'','Counts as any type. Shuffle a Spare Hair into your deck. Draw a card.','🐍','U'],
wchamel:['Chameleon Monkey',1,'C',1,2,'','Counts as any type.','🦎','U',1],
wgate:['Jade Gate Guard',3,'C',1,5,'p','','🚪','W',2],
wgreat:['Great Wall Monkey',4,'C',2,6,'z','When it enters, gain 3 life.','🧱','W',3],
wbanq:['Peach Banquet',2,'S',0,0,'','Gain 2 life for each card you have played this turn (including this one).','🍑','G'],
wmist:['Mist Veil',2,'I',0,0,'','Tap all opposing army members.','🌫️','U'],
wgust:['Iron Fan Gust',2,'I',0,0,'',"Return target opposing army member to its owner's hand.",'🌬️','U'],
wunward:['Reveal the True Form',1,'S',0,0,'','Opposing army members lose Ward for the rest of the fight.','🔍','R'],
wrally:['Rally the Troops',2,'S',0,0,'','Each army member you control gets +1/+1 until end of turn (+2/+2 if you control 4 or more).','📣','W'],
wmillion:['Million Monkeys',5,'S',0,0,'','Put Clones of the Great Sage into play until your army is full (at most 3).','🐒','R'],
wqt:['Equal to Heaven',5,'C',4,6,'h','Whenever you play a card, it gets +1/+0 until end of turn.','👑','R',3],
wnez:['Nezha, the Lotus Prince',4,'C',4,3,'f','When it dies, return it to your hand.','🪷','R',3],
wsandy:['Sha Wujing, the Sand Monk',3,'C',2,5,'p','Whenever your Momentum rises, gain 1 life.','🏜️','U',2],
wpeachg:["Queen Mother's Banquet",4,'S',0,0,'','Gain 6 life. Shuffle 3 Peaches into your deck. Draw 2 cards.','🍑','G'],
wbigstaff:['Staff of Ten Thousand Jin',5,'S',0,0,'','Deal damage to the opponent equal to 4 plus your Momentum, and 3 damage to each opposing army member.','🦯','R']
});
[['any','wskin wchamel'],['tr','wpyre wtree wnull wbanq wunward wmillion wsandy wpeachg'],['st','wburn wunravel wrally wqt wbigstaff'],['lp','wgate wgreat wmist wgust wnez']].forEach(([t,x])=>x.split(' ').forEach(i=>{WT[i]=t;LORE[i]=(t=='any'?'Any type':WTN[t])+' · '+(({wnull:'Monk',wchamel:'Monkey',wgate:'Guard',wgreat:'Monkey',wqt:'Monkey king',wnez:'Prince',wsandy:'Pilgrim',wpyre:'Enchantment',wtree:'Enchantment'})[i]||'Spell')}));
LORE.wmist='Leap · Quick spell';LORE.wgust='Leap · Quick spell';
{const R={C:'wblock wclone wcounter wdance wdodge wdrink wfeint wfoot wgrow wpierce wpluck wvolley wwine wslip wspin wsent waugury wgate wstep wchamel',
U:'wlegion wmirm wcloudr whstorm wcloudh worchard wpeachc wpocket wseal wwind wtroop wacro wvang wrally wmist wgust wbear wpeachk wdrum wnull',
R:'wbreak wdisc wrout wtypes wunravel wburn wsmash wjug wecho wledger wfurn wpig wmirror wflurry wskin wbanq wchange wgreat wunward wcloudm',
L:'wking wmillion wqt wnez wpeachg wbigstaff wruyi wsix wheist wtang wmyriad wsplit wfan wxform wthou wcycle wmount wpyre wtree wsandy'};
 for(const r in R)R[r].split(' ').forEach(x=>{if(D[x])RAR[x]=r});
 const T={C:'wnull wlegion wmirm wgreat',W:'wrally wgate wqt wbigstaff wburn',T:'wskin wchamel wmist wgust wnez wsandy wpyre wtree wpeachg wbanq wunward wmillion wunravel'};for(const t in T)T[t].split(' ').forEach(x=>TAG[x]=t)}
var wkDis=function(s,c){s.dsp=(s.dsp||0)+1;const o=oppOf(s);s.bf.forEach(x=>{if(x.id=='wpyre'){o.life-=2;log('The Funeral Pyre flares: 2 damage to the opponent.')}if(x.id=='wnull'){x.ta=(x.ta||0)+1;x.td=(x.td||0)+1}})};
Object.assign(TS,{wunravel:'x',wgust:'x'});
Object.assign(SPA,{wmist:'fog',wgust:'gale'});
Object.assign(FX,{
wburn:(s,o)=>{const t=s.deck.pop();if(t){const d=D[t.id][1]+1+mg();o.life-=d;wkDis(s,t);log('Burn the Ledger: '+D[t.id][0]+' vanishes; the opponent takes '+d+'.')}},
wunravel:(s,o,t)=>{t.dmg+=Math.max(2,s.dsp||0)+mg()},
wskin:s=>{wkShuffle(s,'whair',1);draw(s,1+mg())},
wbanq:s=>{s.life+=2*Math.max(1,wkCp(s))+mg()},
wmist:(s,o)=>FX.fog(s,o),
wgust:(s,o,t)=>FX.gale(s,o,t),
wunward:(s,o)=>{cr(o).forEach(c=>{c.f=c.f.replace('w','')});log('The true forms are revealed: their army loses Ward.')},
wrally:s=>{const n=cr(s).length>=4?2:1;cr(s).forEach(c=>{c.ta=(c.ta||0)+n;c.td=(c.td||0)+n})},
wmillion:s=>{for(let i=0;i<3&&cr(s).length<5;i++){const c=mk('wclone');enter(s,c);c.sick=0}},
wpeachg:s=>{s.life+=6+mg();wkShuffle(s,'wpeach',3);draw(s,2)},
wbigstaff:(s,o)=>{const d=4+wkMo(s)+mg();o.life-=d;tg(o).forEach(c=>{c.dmg+=3});log('The Staff falls: '+d+' damage to the opponent, 3 to each of their army members.')}});
Object.assign(ETB,{wgreat:s=>{s.life+=3}});
Object.assign(DEATH,{wnez:{p:3,fn:s=>{s.hand.push(mk('wnez'));log('Nezha is reborn from the lotus and returns to your hand.')}}});
{const om=wkMom;wkMom=function(p){om(p);cr(p).forEach(c=>{if(c.id=='wsandy')p.life+=1})}}
{const op=wkPlay;wkPlay=function(p,c){op(p,c);cr(p).forEach(x=>{if(x.id=='wqt'&&x!==c)x.ta=(x.ta||0)+1})}}
CHARS.wukong.pool.push('wpyre','wtree','wnull','wburn','wunravel','wskin','wchamel','wgate','wgreat','wbanq','wmist','wgust','wunward','wrally','wmillion','wqt','wnez','wsandy','wpeachg','wbigstaff');
/* ===== Wukong bosses and the Iron Fan elite ===== */
Object.assign(D,{
mtrump:['The Second Self',1,'E',0,0,'w','Ward. The first army member you play each turn is mimicked: a copy joins their army if there is room, and vanishes for good when it dies.','👥','E'],
bfury:['Fury of the Bull',1,'E',0,0,'w','Ward. At the start of their turn, each of their army members gets +1/+0 until end of turn.','🐃','R'],
palm:['The Five-Finger Mountain',1,'E',0,0,'w','Ward. Each card you play after the third in a turn costs 2 more.','🏔️','E'],
ifan:['The Banana-Leaf Fan',1,'E',0,0,'w','Ward. At the start of their turn, the most expensive army member you control that costs 2 or more is blown back to your hand.','🪭','U'],
mmon:['Shadow Monkey',1,'C',1,2,'','','👥','E',1],
mape:['Mimic Ape',2,'C',3,2,'q','','🦧','E',1],
mear:['Listening Ear',3,'C',2,5,'','When it enters, draw a card.','👂','E',2],
mac6:['The Six-Eared Macaque',4,'C',5,5,'z','','🐵','E',3],
mecho:['Echo of the Staff',2,'S',0,0,'','Deal 3 damage to target army member.','🦯','E'],
bgrd:['Bull Guard',2,'C',2,4,'','','🐂','R',1],
bcap:['Buffalo Captain',3,'C',4,4,'r','','🐃','R',2],
bhrn:['Horned Vanguard',4,'C',5,4,'h','','🦬','R',2],
bdk:['The Bull Demon King',5,'C',6,7,'z','','👹','R',3],
pdis:['Stone Disciple',1,'C',1,3,'','','🗿','A',1],
pfin:['Finger of the Mountain',2,'C',2,5,'p','','☝️','A',1],
pgrd:['Mountain Warden',3,'C',3,6,'','','⛰️','A',2],
plm:["The Buddha's Palm",5,'C',5,9,'z','','🖐️','A',3],
iwnd:['Wind Spirit',1,'C',2,1,'f','','🌬️','U',1],
imaid:['Fan Maiden',2,'C',2,3,'','','🪭','U',1],
iguard:['Palm-Leaf Guard',3,'C',3,4,'p','','🛡️','U',2],
iprin:['Princess Iron Fan',4,'C',4,5,'z','','👸','U',3]
});
Object.assign(SPA,{mecho:'javel'});Object.assign(FX,{mecho:FX.javel});Object.assign(TS,{mecho:'c'});
MT.push('mtrump','bfury','palm','ifan');['mtrump','bfury','palm','ifan'].forEach(k=>IV[k]=40);
Object.assign(LORE,{mtrump:'Opening trump',bfury:'Opening trump',palm:'Opening trump',ifan:'Opening trump',mmon:'Shadow',mape:'Mimic',mear:'Spy',mac6:'False Sage',bgrd:'Bull demon',bcap:'Bull demon',bhrn:'Bull demon',bdk:'Demon king',pdis:'Stone disciple',pfin:'Mountain finger',pgrd:'Mountain warden',plm:'The Buddha',iwnd:'Wind spirit',imaid:'Fan maiden',iguard:'Fan guard',iprin:'Rakshasa'});
{const b0=BOSS.length;
BOSS.push(
{n:'The Six-Eared Macaque',ic:'🐵',l:20,sc:[0,0,0],trump:'mtrump',d:ids('mmon:3,mape:3,mear:2,mac6,mecho'),
 lore:`When the Great Sage returned to the Western road, a second Sun Wukong stood beside the pilgrim, matching him in staff, face and temper, and not even the Bodhisattva could tell them apart. The Macaque of the six ears hears every whisper in heaven, and he learns each of your moves the moment you make it. Whatever you send first onto the field he mirrors, one shadow for each turn, though a shadow that falls does not rise again. Only the Buddha's own ear could name the true one, because the false Sage can copy a body but never the order of its plans. Send a small thing ahead of the great one, or strike with spells that cast no shadow at all.`},
{n:'The Bull Demon King',ic:'👹',l:24,sc:[0,0,0],trump:'bfury',d:ids('bgrd:3,bcap:3,bhrn:2,bdk,rflm:2'),
 lore:`The Bull Demon King was sworn brother to the Monkey King for five hundred years, and styled himself the Great Sage Who Pacifies Heaven. Every dawn his rage is rekindled, and each of his horned captains charges with the strength of two. That fury burns only through the hours of his own turn, so a wall thick enough will break it as a wave breaks on stone. His hide is the toughest in the west, and no single blow has ever felled him at his strongest. Meet the charge on ground you choose, and strike his lines while his fury sleeps.`},
{n:"The Buddha's Palm",ic:'🖐️',l:24,sc:[0,0,0],trump:'palm',d:ids('pdis:3,pfin:3,pgrd:2,plm,cocn,hbot'),
 lore:`After the Monkey King boasted that he could leap to the ends of the earth, the Buddha laid out his palm and bade him try. Five pillars of flesh rose to the sky, and the Sage, who thought he had reached the world's edge, had only scrawled his name on a finger. The mountain does not hurry, and it answers a crowd with the same stillness as a single man. Those who swarm it find their third step easy and their fourth heavy, as if the whole sky leaned upon them. Choose three deeds well and let each one count.`});
CHARS.wukong.bo=[b0,b0+1,b0+2]}
ELITES.push({n:'Princess Iron Fan',l:17,ic:'🪭',hint:'Her fan blows your priciest army member back to your hand every turn: win with cheap bodies and spells',bg:['#1c1226','#b88ad0'],d:ids('iwnd:2,imaid:3,iguard:2,iprin,hnet'),mt:'ifan'});
CHARS.wukong.el.push(ELITES.length-1);
function pcx(c){if(!G||!G.e||!G.p||!G.e.bf||!G.p.hand)return 0;return (G.p.cp||0)>=3&&G.p.hand.includes(c)&&G.e.bf.some(x=>x.id=='palm')?2:0}
function bossStart(){const e=G.e,p=G.p;if(!e||!e.bf||!p)return;
 if(e.bf.some(x=>x.id=='bfury')){cr(e).forEach(c=>{c.ta=(c.ta||0)+1});if(cr(e).length)log("The Bull Demon King's fury surges: their army members get +1/+0 until end of turn.")}
 if(e.bf.some(x=>x.id=='ifan')){const L=cr(p).filter(x=>D[x.id][1]>=2).sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));if(L.length){log('The Iron Fan gusts: '+D[L[0].id][0]+' is blown back to your hand.');bounce(L[0])}}}
{const op=wkPlay;wkPlay=function(p,c){op(p,c);const e=G.e;if(p===G.p&&D[c.id][2]=='C'&&e&&e.bf&&e.bf.some(x=>x.id=='mtrump')&&e.mcT!==G.turn){e.mcT=G.turn;if(cr(e).length<5){const n=mk(c.id);n.dis=1;enter(e,n);n.sick=1;log('The Six-Eared Macaque mimics '+D[c.id][0]+'.')}}}}
/* ===== deck balance at the common health ===== */
CHARS.odin.en[0].d=ids('pup:2,wolf:3,hati,skoll,fenr');
CHARS.odin.en[1].d=ids('ithrl:4,rimew:3,hgnt,icesp');
CHARS.odin.en[4].d=ids('draug:4,wight:2,hgrd:3,nidh,hgrasp:2');
CHARS.ody.en[3].d=ids('shade1:2,mourner:3,warden,libation,pit');
CHARS.ody.en[4].d=ids('oarsman:2,navig:3,phguard:3,nausi,alcinous,sails,gift,tide,trident');
CHARS.ody.en[2].d=ids('sheep:4,cscout:2,cave,brute:2,elder,poly:2,hurl:2,club');
D.spd2[3]=3;D.spd2[4]=4;D.spd3[3]=4;D.spdq[3]=5;
CHARS.wukong.en[0].d=ids('spd1:5,spd2:3,spd3:2,spdq:2,cocn:2');
CHARS.wukong.en[3].d=ids('rimp:3,rgrd:4,rspr:1,rboy:1,rflm:1');
CHARS.wukong.en[5].d=ids('ybat:3,ytig:3,ydef:3,ygen:1,ygale:2');
CHARS.wukong.en[1].d=ids('hsol:3,hcap:3,hsil:2,hgol,hrope,hbot');
CHARS.wukong.en[2].d=ids('hsd:1,hhd:2,hgn:2,hnz:2,hpg:2,hbot');
D.bsk[4]=2;D.ybat[4]=2;
