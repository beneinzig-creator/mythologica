# v121 (patch65): Ben's playtest list of combat UI and animation fixes (Miscellaneous session).
# 1. Hover pop-ups (#kdock) on combat cards (table and hand) and draft offers: bigger, always at one height on
#    screen, beside the card (never over it). Draft offers had only the small pop-up, squeezed above the card.
#    Draft offers also lean back in 3D inside a preserve-3d wrapper, so over their top half (the art) the pointer
#    hit the wrapper instead of the card: no hover lift and no pop-up. The wrapper no longer takes the pointer.
#    It now waits for the card's hover transition (scale 1.45, the enemy tilt easing off) before measuring it;
#    before, it measured after 150ms, mid-transition, and could land on top of the enlarged card.
# 2. Tapped army members no longer spin upright on hover. The glitch was a hover loop: the card scaled up around
#    its top edge, which is sideways once it's rotated, slid out from under the pointer, lost hover, slid back
#    (~120 times a second). Tapped cards now keep their rotation and scale around their centre.
#    Holding the click to inspect still shows the card upright.
# 3. Card names: IM Fell English has no bold and font synthesis is off, so a thin stroke thickens the names.
# 4. Deal: cards fly in a straight line from the deck to their own slot (the enemy's all went to the last slot),
#    follow that slot if the hand shifts mid-flight, land at its exact size, and hand over to the real card in
#    the same frame (the old flight ended ~90ms before the card appeared). The fight intro no longer tweens the
#    still-hidden hand cards 90px down, which the flight measured as its target. The opponent's hand slides
#    when it grows or shrinks instead of jumping.
# 5. Opponent's hand: 20% bigger and centred on screen (the header on its left is wider than the spacer on
#    its right, which pushed it ~120px right).
# 6. The table light is centred on the pointer: the tables are scaled and the enemy's is tilted in 3D, so a
#    linear scale put the light up to ~37px off. The pointer is now mapped through the table's real projection.
# 7. Bigger text on the journey tutorial's reading screen.
# 8. Defense-form health briefly missing (not reproduced; likely cause guarded): see the digit warm-up below.

# --- 4. deal animation ----------------------------------------------------------------------------------
_i65 = None
for _nm65 in ('head', 'mid', 'tail', 'A', 'B'):
    _t65 = globals()[_nm65]
    if 'function flyIn(c,s){' in _t65:
        _a65 = _t65.index('function flyIn(c,s){')
        _e65 = _t65.index('\nfunction fit(){', _a65)
        globals()[_nm65] = _t65[:_a65] + r"""function flyIn(c,s){if(!G||!G.turn)return;const mine=s===G.p,now=Date.now(),d=Math.max(0,(G.ft||0)-now),DUR=900;G.ft=now+d+300;c.fly=now+d+DUR+500;const g=G;
setTimeout(()=>{if(g===G&&c.fly){c.fly=0;render()}},d+DUR+560);
const dstOf=()=>{if(mine)return document.querySelector('#app .hand .cd[data-z="h:'+c.u+'"]');const i=s.hand.indexOf(c);return i<0?null:(document.querySelectorAll('#app .eHand .cb')[i]||null)};
requestAnimationFrame(()=>{let wrap=null;try{const src=document.querySelector(mine?'.decks .pile.mine[data-z="lib"]':'.decks .pile:nth-child(2)'),dst0=dstOf();if(!src||!dst0)return;
wrap=document.createElement('div');wrap.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:50% 50%;visibility:hidden;will-change:transform';
const inr=document.createElement('div');inr.className=mine?'hand':'eHand';inr.style.cssText='position:static;inset:auto;margin:0;padding:0;width:max-content;height:auto;max-width:none;display:block;overflow:visible;transform:none;translate:none;scale:none';
const cl=dst0.cloneNode(true);cl.removeAttribute('data-z');cl.style.visibility='inherit';cl.style.margin='0';cl.style.transition='none';inr.appendChild(cl);wrap.appendChild(inr);document.body.appendChild(wrap);
const r0=wrap.getBoundingClientRect(),w0=r0.width||1,h0=r0.height||1,a=src.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,s0=a.width/w0,rot0=mine?-8:8;
let bx=ax,by=ay,s1=1;const t0=performance.now()+d,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const done=()=>{try{wrap.remove()}catch(e){}};
const step=now=>{if(g!==G)return done();if(!document.body.contains(wrap))return;if(now<t0){requestAnimationFrame(step);return}
 const dst=dstOf();if(!dst){if(!s.hand.includes(c)){c.fly=0;return done()}}else{const b=dst.getBoundingClientRect();if(b.width){bx=b.left+b.width/2;by=b.top+b.height/2;s1=b.width/w0}}
 const t=Math.min(1,(now-t0)/DUR),k=ease(t),x=ax+(bx-ax)*k,y=ay+(by-ay)*k,sc=s0+(s1-s0)*k;
 wrap.style.visibility='visible';wrap.style.transform='translate('+(x-w0/2-r0.left).toFixed(1)+'px,'+(y-h0/2-r0.top).toFixed(1)+'px) rotate('+(rot0*(1-k)).toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
 if(t<1){requestAnimationFrame(step);return}
 c.fly=0;try{render()}catch(e){}done()};
requestAnimationFrame(step);setTimeout(done,d+DUR+1500)}catch(e){if(wrap)try{wrap.remove()}catch(_){}}})}""" + _t65[_e65:]
        _i65 = _nm65
        break
