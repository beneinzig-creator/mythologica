/* ===== Thoth's realm, the Two Lands: every opponent rebuilt around one theme (lore: tooling/lore/egyptian.js + the Lore session's briefs) ===== */
const fOut=(s,o)=>cr(s).length>cr(o).length;

/* ---------- The Tomb Robbers: cowards strong in numbers who strip the tombs and sell the loot ---------- */
F('grob',{c:1,a:2,h:1,f:'h',tag:'rob',t:'Charge. Strong in numbers: +1/+0 while they have more army members than you.',self:c=>{const s=sideOf(c);return[fOut(s,oppOf(s))?1:0,0]}});
F('tdig',{c:2,a:3,h:2,f:'',tag:'rob',t:'It tunnels under the false passages: it can\'t be blocked while they have more army members than you.',
 up:(s,o,c)=>{c.ub=fOut(s,o)?1:0},atk:(s,o,c)=>{c.ub=fOut(s,o)?1:0}});
F('fence',{c:3,a:3,h:3,f:'',tag:'rob',t:'When it enters, and at the start of their turn, if they hold stolen goods, they sell one: draw a card.',
 etb:s=>{if((s.loot||[]).length)draw(s,1)},up:s=>{if((s.loot||[]).length){draw(s,1);log('The Fence sells stolen goods in the markets of Thebes.')}}});
F('mthief',{c:4,a:4,h:4,f:'r',tag:'rob',t:'Ruthless. When it enters, it steals a random card from your hand. The confession: when it dies, it names the gang, and each other robber takes 2 damage.',
 etb:(s,o)=>{if(!o.hand.length)return;const x=fRnd(o.hand);o.hand=o.hand.filter(y=>y!==x);(s.loot=s.loot||[]).push(x);log('The Master of Thieves steals '+fNm(x)+' from your hand.')},
 die:s=>{const L=fTag(s,'rob');L.forEach(x=>{x.dmg+=2});if(L.length)log('Under questioning, the Master of Thieves names his gang.')}});
F('torch',{c:2,t:'They set the coffins alight: deal 2 damage to target army member, or 4 if it is already damaged.',
 ai:(s,o)=>{const k=fTop(fTg(o).filter(x=>fHp(x)<=(x.dmg?4:2)));return k&&ev(k)>=2.5?{s:2.5+ev(k)*.8,t:k}:null},fx:(s,o,t)=>{if(t)t.dmg+=t.dmg?4:2}});
F('drag',{c:2,t:'Drag below: return target opposing army member to its owner\'s hand. It costs 1 more to play again.',
 ai:(s,o)=>{const T=fTop(fTg(o).filter(x=>D[x.id][1]>=3));return T&&ev(T)>=5?{s:2+ev(T)*.55,t:T}:null},fx:(s,o,t)=>{if(!t)return;bounce(t);t.disc=(t.disc||0)-1}});
DK('The Tomb Robbers',{d:'grob:5,tdig:3,fence:2,mthief,torch:2,drag',hint:'Cowards in numbers: they steal when they outnumber you and sell what they take'});

/* ---------- The Scorpions of Serket: seven escorts who pool their venom into one sting ---------- */
F('sbrood',{c:1,a:1,h:1,f:'h',tag:'scor',t:'Charge. One of the seven: when it dies, its venom pools. The next of their army members to attack has Venomous that turn.',die:s=>{s.pool=(s.pool||0)+1;log('A scorpion\'s venom pools for the next sting.')}});
F('sstalk',{c:2,a:3,h:2,f:'',tag:'scor',t:'It waits under the sand: when you attack while it is in defense form, it has Venomous until their next turn.',
 dfd:(s,o,c)=>{if(c.def&&!c.f.includes('v')){c.f+='v';c.vtmp=1}},up:(s,o,c)=>{if(c.vtmp){c.f=c.f.replace('v','');c.vtmp=0}}});
F('squeen',{c:3,a:3,h:3,f:'',tag:'scor',t:'She heals stings and knows how to cause them: when it enters, your weakest army member takes 1 damage. At the start of their turn, restore 2 health to each of their army members.',
 etb:(s,o)=>{const t=fLow(cr(o));if(t)t.dmg+=1},up:s=>cr(s).forEach(x=>heal(x,2))});
