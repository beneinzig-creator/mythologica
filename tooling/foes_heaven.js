/* ===== Act III, the War in Heaven: every opponent rebuilt around one theme (lore: tooling/lore/heaven.js + the Lore session's briefs) ===== */

/* ---------- Legion: POSSESSION. The demons take your army members; the herd that drowns sets them free ---------- */
const fPoss=s=>cr(s).filter(x=>x.poss);
function fPossess(s,o,t,why){if(!t||!o.bf.includes(t)||has(t,'w')||!fRoom(s))return;o.bf.splice(o.bf.indexOf(t),1);t.poss=1;t.sick=1;t.def=0;t.att=0;s.bf.push(t);try{amFall()}catch(e){}log((why||'The demons possess ')+fNm(t)+': it now fights for Legion.')}
function fFree(s,o){const L=fPoss(s);L.forEach(x=>{s.bf.splice(s.bf.indexOf(x),1);x.poss=0;x.sick=1;x.def=0;o.bf.push(x)});if(L.length)log('The herd drowns, and '+L.length+' of your army member'+(L.length==1?' is':'s are')+' freed, clothed and in their right mind.')}
F('xlegion',{t:'Ward. Possessed army members fight for them. When a possessed army member dies, it goes to your graveyard. The Herd of Swine can free them.',
 allyDie:(s,o,c,x)=>{if(!x.poss)return;const i=s.gy.indexOf(x);if(i>=0){s.gy.splice(i,1);x.poss=0;o.gy.push(x)}cr(s).filter(y=>y.id=='xswn').forEach(y=>{y.pa++;y.pd++});if(s.bf.some(y=>y.id=='xswn'))log('The demons leave the dead host and flee into the swine.')}});
F('xlgn',{c:1,a:1,h:2,f:'',tag:'legion',t:'One of the many: +1/+0 for each possessed army member they control (at most +2).',self:c=>[Math.min(2,fPoss(sideOf(c)).length),0]});
F('xger',{c:2,a:2,h:3,f:'',tag:'legion',t:'The demons go out from him: at the start of their turn, they possess your cheapest army member (cost 2 or less, not Ward); only one is possessed each turn, however many Gerasenes there are.',
 up:(s,o)=>{if(s.possT===G.turn)return;const t=cr(o).filter(x=>D[x.id][1]<=2&&!has(x,'w')).sort((a,b)=>D[a.id][1]-D[b.id][1]||ev(a)-ev(b))[0];if(t){s.possT=G.turn;fPossess(s,o,t,'The demons go out of the Gerasene and possess ')}}});
F('xswn',{c:2,a:2,h:4,f:'',tag:'legion',t:'Whenever a possessed army member dies, the demons flee into it: +1/+1. When it dies, the herd runs into the sea and drowns: every possessed army member is freed and returns to you.',die:(s,o)=>fFree(s,o)});
F('xlegc',{c:4,a:3,h:3,f:'',tag:'legion',t:'"My name is Legion, for we are many": when it enters, it possesses your strongest army member that costs 3 or less. +1/+1 for each possessed army member they control.',
 etb:(s,o)=>{const t=fTop(cr(o).filter(x=>D[x.id][1]<=3&&!has(x,'w')));fPossess(s,o,t,'Legion possesses ')},self:c=>{const n=fPoss(sideOf(c)).length;return[n,n]}});
F('xpos',{tag:'legion',t:'One of the many.'});
F('xcast',{c:2,t:'Their dread, turned on you: deal damage to target army member equal to 2 + the number of possessed army members they control.',
 ai:(s,o)=>fAiKill(o,2+fPoss(s).length,3),fx:(s,o,t)=>{if(t)t.dmg+=2+fPoss(s).length}});
DK('Legion',{d:'xlgn:5,xger:3,xswn:3,xlegc,xcast:2',hint:'While a Gerasene Demon lives, each turn they possess one of your cheap army members. Kill the Gerasenes, or the Herd of Swine to free them'});

/* ---------- The Watchers: teachers bound by one oath. Knowledge (cards in hand) is their power ---------- */
F('xwat',{c:2,a:2,h:3,f:'f',tag:'watch',t:'Flying. Gets +1/+0 for each card in their hand beyond 2 (at most +2).',self:c=>[Math.max(0,Math.min(2,sideOf(c).hand.length-2)),0]});
F('xchrm',{c:1,a:1,h:3,f:'',tag:'watch',t:'At the start of their turn it teaches one of their army members a lesson: Flying or Venomous.',
 up:(s,o,c)=>{const L=cr(s).filter(x=>!x.f.includes('f')||!x.f.includes('v'));const t=fRnd(L);if(!t)return;const k=!t.f.includes('f')?'f':'v';fKey(t,k);log('The Teacher of Charms teaches '+fNm(t)+' '+(k=='f'?'Flying':'Venomous')+'.')}});
F('xkok',{c:3,a:3,h:3,f:'f',tag:'watch',t:'Flying. When it enters, they draw 2 cards (the signs of the stars).',etb:s=>draw(s,2)});
F('xsemj',{c:4,a:4,h:4,f:'f',tag:'watch',t:'Flying. The oath: whenever another of their army members dies, each other army member they control gets +1/+1.',
 allyDie:(s,o,c,x)=>{cr(s).forEach(y=>{y.pa++;y.pd++});log('The oath binds them: the Watchers grow stronger.')}});
F('xcurse',{c:2,t:'Target army member gets -1/-1 for each card in their hand (at most -4/-4).',
 ai:(s,o)=>fAiKill(o,Math.min(4,s.hand.length),2.5),fx:(s,o,t)=>{if(!t)return;const n=Math.min(4,s.hand.length);t.pa-=n;t.pd-=n}});
DK('The Watchers',{d:'xwat:4,xchrm:4,xkok:2,xsemj,xcurse:3',hint:'Every spell you cast teaches them; their strength is the cards they hold'});

/* ---------- The Nephilim: hunger. They eat your resources, then each other ---------- */
const fEat=(s,c,ex)=>{const v=fLow(cr(s).filter(x=>x!==c&&x!==ex));if(!v)return 0;c.pa+=pw(v);c.pd+=Math.max(1,th(v)-v.dmg);fDestroy(v);log(fNm(c)+' eats '+fNm(v)+'.');s.eaten=(s.eaten||0)+1;cr(s).filter(x=>x.id=='xgib'&&x!==v).forEach(g=>{g.pa++;g.pd++});return 1};
F('xyneph',{c:2,a:2,h:4,f:'',tag:'neph',t:'Hungry: at the start of their turn, if the opponent holds 3 or more cards, it eats one at random and gets +1/+1.',
 up:(s,o,c)=>{if(o.hand.length<3)return;const x=fRnd(o.hand);o.hand=o.hand.filter(y=>y!==x);bury(o,x);c.pa++;c.pd++;log('A Young Nephil eats '+fNm(x)+' from your hand.')}});
