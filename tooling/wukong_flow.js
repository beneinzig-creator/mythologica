/* ===== Sun Wukong, "flow" pass (Nov 2026): his chain feeds itself, his clunky cards get cheaper =====
   Sim notes (tooling/wkx.py + wkm.js): before this pass Wukong played 1.8 cards a turn, 54% of his turns played 0-1 cards,
   and his Momentum payoffs went off at Momentum ~1.2. */

/* --- Flow: the first time each turn your Momentum reaches WKFLOW, draw a card --- */
var WKFLOW=3;
{const _m=wkMom;wkMom=function(p){const r=_m.apply(this,arguments);try{if(p===G.p&&G.ch==='wukong'&&!G.tut&&!p.flw&&(p.mo||0)>=WKFLOW){p.flw=1;draw(p,1);log('Flow: your Momentum reaches '+WKFLOW+', and you draw a card.')}}catch(e){}return r}}
{const _u=wkUp;wkUp=function(s){const r=_u.apply(this,arguments);try{if(s===G.p)s.flw=0}catch(e){}return r}}
wkBar=function(){const p=G.p;if(!p||G.ch!='wukong')return'';return`<span class="cn" title="Momentum rises each time you play a card of a different type (Strike, Trick, Leap) than the card before it. The first time each turn it reaches ${WKFLOW}, you draw a card. It resets every turn."><img class="tki" src="art/game/icons/wukong/momentum.png" alt="Momentum" title="Momentum" draggable="false"> Momentum ${p.mo||0}${p.flw?' · drew':' · draw at '+WKFLOW} · ${p.cp||0} played${p.lt?' · last: '+WTN[p.lt]:''}</span>`};
{const g=GLX.find(x=>x[1]=='Momentum');if(g)g[2]='Rises by 1 each time you play a card of a different type (Strike, Trick or Leap) than the card you played just before it. The first time each turn it reaches '+WKFLOW+', you draw a card. It resets at the start of each of your turns.'}
TURNM.wukong='play different card types in a row (Strike, Trick, Leap) to build Momentum; at Momentum '+WKFLOW+' you draw a card.';
CHARS.wukong.play='Play many cheap cards in a turn: chain Strikes, Tricks and Leaps to build Momentum, and the first time each turn it reaches '+WKFLOW+' you draw a card to keep the chain going. Spare Hairs and Peaches come straight to your hand, and Disintegrated cards vanish for good. A swarm of small monkeys and a hand full of spells. 20 life.';

/* --- Cloud Somersault (starting card): 1 mana, draw 2 --- */
wkSet('wsomer',1,'Shuffle your graveyard into your deck, then draw 2 cards. Disintegrate.');
FX.wsomer=s=>{s.gy.forEach(c=>Object.assign(c,{dmg:0,tap:0,def:0,sick:1,frz:0,ta:0,td:0}));s.deck.push(...s.gy);s.gy=[];sh(s.deck);log('Cloud Somersault: your graveyard is shuffled into your deck.');draw(s,2+mg())};
UPS.wsomer=n=>`Draw ${2+n}`;

/* --- the 3-5 mana cards that sat in hand: one mana cheaper, smaller bodies --- */
[['wbreak',3,2,4],['wcloudm',2,2,2],['wnez',3,3,3],['wgreat',3,2,5],['wqt',4,3,5]].forEach(([k,c,a,d])=>{const x=D[k];if(!x)return;x[1]=c;x[3]=a;x[4]=d});

