/* ===== Wukong's realm, Journey to the West: eleven opponents, eleven different rules (lore: tooling/lore/chinese.js + the Lore session's briefs) =====
   Spider Cave: silk · Horn Kings: the name call · Heavenly Host: chain of command · Red Boy: healing reversed + fire-carts ·
   White Bone Spirit: guilt · Yellow Wind: blindness · Erlang: the predator answer · Iron Fan: blown away by weight ·
   Six-Eared Macaque: the stolen luggage · Bull Demon King: rage from being hit · Buddha's Palm: tightening limits */
{const _l=launch;launch=function(s,S,tgm){const r=_l.apply(this,arguments);try{S.forEach(x=>{x.lastAtk=G.turn})}catch(e){}return r}}
/* enemy "can't be blocked" lasts one turn */
{const _u=egUp;egUp=function(s,o){try{if(G&&G.e&&s===G.e)cr(s).forEach(c=>{c.ub=0})}catch(e){}return _u.apply(this,arguments)}}
/* temporary "can't attack" (k) / "can't block" (n) flags that remember they were added */
const fFlagOn=(c,k,tag)=>{if(!c.f.includes(k)){c.f+=k;c[tag]=(c[tag]||'')+k}};
const fFlagOff=(c,tag)=>{if(c[tag]){for(const k of c[tag])c.f=c.f.replace(k,'');c[tag]=''}};

/* ---------- The Spider Cave: SILK. Silk piles up on your army; three silk is a cocoon, and the Matron eats what is cocooned ---------- */
const fSilk=(c,n)=>{if(!c)return;c.silk=Math.max(0,(c.silk||0)+n);if(c.silk>=3){fFlagOn(c,'k','coc');fFlagOn(c,'n','coc')}else fFlagOff(c,'coc')};
const fCocooned=o=>cr(o).filter(x=>(x.silk||0)>=3);
F('cweb',{t:'Ward. Silk: each silk on one of your army members gives it -1/-0; at 3 silk it is cocooned and can\'t attack or block. Whenever one of your army members attacks, it gets 1 silk. An army member that sits out a whole turn sheds 1 silk.',
 oaura:x=>[-Math.min(3,x.silk||0),0],dfd:(s,o,c,S)=>{S.forEach(x=>fSilk(x,1))},
 oup:(s,o)=>{cr(o).forEach(x=>{if(x.silk&&x.lastAtk!==G.turn-1){fSilk(x,-1)}})}});
F('spd1',{c:1,a:2,h:1,f:'f',tag:'spider',t:'Flying. One of the brood: when it enters, it spins 1 silk onto your strongest army member.',etb:(s,o)=>{const t=fTop(cr(o));if(t){fSilk(t,1);log('A Spiderling spins silk onto '+fNm(t)+'.')}}});
F('spd2',{c:2,a:3,h:4,f:'w',tag:'spider',t:'Ward. Silk from the navel: at the start of their turn, it spins 2 silk onto your army member with the most power.',up:(s,o)=>{const t=cr(o).filter(x=>(x.silk||0)<3).sort((a,b)=>pw(b)-pw(a))[0];if(t){fSilk(t,2);log('Silk pours over '+fNm(t)+'.')}}});
F('spd3',{c:3,a:4,h:3,f:'r',tag:'spider',t:'Ruthless. Spins the cave shut: their army members get +1/+0 for each of your cocooned army members (at most +2).',aura:(x,c)=>[Math.min(2,fCocooned(oppOf(sideOf(c))).length),0],self:c=>[Math.min(2,fCocooned(oppOf(sideOf(c))).length),0]});
F('spdq',{c:4,a:4,h:4,f:'',tag:'spider',t:'The eldest sister: at the start of their turn she eats one of your cocooned army members and gets +2/+2. They meant to steam the monk and eat him.',
 up:(s,o,c)=>{const t=fTop(fCocooned(o));if(t){fDestroy(t);c.pa+=2;c.pd+=2;log('The Spider-Spirit Matron feeds on '+fNm(t)+'.')}}});
