# v123 (patch69): Ben's playtest notes on card names, Legendaries, hover pop-ups, library screens and the deal.
# 1. Card names go back to how they were before patch68: left-aligned at the old size (.82em), clipped inside the
#    name box. Long names no longer drop to a fixed .72em / .62em (which left most of them smaller than they
#    needed to be): every name starts at .82em and the fitter shrinks it only as far as it must to fit.
#    The thickening stroke and shadow are 25% lighter.
# 2. Legendaries: the glisten dropped frames in the full card pool (12+ Legendaries). Three animations ran on
#    each card and all of them repainted every frame: patch52's frame gleam animated the card's own background
#    (the frame painting), patch58's sweep animated a background-position under mix-blend-mode:screen with a
#    pulsing box-shadow, and four twinkling glints scaled radial gradients. Now: the frame gleam and the glints
#    are gone, the gold glow is static, and the gold line is one band moved with transform inside a clipped
#    layer (compositor only, no repaint). Each card gets its own period (7-12 s) and phase, taken from a shared
#    clock so a re-render resumes the sweep where it was instead of restarting it.
# 3. Hover pop-up (#kdock): the preferred spot is directly above the card, everywhere (combat, draft, library
#    overlays). Then beside it, below it, the corners. A spot that touches the card is never used; if every
#    candidate does, a grid search finds the nearest free spot. Test: tooling/ut55_hover.js (run in a browser).
# 4. The offering coin (and the stance button) used the browser's native title tooltip. Hovering them now
#    shows their text in the parchment hover pop-up, placed like the card's own; the native tooltip is removed.
# 5. Full card pool and Starting cards use the home screen painting as their background.
# 6. Deal: the opening hand flies from the library like every other draw (it used to pop up in place), both
#    sides at once, one card every 190 ms. Every slot is reserved before the first card leaves, so nothing in
#    the hand moves. The flight clock now advances at most 50 ms per frame, so a busy frame (the fight screen
#    building) pauses the flight instead of skipping it to the end, and the real card stays hidden until its
#    flight has actually landed (it used to reappear on a fixed timer, mid-flight if frames were slow).

def _rng69(a, b, new):
    """Replace the unique text running from marker a through marker b (inclusive)."""
    for nm in ('head', 'mid', 'tail', 'A', 'B'):
        t = globals()[nm]
        if t.count(a) == 1:
            i = t.index(a)
            j = t.index(b, i) + len(b)
            globals()[nm] = t[:i] + new + t[j:]
            return
    raise AssertionError(a[:70])

# --- 2. Legendary: one transform-animated gold band per card ------------------------------------------------
_b3("const rr=RAR[c.id]?`<s class=\"rr r${RAR[c.id]}\">${RARN[RAR[c.id]]}</s>`:''",
    "const rr=RAR[c.id]?`<s class=\"rr r${RAR[c.id]}\">${RARN[RAR[c.id]]}</s>`+(RAR[c.id]=='L'?LG69(c):''):''")
_b3("const CMAP={};function card(c,z,zi,yo){",
    "const LGT69={};function LG69(c){const k=c.u||c.id;let v=LGT69[k];if(!v)v=LGT69[k]=[7+Math.random()*5,Math.random()];"
    "const p=v[0],ph=((Date.now()/1000)/p+v[1])%1;return'<i class=\"lg69\" style=\"--lt:'+p.toFixed(2)+'s;--ld:-'+(ph*p).toFixed(2)+'s\"></i>'}"
    "const CMAP={};function card(c,z,zi,yo){")

# --- 3. hover pop-up placement: above first, never over its card ---------------------------------------------
_rng69("const cand=CBT?", "if(!best||sc<best[0])best=[sc,x,y]}",
    "const sy=CBT?Y65:cy-h/2,RR={left:R.left-3,top:R.top-3,right:R.right+3,bottom:R.bottom+3};"
    "const cand=[[cx-w/2,R.top-g-h,0],[R.right+g,sy,1],[R.left-g-w,sy,1.2],[cx-w/2,R.bottom+g,2],"
    "[R.right+g,R.top,2.5],[R.right+g,R.bottom-h,2.5],[R.left-g-w,R.top,2.7],[R.left-g-w,R.bottom-h,2.7],"
    "[m,m,4],[W-w-m,m,4],[m,H-h-m,4],[W-w-m,H-h-m,4]];"
    "const score=(x,y,x0,y0,rk)=>{const a={l:x,t:y,r:x+w,b:y+h};const gx=Math.max(0,a.l-R.right,R.left-a.r),gy=Math.max(0,a.t-R.bottom,R.top-a.b);"
    "return(ov(a,RR)>0?1e9:0)+rk*1000+Math.hypot(gx,gy)*40+Math.abs(x-x0)*2+Math.abs(y-y0)*20+others.reduce((s,r)=>s+ov(a,r),0)*.004};"
    "let best=null;for(const [x0,y0,rk] of cand){const x=Math.min(Math.max(m,x0),W-w-m),y=Math.min(Math.max(m,y0),H-h-m);"
    "const sc=score(x,y,x0,y0,rk);if(!best||sc<best[0])best=[sc,x,y]}"
    "if(best[0]>=1e9){for(let y=m;y<=H-h-m;y+=16)for(let x=m;x<=W-w-m;x+=16){const sc=score(x,y,cx-w/2,R.top-g-h,5);if(sc<best[0])best=[sc,x,y]}}")

