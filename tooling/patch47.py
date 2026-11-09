# v104: painted interface icons (Odysseus runs) and the painted card back (all heroes).
#
# Icons: rather than editing the ~30 templates that print emoji, a small routine swaps known emoji
# for painted icons in any text the game puts on screen (a MutationObserver runs it after every
# redraw). It runs only while Odysseus is the hero: other heroes get icons in their own myth's style
# later. Card-art emoji (inside .ar), the graveyard's top-card emoji (.gyc) and the hero-select
# fallbacks (.hem) are left alone. Each icon retries once and falls back to its emoji if it can't load.
# Map node icons (.mi) use the opponent medallions where an emoji is shared (💀 Shades, ⛵ Phaeacians,
# 🌀 Charybdis); elsewhere those emoji mean Offering, "you are here" and the whirlpool countdown.
#
# Card back: the deck piles and the opponent's hand show the painted back with the chosen sigil
# (art/game/back/back.jpg + sigil.png; pick the sigil with make_game_assets.py --sigil NAME).

_ICM = {'❤': 'life', '◆': 'mana', '⚡': 'action', '🏆': 'victory', '⚔': 'attack', '🛡': 'defense',
        '⇄': 'switch', '★': 'upgrade', '✖': 'cleared', '✓': 'chosen', '☰': 'menu', '☀': 'sacrilege',
        '🔮': 'foretold', '💰': 'gold', '🎁': 'gift', '⚓': 'start', '🔥': 'camp', '🔨': 'craft',
        '🏛': 'altar', '🔱': 'greataltar', '🌀': 'whirlpool', '⛵': 'here', '💀': 'offering',
        '🪷': 'med_lotus', '🧜': 'med_sirens', '👁': 'med_poly', '🪓': 'med_cicones', '🐖': 'med_circe',
        '🐂': 'med_cattle', '🐴': 'med_hector', '🦑': 'med_scylla'}
_ICMI = {'💀': 'med_shades', '⛵': 'med_phaeacians', '🌀': 'med_charybdis'}
import json as _json2

_JS = ('const ICM=' + _json2.dumps(_ICM, ensure_ascii=False) + ',ICMI=' + _json2.dumps(_ICMI, ensure_ascii=False) + ';'
       "const ICK=Object.keys(ICM).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')).join('|'),"
       "ICT=new RegExp('(?:'+ICK+')','u'),ICG=new RegExp('('+ICK+')\\uFE0F?','gu'),ICF=new Set();"
       "function icz(root){try{const R=document.documentElement;if(typeof CH=='undefined'||CH!='ody'){R.classList.remove('ody-ic');return}R.classList.add('ody-ic');"
       "if(!root||!root.nodeType)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;"
       "if(!p||p.closest('.ar,.gyc,.hem,script,style,textarea,.noic'))return NodeFilter.FILTER_REJECT;return ICT.test(n.data)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}}),L=[];"
       "while(w.nextNode())L.push(w.currentNode);"
       "for(const n of L){const mi=!!n.parentElement.closest('.mi'),f=document.createDocumentFragment();let last=0;"
       "n.data.replace(ICG,(m,k,off)=>{f.append(n.data.slice(last,off));const nm=(mi&&ICMI[k])||ICM[k];if(ICF.has(nm)){const sp=document.createElement('span');sp.className='noic';sp.textContent=m;f.append(sp);last=off+m.length;return m}const im=document.createElement('img');"
       "im.className='ico'+(nm.startsWith('med_')?' med':'');im.src='art/game/icons/'+nm+'.png';im.alt=m;im.draggable=false;"
       "im.onerror=function(){if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else{ICF.add(nm);const sp=document.createElement('span');sp.className='noic';sp.textContent=m;this.replaceWith(sp)}};f.append(im);last=off+m.length;return m});"
       "f.append(n.data.slice(last));n.replaceWith(f)}}catch(e){}}")

_b3("fit();try{addEventListener('resize',fit)}catch(e){}",
    _JS + "fit();try{addEventListener('resize',fit)}catch(e){}"
    "try{icz(document.body);new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){"
    "if(n.nodeType==1)icz(n);else if(n.nodeType==3&&n.parentElement)icz(n.parentElement)}}).observe(document.body,{childList:true,subtree:true})}catch(e){}")

_ICSS = (
    '.ico{height:1.2em;width:auto;vertical-align:-.25em;display:inline-block;-webkit-user-drag:none;pointer-events:none}'
    '.ico.med{height:1.9em;vertical-align:middle;border-radius:50%}'
    '.mi .ico{height:1.45em}.mi .ico.med{height:2.1em}'
    'html.ody-ic .cd.qry::after{content:"";width:1.4em;height:1.4em;background:url(art/game/icons/target.png) center/contain no-repeat}'
    # painted card back with the chosen sigil (the graveyard pile shares .cb but shows its top card)
    '.cb:not(.gy){background:url(art/game/back/back.jpg) center/100% 100% no-repeat,radial-gradient(circle,#8a3d1a,#4a1c0c 75%);border-width:1px}'
    '.cb:not(.gy)::before{display:none}'
    '.cb:not(.gy)::after{content:"";position:absolute;inset:33.5% 28% 37.5%;background:url(art/game/back/sigil.png) center/contain no-repeat}'
)
_b3('.dft{position:absolute;inset:0;display:flex;', _ICSS + '.dft{position:absolute;inset:0;display:flex;')
