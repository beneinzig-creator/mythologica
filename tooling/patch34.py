# ===== v74: AI stance vs flyers, temporary +health keeps remaining health =====
_b3("const want=has(c,'k')?1:has(c,'n')?0:(LETHAL||FUT0)","const want=has(c,'k')?1:has(c,'n')?0:(pA.length&&pw(c)>0&&!pA.some(a=>canBlock(c,a)))?0:(LETHAL||FUT0)")
_b3("const clean=()=>[G.p,G.e].forEach(s=>s.bf.forEach(c=>{c.ta=c.td=0}));",
"const clean=()=>[G.p,G.e].forEach(s=>s.bf.forEach(c=>{if(c.td>0){const rem=th(c)-c.dmg;c.ta=c.td=0;if(rem>0)c.dmg=Math.max(0,th(c)-rem)}else c.ta=c.td=0}));")
_b3("g=G,dm=cr(e).filter(c=>c.td>0&&c.dmg>=th(c)-c.td);if(!dm.length)return;","g=G,dm=[];if(!dm.length)return;")
_b3("const dm=cr(p).filter(c=>c.td>0&&c.dmg>=th(c)-c.td);if(dm.length&&!G.endstep)","const dm=[];if(dm.length&&!G.endstep)")

_b3("c.tap=1;s.bf.push(c)}","c.tap=1;s.bf.push(c);if(typeof ENTD!='undefined'&&ENTD[c.id])ENTD[c.id](s,c)}")

_b3("case'gale':{","case'fbolt':{const d=3+xb(e);return d>=p.life?{s:90}:{s:2+d*.9}}case'hgrasp':{const T=M.filter(x=>x.dmg>0&&!has(x,'w')).sort((a,b)=>ev(b)-ev(a))[0];return T&&ev(T)>=4?{s:2+ev(T)*.8,t:T}:null}case'gale':{")

# ===== v78: bug fixes found by fuzzing =====
_b3("if(!c.def)c.dmg=Math.min(c.dmg,th(c)-1);G.sel=","if(!c.def)c.dmg=Math.max(0,Math.min(c.dmg,th(c)-1));G.sel=")
_b3("t.def=0;t.dmg=Math.min(t.dmg,th(t)-1)}}","t.def=0;t.dmg=Math.max(0,Math.min(t.dmg,th(t)-1))}}")
_b3("const r=stance(p,c);return msg(","const r=stance(p,c);sweep();return msg(")
_b3("const A=p.bf.find(x=>x.u==a);if(has(T,'w'))return msg('Warded: it cannot be targeted.');","const A=p.bf.find(x=>x.u==a);if(!A)return msg('Select an attacker first.');if(has(T,'w'))return msg('Warded: it cannot be targeted.');")
_b3("function hd(z){return uAct(()=>hd0(z))}","function hd(z){if(G&&G.phase=='main'&&G.p&&G.sel){G.sel=G.sel.filter(u=>G.p.bf.some(x=>x.u==u));if(G.cur&&!G.sel.includes(G.cur))G.cur=0;for(const k in(G.tg||{}))if(!G.p.bf.some(x=>x.u==k))delete G.tg[k]}return uAct(()=>hd0(z))}")
