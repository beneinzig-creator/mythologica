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

/* v112: every lesson is scripted to a win. Each step names the one action the guide asks for (k), so the
   game can tell when it is done and the test (tutAuto) can follow the guide exactly. Opponents are straw dummies. */
Object.assign(D,{
 tdum:['Training Dummy',0,'C',0,2,'n','A straw target. It can\'t attack or block.','🎯','N',1],
 tdum1:['Straw Soldier',1,'C',0,2,'n','A straw target. It can\'t attack or block.','🎯','N',1],
 tblk:['Shield Dummy',1,'C',0,3,'','A straw target that blocks.','🛡️','N',1],
 tstraw:['Straw Raider',1,'C',1,1,'nh','It charges in every turn and can\'t block.','🪓','N',1],
 tspear:['Straw Spearman',1,'C',3,1,'nh','It charges in every turn and can\'t block.','🗡️','N',1],
 tgiant:['Clay Giant',2,'C',2,6,'k','A Sentinel: it only blocks.','🗿','N',2]});
Object.assign(LORE,{tdum:'Training dummy',tdum1:'Training dummy',tblk:'Training dummy',tstraw:'Training dummy',tspear:'Training dummy',tgiant:'Training dummy'});
ENTD.tstraw=(s,c)=>{c.forced=1};ENTD.tspear=(s,c)=>{c.forced=1};
const bfAll=id=>G.p?G.p.bf.filter(x=>x.id==id):[];
const cntIn=(L,id)=>L.filter(x=>x.id==id).length;
const S={
 info:(m,hi)=>({k:'info',m,hi,next:1}),
 play:(id,m,tgt)=>({k:'play',id,tgt,m,noEnd:1}),
 atk:(ids,m)=>({k:'atk',ids,m,noEnd:1}),
 end:(m,blk)=>({k:'end',m,blk}),
 offer:(id,m)=>({k:'offer',id,m,noEnd:1}),
 bp:m=>({k:'bp',m,noEnd:1}),
 stance:(id,want,m)=>({k:'stance',id,want,m,noEnd:1}),
 speak:m=>({k:'speak',m,noEnd:1})};
function tutHi(s){if(s.hi)return typeof s.hi=='function'?s.hi():s.hi;const p=G.p;
 if(s.k=='play'){const L=[hiHand(s.id)()];if(G.mode&&s.tgt){if(s.tgt=='ef')L.push('.eh .hp');else if(s.tgt.startsWith('e:'))L.push('.fe .cd');else L.push('.fp .cd')}return L.filter(Boolean).join(',')}
 if(s.k=='atk'){const L=s.ids.map(id=>bfAll(id).map(c=>`.fp .cd[data-z="p:${c.u}"]`).join(',')).filter(Boolean);L.push('[data-b="atk"]','[data-b="res"]');return L.join(',')}
 if(s.k=='end')return G.phase=='blockP'?'.fp .cd,.fe .cd,[data-b="res"]':'[data-b="end"]';
 if(s.k=='offer'){const u=bfU(s.id);return u?`.fp .ob[data-z="o:${u}"]`:''}
 if(s.k=='bp')return'[data-b="bp"]';
 if(s.k=='stance')return bfAll(s.id).filter(c=>!!c.def!=!!s.want).map(c=>`.fp .sb[data-z="s:${c.u}"]`).join(',');
 if(s.k=='speak')return'.hand .spk';return''}
function tutSnap(){const p=G.p,t=G.tut;t.si=t.s;t.sn={t:G.turn,h:{},b:{},bp:p.bp||0};p.hand.forEach(c=>{t.sn.h[c.id]=(t.sn.h[c.id]||0)+1});p.bf.forEach(c=>{t.sn.b[c.id]=(t.sn.b[c.id]||0)+1})}
function tutIsDone(s){const p=G.p,n=G.tut.sn;if(s.done)return s.done();
 switch(s.k){case'play':return cntIn(p.hand,s.id)<(n.h[s.id]||0);
  case'atk':return!!G.atkd&&!G.cmb&&G.phase=='main';
  case'end':return G.turn>n.t&&G.phase=='main';
  case'offer':return cntIn(p.bf,s.id)<(n.b[s.id]||0);
  case'bp':return(p.bp||0)>n.bp;
  case'stance':{const L=bfAll(s.id);return L.length>0&&L.every(c=>!!c.def==!!s.want)}
  case'speak':return!p.hand.some(c=>c.ren)}return false}
