# patch_browse20: cards on every card-browsing screen are 20% bigger (Ben's request). Some scrolling is fine;
# grids keep wrapping, gaps and centring and scroll instead of squeezing. The fight hand and battlefield are
# untouched (PR #70 sized those); only the cards inside these containers grow:
#   .ov .lib > .cd        full library + starting cards (home), view deck / library so far, graveyard,
#                         quick-spell pause (its cards sit in a plain wrapper div)
#   .lib > .rmw           remove / upgrade / duplicate picker (crafting table, altar), Hades discard
#   .dcards .dw .cd       draft and reward draft ("Spoils of Victory")
#   .cfm .big .cd         the chosen card on the upgrade/remove confirmation
#   .kc > .cd             prestige (kleos) upgrade picker after a victory
# Each rule multiplies the size that screen already had (zoom, --ds, --czf, the phone --lw card) by 1.2.
# The style is appended last so it wins over the earlier injected sheets.

_CSSB20 = r"""
html .ov .lib>.cd,html .ov .lib>div:not(.rmw)>.cd{zoom:1.2}
html .ov .lib>.rmw{zoom:1.2}
html .rmv .lib>.rmw{zoom:1.44}
html.ph .rmv .lib>.rmw{zoom:1.2}
html .ov .lib{max-width:min(1100px,94vw)}
html .dcards .dw .cd{zoom:calc(var(--ds,1.6)*1.2)}
html .cfm .big{padding:86px 0}
html .cfm .big .cd,html .cfm .big .cd:hover{scale:2.4}
html.ph .ov.cfm .big .cd{zoom:1.2!important}
html.ph .ov.cfm .big{padding:0!important}
html.ph .ov.cfm .ovb{overflow-y:auto;justify-content:flex-start;scrollbar-width:none}
html .kc>.cd{zoom:1.2}
@media(min-width:561px){html:not(.ph) .kc>.cd{zoom:calc(var(--czf,1)*1.2)}}
"""

_JSB20 = "try{const st=document.createElement('style');st.id='pb20';st.textContent=" + repr(_CSSB20) + ";document.body.appendChild(st)}catch(e){}\n"
_b3("showChars();\n</script>", _JSB20 + "showChars();\n</script>")
