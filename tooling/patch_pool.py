# v104: shared pool layout for every hero.
# Each hero's draft pool is 80 cards: three archetypes of 24 (8 Common / 7 Uncommon / 6 Rare / 3 Legendary)
# plus 8 generics (2 Common / 3 Uncommon / 3 Legendary) = 26 / 24 / 18 / 12.
# The three generic Legendaries are Divine Karma and Divine Intervention (universal, in every pool) plus one
# hero Legendary (Odysseus: the Trojan Horse, Odin: Odin the Allfather, Wukong: Equal to Heaven).
# Cut to make room: Iris (Odysseus), Funeral Pyre and Peach Banquet (Wukong).

POOLS = {
 'ody': {
  'O': {'C': 'argus augur camp herm ox pythia tbull hecat', 'U': 'cass eagle mino ossuary pyre sphinx telem',
        'R': 'altar cerb thanat zeus games requiem', 'L': 'hades iph charon'},
  'R': {'C': 'corsair harrier thess spoils fury sapper plunder raidr', 'U': 'banner dio2 helios nike ram reaver zerk',
        'R': 'agam ares eury sack bow thunder', 'L': 'pent horde achil'},
  'P': {'C': 'hopl sent peltast rampart doct drill salve owl', 'U': 'capt gate pikeman veteran wall bastion hearth',
        'R': 'brasidas shield testudo medic myrsh closer', 'L': 'leon thermo ajax'},
  '-': {'C': 'rally hammer', 'U': 'gale muse pegasus', 'L': 'karma dint horse'}},
 'odin': {
  'B': {'C': 'bldr bsrk fjrd gslay howl sprm ulf wulf', 'U': 'egil hamr mhall rage skul bdrunk hoff',
        'R': 'blod lstd rend roar ulfk mjol', 'L': 'star thor bodvar'},
  'V': {'C': 'einw huscl ofr shmd stdb thegn vmar vinit', 'U': 'eir ghall hguard tithe skld slst valk',
        'R': 'gunn host jarl sigur vfea slei', 'L': 'bald brynh freyja'},
  'H': {'C': 'blot hugi muni reir scrb skal alg ansu', 'U': 'fylg rfly rser ruru seid tiwa volv',
        'R': 'fehu hagl hrav mimr hgod tyr', 'L': 'ygg othala bragi'},
  '-': {'C': 'kvas vlnd', 'U': 'hela idun loki', 'L': 'karma dint odn'}},
 'wukong': {
  'W': {'C': 'wspin wgrow wsent wpierce wblock wcounter wdodge wgate', 'U': 'wcloudr wbear wvang wrally wflurry wburn wtypes',
        'R': 'wsmash wrout wpig wbreak wmyriad wsplit', 'L': 'wruyi wking wbigstaff'},
  'C': {'C': 'waugury wpluck wvolley wclone wfeint wwine wchamel wskin', 'U': 'wtroop whstorm wcloudh wacro wlegion wmirm wnull',
        'R': 'wmirror wdisc wgreat wchange wecho wxform', 'L': 'wthou wmillion wsix'},
  'T': {'C': 'wfoot wdance wslip wfurn wledger wcloudm wunravel wpeachk', 'U': 'wwind wseal wpocket wpeachc wdrum worchard wcycle',
        'R': 'wheist wmount wnez wpeachg wtree wjug', 'L': 'wtang wsandy wfan'},
  '-': {'C': 'wstep wdrink', 'U': 'wmist wgust wunward', 'L': 'karma dint wqt'}},
}
SHAPE_ARCH = {'C': 8, 'U': 7, 'R': 6, 'L': 3}
SHAPE_GEN = {'C': 2, 'U': 3, 'R': 0, 'L': 3}
for _h, _arch in POOLS.items():
    _seen = set()
    for _a, _rar in _arch.items():
        _shape = SHAPE_GEN if _a == '-' else SHAPE_ARCH
        for _r, _n in _shape.items():
            _ids = _rar.get(_r, '').split()
            assert len(_ids) == _n, (_h, _a, _r, len(_ids), _n)
            for _x in _ids:
                assert _x not in _seen, (_h, 'duplicate', _x)
                _seen.add(_x)
    assert len(_seen) == 80, (_h, len(_seen))

