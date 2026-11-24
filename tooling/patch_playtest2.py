# patch_playtest2: round-2 playtest fixes.
# 1. Missing frames. 18 Wukong-realm enemy cards use colour Y (Yellow Wind Ridge) or E (Erlang Shen, the Six-Eared
#    Macaque, Buddha's Palm trump). CO had no Y/E entry, so the card got --f:undefined, which made the whole
#    `background: var(--fr) ..., var(--f)` declaration invalid: no frame art. Their frame art already exists (afc()
#    picks wc/wu/wr/wls/...); only the fallback colour was missing. Added CO.Y and CO.E.
# 2. Header truncation. Medium names ("The Scorpions of Serket") ellipsized at ~900px. The name now shrinks its
#    font (down to 72%) to fit before it ellipsizes; re-fitted after the icon swap widens the life counter.
# 3. Odin's Blood price label fits on one line (no wrap, 11px, slimmer side frame for that button).
# 4. Phone held sideways. patch_polish toggled an html class named `phl` to mean "phase is lost", which also
#    switched OFF the phone-landscape class `phl` on every render, so none of the landscape phone rules applied
#    (action buttons laid out as a row of huge framed tiles over the field, hand padding wrong, etc). That
#    class is now `phlost`. On top of that, for phone landscape: bigger cards (fit to height), compact action
#    buttons in a right-hand column beside the hand (Blood price may take two lines there), and the prestige
#    (kleos) screen keeps its upgrade buttons clear of the hand (also on short non-touch windows, where the
#    hand is hidden while you pick upgrades; real phones use the phone layout because they report touch). The map's node bunching on short screens is fixed in patch_mapfull.

_b3("document.documentElement.classList.toggle('phl',!!(G&&G.phase=='lost'))",
    "document.documentElement.classList.toggle('phlost',!!(G&&G.phase=='lost'))")
_b3("html.phl #app>.decks,html.phl #app>.me{visibility:hidden!important}",
    "html.phlost #app>.decks,html.phlost #app>.me{visibility:hidden!important}")

_JSP2 = r"""
/* ===== patch_playtest2: round-2 playtest fixes ===== */
try{Object.assign(CO,{Y:'#d3b260',E:'#c9b98c'})}catch(e){}
function ehFit(){try{if(document.documentElement.classList.contains('ph'))return;const b=document.querySelector('#app .eh>b');if(!b)return;b.style.fontSize='';
 const f0=parseFloat(getComputedStyle(b).fontSize);let f=f0;while(b.scrollWidth>b.clientWidth&&f>f0*.72){f=Math.max(f0*.72,f-.5);b.style.fontSize=f+'px'}}catch(e){}}
{const r0=render;render=function(){const o=r0.apply(this,arguments);ehFit();setTimeout(ehFit,120);return o}}
try{addEventListener('resize',()=>setTimeout(ehFit,80))}catch(e){}
try{const st=document.createElement('style');st.id='pp2';st.textContent=`
html:not(.ph) .ctl .b[data-b=bp]{white-space:nowrap;letter-spacing:0;font-size:11px;padding-left:0;padding-right:0;border-left-width:12px;border-right-width:12px}
html:not(.ph) .ctl .b[data-b=bp] .ico{height:1.15em;margin:0 -1px}
html.ph.phl{--fw:min(76px,calc((var(--vh) - 84px)/4.5));--hw:var(--fw)}
html.ph.phl .fld.fe{padding-top:16px}
html.ph.phl .fld{padding-top:8px;padding-bottom:2px}
html.ph.phl .ctl{flex-direction:column;flex-wrap:nowrap;right:calc(6px + env(safe-area-inset-right,0px));bottom:6px;width:122px;max-width:none;gap:4px;align-items:stretch;justify-content:flex-end}
html.ph.phl .ctl .b{width:100%;min-height:0;white-space:nowrap;font-size:10.5px;line-height:1.1;padding:3px 2px;border-width:5px 11px;letter-spacing:0}
html.ph.phl .ctl .b .ico{height:1.1em}
html.ph.phl .ctl .b[data-b=bp]{white-space:normal}
html.ph.phl .hand{padding-right:136px}
html.phk .fld.fp{padding-right:136px}
html.phk .ko{flex-wrap:wrap;justify-content:center}
@media (max-height:520px){html:not(.ph) #app:has(.kc) .hand{visibility:hidden}}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSP2 + "showChars();\n</script>")
