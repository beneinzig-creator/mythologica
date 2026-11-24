# patch_loader: the Ouroboros loading screen, and no emoji ever while art is loading (Ben, Nov 2026).
# 1. Loader: a painted Ouroboros (art/game/icons/ouroboros.png) that slowly turns, chasing its tail. It covers the screen at
#    startup and whenever a new screen needs art that hasn't finished loading and decoding (the map, a fight, the draft, a new
#    act or realm, the pre-fight painting). It only appears if the art isn't ready within a moment, so a cached screen never
#    flashes it.
# 2. Preloading: on the map, the art for every fight you can walk to next (its fight background, pre-fight painting, deck art
#    and frames) loads quietly in the background, a few files at a time, so the loader rarely shows.
# 3. No emoji while loading or after a failure: card art no longer has the card's emoji behind it, the emoji-to-icon swap gives
#    its icons an empty alt text, and every image that used to fall back to an emoji (map places, gravestone, Offering badge,
#    amulet badges, clock, Name pip, swapped icons) now retries once and then leaves a blank, never an emoji.
# 4. Cards appear complete: a card with painted art stays hidden until both its frame and its picture have loaded (capped at
#    a few seconds), so there is never a half-drawn card.
_JSLD = r"""
/* ===== patch_loader: Ouroboros loader, preloading, no emoji while loading ===== */
const LD={ok:new Set(),bad:new Set(),p:new Map(),t:0,on:false,q:[],qn:0};
const ldAbs=u=>{try{return new URL(String(u).replace(/^url\(["']?|["']?\)$/g,''),location.href).href.replace(/\?r=1$/,'')}catch(e){return ''}};
function ldUrl(u0,low){const u=ldAbs(u0);if(!u)return Promise.resolve(true);if(LD.ok.has(u)||LD.bad.has(u))return Promise.resolve(true);if(LD.p.has(u))return LD.p.get(u);
 const pr=new Promise(res=>{let tries=0;const go=()=>{const im=new Image();try{im.decoding='async';if(low)im.fetchPriority='low'}catch(e){}
  im.onload=()=>{const d=im.decode?im.decode().catch(()=>{}):Promise.resolve();d.then(()=>{LD.ok.add(u);LD.p.delete(u);res(true)})};
  im.onerror=()=>{if(tries++<1){setTimeout(go,400)}else{LD.bad.add(u);LD.p.delete(u);res(false)}};im.src=tries?u+'?r=1':u};go()});
 LD.p.set(u,pr);return pr}
function ldErr(im){try{if(!im.dataset.r){im.dataset.r=1;im.src=im.src.split('?')[0]+'?r=1'}else{im.classList.add('ldf');im.removeAttribute('alt')}}catch(e){}}
const ldBg=el=>{if(!el)return[];const v=getComputedStyle(el).backgroundImage||'';return(v.match(/url\(["']?[^"')]+["']?\)/g)||[]).map(ldAbs)};
function ldCardUrls(cd){const L=ldBg(cd);const a=cd.querySelector(':scope>.ar');if(a){const v=a.style.getPropertyValue('--art');if(v)L.push(ldAbs(v))}return L.filter(Boolean)}
function ldCard(cd){if(!cd||!cd.classList||!cd.classList.contains('af'))return;const L=ldCardUrls(cd).filter(u=>!LD.ok.has(u)&&!LD.bad.has(u));
 if(!L.length){cd.classList.remove('ldp');return}cd.classList.add('ldp');const t=setTimeout(()=>cd.classList.remove('ldp'),5000);
 Promise.all(L.map(u=>ldUrl(u))).then(()=>{clearTimeout(t);cd.classList.remove('ldp')})}
function ldUrls(){const S=new Set();
 for(const im of document.images){if(!im.src||im.complete||im.loading=='lazy'||im.closest('#ldov,.tip,#insp'))continue;S.add(ldAbs(im.src))}
 const R=document.documentElement,sc=R.style.getPropertyValue('--scn');if(sc&&R.style.getPropertyValue('--scno')!='0')S.add(ldAbs(sc));
 for(const el of document.querySelectorAll('.tmap,.fxin,#vico.final'))ldBg(el).forEach(u=>S.add(u));
 for(const cd of document.querySelectorAll('.cd.af'))ldCardUrls(cd).forEach(u=>S.add(u));
 return[...S].filter(u=>u&&!LD.ok.has(u)&&!LD.bad.has(u))}
function ldShow(on){const o=document.getElementById('ldov');if(!o)return;LD.on=on;o.classList.toggle('on',on)}
function ldGate(first){const L=ldUrls(),tok=++LD.t;if(!L.length){if(LD.on&&!document.querySelector('.fxin.ldw'))ldShow(false);return}
 const tm=first?0:setTimeout(()=>{if(tok==LD.t)ldShow(true)},140);
 Promise.race([Promise.all(L.map(u=>ldUrl(u))),new Promise(r=>setTimeout(r,12000))]).then(()=>{clearTimeout(tm);if(tok==LD.t)ldShow(false)})}
let LDK='';
function ldKey(){try{return[G&&G.phase,G&&G.e&&G.e.nm,G&&G.a2,G&&G.a3,G&&G.fi,G&&G.pos,G&&G.dr&&G.dr.n,G&&G.turn,typeof CH!='undefined'?CH:'',document.querySelectorAll('.cd.af').length].join('|')}catch(e){return ''}}
/* background preloading, a few at a time */
function ldPre(urls){for(const u0 of urls){const u=ldAbs(u0);if(u&&!LD.ok.has(u)&&!LD.bad.has(u)&&!LD.q.includes(u))LD.q.push(u)}ldPump()}
function ldPump(){while(LD.qn<3&&LD.q.length){const u=LD.q.shift();LD.qn++;ldUrl(u,true).then(()=>{LD.qn--;setTimeout(ldPump,30)})}}
function ldFoeUrls(o){const L=[];if(!o)return L;try{const n=o.n;if(typeof SCN!='undefined'&&SCN[n]&&SCN[n].id)L.push('art/game/scenes/'+SCN[n].id+'.jpg');
 if(typeof FIG!='undefined'&&FIG[n])L.push('art/game/figures/'+FIG[n]+'.webp');
 const ids=[...new Set([...(o.mt?[o.mt]:[]),...(o.trump?[o.trump]:[]),...(o.trump2?[o.trump2]:[]),...(o.d||[]).map(x=>x&&x.id?x.id:x)])];
 for(const id of ids){if(!id||typeof ARTF=='undefined'||!ARTF[id])continue;L.push(artu(id));const f=typeof afc=='function'?afc(id):ARTF[id];if(f)L.push('art/game/frames/'+f+'.jpg')}}catch(e){}return L}
function ldMine(){try{const L=[];for(const r of (G&&G.p&&G.p.recs)||[]){const id=r&&r.id||r;if(!id||typeof ARTF=='undefined'||!ARTF[id])continue;L.push(artu(id));const f=typeof afc=='function'?afc(id):ARTF[id];if(f)L.push('art/game/frames/'+f+'.jpg')}ldPre(L)}catch(e){}}
function ldAhead(){try{if(G&&G.p&&G.phase!='draft')ldMine();if(!G||G.phase!='map'||!G.web)return;const N=G.web.nodes,cu=N[G.pos];if(!cu)return;const L=[];
 for(const id of cu.adj){const n=N[id];if(n&&n.t=='fight'&&!n.cleared)L.push(...ldFoeUrls(fo(n.o)))}
 if(G.fi>=FLOORS-1&&typeof BOSS!='undefined')for(const b of BOSS)if(b&&(G.a3?b.a3:!b.a3))L.push(...ldFoeUrls(b).slice(0,2));
 ldPre(L)}catch(e){}}
/* watch new cards and the pre-fight painting */
try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!=1)continue;
 if(n.matches&&n.matches('.cd.af'))ldCard(n);if(n.querySelectorAll)n.querySelectorAll('.cd.af').forEach(ldCard);
 if(n.classList&&n.classList.contains('fxin')){const L=ldBg(n).filter(u=>!LD.ok.has(u)&&!LD.bad.has(u));if(L.length){n.classList.add('ldw');ldShow(true);
  Promise.race([Promise.all(L.map(u=>ldUrl(u))),new Promise(r=>setTimeout(r,12000))]).then(()=>{n.classList.remove('ldw');ldShow(false)})}}}}).observe(document.body,{childList:true,subtree:true})}catch(e){}
{const _r=render;render=function(){const x=_r.apply(this,arguments);try{const k=ldKey();if(k!==LDK){LDK=k;ldGate(false)}document.querySelectorAll('.cd.af').forEach(ldCard);ldAhead()}catch(e){}return x}}
{const _s=showChars;showChars=function(){const x=_s.apply(this,arguments);try{LDK=ldKey();ldGate(true)}catch(e){}return x}}
"""
_JSOV = (r"""try{const o=document.createElement('div');o.id='ldov';o.className='on';o.setAttribute('role','status');o.setAttribute('aria-label','Loading');"""
         r"""o.innerHTML='<div class="ldr"><img class="ldo" src="art/game/icons/ouroboros.png" alt="" draggable="false"></div>';document.body.appendChild(o)}catch(e){}""")
