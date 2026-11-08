# ===== v57: phone portrait battle layout =====
PH = """@media(max-width:560px){
#app{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto minmax(0,1fr) auto}
.top{padding:6px 10px;gap:6px}.top>div:last-child{display:none}.eh{min-width:0;flex:1 1 auto;font-size:14px}.eh b{margin-right:6px;letter-spacing:.02em}
.eHand{flex:none;max-width:42%;overflow:hidden}.eHand .cb{width:26px;height:38px;margin:0 -5px;font-size:11px}
.fld{padding:8px 8px 8px 44px;gap:5px;min-width:0;overflow:hidden}.fp{padding-bottom:54px}
.fld .cd{width:60px;height:86px;font-size:6px;border-width:2px;padding:2px}.fld .cd .ar{font-size:17px}.fld .cd .tx{font-size:5.5px;min-height:18px}.fld .cd .nm i{padding:0 3px}.fld .cd .ty{display:none}
.fld .cd .rr{display:none}.fld .cd .pt{font-size:9px}.fld .cd .ar>.ob{font-size:8px;padding:0 4px}.fld .cd .sb{font-size:8px;padding:1px 5px;top:-16px}
.itc .cd+.cd{margin-left:-38px}
.mid{padding:4px 10px;font-size:12px}.mid small{font-size:10px}
.hand{padding:0 6px 4px 6px;min-height:122px}
.decks{left:4px;gap:5px;top:46%}.decks .pile{width:32px;height:45px;font-size:13px;box-shadow:1px 1px 0 #3a1a0c,2px 2px 0 #2a1208,0 3px 6px #000a}.gy .gyc{font-size:16px}.gy .gyn,.pile .gyn{font-size:9px;right:3px;bottom:2px}
.me{left:8px;bottom:128px;flex-direction:row;gap:8px;align-items:center;background:#0009;border-radius:20px;padding:3px 10px 3px 4px}.me .pn{display:none}.me .orb{width:36px;height:36px;font-size:13px}.me .hp{font-size:14px}.me .cn{font-size:10px}
.ctl{right:8px;bottom:128px;flex-direction:row;flex-wrap:wrap;justify-content:flex-end;max-width:64%;gap:5px}.ctl .b{padding:6px 10px;font-size:12px}
}
"""
_b3("</style>", PH+"</style>")
_b3("Next opponent: +${s0[0]} ❤, +${s0[1]}/+${s0[2]} on army members","Next opponent: ${s0[0]>=0?'+':''}${s0[0]} ❤, +${s0[1]}/+${s0[2]} on army members")
LS = """@media(min-width:561px) and (max-height:520px){
.ovb{zoom:.8}.hand{padding:0 150px 0 150px;min-height:0}.fld{padding:8px 12px 2px}.top{padding:4px 14px}.mid{padding:2px 14px}.dcards{min-height:0}.dft{zoom:.62}.lib{max-height:68vh}
}
"""
_b3("</style>", LS+"</style>")
_b3("Offer cheap bodies for mana to trade up into bigger threats, then commit to a path: Phalanx walls, Raider aggression, or an Offering engine. 20 life.","Offer cheap bodies for mana to trade up into bigger threats. His three archetypes are built to work together: Phalanx walls hold the line while Raiders strike, and Offerings turn fallen and sacrificed army members into mana, cards and damage. The best runs blend all three. 20 life.")
_b3("Math.max(.65,Math.min(1,innerHeight/900","Math.max(.4,Math.min(1,innerHeight/900")
_b3("<b>Playstyle:</b> a small, hand-picked army of two or three creatures. Offer cheap","<b>Playstyle:</b> Offer cheap")
_b3('<div class="dft"><div class="ovt" style="font-size:30px">Choose your character</div>','<div class="dft" style="gap:20px"><div style="font-size:clamp(30px,8vw,76px);font-weight:700;letter-spacing:.08em;color:var(--gold);text-shadow:0 0 24px var(--gl),0 3px 0 #000a;line-height:1;text-align:center">MYTHOLOGICA</div><div class="ovt" style="font-size:24px">Choose your character</div>')
