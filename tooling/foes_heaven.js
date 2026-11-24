/* ===== Act III, the War in Heaven: every opponent rebuilt around one theme (lore: tooling/lore/heaven.js + the Lore session's briefs) ===== */

/* ---------- Legion: one body, many inside. Kill the host and the many spill out; the swine destroy themselves ---------- */
const fPos=s=>s.bf.filter(x=>x.id=='xpos');
F('xlgn',{c:1,a:1,h:2,f:'',tag:'legion',t:'Gets +1/+0 while their army has 4 or more army members.',self:c=>[cr(sideOf(c)).length>=4?1:0,0]});
F('xger',{c:2,a:2,h:3,f:'',tag:'legion',t:'Unchainable: at the start of their turn it breaks free (untaps). When it dies, two Possessed spill out of it.',
 up:(s,o,c)=>{if(c.tap||c.frz){c.tap=0;c.frz=0;log('The Gerasene breaks his chains.')}},die:(s,o,c)=>{const n=fSum(s,'xpos',2);if(n)log(n+' Possessed spill out of the Gerasene.')}});
F('xswn',{c:2,a:2,h:3,f:'',tag:'legion',t:'Whenever a Possessed dies, it gets +1/+0. When it dies, it runs into the sea: the opponent takes damage equal to its power.',
 allyDie:(s,o,c,x)=>{if(x.id=='xpos')c.pa++},die:(s,o,c)=>fHurt(o,pw(c),'The herd runs violently down into the sea. ')});
F('xlegc',{c:4,a:3,h:3,f:'',tag:'legion',t:'Gets +1/+1 for each Possessed in their army. When it dies, if they have a Possessed, that Possessed dies in its place and Legion returns to their hand.',
 self:c=>{const n=fPos(sideOf(c)).length;return[n,n]},die:(s,o,c)=>{const p=fPos(s)[0];if(!p)return;fDestroy(p);const i=s.gy.indexOf(c);if(i>=0)s.gy.splice(i,1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0});s.hand.push(c);log('"We are many": a Possessed dies in Legion\'s place, and Legion returns to their hand.')}});
F('xpos',{tag:'legion',t:'One of the many.'});
F('xcast',{c:2,t:'Their dread, turned on you: deal damage to target army member equal to the number of army members they control (at most 5).',
 ai:(s,o)=>fAiKill(o,Math.min(5,cr(s).length),3),fx:(s,o,t)=>{if(t)t.dmg+=Math.min(5,cr(s).length)}});
DK('Legion',{d:'xlgn:5,xger:3,xswn:2,xlegc,xcast:2',hint:'One body, many inside: kill a host and Possessed spill out of it'});

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
const fCut=(c,n,a,perm)=>{c.dmg+=n;if(perm)c.pa+=a;else c.ta+=a};
F('xfire',{c:1,a:1,h:2,f:'',tag:'baal',t:'At the start of their turn it cuts itself: 1 damage to itself, +2/+0 permanently.',up:(s,o,c)=>{fCut(c,1,2,1);log('A prophet of Baal cuts himself and cries louder.')}});
F('xcult',{c:2,a:2,h:3,f:'',tag:'baal',t:'When it attacks, it cuts itself: 1 damage to itself and +2/+0 this turn.',atk:(s,o,c)=>fCut(c,1,2,0)});
F('xidol',{c:3,a:2,h:6,f:'k',tag:'baal',t:'Can only defend. The bull lies on the wood: at the start of their turn, each other army member they control takes 1 damage and gets +1/+0 permanently. No fire comes.',
 up:(s,o,c)=>{const L=cr(s).filter(x=>x!==c);L.forEach(x=>fCut(x,1,1,1));if(L.length)log('They limp around the altar and cut themselves. No fire comes.')}});
F('xmolp',{c:3,a:3,h:3,f:'r',tag:'baal',t:'Ruthless. "Cry aloud": whenever another of their army members dies, they draw a card.',allyDie:s=>draw(s,1)});
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
F('xbab',{t:'Ward. At the start of their turn, the costs of the cards in your hand are shuffled. The tower is never finished: at 12 floors it falls back to 6.'});
DK('The Builders of Babel',{d:'xbrick:5,xmason:4,xzigg:2,xnim,xtong:2',hint:'Their tower rises every turn and makes them stronger; it is never finished'});