F('sking',{c:4,a:4,h:4,f:'',tag:'scor',t:'The first king gathers the seven: gets +1/+1 for each Scorpion Brood they control (at most +3/+3).',self:c=>{const n=Math.min(3,fCnt(sideOf(c),'sbrood'));return[n,n]}});
F('sting',{c:2,t:'Destroy target army member that has damage on it.',ai:(s,o)=>{const T=fTop(fTg(o).filter(x=>x.dmg>0));return T&&ev(T)>=3?{s:2+ev(T)*.8,t:T}:null},fx:(s,o,t)=>{if(t)fDestroy(t)}});
{const _l=launch;launch=function(s,S,tgm){const r=_l.apply(this,arguments);try{if(s===G.e&&s.pool>0){const a=S.find(x=>!x.f.includes('v'));if(a){a.f+='v';a.vtmp=1;s.pool--;log(fNm(a)+' carries the pooled venom.')}}}catch(e){}return r}}
DK('The Scorpions of Serket',{d:'sbrood:6,sstalk:3,squeen:2,sking,sting:2',hint:'Small stingers pool their venom: every one that dies arms the next attacker'});

/* ---------- Servants of the Tomb: the shabti answer "Here I am!" and stand in for the dead ---------- */
F('shbs',{c:1,a:3,h:1,f:'',tag:'shab',t:'"Here I am!": once each turn, when another of their army members dies, this servant dies in its place and that army member returns with 1 health.',
 allyDie:(s,o,c,x)=>{if(s.answ===G.turn||x.id=='shabt'||x.id=='shbs'||!s.bf.includes(c)||!fRoom(s))return;s.answ=G.turn;const i=s.gy.indexOf(x);if(i<0)return;s.gy.splice(i,1);Object.assign(x,{dmg:Math.max(0,th(x)-1),tap:0,def:0,vn:0,rs:0,sick:1});fDestroy(c);s.bf.push(x);log('"Here I am!": a Shabti answers in '+fNm(x)+'\'s place.')}});
F('mumw',{c:3,a:4,h:4,f:'z',tag:'shab',t:'Resilient. The preserved body: at the start of their turn, it is restored to full health.',up:(s,o,c)=>{c.dmg=0}});
F('embp',{c:2,a:2,h:3,f:'',tag:'shab',t:'Seventy days of spells: when it enters, restore all their army members to full health. Their Shabti get +1/+1 permanently.',
 etb:s=>{cr(s).forEach(x=>{x.dmg=0;if(x.id=='shabt'||x.id=='shbs'){x.pa++;x.pd++}})}});
F('tguard',{c:4,a:5,h:5,f:'',tag:'shab',t:'The master they serve: their Shabti get +1/+1. At the start of their turn, a Shabti answers his call.',
 aura:x=>(x.id=='shabt'||x.id=='shbs')?[1,1]:[0,0],up:s=>{if(fSum(s,'shabt',1))log('A Shabti answers the Mummy King\'s call.')}});
F('shabt',{tag:'shab',t:'"Here I am."'});
F('heal2',{c:2,t:'The Nile\'s yearly renewal: they gain 4 life and restore 2 health to each of their army members.',
 ai:s=>{const hurt=cr(s).reduce((n,x)=>n+Math.min(2,x.dmg),0);return(s.life<=s.max-4||hurt>=3)?{s:3+(s.max-s.life)/2.5+hurt*.5}:null},fx:s=>{fGain(s,4);cr(s).forEach(x=>heal(x,2))}});
DK('Servants of the Tomb',{d:'shbs:6,mumw:3,embp:2,tguard,heal2:2',hint:'Shabti servants die in their masters\' place; the mummies endure'});

/* ---------- The Crocodiles of Sobek: they wait in the water, and everything that attacks walks into their jaws ---------- */
F('croc',{c:2,a:3,h:3,f:'',tag:'croc',t:'It lies on the bank like a log: +2/+0 in defense form.',self:c=>[c.def?2:0,0]});
F('lurk',{c:2,a:3,h:2,f:'',tag:'croc',t:'It lies in wait: when you attack, if it is untapped, it bites your strongest attacker for 2.',
 dfd:(s,o,c,S)=>{if(c.tap)return;const t=fTop(S);if(t){t.dmg+=2;log('A Nile Lurker bites '+fNm(t)+' from the water.')}}});
