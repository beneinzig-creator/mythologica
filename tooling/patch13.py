# ===== Slay-the-Spire style map: 4 floors x 3 lanes =====
_b3("phase:'draft',dr:{mode:'start',","rt:[],lanes:[],map:genMap(),phase:'draft',dr:{mode:'start',")
_b3("function fight(){const f=EN[G.fi],p=G.p;","function fight(){const f=EN[G.rt[G.fi]],p=G.p;")
_b3("log('Fight '+(G.fi+1)+' of 3: '+f.n)","log('Fight '+(G.fi+1)+' of '+FLOORS+': '+f.n)")
_b3("if(G.fi==2){G.phase='victory'","if(G.fi==FLOORS-1){G.phase='victory'")
_b3("function hubNext(){if(G.act<=0)G.phase='nextf';render()}","function hubNext(){if(G.act<=0){G.fi++;G.phase='map'}render()}")
_b3("G.p.recs=[...STAPLES,...dr.picks].map(nr);fight()}","G.p.recs=[...STAPLES,...dr.picks].map(nr);G.phase='map';render()}")
_b3("if(b=='fight'){G.hubMsg='';G.fi++;return fight()}","if(b.startsWith('node')){const l=+b.slice(4);if(G.phase!='map'||!mapOk(l))return;G.rt[G.fi]=G.map[G.fi][l];G.lanes[G.fi]=l;G.hubMsg='';return fight()}")
_b3("['enemy','kleos','lost','victory','draft','remove','nextf']","['enemy','kleos','lost','victory','draft','remove','nextf','map','char']")
_b3("if(ph=='char')return renderChar();","if(ph=='char')return renderChar();if(ph=='map')return renderMap();")
_b3("const BG=[['#0b1a14','#2f5a3a'],['#07131f','#1f5a78'],['#1a0b07','#6b2a14']][G.fi]||['#0b1820','#1d4452'],","const BG=(EN[G.rt[G.fi]]||{}).bg||['#0b1820','#1d4452'],")
_b3("function renderNextf(){","""const FLOORS=4;
function genMap(){return Array.from({length:FLOORS},()=>sh(EN.map((x,i)=>i)).slice(0,3))}
function mapOk(l){return G.fi==0||G.lanes[G.fi-1]==null||Math.abs(l-G.lanes[G.fi-1])<=1}
function renderMap(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
const cw=200,rh=128,W=cw*3,H=rh*FLOORS,X=l=>cw*l+cw/2,Y=f=>rh*(FLOORS-1-f)+rh/2,p=G.p;let ln='',nd='';
for(let f=0;f<FLOORS;f++)for(let l=0;l<3;l++){const o=EN[G.map[f][l]],done=f<G.fi,here=f==G.fi,chosen=done&&G.lanes[f]==l,ok=here&&mapOk(l);
if(f<FLOORS-1)for(let m=l-1;m<=l+1;m++){if(m<0||m>2)continue;const hot=(done&&G.lanes[f]==l&&(G.lanes[f+1]==m||(f+1==G.fi&&mapOk(m))))||(here&&ok&&false);
ln+=`<line x1="${X(l)}" y1="${Y(f)}" x2="${X(m)}" y2="${Y(f+1)}" stroke="${hot?'#e0b04a':'#e0b04a33'}" stroke-width="${hot?3:2}" stroke-dasharray="${hot?'':'5 6'}"/>`}
nd+=`<button class="mn${chosen?' won':''}${done&&!chosen?' pass':''}${ok?' go':''}${!done&&!ok?' lock':''}" style="left:${X(l)-84}px;top:${Y(f)-46}px" ${ok?`data-b="node${l}"`:'disabled'}><span class="mi">${chosen?'✓':o.ic}</span><b>${o.n}</b><small>${o.hint}</small></button>`}
const rowLbl=Array.from({length:FLOORS},(_,f)=>`<div class="mf${f==G.fi?' cur':''}" style="top:${Y(f)-10}px">Fight ${f+1}</div>`).join('');
document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:28px">Choose your path</div><div class="dsub">Fight ${G.fi+1} of ${FLOORS} · Odysseus ❤ ${p.life}/${p.max} · ${p.recs.length} cards in your library. You may move to the same lane or one lane over.</div><div class="mapw" style="width:${W}px;height:${H}px">${rowLbl}<svg width="${W}" height="${H}">${ln}</svg>${nd}</div></div>`}
function renderNextf(){""")
head=rep(head,"@keyframes tf{","""@media(min-width:561px){.mapw{zoom:1.15}}.mapw{position:relative;margin:14px auto 0}.mapw svg{position:absolute;left:0;top:0}.mn{position:absolute;width:168px;height:92px;border:2px solid #6b5c2e;border-radius:12px;background:#0a1218cc;color:#efe6cf;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:4px 6px;cursor:default}.mn b{font-size:14px}.mn small{font-size:10.5px;opacity:.75;line-height:1.15}.mn .mi{font-size:22px;line-height:1}.mn.lock{opacity:.5}.mn.pass{opacity:.28}.mn.won{border-color:#7be08a;background:#12301acc}.mn.go{cursor:pointer;border-color:#e0b04a;box-shadow:0 0 14px #e0b04a77;animation:mpulse 1.8s ease-in-out infinite}.mn.go:hover{background:#2a2410}@keyframes mpulse{50%{box-shadow:0 0 24px #e0b04acc}}.mf{position:absolute;left:-74px;font-size:12px;opacity:.55;letter-spacing:.06em}.mf.cur{opacity:1;color:#e0b04a}
@keyframes tf{""")
