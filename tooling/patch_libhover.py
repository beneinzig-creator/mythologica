# patch_libhover: the card inspect box (#insp .iinfo) beside the enlarged card -- what a tap or long-press opens in
# the home screen's full library (and anywhere else a card is inspected) -- still used the old bright cream
# linear-gradient(#ebdfc2,#ddd0af). The hover pop-up (#kdock), tips and victory panels took patch_polish's rustic
# parchment long ago; the inspect box now gets the same parchment, ink colour and keyword colour.
_b3('</style>', 'html #insp .iinfo,html[data-hero] #insp .iinfo{background:radial-gradient(ellipse at 30% 20%,#d6c39a33,#0000 45%),radial-gradient(ellipse at 78% 82%,#5a3d1a2e,#0000 50%),radial-gradient(ellipse at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%)!important;color:#1d150b!important;text-shadow:none}#insp .iinfo b{color:#5a1f0c}</style>')