/* ---------- The Pairikas: shooting stars that dazzle, glamour, and drought ---------- */
F('xstar',{c:1,a:2,h:1,f:'fh',tag:'pair',t:'Flying. Charge. It burns out at the end of their turn. When it dies, it dazzles a random opposing army member (tapped).',
 end:(s,o,c)=>{fDestroy(c)},die:(s,o)=>{const t=fRnd(cr(o).filter(x=>!x.tap));if(t){fTap(t);log('A falling star dazzles '+fNm(t)+'.')}}});
F('xench',{c:2,a:2,h:3,f:'',tag:'pair',t:'At the start of your turn, your strongest untapped army member is enchanted: it stays tapped this turn.',
 oup:(s,o)=>{const t=fTop(cr(o).filter(x=>!x.tap));if(t){fTap(t);log('A Pairika enchants '+fNm(t)+'.')}}});
F('xmush',{c:3,a:3,h:3,f:'fh',tag:'pair',t:'Flying. Charge. When it enters, each opposing army member without Flying takes 1 damage.',etb:(s,o)=>{cr(o).filter(x=>!has(x,'f')).forEach(x=>{x.dmg+=1})}});
F('xdroug',{c:4,a:4,h:4,f:'',tag:'pair',t:'Drought: you get 1 less mana each turn (never below 1).',oup:(s,o)=>{if(o.mana>1){o.mana--;log('Drought: the fields forget to grow (you get 1 less mana).')}}});
F('xglam',{c:2,t:'Glamour: until their next turn, target army member has 0 power.',
 ai:(s,o)=>{const t=fTop(fTg(o).filter(x=>pw(x)>=3));return t?{s:2+pw(t),t}:null},fx:(s,o,t)=>{if(t)fHold(t,-pw(t),0,s)}});
DK('The Pairikas',{d:'xstar:5,xench:4,xmush:2,xdroug,xglam:2',hint:'Shooting stars that dazzle your army and starve your mana'});

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

/* ---------- Mammon's Hoard: gold that compounds, hirelings, bribes ---------- */
const fGold=(s,n)=>{s.gold=Math.max(0,(s.gold||0)+n);if(n>0)log('Mammon\'s hoard: '+s.gold+' gold.')};
F('xcoin',{c:1,a:1,h:2,f:'',tag:'mam',t:'When it enters, they gain 1 gold. (At the start of their turn, every 2 gold is 1 extra mana.)',etb:s=>fGold(s,1)});
F('xhoard',{c:2,a:2,h:4,f:'',tag:'mam',t:'At the end of their turn, each mana they left unspent becomes 1 gold. Gets +1/+0 for every 2 gold.',
 end:s=>{if(s.mana>0)fGold(s,s.mana)},self:c=>[Math.floor((sideOf(c).gold||0)/2),0]});
F('xmerc',{c:2,a:3,h:3,f:'h',tag:'mam',t:'Charge. Loyal only while paid: at the start of their turn they pay 1 gold, or it walks off to their hand.',
 up:(s,o,c)=>{if((s.gold||0)>=1){s.gold--;return}s.bf.splice(s.bf.indexOf(c),1);Object.assign(c,{dmg:0,tap:0,def:0,pa:0,pd:0,ta:0,td:0});s.hand.push(c);log('Unpaid, the Mercenary walks off.')}});
F('xmamg',{c:4,a:3,h:6,f:'',tag:'mam',t:'Gets +1/+1 for each gold (at most +6/+6). At the start of their turn, they gain 1 gold. When it dies, the hoard rots: all their gold is lost.',
 self:c=>{const n=Math.min(6,sideOf(c).gold||0);return[n,n]},up:s=>fGold(s,1),die:s=>{if(s.gold){s.gold=0;log('Moth and rust: Mammon\'s gold is lost.')}}});
F('xbribe',{c:2,t:'Bribe: return target opposing army member that costs no more than their gold + 1 to its owner\'s hand. They spend that much gold.',
 ai:(s,o)=>{const g=(s.gold||0)+1;const t=fTop(fTg(o).filter(x=>D[x.id][1]<=g&&D[x.id][1]>=2));return t?{s:2+ev(t)*.6,t}:null},fx:(s,o,t)=>{if(!t)return;s.gold=Math.max(0,(s.gold||0)-Math.max(0,D[t.id][1]-1));bounce(t)}});
F('xmam',{t:'Ward. Each mana you leave unspent at the end of your turn gives their army members +1/+0 during their next turn (up to +3). At the start of their turn, every 2 gold is 1 extra mana.',
 up:s=>{const m=Math.floor((s.gold||0)/2);if(m){s.mana+=m;log('Mammon spends from the hoard (+'+m+' mana).')}}});
