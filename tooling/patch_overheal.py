# patch_overheal: your healing can take you above your maximum life (Ben, Nov 2026: "make it so you can have more
# than 20 health"; he chose healing past 20 in real runs, no cap). Opponents' healing stays capped at their maximum.
# - Every heal written as Math.min(X.max, ...) now uses healCapX(X): no cap for you (G.p), X.max for anyone else. That
#   covers resting at a camp, the hub heal, Odin's after-fight heal, the Act II / Act III / finale heals, Tithe of the
#   Slain, Othala, the Scribe's Clerk, Gift of the Nile, fGain (Thoth) and any other heal of that form.
# - The heal buttons (Rest / Heal 6 life) no longer grey out at full life, so you can rest above 20.
# - Your maximum stays 20: the Wounded threshold (half your maximum) is unchanged. The life readout shows e.g. 26/20.
# Runs last, over every segment, so heals added by earlier patches are covered too.
import re as _reoh
_OH_n = 0
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _t = globals()[_nm]
    _t, _k1 = _reoh.subn(r"Math\.min\(((?:\w+\.)?\w+)\.max(?=[,+])", r"Math.min(healCapX(\1)", _t)
    _t, _k2 = _reoh.subn(r"\|\|p\.life>=p\.max", "", _t)
    globals()[_nm] = _t
    _OH_n += _k1 + _k2
    print('overheal', _nm, _k1, _k2)
assert _OH_n >= 15, _OH_n
_b3("showChars();\n</script>", "/* ===== patch_overheal ===== */\nfunction healCapX(s){return (typeof G!='undefined'&&G&&s===G.p)?Infinity:s.max}\nshowChars();\n</script>")