# --- 4. offering coin / stance button: their text in the parchment pop-up ------------------------------------
_b3("addEventListener('pointerover',e=>{const cd=e.target.closest&&e.target.closest('.cd');if(cd&&!cd.closest('#insp')){if(cd!==cur)showFor(cd)}else hide()},true);",
    "addEventListener('pointerover',e=>{const cd=e.target.closest&&e.target.closest('.cd');if(cd&&!cd.closest('#insp')){"
    "let te=e.target.closest('[title],[data-tt]');if(te&&!cd.contains(te))te=null;"
    "if(te&&te.hasAttribute('title')){te.dataset.tt=te.getAttribute('title');te.removeAttribute('title')}"
    "if(cd!==cur||te!==TE69){TE69=te;showFor(cd)}}else{TE69=null;hide()}},true);")
_b3("const showFor=cd=>{const fx=cd&&cd.querySelector('.fxp');if(!fx||!fx.innerHTML.trim()){hide();return}",
    "const showFor=cd=>{const fx=cd&&cd.querySelector('.fxp');const tt=TE69&&cd&&cd.contains(TE69)?tip69(TE69):'';if(!tt&&(!fx||!fx.innerHTML.trim())){hide();return}")
_b3("dk.innerHTML=fx.innerHTML;", "dk.innerHTML=tt||fx.innerHTML;")
_b3("const dk=document.createElement('div');dk.id='kdock';",
    "let TE69=null;const tip69=el=>{const t=(el.dataset.tt||'').trim();if(!t)return'';const m=/^Offer for (\\d+) mana$/.exec(t);"
    "if(m&&el.classList.contains('ob'))return'<p><b>Offer for '+m[1]+' mana</b></p><p>Click to sacrifice this army member to the gods. You gain '+m[1]+' mana to spend this turn.</p>';"
    "return'<p>'+t.replace(/ \\((click[^)]*)\\)/i,(_,x)=>'</p><p>'+x[0].toUpperCase()+x.slice(1)+'.').replace(/^./,ch=>ch.toUpperCase())+'</p>'};"
    "const dk=document.createElement('div');dk.id='kdock';")

# --- 5. library overlays: the home painting ------------------------------------------------------------------
_b3('const stc=C.staples.map(id=>mk(id)),lib=G.lib?`<div class="ov" style="background:#0b1820">',
    'const stc=C.staples.map(id=>mk(id)),lib=G.lib?`<div class="ov ovlib">')

# --- 6. deal: the opening hand flies too, and flights survive slow frames ------------------------------------
_b3("G.turn=0;G.hq=0;G.hdisc=0;draw(p,4);startHand(f);",
    "G.turn=0;G.hq=0;G.hdisc=0;G.ft=G.fte=0;G.deal69=1;try{draw(p,4);startHand(f)}finally{G.deal69=0}")
