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

/* v113: deeper lessons. Each one runs 3-4 turns and shows its idea two or three ways, still scripted to a win:
   every step names the one action the guide asks for (k), so the game can tell when it is done and tutAuto can
   follow the guide exactly. Tutorial opponents play one card a turn: their training cards cost 2. */
Object.assign(D,{
 tdum:['Training Dummy',2,'C',0,2,'n','A straw target. It can\'t attack or block.','🎯','N',1],
 tblk:['Shield Dummy',2,'C',0,3,'','A straw target that blocks.','🛡️','N',1],
 tbrute:['Straw Brute',2,'C',3,3,'nh','It charges in every turn and can\'t block.','🪓','N',1],
 tspear:['Straw Spearman',2,'C',3,1,'nh','It charges in every turn and can\'t block.','🗡️','N',1],
 tgiant:['Clay Giant',2,'C',2,6,'k','A Sentinel: it only blocks.','🗿','N',2]});
Object.assign(LORE,{tdum:'Training dummy',tblk:'Training dummy',tbrute:'Training dummy',tspear:'Training dummy',tgiant:'Training dummy'});
ENTD.tbrute=(s,c)=>{c.forced=1};ENTD.tspear=(s,c)=>{c.forced=1};
const tMatch=(c,id)=>id=='@ren'?!!c.ren:c.id==id;
const handU2=id=>{const c=G.p&&G.p.hand.find(x=>tMatch(x,id));return c?c.u:0};
const hiHand2=id=>()=>{const u=handU2(id);return u?`.hand .cd[data-z="h:${u}"]`:''};
const bfAll=id=>G.p?G.p.bf.filter(x=>x.id==id):[];
const cntIn=(L,id)=>L.filter(x=>tMatch(x,id)).length;
const S={
 info:(m,hi)=>({k:'info',m,hi,next:1}),
 play:(id,m,tgt)=>({k:'play',id,tgt,m,noEnd:1}),
 atk:(ids,m)=>({k:'atk',ids,m,noEnd:1}),
 end:(m,blk,q)=>({k:'end',m,blk,q}),
 offer:(id,m)=>({k:'offer',id,m,noEnd:1}),
 bp:m=>({k:'bp',m,noEnd:1}),
 stance:(id,want,m)=>({k:'stance',id,want,m,noEnd:1}),
 speak:m=>({k:'speak',m,noEnd:1}),
 equip:(id,tgt,m)=>({k:'equip',id,tgt,m,noEnd:1})};
function tutHi(s){if(s.hi)return typeof s.hi=='function'?s.hi():s.hi;
 if(s.k=='play'){const L=[hiHand2(s.id)()];if((G.mode||G.pend)&&s.tgt){if(s.tgt=='ef')L.push('.eh .hp');else if(s.tgt.startsWith('e:'))L.push('.fe .cd');else L.push('.fp .cd')}return L.filter(Boolean).join(',')}
 if(s.k=='atk'){const L=s.ids.map(id=>bfAll(id).map(c=>`.fp .cd[data-z="p:${c.u}"]`).join(',')).filter(Boolean);L.push('[data-b="atk"]','[data-b="res"]');return L.join(',')}
 if(s.k=='end')return G.phase=='blockP'?['.fp .cd','.fe .cd','[data-b="res"]',s.q?hiHand2(s.q)():''].filter(Boolean).join(','):'[data-b="end"]';
 if(s.k=='offer'){const u=bfU(s.id);return u?`.fp .ob[data-z="o:${u}"]`:''}
 if(s.k=='bp')return'[data-b="bp"]';
 if(s.k=='stance')return bfAll(s.id).filter(c=>!!c.def!=!!s.want).map(c=>`.fp .sb[data-z="s:${c.u}"]`).join(',');
 if(s.k=='speak')return'.hand .spk';
 if(s.k=='fin')return!G.atkd&&cr(G.p).some(canAtk)?'[data-b="atkall"],[data-b="res"]':'[data-b="end"]';
 if(s.k=='equip'){const a=G.p.bf.find(x=>x.id==s.id);return a?`.fp .cd[data-z="p:${a.u}"],.fp .cd`:''}return''}
