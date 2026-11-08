# ===== upgrades for every card, ability upgrades, 2 starting action points =====
_b3("pos:0,act:1,","pos:0,act:2,")
_b3("f:d[5]+(r&&r.fl&&!d[5].includes('f')?'f':''),","f:d[5]+(r&&r.fl&&!d[5].includes('f')?'f':'')+(r&&r.ab?[...new Set(r.ab)].filter(x=>!d[5].includes(x)).join(''):''),")
_b3("['Gains flying',r=>r.fl=1]];","['Gains flying',r=>r.fl=1]];\n"+open(S+'upgs.js',encoding='utf-8').read())
_b3("const own=(c,id)=>","const omg=(c,id)=>{const s=sideOf(c);if(!s)return 0;const w=s.bf.filter(x=>x.id==id);return w.length?1+Math.max(...w.map(x=>(x.rec&&x.rec.m)||0)):0};const own=(c,id)=>")
for _a,_b in [("has(c,'p')&&own(c,'wall')?1:0","has(c,'p')?omg(c,'wall'):0"),("has(c,'o')&&own(c,'ossuary')?1:0","has(c,'o')?omg(c,'ossuary'):0"),("has(c,'q')&&own(c,'garden')?1:0","has(c,'q')?omg(c,'garden'):0"),("has(c,'g')&&own(c,'forge')?1:0","has(c,'g')?omg(c,'forge'):0"),("has(c,'e')&&own(c,'shroud')?1:0","has(c,'e')?omg(c,'shroud'):0"),
 ("c.def&&own(c,'doct')?1:0","c.def?omg(c,'doct'):0"),("has(c,'r')&&own(c,'banner')?1:0","has(c,'r')?omg(c,'banner'):0"),("has(c,'f')&&own(c,'skies')?1:0","has(c,'f')?omg(c,'skies'):0"),("has(c,'m')&&own(c,'drums')?1:0","has(c,'m')?omg(c,'drums'):0"),("has(c,'l')&&own(c,'sails')?1:0","has(c,'l')?omg(c,'sails'):0"),("c.def?2+(ramp(c)?1:0):0","c.def?2+(ramp(c)?omg(c,'rampart'):0):0")]:
    _b3(_a,_b)
