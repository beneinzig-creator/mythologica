# v99: "inscription" look.
# - Stone everywhere: noise/veined stone background instead of table stripes, incised headings.
# - Combat: each side is a recessed stone slab with carved rank grooves (Attack / Defense / Tapped)
#   lined up with the stance offsets; cards cast depth by stance; tapped cards turn sideways.
# - Draft: realm-themed stone (Greek meander / Norse runes / Chinese huiwen frieze), cards stand on a ledge.

# --- battlefield ranks: wider stance spacing + carved lane guides -------------------------------
_b3("(t=='p'?k:-k)*28", "(t=='p'?k-RB:RB-k)*RK")
_b3("return`<div class=\"lys\">${ly}</div>",
    "return`<div class=\"lys\"><div class=\"lnw\">${lanes(t)}</div>${ly}</div>")
_b3("function fld(s,t){",
    "let RK=34,RB=2;const RTQ=21;function lanes(t){const pp=t=='p'?'top':'bottom';return [1,2,3].map(k=>`<i class=\"ln l${k}\" style=\"${pp}:${(k-2)*RK+(k==3?RTQ:0)}px\"><em>${['','Attack','Defense','Tapped'][k]}</em></i>`).join('')}\nfunction fld(s,t){{let ph=false;try{ph=document.documentElement.classList.contains('ph')}catch(e){}RK=ph?16:34;RB=ph?0:2}")

# --- table at ~70 degrees: both slabs + the middle strip share one tilted plane ---------------
_b3("<div class=\"fld fe\">${fld(e,'e')}</div>", "<div class=\"board\"><div class=\"fld fe\">${fld(e,'e')}</div>")
_b3("<div class=\"fld fp\">${mine}</div>", "<div class=\"fld fp\">${mine}</div></div>")

# --- draft: realm class + realm colours --------------------------------------------------------
_b3("const done=dr.n>=dr.rounds;", "try{const R=document.documentElement.style,rc=RLMC[G.ch]||RLMC.ody;R.setProperty('--b1',rc[0]);R.setProperty('--b2',rc[1])}catch(e){}const done=dr.n>=dr.rounds;")
_b3("function renderDraft(){", "const RLMC={ody:['#07141d','#1c4760'],odin:['#0b0e11','#3a4550'],wukong:['#140808','#5a1d16']};\nfunction renderDraft(){")
_b3('<div class="dft"><div class="dhd">', '<div class="dft drf rl-${G.ch||\'ody\'}"><div class="dhd">')

# --- styles ------------------------------------------------------------------------------------
NOISE = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E"
         "%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E"
         "%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0'/%3E%3C/filter%3E"
         "%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")")
VEIN = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='v'%3E"
        "%3CfeTurbulence type='fractalNoise' baseFrequency='.005 .015' numOctaves='4' seed='7' stitchTiles='stitch'/%3E"
        "%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 .9'/%3E%3C/filter%3E"
        "%3Crect width='100%25' height='100%25' filter='url(%23v)'/%3E%3C/svg%3E\")")
# Greek key (meander) unit, carved: dark groove + light lip
MEANDER = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24'%3E"
           "%3Cpath d='M0 22H40V2H8V16H32V8H16' fill='none' stroke='%23ffffff3a' stroke-width='3' transform='translate(0 1.5)'/%3E"
           "%3Cpath d='M0 22H40V2H8V16H32V8H16' fill='none' stroke='%23000000aa' stroke-width='3'/%3E%3C/svg%3E\")")
# Chinese huiwen (回) unit
HUIWEN = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E"
          "%3Cg fill='none' stroke-width='2.5'%3E%3Cpath d='M3 3H25V25H3V9H19V19H9V14' stroke='%23e0b04a55' transform='translate(0 1.5)'/%3E"
          "%3Cpath d='M3 3H25V25H3V9H19V19H9V14' stroke='%23000000aa'/%3E%3C/g%3E%3C/svg%3E\")")

INC = "text-shadow:0 -1px 0 #000c,0 1px 0 #ffffff24"   # incised text