F('cocn',{c:2,t:'Wrapped in silk: target army member gets 3 silk (cocooned).',ai:(s,o)=>{const T=fTop(cr(o).filter(x=>(x.silk||0)<3&&!has(x,'w')));return T?{s:3+ev(T)*.7,t:T}:null},fx:(s,o,t)=>{if(t)fSilk(t,3)}});
DK('The Spider Cave',{d:'spd1:5,spd2:3,spd3:2,spdq:2,cocn:2',hint:'Silk piles up on your army; three silk is a cocoon, and the Matron eats what is cocooned'});

/* ---------- The Gold and Silver Horn Kings: THE NAME CALL. The gourd calls one of your army members; if it answers (attacks or blocks), it is swallowed ---------- */
const fCalled=o=>cr(o).filter(x=>x.callT>=G.turn);
function fCall(s,o,n,why){for(let i=0;i<n;i++){const L=cr(o).filter(x=>!(x.callT>=G.turn)&&!has(x,'w'));const t=fTop(L);if(!t)return;t.callT=G.turn+1;log((why||'The gourd calls the name of ')+fNm(t)+'. If it answers (attacks or blocks), it is swallowed.')}}
function fSwallow(s,o,x){if(!o.bf.includes(x))return;o.bf.splice(o.bf.indexOf(x),1);log(fNm(x)+' answered its name: the gourd swallows it.');s.swal=(s.swal||0)+1;
 cr(s).filter(y=>y.id=='hsol').forEach(y=>{y.pa++;y.pd++});if(s.bf.some(y=>y.id=='hgol'))fHurt(o,Math.max(1,D[x.id][1]),'The Gold Horn King laughs. ');try{amFall()}catch(e){}}
F('gourd',{t:'Ward. The name call: at the start of their turn, the gourd calls one of your army members by name. If it attacks or blocks before their next turn, it answers and is swallowed (gone for good).',
 up:(s,o)=>fCall(s,o,1+Math.min(2,fCnt(s,'hcap'))),
 dfd:(s,o,c,S)=>{S.filter(x=>x.callT>=G.turn).forEach(x=>{x.ans=1})},
 post:(s,o)=>{cr(o).filter(x=>x.ans||(x.callT>=G.turn&&x.blkd===G.turn)).forEach(x=>fSwallow(s,o,x))}});
F('hsol',{c:1,a:2,h:1,f:'',tag:'horn',t:'A demon of the Lotus Cave: whenever the gourd swallows one of your army members, it gets +1/+1 permanently.'});
F('hcap',{c:2,a:2,h:3,f:'',tag:'horn',t:'He carries the gourd: while it lives, the gourd calls one more name each turn. Kill a carrier and you trick him out of the gourd: their Gourd of Names is destroyed.',
 die:s=>{const g=s.bf.find(x=>x.id=='gourd');if(g){s.bf.splice(s.bf.indexOf(g),1);log('You trick the carriers: the gourd is yours, and it will call no more names.')}}});
F('hsil',{c:3,a:3,h:3,f:'r',tag:'horn',t:'Ruthless. When it enters, he calls one more of your army members by name.',etb:(s,o)=>fCall(s,o,1,'The Silver Horn King calls ')});
F('hgol',{c:4,a:4,h:5,f:'',tag:'horn',t:'Whenever the gourd swallows one of your army members, you take damage equal to its cost.'});
F('hrope',{c:2,t:'The golden rope binds the called: every called army member of yours gets -2/-0 until their next turn, and the gourd calls one more name.',ai:(s,o)=>{const n=fCalled(o).length;return n||cr(o).length?{s:2.5+n}:null},fx:(s,o)=>{fCalled(o).forEach(x=>fHold(x,-Math.min(2,pw(x)),0,s));fCall(s,o,1)}});
F('hbot',{c:3,t:'The jade-purity vase: call target army member of yours by name. If it was already called, the vase swallows it now.',
 ai:(s,o)=>{const k=fTop(fCalled(o).filter(x=>!has(x,'w')));if(k)return{s:3+ev(k)*.9,t:k};const t=fTop(fTg(o).filter(x=>!(x.callT>=G.turn)));return t?{s:2,t}:null},fx:(s,o,t)=>{if(!t)return;if(t.callT>=G.turn)fSwallow(s,o,t);else t.callT=G.turn+1}});
