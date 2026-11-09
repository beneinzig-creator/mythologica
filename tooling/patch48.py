# v105: cleaner battlefield (Ben's notes).
# 1. No "Attack / Defense / Tapped" row labels: stance shows in each card's height on the table,
#    the stance badge and the turned (tapped) card.
# 2. Stance switch is a small round badge just below the card (swords = attack, shield = defense)
#    instead of a pill on top of it, so it never covers this card or the opposing cards' power and health.
# 3. Hover pop-ups restyled as parchment with a bronze double rule, like the cards' text boxes.
# 4. Press and hold any card on the table or in your hand to inspect it up close; let go to close.
#    A long press doesn't also count as a click.

_b3('''<b class="sb${c.def?' d':''}${G.atkd?' lk':''}" data-z="s:${c.u}">⇄ ${c.def?'🛡️':'⚔️'} ${c.def?'Defense form':'Attack form'}</b>''',
    '''<b class="sb${c.def?' d':''}${G.atkd?' lk':''}" data-z="s:${c.u}" title="${c.def?'Defense form':'Attack form'}${G.atkd?'':' (click to switch)'}" aria-label="${c.def?'Defense form':'Attack form'}">${c.def?'🛡️':'⚔️'}</b>''')

_CSS48 = (
    # 1. row labels and guide lines
    '.lnw{display:none!important}'
    # 2. stance badge below the card
    '.fld .cd>.sb{top:auto!important;bottom:-17px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;'
    'width:26px;height:26px;padding:0!important;border-radius:50%;display:grid;place-items:center;font-size:13px;line-height:1;'
    'background:radial-gradient(circle at 50% 35%,#3a2c18,#14100a);border:1.5px solid #c9a24c;color:#f3ead0;box-shadow:0 2px 6px #000b;cursor:pointer;z-index:3}'
    '.fld .cd>.sb.d{border-color:#8fb3dc;box-shadow:0 2px 6px #000b,0 0 8px #4d8fd866}'
    '.fld .cd>.sb:hover{filter:brightness(1.25)}.fld .cd>.sb.lk{opacity:.55;cursor:default;filter:none}'
    '.fld .cd>.sb .ico{height:17px;vertical-align:0}'
    '.fld .cd.tap>.sb,.fld .cd.tap:hover>.sb{top:auto!important;bottom:-17px!important;left:50%!important;transform:translateX(-50%) rotate(-90deg)!important}'
    # 3. parchment pop-ups
    # Pop-ups look like the cards: the frame's own weathered bronze edge (border-image cut from the
    # Common frame), the cards' parchment and the cards' text font (IM Fell English).
    '.tip,#tip,.wn .tipx,#kdock{background:linear-gradient(#ebdfc2,#ddd0af);color:#1b1710;border:10px solid #5e4520;'
    'border-image:url(art/game/frames/c.jpg) 58 round;border-radius:6px;box-shadow:0 10px 26px #000d;'
    'font-family:var(--fb);text-shadow:none;padding:5px 9px;line-height:1.35}'
    '.cd .fxp{display:none!important}'
    '#kdock{position:fixed;left:0;top:0;z-index:510;width:190px;font-size:11.5px;pointer-events:none;display:none;visibility:hidden}'
    '#kdock.on{display:block}#kdock.vis{visibility:visible}#kdock p{margin:0 0 4px}#kdock p:last-child{margin:0}'
    'html.ph #kdock{width:180px;font-size:11px}'
    '.wn .tipx{font-size:12.5px}'
    # 4. inspect overlay
    '#insp{position:fixed;inset:0;z-index:500;display:none;place-items:center;background:#000b;pointer-events:none}'
    '#insp.on{display:grid;animation:hfade .15s ease-out}'
    '#insp .cd{zoom:var(--iz,3);margin:0!important;transform:none!important;rotate:0deg!important;scale:1!important;translate:none!important;top:0!important;box-shadow:0 10px 40px #000}'
    '#insp .cd .fxp,#insp .cd .sb,#insp .cd .rr{display:none!important}'
    '.fld .cd,.hand .cd{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'
)
_b3('.dft{position:absolute;inset:0;display:flex;', _CSS48 + '.dft{position:absolute;inset:0;display:flex;')

_JS48 = (
    "(function(){try{let tm=0,sx=0,sy=0,shown=false;const ov=document.createElement('div');ov.id='insp';document.body.appendChild(ov);"
    "const find=t=>{const cd=t&&t.closest&&t.closest('.fld .cd,.hand .cd');if(!cd||typeof G=='undefined'||!G)return null;const u=+((cd.getAttribute('data-z')||'').split(':')[1]);"
    "if(!u)return null;const all=[...(G.p?[...G.p.bf,...G.p.hand]:[]),...(G.e?G.e.bf:[])];return all.find(c=>c.u===u)||null};"
    "const show=c=>{const my=(typeof MYTH!='undefined'&&MYTH[c.id])||'';ov.style.setProperty('--iz',Math.max(2,Math.min(4.5,(my?.66:.82)*innerHeight/146,.8*innerWidth/104)).toFixed(2));ov.innerHTML=card(c,'v:'+c.u)+(my?'<div class=\"myth\">'+my+'</div>':'');ov.classList.add('on');shown=true};"
    "const hide=()=>{clearTimeout(tm);tm=0;if(shown){ov.classList.remove('on');ov.innerHTML=''}};"
    "addEventListener('pointerdown',e=>{if(e.button>0)return;const c=find(e.target);if(!c)return;sx=e.clientX;sy=e.clientY;shown=false;clearTimeout(tm);tm=setTimeout(()=>show(c),380)},true);"
    "addEventListener('pointermove',e=>{if(!shown&&tm&&Math.hypot(e.clientX-sx,e.clientY-sy)>10){clearTimeout(tm);tm=0}},true);"
    "const end=()=>{const was=shown;hide();shown=false;if(was){const kill=ev=>{ev.stopPropagation();ev.preventDefault()};"
    "addEventListener('click',kill,true);setTimeout(()=>removeEventListener('click',kill,true),350)}};"
    "['pointerup','pointercancel'].forEach(n=>addEventListener(n,end,true));addEventListener('blur',end);"
    "addEventListener('contextmenu',e=>{if(shown||tm)e.preventDefault()},true)}catch(e){}})();"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS48 + "fit();try{addEventListener('resize',fit)}catch(e){}")

