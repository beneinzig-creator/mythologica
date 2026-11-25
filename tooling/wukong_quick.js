/* ===== Sun Wukong, "quick and many" pass: cheaper cards, Spare Hairs and Peaches into the hand, fewer draw-for-cards-played ===== */
const wkHand=(s,id,n)=>{for(let i=0;i<n;i++){const c=mk(id);s.hand.push(c);try{flyIn(c,s)}catch(e){}}};
const wkSet=(id,cost,text)=>{const d=D[id];if(!d)return;if(cost!=null)d[1]=cost;if(text!=null){d[6]=text;delete TXT[id]}};
const wkBreath=s=>s.bf.filter(x=>x.id=='wbreath').length+(s.hb||0);

/* --- new: Breath of Transformation (modifier) --- */
D.wbreath=['Breath of Transformation',1,'E',0,0,'','Your Spare Hairs deal 1 more damage. (Each copy adds 1.)','💨','R'];
WT.wbreath='tr';LORE.wbreath='Trick · Enchantment';RAR.wbreath='R';TAG.wbreath='C';IV.wbreath=6;
if(!CHARS.wukong.pool.includes('wbreath'))CHARS.wukong.pool.push('wbreath');

/* --- Spare Hairs: damage grows with the Breath; count them for the hair payoffs --- */
FX.whair=(s,o,t)=>wkHit(o,t,1+wkBreath(s));
wkSet('whair',null,'Deal 1 damage to target opposing army member or the opponent. Disintegrate.');
const wkIsHair=c=>!!c&&(c.id=='whair'||c.id=='wdart');
{const _p=wkPlay;wkPlay=function(p,c){const r=_p.apply(this,arguments);try{if(wkIsHair(c))p.hp=(p.hp||0)+1}catch(e){}return r}}
{const _u=wkUp;wkUp=function(s){const r=_u.apply(this,arguments);try{if(s===G.p){s.hp=0;s.hb=0;s.fcp=-1}}catch(e){}return r}}

/* --- hair makers: straight into your hand --- */
wkSet('wpluck',1,'Add 2 Spare Hairs to your hand.');FX.wpluck=s=>wkHand(s,'whair',2+mg());UPS.wpluck=n=>`Add ${2+n} hairs`;
wkSet('wthou',2,'Add 3 Spare Hairs to your hand.');FX.wthou=s=>wkHand(s,'whair',3+mg());UPS.wthou=n=>`Add ${3+n} hairs`;
wkSet('wskin',0,'Counts as any type. Add a Spare Hair to your hand.');FX.wskin=s=>wkHand(s,'whair',1+mg());
wkSet('wclone',1,'When it dies, add a Spare Hair to your hand.');DEATH.wclone={p:2,fn:s=>{wkHand(s,'whair',1);log('The Clone vanishes in a puff of hair: a Spare Hair returns to your hand.')}};
wkSet('wtroop',1,'When it enters, add a Spare Hair to your hand.');D.wtroop[3]=1;D.wtroop[4]=1;ETB.wtroop=s=>wkHand(s,'whair',1);
wkSet('wlegion',2,'When it enters, add 2 Spare Hairs to your hand.');ETB.wlegion=s=>wkHand(s,'whair',2);
wkSet('wmirm',1,'When it dies, add a Spare Hair to your hand.');D.wmirm[3]=1;D.wmirm[4]=2;DEATH.wmirm={p:2,fn:s=>{wkHand(s,'whair',1);log('The mirror-monkey shatters into hairs.')}};
wkSet('wcloudh',1,'Add a Spare Hair to your hand for every 2 cards you have played this turn (at least 1).');FX.wcloudh=s=>wkHand(s,'whair',Math.max(1,Math.floor(wkCp(s)/2))+mg());UPS.wcloudh=n=>`+${n} hair`;

/* --- hair payoffs --- */
wkSet('wvolley',1,'Deal 1 damage to target opposing army member for each Spare Hair you have played this turn (at least 1).');FX.wvolley=(s,o,t)=>{t.dmg+=Math.max(1,s.hp||0)+mg()};UPS.wvolley=n=>`+${n} damage`;
wkSet('whstorm',2,'Deal 1 damage to each opposing army member. Your Spare Hairs deal 1 more damage this turn.');FX.whstorm=(s,o)=>{const n=1+mg();tg(o).forEach(c=>{c.dmg+=n});s.hb=(s.hb||0)+1};UPS.whstorm=n=>`${1+n} damage`;