for _a,_b in [("spearc:(s,o,t)=>t.dmg+=3,","spearc:(s,o,t)=>t.dmg+=3+mg(),"),("aegis:(s,o,t)=>{t.ta+=2;t.td+=2}","aegis:(s,o,t)=>{t.ta+=2+mg();t.td+=2+mg()}"),("salve:(s,o,t)=>heal(t,4)","salve:(s,o,t)=>heal(t,4+mg())"),
 ("feast:s=>{s.life+=3;cr(s).forEach(c=>heal(c,1))}","feast:s=>{s.life+=3+2*mg();cr(s).forEach(c=>heal(c,1+mg()))}"),("breeze:s=>s.life+=3,","breeze:s=>s.life+=3+2*mg(),"),("lure:(s,o,t)=>{t.pa-=2;t.pd-=2}","lure:(s,o,t)=>{t.pa-=2+mg();t.pd-=2+mg()}"),("curse:(s,o,t)=>{t.pa-=2;t.pd-=2}","curse:(s,o,t)=>{t.pa-=2+mg();t.pd-=2+mg()}"),
 ("hurl:(s,o,t)=>t.dmg+=4","hurl:(s,o,t)=>t.dmg+=4+mg()"),("tide:(s,o,t)=>heal(t,3)","tide:(s,o,t)=>heal(t,3+mg())"),("milk:s=>{s.life+=4;cr(s).forEach(c=>heal(c,1))}","milk:s=>{s.life+=4+2*mg();cr(s).forEach(c=>heal(c,1+mg()))}"),
 ("rally:s=>cr(s).forEach(c=>{c.ta++;c.td++})","rally:s=>cr(s).forEach(c=>{c.ta+=1+mg();c.td+=1+mg()})"),("fury:(s,o,t)=>{t.ta+=3}","fury:(s,o,t)=>{t.ta+=3+mg()}"),("testudo:s=>cr(s).filter(c=>c.def).forEach(c=>{c.ta+=2;c.td+=2})","testudo:s=>cr(s).filter(c=>c.def).forEach(c=>{c.ta+=2+mg();c.td+=2+mg()})"),
 ("t.dmg+=has(t,'f')?6:4}","t.dmg+=(has(t,'f')?6:4)+mg()}"),("Math.min(8,s.gy.length)","Math.min(8+2*mg(),s.gy.length)"),("reduce((n,c)=>n+pwr(c),0)}","reduce((n,c)=>n+pwr(c),0)-2*mg()}"),("c.pa++;c.pd+=3}","c.pa+=1+mg();c.pd+=3+mg()}"),
 ("o.life-=2*cr(s).filter(c=>has(c,'r')).length}","o.life-=(2+mg())*cr(s).filter(c=>has(c,'r')).length}"),("muse:s=>draw(s,2)","muse:s=>draw(s,2+mg())"),("n<2&&cr(s).length<5","n<2+mg()&&cr(s).length<5"),("o.life-=2*n;log('The granaries burn for '+2*n+'.')","o.life-=(2+mg())*n;log('The granaries burn for '+(2+mg())*n+'.')"),
 ("gift:s=>{s.life+=4;cr(s).forEach(c=>heal(c,2))}","gift:s=>{s.life+=4+2*mg();cr(s).forEach(c=>heal(c,2+mg()))}"),("javel:(s,o,t)=>{t.dmg+=3}","javel:(s,o,t)=>{t.dmg+=3+mg()}"),("drill:s=>cr(s).filter(c=>has(c,'p')).forEach(c=>{c.pa++;c.pd++})","drill:s=>cr(s).filter(c=>has(c,'p')).forEach(c=>{c.pa+=1+mg();c.pd+=1+mg()})"),
 ("o.life-=cr(s).filter(c=>has(c,'r')).length;draw(s,1)}","o.life-=(1+mg())*cr(s).filter(c=>has(c,'r')).length;draw(s,1)}"),("plunder:(s,o,t)=>{destroyIt(o,t);draw(s,1)}","plunder:(s,o,t)=>{destroyIt(o,t);draw(s,1+mg())}"),("hecat:(s,o,t)=>{offer(s,t);draw(s,2)}","hecat:(s,o,t)=>{offer(s,t);draw(s,2+mg())}")]:
    _b3(_a,_b)
_b3("{FX[c.id](p,G.e,t);bury(p,c)}sweep();chk();","{CUR=c;FX[c.id](p,G.e,t);CUR=null;bury(p,c)}if(c.rec&&c.rec.dr&&!isC(c))draw(p,1);sweep();chk();")
_b3("M.b.tap=1;if(t=='ef')e.life--;else if(t=='pf')p.life--;else t.dmg++;","M.b.tap=1;{const bm=1+((M.b.rec&&M.b.rec.m)||0);if(t=='ef')e.life-=bm;else if(t=='pf')p.life-=bm;else t.dmg+=bm}")
_b3("cr(s).forEach(c=>heal(c,1));log('Hearth of Ithaca","{const hm=1+Math.max(...s.bf.filter(x=>x.id=='hearth').map(x=>(x.rec&&x.rec.m)||0));cr(s).forEach(c=>heal(c,hm))}log('Hearth of Ithaca")
_b3("(isC(c)&&kwTxt(c)?' '+kwTxt(c):'');","(isC(c)&&kwTxt(c)?' '+kwTxt(c):'')+(c.rec&&c.rec.m&&UPS[c.id]?' ['+UPS[c.id](c.rec.m)+']':'')+(c.rec&&c.rec.dr&&!isC(c)?' Draw a card when cast.':'');")
_b3("o:sh([0,1,2,3,4].filter(i=>(i!=2||cost(c)>1)&&(i!=4||!has(c,'f')))).slice(0,2),d:0","o:kOpts(c),d:0")
_b3("KO[x.o[x.d-1]][0]","koLabel(x.o[x.d-1],x.c)")
_b3("data-k=\"${i}:${j}\">${KO[o][0]}</button>","data-k=\"${i}:${j}\">${koLabel(o,x.c)}</button>")