F('xnep',{c:3,a:4,h:5,f:'',tag:'neph',t:'When it enters, it eats their weakest other army member and gains its power and health.',etb:(s,o,c)=>fEat(s,c)});
F('xgib',{c:4,a:5,h:6,f:'b',tag:'neph',t:'Bulldoze. Men of renown: whenever one of their army members is eaten, it gets +1/+1.'});
F('xog',{c:5,a:6,h:7,f:'z',tag:'neph',t:'Resilient. The last of the giants: gets +1/+1 for each Nephilim in their graveyard (at most +4/+4).',
 self:c=>{const n=Math.min(4,sideOf(c).gy.filter(x=>FOE[x.id]&&FOE[x.id].tag=='neph').length);return[n,n]}});
F('xroar',{c:2,t:'"We were as grasshoppers": tap each opposing army member with power 2 or less. They don\'t untap next turn.',
 ai:(s,o)=>{const n=cr(o).filter(x=>!x.tap&&pw(x)<=2).length;return n>=2?{s:3+n*1.5}:null},fx:(s,o)=>{cr(o).filter(x=>pw(x)<=2).forEach(x=>fTap(x,1))}});
F('xclub',{c:3,t:'Deal damage to target army member equal to the power of their strongest army member.',
 ai:(s,o)=>{const m=Math.max(0,...cr(s).map(pw));return fAiKill(o,m,3)},fx:(s,o,t)=>{if(t)t.dmg+=Math.max(0,...cr(s).map(pw))}});
DK('The Nephilim',{d:'xyneph:4,xnep:3,xgib:2,xog,xroar:2,xclub:2',hint:'Their hunger eats your hand, then each other'});

/* ---------- The Prophets of Baal: they cut themselves for a god who never answers ---------- */
/* a prophet's own blade never kills him: the cut stops at 1 health */
const fCut=(c,n,a,perm)=>{if(perm)c.pa+=a;else c.ta+=a;c.dmg=Math.max(c.dmg,Math.min(c.dmg+n,th(c)-1))};
F('xfire',{c:1,a:1,h:2,f:'',tag:'baal',t:'At the start of their turn it cuts itself: 1 damage to itself, +2/+0 permanently.',up:(s,o,c)=>{fCut(c,1,2,1);log('A prophet of Baal cuts himself and cries louder.')}});
F('xcult',{c:2,a:2,h:3,f:'',tag:'baal',t:'When it attacks, it cuts itself: 1 damage to itself and +2/+0 this turn.',atk:(s,o,c)=>fCut(c,1,2,0)});
F('xidol',{c:3,a:2,h:6,f:'k',tag:'baal',t:'Can only defend. The bull lies on the wood: at the start of their turn, each other army member they control takes 1 damage and gets +1/+0 permanently. No fire comes.',
 up:(s,o,c)=>{const L=cr(s).filter(x=>x!==c);L.forEach(x=>fCut(x,1,1,1));if(L.length)log('They limp around the altar and cut themselves. No fire comes.')}});
F('xmolp',{c:3,a:3,h:3,f:'r',tag:'baal',t:'Ruthless. "Cry aloud": whenever another of their army members dies, they draw a card and their army gets +1/+0 permanently.',allyDie:(s,o,c)=>{draw(s,1);cr(s).forEach(x=>{x.pa++})}});
F('xflame',{c:3,t:'They call on Baal all day. No fire falls. Each of their army members cuts itself: 1 damage and +2/+0 this turn.',
 ai:(s,o)=>{const n=cr(s).filter(x=>canAtk(x)&&fHp(x)>1).length;return n>=2?{s:3+n*2}:null},fx:s=>{cr(s).forEach(x=>fCut(x,1,2,0));log('There was no voice, nor any that answered.')}});
DK('The Prophets of Baal',{d:'xfire:5,xcult:4,xidol:2,xmolp:2,xflame:2',hint:'They bleed for power; every one that falls makes the rest stronger'});

/* ---------- The Builders of Babel: a tower that rises every turn and is never finished ---------- */
const fTower=(s,n)=>{s.tower=Math.max(0,(s.tower||0)+n);if(s.tower>=12){s.tower=6;log('The tower nears heaven, and the tongues are confounded: it falls back to six floors.')}else if(n>0)log('The tower rises to '+s.tower+' floor'+(s.tower==1?'':'s')+'.')};
F('xbrick',{c:1,a:2,h:3,f:'',tag:'babel',t:'At the start of their turn, the tower rises by 1.',up:s=>fTower(s,1)});
F('xmason',{c:2,a:2,h:3,f:'',tag:'babel',t:'When it enters, the tower rises by 2. Gets +1/+1 for every 3 floors of the tower.',etb:s=>fTower(s,2),self:c=>{const n=Math.floor((sideOf(c).tower||0)/3);return[n,n]}});
F('xzigg',{c:3,a:3,h:4,f:'k',tag:'babel',t:'Can only defend. Bricks before men: whenever another of their army members dies, the tower rises by 1.',allyDie:s=>fTower(s,1)});
F('xnim',{c:4,a:4,h:4,f:'r',tag:'babel',t:'Ruthless. He shoots at heaven: at the start of their turn, the opponent takes 1 damage for every 3 floors of the tower.',
 up:(s,o)=>fHurt(o,Math.floor((s.tower||0)/3),'Nimrod looses an arrow at heaven. ')});
F('xtong',{c:2,t:'Confusion: shuffle the costs in the opponent\'s hand and tap their strongest army member. It costs them too: the tower falls by 1.',
 ai:(s,o)=>{const t=fTop(cr(o).filter(x=>!x.tap));return t?{s:3+pw(t)*.6}:null},fx:(s,o)=>{if(o.hand.length>1){const C=o.hand.map(c=>cost(c));sh(C);o.hand.forEach((c,i)=>{c.disc=(c.disc||0)+(cost(c)-C[i])})}const t=fTop(cr(o).filter(x=>!x.tap));if(t)fTap(t);fTower(s,-1)}});
