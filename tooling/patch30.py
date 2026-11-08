# ===== v64: One True God altar, gift, bosses =====
_b3("function scaleEnemy(e,v){const s=sclOf(v);","function scaleEnemy(e,v){const s=Array.isArray(v)?v:sclOf(v);")
_b3("function fight(){const f=EN[G.rt[G.fi]],p=G.p;G.e=side(f.d,f.l);G.e.nm=f.n;scaleEnemy(G.e,G.fi);","function fight(){const f=G.boss?BOSS[G.bi]:EN[G.rt[G.fi]],p=G.p;G.e=side(f.d,f.l);G.e.nm=f.n;scaleEnemy(G.e,G.boss?f.sc:G.fi);if(f.trump){const tt=mk(f.trump);tt.boss=1;G.e.bf.push(tt)}")
_b3("log('Fight '+(G.fi+1)+' of '+FLOORS+': '+f.n);startP()}","log(G.boss?'Guardian of the strait: '+f.n:'Fight '+(G.fi+1)+' of '+FLOORS+': '+f.n);startP()}")
_b3("if(G.fi==FLOORS-1){G.phase='victory';G.msg='Ithaca awaits. You cleared Act I!'}else{","if(G.boss){G.phase='victory';G.msg='The strait falls silent. You have passed the guardian, and the way onward opens. Act I is complete!'}else{")
_b3("G.fi++;G.act+=2;G.hubMsg='';G.phase='map';G.lib=0;render()}","G.fi++;G.act+=2;if(G.fi>=FLOORS&&!G.gift){G.gift=1;G.act+=2;G.web.nodes.forEach(n=>{if(n.t=='fight'&&!n.cleared){n.cleared=1;n.neutral=1;n.closed=1}})}G.hubMsg='';G.phase='map';G.lib=0;render()}")
# goNode
_b3("if(G.phase!='map'||!cu.adj.includes(id))return;","if(G.phase!='map'||!(cu.adj.includes(id)||(id==0&&G.pos==0&&G.fi>=FLOORS&&!G.spent)))return;")
_b3("if(nd.t=='fight'&&!nd.cleared){G.rt[G.fi]=nd.o;return fight()}","if(nd.t=='fight'&&!nd.cleared){if(G.fi>=FLOORS)return;G.rt[G.fi]=nd.o;return fight()}if(nd.t=='start'&&G.fi>=FLOORS&&!G.spent){G.phase='otg';G.lib=0;return render()}")
# tips / node look
_b3("if(n.neutral)return`<b>Neutral space</b>","if(n.closed)return`<b>${o.n}</b><br>The way is closed. Four victories are enough: return to the altar at the center of the map.`;if(n.neutral)return`<b>Neutral space</b>")
_b3("if(n.t=='start')return'All journeys must begin somewhere';","if(n.t=='start')return G.fi>=FLOORS&&!G.spent?'<b>Altar to the One True God</b><br>Offer your four victory points here to face a guardian of the strait.':'All journeys must begin somewhere';")
_b3("ic=n.t=='fight'?EN[n.o].ic:LOCN[n.t][0]","ic=n.t=='fight'?EN[n.o].ic:(n.t=='start'&&G.fi>=FLOORS&&!G.spent?'🔱':LOCN[n.t][0])")
_b3("class=\"wn${here?' cur':''}","class=\"wn${n.t=='start'&&G.fi>=FLOORS&&!G.spent?' oto':''}${here?' cur':''}")
_b3("${adj?`data-b=\"go${n.id}\"`:'disabled'}>","${adj||(n.t=='start'&&G.fi>=FLOORS&&!G.spent)?`data-b=\"go${n.id}\"`:'disabled'}>")
_b3("<div class=\"dsub\" style=\"opacity:.8\">Next opponent: ${s0[0]>=0?'+':''}${s0[0]} ❤, +${s0[1]}/+${s0[2]} on army members</div>","${G.fi>=FLOORS&&!G.spent?GIFTB:`<div class=\"dsub\" style=\"opacity:.8\">Next opponent: ${s0[0]>=0?'+':''}${s0[0]} ❤, +${s0[1]}/+${s0[2]} on army members</div>`}")
_b3("if(ph=='nextf')return renderNextf();","if(ph=='nextf')return renderNextf();if(ph=='otg')return renderOtg();if(ph=='bossp')return renderBossp();")
_b3("SAFE=['map','loc','hub','draft','remove']","SAFE=['map','loc','hub','draft','remove','otg','bossp']")
_b3("if(b=='cont')return loadRun();","if(b=='cont')return loadRun();if(b=='otgy')return otgOffer();if(b=='otgn'){G.phase='map';return render()}if(b.startsWith('bpick'))return bossPick(+b.slice(5));")
_b3("fight '+o.fight+' of '+FLOORS+', life '+o.life+')","'+(o.fight>FLOORS?'boss fight':'fight '+o.fight+' of '+FLOORS)+', life '+o.life+')")
# trump hooks
_b3("if(!at.length)return msg('Select attackers first.');","if(!at.length)return msg('Select attackers first.');{const tx=wallTax(at.length);if(tx>p.mana)return msg('The Walls of Troy: attacking with '+at.length+' army member'+(at.length==1?'':'s')+' costs '+tx+' mana, and you have '+p.mana+'.');p.mana-=tx;if(tx)log('The Walls of Troy: you pay '+tx+' mana to attack.')}")
_b3("Attack${G.sel.length?' ('+G.sel.length+')':''}","Attack${G.sel.length?' ('+G.sel.length+(wallTax(G.sel.length)?', costs '+wallTax(G.sel.length)+' mana':'')+')':''}")
_b3("else{N.life-=da;if(kw(a,'d'))aGain+=da}}}","else{N.life-=da;if(da>0&&c.side=='e'&&A.bf.some(x=>x.id=='heads'))EDI=1;if(kw(a,'d'))aGain+=da}}}")
_b3("A.life+=aGain;N.life+=nGain;\nsweep();G.cmb=0;","A.life+=aGain;N.life+=nGain;\nsweep();if(EDI){EDI=0;edict()}G.cmb=0;")
_b3("function startP(){const p=G.p;G.turn++;","function startP(){const p=G.p;G.turn++;whStep();")
_b3("G.msg='Your turn. Mana refills to 2; offer army members (💀) for more.';render()}","G.msg='Your turn. Mana refills to 2; offer army members (💀) for more.'+whNote();if(G.p.life<=0)chk();render()}")
# boss items cannot be destroyed
_b3("sapper:{who:'e',ok:T=>!isC(T),","sapper:{who:'e',ok:T=>!isC(T)&&!has(T,'w'),")
_b3("has:(s,o)=>o.bf.some(x=>!isC(x)),m:\"Trojan Sapper","has:(s,o)=>o.bf.some(x=>!isC(x)&&!has(x,'w')),m:\"Trojan Sapper")
_b3("code=='ei'?(k=='e'&&!isC(T))","code=='ei'?(k=='e'&&!isC(T)&&!has(T,'w'))")
_b3("const destroyIt=(s,t)=>{const i=s.bf.indexOf(t);if(i<0)return;","const destroyIt=(s,t)=>{const i=s.bf.indexOf(t);if(i<0)return;")
_b3("G.phase='enemy';e.mana=2;G.sel=[];","G.phase='enemy';e.mana=G.boss&&BOSS[G.bi].mp||2;G.sel=[];")
_b3("try{menuVis()}catch(e){}try{persist()}catch(e){}}","try{menuVis()}catch(e){}try{persist()}catch(e){}try{vicVis()}catch(e){}}")
_b3("if(b=='cont')return loadRun();","if(b=='vnew')return showChars();if(b=='cont')return loadRun();")
_b3("function menuVis(){","""let EDI=0;
const WFREE=0,WHIRL=3,WHDMG=2;
const wallTax=n=>(G&&G.e&&G.e.bf&&G.e.bf.some(x=>x.id=='walls'))?Math.max(0,n-WFREE):0;
function edict(){const p=G.p,L=cr(p);if(!L.length)return;const t=L.slice().sort((a,b)=>(th(a)-a.dmg)-(th(b)-b.dmg)||pwr(a)-pwr(b))[0];log('The Six Heads drag '+D[t.id][0]+' from your ranks!');offer(p,t);sweep()}
function whirlpool(){G.p.life-=WHDMG;const L=[...cr(G.p),...cr(G.e)];log('The Whirlpool churns: you lose '+WHDMG+' life'+(L.length?', and every army member is dragged back to its owner\\'s hand!':'.'));L.forEach(c=>bounce(c))}
function whStep(){const w=G.e&&G.e.bf&&G.e.bf.find(x=>x.id=='whirl');if(!w)return;w.t=(w.t||0)+1;if(w.t>=WHIRL){w.t=0;whirlpool()}}
function whNote(){const w=G.e&&G.e.bf&&G.e.bf.find(x=>x.id=='whirl');if(!w)return'';const n=WHIRL-(w.t||0);return(w.t||0)==0&&G.turn>1?' 🌀 It struck! Next in '+WHIRL+' turns.':' 🌀 Whirlpool in '+n+' turn'+(n==1?'':'s')+'.'}
Object.assign(D,{
walls:['Walls of Troy',0,'E',0,0,'w','Ward. Attacking costs 1 mana per army member you attack with.','🏛️','W'],
heads:['The Six Heads',0,'E',0,0,'w',`Ward. Each time Scylla's army members deal damage to you, you must offer your weakest army member.`,'🐍','B'],
whirl:['The Whirlpool',0,'E',0,0,'w',`Ward. At the start of every third turn of yours, you lose 2 life and all army members on both sides return to their owners' hands.`,'🌀','U'],
hmil:['Trojan Militia',1,'C',1,3,'p','','🛡️','W',1],
hspr:['Trojan Spearman',2,'C',2,4,'p','','🗡️','W',1],
hgua:['Ilian Guard',3,'C',3,5,'p','','🏯','W',2],
hchar:['Charioteer of Troy',2,'C',3,2,'h','','🏇','W',2],
hector:['Hector, Tamer of Horses',4,'C',5,6,'pz','When it enters, your other Phalanx army members get +1/+1 permanently.','🐴','W',3],
priam:['King Priam',2,'C',1,5,'p','When it enters, gain 4 life.','👑','W',2],
sh1:['Snapping Head',1,'C',1,1,'r','','🐍','B',1],
sh2:['Gnashing Head',2,'C',2,1,'r','','🐍','B',1],
sh3:['Baying Head',2,'C',1,2,'d','','🐕','B',1],
sh4:['Venomous Head',3,'C',3,2,'v','','🐉','B',1],
scyl:['Scylla',5,'C',5,6,'r','When it enters, deal 2 damage to each opposing army member.','🦑','B',3],
cdro:['Drowned Sailor',1,'C',1,2,'','','🪦','U',1],
cspa:['Whirlpool Spawn',2,'C',2,3,'','When it enters, tap target opposing army member.','🌊','U',1],
ceel:['Maelstrom Eel',2,'C',2,2,'f','When it enters, draw a card.','🦈','U',1],
clev:['Leviathan of the Deep',3,'C',4,4,'z','','🐋','U',2],
chary:['Charybdis',4,'C',5,6,'','When it enters, tap all opposing army members.','🌀','U',3]});
Object.assign(LORE,{hmil:'Trojan defender',hspr:'Trojan defender',hgua:'Trojan defender',hchar:'Trojan charioteer',hector:'Prince of Troy',priam:'King of Troy',sh1:'Head of Scylla',sh2:'Head of Scylla',sh3:'Head of Scylla',sh4:'Head of Scylla',scyl:'Monster of the strait',cdro:'Drowned dead',cspa:'Sea spirit',ceel:'Sea beast',clev:'Sea beast',chary:'The devouring whirlpool',walls:'Boss trump',heads:'Boss trump',whirl:'Boss trump'});
ETB.hector=s=>cr(s).filter(c=>has(c,'p')&&c.id!='hector').forEach(c=>{c.pa++;c.pd++});ETBV.hector=2.5;
ETB.priam=s=>{s.life+=4};ETBV.priam=1;
ETB.scyl=(s,o)=>cerbFx(s,o);ETBV.scyl=3;
ETB.cspa=(s,o)=>{const b=best(tg(o).filter(c=>!c.tap));if(b)b.tap=1};ETBV.cspa=1.5;
ETB.ceel=s=>draw(s,1);ETBV.ceel=1.5;
ETB.chary=(s,o)=>{cr(o).filter(c=>!has(c,'w')).forEach(c=>{c.tap=1})};ETBV.chary=3;
const BOSS=[
{n:'Hector, Tamer of Horses',ic:'🐴',l:22,sc:[0,0,-1],trump:'walls',d:ids('hmil:3,hspr:3,hgua:2,hchar,hector,priam,gift,tide'),
 lore:`Son of Priam, breaker of Danaan lines, and the last wall of Ilium. Homer never lets him strike first: he stands before the gates among his Trojan spearmen, and any man who would reach him must pay for every step. They called him tamer of horses, yet it was a horse that ended his city.`},
{n:'Scylla',ic:'🦑',l:23,sc:[0,0,0],trump:'heads',d:ids('sh1:3,sh2:3,sh3:2,sh4:2,scyl,curse,javel'),
 lore:`High in a cave above the narrow strait she waits: six long necks, six heads, each with three rows of crowded teeth, and a voice like a young hound's. Circe warned that no armor answers her and no man can fight her. Every ship that slips past leaves one sailor for each head, and with every strike the crew grows thinner.`},
{n:'Charybdis',ic:'🌀',l:23,sc:[0,0,0],trump:'whirl',d:ids('cdro:3,cspa:3,ceel:3,clev:2,chary,undertow:2,honey,tide'),
 lore:`Beneath the great fig tree on the far rock she drinks the sea three times each day and spews it back three times. Whatever the water carries, ship, oar or man, is dragged down and thrown up again where it began. Not even Poseidon could pull a ship from her grasp.`}];
const GIFTB='<div class="dsub" style="opacity:1;color:#ffd878;font-size:17px;max-width:620px;margin:6px auto;line-height:1.35">🎁 <b>A Gift from the One True God:</b> +2 action points! Now return to the <b>center of the map</b>. Your starting point has become the glowing <b>Altar to the One True God</b>. Spend your action points first, then offer your four victory points there.</div>';
function vicVis(){let o=document.getElementById('vico');if(!(G&&G.phase=='victory')){if(o)o.style.display='none';return}
if(!o){const st=document.createElement('style');st.textContent='#vico{position:fixed;inset:0;z-index:305;background:#000c;display:grid;place-items:center;padding:16px}#vico .box{background:#0b1820;border:2px solid #d8b45a;border-radius:16px;padding:28px 30px;max-width:min(520px,92vw);text-align:center;color:#efe6cf;font:16px/1.45 Georgia,serif;display:flex;flex-direction:column;gap:12px;align-items:center;box-shadow:0 0 60px #ffd45a55}#vico .t{font-size:30px;letter-spacing:.08em;color:#e8b84a}';document.head.appendChild(st);o=document.createElement('div');o.id='vico';document.body.appendChild(o);o.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;if(b.dataset.v=='new')showChars();else if(b.dataset.v=='rep'){const t=runText('won');copyTxt(t).then(k=>{if(k)b.textContent='Copied! Paste it to Ben';else{const ta=document.createElement('textarea');ta.readOnly=true;ta.rows=5;ta.value=t;ta.style.cssText='width:100%;box-sizing:border-box;background:#06101a;color:#efe6cf;border:1px solid #d8b45a88;border-radius:8px;padding:8px;font:13px Georgia,serif';b.parentNode.parentNode.appendChild(ta)}})}})}
const nm=G.e&&G.e.nm||'the guardian';o.innerHTML='<div class="box"><div style="font-size:54px">🏆</div><div class="t">VICTORY</div><div>You have passed <b>'+nm+'</b>. The strait falls silent and the way onward opens.</div><div style="opacity:.8">Act I is complete. The Odyssey is far from over: more of the journey is coming soon.</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px"><button class="b" data-v="new">New run</button><button class="b" data-v="rep">Copy run report</button></div></div>';o.style.display='grid'}
function otgInit(){if(document.getElementById('otgcss'))return;const s=document.createElement('style');s.id='otgcss';s.textContent='.wn.oto{box-shadow:0 0 22px 8px #ffd45acc;border-color:#ffe08a;animation:otgp 1.6s ease-in-out infinite}@keyframes otgp{50%{box-shadow:0 0 34px 14px #ffd45a}}.bsp{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;max-width:980px}.bsc{flex:1 1 300px;max-width:440px;border:2px solid #d8b45a;border-radius:14px;background:#0009;padding:16px 20px;text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}.bsc .ic{font-size:52px}.bsc .nm2{font-size:24px;letter-spacing:.04em}.bsc .lr{font-style:italic;opacity:.92;line-height:1.4;font-size:15px}';document.head.appendChild(s)}
function renderOtg(){try{otgInit()}catch(e){}const n=G.act;document.getElementById('app').innerHTML=`<div class="dft"><div style="font-size:54px;text-align:center">🔱</div><div class="ovt" style="font-size:28px">Altar to the One True God</div><div class="dsub" style="max-width:560px;font-size:17px;line-height:1.4;text-align:center">Your four victory points burn on the altar like four small suns. Offer them, and the strait will answer: two guardians will rise, and you must choose which one to face. There is no turning back.</div><div class="dsub" style="opacity:.9">${n>0?`⚡ You still have ${n} action point${n==1?'':'s'}. Campfires, crafting tables and altars on the map can still use them.`:'⚡ You have no action points left.'}</div><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px"><button class="b" data-b="otgy">Offer your four victory points</button><button class="b g" data-b="otgn">Return to the map</button></div></div>`}
function otgOffer(){G.spent=1;G.bs=sh([0,1,2]).slice(0,2);G.phase='bossp';G.lib=0;render()}
function renderBossp(){try{otgInit()}catch(e){}const B=G.bs.map(i=>BOSS[i]);document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:28px">Two guardians answer</div><div class="dsub" style="font-size:16px;opacity:.9">Choose which one to face.</div><div class="bsp">${B.map((b,k)=>`<div class="bsc"><div class="ic">${b.ic}</div><div class="nm2">${b.n}</div><div class="lr">${b.lore}</div><button class="b" data-b="bpick${G.bs[k]}">Face ${b.n.split(',')[0]}</button></div>`).join('')}</div></div>`}
function bossPick(i){if(G.phase!='bossp'||!G.bs||!G.bs.includes(i))return;G.boss=1;G.bi=i;G.phase='main';fight()}
function menuVis(){""")