import json as _json
NEW = r"""
/* ===== v104: shared pool layout (3 archetypes x 24 + 8 generics; 26/24/18/12) ===== */
Object.assign(D,{
 dint:['Divine Intervention',2,'E',0,0,'','The first time you would drop to 0 life this fight, your life becomes 5 instead and Divine Intervention is destroyed.','🕊️','A'],
 raidr:['Ithacan Raider',2,'C',2,2,'rh','','⛵','R',1],
 myrsh:['Myrmidon Shield-Bearer',3,'C',2,6,'p','When it enters, your other Phalanx army members get +0/+2 permanently.','🛡️','W',2],
 closer:['Close Ranks',2,'S',0,0,'','Your Phalanx army members switch to defense form and get +1/+1 permanently.','🧱','W'],
 bodvar:['Bödvar Bjarki, the Bear-Spirit',4,'C',4,5,'','While you are Wounded, it gets +3/+3.','🐻','R',3],
 vinit:['Valhalla Initiate',2,'C',2,2,'','When it dies, deal 2 damage to a random opposing army member.','⚔️','W',1],
 freyja:['Freyja, Lady of the Slain',4,'C',3,5,'f','When it enters, return the two most expensive army members from your graveyard to your hand.','🌸','W',3],
 othala:['Othala, Rune of Heritage',2,'E',0,0,'','Carve 2. At the start of your turn, draw a card and gain 1 life.','ᛟ','U'],
 bragi:['Bragi, God of Poetry',3,'C',2,4,'','When it enters, draw a card for each Rune you control (up to 3). Your Carve costs are reduced by 1.','🎶','U',2]
});
D.horse=['Trojan Horse',3,'A',0,0,'','Two turns from now: make three 2/3 Greek Soldiers, then sacrifice this.','🐴','A'];
Object.assign(LORE,{dint:'Grace of the One True God',raidr:'Ithacan sailor',myrsh:'Myrmidon',closer:'Phalanx drill',bodvar:'Bear-warrior',
 vinit:'Fallen recruit',freyja:'Goddess of the slain',othala:'Rune of heritage',bragi:'God of poetry',horse:'The gift of the Greeks'});
LC.othala=2;
/* v110: Blood price cards for Odin (replacing Spear-Gash, Skar, Battlefield Scavenger, Galdr of Winds, Weaving of Wyrd, Mead of Poetry) */
Object.assign(D,{
 blot:['Blót Bowl',1,'E',0,0,'','Carve 1. Your Blood price costs 1 less (never less than 1).','🥣','U'],
 hgod:['The Hanged God',3,'E',0,0,'','Carve 2. You can pay Blood price twice per turn.','🌳','U'],
 bdrunk:['Blood-Drunk Berserker',2,'C',2,2,'','Whenever you pay Blood price, it gets +1/+1 for the rest of the fight.','🩸','R',1],
 hoff:['Hanged Man\'s Offering',1,'I',0,0,'','Your army members get +1/+0 until end of turn (+2/+0 if you paid Blood price this turn).','🪢','R'],
 tithe:['Tithe of the Slain',2,'E',0,0,'','Whenever you pay Blood price, gain 1 life back (2 if 3 or more of your army members have died this fight). At most once per turn.','⚱️','W'],
 kvas:['Mead of Kvasir',1,'S',0,0,'','Your Blood price drops back to its starting cost for this fight. Draw a card.','🍯','A']});
Object.assign(LORE,{blot:'Sacrificial bowl',hgod:'Nine nights on the World-Tree',bdrunk:'Drunk on his own blood',hoff:'A gift to the gallows-lord',tithe:'The Valkyries take their share',kvas:'The wisest of beings, brewed into mead'});
LC.blot=1;LC.hgod=2;
FX.hoff=s=>{const n=((s.bp||0)>0?2:1)+mg();cr(s).forEach(c=>{c.ta+=n});log('Hanged Man\'s Offering: your army gets +'+n+'/+0.')};
FX.kvas=(s,o)=>{if(G.e)G.e.bpn=0;draw(s,1);log('Mead of Kvasir: your Blood price returns to its starting cost.')};
Object.assign(ETB,{
 myrsh:s=>{const L=cr(s),me=L[L.length-1];L.filter(x=>x!==me&&has(x,'p')).forEach(x=>{x.pd+=2});log('The Myrmidon locks shields: your Phalanx gets +0/+2.')},
 freyja:s=>{let n=0;for(let i=0;i<2;i++){const g=s.gy.filter(x=>isC(x)&&!TOKE.includes(x.id)).sort((a,b)=>D[b.id][1]-D[a.id][1]);if(!g.length)break;const x=g[0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;s.hand.push(x);n++}if(n)log('Freyja claims her share of the slain: '+n+' return to your hand.')},
 bragi:s=>{const n=Math.min(3,s.bf.filter(x=>LC[x.id]).length);if(n){draw(s,n);log('Bragi sings of your runes: you draw '+n+'.')}}
});
FX.closer=(s,o)=>{cr(s).filter(x=>has(x,'p')).forEach(x=>{if(!x.att)x.def=1;x.pa++;x.pd++});log('Close ranks: your Phalanx braces and gets +1/+1.')};
Object.assign(DEATH,{vinit:{p:3,fn:(s,o)=>{const E=tg(o),t=E[Math.random()*E.length|0];if(t){t.dmg+=2;log('The Initiate\'s last blow strikes '+D[t.id][0]+' for 2.')}}}});
function dintChk(){for(const s of [G.p,G.e]){if(!s||!s.bf||s.life>0)continue;const d=s.bf.find(x=>x.id=='dint');if(!d)continue;s.bf.splice(s.bf.indexOf(d),1);bury(s,d);s.life=5;log('Divine Intervention: '+(s===G.p?'you are':(s.nm||'the enemy')+' is')+' spared at the brink of death (5 life).')}}
{const P=__POOLS__;for(const h in P){const pool=[];for(const a in P[h])for(const r in P[h][a])P[h][a][r].split(' ').filter(Boolean).forEach(x=>{RAR[x]=r;if(a=='-')delete TAG[x];else TAG[x]=a;pool.push(x)});CHARS[h].pool=pool}}
""".replace('__POOLS__', _json.dumps(POOLS))
_b3("/* ===== v103 balance pass ===== */", NEW + "\n/* ===== v103 balance pass ===== */")