F('xbab',{t:'Ward. The tower: at the start of their turn it rises by 1. It is never finished: at 12 floors it falls back to 6.',up:s=>fTower(s,1)});
DK('The Builders of Babel',{d:'xbrick:5,xmason:4,xzigg:2,xnim,xtong:2',hint:'Their tower rises every turn and makes them stronger; it is never finished'});

/* ---------- The Pairikas: STARVATION. Drought, stolen draws and the bad year; Tishtrya's rain answers an offering ---------- */
F('xpair',{t:'Ward. Tishtrya\'s rain answers worship: whenever you offer an army member, each Pairika takes 1 damage.'});
{const _s=startP;startP=function(){const r=_s.apply(this,arguments);try{const e=G.e,p=G.p;if(e&&e.bf){let k=0;if(p.lostDraw){k+=p.lostDraw;p.lostDraw=0}for(let i=0;i<k&&p.hand.length;i++){const c=p.hand.pop();p.deck.push(c)}if(k)log('The Pairikas starve you: '+k+' fewer card'+(k==1?'':'s')+' this turn.');if(k)render()}}catch(e){}return r}}
{const _o=offer;offer=function(s,c){const r=_o.apply(this,arguments);try{if(G&&G.e&&s===G.p&&G.e.bf.some(x=>x.id=='xpair')){const L=fTag(G.e,'pair');L.forEach(x=>{x.dmg+=1});if(L.length){log('You make an offering: Tishtrya\'s rain falls, and each Pairika takes 1.');sweep()}}}catch(e){}return r}}
F('xstar',{c:1,a:2,h:1,f:'fh',tag:'pair',t:'Flying. Charge. It burns out at the end of their turn. When it dies, your next draw is lost.',end:(s,o,c)=>fDestroy(c),die:(s,o)=>{o.lostDraw=(o.lostDraw||0)+1}});
F('xench',{c:2,a:2,h:3,f:'',tag:'pair',t:'She enchants away your harvest: when it enters, your next draw is lost.',etb:(s,o)=>{o.lostDraw=(o.lostDraw||0)+1;log('A Pairika enchants away your next draw.')}});
F('xmush',{c:3,a:3,h:3,f:'fh',tag:'pair',t:'Flying. Charge. The comet hides the sun: when it enters, you get 1 less mana on your next turn.',etb:(s,o)=>{o.manaCut=(o.manaCut||0)+1}});
F('xdroug',{c:4,a:4,h:4,f:'',tag:'pair',t:'Drought: you get 1 less mana each turn (never below 1).',oup:(s,o)=>{if(o.mana>1){o.mana--;log('Drought: the fields forget to grow.')}}});
F('xglam',{c:2,t:'Glamour: until their next turn, target army member has 0 power.',
 ai:(s,o)=>{const t=fTop(fTg(o).filter(x=>pw(x)>=3));return t?{s:2+pw(t),t}:null},fx:(s,o,t)=>{if(t)fHold(t,-pw(t),0,s)}});
{const _u=egUp;egUp=function(s,o){_u(s,o);try{if(G&&G.e&&s===G.p&&s.manaCut){s.mana=Math.max(1,s.mana-s.manaCut);s.manaCut=0;log('The comet hides the sun: 1 less mana.')}}catch(e){}}}
DK('The Pairikas',{d:'xstar:5,xench:4,xmush:2,xdroug,xglam:2',hint:'They starve you of mana and cards; every offering you make brings the rain that hurts them'});

/* ---------- Sons of Darkness: the War Scroll's seven engagements, run by the trumpets ---------- */
const fSons=(s,ex)=>fTag(s,'sons',ex).length;
F('xline',{c:1,a:2,h:2,f:'',tag:'sons',t:'Gets +0/+1 for each other Son of Darkness (at most +3).',self:c=>[0,Math.min(3,fSons(sideOf(c),c))]});
F('xsling',{c:2,a:2,h:2,f:'a',tag:'sons',t:'Range. When it enters, a volley: target opposing army member takes 1 damage for each Son of Darkness they control (at most 3).',
 etb:(s,o,c)=>{const n=Math.min(3,fSons(s));const t=fTop(fTg(o).filter(x=>fHp(x)<=n))||fTop(fTg(o));if(t&&n){t.dmg+=n;log('The slingers loose a volley at '+fNm(t)+'.')}}});
F('xcapt',{c:3,a:3,h:4,f:'',tag:'sons',t:'Their other Sons of Darkness get +1/+0.',aura:(x,c)=>[FOE[x.id]&&FOE[x.id].tag=='sons'?1:0,0]});
F('xbelg',{c:4,a:4,h:5,f:'',tag:'sons',t:'Hostility: at the start of their turn, your strongest army member gets -1/-1 permanently.',
 up:(s,o)=>{const t=fTop(cr(o));if(t){t.pa--;t.pd--;log('Belial condemns '+fNm(t)+' (-1/-1).')}}});
F('xjav',{c:2,t:'Deal damage to target army member equal to 1 + the number of Sons of Darkness they control (at most 5).',
 ai:(s,o)=>fAiKill(o,Math.min(5,1+fSons(s)),2.5),fx:(s,o,t)=>{if(t)t.dmg+=Math.min(5,1+fSons(s))}});
F('xbel',{t:'Ward. The seven engagements: the Sons of Light prevail first: on their turns 1, 3 and 5 their army members get +0/+2 (the line holds); on turns 2, 4 and 6, +2/+0 (Belial prevails); on the seventh, God\'s hand decides and they get -2/-2. Then it begins again.',
 up:(s,o)=>{s.wr=(s.wr||0)+1;const k=((s.wr-1)%7)+1;const L=cr(s);if(k==7){L.forEach(x=>fBuff(x,-2,-2));log('The seventh engagement: God\'s hand decides, and the Sons of Darkness falter (-2/-2).')}else if(k%2==0){L.forEach(x=>fBuff(x,2,0));log('Engagement '+k+': Belial prevails (+2/+0).')}else{L.forEach(x=>fHold(x,0,2,s));log('Engagement '+k+': the Sons of Light press, and the line holds (+0/+2 until their next turn).')}}});
DK('Sons of Darkness',{d:'xline:5,xsling:3,xcapt:3,xbelg,xjav:2',hint:'The War Scroll\'s fixed cycle: they surge, they hold, and on the seventh turn they falter'});