ICSS = (
# stone background everywhere (replaces table stripes)
"body{background:radial-gradient(ellipse at 50% 50%,#0000 50%,#000a 100%)," + NOISE + "," + VEIN + ",radial-gradient(ellipse at 50% 110%,var(--b2),var(--b1) 75%);background-color:var(--b1);"
"background-size:100% 100%,200px 200px,cover,100% 100%;background-repeat:no-repeat,repeat,no-repeat,no-repeat;background-attachment:fixed}"
".ovt{" + INC + "}.dsub{" + INC + "}"
# hero select tiles as carved stone tablets
".htile{background:linear-gradient(#ffffff0a,#0000 40%)," + NOISE + ",#00000059;border:1px solid #ffffff14;"
"box-shadow:inset 0 1px 0 #ffffff1c,inset 0 -2px 0 #0008,0 10px 24px #000a,0 2px 0 #0009}"
".htile .hnm,.htile .har{" + INC + "}"
".htile.on{border-color:var(--gold);box-shadow:inset 0 1px 0 #ffffff26,inset 0 -2px 0 #0008,0 0 0 1px #e0b04a66,0 14px 30px #000c,0 0 26px var(--gl)}"
# --- battlefield slabs on one tilted table plane (~20deg off top-down = 70deg view)
".board{grid-row:2/5;display:grid;grid-template-rows:1fr auto 1fr;min-height:0;transform:perspective(1300px) rotateX(20deg);transform-origin:50% 100%}"
"html.ph .board{transform:perspective(900px) rotateX(14deg)}"
".fld{position:relative}"
".fld::before{content:'';position:absolute;left:88px;right:88px;border-radius:10px;pointer-events:none;"
"background:linear-gradient(#0000,#0000)," + NOISE + ",color-mix(in srgb,var(--b1) 55%,#000);"
"box-shadow:inset 0 3px 0 #0009,inset 0 0 46px #000c,inset 0 -1px 0 #ffffff12,0 0 0 1px #ffffff0c,0 0 0 5px #0000002e;outline:1px solid #ffffff0d;outline-offset:-7px}"
".fe::before{top:8px;bottom:2px}.fp::before{top:2px;bottom:6px}"
".mid{background:none;position:relative;" + INC + "}"
".mid::before,.mid::after{content:'';position:absolute;left:12%;right:12%;height:2px;background:linear-gradient(90deg,#0000,#000a 20%,#000a 80%,#0000);box-shadow:0 1px 0 #ffffff14}"
".mid::before{top:1px}.mid::after{bottom:1px}"
# rank grooves
".lys{position:relative}.lnw{position:absolute;inset:0;pointer-events:none}"
".ln{position:absolute;left:104px;right:104px;height:2px;background:linear-gradient(90deg,#0000,#000b 12%,#000b 88%,#0000);box-shadow:0 1px 0 #ffffff12}"
".ln em{position:absolute;left:10px;font-style:normal;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;" + INC + ";opacity:.85;white-space:nowrap}"
".fp .ln em{top:5px}.fe .ln em{bottom:5px}"
".ln.l1 em{color:#d98a72}.ln.l2 em{color:#8fb3dc}.ln.l3 em{color:#a59c8a}"
"@media(min-width:561px){html:not(.ph) .ly{min-height:158px}}"
"html.ph .lnw{display:none}"
# card depth by stance (attack stands tall, defense braced, tapped lies sideways)
".fld .cd{transition:transform .3s,scale .12s,translate .12s,rotate .25s,box-shadow .2s,filter .2s;box-shadow:0 4px 0 -1px #0007,0 16px 22px #000b}"
".fe .cd{box-shadow:0 3px 0 -1px #0007,0 6px 12px #0009}"
".fld .cd.df{box-shadow:0 0 0 3px #4d8fd8,0 3px 0 -1px #0007,0 8px 12px #0009}"
".fld .cd.tap{rotate:90deg;margin:0 21px;opacity:.85;filter:grayscale(.45) brightness(.8);box-shadow:0 2px 0 -1px #0007,0 4px 8px #0009}"
".fld .cd.tap:hover{rotate:0deg;opacity:1;filter:none}"
".fld .cd.tap>.sb{top:50%!important;left:-14px!important;transform:translate(-50%,-50%) rotate(-90deg)!important}"
".fld .cd.tap:hover>.sb{top:-21px!important;left:50%!important;transform:translateX(-50%)!important}"
"html.ph .fld .cd.tap{margin:0 calc(var(--fw,60px)*.18)}"
# --- draft: realm stone, frieze bands, ledge
".drf::before,.drf::after{content:'';position:fixed;left:0;right:0;height:30px;pointer-events:none;z-index:0;"
"box-shadow:inset 0 3px 0 #000a,inset 0 -1px 0 #ffffff1c,0 1px 0 #ffffff10;background-color:#0000004d;background-repeat:repeat-x;background-position:center}"
".drf::before{top:0}.drf::after{bottom:0}"
".rl-ody::before,.rl-ody::after{background-image:" + MEANDER + "}"
".rl-wukong::before,.rl-wukong::after{background-image:" + HUIWEN + ";background-size:26px 26px}"
".rl-odin::before,.rl-odin::after{content:'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ';"
"font-size:15px;line-height:30px;letter-spacing:.5em;text-align:center;white-space:nowrap;overflow:hidden;color:#cfe3f055;" + INC + "}"
".drf .dhd{top:44px}"
".drf .dcards{position:relative;perspective:1100px}"
".drf .dcards::after{content:'';position:absolute;left:-60px;right:-60px;bottom:-28px;height:30px;border-radius:6px;pointer-events:none;z-index:-1;"
"background:linear-gradient(#ffffff14,#0000 30%)," + NOISE + ",color-mix(in srgb,var(--b2) 35%,#000);"
"box-shadow:inset 0 1px 0 #ffffff26,inset 0 -3px 0 #0009,0 18px 30px #000c}"
".drf .dw{transform-style:preserve-3d}"
".drf .dw .cd{transform:rotateX(7deg);transform-origin:50% 100%;box-shadow:0 2px 0 #0006,0 22px 26px -6px #000d,0 40px 40px -20px #000a}"
".drf .dw .cd:hover{transform:rotateX(0deg) translateZ(30px);box-shadow:0 2px 0 #0006,0 34px 36px -8px #000e,0 0 24px var(--gl)}"
"html.ph .drf::before,html.ph .drf::after{height:16px;background-size:auto 16px;font-size:10px;line-height:16px}html.ph .drf .dhd{top:18px}html.ph .drf .dcards::after{bottom:-16px;height:18px}"
)
_b3(".dft{zoom:.62}.lib{max-height:68vh}\n}\n</style>", ".dft{zoom:.62}.lib{max-height:68vh}\n}\n" + ICSS + "\n</style>")
