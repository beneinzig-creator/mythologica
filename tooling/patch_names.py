# v107: no player card shares its name with a playable hero or an enemy.
# The enemy keeps the name (it is the figure itself); the player card is renamed (same effect).
RN = r"""
/* ===== v107: rename player cards that shared a name with a hero or an enemy ===== */
{const R={odn:['Herald of the Allfather','Messenger of Odin'],wking:['Avatar of the Great Sage','Aspect of the Monkey King'],norn:['Weaving of Wyrd','The weave of fate'],
 wsix:['Shapeshifter Ape','Mimic'],wfan:['Mountain-Felling Gale','Great typhoon'],wnez:['Lotus-Born Champion','Reborn warrior'],dammit:['Devouring Jaws','Ritual'],dsplit:['Scattering of the Pieces','Ritual']};
 for(const id in R){if(!D[id])continue;D[id][0]=R[id][0];if(LORE)LORE[id]=R[id][1]}
 D.sunch=D.helios.slice();D.sunch[0]='Chariot of the Sun';LORE.sunch='Fiery chariot';RAR.sunch=RAR.helios;TAG.sunch=TAG.helios;
 const P=CHARS.ody.pool,i=P.indexOf('helios');if(i>=0)P[i]='sunch'}
"""
_b3("fit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();", RN + "\nfit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();")
