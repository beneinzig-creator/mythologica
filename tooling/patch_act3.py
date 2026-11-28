# v111: Act III, the War in Heaven. Content and hooks live in act3.js (loaded last, it wraps engine functions);
# these replacements route the act-dependent code paths (scaling, map, guardians, save/load) through Act III.
_b3("scaleEnemy(G.e,G.boss?f.sc:G.fi+(G.a2?4:0));if(G.boss&&G.a2)scaleEnemy(G.e,[4,1,0]);",
    "scaleEnemy(G.e,G.boss?f.sc:G.fi+(G.a3?8:G.a2?4:0));if(G.boss&&G.a2&&!G.a3)scaleEnemy(G.e,[4,1,0]);if(G.boss&&G.a3)scaleEnemy(G.e,A3BS);")
_b3("s0=sclOf(G.fi+(G.a2?4:0))", "s0=sclOf(G.fi+(G.a3?8:G.a2?4:0))")
_b3("${G.a2?'Act II · ':''}Chart your course", "${G.a3?'Act III · ':G.a2?'Act II · ':''}Chart your course")
_b3("G.bs=sh((CHARS[G.a2||G.ch||'ody'].bo||[0,1,2]).slice()).slice(0,2)", "G.bs=sh(((G.a3?A3:CHARS[G.a2||G.ch||'ody']).bo||[0,1,2]).slice()).slice(0,2)")
_b3("{const el=(CHARS[A2R||CH]||CHARS.ody).el||[];", "{const el=(G&&G.a3)?sh(A3.el.slice()).slice(0,2):((CHARS[A2R||CH]||CHARS.ody).el||[]);")
# the save survives every guardian except the last one (Act I and II victories lead on to the next act)
_b3("if(!(ph=='victory'&&!G.a2))clearSave();", "if(!(ph=='victory'&&!(G.a3&&G.fin)))clearSave();")
_b3("if(ph=='victory'&&!G.a2&&G.p&&G.p.recs)", "if(ph=='victory'&&!(G.a3&&G.fin)&&G.p&&G.p.recs)")
_b3("A2R=G.a2||'';if(G.a2)applyRealm(G.a2);", "A2R=G.a2||'';if(G.a3)applyA3();else if(G.a2)applyRealm(G.a2);")
_b3("${boss?(G.a2?'Act II guardian':'Guardian of '+RWORD()):'Elite foe'}", "${boss?(G.a3?(G.fin?'The Last Battle':'General of the rebellion'):G.a2?'Act II guardian':'Guardian of '+RWORD()):'Elite foe'}")
_b3("if(ph=='map')return G.a2?'a2':'map';", "if(ph=='map')return G.a3?'a3':G.a2?'a2':'map';")
_b3("Two guardians answer", "${G.a3?'Two generals answer':'Two guardians answer'}")
_b3("<button class=\"b\" data-b=\"end\">End turn</button>${bpBtn()}`;", "<button class=\"b\" data-b=\"end\">End turn</button>${bpBtn()}${a3BargBtn()}`;")
_b3("\nshowChars();\n</script>", "\n" + open(S+'act3.js',encoding='utf-8').read() + "\nconst A3BS=[7,1,0];\nshowChars();\n</script>")
