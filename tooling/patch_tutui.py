# patch_tutui: tutorial selection screen polish (Ben's playtest notes, Nov 2026).
# 1. The red lesson numbers on the lesson buttons are gone; the title now sits at the top of the
#    button, and the button's text block is centred vertically so short and long blurbs sit evenly.
# 2. The plain ✓ that marked a finished lesson is replaced by a painted-style mark: an oxblood ink
#    tick inside a wreath of gilded laurel (art/game/icons/tutdone.svg, hand-drawn SVG so it stays crisp).
#    It is pinned on the button frame's top-right corner like a medal, so it takes no room from the title.
#    It shows on every finished lesson (hero lessons and The journey) and, smaller, on the corner of a hero's tab
#    once all of that hero's lessons are done. No ✓ text is left in it (the emoji-to-icon pass would swap it
#    for chosen.png); screen readers get aria-label="Completed".

_b3('<span class="tutn">${n}</span>', '')
_b3('<span class="tutn">${Ls.length+1}</span>', '')
_TOK = '\'<span class="tutok" role="img" aria-label="Completed" title="Completed"></span>\''
_b3("done.includes(L.id)?'<span class=\"tutok\">✓</span>'", 'done.includes(L.id)?' + _TOK)
_b3("done.includes('journey')?'<span class=\"tutok\">✓</span>'", "done.includes('journey')?" + _TOK)
_b3("${all?' ✓':''}", "${all?'<span class=\"tutok\" role=\"img\" aria-label=\"All lessons completed\" title=\"All lessons completed\"></span>':''}")
_b3('.tutl .tutok{color:#2f6a2a!important}',
    '.tutl{justify-content:center;gap:5px!important;padding:12px 16px 14px!important}'
    '.tutl .tutt{line-height:1.15}'
    '.tutok{background:url(art/game/icons/tutdone.svg) center/contain no-repeat;color:transparent!important}'
    '.tutl .tutok{position:absolute;top:-17px!important;right:-17px!important;width:40px;height:40px;z-index:1;'
    'filter:drop-shadow(0 0 1.5px #fff1c8aa) drop-shadow(0 2px 2px #0008)}'
    '.tuttab{position:relative}.tuttab .tutok{position:absolute;top:-20px;right:-29px;width:30px;height:30px;z-index:1;'
    # the ghost buttons are drawn with saturate(.55) brightness(.82); undo that on the mark so the gold reads
    "filter:saturate(1.8) brightness(1.22) drop-shadow(0 0 1.5px #fff1c8aa) drop-shadow(0 1px 2px #0008)}")