/* blockers answer too */
{const _r=resolve;resolve=function(){try{const c=G.cmb;if(c&&c.side=='e')for(const u of Object.values(c.blk||{})){const b=G.p.bf.find(x=>x.u==u);if(b)b.blkd=G.turn}}catch(e){}return _r.apply(this,arguments)}}
DK('The Gold and Silver Horn Kings',{d:'hsol:5,hcap:3,hsil:3,hgol,hrope:2,hbot:2',hint:'The gourd calls your army members by name; whatever answers by fighting is swallowed. Kill a carrier to take the gourd'});

/* ---------- The Heavenly Host: CHAIN OF COMMAND. Ranks, promotion and waves of soldiers ---------- */
const RANK={hsd:1,hhd:2,hgn:3,hnz:4,hpg:5};
function fPromote(s,x){if(!(RANK[x.id]>=2))return;const sol=s.bf.find(y=>y.id=='hsd'&&y!==x);if(!sol)return;const d=D[x.id];sol.id=x.id;sol.a=d[3];sol.d=d[4];sol.f=d[5];sol.dmg=0;
 if(s.bf.some(y=>y.id=='hpg'&&y!==x)){sol.pa+=2;sol.pd+=2}log(s.prom?'A Heavenly Soldier is promoted to '+d[0]+'.':'A Heavenly Soldier is promoted: first to Keeper of Horses, then to '+d[0]+'.');s.prom=1;try{if(FOE[sol.id]&&FOE[sol.id].etb)FOE[sol.id].etb(s,oppOf(s),sol)}catch(e){}}
F('decree',{t:'Ward. The first army member that costs 2 or less you play each turn costs 1 more. Chain of command: when one of their officers dies, a Heavenly Soldier is promoted to take its place.',allyDie:(s,o,c,x)=>fPromote(s,x)});
F('hsd',{c:1,a:2,h:2,f:'',tag:'host',t:'Rank 1, one of a hundred thousand: when an officer falls, a soldier is promoted into its place. When it dies, another soldier is shuffled into their deck.',die:s=>fShuffle(s,'hsd',1)});
F('hhd',{c:2,a:3,h:3,f:'q',tag:'host',t:'Rank 2. Opportunist. Heaven\'s hounds hunt in numbers: +1/+0 for each Heavenly Soldier they control (at most +3).',self:c=>[Math.min(3,fCnt(sideOf(c),'hsd')),0]});
F('hgn',{c:3,a:4,h:4,f:'w',tag:'host',t:'Rank 3. Ward. At the start of their turn, a Heavenly Soldier reports for duty and joins them.',up:s=>{if(fSum(s,'hsd',1))log('A Heavenly Soldier reports for duty.')}});
F('hnz',{c:3,a:3,h:3,f:'h',tag:'host',t:'Rank 4. Charge. Three heads and six arms: when it attacks, it strikes three of your army members for 1 each.',atk:(s,o)=>{cr(o).slice().sort((a,b)=>ev(b)-ev(a)).slice(0,3).forEach(x=>{x.dmg+=1})}});
F('hpg',{c:4,a:3,h:6,f:'z',tag:'host',t:'Rank 5. Resilient. Li Jing, the Pagoda-Bearing King: while he lives, every promoted soldier also gets +2/+2. His pagoda keeps Nezha obedient: their Nezha has Ward.',
 etb:s=>{s.bf.filter(x=>x.id=='hnz').forEach(x=>fKey(x,'w'))},allyEnter:(s,o,c,x)=>{if(x.id=='hnz')fKey(x,'w')}});
F('hnet',{c:3,t:'The net of heaven and earth: tap one of your army members for each Heavenly Soldier they control.',
 ai:(s,o)=>{const n=Math.min(fCnt(s,'hsd'),cr(o).filter(x=>!x.tap).length);return n>=2&&cr(s).some(canAtk)?{s:3+n*1.5}:null},fx:(s,o)=>{cr(o).filter(x=>!x.tap).sort((a,b)=>ev(b)-ev(a)).slice(0,fCnt(s,'hsd')).forEach(x=>fTap(x))}});
