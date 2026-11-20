/* ===== v106-107: tutorial (lessons for every hero) and first-time tips for runs ===== */
const TUTK='myth_tut_done',TIPK='myth_tips',TIPSEEN='myth_tips_seen';
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const tutDone=()=>{let d=[];try{d=JSON.parse(lsGet(TUTK,'[]'))}catch(e){}if(!Array.isArray(d))d=[];
 /* v107: lessons are saved by id; older saves stored numeric indices (0-3 = Odysseus lessons, 9 = the journey) */
 return d.map(x=>x===9?'journey':typeof x=='number'?'ody'+(x+1):x)};
const tutMark=id=>{const d=tutDone();if(!d.includes(id)){d.push(id);lsSet(TUTK,JSON.stringify(d))}};
const TUTH=['ody','odin','wukong','thoth'];
const tutOf=h=>TUT.map((L,i)=>[L,i]).filter(([L])=>(L.h||'ody')==h);
const handU=id=>{const c=G.p&&G.p.hand.find(x=>x.id==id);return c?c.u:0};
const bfU=id=>{const c=G.p&&G.p.bf.find(x=>x.id==id);return c?c.u:0};
const inGy=id=>!!(G.p&&G.p.gy.some(x=>x.id==id));
const onBf=id=>!!(G.p&&G.p.bf.some(x=>x.id==id));
const hiHand=id=>()=>{const u=handU(id);return u?`.hand .cd[data-z="h:${u}"]`:''};
const hiBf=id=>()=>{const u=bfU(id);return u?`.fp .cd[data-z="p:${u}"]`:''};

