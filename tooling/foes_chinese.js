/* ===== Wukong's realm, Journey to the West: every opponent rebuilt around one theme (lore: tooling/lore/chinese.js + the Lore session's briefs) ===== */
/* who attacked recently: the gourd and the vase swallow whoever answered the call */
{const _l=launch;launch=function(s,S,tgm){const r=_l.apply(this,arguments);try{S.forEach(x=>{x.lastAtk=G.turn})}catch(e){}return r}}
const fAnswered=x=>x.lastAtk!=null&&x.lastAtk>=G.turn-1;
/* enemy unblockable flags last one turn */
{const _u=egUp;egUp=function(s,o){try{if(G&&G.e&&s===G.e)cr(s).forEach(c=>{c.ub=0})}catch(e){}return _u.apply(this,arguments)}}

/* ---------- The Spider Cave: silk binds, the insect brood poisons ---------- */
const fSpiders=(s,ex)=>cr(s).filter(x=>x!==ex&&['spd1','spd2','spd3','spdq'].includes(x.id)).length;
F('spd1',{c:1,a:2,h:1,f:'f',tag:'spider',t:'Flying. One of the insect brood: when it dies, your most damaged army member takes 1 poison damage.',die:(s,o)=>{const t=cr(o).filter(x=>x.dmg>0).sort((a,b)=>b.dmg-a.dmg)[0];if(t)t.dmg+=1}});
F('spd2',{c:2,a:3,h:4,f:'w',tag:'spider',t:'Ward. Silk from the navel: when it enters, your strongest army member is bound (tapped, doesn\'t untap next turn).',etb:(s,o)=>{const t=fTop(cr(o));if(t){fTap(t,1);log('Silk binds '+fNm(t)+'.')}}});
F('spd3',{c:3,a:4,h:3,f:'r',tag:'spider',t:'Ruthless. Spins the cave shut: your tapped army members get -1/-0. When it dies, each opposing army member takes 1 damage.',
 oaura:x=>[x.tap?-1:0,0],die:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})}});
F('spdq',{c:4,a:4,h:4,f:'',tag:'spider',t:'When it enters, two Cave Spiderlings join it. The seven sisters: gets +1/+1 for each other spider.',etb:s=>fSum(s,'spd1',2),self:c=>{const n=fSpiders(sideOf(c),c);return[n,n]}});
F('cocn',{c:2,t:'Wrapped in silk: tap target army member. It doesn\'t untap next turn.',
 ai:(s,o)=>{const T=best(cr(o).filter(x=>!x.tap&&!has(x,'w')));return T&&pw(T)>=2?{s:3+pw(T)*.8,t:T}:null},fx:(s,o,t)=>{if(t)fTap(t,1)}});
DK('The Spider Cave',{d:'spd1:5,spd2:3,spd3:2,spdq:2,cocn:2',hint:'Silk binds your strongest army members, and the brood poisons the wounded'});

/* ---------- The Gold and Silver Horn Kings: answer when your name is called, and the gourd takes you ---------- */
F('hsol',{c:1,a:2,h:1,f:'',tag:'horn',t:'When it dies, you take 1 damage.',die:(s,o)=>fHurt(o,1)});
F('hcap',{c:2,a:2,h:3,f:'',tag:'horn',t:'He reports that the monk is coming: when it enters, they draw a card.',etb:s=>draw(s,1)});
F('hsil',{c:3,a:3,h:3,f:'r',tag:'horn',t:'Ruthless. When it enters, he calls your strongest army member by name. If it attacked this turn or last (it answered), the vase swallows it; otherwise it takes 2 damage.',
 etb:(s,o)=>{const t=fTop(fTg(o));if(!t)return;if(fAnswered(t)){fDestroy(t);log(fNm(t)+' answered its name: the vase swallows it.')}else{t.dmg+=2;log('The Silver Horn King calls '+fNm(t)+', who does not answer.')}}});
F('hgol',{c:4,a:4,h:5,f:'',tag:'horn',t:'Call his name: the first of your army members to attack each turn answers and takes 2 damage. When it dies, you take 3 damage.',
 dfd:(s,o,c,S)=>{if(s.gcall===G.turn)return;s.gcall=G.turn;const t=S[0];if(t){t.dmg+=2;log(fNm(t)+' answers the Gold Horn King: 2 damage.')}},die:(s,o)=>fHurt(o,3)});
