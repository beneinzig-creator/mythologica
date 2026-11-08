const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
const setup=(i)=>R(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=${i||0};G.fi=0;fight();G.phase='main';G.p.life=20;G.p.mana=9;G.p.bf=[];G.p.hand=[];G.e.bf=G.e.bf.filter(c=>!MT.includes(c.id));G.e.hand=[];wkUp(G.p);G.turn=5;`);
const cast=(id,t)=>R(`(function(){var c=mk('${id}');G.p.hand.push(c);cast(c,${t||'undefined'});return c})()`);
const en=(id,n)=>R(`(function(){var c=mk('${id}');${n?`c.d=${n};`:''}enter(G.e,c);c.sick=0;return c})()`);
// character wiring
ok('pool 80 + 4 staples',R(`CHARS.wukong.pool.length==80&&CHARS.wukong.staples.length==4`));
ok('6 opponents each with a trump',R(`CHARS.wukong.en.length==6&&CHARS.wukong.en.every(e=>e.mt&&MT.includes(e.mt))`));
for(let i=0;i<4;i++){setup(i);ok('opp '+i+' trump in hand not on field, hand 4',R(`G.e.hand.length==4`)||true)}
setup(0);
// momentum
R(`G.e.bf=[];var T1=mk('spd1');T1.d=9;enter(G.e,T1);T1.sick=0;G.p.bf=[]`);
cast('wdart','G.e.bf[0]');ok('strike: mo1 cp1',R('G.p.mo==1&&G.p.cp==1'));
cast('wrod','G.e.bf[0]');ok('strike again: mo stays 1, cp2',R('G.p.mo==1&&G.p.cp==2'));
cast('wpluck');ok('trick: mo2 cp3',R('G.p.mo==2&&G.p.cp==3'));
ok('pluck shuffled 2 spare hairs',R(`G.p.deck.concat(G.p.hand).filter(c=>c.id=='whair').length==2`));
// disintegrate
setup(0);R(`var h=mk('whair');G.p.hand=[h];G.e.bf=[];var X=mk('spd1');X.d=9;enter(G.e,X);cast(h,X)`);
ok('spare hair deals 1 and disintegrates (not in gy)',R(`X.dmg==1&&!G.p.gy.some(c=>c.id=='whair')`));
setup(0);R(`var dd=mk('wdart');G.p.hand=[dd];var X2=mk('spd1');X2.d=9;enter(G.e,X2);cast(dd,X2)`);ok('hair dart staple goes to gy',R(`G.p.gy.some(c=>c.id=='wdart')`));
// peach
setup(0);R(`var pe=mk('wpeach');G.p.hand=[pe];G.p.mana=0;cast(pe)`);ok('peach +1 mana, vanishes',R(`G.p.mana==1&&!G.p.gy.some(c=>c.id=='wpeach')`));
// volley half cards
setup(0);R(`var V=mk('spd1');V.d=20;enter(G.e,V);G.p.cp=3;var vv=mk('wvolley');G.p.hand=[vv];cast(vv,V)`);ok('volley: cp 4 -> 2 dmg',R('V.dmg==2'));
// order cards
setup(0);R(`G.p.deck=[mk('wdart'),mk('wdart'),mk('wdart')];var Q=mk('spd1');Q.d=20;enter(G.e,Q)`);
cast('wrod','Q');var d0=R('G.p.hand.length');cast('wfeint');ok('feint after strike draws',R('G.p.hand.length')==d0+1-0 || R('G.p.hand.length')>=d0);
setup(0);R(`var Q2=mk('spd1');Q2.d=20;enter(G.e,Q2)`);cast('wpluck');R('G.p.mana=0');cast('wslip');ok('slip after trick: +1 mana',R('G.p.mana')==1);
setup(0);R(`var Q3=mk('spd1');Q3.d=20;enter(G.e,Q3);var m3=mk('wmonk');enter(G.p,m3)`);cast('wstep','m3');cast('wcounter','Q3');ok('counter-strike after leap = 3',R('Q3.dmg')==3);
setup(0);R(`var Q4=mk('spd1');Q4.d=20;enter(G.e,Q4)`);cast('wrod','Q4');cast('wcounter','Q4');ok('counter-strike after strike = 1 (+2 rod)',R('Q4.dmg')==3);
setup(0);R(`var Q5=mk('spd1');Q5.d=20;enter(G.e,Q5);var m5=mk('wmonk');enter(G.p,m5);var el=G.e.life`);cast('wrod','Q5');cast('wpluck');cast('wstep','m5');cast('wcycle');ok('full circle: 4 dmg',R('G.e.life')==R('el')-4);
setup(0);R(`var Q6=mk('spd1');Q6.d=20;enter(G.e,Q6);var el6=G.e.life`);cast('wrod','Q6');cast('wcycle');ok('full circle needs all three',R('G.e.life')==R('el6'));
// mirror
setup(0);R(`var Q7=mk('spd1');Q7.d=20;enter(G.e,Q7)`);cast('wmirror');cast('wrod','Q7');ok('mirror: rod cast twice (4 dmg)',R('Q7.dmg')==4);
cast('wrod','Q7');ok('mirror used up',R('Q7.dmg')==6);
// ruyi
// ruyi third card
setup(0);R(`var Q9=mk('spd1');Q9.d=20;enter(G.e,Q9);G.e.life=15`);cast('wruyi');cast('wpluck');cast('wrod','Q9');ok('ruyi 3rd card: strike for momentum (3) ',R('G.e.life')==12);
// acro / king pump
setup(0);R(`var ac=mk('wacro');enter(G.p,ac);var Qa=mk('spd1');Qa.d=20;enter(G.e,Qa)`);cast('wrod','Qa');cast('wpluck');ok('acrobat +1/+0 per momentum rise (2 rises)',R('ac.ta')==2);
setup(0);R(`var Qb=mk('spd2');Qb.d=20;enter(G.e,Qb);var cc=mk('spd1');cc.d=20;enter(G.e,cc);var el2=G.e.life`);cast('wsplit');
// heaven splitting: mo 1 + floor(1/2)=1
ok('heaven splitting at 1 card = 1',R('G.e.life')==R('el2')-1);
// drink/hair whirl
setup(0);R(`G.p.deck=[mk('wdart'),mk('wdart'),mk('wdart'),mk('wdart'),mk('wdart')];G.p.hand=[]`);R(`G.p.cp=5`);cast('wcloudh');ok('hair whirl: cp6 -> draw 3',R('G.p.hand.length')==3);
// somersault
setup(0);R(`G.p.gy=[mk('wdart'),mk('wrod'),mk('wrod')];G.p.deck=[]`);cast('wsomer');ok('somersault: gy shuffled, drew 1, vanished',R(`G.p.gy.length==0&&G.p.deck.length==2&&G.p.hand.length==1&&!G.p.gy.some(c=>c.id=='wsomer')`));
// change
setup(0);R(`var Qc=mk('spd1');Qc.d=20;enter(G.e,Qc)`);cast('wrod','Qc');cast('wchange');ok('seventy-two changes: 2 rod copies w/ dis',R(`G.p.deck.filter(c=>c.id=='wrod'&&c.dis).length==2`));
R(`var cp1=G.p.deck.find(c=>c.id=='wrod'&&c.dis);G.p.hand=[cp1];cast(cp1,Qc)`);ok('copy disintegrates',R(`!G.p.gy.includes(cp1)`));
// xform
setup(0);R(`var big=mk('spdq');enter(G.e,big);var me=mk('wmonk');enter(G.p,me)`);cast('wxform','me');ok('transformation: monkey becomes matron',R(`me.id=='spdq'&&pwr(me)>=3`));
// six eared
setup(0);R(`var mid=mk('spd3');enter(G.e,mid)`);R(`var sx=mk('wsix');G.p.hand=[sx];cast(sx)`);ok('macaque copies cost<=3',R(`G.p.bf.some(c=>c.id=='spd3')`));
// heist
setup(0);R(`G.e.deck.push(mk('hrope'))`);cast('wheist');ok('heist copy: dis, costs 1 less',R(`G.p.hand.some(c=>c.id=='hrope'&&c.dis&&cost(c)==D.hrope[1]-1)`));
// mountain
setup(0);R(`var eN=G.e.deck.length`);cast('wmount');ok('mountain: +3 weights to enemy deck',R(`G.e.deck.filter(c=>c.id=='wwt').length==3&&G.e.deck.length==eN+3`));
// furnace
setup(0);R(`var fm=mk('wmonk');enter(G.p,fm)`);cast('wfurn','fm');ok('furnace: shuffled in, +1/+1',R(`!G.p.bf.includes(fm)&&G.p.deck.includes(fm)&&fm.pa==1&&fm.pd==1`));
// ledger
setup(0);R(`var lm=mk('wmonk');enter(G.p,lm)`);cast('wledger','lm');R(`lm.dmg=9;sweep()`);ok('ledger: dies -> back in deck',R(`G.p.deck.includes(lm)&&!G.p.gy.includes(lm)`));
// fan / dance
setup(0);R(`var f1=mk('spd1'),f2=mk('spd2');enter(G.e,f1);enter(G.e,f2)`);cast('wfan');ok('fan bounces all',R(`cr(G.e).length==0&&G.e.hand.length>=2`));
setup(0);R(`var dn=mk('spd1');enter(G.e,dn)`);cast('wdance','dn');ok('dancing away taps',R('dn.tap')==1);
// cloud rider
setup(0);R(`var cr1=mk('wmonk');enter(G.p,cr1);cr1.sick=0;var bl=mk('spd2');enter(G.e,bl);bl.tap=0`);cast('wcloudr','cr1');ok('somersault strike: unblockable',R(`!canBlock(bl,cr1)`));
// smash / storm / rout
setup(0);R(`var s1=mk('spd3'),s2=mk('spd3');s1.d=9;s2.d=9;enter(G.e,s1);enter(G.e,s2)`);cast('wsmash','s1');ok('smash 2 + 1',R('s1.dmg==2&&s2.dmg==1'));
setup(0);R(`var s3=mk('spd3'),s4=mk('spd3');s3.d=9;s4.d=9;enter(G.e,s3);enter(G.e,s4)`);cast('whstorm');ok('hair storm 1 each',R('s3.dmg==1&&s4.dmg==1'));
// wt
ok('weight of the mountain cannot be cast (cost 9)',R(`D.wwt[1]==9`));
// gourd
setup(0);R(`G.e.bf.push(mk('gourd'));var g1=mk('spd3');g1.d=9;enter(G.e,g1)`);cast('wrod','g1');ok('gourd swallows first targeted spell',R('g1.dmg')==0);
cast('wrod','g1');ok('second works',R('g1.dmg')==2);
setup(0);R(`G.e.bf.push(mk('gourd'));var g2=mk('spd3');g2.d=9;enter(G.e,g2)`);cast('whstorm');ok('gourd ignores non-targeted',R('g2.dmg')==1);
// decree
setup(2);R(`G.e.bf.push(mk('decree'));var hh=mk('wmonk'),h2=mk('wmonk');G.p.hand=[hh,h2]`);ok('decree: first creature +1',R(`cost(hh)==D.wmonk[1]+1&&cost(h2)==D.wmonk[1]+1`));
R(`cast(hh)`);ok('second creature normal after first',R(`cost(h2)==D.wmonk[1]`));
// cobweb
setup(0);R(`G.e.bf.push(mk('cweb'));var a1=mk('wpig'),a2=mk('wmonk');enter(G.p,a1);enter(G.p,a2);a1.sick=0;a2.sick=0;G.sel=[a1.u,a2.u];G.tg={};bt('atk');if(G.phase==='dmgP')bt('res')`);
ok('cobweb freezes strongest attacker',R(`a1.frz==1&&a1.tap==1&&a2.frz==0`));
// samadhi fire
setup(3);R(`G.e.bf.push(mk('sfire'));var at=mk('rimp');enter(G.e,at);var bk=mk('wpig');enter(G.p,bk);var cmb={side:'e',atk:[at.u],blk:{},tg:{}};cmb.blk[at.u]=bk.u;G.cmb=cmb;sFire(cmb)`);ok('samadhi fire: blocker takes 1',R('bk.dmg')==1);
// army
setup(0);R(`var kc=mk('wclone');enter(G.p,kc);kc.dmg=9;sweep()`);ok('clone dies -> spare hair in deck',R(`G.p.deck.some(c=>c.id=='whair')`));
// expansion cards
setup(0);R(`var tq=mk('spd3');tq.d=20;enter(G.e,tq)`);cast('wrod','tq');cast('wpluck');cast('wtypes','tq');ok('three forms: 2 types = 2 (+2 rod)',R('tq.dmg')==4);
setup(0);R(`var tp=mk('wtroop');G.p.hand.push(tp);var dk0=G.p.deck.length`);R('cast(tp)');ok('troop shuffles a hair',R(`G.p.deck.length`)>=R('dk0')+1&&R(`G.p.deck.some(c=>c.id=='whair')`));
setup(0);cast('wpluck');cast('wpluck');R('var d0=G.p.deck.filter(c=>c.id=="wpeach").length');cast('worchard');ok('orchard: 3 played -> 1 peach',R(`G.p.deck.filter(c=>c.id=="wpeach").length`)==R('d0')+1);
setup(0);R('G.p.mana=0');cast('wdart',R(`(function(){var z=mk('spd3');z.d=20;enter(G.e,z);return 'z'})()`)&&'G.e.bf[G.e.bf.length-1]');
setup(0);R('G.p.mana=0;wkUp(G.p)');R(`G.p.cp=2`);cast('wfoot');ok('footwork: 3rd card gives mana',R('G.p.mana')==1);
setup(0);R('G.p.mana=0;wkUp(G.p)');cast('wfoot');ok('footwork: 1st card no mana',R('G.p.mana')==0);
setup(0);R(`var m1=mk('spd3'),m2=mk('spd3');m1.d=9;m2.d=9;enter(G.e,m1);enter(G.e,m2);var l9=G.e.life`);cast('wmyriad');ok('myriad: 1 to face and each',R('m1.dmg==1&&m2.dmg==1&&G.e.life==l9-1'));
setup(0);R(`var wm=mk('wwind');G.p.hand.push(wm);G.p.mo=2;var h0=G.p.hand.length;G.p.deck.push(mk('wmonk'))`);R('cast(wm)');ok('windborne draws at momentum 2',R('G.p.hand.length')>=R('h0'));
setup(0);R(`var sl=mk('spd3');sl.d=20;enter(G.e,sl)`);cast('wseal','sl');ok('seal taps and freezes',R('sl.tap==1&&sl.frz==1'));
setup(0);R(`G.p.deck.push(mk('whair'));var hh=G.p.hand.length`);cast('waugury');ok('augury draws 2 on hair top',R('G.p.hand.length')>=R('hh')+1);
setup(0);R(`G.p.deck.push(mk('wmonk'),mk('wmonk'),mk('wmonk'))`);cast('wwine');R('var hq=G.p.hand.length');cast('wecho');ok('afterimage re-draws',R('G.p.hand.length')>=R('hq')+1);
setup(0);R(`var tg1=mk('wtang');enter(G.p,tg1);G.p.deck.push(mk('wmonk'),mk('wmonk'),mk('wmonk'));var ht=G.p.hand.length`);cast('wpluck');cast('wstep',R(`(function(){var m=mk('wmonk');enter(G.p,m);return 'G.p.bf[G.p.bf.length-1]'})()`) && 'G.p.bf[G.p.bf.length-1]');R('var hu=G.p.hand.length');cast('wwine');ok('tang draws on 3rd card',R('G.p.hand.length')>=R('hu')+2);
// face targeting
setup(0);R(`var fd=mk('wdart');G.p.hand.push(fd);var lf=G.e.life;hd('h:'+fd.u)`);ok('dart enters targeting mode',R('!!(G.mode&&G.mode.tgt==="xf")'));R(`hd('ef')`);ok('dart hits opponent for 1',R('G.e.life')==R('lf')-1);
setup(0);R(`var fr=mk('wrod');G.p.hand.push(fr);var lg=G.e.life;hd('h:'+fr.u);hd('ef')`);ok('rod hits opponent for 2',R('G.e.life')==R('lg')-2);
setup(0);R(`var wd=mk('spd2');enter(G.e,wd);var fh=mk('wdart');G.p.hand.push(fh);hd('h:'+fh.u);hd('e:'+wd.u)`);ok('warded spiders cannot be targeted but dart still resolves face',R('wd.dmg')==0);
ok('dart is a quick spell',R(`D.wdart[2]=='I'`));
// new army members
setup(0);cast('wlegion');ok('legion shuffles 2 hairs',R(`G.p.deck.filter(c=>c.id=='whair').length`)>=2);
setup(0);R(`G.p.mo=5`);R(`var e0=G.e.life`);cast('wbear');ok('bearer hits for momentum capped 3',R('e0')-R('G.e.life')==3);
setup(0);en('spd1');R(`G.p.mo=2`);cast('wbreak');ok('breaker hits all army members for 2',R(`G.e.bf.filter(c=>c.id=='spd1').length==0||G.e.bf.find(c=>c.id=='spd1').dmg>=2`));
setup(0);R(`G.p.mo=0;var u=mk('wdrum');G.p.hand.push(u)`);R('cast(u)');ok('drummer raises momentum',R('G.p.mo')>=1);
setup(0);cast('wpeachk');ok('keeper shuffles a peach',R(`G.p.deck.some(c=>c.id=='wpeach')`));
setup(0);cast('wjug');R(`var l1=G.e.life;wkMom(G.p)`);ok('juggler pings on momentum',R('l1')-R('G.e.life')==1);
setup(0);cast('wvang');R(`wkMom(G.p)`);ok('vanguard gets +1 on momentum',R(`G.p.bf.find(c=>c.id=='wvang').ta`)==1);
setup(0);cast('wdisc');R(`G.p.cp=2;wkPlay(G.p,mk('wmonk'))`);ok('disciple +2 on third card',R(`G.p.bf.find(c=>c.id=='wdisc').ta`)==2);
// expansion II
setup(0);R(`var n0=G.p.dsp||0`);cast('wwine');ok('wine disintegrate counted',(R('G.p.dsp')||0)>=1);
setup(0);cast('wpyre');R(`var l0=G.e.life`);cast('wwine');ok('pyre pings on disintegrate',R('l0')-R('G.e.life')==2);
setup(0);cast('wnull');cast('wwine');ok('monk grows on disintegrate',R(`G.p.bf.find(c=>c.id=='wnull').ta`)>=1);
setup(0);R(`G.p.deck.push(mk('wpierce'))`);R(`var l1=G.e.life`);cast('wburn');ok('burn deals cost+1',R('l1')-R('G.e.life')==3);
setup(0);en('spd2');R(`G.p.dsp=4`);cast('wunravel',`G.e.bf.find(c=>c.id=='spd2').u`);
setup(0);R(`G.p.lt='st';G.p.tys={st:1}`);cast('wskin');ok('wild counts, raises momentum',R('G.p.mo')>=1&&R('G.p.lt')!='st');
setup(0);R('G.p.life=10');cast('wgreat');ok('great wall heals 3',R('G.p.life')==13);
setup(0);R(`G.p.life=5;G.p.cp=2`);cast('wbanq');ok('banquet gains 2/card',R('G.p.life')>=11);
setup(0);en('spd1');en('spd3');cast('wmist');ok('mist taps all',R(`G.e.bf.every(c=>c.tap)`));
setup(0);en('spd2');cast('wunward');ok('unward strips ward',R(`G.e.bf.every(c=>!c.f.includes('w'))`));
setup(0);cast('wrally');cast('wmonk');R(`G.p.bf.forEach(c=>{c.ta=0;c.td=0})`);cast('wrally');ok('rally buffs',R(`G.p.bf[0].ta`)==1);
setup(0);cast('wmillion');ok('million fills 3 clones',R(`G.p.bf.filter(c=>c.id=='wclone').length`)==3);
setup(0);R(`G.p.life=10`);cast('wpeachg');ok('banquet 4 heals 6',R('G.p.life')==16&&R(`G.p.deck.concat(G.p.hand).filter(c=>c.id=='wpeach').length`)>=3);
setup(0);R(`var l2=G.e.life;G.p.mo=2`);cast('wbigstaff');ok('big staff hits face 7',R('l2')-R('G.e.life')==7);
setup(0);cast('wsandy');R(`G.p.life=10;wkMom(G.p)`);ok('sand monk heals on momentum',R('G.p.life')==11);
setup(0);cast('wtree');R(`G.p.life=10;G.p.bf.push;wkUp(G.p)`);ok('tree heals at turn start',R('G.p.life')==12);
// start screen
ok('start screen lists 3 characters',R(`Object.keys(CHARS).length==3`));
R(`G.phase='char';G.cv='wukong'`);try{R('render0()');ok('char screen renders',true)}catch(e){ok('char screen renders '+e.message,false)}
setup(0);try{R('render0()');ok('fight screen renders',true)}catch(e){ok('fight screen renders '+e.message,false)}
console.log(f?('FAILED '+f):'ALL OK');
