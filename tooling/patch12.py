# ===== three new opponents: Shades of Hades (black), Phaeacians (white), Cicones (red) =====
def _b3(o,n):
    global head,tail,mid,A,B
    for nm in ('head','mid','tail','A','B'):
        t=globals()[nm]
        if t.count(o)==1:
            globals()[nm]=t.replace(o,n);return
    raise AssertionError(o[:70])
head=rep(head,"const AC={P:'W'","""D.shade1=['Restless Shade',1,'C',1,2,'e',`Restless: the first time it dies, it returns to its owner's hand.`,'👻','B',1];
D.mourner=['Mourning Shade',2,'C',2,2,'e','When it dies, draw a card.','🥀','B',1];
D.warden=['Erebus Warden',3,'C',2,4,'ez','','⚰️','B',2];
D.tiresias=['Tiresias, the Seer',4,'C',1,3,'e','Gets +1/+1 for every 4 cards in both graveyards.','🔮','B',2];
D.libation=['Libation of Blood',4,'S',0,0,'','Return the two most recent army members from your graveyard to your army.','🍷','B'];
D.pit=['Pit of the Dead',2,'A',0,0,'','Whenever one of your army members dies, deal 1 damage to the opponent.','🕳️','B'];
D.shroud=['Shroud of Erebus',2,'E',0,0,'','Your Shade army members get +1/+1.','🌑','B'];
D.curse=['Withering Curse',2,'S',0,0,'','Target army member gets -2/-2.','💀','B'];
D.oarsman=['Phaeacian Oarsman',1,'C',1,2,'l','','🚣','W',1];
D.navig=['Phaeacian Navigator',2,'C',1,3,'ls','','🧭','W',1];
D.phguard=['Scherian Guard',3,'C',2,4,'l','','🛡️','W',2];
D.nausi=['Nausicaa',2,'C',1,3,'l','When it enters, gain 3 life.','🌸','W',1];
D.alcinous=['King Alcinous',5,'C',3,5,'ls','When it enters, restore all your army members to full health and gain 4 life.','👑','W',3];
D.blackship=['The Black Ship',4,'A',0,0,'','Your Fleet army members have Ward.','⛵','W'];
D.sails=['Favoring Winds',2,'E',0,0,'','Your Fleet army members get +1 power.','🌬️','W'];
D.gift=['Gift of Hospitality',2,'S',0,0,'','Gain 4 life. Restore 2 health to each of your army members.','🎁','W'];
D.mraid=['Cicone Raider',1,'C',2,1,'mh','','🪓','R',1];
D.mskirm=['Cicone Skirmisher',2,'C',2,2,'mh','','⚔️','R',1];
D.mpill=['Cicone Pillager',3,'C',3,2,'mh','','🔥','R',2];
D.chief=['Ismarus Chieftain',4,'C',3,3,'mhy','','🏴','R',2];
D.drums=['War Drums',2,'E',0,0,'','Your Marauders get +1 power.','🥁','R'];
D.burn=['Burn the Granaries',3,'S',0,0,'','Deal 2 damage to the opponent for each Marauder you control.','🌾','R'];
D.javel=['Javelin Volley',2,'S',0,0,'','Deal 3 damage to target army member.','🎯','R'];
const AC={P:'W'""")
head=rep(head,"const LORE={","const LORE={shade1:'Restless dead',mourner:'Shade of mourning',warden:'Guardian of the dead',tiresias:'Blind prophet',oarsman:'Phaeacian sailor',navig:'Phaeacian pilot',phguard:'Phaeacian guard',nausi:'Phaeacian princess',alcinous:'Phaeacian king',mraid:'Cicone warrior',mskirm:'Cicone warrior',mpill:'Cicone warrior',chief:'Cicone chief',")
head=rep(head,"camp:'O',herm:'O',","camp:'O',herm:'O',shade1:'E',mourner:'E',warden:'E',tiresias:'E',pit:'E',shroud:'E',oarsman:'F',navig:'F',phguard:'F',nausi:'F',alcinous:'F',blackship:'F',sails:'F',mraid:'M',mskirm:'M',mpill:'M',chief:'M',drums:'M',")
head=rep(head,"const ARCH={","const ARCH={E:'Shades',F:'Fleet',M:'Marauders',")
head=rep(head,"const ids=s=>","RAR.shade1=RAR.mourner=RAR.oarsman=RAR.navig=RAR.mraid=RAR.mskirm='C';RAR.warden=RAR.phguard=RAR.nausi=RAR.mpill=RAR.pit=RAR.shroud=RAR.sails=RAR.drums=RAR.curse=RAR.gift=RAR.javel='U';RAR.tiresias=RAR.alcinous=RAR.chief=RAR.libation=RAR.blackship=RAR.burn='R';\nconst ids=s=>")
_b3("r:'Ruthless: it gets +1 power while in attack form.',","r:'Ruthless: it gets +1 power while in attack form.',e:'Shade: one of the restless dead (the Shades archetype). Shrouds, the Pit and the size of the graveyards make Shades stronger.',l:'Fleet: this army member gets +1/+1 while its controller controls another Fleet army member (the Phaeacians).',m:'Marauder: a swift raider of the Cicones (the Marauders archetype). War Drums and Burn the Granaries reward having many.',")
_b3("[/\\bruthless\\b/i,'Ruthless',KWL.r]","[/\\bruthless\\b/i,'Ruthless',KWL.r],[/\\brestless\\b/i,'Restless',\"the first time it dies, it returns to its owner's hand.\"],[/\\bshades?\\b/i,'Shade',KWL.e],[/\\bfleet\\b/i,'Fleet',KWL.l],[/\\bmarauders?\\b/i,'Marauder',KWL.m],[/\\bgraveyards?\\b/i,'Graveyard','the pile of cards that have died or been used.']")
# engine
_b3("const has=(c,x)=>c.f.includes(x),","const has=(c,x)=>c.f.includes(x)||(x=='w'&&c.f.includes('l')&&own(c,'blackship')),")
_b3("+(has(c,'g')&&own(c,'forge')?1:0);","+(has(c,'g')&&own(c,'forge')?1:0)+(has(c,'e')&&own(c,'shroud')?1:0)+(c.id=='tiresias'&&sideOf(c)?Math.floor((G.p.gy.length+G.e.gy.length)/4):0)+(has(c,'l')&&(s=>!!s&&s.bf.some(x=>x!==c&&isC(x)&&has(x,'l')))(sideOf(c))?1:0);")
_b3("+aur(c)+qb(c);","+(has(c,'m')&&own(c,'drums')?1:0)+(has(c,'l')&&own(c,'sails')?1:0)+aur(c)+qb(c);")
_b3("for(const[s,c]of dead){s.bf.splice(s.bf.indexOf(c),1);bury(s,c);log(D[c.id][0]+' dies.')}","for(const[s,c]of dead){s.bf.splice(s.bf.indexOf(c),1);bury(s,c);log(D[c.id][0]+' dies.')}\nfor(const[s,c]of dead){const n=s.bf.filter(x=>x.id=='pit').length;if(n){oppOf(s).life-=n;log('The Pit of the Dead strikes for '+n+'.')}}")
_b3("Q.push({p:t.p,a:s===actSide()?0:1,s,fn:t.fn})","Q.push({p:t.p,a:s===actSide()?0:1,s,c,fn:t.fn})")
_b3("Q.forEach(q=>q.fn(q.s,oppOf(q.s)))","Q.forEach(q=>q.fn(q.s,oppOf(q.s),q.c))")
_b3("const DEATH={","const DEATH={shade1:{p:4,fn:(s,o,c)=>{if(c.rt)return;c.rt=1;const i=s.gy.indexOf(c);if(i<0)return;s.gy.splice(i,1);c.sick=1;s.hand.push(c);log('The Restless Shade drifts back to its owner\\'s hand.')}},mourner:{p:2,fn:s=>draw(s,1)},")
_b3("drill:s=>","libation:(s,o)=>{for(let n=0;n<2&&cr(s).length<5;n++){let j=-1;for(let i=s.gy.length-1;i>=0;i--){const x=s.gy[i];if(isC(x)&&x.id!='sold'){j=i;break}}if(j<0)break;const c=s.gy.splice(j,1)[0];enter(s,c);log(D[c.id][0]+' rises from the dead.')}},burn:(s,o)=>{const n=cr(s).filter(c=>has(c,'m')).length;o.life-=2*n;log('The granaries burn for '+2*n+'.')},gift:s=>{s.life+=4;cr(s).forEach(c=>heal(c,2))},curse:(s,o,t)=>{t.pa-=2;t.pd-=2},javel:(s,o,t)=>{t.dmg+=3},drill:s=>")
_b3("const ETB={","const ETB={nausi:s=>{s.life+=3},alcinous:s=>{s.life+=4;cr(s).forEach(c=>{c.dmg=0})},")
_b3("const ETBV={","const ETBV={nausi:1,alcinous:3,")
_b3("const IV={","const IV={pit:7,shroud:6,blackship:8,sails:6,drums:7,")
_b3("const AU={garden:'q',forge:'g',skies:'f'}","const AU={garden:'q',forge:'g',skies:'f',shroud:'e',blackship:'l',sails:'l',drums:'m'}")
_b3("case'hurl':{","case'curse':{const T=best(M.filter(x=>th(x)-x.dmg<=2));return T?{s:3+ev(T)*.6,t:T}:null}case'javel':{const k=M.filter(x=>th(x)-x.dmg<=3).sort((a,b)=>ev(b)-ev(a))[0];return k?{s:2.5+ev(k)*.8,t:k}:null}case'gift':return(e.life<=e.max-4||hurt)?{s:3+(e.max-e.life)/2.5+(cr(p).reduce((n,x)=>n+pwr(x),0)>=e.life-4?4:0)}:null;case'libation':{const n=Math.min(2,5-cr(e).length,e.gy.filter(x=>isC(x)&&x.id!='sold').length);return n>=1?{s:3+n*3.5}:null}case'burn':{const d=2*cr(e).filter(x=>has(x,'m')).length;return d>=p.life?{s:90}:d>=4?{s:3+d*.9}:null}case'hurl':{")
# opponents list
head=rep(head,"Object.assign(D,{\nwall:","""EN[0].ic='🪷';EN[0].hint='Taps and freezes your army';EN[0].bg=['#0b1a14','#2f5a3a'];EN[1].ic='🧜';EN[1].hint='Flyers and the Sirens\\' song';EN[1].bg=['#07131f','#1f5a78'];EN[2].ic='👁️';EN[2].hint='Giant Cyclops and boulders';EN[2].bg=['#1a0b07','#6b2a14'];
EN.push({n:'The Shades of Hades',l:20,ic:'💀',hint:'Returning dead and graveyard power',bg:['#0b0b14','#3a2a52'],d:ids('shade1:3,mourner:3,warden:2,tiresias,libation,pit,shroud,curse')},
{n:'The Phaeacians',l:20,ic:'⛵',hint:'A warded, healing fleet',bg:['#0f1c28','#4d7a8a'],d:ids('oarsman:3,navig:3,phguard:3,nausi,alcinous,blackship,sails,gift:2,tide')},
{n:'The Cicones',l:20,ic:'🪓',hint:'Charging marauders and fire',bg:['#200808','#8a2a1a'],d:ids('mraid:4,mskirm:3,mpill:2,chief:2,drums,burn:2,javel:2')});
Object.assign(D,{
wall:""")
