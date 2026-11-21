/* ===== v111: Act III, the War in Heaven (shared by every hero) =====
   After the Act II guardian: a shared realm of 10 regular decks and 4 elites (2 per map). At 4 victory points two of
   the three generals answer (Lucifer, Ahriman, Abaddon); each has two phases (it transforms at half life). Then the
   Last Battle is always the Beast of the Sea with the False Prophet. Design: the "Mythologica Act 3" doc. */
MT.push('xlegion','xwatch','xneph','xmol','xbab','xpair','xbel','xmam','xmast','xpaim');
Object.assign(D,{
/* opening trumps (regular decks) */
xlegion:['We Are Many',0,'E',0,0,'w','Ward. Whenever they play an army member that costs 2 or more, a 1/1 Possessed joins it (if there is room).','👥','B'],
xwatch:['Forbidden Arts',1,'E',0,0,'w','Ward. Whenever you cast a spell, they draw a card (at most 2 a turn).','📜','B'],
xneph:['Giants in the Earth',1,'E',0,0,'w','Ward. Their army members that cost 3 or more cost 1 less.','🗿','N'],
xmol:['Blood on Carmel',1,'E',0,0,'w','Ward. Whenever one of their army members dies or is offered, their other army members get +1/+0 permanently.','🩸','R'],
xbab:['Confusion of Tongues',1,'E',0,0,'w','Ward. At the start of their turn, the costs of the cards in your hand are shuffled among them.','🗼','N'],
xpair:['Falling Stars',1,'E',0,0,'w','Ward. At the start of their turn, a random untapped army member of yours is tapped.','🌠','W'],
xbel:['Battle Lines',1,'E',0,0,'w','Ward. Every third turn, their army members get +2/+0 until end of turn.','⚔️','B'],
xmam:['Greed',1,'E',0,0,'w','Ward. Each mana you leave unspent at the end of your turn gives their army members +1/+0 during their next turn (up to +3).','💰','N'],
xmast:['The Accuser',1,'E',0,0,'w','Ward. At the start of their turn, each of your army members that attacked last turn takes 1 damage.','⚖️','B'],
xpaim:['Fanfare',1,'E',0,0,'w','Ward. While they control a Herald, their army members get +1/+0. At the start of their turn, one of their army members learns a keyword (Flying, Ward, Charge or Ruthless).','🎺','R'],
/* elite trumps */
xbeel:['Lord of the Flies',1,'E',0,0,'w','Ward. Whenever one of their army members that isn\'t a Fly dies, a 1/1 Fly with Flying takes its place.','🪰','B'],
xaza:['The Scapegoat',1,'E',0,0,'w','Ward. Whenever one of their army members dies, your strongest army member takes 2 damage.','🐐','B'],
xasm:['Jealousy',1,'E',0,0,'w','Ward. The first army member you play each turn takes 2 damage.','💔','R'],
xlil:['Night Hag',1,'E',0,0,'w','Ward. Their army members get +1 power during their turn. Whenever one of your army members dies, they gain 2 life.','🌙','B'],
/* general trumps: phase 1 and phase 2 */
xbarg:['The Bargain',0,'E',0,0,'w','Ward. Once each turn you may accept the Bargain: +1 mana. Each time you do, Lucifer gains a Fallen Angel.','🌟','W'],
xdrag:['The Tail Sweeps the Stars',0,'E',0,0,'w','Ward. The Red Dragon: three Heads of the Dragon wait in his deck, and every Fallen Angel he gained grew stronger.','🐉','R'],
xdruj:['The Druj',0,'E',0,0,'w','Ward. At the start of his turn, a Lie is shuffled into your deck.','🗯️','B'],
xassa:['The Assault',0,'E',0,0,'w','Ward. Whenever one of your army members dies, he gets a 1/1 Khrafstra with Venomous.','🦂','B'],
xsmoke:['Smoke of the Pit',0,'E',0,0,'w','Ward. Your army members with 3 or more power get -1/+0. At the start of every other turn of his, a Locust rises from the pit.','🌫️','N'],
xtorm:['Five Months of Torment',0,'E',0,0,'w','Ward. His Locusts get +1/+1 and Venomous. At the start of your turn, each of your damaged army members takes 1 more damage.','🦂','B'],
/* the Lie */
xlie:['The Lie',0,'S',0,0,'','Lose 1 life. Then the Lie is gone.','🗯️','B'],
/* tokens */
xpos:['Possessed',0,'C',1,1,'','Token.','👤','B',1], xfly:['Fly',0,'C',1,1,'f','Token.','🪰','B',1], xspir:['Spirit',0,'C',1,1,'','Token.','👻','B',1],
xkhr:['Khrafstra',0,'C',1,1,'v','Token.','🦂','B',1], xloc:['Locust',1,'C',1,1,'f','','🦗','N',1],
/* 1 Legion */
xlgn:['Legionnaire',1,'C',2,2,'','','👹','B',1], xger:['Gerasene Demon',2,'C',3,2,'','','👹','B',1],
xswn:['Herd of Swine',2,'C',2,3,'','When it dies, the opponent takes 2 damage.','🐖','B',1], xlegc:['Legion, the Many',4,'C',4,5,'','','👥','B',3],
xcast:['Cast into the Abyss',2,'S',0,0,'','Deal damage to target army member (more in later fights).','🕳️','B'],
/* 2 the Watchers */
xwat:['Watcher',2,'C',2,3,'f','','👁️','B',1], xchrm:['Teacher of Charms',1,'C',1,3,'','','🔮','B',1],
xkok:['Kokabiel, Teacher of the Stars',3,'C',3,3,'f','When it enters, draw a card.','✨','B',2], xsemj:['Semjaza, Chief of the Watchers',4,'C',4,4,'f','','👁️','B',3],
xcurse:['Forbidden Charm',2,'S',0,0,'','Target army member gets -2/-2.','🔮','B'],
/* 3 the Nephilim */
xyneph:['Young Nephil',2,'C',2,4,'','','🗿','N',1], xnep:['Nephil',3,'C',4,6,'z','','🗿','N',2],
xgib:['Gibborim, Mighty Men of Old',4,'C',5,7,'z','','🗿','N',3], xog:['Og of Bashan',5,'C',6,8,'z','','🗿','N',3],
xroar:['Roar of the Giants',2,'S',0,0,'','Tap target army member; it doesn\'t untap next turn.','📢','N'], xclub:['Giant\'s Club',3,'S',0,0,'','Deal 4 damage to target army member (more in later fights).','🪵','N'],
/* 4 the Prophets of Baal (Mount Carmel, 1 Kings 18) */
xfire:['Prophet of Baal',1,'C',1,1,'','','🗡️','R',2], xcult:['Dancer at the Altar',2,'C',2,3,'','','💃','R',1],
xidol:['Altar of Carmel',3,'C',2,6,'','','🪨','R',2], xmolp:['High Priest of Baal',3,'C',3,3,'r','','🐂','R',2],
xflame:['Fire That Never Came',3,'S',0,0,'','Deal 2 damage to each opposing army member.','🔥','R'],
/* 5 the Builders of Babel */
xbrick:['Brick-Maker',1,'C',2,3,'','','🧱','N',1], xmason:['Tower Mason',2,'C',3,4,'','','🧱','N',1],
xzigg:['Ziggurat Guard',3,'C',3,4,'','','🗼','N',2], xnim:['Nimrod, the Mighty Hunter',4,'C',4,4,'r','','🏹','N',3],
xtong:['Babble',2,'S',0,0,'','Tap target army member; it doesn\'t untap next turn.','🗣️','N'],
/* 6 the Pairikas */
xstar:['Shooting Star',1,'C',2,1,'f','','🌠','W',1], xench:['Pairika Enchantress',2,'C',2,3,'','','🌠','W',1],
xmush:['Mush, the Comet',3,'C',3,3,'fh','','☄️','W',2], xdroug:['Duzhyairya, the Bad Harvest',4,'C',4,5,'','','🌾','W',3],
xglam:['Glamour',2,'S',0,0,'','Target army member gets -2/-2.','✨','W'],
/* 7 Sons of Darkness */
xline:['Line Soldier',1,'C',2,2,'','','🛡️','B',1], xsling:['Slinger of Belial',2,'C',2,2,'a','','🪨','B',1],
xcapt:['Captain of the Lot',3,'C',3,4,'','','⚔️','B',2], xbelg:['Belial, Angel of Darkness',4,'C',4,5,'','','🌑','B',3],
xjav:['Javelins of Darkness',2,'S',0,0,'','Deal damage to target army member (more in later fights).','🗡️','B'],
/* 8 Mammon's Hoard */
xcoin:['Coin-Bearer',1,'C',1,2,'','When it enters, they gain 1 mana.','🪙','N',1], xhoard:['Hoard-Keeper',2,'C',2,4,'','','💰','N',1],
xmerc:['Mercenary',2,'C',3,2,'','','🗡️','N',1], xmamg:['Mammon, the Golden',4,'C',3,6,'','','👑','N',3],
xbribe:['Bribe',2,'S',0,0,'','Return target army member to its owner\'s hand.','💰','N'],
/* 9 Mastema's Spirits */
xacc:['Accusing Spirit',1,'C',1,2,'f','','👻','B',1], xtenth:['Tenth of the Spirits',2,'C',2,2,'','When it enters, a 1/1 Spirit joins it.','👻','B',1],
xtempt:['Tempter',3,'C',3,3,'','','🐍','B',2], xmastg:['Mastema, Prince of Spirits',4,'C',4,4,'f','','⚖️','B',3],
xtest:['Trial',2,'S',0,0,'','Target army member gets -2/-2.','⚖️','B'],
/* 10 King Paimon's Procession */
xher:['Herald with Trumpets',1,'C',1,2,'','','🎺','R',1], xlegs:['Spirit of the Legions',2,'C',2,3,'','','👹','R',1],
xdrom:['Dromedary Rider',3,'C',3,3,'h','','🐪','R',2], xpaimon:['King Paimon',4,'C',4,5,'','When it enters, two of their army members learn a keyword.','👑','R',3],
xsecr:['Secret Arts',2,'S',0,0,'','Target army member gets -2/-2.','📖','R'],
/* elites */
xbeelg:['Beelzebub, Lord of the Flies',4,'C',4,5,'f','','🪰','B',3], xbaal:['Swarm-Priest',2,'C',2,3,'','','🪰','B',1], xcarr:['Carrion Feeder',1,'C',2,1,'','','🪰','B',1],
xazag:['Azazel, the Scapegoat',4,'C',4,6,'','','🐐','B',3], xsmith:['Forbidden Smith',2,'C',2,3,'','','⚒️','B',1],
xasmg:['Asmodeus',5,'C',5,5,'r','','💔','R',3], xjeal:['Jealous Shade',1,'C',2,1,'','','👤','R',1], xwrath:['Spirit of Wrath',2,'C',3,2,'','','😠','R',1],
xlilg:['Lilith',4,'C',3,5,'d','','🌙','B',3], xlilin:['Lilin',2,'C',2,2,'f','','🦇','B',1], xowl:['Screech Owl',1,'C',1,2,'f','','🦉','B',1],
/* Lucifer */
xlucg:['Lucifer, the Morning Star',5,'C',5,6,'fw','','🌟','W',3], xfang:['Fallen Angel',2,'C',2,2,'f','','😈','W',1], xpride:['Herald of Pride',3,'C',3,4,'w','','👑','W',2],
xdhead:['Head of the Dragon',3,'C',3,3,'r','','🐉','R',2], xspear:['Spear of Light',2,'S',0,0,'','Deal damage to target army member (more in later fights).','⚡','W'],
xfall:['Fall from Grace',2,'S',0,0,'','Target army member gets -2/-2.','⬇️','W'],
/* Ahriman */
xahri:['Ahriman, the Destructive Spirit',5,'C',5,6,'','','🌑','B',3], xdaeva:['Daeva of Doubt',2,'C',2,2,'','When it enters, a Lie goes into your hand.','😈','B',1],
xcook:['Royal Cook',2,'C',1,4,'','When it enters, restore 2 health to each of their army members.','🍲','B',1], xzah:['Serpent of the Shoulders',3,'C',3,3,'v','','🐍','B',2],
/* Abaddon */
xapol:['Apollyon, the Destroyer',5,'C',5,5,'f','','🦗','N',3], xkeep:['Keeper of the Key',3,'C',2,4,'','When it dies, two Locusts rise.','🗝️','N',2],
xcharg:['Iron-Breasted Charger',2,'C',3,2,'h','','🐎','N',1], xsting:['Scorpion Tail',2,'S',0,0,'','Destroy target army member that has damage on it.','🦂','N'],
/* the Last Battle */
xproph:['The False Prophet',3,'C',1,6,'kw','At the start of the Beast\'s turn, it marks your strongest army member: it can\'t attack on your next turn (it can still block). While it lives, the Beast\'s mortal wound heals.','🐑','R',2],
xbeast:['The Beast of the Sea',6,'C',6,7,'w','The Beast and its Heads can\'t be Sundered: they are one body.','🐉','R',3], xhb:['Head of Blasphemy',2,'C',2,3,'','The Beast\'s other Heads get +1/+0. Can\'t be Sundered.','🐉','R',1],
xhd:['Head of Dominion',2,'C',2,3,'w','Can\'t be Sundered.','🐉','R',1], xhl:['Head of the Lion',3,'C',3,3,'r','Can\'t be Sundered.','🦁','R',2],
ximg:['Image of the Beast',2,'C',2,3,'','','🗿','R',1],
xfheav:['Fire from Heaven',2,'S',0,0,'','Deal damage to target army member (more in later fights).','🔥','R']
});
Object.assign(SPA,{xcast:'javel',xcurse:'curse',xroar:'honey',xclub:'hurl',xflame:'dbrth',xtong:'honey',xglam:'curse',xjav:'javel',xbribe:'gale',xtest:'curse',xsecr:'curse',xspear:'javel',xfall:'curse',xsting:'hgrasp',xfheav:'javel'});
Object.assign(FX,{xcast:FX.javel,xcurse:FX.curse,xroar:FX.honey,xclub:FX.hurl,xflame:FX.dbrth,xtong:FX.honey,xglam:FX.curse,xjav:FX.javel,xbribe:FX.gale,xtest:FX.curse,xsecr:FX.curse,xspear:FX.javel,xfall:FX.curse,xsting:FX.hgrasp,xfheav:FX.javel,
 xlie:s=>{s.life-=1;log('The Lie costs you 1 life.')}});