/* ---------- Mammon's Hoard: RICHES AND RUST. He makes you rich; what you hoard rots and feeds him ---------- */
F('xmam',{t:'Ward. Mammon\'s gold: at the start of your turn you gain 1 extra mana. You cannot serve two masters: at the end of your turn, each gold you spent buys one of his army members +1/+1 permanently, and you lose 1 life for each mana you left unspent (moth and rust).',
 oup:(s,o)=>{if(s.noGold){s.gilt=0;return}const n=1+(o.coin||0)+(o.bribe||0);o.coin=0;o.bribe=0;o.mana+=n;s.gilt=n;s.m0=o.mana;log('Mammon\'s gold: you gain '+n+' extra mana.')},
 oend:(s,o)=>{const n=Math.max(0,o.mana);s.waste=n;const spent=Math.max(0,Math.min(s.gilt||0,(s.m0||0)-n));s.gilt=0;
  for(let i=0;i<spent;i++){const t=fRnd(cr(s));if(t){t.pa++;t.pd++}}if(spent&&cr(s).length)log('Mammon\'s gold comes home: his army grows richer.');
  if(n){fHurt(o,n,'Moth and rust corrupt your hoard. ');cr(s).filter(x=>x.id=='xmerc'&&n>=2).forEach(x=>{x.pa++;x.pd++});cr(s).filter(x=>x.id=='xmamg').forEach(x=>{x.pa+=n;x.pd+=n})}}});
F('xcoin',{c:1,a:1,h:2,f:'',tag:'mam',t:'Tribute: when it enters, Mammon gives you 1 more gold next turn.',etb:(s,o)=>{o.coin=(o.coin||0)+1}});
F('xhoard',{c:2,a:2,h:4,f:'',tag:'mam',t:'Where your treasure is: +1/+1 for each mana you wasted last turn (at most +3/+3).',self:c=>{const n=Math.min(3,sideOf(c).waste||0);return[n,n]}});
F('xmerc',{c:2,a:3,h:3,f:'h',tag:'mam',t:'Charge. Paid from your waste: whenever you end a turn with 2 or more mana unspent, it gets +1/+1 permanently.'});
F('xmamg',{c:4,a:3,h:6,f:'',tag:'mam',t:'Wealth itself: +1/+1 permanently for every mana you leave unspent. When he dies, the gold stops: you no longer gain Mammon\'s mana.',die:s=>{s.noGold=1;log('Mammon falls: the gold stops.')}});
F('xbribe',{c:2,t:'The bribe: return target army member of yours to your hand, and Mammon pays you its cost in gold next turn.',
 ai:(s,o)=>{const t=fTop(fTg(o).filter(x=>D[x.id][1]>=2));return t&&ev(t)>=4?{s:2+ev(t)*.6,t}:null},fx:(s,o,t)=>{if(!t)return;o.bribe=(o.bribe||0)+D[t.id][1];bounce(t);log('Mammon buys off '+fNm(t)+'.')}});
DK("Mammon's Hoard",{d:'xcoin:5,xhoard:4,xmerc:3,xmamg,xbribe:2',hint:'He makes you rich: every gold you spend buys his army, every mana you hoard rots into damage. Kill Mammon to stop the gold'});

/* ---------- Mastema's Spirits: THE LEDGER. Every point of damage you deal is written down and charged to you ---------- */
const fLedger=(s,n,why)=>{if(n<=0)return;s.ledger=(s.ledger||0)+n;if(why)log(why+' Ledger: '+s.ledger+'.')};
F('xmast',{t:'Ward. The Accuser writes down every point of damage your army deals. At the start of his turn you lose 1 life for every 3 points written (every 2 while Mastema is in play), and the ledger clears.',
 up:(s,o)=>{const per=s.bf.some(x=>x.id=='xmastg')?2:3;const n=Math.floor((s.ledger||0)/per);if(n)fHurt(o,n,'The Accuser reads out the ledger. ');s.ledger=0}});
{const _r=resolve;resolve=function(){let pre=null;try{const e=G.e;if(G.cmb&&G.cmb.side=='p'&&e&&e.bf.some(x=>x.id=='xmast'))pre={life:e.life,L:cr(e).map(x=>[x,x.dmg,th(x)])}}catch(e){}const r=_r.apply(this,arguments);
 try{if(pre&&G.e){let n=Math.max(0,pre.life-G.e.life);for(const[x,d,h]of pre.L)n+=G.e.bf.includes(x)?Math.max(0,x.dmg-d):Math.max(0,h-d);fLedger(G.e,n,'Your blows are written down.')}}catch(e){}return r}}
F('xacc',{c:1,a:1,h:2,f:'f',tag:'mast',t:'Flying. It accuses: every army member of yours that attacks adds 1 more to the ledger.',dfd:(s,o,c,S)=>fLedger(s,S.length)});
F('xtenth',{c:2,a:2,h:2,f:'',tag:'mast',t:'When it enters, a 1/1 Spirit joins it, the tenth left free. When it dies, its death is written against you (+3 to the ledger).',etb:s=>fSum(s,'xspir',1),die:s=>fLedger(s,3,'The death of a spirit is written against you.')});
F('xspir',{tag:'mast',t:'Left free to test the sons of men.'});
F('xtempt',{c:3,a:3,h:3,f:'',tag:'mast',t:'Temptation: your spells cost 1 less, and each spell you cast adds 2 to the ledger.',tax:c=>'SI'.includes(D[c.id][2])?-1:0,oppCast:s=>fLedger(s,2,'A tempting spell is written down.')});
F('xmastg',{c:4,a:4,h:4,f:'f',tag:'mast',t:'Flying. The prince of the spirits: while he lives, the ledger charges you 1 life for every 2 points instead of 3.'});
F('xtest',{c:2,t:'The trial: if the ledger holds 5 or more, destroy target army member of yours. Otherwise it takes 2 damage.',
 ai:(s,o)=>{if((s.ledger||0)>=5){const T=fTop(fTg(o));return T?{s:3+ev(T)*.8,t:T}:null}return fAiKill(o,2,2.5)},fx:(s,o,t)=>{if(!t)return;if((s.ledger||0)>=5)fDestroy(t);else t.dmg+=2}});
DK("Mastema's Spirits",{d:'xacc:5,xtenth:3,xtempt:3,xmastg,xtest:2',hint:'Every point of damage you deal is written down and charged back to you'});

