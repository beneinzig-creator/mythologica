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
DK('The Tomb Robbers',{d:'grob:5,tdig:3,fence:2,mthief,torch:3',hint:'Cowards in numbers: they steal when they outnumber you and sell what they take'});

/* ---------- The Scorpions of Serket: THE VENOM POOL. Six escorts give their venom to Tefen, who stings ---------- */
const fPool=(s,n,why)=>{s.venom=(s.venom||0)+n;if(why)log(why+' Venom: '+Math.min(5,s.venom)+' of 5.');if(s.venom>=5){s.venom=0;const o=oppOf(s);const t=fTop(cr(o));if(t){fDestroy(t);log('Tefen stings with the pooled venom: '+fNm(t)+' dies.')}fHurt(o,3,'The pooled venom burns you too. ');cr(s).filter(x=>x.id=='squeen').forEach(()=>{cr(o).forEach(x=>heal(x,1))})}};
const fScor=['sbrood','sstalk','squeen','sking'];
F('serk',{t:'Ward. The venom pool: whenever one of their scorpions dies or deals combat damage to you, the pool fills by 1. At 5, Tefen stings with the pooled venom: your strongest army member dies, you lose 3 life, and the pool empties.',
 allyDie:(s,o,c,x)=>{if(fScor.includes(x.id))fPool(s,x.id=='sbrood'?2:1,'A scorpion\'s venom pools.')}});
F('sbrood',{c:1,a:1,h:2,f:'h',tag:'scor',t:'Charge. One of the seven escorts: when it dies, it gives its venom to the pool twice over (+2). When it deals combat damage to you, +1.',hit:s=>fPool(s,1,'A sting.')});
F('sstalk',{c:2,a:3,h:2,f:'',tag:'scor',t:'It waits under the sand: after it blocks, the pool fills by 1.',blk:s=>fPool(s,1,'The Sand Stalker strikes from under the sand.'),hit:s=>fPool(s,1,'A sting.')});
F('squeen',{c:3,a:3,h:3,f:'',tag:'scor',t:'Serket heals stings as well as causing them: at the start of their turn, restore 2 health to each of their army members. When Tefen stings, Isis\'s mercy: your army members heal 1.',up:s=>cr(s).forEach(x=>heal(x,2))});
F('sking',{c:4,a:4,h:4,f:'',tag:'scor',t:'The first king, named for the scorpion: gets +1/+1 for every 2 venom in the pool (at most +3/+3).',self:c=>{const n=Math.min(3,Math.floor((sideOf(c).venom||0)/2));return[n,n]},hit:s=>fPool(s,1,'A sting.')});
F('sting',{c:2,t:'Spend 3 venom from the pool: destroy target army member. With less venom, it only deals 2 damage.',
 ai:(s,o)=>{if((s.venom||0)>=3){const T=fTop(fTg(o));return T&&ev(T)>=4?{s:2+ev(T)*.8,t:T}:null}return fAiKill(o,2,2.5)},fx:(s,o,t)=>{if(!t)return;if((s.venom||0)>=3){s.venom-=3;fDestroy(t)}else t.dmg+=2}});
DK('The Scorpions of Serket',{d:'sbrood:6,sstalk:3,squeen:2,sking,sting:2',hint:'Every scorpion that dies or stings fills the venom pool; at five, Tefen stings your strongest army member'});

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

/* ---------- The Crocodiles of Sobek: THE RIVER. Your army members are dragged under and held; Sobek gives back what the water took ---------- */
const fRiver=s=>(s.river||[]).length;
function fDrag(s,o,x,why){if(!x||!o.bf.includes(x))return;o.bf.splice(o.bf.indexOf(x),1);Object.assign(x,{dmg:0,tap:0,def:0,att:0,sw:0,ta:0,td:0,vn:0,rs:0,forced:0});(s.river=s.river||[]).push(x);try{amFall()}catch(e){}log((why||'')+fNm(x)+' is dragged into the river ('+fRiver(s)+' held).')}
F('sobk',{t:'Ward. The river: your army members dragged under are held in the river, not killed. When Sobek dies, he gives back what the water took: they return to your hand.'});
F('croc',{c:2,a:3,h:3,f:'',tag:'croc',t:'It lies on the bank like a log: +1/+0 (+2/+0 in defense form), and +1/+1 for each army member held in the river (at most +2/+2).',self:c=>{const n=Math.min(2,fRiver(sideOf(c)));return[(c.def?2:1)+n,n]}});
F('lurk',{c:2,a:3,h:2,f:'',tag:'croc',t:'The death roll: when it blocks an army member that has 3 or less health left, it drags it into the river before it can strike.'});
F('sobpr',{c:3,a:3,h:4,f:'',tag:'croc',t:'The priests hang the sacred crocodiles with gold: their army members get +1/+0 for each army member held in the river (at most +3).',aura:(x,c)=>[Math.min(3,fRiver(sideOf(c))),0],self:c=>[Math.min(3,fRiver(sideOf(c))),0]});
F('sobek',{c:5,a:5,h:6,f:'',tag:'croc',t:'When it blocks an army member, it drags it into the river before it can strike. Gets +1/+1 for each army member held in the river. When it dies, the river gives them all back to your hand.',
 self:c=>{const n=fRiver(sideOf(c));return[n,n]},
 die:(s,o)=>{const L=s.river||[];s.river=[];L.forEach(x=>o.hand.push(x));if(L.length)log('Sobek gives back what the water took: '+L.length+' army member'+(L.length==1?'':'s')+' return to your hand.')}});