/* the guide, followed exactly (tests) */
function tutTarget(t){const e=G.e,p=G.p;if(!t)return;if(t=='ef')return hd0('ef');const [k,id]=t.split(':');const L=(k=='e'?e:p).bf.filter(x=>x.id==id||(id=='*'));const c=L.find(x=>!x.tap)||L[0];if(c)hd0(k+':'+c.u)}
function tutAuto(){const s=tutStep();if(!s||G.phase!='main')return;
 if(s.next)return bt('tutnext');
 if(s.k=='play'){const u=handU(s.id);if(!u)return;hd0('h:'+u);if(G.mode||G.pend)tutTarget(s.tgt);return}
 if(s.k=='atk'){const used=new Set();G.sel=[];s.ids.forEach(id=>{const c=G.p.bf.find(x=>x.id==id&&!used.has(x.u)&&canAtk(x));if(c){used.add(c.u);G.sel.push(c.u)}});bt('atk');if(G.phase=='dmgP')bt('res');return}
 if(s.k=='end')return bt('end');
 if(s.k=='offer')return hd0('o:'+bfU(s.id));
 if(s.k=='bp')return bt('bp');
 if(s.k=='stance'){const c=bfAll(s.id).find(x=>!!x.def!=!!s.want);if(c)hd0('s:'+c.u);return}
 if(s.k=='speak'){const c=G.p.hand.find(x=>x.ren);if(c)hd0('spk:'+c.u)}}
function tutAutoBlock(){const s=tutStep();if(G.phase!='blockP')return;const used=new Set();
 ((s&&s.blk)||[]).forEach(([mine,theirs])=>{const b=G.p.bf.find(x=>x.id==mine&&!used.has(x.u)&&!x.tap);const a=G.cmb.atk.map(u=>G.e.bf.find(x=>x.u==u)).find(x=>x&&x.id==theirs&&!Object.keys(G.cmb.blk).includes(String(x.u)));if(b&&a){used.add(b.u);hd0('p:'+b.u);hd0('e:'+a.u)}});bt('res')}
