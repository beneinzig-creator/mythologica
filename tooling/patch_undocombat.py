# patch_undocombat: "Undo last action" now also works for actions taken during combat (Ben: he offered an army member
# and couldn't undo it). Why it failed: offering (and quick spells) are allowed while blocks are being set ('blockP',
# when you are attacked) and before damage resolves ('dmgP', after you attack), but undo only ever recorded actions
# taken in the main part of your turn with no combat in progress (uOK required phase 'main' and no G.cmb).
# Now:
# - uOK also allows 'blockP' and 'dmgP' while that combat is in progress (still never with a pending choice, the
#   Hades offer or a reveal open).
# - An undo is only offered in the same step it was recorded in (same phase, turn and fight). So an offer made while
#   blocking can be undone while still blocking, and once combat resolves it can't be.
# - Undoing inside combat keeps the combat (attackers, blocks so far) exactly as it was before the action, instead of
#   clearing it. Combat is stored by army-member ids (G.cmb.atk / blk / bx / tg), so the snapshot restores cleanly.
_b3("const uOK=()=>!!(G&&G.p&&G.p.recs&&!G.pend&&!G.hq&&!G.rv&&!G.cmb&&G.phase=='main'&&!!G.e);",
    "const UCB=['blockP','dmgP'];const uOK=()=>!!(G&&G.p&&G.p.recs&&!G.pend&&!G.hq&&!G.rv&&!!G.e&&(G.phase=='main'&&!G.cmb||UCB.includes(G.phase)&&!!G.cmb));")
_b3("return G.phase=='main'&&G.turn==UND.turn&&G.fi==UND.fi}",
    "return (G.phase=='main'||UCB.includes(G.phase))&&G.phase==UND.ph&&G.turn==UND.turn&&G.fi==UND.fi}")
_b3("G.hq=0;G.rv=0;G.cmb=0;G.lib=0;G.gv=0;",
    "G.hq=0;G.rv=0;if(!UCB.includes(G.phase))G.cmb=0;G.lib=0;G.gv=0;")
_b3("G.msg='Undid your last action.'}else G.sel=[];instCap();render()}",
    "G.msg='Undid your last action.'}else if(UCB.includes(G.phase))G.msg='Undid your last action.';else G.sel=[];instCap();render()}")