const TUT=[
{id:'ody1',h:'ody',t:'Army and battle',sub:'The basics: mana, army members, attacking and blocking.',
 ename:'Ithacan Bandits',eic:'🗡️',elife:8,ebg:['#0b1820','#1d4452'],
 deck:['spear','sailor','peltast','spearc','thess','hopl','corsair','sent','zerk','harrier','aegis','sailor'],
 edeck:['mraid','scout','mraid','sheep','scout','mraid','scout','mraid'],
 steps:[
 {m:'Welcome, Odysseus. Every fight is a duel between two armies. <b>Bring the enemy\'s life to 0</b> to win (their life is at the top left). You have <b>20 life</b> (bottom left). If yours reaches 0, the run is over.',hi:'.eh .hp,.me .hp',next:1},
 {m:'Each turn you get <b>2 mana</b> (◆). Every card shows its cost in the top-right corner. Mana you don\'t spend is lost at the end of your turn.',hi:'.me .orb',next:1},
 {m:'Play <b>Ithacan Spearman</b>: click it in your hand. Army members stay on the battlefield until they die.',hi:hiHand('spear'),done:()=>onBf('spear'),noEnd:1},
 {m:'Now play <b>Sailor of the Fleet</b>. That spends your last mana.',hi:hiHand('sailor'),done:()=>onBf('sailor'),noEnd:1},
 {m:'<b>Fatigue:</b> army members can\'t attack on the turn they arrive (unless they have <b>Charge</b>). Both of yours are in <b>attack form</b>: the red label above each card.',hi:'.fp .sb',next:1},
 {m:'That\'s all you can do this turn. Press <b>End turn</b>.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'The enemy is taking its turn. Enemies play a real deck, just like you. They never show their plans in advance, so watch what they do.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'Your turn again: you drew a card and your mana refilled to 2. Time to fight. <b>Click Sailor of the Fleet</b> to select it, then press <b>Attack</b>.',hi:()=>[hiBf('sailor')(),'[data-b="atk"]'].filter(Boolean).join(','),done:()=>G.atkd||G.phase=='dmgP',noEnd:1},
 {m:'The enemy chooses whether to block. Blocked attackers fight the blocker. Unblocked attackers hit the enemy\'s life. Press <b>Resolve combat</b> to see what happens.',hi:'[data-b="res"]',done:()=>G.phase=='main'&&!G.cmb},
 {m:'<b>Damage stays.</b> Damage on an army member doesn\'t heal at the end of the turn. It stays until the army member dies or is healed. Attacking also <b>taps</b> your army member (it turns sideways): a tapped army member can\'t block, and the enemy can attack it directly.',hi:'.fp .cd.tap,.fe .cd',next:1},
 {m:'<b>Two forms.</b> Click the red <b>Attack form</b> label on your Spearman to switch it to <b>defense form</b>: +2 health, but it can\'t attack. Switching is free once per turn, before you attack.',hi:()=>{const u=bfU('spear');return u?`.fp .sb[data-z="s:${u}"]`:'.fp .sb'},done:()=>G.p.bf.some(x=>x.def),noEnd:1},
 {m:'<b>Quick spells</b> (like Spear Cast) can be cast on your turn or during the enemy\'s attack. Cast <b>Spear Cast</b> on an enemy army member to deal 3 damage to it. If you don\'t have one in hand yet, it will come.',hi:()=>[hiHand('spearc')(),'.fe .cd'].filter(Boolean).join(','),done:()=>inGy('spearc')||G.turn>=6},
 {m:'You know the basics. <b>Finish the bandits:</b> bring their life to 0. When the enemy attacks you, click one of your untapped army members, then click the attacker to block it.',done:()=>false}
 ]},
{id:'ody2',h:'ody',t:'Offerings to the gods',sub:'Odysseus\'s mana engine: sacrifice army members for mana.',
 ename:'Cyclops Herders',eic:'🐑',elife:10,ebg:['#1a1406','#6a5a2a'],
 deck:['camp','ox','argus','charon','pythia','zeus','iph','hades','tbull','spear','argus','sailor'],
 edeck:['sheep','mraid','scout','sheep','mraid','scout','sheep','mraid'],
 steps:[
 {m:'Two mana a turn isn\'t much. The rest comes from <b>offering</b> your army members to the gods. Each army member has an offering value (the <b>💀</b> number on its art). Offer it and you gain that much mana right away.',next:1},
 {m:'Play <b>Camp Follower</b>. It costs nothing.',hi:hiHand('camp'),done:()=>onBf('camp')||inGy('camp'),noEnd:1},
 {m:'Click the <b>💀</b> badge on Camp Follower to offer it. It leaves play and you gain 1 mana.',hi:()=>{const u=bfU('camp');return u?`.fp .ob[data-z="o:${u}"]`:''},done:()=>inGy('camp'),noEnd:1},
 {m:'Play <b>Sacred Ox</b>. It costs 1 but is worth <b>💀3</b> when offered.',hi:hiHand('ox'),done:()=>onBf('ox')||inGy('ox'),noEnd:1},
 {m:'Now <b>offer the Ox</b> for 3 mana and play <b>Charon the Ferryman</b> (cost 3). Offering lets you play cards you couldn\'t normally afford.',hi:()=>[(()=>{const u=bfU('ox');return u?`.fp .ob[data-z="o:${u}"]`:''})(),hiHand('charon')()].filter(Boolean).join(','),done:()=>onBf('charon'),noEnd:1},
 {m:'Many cards do something <b>when they die or are offered</b>. Charon gives 2 extra mana and a card when offered. Faithful Argus draws a card. Offer army members that are about to die anyway, so you get value from them twice.',next:1},
 {m:'End your turn when you\'re ready.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'The enemy acts. Watch which of your army members get hurt: a damaged army member is a good offering.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'Play <b>Faithful Argus</b> and offer it to draw a card.',hi:()=>[hiHand('argus')(),(()=>{const u=bfU('argus');return u?`.fp .ob[data-z="o:${u}"]`:''})()].filter(Boolean).join(','),done:()=>inGy('argus')||G.turn>=4},
 {m:'This is the <b>Offerings</b> archetype: the Altar of Zeus draws a card on every offering, Iphigenia is worth 3 extra mana and 2 cards, and Hades burns the enemy for 3 each time you offer. <b>Defeat the herders.</b>',done:()=>false}
 ]},
{id:'ody3',h:'ody',t:'Phalanx: the wall',sub:'Hold the line in defense form, then strike back.',
 ename:'Cicone Marauders',eic:'⚔️',elife:6,ebg:['#1a0a06','#6a2a1a'],
 deck:['sent','peltast','ox','testudo','hopl','drill','leon','peltast','veteran','ox','hopl','aegis'],
 edeck:['mraid','mraid','mskirm','mraid','mraid','mskirm','mraid','mraid'],
 steps:[
 {m:'The <b>Phalanx</b> archetype is Odysseus\'s wall. Phalanx army members get <b>+2 power while in defense form</b>, so they hit back hard when they block.',next:1},
 {m:'Play <b>Argive Sentinel</b> (1/5). It\'s a <b>Sentinel</b>: it can only defend, and it starts in defense form.',hi:hiHand('sent'),done:()=>onBf('sent'),noEnd:1},
 {m:'Play your other army members too, then end your turn. The Marauders are fast attackers, so expect them soon. Remember the last lesson: offer a <b>Sacred Ox</b> (💀3) to afford a big Phalanx like the Hoplite or Leonidas.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'The enemy is attacking or building up. <b>When they attack, you\'ll choose blockers</b>: click one of your untapped army members, then click the attacker it should block.',done:()=>G.phase=='blockP'||(G.phase=='main'&&G.turn>=3)},
 {m:'<b>Block!</b> Click a defender, then the attacker. Then cast <b>Testudo</b> (a quick spell): your defense-form army members get +2/+2 this turn. Press <b>Resolve combat</b> when ready.',hi:()=>[hiHand('testudo')(),'.fe .cd.atk'].filter(Boolean).join(','),done:()=>G.phase!=='blockP',noEnd:1},
 {m:'Phalanx turns the enemy\'s attacks into losses for them. <b>Phalanx Drill</b> gives your Phalanx +1/+1 for good, and <b>Leonidas</b> gives your other Phalanx +2/+2, which helps them on offense too.',next:1},
 {m:'The rhythm of the Phalanx: <b>attack form on your turn</b> to strike, <b>defense form when you expect an attack</b>. Remember that an army member that attacked can\'t switch to defense form that turn, so keep some back. Sentinels never attack. <b>Defeat the Marauders.</b>',done:()=>false}
 ]},
{id:'ody4',h:'ody',t:'Raiders: strike fast',sub:'Win before the enemy can set up.',
 ename:'Lotus-Eaters',eic:'🪷',elife:10,ebg:['#0b1a14','#2f5a3a'],
 deck:['corsair','thess','zerk','banner','harrier','spoils','corsair','horde','sack','pent','thess','zerk'],
 edeck:['sheep','scout','priest','sheep','scout','isl','sheep','scout'],
 steps:[
 {m:'<b>Raiders</b> win by speed. Look at the keywords on your cards: <b>Charge</b> attacks the turn it arrives, <b>Ruthless</b> gets +1 power when it attacks, and a <b>Berserker</b> can only attack (it can\'t block).',next:1},
 {m:'Play <b>Cicone Corsair</b> (Charge, Ruthless) and attack with it right away.',hi:()=>[hiHand('corsair')(),'[data-b="atk"]'].filter(Boolean).join(','),done:()=>G.atkd||G.turn>=2,noEnd:1},
 {m:'Resolve the attack, play anything else you can, and end your turn.',hi:'[data-b="res"],[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'The Lotus-Eaters are slow and sleepy. Their Poppy Priest taps your army members. A <b>tapped</b> army member can be attacked directly.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Attack tapped enemies:</b> select an attacker, then click a <b>tapped</b> enemy army member to strike it instead of the player. Otherwise, go for their life.',next:1},
 {m:'Play the <b>Banner of the Argives</b> (Raiders +1 power), then keep attacking every turn.',hi:hiHand('banner'),done:()=>onBf('banner')||G.turn>=5},
 {m:'Finish with <b>Spoils of War</b> or <b>Sack of Ismarus</b>: damage to the enemy for each Raider you control. Raiders are fragile, so win quickly. <b>Defeat the Lotus-Eaters.</b>',done:()=>false}
 ]},{id:'odin1',h:'odin',t:'Blood and fury',sub:'Odin\'s mana engine: pay life for mana, and grow stronger while Wounded.',
 ename:'Fenrir\'s Brood',eic:'🐺',elife:6,ebg:['#0a1220','#2a3a5a'],
 deck:['hird','thrl','fjrd','oath','bsrk','howl','hird','gung','skar','fjrd','rage','hamr','thrl','bsrk'],
 edeck:['pup','ember','pup','ember','pup','ember','pup','ember'],
 steps:[
 {m:'Welcome, Allfather. You get <b>2 mana</b> (◆) a turn, like every hero. Odin gets more by <b>paying with his own blood</b>.',hi:'.me .orb',next:1},
 {m:'Play <b>Hirdman</b> (cost 1): click it in your hand.',hi:hiHand('hird'),done:()=>onBf('hird'),noEnd:1},
 {m:'Now press <b>Blood price</b>: pay a little life for 1 mana. You can do it <b>once per turn</b>, and the price rises by 1 each time you use it this fight, up to 5 life.',hi:'[data-b="bp"]',done:()=>(G.p.bp||0)>=1,noEnd:1},
 {m:'With that mana, play <b>Fjord Raider</b> (cost 2). It has <b>Charge</b>: it can attack the turn it arrives.',hi:hiHand('fjrd'),done:()=>onBf('fjrd'),noEnd:1},
 {m:'Attack with it: <b>click Fjord Raider</b>, then press <b>Attack</b>.',hi:()=>[hiBf('fjrd')(),'[data-b="atk"]'].filter(Boolean).join(','),done:()=>G.atkd||G.phase=='dmgP',noEnd:1},
 {m:'Press <b>Resolve combat</b>.',hi:'[data-b="res"]',done:()=>G.phase=='main'&&!G.cmb},
 {m:'<b>Wounded.</b> At half your life or less (10 or less) you are <b>Wounded</b>. Odin\'s cards get stronger then: <b>Battle-rage</b> gives +2 power while you\'re Wounded, and spells like War Howl hit harder. Spending life is a weapon, but don\'t run out.',hi:'.me .hp',next:1},
 {m:'End your turn.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'Wolf pups come in packs: each <b>Pack</b> army member gets stronger for every other one. Kill pups before the pack grows. Fire sprites have Charge: they attack as soon as they arrive.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Carve.</b> Blood Oath costs 1 mana and <b>Carve 2</b>: you also pay 2 life when you cast it. Cast it on one of your army members in combat for +3/+3 this turn.',hi:hiHand('oath'),done:()=>inGy('oath')||G.turn>=5},
 {m:'That\'s Odin: trade life for tempo, then hit hardest when you\'re hurt. <b>Bloodlust</b> army members (like Skar) get +2 power while they have damage on them. <b>Defeat the brood.</b>',done:()=>false}
 ]},
{id:'odin2',h:'odin',t:'Valhalla and the runes',sub:'Army members that pay off when they die, and runes carved in blood.',
 ename:'Frost and Fire',eic:'🧊',elife:9,ebg:['#0a1622','#3a5a6a'],
 deck:['thegn','einw','alg','thrl','vinit','huscl','skld','hird','shmd','scav','ruru','thegn','huscl','einw'],
 edeck:['ithrl','ember','ithrl','ember','rimew','ember','ithrl','ember'],
 steps:[
 {m:'Odin\'s three archetypes: <b>Berserkers</b> (fight while Wounded), <b>Valhalla</b> (army members that do something when they die) and <b>Runes</b> (modifiers paid for with life). This lesson covers the last two.',next:1},
 {m:'Play <b>Thegn of the Hall</b>. When it dies, you draw a card.',hi:hiHand('thegn'),done:()=>onBf('thegn')||inGy('thegn'),noEnd:1},
 {m:'Now play <b>Algiz, Rune of Protection</b>. It costs 1 mana and <b>Carve 2</b> (2 life). Runes stay in play: Algiz gives all your army members +0/+2 for the rest of the fight.',hi:hiHand('alg'),done:()=>onBf('alg'),noEnd:1},
 {m:'End your turn.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'Frost thralls are sturdy, fire sprites are fast but fragile. Watch their attack.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Valhalla.</b> Your Valhalla army members want to die well: Einherjar Warrior hurts every enemy, Housecarl hits the enemy for 3, Thegn draws a card. Trade them in combat without fear. Skald of the Fallen and the Battlefield Scavenger grow or strike each time one falls.',next:1},
 {m:'When you draw <b>Uruz, Rune of Strength</b> (Carve 3), carve it: +1 power for your whole army. Paying life also brings you closer to Wounded. <b>Defeat the Jotnar.</b>',done:()=>false}
 ]},
{id:'wk1',h:'wukong',t:'Momentum',sub:'Chain different kinds of cards to build Momentum.',
 ename:'Imps and Soldiers',eic:'🔥',elife:8,ebg:['#1a0806','#6a2a12'],
 deck:['wmonk','wdart','wfeint','wrod','wslip','wspin','wvang','wbear','wclone','wdance','wrod','wgrow','wbear','wdart','wflurry','wrod','wfeint','wdart','wmonk','wrod','wslip','wspin'],
 edeck:['rimp','hsol','rimp','hsol','rimp','hsol','rimp','hsol'],
 steps:[
 {m:'Welcome, Great Sage. Every card of yours is a <b>Strike</b>, a <b>Trick</b> or a <b>Leap</b> (shown on the card). Each time you play a card of a <b>different type</b> than the one before, your <b>Momentum</b> rises. It resets every turn.',hi:'.me .cn',next:1},
 {m:'Play <b>Mountain Monkey</b> (a Leap). It draws a card. Momentum: 1.',hi:hiHand('wmonk'),done:()=>onBf('wmonk'),noEnd:1},
 {m:'Now cast <b>Hair Dart</b> (a Strike, cost 0): click it, then click the enemy\'s life at the top left. A different type, so Momentum rises to 2.',hi:()=>[hiHand('wdart')(),'.eh .hp'].filter(Boolean).join(','),done:()=>(G.p.mo||0)>=2||inGy('wdart'),noEnd:1},
 {m:'Cast <b>Feint</b> (a Trick, cost 0). Because the card before it was a Strike, it draws <b>two</b> cards. Momentum: 3.',hi:hiHand('wfeint'),done:()=>(G.p.mo||0)>=3||inGy('wfeint'),noEnd:1},
 {m:'Finish the chain with <b>Iron Rod</b> (a Strike): 2 damage to the enemy. Momentum: 4.',hi:()=>[hiHand('wrod')(),'.eh .hp'].filter(Boolean).join(','),done:()=>(G.p.mo||0)>=4||inGy('wrod'),noEnd:1},
 {m:'<b>Why Momentum matters.</b> Many cards read it: <b>Staff Spin</b> deals Momentum + 1 damage, <b>Staff-Bearer</b> hits the enemy for your Momentum when it enters, and <b>Whirlwind Vanguard</b> grows each time it rises. Play cheap cards in alternating order first, then the payoff last.',next:1},
 {m:'End your turn.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'Red Boy\'s imps have Charge, and the Horn Soldiers hurt you a little when they die. Watch how many come.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'Your Momentum is back to 0. Build it again: alternate Strike, Trick and Leap, and save Staff Spin or Staff-Bearer for the end of the chain. <b>Defeat the imps.</b>',done:()=>false}
 ]},
{id:'wk2',h:'wukong',t:'Clones and tricks',sub:'Spare Hairs, Disintegrate, and tricks that tap the enemy.',
 ename:'Bones and Silk',eic:'🦴',elife:9,ebg:['#14140a','#5a5a2a'],
 deck:['wpluck','wclone','wdance','wmonk','wtroop','wgrow','wsent','wclone','wfoot','wpig','wrod','wseal','wclone','wbear','wsent','wrod','wdart','wpluck','wflurry','wrod','wpig','wfeint','wrod'],
 edeck:['bsk','cocn','bsk','cocn','bsk','cocn','bsk','cocn'],
 steps:[
 {m:'Wukong\'s archetypes: <b>Clones</b> (Spare Hairs, many small cards), <b>Staff</b> (Momentum payoffs) and <b>Trickster</b> (tap, bounce and cheat mana). This lesson shows Clones and tricks.',next:1},
 {m:'Cast <b>Pluck a Hair</b>. It shuffles 2 <b>Spare Hairs</b> into your deck and draws a card. A Spare Hair costs 0 and deals 1 damage, then <b>Disintegrates</b>: it leaves the fight for good instead of going to your graveyard.',hi:hiHand('wpluck'),done:()=>!handU('wpluck'),noEnd:1},
 {m:'Play <b>Clone of the Great Sage</b>. It has Charge, and when it dies it shuffles another Spare Hair into your deck.',hi:hiHand('wclone'),done:()=>!handU('wclone'),noEnd:1},
 {m:'Attack with the Clone: click it, then press <b>Attack</b>.',hi:()=>[hiBf('wclone')(),'[data-b="atk"]'].filter(Boolean).join(','),done:()=>G.atkd||G.phase=='dmgP'||!onBf('wclone'),noEnd:1},
 {m:'Press <b>Resolve combat</b>.',hi:'[data-b="res"]',done:()=>G.phase=='main'&&!G.cmb},
 {m:'End your turn.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'Bone Soldiers march in, and the Cocoon spell taps one of your army members so it can\'t block or attack.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Tricks.</b> Cast <b>Dancing Away</b> on an enemy army member to tap it. A tapped army member can\'t block, and your attackers can strike it directly.',hi:()=>[hiHand('wdance')(),'.fe .cd'].filter(Boolean).join(','),done:()=>!handU('wdance')||G.turn>=5},
 {m:'Spare Hairs are free cards: each one keeps your chain going for no mana. Mix them with Tricks and Leaps to raise Momentum, then cast <b>Grow Tall</b> on an attacker for +Momentum power. <b>Defeat the bats.</b>',done:()=>false}
 ]},
{id:'th1',h:'thoth',t:'Sunder and the name',sub:'Split an army member into Ka and Ba, and use its Ren.',
 ename:'The Tomb Robbers',eic:'⚱️',elife:8,ebg:['#1a1206','#6a5222'],
 deck:['tmedj','tsun','tscr','iink','dreun','tmedj','tsun','ywatch','iscribe','dsk','tmedj','tscr','dreun','tmedj'],
 edeck:['grob','grob','tdig','grob','grob','tdig','grob','grob'],
 steps:[
 {m:'Welcome, Thoth, scribe of the gods. You don\'t fight with brute force: you <b>split</b> army members and <b>rewrite</b> them.',next:1},
 {m:'Play <b>Medjay of the Temple</b> (1/3).',hi:hiHand('tmedj'),done:()=>onBf('tmedj')||G.p.bf.some(x=>x.part),noEnd:1},
 {m:'Cast <b>Sunder the Soul</b> on your Medjay. It splits into its <b>Ka</b> (the body: half its health, no power, can\'t block) and its <b>Ba</b> (the soul: half its power, 1 health, Flying). You also take its <b>Ren</b>, its true name, into your hand.',hi:()=>[hiHand('tsun')(),hiBf('tmedj')()].filter(Boolean).join(','),done:()=>G.p.hand.some(c=>c.ren)||inGy('tsun'),noEnd:1},
 {m:'A Ren can be used two ways. <b>Speak it</b> (click the ◆+2 badge on the card) for 2 mana, or <b>write it</b> (play it on one of your army members) to give that army member the original\'s keywords and +1/+1. Speak it now.',hi:'.hand .spk',done:()=>!G.p.hand.some(c=>c.ren),noEnd:1},
 {m:'<b>Glyphs.</b> Play <b>Temple Scribe</b>: it inscribes <b>Ward</b> onto one of your army members. Each army member can hold up to <b>3 glyphs</b>.',hi:hiHand('tscr'),done:()=>onBf('tscr')||G.turn>=2},
 {m:'Spend your last mana on <b>Ink of Seshat</b> (+1/+1 and Ruthless), or keep it. Then end your turn.',hi:'[data-b="end"]',done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'Grave robbers are quick and fragile. Block them with sturdy army members.',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Reunite.</b> When you draw <b>Reunion in the Field of Reeds</b>, cast it while a Ka and its Ba are both alive: they become the original again, with +1/+1 and its glyphs, and you draw a card.',hi:hiHand('dreun'),done:()=>inGy('dreun')||G.turn>=5},
 {m:'Sunder also works on <b>enemy</b> army members: split a big threat into two weak halves and steal its name. <b>Defeat the tomb robbers.</b>',done:()=>false}
 ]},
{id:'th2',h:'thoth',t:'Amulets and foresight',sub:'Equip amulets and read the enemy\'s next moves.',
 ename:'The Jackals of Anubis',eic:'🐕',elife:8,ebg:['#1a1206','#5a4a2a'],
 deck:['yibis','tmedj','ypre','tscr','gfeather','ywatch','tscar','iscribe','tmedj','yfore','iwas','tmedj','ianx','tsun'],
 edeck:['jack','grob','jack','grob','jack','grob','jack','grob'],
 steps:[
 {m:'Two more of Thoth\'s tools: <b>foresight</b> (the Recorder archetype) and <b>amulets</b>.',next:1},
 {m:'Play <b>Ibis of Thoth</b>. When it enters, you <b>Foresee 2</b>: you see the next 2 cards the enemy will draw.',hi:hiHand('yibis'),done:()=>onBf('yibis'),noEnd:1},
 {m:'Foreseen cards are listed under the enemy\'s mana (👁). Now you know what\'s coming. <b>Preempt</b> makes a foreseen card fail when they play it, and <b>Foreknowledge</b> hurts them each time they play one.',hi:'.fsee',next:1},
 {m:'Play <b>Medjay of the Temple</b>, then end your turn.',hi:()=>[hiHand('tmedj')(),'[data-b="end"]'].filter(Boolean).join(','),done:()=>G.phase=='enemy'||G.turn>=2},
 {m:'The jackals strike fast. Did you see them coming?',done:()=>G.phase=='main'&&G.turn>=2},
 {m:'<b>Amulets.</b> Play <b>Feather of Ma\'at</b>, then click the army member that should wear it. The wearer gets +1/+1.',hi:()=>[hiHand('gfeather')(),'.fp .cd'].filter(Boolean).join(','),done:()=>G.p.bf.some(x=>x.id=='gfeather'&&x.on),noEnd:1},
 {m:'If the wearer dies, the amulet stays on the battlefield. <b>Click it</b>, then another army member, to equip it again for its equip cost (◆1 for the Feather). You can move it during your main phase whenever you have the mana.',hi:hiBf('gfeather'),next:1},
 {m:'Your staple <b>Scarab Amulet</b> returns its wearer to your hand the first time it would die. <b>Defeat the jackals.</b>',done:()=>false}
 ]}

];
const JOURNEY=[
 {t:'A run',m:'A run is a journey through your hero\'s home realm (<b>Act I</b>), then another hero\'s realm (<b>Act II</b>). Win both acts to win the run. If your life reaches 0, the run ends.'},
 {t:'Drafting your deck',m:C=>'You start with 4 <b>staple</b> cards and draft 11 more, choosing 1 of 3 each time. Rarer cards appear less often. Stick mostly to one or two <b>archetypes</b> (for '+C.n.split(',')[0]+': '+C.arch.map(a=>a[1]).join(', ').replace(/, ([^,]*)$/,' or $1')+'): their cards are built to work together.'},
 {t:'The map',m:'Each act is a web of places. Moving costs <b>action points</b> (⚡). Winning a fight earns a <b>victory point</b> (🏆) and more action points. Gold-starred fights are <b>elites</b>: harder, with better rewards. You can see how strong the next opponent will be before you go.'},
 {t:'Places to visit',m:'<b>Campfires</b> heal you. <b>Crafting tables</b> let you draft a new card or remove a weak one. <b>Altars</b> let you duplicate or upgrade a card. Each costs action points, so plan your route.'},
 {t:'Prestige',m:'After a win, every army member of yours that survived earns <b>Prestige</b>: a permanent upgrade, such as more power, health or a lower cost. Keeping your army alive makes your deck stronger.'},
 {t:'The guardian',m:'After 4 victory points, return to the centre of the map and make your offering at the altar. Two <b>guardians</b> answer: choose which boss to face. Each boss has a <b>trump</b>, a rule-bending card that is on the battlefield from the start.'},
 {t:'Act II',m:'Beat the guardian and you travel to a random other hero\'s realm with your deck, healed by 10. Its enemies were built for another hero, so expect surprises.'},
 {t:'Ready',m:'That\'s the whole loop: draft, travel, fight, upgrade, defeat the guardian. Tips will appear the first time you reach each screen in a run. You can switch them off in How to play.'}
];
const TIPS={
 draft:'<b>Drafting.</b> Pick 1 of 3 cards for your deck, 11 times. Stay mostly within one or two archetypes so your cards support each other. Click your library (bottom left) to see what you have so far.',
 map:'<b>The map.</b> Click a neighbouring place to travel there. Moving costs action points (⚡). Fights give victory points (🏆). Get 4, then return to the centre to face the guardian. Hover a place to see what\'s there.',
 'loc:camp':'<b>Campfire.</b> Spend action points to heal. Healing twice is the limit at each campfire.',
 'loc:craft':'<b>Crafting table.</b> Draft a new card or remove a weak one. Removing cards makes your best ones show up more often.',
 'loc:altar':'<b>Altar.</b> Duplicate a card or upgrade one (once each). Legendary cards can\'t be duplicated or upgraded here.',
 'main:odin':'<b>Your first fight.</b> You get 2 mana a turn. Press <b>Blood price</b> to pay life for 1 more (once per turn). At half life or less you are Wounded, and many of your cards get stronger. Damage stays on army members between turns.',
 'main:wukong':'<b>Your first fight.</b> You get 2 mana a turn. Play cards of different types (Strike, Trick, Leap) one after another to raise your Momentum, which powers many of your cards. It resets every turn.',
 'main:thoth':'<b>Your first fight.</b> You get 2 mana a turn. Sunder an army member to take its Ren, then speak the Ren (◆+2) for mana or write it onto an army member. Click an amulet on the battlefield to equip it.',
 main:'<b>Your first fight.</b> You get 2 mana a turn. Offer army members (click 💀) for more. Click a card\'s form label to switch between attack and defense form. Damage stays on army members between turns.',
 kleos:'<b>Prestige.</b> Each of your surviving army members earns a permanent upgrade. Pick one for each.',
 bossp:'<b>The guardian.</b> Choose which boss to face. Read their trump: it changes the rules of the fight.',
 a2:'<b>Act II.</b> You\'re in another hero\'s realm now. These enemies were built for a different hero, so read their trumps carefully.'
};
/* v108: the turn-start message names the hero's own mana source (every hero can still offer) */
const TURNM={ody:'offer army members (💀) for more.',odin:'press Blood price to pay life for 1 more, or offer army members (💀).',
 wukong:'play different card types in a row (Strike, Trick, Leap) to build Momentum.',thoth:'speak a Ren (◆+2) or offer army members (💀) for more.'};
function turnMsg(){return'Your turn. Mana refills to 2; '+(TURNM[(G&&G.ch)||'ody']||TURNM.ody)}
/* ---------- tutorial flow ---------- */
function tutStart(i){const L=TUT[i];if(!L)return;const h=L.h||'ody';setChar(h);UND=null;U=0;
 G={ch:h,th:h,fi:0,log:[],sel:[],tg:{},p:side([],20),rt:[],lanes:[],web:genWeb(),pos:0,act:2,trail:{},phase:'main',boss:0,elt:0,tut:{i,s:0,won:0}};
 G.p.recs=L.deck.map(id=>({id,a:0,d:0,c:0,s:0,k:0,fl:0}));
 EN.push({n:L.ename,l:L.elife,ic:L.eic,hint:'',bg:L.ebg,d:L.edeck.slice()});G.rt=[EN.length-1];
 fight();const p=G.p,e=G.e;
 p.deck=L.deck.map(id=>mk(id)).reverse();p.hand=[];p.gy=[];draw(p,4);
 e.deck=L.edeck.map(id=>mk(id)).reverse();e.hand=[];draw(e,4);e.life=e.max=L.elife;e.bf=[];
 G.log=[];G.msg='';G.phase='main';render()}
function tutStep(){if(!G||!G.tut)return null;const L=TUT[G.tut.i];return L?L.steps[G.tut.s]:null}
function tutNoEnd(){const s=tutStep();return s&&s.noEnd&&G.phase=='main'?'Finish this step first: '+s.m.replace(/<[^>]+>/g,'').split('.')[0]+'.':''}
function tutChk(){const p=G.p,e=G.e;if(e.life<=0||p.life<=0){G.tut.won=e.life<=0?1:0;G.phase='tutend';if(G.tut.won)tutMark(TUT[G.tut.i].id);return true}return false}
function tutTick(){if(!G||!G.tut||G.phase=='tutend')return;for(let k=0;k<20;k++){const s=tutStep();if(!s||s.next)return;let ok=false;try{ok=s.done()}catch(e){}if(!ok)return;G.tut.s++}}
/* ---------- screens ---------- */
function renderTutMenu(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
 const done=tutDone(),tips=lsGet(TIPK,'1')=='1',h=TUTH.includes(G.th)?G.th:'ody',Ls=tutOf(h);
 const card=(n,i,L)=>`<button class="tutl${done.includes(L.id)?' dn':''}" data-b="tut:${i}"><span class="tutn">${n}</span><span class="tutt">${L.t}</span><span class="tuts">${L.sub}</span>${done.includes(L.id)?'<span class="tutok">✓</span>':''}</button>`;
 const tab=k=>{const C=CHARS[k],all=tutOf(k).every(([L])=>done.includes(L.id));return`<button class="b gh tuttab${k==h?' on':''}" data-b="tuth:${k}">${C.ic} ${C.n.split(',')[0]}${all?' ✓':''}</button>`};
 document.getElementById('app').innerHTML=`<div class="dft tutm"><div class="ovt" style="font-size:34px">How to play</div><div class="dsub" style="font-size:15px;max-width:600px;text-align:center">Short lessons for each hero. Each fight uses a ready-made deck against a ready-made enemy, and a guide walks you through it. New to the game? Start with Odysseus: his first lesson covers the basic rules.</div>
 <div class="tuttabs">${TUTH.filter(k=>CHARS[k]).map(tab).join('')}</div>
 <div class="tutls">${Ls.map(([L,i],n)=>card(n+1,i,L)).join('')}<button class="tutl${done.includes('journey')?' dn':''}" data-b="tutj"><span class="tutn">${Ls.length+1}</span><span class="tutt">The journey</span><span class="tuts">How a run works: the map, drafting, upgrades and bosses.</span>${done.includes('journey')?'<span class="tutok">✓</span>':''}</button></div>
 <div class="hbt" style="margin-top:6px"><button class="b gh" data-b="tiptog">Tips during runs: ${tips?'on':'off'}</button><button class="b gh" data-b="tutback">Back</button></div></div>`}
function renderTutEnd(){const L=TUT[G.tut.i],won=G.tut.won,Ls=tutOf(L.h||'ody').map(x=>x[1]),k=Ls.indexOf(G.tut.i),nx=k>=0&&k+1<Ls.length?Ls[k+1]:TUT.length;
 document.getElementById('app').innerHTML=`<div class="dft tutm"><div class="ovt" style="font-size:34px">${won?'Lesson complete':'Defeated'}</div><div class="dsub" style="font-size:16px;max-width:520px;text-align:center">${won?'<b>'+L.t+'</b> mastered.':'The enemy won this time. Try again: the deck and enemy are the same every time.'}</div>
 <div class="hbt" style="margin-top:12px">${won&&nx<TUT.length?`<button class="b" data-b="tut:${nx}">Next lesson: ${TUT[nx].t}</button>`:''}${won&&nx>=TUT.length?'<button class="b" data-b="tutj">Next: The journey</button>':''}<button class="b gh" data-b="tut:${G.tut.i}">${won?'Replay':'Try again'}</button><button class="b gh" data-b="tutmenu">Lessons</button></div></div>`}
function renderTutJourney(){const j=G.tj||0,S=JOURNEY[j],last=j>=JOURNEY.length-1,h=TUTH.includes(G.th)?G.th:'ody',C=CHARS[h];
 document.getElementById('app').innerHTML=`<div class="dft tutm"><div class="dsub" style="letter-spacing:.2em;text-transform:uppercase;opacity:.6">The journey · ${j+1} / ${JOURNEY.length}</div><div class="ovt" style="font-size:32px">${S.t}</div><div class="tutj">${typeof S.m=='function'?S.m(C):S.m}</div>
 <div class="hbt" style="margin-top:10px">${j>0?'<button class="b gh" data-b="tjprev">Back</button>':''}${last?`<button class="b" data-b="tjrun">Start a run with ${C.n.split(',')[0]}</button><button class="b gh" data-b="tutmenu">Lessons</button>`:'<button class="b" data-b="tjnext">Next</button>'}</div></div>`}
/* ---------- coach panel (lessons and run tips) ---------- */
function tipKey(){if(!G||G.tut)return'';const ph=G.phase;if(ph=='draft'&&G.dr&&G.dr.mode=='start')return'draft';if(ph=='map')return G.a2?'a2':'map';if(ph=='loc'&&G.web){const n=G.web.nodes[G.pos];return n?'loc:'+n.t:''}
 if(ph=='main'&&G.turn<=1&&!G.a2&&G.fi==0)return'main';if(ph=='kleos')return'kleos';if(ph=='bossp')return'bossp';return''}
function coachPost(){if(typeof document==='undefined'||!document.createElement||!document.body)return;let el=document.getElementById('tutc');
 const hide=()=>{if(el)el.style.display='none'};document.querySelectorAll('.tuthi').forEach(x=>x.classList.remove('tuthi'));
 if(G&&G.tut&&G.phase!=='tutend'){tutTick();const L=TUT[G.tut.i],s=tutStep();if(!s)return hide();
  if(!el){el=document.createElement('div');el.id='tutc';document.body.appendChild(el)}el.style.display='block';
  el.innerHTML=`<div class="tutch">${L.t}<span>${G.tut.s+1} / ${L.steps.length}</span></div><div class="tutcm">${s.m}</div><div class="tutcb">${s.next?'<button class="b" data-b="tutnext">Next</button>':''}<button class="tutx" data-b="tutmenu">Leave lesson</button></div>`;
  const h=typeof s.hi=='function'?s.hi():s.hi;if(h)try{document.querySelectorAll(h).forEach(x=>x.classList.add('tuthi'))}catch(e){}return}
 const k=tipKey();if(!k||lsGet(TIPK,'1')!='1'){return hide()}let seen=[];try{seen=JSON.parse(lsGet(TIPSEEN,'[]'))}catch(e){}const tx=TIPS[k+':'+G.ch]||TIPS[k];if(seen.includes(k)||!tx)return hide();
 if(!el){el=document.createElement('div');el.id='tutc';document.body.appendChild(el)}el.style.display='block';
 el.innerHTML=`<div class="tutch">Tip</div><div class="tutcm">${tx}</div><div class="tutcb"><button class="b" data-b="tipok:${k}">Got it</button><button class="tutx" data-b="tipoff">Turn tips off</button></div>`}
function tutBt(b){
 if(b=='tutmenu'){const th=G&&(G.th||G.cv);if(G&&G.tut)setChar('ody');G={phase:'tutmenu',th,log:[],sel:[],tg:{},p:side([],20)};render();return true}
 if(b.startsWith('tuth:')){G.th=b.slice(5);render();return true}
 if(b.startsWith('tut:')){tutStart(+b.slice(4));return true}
 if(b=='tutback'){showChars();return true}
 if(b=='tutnext'){if(G&&G.tut){G.tut.s++;render()}return true}
 if(b=='tiptog'){lsSet(TIPK,lsGet(TIPK,'1')=='1'?'0':'1');render();return true}
 if(b=='tipoff'){lsSet(TIPK,'0');render();return true}
 if(b.startsWith('tipok:')){let seen=[];try{seen=JSON.parse(lsGet(TIPSEEN,'[]'))}catch(e){}seen.push(b.slice(6));lsSet(TIPSEEN,JSON.stringify(seen));render();return true}
 if(b=='tutj'){G={phase:'tutjourney',th:G&&G.th,tj:0,log:[],sel:[],tg:{},p:side([],20)};render();return true}
 if(b=='tjnext'){G.tj=Math.min(JOURNEY.length-1,(G.tj||0)+1);if(G.tj==JOURNEY.length-1)tutMark('journey');render();return true}
 if(b=='tjprev'){G.tj=Math.max(0,(G.tj||0)-1);render();return true}
 if(b=='tjrun'){lsSet(TIPK,'1');lsSet(TIPSEEN,'[]');setChar(TUTH.includes(G.th)?G.th:'ody');newRun();return true}
 return false}
{const _R=render;render=function(){_R.apply(this,arguments);try{tutTick()}catch(e){}try{coachPost()}catch(e){}}}
