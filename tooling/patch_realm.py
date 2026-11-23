# patch_realm: icons, map and screens follow the realm you are in, and Act III gets its own art.
# 1. The emoji-to-icon swap picked its icon set by hero (ICH[CH]), so in Act II (another hero's realm) and Act III every
#    map node, guardian and intro showed raw emoji, and the map was the hero's. RLM() names the current realm:
#    'act3' in Act III, else the Act II realm (G.a2), else the hero. ICSET() builds the set for that realm: the hero's
#    own interface icons (life, mana, buttons...) plus the realm's opponent medallions. Where a medallion's emoji is
#    also one of the hero's interface icons (Mammon's 💰 is gold, the Watchers' 👁 is Odin's start), the medallion is
#    used only where a fight is named: map nodes, the guardian pick and the intro screen.
# 2. The guardian pick and the intro screen count as "named" places too, so Charybdis shows her medallion there
#    (not the small whirlpool icon), as Hector already did.
# 3. <html data-realm> carries the realm; the map painting follows it (Act III has its own map).
# 4. Story screens follow the realm too: Act III has its own general pick, altar and reward draft, and the
#    "other fronts" interlude gets a painting. Screens Act III doesn't have fall back to the Act II realm's.
# 5. Act III medallions (art/game/icons/act3/med_*.png). Ahriman and the Sons of Darkness both used 🌑, so Ahriman
#    now uses 🐍 (the serpents from his shoulders).
# 6. The final victory gets its own ending: the Act III victory painting and a large panel in the Act III Legendary
#    frame, instead of the small panel used for the Act I and II wins.
import json as _jr

_ICMX = {'👥': 'med_legion', '👁': 'med_watchers', '🗿': 'med_nephilim', '🗡': 'med_baal', '🗼': 'med_babel',
         '🌠': 'med_pairikas', '🌑': 'med_sons', '💰': 'med_mammon', '⚖': 'med_mastema', '🎺': 'med_paimon',
         '🪰': 'med_beelzebub', '🐐': 'med_azazel', '💔': 'med_asmodeus', '🌙': 'med_lilith',
         '🌟': 'med_lucifer', '🐍': 'med_ahriman', '🕳': 'med_abaddon', '🐉': 'med_beast'}
_J = lambda o: _jr.dumps(o, ensure_ascii=False, separators=(',', ':'))

# 5. Ahriman's emoji
_b3("{n:'Ahriman, the Smiling Stranger',n2:'Ahriman, the Destructive Spirit',ic:'🌑'",
    "{n:'Ahriman, the Smiling Stranger',n2:'Ahriman, the Destructive Spirit',ic:'🐍'")

# 1. realm-aware icon sets
_b3("ICMT=", 'ICMX=' + _J(_ICMX) + ',ICMT=')
_b3("...Object.keys(ICMT)])]", "...Object.keys(ICMT),...Object.keys(ICMX)])]")
_b3("const HI=(typeof CH!='undefined')&&ICH[CH];", "const HI=ICSET();")
_b3("function icz(",
    "function RLM(){try{return G&&G.a3?'act3':((G&&(G.a2||G.ch))||(typeof CH!='undefined'?CH:'ody'))}catch(e){return 'ody'}}"
    "const ICSC={};"
    "function ICSET(){const h=typeof CH!='undefined'&&CH,B=h&&ICH[h];if(!B)return null;const r=RLM();"
    "if(r===h||!(ICH[r]||r==='act3'))return B;const key=h+'>'+r;if(ICSC[key])return ICSC[key];"
    "const RS=r==='act3'?{d:'act3/',m:ICMX,mi:{}}:ICH[r],m={},mi={};"
    "for(const[k,v]of Object.entries(B.m))m[k]=B.d+v;for(const[k,v]of Object.entries(B.mi||{}))mi[k]=B.d+v;"
    # the realm's medallions: everywhere, unless the emoji is one of the hero's interface icons (then named places only)
    "for(const[k,v]of Object.entries(RS.m)){if(!v.startsWith('med_'))continue;if(m[k]&&!m[k].includes('med_'))mi[k]=RS.d+v;else{m[k]=RS.d+v;delete mi[k]}}"
    "for(const[k,v]of Object.entries(RS.mi||{}))mi[k]=RS.d+v;"
    "return ICSC[key]={d:'',m,mi}}"
    "function icz(")
