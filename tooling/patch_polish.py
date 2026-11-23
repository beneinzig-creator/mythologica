# v125 (patch_polish): text and screen polish from Ben's playtest.
#  1. Victory: "The Nine Worlds / The Two Lands falls silent" -> "fall" for plural realm names (RFS()).
#  2. Act III altar: "two guardians will rise" -> "two generals will rise".
#  3. "Altar to the One True God" is left as is: the One True God is a deliberate cross-pantheon power
#     (HANDOFF.md "Currencies", the otg phase, the "Grace of the One True God" card), not a leftover.
#  4. Final victory: "The war in Heaven" -> "The War in Heaven".
#  5. Prestige: "+1 sacrifice value" -> "+1 offering value" (the game's word is Offer/offering).
#  6. Fight intro: the rule line (the foe's hint) ends with a period, e.g. Cattle of the Sun's.
#  7. The False Prophet: shorter text, same effect, so it renders at a readable size. Its full text also
#     carries "Can only defend. Ward."; at 1400x900 the old text fit at 4.9px, the new one at 6.7px (most
#     long-text army members land at 6.5-7.5px). The mark only stops attacks; the Beast rising again
#     while it lives is the "wound" the boss intro and the in-fight message explain.
#  8. Dimmed hand cards (unaffordable, and the whole hand on the prestige screen) are darkened and
#     desaturated instead of translucent, so overlapping cards no longer show each other's text.
#  9. Victory panel uses the same rustic parchment as the tooltips/tip panel, not bright cream.
# 10. Hero select subtitles: each separator stays on the line of the word before it.
# 11. Defeat screen hides the fight HUD (deck piles, hero panel) beside the Fallen art.
# 12. Full card pool title keeps clear of the sound button (a float reserves its corner).
# 13. Draft: no shelf bar under the offered cards (.drf .dcards::after). It was sized to the row of cards,
#     so it shrank to a small box between picks and grew back with every new set of three.

def _rall(o,n,k):
    global head,tail,mid,A,B
    t=0
    for nm in ('head','mid','tail','A','B'):
        c=globals()[nm].count(o)
        if c:globals()[nm]=globals()[nm].replace(o,n);t+=c
    assert t==k,(t,o[:70])

# 1
_rall("RWC()+' falls silent","RWC()+RFS()+' silent",2)
# 2
_b3("will answer: two guardians will rise,","will answer: two ${G.a3?'generals':'guardians'} will rise,")
# 4
_b3("The war in Heaven is over","The War in Heaven is over")
# 5
_b3("['+1 sacrifice value',r=>r.s++]","['+1 offering value',r=>r.s++]")
# 6
_b3("+'<span class=\"fxin-h\">'+(B.hint||'')+'</span>'","+'<span class=\"fxin-h\">'+fxDot(B.hint)+'</span>'")
# 7
_b3("'At the start of the Beast\\'s turn, it marks your strongest army member: it can\\'t attack on your next turn (it can still block). While it lives, the Beast\\'s mortal wound heals.'",
    "'Each turn, marks your strongest army member: it can\\'t attack. Heals the Beast\\'s wound.'")
# 8
_b3(".dim{opacity:.55}",".dim{filter:grayscale(.6) brightness(.6)}")
# 10
_b3("<span class=\"har\">${(c.arch||[]).map(a=>a[1]).join(' · ')}</span>",
    "<span class=\"har\">${(c.arch||[]).map((a,i,L)=>'<span class=\"hai\">'+a[1]+(i<L.length-1?'&nbsp;·':'')+'</span>').join(' ')}</span>")

_JSPOL = r"""
/* ===== v125 (patch_polish): playtest text and screen polish ===== */
function RFS(){return /s$/.test(RWORD())?' fall':' falls'}
function fxDot(h){h=h||'';return h&&!/[.!?]$/.test(h)?h+'.':h}
{const _R=render;render=function(){const o=_R.apply(this,arguments);try{document.documentElement.classList.toggle('phl',!!(G&&G.phase=='lost'))}catch(e){}return o}}
try{const st=document.createElement('style');st.id='ppol';st.textContent=`
.har .hai{white-space:nowrap}
html.phl #app>.decks,html.phl #app>.me{visibility:hidden!important}
html #vico .box{background:radial-gradient(at 30% 20%,#d6c39a33,#0000 45%),radial-gradient(at 78% 82%,#5a3d1a2e,#0000 50%),radial-gradient(at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%)!important;color:#1d150b!important}
.ovlib .ovt::before{content:'';float:right;width:92px;height:36px}
html .drf .dcards::after{display:none!important}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSPOL + "showChars();\n</script>")
