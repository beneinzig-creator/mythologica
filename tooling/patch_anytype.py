# patch_anytype: a card that "counts as any type" (Shed a Skin, Chameleon Monkey) now satisfies "if the card you
# played just before this one was a Strike / Trick / Leap" (Ben: Shed a Skin didn't trigger Counter-Strike).
# Why it failed: wkPlay turns "any" into ONE concrete type when it is played (whichever builds Momentum best, usually
# not Leap), and the follow-up cards compared against that single type (s.pl). Momentum and the types-played-this-turn
# tally keep working exactly as before; only the "card just before" checks change:
#   Slip Away (wslip, Trick) and Counter-Strike (wcounter, Leap). (Feint no longer has such a check.)
# p.pla = the card just before this one counted as any type; reset with the rest of the turn state in wkUp.
_b3("p.pl=p.lt||'';", "p.pl=p.lt||'';p.pla=!!p.lta;p.lta=WT[c.id]==='any';")
_b3("s.cp=0;s.mo=0;s.lt='';s.pl='';", "s.cp=0;s.mo=0;s.lt='';s.pl='';s.pla=false;s.lta=false;")
_b3("if(s.pl=='tr')s.mana+=1+mg()}", "if(s.pl=='tr'||s.pla)s.mana+=1+mg()}")
_b3("t.dmg+=(s.pl=='lp'?3:1)+mg()}", "t.dmg+=(s.pl=='lp'||s.pla?3:1)+mg()}")