F('sobpr',{c:3,a:3,h:4,f:'',tag:'croc',t:'The priests feed the sacred crocodile: at the start of their turn, Sobek (or their strongest crocodile) gets +1/+1 permanently.',
 up:(s,o,c)=>{const t=s.bf.find(x=>x.id=='sobek')||fTop(fTag(s,'croc',c));if(t){t.pa++;t.pd++;log('The priests of Sobek feed '+fNm(t)+' honey cakes.')}}});
F('sobek',{c:5,a:6,h:6,f:'',tag:'croc',t:'The death roll: after it blocks an army member, that army member is dragged under and destroyed.',
 blk:(s,o,c)=>{const cm=G.cmbLast;if(!cm)return;for(const[a,b]of Object.entries(cm.blk||{}))if(b==c.u){const A=o.bf.find(x=>x.u==a);if(A){fDestroy(A);log('Sobek drags '+fNm(A)+' under the water.')}}}});
{const _r=resolve;resolve=function(){try{G.cmbLast=G.cmb?{blk:{...G.cmb.blk},side:G.cmb.side}:null}catch(e){}return _r.apply(this,arguments)}}
DK('The Crocodiles of Sobek',{d:'croc:5,lurk:3,sobpr:3,sobek,drag:2',hint:'Ambushers: attacking them walks into their jaws'});

/* ---------- The Jackals of Anubis: guides of the dead, fed by every death; Wepwawet opens the way ---------- */
F('jack',{c:1,a:3,h:1,f:'h',tag:'jack',t:'Charge. The cemetery scavenger: gets +1/+0 for every 3 army members in your graveyard (at most +2).',self:c=>[Math.min(2,Math.floor(oppOf(sideOf(c)).gy.filter(isC).length/3)),0]});
F('jguard',{c:2,a:2,h:3,f:'',tag:'jack',t:'Guardian of the necropolis: whenever another of their army members dies, it gets +0/+1 permanently and they gain 1 life.',allyDie:(s,o,c)=>{c.pd++;fGain(s,1)}});
F('wepw',{c:3,a:4,h:3,f:'r',tag:'jack',t:'Ruthless. Opener of the ways: when it attacks, the other attackers can\'t be blocked this turn.',atk:(s,o,c)=>{cr(s).filter(x=>x.att&&x!==c).forEach(x=>{x.ub=1})}});
F('jpack',{c:4,a:5,h:4,f:'',tag:'jack',t:'When it enters, your weakest army member takes 2 damage. Their other Jackals get +1/+0.',
 etb:(s,o)=>{const t=fLow(cr(o));if(t)t.dmg+=2},aura:x=>[FOE[x.id]&&FOE[x.id].tag=='jack'?1:0,0]});
DK('The Jackals of Anubis',{d:'jack:6,jguard:5,wepw:2,jpack',hint:'Every death feeds them, and the Opener of the Ways lets the pack through'});

/* ---------- The Priests of Heka: magic through names; the cursed cards in your hand ---------- */
const fCurseHand=(o,n,why)=>{for(let i=0;i<n;i++){const L=o.hand.filter(x=>!x.cursed);const x=fRnd(L.length?L:o.hand);if(!x)return;x.disc=(x.disc||0)-1;x.cursed=1;log((why||'Execration: ')+fNm(x)+' is cursed (costs 1 more).')}};
F('hekp',{c:1,a:2,h:2,f:'',tag:'heka',t:'It commands by name: when it enters, a random card in your hand is cursed (costs 1 more).',etb:(s,o)=>fCurseHand(o,1,'A Priest of Heka speaks a name: ')});
F('snake',{c:2,a:3,h:2,f:'v',tag:'heka',t:'Venomous. The staff turned serpent: whenever you play a cursed card, it spits fire and you take 2.',
 oppCast:(s,o,c,x)=>{if(x.cursed)fHurt(o,2,'The Temple Cobra spits fire. ')},oppEnter:(s,o,c,x)=>{if(x.cursed)fHurt(o,2,'The Temple Cobra spits fire. ')}});
F('hekmag',{c:3,a:3,h:4,f:'',tag:'heka',t:'The wax figure is smashed: when it enters, a cursed card in your hand is destroyed.',
 etb:(s,o)=>{const x=fRnd(o.hand.filter(y=>y.cursed));if(x){o.hand=o.hand.filter(y=>y!==x);bury(o,x);log('The court magician smashes the figure: '+fNm(x)+' is destroyed.')}}});
