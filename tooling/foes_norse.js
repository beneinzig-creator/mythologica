/* ===== Odin's realm, the Nine Worlds: every opponent rebuilt around one theme (lore: tooling/lore/norse.js + the Lore session's briefs) ===== */

/* ---------- Fenrir's Brood: a pack that grows every night; Gleipnir holds the wolf until the end ---------- */
const fWolves=(s,ex)=>cr(s).filter(x=>x!==ex&&has(x,'j'));
F('pup',{c:1,a:1,h:2,f:'j',tag:'wolf',t:'Pack. Iron Wood brood: when it dies, the pack howls and their other wolves get +1/+0 permanently.',die:s=>{const L=fWolves(s);L.forEach(x=>{x.pa++});if(L.length)log('The pack howls for a fallen pup.')}});
F('wolf',{c:2,a:2,h:3,f:'j',tag:'wolf',t:'Pack. When it enters, a Wolf Pup joins it.',etb:s=>fSum(s,'pup',1)});
F('hati',{c:3,a:3,h:4,f:'ja',tag:'wolf',t:'Pack. Range. The moon-chaser: at the start of their turn, your army member with the least health takes 1 damage.',up:(s,o)=>{const t=cr(o).slice().sort((a,b)=>fHp(a)-fHp(b))[0];if(t){t.dmg+=1;log('Hati chases '+fNm(t)+'.')}}});
F('skoll',{c:3,a:3,h:3,f:'jh',tag:'wolf',t:'Pack. Charge. The sun-chaser: gets +2/+0 while Hati runs with it.',self:c=>[sideOf(c).bf.some(x=>x.id=='hati')?2:0,0]});
F('fenr',{c:5,a:5,h:5,f:'jb',tag:'wolf',t:'Pack. Bulldoze. He keeps growing: at the start of their turn, +1/+1 permanently. Gleipnir holds him: he can\'t attack before their sixth turn.',
 up:(s,o,c)=>{c.pa++;c.pd++;if(G.turn<6){c.sick=1}else if(!c.free6){c.free6=1;log('Gleipnir snaps: Fenrir is loose.')}},etb:(s,o,c)=>{if(G.turn<6)c.sick=1}});
DK("Fenrir's Brood",{d:'pup:5,wolf:5,hati,skoll,fenr',hint:'A pack that grows every turn; Fenrir breaks free on their sixth turn'});

/* ---------- The Jotnar: FIMBULWINTER. Winters with no summer between (two at most since the 2026-11-27 open tuning); the giants thrive in it ---------- */
const fWinter=s=>Math.min(2,s.winter||0);
const fDeepen=(s,n)=>{const w=fWinter(s);s.winter=Math.min(2,(s.winter||0)+n);if(s.winter>w)log('Fimbulwinter deepens: winter '+s.winter+' of 2.')};
F('rwall',{t:'Ward. Fimbulwinter: on every second turn of theirs the winter deepens (two winters at most). Their Hill Giants and Ice Spears grow stronger with each winter. Whenever a Rime-Witch dies, the winter eases by 1.',
 up:s=>{s.wt=(s.wt||0)+1;if(s.wt%2==0)fDeepen(s,1)}});
F('ithrl',{c:1,a:1,h:3,f:'c',tag:'giant',t:'Giant. When it dies, the winter deepens by 1.',die:s=>fDeepen(s,1)});
F('rimew',{c:2,a:2,h:3,f:'c',tag:'giant',t:'Giant. Rime-sorcery: while any Rime-Witch lives, your army members get -1/-0. When it enters, your weakest army member takes 1 damage for each winter. When it dies, the winter eases by 1.',oaura:(x,c)=>{const s=sideOf(c);return[s&&s.bf.find(y=>y.id=='rimew')===c?-1:0,0]},etb:(s,o)=>{const t=fLow(cr(o)),n=fWinter(s);if(t&&n){t.dmg+=n;log('Rime-sorcery: '+fNm(t)+' takes '+n+'.')}},die:s=>{if(s.winter>0){s.winter=Math.min(3,s.winter)-1;log('The witch falls: the winter eases ('+s.winter+' of 3).')}}});
F('hgnt',{c:2,a:2,h:5,f:'cz',tag:'giant',t:'Giant. Resilient. Born of the frost: +1/+1 for each winter.',self:c=>{const n=fWinter(sideOf(c));return[n,n]}});
F('icesp',{c:2,t:'Ice Spear: deal 2 damage plus 1 for each winter to target army member.',ai:(s,o)=>fAiKill(o,2+fWinter(s),2.5),fx:(s,o,t)=>{if(t)t.dmg+=2+fWinter(s)}});
DK('The Jotnar',{d:'ithrl:5,rimew:5,hgnt:3,icesp:2',hint:'The winter deepens and the giants grow in it; while a Rime-Witch lives your army is weakened. Kill the witches'});

