# v122 (patch68): bigger card text, bolder centred names, and a mana display that is just the mana symbol.
# 1. Card text starts bigger (rules 8px -> 10px, type line +11%, names +29%) and the fitter (fitCard, patch5x)
#    shrinks it only as far as each card needs. It now binary-searches the largest size that fits (the old
#    5-7% steps could land a size below what fitted), and caches results per card text and box size.
# 2. Rules text no longer runs under the power/health badge: a float shaped to the badge's corner makes the
#    last lines wrap around it (Jormungandr's "Resilient." and Bragi's last line sat under the badge).
# 3. Names: the font (IM Fell English) has no bold and font synthesis is off, so a heavier stroke plus a
#    1-pixel horizontal shadow thicken it. Names are centred, may overflow the name box vertically onto the
#    painted plate (the box was shorter than the plate and capped them at 7.4px), and are fitted by their real
#    width with overflow switched to hidden just while measuring (overflow-x:clip, which lets the name spill
#    vertically, hides the overflow from scrollWidth). 'safe center' keeps a long name from spilling off the left.
#    Each card reads its boxes in one pass and cached cards (most renders) apply stored sizes without measuring.
#    Symbols in the text are swapped for icon images after the fit, so each card is checked again right after,
#    fitted again when those images load, and a measurement taken before they loaded is never cached.
# 4. Mana (bottom left): no circle; the hero's mana symbol is drawn larger with the number on it. Odysseus's
#    drop takes a dark number inside the drop; Odin's horn, Wukong's gourd and Thoth's jug are objects pouring
#    a drop too small to hold it, so the number sits on the object's body in light ink with a dark outline.

_b3("const fitCard=cd=>{if(!cd.classList.contains('af')||!cd.offsetWidth)return;for(const el of cd.querySelectorAll(':scope>.tx,:scope>.ty,:scope>.nm b')){el.style.fontSize='';let fs=parseFloat(getComputedStyle(el).fontSize),min=fs*.55,i=0;const over=()=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;while(over()&&fs>min&&i<16){fs*=.93;el.style.fontSize=fs+'px';i++}}};",
    r"""const FIT68=(window.FIT68=new Map());const fitCard=cd=>{if(!cd.classList.contains('af')||!cd.offsetWidth)return;const pt=cd.querySelector(':scope>.pt'),els=[...cd.querySelectorAll(':scope>.tx,:scope>.ty,:scope>.nm b')];
 els.forEach(el=>{el.style.fontSize=''});
 const P=pt?[pt.offsetLeft,pt.offsetTop]:null,info=els.map(el=>({el,key:cd.className+'|'+el.className+'|'+el.innerHTML+'|'+el.clientWidth+'x'+el.clientHeight})),miss=[];
 const setB=(el,b)=>{el.style.setProperty('--pw',b[0]+'px');el.style.setProperty('--ph',b[1]+'px')};
 for(const it of info){const c=FIT68.get(it.key);if(c){if(c.f)it.el.style.fontSize=c.f+'px';if(c.b)setB(it.el,c.b)}else miss.push(it)}
 for(const {el,key} of miss){const isN=el.tagName=='B',isT=el.classList.contains('tx'),bdg=isT&&P&&el.classList.contains('c');let b=null;
  const badge=()=>{if(!bdg)return;const cs=getComputedStyle(el),pw=el.offsetLeft+el.offsetWidth-parseFloat(cs.paddingRight)-P[0]+1,ph=el.offsetTop+el.offsetHeight-parseFloat(cs.paddingBottom)-P[1]+1,on=pw>0&&ph>0;b=[on?pw:0,on?ph:0];setB(el,b)};
  if(isN)el.style.overflow='hidden';
  const over=()=>isN?el.scrollWidth>el.clientWidth:(el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1);
  const at=f=>{el.style.fontSize=f+'px';badge();return!over()};
  const fs=parseFloat(getComputedStyle(el).fontSize);badge();let f=0;
  if(over()){let lo=fs*(isT?.45:.5),hi=fs;if(at(lo)){for(let i=0;i<8;i++){const m=(lo+hi)/2;if(at(m))lo=m;else hi=m}}at(lo);f=lo}
  if(isN)el.style.overflow='';
  if(![...el.querySelectorAll('img')].some(im=>!im.complete))FIT68.set(key,{f,b});if(FIT68.size>4000)FIT68.clear()}
 const sig=els.map(e=>e.innerHTML.length).join();if(!cd.__f68){cd.__f68=1;setTimeout(()=>{if(cd.isConnected&&els.map(e=>e.innerHTML.length).join()!==sig)fitCard(cd)},0)}
 for(const im of cd.querySelectorAll(':scope>.tx img,:scope>.ty img,:scope>.nm b img'))if(!im.complete&&!im.__f68){im.__f68=1;im.addEventListener('load',()=>{if(cd.isConnected)fitCard(cd)},{once:true})}};""")

_JS68 = r"""
/* ===== v122 (patch68): card text, names, mana symbol ===== */
try{const st=document.createElement('style');st.id='p68';st.textContent=`
html .cd.af .nm b{font-size:1.06em;justify-content:safe center;overflow-x:clip;overflow-y:visible;padding-left:.3em}
html .cd .nm b{-webkit-text-stroke:.07em currentColor;text-shadow:.035em 0 0 currentColor}
html .cd.af>.tx{font-size:10px;padding:calc(.36em + 1px) calc(.55em + 1.5px)}
html .cd.af>.ty{font-size:.8em}
html .cd.af>.tx.c::before{content:'';float:right;width:var(--pw,0px);height:100%;shape-outside:polygon(0 calc(100% - var(--ph,0px)),100% calc(100% - var(--ph,0px)),100% 100%,0 100%)}
html .me .orb{background:none!important;border:0!important;box-shadow:none!important;border-radius:0!important;width:62px!important;height:62px!important;display:grid!important;place-items:center;gap:0!important;padding:0!important;position:relative;overflow:visible}
html .me .orb::before,html .me .orb::after{display:none!important}
html .me .orb>.ico{grid-area:1/1;width:62px!important;height:62px!important;filter:drop-shadow(0 3px 5px #000b)}
html .me .orb>.dg{grid-area:1/1;height:19px!important;position:relative;z-index:1;color:#2a1804;transform:translate(var(--mx2,0px),var(--my2,9px));filter:drop-shadow(0 0 1px #fff3c4) drop-shadow(0 0 2px #fff3c499)}
html[data-hero=odin] .me .orb>.dg{--mx2:9px;--my2:-11px}
html[data-hero=wukong] .me .orb>.dg{--mx2:4px;--my2:-9px}
html[data-hero=thoth] .me .orb>.dg{--mx2:3px;--my2:2px}
html:is([data-hero=odin],[data-hero=wukong],[data-hero=thoth]) .me .orb>.dg{color:#fff6dc;filter:drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 1px 2px #000c)}
html.ph .me .orb,html.ph .me .orb>.ico{width:46px!important;height:46px!important}
html.ph .me .orb>.dg{height:15px!important}
`;document.body.appendChild(st)}catch(e){}
// the fitter measures text, so measure again once the embedded fonts have loaded
try{document.fonts&&document.fonts.ready.then(()=>{try{window.FIT68&&FIT68.clear();window.fitCards&&fitCards()}catch(e){}})}catch(e){}
"""
_b3("showChars();\n</script>", _JS68 + "showChars();\n</script>")
