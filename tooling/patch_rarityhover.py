# patch_rarityhover: the card hover box (desktop) and the long-press inspect box (phone) say the card's rarity (Ben).
# Until now the only sign of rarity was the frame. Both boxes are filled from fxp(), so the rarity goes in as its
# second line, right under the card type, coloured to match its rarity on the parchment. Cards with no rarity
# (enemy cards, tokens) get no line.
_b3("L=['<b>'+x[0]+'</b>: '+x[1]];L.push(...atkLines(c,t));",
    "L=['<b>'+x[0]+'</b>: '+x[1]];if(RAR[c.id])L.push('<b>Rarity</b>: <span class=\"rrh r'+RAR[c.id]+'\">'+RARN[RAR[c.id]]+'</span>');L.push(...atkLines(c,t));")
_JSRH = r"""
/* ===== patch_rarityhover: rarity colours that read on the parchment hover box ===== */
try{const st=document.createElement('style');st.id='prh';st.textContent=`
.rrh{font-weight:700;text-shadow:none!important}
#kdock .rrh.rC,#insp .rrh.rC{color:#4d4434}#kdock .rrh.rU,#insp .rrh.rU{color:#1d5a8c}
#kdock .rrh.rR,#insp .rrh.rR{color:#8a5a00}#kdock .rrh.rL,#insp .rrh.rL{color:#86208f}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSRH + "showChars();\n</script>")