# rules hooks
_b3("function chk(){instCap();", "function chk(){instCap();dintChk();")
_b3("if(c.id=='hamr'&&wnd(s))n+=2;\n return n+omg(c,'ruru')", "if(c.id=='hamr'&&wnd(s))n+=2;if(c.id=='bodvar'&&wnd(s))n+=3;\n return n+omg(c,'ruru')")
_b3("if(c.id=='hamr'&&wnd(s))n+=2;\n const a=omg(c,'alg')", "if(c.id=='hamr'&&wnd(s))n+=2;if(c.id=='bodvar'&&wnd(s))n+=3;\n const a=omg(c,'alg')")
_b3("G.p.bf.some(x=>x.id=='rser'))?1:0)):0};", "G.p.bf.some(x=>x.id=='rser'||x.id=='bragi'))?1:0)):0};")
_b3(" if(n('ygg')){", " if(n('othala')){draw(s,n('othala'));s.life=Math.min(s.max,s.life+n('othala'));log('Othala: a card and 1 life from your ancestors.')}\n if(n('ygg')){")
_b3("for(let i=0;i<Math.min(2,room);i++)enter(p,mk('sold'));log(room<2?'The Trojan Horse opens, but the army is full ('+room+' Soldier'+(room==1?'':'s')+').':'The Trojan Horse opens: two Soldiers!')",
    "for(let i=0;i<Math.min(3,room);i++)enter(p,mk('sold'));log(room<3?'The Trojan Horse opens, but the army is nearly full ('+room+' Soldier'+(room==1?'':'s')+').':'The Trojan Horse opens: three Soldiers!')")
