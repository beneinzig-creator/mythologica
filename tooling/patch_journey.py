# patch_journey: three fixes from Ben (Nov 2026).
# 1. Tutorial "The journey" has no spoilers. It used to name Act II's other-hero realms, Act III, the War in Heaven,
#    the rebellion's generals and the Beast of the Sea. Now "A run" says only that a run has three acts, each ending
#    with a guardian; "Act II" becomes "The road ahead" (new lands, the deck carries on, it gets harder); the
#    "Act III" step (added by patch_act3) is removed. Runs after patch_act3's splice, so it edits the final array.
# 2. Mana vessel (patch_manajar): Thoth's number was cream on his blue water, the only light one. It now uses the same
#    dark ink and light halo as the other heroes, which stays readable on the blue.
# 3. The enemy's mana line (top left of the fight screen) no longer shows the old mana icon; the number stays.

_JSJOUR = r"""
/* ===== patch_journey: spoiler-free journey, dark mana digits, no enemy mana icon ===== */
try{const J=JOURNEY,f=t=>J.findIndex(x=>x.t==t);let i=f('Act III');if(i>=0)J.splice(i,1);
 i=f('A run');if(i>=0)J[i]={t:'A run',m:'A run is a journey in <b>three acts</b>. It begins in your hero\'s home realm, and each act ends with a <b>guardian</b> you must defeat. Win all three acts to win the run. If your life reaches 0, the run ends.'};
 i=f('Act II');if(i>=0)J[i]={t:'The road ahead',m:'Beat the guardian and the journey goes on into new lands, with the deck you have built and a little healing for the road. Each act is harder than the last, and not every foe will fight the way you expect.'};
}catch(e){}
try{const st=document.createElement('style');st.id='pjour';st.textContent=`
html[data-hero=thoth] #app .me .orb.mj>.dg{color:#140a02!important;filter:drop-shadow(0 0 1px #fff7d6) drop-shadow(0 0 2px #fff7d6) drop-shadow(0 0 4px #fff7d6cc)!important}
#app>.top .cn>img.ico[alt="◆"]{display:none!important}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSJOUR + "showChars();\n</script>")
