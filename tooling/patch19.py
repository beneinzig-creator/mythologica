# ===== web map, action points, victory points, locations, VP scaling =====
def _cut(name_start,name_end,newtxt):
    global head,mid,tail,A,B
    for _nm in ('head','mid','tail','A','B'):
        _t=globals()[_nm];_i=_t.find(name_start)
        if _i>=0:
            _j=_t.find(name_end,_i);assert _j>_i,name_end
            globals()[_nm]=_t[:_i]+newtxt+"\n"+_t[_j:];return
    raise Exception('not found '+name_start)
_web=open(S+'web.js',encoding='utf-8').read()
_cut("function renderMap(){","function renderNextf(){",_web.split("function renderRemove(){")[0].split("function renderMap(){")[0]+"function renderMap(){"+_web.split("function renderMap(){")[1].split("function renderLoc(){")[0]+"function renderLoc(){"+_web.split("function renderLoc(){")[1].split("function renderRemove(){")[0])
_cut("function renderRemove(){","function showChars(){","function renderRemove(){"+_web.split("function renderRemove(){")[1])
head=rep(head,"@keyframes tf{",open(S+'webcss.css',encoding='utf-8').read()+"\n@keyframes tf{")
_b3("map:genMap(),edges:genEdges(),","web:genWeb(),pos:0,act:1,trail:{},")
_b3("G.e=side(f.d,f.l);G.e.nm=f.n;","G.e=side(f.d,f.l);G.e.nm=f.n;scaleEnemy(G.e,G.fi);")
_b3("function startReward(){G.act=4;G.used={h:0,d:0};G.hubMsg='';G.phase='hub';G.lib=0;render()}","function startReward(){G.web.nodes[G.pos].cleared=1;G.fi++;G.act+=2;G.hubMsg='';G.phase='map';G.lib=0;render()}")
_b3("G.act--;G.phase='hub';G.dr=0;return hubNext()}G.p.recs","G.act--;G.phase='loc';G.dr=0;return render()}G.p.recs")
_b3("G.act--;G.phase='hub';G.dr=0;G.lib=0;return hubNext()}return}if(b=='hubback'){G.phase='hub';","G.act--;G.phase='loc';G.dr=0;G.lib=0;return render()}return}if(b=='hubback'){G.phase='loc';G.uo=0;")
_b3("if(ph=='map')return renderMap();","if(ph=='map')return renderMap();if(ph=='loc')return renderLoc();")
_b3("'nextf','map','char'].includes(G.phase)&&!","'nextf','map','char','loc','hub'].includes(G.phase)&&!")
_b3("function bt(b){const p=G.p;","""function bt(b){const p=G.p;
if(b.startsWith('go')&&b!='go'){return goNode(+b.slice(2))}
if(G.phase=='loc'||G.phase=='remove'||G.phase=='draft'){const nd=G.web&&G.web.nodes[G.pos],u=nd&&(nd.used||(nd.used={}));
if(b=='hheal'&&G.phase=='loc'){if(nd.t!='camp'||G.act<1||(u.h||0)>=2||p.life>=p.max)return;p.life=Math.min(p.max,p.life+6);u.h=(u.h||0)+1;G.act--;return render()}
if(b=='hdraft'&&G.phase=='loc'){if(nd.t!='craft'||G.act<1)return;G.dr={mode:'reward',rounds:1,n:0,picks:[],off:[],busy:0,pause:0};G.phase='draft';G.lib=0;dealDraft();return render()}
if(b=='hrem'&&G.phase=='loc'){if(nd.t!='craft'||G.act<1)return;if(p.recs.length<=5){G.hubMsg='Your library is too small to remove from.';return render()}G.rmMode='rem';G.phase='remove';G.rm=-1;G.hubMsg='';return render()}
if(b=='hdup'&&G.phase=='loc'){if(nd.t!='altar'||u.d||G.act<1)return;G.rmMode='dup';G.phase='remove';G.rm=-1;G.hubMsg='';return render()}
if(b=='hupg'&&G.phase=='loc'){if(nd.t!='altar'||u.u||G.act<1)return;G.rmMode='upg';G.phase='remove';G.rm=-1;G.uo=0;G.hubMsg='';return render()}
if(b=='hdone'&&G.phase=='loc'){nd.done=1;G.phase='map';G.hubMsg='';return render()}
if(b=='rmno'&&G.phase=='remove'){G.rm=-1;G.uo=0;return render()}
if(b=='rmyes'&&G.phase=='remove'){if(G.rm>=0){if(G.rmMode=='dup'){p.recs.push({...p.recs[G.rm]});u.d=1}else p.recs.splice(G.rm,1);G.act--}G.rm=-1;G.phase='loc';return render()}
if(b.startsWith('upg')&&G.phase=='remove'&&G.rmMode=='upg'&&G.rm>=0&&G.uo){const o=G.uo[+b.slice(3)];if(o==null)return;const r=p.recs[G.rm];KO[o][1](r);r.k++;u.u=1;G.act--;G.rm=-1;G.uo=0;G.phase='loc';return render()}}
""")
