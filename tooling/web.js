const SCL=[[0,0,0],[6,1,0],[8,1,2],[12,3,3]];
function sclOf(v){return SCL[Math.min(v,SCL.length-1)]}
function scaleEnemy(e,v){const s=sclOf(v);e.life+=s[0];e.max+=s[0];e.deck.forEach(c=>{if(isC(c)){c.a+=s[1];c.d+=s[2]}})}
function upgOpts(r){return kOpts(mk(r.id,r))}
const WEBW=1000,WEBH=720,LOCN={camp:['🔥','Campfire'],craft:['🔨','Crafting table'],altar:['🏛️','Altar'],start:['⚓','Starting point']};
function genWeb(){for(let tr=0;tr<80;tr++){const N=[{id:0,t:'start',x:500,y:360,adj:[]}];let id=1,bad=false;
[[5,112],[8,215],[11,310]].forEach(([n,r])=>{const off=Math.random()*6.28;for(let i=0;i<n;i++){const a=off+i*6.2832/n+(Math.random()-.5)*(6.2832/n)*.45,rr=r*(1+(Math.random()-.5)*.22);N.push({id:id++,x:500+Math.cos(a)*rr*1.3,y:360+Math.sin(a)*rr*.95,adj:[]})}});
const d=(a,b)=>Math.hypot(N[a].x-N[b].x,N[a].y-N[b].y);
for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++)if(d(i,j)<78)bad=true;if(bad)continue;
const ccw=(a,b,c)=>(N[c].y-N[a].y)*(N[b].x-N[a].x)-(N[b].y-N[a].y)*(N[c].x-N[a].x),cross=(a,b,c,e)=>a!=c&&a!=e&&b!=c&&b!=e&&ccw(a,b,c)*ccw(a,b,e)<0&&ccw(c,e,a)*ccw(c,e,b)<0,E=[],has2=(a,b)=>N[a].adj.includes(b);
const add=(a,b)=>{N[a].adj.push(b);N[b].adj.push(a);E.push([a,b])},ok=(a,b)=>!E.some(([c,e])=>cross(a,b,c,e));
const P=[];for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++)P.push([d(i,j),i,j]);P.sort((x,y)=>x[0]-y[0]);
const par=N.map((x,i)=>i),f=x=>par[x]==x?x:(par[x]=f(par[x]));
for(const[,i,j]of P)if(f(i)!=f(j)){par[f(i)]=f(j);add(i,j)}
for(const[dd,i,j]of P)if(dd<220&&!has2(i,j)&&Math.random()<.6&&ok(i,j))add(i,j);
if(N[0].adj.length<2){for(const[,i,j]of P)if((i==0||j==0)&&!has2(i,j)&&ok(i,j)){add(i,j);break}}
const ids=sh(N.slice(1).map(n=>n.id)),ops=[];while(ops.length<15)ops.push(...sh([0,1,2,3,4,5]));
ids.forEach((x,k)=>{const n=N[x];if(k<15){n.t='fight';n.o=ops[k]}else n.t=['camp','craft','altar'][Math.floor((k-15)/3)];n.used={}});
return{nodes:N,edges:E}}
throw new Error('web gen failed')}
function goNode(id){const W=G.web,nd=W.nodes[id],cu=W.nodes[G.pos];if(G.phase!='map'||!cu.adj.includes(id))return;G.trail=G.trail||{};G.trail[Math.min(id,G.pos)+'-'+Math.max(id,G.pos)]=1;G.pos=id;G.hubMsg='';
if(nd.t=='fight'&&!nd.cleared){G.rt[G.fi]=nd.o;return fight()}
if(nd.t!='fight'&&nd.t!='start'&&!nd.done){G.phase='loc';G.lib=0;return render()}
render()}
function nodeTip(n){const o=n.t=='fight'?EN[n.o]:0,u=n.used||{};
if(n.t=='fight')return n.cleared?`<b>${o.n}</b><br>Defeated.`:`<b>${o.n}</b><br>${o.hint}<br><i>Victory: +1 victory point, +2 action points.</i>`;
if(n.t=='start')return'<b>Starting point</b><br>Your ship is moored here.';
const dn=n.done?'<br><i>You have already used this place.</i>':'';
if(n.t=='camp')return'<b>Campfire</b><br>Spend 1 action point to heal 6 life (never above your maximum). Up to 2 times.'+dn;
if(n.t=='craft')return'<b>Crafting table</b><br>Spend 1 action point to draft a card or remove a card.'+dn;
return'<b>Altar</b><br>Spend 1 action point to duplicate a card (once) and 1 to upgrade any card (once).'+dn}
function renderMap(){try{const R=document.documentElement.style;R.setProperty('--b1','#0b1820');R.setProperty('--b2','#1d4452')}catch(e){}
const Wb=G.web,N=Wb.nodes,cu=N[G.pos],p=G.p,s0=sclOf(G.fi);let ln='',nd='';
Wb.edges.forEach(([a,b])=>{const A=N[a],B=N[b],dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy),sh1=34/L,w=((a*7+b*3)%5-2)*4,nx=-dy/L*w,ny=dx/L*w,key=Math.min(a,b)+'-'+Math.max(a,b),near=a==G.pos||b==G.pos,tr=G.trail&&G.trail[key];
ln+=`<path d="M ${(A.x+dx*sh1).toFixed(1)} ${(A.y+dy*sh1).toFixed(1)} Q ${((A.x+B.x)/2+nx).toFixed(1)} ${((A.y+B.y)/2+ny).toFixed(1)} ${(B.x-dx*sh1).toFixed(1)} ${(B.y-dy*sh1).toFixed(1)}" class="tr${tr?' dn':''}${near?' av':''}"/>`});
N.forEach(n=>{const adj=cu.adj.includes(n.id),here=n.id==G.pos,fresh=n.t=='fight'?!n.cleared:(n.t!='start'&&!n.done),ic=n.t=='fight'?EN[n.o].ic:LOCN[n.t][0],fin=n.t=='fight'?n.cleared:(n.t!='start'&&n.done),top=n.y<190;
nd+=`<button class="wn${here?' cur':''}${adj&&fresh?' go':''}${adj&&!fresh?' walk':''}${fin?' fin':''}${n.t=='fight'||n.t=='start'?'':' loc'}" style="left:${n.x-27}px;top:${n.y-27}px" ${adj?`data-b="go${n.id}"`:'disabled'}><span class="mi">${n.t=='fight'&&n.cleared?'✖':ic}</span>${here?'<em>⛵</em>':''}<span class="tipx${top?' dn':''}">${nodeTip(n)}</span></button>`});
const iw=typeof innerWidth=="undefined"?1400:innerWidth,ih=typeof innerHeight=="undefined"?900:innerHeight,s=Math.max(.3,Math.min(1.25,(iw-24)/WEBW,(ih-300)/WEBH));
document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:28px">Chart your course</div><div class="dsub" style="font-size:20px;opacity:1">⚡ ${G.act} action point${G.act==1?'':'s'} · 🏆 ${G.fi}/${FLOORS} victory points · ❤ ${p.life}/${p.max} · ${p.recs.length} cards</div><div class="dsub" style="opacity:.8">Next opponent: +${s0[0]} ❤, +${s0[1]}/+${s0[2]} on army members</div><div class="tmap" style="width:${WEBW}px;height:${WEBH}px;zoom:${s.toFixed(3)}"><svg width="${WEBW}" height="${WEBH}"><g transform="translate(${WEBW-52},${WEBH-50})"><circle r="26" fill="none" stroke="#6b4a1f" stroke-width="1.5"/><path d="M0-32L6-6 32 0 6 6 0 32-6 6-32 0-6-6Z" fill="#8b5a24" opacity=".75"/><path d="M0-32L6-6 0 0Z M32 0L6 6 0 0Z M0 32L-6 6 0 0Z M-32 0L-6-6 0 0Z" fill="#3b2a14"/><text y="-37" text-anchor="middle" font-size="12" fill="#3b2a14" font-family="Georgia,serif">N</text></g>${ln}</svg>${nd}</div></div>`}
function renderLoc(){const p=G.p,n=G.act,nd=G.web.nodes[G.pos],u=nd.used||(nd.used={}),t=nd.t,no=n<1?' disabled':'';let h='',ttl='';
if(t=='camp'){ttl='🔥 Campfire';h=`<button class="b" data-b="hheal"${no||(u.h||0)>=2||p.life>=p.max?' disabled':''}>Rest: heal 6 life (1 action) · used ${u.h||0}/2</button>`}
else if(t=='altar'){ttl='🏛️ Altar';h=`<button class="b" data-b="hdup"${no||u.d?' disabled':''}>Duplicate a card (1 action)${u.d?' · used':''}</button><button class="b" data-b="hupg"${no||u.u?' disabled':''}>Upgrade a card (1 action)${u.u?' · used':''}</button>`}
else{ttl='🔨 Crafting table';h=`<button class="b" data-b="hdraft"${no}>Draft a card (1 action)</button><button class="b" data-b="hrem"${no}>Remove a card (1 action)</button>`}
document.getElementById('app').innerHTML=`<div class="dft"><div class="ovt" style="font-size:28px">${ttl}</div><div class="dsub">⚡ ${n} action point${n==1?'':'s'} · 🏆 ${G.fi}/${FLOORS} · ❤ ${p.life}/${p.max} · ${p.recs.length} cards in your library</div><div class="hub">${h}<button class="b" data-b="hdone" style="background:#555;color:#efe6cf;box-shadow:none">Leave (this place can't be used again)</button></div><div class="dsub">${G.hubMsg||(n<1?'You have no action points. Defeat enemies to earn more.':'')}</div></div>`}
function renderRemove(){const L=G.p.recs.map((r,i)=>({i,c:mk(r.id,r)})).sort((a,b)=>cost(a.c)-cost(b.c)||D[a.c.id][0].localeCompare(D[b.c.id][0])),X=G.rm>=0&&G.p.recs[G.rm]?mk(G.p.recs[G.rm].id,G.p.recs[G.rm]):0,md=G.rmMode;
if(md=='upg'&&X&&!G.uo){G.uo=sh(upgOpts(G.p.recs[G.rm])).slice(0,2);if(!G.uo.length){G.uo=0;G.rm=-1;G.hubMsg='That card has no available upgrade.';return renderRemove()}}
const vb=md=='dup'?['Duplicate','duplicate']:md=='upg'?['Upgrade','upgrade']:['Remove','remove'];
document.getElementById('app').innerHTML=`<div class="ov rmv"><div class="ovb"><div class="ovt">${vb[0]} one card in your library</div><div class="lib">${L.map(x=>`<div class="rmw" data-rm="${x.i}">${card(x.c,'v:'+x.i)}</div>`).join('')}</div><div class="dsub">${L.length} cards in your library. Click a card to ${vb[1]} it. <button class="b" data-b="hubback" style="margin-left:12px">Back</button><br>${G.hubMsg||''}</div></div></div>${X?`<div class="ov cfm" style="z-index:110"><div class="ovb"><div class="ovt">${vb[0]} ${D[X.id][0]}?</div><div class="big">${card(X,'v:0')}</div>${md=='upg'?`<div class="ovt" style="font-size:20px">Choose one upgrade</div><div class="yn">${G.uo.map((o,j)=>`<button class="b" data-b="upg${j}">${koLabel(o,X)}</button>`).join('')}<button class="b" data-b="rmno">Cancel</button></div>`:`<div class="ovt">Are you sure?</div><div class="yn"><button class="b" data-b="rmyes">Yes</button><button class="b" data-b="rmno">No</button></div>`}</div></div>`:''}`}
