# ===== v82: elites =====
EJS=open(S+'elites.js',encoding='utf-8').read()
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",EJS+"\nfit();try{addEventListener('resize',fit)}catch(e){}")
_b3("mtUp(s,o);","mtUp(s,o);eliteUp(s,o);")
_b3("return (b&&c.rec?Math.max(1,b-c.rec.c):b)+ltx(c)}","return c.free?0:Math.max(0,(b&&c.rec?Math.max(1,b-c.rec.c):b)+ltx(c)-(c.disc||0))}")
# swine / bury / bounce
_b3("const bury=(s,c)=>{if(c.id!='sold'&&c.id!='ein'){","const bury=(s,c)=>{if(c.id=='swine'){swineBack(s,c);return}if(c.id!='sold'&&c.id!='ein'){")
_b3("if(k>=0){s.bf.splice(k,1);s.hand.push(mk(t.id,t.rec))}}};","if(k>=0){s.bf.splice(k,1);if(t.id=='swine'&&t.orig)swineBack(s,t);else s.hand.push(mk(t.id,t.rec))}}};")
_b3("function offer(s,c){","function offer(s,c){atoneHook(s,c);")
# enemy turn start hooks
_b3("markQ();draw(e,1);G.msg=e.nm+' takes its turn…';","markQ();circeStart();draw(e,1);foreIn();G.msg=e.nm+' takes its turn…';")
_b3("ffGrow(e,pl)}else{FX[pl.id](e,p,P.t);bury(e,pl)}","ffGrow(e,pl);hoardAdd(e,pl)}else{FX[pl.id](e,p,P.t);bury(e,pl)}")
_b3("async function endE(){const g=G;await aiEnd();if(g!=G)return;","async function endE(){const g=G;await aiEnd();if(g!=G)return;foretell();")
_b3("if(has(c,'f'))n+=omg(c,'rfly');\n return n}","if(has(c,'f'))n+=omg(c,'rfly');\n if(c.id=='fafn')n+=goldN(s);\n return n}")
# dragon's breath AI
_b3("const open=M.filter(x=>!x.tap);\nswitch(id){","const open=M.filter(x=>!x.tap);\nif(id=='dbrth'){const L=tg(p),k=L.filter(x=>th(x)-x.dmg<=2).length;return L.length>=2&&k>=1?{s:3+k*3+L.length}:null}\nswitch(id){")
# live card text
_b3("tx=(TXT[c.id]||d[6])+","tx=(DYN[c.id]?DYN[c.id](c):(TXT[c.id]||d[6]))+")
# fight selection
_b3("const f=G.boss?BOSS[G.bi]:EN[G.rt[G.fi]],p=G.p;","const f=G.boss?BOSS[G.bi]:G.elt?ELITES[G.elt-1]:EN[G.rt[G.fi]],p=G.p;")
_b3("if(nd.t=='fight'&&!nd.cleared){if(G.fi>=FLOORS)return;G.rt[G.fi]=nd.o;return fight()}","if(nd.t=='fight'&&!nd.cleared){if(G.fi>=FLOORS)return;G.rt[G.fi]=nd.o;G.elt=nd.el||0;return fight()}")
_b3("function nodeTip(n){const o=n.t=='fight'?EN[n.o]:0,u=n.used||{};","function nodeTip(n){const o=n.t=='fight'?fo(n.o):0,u=n.used||{};")
_b3("<br>${o.hint}<br><i>Victory: +1 victory point, +2 action points.</i>`;","<br>${o.hint}<br><i>${n.el?'Elite. Victory: +1 victory point, +3 action points and a free draft with better odds of rare cards.':'Victory: +1 victory point, +2 action points.'}</i>`;")
_b3("<b>${o.n}</b><br>${o.hint}","<b>${o.n}${n.el?' ★ Elite':''}</b><br>${o.hint}") if False else None
_b3("ic=n.t=='fight'?EN[n.o].ic:","ic=n.t=='fight'?fo(n.o).ic:")
_b3("${here?' cur':''}${adj&&fresh?' go':''}","${n.el?' elt':''}${here?' cur':''}${adj&&fresh?' go':''}")
_b3("(EN[G.rt[G.fi]]||{}).bg","(fo(G.rt[G.fi])||{}).bg")
_b3(".wn em{position:absolute;right:-12px;top:-14px;",".wn.elt .mi{border-color:#e8b923;box-shadow:0 0 0 3px #e8b92388,0 0 14px #e8b923}.wn.elt:after{content:'★';position:absolute;top:-10px;left:-8px;font-size:20px;color:#e8b923;text-shadow:0 1px 2px #000}.wn em{position:absolute;right:-12px;top:-14px;")
# map generation
_b3("else n.t=['camp','craft','altar'][Math.floor((k-15)/3)];n.used={}});","else n.t=['camp','craft','altar'][Math.floor((k-15)/3)];n.used={}});{const el=(CHARS[CH]||CHARS.ody).el||[];sh(ids.slice(0,15)).slice(0,el.length).forEach((x,j)=>{N[x].el=el[j]+1;N[x].o=100+el[j]})}")
# rewards
_b3("G.fi++;G.act+=2;if(G.fi>=FLOORS&&!G.gift)","G.fi++;G.act+=2+(G.elt?1:0);if(G.fi>=FLOORS&&!G.gift)")
_b3("n.closed=1}})}G.hubMsg='';G.phase='map';G.lib=0;render()}","n.closed=1}})}G.hubMsg='';G.phase='map';G.lib=0;if(G.elt){G.elt=0;G.dr={mode:'reward',elite:1,rounds:1,n:0,picks:[],off:[],busy:0,pause:0};G.phase='draft';dealDraft()}render()}")
_b3("W=G.dr.mode=='reward'?RW2:RW,","W=G.dr.mode=='reward'?(G.dr.elite?RWE:RW2):RW,")
_b3("RW2={C:1,U:4,R:3.5,L:1.1},","RW2={C:1,U:4,R:3.5,L:1.1},RWE={C:.4,U:3.5,R:5,L:1.8},")
_b3("if(dr.mode=='reward'){dr.picks.forEach(id=>G.p.recs.push(nr(id)));G.act--;G.phase='loc';G.dr=0;return render()}","if(dr.mode=='reward'){dr.picks.forEach(id=>G.p.recs.push(nr(id)));if(dr.elite){G.phase='map'}else{G.act--;G.phase='loc'}G.dr=0;return render()}")
_b3("if(b=='dpass'){if(G.dr&&G.dr.mode=='reward'&&!G.dr.busy){G.act--;G.phase='loc';","if(b=='dpass'){if(G.dr&&G.dr.mode=='reward'&&!G.dr.busy){if(G.dr.elite){G.phase='map';G.dr=0;G.lib=0;return render()}G.act--;G.phase='loc';")
_b3("Passing takes no card, but still uses this action.","'+(dr.elite?'Passing takes no card.':'Passing takes no card, but still uses this action.')+'")
_b3("${rw?'Spoils of victory':'Draft your army'}","${rw?(dr.elite?'Elite spoils: a free draft':'Spoils of victory'):'Draft your army'}")
_b3("scaleEnemy(G.e,G.boss?f.sc:G.fi);if(f.trump)","scaleEnemy(G.e,G.boss?f.sc:G.fi);if(!G.boss){const xa=xAdj(f);if(xa)scaleEnemy(G.e,xa);if(f.sb&&G.fi>=4)scaleEnemy(G.e,f.sb)}if(f.trump)")