F('drag',{c:2,t:'Drag below: a damaged army member of yours is dragged into the river.',ai:(s,o)=>{const T=fTop(fTg(o).filter(x=>x.dmg>0));return T&&ev(T)>=3?{s:2+ev(T)*.8,t:T}:null},fx:(s,o,t)=>{if(t)fDrag(s,o,t)}});
/* the death roll happens as they block: the attacker is gone before it strikes */
{const _a=aiBlock;aiBlock=function(at){const r=_a.apply(this,arguments);try{const c=G.cmb,e=G.e,p=G.p;if(c&&c.side=='p'&&e)for(const[u,b]of Object.entries(c.blk||{})){const B=e.bf.find(x=>x.u==b),A=p.bf.find(x=>x.u==u);if(!B||!A)continue;if(B.id=='sobek'||(B.id=='lurk'&&fHp(A)<=3)){c.atk=c.atk.filter(x=>x!=u);delete c.blk[u];fDrag(e,p,A,B.id=='sobek'?'Sobek: ':'The Nile Lurker rolls: ')}}}catch(e2){}return r}}
DK('The Crocodiles of Sobek',{d:'croc:5,lurk:3,sobpr:3,sobek,drag:2',hint:'They drag your army into the river and grow fat on it; kill Sobek and the river gives everything back'});

/* ---------- The Jackals of Anubis: CLAIMING THE DEAD. Your dead go to them and are led into the Hall ---------- */
const fSouls=s=>s.gy.filter(x=>x.claim).length+(s.hall||0);
F('anub',{t:'Ward. Guides of the dead: when one of your army members dies, Anubis claims it. It goes to their graveyard, not yours.',
 oppDie:(s,o,c,x)=>{const i=o.gy.indexOf(x);if(i<0)return;o.gy.splice(i,1);x.claim=1;s.gy.push(x);log('Anubis claims the soul of '+fNm(x)+'.');cr(s).filter(y=>y.id=='jguard').forEach(y=>{y.pa++;y.pd++;fGain(s,1)})}});
F('jack',{c:1,a:3,h:2,f:'h',tag:'jack',t:'Charge. The cemetery jackal: +1/+0 for each soul they hold (claimed dead, in their graveyard or the Hall; at most +3).',self:c=>[Math.min(3,fSouls(sideOf(c))),0]});
F('jguard',{c:2,a:2,h:3,f:'',tag:'jack',t:'Guardian of the necropolis: whenever Anubis claims one of your dead, it gets +1/+1 permanently and they gain 1 life.'});
F('wepw',{c:3,a:4,h:3,f:'r',tag:'jack',t:'Ruthless. Opener of the ways: when it attacks, the other attackers can\'t be blocked this turn.',atk:(s,o,c)=>{cr(s).filter(x=>x.att&&x!==c).forEach(x=>{x.ub=1})}});
F('jpack',{c:4,a:4,h:4,f:'',tag:'jack',t:'When it enters, and at the start of their turn, it leads one claimed soul into the Hall for good, and their Jackals get +1/+1 permanently.',
 etb:(s,o,c)=>FOE.jpack.lead(s),up:s=>FOE.jpack.lead(s),
 lead:s=>{const x=s.gy.find(y=>y.claim);if(!x)return;s.gy.splice(s.gy.indexOf(x),1);s.hall=(s.hall||0)+1;cr(s).filter(y=>FOE[y.id]&&FOE[y.id].tag=='jack').forEach(y=>{y.pa++;y.pd++});log('The Packleader leads the soul of '+fNm(x)+' into the Hall.')}});
DK('The Jackals of Anubis',{d:'jack:6,jguard:5,wepw:2,jpack',hint:'Your dead are claimed by Anubis and led into the Hall; every soul they hold makes the pack stronger'});

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
DK('Set, Lord of the Red Desert',{d:'setg,setb:5,setst:4,sand:3'});

/* ---------- Sekhmet: the Eye of Ra's rage, which burns her too; red beer calms her ---------- */
F('lion',{c:2,a:2,h:3,f:'r',tag:'sekh',t:'Ruthless. The pride hunts together: gets +1/+0 for each other Lioness (at most +2).',self:c=>[Math.min(2,fCnt(sideOf(c),'lion')-1),0]});
F('plague',{c:3,a:3,h:3,f:'',tag:'sekh',t:'When it enters, each opposing army member takes 1 damage. Her priests are physicians: at the start of their turn, she gains 1 life.',
 etb:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})},up:s=>fGain(s,1)});
F('sekhg',{c:5,a:5,h:6,f:'',tag:'sekh',t:'Whenever one of your army members dies, she gets +1/+0 permanently. The red beer: whenever you gain life, she drinks, falls asleep and doesn\'t untap next turn.',
 oppDie:(s,o,c)=>{c.pa++},end:(s,o,c)=>{o.beer=o.life},
 up:(s,o,c)=>{if(o.beer!=null&&o.life>o.beer){fTap(c,1);log('You gained life: Sekhmet drinks the red beer and falls asleep.')}}});
DK('Sekhmet, the Eye of Ra',{d:'sekhg,lion:8,plague:4'});