function tutSnap(){const p=G.p,t=G.tut;t.si=t.s;t.sn={t:G.turn,h:{},b:{},bp:p.bp||0,ren:p.hand.filter(c=>c.ren).length};p.hand.forEach(c=>{t.sn.h[c.id]=(t.sn.h[c.id]||0)+1});p.bf.forEach(c=>{t.sn.b[c.id]=(t.sn.b[c.id]||0)+1})}
function tutIsDone(s){const p=G.p,n=G.tut.sn;if(s.done)return s.done();if(s.k=='fin')return false;
 switch(s.k){case'play':return(s.id=='@ren'?cntIn(p.hand,'@ren')<n.ren:cntIn(p.hand,s.id)<(n.h[s.id]||0))&&!G.mode&&!G.pend;
  case'atk':return!!G.atkd&&!G.cmb&&G.phase=='main';
  case'end':return G.turn>n.t&&G.phase=='main';
  case'offer':return cntIn(p.bf,s.id)<(n.b[s.id]||0);
  case'bp':return(p.bp||0)>n.bp;
  case'stance':{const L=bfAll(s.id);return L.length>0&&L.every(c=>!!c.def==!!s.want)}
  case'speak':return p.hand.filter(c=>c.ren).length<n.ren;
  case'equip':return p.bf.some(x=>x.id==s.id&&x.on&&(!s.tgt||(p.bf.find(y=>y.u==x.on)||{}).id==s.tgt))}return false}
/* the guide, followed exactly (tests) */
function tutTarget(t){const e=G.e,p=G.p;if(!t)return;if(t=='ef')return hd0('ef');const [k,id]=t.split(':');const L=(k=='e'?e:p).bf.filter(x=>x.id==id);const c=L.find(x=>!x.tap)||L[0];if(c)hd0(k+':'+c.u)}
function tutAuto(){const s=tutStep();if(!s||G.phase!='main')return;
 if(s.next)return bt('tutnext');
 if(s.k=='play'){const u=handU2(s.id);if(!u)return;hd0('h:'+u);if(G.mode||G.pend)tutTarget(s.tgt);return}
 if(s.k=='atk'){const used=new Set();G.sel=[];s.ids.forEach(id=>{const c=G.p.bf.find(x=>x.id==id&&!used.has(x.u)&&canAtk(x));if(c){used.add(c.u);G.sel.push(c.u)}});bt('atk');if(G.phase=='dmgP')bt('res');return}
 if(s.k=='end')return bt('end');
 if(s.k=='fin'){if(!G.atkd&&cr(G.p).some(canAtk)){bt('atkall');if(G.phase=='dmgP')bt('res')}else bt('end');return}
 if(s.k=='offer')return hd0('o:'+bfU(s.id));
 if(s.k=='bp')return bt('bp');
 if(s.k=='stance'){const c=bfAll(s.id).find(x=>!!x.def!=!!s.want);if(c)hd0('s:'+c.u);return}
 if(s.k=='speak'){const c=G.p.hand.find(x=>x.ren);if(c)hd0('spk:'+c.u);return}
 if(s.k=='equip'){const a=G.p.bf.find(x=>x.id==s.id);if(a){hd0('p:'+a.u);if(G.mode)tutTarget('p:'+s.tgt)}}}
function tutAutoBlock(){const s=tutStep();if(G.phase!='blockP')return;const used=new Set();
 ((s&&s.blk)||[]).forEach(([mine,theirs])=>{const b=G.p.bf.find(x=>x.id==mine&&!used.has(x.u)&&!x.tap);const a=G.cmb.atk.map(u=>G.e.bf.find(x=>x.u==u)).find(x=>x&&x.id==theirs&&!Object.keys(G.cmb.blk).includes(String(x.u)));if(b&&a){used.add(b.u);hd0('p:'+b.u);hd0('e:'+a.u)}});
 if(s&&s.q){const u=handU2(s.q);if(u){hd0('h:'+u);if(G.mode)tutTarget(s.qt)}}bt('res')}
