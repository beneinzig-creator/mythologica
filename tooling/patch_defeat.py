# patch_defeat: a new defeat screen (Ben, Nov 2026: "the Fallen picture looks weird").
# What read as weird: "Fallen" was split across two cracked parchment halves (it read "FAL LEN"), floating over the middle
# of the painting and covering its subject, the paintings' subjects were cropped at the edges, the New run / Copy run
# report buttons stayed in the fight screen's corner, and card backs and piles showed through at the top.
# Now:
# - A new solemn painting for each hero, and one for an Act III loss (art/game/icons/[<dir>/]defeat2.jpg), composed
#   with quiet sky in the upper middle for the title and the subject low and whole, so cropping to any window is safe.
# - The overlay covers the whole fight. One "Fallen" title in large letters with a thin rule under it, the hero's name
#   and where the run ended under that, and the two buttons centred beneath, all in one column near the top.
# - It fades in with CSS (so it also appears when animations are reduced), and the painting is preloaded during the
#   fight, so the loader never needs to show.
_NEW = r"""function fxLost(){if(document.getElementById('fxlost'))return;try{SFX.play('dirge')}catch(e){}const o=document.createElement('div');o.id='fxlost';o.className='v2';
 const nm=typeof CHN=='function'?CHN():'Your hero',m=(()=>{try{if(!G||!G.e)return '';return (G.a3?'Act III · ':G.a2?'Act II · ':'')+(G.boss?'Against the guardian':'Fight '+(G.fi+1)+' of '+FLOORS)+': '+(G.e.nm||'')}catch(e){return ''}})();
 o.innerHTML=`<div class="fl2"><div class="fl2-k">Fallen</div><i class="fl2-r"></i><div class="fl2-s">${nm} has fallen</div>${m?`<div class="fl2-w">${m}</div>`:''}<div class="fl2-b"><button class="b" data-fl="new">New run</button><button class="b gh" data-fl="rep">Copy run report</button></div></div>`;
 o.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fl]');if(!b)return;const g=document.querySelector('#app [data-b="'+b.dataset.fl+'"]');if(g)g.click()});
 document.body.appendChild(o)}"""
import re as _rd
for _nm in ('head', 'mid', 'tail', 'A', 'B'):
    _t = globals()[_nm]
    _i = _t.find('function fxLost(){')
    if _i >= 0:
        _j = _t.find('\n', _t.find("from(o.querySelector('.fxtab-s')", _i))
        assert _j > _i
        globals()[_nm] = _t[:_i] + _NEW + _t[_j:]
        break
else:
    raise AssertionError('fxLost not found')
_DF = {'ody': 'defeat2.jpg', 'odin': 'odin/defeat2.jpg', 'wukong': 'wukong/defeat2.jpg', 'thoth': 'thoth/defeat2.jpg'}
_css = ''.join(f'html[data-hero="{h}"] #fxlost.v2{{background-image:linear-gradient(#000c,#0000 26%,#0000 58%,#000d),url(art/game/icons/{p})!important}}' for h, p in _DF.items())
_css += 'html[data-realm="act3"][data-hero] #fxlost.v2{background-image:linear-gradient(#000c,#0000 26%,#0000 58%,#000d),url(art/game/icons/act3/defeat2.jpg)!important}'
_css += (
    'html[data-hero] #fxlost.v2{position:fixed;inset:0;z-index:250;pointer-events:auto;background-color:#06080a!important;background-position:50% 64%!important;'
    'background-size:cover!important;background-repeat:no-repeat!important;animation:fl2in 1.1s ease-out both}'
    '#fxlost.v2 .fl2{position:absolute;left:50%;top:max(7vh,56px);transform:translateX(-50%);width:min(760px,92vw);display:flex;flex-direction:column;align-items:center;'
    'text-align:center;gap:clamp(6px,1.2vh,12px);animation:fl2up 1.3s .25s ease-out both}'
    '#fxlost.v2 .fl2-k{font:700 clamp(54px,8.5vw,118px)/.95 var(--fd);letter-spacing:.14em;padding-left:.14em;color:#eadcbc;'
    'text-shadow:0 3px 0 #0009,0 0 30px #000,0 0 60px #000c}'
    '#fxlost.v2 .fl2-r{display:block;width:min(420px,60%);height:2px;background:linear-gradient(90deg,#0000,#c9a24ccc,#0000);margin:2px 0 4px}'
    '#fxlost.v2 .fl2-s{font:italic 400 clamp(17px,1.9vw,24px)/1.25 var(--fb,Georgia),serif;color:#f1e6cc;text-shadow:0 1px 2px #000,0 0 14px #000}'
    '#fxlost.v2 .fl2-w{font:400 clamp(12px,1.25vw,15px)/1.3 var(--fb,Georgia),serif;letter-spacing:.06em;color:#d8c9a8;text-shadow:0 1px 2px #000,0 0 10px #000}'
    '#fxlost.v2 .fl2-b{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:clamp(10px,2.4vh,26px)}'
    '#fxlost.v2 .fl2-b .b{font-size:clamp(15px,1.4vw,19px)}'
    '@keyframes fl2in{from{opacity:0}to{opacity:1}}@keyframes fl2up{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}'
    'html.ph #fxlost.v2 .fl2-b .b{font-size:13px!important;min-height:0!important;padding-top:3px!important;padding-bottom:3px!important}html.ph[data-hero] #fxlost.v2{background-position:50% 72%!important}html.ph #fxlost.v2 .fl2{top:max(4vh,40px);gap:4px}html.ph #fxlost.v2 .fl2-k{font-size:clamp(40px,11vh,64px)}html.ph #fxlost.v2 .fl2-b{margin-top:8px}'
)
_b3('.dft{position:absolute;inset:0;display:flex;', _css + '.dft{position:absolute;inset:0;display:flex;')
# preload the defeat painting during a fight, so it is ready if the fight is lost
_b3('\nshowChars();\n</script>',
    "\n{const _rD=render;let dfp='';render=function(){const x=_rD.apply(this,arguments);try{if(G&&G.e&&G.phase=='main'&&typeof ldPre=='function'){"
    "const r=RLM(),h=CH,u='art/game/icons/'+(r=='act3'?'act3/':({ody:'',odin:'odin/',wukong:'wukong/',thoth:'thoth/'})[h]||'')+'defeat2.jpg';if(u!==dfp){dfp=u;ldPre([u])}}}catch(e){}return x}}"
    '\nshowChars();\n</script>')
