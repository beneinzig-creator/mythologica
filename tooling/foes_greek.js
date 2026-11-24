/* ===== Odysseus's realm: the hand-built decks keep their engines; every keyword-only army member gets an ability from its story ===== */
const fBackToDeck=(s,c)=>{const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,pa:0,pd:0,rs:0});s.deck.splice(Math.random()*(s.deck.length+1)|0,0,c)}};
const fBackToHand=(s,c)=>{const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0});s.hand.push(c)}};

/* ---------- The Lotus-Eaters: they do not plan your death; they make you forget ---------- */
F('isl',{c:1,a:2,h:3,f:'q',tag:'lotus',t:'Opportunist. It offers the lotus: when it enters, your weakest untapped army member falls asleep (tapped).',etb:(s,o)=>{const t=fLow(cr(o).filter(x=>!x.tap));if(t){fTap(t);log(fNm(t)+' tastes the lotus and falls asleep.')}}});
F('lot',{c:2,a:3,h:4,f:'rq',tag:'lotus',t:'Ruthless. Opportunist. Forgetting the way home: when it deals combat damage to you, a random card in your hand is forgotten and shuffled back into your deck.',
 hit:(s,o)=>{const x=fRnd(o.hand);if(x){o.hand=o.hand.filter(y=>y!==x);o.deck.splice(Math.random()*(o.deck.length+1)|0,0,x);log('You forget '+fNm(x)+': it is lost somewhere in your deck.')}}});
F('reaper',{c:3,a:3,h:4,f:'xq',tag:'lotus',t:'Siege. Opportunist. It keeps the sleepers asleep: an army member it deals combat damage to doesn\'t untap next turn.',dmgOut:(c,n,t)=>{if(t&&n>0&&sideOf(t)!==sideOf(c))t.frz=Math.max(t.frz||0,1);return 0}});
F('lbow',{c:2,a:1,h:4,f:'a',tag:'lotus',t:'Range. Poppy darts: when it enters, your strongest untapped army member is tapped.',etb:(s,o)=>{const t=fTop(fTg(o).filter(x=>!x.tap));if(t)fTap(t)}});

/* ---------- The Sirens: a song you must answer, and a death if you pass them by ---------- */
F('scout',{c:1,a:1,h:2,f:'f',tag:'siren',t:'Flying. When it enters, your weakest army member hears the song and must attack on your next turn.',etb:(s,o)=>{const t=fLow(cr(o).filter(x=>!has(x,'k')));if(t){t.forced=1;t.def=0;log(fNm(t)+' is drawn by the song.')}}});
F('song',{c:2,a:3,h:2,f:'f',tag:'siren',t:'Flying. A song of everything that will happen: when it enters, they draw a card.',etb:s=>draw(s,1)});
F('siren',{c:3,a:4,h:3,f:'f',tag:'siren',t:'Flying. The Sirens die if someone passes them by: at the start of their turn, if you did not attack on your last turn, it takes 2 damage.',
 up:(s,o,c)=>{if(!cr(o).some(x=>x.lastAtk===G.turn)){c.dmg+=2;log('You sail past unmoved: the Siren falters.')}}});

/* ---------- Polyphemus: the cave, the flock and the son of Poseidon ---------- */
F('cscout',{c:2,a:4,h:3,f:'rg',tag:'cyc',t:'Ruthless. Cyclops. Lawless: when it enters, it eats one of your army members with power 1 or less.',etb:(s,o)=>{const t=fLow(cr(o).filter(x=>pw(x)<=1&&!has(x,'w')));if(t){fDestroy(t);log('A Cyclops snatches up '+fNm(t)+'.')}}});
F('cave',{c:3,a:3,h:5,f:'pg',tag:'cyc',t:'Phalanx. Cyclops. It rolls the boulder across the cave mouth: when it enters, your strongest army member is shut in (tapped, doesn\'t untap next turn).',etb:(s,o)=>{const t=fTop(cr(o));if(t)fTap(t,1)}});
F('brute',{c:3,a:4,h:5,f:'rg',tag:'cyc',t:'Ruthless. Cyclops. He eats men two at a time: when it enters, your two weakest army members take 1 damage each.',etb:(s,o)=>{cr(o).slice().sort((a,b)=>ev(a)-ev(b)).slice(0,2).forEach(x=>{x.dmg+=1})}});
F('elder',{c:4,a:5,h:6,f:'zg',tag:'cyc',t:'Resilient. Cyclops. He prays to his father: when it dies, Poseidon\'s curse strikes you for 3.',die:(s,o)=>fHurt(o,3,'Poseidon hears the Cyclops. ')});

