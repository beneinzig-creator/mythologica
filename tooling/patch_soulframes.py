# patch_soulframes: Thoth's Body, Spirit and Name cards each get their own afterlife frame (Ben's playtest).
# Body: mummy linen and black resin with djed pillars (code kc). Spirit: turquoise and white with soul-birds (ku).
# Name: a gold cartouche on carnelian red (krs, the spell version: a Name is a spell). The frames are in
# art/game/frames/k*.jpg, built from art/frames/tsoul like any hero's.
# Every Body, Spirit and Name is a new card with a fresh id (ka7, ba7, ren8 ...) whatever it was sundered from: a
# Thoth card, another hero's card, or an enemy's in Act II or Act III. patch_tokens registers those ids for their
# painted pictures with Thoth's Common frame; this gives each kind its own frame instead, so the frame follows the
# card's Body/Spirit/Name state rather than where the original card came from. Nameless keeps Thoth's frame.
_b3("if(typeof ARTF!='undefined'&&!ARTF[id])ARTF[id]=D[id]&&D[id][2]=='C'?'tc':'tcs';",
    "if(typeof ARTF!='undefined'){const sf={ka:'kc',ba:'ku',ren:'krs'}[m[1]];"
    "if(sf)ARTF[id]=sf;else if(!ARTF[id])ARTF[id]=D[id]&&D[id][2]=='C'?'tc':'tcs'}")