DK('The Heavenly Host',{d:'hsd:6,hhd:3,hgn:2,hnz,hpg,hnet',hint:'An army with ranks: kill an officer and a soldier is promoted into its place, while the generals call in more soldiers'});

/* ---------- Red Boy: HEALING REVERSED and the five FIRE-CARTS ---------- */
const fCarts=s=>fCnt(s,'rimp');
F('sfire',{t:'Ward. True Samadhi Fire, which water only feeds: at the start of their turn, you take twice the life you gained since their last turn. Army members that block their army members take 1 damage first.',
 end:(s,o)=>{o.water=o.life},up:(s,o)=>{if(o.water!=null&&o.life>o.water){fHurt(o,2*(o.life-o.water),'Water only feeds the True Samadhi Fire. ')}}});
F('rimp',{c:1,a:2,h:1,f:'h',tag:'red',t:'Charge. One of the five fire-carts: each cart makes Red Boy\'s breath and the Fire-Cloud Blast burn 1 hotter.'});
F('rgrd',{c:2,a:2,h:3,f:'',tag:'red',t:'He pushes the carts into place: whenever a fire-cart dies, a new Fire-Wheel Imp is shuffled into their deck.',allyDie:(s,o,c,x)=>{if(x.id=='rimp')fShuffle(s,'rimp',1)}});
F('rspr',{c:2,a:3,h:2,f:'r',tag:'red',t:'Ruthless. The fire-tipped spear: an army member it deals combat damage to keeps burning, taking 1 damage at the start of each of your turns.',dmgOut:(c,n,t)=>{if(t&&n>0&&sideOf(t)!==sideOf(c))t.burn=1;return 0}});
F('rboy',{c:3,a:4,h:4,f:'h',tag:'red',t:'Charge. The helpless child: Ward on the turn he arrives. At the start of their turn he breathes True Samadhi Fire: your strongest army member takes 1 damage plus 1 for each fire-cart.',
 etb:(s,o,c)=>{fKey(c,'w');c.wkid=1},up:(s,o,c)=>{if(c.wkid){c.f=c.f.replace('w','');c.wkid=0}const t=fTop(cr(o));if(t){t.dmg+=1+fCarts(s);log('Red Boy breathes fire on '+fNm(t)+'.')}}});
F('rflm',{c:2,t:'Fire from the five carts: deal 2 damage plus 1 for each fire-cart to target army member.',ai:(s,o)=>fAiKill(o,2+fCarts(s),2.5),fx:(s,o,t)=>{if(t)t.dmg+=2+fCarts(s)}});
{const _u=egUp;egUp=function(s,o){_u(s,o);try{if(G&&G.e&&s===G.p){const L=cr(s).filter(x=>x.burn);L.forEach(x=>{x.dmg+=1});if(L.length)log('The spear-fire still burns.')}}catch(e){}}}
DK('Red Boy',{d:'rimp:5,rgrd:4,rspr:3,rboy,rflm:2',hint:'Healing feeds his fire, and every fire-cart makes his breath hotter'});