/* ---------- The Shades of Hades ---------- */
F('warden',{c:3,a:3,h:4,f:'eza',tag:'shade',t:'Shade. Resilient. Range. The dark of Erebus: their other Shades get +0/+1.',aura:x=>[0,has(x,'e')?1:0]});

/* ---------- The Phaeacians: hospitality, thought-swift ships and the games ---------- */
F('oarsman',{c:1,a:1,h:2,f:'l',tag:'fleet',t:'Fleet. Their ships sail by thought: when it enters, restore 1 health to each of their army members.',etb:s=>cr(s).forEach(x=>heal(x,1))});
F('navig',{c:2,a:1,h:3,f:'ls',tag:'fleet',t:'Fleet. Steadfast. It knows men\'s minds: when it enters, they draw a card.',etb:s=>draw(s,1)});
F('phguard',{c:3,a:2,h:4,f:'la',tag:'fleet',t:'Fleet. Range. The games: when it enters, Euryalus taunts your strongest army member (-1/-0 until their next turn).',etb:(s,o)=>{const t=fTop(cr(o));if(t)fHold(t,-1,0,s)}});

/* ---------- The Cicones: if you linger, the neighbours muster ---------- */
F('mraid',{c:1,a:2,h:2,f:'mh',tag:'cic',t:'Marauder. Charge. The neighbours muster: when it dies, another Cicone Raider is shuffled into their deck.',die:s=>fShuffle(s,'mraid',1)});
F('mskirm',{c:2,a:3,h:3,f:'mh',tag:'cic',t:'Marauder. Charge. As many as leaves in spring: gets +1/+0 for each turn the fight has gone past the 4th (at most +3).',self:()=>[Math.max(0,Math.min(3,(G.turn||0)-4)),0]});
F('mpill',{c:3,a:4,h:3,f:'mh',tag:'cic',t:'Marauder. Charge. When it deals combat damage to you, a random card in your hand is burned with the granaries.',hit:(s,o)=>{const x=fRnd(o.hand);if(x){o.hand=o.hand.filter(y=>y!==x);bury(o,x);log('The Cicones burn '+fNm(x)+'.')}}});
F('chief',{c:4,a:4,h:5,f:'mhy',tag:'cic',t:'Marauder. Charge. Rally. From the fifth turn on, at the start of their turn a Cicone Raider comes down from the hills to join them.',up:s=>{if(G.turn>=5&&fSum(s,'mraid',1))log('The inland Cicones come down from the hills.')}});
F('cbow',{c:2,a:2,h:3,f:'ma',tag:'cic',t:'Marauder. Range. When it enters, your weakest army member takes 1 damage.',etb:(s,o)=>{const t=fLow(cr(o));if(t)t.dmg+=1}});

/* ---------- Circe: the beasts that were once men ---------- */
const fSwine=o=>o.bf.some(x=>x.id=='swine');
F('cwolf',{c:2,a:3,h:2,f:'r',tag:'circe',t:'Ruthless. Once a man: gets +1/+1 while you have a Swine.',self:c=>fSwine(oppOf(sideOf(c)))?[1,1]:[0,0]});
F('clion',{c:3,a:4,h:4,f:'r',tag:'circe',t:'Ruthless. Her potion lingers: when it deals combat damage to you, your newest army member forgets itself (-1/-1 permanently).',hit:(s,o)=>{const t=fNewest(o);if(t){t.pa--;t.pd--}}});