Object.assign(TS,{xcast:TS.javel,xcurse:TS.curse,xroar:TS.honey,xclub:TS.hurl,xtong:TS.honey,xglam:TS.curse,xjav:TS.javel,xbribe:TS.gale,xtest:TS.curse,xsecr:TS.curse,xspear:TS.javel,xfall:TS.curse,xsting:TS.hgrasp,xfheav:TS.javel});
TOKE.push('xpos','xfly','xspir','xkhr');
const A3TR=['xlegion','xwatch','xneph','xmol','xbab','xpair','xbel','xmam','xmast','xpaim','xbeel','xaza','xasm','xlil','xbarg','xdrag','xdruj','xassa','xsmoke','xtorm'];
A3TR.forEach(k=>{IV[k]=40;LORE[k]=['xbeel','xaza','xasm','xlil'].includes(k)?'Elite trump':['xbarg','xdrag','xdruj','xassa','xsmoke','xtorm'].includes(k)?'General\'s trump':'Opening trump'});
Object.assign(LORE,{xlie:'A lie of Ahriman',xpos:'Possessed',xfly:'Fly',xspir:'Spirit',xkhr:'Noxious creature',xloc:'Locust of the Abyss',
 xlgn:'Demon of Legion',xger:'Demon of Legion',xswn:'Possessed swine',xlegc:'"We are many"',xcast:'Spell',xwat:'Fallen angel',xchrm:'Fallen angel',xkok:'Fallen angel',xsemj:'Leader of the Watchers',xcurse:'Curse',
 xyneph:'Giant',xnep:'Giant',xgib:'Giant',xog:'Giant king',xroar:'Spell',xclub:'Spell',xfire:'Prophet of Baal',xcult:'Prophet of Baal',xidol:'The altar on Carmel',xmolp:'Prophet of Baal',xflame:'Spell',
 xbrick:'Builder',xmason:'Builder',xzigg:'Builder',xnim:'King of Babel',xtong:'Spell',xstar:'Pairika',xench:'Pairika',xmush:'Pairika',xdroug:'Pairika of drought',xglam:'Spell',
 xline:'Son of Darkness',xsling:'Son of Darkness',xcapt:'Son of Darkness',xbelg:'Angel of darkness',xjav:'Spell',xcoin:'Servant of Mammon',xhoard:'Servant of Mammon',xmerc:'Servant of Mammon',xmamg:'Wealth personified',xbribe:'Spell',
 xacc:'Evil spirit',xtenth:'Evil spirit',xtempt:'Evil spirit',xmastg:'The Accuser',xtest:'Spell',xher:'Herald of Paimon',xlegs:'Spirit of Paimon',xdrom:'Spirit of Paimon',xpaimon:'A king of hell',xsecr:'Spell',
 xbeelg:'Lord of the Flies',xbaal:'Priest',xcarr:'Carrion fly',xazag:'Leader of the Watchers',xsmith:'Fallen angel',xasmg:'Demon of Tobit',xjeal:'Shade',xwrath:'Spirit',xlilg:'Night demon',xlilin:'Night demon',xowl:'Night bird',
 xlucg:'The light-bringer',xfang:'Fallen angel',xpride:'Fallen angel',xdhead:'The dragon',xspear:'Spell',xfall:'Spell',xahri:'The Destructive Spirit',xdaeva:'Daeva',xcook:'Ahriman in disguise',xzah:'Serpent',
 xapol:'The Destroyer',xkeep:'The fallen star',xcharg:'Locust of the Abyss',xsting:'Spell',xproph:'The Beast of the Earth',xbeast:'The Beast',xhb:'Head of the Beast',xhd:'Head of the Beast',xhl:'Head of the Beast',ximg:'The speaking image',xfheav:'Spell'});
