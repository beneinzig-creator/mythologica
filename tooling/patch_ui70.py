# v124 (patch_ui70): three playtest UI fixes.
# 1. Cursor glow on the battlefield slabs sat off the pointer. The light is a radial gradient in .fld::after;
#    .fld is CSS-zoomed (--zc, 1.1-1.25) inside .board, which is tilted with perspective(1300px) rotateX(20deg).
#    patch65's fxLoc65 maps the pointer through four corner probes, and in Chrome that lands within 0.5px
#    (measured). But WebKit (Safari) returns getBoundingClientRect() divided by the element's effective zoom, so
#    probes inside the zoomed .fld come back shrunk toward the origin while clientX does not: the light drifts
#    away from the pointer, more the further right/down it is. It also leaned on offsetWidth (zoom-adjusted in
#    WebKit too) and a fixed 88px/8px inset. Now: each probe carries zoom:1/Z (Z = product of zooms up the
#    tree) so its effective zoom is 1 in every engine, the probes sit at the corners of the ::after box itself,
#    the client->slab homography is cached until the slab's rect/insets or the window change, and the gradient
#    is placed in percent of the ::after box (no px/zoom conversions at all).
# 2. Battleground slabs are see-through: the fight's background painting shows through (light tint, lighter
#    inner shadow, a faint gold edge so the slab still reads).
# 3. Card names 20% lighter. IM Fell English only ships at 400 and font-synthesis is none, so the 900 weight
#    was never drawn; all the extra weight came from patch69's stroke (.0525em) and offset shadow (.026em).
#    Stem = .08em (measured) + .0525 + .026 = .1585em; 80% = .127em -> stroke .0313em, shadow .0155em.

_b3("function fxTableLight(){const app=document.getElementById('app');if(!app||app.dataset.lt)return;app.dataset.lt=1;",
    "function fxGlowH(f){const cs=getComputedStyle(f,'::after'),r=f.getBoundingClientRect(),"
    "k=[r.left,r.top,r.width,r.height,innerWidth,innerHeight,cs.left,cs.top,cs.right,cs.bottom].join();"
    "if(f._gk===k&&f._gh)return f._gh;"
    "const bx=document.createElement('i');bx.style.cssText='position:absolute;left:'+cs.left+';top:'+cs.top+';right:'+cs.right+';bottom:'+cs.bottom+';margin:0;padding:0;border:0;pointer-events:none;visibility:hidden';"
    "let Z=1;for(let e=f;e&&e.nodeType==1;e=e.parentElement){const z=parseFloat(getComputedStyle(e).zoom);if(z>0)Z*=z}"
    "const Q=[[0,0],[1,0],[0,1],[1,1]],P=Q.map(([u,v])=>{const p=document.createElement('i');"
    "p.style.cssText='position:absolute;display:block;width:0;height:0;margin:0;padding:0;border:0;zoom:'+(1/Z)+';'+(u?'right:0;':'left:0;')+(v?'bottom:0':'top:0');bx.appendChild(p);return p});"
    "f.appendChild(bx);const C=P.map(p=>{const q=p.getBoundingClientRect();return[q.left,q.top]});bx.remove();"
    "const M=[];C.forEach(([x,y],i)=>{const[u,v]=Q[i];M.push([x,y,1,0,0,0,-x*u,-y*u,u]);M.push([0,0,0,x,y,1,-x*v,-y*v,v])});"
    "for(let c=0;c<8;c++){let p=c;for(let j=c+1;j<8;j++)if(Math.abs(M[j][c])>Math.abs(M[p][c]))p=j;[M[c],M[p]]=[M[p],M[c]];"
    "if(Math.abs(M[c][c])<1e-12)return null;for(let j=0;j<8;j++)if(j!==c){const t=M[j][c]/M[c][c];for(let k2=c;k2<9;k2++)M[j][k2]-=t*M[c][k2]}}"
    "f._gk=k;return f._gh=M.map((row,i)=>row[8]/row[i])}"
    "function fxGlowAt(f,x,y){const h=fxGlowH(f);if(!h)return null;const w=h[6]*x+h[7]*y+1;"
    "return[((h[0]*x+h[1]*y+h[2])/w*100).toFixed(2)+'%',((h[3]*x+h[4]*y+h[5])/w*100).toFixed(2)+'%']}"
    "function fxTableLight(){const app=document.getElementById('app');if(!app||app.dataset.lt)return;app.dataset.lt=1;")
_b3("const q=fxLoc65(f,e.clientX,e.clientY);FXS.lastMx=[f.classList.contains('fe')?'fe':'fp',q[0],q[1]];\n"
    "  f.style.setProperty('--mx',FXS.lastMx[1].toFixed(0)+'px');f.style.setProperty('--my',FXS.lastMx[2].toFixed(0)+'px')});",
    "const g=fxGlowAt(f,e.clientX,e.clientY);if(!g)return;FXS.lastMx=[f.classList.contains('fe')?'fe':'fp',g[0],g[1]];\n"
    "  f.style.setProperty('--mx',g[0]);f.style.setProperty('--my',g[1])});")
_b3("if(f){f.style.setProperty('--mx',FXS.lastMx[1].toFixed(0)+'px');f.style.setProperty('--my',FXS.lastMx[2].toFixed(0)+'px')}}",
    "if(f){f.style.setProperty('--mx',FXS.lastMx[1]);f.style.setProperty('--my',FXS.lastMx[2])}}")

_JS70 = r"""
/* ===== v124 (patch_ui70): cursor glow, see-through battleground, lighter names ===== */
try{const st=document.createElement('style');st.id='p70';st.textContent=`
html .fld::after{background:radial-gradient(240px circle at var(--mx,-900px) var(--my,-900px),#ffd59238,#0000 70%),radial-gradient(ellipse 40% 80% at 0% 50%,#ff9a4a22,#0000 70%),radial-gradient(ellipse 40% 80% at 100% 50%,#ff9a4a22,#0000 70%)}
html .fld::before,html.scn .fld::before{background-color:color-mix(in srgb,color-mix(in srgb,var(--b1) 55%,#000) 22%,transparent);
 box-shadow:inset 0 2px 0 #0004,inset 0 0 28px #0006,inset 0 -1px 0 #ffffff14,0 0 0 1px #ffe2a030,0 0 0 4px #0000001c}
html .cd .nm b{-webkit-text-stroke:.0313em currentColor;text-shadow:.0155em 0 0 currentColor}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JS70 + "showChars();\n</script>")