/* ---------- The Cattle of the Sun ---------- */
F('lamp',{c:3,a:3,h:3,f:'f',tag:'sun',t:'Flying. The herdswoman: whenever one of their cattle dies, she gets +2/+0 permanently.',allyDie:(s,o,c,x)=>{if(x.id=='cow'||x.id=='bull')c.pa+=2}});
F('neith',{c:2,a:3,h:3,f:'f',tag:'sun',t:'Flying. She tends the herd: when it enters, their cattle are restored to full health.',etb:s=>cr(s).filter(x=>x.id=='cow'||x.id=='bull').forEach(x=>{x.dmg=0})});
F('helios',{c:4,a:5,h:5,f:'f',tag:'sun',t:'Flying. Helios demands justice: at the start of their turn, if the Sun God\'s tally is 2 or more, your strongest army member takes 2 damage.',
 up:(s,o)=>{const t=typeof sacTrump=='function'&&sacTrump(s);if(t&&(t.k||0)>=2){const v=fTop(cr(o));if(v){v.dmg+=2;log('Helios burns '+fNm(v)+'.')}}}});

/* ---------- Hector: Troy holds the line ---------- */
F('hmil',{c:1,a:1,h:3,f:'p',tag:'troy',t:'Phalanx. Behind the walls: +1/+0 while Hector is with them.',self:c=>[sideOf(c).bf.some(x=>x.id=='hector')?1:0,0]});
F('hspr',{c:2,a:2,h:4,f:'pa',tag:'troy',t:'Phalanx. Range. It holds the gate: when it blocks, it deals 1 more damage.',dmgOut:(c,n,t)=>G.cmb&&G.cmb.side!==(sideOf(c)===G.p?'p':'e')?1:0});
F('hgua',{c:3,a:3,h:5,f:'p',tag:'troy',t:'Phalanx. The last wall: their other Phalanx army members get +0/+1.',aura:x=>[0,has(x,'p')?1:0]});
F('hchar',{c:2,a:3,h:2,f:'h',tag:'troy',t:'Charge. Tamer of horses: when it enters, the chariot runs down your weakest army member (1 damage).',etb:(s,o)=>{const t=fLow(cr(o));if(t)t.dmg+=1}});

/* ---------- Scylla: she cannot be killed, only passed; each head comes back ---------- */
F('sh1',{c:1,a:1,h:1,f:'r',tag:'scyl',t:'Ruthless. A head of the undying monster: when it dies, it is shuffled back into their deck.',die:fBackToDeck});
F('sh2',{c:2,a:2,h:1,f:'r',tag:'scyl',t:'Ruthless. Gets +1/+0 for each other Head.',self:c=>[cr(sideOf(c)).filter(x=>x!==c&&/^sh\d$/.test(x.id)).length,0]});
F('sh3',{c:2,a:1,h:2,f:'da',tag:'scyl',t:'Draining. Range. Its voice is a puppy\'s yelp: when it enters, your weakest army member flinches (tapped).',etb:(s,o)=>{const t=fLow(cr(o).filter(x=>!x.tap));if(t)fTap(t)}});
F('sh4',{c:3,a:3,h:2,f:'v',tag:'scyl',t:'Venomous. A head of the undying monster: when it dies, it is shuffled back into their deck.',die:fBackToDeck});

/* ---------- Charybdis: three times a day she swallows, and gives back ---------- */
F('cdro',{c:1,a:1,h:2,f:'',tag:'chary',t:'Swallowed by the whirlpool: when it dies, she spits it back into their hand.',die:fBackToHand});
F('clev',{c:3,a:4,h:4,f:'z',tag:'chary',t:'Resilient. The whirlpool\'s rhythm: +2/+2 on every third turn.',self:()=>(G.turn||0)%3==0?[2,2]:[0,0]});
F('eel',{c:2,a:2,h:3,f:'vk',tag:'siren',t:'Venomous. Can only defend: it waits among the rocks below the meadow of bones.'});
/* Fáfnir: Sigurd strikes him from below, from a pit */
FOE.fafn=Object.assign(FOE.fafn||{},{dmgIn:(t,n,src)=>G.cmb&&G.cmb.side=='e'&&src&&sideOf(src)===G.p?2:0});D.fafn[6]=(D.fafn[6]||'').replace(/\s*$/,'')+' Struck from below: takes 2 extra damage from army members that block him.';