F('hrope',{c:2,t:'The golden rope binds: target army member gets -2/-2.',ai:(s,o)=>fAiKill(o,2,2.5),fx:(s,o,t)=>{if(t){t.pa-=2;t.pd-=2}}});
F('hbot',{c:3,t:'The jade-purity vase: swallow target army member that attacked this turn or last (it answered its name). Otherwise it takes 3 damage.',
 ai:(s,o)=>{const k=fTop(fTg(o).filter(fAnswered));if(k&&ev(k)>=3)return{s:3+ev(k)*.9,t:k};return fAiKill(o,3,3)},fx:(s,o,t)=>{if(!t)return;if(fAnswered(t)){fDestroy(t);log(fNm(t)+' is drawn into the vase.')}else t.dmg+=3}});
DK('The Gold and Silver Horn Kings',{d:'hsol:5,hcap:3,hsil:3,hgol,hrope:2,hbot:2',hint:'Their gourd and vase swallow whatever answered the call by attacking'});

/* ---------- The Heavenly Host: a hundred thousand soldiers under commanders and decrees ---------- */
F('hsd',{c:1,a:2,h:2,f:'',tag:'host',t:'One of a hundred thousand: when it dies, another Heavenly Soldier is shuffled into their deck.',die:s=>fShuffle(s,'hsd',1)});
F('hhd',{c:2,a:3,h:3,f:'q',tag:'host',t:'Opportunist. Heaven\'s war-dog: when it enters, your army member with the least health takes 1 damage.',etb:(s,o)=>{const t=cr(o).slice().sort((a,b)=>fHp(a)-fHp(b))[0];if(t)t.dmg+=1}});
F('hgn',{c:3,a:4,h:4,f:'w',tag:'host',t:'Ward. Commander of the host: their Heavenly Soldiers get +1/+1.',aura:x=>x.id=='hsd'?[1,1]:[0,0]});
F('hnz',{c:3,a:3,h:3,f:'h',tag:'host',t:'Charge. Three heads and six arms: when it attacks, each of your untapped army members takes 1 damage.',atk:(s,o)=>{cr(o).filter(x=>!x.tap).forEach(x=>{x.dmg+=1})}});
F('hpg',{c:4,a:3,h:6,f:'z',tag:'host',t:'Resilient. The pagoda traps demons: when it enters, your strongest army member is trapped (tapped, doesn\'t untap next turn). Nezha gets +2/+0 while he keeps him in line.',
 etb:(s,o)=>{const t=fTop(cr(o));if(t){fTap(t,1);log('The golden pagoda traps '+fNm(t)+'.')}},aura:x=>x.id=='hnz'?[2,0]:[0,0]});
F('hnet',{c:3,t:'The net of heaven and earth: tap all opposing army members.',
 ai:(s,o)=>{const n=cr(o).filter(x=>!x.tap).length,r=cr(s).filter(canAtk).length;return n>=2&&r>=1?{s:3+n*1.5+r}:null},fx:(s,o)=>{cr(o).forEach(x=>fTap(x))}});
DK('The Heavenly Host',{d:'hsd:5,hhd:3,hgn:2,hnz,hpg:2,hnet',hint:'Endless soldiers, raised by their generals and bound by decree'});

/* ---------- Red Boy: True Samadhi Fire, which water only feeds ---------- */
F('rimp',{c:1,a:2,h:1,f:'h',tag:'red',t:'Charge. One of the five fire-carts: when it dies, you take 1 damage.',die:(s,o)=>fHurt(o,1)});
F('rgrd',{c:2,a:2,h:2,f:'',tag:'red',t:'When it enters, you take 1 damage. Heat is home: it gets +1/+0 for each other fire-cart (Fire-Wheel Imp) they control (at most +2).',etb:(s,o)=>fHurt(o,1),self:c=>[Math.min(2,fCnt(sideOf(c),'rimp')),0]});
F('rspr',{c:2,a:3,h:2,f:'r',tag:'red',t:'Ruthless. When it enters, your army member with the least health takes 1 damage.',etb:(s,o)=>{const t=cr(o).slice().sort((a,b)=>fHp(a)-fHp(b))[0];if(t)t.dmg+=1}});
F('rboy',{c:3,a:4,h:4,f:'h',tag:'red',t:'Charge. When it enters, each opposing army member takes 1 damage. Water feeds the fire: at the start of their turn, if you gained life since their last turn, each of your army members takes 2 damage.',
 etb:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1})},end:(s,o)=>{o.water=o.life},up:(s,o)=>{if(o.water!=null&&o.life>o.water){cr(o).forEach(x=>{x.dmg+=2});log('Water only feeds the True Samadhi Fire.')}}});