assert _i65, 'flyIn not found'
# the fight intro must not tween hand cards that are still hidden, waiting for their flight
_b3("cdFrom('.hand .cd',{opacity:0,y:90",
    "cdFrom([...document.querySelectorAll('.hand .cd')].filter(e=>e.style.visibility!='hidden'),{opacity:0,y:90")

# --- 1. hover pop-ups ------------------------------------------------------------------------------------
_b3("const showFor=cd=>{const fx=cd&&cd.querySelector('.fxp');if(!fx||!fx.innerHTML.trim()){hide();return}cur=cd;",
    "const showFor=cd=>{const fx=cd&&cd.querySelector('.fxp');if(!fx||!fx.innerHTML.trim()){hide();return}cur=cd;dk.classList.toggle('cbt',!!cd.closest('#app .fld,#app .hand,#app .dcards'));")
_b3("const cand=[[R.right+g,cy-h/2],",
    "const CBT=dk.classList.contains('cbt'),Y65=Math.round(Math.min(Math.max(m,H*.3),H-h-m));const cand=CBT?[[R.right+g,Y65],[R.left-g-w,Y65]]:[[R.right+g,cy-h/2],")
_b3("tm=setTimeout(place,150)",
    "tm=setTimeout(()=>{const my=cur;const A=(my&&my.getAnimations)?my.getAnimations().filter(a=>a.playState=='running'):[];if(!A.length)return place();"
    "Promise.race([Promise.all(A.map(a=>a.finished.catch(()=>0))),new Promise(r=>setTimeout(r,450))]).then(()=>{if(cur===my)place()})},110)")

# --- 6. table light --------------------------------------------------------------------------------------
_b3("const r=f.getBoundingClientRect(),z=f.offsetWidth/(r.width||1);FXS.lastMx=[f.classList.contains('fe')?'fe':'fp',(e.clientX-r.left)*z,(e.clientY-r.top)*(f.offsetHeight/(r.height||1))];",
    "const q=fxLoc65(f,e.clientX,e.clientY);FXS.lastMx=[f.classList.contains('fe')?'fe':'fp',q[0],q[1]];")

