# patch_settings: a settings button and panel (Ben, Nov 2026).
# - Home screen: a gear medallion (#setb) in the empty slot right of the painted sound horn (where the in-run menu
#   button sits). Icon: art/game/icons/settings.svg, drawn as SVG in the horn's bronze-ring / blue-field style;
#   the Card art session can paint a PNG and swap the url.
# - Panel (#seto, parchment): Sound on/off, Volume (0-100, scales the SFX master gain), Animations full/reduced,
#   and on the home screen How to play and Reset progress (with a confirm step).
# - In a run, the menu (patch28) gets a Settings entry with the sound, volume and animation settings; End run and
#   the rest of that menu are unchanged. How to play and Reset progress are home-only so they can't drop a run.
# - Saved like everything else, in localStorage: myth_mute (existing), myth_vol, myth_rmo.
# - Reduced animations: RMO() (patch's prefers-reduced-motion check that gates GSAP) reports true via a
#   matchMedia wrapper, Web Animations get a 1ms duration, and CSS animations/transitions collapse to their end state.
# - Reset progress clears the saved run (mythologica_run_v1), finished lessons and tip history: every myth* key
#   except the settings (sound, volume, animations, tips on/off). Then it reloads. The game has no other
#   meta-progression saved (prestige lives inside the saved run).

_b3("master.gain.value=muted?0:.55;", "master.gain.value=muted?0:.55*SVOL();")
_b3("master.gain.value=m?0:.55;", "master.gain.value=m?0:.55*SVOL();")
_b3("return{play,btn,setMuted,get muted(){return muted}}",
    "return{play,btn,setMuted,get muted(){return muted},vol(){if(master)master.gain.value=muted?0:.55*SVOL()}}")
_b3('<button class="b" id="mnu_end">End run</button>', '<button class="b" id="mnu_set">Settings</button><button class="b" id="mnu_end">End run</button>')

