const has=(c,x)=>c.f.includes(x),isC=c=>D[c.id][2]=='C',cr=s=>s.bf.filter(isC);
const sideOf=c=>[G.p,G.e].find(s=>s&&s.bf.includes(c));
const oppOf=s=>s===G.p?G.e:G.p;
const own=(c,id)=>{const s=sideOf(c);return!!s&&s.bf.some(x=>x.id==id)};
const pw=c=>Math.max(0,c.a+c.pa+c.ta);
const th=c=>c.d+c.pd+c.td+(c.def?2+(ramp(c)?1:0):0)+(has(c,'f')&&own(c,'skies')?1:0);
const pwr=c=>pw(c)+(has(c,'r')&&!c.def?1:0)+(has(c,'p')&&c.def?2:0)+(c.def&&own(c,'doct')?1:0)+(!c.def&&own(c,'banner')?1:0)+(has(c,'f')&&own(c,'skies')?1:0);
const kw=(c,k)=>has(c,k)||(k=='d'&&has(c,'f')&&own(c,'lyre'))||(k=='b'&&own(c,'club')&&pwr(c)>=3);
const cost=c=>{const b=D[c.id][1];return b&&c.rec?Math.max(1,b-c.rec.c):b},sv=c=>D[c.id][9]+(c.rec?c.rec.s:0);
const best=a=>a.slice().sort((x,y)=>pw(y)-pw(x))[0];
const heal=(c,n)=>c.dmg=Math.max(0,c.dmg-n);
const bury=(s,c)=>{if(c.id!='sold'){c.dmg=0;c.tap=0;c.def=0;c.ta=c.td=0;s.gy.push(c)}};
const log=m=>{G.log.push(m);if(G.log.length>3)G.log.shift()};
const draw=(s,n)=>{while(n--&&s.deck.length)s.hand.push(s.deck.pop())};
const shoal=()=>[...G.p.bf,...G.e.bf].some(c=>c.id=='shoal');
const canAtk=c=>{const s=sideOf(c),o=s&&oppOf(s);return!c.tap&&!c.sick&&!c.def&&isC(c)&&!has(c,'k')&&!(o&&o.bf.some(x=>x.id=='mouth')&&pw(c)<=2)};
const canBlock=(b,a)=>!b.tap&&isC(b)&&!has(b,'n')&&(!has(a,'f')||has(b,'f'));
const canHit=(a,T)=>isC(T)&&T.tap&&!has(T,'w')&&(!has(T,'f')||has(a,'f'));
const cdmg=a=>pwr(a)>0?(kw(a,'x')?pwr(a):Math.max(1,pwr(a)-1)):0;
const clean=()=>[G.p,G.e].forEach(s=>s.bf.forEach(c=>{c.ta=c.td=0}));
const idle=()=>{const p=G.p;return!p.hand.some(c=>cost(c)<=p.mana)&&!p.bf.some(c=>c.id=='bow'&&!c.tap)};
const bounce=t=>{for(const s of[G.p,G.e]){const k=s.bf.indexOf(t);if(k>=0){s.bf.splice(k,1);s.hand.push(mk(t.id,t.rec))}}};
const destroyIt=(s,t)=>{const i=s.bf.indexOf(t);if(i<0)return;s.bf.splice(i,1);bury(s,t);log(D[t.id][0]+' is destroyed.')};
const kills=(a,b)=>pwr(a)>0&&!(has(b,'z')&&!b.rs)&&(kw(a,'v')||pwr(a)>=th(b)-b.dmg);
const ETBV={herm:1.5,priest:2,nestor:2,slinger:1.5,healer:1.5,sapper:1.5,sinon:1,cass:2,argus:1,pythia:1,pyrep:2,telem:1.5};
const ev=x=>pw(x)+(th(x)-x.dmg)*.8+(has(x,'f')?1.5:0)+(kw(x,'v')?2:0)+(kw(x,'d')?1:0)+(kw(x,'b')?1:0)+(has(x,'z')&&!x.rs?1.5:0)+(has(x,'y')?1.5:0)+(has(x,'x')?1:0)+(ETBV[x.id]||0);
const IV={zeus:7,pyre:8,altar:6,banner:7,skies:7,doct:6,rampart:5,hearth:6,bow:7,horse:8,net:6,shoal:5,mouth:6,canto:6,club:7,lyre:7,haze:6,censer:8};
const FX={spearc:(s,o,t)=>t.dmg+=3,gale:(s,o,t)=>bounce(t),aegis:(s,o,t)=>{t.ta+=2;t.td+=2},salve:(s,o,t)=>heal(t,4),feast:s=>{s.life+=3;cr(s).forEach(c=>heal(c,1))},
honey:(s,o,t)=>{t.tap=1;t.frz=1},sip:(s,o,t)=>{t.tap=1;t.frz=1},undertow:(s,o,t)=>{t.tap=1},fog:(s,o)=>cr(o).forEach(c=>{c.tap=1}),labyr:(s,o)=>cr(o).forEach(c=>{c.tap=1}),
breeze:s=>s.life+=3,melody:(s,o,t)=>{t.forced=1;if(t.def){t.def=0;t.dmg=Math.min(t.dmg,th(t)-1)}},lure:(s,o,t)=>{t.pa-=2;t.pd-=2},hurl:(s,o,t)=>t.dmg+=4,tide:(s,o,t)=>heal(t,3),
milk:s=>{s.life+=4;cr(s).forEach(c=>heal(c,1))},hold:(s,o,t)=>{t.def=1;t.forced=0;t.sw=1;G.sel=G.sel.filter(x=>x!=t.u)},mist:(s,o,t)=>{t.tap=1},rally:s=>cr(s).forEach(c=>{c.ta++;c.td++}),
fury:(s,o,t)=>{t.ta+=3},testudo:s=>cr(s).filter(c=>c.def).forEach(c=>{c.ta+=2;c.td+=2}),thunder:(s,o,t)=>{t.dmg+=has(t,'f')?6:4},
hammer:(s,o,t)=>destroyIt(o,t),plunder:(s,o,t)=>{destroyIt(o,t);draw(s,1)},hecat:(s,o,t)=>{offer(s,t);draw(s,2)}};
const ETB={herm:s=>draw(s,1),priest:(s,o)=>{const b=best(cr(o).filter(c=>!c.tap));if(b)b.tap=1},nestor:(s,o)=>{const b=best(cr(o).filter(c=>!c.tap));if(b)b.tap=1},
slinger:(s,o)=>{const E=cr(o),k=E.filter(x=>th(x)-x.dmg<=1),t=best(k.length?k:E);if(t)t.dmg++},
healer:s=>{const w=cr(s).slice().sort((a,b)=>b.dmg-a.dmg)[0];if(w&&w.dmg>0)heal(w,3)},
sapper:(s,o)=>{const t=o.bf.filter(x=>!isC(x)).sort((a,b)=>(IV[b.id]||5)-(IV[a.id]||5))[0];if(t)destroyIt(o,t)}};
const PEND={slinger:{who:'e',ok:T=>isC(T),fn:T=>{T.dmg++},has:(s,o)=>cr(o).length>0,m:"Cretan Slinger: click an opponent's army member to deal 1 damage to it."},
nestor:{who:'e',ok:T=>isC(T)&&!T.tap,fn:T=>{T.tap=1},has:(s,o)=>cr(o).some(x=>!x.tap),m:"Nestor: click an untapped opponent's army member to tap it."},
sapper:{who:'e',ok:T=>!isC(T),fn:T=>destroyIt(G.e,T),has:(s,o)=>o.bf.some(x=>!isC(x)),m:"Trojan Sapper: click an opponent's item or modifier to destroy it."},
sinon:{who:'p',ok:(T,c)=>isC(T)&&T!==c,fn:T=>bounce(T),has:(s,o,c)=>cr(s).some(x=>x!==c),m:'Sinon: click another of your army members to return it to your hand.'}};
const TS={spearc:'c',gale:'c',aegis:'c',salve:'c',hold:'c',mist:'c',fury:'c',thunder:'c',hammer:'ei',plunder:'ei',hecat:'pc'};
const tsOk=(code,T,k)=>typeof T=='object'&&(code=='c'?isC(T):code=='ei'?(k=='e'&&!isC(T)):(k=='p'&&isC(T)));
const TSM={c:'Choose a target army member.',ei:"Choose an opponent's item or modifier.",pc:'Choose one of your army members.'};
const DIE={argus:s=>draw(s,1),cass:(s,o)=>{const E=cr(o),k=E.filter(x=>th(x)-x.dmg<=3).sort((a,b)=>(pw(b)+th(b))-(pw(a)+th(a)))[0],t=k||best(E);if(t)t.dmg+=3}};
function enter(s,c){c.sick=has(c,'h')?0:1;if(has(c,'k'))c.def=1;if(oppOf(s).bf.some(x=>x.id=='net'||x.id=='haze'))c.tap=1;s.bf.push(c)}
function offer(s,c){const g=sv(c)+(s.bf.some(x=>x.id=='altar')?1:0),o=oppOf(s);s.bf.splice(s.bf.indexOf(c),1);s.mana+=g;bury(s,c);log((s==G.p?'You offer ':G.e.nm+' offers ')+D[c.id][0]+' (+'+g+' mana).');
if(c.id=='argus')draw(s,1);if(c.id=='pythia'){s.mana+=2;log('Pythia grants 2 extra mana.')}if(s.bf.some(x=>x.id=='zeus'))draw(s,1);cr(s).filter(x=>x.id=='telem').forEach(x=>{x.pa++;x.pd++});
const fr=s.bf.filter(x=>x.id=='pyre'||x.id=='pyrep').length;if(fr){o.life-=fr;log('Frenzy: '+fr+' damage to '+(o==G.p?'you':o.nm)+'.')}}
function stance(s,c){if(s==G.p&&G.atkd)return'Stances lock once you attack this turn.';if(s==G.p&&c.forced)return'Enthralled: it must attack this turn.';if(c.sw)return'Already shifted this turn.';if(!c.def&&c.att)return'It attacked this turn.';
if(!c.def&&oppOf(s).bf.some(x=>x.id=='canto'))return"The Sirens' song: your army members cannot switch to defense form.";
c.def=c.def?0:1;c.sw=1;if(!c.def)c.dmg=Math.min(c.dmg,th(c)-1);G.sel=G.sel.filter(x=>x!=c.u);return''}
function sweep(){for(let again=1;again;){again=0;for(const s of[G.p,G.e])for(const c of s.bf.slice()){if(!isC(c)||!s.bf.includes(c))continue;
if(th(c)>0&&c.dmg>=th(c)&&has(c,'z')&&!c.rs){c.rs=1;c.dmg=th(c)-1;log(D[c.id][0]+' endures (Resilient).');continue}
if(th(c)<=0||c.dmg>=th(c)){s.bf.splice(s.bf.indexOf(c),1);bury(s,c);log(D[c.id][0]+' dies.');if(c.id=='sheep')s.life+=2;if(DIE[c.id])DIE[c.id](s,oppOf(s));again=1}}}}
