# v108 (patch51): numbers that belong on a vintage card (Ben's notes).
# 1. Mana cost sits in a parchment medallion with a bronze ring, drawn exactly over each frame's
#    painted circle (centre and size measured by art/measure_frames.py: "costc") and ~1.5x its size,
#    with the number centred.
# 2. The Offering badge is weathered grey stone with a bronze rim instead of a black oval.
# 3. Every number on cards with art (cost, power/health, Offering) is drawn with painted woodcut
#    numerals (art/game/digits/*.png, cut from a generated sheet by art/slice_digits.py), used as CSS
#    masks so a number still takes its colour (dark green when buffed, dark red when damaged).
#    If the numeral images can't load, the plain numbers stay.
import json as _json51, os as _os51, struct as _struct51

_AJ51 = _json51.load(open(S + '../art/game/cards.json', encoding='utf-8'))
_DG = S + '../art/game/digits/'
_dsz = {}
for _n in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'slash']:
    _b = open(_DG + _n + '.png', 'rb').read(24)
    _dsz[_n] = _struct51.unpack('>II', _b[16:24])  # PNG width, height

_css = [
    # medallion for the cost, per frame
    '.cd.af .nm i{border-radius:50%;height:auto;aspect-ratio:1;transform:translate(-50%,-50%);padding:0;'
    'background:radial-gradient(circle at 42% 36%,#f4ebd3,#dccba4 64%,#b9a57b);border:1.5px solid #3b2c14;'
    'box-shadow:inset 0 0 0 1.5px #c9a24c,inset 0 -2px 3px #0005,0 1px 3px #000b;display:flex;align-items:center;justify-content:center;z-index:2}',
    '.cd.af .nm i[style*="7be08a"]{color:#1f6d2c!important}',
    '.cd.af .nm b{padding-right:calc(.45em + 3%)}',
    # grey stone Offering badge
    '.cd.af .ob{background:radial-gradient(circle at 40% 30%,#ddd6c6,#a8a08d 72%,#8b8371);color:#211a10;'
    'border:1px solid #3b3326;box-shadow:inset 0 0 0 1px #c9a24c99,inset 0 -1px 2px #0004,0 1px 3px #000a;text-shadow:none}',
    # painted numerals as masks
    '.dg{display:inline-block;height:1em;background:currentColor;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat;vertical-align:-.14em}',
    '.cd.af .nm i .dg{height:64%}',
    '.cd.af>.pt{gap:0}.cd.af>.pt span{display:inline-flex;height:100%;align-items:center}',
    '.cd.af>.pt .dg{height:70%}',
    '.cd.af .ob .dg{height:1.08em}',
]
for _n, (_w, _h) in _dsz.items():
    _cls = 'ds' if _n == 'slash' else 'd' + _n
    _css.append(f'.dg.{_cls}{{--m:url(art/game/digits/{_n}.png);aspect-ratio:{_w}/{_h}}}')
for _code, _bx in _AJ51['boxes'].items():
    if 'costc' in _bx:
        _cx, _cy, _d = _bx['costc']
        _css.append(f'.cd.af-{_code} .nm i{{left:{_cx}%;top:{_cy}%;width:{round(_d * 1.55, 2)}%}}')
_b3('.dft{position:absolute;inset:0;display:flex;', ''.join(_css) + '.dft{position:absolute;inset:0;display:flex;')