/* --- card abilities --- */
const a3Room=s=>cr(s).length<AM();
const a3Mark=o=>{const t=cr(o).filter(x=>!x.mk).sort((a,b)=>ev(b)-ev(a))[0];if(t){t.mk=1;log(D[t.id][0]+' is marked: it can\'t attack on your next turn.')}};
const a3Learn=(s,n)=>{for(let i=0;i<n;i++){const L=cr(s).filter(x=>'fwhr'.split('').some(k=>!x.f.includes(k)));if(!L.length)return;const c=L[Math.random()*L.length|0],ks='fwhr'.split('').filter(k=>!c.f.includes(k)),k=ks[Math.random()*ks.length|0];c.f+=k;if(k=='h')c.sick=0;log(D[c.id][0]+' learns '+({f:'Flying',w:'Ward',h:'Charge',r:'Ruthless'})[k]+'.')}};
Object.assign(ETB,{
 xkok:s=>draw(s,1),xcoin:s=>{s.mana+=1},xtenth:s=>{if(a3Room(s))enter(s,mk('xspir'))},xpaimon:s=>a3Learn(s,2),
 xdaeva:(s,o)=>{o.hand.push(mk('xlie'));log('A Daeva whispers: a Lie goes into your hand.')},xcook:s=>{cr(s).forEach(c=>heal(c,2))},
 xneph:s=>{[...s.deck,...s.hand].forEach(c=>{if(isC(c)&&D[c.id][1]>=3)c.disc=(c.disc||0)+1});log('Giants in the Earth: their big army members cost 1 less.')}});
