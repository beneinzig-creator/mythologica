# v101: typography. Cinzel Decorative (display) + IM Fell English (text), embedded as base64 woff2
# so the game stays one offline file. Both fonts: SIL Open Font License 1.1 (Google Fonts).
import base64 as _b64, re as _re

def _font(fn):
    return 'data:font/woff2;base64,' + _b64.b64encode(open(S+'vendor/fonts/'+fn,'rb').read()).decode()

FONTS = (
"/* Cinzel Decorative (Natanael Gama) and IM Fell English (Igino Marini): SIL Open Font License 1.1 */"
"@font-face{font-family:'Cinzel Decorative';font-style:normal;font-weight:700;font-display:swap;src:url(" + _font('cinzel-decorative-700.woff2') + ") format('woff2')}"
"@font-face{font-family:'IM Fell English';font-style:normal;font-weight:400;font-display:swap;src:url(" + _font('im-fell-english.woff2') + ") format('woff2')}"
"@font-face{font-family:'IM Fell English';font-style:italic;font-weight:400;font-display:swap;src:url(" + _font('im-fell-english-italic.woff2') + ") format('woff2')}"
":root{--fb:'IM Fell English','Palatino Linotype',Palatino,Georgia,serif;--fd:'Cinzel Decorative','Palatino Linotype',Palatino,Georgia,serif}"
)

# Route every hard-coded font stack (CSS and JS-built inline styles) through --fb.
_STACKS = [
    r"'Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif",
    r"'Palatino Linotype',Palatino,Georgia,serif",
    r"Georgia,'Times New Roman',serif",
    r"Georgia,serif",
    r"(?<=font:700 1[13]px )Georgia\b",
]
_n = 0
for _nm in ('head','mid','tail','A','B'):
    _t = globals()[_nm]
    for _p in _STACKS:
        _t, _k = _re.subn(_p, 'var(--fb)', _t); _n += _k
    globals()[_nm] = _t
assert _n >= 15, ('font stacks replaced', _n)

DISPLAY = (
# display face: title, headings, names, buttons
".dft>div[style*='clamp(30px'],.ovt,.hnm,.eh b,.pn,.mapscr h1,.dhd .ovt{font-family:var(--fd);font-weight:700}"
".dft>div[style*='clamp(30px']{letter-spacing:.04em!important}"
".b{font-family:var(--fd);letter-spacing:.02em}"
".b.gh{font-family:var(--fb);font-size:14px}"
# IM Fell has no bold weight: keep emphasis from turning into smeared faux-bold on small text
".cd,.tip,.fxp,.dsub,.mid{font-synthesis:none}"
".hq{font-size:20px}.hpl{font-size:16px}.hnm{font-size:21px}"
# IM Fell's old-style figures are too small for game numbers: stats, costs, life, mana, counters use the display face
".pt,.nm i,.orb,.hp,.ob,.gyn,.cn,.eh .cn{font-family:var(--fd);font-weight:700;font-synthesis:none}"
)
_b3("html.gs .hdet{animation:none}\n", "html.gs .hdet{animation:none}\n" + FONTS + DISPLAY + "\n")
