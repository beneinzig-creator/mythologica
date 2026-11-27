# patch_maptipedge: keep a map medallion's hover box on screen (Ben: near the edge of the screen the box ran off
# and couldn't be read). The box (.wn .tipx) is centred over its medallion and sits above it (below it for the top
# row, .dn). When it opens, we measure it against the visible area (the window, cut down by any clipping ancestor
# such as the scrolling full-screen map) and:
#   - slide it left or right just enough to fit, keeping an 8px margin;
#   - flip it below the medallion if it would run off the top, or above if it would run off the bottom.
# The map can be scaled (zoom/transform), so the slide is divided by the box's on-screen scale. Phones hide the box
# (they use the .ninfo panel instead), so nothing changes there.

_JSMTE = r"""
/* ===== patch_maptipedge: map hover box stays on screen ===== */
(function(){const M=8;
 function clipRect(el){let L=0,T=0,R=innerWidth,B=innerHeight;for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const cs=getComputedStyle(p);
  if(/(hidden|auto|scroll|clip)/.test(cs.overflow+cs.overflowX+cs.overflowY)){const r=p.getBoundingClientRect();L=Math.max(L,r.left);T=Math.max(T,r.top);R=Math.min(R,r.right);B=Math.min(B,r.bottom)}}
  return {L,T,R,B}}
 function place(wn){const t=wn.querySelector('.tipx');if(!t)return;
  t.style.removeProperty('transform');t.style.removeProperty('top');t.style.removeProperty('bottom');
  let r=t.getBoundingClientRect();if(!r.width)return;
  const sc=r.width/(t.offsetWidth||r.width)||1,c=clipRect(t);
  const below=t.classList.contains('dn');
  if(!below&&r.top<c.T+M){t.style.setProperty('bottom','auto','important');t.style.setProperty('top','62px','important')}
  else if(below&&r.bottom>c.B-M){t.style.setProperty('top','auto','important');t.style.setProperty('bottom','62px','important')}
  r=t.getBoundingClientRect();
  let dx=0;if(r.width>c.R-c.L-2*M)dx=c.L+M-r.left;else if(r.left<c.L+M)dx=c.L+M-r.left;else if(r.right>c.R-M)dx=c.R-M-r.right;
  if(dx)t.style.setProperty('transform','translateX(calc(-50% + '+(dx/sc).toFixed(1)+'px))','important')}
 if(typeof document.addEventListener=='function')document.addEventListener('mouseover',e=>{const wn=e.target&&e.target.closest&&e.target.closest('.wn');if(!wn||wn.contains(e.relatedTarget))return;try{place(wn)}catch(err){}},true);
})();
"""
_b3("showChars();\n</script>", _JSMTE + "showChars();\n</script>")
