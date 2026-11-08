# ===== rebalance after flyers/new cards =====
_R8=[
("ids('sheep:3,cscout,cave,brute:2,elder,poly,hurl:2,milk:2,mouth,club,forge')","ids('sheep:3,cscout,cave,brute:2,elder,poly,hurl:2,milk:2,mouth,club,forge')"),
("poly:['Polyphemus',5,'C',5,8,","poly:['Polyphemus',4,'C',6,9,"),
("elder:['Cyclops Elder',4,'C',4,6,","elder:['Cyclops Elder',4,'C',5,6,"),
("siren:['Siren of Anthemoessa',3,'C',3,3,","siren:['Siren of Anthemoessa',3,'C',4,3,"),
("ids('scout:2,song:2,siren:2,eel,lyre,canto,skies,shoal,melody:2,lure,dirge,tide')","ids('scout:2,song:2,siren:3,eel,lyre,canto,skies,shoal,melody:2,lure,dirge')"),
("D.song=['Song-Caller',2,'C',2,2,","D.song=['Song-Caller',2,'C',3,2,"),
("ids('isl:2,lot:2,priest,reaper:2,titan,sip:2,dream,haze,censer,garden,fog,breeze')","ids('isl:2,lot:3,priest,reaper:2,titan,sip:2,dream,haze,censer,garden,fog')"),
]
for _o,_n in _R8:
    assert head.count(_o)==1,_o
    head=head.replace(_o,_n)
