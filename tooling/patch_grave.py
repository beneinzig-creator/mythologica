# patch_grave: the graveyard pile shows a painted gravestone instead of the top card's emoji.
# Each hero has their own stone (art/icons/<hero>/grave.png -> art/game/icons/[<hero>/]grave.png):
#   Odysseus a Greek marble stele, Odin a Viking rune stone, Wukong a Chinese stele on a tortoise,
#   Thoth an Egyptian funerary stela.
# The stone follows the hero being played, so both graveyards (yours and the enemy's) in every fight of a run,
# Act III included, show that hero's stone. The count stays in the corner; an empty graveyard shows the stone
# dimmed. If the picture fails to load, the 🪦 emoji takes its place.
_b3('${n?`<span class="gyc">${D[top.id][7]}</span><span class="gyn">${n}</span>`:\'\'}',
    '<span class="gyc"><img class="gvi" src="${GRV()}" alt="" draggable="false" onerror="this.outerHTML=\'🪦\'"></span>${n?`<span class="gyn">${n}</span>`:\'\'}')

_JSGRV = r"""
/* ===== patch_grave: per-hero gravestone on the graveyard piles ===== */
function GRV(){let h='';try{h=(typeof G!='undefined'&&G&&G.ch)||(typeof CH!='undefined'&&CH)||''}catch(e){}return(!h||h=='ody')?'art/game/icons/grave.png':'art/game/icons/'+h+'/grave.png'}
try{const st=document.createElement('style');st.id='pgrv';st.textContent=`
html .gy .gyc{position:absolute;inset:10% 12% 16%;display:flex;align-items:center;justify-content:center;filter:none;font-size:inherit;line-height:1}
html .gy .gvi{width:100%;height:100%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 2px 2px #000c)}
html .gy.empty .gvi{filter:grayscale(.6) drop-shadow(0 2px 2px #000c)}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSGRV + "showChars();\n</script>")
