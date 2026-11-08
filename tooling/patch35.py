# ===== v80: Odin bosses =====
BJS=open(S+'odinboss.js',encoding='utf-8').read()
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",BJS+"\nfit();try{addEventListener('resize',fit)}catch(e){}")
# per-character boss sets, realm words
_b3("G.bs=sh([0,1,2]).slice(0,2)","G.bs=sh((CHARS[G.ch||'ody'].bo||[0,1,2]).slice()).slice(0,2)")
_b3("Offer them, and the strait will answer","Offer them, and ${RWORD()} will answer")
_b3("The strait falls silent. You have passed the guardian, and the way onward opens. Act I is complete!","'+RWC()+' falls silent. You have passed the guardian, and the way onward opens. Act I is complete!")
_b3("</b>. The strait falls silent and the way onward opens.</div><div style=\"opacity:.8\">Act I is complete. The Odyssey is far from over","</b>. '+RWC()+' falls silent and the way onward opens.</div><div style=\"opacity:.8\">Act I is complete. '+SAGA()+' is far from over")
_b3("log(G.boss?'Guardian of the strait: '+f.n","log(G.boss?'Guardian: '+f.n")
# Quarry
_b3("upkeep(e,p);sweep();draw(e,1);G.msg=e.nm+' takes its turn…';","upkeep(e,p);sweep();markQ();draw(e,1);G.msg=e.nm+' takes its turn…';")
_b3("if(c.dmg)L.push('Wounded: '+c.dmg+' damage. Only healing cards restore it.');","if(c.qy)L.push('<b>Quarry</b>: the Wild Hunt is hunting this army member. Hunt riders deal 3 extra damage to it.');if(c.dmg)L.push('Wounded: '+c.dmg+' damage. Only healing cards restore it.');")
_b3("if(c.tap&&t!='h')cl.push('tap');","if(c.tap&&t!='h')cl.push('tap');if(c.qy)cl.push('qry');")
_b3("const tgts=cr(p).filter(t=>t.tap&&ev(t)>=5)","const tgts=cr(p).filter(t=>t.tap&&(ev(t)>=5||t.qy))")
_b3("use.push(a);s+=cdmg(a)}","use.push(a);s+=cdmg(a)+qB(T,a)}")
_b3("if(cdmg(a)>=th(T)-T.dmg||kw(a,'v'))gain+=ev(T)+1;else gain+=cdmg(a)*.3","if(cdmg(a)+qB(T,a)>=th(T)-T.dmg||kw(a,'v'))gain+=ev(T)+1;else gain+=cdmg(a)*.3")
# damage adjustments, quarry reward, coil
_b3("for(const[t,n,src]of H)if(n>0){t.dmg+=n;if(kw(src,'v'))t.vn=1}","for(const[t,n,src]of H)if(n>0){t.dmg+=Math.max(0,n+dAdj(t,n,src));if(kw(src,'v'))t.vn=1;if(t.qy&&HUNT.includes(src.id))QK.push([t,src])}")
_b3("A.life+=aGain;N.life+=nGain;\nsweep();if(EDI)","A.life+=aGain;N.life+=nGain;\nsweep();qRew();coil(c);if(EDI)")
# Jormungandr waits for bait
_b3("if(t=='C')return cr(e).length>=5?null:{s:ev(c)+1+(cr(e).length==0?4:0)};","if(t=='C'){if(c.id=='jorm'&&!(cr(p).some(x=>D[x.id][1]>=4)||G.turn>=9))return null;return cr(e).length>=5?null:{s:ev(c)+1+(cr(e).length==0?4:0)}}")
# Holmgang: one attacker, one blocker
_b3("}else{G.sel=[...G.sel,c.u];G.cur=c.u}return render()}","}else{if(duelOn()&&G.sel.length){G.sel.forEach(u=>delete G.tg[u]);G.sel=[];G.msg='The Holmgang: only one army member may attack.'}G.sel=[...G.sel,c.u];G.cur=c.u}return render()}")
_b3("G.sel=all.map(c=>c.u);return bt('atk')","G.sel=(duelOn()?[best(all)]:all).map(c=>c.u);return bt('atk')")
_b3("if(!at.length)return msg('Select attackers first.');{const tx=","if(!at.length)return msg('Select attackers first.');if(duelOn())at.length=Math.min(1,at.length);{const tx=")
_b3("if(!C.blk[a.u])C.blk[a.u]=b.u;else C.bx[a.u]=b.u;","if(duelOn()){delete C.bx[a.u];C.blk[a.u]=b.u}else if(!C.blk[a.u])C.blk[a.u]=b.u;else C.bx[a.u]=b.u;")
_b3("for(const k in P){if(k[0]=='x')G.cmb.bx[k.slice(1)]=P[k];else G.cmb.blk[k]=P[k]}","for(const k in P){if(k[0]=='x'){if(!duelOn())G.cmb.bx[k.slice(1)]=P[k]}else G.cmb.blk[k]=P[k]}")
_b3("if(!S.length&&must.length)continue;","if(!S.length&&must.length)continue;if(S.length>1&&duelOn())continue;")
_b3("const pAtk=cr(p).filter(c=>!has(c,'k')&&pw(c)>0&&!(c.tap&&c.frz));","const pAtk=cr(p).filter(c=>!has(c,'k')&&pw(c)>0&&!(c.tap&&c.frz)).sort((a,b)=>pwr(b)-pwr(a)).slice(0,duelOn()?1:9);")
_b3("const lethalNow=()=>{const r=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')),B=","const lethalNow=()=>{const r=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')).sort((a,b)=>pwr(b)-pwr(a)).slice(0,duelOn()?1:9),B=")
_b3("r0=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')),LETHAL","r0=cr(e).filter(c=>!c.tap&&!c.sick&&pwr(c)>0&&!has(c,'k')).sort((a,b)=>pwr(b)-pwr(a)).slice(0,duelOn()?1:9),LETHAL")
_b3("let plan=attackPlan(e,p);{const all=cr(e).filter(canAtk).filter(c=>pwr(c)>0),B=","let plan=attackPlan(e,p);{const all=cr(e).filter(canAtk).filter(c=>pwr(c)>0).sort((a,b)=>pwr(b)-pwr(a)).slice(0,duelOn()?1:9),B=")
_b3(".bsc .lr{font-style:italic;opacity:.92;line-height:1.4;font-size:15px}",".bsc .lr{font-style:italic;opacity:.92;line-height:1.4;font-size:15px}.dft:has(.bsp){overflow-y:auto;max-height:100vh;box-sizing:border-box;padding:12px 8px;justify-content:safe center}@media (max-width:760px),(max-height:780px){.bsc{padding:10px 14px;gap:6px}.bsc .ic{font-size:34px}.bsc .nm2{font-size:19px}.bsc .lr{font-size:13px;line-height:1.32}.bsp{gap:10px}}")