F('rflm',{c:2,t:'True Samadhi Fire: deal 3 damage to target army member.',ai:(s,o)=>fAiKill(o,3,2.5),fx:(s,o,t)=>{if(t)t.dmg+=3}});
DK('Red Boy',{d:'rimp:5,rgrd:5,rspr:2,rboy,rflm:2',hint:'Every blocker is scorched, and healing only feeds his fire'});

/* ---------- The White Bone Spirit: killing her disguises costs you; the third blow is final ---------- */
F('bsk',{c:1,a:2,h:2,f:'',tag:'bone',t:'Her bones remember: gets +1/+0 for each Wandering Corpse in their graveyard (at most +2).',self:c=>[Math.min(2,fCnt({bf:sideOf(c).gy},'bghl')),0]});
F('bghl',{c:2,a:2,h:3,f:'',tag:'bone',t:'The young girl with a basket: when it dies, the monk thinks you killed an innocent. You lose 2 life.',die:(s,o)=>fHurt(o,2,'You struck down an innocent girl. ')});
F('bhag',{c:3,a:3,h:4,f:'',tag:'bone',t:'The grieving mother: when it dies, your strongest army member is banished for a turn (tapped, doesn\'t untap next turn).',die:(s,o)=>{const t=fTop(cr(o));if(t){fTap(t,1);log('The monk banishes '+fNm(t)+' for striking an old woman.')}}});
F('bsp',{c:4,a:4,h:5,f:'',tag:'bone',t:'Corpse-shedding: when it dies, it leaves an empty body and returns to their hand. The third time it dies, it is gone for good.',
 die:(s,o,c)=>{c.kills=(c.kills||0)+1;if(c.kills>=3){log('The third blow: the White Bone Spirit is struck down for good.');return}const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0});s.hand.push(c);log('She sheds her corpse and escapes ('+c.kills+' of 3).')}}});
DK('The White Bone Spirit',{d:'bsk:4,bghl:4,bhag:3,bsp,hrope:2',hint:'Every disguise you kill costs you something; she herself must die three times'});

/* ---------- The Yellow Wind Ridge: a blinding wind, and a tiger that sheds its skin ---------- */
F('ybat',{c:1,a:2,h:1,f:'fh',tag:'wind',t:'Flying. Charge. When it enters, you take 1 damage.',etb:(s,o)=>fHurt(o,1)});
F('ytig',{c:2,a:3,h:2,f:'h',tag:'wind',t:'Charge. It sheds its skin: the first time it dies, only the empty skin is struck, and it returns to their hand.',
 die:(s,o,c)=>{if(c.skin)return;const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,skin:1});s.hand.push(c);log('You strike only the Tiger Vanguard\'s empty skin.')}}});
F('ydef',{c:2,a:2,h:3,f:'h',tag:'wind',t:'Charge. Sand in the eyes: when it enters, your strongest army member is blinded: -2/-0 until their next turn.',etb:(s,o)=>{const t=fTop(cr(o));if(t){fHold(t,-Math.min(2,pw(t)),0,s);log('Sand blinds '+fNm(t)+'.')}}});
F('ygen',{c:4,a:4,h:4,f:'fh',tag:'wind',t:'Flying. Charge. When it enters, each opposing army member takes 1 damage and the strongest is tapped. Its wind blinds you: your spells cost 1 more while it lives.',
 etb:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1});const t=fTop(cr(o));if(t)fTap(t)},tax:c=>'SI'.includes(D[c.id][2])?1:0});
F('ygale',{c:2,t:'The Samadhi wind blows blind: 3 damage to a random opposing army member, then 1 damage to another.',
 ai:(s,o)=>cr(o).length?{s:3+cr(o).length}:null,fx:(s,o)=>{const L=cr(o).slice();const a=fRnd(L);if(a){a.dmg+=3;const b=fRnd(L.filter(x=>x!==a));if(b)b.dmg+=1}}});