F('hekhigh',{c:4,a:4,h:5,f:'w',tag:'heka',t:'Ward. At the start of their turn, he writes one more name: another card in your hand is cursed.',up:(s,o)=>fCurseHand(o,1,'The High Priest writes a name on a pot: ')});
F('curse2',{c:2,t:'Target army member gets -2/-2, or -3/-3 if you hold a cursed card.',
 ai:(s,o)=>fAiKill(o,o.hand.some(x=>x.cursed)?3:2,2.5),fx:(s,o,t)=>{if(!t)return;const n=o.hand.some(x=>x.cursed)?3:2;t.pa-=n;t.pd-=n}});
{const _u=egUp;egUp=function(s,o){_u(s,o);try{if(s&&s===G.e&&s.bf.some(x=>x.id=='heka'))o.hand.forEach(x=>{if((x.disc||0)<0)x.cursed=1})}catch(e){}}}
DK('The Priests of Heka',{d:'hekp:4,snake:4,hekmag:2,hekhigh,curse2:3',hint:'They curse the cards in your hand by name, and cursed cards hurt you to play'});

/* ---------- Ammit: the weighing of the heart ---------- */
const fFeather=s=>Math.max(2,4-fCnt(s,'hguard2')-(s.light||0));
F('ammt',{t:'Ward. The weighing: at the start of their turn, your army member with the most power is weighed against the feather (power 4, lighter for each Guardian of the Scales). If it is heavier, Ammit eats it: it is gone for good.',
 up:(s,o)=>{const t=cr(o).filter(x=>pw(x)>=fFeather(s)).sort((a,b)=>pw(b)-pw(a))[0];if(!t)return;o.bf.splice(o.bf.indexOf(t),1);log('The heart of '+fNm(t)+' is heavier than the feather: Ammit eats it.');cr(s).filter(x=>x.id=='ammit').forEach(a=>{a.pa+=2;a.pd+=2});try{amFall()}catch(e){}}});
F('ammit',{c:4,a:4,h:6,f:'k',tag:'ammit',t:'Can only defend: she waits by the scales. Every heart she eats gives her +2/+2.'});
F('soulw',{c:1,a:2,h:2,f:'',tag:'ammit',t:'It knows the weight of its heart: when it dies, the feather becomes 1 lighter (at most 2 lighter).',die:s=>{if((s.light||0)<2){s.light=(s.light||0)+1;log('The feather grows lighter.')}}});
F('unwor',{c:2,a:3,h:3,f:'',tag:'ammit',t:'Hearts found heavy: when it deals combat damage to you, your strongest army member gets +1/+0 permanently (its heart grows heavier).',hit:(s,o)=>{const t=fTop(cr(o));if(t){t.pa++;log(fNm(t)+'\'s heart grows heavier.')}}});
F('hguard2',{c:3,a:3,h:5,f:'',tag:'ammit',t:'Holds the plumb-line of the balance: the feather is 1 lighter while it lives.'});
DK('Ammit, the Devourer',{d:'ammit,soulw:5,unwor:4,hguard2:3',hint:'Each turn your strongest army member is weighed: if it is too heavy, Ammit eats it'});

/* ---------- The Great Sphinx: a guardian's test, and it keeps its bargain ---------- */
F('sphinx2',{c:5,a:5,h:7,f:'',tag:'sph',t:'Horus in the horizon: it can only defend until you fail a riddle. Every riddle you fail gives it +1/+1.',up:(s,o,c)=>{if(!G.rdFail){if(!c.f.includes('k'))c.f+='k';c.def=1}else c.f=c.f.replace('k','')},etb:(s,o,c)=>{if(!G.rdFail){if(!c.f.includes('k'))c.f+='k';c.def=1}}});
F('sphg',{c:3,a:3,h:4,f:'f',tag:'sph',t:'Flying. The avenue of sphinxes: their other army members get +0/+1.',aura:()=>[0,1]});
F('sphs',{c:2,a:2,h:3,f:'k',tag:'sph',t:'Can only defend. Every riddle you fail gives it +1/+1.'});
F('sphx',{t:'Ward. At the start of their turn, the Sphinx names a card type. At the end of your turn, if you played a card of that type, it keeps its bargain and you draw a card; if not, you lose 2 life.'});
DK('The Great Sphinx',{d:'sphinx2,sphg:5,sphs:7',hint:'Answer its riddle each turn and it rewards you; fail and the guardians grow'});