/* ---------- King Paimon's Procession: THE PROCESSION. Heralds come first; the king follows them and grants dignities ---------- */
F('xpaim',{t:'Ward. The procession: each Herald gives them 1 extra mana at the start of their turn. Once three Heralds have arrived, King Paimon comes from their deck by himself.',
 up:s=>{const n=fCnt(s,'xher');if(n){s.mana+=n;log('The heralds\' trumpets: +'+n+' mana.')}},
 allyEnter:(s,o,c,x)=>{if(x.id!='xher')return;s.heralds=(s.heralds||0)+1;if(s.heralds>=3){const k=s.deck.find(y=>y.id=='xpaimon')||s.hand.find(y=>y.id=='xpaimon');if(k&&fRoom(s)){s.deck=s.deck.filter(y=>y!==k);s.hand=s.hand.filter(y=>y!==k);enter(s,k);log('Three heralds have passed: King Paimon arrives on his dromedary, roaring.')}}}});
F('xher',{c:1,a:1,h:2,f:'',tag:'paim',t:'His trumpet goes before the king: each Herald gives them 1 extra mana a turn, and the third to arrive brings King Paimon.'});
F('xlegs',{c:2,a:2,h:3,f:'',tag:'paim',t:'Of his two hundred legions: +1/+1 for each Herald they control (at most +3/+3).',self:c=>{const n=Math.min(3,fCnt(sideOf(c),'xher'));return[n,n]}});
F('xdrom',{c:3,a:3,h:3,f:'h',tag:'paim',t:'Charge. The king\'s escort: +2/+2 while King Paimon rides with them.',self:c=>sideOf(c).bf.some(x=>x.id=='xpaimon')?[2,2]:[0,0]});
F('xpaimon',{c:4,a:4,h:5,f:'',tag:'paim',t:'He gives dignities and confirms them: when he arrives, each of their army members gets +1/+1 permanently.',etb:s=>{cr(s).forEach(x=>{x.pa++;x.pd++})}});
F('xsecr',{c:2,t:'Paimon reveals secret things: they draw a card for each Herald they control (at most 3).',ai:s=>{const n=Math.min(3,fCnt(s,'xher'));return n?{s:2+n*1.5}:null},fx:s=>draw(s,Math.min(3,fCnt(s,'xher')))});
DK("King Paimon's Procession",{d:'xher:5,xlegs:4,xdrom:2,xpaimon,xsecr:2',hint:'Heralds bring mana and the king; kill them before the third arrives'});

/* ---------- Beelzebub: THE HOUSE UNITED. Damage to one is shared by all, the flies first; a house divided cannot stand ---------- */
const fHouse=['xbeelg','xbaal','xcarr','xfly'];
function fShare(t,n,src){const s=sideOf(t);if(!s||!src||sideOf(src)===s||n<=0)return 0;const L=cr(s).filter(x=>x!==t);if(!L.length)return n;let k=0;const order=L.slice().sort((a,b)=>(b.id=='xfly')-(a.id=='xfly'));for(const x of order){if(k>=n-1)break;x.dmg+=1;k++}return -k}
F('xbeel',{t:'Ward. The house united: combat damage dealt to one of his army members is shared, 1 point to each of his others (the Flies first) before the rest lands. A house divided cannot stand: if he has only one army member, it takes double damage.'});
F('xbeelg',{c:4,a:4,h:5,f:'f',tag:'fly',t:'Flying. The prince of demons: their Flies get +1/+0. Whenever one of their Flies dies, you take 1.',aura:x=>[x.id=='xfly'?1:0,0],allyDie:(s,o,c,x)=>{if(x.id=='xfly')fHurt(o,1)},dmgIn:(t,n,src)=>fShare(t,n,src)});
F('xbaal',{c:2,a:2,h:3,f:'',tag:'fly',t:'The false oracle of Ekron: at the start of their turn, a Fly comes to the offerings and joins them.',up:s=>{if(fSum(s,'xfly',1))log('Flies gather at the oracle of Ekron.')},dmgIn:(t,n,src)=>fShare(t,n,src)});
F('xcarr',{c:1,a:2,h:1,f:'',tag:'fly',t:'It goes where death has been: whenever any army member dies, +1/+0 (at most +3).',allyDie:(s,o,c)=>{if(c.pa<3)c.pa++},oppDie:(s,o,c)=>{if(c.pa<3)c.pa++},dmgIn:(t,n,src)=>fShare(t,n,src)});
F('xfly',{tag:'fly',t:'Flying. One of the swarm that holds the house together.',dmgIn:(t,n,src)=>fShare(t,n,src)});
DK('Beelzebub, Lord of the Flies',{d:'xbeelg,xbaal:6,xcarr:6',hint:'The house united: damage to one of his army is shared by all, the flies first. Divide it'});

/* ---------- Azazel: the scapegoat who arms others ---------- */
F('xazag',{c:4,a:4,h:6,f:'k',tag:'aza',t:'Can only defend: he teaches war rather than waging it. At the start of their turn he arms one of their army members: +2/+0 permanently.',
 up:(s,o,c)=>{const t=fTop(cr(s).filter(x=>x!==c&&!has(x,'k')));if(t){t.pa+=2;log('Azazel arms '+fNm(t)+' (+2/+0).')}}});
F('xsmith',{c:2,a:2,h:3,f:'',tag:'aza',t:'When it enters, it forges a blade for their strongest other army member: +2/+0 permanently.',etb:(s,o,c)=>{const t=fTop(cr(s).filter(x=>x!==c));if(t){t.pa+=2;log('A Forbidden Smith arms '+fNm(t)+'.')}}});
DK('Azazel, the Scapegoat',{d:'xazag,xsmith:6,xwat:4,xcurse:2',hint:'He arms his own army, and every loss of his is laid on your strongest army member'});

/* ---------- Asmodeus: THE WEDDING NIGHT. He kills pairs; the smoke drives him to Egypt ---------- */
const fPairs=o=>{const by={};cr(o).forEach(x=>{const k=D[x.id][1];(by[k]=by[k]||[]).push(x)});return Object.values(by).filter(L=>L.length>=2)};
F('xasm',{t:'Ward. The wedding night: at the start of their turn, for each pair of your army members that share a cost, the newer one takes 2 damage.',
 up:(s,o)=>{for(const L of fPairs(o)){const t=L.slice().sort((a,b)=>(b.eN||0)-(a.eN||0))[0];t.dmg+=2;log('Asmodeus visits the wedding night: '+fNm(t)+' takes 2.')}}});
