/* ===== Hero flow pass (2026-11-27, Balance Audit 2) =====
   Odysseus: support and modifier cards cheaper or stronger, new abilities on cards whose ability repeated another card,
   fodder that comes from play (Camp Followers from Raiders and Phalanx), two bridge cards.
   Thoth: Ink (a counter fed by Foresee), amulets played with no army member equip the next one for free, Sundered/Recorder fixes.
   Sun Wukong: smoother Staff cards and the two weakest defenders. Legendary cards are offered a little more often.
   Every change is stated on the card.
   Odin (2026-11-28): Rage replaces the half-life Wounded rule. Rage = life lost since the start of your last turn; Wounded at 3+, Frenzy at 6+. */
/* --- helpers: add abilities to an existing card without wiping its built-in ones (F() would delete ETB/DEATH entries) --- */
function HX(id,o){const d=D[id];if(!d){try{console.warn('hero_flow: no card',id)}catch(e){}return}
 if(o.c!=null)d[1]=o.c;if(o.a!=null)d[3]=o.a;if(o.h!=null)d[4]=o.h;if(o.f!=null)d[5]=o.f;if(o.t!=null){d[6]=o.t;try{if(typeof TXT!='undefined')TXT[id]=o.t}catch(e){}}
 const h={};for(const k in o)if(typeof o[k]=='function')h[k]=o[k];if(Object.keys(h).length)FOE[id]=Object.assign(FOE[id]||{},h)}
const hxCamp=(s,why)=>{if(!s||s.hand.length>=10)return;s.hand.push(mk('camp'));if(why)log(why+': a Camp Follower joins your hand.')};
const hxOncePerTurn=(c,k)=>{if(c[k]===G.turn)return false;c[k]=G.turn;return true};

/* ================= ODYSSEUS ================= */
/* Offerings */
{const f0=FX.hecat;FX.hecat=(s,o,t)=>{f0(s,o,t);s.mana+=2;log('Hecatomb: +2 mana.')};}
HX('hecat',{t:'Offer one of your army members, gain 2 mana, then draw 2 cards.'});
HX('ossuary',{c:1});
HX('altar',{c:1});
HX('pyre',{t:'Each time you offer an army member, deal 2 damage to the opponent. When it enters, draw a card.',etb:s=>draw(s,1)});
HX('muse',{c:2});
/* Bull of Poseidon: no longer just a bigger Faithful Argus */
HX('tbull',{a:3,h:4,t:'When it dies or is offered, draw a card, and Poseidon shakes the earth: each opposing army member takes 1 damage.',
 die:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1});log('Poseidon shakes the earth: each opposing army member takes 1.')},
 sac:(s,o)=>{cr(o).forEach(x=>{x.dmg+=1});log('Poseidon shakes the earth: each opposing army member takes 1.');try{sweep();chk()}catch(e){}}});
HX('eagle',{c:3});
HX('mino',{a:4,h:4});
/* Raiders */
HX('banner',{c:2});
HX('ares',{c:2});
HX('sack',{c:3});
HX('horde',{c:1});
HX('spoils',{c:1});
HX('dio2',{c:3,t:'Diomedes wounds even gods: when it attacks, deal 1 damage to a random opposing army member.',
 atk:(s,o)=>{const L=cr(o);if(!L.length)return;const t=L[Math.random()*L.length|0];t.dmg+=1;log('Diomedes wounds '+D[t.id][0]+'.')}});
HX('reaver',{t:'When it deals combat damage to the opponent, a Camp Follower joins your hand.',hit:s=>hxCamp(s,'Venomous Reaver brings back a captive')});
HX('ram',{t:'When it deals combat damage to the opponent, a Camp Follower joins your hand.',hit:s=>hxCamp(s,'The Siege Ram Crew loots the gate')});
/* bridge: Agamemnon leads both lines (Raider and Phalanx) */
HX('agam',{f:'yhrp',t:'Leads both lines: Ruthless like a Raider (+1 power when attacking) and Phalanx (+2 power in defense form).'});
/* Phalanx */
HX('doct',{c:1,t:'Your army members in defense form get +1/+1.',aura:x=>[0,x.def?1:0]});
HX('rampart',{t:'Your army members in defense form get +2 health.',aura:x=>[0,x.def?1:0]});
HX('drill',{c:2});
HX('bastion',{c:3});
HX('wall',{c:2});
HX('shield',{c:2});
HX('thermo',{t:'Your Phalanx army members get +2/+2. In defense form they get +2/+2 more and have Resilient. When it enters, draw a card.',etb:s=>draw(s,1)});
{const f0=FX.salve;if(f0)FX.salve=(s,o,t)=>{f0(s,o,t);if(t){t.pa++;t.pd++}};}
HX('salve',{t:'Restore 4 health to target army member. It gets +1/+1 permanently.'});
HX('capt',{c:3,t:'When it enters, a Camp Follower joins your hand.',etb:s=>hxCamp(s,'The Hoplite Captain brings a camp follower')});
HX('gate',{c:2,a:2,h:5});
HX('sent',{t:'Can only defend. When it blocks (once a turn), a Camp Follower joins your hand.',blk:(s,o,c)=>{if(hxOncePerTurn(c,'hxb'))hxCamp(s,'The Argive Sentinel holds the gate')}});
/* bridge: the Shield-Bearer's last gift to the Phalanx when offered */
HX('myrsh',{t:'When it enters, your other Phalanx army members get +0/+2 permanently. When it is offered, they get +0/+2 permanently again.',
 sac:s=>{cr(s).filter(x=>has(x,'p')).forEach(x=>{x.pd+=2});log('The Myrmidon Shield-Bearer gives the Phalanx its shield.')}});