/* ---------- Apophis: chaos unmakes names; he is never destroyed, only driven back ---------- */
F('apepx',{c:5,a:5,h:7,f:'v',tag:'apep',t:'Venomous. His gaze stops the sun boat: when it enters, your army members are tapped and don\'t untap next turn. He is never destroyed, only driven back: when it dies, it is shuffled into their deck.',
 etb:(s,o)=>{cr(o).forEach(x=>fTap(x,1));log('The gaze of Apophis stops the boat.')},die:(s,o,c)=>{const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,pa:0,pd:0,rs:0});s.deck.splice(Math.random()*(s.deck.length+1)|0,0,c);log('Apophis is driven back into the dark. He will return.')}}});
F('apsp',{c:1,a:2,h:1,f:'',tag:'apep',t:'From the coils of chaos, the coils of chaos: when it dies, a new Spawn of Apophis is shuffled into their deck.',die:s=>fShuffle(s,'apsp',1)});
F('apcoil',{c:3,a:3,h:4,f:'',tag:'apep',t:'To pass one is to forget the last: after it blocks an army member, that army member is Erased (it loses its name, keywords and abilities).',
 blk:(s,o,c)=>{const cm=G.cmbLast;if(!cm)return;for(const[a,b]of Object.entries(cm.blk||{}))if(b==c.u){const A=o.bf.find(x=>x.u==a);if(A&&typeof thErase=='function')thErase(A,s)}}});
DK('Apophis, the Serpent of Chaos',{d:'apepx,apsp:7,apcoil:5'});

/* ---------- Set: dismemberment, the chest, and the eighty-year contest ---------- */
F('setg',{c:5,a:5,h:6,f:'r',tag:'set',t:'Ruthless. The contest: when it attacks, it wrestles your strongest army member first, and each deals damage equal to its power to the other.',
 atk:(s,o,c)=>{const t=fTop(fTg(o));if(!t)return;t.dmg+=pw(c);c.dmg+=pw(t);log('Set and '+fNm(t)+' contend.')}});
F('setb',{c:2,a:3,h:2,f:'h',tag:'set',t:'Charge. When it deals combat damage to you, your weakest army member is torn apart (Sundered into its Body and Spirit; no Name for you).',
 hit:(s,o)=>{const t=fLow(cr(o).filter(x=>!x.part&&!has(x,'w')));if(t&&typeof thSunder=='function')thSunder(t,s)}});
F('setst',{c:3,a:3,h:3,f:'',tag:'set',t:'The red desert walks: at the start of their turn, each of your Bodies and Spirits takes 1 damage.',up:(s,o)=>{const L=cr(o).filter(x=>x.part);L.forEach(x=>{x.dmg+=1});if(L.length)log('The storm scatters the pieces.')}});
F('sand',{c:3,t:'Deal 2 damage to each opposing army member.',ai:(s,o)=>{const L=cr(o),k=L.filter(x=>fHp(x)<=2).length;return L.length>=2&&k>=1?{s:3+k*3+L.length}:null},fx:(s,o)=>{cr(o).forEach(x=>{x.dmg+=2})}});
DK('Set, Lord of the Red Desert',{d:'setg,setb:5,setst:4,sand:2,drag:2'});

/* ---------- Sekhmet: the Eye of Ra's rage, which burns her too; red beer calms her ---------- */
F('lion',{c:2,a:2,h:3,f:'r',tag:'sekh',t:'Ruthless. The pride hunts together: gets +1/+0 for each other Lioness (at most +2).',self:c=>[Math.min(2,fCnt(sideOf(c),'lion')-1),0]});
F('plague',{c:3,a:3,h:3,f:'',tag:'sekh',t:'When it enters, each opposing army member takes 1 damage. Her priests are physicians: at the start of their turn, she gains 1 life.',
 etb:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})},up:s=>fGain(s,1)});
F('sekhg',{c:5,a:5,h:6,f:'',tag:'sekh',t:'Whenever one of your army members dies, she gets +1/+0 permanently. The red beer: whenever you gain life, she drinks, falls asleep and doesn\'t untap next turn.',
 oppDie:(s,o,c)=>{c.pa++},end:(s,o,c)=>{o.beer=o.life},
 up:(s,o,c)=>{if(o.beer!=null&&o.life>o.beer){fTap(c,1);log('You gained life: Sekhmet drinks the red beer and falls asleep.')}}});
DK('Sekhmet, the Eye of Ra',{d:'sekhg,lion:8,plague:4'});
