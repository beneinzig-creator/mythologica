# v109 (patch52): finishing the look (Ben's list).
# 1. Card-back sigil per hero: Odysseus's runs (his cards and his opponents') show the Greek black
#    ship (art/game/back/sigil_ody.png). Other heroes show a plain back until they get their own,
#    since each sigil belongs to one mythology only. <html data-hero> carries the current hero.
# 2. Archetype marks at the right end of the type line, printed in worn ink and blended with the
#    parchment (multiply), so each card's own wear shows through.
# 3. Legendary shimmer: a slow gleam across the frame (off with prefers-reduced-motion).
# 4. Text fit: name, type line and rules shrink until they fit their space.
# 5. Painted screens for Odysseus runs: sea-chart map, victory (Ithaca at dawn), defeat (shipwreck),
#    and the campfire, crafting table and altar.
# 6. Every button is a weathered bronze plate (border-image keeps the riveted ends undistorted).
_AMK = 'PROZSKFME'  # archetypes that have a mark (art/icons/odysseus/arch_*.png)

_b3("""<div class="ty">${LORE[c.id]||TY[d[2]]}${c.def?' · Defense form':''}</div>""",
    """<div class="ty${ARTF[c.id]&&AMK.includes(TAG[c.id]||'#')?' hm':''}">${LORE[c.id]||TY[d[2]]}${c.def?' · Defense form':''}"""
    """${ARTF[c.id]&&AMK.includes(TAG[c.id]||'#')?`<i class="am" style="--am:url(art/game/icons/arch_${TAG[c.id]}.png)"></i>`:''}</div>""")

_b3("""<div class="dft"><div class="ovt" style="font-size:28px">${ttl}</div>""",
    """<div class="dft locscr loc-${t}"><div class="ovt locttl" style="font-size:28px">${ttl}</div>""")