/* --- Peaches into the hand. A Peach is now pure tempo: gain 1 mana (no draw) --- */
wkSet('wpeach',null,'Gain 1 mana. Disintegrate.');FX.wpeach=s=>{s.mana+=1};
wkSet('worchard',1,'Add a Peach to your hand.');FX.worchard=s=>wkHand(s,'wpeach',1+mg());UPS.worchard=n=>`+${n} peach`;
wkSet('wpeachc',2,'Add 2 Peaches to your hand.');FX.wpeachc=s=>wkHand(s,'wpeach',2+mg());UPS.wpeachc=n=>`Add ${2+n} peaches`;
wkSet('wpeachk',1,'When it enters, add a Peach to your hand.');ETB.wpeachk=s=>wkHand(s,'wpeach',1);
wkSet('wtree',null,'At the start of your turn, gain 2 life and add a Peach to your hand.');
{const _u=wkUp;wkUp=function(s){if(s===G.p&&s.bf.some(x=>x.id=='wtree')){const b=s.bf;const L=b.filter(x=>x.id=='wtree');L.forEach(x=>b.splice(b.indexOf(x),1));const r=_u.apply(this,arguments);b.push(...L);s.life+=2*L.length;wkHand(s,'wpeach',L.length);log('The Peach Tree blooms: you gain 2 life and pick a Peach.');return r}return _u.apply(this,arguments)}}

/* --- enablers instead of draw --- */
wkSet('wfeint',0,'The next card you play this turn costs 1 less.');FX.wfeint=s=>{s.fcp=s.cp||0;s.fd=1+mg()};UPS.wfeint=n=>`Costs ${1+n} less`;
{const _c=pcx;pcx=function(c){let r=_c.apply(this,arguments);try{const p=G.p;if(p&&p.hand&&p.hand.includes(c)&&p.fcp>=0&&(p.cp||0)===p.fcp&&c.id!='wfeint')r-=Math.min(p.fd||1,Math.max(0,D[c.id][1]+r))}catch(e){}return r}}
wkSet('wfoot',0,'If you have played 2 or more other cards this turn, gain 1 mana.');FX.wfoot=s=>{if(wkCp(s)>=3)s.mana+=1+mg()};

/* --- cheaper across the board --- */
[['wsent',1],['wacro',1],['wdrum',1],['wchange',1],['wheist',1],['wgate',2],['wdisc',2]].forEach(([k,c])=>wkSet(k,c));
wkSet('wsent',null,'Can only defend. A sentry that never sleeps.');
CHARS.wukong.play='Play many cheap cards in a turn: chain Strikes, Tricks and Leaps to build Momentum. Spare Hairs and Peaches come straight to your hand to keep the chain going, and Disintegrated cards vanish for good. A swarm of small monkeys and a hand full of spells. 20 life.';

/* --- Peach-Pit Augury: read the pits in your hand --- */
wkSet('waugury',0,'Read the pits: your Momentum rises by 1 for each Spare Hair and Peach in your hand (at most 3).');
FX.waugury=s=>{const n=Math.min(3+mg(),s.hand.filter(x=>wkIsHair(x)||x.id=='wpeach').length);for(let i=0;i<n;i++){s.mo=(s.mo||0)+1;wkMom(s)}if(n)log('The peach pits foretell: your Momentum rises by '+n+'.')};
UPS.waugury=n=>`At most ${3+n}`;

/* --- "Counts as any type" cards are true wildcards for Full Circle and Three Forms: they fill whichever type is missing --- */
{const _p=wkPlay;wkPlay=function(p,c){const r=_p.apply(this,arguments);try{if(c){const t=WT[c.id];if(t==='any')p.wild=(p.wild||0)+1;else if(t){(p.rty=p.rty||{})[t]=1}}}catch(e){}return r}}
{const _u=wkUp;wkUp=function(s){const r=_u.apply(this,arguments);try{if(s===G.p){s.wild=0;s.rty={}}}catch(e){}return r}}
const wkTypesN=s=>Math.min(3,Object.keys(s.rty||{}).length+(s.wild||0));
FX.wcycle=(s,o)=>{if(wkTypesN(s)>=3){const d=4+mg();o.life-=d;log('Full Circle: '+d+' damage to the opponent.')}};
FX.wtypes=(s,o,t)=>{t.dmg+=wkTypesN(s)+mg()};
wkSet('wcycle',null,'If you have played a Strike, a Trick and a Leap this turn (including this card), deal 4 damage to the opponent. Cards that count as any type fill in a missing one.');
wkSet('wtypes',null,'Deal damage to target opposing army member equal to the number of different types (Strike, Trick, Leap) you have played this turn. Cards that count as any type fill in a missing one.');

/* --- the starting Hair Dart is a Spare Hair: it counts for every hair synergy, and it stays in your deck (no Disintegrate) --- */
D.wdart[0]='Spare Hair';wkSet('wdart',null,'Deal 1 damage to target opposing army member or the opponent. It is a Spare Hair, but it stays in your deck.');
FX.wdart=(s,o,t)=>wkHit(o,t,1+mg()+wkBreath(s));

/* --- Zhu Bajie, the Pig: gluttony --- */
wkSet('wpig',null,'Gluttony: when it enters, add a Peach to your hand.');ETB.wpig=s=>wkHand(s,'wpeach',1);
