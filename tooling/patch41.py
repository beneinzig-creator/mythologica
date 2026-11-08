# v98: hero select, progressive disclosure.
# Tiles show only icon, name and archetypes; clicking one opens a single detail panel
# (quote, playstyle, library buttons, Begin). Nothing else is on screen until you pick.

_b3("const boxes=Object.keys(CHARS).map(k=>{const c=CHARS[k];return`<div class=\"chbox\" style=\"border:2px solid #d8b45a;border-radius:14px;padding:18px 22px;background:#0008;flex:1 1 0;max-width:400px;min-width:min(290px,86vw);box-sizing:border-box;text-align:center\"><div style=\"font-size:48px\">${c.ic}</div><div class=\"ovt\" style=\"font-size:26px\">${c.n}</div><div class=\"dsub\" style=\"margin:6px 0 8px;font-style:italic\">${c.quote}</div><div class=\"dsub\" style=\"margin:0 0 12px\"><b>Playstyle:</b> ${c.play}</div><button class=\"b\" data-b=\"startcards:${k}\">Starting cards</button> <button class=\"b\" data-b=\"fullib:${k}\">See full library</button> <button class=\"b\" data-b=\"pick:${k}\">Choose ${c.n}</button></div>`}).join('');",
"""const hs=G.hs&&CHARS[G.hs]?G.hs:'';
const boxes=Object.keys(CHARS).map(k=>{const c=CHARS[k];return`<button class="htile${k==hs?' on':''}" data-b="hsel:${k}"><span class="hic">${c.ic}</span><span class="hnm">${c.n}</span><span class="har">${(c.arch||[]).map(a=>a[1]).join(' · ')}</span></button>`}).join('');
const HS=hs&&CHARS[hs],hq=HS?(HS.quote.match(/^(".*?")\\s*(.*)$/)||[0,HS.quote,'']):0;
const hdet=`<div class="hdw">${HS?`<div class="hdet"><div class="hq">${hq[1]}</div>${hq[2]?`<div class="hlo">${hq[2]}</div>`:''}<div class="hpl">${HS.play.replace(/\\s*\\d+ life\\.\\s*$/,'')}</div><button class="b hgo" data-b="pick:${hs}">Begin as ${HS.n}</button><div class="hbt"><button class="b gh" data-b="startcards:${hs}">Starting cards</button><button class="b gh" data-b="fullib:${hs}">Full card pool</button></div></div>`:`<div class="hhint">Select a hero</div>`}</div>`;""")

_b3("""<div class="chrow" style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:stretch;margin:10px 0;width:min(1240px,98vw)">${boxes}</div>""",
"""<div class="chrow">${boxes}</div>${hdet}""")

_b3("if(b.startsWith('fullib')){","if(b.startsWith('hsel:')){const k=b.slice(5);G.hs=G.hs==k?'':k;return render()}if(b.startsWith('fullib')){")

HCSS = (
".chrow{display:flex;gap:16px;justify-content:center;margin:6px 0 0;width:min(700px,94vw)}"
".htile{font:inherit;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:6px;flex:1 1 170px;max-width:210px;min-width:0;box-sizing:border-box;padding:26px 14px 22px;"
"background:#0006;border:1px solid #d8b45a33;border-radius:14px;cursor:pointer;transition:border-color .15s,box-shadow .15s,transform .15s,opacity .15s}"
".htile:hover{border-color:#d8b45a99;transform:translateY(-2px)}"
".htile.on{border-color:var(--gold);box-shadow:0 0 22px var(--gl);background:#000a}"
".chrow:has(.on) .htile:not(.on){opacity:.55}.chrow:has(.on) .htile:not(.on):hover{opacity:.85}"
".hic{font-size:52px;line-height:1.1}.hnm{font-size:24px;letter-spacing:.02em}"
".har{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.55}"
".hdw{min-height:270px;width:min(620px,92vw);display:flex;justify-content:center;align-items:flex-start}"
".hdet{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;animation:hfade .2s ease-out}"
"@keyframes hfade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}"
".hq{font-style:italic;font-size:18px;color:var(--gold)}.hlo{font-style:italic;font-size:14px;opacity:.6;max-width:520px}"
".hpl{font-size:15px;line-height:1.5;max-width:560px;margin:4px 0 6px}"
".b.hgo{font-size:19px;padding:10px 30px}"
".hbt{display:flex;gap:10px}.b.gh{background:none;color:var(--gold);box-shadow:none;border:1px solid #e0b04a55;font-size:13px;font-weight:400;min-width:0;padding:5px 14px}"
".b.gh:hover{border-color:var(--gold)}"
".hhint{font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.4;margin-top:18px}"
"@media(max-width:640px){.chrow{gap:8px}.htile{padding:16px 6px 14px}.hic{font-size:34px}.hnm{font-size:18px}.har{font-size:9px;letter-spacing:.06em}.hdw{min-height:0}}"
"html.ph .chrow{gap:8px!important;flex-wrap:nowrap!important}html.ph .htile{max-width:none}html.ph .htile{width:auto;flex:1 1 0;padding:8px 6px;gap:2px}html.ph .hic{font-size:24px}html.ph .hnm{font-size:16px}html.ph .har{font-size:9px}"
"html.ph .hdw{min-height:0}html.ph .hdet{gap:5px}html.ph .hq{font-size:12px}html.ph .hlo{display:none}html.ph .hpl{font-size:11px;margin:0}html.ph .b.hgo{font-size:14px;padding:5px 18px}html.ph .hhint{margin-top:6px}"
)
_b3(".dft{position:absolute;inset:0;display:flex;", HCSS + ".dft{position:absolute;inset:0;display:flex;")
