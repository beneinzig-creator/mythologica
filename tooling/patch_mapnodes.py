# patch_mapnodes: full-art medallions for the map's non-enemy nodes (Ben's playtest, Nov 2026).
# The starting point, campfire, crafting table, altar and the great altar (the start node once four victories are
# offered) were a small icon in a plain disc or rounded square. Each is now a painted medallion that fills the circle,
# like the opponent medallions, with one set per realm (art/game/icons/<realm dir>/node_<type>.png). They follow the
# realm you are in (RLM() from patch_realm), so Act II shows the realm's set and Act III has its own.
# If a picture fails to load, the node falls back to its emoji, which the icon swap then turns into the old icon.
_b3('function renderMap(){',
    "const NMD={ody:'',odin:'odin/',wukong:'wukong/',thoth:'thoth/',act3:'act3/'};"
    "function NMED(n){try{if(!n||n.t=='fight'||!LOCN[n.t])return '';const ga=n.t=='start'&&G.fi>=FLOORS&&!G.spent,t=ga?'greataltar':n.t,"
    "d=NMD[typeof RLM=='function'?RLM():'ody'];if(d==null)return '';"
    "return '<img class=\"ico med nmed\" src=\"art/game/icons/'+d+'node_'+t+'.png\" alt=\"'+(ga?'Great altar':LOCN[n.t][1])+'\" draggable=\"false\" "
    "onerror=\"this.replaceWith(document.createTextNode(\\''+(ga?'🔱':LOCN[n.t][0])+'\\'))\">'}catch(e){return ''}}"
    'function renderMap(){')
_b3("<span class=\"mi\">${n.neutral?'·':n.t=='fight'&&n.cleared?'✖':ic}</span>",
    "<span class=\"mi\">${n.neutral?'·':n.t=='fight'&&n.cleared?'✖':NMED(n)||ic}</span>")
# a location node with a medallion is a circle like the fight nodes
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.tmap .wn .mi:has(.nmed){border-radius:50%!important}'
    '.dft{position:absolute;inset:0;display:flex;')