const DUMMIES=Array(10).fill('tdum');
const TUT=[
/* ---------------- Odysseus ---------------- */
{id:'ody1',h:'ody',t:'Army and battle',sub:'The basics: mana, army members and attacking.',ename:'Training Dummies',eic:'🎯',elife:11,ebg:['#0b1820','#1d4452'],
 deck:['sailor','corsair','thess','spearc','aegis','sailor','corsair','thess'],edeck:DUMMIES,
 steps:[
 S.info('Welcome, Odysseus. Every fight is a duel between two armies. <b>Bring the enemy\'s life to 0</b> to win (top left). You have <b>20 life</b> (bottom left).','.eh .hp,.me .hp'),
 S.info('Each turn you get <b>2 mana</b> (◆). A card\'s cost is in its top-right corner.','.me .orb'),
 S.play('sailor','Play <b>Sailor of the Fleet</b>: click it in your hand. Army members stay on the battlefield.'),
 S.play('corsair','Play <b>Cicone Corsair</b>. It has <b>Charge</b>, so it can attack the turn it arrives.'),
 S.atk(['corsair'],'Attack: click the <b>Corsair</b>, press <b>Attack</b>, then <b>Resolve combat</b>. <b>Ruthless</b> gives it +1 power when it attacks.'),
 S.info('The Sailor is tired: army members can\'t attack the turn they arrive unless they have Charge. Damage on army members stays until they die or heal.'),
 S.end('Press <b>End turn</b>. The dummies can\'t fight back.'),
 S.play('thess','Your mana is back to 2 and you drew a card. Play <b>Thessalian Rider</b> (Charge).'),
 S.atk(['sailor','corsair','thess'],'Attack with all three: click each one, press <b>Attack</b>, then <b>Resolve combat</b>. That\'s enough to win.')]},
{id:'ody2',h:'ody',t:'Offerings',sub:'Odysseus\'s mana engine: offer army members for mana.',ename:'Training Dummies',eic:'🎯',elife:9,ebg:['#1a1406','#6a5a2a'],
 deck:['camp','ox','pent','corsair','sailor','sailor'],edeck:DUMMIES,
 steps:[
 S.info('Two mana a turn isn\'t much. Odysseus gets more by <b>offering</b> army members to the gods: each one is worth the <b>💀</b> number on its art in mana.'),
 S.play('camp','Play <b>Camp Follower</b>. It costs nothing.'),
 S.offer('camp','Click the <b>💀</b> badge on the Camp Follower to offer it: +1 mana.'),
 S.play('ox','Play <b>Sacred Ox</b> (cost 1). It is worth <b>💀3</b>.'),
 S.offer('ox','Offer the <b>Ox</b>: +3 mana. You now have 5.'),
 S.play('pent','Play <b>Penthesilea</b>. She costs 4, which you could never afford with 2 mana. She has Charge and gives your other Raiders Charge and +1 power.'),
 S.play('corsair','Play <b>Cicone Corsair</b> with your last mana.'),
 S.atk(['pent','corsair'],'Attack with both: click them, press <b>Attack</b>, then <b>Resolve combat</b>.')]},
{id:'ody3',h:'ody',t:'Phalanx',sub:'Hold the line in defense form, then strike.',ename:'Straw Raiders',eic:'🪓',elife:4,ebg:['#1a0a06','#6a2a1a'],
 deck:['spear','spear','aegis','sailor','sailor','sailor'],edeck:['tstraw','tstraw',...DUMMIES],
 steps:[
 S.info('<b>Phalanx</b> army members get <b>+2 power in defense form</b>: they hit back hard when they block. Defense form also gives +2 health.'),
 S.play('spear','Play <b>Ithacan Spearman</b>.'),
 S.stance('spear',1,'Click the red <b>Attack form</b> label on the Spearman to switch it to <b>defense form</b>.'),
 S.play('spear','Play the second <b>Spearman</b>.'),
 S.stance('spear',1,'Switch it to <b>defense form</b> too.'),
 S.end('Press <b>End turn</b>. Two Straw Raiders will charge you: <b>click a Spearman, then a Raider</b> to block it, do the same for the other, then press <b>Resolve combat</b>.',[['spear','tstraw'],['spear','tstraw']]),
 S.info('The Raiders broke on your shields. Now it\'s your turn to strike.'),
 S.stance('spear',0,'Switch both Spearmen back to <b>attack form</b> (click each label).'),
 S.play('aegis','Cast <b>Aegis Blessing</b> on a Spearman: +2/+2 this turn.','p:spear'),
 S.atk(['spear','spear'],'Attack with both Spearmen, then <b>Resolve combat</b>.')]},
{id:'ody4',h:'ody',t:'Raiders',sub:'Strike fast with Charge and Ruthless.',ename:'Training Dummies',eic:'🎯',elife:15,ebg:['#0b1a14','#2f5a3a'],
 deck:['corsair','sailor','horde','raidr','sailor','corsair'],edeck:DUMMIES,
 steps:[
 S.info('<b>Raiders</b> win by speed: <b>Charge</b> attacks the turn it arrives, and <b>Ruthless</b> gets +1 power when it attacks.'),
 S.play('corsair','Play <b>Cicone Corsair</b> (Charge, Ruthless).'),
 S.play('sailor','Play <b>Sailor of the Fleet</b> (Ruthless).'),
 S.atk(['corsair'],'Attack with the <b>Corsair</b> right away, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>.'),
 S.play('horde','Cast <b>Charge of the Amazons</b>: your Raiders get +4/+0 this turn.'),
 S.atk(['corsair','sailor'],'Attack with both, then <b>Resolve combat</b>. Raiders are fragile, so they win before the enemy can answer.')]},
/* ---------------- Odin ---------------- */
{id:'odin1',h:'odin',t:'Berserkers',sub:'Pay life for mana, then hit hardest while Wounded.',ename:'Training Dummies',eic:'🎯',elife:14,plife:12,ebg:['#0a1220','#2a3a5a'],
 deck:['fjrd','hird','rage','bsrk','hird','thrl'],edeck:DUMMIES,
 steps:[
 S.info('Odin pays with his own blood. <b>Blood price</b>: pay life for 1 mana, once per turn. At half life (10 or less) you are <b>Wounded</b>, and Berserkers get stronger.','.me .hp'),
 S.bp('Press <b>Blood price</b>: 2 life for 1 mana. You drop to 10: <b>Wounded</b>.'),
 S.play('fjrd','Play <b>Fjord Raider</b> (Charge).'),
 S.atk(['fjrd'],'Attack with the <b>Fjord Raider</b>, then <b>Resolve combat</b>.'),
 S.play('hird','Play <b>Hirdman</b> with your last mana.'),
 S.end('Press <b>End turn</b>.'),
 S.bp('Pay <b>Blood price</b> again. It costs 3 now: the price rises each time this fight.'),
 S.play('rage','Cast <b>Berserkergang</b>: +3/+0 for your army, or <b>+5/+0 because you are Wounded</b>.'),
 S.atk(['fjrd','hird'],'Attack with both, then <b>Resolve combat</b>.')]},
{id:'odin2',h:'odin',t:'Valhalla',sub:'Army members that pay off when they die.',ename:'Straw Spearmen',eic:'🗡️',elife:6,ebg:['#0a1622','#3a5a6a'],
 deck:['huscl','hguard','thegn','hird','thrl','hird'],edeck:['tspear','tspear',...DUMMIES],
 steps:[
 S.info('<b>Valhalla</b> army members do something when they die. Losing them is part of the plan.'),
 S.bp('Press <b>Blood price</b> for 1 more mana.'),
 S.play('huscl','Play <b>Housecarl</b>. When it dies, it deals 3 damage to the opponent.'),
 S.end('Press <b>End turn</b>. Two Straw Spearmen charge in: <b>click the Housecarl, then a Spearman</b> to block it, then press <b>Resolve combat</b>.',[['huscl','tspear']]),
 S.info('The Housecarl fell, took its Spearman with it, and struck the enemy for 3.'),
 S.bp('Press <b>Blood price</b> again.'),
 S.play('hguard','Play <b>Hall-Guard of Valhalla</b>. When it dies, a 3/3 Einherjar rises.'),
 S.end('Press <b>End turn</b>, then block the last Spearman with the <b>Hall-Guard</b> and press <b>Resolve combat</b>.',[['hguard','tspear']]),
 S.atk(['ein'],'The Einherjar rose from the Hall-Guard. Attack with it, then <b>Resolve combat</b>.')]},
{id:'odin3',h:'odin',t:'Runes',sub:'Modifiers carved in blood that stay all fight.',ename:'Training Dummies',eic:'🎯',elife:7,ebg:['#0a1622','#2a3a4a'],
 deck:['hird','ruru','fjrd','thrl','hird','thrl'],edeck:DUMMIES,
 steps:[
 S.info('<b>Runes</b> are modifiers that stay for the whole fight. Most cost life as well as mana: <b>Carve 3</b> means you also pay 3 life.'),
 S.play('hird','Play <b>Hirdman</b>.'),
 S.play('ruru','Carve <b>Uruz, Rune of Strength</b>: 1 mana and 3 life. Your army members get +1/+0 for the rest of the fight.'),
 S.end('Press <b>End turn</b>.'),
 S.play('fjrd','Play <b>Fjord Raider</b> (Charge). Uruz makes it 4 power.'),
 S.atk(['hird','fjrd'],'Attack with both, then <b>Resolve combat</b>.')]},
/* ---------------- Wukong ---------------- */
{id:'wk1',h:'wukong',t:'Staff and Momentum',sub:'Chain different kinds of cards to build Momentum.',ename:'Training Dummies',eic:'🎯',elife:7,ebg:['#1a0806','#6a2a12'],
 deck:['wmonk','wdart','wfeint','wrod','wbear','wslip','wfeint','wrod','wdart','wmonk','wdart','wrod'],edeck:DUMMIES,
 steps:[
 S.info('Every card of yours is a <b>Strike</b>, a <b>Trick</b> or a <b>Leap</b> (shown on the card). Play a different type than the card before and your <b>Momentum</b> rises. It resets every turn.','.me .cn'),
 S.play('wmonk','Play <b>Mountain Monkey</b> (a Leap). It draws a card. Momentum 1.'),
 S.play('wdart','Cast <b>Hair Dart</b> (a Strike, free), then click the enemy\'s life at the top left. Momentum 2.','ef'),
 S.play('wfeint','Cast <b>Feint</b> (a Trick, free). After a Strike it draws <b>two</b> cards. Momentum 3.'),
 S.play('wrod','Cast <b>Iron Rod</b> (a Strike) at the enemy\'s life: 2 damage. Momentum 4.','ef'),
 S.end('Press <b>End turn</b>. Momentum resets to 0.'),
 S.play('wdart','Build it again. Cast <b>Hair Dart</b> (a Strike) at the enemy\'s life. Momentum 1.','ef'),
 S.play('wslip','Cast <b>Slip Away</b> (a Leap). It draws a card. Momentum 2.'),
 S.play('wbear','Play <b>Staff-Bearer</b> (a Strike). Momentum 3, and when it enters the opponent takes damage equal to your Momentum.')]},
{id:'wk2',h:'wukong',t:'Clones',sub:'Spare Hairs: free cards that vanish after use.',ename:'Training Dummies',eic:'🎯',elife:5,ebg:['#14140a','#5a5a2a'],
 deck:['wclone','wclone','whair','whair','whair','wmonk','wdart'],edeck:DUMMIES,
 steps:[
 S.info('<b>Clones</b> fight with many small cards. <b>Spare Hairs</b> cost nothing and deal 1 damage, then <b>Disintegrate</b>: they leave the fight for good.'),
 S.play('wclone','Play <b>Clone of the Great Sage</b> (Charge).'),
 S.play('wclone','Play the second <b>Clone</b>.'),
 S.atk(['wclone','wclone'],'Attack with both Clones, then <b>Resolve combat</b>.'),
 S.play('whair','Cast a <b>Spare Hair</b> at the enemy\'s life.','ef'),
 S.play('whair','And the other <b>Spare Hair</b>.','ef'),
 S.end('Press <b>End turn</b>. Clones that die shuffle more Spare Hairs into your deck.'),
 S.play('whair','You drew another <b>Spare Hair</b>. Cast it at the enemy to win.','ef')]},
{id:'wk3',h:'wukong',t:'Trickster',sub:'Tap blockers out of the way and cheat mana.',ename:'Shield Dummies',eic:'🛡️',elife:3,ebg:['#100c18','#4a3a6a'],
 deck:['wmonk','wclone','wdance','wslip','wseal','wrod','wdart'],edeck:['tblk','tblk',...DUMMIES],
 steps:[
 S.info('<b>Tricksters</b> tap, bounce and cheat mana. A <b>tapped</b> army member can\'t block.'),
 S.play('wmonk','Play <b>Mountain Monkey</b>. It draws a card.'),
 S.play('wclone','Play <b>Clone of the Great Sage</b> (Charge).'),
 S.atk(['wclone'],'Attack with the <b>Clone</b>, then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. The enemy will set up two Shield Dummies to block you.'),
 S.play('wseal','Cast <b>Five-Finger Seal</b> (a Trick) on a Shield Dummy: it is tapped and stays tapped.','e:tblk'),
 S.play('wslip','Cast <b>Slip Away</b>. After a Trick it gives you <b>1 mana</b>.'),
 S.play('wdance','Cast <b>Dancing Away</b> on the other Shield Dummy to tap it.','e:tblk'),
 S.atk(['wmonk','wclone'],'Nothing can block now. Attack with both, then <b>Resolve combat</b>.')]},
/* ---------------- Thoth ---------------- */
{id:'th1',h:'thoth',t:'Sundered',sub:'Split an army member into Ka and Ba and take its name.',ename:'The Clay Giant',eic:'🗿',elife:3,ebg:['#1a1206','#6a5222'],
 deck:['tmedj','tmedj','tsun','iink','tmedj','tscr'],edeck:['tgiant',...DUMMIES],
 steps:[
 S.info('Thoth splits army members apart. <b>Sunder</b> one and it becomes its <b>Ka</b> (the body: no power, can\'t block) and its <b>Ba</b> (the soul: 1 health), and you take its <b>Ren</b>, its true name.'),
 S.play('tmedj','Play <b>Medjay of the Temple</b>.'),
 S.play('tmedj','Play the second <b>Medjay</b>.'),
 S.end('Press <b>End turn</b>. The enemy will raise a Clay Giant to block you.'),
 S.play('tsun','Cast <b>Sunder the Soul</b> on the <b>Clay Giant</b>.','e:tgiant'),
 S.speak('You took the Giant\'s <b>Ren</b>. Click the <b>◆+2</b> badge on it to speak the name: +2 mana.'),
 S.play('iink','Cast <b>Ink of Seshat</b> on a Medjay: +1/+1 and Ruthless, written as glyphs.','p:tmedj'),
 S.atk(['tmedj','tmedj'],'The Giant can\'t block any more. Attack with both Medjay, then <b>Resolve combat</b>.')]},
{id:'th2',h:'thoth',t:'Scribes',sub:'Write glyphs and equip amulets.',ename:'Training Dummies',eic:'🎯',elife:4,ebg:['#1a1206','#5a4a2a'],
 deck:['tmedj','iink','gfeather','tscr','tmedj','iscribe'],edeck:DUMMIES,
 steps:[
 S.info('<b>Scribes</b> make one army member great: <b>glyphs</b> written onto it (up to 3) and <b>amulets</b> it wears.'),
 S.play('tmedj','Play <b>Medjay of the Temple</b>.'),
 S.play('iink','Cast <b>Ink of Seshat</b> on it: glyphs of +1/+1 and Ruthless.','p:tmedj'),
 S.end('Press <b>End turn</b>.'),
 S.play('gfeather','Play <b>Feather of Ma\'at</b> and put it on the Medjay: +1/+1. If the wearer dies, the amulet stays and can be moved.','p:tmedj'),
 S.play('tscr','Play <b>Temple Scribe</b>: it writes a glyph of <b>Ward</b> onto the Medjay.','p:tmedj'),
 S.atk(['tmedj'],'Attack with the Medjay, then <b>Resolve combat</b>.')]},
{id:'th3',h:'thoth',t:'Recorder',sub:'Foresee the enemy\'s cards and punish them.',ename:'Straw Soldiers',eic:'🎯',elife:5,ebg:['#1a1206','#4a3a1a'],
 deck:['yfore','yibis','ywatch','tmedj','tmedj','tscr'],edeck:Array(10).fill('tdum1'),
 steps:[
 S.info('The <b>Recorder</b> reads the future. <b>Foresee</b> marks the enemy\'s next cards (listed under their mana, 👁), and other cards punish them for playing what you saw.'),
 S.play('yfore','Play <b>Foreknowledge</b>: whenever they play a Foreseen card, they lose 2 life.'),
 S.play('yibis','Play <b>Ibis of Thoth</b>: it Foresees the top 2 cards of their deck.'),
 S.end('Press <b>End turn</b> and watch the enemy play what you foresaw.'),
 S.play('ywatch','Play <b>Watcher at the Gate</b>: it Foresees their whole hand.'),
 S.atk(['yibis'],'Attack with the <b>Ibis</b> (Flying), then <b>Resolve combat</b>.'),
 S.end('Press <b>End turn</b>. Every card they play now costs them 2 life.')]}
];