/* ---------- The Dwarven Forge: treasures forged one by one ---------- */
const fItems=s=>s.bf.filter(x=>!isC(x)&&'A'.includes(D[x.id][2])).length;
F('dmin',{c:1,a:1,h:2,f:'t',tag:'dwarf',t:'Forged. Ore for the forge: when it dies, they draw a card.',die:s=>draw(s,1)});
F('dsmith',{c:2,a:1,h:3,f:'t',tag:'dwarf',t:'Forged. At the start of their turn, if they have an item, their weakest army member gets +1/+1 permanently.',up:(s,o,c)=>{if(!fItems(s))return;const t=fLow(cr(s));if(t){t.pa++;t.pd++;log('A Dwarf Smith arms '+fNm(t)+'.')}}});
F('dxbow',{c:2,a:2,h:2,f:'ta',tag:'dwarf',t:'Forged. Range. When it enters, target opposing army member takes 1 damage for each item they have (at most 3).',
 etb:(s,o)=>{const n=Math.min(3,fItems(s));if(!n)return;const t=fTop(fTg(o).filter(x=>fHp(x)<=n))||fTop(fTg(o));if(t){t.dmg+=n;log('Dwarven bolts strike '+fNm(t)+'.')}}});
F('brokk',{c:3,a:2,h:4,f:'t',tag:'dwarf',t:'Forged. He works the bellows: when it enters, they draw a card. Their other Forged army members get +1/+0.',etb:s=>draw(s,1),aura:x=>[has(x,'t')?1:0,0]});
F('golem',{c:4,a:3,h:6,f:'tz',tag:'dwarf',t:'Forged. Resilient. Gets +1/+1 for each item they have.',self:c=>{const n=fItems(sideOf(c));return[n,n]}});
DK('The Dwarven Forge',{d:'dmin:2,dsmith:4,dxbow:4,brokk,golem,anvl,dshld,drpn,dbolt',hint:'Every treasure they forge arms their whole army'});

/* ---------- Muspelheim: the fire at the end, which no one unarmed survives ---------- */
F('ember',{c:1,a:2,h:1,f:'hu',tag:'fire',t:'Charge. Brief like all fire: when it dies, you take 1 damage.',die:(s,o)=>fHurt(o,1)});
F('fraid',{c:2,a:3,h:2,f:'hu',tag:'fire',t:'Charge. When it deals combat damage to you, one of your items or modifiers burns (destroyed); if you have none, you take 1 more.',
 hit:(s,o)=>{const L=o.bf.filter(x=>!isC(x)&&!has(x,'w'));const t=fRnd(L);if(t){o.bf.splice(o.bf.indexOf(t),1);bury(o,t);try{amFall()}catch(e){}log('The Flame Raider burns '+fNm(t)+'.')}else fHurt(o,1)}});
F('lava',{c:2,a:2,h:3,f:'ru',tag:'fire',t:'Ruthless. When it attacks, your untapped army member with the least health takes 1 damage.',atk:(s,o)=>{const t=cr(o).filter(x=>!x.tap).sort((a,b)=>fHp(a)-fHp(b))[0];if(t)t.dmg+=1}});
F('mgnt',{c:3,a:4,h:4,f:'ru',tag:'fire',t:'Ruthless. The bridge breaks under them: when it attacks, it takes 1 damage and you take 1.',atk:(s,o,c)=>{c.dmg+=1;fHurt(o,1,'Bifröst burns. ')}});
F('surtr',{c:4,a:5,h:5,f:'rhu',tag:'fire',t:'Ruthless. Charge. Freyr had given away his sword: when it enters, each of your army members with power 1 or less dies. Their other fire army members get +1/+0.',
 etb:(s,o)=>{const L=cr(o).filter(x=>pw(x)<=1);L.forEach(fDestroy);if(L.length)log('Surtr\'s sword falls on the unarmed.')},aura:x=>[has(x,'u')?1:0,0]});
DK('Muspelheim',{d:'ember:3,fraid:3,lava:2,mgnt:2,surtr,fbolt:2,mspear',hint:'A race against fire: they burn your gear, the bridge and themselves'});

