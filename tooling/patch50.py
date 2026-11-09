# v107 (patch50): the art tells the story.
# 1. Holding a card to inspect it also shows its myth: the scene the art was painted from
#    (art/game/cards.json "myth", made by make_game_assets.py from art/subjects.json).
# 2. Boss and elite entrance: when Odysseus meets a boss or elite, their painting fills the screen
#    for a moment with a line after Homer, then fades (click to skip). Only for opponents with art.
import json as _json3
_MYTH = _json3.load(open(S + '../art/game/cards.json', encoding='utf-8')).get('myth', {})

_SPLASH = {
    'Hector, Tamer of Horses': ('hector', 'Hector of the shining helm, tamer of horses, stands before the gates of Troy.', 'after Homer, the Iliad'),
    'Scylla': ('scyl', 'Six heads she has, each with a triple row of teeth, and no ship sails past her unharmed.', 'after Homer, the Odyssey'),
    'Charybdis': ('chary', 'Three times a day she spews the dark water up, and three times she swallows it down.', 'after Homer, the Odyssey'),
    'Circe, Witch of Aeaea': ('circe', 'On Aeaea the goddess sings at her loom, and the beasts at her door were once men.', 'after Homer, the Odyssey'),
    'Cattle of the Sun': ('sacril', 'Touch not the cattle of the Sun, for Helios sees all things and hears all things.', 'after Homer, the Odyssey'),
}

_JS49 = (
    'const MYTH=' + _json3.dumps(_MYTH, ensure_ascii=False, separators=(',', ':')) + ';'
    'const BSPL=' + _json3.dumps(_SPLASH, ensure_ascii=False, separators=(',', ':')) + ';'
    "function bossSplash(){try{if(typeof CH=='undefined'||CH!='ody'||!G||!G.e||!(G.boss||G.elt))return;const s=BSPL[G.e.nm];"
    "if(!s||typeof ARTF=='undefined'||!ARTF[s[0]])return;const o=document.createElement('div');o.id='bsplash';"
    "o.style.setProperty('--bart','url(art/odysseus/'+s[0]+'.webp)');"
    "o.innerHTML='<small>'+(G.boss?'Guardian':'Elite')+'</small><h2>'+G.e.nm+'</h2><p>'+s[1]+'</p><small class=\"src\">'+s[2]+'</small>';"
    "document.body.appendChild(o);requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')));"
    "let gone=false;const end=()=>{if(gone)return;gone=true;o.classList.remove('on');setTimeout(()=>o.remove(),550)};"
    "o.addEventListener('click',end);setTimeout(end,3200)}catch(e){}}"
    "{const _f=fight;fight=function(){const r=_f.apply(this,arguments);bossSplash();return r}}"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS49 + "fit();try{addEventListener('resize',fit)}catch(e){}")

_b3('.dft{position:absolute;inset:0;display:flex;',
    '#insp.on{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}'
    '#insp .myth{max-width:min(560px,86vw);font:italic 17px/1.45 var(--fb);color:#efe6cf;text-align:center;text-shadow:0 2px 8px #000}'
    '#bsplash{position:fixed;inset:0;z-index:600;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:12px;'
    'padding:0 6vw 12vh;box-sizing:border-box;background:linear-gradient(#0000 35%,#000d 85%),var(--bart) center 35%/cover no-repeat,#000;'
    'opacity:0;transition:opacity .5s;cursor:pointer;text-align:center}'
    '#bsplash.on{opacity:1}'
    '#bsplash h2{margin:0;font:400 clamp(30px,6vw,68px)/1 var(--fd);color:var(--gold);text-shadow:0 0 30px #000,0 3px 0 #000}'
    '#bsplash p{margin:0;font:italic clamp(16px,2.1vw,24px)/1.4 var(--fb);color:#f3ead0;max-width:min(680px,88vw);text-shadow:0 2px 10px #000}'
    '#bsplash small{font:12px var(--fb);letter-spacing:.16em;text-transform:uppercase;color:#e0c890;text-shadow:0 1px 4px #000}'
    '#bsplash small.src{letter-spacing:.06em;text-transform:none;font-style:italic;opacity:.8}'
    '.dft{position:absolute;inset:0;display:flex;')