DK('The Yellow Wind Ridge',{d:'ybat:4,ytig:4,ydef:3,ygen,ygale:2',hint:'Everything strikes the moment it lands, and the wind blinds your army'});

/* ---------- Erlang Shen: he matches every change, with his hound and his sworn brothers ---------- */
F('eplum',{c:2,a:2,h:3,f:'',tag:'erl',t:'The sworn brothers of Plum Mountain: gets +1/+1 for each other Plum Mountain Brother (at most +2).',self:c=>{const n=Math.min(2,fCnt(sideOf(c),'eplum')-1);return[n,n]}});
F('ehnd',{c:2,a:3,h:3,f:'q',tag:'erl',t:'Opportunist. It bites the leg: when it enters, your strongest army member is tapped and doesn\'t untap next turn.',etb:(s,o)=>{const t=fTop(cr(o));if(t){fTap(t,1);log('The Howling Celestial Hound bites '+fNm(t)+'.')}}});
F('eerl',{c:4,a:4,h:5,f:'z',tag:'erl',t:'Resilient. Change for change: whenever you play an army member, Erlang gets +1/+1 permanently.',oppEnter:(s,o,c)=>{c.pa++;c.pd++}});
F('esw',{c:3,t:'The three-pointed blade: deal 4 damage to target army member.',ai:(s,o)=>fAiKill(o,4,3),fx:(s,o,t)=>{if(t)t.dmg+=4}});
DK('Erlang Shen, the Three-Eyed',{d:'eplum:5,ehnd:4,eerl:2,esw:2,hnet',hint:'He grows with every army member you play, and his third eye taxes your tricks'});

/* ---------- Princess Iron Fan: the fan blows your army away ---------- */
F('iwnd',{c:1,a:2,h:1,f:'f',tag:'fan',t:'Flying. A breath of the fan: when it dies, your newest army member is blown back to your hand.',die:(s,o)=>{const t=fNewest(o);if(t&&!has(t,'w')){bounce(t);log('A gust blows '+fNm(t)+' back to your hand.')}}});
F('imaid',{c:2,a:2,h:3,f:'',tag:'fan',t:'She guards the fan\'s case: while she lives, the fan also blows back army members that cost 2.'});
F('iguard',{c:3,a:3,h:4,f:'p',tag:'fan',t:'Phalanx. His shield is a palm-leaf the size of a door: their other army members get +0/+1.',aura:()=>[0,1]});
F('iprin',{c:4,a:4,h:5,f:'z',tag:'fan',t:'Resilient. Forty-nine waves of the fan: when it enters, all your army members that cost 3 or more are blown back to your hand.',
 etb:(s,o)=>{const L=cr(o).filter(x=>D[x.id][1]>=3&&!has(x,'w'));L.forEach(x=>bounce(x));if(L.length)log('Princess Iron Fan waves the fan forty-nine times.')}});
{const _u=egUp;egUp=function(s,o){_u(s,o);try{if(s===G.e&&s.bf.some(x=>x.id=='ifan')&&s.bf.some(x=>x.id=='imaid')){const t=cr(o).filter(x=>D[x.id][1]==2&&!has(x,'w')).sort((a,b)=>ev(b)-ev(a))[0];if(t){bounce(t);log('The fan blows '+fNm(t)+' back to your hand too.')}}}catch(e){}}}
DK('Princess Iron Fan',{d:'iwnd:6,imaid:4,iguard:3,iprin',hint:'Her fan blows your army back to your hand; win with cheap army members and spells'});

/* ---------- The Six-Eared Macaque: a perfect copy ---------- */
F('mmon',{c:1,a:1,h:2,f:'',tag:'mac',t:'A shadow with no shadow: when it enters, it becomes a copy of your newest army member\'s power and health.',
 etb:(s,o,c)=>{const t=fNewest(o);if(t){c.a=pw(t);c.d=Math.max(1,th(t)-(t.def?2:0));log('A Shadow Monkey copies '+fNm(t)+'.')}}});
