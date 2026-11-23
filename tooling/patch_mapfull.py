# patch_mapfull: the map screen is the map. Ben's playtest: the map sat as a framed box in a big dark-blue page.
# Desktop/tablet only (phones keep their own two-column map layout, html.ph).
# - The map (.tmap, with each hero's ui_map art) now covers the whole window, edge to edge (background cover).
# - Nodes keep their layout but are spread over the whole window: the nodes' bounding box is stretched (x and y
#   separately) to the free area under the title, so the medallions fill the map. Each medallion is zoomed
#   uniformly (from the window size) so it never distorts. The route lines use the same mapping through the SVG viewBox
#   (preserveAspectRatio none, non-scaling strokes so the dots keep their size). The old SVG compass is hidden;
#   every map painting has its own.
# - The title, stats and next-opponent line sit in a parchment cartouche at the top, in dark ink and the map's
#   fonts (Cinzel title, IM Fell text) instead of white text on blue.
# - Re-laid out on window resize.

_JSMF = r"""
/* ===== patch_mapfull: full-window map ===== */
function mapFit(){const ms=document.querySelector('#app>.mapscr'),t=ms&&ms.querySelector('.tmap');if(!t||document.documentElement.classList.contains('ph')||!G||!G.web)return;
 ms.classList.add('mapfull');let hd=ms.querySelector(':scope>.mhd');if(!hd){hd=document.createElement('div');hd.className='mhd';[...ms.children].filter(e=>e!==t).forEach(e=>hd.appendChild(e));ms.insertBefore(hd,t)}
 const W=innerWidth,H=innerHeight,hb=hd.getBoundingClientRect(),N=G.web.nodes,xs=N.map(n=>n.x),ys=N.map(n=>n.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),
  s=Math.max(.6,Math.min(1.6,Math.min(W/WEBW,(H-hb.bottom)/WEBH)*1.2)),R=27*s,P=R+Math.max(22,W*.03),T=hb.bottom+R+Math.max(10,H*.015),B=R+Math.max(26,H*.04),
  sx=(W-2*P)/Math.max(1,x1-x0),sy=Math.max(.2,(H-T-B)/Math.max(1,y1-y0)),X=x=>P+(x-x0)*sx,Y=y=>T+(y-y0)*sy;
 t.style.width=t.style.height=t.style.zoom='';
 t.querySelectorAll(':scope>.wn').forEach((b,i)=>{const n=N[i];if(!n)return;b.style.zoom=s.toFixed(3);b.style.left=(X(n.x)/s-27).toFixed(1)+'px';b.style.top=(Y(n.y)/s-27).toFixed(1)+'px'});
 const sv=t.querySelector(':scope>svg');if(sv){sv.setAttribute('width',W);sv.setAttribute('height',H);sv.setAttribute('viewBox',[x0-P/sx,y0-T/sy,W/sx,H/sy].map(v=>v.toFixed(2)).join(' '));sv.setAttribute('preserveAspectRatio','none')}}
{const r0=renderMap;renderMap=function(){const out=r0.apply(this,arguments);try{mapFit()}catch(e){}return out}}
try{addEventListener('resize',()=>{try{if(G&&G.phase=='map')mapFit()}catch(e){}})}catch(e){}
try{const st=document.createElement('style');st.id='pmf';st.textContent=`
html:not(.ph) .dft.mapscr.mapfull{padding:0;gap:0;justify-content:flex-start}
html:not(.ph) .mapfull .tmap{position:fixed;inset:0;width:auto;height:auto;margin:0;zoom:1;border-radius:0;background-size:cover!important;background-position:center!important;box-shadow:inset 0 0 120px #3b240c99,inset 0 0 30px #2a1a0866!important}
html:not(.ph) .mapfull .tmap::before{border-radius:0}
html:not(.ph) .mapfull .tmap::after{display:none}
html:not(.ph) .mapfull .tmap svg>g{display:none}
html:not(.ph) .mapfull .tmap svg path{vector-effect:non-scaling-stroke}
html:not(.ph) .mapfull .mhd{position:relative;z-index:5;margin-top:10px;max-width:calc(100vw - 200px);display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 34px 9px;color:#2b1d0e;text-align:center;
 background:radial-gradient(ellipse at 50% 40%,#f1e5c6,#dccb9f 70%,#c9b27e);border:10px solid #5e4520;border-image:url(art/game/frames/c.jpg) 58/10px round;box-shadow:0 8px 22px #000a,0 0 0 1px #3b2a1466}
html:not(.ph) .mapfull .mhd .ovt{font-size:clamp(20px,2.1vw,30px)!important;color:#3a2410;letter-spacing:.08em;line-height:1.05;margin:0;text-shadow:0 1px 0 #f6ecd2,0 0 1px #3a2410}
html:not(.ph) .mapfull .mhd .dsub{color:#3b2a14!important;opacity:1!important;font-family:var(--fb);font-size:clamp(13px,1.2vw,17px)!important;margin:0;line-height:1.25;text-shadow:none}
html:not(.ph) .mapfull .mhd .dsub+.dsub{font-size:clamp(11px,.95vw,14px)!important;font-style:italic;color:#5a3f1c!important;border-top:1px solid #6b4a1f55;padding-top:2px;margin-top:1px}
html:not(.ph) .mapfull .mhd .b{margin-top:4px}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSMF + "showChars();\n</script>")