_JS65 = r"""
/* ===== v121 (patch65): playtest UI fixes ===== */
// screen point -> table-local point, through the table's real projection (it is scaled, and the enemy's is
// tilted in 3D). Four corner probes give the homography; the light's ::after offset is folded in.
function fxLoc65(f,x,y){const W=f.offsetWidth,H=f.offsetHeight;let Q=f._q65;
 if(!Q||Q.t<performance.now()-250||Q.W!==W||Q.H!==H){const P=[[0,0],[W,0],[W,H],[0,H]].map(([a,b])=>{const d=document.createElement('x-p');d.style.cssText='position:absolute;display:block;left:'+a+'px;top:'+b+'px;width:0;height:0;margin:0;padding:0;border:0;pointer-events:none';f.appendChild(d);const r=d.getBoundingClientRect();d.remove();return[r.left,r.top]});
  const af=getComputedStyle(f,'::after');Q=f._q65={t:performance.now(),W,H,P,al:parseFloat(af.left)||88,at:parseFloat(af.top)||8}}
 const[[x0,y0],[x1,y1],[x2,y2],[x3,y3]]=Q.P,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3;let A,B,C,D,E,F,G7=0,H7=0;
 if(Math.abs(sx)<1e-6&&Math.abs(sy)<1e-6){A=x1-x0;B=x3-x0;C=x0;D=y1-y0;E=y3-y0;F=y0}
 else{const dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,den=dx1*dy2-dx2*dy1;G7=(sx*dy2-dx2*sy)/den;H7=(dx1*sy-sx*dy1)/den;A=x1-x0+G7*x1;B=x3-x0+H7*x3;C=x0;D=y1-y0+G7*y1;E=y3-y0+H7*y3;F=y0}
 const a11=A-G7*x,a12=B-H7*x,b1=x-C,a21=D-G7*y,a22=E-H7*y,b2=y-F,det=a11*a22-a12*a21;if(!det)return[-900,-900];
 const u=(b1*a22-a12*b2)/det,v=(a11*b2-b1*a21)/det;return[u*W-Q.al+88,v*H-Q.at+8]}
// the opponent's hand slides when it grows or shrinks instead of jumping
{const _R65=render;render=function(){let pre=[];try{pre=[...document.querySelectorAll('#app .eHand .cb')].map(e=>e.getBoundingClientRect().left)}catch(e){}
 const out=_R65.apply(this,arguments);
 try{if(pre.length){const now=[...document.querySelectorAll('#app .eHand .cb')];if(now.length!==pre.length)now.forEach((e,i)=>{if(i>=pre.length||!e.animate)return;const r=e.getBoundingClientRect(),dx=pre[i]-r.left;if(Math.abs(dx)<1)return;const z=(r.width/(e.offsetWidth||1))||1;e.animate([{transform:'translateX('+(dx/z).toFixed(1)+'px)'},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.8,.2,1)'})})}}catch(e){}
 return out}}
// Health digits are image masks (art/game/digits). A digit's mask is decoded the first time it is painted, so a
// number that hasn't been on screen yet (defense form's +2 health makes new ones) could paint blank for a
// moment. Keep every digit painted, almost invisibly, in a corner so they stay decoded.
try{const w=document.createElement('div');w.id='dgwarm';w.setAttribute('aria-hidden','true');w.style.cssText='position:fixed;left:0;bottom:0;width:4px;height:4px;overflow:hidden;opacity:.01;pointer-events:none;z-index:1;font-size:3px;line-height:1;white-space:nowrap';w.innerHTML='0123456789/'.split('').map(ch=>'<span class="dg '+(ch=='/'?'ds':'d'+ch)+'"></span>').join('');document.body.appendChild(w)}catch(e){}
try{const st=document.createElement('style');st.id='p65';st.textContent=`
html .fld .cd.tap:hover{rotate:90deg;transform-origin:50% 50%!important;translate:none!important}
html .fld .cd.tap:hover>.sb{top:50%!important;left:-14px!important;bottom:auto!important;transform:translate(-50%,-50%) rotate(-90deg)!important}
.cd .nm b{-webkit-text-stroke:.042em currentColor}
#kdock.cbt{width:270px;font-size:15px;line-height:1.4;padding:8px 12px}
#kdock.cbt p{margin:0 0 6px}
html.ph #kdock.cbt{width:220px;font-size:12.5px}
@media(min-width:561px){html:not(.ph) .top>.eh,html:not(.ph) .top>div:last-child{flex:1 1 0}html:not(.ph) .eHand .cb{zoom:1.2}}
.drf .dw{pointer-events:none}.drf .dw .cd{pointer-events:auto}
.tutm .tutj{font-size:24px;max-width:820px;line-height:1.6}
.tutm .ovt{font-size:42px!important}
.tutm .dsub{font-size:16px}
html.ph .tutm .tutj{font-size:18px}
html.ph .tutm .ovt{font-size:32px!important}
`;document.head.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JS65 + "showChars();\n</script>")