_JSSET = r"""
/* ===== patch_settings: settings button + panel ===== */
function SVOL(){const v=parseFloat(lsGet('myth_vol','100'));return isFinite(v)?Math.max(0,Math.min(100,v))/100:1}
const SETKEEP=['myth_mute','myth_vol','myth_rmo','myth_tips'];
function setRmo(){try{document.documentElement.classList.toggle('rmo',lsGet('myth_rmo','0')=='1')}catch(e){}}
try{const mm=window.matchMedia&&window.matchMedia.bind(window);if(mm)window.matchMedia=q=>{if(lsGet('myth_rmo','0')=='1'&&/prefers-reduced-motion:\s*reduce/.test(q))return{matches:true,media:q,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false}};return mm(q)}}catch(e){}
try{const an=Element.prototype.animate;if(an)Element.prototype.animate=function(k,o){if(document.documentElement.classList.contains('rmo'))o=typeof o=='number'?1:Object.assign({},o||{},{duration:1,delay:0,endDelay:0,iterations:1});return an.call(this,k,o)}}catch(e){}
function setPanel(view){let o=document.getElementById('seto');if(!o){o=document.createElement('div');o.id='seto';document.body.appendChild(o);
  o.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(e.target===o)return setClose();if(!b)return;const k=b.dataset.s;
   if(k=='close')return setClose();
   if(k=='snd'){try{SFX.setMuted(!SFX.muted);if(!SFX.muted)SFX.play('click')}catch(x){}return setPanel()}
   if(k=='rmo'){lsSet('myth_rmo',lsGet('myth_rmo','0')=='1'?'0':'1');setRmo();return setPanel()}
   if(k=='how'){setClose();try{tutBt('tutmenu')}catch(x){}return}
   if(k=='reset')return setPanel('reset');
   if(k=='back')return setPanel();
   if(k=='doreset'){try{const ks=[];for(let i=0;i<localStorage.length;i++){const n=localStorage.key(i);if(n&&/^myth/.test(n)&&!SETKEEP.includes(n))ks.push(n)}ks.forEach(n=>localStorage.removeItem(n))}catch(x){}location.reload();return}});
  o.addEventListener('input',e=>{if(e.target.id=='setvol'){lsSet('myth_vol',e.target.value);try{SFX.vol()}catch(x){}const l=document.getElementById('setvl');if(l)l.textContent=e.target.value}});
  o.addEventListener('change',e=>{if(e.target.id=='setvol'){try{if(!SFX.muted)SFX.play('click')}catch(x){}}})}
 const home=!G||!G.phase||G.phase=='char',muted=(()=>{try{return SFX.muted}catch(e){return false}})(),rmo=lsGet('myth_rmo','0')=='1',v=Math.round(SVOL()*100);
 o.innerHTML=view=='reset'?`<div class="box"><div class="t">Reset progress?</div><div>This clears your saved run, the lessons you have finished and which tips you have seen, on this device. Your sound and animation settings stay. This cannot be undone.</div><button class="b warn" data-s="doreset">Yes, reset progress</button><button class="b g" data-s="back">Cancel</button></div>`
 :`<div class="box"><div class="t">Settings</div>
  <div class="srow"><span>Sound</span><button class="b sm" data-s="snd" aria-pressed="${!muted}">${muted?'Off':'On'}</button></div>
  <label class="srow" for="setvol"><span>Volume <b id="setvl">${v}</b></span><input type="range" id="setvol" min="0" max="100" step="5" value="${v}"${muted?' disabled':''}></label>
  <div class="srow"><span>Animations</span><button class="b sm" data-s="rmo" aria-pressed="${!rmo}">${rmo?'Reduced':'Full'}</button></div>
  <div class="acts">${home?'<button class="b" data-s="how">How to play</button><button class="b g" data-s="reset">Reset progress</button>':''}<button class="b g" data-s="close">Close</button></div></div>`;
 o.classList.add('on')}
function setClose(){const o=document.getElementById('seto');if(o)o.classList.remove('on')}
try{setRmo();const b=document.createElement('button');b.id='setb';b.title='Settings';b.setAttribute('aria-label','Settings');b.addEventListener('click',e=>{e.stopPropagation();setPanel()});document.body.appendChild(b);
 document.addEventListener('click',e=>{if(e.target&&e.target.id=='mnu_set'){const m=document.getElementById('mnuo');if(m)m.classList.remove('on');setPanel()}});
 document.addEventListener('keydown',e=>{if(e.key=='Escape')setClose()});
 const st=document.createElement('style');st.id='pset';st.textContent=`
#setb{display:none;position:fixed;top:calc(6px + env(safe-area-inset-top,0px));right:max(4px,env(safe-area-inset-right,0px));z-index:300;width:40px;height:40px;padding:0;border:0;border-radius:50%;cursor:pointer;background:url(art/game/icons/settings.svg) center/contain no-repeat;filter:drop-shadow(0 2px 4px #000c)}
html:has(.chrow) #setb{display:block}
html.ph:has(.chrow) #setb{width:34px;height:34px}
#setb:hover{filter:drop-shadow(0 2px 4px #000c) drop-shadow(0 0 8px #e8c35a)}
#seto{position:fixed;inset:0;z-index:320;display:none;place-items:center;background:#000a;padding:16px}
#seto.on{display:grid}
#seto .box{display:flex;flex-direction:column;gap:12px;align-items:stretch;width:min(340px,86vw);box-sizing:border-box;padding:16px 20px;text-align:center;font:16px/1.4 var(--fb);color:#1d150b;
 background:radial-gradient(at 30% 20%,#d6c39a33,#0000 45%),radial-gradient(at 78% 82%,#5a3d1a2e,#0000 50%),radial-gradient(at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%);
 border:16px solid #5e4520;border-image:url(art/game/frames/u.jpg) 58/16px round;border-radius:6px;box-shadow:0 14px 40px #000d}
html[data-hero=odin] #seto .box{border-image-source:url(art/game/frames/ou.jpg)}
html[data-hero=wukong] #seto .box{border-image-source:url(art/game/frames/wu.jpg)}
html[data-hero=thoth] #seto .box{border-image-source:url(art/game/frames/tu.jpg)}
#seto .t{font:400 22px/1.1 var(--fd);color:#7a2a12;letter-spacing:.04em}
#seto .srow{display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left}
#seto .srow b{color:#7a3a08;font-weight:400}
#seto .b.sm{min-width:96px}
#seto input[type=range]{width:52%;accent-color:#8a5a14;cursor:pointer}
#seto input[type=range]:disabled{opacity:.4;cursor:default}
#seto .b.g{background:#5a4a33;color:#efe6cf;box-shadow:none}
#seto .b.warn{background:#7a2414;color:#fbe9cf}
#seto .box{max-height:calc(100dvh - 24px);overflow:auto}
#seto .acts{display:flex;flex-direction:column;gap:inherit}
html.ph #seto .box{font-size:14px;gap:9px;padding:10px 12px}
@media (max-height:500px){#seto .box{width:min(560px,92vw);gap:6px;padding:8px 16px;font-size:14px}#seto .t{font-size:18px}#seto .b{min-height:0!important;padding:6px 10px!important;font-size:13px!important;line-height:1.2!important}#seto .acts{flex-direction:row}#seto .acts .b{flex:1 1 0}}
html.rmo *,html.rmo *::before,html.rmo *::after{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.01ms!important;transition-delay:0s!important;scroll-behavior:auto!important}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSSET + "showChars();\n</script>")