DK("Mammon's Hoard",{d:'xcoin:5,xhoard:4,xmerc:3,xmamg,xbribe:2',hint:'Gold piles up and turns into mana and muscle; kill Mammon and the hoard rots'});

/* ---------- Mastema's Spirits: the Accuser writes down every blow; a test can be passed ---------- */
const fAcc=(c,n)=>{c.acc=(c.acc||0)+n};
F('xacc',{c:1,a:1,h:2,f:'f',tag:'mast',t:'Flying. Whenever one of your army members attacks, it is accused once more.',dfd:(s,o,c,S)=>{S.forEach(x=>fAcc(x,1))}});
F('xtenth',{c:2,a:2,h:2,f:'',tag:'mast',t:'When it enters, a 1/1 Spirit joins it: the tenth that was left free.',etb:s=>fSum(s,'xspir',1)});
F('xspir',{tag:'mast',t:'Left free to test the sons of men.'});
F('xtempt',{c:3,a:3,h:3,f:'',tag:'mast',t:'At the start of your turn, your weakest untapped army member is tempted: it must attack this turn.',
 oup:(s,o)=>{const t=fLow(cr(o).filter(x=>!x.tap&&!has(x,'k')&&pw(x)>0));if(t){t.forced=1;t.def=0;log(fNm(t)+' is tempted: it must attack.')}}});
F('xmastg',{c:4,a:4,h:4,f:'f',tag:'mast',t:'Flying. Your accused army members get -1/-0 for each accusation.',oaura:(x)=>[-(x.acc||0),0]});
F('xtest',{c:2,t:'A trial: target opposing army member with no accusations is accused twice; an accused one takes 2 damage for each accusation.',
 ai:(s,o)=>{const k=fTop(fTg(o).filter(x=>x.acc&&fHp(x)<=2*x.acc));if(k)return{s:3+ev(k)*.8,t:k};const t=fTop(fTg(o).filter(x=>!x.acc));return t?{s:2.5,t}:null},
 fx:(s,o,t)=>{if(!t)return;if(t.acc)t.dmg+=2*t.acc;else fAcc(t,2)}});
F('xmast',{t:'Ward. Each of your army members that attacks is accused. At the start of their turn, each accused army member takes 1 damage per accusation. An army member that stays out of the attack for a whole turn passes the test: its accusations are cleared.',
 dfd:(s,o,c,S)=>{S.forEach(x=>{fAcc(x,1);x.accT=G.turn})},
 up:(s,o)=>{for(const x of cr(o)){if(!x.acc)continue;if(x.accT!==G.turn){x.acc=0;log(fNm(x)+' passes the test: its accusations are cleared.');continue}x.dmg+=x.acc}if(cr(o).some(x=>x.acc))log('The Accuser reads out what he has written.')}});
DK("Mastema's Spirits",{d:'xacc:5,xtenth:3,xtempt:3,xmastg,xtest:2',hint:'Every army member that attacks is accused, and accusations pile up; holding back clears them'});

/* ---------- King Paimon's Procession: heralds first, then the king who teaches ---------- */
F('xher',{c:1,a:1,h:2,f:'',tag:'paim',t:'When it enters, one of their army members learns a keyword (Flying, Ward, Charge or Ruthless).',etb:s=>a3Learn(s,1)});
F('xlegs',{c:2,a:2,h:3,f:'',tag:'paim',t:'Gets +1/+1 for each keyword it has (at most +3/+3).',self:c=>{const n=Math.min(3,c.f.split('').filter(k=>KWT[k]).length);return[n,n]}});
F('xdrom',{c:3,a:3,h:3,f:'h',tag:'paim',t:'Charge. When it attacks, it learns a keyword.',atk:(s,o,c)=>{const ks='fwr'.split('').filter(k=>!c.f.includes(k));if(ks.length){const k=ks[Math.random()*ks.length|0];fKey(c,k);log('The Dromedary Rider learns '+({f:'Flying',w:'Ward',r:'Ruthless'})[k]+'.')}}});
F('xpaimon',{c:4,a:4,h:5,f:'',tag:'paim',t:'He roars as he arrives: each of their army members learns a keyword. While a Herald lives, he teaches one more each turn.',
 etb:s=>a3Learn(s,cr(s).length),up:s=>{if(s.bf.some(x=>x.id=='xher'))a3Learn(s,1)}});