const JOURNEY=[
 {t:'A run',m:'A run is a journey through your hero\'s home realm (<b>Act I</b>), then another hero\'s realm (<b>Act II</b>). Win both acts to win the run. If your life reaches 0, the run ends.'},
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
 'main:thoth':'<b>Your first fight.</b> You get 2 mana a turn. Sunder an army member to take its Ren, then speak the Ren (◆+2) for mana or write it onto an army member. Click an amulet on the battlefield to equip it.',
 main:'<b>Your first fight.</b> You get 2 mana a turn. Offer army members (click 💀) for more. Click a card\'s form label to switch between attack and defense form. Damage stays on army members between turns.',
 kleos:'<b>Prestige.</b> Each of your surviving army members earns a permanent upgrade. Pick one for each.',
 bossp:'<b>The guardian.</b> Choose which boss to face. Each boss casts its trump on its first turn: a card that changes the rules of the fight.',
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
 e.deck=L.edeck.map(id=>mk(id)).reverse();e.hand=[];draw(e,4);e.life=e.max=L.elife;e.bf=[];if(L.plife)p.life=L.plife;
 G.log=[];G.msg='';G.phase='main';render()}
function tutStep(){if(!G||!G.tut)return null;const L=TUT[G.tut.i];return L?L.steps[G.tut.s]:null}
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
  el.innerHTML=`<div class="tutch">${L.t}<span>${G.tut.s+1} / ${L.steps.length}</span></div><div class="tutcm">${s.m}</div><div class="tutcb">${s.next?'<button class="b" data-b="tutnext">Next</button>':''}<button class="tutx" data-b="tutmenu">Leave lesson</button></div>`;
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