Object.assign(DEATH,{xswn:{p:3,fn:(s,o)=>{o.life-=2;log('The Herd of Swine rushes into the sea: you take 2.')}},
 xkeep:{p:3,fn:s=>{for(let i=0;i<2&&a3Room(s);i++)enter(s,mk('xloc'));log('Two Locusts rise from the pit.')}}});
/* --- engine hooks --- */
const a3Has=(s,id)=>!!(s&&s.bf&&s.bf.some(x=>x.id==id));
function a3Up(s,o){if(!s||!o||!G.e)return;const E=G.e,P=G.p;
 if(s===E){
  if(a3Has(s,'xbel')&&G.turn%3==0&&cr(s).length){cr(s).forEach(c=>{c.ta+=2});log('Battle lines: the Sons of Darkness advance (+2/+0 this turn).')}
  if(a3Has(s,'xmam')&&s.greed){const n=s.greed;s.greed=0;cr(s).forEach(c=>{c.ta+=n});log('Greed: your unspent mana feeds Mammon\'s hoard (+'+n+'/+0 this turn).')}
  if(a3Has(s,'xmast')){const L=cr(o).filter(c=>c.att);L.forEach(c=>{c.dmg+=1});if(L.length)log('The Accuser: '+L.length+' of your attackers take 1 damage.')}
  if(a3Has(s,'xpaim'))a3Learn(s,1);
  if(a3Has(s,'xpair')){const L=cr(o).filter(c=>!c.tap);if(L.length){const t=L[Math.random()*L.length|0];t.tap=1;log('A falling star dazzles '+D[t.id][0]+': it is tapped.')}}
  if(a3Has(s,'xbab')&&o.hand.length>1){const C=o.hand.map(c=>cost(c));sh(C);o.hand.forEach((c,i)=>{c.disc=(c.disc||0)+(cost(c)-C[i])});log('The tongues are confounded: the costs in your hand are shuffled.')}
  if(a3Has(s,'xdruj')){o.deck.splice(Math.random()*(o.deck.length+1)|0,0,mk('xlie'));log('The Druj: a Lie is shuffled into your deck.')}
  if(a3Has(s,'xsmoke')&&G.turn%2==0&&a3Room(s)){enter(s,mk('xloc'));log('A Locust rises from the smoke of the pit.')}
  if(a3Has(s,'xproph'))a3Mark(o);
  s.wd=0}
 if(s===P){const M=cr(s).filter(c=>c.mk);M.forEach(c=>{c.mk=0;c.sick=1});if(M.length)log('The mark of the Beast: '+M.map(c=>D[c.id][0]).join(', ')+' can\'t attack this turn.')}
 if(s===P&&a3Has(o,'xtorm')){const L=cr(s).filter(c=>c.dmg>0);L.forEach(c=>{c.dmg+=1});if(L.length)log('Five months of torment: your damaged army members take 1 more.')}}