/* ---------- The White Bone Spirit: GUILT. Killing her disguises shames you; three guilt and the monk punishes you ---------- */
function fGuilt(o,n,why){o.guilt=(o.guilt||0)+n;log(why+' Guilt: '+Math.min(3,o.guilt)+' of 3.');if(o.guilt>=3){o.guilt=0;const t=fTop(cr(o));if(t){o.bf.splice(o.bf.indexOf(t),1);Object.assign(t,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0});o.deck.splice(Math.random()*(o.deck.length+1)|0,0,t);try{amFall()}catch(e){}log('The monk recites the tight-fillet spell: '+fNm(t)+' is banished into your deck.')}}}
F('bone',{t:'Ward. Her disguises fool the monk: killing one gives you guilt. At 3 guilt, the monk recites the tight-fillet spell: your strongest army member is banished into your deck, and your guilt clears.'});
F('bsk',{c:1,a:2,h:2,f:'',tag:'bone',t:'Her third disguise, the old father: killing it gives you 1 guilt, and she sheds a new disguise (a Wandering Corpse is shuffled into their deck).',die:(s,o)=>{fShuffle(s,'bghl',1);fGuilt(o,1,'You struck down an old man.')}});
F('bghl',{c:2,a:2,h:3,f:'',tag:'bone',t:'Disguise, the young girl with a basket of food: killing it gives you 1 guilt.',die:(s,o)=>fGuilt(o,1,'You struck down a young girl.')});
F('bhag',{c:3,a:3,h:4,f:'',tag:'bone',t:'Disguise, the grieving mother: killing it gives you 2 guilt.',die:(s,o)=>fGuilt(o,2,'You struck down an old woman.')});
F('bsp',{c:4,a:4,h:5,f:'',tag:'bone',t:'The true spirit: twice she sheds her corpse, returns to their hand and leaves a Wandering Corpse in her place. The third death is final.',
 die:(s,o,c)=>{c.kills=(c.kills||0)+1;if(c.kills>=3){log('The third blow: the White Bone Spirit is struck down for good.');return}const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0});s.hand.push(c);fSum(s,'bghl',1);log('She sheds her corpse and escapes ('+c.kills+' of 3).')}}});
DK('The White Bone Spirit',{d:'bsk:4,bghl:5,bhag:4,bsp',hint:'Killing her disguises fills you with guilt; at three guilt the monk banishes your strongest. She herself must die three times'});

/* ---------- The Yellow Wind Ridge: BLINDNESS. The wind blinds your army until the monster that blows it dies ---------- */
const fBlind=c=>{if(!c||c.blind)return;c.blind=1;fFlagOn(c,'n','bln')};
const fCure=o=>{cr(o).forEach(x=>{if(x.blind){x.blind=0;fFlagOff(x,'bln')}})};
F('ywind',{t:'Ward. All their army members have Charge. At the start of their turn, the Samadhi wind blinds one of your army members: blinded army members can\'t block until the wind is fixed.',up:(s,o)=>{const t=fTop(cr(o).filter(x=>!x.blind));if(t){fBlind(t);log('The yellow wind blinds '+fNm(t)+'.')}}});
F('ybat',{c:1,a:2,h:1,f:'fh',tag:'wind',t:'Flying. Charge. It rides the wind: when it attacks, one more of your army members is blinded.',atk:(s,o)=>{const t=fTop(cr(o).filter(x=>!x.blind));if(t)fBlind(t)}});
F('ytig',{c:2,a:3,h:2,f:'h',tag:'wind',t:'Charge. It sheds its skin: the first time it dies, you have only struck the empty skin, and it returns to their hand.',
 die:(s,o,c)=>{if(c.skin)return;const i=s.gy.indexOf(c);if(i>=0){s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,skin:1});s.hand.push(c);log('You strike only the Tiger Vanguard\'s empty skin.')}}});
F('ydef',{c:2,a:2,h:3,f:'h',tag:'wind',t:'Charge. Sand in the eyes: your blinded army members get -1/-0.',oaura:x=>[x.blind?-1:0,0]});
F('ygen',{c:4,a:4,h:4,f:'fh',tag:'wind',t:'Flying. Charge. When it enters, it blows the Samadhi wind: all your army members are blinded. When it dies, the wind is fixed and all your army members are cured.',
 etb:(s,o)=>{cr(o).forEach(fBlind);log('The Yellow Wind Monster blows: your whole army is blinded.')},die:(s,o)=>{fCure(o);log('The wind is fixed: your army can see again.')}});
F('ygale',{c:2,t:'The wind drives sand into the eyes: each of your blinded army members takes 2 damage.',ai:(s,o)=>{const n=cr(o).filter(x=>x.blind).length;return n>=1?{s:2+n*2}:null},fx:(s,o)=>{cr(o).filter(x=>x.blind).forEach(x=>{x.dmg+=2})}});
DK('The Yellow Wind Ridge',{d:'ybat:4,ytig:4,ydef:3,ygen,ygale:2',hint:'Everything strikes at once, and the wind blinds your army so it can\'t block. Kill the Yellow Wind Monster to fix the wind'});

