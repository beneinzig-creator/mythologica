# v110 (patch54): one pop-up per card, and hold-to-inspect on every card (Ben's notes).
# 1. Double pop-ups: in the library overlays (full card pool, starting cards, "your library so far"
#    during the draft, graveyards, the remove screen) the old #tip still showed next to patch48's
#    #kdock. #kdock is now the only hover pop-up, everywhere.
# 2. #kdock is never placed over the card it describes: a spot that would cover it is ruled out,
#    and there are extra corner spots to choose from so one always fits.
# 3. Press and hold ANY card to inspect it (library overlays, draft picks, deck views, the remove
#    screen, graveyards, as well as the table and hand). card() tags each card with data-cu=<uid>
#    and remembers the card object, so the inspector can draw it wherever it was shown.
# 4. While a card is inspected, its info panel (what the hover pop-up says) stays open beside the big
#    card, the hover pop-up itself is hidden, and the myth line stays underneath.

# --- card(): tag each card element with its uid and remember the card object ---------------------
_b3('function card(c,z,zi,yo){',
    'const CMAP={};function card(c,z,zi,yo){if(c&&c.u)CMAP[c.u]=c;')
_b3('return`<div class="cd ${cl.join(\' \')}',
    'return`<div data-cu="${c.u||\'\'}" class="cd ${cl.join(\' \')}')

# --- inspect: any card, found through CMAP ---------------------------------------------------------
_b3("const cd=t&&t.closest&&t.closest('.fld .cd,.hand .cd');if(!cd||typeof G=='undefined'||!G)return null;const u=+((cd.getAttribute('data-z')||'').split(':')[1]);",
    "const cd=t&&t.closest&&t.closest('.cd');if(!cd||cd.closest('#insp')||typeof G=='undefined'||!G)return null;const u=+(cd.getAttribute('data-cu')||0);")
_b3("if(!u)return null;const all=[...(G.p?[...G.p.bf,...G.p.hand]:[]),...(G.e?G.e.bf:[])];return all.find(c=>c.u===u)||null};",
    "if(!u)return null;return CMAP[u]||null};")
# Big card + its info panel side by side, the myth below; leave room for the panel when sizing.
_b3("Math.max(2,Math.min(4.5,(my?.66:.82)*innerHeight/146,.8*innerWidth/104))",
    "Math.max(1.6,Math.min(4.5,(my?.66:.82)*innerHeight/146,.52*innerWidth/104))")
_b3("ov.innerHTML=card(c,'v:'+c.u)+(my?'<div class=\"myth\">'+my+'</div>':'');ov.classList.add('on');shown=true};",
    "const ch=card(c,'v:'+c.u),tmp=document.createElement('div');tmp.innerHTML=ch;const fx=tmp.querySelector('.fxp'),info=fx?fx.innerHTML:'';"
    "ov.innerHTML='<div class=\"irow\">'+ch+(info.trim()?'<div class=\"iinfo\">'+info+'</div>':'')+'</div>'+(my?'<div class=\"myth\">'+my+'</div>':'');"
    "ov.classList.add('on');document.body.classList.add('inspecting');shown=true};")
_b3("const hide=()=>{clearTimeout(tm);tm=0;if(shown){ov.classList.remove('on');ov.innerHTML=''}};",
    "const hide=()=>{clearTimeout(tm);tm=0;document.body.classList.remove('inspecting');if(shown){ov.classList.remove('on');ov.innerHTML=''}};")
# Long-press on touch screens shouldn't select text or open the callout on any card.
_b3('.fld .cd,.hand .cd{-webkit-touch-callout:none;',
    '.cd{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.fld .cd,.hand .cd{-webkit-touch-callout:none;')

# --- #kdock: never over its own card -------------------------------------------------------------
_b3("const cand=[[R.right+g,cy-h/2],[R.left-g-w,cy-h/2],[cx-w/2,R.top-g-h],[cx-w/2,R.bottom+g]];",
    "const cand=[[R.right+g,cy-h/2],[R.left-g-w,cy-h/2],[cx-w/2,R.top-g-h],[cx-w/2,R.bottom+g],"
    "[R.right+g,R.top],[R.right+g,R.bottom-h],[R.left-g-w,R.top],[R.left-g-w,R.bottom-h],[m,m],[W-w-m,m],[m,H-h-m],[W-w-m,H-h-m]];")
# Score: never over its own card; then stay close to it (gap to the card x 40); covering
# neighbouring cards only breaks ties between the spots next to it.
_b3("let sc=others.reduce((s,r)=>s+ov(a,r),0)+ov(a,R)*3+",
    "const gx=Math.max(0,a.l-R.right,R.left-a.r),gy=Math.max(0,a.t-R.bottom,R.top-a.b);"
    "let sc=others.reduce((s,r)=>s+ov(a,r),0)*.05+(ov(a,R)>0?1e9:0)+Math.hypot(gx,gy)*40+")

_b3('.dft{position:absolute;inset:0;display:flex;',
    # only one hover pop-up: the old library tooltip is retired
    '#tip{display:none!important}'
    # nothing hovers while a card is being inspected
    'body.inspecting #kdock{display:none!important}'
    # inspector layout: the zoomed card with its info panel to the right
    '#insp .irow{display:flex;align-items:center;justify-content:center;gap:28px;max-width:96vw}'
    '#insp .iinfo{width:min(300px,30vw);max-height:80vh;overflow:hidden;background:linear-gradient(#ebdfc2,#ddd0af);color:#1b1710;'
    'border:10px solid #5e4520;border-image:url(art/game/frames/c.jpg) 58 round;border-radius:6px;padding:10px 12px;'
    'font:14px/1.4 var(--fb);box-shadow:0 10px 40px #000c;text-align:left}'
    '#insp .iinfo p{margin:0 0 6px}#insp .iinfo p:last-child{margin:0}'
    'html.ph #insp .irow{gap:12px}html.ph #insp .iinfo{font-size:11px;width:min(220px,38vw);padding:6px 8px;border-width:6px}'
    '.dft{position:absolute;inset:0;display:flex;')
