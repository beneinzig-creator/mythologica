# v120 (patch64): darker, more rustic parchment (Ben: "the white is too white").
# The hover pop-ups (card, map-node and dock tips), the start-screen hero tiles, the How to Play lesson tiles and
# the tutorial box all used a pale cream fill. They now share one aged parchment: a warm tan, darker towards the
# edges, with faint stains, so they sit with the painted frames and the dark table instead of glowing white.
# Colours only; sizes and positions are unchanged.
_PARCH = ('background:radial-gradient(ellipse at 30% 20%,#d6c39a33,#0000 45%),'
          'radial-gradient(ellipse at 78% 82%,#5a3d1a2e,#0000 50%),'
          'radial-gradient(ellipse at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%)!important;'
          'color:#1d150b!important')
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.tip,#tip,.wn .tipx,#kdock,.htile,.tutl,#tutc{' + _PARCH + '}'
    '.tip b,#tip b,.wn .tipx b,#kdock b{color:#5a1f0c}'
    '.htile .har{color:#3a2a12!important}.tutl .tuts{opacity:.85}'
    '.dft{position:absolute;inset:0;display:flex;')