const DUMMIES=Array(10).fill('tdum');
const TUT=[
/* ---------------- Odysseus ---------------- */
{id:'ody1',h:'ody',t:'Army and battle',sub:'Mana, army members, attacking and blocking.',ename:'Training Camp',eic:'🎯',elife:17,ebg:['#0b1820','#1d4452'],
 deck:['sailor','corsair','spear','thess','aegis','sailor','corsair','thess'],edeck:['tdum','tdum','tdum','tdum','tdum','tbrute',...DUMMIES],
 steps:[
 S.info('Welcome, Odysseus. Every fight is a duel between two armies. <b>Bring the enemy\'s life to 0</b> to win (top left). You have <b>20 life</b> (bottom left).','.eh .hp,.me .hp'),
 S.info('Each turn you get <b>2 mana</b> (◆). A card\'s cost is in its top-right corner.','.me .orb'),
 S.play('sailor','Play <b>Sailor of the Fleet</b>: click it in your hand. Army members stay on the battlefield.'),
 S.play('corsair','Play <b>Cicone Corsair</b>. It has <b>Charge</b>: it can attack the turn it arrives.'),
 S.atk(['corsair'],'Attack: click the <b>Corsair</b>, press <b>Attack</b>, then <b>Resolve combat</b>. <b>Ruthless</b> gives it +1 power when it attacks.'),
 S.info('The Sailor is tired: army members can\'t attack the turn they arrive unless they have Charge.'),
 S.end('Press <b>End turn</b>. Here the enemy plays one card a turn: watch it set up a Training Dummy.'),
 S.play('spear','You drew a card and your mana is back to 2. Play <b>Ithacan Spearman</b>.'),
 S.stance('spear',1,'Attacking taps an army member, and a tapped army member can\'t block. Keep the Spearman home: click its red <b>Attack form</b> label to switch it to <b>defense form</b> (+2 health, and it can\'t attack).'),
 S.atk(['sailor','corsair'],'Now attack with the <b>Sailor</b> and the <b>Corsair</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. A Straw Brute will charge you: <b>click your Spearman, then the Brute</b> to block it, then press <b>Resolve combat</b>.',[['spear','tbrute']]),
 S.info('Your Spearman held. <b>Damage stays</b> on army members until they die or heal, so the Brute\'s hits on it will add up if it attacks again.'),
 S.play('thess','Play <b>Thessalian Rider</b> (Charge).'),
 S.atk(['sailor','corsair','thess'],'Attack with the <b>Sailor</b>, the <b>Corsair</b> and the <b>Rider</b>, then <b>Resolve combat</b>. That wins the fight.')]},
{id:'ody2',h:'ody',t:'Offerings',sub:'Offer army members for mana, and get more out of them when you do.',ename:'Training Camp',eic:'🎯',elife:19,ebg:['#1a1406','#6a5a2a'],
 deck:['camp','charon','ox','argus','corsair','pent','sailor','sailor'],edeck:DUMMIES,
 steps:[
 S.info('Two mana a turn isn\'t much. Odysseus gets more by <b>offering</b> army members to the gods: each one is worth the <b>💀</b> number on its art in mana.'),
 S.play('camp','Play <b>Camp Follower</b>. It costs nothing.'),
 S.offer('camp','Click the <b>💀</b> badge on the Camp Follower to offer it: +1 mana. You have 3.'),
 S.play('charon','Play <b>Charon the Ferryman</b>. He costs 3: offering let you afford him on your first turn.'),
 S.end('Press <b>End turn</b>.'),
 S.play('ox','Play <b>Sacred Ox</b> (cost 1). It is worth <b>💀3</b>.'),
 S.offer('ox','Offer the <b>Ox</b>: +3 mana.'),
 S.play('argus','Play <b>Faithful Argus</b>.'),
 S.offer('argus','Many cards do something <b>when they are offered</b>. Offer <b>Argus</b>: +1 mana, and you draw a card.'),
 S.play('pent','You drew <b>Penthesilea</b> (cost 4). Play her: she has Charge and gives your other Raiders Charge and +1 power.'),
 S.atk(['pent','charon'],'Attack with <b>Penthesilea</b> and <b>Charon</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.offer('charon','Charon is worth the most when offered: <b>+5 mana</b> (3, plus 2 extra) and a card. Offer him.'),
 S.play('corsair','Play <b>Cicone Corsair</b>. Penthesilea gives it Charge too.'),
 S.atk(['pent','corsair'],'Attack with <b>Penthesilea</b> and the <b>Corsair</b>, then <b>Resolve combat</b>.')]},
{id:'ody3',h:'ody',t:'Phalanx',sub:'Hold the line in defense form, then strike back.',ename:'Straw Brutes',eic:'🪓',elife:4,ebg:['#1a0a06','#6a2a1a'],
 deck:['spear','spear','testudo','aegis','sailor','sailor','sailor'],edeck:['tbrute','tbrute',...DUMMIES],
 steps:[
 S.info('<b>Phalanx</b> army members get <b>+2 power in defense form</b>: they hit back hard when they block. Defense form also gives +2 health.'),
 S.play('spear','Play <b>Ithacan Spearman</b>.'),
 S.stance('spear',1,'Click its red <b>Attack form</b> label to switch it to <b>defense form</b>.'),
 S.play('spear','Play the second <b>Spearman</b>.'),
 S.stance('spear',1,'Switch it to <b>defense form</b> too.'),
 S.end('Press <b>End turn</b>. A Straw Brute (3/3) charges in: block it with a <b>Spearman</b> (click the Spearman, then the Brute), then press <b>Resolve combat</b>.',[['spear','tbrute']]),
 S.info('In defense form the Spearman hits for 3, enough to break the Brute.'),
 S.end('Keep your mana. Press <b>End turn</b>. When the next Brute charges, block it with your <b>unhurt Spearman</b>, then cast <b>Testudo</b> (a quick spell: it works during their attack) for +2/+2, then <b>Resolve combat</b>.',[['spear','tbrute']],'testudo'),
 S.info('Quick spells like Testudo can be cast on your turn or during the enemy\'s attack. Now both Brutes are gone: time to strike.'),
 S.stance('spear',0,'Switch both Spearmen back to <b>attack form</b>.'),
 S.play('aegis','Cast <b>Aegis Blessing</b> on a Spearman: +2/+2 this turn.','p:spear'),
 S.atk(['spear','spear'],'Attack with both Spearmen, then <b>Resolve combat</b>.')]},
{id:'ody4',h:'ody',t:'Raiders',sub:'Charge, Ruthless, and spells that count your Raiders.',ename:'Training Camp',eic:'🎯',elife:24,ebg:['#0b1a14','#2f5a3a'],
 deck:['corsair','sailor','raidr','spoils','horde','sailor','corsair'],edeck:DUMMIES,
 steps:[
 S.info('<b>Raiders</b> win by speed: <b>Charge</b> attacks the turn it arrives, and <b>Ruthless</b> gets +1 power when it attacks.'),
 S.play('corsair','Play <b>Cicone Corsair</b> (Charge, Ruthless).'),
 S.play('sailor','Play <b>Sailor of the Fleet</b> (Ruthless).'),
 S.atk(['corsair'],'Attack with the <b>Corsair</b> right away, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('raidr','Play <b>Ithacan Raider</b> (Charge, Ruthless).'),
 S.atk(['corsair','sailor','raidr'],'Attack with all three Raiders, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('spoils','Some spells count your Raiders. Cast <b>Spoils of War</b>: 1 damage to the enemy for each Raider you control, and draw a card.'),
 S.atk(['corsair','sailor','raidr'],'Attack with all three again, then <b>Resolve combat</b>. Raiders are fragile, so they win before the enemy can answer.')]},
/* ---------------- Odin ---------------- */
{id:'odin1',h:'odin',t:'Berserkers',sub:'Pay life for mana, then hit hardest while Wounded.',ename:'Training Camp',eic:'🎯',elife:20,plife:14,ebg:['#0a1220','#2a3a5a'],
 deck:['fjrd','hird','bsrk','oath','skar','thrl','hird'],edeck:DUMMIES,
 steps:[
 S.info('Odin pays with his own blood. <b>Blood price</b>: pay life for 1 mana, once per turn. At half life (10 or less) you are <b>Wounded</b>, and Berserkers get stronger.','.me .hp'),
 S.bp('Press <b>Blood price</b>: 2 life for 1 mana.'),
 S.play('fjrd','Play <b>Fjord Raider</b> (Charge).'),
 S.atk(['fjrd'],'Attack with the <b>Fjord Raider</b>, then <b>Resolve combat</b>.'),
 S.play('hird','Play <b>Hirdman</b> with your last mana.'),
 S.end('Press <b>End turn</b>.'),
 S.bp('Pay <b>Blood price</b> again. It costs 3 now (the price rises each time this fight), and it drops you to 9: <b>Wounded</b>.'),
 S.play('bsrk','Play <b>Bear-Shirt Berserker</b>. It has <b>Battle-rage</b>: +2 power while you are Wounded.'),
 S.atk(['fjrd','hird'],'Attack with the <b>Fjord Raider</b> and the <b>Hirdman</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('oath','Cast <b>Blood Oath</b> on the Berserker: +3/+3 this turn. It costs 1 mana and <b>Carve 2</b>: you also pay 2 life.','p:bsrk'),
 S.atk(['fjrd','hird','bsrk'],'Attack with all three, then <b>Resolve combat</b>.')]},
{id:'odin2',h:'odin',t:'Valhalla',sub:'Army members that pay off when they die.',ename:'Straw Spearmen',eic:'🗡️',elife:10,ebg:['#0a1622','#3a5a6a'],
 deck:['huscl','thegn','einw','hguard','hird','thrl','hird'],edeck:['tspear','tspear','tspear',...DUMMIES],
 steps:[
 S.info('<b>Valhalla</b> army members do something when they die. Losing them is part of the plan.'),
 S.bp('Press <b>Blood price</b> for 1 more mana.'),
 S.play('huscl','Play <b>Housecarl</b>. When it dies, it deals 3 damage to the opponent.'),
 S.end('Press <b>End turn</b>. A Straw Spearman (3/1) charges in: block it with the <b>Housecarl</b>, then press <b>Resolve combat</b>.',[['huscl','tspear']]),
 S.info('The Housecarl fell, took the Spearman with it, and struck the enemy for 3.'),
 S.bp('Press <b>Blood price</b> again.'),
 S.play('thegn','Play <b>Thegn of the Hall</b>. When it dies, you draw a card.'),
 S.play('einw','Play <b>Einherjar Warrior</b>.'),
 S.end('Press <b>End turn</b>. Block the next Spearman with the <b>Thegn</b>, then <b>Resolve combat</b>.',[['thegn','tspear']]),
 S.info('The Thegn died and drew you a card: the <b>Hall-Guard</b>.'),
 S.bp('Press <b>Blood price</b>.'),
 S.play('hguard','Play <b>Hall-Guard of Valhalla</b>. When it dies, a 3/3 Einherjar rises.'),
 S.atk(['einw'],'Attack with the <b>Einherjar Warrior</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. Block the last Spearman with the <b>Hall-Guard</b>, then <b>Resolve combat</b>.',[['hguard','tspear']]),
 S.atk(['ein','einw'],'The Einherjar rose from the Hall-Guard. Attack with it and the <b>Warrior</b>, then <b>Resolve combat</b>.')]},
{id:'odin3',h:'odin',t:'Runes',sub:'Modifiers carved in blood that stay all fight.',ename:'Training Camp',eic:'🎯',elife:14,ebg:['#0a1622','#2a3a4a'],
 deck:['fehu','hird','ruru','fjrd','alg','thrl','hird'],edeck:DUMMIES,
 steps:[
 S.info('<b>Runes</b> are modifiers that stay for the whole fight. Most cost life as well as mana: <b>Carve 3</b> means you also pay 3 life.'),
 S.play('fehu','Carve <b>Fehu, Rune of Wealth</b>: 1 mana and 3 life. From now on you gain 1 extra mana every turn.'),
 S.play('hird','Play <b>Hirdman</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('ruru','Fehu gave you a third mana. Carve <b>Uruz, Rune of Strength</b>: your army members get +1/+0 for the rest of the fight.'),
 S.play('fjrd','Play <b>Fjord Raider</b> (Charge). With Uruz it has 4 power.'),
 S.atk(['hird','fjrd'],'Attack with both, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('alg','Carve <b>Algiz, Rune of Protection</b>: your army members get +0/+2. Runes stack, and each one keeps working all fight.'),
 S.atk(['hird','fjrd'],'Attack with both again, then <b>Resolve combat</b>.')]},
/* ---------------- Wukong ---------------- */
{id:'wk1',h:'wukong',t:'Staff and Momentum',sub:'Chain different kinds of cards to build Momentum.',ename:'Training Camp',eic:'🎯',elife:15,ebg:['#1a0806','#6a2a12'],
 deck:['wmonk','wdart','wfeint','wrod','wbear','wslip','wfeint','wrod','wdart','wfeint','wdart','wsplit','wrod','wdart'],edeck:DUMMIES,
 steps:[
 S.info('Every card of yours is a <b>Strike</b>, a <b>Trick</b> or a <b>Leap</b> (shown on the card). Play a different type than the card before and your <b>Momentum</b> rises. It resets every turn.','.me .cn'),
 S.play('wmonk','Play <b>Mountain Monkey</b> (a Leap). It draws a card. Momentum 1.'),
 S.play('wdart','Cast <b>Hair Dart</b> (a Strike, free), then click the enemy\'s life at the top left. Momentum 2.','ef'),
 S.play('wfeint','Cast <b>Feint</b> (a Trick, free). After a Strike it draws <b>two</b> cards. Momentum 3.'),
 S.play('wrod','Cast <b>Iron Rod</b> (a Strike) at the enemy\'s life: 2 damage. Momentum 4.','ef'),
 S.end('Press <b>End turn</b>. Momentum resets to 0.'),
 S.play('wdart','Build it again. Cast <b>Hair Dart</b> (a Strike) at the enemy\'s life. Momentum 1.','ef'),
 S.play('wslip','Cast <b>Slip Away</b> (a Leap). It draws a card. Momentum 2.'),
 S.play('wbear','Play <b>Staff-Bearer</b> (a Strike). Momentum 3, and when it enters the opponent takes damage equal to your Momentum.'),
 S.atk(['wmonk'],'Attack with the <b>Monkey</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('wfeint','One more chain. Cast <b>Feint</b> (a Trick). Momentum 1.'),
 S.play('wdart','Cast <b>Hair Dart</b> (a Strike) at the enemy\'s life. Momentum 2.','ef'),
 S.play('wsplit','Finish with <b>Heaven-Splitting Blow</b>: damage equal to your Momentum plus half the cards you played this turn. The longer the chain, the harder it hits.'),
 S.atk(['wmonk','wbear'],'Attack with the <b>Monkey</b> and the <b>Staff-Bearer</b>, then <b>Resolve combat</b>.')]},
{id:'wk2',h:'wukong',t:'Clones',sub:'Many small cards: Spare Hairs and spells that count your cards.',ename:'Training Camp',eic:'🎯',elife:10,ebg:['#14140a','#5a5a2a'],
 deck:['wclone','wclone','whair','whair','wcloudh','whair','wclone','whair','whair','wdart'],edeck:DUMMIES,
 steps:[
 S.info('<b>Clones</b> fight with many small cards. <b>Spare Hairs</b> cost nothing and deal 1 damage, then <b>Disintegrate</b>: they leave the fight for good.'),
 S.play('wclone','Play <b>Clone of the Great Sage</b> (Charge).'),
 S.play('wclone','Play the second <b>Clone</b>.'),
 S.atk(['wclone','wclone'],'Attack with both Clones, then <b>Resolve combat</b>.'),
 S.play('whair','Cast a <b>Spare Hair</b> at the enemy\'s life. Keep the other one for next turn.','ef'),
 S.end('Press <b>End turn</b>.'),
 S.play('whair','Free cards keep your turn going. Cast your other <b>Spare Hair</b> at the enemy.','ef'),
 S.play('wcloudh','Cast <b>Hair Whirl</b>: it draws a card for every 2 cards you have played this turn.'),
 S.play('whair','Cast the <b>Spare Hair</b> it drew at the enemy.','ef'),
 S.atk(['wclone','wclone'],'Attack with both Clones, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('wclone','Play a third <b>Clone</b> (Charge).'),
 S.atk(['wclone','wclone','wclone'],'Attack with all three Clones, then <b>Resolve combat</b>.')]},
{id:'wk3',h:'wukong',t:'Trickster',sub:'Tap blockers out of the way and cheat mana.',ename:'Shield Dummies',eic:'🛡️',elife:8,ebg:['#100c18','#4a3a6a'],
 deck:['wmonk','wclone','wfeint','wslip','wseal','wdance','wfoot','wdart','wrod','wdart'],edeck:['tblk','tblk','tblk',...DUMMIES],
 steps:[
 S.info('<b>Tricksters</b> tap, bounce and cheat mana. A <b>tapped</b> army member can\'t block.'),
 S.play('wmonk','Play <b>Mountain Monkey</b>. It draws a card.'),
 S.play('wclone','Play <b>Clone of the Great Sage</b> (Charge).'),
 S.atk(['wclone'],'Attack with the <b>Clone</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. The enemy will set up a Shield Dummy to block you.'),
 S.play('wfeint','Cast <b>Feint</b> (a Trick). It draws a card.'),
 S.play('wslip','Cast <b>Slip Away</b>. After a Trick it gives you <b>1 mana</b>: you have 3.'),
 S.play('wseal','Cast <b>Five-Finger Seal</b> on the Shield Dummy: it is tapped and stays tapped through their next turn.','e:tblk'),
 S.atk(['wmonk','wclone'],'Nothing can block now. Attack with both, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. They add a second Shield Dummy; the first one is still sealed.'),
 S.play('wdance','Cast <b>Dancing Away</b> on the new Shield Dummy to tap it.','e:tblk'),
 S.play('wdart','Cast <b>Hair Dart</b> at the enemy\'s life.','ef'),
 S.play('wfoot','Cast <b>Nimble Footwork</b>: this is your third card this turn, so it gives you 1 mana back.'),
 S.play('wrod','Spend it on <b>Iron Rod</b> at the enemy\'s life.','ef'),
 S.atk(['wmonk','wclone'],'Attack with both, then <b>Resolve combat</b>.')]},
/* ---------------- Thoth ---------------- */
{id:'th1',h:'thoth',t:'Sundered',sub:'Split army members into Body and Spirit, and use their Names.',ename:'The Clay Giant',eic:'🗿',elife:4,ebg:['#1a1206','#6a5222'],
 deck:['tmedj','tmedj','tsun','iink','dcut','tmedj','tscr','tmedj'],edeck:['tgiant',...DUMMIES],
 steps:[
 S.info('Thoth splits army members apart. <b>Sunder</b> one and it becomes its <b>Body</b> (no power, can\'t block) and its <b>Spirit</b> (1 health), and you take its <b>Name</b>.'),
 S.play('tmedj','Play <b>Medjay of the Temple</b>.'),
 S.play('tmedj','Play the second <b>Medjay</b>.'),
 S.end('Press <b>End turn</b>. The enemy will raise a Clay Giant to block you.'),
 S.play('tsun','Cast <b>Sunder the Soul</b> on the <b>Clay Giant</b>.','e:tgiant'),
 S.speak('You took the Giant\'s <b>Name</b>. Click the <b>◆+2</b> badge on it to <b>speak</b> the Name: +2 mana.'),
 S.play('iink','Cast <b>Ink of Seshat</b> on a Medjay: +1/+1 and Ruthless, written as glyphs.','p:tmedj'),
 S.atk(['tmedj','tmedj'],'The Giant can\'t block any more. Attack with both Medjay, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('dcut','You can Sunder your own army members too. Cast <b>Ritual Knife</b> on a Medjay: it splits, you take its Name, and you draw a card.','p:tmedj'),
 S.play('@ren','This time <b>write</b> the Name instead of speaking it: play it on your other Medjay to give it +1/+1.','p:tmedj'),
 S.atk(['tmedj'],'Attack with the Medjay, then <b>Resolve combat</b>.')]},
{id:'th2',h:'thoth',t:'Scribes',sub:'Write glyphs and equip amulets.',ename:'Training Camp',eic:'🎯',elife:12,ebg:['#1a1206','#5a4a2a'],
 deck:['tmedj','iink','gfeather','tscr','iwas','tmedj','iscribe','tmedj'],edeck:DUMMIES,
 steps:[
 S.info('<b>Scribes</b> make one army member great: <b>glyphs</b> written onto it (up to 3) and <b>amulets</b> it wears.'),
 S.play('tmedj','Play <b>Medjay of the Temple</b>.'),
 S.play('iink','Cast <b>Ink of Seshat</b> on it: glyphs of +1/+1 and Ruthless.','p:tmedj'),
 S.end('Press <b>End turn</b>.'),
 S.play('gfeather','Play <b>Feather of Ma\'at</b> and put it on the Medjay: +1/+1.','p:tmedj'),
 S.play('tscr','Play <b>Temple Scribe</b>: it writes a glyph of <b>Ward</b> onto the Medjay. That is its third glyph.','p:tmedj'),
 S.atk(['tmedj'],'Attack with the Medjay, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('iwas','Play the <b>Was-Sceptre</b> and put it on the Medjay: +1/+0, and +1/+0 more for each glyph on it.','p:tmedj'),
 S.info('If an amulet\'s wearer dies, the amulet stays on the battlefield: click it and another army member to move it (it costs its equip price).'),
 S.atk(['tmedj'],'Attack with the Medjay, then <b>Resolve combat</b>.')]},
{id:'th3',h:'thoth',t:'Recorder',sub:'Foresee the enemy\'s cards and punish them.',ename:'Training Camp',eic:'🎯',elife:6,ebg:['#1a1206','#4a3a1a'],
 deck:['yfore','yibis','ywatch','tmedj','ypre','tmedj','tscr'],edeck:['tdum','tblk','tdum','tdum','tdum','tdum','tdum','tdum','tdum','tdum'],
 steps:[
 S.info('The <b>Recorder</b> reads the future. <b>Foresee</b> marks the enemy\'s next cards (listed under their mana, 👁), and other cards punish them for playing what you saw.'),
 S.play('yfore','Play <b>Foreknowledge</b>: whenever they play a Foreseen card, they lose 2 life.'),
 S.play('yibis','Play <b>Ibis of Thoth</b>: it Foresees the top 2 cards of their deck.'),
 S.end('Press <b>End turn</b> and watch them play what you foresaw.'),
 S.play('ywatch','Play <b>Watcher at the Gate</b>: it Foresees their whole hand.'),
 S.atk(['yibis'],'Attack with the <b>Ibis</b> (Flying), then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. Every card they play now costs them 2 life.'),
 S.play('ypre','Their next foreseen card is a <b>Shield Dummy</b> that would block you. Cast <b>Preempt</b>: when they play it, it fails. You draw a card.'),
 S.atk(['yibis','ywatch'],'Attack with the <b>Ibis</b> and the <b>Watcher</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. Their preempted card fails, and the rest still cost them life.')]}
];

const JOURNEY=[
 {t:'A run',m:'A run is a journey through your hero\'s home realm (<b>Act I</b>), then another hero\'s realm (<b>Act II</b>), then the War in Heaven (<b>Act III</b>). Win all three acts to win the run. If your life reaches 0, the run ends.'},
 {t:'Drafting your deck',m:C=>'You start with 4 <b>staple</b> cards and draft 11 more, choosing 1 of 3 each time. Rarer cards appear less often. Stick mostly to one or two <b>archetypes</b> (for '+C.n.split(',')[0]+': '+C.arch.map(a=>a[1]).join(', ').replace(/, ([^,]*)$/,' or $1')+'): their cards are built to work together.'},
 {t:'The map',m:'Each act is a web of places. Moving costs <b>action points</b> (⚡). Winning a fight earns a <b>victory point</b> (🏆) and more action points. Gold-starred fights are <b>elites</b>: harder, with better rewards. You can see how strong the next opponent will be before you go.'},
 {t:'Places to visit',m:'<b>Campfires</b> heal you. <b>Crafting tables</b> let you draft a new card or remove a weak one. <b>Altars</b> let you duplicate or upgrade a card. Each costs action points, so plan your route.'},
 {t:'Prestige',m:'After a win, every army member of yours that survived earns <b>Prestige</b>: a permanent upgrade, such as more power, health or a lower cost. Keeping your army alive makes your deck stronger.'},
 {t:'The guardian',m:'After 4 victory points, return to the centre of the map and make your offering at the altar. Two <b>guardians</b> answer: choose which boss to face. Each boss has a <b>trump</b>, a rule-bending card it casts on its first turn.'},
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
 'main:thoth':'<b>Your first fight.</b> You get 2 mana a turn. Sunder an army member to take its Name, then speak the Name (◆+2) for mana or write it onto an army member. Click an amulet on the battlefield to equip it.',
 main:'<b>Your first fight.</b> You get 2 mana a turn. Offer army members (click 💀) for more. Click a card\'s form label to switch between attack and defense form. Damage stays on army members between turns.',
 kleos:'<b>Prestige.</b> Each of your surviving army members earns a permanent upgrade. Pick one for each.',
 bossp:'<b>The guardian.</b> Choose which boss to face. Each boss casts its trump on its first turn: a card that changes the rules of the fight.',
 a2:'<b>Act II.</b> You\'re in another hero\'s realm now. These enemies were built for a different hero, so read their trumps carefully.'
};
/* v108: the turn-start message names the hero's own mana source (every hero can still offer) */
const TURNM={ody:'offer army members (💀) for more.',odin:'press Blood price to pay life for 1 more, or offer army members (💀).',
 wukong:'play different card types in a row (Strike, Trick, Leap) to build Momentum.',thoth:'speak a Name (◆+2) or offer army members (💀) for more.'};
function turnMsg(){return'Your turn. Mana refills to 2; '+(TURNM[(G&&G.ch)||'ody']||TURNM.ody)}
/* ---------- tutorial flow ---------- */
function tutStart(i){const L=TUT[i];if(!L)return;const h=L.h||'ody';setChar(h);UND=null;U=0;
 G={ch:h,th:h,fi:0,log:[],sel:[],tg:{},p:side([],20),rt:[],lanes:[],web:genWeb(),pos:0,act:2,trail:{},phase:'main',boss:0,elt:0,tut:{i,s:0,won:0}};
 G.p.recs=L.deck.map(id=>({id,a:0,d:0,c:0,s:0,k:0,fl:0}));
 EN.push({n:L.ename,l:L.elife,ic:L.eic,hint:'',bg:L.ebg,d:L.edeck.slice()});G.rt=[EN.length-1];
 fight();const p=G.p,e=G.e;
 p.deck=L.deck.map(id=>mk(id)).reverse();p.hand=[];p.gy=[];draw(p,4);
 e.deck=L.edeck.map(id=>mk(id)).reverse();e.hand=[];draw(e,4);e.life=e.max=L.elife;e.bf=[];if(L.plife)p.life=L.plife;
 G.log=[];G.msg='';G.phase='main';render()}
/* safety net: if the guide's steps are done and the enemy still stands, keep guiding until it falls */
const TFIN={k:'fin',m:'Finish the fight: press <b>Attack with all</b>, then <b>Resolve combat</b>. If nothing can attack, press <b>End turn</b>.'};
function tutStep(){if(!G||!G.tut)return null;const L=TUT[G.tut.i];if(!L)return null;return L.steps[G.tut.s]||(G.phase!='tutend'?TFIN:null)}
function tutNoEnd(){const s=tutStep();return s&&s.noEnd&&G.phase=='main'?'Finish this step first: '+s.m.replace(/<[^>]+>/g,'').split('.')[0]+'.':''}
function tutChk(){const p=G.p,e=G.e;if(e.life<=0||p.life<=0){G.tut.won=e.life<=0?1:0;G.phase='tutend';if(G.tut.won)tutMark(TUT[G.tut.i].id);return true}return false}
function tutTick(){if(!G||!G.tut||G.phase=='tutend')return;for(let k=0;k<20;k++){const s=tutStep();if(!s)return;if(G.tut.si!==G.tut.s)tutSnap();if(s.next)return;let ok=false;try{ok=tutIsDone(s)}catch(e){}if(!ok)return;G.tut.s++}}
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
  el.innerHTML=`<div class="tutch">${L.t}<span>${Math.min(G.tut.s+1,L.steps.length)} / ${L.steps.length}</span></div><div class="tutcm">${s.m}</div><div class="tutcb">${s.next?'<button class="b" data-b="tutnext">Next</button>':''}<button class="tutx" data-b="tutmenu">Leave lesson</button></div>`;
  const h=tutHi(s);if(h)try{document.querySelectorAll(h).forEach(x=>x.classList.add('tuthi'))}catch(e){}return}
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