function a3Die(s,c){const o=oppOf(s);if(!o)return;
 if(a3Has(s,'xmol')&&isC(c))a3Moloch(s);
 if(a3Has(s,'xbeel')&&c.id!='xfly'&&isC(c)&&a3Room(s)){enter(s,mk('xfly'));log('A Fly rises from '+D[c.id][0]+'.')}
 if(a3Has(s,'xaza')&&isC(c)){const t=cr(o).sort((a,b)=>ev(b)-ev(a))[0];if(t){t.dmg+=2;log('The Scapegoat: '+D[t.id][0]+' bears the sin (2 damage).')}}
 if(s===G.p&&a3Has(o,'xlil')){o.life=Math.min(o.max,o.life+2);log('Lilith feeds: she gains 2 life.')}
 if(s===G.p&&a3Has(o,'xassa')&&a3Room(o)){enter(o,mk('xkhr'));log('A Khrafstra crawls from the dead.')}}
function a3Moloch(s){cr(s).forEach(c=>{c.pa++});log('Blood on Carmel: the prophets of Baal grow more frenzied (+1/+0).')}
function a3Enter(s,c){if(!G||!G.e||!isC(c))return;const o=oppOf(s);
 if(s===G.e&&a3Has(s,'xlegion')&&D[c.id][1]>=2&&a3Room(s)){const t=mk('xpos');t.sick=c.sick;s.bf.push(t);log('A Possessed joins '+D[c.id][0]+'.')}
 if(s===G.e&&c.id=='xloc'&&a3Has(s,'xtorm')&&!c.trm){c.trm=1;c.pa++;c.pd++;if(!c.f.includes('v'))c.f+='v'}
 if(s===G.p&&a3Has(o,'xasm')&&s.asm!==G.turn){s.asm=G.turn;c.dmg+=2;log('Jealousy: '+D[c.id][0]+' takes 2 damage.')}}
function a3Px(c){const s=sideOf(c);if(!s||!G.e)return 0;const o=oppOf(s);let n=0;
 if(s===G.p&&a3Has(o,'xsmoke')&&pw(c)>=3)n-=1;
 if(s===G.e){if(a3Has(s,'xpaim')&&s.bf.some(x=>x.id=='xher'))n+=1;if(a3Has(s,'xlil')&&actSide()===s)n+=1;if(['xhb','xhd','xhl'].includes(c.id))n+=s.bf.filter(x=>x.id=='xhb'&&x!==c).length}
 return n}
