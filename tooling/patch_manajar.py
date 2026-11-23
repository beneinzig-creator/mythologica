# patch_manajar: the mana counter (bottom left of the fight screen) becomes a potion vessel in each hero's style, with
# the number in the middle of the liquid and the liquid gently moving (Ben's playtest, Nov 2026).
# - Vessels: art/game/icons/[<hero>/]mana_jar.png (Odysseus a Greek glass flask with a bronze key-band collar, Odin a
#   Norse flask with silver knotwork and a horn stopper, Wukong a glass calabash gourd with a red cord, Thoth an
#   Egyptian flask with a gold and lapis collar). The small mana icon (◆) used in text everywhere else is unchanged.
# - The liquid layer (.mjl) sits over the vessel, masked to the vessel's own shape and to below the liquid's surface.
#   Soft glints drift across it and the surface tilts a little from side to side. It stops for reduced motion.
# - The digits sit in the middle of each vessel's round body (offsets per hero): dark ink with a light halo on the gold
#   potions, cream with a dark outline on Thoth's blue water.
_MJ = {  # hero: (image dir, liquid surface % from top, digit x px, digit y px) for the 62px counter
    'ody': ('', 44, 0, 10), 'odin': ('odin/', 51, -1, 12), 'wukong': ('wukong/', 57, -2, 15), 'thoth': ('thoth/', 42, 0, 11)}

_b3('<div class="orb" title="Mana">◆${p.mana}</div>', '<div class="orb mj" title="Mana"><i class="mjl"></i>${p.mana}</div>')

_m = "url(art/game/icons/{d}mana_jar.png)"
_css = ("@property --mt{syntax:'<angle>';inherits:false;initial-value:180deg}"
        'html[data-hero] .me .orb.mj{--s:1;background:var(--mjv) center/contain no-repeat!important;filter:drop-shadow(0 3px 5px #000b)}'
        'html.ph[data-hero] .me .orb.mj{--s:.742}'
        'html[data-hero] .me .orb.mj>.ico,html[data-hero] .me .orb.mj>.noic{display:none!important}'
        'html[data-hero] .me .orb.mj>.mjl{grid-area:1/1;align-self:stretch;justify-self:stretch;display:block;pointer-events:none;'
        '-webkit-mask:var(--mjv) center/contain no-repeat,linear-gradient(var(--mt),#0000 var(--ls),#000 calc(var(--ls) + 3%));'
        '-webkit-mask-composite:source-in;mask:var(--mjv) center/contain no-repeat,linear-gradient(var(--mt),#0000 var(--ls),#000 calc(var(--ls) + 3%));mask-composite:intersect;'
        'background:linear-gradient(var(--mt),#0000 var(--ls),#fff9 calc(var(--ls) + 2%),#fff0 calc(var(--ls) + 7%)),'
        'radial-gradient(ellipse 50% 40% at 50% 50%,#ffffff80,#fff0 70%) 0 64%/55% 26% repeat-x,'
        'radial-gradient(ellipse 50% 40% at 50% 50%,#ffffff60,#fff0 70%) 0 84%/42% 20% repeat-x;'
        'mix-blend-mode:screen;opacity:.75;animation:mjtilt 3.8s ease-in-out infinite,mjflow 5.5s ease-in-out infinite alternate}'
        '@keyframes mjtilt{0%,100%{--mt:175deg}50%{--mt:185deg}}'
        '@keyframes mjflow{from{background-position:0 0,0 64%,30% 84%}to{background-position:0 0,100% 61%,-40% 86%}}'
        'html[data-hero] .me .orb.mj>.dg{height:calc(22px*var(--s))!important;color:#2a1402!important;'
        'transform:translate(calc(var(--mx2,0px)*var(--s)),calc(var(--my2,0px)*var(--s)))!important;'
        'filter:drop-shadow(0 0 1px #fff7d6) drop-shadow(0 0 2px #fff7d6) drop-shadow(0 0 4px #fff7d6cc)!important}'
        # Thoth's water is blue, so his number is cream with a dark outline
        'html[data-hero=thoth] .me .orb.mj>.dg{color:#fff8e2!important;filter:drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 1px 2px #000d)!important}'
        'html[data-hero] .me .orb.mj>.dg:has(+.dg){transform:translate(calc(var(--mx2,0px)*var(--s) - 50%),calc(var(--my2,0px)*var(--s)))!important}'
        'html[data-hero] .me .orb.mj>.dg+.dg{transform:translate(calc(var(--mx2,0px)*var(--s) + 50%),calc(var(--my2,0px)*var(--s)))!important}'
        'html[data-hero] .me .orb.mj>.dg:has(+.dg+.dg){transform:translate(calc(var(--mx2,0px)*var(--s) - 100%),calc(var(--my2,0px)*var(--s)))!important}'
        'html[data-hero] .me .orb.mj>.dg+.dg:has(+.dg){transform:translate(calc(var(--mx2,0px)*var(--s)),calc(var(--my2,0px)*var(--s)))!important}'
        'html[data-hero] .me .orb.mj>.dg+.dg+.dg{transform:translate(calc(var(--mx2,0px)*var(--s) + 100%),calc(var(--my2,0px)*var(--s)))!important}'
        '@media (prefers-reduced-motion:reduce){html[data-hero] .me .orb.mj>.mjl{animation:none}}')
for _h, (_d, _ls, _x, _y) in _MJ.items():
    _css += (f'html[data-hero={_h}] .me .orb.mj{{--mjv:{_m.format(d=_d)}}}'
             f'html[data-hero={_h}] .me .orb.mj>.mjl{{--ls:{_ls}%}}'
             f'html[data-hero={_h}] .me .orb.mj>.dg{{--mx2:{_x}px;--my2:{_y}px}}')
_b3('.dft{position:absolute;inset:0;display:flex;', _css + '.dft{position:absolute;inset:0;display:flex;')