F('xasmg',{c:5,a:5,h:5,f:'r',tag:'asm',t:'Ruthless. +1/+0 for each pair of your army members that share a cost. The smoke of the fish\'s heart drives him off: if one of your spells damages him, he flees to Egypt (shuffled into their deck).',
 self:c=>[fPairs(oppOf(sideOf(c))).length,0]});
{const _c=cast;cast=function(c,t){let pre=null;try{if(G.e)pre=G.e.bf.filter(x=>x.id=='xasmg').map(x=>[x,x.dmg])}catch(e){}const r=_c.apply(this,arguments);try{if(pre&&'SI'.includes(D[c.id][2]))for(const[x,d]of pre){if(G.e.bf.includes(x)&&x.dmg>d){G.e.bf.splice(G.e.bf.indexOf(x),1);Object.assign(x,{dmg:0,pa:0,pd:0});G.e.deck.splice(Math.random()*(G.e.deck.length+1)|0,0,x);log('The smoke drives Asmodeus off to Egypt.');render()}}}catch(e){}return r}}
F('xjeal',{c:1,a:2,h:1,f:'',tag:'asm',t:'Whenever you play an army member that shares a cost with one you already have, it gets +1/+1 permanently.',oppEnter:(s,o,c,x)=>{if(cr(o).some(y=>y!==x&&D[y.id][1]==D[x.id][1])){c.pa++;c.pd++}}});
F('xwrath',{c:2,a:3,h:2,f:'n',tag:'asm',t:'Can only attack. Aeshma, wrath: when it dies, each of your army members that shares a cost with another takes 1.',die:(s,o)=>{fPairs(o).flat().forEach(x=>{x.dmg+=1})}});
DK('Asmodeus',{d:'xasmg,xjeal:6,xwrath:6',hint:'He hates pairs: army members of yours that share a cost are hurt every turn'});

/* ---------- Lilith: the night and the newborn ---------- */
F('xlilg',{c:4,a:3,h:5,f:'d',tag:'lil',t:'Draining. She preys on the newborn: at the start of their turn, each of your army members that arrived since their last turn takes 2 damage.',
 up:(s,o)=>{const L=fNew(o);L.forEach(x=>{x.dmg+=2});if(L.length)log('Lilith visits the newborn.')}});
F('xlilin',{c:2,a:2,h:2,f:'f',tag:'lil',t:'Flying. When it deals combat damage to you, your newest army member takes 2 damage.',hit:(s,o)=>{const t=fNewest(o);if(t){t.dmg+=2;log('A Lilin falls on '+fNm(t)+'.')}}});
F('xowl',{c:1,a:1,h:2,f:'f',tag:'lil',t:'Flying. Its cry in the night: when it enters, your newest army member is tapped and doesn\'t untap next turn.',etb:(s,o)=>{const t=fNewest(o);if(t)fTap(t,1)}});
DK('Lilith',{d:'xlilg,xlilin:6,xowl:6',hint:'She strikes what you played most recently; her army is strongest at night'});

/* ---------- Lucifer: pride and the fall; the third of the stars ---------- */
F('xfang',{c:2,a:2,h:2,f:'f',tag:'luc',t:'Flying. Gets +1/+1 for every Bargain you have accepted (at most +3/+3).',self:()=>{const n=Math.min(3,G.bargN||0);return[n,n]}});
F('xpride',{c:3,a:3,h:4,f:'w',tag:'luc',t:'Ward. Pride: it can\'t be blocked. When it attacks, it overreaches and takes 1 damage.',
 atk:(s,o,c)=>{c.dmg+=1;c.ub=1}});
F('xspear',{c:2,t:'Deal damage to target army member equal to 2 + the number of Fallen Angels they control.',
 ai:(s,o)=>fAiKill(o,2+fCnt(s,'xfang'),2.5),fx:(s,o,t)=>{if(t)t.dmg+=2+fCnt(s,'xfang')}});
F('xfall',{c:2,t:'Fall from Grace: target opposing army member loses all its permanent bonuses and is tapped.',
 ai:(s,o)=>{const t=fTop(fTg(o).filter(x=>x.pa+x.pd>=2));return t?{s:2+t.pa+t.pd,t}:null},fx:(s,o,t)=>{if(!t)return;t.pa=0;t.pd=0;fTap(t);log(fNm(t)+' falls from grace.')}});
F('xdhead',{c:3,a:3,h:3,f:'',tag:'luc',t:'The tail sweeps the stars: when it enters, each opposing army member takes 1 damage.',etb:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})}});
DK('Lucifer, the Morning Star',{d:'xlucg,xfang:4,xpride:4,xspear:2,xfall:2'});

/* ---------- Ahriman: the Lie, the gift that corrupts, and the serpents that must be fed ---------- */
F('xdaeva',{c:2,a:2,h:2,f:'',tag:'ahr',t:'When it enters, a Lie goes into your hand.',etb:(s,o)=>{o.hand.push(mk('xlie'));log('A Daeva whispers: a Lie goes into your hand.')}});
F('xcook',{c:2,a:1,h:4,f:'',tag:'ahr',t:'A gift: when it enters, you gain 2 life, and two Lies are shuffled into your deck.',etb:(s,o)=>{fGain(o,2);fShuffle(o,'xlie',2);log('The Royal Cook serves a rich meal. Something is hidden in it.')}});
F('xzah',{c:3,a:3,h:3,f:'v',tag:'ahr',t:'Venomous. It must be fed: at the start of their turn it bites your weakest army member for 2 (or you, if you have none). Cut off, it grows back: when it dies, it returns to their hand.',
 up:(s,o)=>{const t=fLow(cr(o));if(t){t.dmg+=2;log('A serpent of the shoulders feeds on '+fNm(t)+'.')}else fHurt(o,2,'The serpents must be fed. ')},
 die:(s,o,c)=>{if(c.grew)return;const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,pa:0,pd:0,grew:1});s.hand.push(c);log('The serpent grows back.')}}});
DK('Ahriman, the Smiling Stranger',{d:'xahri,xdaeva:6,xcook:3,xzah:3'});

/* ---------- Abaddon: the locusts torment; the key opens the pit ---------- */
F('xloc',{c:1,a:1,h:1,f:'f',tag:'aba',t:'Flying. Torment, not death: when it deals combat damage to you, your weakest army member gets -1/-0 permanently.',hit:(s,o)=>{const t=fLow(cr(o).filter(x=>pw(x)>0));if(t){t.pa--;log('A Locust torments '+fNm(t)+'.')}}});
F('xcharg',{c:2,a:3,h:2,f:'h',tag:'aba',t:'Charge. Like horses prepared for battle: when it attacks, each Locust gets +1/+0 this turn.',atk:s=>{s.bf.filter(x=>x.id=='xloc').forEach(x=>{x.ta++})}});
F('xkeep',{c:3,a:2,h:4,f:'',tag:'aba',t:'The key of the pit: at the start of their turn, if they have fewer than 3 Locusts, a Locust rises. When it dies, two Locusts rise.',
 up:s=>{if(fCnt(s,'xloc')<3&&fSum(s,'xloc',1))log('A Locust rises from the pit.')},die:s=>{const n=fSum(s,'xloc',2);if(n)log('Two Locusts rise from the pit.')}});
