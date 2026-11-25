/* Wukong flow metrics for simx.js: PATCH="$(cat wkm.js)" PRINT='JSON.stringify(WKM)'.
   Per player turn: cards played, Momentum, mana left, hand size; per card: casts and turns held unplayed;
   payoffs: Momentum / cards played when a payoff is cast, Ruyi strikes, Full Circle hits. */
var WKM={turns:0,cp:0,mo:0,mana:0,hand0:0,hand1:0,dead:0,empty:0,big:0,mo3:0,cast:{},held:{},pay:{},ruyi:0,circ:[0,0],face:{},eTurn:0,eLost:0,mo2:0,moh:[0,0,0,0,0,0,0,0],fights:0,wins:0,crt:0,plife:0,elife:0};
var WKPAYM={wspin:1,wsplit:1,wgrow:1,wblock:1,wmyriad:1,wbigstaff:1,wbear:1,wbreak:1,wdrink:1,whstorm:1,wwind:1};
var WKPAYC={wflurry:1,wsplit:1,wrout:1,wcloudh:1,worchard:1,wbanq:1,wvolley:1,wfoot:1};
{const _c=cast;cast=function(c,t){const id=c&&c.id,p=G.p,mine=p&&p.hand&&p.hand.includes(c);const el=G.e?G.e.life:0;const r=_c.apply(this,arguments);try{if(mine&&G.ch==='wukong'&&G.e)WKM.face[id]=(WKM.face[id]||0)+Math.max(0,el-G.e.life)}catch(e){}
 try{if(mine&&G.ch==='wukong'){WKM.cast[id]=(WKM.cast[id]||0)+1;
  if(WKPAYM[id]||WKPAYC[id]){const q=WKM.pay[id]||(WKM.pay[id]={n:0,mo:0,cp:0,hp:0});q.n++;q.mo+=p.mo||0;q.cp+=p.cp||0;q.hp+=p.hp||0}
  if(p.bf.some(x=>x.id==='wruyi')&&(p.cp||0)%3===0)WKM.ruyi++;
  if(id==='wcycle'){WKM.circ[0]++;const n=typeof wkTypesN=='function'?wkTypesN(p):Object.keys(p.tys||{}).length;if(n>=3)WKM.circ[1]++}}}catch(e){}
 return r}}
{const _e=enemyTurn;enemyTurn=function(){try{const p=G.p;if(G.ch==='wukong'&&p&&G.e&&G.e.life>0){const cp=p.cp||0;WKM.turns++;WKM.cp+=cp;WKM.mo+=p.mo||0;WKM.mana+=Math.max(0,p.mana);WKM.hand1+=p.hand.length;WKM.hand0+=(p.h0||0);
  if(cp<=1)WKM.dead++;if(!p.hand.length)WKM.empty++;if(cp>=5)WKM.big++;if((p.mo||0)>=3)WKM.mo3++;if((p.mo||0)>=2)WKM.mo2++;WKM.moh[Math.min(7,p.mo||0)]++;WKM.crt+=cr(p).length;if(G.e.wkL!=null)WKM.eLost+=Math.max(0,G.e.wkL-G.e.life);
  const seen={};p.hand.forEach(c=>{if(seen[c.id])return;seen[c.id]=1;WKM.held[c.id]=(WKM.held[c.id]||0)+1})}}catch(e){}
 const r=_e.apply(this,arguments);return r}}
{const _s2=startP;startP=function(){const r=_s2.apply(this,arguments);try{if(G.e)G.e.wkL=G.e.life}catch(e){}return r}}
{const _s=startP;startP=function(){const r=_s.apply(this,arguments);try{if(G.p)G.p.h0=G.p.hand.length}catch(e){}return r}}