F('xsecr',{c:2,t:'Secret Arts: target opposing army member loses its keywords, and one of their army members learns them.',
 ai:(s,o)=>{const t=fTop(fTg(o).filter(x=>x.f.split('').some(k=>'fwhrvdzbsx'.includes(k))));return t&&cr(s).length?{s:2.5+ev(t)*.4,t}:null},
 fx:(s,o,t)=>{if(!t)return;const ks=t.f.split('').filter(k=>'fwhrvdzbsx'.includes(k));t.f=t.f.split('').filter(k=>!ks.includes(k)).join('');const r=fTop(cr(s));if(r)ks.forEach(k=>fKey(r,k));log('Paimon reveals secret things: '+fNm(t)+' loses its keywords.')}});
DK("King Paimon's Procession",{d:'xher:5,xlegs:4,xdrom:2,xpaimon,xsecr:2',hint:'Kill the heralds first: while they play, the procession keeps learning'});

/* ---------- Beelzebub: the swarm born from every death ---------- */
F('xbeelg',{c:4,a:4,h:5,f:'f',tag:'fly',t:'Flying. Their Flies get +1/+0. Whenever one of their Flies dies, you take 1 damage.',aura:x=>[x.id=='xfly'?1:0,0],allyDie:(s,o,c,x)=>{if(x.id=='xfly')fHurt(o,1,'The lord of the flies. ')}});
F('xbaal',{c:2,a:2,h:3,f:'',tag:'fly',t:'The false oracle: at the start of their turn, if they have a Fly, they draw a card.',up:s=>{if(s.bf.some(x=>x.id=='xfly'))draw(s,1)}});
F('xcarr',{c:1,a:2,h:1,f:'',tag:'fly',t:'Whenever any army member dies, it gets +1/+0 (at most +3).',allyDie:(s,o,c)=>{if(c.pa<3)c.pa++},oppDie:(s,o,c)=>{if(c.pa<3)c.pa++}});
F('xfly',{tag:'fly',t:'Flying. Nothing that dies near him stays empty for long.'});
DK('Beelzebub, Lord of the Flies',{d:'xbeelg,xbaal:6,xcarr:6',hint:'Every army member of his that dies leaves a Fly behind, and the flies feed his oracle'});

/* ---------- Azazel: the scapegoat who arms others ---------- */
F('xazag',{c:4,a:4,h:6,f:'k',tag:'aza',t:'Can only defend: he teaches war rather than waging it. At the start of their turn he arms one of their army members: +2/+0 permanently.',
 up:(s,o,c)=>{const t=fTop(cr(s).filter(x=>x!==c&&!has(x,'k')));if(t){t.pa+=2;log('Azazel arms '+fNm(t)+' (+2/+0).')}}});
F('xsmith',{c:2,a:2,h:3,f:'',tag:'aza',t:'When it enters, it forges a blade for their strongest other army member: +2/+0 permanently.',etb:(s,o,c)=>{const t=fTop(cr(s).filter(x=>x!==c));if(t){t.pa+=2;log('A Forbidden Smith arms '+fNm(t)+'.')}}});
DK('Azazel, the Scapegoat',{d:'xazag,xsmith:6,xwat:4,xcurse:2',hint:'He arms his own army, and every loss of his is laid on your strongest army member'});

/* ---------- Asmodeus: jealousy that strikes the newcomer; Aeshma, wrath ---------- */
F('xasmg',{c:5,a:5,h:5,f:'r',tag:'asm',t:'Ruthless. At the start of their turn, your newest army member takes 2 damage: whatever comes first into his sight, he hates.',
 up:(s,o)=>{const t=fNewest(o);if(t){t.dmg+=2;log('Asmodeus strikes '+fNm(t)+'.')}}});
F('xjeal',{c:1,a:2,h:1,f:'',tag:'asm',t:'Whenever you play an army member, it gets +1/+0 (at most +3).',oppEnter:(s,o,c)=>{if(c.pa<3)c.pa++}});
F('xwrath',{c:2,a:3,h:2,f:'n',tag:'asm',t:'Can only attack. When it dies, your newest army member takes 2 damage.',die:(s,o)=>{const t=fNewest(o);if(t){t.dmg+=2;log('Wrath strikes '+fNm(t)+'.')}}});
DK('Asmodeus',{d:'xasmg,xjeal:6,xwrath:6',hint:'Jealous of newcomers: whatever you play last is what he hurts'});

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