F('xapol',{c:5,a:5,h:5,f:'f',tag:'aba',t:'Flying. The Destroyer: at the start of their turn, each of your damaged army members takes 1 more damage. Men seek death and do not find it.',
 up:(s,o)=>{const L=cr(o).filter(x=>x.dmg>0);L.forEach(x=>{x.dmg+=1});if(L.length)log('Apollyon torments your wounded.')}});
F('xsting',{c:2,t:'The sting: target damaged army member is tormented: -2/-0 permanently, and it can\'t block this turn. Men seek death and do not find it.',ai:(s,o)=>{const T=fTop(fTg(o).filter(x=>x.dmg>0&&pw(x)>=2));return T?{s:2+pw(T)*1.2,t:T}:null},fx:(s,o,t)=>{if(t){t.pa-=2;fTap(t);log(fNm(t)+' is tormented by the sting.')}}});
DK('Abaddon, the Opened Abyss',{d:'xapol,xkeep:2,xcharg:4,xloc:4,xsting:2'});

/* ---------- The Beast of the Sea and the False Prophet ---------- */
F('ximg',{c:2,a:2,h:3,f:'',tag:'beast',t:'The speaking image: at the start of their turn, if none of your army members bears the mark, you take 2 damage (those who will not worship it).',
 up:(s,o)=>{if(!cr(o).some(x=>x.mk))fHurt(o,2,'The image of the beast speaks. ')}});
F('xhd',{c:2,a:2,h:3,f:'w',tag:'beast',t:'Ward. Can\'t be Sundered. Dominion: your spells cost 1 more while it lives.',tax:c=>'SI'.includes(D[c.id][2])?1:0});
F('xhl',{c:3,a:3,h:3,f:'r',tag:'beast',t:'Ruthless. Can\'t be Sundered. The lion\'s mouth: when it dies, the Beast\'s other Heads get +1/+1 (the wound heals).',die:s=>{cr(s).filter(x=>['xhb','xhd','xhl','xbeast'].includes(x.id)).forEach(x=>{x.pa++;x.pd++})}});
F('xfheav',{c:2,t:'A false sign: deal 2 damage to target army member and mark it (it can\'t attack on your next turn).',
 ai:(s,o)=>{const T=fTop(fTg(o));return T?{s:2.5+ev(T)*.5,t:T}:null},fx:(s,o,t)=>{if(t){t.dmg+=2;t.mk=1}}});
F('xlucg',{c:5,a:5,h:6,f:'fw',tag:'luc',t:'Flying. Ward. The light-bringer: their Fallen Angels get +1/+1. "I will ascend above the stars": at the start of their turn he gets +1/+0 permanently.',aura:x=>x.id=='xfang'?[1,1]:[0,0],up:(s,o,c)=>{c.pa++}});
F('xahri',{c:5,a:5,h:6,f:'',tag:'ahr',t:'He cannot create, only spoil: at the start of their turn, your strongest army member gets -1/-1 permanently for each Lie you hold (at most 3).',
 up:(s,o)=>{const n=Math.min(3,o.hand.filter(x=>x.id=='xlie').length);const t=fTop(cr(o));if(n&&t){t.pa-=n;t.pd-=n;log('Ahriman spoils '+fNm(t)+' with your lies (-'+n+'/-'+n+').')}}});

/* ===== Act III elites: new cards (v2 pools; art pending, emoji until then) ===== */
Object.assign(D,{
xzebul:['Lord of the High House',3,'C',2,6,'k','','🏛️','B',2], xpraer:['Prince of the Air',3,'C',3,3,'f','','🌪️','B',2],
xdung:['Dung-Heap of Ekron',2,'A',0,0,'','','💩','B',1], xplague:['Plague of Flies',2,'S',0,0,'','','🪰','B',2],
xgoat:['The Goat Sent Out',1,'C',0,5,'k','','🐐','B',1], xadorn:['Teacher of Adornment',2,'C',2,3,'','','🪞','B',2],
xsword:['Swordsmith of the Earth',3,'C',3,4,'','','🗡️','B',2], xdudael:['Bound in Dudael',3,'S',0,0,'','','⛓️','B',2],
xdesire:['Demon of Desire',3,'C',3,3,'','','💘','R',2], xgroom:['Seven Grooms',2,'C',2,2,'','','💍','R',1],
xfeast:['The Wedding Feast',2,'S',0,0,'','','🍷','R',2], xashm:['Ashmedai, King of Demons',4,'C',4,4,'r','','👑','R',3],
xdemon:['Night Demoness',2,'C',3,2,'','','😈','B',1], xcradle:['Cradle-Robber',3,'C',3,4,'f','','🦇','B',2],
xnight:['The Long Night',3,'E',0,0,'','','🌑','B',2], xamulet:['Broken Amulet',2,'S',0,0,'','','🧿','B',2]});
Object.assign(LORE,{xzebul:'Lord of the house',xpraer:'Prince of the air',xdung:'Altar of Ekron',xplague:'Plague',xgoat:'Scapegoat',xadorn:'Fallen teacher',xsword:'Fallen teacher',xdudael:'Binding',
 xdesire:'Demon of desire',xgroom:'Bridegrooms',xfeast:'Wedding feast',xashm:'King of demons',xdemon:'Night demon',xcradle:'Night demon',xnight:'Night',xamulet:'Amulet'});
