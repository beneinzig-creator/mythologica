# patch_mappaths: bolder, outlined route lines on the map (Ben: the paths between medallions were hard to see).
# Each route (svg path.tr) is now drawn twice: a wider, slightly see-through dark brown band underneath
# (path.tru, same curve, inserted just before it) and the coloured line on top, a little thicker than before.
# The three kinds stay distinct:
#   locked (can't take it now)  light parchment dots on a thin, faint dark band
#   available (.av)             bright gold dots on a strong dark band, soft gold glow
#   travelled (.dn)             rust dashes on a dark band
# The band follows the same endpoints as the line (they already stop short of the medallions), and the SVG sits
# under the medallions and the hero token (PR #78), so neither is covered. It is done after every renderMap
# (hero maps, Act II realms, Act III, phone layout); the full-screen map's non-scaling strokes apply to both paths,
# so the look holds at any zoom.

_JSMP = r"""
/* ===== patch_mappaths: dark outline under every map route ===== */
function mapPaths(){document.querySelectorAll('.tmap svg path.tr').forEach(p=>{const u=p.previousElementSibling;if(u&&u.classList.contains('tru'))return;
 const b=p.cloneNode(false);b.setAttribute('class',p.getAttribute('class').replace(/\btr\b/,'tru'));p.parentNode.insertBefore(b,p)})}
{const r1=renderMap;renderMap=function(){const out=r1.apply(this,arguments);try{mapPaths()}catch(e){}return out}}
try{const st=document.createElement('style');st.id='pmp';st.textContent=`
.tmap svg path.tru{fill:none;stroke:#1c1006;stroke-linecap:round;stroke-linejoin:round;stroke-width:8;opacity:.42;stroke-dasharray:none;filter:none;pointer-events:none}
.tmap svg path.tru.av{stroke-width:11;opacity:.62}
.tmap svg path.tru.dn{stroke-width:10;opacity:.55}
.tmap svg path.tr{stroke:#efe0b6;stroke-width:4.5;stroke-dasharray:1 10;opacity:.72;filter:none}
.tmap svg path.tr.av{stroke:#f3c552;stroke-width:6;stroke-dasharray:1 11;opacity:1;filter:drop-shadow(0 0 3px #f3c55288)}
.tmap svg path.tr.dn{stroke:#d0662f;stroke-width:5.5;stroke-dasharray:11 7;opacity:1;filter:none}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSMP + "showChars();\n</script>")
