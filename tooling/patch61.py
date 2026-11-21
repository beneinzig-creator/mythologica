# v117 (patch61): card names never run over the frame's own ornaments.
# Ben noticed names overlapping the art on Divine Karma and Divine Intervention. The cause: two of Sun
# Wukong's frames have ornaments inside the name bar itself, which the measured name boxes (cards.json
# "boxes") did not leave room for:
#   wc / wcs (Common): painted cloud scrolls sit inside both ends of the bar (to ~18% and from ~70%).
#   wl / wls (Legendary): the dragon's head reaches into the left end of the bar (to ~21%).
# Their name boxes are narrowed to the clear stretch of the bar; long names then shrink to fit as usual
# (patch52's text fit). Every other frame's bar is clear and keeps its box.
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.cd.af-wc .nm b,.cd.af-wcs .nm b{left:18.5%!important;width:51%!important;padding-right:.45em!important}'
    '.cd.af-wl .nm b,.cd.af-wls .nm b{left:21.5%!important;width:61.3%!important}'
    '.dft{position:absolute;inset:0;display:flex;')