/* Beelzebub */
fHouse.push('xzebul','xpraer');
{const _f=fShare;fShare=function(t,n,src){const s=sideOf(t);if(!s||!src||sideOf(src)===s||n<=0)return 0;const A=cr(s).filter(x=>x!==t);if(!A.length)return n;const L=A.filter(x=>x.id!='xzebul');if(!L.length)return 0;let k=0;const order=L.slice().sort((a,b)=>(b.id=='xfly')-(a.id=='xfly'));for(const x of order){if(k>=n-1)break;x.dmg+=1;k++}return -k}}
F('xzebul',{tag:'fly',t:'Can only defend. Baal-zebul, the beam of the high house: damage shared through the house never lands on it, and their Flies get +0/+1.',aura:x=>[0,x.id=='xfly'?1:0],dmgIn:(t,n,src)=>fShare(t,n,src)});
F('xpraer',{tag:'fly',t:'Flying. The swarm rides the air: when it enters, two Flies join them.',etb:s=>{if(fSum(s,'xfly',2))log('The Prince of the Air brings the swarm.')},dmgIn:(t,n,src)=>fShare(t,n,src)});
F('xdung',{iv:7,t:'Zebel, the dung of Ekron: whenever you offer an army member, a Fly comes to the offering and joins them.'});
{const _o=offer;offer=function(s,c){const r=_o.apply(this,arguments);try{if(G&&G.e&&s===G.p&&G.e.bf.some(x=>x.id=='xdung')&&fSum(G.e,'xfly',1))log('A fly comes to your offering.')}catch(e){}return r}}
F('xplague',{t:'Deal 1 damage to each of your army members for every two Flies they control.',ai:(s,o)=>{const n=fCnt(s,'xfly')>>1;return n&&cr(o).length?{s:1.5+n*cr(o).length}:null},fx:(s,o)=>{const n=fCnt(s,'xfly')>>1;cr(o).forEach(x=>{x.dmg+=n});if(n)log('A plague of flies: each of your army members takes '+n+'.')}});
DK('Beelzebub, Lord of the Flies',{d:'xbeelg,xbaal:4,xcarr:4,xzebul:2,xpraer:2,xdung,xplague:2'});
/* Azazel */
F('xgoat',{tag:'aza',t:'Can only defend. It bears their sins into the wilderness: the first damage each turn dealt to another of their army members is dealt to it instead.'});
{const _d=dAdj;dAdj=function(t,n,src){let d=_d.apply(this,arguments);try{const s=sideOf(t);if(s&&t.id!='xgoat'&&n+d>0){const g=s.bf.find(x=>x.id=='xgoat'&&x.gt!==G.turn);if(g){g.gt=G.turn;g.dmg+=n+d;log('The goat bears it: '+(n+d)+' damage falls on the Goat Sent Out.');return -n}}}catch(e){}return d}}
F('xadorn',{tag:'aza',t:'The art of antimony and the mirror: when it enters, their strongest other army member gets Ward.',etb:(s,o,c)=>{const t=fTop(cr(s).filter(x=>x!==c));if(t){fKey(t,'w');log('Azazel\'s teacher adorns '+fNm(t)+' (Ward).')}}});
F('xsword',{tag:'aza',t:'He taught men to make swords and shields: when it enters, each of their army members gets +1/+0 permanently.',etb:s=>{cr(s).forEach(x=>{x.pa++})}});
F('xdudael',{t:'Bound under rough and jagged rocks: tap your strongest army member. It stays tapped for two turns.',ai:(s,o)=>{const t=fTop(cr(o).filter(x=>!has(x,'w')));return t?{s:2+ev(t)*.7,t}:null},fx:(s,o,t)=>{t=t||fTop(cr(o));if(t){t.tap=1;t.frz=Math.max(t.frz||0,2);log(fNm(t)+' is bound in Dudael.')}}});
DK('Azazel, the Scapegoat',{d:'xazag,xsmith:4,xwat:3,xcurse:2,xgoat:2,xadorn:2,xsword:2,xdudael'});
/* Asmodeus */
F('xdesire',{tag:'asm',t:'Matchmaker: when it enters, the cheapest army member in your hand now costs the same as your newest army member.',etb:(s,o)=>{const n=fNewest(o);const h=o.hand.filter(x=>isC(x)).sort((a,b)=>D[a.id][1]-D[b.id][1])[0];if(n&&h){const k=D[n.id][1];h.disc=D[h.id][1]-k;log('Desire: '+fNm(h)+' now costs '+k+', the same as '+fNm(n)+'.')}}});
F('xgroom',{tag:'asm',t:'The seven bridegrooms: whenever the wedding night hurts one of your army members, it gets +1/+1 permanently.'});
{const U=FOE.xasm.up;FOE.xasm.up=function(s,o){const n=fPairs(o).length;U(s,o);if(n)cr(s).filter(x=>x.id=='xgroom').forEach(x=>{x.pa+=n;x.pd+=n})}}
F('xfeast',{t:'Fourteen days of feasting: each of your army members that shares a cost with another takes 2 damage.',ai:(s,o)=>{const n=fPairs(o).flat().length;return n?{s:1+n*1.5}:null},fx:(s,o)=>{fPairs(o).flat().forEach(x=>{x.dmg+=2});log('The wedding feast: every pair is struck.')}});
F('xashm',{tag:'asm',t:'Ruthless. Ashmedai, king of the demons: +1/+1 for each pair of your army members that share a cost.',self:c=>{const n=fPairs(oppOf(sideOf(c))).length;return[n,n]}});
DK('Asmodeus',{d:'xasmg,xjeal:4,xwrath:4,xdesire:2,xgroom:2,xfeast:2,xashm'});
/* Lilith */
F('xdemon',{tag:'lil',t:'When it enters, your newest army member takes 2 damage.',etb:(s,o)=>{const t=fNewest(o);if(t){t.dmg+=2;log('A night demoness falls on '+fNm(t)+'.')}}});
F('xcradle',{tag:'lil',t:'Flying. When it deals combat damage to you, your newest army member is snatched back to your hand.',hit:(s,o)=>{const t=fNewest(o);if(t&&o.bf.includes(t)){bounce(t);log('The Cradle-Robber snatches '+fNm(t)+'.')}}});
F('xnight',{iv:7,t:'Their army members keep their night power (+1/+0) on your turn as well.',aura:(x,c)=>[actSide()!==sideOf(c)?1:0,0]});
F('xamulet',{t:'The three angels\' names are scratched out: destroy target army member of yours that arrived this turn or last, if it has 3 or less health left.',
 ai:(s,o)=>{const t=fTop(cr(o).filter(x=>(x.eT||0)>=G.turn-1&&fHp(x)<=3&&!has(x,'w')));return t?{s:2+ev(t)*.9,t}:null},fx:(s,o,t)=>{if(t&&fHp(t)<=3)fDestroy(t)}});
DK('Lilith',{d:'xlilg,xlilin:4,xowl:4,xdemon:2,xcradle:2,xnight,xamulet:2'});
