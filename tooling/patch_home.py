# patch_home: the home screen's hero row and sound button in the newer painted style (Ben, Nov 2026).
# - The hero tiles lose their parchment card frame and the archetype line under the name. Each portrait is shown much
#   larger, inside a painted worn-bronze rim (art/game/home/rim.png) like the map and opponent medallions, with the
#   name in light ink underneath so it reads on the dark background. The chosen hero glows; the others dim as before.
# - On the home screen the sound button is a painted medallion: a sounding bronze horn, or the same horn struck
#   through when muted (art/game/icons/snd_on.png / snd_off.png). Other screens keep their button for now.
# - Phone width (html.ph) keeps the four heroes in one row, with the portraits as large as the row allows.
_CSS = (
    # tiles: no frame, no card background
    'html .chrow{width:min(1060px,96vw)!important;gap:clamp(14px,3.2vw,44px)!important;align-items:flex-start;margin:10px 0 2px!important}'
    'html .chrow .htile{background:none!important;border:0!important;border-image:none!important;box-shadow:none!important;border-radius:0!important;'
    'padding:4px 2px 0!important;gap:12px!important;flex:0 1 auto!important;max-width:none!important;width:auto!important;transform:none}'
    'html .chrow .htile .har{display:none!important}'
    # the portrait medallion
    'html .chrow .htile .hic{width:clamp(130px,15.5vw,212px)!important;height:clamp(130px,15.5vw,212px)!important;transition:transform .18s,filter .18s;'
    'filter:drop-shadow(0 10px 18px #000c)}'
    'html .chrow .htile .hic .hpic{inset:6.5%!important;width:87%!important;height:87%!important;border:0!important;box-shadow:inset 0 0 18px #000a!important}'
    'html .chrow .htile .hic::after{content:"";position:absolute;inset:0;background:url(art/game/home/rim.png) center/contain no-repeat;pointer-events:none}'
    'html .chrow .htile .hic .hem{opacity:0}'
    'html .chrow .htile:hover .hic{transform:translateY(-3px) scale(1.03)}'
    'html .chrow .htile.on .hic{filter:drop-shadow(0 10px 18px #000c) drop-shadow(0 0 16px #e8c35a99)}'
    'html .chrow .htile.on .hic .hpic{box-shadow:inset 0 0 18px #0008!important}'
    # names: light ink with a dark halo
    'html .chrow .htile .hnm{color:#f3e5c0!important;font-size:clamp(17px,1.75vw,25px)!important;letter-spacing:.05em;line-height:1.1;white-space:nowrap;'
    'text-shadow:0 2px 0 #000,0 0 10px #000,0 0 18px #000c!important}'
    'html .chrow .htile.on .hnm{color:#ffd978!important}'
    # phone: one row of four, portraits sized to the row
    'html.ph .chrow{gap:10px!important;margin:2px 0 0!important}'
    'html.ph .chrow .htile{flex:1 1 0!important;gap:4px!important;padding:2px 0 0!important}'
    'html.ph .chrow .htile .hic{width:min(17vw,19vh,84px)!important;height:min(17vw,19vh,84px)!important}'
    'html.ph .chrow .htile .hnm{font-size:12px!important;line-height:1;letter-spacing:.02em;white-space:normal;text-align:center}'
    # sound button on the home screen: the painted horn medallion
    'html:has(.chrow) #sndb{background:url(art/game/icons/snd_on.png) center/contain no-repeat!important;border:0!important;'
    'box-shadow:none!important;width:40px!important;height:40px!important;filter:drop-shadow(0 2px 4px #000c)}'
    'html.ph:has(.chrow) #sndb{width:34px!important;height:34px!important}'
    'html:has(.chrow) #sndb[title="Sound off"]{background-image:url(art/game/icons/snd_off.png)!important}'
    'html:has(.chrow) #sndb>svg{display:none}'
    'html:has(.chrow) #sndb:hover{filter:drop-shadow(0 2px 4px #000c) drop-shadow(0 0 8px #e8c35a)}'
)
_b3('.dft{position:absolute;inset:0;display:flex;', _CSS + '.dft{position:absolute;inset:0;display:flex;')
