# v109 (patch53): painted backgrounds for the remaining non-fight screens, per realm (Odysseus's so
# far): the draft (start of run / spoils after a fight), the Altar to the One True God and the boss
# pick, from art/game/screens.json {realm hero: {screen: scene id}} (art/make_game_assets.py).
# The remove/duplicate/upgrade screen and the spoils hub, which open from a map location, show that
# location's painting from patch52 (art/game/icons/ui_<camp|craft|altar>.jpg) behind their dark veil,
# so they match the location screen itself. The realm is the current act's: G.a2 in Act 2, else the
# hero's own. Uses patch49's body::before layer (--scn / --scno): render() switches it off first,
# then scrBg() turns it on after the screen is drawn. Fight screens (patch49) and the screens patch52
# paints (hero select, map, camp, craft, altar, victory, defeat) are left alone.
import json as _json53
_SCR = _json53.load(open(S + '../art/game/screens.json', encoding='utf-8'))
_LOCUI = {'ody': {'camp': 'icons/ui_camp.jpg', 'craft': 'icons/ui_craft.jpg', 'altar': 'icons/ui_altar.jpg'}}

_b3('render0();fitHand();',
    'render0();try{scrBg()}catch(e){}fitHand();')

_b3("function render(){try{const R=document.documentElement;R.style.setProperty('--scno','0');",
    'const SCR=' + _json53.dumps(_SCR, separators=(',', ':'), ensure_ascii=False) + ','
    'LOCUI=' + _json53.dumps(_LOCUI, separators=(',', ':')) + ';'
    "function scrBg(){const ph=G.phase,rl=(G&&(G.a2||G.ch))||'ody';let u='';"
    "if(ph=='draft'||ph=='otg'||ph=='bossp'){const k=ph=='draft'?(G.dr&&G.dr.mode=='start'?'draft_start':'draft_reward'):ph,id=(SCR[rl]||{})[k];if(id)u='scenes/'+id+'.jpg'}"
    "else if(ph=='remove'||ph=='hub'){const nd=G.web&&G.web.nodes&&G.web.nodes[G.pos];if(nd)u=(LOCUI[rl]||{})[nd.t]||''}"
    "if(!u)return;const R=document.documentElement.style;R.setProperty('--scn',`url(art/game/${u})`);R.setProperty('--scno','1')}"
    "function render(){try{const R=document.documentElement;R.style.setProperty('--scno','0');")

# The remove/duplicate/upgrade overlay was near-black (#000c), which hid the location painting
# entirely; a lighter veil keeps the cards readable and lets the scene show at the edges.
_b3('.rmv{background:#000c}', '.rmv{background:#000c}html[data-hero] .rmv{background:#0009}')