F('mape',{c:2,a:3,h:2,f:'q',tag:'mac',t:'Opportunist. It copies even your doubt: whenever you cast a spell, it gets +1/+1 permanently.',oppCast:(s,o,c)=>{c.pa++;c.pd++}});
F('mear',{c:3,a:2,h:5,f:'',tag:'mac',t:'It hears everything a thousand li away: when it enters, they draw a card, and your costliest card in hand costs 1 more.',
 etb:(s,o)=>{draw(s,1);const x=o.hand.slice().sort((a,b)=>cost(b)-cost(a))[0];if(x){x.disc=(x.disc||0)-1;log('The Listening Ear hears your plans: '+fNm(x)+' costs 1 more.')}}});
F('mac6',{c:4,a:5,h:5,f:'z',tag:'mac',t:'Resilient. The false Sage: at the start of their turn, it gains every keyword your army members have.',
 up:(s,o,c)=>{const ks=new Set();cr(o).forEach(x=>x.f.split('').forEach(k=>{if('fwhrvdbsxyq'.includes(k))ks.add(k)}));ks.forEach(k=>fKey(c,k))}});
F('mecho',{c:2,t:'The staff strikes, and its echo strikes back: deal 3 damage to target army member and 1 to you.',ai:(s,o)=>fAiKill(o,3,2.5),fx:(s,o,t)=>{if(t)t.dmg+=3;fHurt(o,1)}});
DK('The Six-Eared Macaque',{d:'mmon:5,mape:4,mear:2,mac6,mecho:2'});

/* ---------- The Bull Demon King: fury, size and kin ---------- */
F('bgrd',{c:2,a:2,h:4,f:'',tag:'bull',t:'Temper like dry grass: after it blocks, it gets +1/+0 permanently.',blk:(s,o,c)=>{c.pa++}});
F('bcap',{c:3,a:4,h:4,f:'rb',tag:'bull',t:'Ruthless. Bulldoze. Broad as a cart and as easy to steer.'});
F('bhrn',{c:4,a:5,h:4,f:'hn',tag:'bull',t:'Charge. Can only attack: horned demons charge in front, and that is all they know.'});
F('bdk',{c:5,a:6,h:7,f:'z',tag:'bull',t:'Resilient. His captains and kin: their other army members get +1/+1. It took all of Heaven to bring him down: he takes 1 less damage from each army member that blocks him.',aura:()=>[1,1],dmgIn:(t,n,src)=>{const s=sideOf(t);return s&&src&&sideOf(src)!==s&&G.cmb&&G.cmb.side!==(s===G.p?'p':'e')?-Math.min(1,n):0}});
DK('The Bull Demon King',{d:'bgrd:5,bcap:5,bhrn:3,bdk,rflm:2'});

/* ---------- The Buddha's Palm: it contains; it never strikes ---------- */
F('pdis',{c:1,a:1,h:3,f:'',tag:'palm',t:'He sat so still he became the mountain: at the start of their turn, it gets +0/+1 permanently (at most +3).',up:(s,o,c)=>{if((c.grow||0)<3){c.grow=(c.grow||0)+1;c.pd++}}});
F('pfin',{c:2,a:2,h:5,f:'kp',tag:'palm',t:'Can only defend. Phalanx. A pillar at the end of the world: after it blocks an army member, that army member is sealed (doesn\'t untap next turn).',
 blk:(s,o,c)=>{const cm=G.cmbLast;if(!cm)return;for(const[a,b]of Object.entries(cm.blk||{}))if(b==c.u){const A=o.bf.find(x=>x.u==a);if(A)fTap(A,1)}}});
F('pgrd',{c:3,a:3,h:6,f:'',tag:'palm',t:'It hears him thinking: at the start of their turn, your strongest army member is sealed (tapped, doesn\'t untap next turn).',up:(s,o)=>{const t=fTop(cr(o).filter(x=>!x.frz));if(t){fTap(t,1);log('The Mountain Warden seals '+fNm(t)+'.')}}});
F('plm',{c:5,a:5,h:9,f:'kz',tag:'palm',t:'Can only defend. Resilient. Every step outward is still inside the hand: at the start of their turn, if all your army members are tapped, the mountain presses down and you take 3 damage.',
 up:(s,o)=>{const L=cr(o);if(!L.length||L.every(x=>x.tap))fHurt(o,3,'The Five Elements Mountain presses down. ')}});
DK("The Buddha's Palm",{d:'pdis:5,pfin:5,pgrd:2,plm'});
