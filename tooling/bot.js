var CNT=[{p:0,e:0},{p:0,e:0},{p:0,e:0},{p:0,e:0}];
function resetCnt(){FOSET=0;CNT=[{p:0,e:0},{p:0,e:0},{p:0,e:0},{p:0,e:0}]}
var _offer=offer;offer=function(s,c){(CNT[G.fi]||(CNT[G.fi]={p:0,e:0}))[s===G.p?'p':'e']++;return _offer(s,c)};
function val(x){return pw(x)+th(x)-x.dmg}
function cardVal(c){const d=D[c.id];if(d[2]=='C')return d[3]+d[4];return({horse:8,bow:(G.e.life<=10?14:6),altar:5,spearc:5,feast:4,gale:4,salve:3})[c.id]||4}
function plan(c){const p=G.p,e=G.e,id=c.id,E=cr(e),M=cr(p);
 if(G.ch==='odin'){const r=planOdin(c,p,e,E,M);if(r!==undefined)return r}
 if(G.ch==='wukong'){const r=planWk(c,p,e,E,M);if(r!==undefined)return r}
 if(D[id][2]=='C'){if(id=='sinon'&&M.length<2)return null;if(id=='sapper'&&!G.e.bf.some(x=>!isC(x)&&!has(x,'w'))&&M.length>=3)return null;return(M.length<5||cost(c)>G.p.mana)?{}:null}
 if(id=='altar'||id=='bow'||id=='zeus')return p.bf.some(x=>x.id==id)?null:{};
 if(id=='mist'){const t=E.filter(x=>!x.tap&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return t&&M.some(canAtk)?{t:'e:'+t.u}:null}
 const AURAB={wall:'p',ossuary:'o',banner:'r',ares:'r',shield:'p',doct:'p',thermo:'p'};
 if(AURAB[id]){if(p.bf.some(x=>x.id==id))return null;return M.filter(x=>has(x,AURAB[id])).length>=(id=='ares'||id=='shield'||id=='thermo'?1:2)?{}:null}
 if(id=='requiem'){const n=Math.min(8,p.gy.length);return(n>=e.life||(n>=6&&e.life<=n+6))?{}:null}
 if(id=='games'){const t=M.filter(x=>val(x)<=5||sv(x)>=3).sort((a,b)=>val(a)-val(b))[0];return t&&M.length>=2&&p.hand.length<=5?{t:'p:'+t.u}:null}
 if(id=='horde')return null;
 if(id=='karma')return p.bf.some(x=>x.id==id)||p.mana<3?null:{}
 if(id=='drill')return M.filter(x=>has(x,'p')).length>=2?{}:null;
 if(id=='spoils')return M.filter(x=>has(x,'r')).length>=1&&p.hand.length<=5?{}:null;
 if(id=='rally'||id=='hold'||id=='rampart'||id=='testudo'||id=='fury')return null;
 if(id=='pyre'||id=='net'||id=='hearth'||id=='doct'||id=='banner'||id=='skies'){if(p.bf.some(x=>x.id==id))return null;if(id=='skies'&&!M.some(x=>has(x,'f')))return null;if((id=='banner'||id=='doct'||id=='hearth')&&M.length<2)return null;return{}}
 if(id=='hammer'||id=='plunder'){const t=G.e.bf.filter(x=>!isC(x)&&!has(x,'w')).sort((a,b)=>(IV[b.id]||5)-(IV[a.id]||5))[0];return t?{t:'e:'+t.u}:null}
 if(id=='hecat'){const t=M.filter(x=>val(x)<=5||sv(x)>=2).sort((a,b)=>val(a)-val(b))[0];return t&&p.hand.length<=4?{t:'p:'+t.u}:null}
 if(id=='thunder'){const t=E.filter(x=>th(x)-x.dmg<=(has(x,'f')?6:4)&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return t?{t:'e:'+t.u}:null}
 if(id=='labyr'){const ub=E.filter(x=>!x.tap);const at=M.filter(canAtk);return ub.length>=2&&at.reduce((n,x)=>n+pwr(x),0)>=G.e.life*.7?{}:null}
 if(id=='horse')return{};
 if(id=='spearc'){const t=E.filter(x=>th(x)-x.dmg<=3&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return t?{t:'e:'+t.u}:null}
 if(id=='gale'){const t=E.filter(x=>cost(x)>=4&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return t?{t:'e:'+t.u}:null}
 if(id=='salve'){const t=M.filter(x=>x.dmg>=2).sort((a,b)=>b.dmg-a.dmg)[0];return t?{t:'p:'+t.u}:null}
 if(id=='feast'){const d=M.reduce((n,x)=>n+Math.min(x.dmg,1),0);return(p.life<=p.max-3||d>=2)?{}:null}
 return null}
function exec(c,pl){hd('h:'+c.u);if(pl.t)hd(pl.t);if(G.pend=='sinon'){const t=cr(G.p).filter(x=>x!==G.pc).sort((a,b)=>val(a)-val(b))[0];hd('p:'+t.u);return}if(G.pend=='sapper'||G.pend=='vlnd'){const t=G.e.bf.filter(x=>!isC(x)&&!has(x,'w')).sort((a,b)=>(IV[b.id]||5)-(IV[a.id]||5))[0];hd('e:'+t.u);return}if(G.pend){const E=tg(G.e).filter(x=>G.pend=='slinger'||!x.tap),k=E.filter(x=>th(x)-x.dmg<=1),t=(k.length?k:E).sort((a,b)=>val(b)-val(a))[0];if(t)hd('e:'+t.u);else G.pend=0}}
function sacPlan(c){const p=G.p,alt=p.bf.some(x=>x.id=='altar')?1:0,need=cost(c)-p.mana,S=[];let gn=0;
 for(const x of cr(p).sort((a,b)=>val(a)-val(b))){if(gn>=need)break;S.push(x);gn+=sv(x)+alt}
 const ok=gn>=need&&S.length<=2&&(S.every(x=>th(x)-x.dmg<=1)||cardVal(c)>=S.reduce((n,x)=>n+val(x),0)+4);return ok?S:null}
function botBow(){const b=G.p.bf.find(x=>x.id=='bow'&&!x.tap);if(!b)return;const E=tg(G.e).filter(x=>th(x)-x.dmg<=1);hd('p:'+b.u);hd(E[0]?'e:'+E[0].u:'ef')}
function botHades(){const p=G.p;for(let k=0;k<6&&G.hq;k++){if(G.hdisc){const w=p.hand.slice().sort((a,b)=>((RATE[a.id]==null?5:RATE[a.id])+(cost(a)>p.mana+3?-2:0))-((RATE[b.id]==null?5:RATE[b.id])+(cost(b)>p.mana+3?-2:0)))[0];hqd(w.u)}else if(p.hand.length<=5)bt('hqy');else bt('hqn')}}
function castLoop(){const p=G.p;let ns=0;for(let n=0;n<40&&G.phase==='main';n++){let acted=false;botHades();
 const ip=p.bf.find(x=>x.id==='iph');if(ip&&(p.hand.length<=3||p.hand.some(c=>cost(c)>p.mana))){hd('o:'+ip.u);continue}
 if(ns<2){const big=p.hand.filter(c=>cost(c)>p.mana&&plan(c)).sort((a,b)=>cost(b)-cost(a));
  for(const c of big){const S=sacPlan(c);if(S){S.forEach(x=>hd('o:'+x.u));ns+=S.length;acted=true;break}}}
 if(acted)continue;
 if(typeof duelOn==='function'&&duelOn()&&cr(p).length>=2&&ns<3){const w=cr(p).slice().sort((a,b)=>val(a)-val(b))[0],cand=p.hand.filter(c=>D[c.id][2]==='C'&&cost(c)<=p.mana+sv(w)).sort((a,b)=>cardVal(b)-cardVal(a))[0];if(cand&&cardVal(cand)>=val(w)+3){hd('o:'+w.u);ns++;continue}}
 for(const c of orderHand(p)){if(cost(c)>p.mana)continue;const pl=plan(c);if(pl){exec(c,pl);acted=true;break}}
 if(!acted&&G.ch==='wukong'){WKLR=1;for(const c of orderHand(p)){if(cost(c)>p.mana)continue;const pl=plan(c);if(pl){WKLR=0;exec(c,pl);acted=true;break}}WKLR=0}
 if(!acted&&G.ch==='odin')acted=botBP();
 if(!acted)break}}
function botAttack(){const p=G.p,e=G.e;{const hz=p.hand.find(c=>c.id==='horde'&&cost(c)<=p.mana);if(hz&&cr(p).filter(x=>has(x,'r')&&canAtk(x)).length>=2)exec(hz,{})}const pl=attackPlan(p,e);const forced=cr(p).filter(c=>c.forced&&canAtk(c));
 let at=pl&&pl.S.length?pl.S:[];forced.forEach(c=>{if(!at.includes(c))at=[...at,c]});
 if(wallTax(1)){at=at.slice().sort((a,b)=>(forced.includes(b)?99:pwr(b))-(forced.includes(a)?99:pwr(a)));while(at.length&&wallTax(at.length)>p.mana)at.pop()}
 if(at.length){G.sel=at.map(c=>c.u);G.tg=pl&&pl.tgm?{...pl.tgm}:{};bt('atk');if(G.phase==='dmgP'){const r=p.hand.find(c=>c.id==='rally'&&cost(c)<=p.mana);if(r&&G.cmb.atk.length>=2)exec(r,{});
  const hz=p.hand.find(c=>c.id==='horde'&&cost(c)<=p.mana);if(hz){const rr=G.cmb.atk.map(u=>p.bf.find(x=>x.u==u)).filter(x=>x&&has(x,'r'));if(rr.length>=2||(rr.length&&G.e.life<=rr.reduce((n,x)=>n+pwr(x),0)+4*rr.length))exec(hz,{})}
  const f=p.hand.find(c=>c.id==='fury'&&cost(c)<=p.mana);if(f){for(const u of G.cmb.atk){const a=p.bf.find(x=>x.u==u),bu=G.cmb.blk[u],b=bu&&G.e.bf.find(x=>x.u==bu);if(b&&!kills(a,b)&&pwr(a)+3>=th(b)-b.dmg&&th(a)-a.dmg>pwr(b)){exec(f,{t:'p:'+a.u});break}if(!b&&!(G.cmb.tg&&G.cmb.tg[u])&&G.e.life<=pwr(a)+3&&G.e.life>pwr(a)){exec(f,{t:'p:'+a.u});break}}}
  if(G.ch==='odin')odinTricks();
  bt('res')}}}
var MAXA=0;function trk(){MAXA=Math.max(MAXA,cr(G.p).length,cr(G.e).length)}
function botMain(){trk();botHades();botBow();if(G.ch==='odin')botTaps();let rs=0;if(wallTax(1)){const pl=attackPlan(G.p,G.e);rs=Math.min(pl&&pl.S?pl.S.length:0,G.p.mana);G.p.mana-=rs}castLoop();G.p.mana+=rs;if(G.phase!=='main')return;botAttack();if(G.phase!=='main')return;castLoop();if(G.phase==='main')bt('end')}
function botBlock(){trk();botHades();const p=G.p,c=G.cmb,A=c.atk.map(u=>G.e.bf.find(x=>x.u==u)).filter(Boolean).sort((a,b)=>pwr(b)-pwr(a)),used=new Set();
 const tot=A.reduce((n,a)=>n+(c.tg&&c.tg[a.u]?0:pwr(a)),0);
 for(const a of A){const bl=cr(p).filter(x=>!used.has(x.u)&&canBlock(x,a)),ah=th(a)-a.dmg;
  let b=bl.filter(x=>pwr(x)>=ah&&th(x)-x.dmg>pwr(a)).sort((x,y)=>cost(x)-cost(y))[0]||bl.filter(x=>th(x)-x.dmg>pwr(a)).sort((x,y)=>cost(x)-cost(y))[0]||bl.filter(x=>pwr(x)>=ah&&val(x)<=val(a)).sort((x,y)=>val(x)-val(y))[0];
  const tg=c.tg&&c.tg[a.u]?p.bf.find(x=>x.u==c.tg[a.u]):null;
  if(!b&&(tot>=p.life-4||(tg&&th(tg)-tg.dmg<=cdmg(a)&&val(tg)>=6)))b=bl.sort((x,y)=>val(x)-val(y))[0];
  if(b){used.add(b.u);hd('p:'+b.u);hd('e:'+a.u)}}
 if(G.ch==='odin')odinBlockTricks(used);
 if(G.ch==='wukong')wkBlockTricks(used);
 {const t=p.hand.find(c=>c.id==='testudo'&&cost(c)<=p.mana);if(t&&[...used].filter(u=>{const b=p.bf.find(x=>x.u==u);return b&&b.def}).length>=1)exec(t,{})}
 bt('res')}
var KOS=[3.2,3,3.4,1.5,3.6,2.5,3.3];for(let i=7;i<20;i++)KOS.push(3.1);
function koBest(c,opts){return opts.slice().sort((a,b)=>(KOS[b]+(b==2&&cost(c)>=3?.6:0))-(KOS[a]+(a==2&&cost(c)>=3?.6:0)))[0]}
function botKleos(){for(const x of G.kl){const o=koBest(x.c,x.o),j=x.o.indexOf(o);KO[o][1](x.c.rec);x.c.rec.k++;x.d=j+1}bt('next')}

var RATE={wall:6,shield:7,drill:5,ares:7,spoils:5,ossuary:6,requiem:8,dream:0,garden:0,dirge:0,forge:0,thess:6,zerk:7,boar:7,diom:7,agam:7,nike:8,iris:6,helios:7,athena:6,pyrep:6,ox:5,sent:5,gate:7,hydra:6,sinon:5,tires:5,sapper:7,pyre:6,doct:5,banner:7,skies:6,net:6,hearth:5,hammer:4,plunder:5,hecat:5,fury:5,testudo:5,thunder:8,labyr:3,spear:5,sailor:5,goat:4,myrm:5,herm:5,camp:6,argus:7,pythia:5,slinger:7,healer:6,spartan:6,telem:5,bull:8,cass:7,nestor:6,pegasus:7,ajax:6,achil:9,eagle:8,hopl:7,owl:5,tela:6,spearc:8,salve:4,gale:4,feast:5,altar:7,horse:6,bow:8,aegis:4,hold:3,mist:6,rally:5,rampart:4,zeus:6};
var DMODE=(typeof process!=='undefined'&&process.env&&process.env.DMODE)||'rated';
function botDraft(){if(typeof FORCED!=='undefined'&&FORCED&&FORCED.length){while(G.phase==='draft'&&FORCED.length){const id=FORCED.shift();G.dr.off=[{id}];pickDraft(0)}return}
while(G.phase==='draft'){const dr=G.dr,off=dr.off,crN=(dr.mode==='reward'?G.p.recs.map(r=>r.id):STAPLES).concat(dr.picks).filter(id=>D[id][2]==='C').length,left=dr.rounds-dr.n,needC=Math.max(0,(G.ch==='wukong'?3:6)-crN);
 let idx=off.map((c,i)=>i);if(DMODE==='random'){pickDraft(idx[Math.random()*3|0]);continue}
 if(needC>=left){const cs=idx.filter(i=>D[off[i].id][2]==='C');if(cs.length)idx=cs}
 const have=(dr.mode==='reward'?G.p.recs.map(r=>r.id):[]).concat(dr.picks).filter(x=>!STAPLES.includes(x)),cn={};have.forEach(id=>(TAG[id]||'').split('').forEach(k=>cn[k]=(cn[k]||0)+1));
 const FS={P:'drill bastion testudo wall shield rampart doct hearth',R:'fury rally spoils sack banner ares',O:'hecat altar zeus pyre ossuary requiem'};
 const FO=(typeof process!=='undefined'&&process.env&&process.env.FORCE)||'';
 const fb=id=>FO?(((TAG[id]||'').includes(FO)||(FS[FO]||'').split(' ').includes(id))?4:-1.5):0;
 const dupp=id=>G.ch==='wukong'?1.3*have.filter(x=>x===id).length:0;
 const sc=i=>(RATE[off[i].id]==null?5:RATE[off[i].id])+fb(off[i].id)+.35*(TAG[off[i].id]||'').split('').reduce((n,k)=>n+(cn[k]||0),0)-dupp(off[i].id);
 idx.sort((a,b)=>sc(b)-sc(a));pickDraft(idx[0])}}

function botRemove(){let bi=0,bv=99;G.p.recs.forEach((r,i)=>{const v=(RATE[r.id]==null?5:RATE[r.id])+r.k*.5;if(v<bv){bv=v;bi=i}});G.rm=bi;bt('rmyes')}

function recVal(r){const c=mk(r.id,r);return(RATE[r.id]==null?5:RATE[r.id])+(isC(c)?1:0)-r.k*1.5}
function botUpg(){bt('hupg');const idx=G.p.recs.map((r,i)=>i).sort((a,b)=>recVal(G.p.recs[b])-recVal(G.p.recs[a]));for(const i of idx){G.rm=i;G.uo=0;render();if(G.uo&&G.uo.length){const c=mk(G.p.recs[i].id,G.p.recs[i]),o=koBest(c,G.uo);return bt('upg'+G.uo.indexOf(o))}}G.rm=-1;bt('hubback')}
function botDup(){bt('hdup');if(G.phase!=='remove')return;const idx=G.p.recs.map((r,i)=>i).filter(i=>RAR[G.p.recs[i].id]!=='R'||G.act>=2).sort((a,b)=>recVal(G.p.recs[b])-recVal(G.p.recs[a]));if(!idx.length){G.rm=-1;return bt('hubback')}G.rm=idx[0];bt('rmyes')}
function botCraft(){const p=G.p,w=p.recs.map((r,i)=>({i,v:(RATE[r.id]==null?5:RATE[r.id])+r.k*.5})).sort((a,b)=>a.v-b.v)[0];
 if(p.recs.length>9&&w&&w.v<=3.5){bt('hrem');if(G.phase==='remove'){G.rm=w.i;return bt('rmyes')}}
 bt('hdraft');botDraft()}
function botLoc(){const p=G.p,nd=G.web.nodes[G.pos],u=nd.used||(nd.used={});
 for(let g=0;g<14&&G.phase==='loc';g++){
  if(G.act>=1&&nd.t=='camp'&&(u.h||0)<2&&p.life<=p.max-4){bt('hheal');continue}
  if(G.act>=1&&nd.t=='altar'){if(!u.u){botUpg();continue}if(!u.d){botDup();continue}}
  if(G.act>=1&&nd.t=='craft'){botCraft();continue}
  break}
 if(G.phase==='loc')bt('hdone')}
var OPPD=[0,0,0,0,0,0];
function botScore(n){const p=G.p;if(n.t=='fight')return n.cleared?0:3;if(n.done||n.t=='start'||G.act<1)return 0;
 if(n.t=='altar')return 10;if(n.t=='craft')return 8;if(n.t=='camp')return p.life<=p.max-6?9:(p.life<=p.max-4?4:0);return 0}
var FOSET=0;
function botMap(){const W=G.web,N=W.nodes;if(typeof FOPP!=='undefined'&&FOPP>=200&&!FOSET){FOSET=1;G.boss=1;G.bi=FOPP-200;G.phase='main';fight();return}if(typeof FOPP!=='undefined'&&FOPP>=0&&!FOSET){FOSET=1;N.forEach(n=>{if(n.t=='fight'){n.o=FOPP;n.el=FOPP>=100?FOPP-99:0}})}
 const dist=N.map(()=>1e9),prev=N.map(()=>-1),done=N.map(()=>false);dist[G.pos]=0;
 for(let k=0;k<N.length;k++){let a=-1;N.forEach((n,i)=>{if(!done[i]&&(a<0||dist[i]<dist[a]))a=i});if(a<0||dist[a]>=1e9)break;done[a]=true;N[a].adj.forEach(b=>{const c=dist[a]+1+(N[b].t=='fight'&&!N[b].cleared?4:0);if(c<dist[b]){dist[b]=c;prev[b]=a}})}
 let best=-1,bs=-1e9;N.forEach((n,i)=>{const s=botScore(n);if(i==G.pos||s<=0||dist[i]>=1e9)return;const real=dist[i]-(n.t=='fight'&&!n.cleared?4:0),v=s-1.2*real+Math.random()*.5;if(v>bs){bs=v;best=i}});
 if(best<0){const adj=N[G.pos].adj;best=adj[Math.random()*adj.length|0];return bt('go'+best)}
 let st=best;while(prev[st]!=G.pos&&prev[st]>=0)st=prev[st];bt('go'+st)}

Object.assign(RATE,{leon:9,thermo:8,brasidas:8,pent:9,horde:8,eury:8,iph:9,hades:9,thanat:8,games:7,karma:6});
Object.assign(RATE,{tbull:7,mino:7,sphinx:7,eagle:8});

/* ===== Odin bot ===== */
Object.assign(RATE,{roar:5,hguard:7,scrb:6,odn:9,mead:5,sprm:6,gash:4,hamr:7,lstd:6,scav:5,stdb:5,slst:6,gunn:8,bald:9,ansu:5,volv:6,hagl:6,ulf:5,bsrk:6,fjrd:5,skar:6,wulf:6,gslay:6,egil:7,blod:7,skul:7,ulfk:8,star:9,bldr:5,howl:4,rage:6,mhall:7,rend:7,thegn:5,shmd:5,einw:5,skld:6,valk:7,eir:6,huscl:6,jarl:7,brynh:9,sigur:8,ghall:6,vfea:7,host:7,ofr:5,vmar:4,hugi:6,muni:5,skal:5,rser:4,fylg:6,hrav:7,ruru:6,alg:5,fehu:6,reir:4,mimr:7,rfly:5,gald:3,seid:6,ygg:8,norn:7,tiwa:6,slei:8,mjol:8,thor:9,loki:3,tyr:7,idun:5,hela:6,vlnd:5,hird:5,thrl:5,gung:6,oath:5});
function planOdin(c,p,e,E,M){const id=c.id,t=D[id][2];
 if(lcost(c)>0&&p.life<=lcost(c)+4)return null;
 const kill=n=>E.filter(x=>th(x)-x.dmg<=n&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];
 const have=()=>p.bf.some(x=>x.id==id);
 if(t=='C')return undefined;
 if(t=='E'||t=='A'){if(have())return null;
  const n=(f)=>M.filter(f).length;
  if(id=='ghall')return M.length>=2?{}:null;
  if(id=='mhall')return n(x=>has(x,'u')||has(x,'i'))>=2?{}:null;
  if(id=='ruru'||id=='alg'||id=='ygg')return M.length>=2&&p.life>8?{}:null;
  if(id=='fehu'||id=='mimr')return p.life>9?{}:null;
  if(id=='reir')return p.life*2<=p.max+2?{}:null;
  if(id=='rfly')return n(x=>has(x,'f'))>=2?{}:null;
  if(id=='idun')return M.length>=2?{}:null;
  if(id=='ansu')return p.hand.length<=3&&p.life>6?{}:null;
  return {}}
 switch(id){
 case'slst':{const n=Math.max(2,Math.min(6,p.fl||0));const x=kill(n);return x&&val(x)>=4?{t:'e:'+x.u}:null}
 case'hagl':{const k=E.filter(x=>th(x)-x.dmg<=2&&!has(x,'w')).length;return k>=2||(k>=1&&E.length>=3)?{}:null}
 case'mead':return p.hand.length<=4?{}:null;
 case'gung':{const x=kill(3);return x?{t:'e:'+x.u}:null}
 case'seid':{const x=kill(3)||E.filter(x=>!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return x&&val(x)>=6?{t:'e:'+x.u}:null}
 case'rend':{const x=kill(6);return x&&val(x)>=7&&p.life>6?{t:'e:'+x.u}:null}
 case'hela':{const x=E.filter(x=>x.dmg>0&&!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return x&&val(x)>=5?{t:'e:'+x.u}:null}
 case'bldr':return p.life>10&&p.hand.length<=4?{}:null;
 case'norn':return p.hand.length<=3?{}:null;
 case'ofr':{const w=M.slice().sort((a,b)=>val(a)-val(b))[0];return w&&M.length>=2&&p.hand.length<=5&&val(w)<=6?{t:'p:'+w.u}:null}
 case'vfea':return M.length<5&&p.gy.some(x=>isC(x)&&x.id!='sold'&&x.id!='ein'&&cost(x)>=3)?{}:null;
 case'host':return M.length<=3&&(p.fl||0)>=2?{}:null;
 default:return null}}
function botBP(){const p=G.p;if(G.ch!=='odin'||(p.bp||0)>=BPMAX||p.life<=9)return false;
 const need=c=>cost(c)-p.mana;
 const cs=p.hand.filter(c=>need(c)>0&&need(c)<=BPMAX-(p.bp||0)&&plan(c)).sort((a,b)=>cardVal(b)-cardVal(a));
 if(!cs.length)return false;const c=cs[0];if(p.life-bpc()<9)return false;
 for(let i=need(c);i>0;i--)bt('bp');return true}
function botTaps(){const p=G.p,E=tg(G.e);
 for(const it of p.bf.filter(x=>TAPA[x.id]&&!x.tap)){
  if(TAPA[it.id].dmg){const d=TAPA[it.id].dmg,k=E.filter(x=>th(x)-x.dmg<=d).sort((a,b)=>val(b)-val(a))[0]||E.sort((a,b)=>pwr(b)-pwr(a))[0];if(k){hd('p:'+it.u);hd('e:'+k.u)}}
  else if(p.life*2<p.max)hd('p:'+it.u)}}
function odinTricks(){const p=G.p,e=G.e;
 const atk=G.cmb.atk.map(u=>p.bf.find(x=>x.u==u)).filter(Boolean);
 const rg=p.hand.find(c=>c.id==='rage'&&cost(c)<=p.mana);if(rg&&atk.length>=2){exec(rg,{})}
 const ro=p.hand.find(c=>c.id==='roar'&&cost(c)<=p.mana);if(ro&&atk.length>=2&&e.bf.filter(x=>!x.tap&&isC(x)).length>=2){exec(ro,{})}
 const ls=p.hand.find(c=>c.id==='lstd'&&cost(c)<=p.mana);if(ls&&atk.length>=2){exec(ls,{})}
 const vm=p.hand.find(c=>c.id==='vmar'&&cost(c)<=p.mana);if(vm&&(p.fl||0)>=2&&atk.length>=2)exec(vm,{});
 for(const nm of['howl','oath']){const f=p.hand.find(c=>c.id===nm&&cost(c)<=p.mana&&(lcost(c)==0||p.life>lcost(c)+4));if(!f)continue;
  const b=nm==='howl'?(wnd(p)?3:2):3;
  for(const a of atk){const bu=G.cmb.blk[a.u],bl=bu&&e.bf.find(x=>x.u==bu);
   if(bl&&!kills(a,bl)&&(pwr(a)+b>=th(bl)-bl.dmg)&&th(a)-a.dmg+(nm==='oath'?3:0)>pwr(bl)){exec(f,{t:'p:'+a.u});break}
   if(!bl&&!(G.cmb.tg&&G.cmb.tg[a.u])&&e.life<=pwr(a)+b&&e.life>pwr(a)){exec(f,{t:'p:'+a.u});break}}}}
function odinBlockTricks(used){const p=G.p,c=G.cmb;
 const o=p.hand.find(x=>x.id==='oath'&&cost(x)<=p.mana&&p.life>6);
 if(o){for(const a of c.atk.map(u=>G.e.bf.find(x=>x.u==u)).filter(Boolean)){const bu=c.blk[a.u],b=bu&&p.bf.find(x=>x.u==bu);if(b&&!kills(a,b)===false&&pwr(b)+3>=th(a)-a.dmg){exec(o,{t:'p:'+b.u});break}}}}

/* ===== Wukong bot ===== */
Object.assign(RATE,{wpierce:8.0,wthou:8.0,wpig:7.5,wacro:7.5,wsmash:7.0,wcounter:7.0,wking:6.5,wmirror:6.0,wsplit:6.0,wspin:6.0,wpluck:6.0,wsix:6.0,wcycle:6.0,wruyi:5.5,wclone:5.5,wxform:5.5,wvolley:5.5,wwine:5.0,wfeint:5.0,wpeachc:5.0,wsent:5.0,wflurry:5.0,wfan:5.0,wslip:4.5,wdrink:4.5,wcloudr:4.5,whstorm:4.5,wdodge:4.5,wdance:4.0,wrout:4.0,wledger:4.0,wblock:3.5,wcloudh:3.5,wgrow:3.5,wfurn:3.0,wpocket:3.0,wchange:2.5,wstep:3,wmount:2.0,wtypes:4.5,wtroop:5,worchard:4,wfoot:3,wmyriad:6,wwind:5,wseal:3,waugury:6,wecho:2.5,wtang:4,wheist:1.5,wmonk:5,wdart:5,wrod:5,wsomer:5});
var WKLR=0;
var WKP={wpeach:9,wwine:8,wruyi:8.5,wmonk:6,wdrink:6,wcloudh:3,wpluck:6,wthou:6,whair:5,wdart:5,wrod:4,wvolley:3,wspin:3,wpierce:4,wsmash:4,whstorm:3,wcounter:4,wfeint:3,wslip:3,wmirror:7,wking:5,wclone:5,wacro:5,wsent:5,wpig:5,wsix:5,wheist:5,wpeachc:7,wmount:6,wpocket:2,wstep:2,wgrow:1.5,wcloudr:1.5,wblock:0,wdance:2.5,wfan:2,wsomer:2,wchange:2.5,wxform:3,wfurn:2,wledger:3,wrout:2,wflurry:1,wsplit:0,wcycle:1,wtypes:3,wtroop:5,worchard:4,wfoot:6,wmyriad:1,wwind:5,wseal:2.5,waugury:7,wecho:2,wtang:5.5};
Object.assign(RATE,{wpyre:8,wtree:8,wnull:5,wburn:6.5,wunravel:3.5,wskin:6,wchamel:5.5,wgate:3.5,wgreat:3,wbanq:3,wmist:3.5,wgust:3.5,wunward:3,wrally:3.5,wmillion:3,wqt:4,wnez:5.5,wsandy:6,wpeachg:3,wbigstaff:5,wdisc:7.0,wbreak:6.5,wjug:6.5,wbear:6.0,wlegion:6.0,wmirm:5.5,wvang:5.5,wpeachk:5.0,wcloudm:5.5,wdrum:6.0});Object.assign(WKP,{wskin:6,wpyre:5,wtree:8,wburn:3,wunravel:3,wchamel:5,wgate:3,wgreat:3,wbanq:2,wmist:2,wgust:2,wunward:1,wrally:3,wmillion:6,wqt:5,wnez:5,wsandy:5,wpeachg:5,wbigstaff:1,wnull:4,wdrum:6.5,wjug:5.5,wvang:4.5,wmirm:4,wlegion:5,wpeachk:4,wcloudm:4.5,wdisc:5,wbear:4,wbreak:5});
Object.assign(RATE,{wpig:8.5,wacro:8.5,wking:9,wjug:7.5,wbear:7.5,wvang:7.5,wpierce:5.5,wsmash:4.5,wspin:5,wmirror:4,wcounter:5.5,wheist:4,wnull:6,wpeachk:5.5,wmirm:5.5,wdrum:6});
function orderHand(p){const h=p.hand.slice();if(G.ch!=='wukong')return h.sort((a,b)=>cost(b)-cost(a));
 const pr=c=>{const id=c.id,t=WT[id];let s=WKP[id]==null?3:WKP[id];if(t&&t!==(p.lt||''))s+=1.5;
  if(id==='wfeint'&&p.lt==='st')s+=4;if(id==='wslip'&&p.lt==='tr')s+=4;if(id==='wcounter'&&p.lt==='lp')s+=4;
  if(id==='wcycle'&&p.tys&&p.tys.tr&&p.tys.lp)s+=6;return s};
 return h.sort((a,b)=>pr(b)-pr(a))}
function wkPay(p){return p.hand.some(x=>['wsplit','wflurry','wrout','wvolley','wspin','wgrow','wcloudh','wblock'].includes(x.id))||p.bf.some(x=>['wruyi','wacro','wking'].includes(x.id))}
function planWk(c,p,e,E,M){const id=c.id,k=D[id][2];if(k==='C'){if(id==='wsix'&&!E.some(x=>D[x.id][1]<=4)&&M.length>=1)return null;return undefined}
 const open=E.filter(x=>!has(x,'w')),pl=p.lt||'',mo2=(p.mo||0)+(WT[id]&&WT[id]!==pl?1:0),cp2=(p.cp||0)+1,dk=Math.floor(cp2/2);
 const T=x=>x?{t:'e:'+x.u}:null,P=x=>x?{t:'p:'+x.u}:null;
 const killer=n=>open.filter(x=>th(x)-x.dmg<=n).sort((a,b)=>val(b)-val(a))[0];
 const weakest=()=>open.slice().sort((a,b)=>(th(a)-a.dmg)-(th(b)-b.dmg)||val(b)-val(a))[0];
 const clog=p.hand.length>=4||WKLR,atk=M.filter(canAtk),blk=E.filter(x=>!x.tap),bestA=()=>atk.slice().sort((a,b)=>pwr(b)-pwr(a))[0];
 const MIR=['wrod','wpierce','wspin','wsmash','whstorm','wvolley','wrout','wthou','wpluck','wpeachc','wdrink','wcounter','wsplit','wflurry','wheist'];
 switch(id){
 case'wdart':case'whair':return killer(1)?T(killer(1)):{t:'ef'};
 case'wrod':return killer(2)?T(killer(2)):(p.hand.length>=3||WKLR||e.life<=4?{t:'ef'}:null);
 case'wvolley':return T(killer(Math.max(1,dk))||(dk>=2||clog?weakest():null));
 case'whstorm':{return open.length>=2||(clog&&open.length>=1)?{}:null}
 case'wpluck':return{};
 case'wthou':return{};
 case'wcloudh':return cp2>=3||p.hand.length<=2||WKLR?{}:null;
 case'wmirror':return p.hand.some(x=>x!==c&&MIR.includes(x.id)&&cost(x)<=p.mana-cost(c)&&plan(x))?{}:null;
 case'wspin':{const d=mo2+1;return T(killer(d)||(d>=2||clog?weakest():null))}
 case'wgrow':{const a=bestA();return a&&(blk.length>0||e.life<=pwr(a)+mo2)?P(a):null}
 case'wruyi':return p.bf.some(x=>x.id===id)?null:{};
 case'wsplit':{const d=mo2+Math.floor(cp2/2);return d>=e.life||d>=3||clog?{}:null}
 case'wsmash':return T(killer(2)||weakest());
 case'wcloudr':{const a=bestA();return a&&blk.length>0?P(a):null}
 case'wpierce':return T(killer(3)||(clog?weakest():null));
 case'wflurry':{const d=Math.max(1,dk);return d>=e.life||d>=2||WKLR?{}:null}
 case'wrout':{const n=1+Math.floor(cp2/3),kk=open.filter(x=>th(x)-x.dmg<=n).length;return kk>=1&&open.length>=2||kk>=2||(clog&&open.length>=1)?{}:null}
 case'wblock':return null;
 case'wpocket':case'wstep':{if(p.mana<(id==='wstep'?1:2))return null;const m=M.find(x=>x.id==='wmonk'||x.id==='wsix');return m&&p.hand.length<=4?P(m):null}
 case'wsomer':return p.gy.length>=4&&p.deck.length<=5?{}:null;
 case'wchange':return p.pid&&MIR.includes(p.pid)?{}:null;
 case'wxform':{const big=E.some(x=>D[x.id][1]>=4);const w=M.slice().sort((a,b)=>val(a)-val(b))[0];return big&&w&&val(w)<=4?P(w):null}
 case'wheist':return e.deck.length>0&&p.hand.length<=5?{}:null;
 case'wpeachc':return p.deck.length>=1?{}:null;
 case'wpeach':return{};
 case'wfurn':{const m=M.filter(x=>x.dmg>0&&th(x)-x.dmg<=2&&val(x)>=2)[0];return P(m)}
 case'wledger':{const m=M.filter(x=>!x.led&&val(x)>=2).sort((a,b)=>val(b)-val(a))[0];return P(m)}
 case'wmount':return e.deck.length>=3&&!e.deck.concat(e.hand,e.gy).some(x=>x.id==='wwt')?{}:null;
 case'wdrink':case'wwine':return p.hand.length<=6&&p.deck.length>0?{}:null;
 case'wdance':{const b=blk.filter(x=>!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return atk.length&&b?T(b):null}
 case'wfan':return E.length>=3||(E.length>=2&&atk.length>=2)?{}:null;
 case'wfeint':return p.hand.length<=6?{}:null;
 case'wslip':return p.hand.length<=6?{}:null;
 case'wcounter':return pl==='lp'||wkPay(p)?T(killer(3)||weakest()):null;
 case'wcycle':return p.tys&&p.tys.tr&&p.tys.lp?{}:null;
 case'wtypes':{const n=Object.keys(p.tys||{}).length+(p.tys&&p.tys[WT[id]]?0:1);return T(killer(n)||(n>=2||clog?weakest():null))}
 case'worchard':return p.deck.length>=2?{}:null;
 case'wfoot':return cp2>=3||(clog&&cp2>=2)?{}:null;
 case'wmyriad':{const d=Math.max(1,Math.ceil(mo2/2));return d>=e.life||open.length>=2&&d>=1||d>=2||clog?{}:null}
 case'wseal':{const b=blk.filter(x=>!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return b&&val(b)>=3?T(b):null}
 case'waugury':return p.hand.length<=6&&p.deck.length>0?{}:null;
 case'wecho':{const q=p.pid;return q&&D[q][2]==='S'&&D[q][1]<=1&&!TS[q]&&q!=='wmirror'&&q!=='wecho'&&p.hand.length<=6?{}:null}
 case'wpyre':case'wtree':return p.bf.some(x=>x.id===id)?null:{};
 case'wburn':return p.deck.length>3?{}:null;
 case'wunravel':return T(killer(Math.max(2,p.dsp||0))||(clog?weakest():null));
 case'wskin':return p.hand.length<=6?{}:null;
 case'wbanq':return p.life<=14&&cp2>=2||p.life<=8?{}:null;
 case'wmist':return atk.length>=2&&blk.length>=1?{}:null;
 case'wgust':{const b=blk.filter(x=>!has(x,'w')).sort((a,b)=>val(b)-val(a))[0];return b&&val(b)>=3?T(b):null}
 case'wunward':return E.some(x=>has(x,'w'))?{}:null;
 case'wrally':return atk.length>=2?{}:null;
 case'wmillion':return M.length<=3?{}:null;
 case'wpeachg':return p.life<=14||p.deck.length>=3?{}:null;
 case'wbigstaff':{const d=4+mo2;return d>=e.life||open.length>=2||d>=5?{}:null}
 case'wdodge':case'wwt':return null;
 default:return null}}
function wkBlockTricks(used){const p=G.p,c=G.cmb;const X=Math.max(1,p.mo||0);
 for(const a of c.atk.map(u=>G.e.bf.find(x=>x.u==u)).filter(Boolean)){const bu=c.blk[a.u],b=bu&&p.bf.find(x=>x.u==bu);if(!b)continue;
  const hp=th(b)-b.dmg,dies=pwr(a)>=hp;
  if(dies){const dg=p.hand.find(x=>x.id==='wdodge'&&cost(x)<=p.mana);if(dg&&pwr(a)<hp+3){exec(dg,{t:'p:'+b.u});continue}
   const bl=p.hand.find(x=>x.id==='wblock'&&cost(x)<=p.mana);if(bl&&pwr(a)<hp+X){exec(bl,{t:'p:'+b.u});continue}
   const st=p.hand.find(x=>x.id==='wstep'&&cost(x)<=p.mana&&val(b)>=3);if(st){exec(st,{t:'p:'+b.u});continue}}
  else if(pwr(b)<th(a)-a.dmg){const bl=p.hand.find(x=>x.id==='wblock'&&cost(x)<=p.mana);if(bl&&pwr(b)+X>=th(a)-a.dmg){exec(bl,{t:'p:'+b.u})}}}}