_PLATE = "url(art/game/icons/ui_button.png) 40 120 fill / 9px 26px stretch"
_CSS52 = (
    # 1. hero sigils
    '.cb:not(.gy)::after{background-image:none}'
    'html[data-hero="ody"] .cb:not(.gy)::after{background-image:url(art/game/back/sigil_ody.png)}'
    # 2. archetype marks
    '.cd.af>.ty.hm{padding-right:calc(.55em + 12%)}'
    '.cd.af>.ty .am{position:absolute;right:3.5%;top:50%;transform:translateY(-50%);height:100%;aspect-ratio:1;'
    'background:var(--am) center/contain no-repeat;mix-blend-mode:multiply;opacity:.95;pointer-events:none}'
    # 3. legendary shimmer
    '.cd.af-l,.cd.af-ls{background:linear-gradient(110deg,#0000 38%,#fff3c450 47%,#ffffff70 50%,#fff3c450 53%,#0000 62%) 130% 0/260% 100% no-repeat,'
    'var(--fr) 0 0/100% 100% no-repeat,var(--f);animation:lshine 5.5s ease-in-out infinite}'
    '@keyframes lshine{0%{background-position:130% 0,0 0}55%,100%{background-position:-30% 0,0 0}}'
    '@media (prefers-reduced-motion:reduce){.cd.af-l,.cd.af-ls{animation:none}}'
    # 5. painted screens (Odysseus)
    'html[data-hero="ody"] .tmap{background:url(art/game/icons/ui_map.jpg) center/cover no-repeat!important;color:#3b2a14}'
    'html[data-hero="ody"] .tmap:before{opacity:.18}'
    'html[data-hero="ody"] .tmap .wn .mi:has(.ico:not(.med)){background:radial-gradient(circle at 40% 32%,#f3e7c8,#d8c395 62%,#a98f5d)!important;'
    'border:2px solid #4e3a1a!important;border-radius:50%!important;box-shadow:inset 0 0 0 2px #c9a24c,inset 0 -2px 4px #0004,0 3px 7px #000a!important}'
    '.tmap .wn .tipx{background:linear-gradient(#ebdfc2,#ddd0af)!important;color:#1b1710!important;border:10px solid #5e4520!important;'
    'border-image:url(art/game/frames/c.jpg) 58 round!important;border-radius:6px;box-shadow:0 10px 26px #000d!important;font-family:var(--fb)!important;text-shadow:none!important}'
    'html[data-hero="ody"] #vico{background:linear-gradient(#0000 40%,#000b),url(art/game/icons/ui_victory.jpg) center/cover no-repeat}'
    'html[data-hero="ody"] #fxlost{background:linear-gradient(#0003 30%,#000c),url(art/game/icons/ui_defeat.jpg) center/cover no-repeat}'
    '#vico .box,.dft.locscr .hub{position:relative}'
    'html[data-hero="ody"] #vico .box{background:linear-gradient(#ebdfc2,#ddd0af);color:#1b1710;border:14px solid #5e4520;'
    'border-image:url(art/game/frames/c.jpg) 58 round;border-radius:8px;box-shadow:0 14px 50px #000e}'
    'html[data-hero="ody"] #mnuo .box{background:linear-gradient(#ebdfc2,#ddd0af)!important;color:#1b1710!important;border:14px solid #5e4520!important;'
    'border-image:url(art/game/frames/c.jpg) 58 round!important;border-radius:8px;box-shadow:0 14px 50px #000e!important}'
    'html[data-hero="ody"] #mnuo .box .t{color:#5a3d12!important}'
    'html[data-hero="ody"] #mnuo textarea{background:#f4ecd6;color:#1b1710;border:1px solid #8a6a32}'
    'html[data-hero="ody"] #vico .box .t{color:#5a3d12}'
    'html[data-hero="ody"] .dft.locscr{background:linear-gradient(#0b182055,#0b1820e0 80%),var(--locbg) center/cover no-repeat}'
    'html[data-hero="ody"] .dft.loc-camp{--locbg:url(art/game/icons/ui_camp.jpg)}'
    'html[data-hero="ody"] .dft.loc-craft{--locbg:url(art/game/icons/ui_craft.jpg)}'
    'html[data-hero="ody"] .dft.loc-altar{--locbg:url(art/game/icons/ui_altar.jpg)}'
    '.locttl{display:flex;flex-direction:column;align-items:center;gap:6px;text-shadow:0 2px 10px #000}'
    '.locttl .ico{height:2.6em;filter:drop-shadow(0 4px 10px #000c)}'
    # 6. bronze plate buttons
    '.b{border-style:solid;border-color:transparent;border-image:' + _PLATE + ';border-width:9px 26px;border-radius:0;'
    'background:none!important;color:#f3e6c4!important;box-shadow:none!important;font-family:var(--fd);letter-spacing:.04em;'
    'text-shadow:0 1px 0 #000,0 0 8px #000c;padding:2px 6px;filter:drop-shadow(0 3px 5px #000b);transition:filter .15s,transform .1s}'
    '.b:hover{filter:drop-shadow(0 3px 6px #000c) brightness(1.18)}'
    '.b:active{transform:translateY(1px)}'
    '.b[disabled]{filter:grayscale(.85) brightness(.65);opacity:.75}'
    '.b.gh,.b[style*="#555"]{filter:drop-shadow(0 2px 4px #000a) saturate(.55) brightness(.82);color:#e6d8b4!important}'
    '.b.gh:hover,.b[style*="#555"]:hover{filter:drop-shadow(0 2px 4px #000a) saturate(.7) brightness(1)}'
    '.b.hgo{border-width:11px 32px;padding:4px 14px}'
    # mana orb and the round menu / sound buttons as parchment-and-bronze medallions
    '.orb{background:radial-gradient(circle at 42% 34%,#f4ebd3,#dccba4 62%,#b29b6c)!important;color:#1b1710!important;border:2px solid #3b2c14!important;'
    'box-shadow:inset 0 0 0 3px #c9a24c,inset 0 -3px 6px #0005,0 3px 10px #000c!important;text-shadow:none!important;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0}'
    '.orb .ico{height:32%;vertical-align:0}.orb .dg{height:42%}'
    '#mnub,#sndb{background:radial-gradient(circle at 42% 34%,#f4ebd3,#dccba4 62%,#b29b6c)!important;color:#2a1d0c!important;border:1.5px solid #3b2c14!important;'
    'box-shadow:inset 0 0 0 2px #c9a24c,inset 0 -2px 4px #0005,0 2px 7px #000c!important}'
    '#mnub .ico{height:1.15em}'
    'html[data-hero="ody"] #vico .fxlaurel{display:none}'
    '.ovt.ovb{padding:0 104px;font-size:clamp(15px,1.9vw,24px)!important;line-height:1.2;text-align:center}'
    'html[data-hero="ody"] #fxlost .fxtab-h{background:linear-gradient(#e6d9b8d0,#cdbb90e0),url(art/game/frames/c.jpg) center/cover!important;'
    'border:2px solid #3b2c14!important;box-shadow:inset 0 0 0 3px #8a6a32,inset 0 0 26px #5a3d1280,0 12px 30px #000d!important}'
    'html[data-hero="ody"] #fxlost .fxtab-h span{color:#3a2410!important;text-shadow:0 1px 0 #f3e6c480!important}'
    'html[data-hero="ody"] #vico .box .ico{height:3.4em;filter:drop-shadow(0 3px 6px #0006)}'
    '.b.gh{border-style:solid!important;border-color:transparent!important;border-image:' + _PLATE + '!important;border-width:7px 20px!important;padding:1px 4px!important;font-family:var(--fb)!important}'
)
_b3('.dft{position:absolute;inset:0;display:flex;', _CSS52 + '.dft{position:absolute;inset:0;display:flex;')

_JS52 = (
    "const AMK='" + _AMK + "';"
    "(function(){try{const R=document.documentElement;"
    "const hero=()=>{const h=(typeof CH!='undefined'&&CH)||'';if(R.dataset.hero!==h)R.dataset.hero=h};"
    # 4. text fit: shrink a card's name / type line / rules until they fit
    "const fitCard=cd=>{if(!cd.classList.contains('af')||!cd.offsetWidth)return;"
    "for(const el of cd.querySelectorAll(':scope>.tx,:scope>.ty,:scope>.nm b')){el.style.fontSize='';"
    "let fs=parseFloat(getComputedStyle(el).fontSize),min=fs*.55,i=0;"
    "const over=()=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;"
    "while(over()&&fs>min&&i<16){fs*=.93;el.style.fontSize=fs+'px';i++}}};"
    "const run=root=>{hero();if(!root||!root.querySelectorAll)return;"
    "const cds=root.classList&&root.classList.contains('cd')?[root]:root.querySelectorAll('.cd.af');cds.forEach(fitCard)};"
    "window.fitCards=()=>run(document.body);"
    "new MutationObserver(ms=>{hero();const seen=new Set();for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!=1)continue;"
    "const c=n.closest&&n.closest('.cd');if(c){if(!seen.has(c)){seen.add(c);fitCard(c)}}else run(n)}}).observe(document.body,{childList:true,subtree:true});"
    "hero();run(document.body);addEventListener('resize',()=>setTimeout(()=>run(document.body),60))"
    "}catch(e){}})();"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS52 + "fit();try{addEventListener('resize',fit)}catch(e){}")