/* ================= THOTH ================= */
/* Ink: every Foresee writes 1 Ink. At 3 Ink the page is full: draw a card, the opponent loses 2 life, and the Ink clears. */
function thInk(n){const p=G.p;if(!p||G.ch!='thoth'||!G.e)return;p.ink=(p.ink||0)+n;while(p.ink>=3){p.ink-=3;draw(p,1);G.e.life-=2;log('The page is full of Ink: you draw a card and they lose 2 life.')}try{chk()}catch(e){}}
{const f0=foresee;foresee=function(){const r=f0.apply(this,arguments);try{thInk(1)}catch(e){}return r};
 const f1=foreseeHand;foreseeHand=function(){const r=f1.apply(this,arguments);try{thInk(1)}catch(e){}return r};}
/* the status bar is redefined by later files, so the Ink readout is attached when a fight starts */
function hxInkBar(){if(wkBar.hxInk)return;const _b=wkBar;wkBar=function(){try{if(G&&G.p&&G.ch=='thoth')return`<span class="cn" title="Every Foresee writes 1 Ink. At 3 Ink the page is full: you draw a card, the opponent loses 2 life, and the Ink clears.">🖋 Ink ${G.p.ink||0} of 3</span>`}catch(e){}return _b.apply(this,arguments)};wkBar.hxInk=1}
{const _f=fight;fight=function(){try{hxInkBar();if(G&&G.p)G.p.ink=0}catch(e){}return _f.apply(this,arguments)}}
/* Amulets: played with no army member to wear them, they equip the next army member you play, for free */
{const _e=enter;enter=function(s,c){const fresh=!!(c&&typeof AMU!='undefined'&&AMU[c.id]&&s&&s.bf&&!cr(s).length);const r=_e.apply(this,arguments);
 try{if(fresh&&!c.on)c.hxFresh=1;if(c&&isC(c)&&s&&s.bf){const a=s.bf.find(x=>x.hxFresh&&!x.on&&AMU[x.id]);if(a&&a!==c){a.on=c.u;a.hxFresh=0;log(D[a.id][0]+' goes to '+D[c.id][0]+' for free.')}}}catch(e){}return r}}
/* Sundered */
{const f0=FX.dreun;FX.dreun=(s,o)=>{const n=reunite(s,1);if(n)draw(s,n)};}
HX('dreun',{c:1,t:'Reunite all your Body and Spirit pairs: each becomes its original again with +2/+2. Draw a card for each.'});
HX('dbook',{c:2});
{const f0=thDie;thDie=function(s,c){try{const p=G.p,e=G.e;if(p&&c&&c.part&&s===p){const n=nOn(p,'dduat');if(n){e.life-=2*n;log('The Gate of the Duat: they take '+2*n+'.')}return}}catch(e){}return f0.apply(this,arguments)}}
HX('dduat',{t:'Whenever one of your Bodies or Spirits dies, deal 2 damage to the opponent.'});
/* Recorder */
HX('yjudge',{c:3});
HX('yall',{c:4});
{const f0=FX.yrecall;FX.yrecall=(s,o)=>{f0(s,o);draw(s,1)};}
HX('yrecall',{t:'Put fading copies of two random army members they have played this fight into your hand. Draw a card.'});
/* Scribes: glyph payoffs at 1 and 3 mana */
const hxGlyphs=s=>cr(s).reduce((n,x)=>n+((typeof glyphsOn=='function')?glyphsOn(x):0),0);
HX('itut',{t:'When it enters, draw a card if any of your army members has a glyph. Gets +1/+0 for every 2 glyphs among your army members (at most +2).',self:c=>{const s=sideOf(c);return[s?Math.min(2,Math.floor(hxGlyphs(s)/2)):0,0]}});
HX('iseshat',{t:'The first time you Inscribe each turn, draw a card. Gets +1/+1 for every 2 glyphs among your army members (at most +2/+2).',self:c=>{const s=sideOf(c);const n=s?Math.min(2,Math.floor(hxGlyphs(s)/2)):0;return[n,n]}});
/* a cheap answer to swarms and bounces */
{const f0=FX.ichisel;if(f0)FX.ichisel=(s,o,t)=>{f0(s,o,t);try{if(t&&o.bf.includes(t)&&D[t.id][1]<=2){o.bf.splice(o.bf.indexOf(t),1);Object.assign(t,{dmg:0,tap:0,def:0,att:0,ta:0,td:0});o.hand.push(t);log(D[t.id][0]+' is sent back to their hand.')}}catch(e){}};}
HX('ichisel',{t:'Target opposing army member loses all its keywords. If it costs 2 or less, return it to its owner\'s hand.'});
RAR.dsplit='U';

