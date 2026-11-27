# Combat buttons gray out (disabled) when pressing them would do nothing.
out=rep(out,"""if(ph=='main')b=`${G.atkd?'':`<button class="b" data-b="atk">Attack""",
"""const atkOk=G.sel.some(u=>{const c=p.bf.find(x=>x.u==u);return c&&canAtk(c)}),allOk=cr(p).some(canAtk);
if(ph=='main')b=`${G.atkd?'':`<button class="b" data-b="atk"${atkOk?'':allOk?' disabled title="Select army members to attack with"':' disabled title="Nothing can attack right now"'}>Attack""")
out=rep(out,"""${!G.atkd&&cr(p).some(canAtk)?'<button class="b" data-b="atkall">Attack with all</button>':''}""",
"""${G.atkd?'':`<button class="b" data-b="atkall"${allOk?'':' disabled title="Nothing can attack right now"'}>Attack with all</button>`}""")