# 5. Turn messages and the log move out of the middle of the battlefield to a small panel at the
#    top right (left of the menu button), next to the opponent's hand. A thin spacer keeps the armies apart.
_b3("""<div class="board"><div class="fld fe">${fld(e,'e')}</div><div class="mid">${G.msg||''}<small>${G.log.join(' · ')}</small></div><div class="fld fp">${mine}</div></div>""",
    """<div class="board"><div class="fld fe">${fld(e,'e')}</div><div class="mgap"></div><div class="fld fp">${mine}</div></div><div class="mid">${G.msg||''}<small>${G.log.join(' · ')}</small></div>""")
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.mgap{height:10px}'
    '#app>.mid{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));right:calc(54px + env(safe-area-inset-right,0px));z-index:20;'
    'width:min(300px,26vw);text-align:right;padding:6px 10px;border-right:2px solid #c9a24c;background:linear-gradient(270deg,#0b1820e6,#0b182000);'
    'font-size:12px;line-height:1.35;zoom:1}'
    '#app>.mid::before,#app>.mid::after{display:none}'
    '#app>.mid small{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-top:3px;font-size:10.5px;opacity:.7}'
    'html.ph #app>.mid{width:min(240px,34vw);font-size:10px;right:calc(46px + env(safe-area-inset-right,0px))}'
    '.dft{position:absolute;inset:0;display:flex;')

# Card pop-up next to the hovered (or held) card, on the side that covers the fewest other cards
# (right, left, above or below), kept on screen.
_JS48b = (
    "(function(){try{const dk=document.createElement('div');dk.id='kdock';document.body.appendChild(dk);let cur=null,tm=0;"
    "const ov=(a,b)=>Math.max(0,Math.min(a.r,b.right)-Math.max(a.l,b.left))*Math.max(0,Math.min(a.b,b.bottom)-Math.max(a.t,b.top));"
    "const place=()=>{if(!cur||!document.body.contains(cur)){hide();return}const R=cur.getBoundingClientRect(),w=dk.offsetWidth,h=dk.offsetHeight,g=10,W=innerWidth,H=innerHeight,m=8;"
    "const others=[...document.querySelectorAll('.cd')].filter(c=>c!==cur&&!c.closest('#insp')).map(c=>c.getBoundingClientRect()).filter(r=>r.width);"
    "const cx=(R.left+R.right)/2,cy=(R.top+R.bottom)/2;const cand=[[R.right+g,cy-h/2],[R.left-g-w,cy-h/2],[cx-w/2,R.top-g-h],[cx-w/2,R.bottom+g]];"
    "let best=null;for(const [x0,y0] of cand){const x=Math.min(Math.max(m,x0),W-w-m),y=Math.min(Math.max(m,y0),H-h-m),a={l:x,t:y,r:x+w,b:y+h};"
    "let sc=others.reduce((s,r)=>s+ov(a,r),0)+ov(a,R)*3+(Math.abs(x-x0)+Math.abs(y-y0))*20;if(!best||sc<best[0])best=[sc,x,y]}"
    "dk.style.left=Math.round(best[1])+'px';dk.style.top=Math.round(best[2])+'px';dk.classList.add('vis')};"
    "const showFor=cd=>{const fx=cd&&cd.querySelector('.fxp');if(!fx||!fx.innerHTML.trim()){hide();return}cur=cd;dk.innerHTML=fx.innerHTML;"
    "dk.classList.remove('vis');dk.classList.add('on');clearTimeout(tm);tm=setTimeout(place,150)};"
    "const hide=()=>{cur=null;clearTimeout(tm);dk.classList.remove('on','vis')};"
    "addEventListener('pointerover',e=>{const cd=e.target.closest&&e.target.closest('.cd');if(cd&&!cd.closest('#insp')){if(cd!==cur)showFor(cd)}else hide()},true);"
    "addEventListener('pointerleave',hide);addEventListener('scroll',hide,true);"
    "new MutationObserver(()=>{if(cur&&!document.body.contains(cur))hide()}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true})"
    "}catch(e){}})();"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS48b + "fit();try{addEventListener('resize',fit)}catch(e){}")

# 6. Bigger power/health plaque on every army member with art, drawn over the painted one (it covers
#    the plaque position on all four frames), and a bold, legible serif for the numbers on cards.
_NUM = '"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif'
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.cd.af>.pt{left:70%!important;top:86.2%!important;width:27%!important;height:10%!important;'
    'background:linear-gradient(#f1e7cc,#d8c8a1);border:1.5px solid #3b2c14;border-radius:4px;'
    'box-shadow:inset 0 0 0 1px #c9a24c,inset 0 -1px 2px #0003,0 1px 3px #000a;'
    'font-family:' + _NUM + ';font-weight:700;font-size:1.5em;letter-spacing:.02em;font-variant-numeric:lining-nums tabular-nums;color:#1b1710;z-index:2}'
    '.cd.af .nm i,.cd .ob{font-family:' + _NUM + ';font-weight:700;font-variant-numeric:lining-nums tabular-nums}'
    '.cd.af .nm i{font-size:1.25em}'
    '.dft{position:absolute;inset:0;display:flex;')