_rng69("function flyIn(c,s){if(!G||!G.turn)return;", "requestAnimationFrame(step);setTimeout(done,d+DUR+1500)}catch(e){if(wrap)try{wrap.remove()}catch(_){}}})}",
    r"""function flyIn(c,s){if(!G||!(G.turn||G.deal69))return;const mine=s===G.p,K=mine?'ft':'fte',deal=!G.turn,now=Date.now(),d=Math.max(0,(G[K]||0)-now),DUR=deal?760:900;G[K]=now+d+(deal?190:300);c.fly=now+d+DUR+60000;const g=G;
let wrap=null,fin=false;
const done=()=>{fin=true;try{wrap&&wrap.remove()}catch(e){}};
const land=()=>{if(fin)return;fin=true;c.fly=0;try{if(g===G)render()}catch(e){}try{wrap&&wrap.remove()}catch(e){}};
setTimeout(()=>{if(!fin&&(!wrap||!wrap.isConnected))land()},d+DUR+2500);setTimeout(land,d+DUR+9000);
const dstOf=()=>{if(mine)return document.querySelector('#app .hand .cd[data-z="h:'+c.u+'"]');const i=s.hand.indexOf(c);return i<0?null:(document.querySelectorAll('#app .eHand .cb')[i]||null)};
requestAnimationFrame(()=>{try{const src=document.querySelector(mine?'.decks .pile.mine[data-z="lib"]':'.decks .pile:nth-child(2)'),dst0=dstOf();if(!src||!dst0)return land();
wrap=document.createElement('div');wrap.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:50% 50%;visibility:hidden;will-change:transform';
const inr=document.createElement('div');inr.className=mine?'hand':'eHand';inr.style.cssText='position:static;inset:auto;margin:0;padding:0;width:max-content;height:auto;max-width:none;display:block;overflow:visible;transform:none;translate:none;scale:none';
const cl=dst0.cloneNode(true);cl.removeAttribute('data-z');cl.removeAttribute('data-cu');cl.style.visibility='inherit';cl.style.margin='0';cl.style.transition='none';inr.appendChild(cl);wrap.appendChild(inr);document.body.appendChild(wrap);
const r0=wrap.getBoundingClientRect(),w0=r0.width||1,h0=r0.height||1,a=src.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,s0=a.width/w0,rot0=mine?-8:8;
let bx=ax,by=ay,s1=1,el=-d,last=null;const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const step=ts=>{if(fin)return;if(g!==G)return done();if(!document.body.contains(wrap))return land();
 el+=last==null?0:Math.min(50,Math.max(0,ts-last));last=ts;c.fly=Date.now()+60000;
 if(el<0){requestAnimationFrame(step);return}
 const dst=dstOf();if(!dst){if(!s.hand.includes(c)){c.fly=0;return done()}}else{const b=dst.getBoundingClientRect();if(b.width){bx=b.left+b.width/2;by=b.top+b.height/2;s1=b.width/w0}}
 const t=Math.min(1,el/DUR),k=ease(t),x=ax+(bx-ax)*k,y=ay+(by-ay)*k,sc=s0+(s1-s0)*k;
 wrap.style.visibility='visible';wrap.style.transform='translate('+(x-w0/2-r0.left).toFixed(1)+'px,'+(y-h0/2-r0.top).toFixed(1)+'px) rotate('+(rot0*(1-k)).toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
 if(t<1){requestAnimationFrame(step);return}
 land()};
requestAnimationFrame(step)}catch(e){land()}})}""")

_JS69 = r"""
/* ===== v123 (patch69): names, Legendary glisten, library backgrounds ===== */
try{const st=document.createElement('style');st.id='p69';st.textContent=`
html .cd.af .nm b{font-size:.82em;justify-content:flex-start;overflow:hidden;padding-left:.45em}
html .cd.af .nm b.nl,html .cd.af .nm b.nx{font-size:.82em}
html .cd .nm b{-webkit-text-stroke:.0525em currentColor;text-shadow:.026em 0 0 currentColor}
.cd.af-l,.cd.af-ls,.cd.af-ol,.cd.af-ols,.cd.af-wl,.cd.af-wls,.cd.af-tl,.cd.af-tls{background:var(--fr) 0 0/100% 100% no-repeat,var(--f);animation:none}
html .cd:has(>s.rr.rL)::before{animation:none;background:none;mix-blend-mode:normal;box-shadow:0 0 9px 1px #ffc24f73,inset 0 0 6px #ffd77a59}
html .cd:has(>s.rr.rL)>.ar::after{content:none;animation:none;background:none}
.cd>.lg69{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;z-index:6;contain:strict}
.cd>.lg69::before{content:"";position:absolute;top:-5%;bottom:-5%;left:0;width:50%;
 background:linear-gradient(90deg,#ffd06a00 6%,#ffd36e59 34%,#fff4d0b8 50%,#ffd36e59 66%,#ffd06a00 94%);
 transform:translate3d(-160%,0,0) skewX(-22deg);animation:lg69 var(--lt,9s) linear var(--ld,0s) infinite}
@keyframes lg69{0%{transform:translate3d(-160%,0,0) skewX(-22deg);animation-timing-function:cubic-bezier(.45,.05,.55,.95)}16%,100%{transform:translate3d(260%,0,0) skewX(-22deg)}}
@media (prefers-reduced-motion:reduce){.cd>.lg69{display:none}}
html .ov.ovlib{background:linear-gradient(#0b1820cc,#0b182066 35%,#0b182088 65%,#0b1820ee),url(art/game/home/background.jpg) center 40%/cover no-repeat,#0b1820}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JS69 + "showChars();\n</script>")
