# ===== quick spells during the opponent's turn =====
_b3("const pause=async()=>{render();await wait(3000);return g==G};","""G.qp=0;G.qk=0;G.qrs=0;const pause=async()=>{render();let r=3000;while(r>0){await wait(100);if(g!=G)return false;if(G.phase!='enemy')return false;if(G.qp)continue;if(G.qrs){G.qrs=0;r=3000;continue}r-=100}return g==G&&G.phase=='enemy'};""")
_b3("if(['enemy','kleos','lost','victory','draft','remove','nextf','map','char'].includes(G.phase))return;const[k,u]","if(['enemy','kleos','lost','victory','draft','remove','nextf','map','char'].includes(G.phase)&&!(G.phase=='enemy'&&G.qp))return;const[k,u]")
_b3("if(!(G.phase=='main'||(d[2]=='I'&&['blockP','dmgP'].includes(G.phase))))return","if(!(G.phase=='main'||(d[2]=='I'&&(['blockP','dmgP'].includes(G.phase)||(G.phase=='enemy'&&G.qp)))))return")
_b3("{FX[c.id](p,G.e,t);bury(p,c)}sweep();chk();render()}","{FX[c.id](p,G.e,t);bury(p,c)}sweep();chk();if(G.qp){G.qp=0;G.qk=0;G.qrs=1}render()}")
_b3("if(ph=='kleos')b='<button class=\"b\" data-b=\"next\">Continue</button>';","if(ph=='kleos')b='<button class=\"b\" data-b=\"next\">Continue</button>';if(ph=='enemy'&&!G.rv&&!G.qp&&p.hand.some(c=>D[c.id][2]=='I'))b='<button class=\"b\" data-b=\"qs\">Use quick spell</button>';")
_b3("const lib=G.lib?`<div class=\"ov\"><div class=\"ovb\"><div class=\"ovt\">Your library: ","""const qkh=(G.qp&&G.qk&&ph=='enemy'&&!(G.mode&&G.mode.tgt))?`<div class="ov"><div class="ovb"><div class="ovt">${e.nm} is paused. Cast a quick spell? You have ◆${p.mana} mana.</div><div class="lib">${p.hand.filter(c=>D[c.id][2]=='I').map(c=>`<div style="opacity:${cost(c)<=p.mana?1:.45}">${card(c,'h:'+c.u)}</div>`).join('')}</div><button class="b" data-b="qx">Let ${e.nm} continue</button></div></div>`:'';
const lib=G.lib?`<div class="ov"><div class="ovb"><div class="ovt">Your library: """)
_b3("${lib}${gv}${G.rv?","${lib}${gv}${qkh}${G.rv?")
_b3("if(b=='cancel'){G.mode=0;","if(b=='qs'){if(G.phase=='enemy'){G.qp=1;G.qk=1;G.mode=0}return render()}if(b=='qx'){G.qp=0;G.qk=0;G.mode=0;return render()}if(b=='cancel'){G.mode=0;")

# ===== treasure-map pathing: 4 horizontal lanes =====
_b3("map:genMap(),","map:genMap(),edges:genEdges(),")
_b3("function genMap(){return Array.from({length:FLOORS},()=>sh(EN.map((x,i)=>i)).slice(0,3))}","""function genMap(){for(let t=0;t<500;t++){const M=[];let ok=true;for(let f=0;f<FLOORS&&ok;f++){const used=new Set(),row=[];for(let l=0;l<4;l++){const c=sh(EN.map((x,i)=>i)).filter(i=>!row.includes(i)&&!M.some(r=>r[l]==i));if(!c.length){ok=false;break}row.push(c[0])}if(ok)M.push(row)}if(ok&&M.length==FLOORS)return M}return Array.from({length:FLOORS},()=>sh(EN.map((x,i)=>i)).slice(0,4))}
function genEdges(){const E=[];for(let f=0;f<FLOORS-1;f++){let row,ok=false;while(!ok){row=[0,1,2,3].map(l=>{const t=[];if(l>0&&Math.random()<.21)t.push(l-1);if(Math.random()<.8)t.push(l);if(l<3&&Math.random()<.21)t.push(l+1);if(!t.length)t.push(l);return t});
let x=false;for(let l=0;l<3;l++)if(row[l].includes(l+1)&&row[l+1].includes(l))x=true;const inc=[0,0,0,0];row.forEach(t=>t.forEach(m=>inc[m]++));ok=!x&&inc.every(n=>n>0)}E.push(row)}return E}""")
_b3("function mapOk(l){return G.fi==0||G.lanes[G.fi-1]==null||Math.abs(l-G.lanes[G.fi-1])<=1}","function mapOk(l){return G.fi==0||G.lanes[G.fi-1]==null||((G.edges&&G.edges[G.fi-1]||[])[G.lanes[G.fi-1]]||[0,1,2,3]).includes(l)}")
# replace renderMap wholesale
import re as _re
_s=None
for _nm in ('head','mid','tail','A','B'):
    _t=globals()[_nm]
    _i=_t.find("function renderMap(){")
    if _i>=0:
        _j=_t.find("function renderNextf(){",_i); assert _j>_i
        _new = open(S+'rendermap.js',encoding='utf-8').read()
        globals()[_nm]=_t[:_i]+_new+"\n"+_t[_j:]
        break
else: raise Exception('renderMap not found')
head=rep(head,"@keyframes tf{",open(S+'mapcss.css',encoding='utf-8').read()+"\n@keyframes tf{")
_b3("if(G.phase=='enemy')return;if(G.pend&&b!='new')","if(G.phase=='enemy'&&!['qs','qx','cancel'].includes(b))return;if(G.pend&&b!='new')")
