# patch_round2: round-2 playtest polish (Nov 2026).
# 1. Trump plate on the pre-fight intro. fxIntro took its foe from BOSS/ELITES/fo(G.rt[G.fi]) and, when that entry's
#    name did not match the enemy actually fought and the enemy has a figure painting, swapped it for a bare
#    {n,ic,hint} stub, dropping trump/mt (so no Trump plate). fxFoe() now looks the enemy up by name in BOSS, ELITES,
#    EN and every hero's foe list first; only if nothing matches does it fall back to the stub, and the stub keeps the
#    trump from the enemy's own cards (the boss-flagged or opening-trump card in hand or on the battlefield).
# 2. Text on the figure-painting intros gets a soft dark backing plate and heavier shadows, so it reads over any
#    painting; the Odysseus boss splash text gets heavier shadows too.
# 3. The Other Fronts screen: the second paragraph was a separate flex item with the screen's 46px gap (a blank
#    line); it is now part of the first block with a small top margin.
# 4. The map tip moves to the bottom right on the map so it no longer covers the "Chart your course" plate.
# 5. Victory panels: Act I and Act II already took patch_polish's rustic parchment; the final win (#vico.final)
#    had its own cream gradient with higher specificity. Every variant now gets the same parchment.

_b3("if(!B||(G.e&&B.n!==G.e.nm&&FIG[G.e.nm]))B={n:G.e&&G.e.nm,ic:'',hint:''};", "B=fxFoe(B);")
_b3('</div><div class="dsub" style="font-size:16px;max-width:620px;text-align:center;opacity:.85">The generals are beaten',
    '<span style="display:block;margin-top:12px;font-size:16px;opacity:.85">The generals are beaten')
_b3("You rest before the battle and recover 10 life.</div>", "You rest before the battle and recover 10 life.</span></div>")

_JSR2 = r"""
/* ===== patch_round2: trump plate, readable intros, other fronts, map tip, victory parchment ===== */
function fxFoe(B){const nm=G&&G.e&&G.e.nm;if(B&&(!nm||B.n===nm))return B;
 const L=[].concat(BOSS,ELITES,EN);try{Object.values(CHARS).forEach(c=>{if(c&&c.en)L.push(...c.en)})}catch(e){}
 const hit=nm&&L.find(x=>x&&x.n===nm);if(hit)return hit;if(B&&!FIG[nm])return B;
 const tc=G.e&&[...(G.e.hand||[]),...(G.e.bf||[])].find(c=>c&&(c.boss||(typeof MT!='undefined'&&MT.includes(c.id))));
 return{n:nm,ic:'',hint:'',mt:tc?tc.id:(B&&(B.trump||B.mt))}}
{const _R=render;render=function(){const o=_R.apply(this,arguments);try{document.documentElement.classList.toggle('phm',!!(G&&G.phase=='map'))}catch(e){}return o}}
try{const st=document.createElement('style');st.id='pr2';st.textContent=`
#fxin.fig .fxin-in{background:radial-gradient(closest-side,#000000d0,#000000a8 62%,#0000);padding:26px 64px 22px;border-radius:40px}
#fxin.fig .fxin-n,#fxin.fig .fxin-k{text-shadow:0 2px 3px #000,0 0 10px #000,0 0 22px #000}
#fxin.fig .fxin-l{color:#f6eed6;text-shadow:0 1px 2px #000,0 0 6px #000,0 0 14px #000}
#fxin.fig .fxin-c{color:#eadcb4;text-shadow:0 1px 2px #000,0 0 8px #000,0 0 16px #000}
#bsplash p,#bsplash small{text-shadow:0 1px 2px #000,0 0 8px #000,0 0 18px #000}
html.phm:not(.ph) #tutc{top:auto!important;bottom:max(16px,env(safe-area-inset-bottom,0px))!important}
html #vico .box,html[data-hero] #vico .box,html[data-hero] #vico.final .box{background:radial-gradient(at 30% 20%,#d6c39a33,#0000 45%),radial-gradient(at 78% 82%,#5a3d1a2e,#0000 50%),radial-gradient(at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%)!important;color:#1d150b!important}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSR2 + "showChars();\n</script>")