/* ---------- Hel's Legion: NAGLFAR. The ship of nails is built from their own dead; the draugr rise again ---------- */
F('corp',{t:'Ward. Naglfar, the ship of nails: whenever one of their army members dies, a nail is added. At 8 nails Naglfar sails: their army gets +2/+0 and Charge permanently.',
 allyDie:(s,o,c,x)=>{if(s.sailed)return;s.nails=(s.nails||0)+1;if(s.nails>=8){s.nails=8;s.sailed=1;cr(s).forEach(y=>{y.pa+=2;fKey(y,'h')});log('Naglfar sails from the dead: Hel\'s army surges (+2/+0, Charge).')}else log('A nail for Naglfar ('+s.nails+' of 8).')},
 allyEnter:(s,o,c,x)=>{if(s.sailed){x.pa+=2;fKey(x,'h')}}});
F('draug',{c:1,a:1,h:3,f:'',tag:'hel',t:'When it dies, it rises again: a Risen Draugr goes into their hand.',die:s=>{s.hand.push(mk('draug2'));log('The Draugr rises from its barrow.')}});
F('wight',{c:2,a:2,h:2,f:'d',tag:'hel',t:'Draining. The barrow-dead grow heavy: +1/+1 for each Draugr in their graveyard (at most +2/+2).',self:c=>{const n=Math.min(2,sideOf(c).gy.filter(x=>x.id=='draug'||x.id=='draug2').length);return[n,n]}});
F('hgrd',{c:2,a:2,h:4,f:'z',tag:'hel',t:'Resilient. A guard of Hel\'s hall: when it dies, it drives two nails into Naglfar instead of one.',die:s=>{if(!s.sailed)s.nails=(s.nails||0)+1}});
F('nidh',{c:4,a:4,h:5,f:'dv',tag:'hel',t:'Draining. Venomous. It gnaws the corpses: at the start of their turn, it eats a card from your graveyard and gets +1/+1.',up:(s,o,c)=>{if(!o.gy.length)return;const x=o.gy.splice(Math.random()*o.gy.length|0,1)[0];c.pa++;c.pd++;log('Nidhogg gnaws '+fNm(x)+' in your graveyard.')}});
DK("Hel's Legion",{d:'draug:5,wight:3,hgrd:4,nidh,hgrasp:2',hint:'Every one of their dead is a nail for Naglfar; at eight, the ship of the dead sails'});

/* ---------- Loki's Court: your own cards turned against you ---------- */
F('imp',{c:2,a:2,h:3,f:'',tag:'loki',t:'Mischief: when it enters, your strongest army member\'s power and health are swapped.',
 etb:(s,o)=>{const t=fTop(fTg(o));if(!t)return;const p=pw(t),h=Math.max(1,fHp(t));t.pa+=h-p;t.pd+=p-h;t.dmg=Math.min(t.dmg,Math.max(0,th(t)-1));log('A Sly Imp swaps '+fNm(t)+'\'s power and health.')}});
F('lokis',{c:5,a:4,h:5,f:'',tag:'loki',t:'Höðr\'s hand: when it enters, your strongest army member strikes another of yours for damage equal to its power, then returns to your hand. They draw a card.',
 etb:(s,o)=>{const L=cr(o).slice().sort((a,b)=>pw(b)-pw(a));const a=L[0],b=L.find(x=>x!==a&&!has(x,'w'));if(a&&b){b.dmg+=pw(a);log('Loki puts the mistletoe in '+fNm(a)+'\'s hand: it strikes '+fNm(b)+'.')}if(a&&!has(a,'w'))bounce(a);draw(s,1)}});
F('lokib',{c:3,t:'The insults of Lokasenna: deal 1 damage to target army member for each card in your hand (at most 4).',
 ai:(s,o)=>fAiKill(o,Math.min(4,o.hand.length),2.5),fx:(s,o,t)=>{if(t)t.dmg+=Math.min(4,o.hand.length)}});
F('skinw',{c:3,a:3,h:3,f:'',tag:'loki',t:'Shapeshifter: when it enters, it takes the shape of your strongest army member, copying its power, health and keywords.',
 etb:(s,o,c)=>{const t=fTop(cr(o));if(!t)return;c.pa+=pw(t)-pw(c);c.pd+=th(t)-th(c);for(const k of (t.f||''))if('fwhzsrvdxbyqpa'.includes(k))fKey(c,k);log('The Skin-Changer takes the shape of '+fNm(t)+'.')}});
DK("Loki's Court",{d:'lrav:2,imp:5,skinw:2,lokis,lsnare,lcurse,lgale:2,lokib:2',hint:'Swaps, stolen shapes and tricks that turn your own army against you'});

