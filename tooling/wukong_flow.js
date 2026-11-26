/* ===== Sun Wukong, "flow" pass (Nov 2026): his chain feeds itself, his clunky cards get cheaper =====
   Sim notes (tooling/wkx.py + wkm.js): before this pass Wukong played 1.8 cards a turn, 54% of his turns played 0-1 cards,
   and his Momentum payoffs went off at Momentum ~1.2. */

/* --- Flow: the first time each turn your Momentum reaches WKFLOW, draw a card --- */
var WKFLOW=3;
{const _m=wkMom;wkMom=function(p){const r=_m.apply(this,arguments);try{if(p===G.p&&G.ch==='wukong'&&!G.tut&&!p.flw&&(p.mo||0)>=WKFLOW){p.flw=1;draw(p,1);log('Flow: your Momentum reaches '+WKFLOW+', and you draw a card.')}}catch(e){}return r}}
{const _u=wkUp;wkUp=function(s){const r=_u.apply(this,arguments);try{if(s===G.p)s.flw=0}catch(e){}return r}}
wkBar=function(){const p=G.p;if(!p||G.ch!='wukong')return'';const mo=p.mo||0,fl=!!p.flw;let pips='';for(let i=1;i<=WKFLOW;i++)pips+=`<i class="${fl||mo>=i?'on':''}"></i>`;return`<span class="cn wkb${fl?' fl':''}" title="Momentum rises each time you play a card of a different type (Strike, Trick, Leap) than the card before it. The first time each turn it reaches ${WKFLOW}, you draw a card. It resets every turn."><span class="wkm"><img class="tki" src="art/game/icons/wukong/momentum.png" alt="Momentum" title="Momentum" draggable="false">Momentum <b>${mo}</b><span class="wkp">${pips}</span></span><span class="wks"><span>${fl?'Card drawn':'Draw at '+WKFLOW}</span><span>${p.cp||0} played</span>${p.lt?`<span>Last: ${WTN[p.lt]}</span>`:''}</span></span>`};
try{const st=document.createElement('style');st.id='wkhud';st.textContent=`
.me .wkb{display:flex!important;flex-direction:column;align-items:center;gap:3px;white-space:normal!important;max-width:100%;text-align:center;line-height:1.2}
.me .wkb .wkm{display:flex;align-items:center;gap:5px;white-space:nowrap}
.me .wkb .wkm b{font-size:1.3em;color:#ffd27a;margin-left:-1px}
.me .wkb .wkp{display:inline-flex;gap:3px;margin-left:3px}
.me .wkb .wkp i{width:.7em;height:.7em;border-radius:50%;border:1px solid #ffd27aaa;box-sizing:border-box}
.me .wkb .wkp i.on{background:#ffd27a;box-shadow:0 0 4px #ffd27a99}
.me .wkb.fl .wkp i{background:#9fe08a;border-color:#9fe08a;box-shadow:0 0 4px #9fe08a99}
.me .wkb .wks{display:flex;flex-wrap:wrap;justify-content:center;opacity:.85;font-size:.92em}
.me .wkb .wks>span{white-space:nowrap}
.me .wkb .wks>span+span::before{content:'·';margin:0 .45em;opacity:.7}
.me .wkb.fl .wks>span:first-child{color:#9fe08a}
html:not(.ph) .me:has(.wkb){max-width:156px;box-sizing:border-box}
html:not(.ph) body:has(.me .wkb) .hand{padding-left:calc(168px * var(--zu,1.4) / var(--zc,1.25) + 10px)}
`;document.head.appendChild(st)}catch(e){}
{const g=GLX.find(x=>x[1]=='Momentum');if(g)g[2]='Rises by 1 each time you play a card of a different type (Strike, Trick or Leap) than the card you played just before it. The first time each turn it reaches '+WKFLOW+', you draw a card. It resets at the start of each of your turns.'}
TURNM.wukong='play different card types in a row (Strike, Trick, Leap) to build Momentum; at Momentum '+WKFLOW+' you draw a card.';
CHARS.wukong.play='Play many cheap cards in a turn: chain Strikes, Tricks and Leaps to build Momentum, and the first time each turn it reaches '+WKFLOW+' you draw a card to keep the chain going. Spare Hairs and Peaches come straight to your hand, and Disintegrated cards vanish for good. A swarm of small monkeys and a hand full of spells. 20 life.';

/* --- Cloud Somersault (starting card): 1 mana, draw 2 --- */
wkSet('wsomer',1,'Shuffle your graveyard into your deck, then draw 2 cards. Disintegrate.');
FX.wsomer=s=>{s.gy.forEach(c=>Object.assign(c,{dmg:0,tap:0,def:0,sick:1,frz:0,ta:0,td:0}));s.deck.push(...s.gy);s.gy=[];sh(s.deck);log('Cloud Somersault: your graveyard is shuffled into your deck.');draw(s,2+mg())};
UPS.wsomer=n=>`Draw ${2+n}`;

/* --- the 3-5 mana cards that sat in hand: one mana cheaper, smaller bodies --- */
[['wbreak',3,2,4],['wcloudm',2,2,2],['wnez',3,3,3],['wgreat',3,2,5],['wqt',4,3,5]].forEach(([k,c,a,d])=>{const x=D[k];if(!x)return;x[1]=c;x[3]=a;x[4]=d});