# 2. named places: map nodes (as before), the guardian pick and the intro screen
_b3("mi=!!n.parentElement.closest('.mi')&&!n.parentElement.closest('.wn.loc'),",
    "mi=!!n.parentElement.closest('.mi,.bsc .ic,.fxin-ic')&&!n.parentElement.closest('.wn.loc'),")

# 3. data-realm
_b3("if(typeof CH!='undefined'&&R.dataset.hero!==CH)R.dataset.hero=CH;",
    "if(typeof CH!='undefined'&&R.dataset.hero!==CH)R.dataset.hero=CH;try{const rr=RLM();if(R.dataset.realm!==rr)R.dataset.realm=rr}catch(e){}")

# 4. story screens by realm, with the Act II realm as fallback; the Act III interlude
_b3("const ph=G.phase,rl=(G&&(G.a2||G.ch))||'ody';", "const ph=G.phase,rl=RLM(),rl2=(G&&(G.a2||G.ch))||'ody';")
_b3("id=(SCR[rl]||{})[k];if(id)u='scenes/'+id+'.jpg'}", "id=(SCR[rl]||{})[k]||(SCR[rl2]||{})[k];if(id)u='scenes/'+id+'.jpg'}")
_b3("else if(ph=='remove'||ph=='hub'){const nd=G.web&&G.web.nodes&&G.web.nodes[G.pos];if(nd)u=(LOCUI[rl]||{})[nd.t]||''}",
    "else if(ph=='a3front'){const id=(SCR.act3||{}).a3front;if(id)u='scenes/'+id+'.jpg'}"
    "else if(ph=='remove'||ph=='hub'){const nd=G.web&&G.web.nodes&&G.web.nodes[G.pos];if(nd)u=(LOCUI[rl]||LOCUI[rl2]||{})[nd.t]||''}")

# 6. the final ending: Act III's final-victory panel gets a class (for its own painting and frame) and a new heading
_b3("const box=o.querySelector('.box');if(!box)return;\n if(G.a3&&G.fin)box.innerHTML='<div style=\"font-size:54px\">🏆</div><div class=\"t\">VICTORY</div>",
    "const box=o.querySelector('.box');if(!box)return;o.classList.toggle('final',!!(G.a3&&G.fin));\n if(G.a3&&G.fin)box.innerHTML='<div class=\"fin-k\">The War in Heaven</div><div class=\"t\">The Dragon Is Bound</div>")

_MAPS = {'ody': 'icons/ui_map.jpg', 'odin': 'icons/odin/ui_map.jpg', 'wukong': 'icons/wukong/ui_map.jpg',
         'thoth': 'icons/thoth/ui_map.jpg', 'act3': 'icons/act3/ui_map.jpg'}
_css = ''.join(f'html[data-realm="{r}"][data-hero] .tmap{{background:url(art/game/{p}) center/cover no-repeat!important}}'
               for r, p in _MAPS.items())
_css += ('html[data-realm="act3"] .dft .ovt,html[data-realm="act3"] .dft .dsub{text-shadow:0 1px 3px #000,0 0 12px #000}'
         'html[data-hero] #vico.final{background:linear-gradient(#0000 35%,#000a),url(art/game/scenes/s_a3_victory.jpg) center/cover no-repeat!important}'
         'html[data-hero] #vico.final .box{max-width:min(760px,94vw)!important;padding:30px 42px!important;gap:16px!important;'
         'background:radial-gradient(ellipse at 50% 35%,#efe2c0,#d9c596 70%,#b89c66)!important;color:#1d150b!important;'
         'border-style:solid!important;border-color:#5e4520!important;border-width:34px 24px 28px!important;border-image:url(art/game/frames/xl.jpg) 112 52 64 round!important;'
         'box-shadow:0 0 0 2px #e8c35a66,0 20px 80px #000,0 0 120px #ffd45a55!important}'
         '#vico.final .fin-k{font:700 15px var(--fd);letter-spacing:.28em;text-transform:uppercase;color:#7a2a12}'
         '#vico.final .box .t{font:700 clamp(30px,5vw,48px)/1.05 var(--fd)!important;letter-spacing:.06em;color:#5a2a0a!important;text-shadow:0 2px 0 #f6e7b8}')
_b3('.dft{position:absolute;inset:0;display:flex;', _css + '.dft{position:absolute;inset:0;display:flex;')
