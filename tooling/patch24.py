# ===== v54: tooltips, legendary altar rule, Divine Karma, Prestige list, Hades choice, hand spacing, fight-4 stats =====
_b3("return'<b>Starting point</b><br>Your ship is moored here.';","return'All journeys must begin somewhere';")
_b3("and 1 to upgrade any card (once).'+dn}","and 1 to upgrade any card (once). Legendary cards cannot be duplicated or upgraded here.'+dn}")
_b3("Upgrade a card (1 action)${u.u?' · used':''}</button>`}","Upgrade a card (1 action)${u.u?' · used':''}</button><div class=\"dsub\">Legendary cards cannot be duplicated or upgraded here. Legendary army members can still be upgraded after surviving a fight.</div>`}")
_b3("if(rm&&G.phase=='remove'&&G.rm<0){G.rm=+rm.dataset.rm;return render()}","if(rm&&G.phase=='remove'&&G.rm<0){if(G.rmMode!='rem'&&RAR[G.p.recs[+rm.dataset.rm].id]=='L'){G.hubMsg='Legendary cards cannot be duplicated or upgraded.';return render()}G.rm=+rm.dataset.rm;return render()}\nconst hq=ev.target.closest('[data-hqd]');if(hq&&G.hq&&G.hdisc){hqd(+hq.dataset.hqd);return}")
_b3("<div class=\"rmw\" data-rm=\"${x.i}\">","<div class=\"rmw\" data-rm=\"${x.i}\"${md!='rem'&&RAR[x.c.id]=='L'?' style=\"opacity:.4\"':''}>")
# Prestige for every upgrade
_b3("const r=c.rec;if(r&&(r.a||r.d||r.c||r.s||r.fl))L.push('Prestige: '+[r.a&&'+'+r.a+' power',r.d&&'+'+r.d+' health',r.c&&'costs '+r.c+' less',r.s&&'+'+r.s+' offering value',r.fl&&'flying'].filter(Boolean).join(', ')+'.')}","const pr=prest(c);if(pr)L.push(pr)}")
_b3("else{L.push(TXT[c.id]||d[6]);if(c.id=='horse')","else{L.push(TXT[c.id]||d[6]);{const pr=prest(c);if(pr)L.push(pr)}if(c.id=='horse')")
_b3("const fxp=(c,t)=>","""const prest=c=>{const r=c.rec;if(!r)return'';const nm=f=>(ABU.find(a=>a[0]==f)||[0,f])[1],P=[r.a&&'+'+r.a+' power',r.d&&'+'+r.d+' health',r.c&&'costs '+r.c+' less',r.s&&'+'+r.s+' offering value',r.fl&&'flying',r.ab&&[...new Set(r.ab)].map(nm).join(', '),r.m&&(UPS[c.id]?UPS[c.id](r.m):'stronger effect (+'+r.m+')'),r.dr&&'draws a card when cast'].filter(Boolean);return P.length?'<b>Prestige</b>: '+P.join(', ')+'.':''};
const fxp=(c,t)=>""")
# Divine Karma
_b3("games:['Funeral Games'","karma:['Divine Karma',3,'E',0,0,'','Leftover mana carries over to your next turn.','☯️','A'],\ngames:['Funeral Games'")
_b3("'leon thermo pent horde iph hades'.split(' ').forEach(x=>RAR[x]='L')","'leon thermo pent horde iph hades karma'.split(' ').forEach(x=>RAR[x]='L')")
_b3("augur sphinx leon thermo","augur sphinx karma leon thermo")
_b3("Object.assign(LORE,{","Object.assign(LORE,{karma:'The cosmic ledger',")
_b3("function startP(){const p=G.p;G.turn++;p.mana=2;","function startP(){const p=G.p;G.turn++;p.mana=2+(p.bf.some(x=>x.id=='karma')?p.mana:0);")
_b3("const IV={","const IV={karma:6,")
# Hades: optional draw with discard
_b3("Each time you offer another army member, draw a card and deal 3 damage to the opponent.","Each time you offer another army member, deal 3 damage to the opponent. You may draw a card; if you do, discard a card.")
_b3("s.bf.filter(x=>x.id=='hades').forEach(()=>{draw(s,1);o.life-=3;log('Hades claims 3 life.')});","s.bf.filter(x=>x.id=='hades').forEach(()=>{o.life-=3;log('Hades claims 3 life.');if(s===G.p&&s.deck.length)G.hq=(G.hq||0)+1});")
_b3("function bt(b){const p=G.p;","function hqd(u){const p=G.p,c=p.hand.find(x=>x.u==u);if(!c||!G.hdisc)return;p.hand=p.hand.filter(x=>x!==c);bury(p,c);G.hdisc=0;G.hq--;log('You discard '+D[c.id][0]+'.');render()}\nfunction bt(b){const p=G.p;if(G.hq&&b=='hqy'&&!G.hdisc){if(p.deck.length){draw(p,1);G.hdisc=1}else G.hq--;return render()}if(G.hq&&b=='hqn'&&!G.hdisc){G.hq--;return render()}")
_b3("function hd(z){","function hd(z){if(G.hq)return;")
_b3("G.turn=0;draw(p,4);","G.turn=0;G.hq=0;G.hdisc=0;draw(p,4);")
_b3("const qkh=","const hqh=G.hq?(G.hdisc?`<div class=\"ov\" style=\"z-index:120\"><div class=\"ovb\"><div class=\"ovt\">Hades: discard a card</div><div class=\"lib\">${p.hand.map(c=>`<div class=\"rmw\" data-hqd=\"${c.u}\">${card(c,'v:'+c.u)}</div>`).join('')}</div></div></div>`:`<div class=\"ov\" style=\"z-index:120\"><div class=\"ovb\"><div class=\"ovt\">Hades offers a card. Draw a card? If you do, you must discard a card.</div><div class=\"yn\"><button class=\"b\" data-b=\"hqy\">Draw</button><button class=\"b\" data-b=\"hqn\">No thanks</button></div></div></div>`):'';const qkh=")
_b3("${qkh}${G.rv?","${qkh}${hqh}${G.rv?")
# keep the battlefield from shifting when the hand is empty
_b3(".hand{pointer-events:none}",".hand{pointer-events:none;min-height:158px;box-sizing:border-box}")
_b3("@media(max-width:560px){.cd{width:80px;height:114px;","@media(max-width:560px){.hand{min-height:122px}.cd{width:80px;height:114px;")
_b3("const SCL=[[-3,0,0],[4,1,0],[7,1,2],[9,3,3]];","const SCL=[[-3,0,0],[4,1,0],[7,1,2],[9,3,2]];")
_b3("<title>Odysseus: Act I Playtest</title>","<title>Mythologica</title>")