_JS51 = (
    "(function(){try{const N=['0','1','2','3','4','5','6','7','8','9','slash'];let ok=0,bad=0;"
    "const SEL='.cd.af .nm i,.cd.af>.pt,.cd.af .ob';"
    "function dgz(root){if(ok<N.length||bad||!root||!root.querySelectorAll)return;"
    "const els=[...(root.matches&&root.matches(SEL)?[root]:[]),...root.querySelectorAll(SEL)];"
    "for(const el of els){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),L=[];while(w.nextNode())L.push(w.currentNode);"
    "let any=false;for(const t of L){if(!/[0-9\\/]/.test(t.data))continue;any=true;const f=document.createDocumentFragment();"
    "for(const ch of t.data){if(/[0-9]/.test(ch)||ch=='/'){const s=document.createElement('span');s.className='dg '+(ch=='/'?'ds':'d'+ch);s.setAttribute('aria-hidden','true');f.append(s)}"
    "else f.append(ch)}t.replaceWith(f)}if(any&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',el.textContent||'')}}"
    "for(const n of N){const im=new Image();im.onload=()=>{ok++;if(ok==N.length)dgz(document.body)};im.onerror=()=>{bad++};im.src='art/game/digits/'+n+'.png'}"
    "new MutationObserver(ms=>{if(ok<N.length||bad)return;for(const m of ms)for(const n of m.addedNodes){if(n.nodeType==1)dgz(n);"
    "else if(n.nodeType==3&&n.parentElement)dgz(n.parentElement.closest('.cd')||n.parentElement)}}).observe(document.body,{childList:true,subtree:true})"
    "}catch(e){}})();"
)
_b3("fit();try{addEventListener('resize',fit)}catch(e){}", _JS51 + "fit();try{addEventListener('resize',fit)}catch(e){}")


# Long names get a smaller size so the bigger cost medallion never cuts them off.
_NM_OLD = """<div class="nm"><b>${d[0]}${k}</b>${cc||(d[2]!='E'&&d[1]===0)?"""
_NM_NEW = """<div class="nm"><b${d[0].length>22?' class="nx"':d[0].length>16?' class="nl"':''}>${d[0]}${k}</b>${cc||(d[2]!='E'&&d[1]===0)?"""
_b3(_NM_OLD, _NM_NEW)
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.cd.af .nm b.nl{font-size:.72em;letter-spacing:-.01em}.cd.af .nm b.nx{font-size:.62em;letter-spacing:-.02em}'
    '.dft{position:absolute;inset:0;display:flex;')


# The Offering badge as a coin (Ben): a round silver-grey coin with a raised rim, the skull embossed
# faintly into its face, and the number struck on top in the woodcut numerals.
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.cd.af .ar>.ob{width:2.4em;height:2.4em;padding:0!important;border-radius:50%;display:flex;align-items:center;justify-content:center;'
    'background:radial-gradient(circle at 36% 30%,#f2f0ea,#c4beb1 40%,#958e80 72%,#6e675b);color:#1d1810;'
    'border:1px solid #39342b;box-shadow:inset 0 0 0 2px #aaa497,inset 0 0 0 3px #5a5449,inset 0 -2px 4px #0006,0 1px 3px #000b}'
    '.cd.af .ar>.ob::before{content:"";position:absolute;inset:16%;border-radius:50%;background:url(art/game/icons/offering.png) center/contain no-repeat;'
    'opacity:.55;filter:grayscale(1) contrast(1.4) brightness(.9);pointer-events:none}'
    '.cd.af .ar>.ob .obi{display:none}'
    '.cd.af .ar>.ob .dg{position:relative;height:1.25em}'
    '.dft{position:absolute;inset:0;display:flex;')


# The coin is a painted, worn silver drachma (art/game/icons/coin.png, same weathered style as the
# frames) and smaller than the cost medallion: 14.5% of the art window is ~12% of the card width,
# against the medallion's ~14%. The number sits on it with a faint light halo so it reads over the relief.
_b3('.dft{position:absolute;inset:0;display:flex;',
    '.cd.af .ar>.ob{width:14.5%;height:auto;aspect-ratio:1;padding:0!important;border:0;border-radius:50%;'
    'background:url(art/game/icons/coin.png) center/contain no-repeat;box-shadow:none;filter:drop-shadow(0 1px 2px #000c)}'
    '.cd.af .ar>.ob::before{display:none}'
    '.cd.af .ar>.ob .dg{height:56%;filter:drop-shadow(0 0 .6px #f3efe4) drop-shadow(0 0 .6px #f3efe4) drop-shadow(0 0 1px #f3efe4cc)}'
    '.dft{position:absolute;inset:0;display:flex;')
