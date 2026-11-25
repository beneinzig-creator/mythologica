/* ===== Starting units that had no ability get a small one from their hero's own mechanic ===== */
const hSet=(id,text)=>{if(D[id]){D[id][6]=text;delete TXT[id]}};
/* Odin: Hirdman fights harder when you are Wounded */
hSet('hird','While you are Wounded, it gets +1/+1.');
{const _p=px;px=function(c){let r=_p.apply(this,arguments);try{if(c&&c.id=='hird'&&wnd(sideOf(c)))r+=1}catch(e){}return r}}
{const _t=tx;tx=function(c){let r=_t.apply(this,arguments);try{if(c&&c.id=='hird'&&wnd(sideOf(c)))r+=1}catch(e){}return r}}
/* Odin: a Thrall's labour pays when you offer it */
hSet('thrl','When you offer it, you gain 1 extra mana.');
{const _o=offer;offer=function(s,c){const r=_o.apply(this,arguments);try{if(c&&c.id=='thrl'){s.mana+=1;log('The Thrall\'s labour: +1 extra mana.')}}catch(e){}return r}}
/* Thoth: the temple guard stands firm when it blocks */
hSet('tmedj','Temple guard: when it blocks, it gets +0/+2 until end of turn.');
{const _r=resolve;resolve=function(){try{const c=G.cmb;if(c&&c.side=='e'){for(const u of Object.values(c.blk||{})){const b=G.p.bf.find(x=>x.u==u&&x.id=='tmedj');if(b&&!b.mg2){b.td+=2;b.mg2=G.turn;log('The Medjay stands firm at the temple gate (+0/+2).')}}}}catch(e){}return _r.apply(this,arguments)}}
{const _u=startP;startP=function(){try{G.p.bf.forEach(x=>{if(x.id=='tmedj')x.mg2=0})}catch(e){}return _u.apply(this,arguments)}}