_CSSLD = (
    '#ldov{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 45%,#16232b 0%,#0b1419 55%,#05090c 100%);'
    'opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s ease,visibility 0s linear .3s}'
    '#ldov.on{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .2s ease,visibility 0s}'
    '#ldov .ldr{width:min(170px,30vmin);aspect-ratio:1;display:grid;place-items:center;filter:drop-shadow(0 0 18px #e0b04a44) drop-shadow(0 6px 14px #000c);animation:ldglow 2.8s ease-in-out infinite}'
    '#ldov .ldo{width:100%;height:100%;animation:ldspin 3.6s linear infinite;-webkit-user-drag:none;user-select:none}'
    '@keyframes ldspin{to{transform:rotate(360deg)}}'
    '@keyframes ldglow{50%{filter:drop-shadow(0 0 28px #e0b04a77) drop-shadow(0 6px 14px #000c)}}'
    '@media (prefers-reduced-motion:reduce){#ldov .ldo{animation-duration:12s}#ldov .ldr{animation:none}}'
    # a card waits until its frame and picture are both ready
    '.cd.af.ldp{visibility:hidden}'
    # failed images leave a blank, never an emoji
    'img.ldf{visibility:hidden}'
    '.hic .hem{visibility:hidden}'
    '.noic.ldx{display:inline-block;width:1em;height:1em}'
    '.fxin.ldw{visibility:hidden}'
)
# card art: no emoji behind painted art
_b3('>${d[7]}${so}</div>', '>${ARTF[c.id]?\'\':d[7]}${so}</div>')
# emoji fallbacks -> retry once, then blank
_b3("this.replaceWith('💀')", "this.classList.add('ldf')")
_b3("onerror=\"this.outerHTML='🪦'\"", 'onerror="ldErr(this)"')
_b3("onerror=\"this.replaceWith(document.createTextNode(\\''+(ga?'🔱':LOCN[n.t][0])+'\\'))\"", 'onerror="ldErr(this)"')
_b3("onerror=\"this.replaceWith(document.createTextNode(\\'☥\\'))\"", 'onerror="ldErr(this)"')
_b3("onerror=\"this.replaceWith(document.createTextNode(\\'⏳\\'))\"", 'onerror="ldErr(this)"')
_b3("onerror=\"this.replaceWith(document.createTextNode('${d[7]}'))\"", 'onerror="ldErr(this)"')
# the emoji-to-icon swap: empty alt text, and a blank (not the emoji) after a failure
_b3("if(ICF.has(nm)){const sp=document.createElement('span');sp.className='noic';sp.textContent=m;",
    "if(ICF.has(nm)){const sp=document.createElement('span');sp.className='noic ldx';sp.textContent='';")
_b3("im.alt=m;im.draggable=false;im.onerror=function(){if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else{ICF.add(nm);const sp=document.createElement('span');sp.className='noic';sp.textContent=m;this.replaceWith(sp)}};",
    "im.alt='';im.draggable=false;im.onerror=function(){if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else{ICF.add(nm);const sp=document.createElement('span');sp.className='noic ldx';sp.textContent='';this.replaceWith(sp)}};")
# overlay at the very start of the script, logic and first gate at the end
_b3('<script>', '<script>' + _JSOV)
_b3('document.body.appendChild(st)}catch(e){}\nshowChars();', 'document.body.appendChild(st)}catch(e){}\n' + _JSLD + '\nshowChars();')
_b3('.dft{position:absolute;inset:0;display:flex;', _CSSLD + '.dft{position:absolute;inset:0;display:flex;')