/* ---------- Erlang Shen: THE PREDATOR ANSWER. Every army member you play is answered by its predator ---------- */
function fPredator(s,o,x){const er=s.bf.find(y=>y.id=='eerl');const t=er||fLow(cr(s));if(!t)return;const want=pw(x)+1;if(pw(t)<want)t.pa+=want-pw(t);t.pred=1;
 if(er)x.f.split('').forEach(k=>{if('fwhrvdbsxyq'.includes(k))fKey(t,k)});if(t.id=='eplum')fKey(t,'f');log(fNm(t)+' becomes the predator of '+fNm(x)+' (power '+pw(t)+').')}
F('eye',{t:'Ward. Change for change: whenever you play an army member, one of their army members becomes its predator: its power becomes that army member\'s power + 1.',oppEnter:(s,o,c,x)=>fPredator(s,o,x)});
F('eplum',{c:2,a:2,h:3,f:'',tag:'erl',t:'A falcon on the wrist: when it becomes a predator, it also gains Flying.'});
F('ehnd',{c:2,a:3,h:3,f:'q',tag:'erl',t:'Opportunist. It bites the leg: after it blocks an army member, that army member can\'t run: it doesn\'t untap on your next turn.',
 blk:(s,o,c)=>{const cm=G.cmbLast;if(!cm)return;for(const[a,b]of Object.entries(cm.blk||{}))if(b==c.u){const A=o.bf.find(x=>x.u==a);if(A){fTap(A,1);log('The Howling Celestial Hound bites '+fNm(A)+'\'s leg.')}}}});
F('eerl',{c:4,a:4,h:5,f:'z',tag:'erl',t:'Resilient. While he lives, Erlang himself answers every change: he becomes the predator, and also takes the keywords of what he hunts.'});
F('esw',{c:3,t:'The three-pointed, two-edged blade: deal damage to target army member equal to the power of their strongest predator.',
 ai:(s,o)=>{const m=Math.max(0,...cr(s).filter(x=>x.pred).map(pw));return m>=3?fAiKill(o,m,3):null},fx:(s,o,t)=>{if(t)t.dmg+=Math.max(0,...cr(s).filter(x=>x.pred).map(pw))}});
DK('Erlang Shen, the Three-Eyed',{d:'eplum:5,ehnd:4,eerl:2,esw:3',hint:'Every army member you play is answered by its predator, one power stronger'});

/* ---------- Princess Iron Fan: BLOWN AWAY BY WEIGHT. Light things blow a little way; heavy ones 84,000 li ---------- */
function fBlow(o,t,why){if(!t||!o.bf.includes(t)||has(t,'w'))return;o.bf.splice(o.bf.indexOf(t),1);Object.assign(t,{dmg:0,tap:0,def:0,att:0,sw:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,forced:0});
 if(G.e.bf.some(x=>x.id=='iguard'))t.disc=(t.disc||0)-1;const far=D[t.id][1]>=4;if(far)o.deck.splice(Math.max(0,o.deck.length-3),0,t);else o.deck.push(t);try{amFall()}catch(e){}log((why||'The fan blows ')+fNm(t)+(far?' 84,000 li away: it lands three cards down in your deck.':' back onto the top of your deck.'))}
F('ifan',{t:'Ward. Every other turn (on their first, third, fifth…), the fan blows away your most expensive army member that costs 3 or more: to the top of your deck, or, if it costs 4 or more, 84,000 li away: three cards down in your deck.',
 up:(s,o)=>{s.waves=(s.waves||0)+1;if(s.waves%2==0)return;const min=s.bf.some(x=>x.id=='imaid')?2:3;const t=cr(o).filter(x=>D[x.id][1]>=min&&!has(x,'w')).sort((a,b)=>D[b.id][1]-D[a.id][1]||ev(b)-ev(a))[0];if(t)fBlow(o,t)}});
