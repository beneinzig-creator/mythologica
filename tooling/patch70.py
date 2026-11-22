# v123 (patch70): Act III's three generals change their name when they transform at half life (Lucifer becomes
# the Red Dragon, Ahriman the Destructive Spirit, Abaddon becomes Apollyon). Fight backgrounds are looked up by
# the opponent's name (patch49), so the painting vanished at the transformation. The phase-two names now share
# their general's background.
_A70 = {'Lucifer, the Red Dragon': 'Lucifer, the Morning Star',
        'Ahriman, the Destructive Spirit': 'Ahriman, the Smiling Stranger',
        'Apollyon, the Destroyer': 'Abaddon, the Opened Abyss'}
import json as _json70
_b3("fit();try{addEventListener('resize',fit)}catch(e){}",
    'for(const [a,b] of Object.entries(' + _json70.dumps(_A70) + '))if(SCN[b]&&!SCN[a])SCN[a]=SCN[b];'
    "fit();try{addEventListener('resize',fit)}catch(e){}")
