# patch_prestigefit: the prestige (kleos) screen after a victory fits at every size (Ben, noted in PR #92).
# On desktop the fight hand stayed on screen and covered the second row of upgrade buttons under the surviving army
# members. No card can be played on this screen, and windows 520px tall or less already hid the hand here, so the
# hand (and every card in it, which the deal animation can make visible on its own) is now hidden on the prestige
# screen at every size. On desktop the buttons spill below the short field box by design, so the field is left as is.
# On phones, four or five surviving army members wrap into two rows taller than the field. The field centred its rows
# (align-content:center), so the top row overflowed above the scroll area and could not be reached. It now uses
# safe centring (top-aligned when it overflows, centred otherwise) and scrolls, so every upgrade button is reachable.

_JSPF = r"""
/* ===== patch_prestigefit: nothing covers the prestige upgrade buttons ===== */
try{const st=document.createElement('style');st.id='ppf';st.textContent=`
#app:has(.kc) .hand,#app:has(.kc) .hand *{visibility:hidden!important;pointer-events:none!important}
html.ph #app:has(.kc) .fld.fp{overflow-y:auto;overflow-x:hidden;align-content:flex-start;align-content:safe center;justify-content:safe center;overscroll-behavior:contain}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSPF + "showChars();\n</script>")