F('iwnd',{c:1,a:2,h:1,f:'f',tag:'fan',t:'Flying. A breath of the fan: when it dies, your newest army member is blown away if it costs 2 or less.',die:(s,o)=>{const t=fNewest(o);if(t&&D[t.id][1]<=2)fBlow(o,t,'A last gust blows ')}});
F('imaid',{c:2,a:2,h:3,f:'',tag:'fan',t:'She guards the fan\'s case: while she lives, the fan also blows away army members that cost 2.'});
F('iguard',{c:3,a:3,h:4,f:'p',tag:'fan',t:'Phalanx. The false fan: while it lives, army members the fan blows away cost 1 more to play again.'});
F('iprin',{c:4,a:4,h:5,f:'z',tag:'fan',t:'Resilient. One wave sends a man 84,000 li: when it enters, she blows away your two most expensive army members that cost 3 or more.',
 etb:(s,o)=>{cr(o).filter(x=>D[x.id][1]>=3).sort((a,b)=>D[b.id][1]-D[a.id][1]).slice(0,2).forEach(x=>fBlow(o,x,'Princess Iron Fan blows '))}});
DK('Princess Iron Fan',{d:'iwnd:6,imaid:4,iguard:3,iprin',hint:'Her fan blows your army away by weight: light things onto your deck, heavy ones 84,000 li away, deeper in it'});

/* ---------- The Six-Eared Macaque: THE STOLEN LUGGAGE. He robs your deck and fields copies of what he takes ---------- */
const fSteal=(s,o,why)=>{const x=o.deck.pop();if(!x)return;if(isC(x)&&fRoom(s)){const n=mk(x.id);n.dis=1;enter(s,n);log(why+fNm(x)+' from your pack and fields a copy.')}else log(why+fNm(x)+' from your pack.')};
F('mtrump',{t:'Ward. The stolen luggage: at the start of their turn, he takes the top card of your deck. If it is an army member, a copy of it fights for him; anything else is simply lost.',up:(s,o)=>fSteal(s,o,'The Six-Eared Macaque steals ')});
F('mmon',{c:1,a:1,h:2,f:'',tag:'mac',t:'A shadow with no shadow: when it enters, it takes the power and health of your newest army member.',
 etb:(s,o,c)=>{const t=fNewest(o);if(t){c.a=pw(t);c.d=Math.max(1,th(t)-(t.def?2:0));log('A Shadow Monkey copies '+fNm(t)+'.')}}});
F('mape',{c:2,a:3,h:2,f:'q',tag:'mac',t:'Opportunist. It copies even your doubt: whenever you cast a spell, it gets +1/+1 permanently.',oppCast:(s,o,c)=>{c.pa++;c.pd++}});
F('mear',{c:3,a:2,h:5,f:'',tag:'mac',t:'Six ears hear where everything is kept: when it enters, he steals the top 2 cards of your deck as well.',etb:(s,o)=>{fSteal(s,o,'The Listening Ear finds ');fSteal(s,o,'The Listening Ear finds ')}});
F('mac6',{c:4,a:5,h:5,f:'z',tag:'mac',t:'Resilient. The false Sage: at the start of their turn, it gains every keyword your army members have.',
 up:(s,o,c)=>{const ks=new Set();cr(o).forEach(x=>x.f.split('').forEach(k=>{if('fwhrvdbsxyq'.includes(k))ks.add(k)}));ks.forEach(k=>fKey(c,k))}});
F('mecho',{c:2,t:'His copied staff: deal damage to target army member equal to the power of your strongest army member.',ai:(s,o)=>fAiKill(o,Math.max(0,...cr(o).map(pw)),3),fx:(s,o,t)=>{if(t)t.dmg+=Math.max(0,...cr(o).map(pw))}});
DK('The Six-Eared Macaque',{d:'mmon:5,mape:4,mear:2,mac6,mecho:2'});

