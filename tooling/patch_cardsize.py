# patch_cardsize: bigger cards on laptop/desktop (Ben's request). Phone layout (html.ph) is unchanged: it sizes
# cards with --fw/--hw and forces zoom:1 on the hand and fields.
# - Hand cards 25% bigger: fit() sets --czh (the hand card zoom, clamped 1..1.6 from the window height); it is
#   now multiplied by 1.25 after the clamp.
# - Battlefield cards 15% bigger, both sides: --czf (army members, and the item/modifier rows, which scale from
#   --czf) is multiplied by 1.15 after its clamp.
# The hand keeps its row; where the bigger hand needs more height it rises over the bottom of the player's field
# (allowed). fitHand() still squeezes a full hand, and the action-button column keeps its reserved space.

_b3("R.setProperty('--czf',b(Math.min(.145*H,.8*W/5.5)/(104*zc)).toFixed(3));R.setProperty('--czh',b(.14*H/(104*zc)).toFixed(3))",
    "R.setProperty('--czf',(b(Math.min(.145*H,.8*W/5.5)/(104*zc))*1.15).toFixed(3));R.setProperty('--czh',(b(.14*H/(104*zc))*1.25).toFixed(3))")
