# patch_fightlayout: fight-screen layout glitches from Ben's playtest (every hero; checked at ~900px and full width).
# 1. Action buttons covered the right of the hand. .ctl is now a fixed-width column (buttons wrap their label;
#    the frame's 26px side borders are slimmed to 16px so labels fit in one or two lines; zoom capped at 1.15 so
#    the column stays short on big screens)
#    and the hand reserves that column as right padding, so fitHand() squeezes the cards into the space left.
# 2. Stale prompt. Picking a target for a spell/equip/Bow left G.msg on "Choose a target army member." after the
#    choice resolved. The target branch of hd0 clears it, and render drops any targeting prompt whose choice is gone
#    (e.g. the turn ended mid-choice).
# 3. The battle log carried over into the next fight. fight() now starts with an empty log and message.
# 4. Long enemy names wrapped the header. The name, life and Army counter share one grid row; only the name
#    column can shrink (ellipsis, full name in the tooltip). Mana, foresight and the clock badge stay below.
# 5. Items/modifiers overlapped (-38px margins) and hid each other's names. No overlap now: one or two sit side
#    by side at full size; three shrink into one row; four or more shrink further into two rows. The player's
#    row sits at the top of their field (and shrinks on windows 720px tall or less) so the button column
#    (bottom right) never reaches it.
# 6. The top-right log box clamped to 3 lines and cut sentences. Each entry is its own line and the box
#    scrolls (kept at the newest entry) instead of clipping.
# 7. Mana 10+ stacked both digit images in one grid cell. Multi-digit numbers are now spread side by side.
# 8. The map ignored the map screen's 120px side padding when picking its zoom, so at ~900px it ran 96px off the
#    right edge. The map screen's padding is now 12px, matching the zoom's (innerWidth-24) budget.
# 9. Wukong's Momentum line (one 234px line) widened the player panel. It now breaks after the Momentum count.

_b3("const t=k=='e'?sf(e):k=='p'?sf(p):(k=='ef'||k=='pf')?k:0;G.mode=0;",
    "const t=k=='e'?sf(e):k=='p'?sf(p):(k=='ef'||k=='pf')?k:0;G.mode=0;G.msg='';")
_b3('<div class="eh"><b>', '<div class="eh"><b title="${e.nm}">')
_b3("<small>${G.log.join(' · ')}</small>", "<small>${G.log.map(x=>'<span class=\"lgl\">'+x+'</span>').join('')}</small>")

_JSFL = r"""
/* ===== patch_fightlayout: fight-screen layout fixes ===== */
{const f0=fight;fight=function(){if(G){G.log=[];G.msg=''}return f0.apply(this,arguments)}}
{const w0=wkBar;wkBar=function(){const s=w0.apply(this,arguments);return s?s.replace('class="cn"','class="cn wkb"').replace(/ · (\d+ played)/,'<br>$1'):s}}
{const r0=render;render=function(){try{if(G&&G.msg&&!(G.mode&&G.mode.tgt)&&!G.pend){const m=G.msg;if(Object.values(TSM).includes(m)||/^Choose one of your army members to wear /.test(m))G.msg=''}}catch(e){}
 const out=r0.apply(this,arguments);try{const s=document.querySelector('#app>.mid small');if(s)s.scrollTop=s.scrollHeight}catch(e){}return out}}
try{const st=document.createElement('style');st.id='pfl';st.textContent=`
html .me .orb>.dg:has(+.dg){transform:translate(calc(var(--mx2,0px) - 50%),var(--my2,9px))}
html .me .orb>.dg+.dg{transform:translate(calc(var(--mx2,0px) + 50%),var(--my2,9px))}
html .me .orb>.dg:has(+.dg+.dg){transform:translate(calc(var(--mx2,0px) - 100%),var(--my2,9px))}
html .me .orb>.dg+.dg:has(+.dg){transform:translate(var(--mx2,0px),var(--my2,9px))}
html .me .orb>.dg+.dg+.dg{transform:translate(calc(var(--mx2,0px) + 100%),var(--my2,9px))}
#app>.mid small{display:block;-webkit-line-clamp:unset;max-height:7.4em;overflow-x:hidden;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#c9a24c66 transparent}
#app>.mid small .lgl{display:block}
#app>.mid small .lgl+.lgl{margin-top:2px}
html:not(.ph) .dft.mapscr{padding-left:12px;padding-right:12px}
html:not(.ph) .me .wkb{text-align:center;line-height:1.25;white-space:nowrap}
html:not(.ph) .itc{gap:10px}
html:not(.ph) .fe .itc{column-gap:14px}
html:not(.ph) .itc .cd+.cd{margin-left:0}
@media (min-width:561px){
 html:not(.ph) .eh{z-index:2;padding-right:14px;display:grid;grid-template-columns:minmax(0,max-content) max-content max-content 1fr;align-items:baseline}
 html:not(.ph) .eh>b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.02em;margin-right:8px}
 html:not(.ph) .eh>.hp,html:not(.ph) .eh>span.cn:not(.clk){white-space:nowrap}
 html:not(.ph) .eh>:not(b):not(.hp):not(span.cn:not(.clk)):not(u){grid-column:1/-1}
 html:not(.ph) .ctl{zoom:min(var(--zu,1.4),1.15);width:176px;align-items:stretch;gap:5px}
 html:not(.ph) .ctl .b{width:100%;white-space:normal;line-height:1.15;border-width:7px 16px;padding:5px 4px;min-height:0;font-size:12.5px}
 html:not(.ph) .fp .itc{align-self:flex-start}
 html:not(.ph) .hand{padding-right:calc(176px * min(var(--zu,1.4),1.15) / var(--zc,1.25) + 26px)}
 html:not(.ph) .itc:has(>.cd:nth-child(3)){display:grid;grid-auto-flow:column;gap:6px 18px;align-content:start}
 html:not(.ph) .fe .itc:has(>.cd:nth-child(3)){column-gap:24px}
 html:not(.ph) .itc:has(>.cd:nth-child(3))>.cd{zoom:calc(var(--czf,1) * .68)}
 html:not(.ph) .itc:has(>.cd:nth-child(4)){grid-template-rows:auto auto}
 html:not(.ph) .itc:has(>.cd:nth-child(4))>.cd{zoom:calc(var(--czf,1) * .6)}
}
@media (min-width:561px) and (max-height:720px){
 html:not(.ph) .fp .itc>.cd{zoom:calc(var(--czf,1) * .78)}
 html:not(.ph) .fp .itc:has(>.cd:nth-child(3))>.cd{zoom:calc(var(--czf,1) * .6)}
 html:not(.ph) .fp .itc:has(>.cd:nth-child(4)){grid-template-rows:none}
 html:not(.ph) .fp .itc:has(>.cd:nth-child(4))>.cd{zoom:calc(var(--czf,1) * .5)}
}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSFL + "showChars();\n</script>")