function a3Cast(c){const e=G.e;if(!e||!a3Has(e,'xwatch'))return;if('SI'.includes(D[c.id][2])&&(e.wd||0)<2){e.wd=(e.wd||0)+1;draw(e,1);log('The Watchers learn from your spell: they draw a card.')}}
{const _u=egUp;egUp=function(s,o){_u(s,o);try{a3Up(s,o)}catch(e){}}}
{const _d=egDie;egDie=function(s,c){_d(s,c);try{a3Die(s,c)}catch(e){}}}
{const _p=egPx;egPx=function(c){return _p(c)+a3Px(c)}}
{const _e=enter;enter=function(s,c){const r=_e.apply(this,arguments);try{a3Enter(s,c)}catch(e){}return r}}
{const _o=offer;offer=function(s,c){const r=_o.apply(this,arguments);try{if(a3Has(s,'xmol')&&isC(c))a3Moloch(s)}catch(e){}return r}}
/* the Beast and its seven Heads are one body: an opponent can't Sunder them */
const A3ONE=['xbeast','xhb','xhd','xhl'];
if(typeof thSunder=='function'){const _s=thSunder;thSunder=function(c,by){if(c&&A3ONE.includes(c.id)&&sideOf(c)!==by){log(D[c.id][0]+' can\'t be Sundered: the Beast is one body.');return 0}return _s.apply(this,arguments)}}
{const _c=cast;cast=function(c,t){const r=_c.apply(this,arguments);try{a3Cast(c)}catch(e){}return r}}
{const _t=thEnd;thEnd=function(s){try{if(s===G.p&&a3Has(G.e,'xmam'))G.e.greed=Math.min(3,Math.max(0,G.p.mana))}catch(e){}return _t.apply(this,arguments)}}
/* --- the Bargain (Lucifer, phase 1) --- */
const a3BargOk=()=>!!(G&&G.p&&G.e&&G.phase=='main'&&a3Has(G.e,'xbarg')&&G.p.barg!==G.turn);
function a3Bargain(){if(!a3BargOk())return;G.p.mana+=1;G.p.barg=G.turn;G.bargN=(G.bargN||0)+1;if(a3Room(G.e)){const t=mk('xfang');t.barg=1;enter(G.e,t)}log('You accept the Bargain: +1 mana, and Lucifer gains a Fallen Angel.');render()}
const a3BargBtn=()=>a3BargOk()?`<button class="b" data-b="a3barg" title="Gain 1 mana now. Lucifer gains a Fallen Angel (2/2 Flying).">Accept the Bargain (+1◆)</button>`:'';
/* --- regular decks, elites, generals, the Last Battle --- */
const A3={en:[
 {n:'Legion',l:16,ic:'👥',hint:'"We are many": every army member they play brings a Possessed with it',bg:['#140a0a','#5a2222'],d:ids('xlgn:5,xger:4,xswn:2,xlegc,xcast:2'),mt:'xlegion'},
 {n:'The Watchers',l:18,ic:'👁️',hint:'Fallen angels who learn from every spell you cast',bg:['#0e0a16','#4a3a6a'],d:ids('xwat:4,xchrm:4,xkok:2,xsemj,xcurse:2,xcast'),mt:'xwatch'},
 {n:'The Nephilim',l:19,ic:'🗿',hint:'Few, huge, hard to kill, and they arrive early',bg:['#14120c','#5a4e34'],d:ids('xyneph:4,xnep:3,xgib:2,xog,xroar:2,xclub:2'),mt:'xneph'},
 {n:'The Prophets of Baal',l:20,ic:'🗡️',hint:'They cut themselves for Baal: every one that falls makes the rest stronger',bg:['#1a0806','#7a2a12'],d:ids('xfire:5,xcult:4,xidol:2,xmolp:2,xflame'),mt:'xmol'},
 {n:'The Builders of Babel',l:22,ic:'🗼',hint:'They confound your tongue: the costs in your hand get shuffled',bg:['#16120a','#6a5a3a'],d:ids('xbrick:5,xmason:4,xzigg:2,xnim,xtong:2'),mt:'xbab'},
 {n:'The Pairikas',l:14,ic:'🌠',hint:'Shooting-star witches who dazzle your army',bg:['#0a0e1a','#3a4a7a'],d:ids('xstar:5,xench:4,xmush:2,xdroug,xglam:2'),mt:'xpair'},
 {n:'Sons of Darkness',l:18,ic:'🌑',hint:'Belial\'s army fights in battle lines: every third turn it surges',bg:['#0a0a0e','#2a2a3a'],d:ids('xline:5,xsling:3,xcapt:3,xbelg,xjav:2'),mt:'xbel'},
 {n:'Mammon\'s Hoard',l:18,ic:'💰',hint:'Mana you leave unspent becomes their strength',bg:['#141006','#7a6a2a'],d:ids('xcoin:5,xhoard:4,xmerc:3,xmamg,xbribe:2'),mt:'xmam'},
 {n:'Mastema\'s Spirits',l:18,ic:'⚖️',hint:'The Accuser punishes every army member that attacked',bg:['#0e0c12','#3a3448'],d:ids('xacc:5,xtenth:3,xtempt:3,xmastg,xtest:2'),mt:'xmast'},
 {n:'King Paimon\'s Procession',l:16,ic:'🎺',hint:'Kill the heralds first; the longer it lasts, the more his army learns',bg:['#16080a','#7a3a2a'],d:ids('xher:5,xlegs:4,xdrom:2,xpaimon,xsecr:2'),mt:'xpaim'}],
 el:[],bo:[],fin:-1};
const A3E=[
 {n:'Beelzebub, Lord of the Flies',l:19,ic:'🪰',hint:'Every army member of his that falls leaves a Fly behind',bg:['#0e0e08','#4a4a2a'],d:ids('xbeelg,xbaal:5,xcarr:4,xcast:2,xflame'),mt:'xbeel'},
 {n:'Azazel, the Scapegoat',l:19,ic:'🐐',hint:'Each of his losses is laid on your strongest army member',bg:['#140c06','#6a4a2a'],d:ids('xazag,xsmith:5,xwat:3,xcurse:2,xcast:2'),mt:'xaza'},
 {n:'Asmodeus',l:14,ic:'💔',hint:'Jealous: the first army member you play each turn is hurt',bg:['#1a0610','#7a1a3a'],d:ids('xasmg,xjeal:5,xwrath:4,xcast:2,xcurse'),mt:'xasm'},
 {n:'Lilith',l:12,ic:'🌙',hint:'Her army strikes harder by night, and she feeds on your dead',bg:['#08081a','#2a2a5a'],d:ids('xlilg,xlilin:5,xowl:4,xcurse:2,xcast'),mt:'xlil'}];