/* ================= SUN WUKONG ================= */
HX('wsent',{f:(D.wsent[5]||'').replace('k',''),t:'A sentry that never sleeps (it can attack now too).'});
HX('wruyi',{c:1});
HX('wspin',{c:1});
HX('wsplit',{c:1});
HX('wmyriad',{c:1});
HX('wrout',{c:1});
HX('wbigstaff',{c:4});
HX('wvang',{h:2});
HX('wtang',{t:'Whenever you play the 2nd card of a turn, draw a card.'});


/* ================= ODIN: RAGE ================= */
/* Rage is the life you have lost since the start of your last turn (your turn plus their turn), counted as it happens.
   Wounded while Rage is 3+; at 6+ your Berserkers are in a Frenzy (+1/+0). Healing never lowers Rage; it fades a turn after you stop bleeding. */
const RAGE_W=3,RAGE_F=6,RAGE_MAX=9;
function rgSync(p){if(!p||G.ch!='odin')return;if(p.rl==null)p.rl=p.life;if(p.life<p.rl){const d=p.rl-p.life;p.lost=(p.lost||0)+d;p.prev=(p.prev||0);p.rage=Math.min(RAGE_MAX,(p.prev||0)+p.lost)}p.rl=p.life}
function WNDX(s){if(G&&s===G.p&&G.ch=='odin'){rgSync(s);return (s.rage||0)>=RAGE_W}return s.life*2<=s.max}
{const _s=startP;startP=function(){try{const p=G.p;if(p&&G.ch=='odin'){rgSync(p);p.prev=p.lost||0;p.lost=0;p.rage=Math.min(RAGE_MAX,p.prev)}}catch(e){}return _s.apply(this,arguments)}}
{const _f=fight;fight=function(){const r=_f.apply(this,arguments);try{const p=G.p;if(p){p.rage=0;p.lost=0;p.prev=0;p.rl=p.life}}catch(e){}return r}}
{const _c=chk;chk=function(){try{rgSync(G&&G.p)}catch(e){}return _c.apply(this,arguments)}}
{const _p=px;px=function(c){let n=_p(c);try{if(G&&G.ch=='odin'&&G.p&&G.p.bf.includes(c)&&TAG[c.id]=='B'){rgSync(G.p);if((G.p.rage||0)>=RAGE_F)n+=1}}catch(e){}return n}}
function hxRageBar(){if(wkBar.hxRage)return;const _b=wkBar;wkBar=function(){try{if(G&&G.p&&G.ch=='odin'){const p=G.p;rgSync(p);const r=p.rage||0;return`<span class="cn" title="Rage is the life you lost since the start of your last turn. At ${RAGE_W} you are Wounded; at ${RAGE_F} your Berserkers are in a Frenzy (+1/+0). It fades a turn after you stop bleeding.">🩸 Rage ${r}${r>=RAGE_F?' · Frenzy':r>=RAGE_W?' · Wounded':' · Wounded at '+RAGE_W}</span>`}}catch(e){}return _b.apply(this,arguments)};wkBar.hxRage=1}
{const _f=fight;fight=function(){try{hxRageBar()}catch(e){}return _f.apply(this,arguments)}}
/* E: the cards around it */
{const f0=ETB.blod;ETB.blod=s=>{s.life-=2;log('Blood-Drinker drinks deep: you lose 2 life.')};}
HX('blod',{t:'When it enters, deal 2 damage to you.'});
HX('skul',{c:3});HX('bodvar',{c:3});HX('ulfk',{c:3});HX('star',{c:4});HX('rend',{c:3});
HX('mhall',{c:2,t:'Your army members with Bloodlust or Battle-rage get +1/+1. While you are Wounded, all your army members get +1/+0.',aura:x=>{try{return[G&&G.ch=='odin'&&wnd(G.p)&&!(has(x,'u')||has(x,'i'))?1:0,0]}catch(e){return[0,0]}}});
const hxBleedBack=(s,why)=>{if(s===G.p&&wnd(s)){s.life+=2;log(why+': you gain 2 life.')}};
HX('einw',{t:'When it dies, deal 1 damage to each opposing army member. If you are Wounded, you gain 2 life.',die:s=>hxBleedBack(s,'The Einherjar is carried to the hall')});
HX('stdb',{t:'When it dies, your other army members get +1/+1 permanently. If you are Wounded, you gain 2 life.',die:s=>hxBleedBack(s,'The standard falls')});
HX('huscl',{t:'When it dies, deal 3 damage to the opponent. If you are Wounded, you gain 2 life.',die:s=>hxBleedBack(s,'The Housecarl falls')});

/* ================= DRAFT: Legendary cards a little more often ================= */
RW.L=0.35;RW2.L=1.6;RWE.L=2.5;