/* ---------- The Norns: what is carved happens ---------- */
F('nspin',{c:1,a:1,h:3,f:'',tag:'norn',t:'She carves a fate: when it enters, your weakest army member is doomed (-1/-1 permanently).',etb:(s,o)=>{const t=fLow(cr(o));if(t){t.pa--;t.pd--;log('A Thread-Spinner carves '+fNm(t)+'\'s doom.')}}});
F('nwarr',{c:2,a:3,h:3,f:'r',tag:'norn',t:'Ruthless. Fated: when it dies, Skuld foretells what comes next: their costliest army member in hand costs 1 less.',die:s=>{const x=s.hand.filter(isC).sort((a,b)=>cost(b)-cost(a))[0];if(x){x.disc=(x.disc||0)+1;log('Skuld foretells: '+fNm(x)+' comes sooner.')}}});
DK('The Norns',{d:'urd,verd:2,skuld,nspin:5,nwarr:4,ndoom'});

/* ---------- Fáfnir: the hoard grows and the dragon with it ---------- */
F('fgrd',{c:1,a:1,h:2,f:'',tag:'hoard',t:'It lies on the gold: when it enters, it adds another Gold to the Hoard.',etb:(s,o,c)=>{try{hoardAdd(s,c)}catch(e){}}});
F('fworm',{c:2,a:3,h:2,f:'r',tag:'hoard',t:'Ruthless. Poison breath: when it attacks, your army member with the least health takes 1 damage.',atk:(s,o)=>{const t=cr(o).slice().sort((a,b)=>fHp(a)-fHp(b))[0];if(t)t.dmg+=1}});
F('regin',{c:3,a:3,h:4,f:'',tag:'hoard',t:'When it enters, they draw a card. An ally of convenience: when Fáfnir dies, Regin turns on them and leaves.',
 etb:s=>draw(s,1),allyDie:(s,o,c,x)=>{if(x.id=='fafn'){fDestroy(c);log('Regin wanted the gold all along: he leaves the field.')}}});

/* ---------- Jörmungandr: the tide takes back ---------- */
F('jsnk',{c:1,a:1,h:3,f:'v',tag:'serp',t:'Venomous. The sea takes back: when it dies, it is shuffled into their deck.',die:(s,o,c)=>{const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,pa:0,pd:0});s.deck.splice(Math.random()*(s.deck.length+1)|0,0,c)}}});
F('jcrw',{c:3,a:3,h:5,f:'z',tag:'serp',t:'Resilient. Its coils: after it blocks an army member, the tide carries that army member back to your hand.',
 blk:(s,o,c)=>{const cm=G.cmbLast;if(!cm)return;for(const[a,b]of Object.entries(cm.blk||{}))if(b==c.u){const A=o.bf.find(x=>x.u==a);if(A&&!has(A,'w'))bounce(A)}}});

/* ---------- The Wild Hunt: the quarry is marked and carried off ---------- */
F('hhnd',{c:1,a:2,h:1,f:'h',tag:'hunt',t:'Charge. The hounds find the quarry: when it enters, the Quarry is tapped.',etb:(s,o)=>{const t=cr(o).find(x=>x.qy);if(t)fTap(t)}});
F('hrdr',{c:2,a:3,h:2,f:'f',tag:'hunt',t:'Flying. When it deals combat damage to you, your weakest army member is carried off (returned to your hand).',hit:(s,o)=>{const t=fLow(cr(o).filter(x=>!has(x,'w')));if(t){bounce(t);log('The Phantom Rider carries off '+fNm(t)+'.')}}});
F('hwld',{c:2,a:3,h:3,f:'',tag:'hunt',t:'The taken ride with the Hunt: whenever one of your army members dies, it gets +1/+1 permanently.',oppDie:(s,o,c)=>{c.pa++;c.pd++}});
F('hmst',{c:3,a:4,h:4,f:'fh',tag:'hunt',t:'Flying. Charge. Master of the ghost-ride: their other riders and hounds get +1/+0.',aura:x=>[FOE[x.id]&&FOE[x.id].tag=='hunt'?1:0,0]});

/* ---------- Hrungnir: the duel ---------- */
F('htrl',{c:2,a:3,h:3,f:'',tag:'stone',t:'Stone kin: when it enters, it hurls a rock and your weakest army member takes 1 damage.',etb:(s,o)=>{const t=fLow(cr(o));if(t)t.dmg+=1}});
F('hgrt',{c:3,a:4,h:4,f:'',tag:'stone',t:'When it dies, it shatters into gravel: each opposing army member takes 1 damage.',die:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})}});