A3E.forEach(x=>{ELITES.push(x);A3.el.push(ELITES.length-1)});
{const b0=BOSS.length;
BOSS.push(
 {n:'Lucifer, the Morning Star',n2:'Lucifer, the Red Dragon',ic:'🌟',l:21,sc:[0,0,0],trump:'xbarg',trump2:'xdrag',a3:1,champ:'Michael',
  d:ids('xlucg,xfang:3,xpride:5,xspear:2,xfall:2,xcast'),
  lore:`"How you have fallen from heaven, shining one, son of the dawn!" The brightest of the angels wanted the throne of God and was thrown down, and a third of the stars fell with him. He still offers bargains, and every one is a gift with a price. At half his strength the angel falls away, and the great red dragon of Revelation stands in his place: seven heads, ten horns and a tail that sweeps the stars from the sky. The archangel Michael and the host of Heaven ride with you.`},
 {n:'Ahriman, the Smiling Stranger',n2:'Ahriman, the Destructive Spirit',ic:'🌑',l:22,sc:[0,0,0],trump:'xdruj',trump2:'xassa',a3:1,champ:'Sraosha',
  d:ids('xahri,xdaeva:5,xcook:2,xzah:3,xcurse:2,xcast'),
  lore:`Ahriman never fights openly at first. In the Shahnameh he came to the prince Zahhak as a charming youth and then as a royal cook, and from his kiss serpents grew. His weapon is the Druj, the Lie, and he plants it everywhere. At half his strength he becomes what he was at the beginning of the world: the Destructive Spirit who broke through the sky like a serpent and filled creation with noxious creatures. Every Lie you still hold then crawls out to fight you. Sraosha, the angel of obedience, walks beside you.`},
 {n:'Abaddon, the Opened Abyss',n2:'Apollyon, the Destroyer',ic:'🕳️',l:17,sc:[0,0,0],trump:'xsmoke',trump2:'xtorm',a3:1,champ:'Uriel',
  d:ids('xapol,xkeep:2,xcharg:3,xloc:4,xsting:2,xcast:2'),
  lore:`A fallen star is given the key, and the shaft of the Abyss opens. Smoke pours out like a great furnace and darkens the sun, and from the smoke come the locusts. At first Abaddon is the pit itself. At half his strength its king takes the field: Apollyon, the Destroyer, whose locusts wear golden crowns and iron breastplates and carry the tails of scorpions, and for five months men seek death and do not find it. Uriel, who keeps the key of Tartarus, waits for you to drive him back.`},
 {n:'The Beast of the Sea',ic:'🐉',l:31,sc:[0,-1,0],trump:'xproph',a3:1,fin:1,
  d:ids('xbeast,xhb:2,xhd:2,xhl:3,ximg:3,xfheav:2'),
  lore:`The generals have fallen, but the kings of the earth gather at Armageddon behind the Beast of the Sea: seven heads and ten horns, the body of a leopard, the feet of a bear and the mouth of a lion. One of its heads bore a mortal wound that healed, and the world marvelled and asked, "Who is like the beast? Who can make war against it?" Beside it stands the False Prophet, who marks your army and keeps the wound healing. Kill the Prophet, and the Beast can die.`});
A3.bo=[b0,b0+1,b0+2];A3.fin=b0+3}
const A3FRONT={Michael:'In Heaven, Michael and his angels fight the dragon, and the dragon is cast down.',Sraosha:'In the east, Sraosha and the saviour Saoshyant drive Ahriman out of creation, and the darkness breaks.',Uriel:'Below, Uriel turns the key of the Abyss, and the Destroyer is sealed in the pit.'};
/* hidden per-hero adjustment for every Act III fight (life), like Act II's XADJ: from the proven-deck matrix */
const A3H={ody:[6,1,0],odin:[-3,0,0],wukong:[2,0,0],thoth:[6,0,0]};
const A3HB={wukong:-6,odin:6,ody:6};
/* extra life per hero against each general (0 Lucifer, 1 Ahriman, 2 Abaddon), like Act II's per-pair table */
const A3HG={'odin:0':-7,'odin:2':-9,'wukong:0':10,'wukong:1':-4,'wukong:2':-4,'thoth:0':8,'thoth:2':7,'ody:1':3,'ody:2':2};/* extra life for the Beast only (Thoth's Sunder halves it) */
TIPS.a3='<b>Act III.</b> Every hero ends here, in the War in Heaven. At 4 victory points two generals of the rebellion answer: beat one, and the Last Battle against the Beast of the Sea follows. Act III bosses change form at half life.';
JOURNEY.splice(JOURNEY.length-1,0,{t:'Act III',m:'Beat the Act II guardian and every hero enters the same last realm: the War in Heaven. Defeat one of the rebellion\'s generals, then the Beast of the Sea at Armageddon, to win the run.'});
const A3INTRO='Act III: the sky splits. Above the last realm of men, Heaven and the Abyss are at war, and the war has reached the earth. A voice like many waters calls you to stand with the host.';
SCL.push([4,1,0],[6,1,0],[8,1,1],[10,1,1]);
RLMC.heaven=['#0c0a14','#4a3a20'];
/* --- generals' phases and the Beast's wound --- */
function a3Phase(){if(!G||!G.boss||!G.e||G.phase=='victory')return;const f=BOSS[G.bi];if(!f||!f.a3)return;const e=G.e,p=G.p;
 if(f.fin){if(e.life<=0&&!G.rose&&e.bf.some(x=>x.id=='xproph')){G.rose=1;e.life=Math.ceil(e.max/2);cr(e).filter(x=>['xhb','xhd','xhl'].includes(x.id)).forEach(c=>{c.pa++;c.pd++});
   log('The mortal wound heals! "Who is like the beast? Who can make war against it?"');G.msg='The Beast rises again at half its life. Kill the False Prophet, or the wound will keep it alive.'}return}
 if(G.ph2||e.life<=0||e.life*2>e.max)return;G.ph2=1;
 const t=e.bf.find(x=>x.id==f.trump);if(t)e.bf.splice(e.bf.indexOf(t),1);const t2=mk(f.trump2);t2.boss=1;e.bf.push(t2);e.nm=f.n2;
 if(f.trump2=='xdrag'){const L=cr(p).slice().sort((a,b)=>ev(b)-ev(a)).slice(0,Math.ceil(cr(p).length/3));L.forEach(c=>{c.dmg+=3});cr(e).filter(x=>x.barg).forEach(c=>{c.pa++;c.pd++});for(let i=0;i<3;i++)e.deck.splice(Math.random()*(e.deck.length+1)|0,0,mk('xdhead'));
  log('The angel falls away: Lucifer becomes the Red Dragon, and his tail sweeps the stars.')}
 if(f.trump2=='xassa'){const n=Math.min(4,[...p.deck,...p.hand].filter(x=>x.id=='xlie').length);for(let i=0;i<n&&a3Room(e);i++)enter(e,mk('xkhr'));log('The Smiling Stranger breaks through the sky as the Destructive Spirit'+(n?': '+n+' of your Lies crawl out as Khrafstra.':'.'))}
 if(f.trump2=='xtorm'){cr(e).filter(x=>x.id=='xloc'&&!x.trm).forEach(c=>{c.trm=1;c.pa++;c.pd++;if(!c.f.includes('v'))c.f+='v'});log('The smoke clears and Apollyon takes the field: his Locusts grow scorpion stings.')}
 G.msg=e.nm+'! '+G.msg;sweep()}
{const _k=chk;chk=function(){try{a3Phase()}catch(e){}const r=_k.apply(this,arguments);if(G&&G.a3&&G.phase=='victory'&&!G.fin){G.phase='a3front';G.front=BOSS[G.bi].champ;try{vicVis()}catch(e){}}return r}}
/* --- run flow --- */
function applyA3(){EN.length=0;EN.push(...A3.en)}
function startAct3(){const p=G.p;G.a3=1;applyA3();G.web=genWeb();Object.assign(G,{pos:0,fi:0,rt:[],lanes:[],trail:{},act:2,spent:0,gift:0,boss:0,elt:0,bi:0,bs:0,dr:0,rep:0,fin:0,ph2:0,rose:0,front:0,lib:0,mode:0,pend:0,phase:'map',hubMsg:A3INTRO,msg:A3INTRO});p.life=Math.min(p.max,p.life+10);try{vicVis()}catch(e){}render()}
function startFinale(){if(!G||G.phase!='a3front')return;G.p.life=Math.min(G.p.max,G.p.life+10);G.fin=1;G.boss=1;G.bi=A3.fin;G.elt=0;G.ph2=0;G.rose=0;G.phase='main';fight()}
function renderA3Front(){try{const R=document.documentElement.style;R.setProperty('--b1','#0c0a14');R.setProperty('--b2','#4a3a20')}catch(e){}
 const mine=G.front,others=['Michael','Sraosha','Uriel'].filter(k=>k!==mine);
 document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:30px">The other fronts</div><div class="dsub" style="font-size:17px;max-width:620px;text-align:center;line-height:1.6">Your general has fallen. ${others.map(k=>A3FRONT[k]).join(' ')}</div><div class="dsub" style="font-size:16px;max-width:620px;text-align:center;opacity:.85">The generals are beaten, but the kings of the earth gather at Armageddon behind the Beast of the Sea, and the False Prophet calls fire from the sky. You rest before the battle and recover 10 life.</div><div class="hbt" style="margin-top:10px"><button class="b" data-b="a3fin">March to Armageddon</button></div></div>`}
{const _r=render0;render0=function(){if(G&&G.phase=='a3front')return renderA3Front();return _r.apply(this,arguments)}}
{const _b=bt0;bt0=function(b){if(b=='a3fin')return startFinale();if(b=='a3barg')return a3Bargain();return _b.apply(this,arguments)}}
{const _f=fight;fight=function(){if(G&&G.boss){G.ph2=0;G.rose=0}const r=_f.apply(this,arguments);try{if(G.a3&&A3H[G.ch]){scaleEnemy(G.e,[A3H[G.ch][0]+(G.fin&&A3HB[G.ch]||0)+(G.boss&&!G.fin?(A3HG[G.ch+':'+A3.bo.indexOf(G.bi)]||0):0),A3H[G.ch][1],A3H[G.ch][2]]);render()}}catch(e){}try{if(G.boss&&BOSS[G.bi]&&BOSS[G.bi].fin){const pr=G.e.bf.find(x=>x.id=='xproph');if(pr){delete pr.boss;pr.sick=0}G.e.bf.push(mk('xhb'));render()}}catch(e){}return r}}
SAFE.push('a3front');
{const _v=vicVis;vicVis=function(){_v.apply(this,arguments);const o=typeof document!='undefined'&&document.getElementById&&document.getElementById('vico');if(!o||!o.querySelector||!G||G.phase!='victory')return;
 if(!o.a3h){o.a3h=1;o.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b&&b.dataset.v=='a3')startAct3()})}
 const box=o.querySelector('.box');if(!box)return;
 if(G.a3&&G.fin)box.innerHTML='<div style="font-size:54px">🏆</div><div class="t">VICTORY</div><div>The Beast and the False Prophet are thrown alive into the lake of fire. An angel comes down with the key of the Abyss and a great chain, and the dragon is bound for a thousand years.</div><div style="opacity:.8">The war in Heaven is over, and your journey ends. You have won the run.</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px"><button class="b" data-v="new">New run</button><button class="b" data-v="rep">Copy run report</button></div>';
 else if(G.a2&&!G.a3)box.innerHTML='<div style="font-size:54px">🏆</div><div class="t">VICTORY</div><div>You have passed <b>'+(G.e&&G.e.nm||'the guardian')+'</b>. Act II is complete.</div><div style="opacity:.8">Act III awaits: the War in Heaven, where every hero stands with the host against the rebellion.</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px"><button class="b" data-v="a3">Continue to Act III</button><button class="b" data-v="new">New run</button><button class="b" data-v="rep">Copy run report</button></div>'}}