/* ---------- The Bull Demon King: RAGE FROM BEING HIT. Every wound makes the bull angrier ---------- */
function fWhite(c){if(c.white)return;c.white=1;c.pa+=4;c.pd+=4;fKey(c,'b');log('The Bull Demon King becomes a white bull a thousand zhang long!')}
const fRage=(s,n)=>{s.rage=(s.rage||0)+n;log('The Bull Demon King\'s rage grows ('+Math.min(6,s.rage)+' of 6).');if(s.rage>=6)cr(s).filter(x=>x.id=='bdk').forEach(fWhite)};
F('bfury',{t:'Ward. Rage: whenever one of their army members is damaged in combat and survives, his rage grows. At 6 rage, the Bull Demon King becomes the white bull. At the start of their turn, each of their army members gets +1/+0 until end of turn.',
 post:(s,o,c,hurt)=>{const n=hurt.length+hurt.filter(x=>x.id=='bgrd').length;if(n)fRage(s,n)}});
F('bgrd',{c:2,a:2,h:4,f:'',tag:'bull',t:'A temper like dry grass: when it is damaged in combat and survives, it adds 2 rage instead of 1.'});
F('bcap',{c:3,a:4,h:4,f:'rb',tag:'bull',t:'Ruthless. Bulldoze. Gets +1/+0 for every 2 rage (at most +3).',self:c=>[Math.min(3,Math.floor((sideOf(c).rage||0)/2)),0]});
F('bhrn',{c:4,a:5,h:4,f:'hn',tag:'bull',t:'Charge. Can only attack. Gets +2/+0 while the Bull Demon King is the white bull.',self:c=>[sideOf(c).bf.some(x=>x.white)?2:0,0]});
F('bdk',{c:5,a:6,h:7,f:'z',tag:'bull',t:'Resilient. At 6 rage he becomes a white bull a thousand zhang long: +4/+4 and Bulldoze. If he arrives after the rage is full, he arrives as the bull.',etb:(s,o,c)=>{if((s.rage||0)>=6)fWhite(c)}});
DK('The Bull Demon King',{d:'bgrd:5,bcap:5,bhrn:3,bdk'});

/* ---------- The Buddha's Palm: LIMITS. However far you go, you are still inside the hand ---------- */
F('palm',{t:'Ward. Every step outward is still inside the hand: each card you play after the third in a turn costs 2 more. Each Finger of the Mountain lowers that limit by one (never below 1). The hand closes: at the start of their turn, you take 1 damage for each Finger of the Mountain they have beyond the first.',up:(s,o)=>{const n=fCnt(s,'pfin')-1;if(n>0)fHurt(o,n,'The hand closes around you. ')}});
F('pdis',{c:1,a:1,h:3,f:'',tag:'palm',t:'He sat so still he became the mountain: at the start of their turn, +0/+1 permanently (at most +3).',up:(s,o,c)=>{if((c.grow||0)<3){c.grow=(c.grow||0)+1;c.pd++}}});
F('pfin',{c:2,a:2,h:5,f:'kp',tag:'palm',t:'Can only defend. Phalanx. One of the five pillars at the end of the world: while it lives, the palm\'s limit is one card lower.'});
F('pgrd',{c:3,a:3,h:6,f:'',tag:'palm',t:'The talisman, om mani padme hum: while it lives, your army members that cost 4 or more are sealed and can\'t attack.',
 oup:(s,o)=>{cr(o).forEach(x=>{if(D[x.id][1]>=4)fFlagOn(x,'k','seal')})}});
{const _u=egUp;egUp=function(s,o){try{if(G&&G.e&&s===G.p&&!G.e.bf.some(x=>x.id=='pgrd'))cr(s).forEach(x=>fFlagOff(x,'seal'))}catch(e){}return _u.apply(this,arguments)}}
F('plm',{c:5,a:5,h:9,f:'kz',tag:'palm',t:'Can only defend. Resilient. The mountain presses down: at the start of their turn, if all your army members are tapped, you take 3 damage.',
 up:(s,o)=>{const L=cr(o);if(!L.length||L.every(x=>x.tap))fHurt(o,3,'The Five Elements Mountain presses down. ')}});
DK("The Buddha's Palm",{d:'pdis:5,pfin:5,pgrd:2,plm'});
