# patch_lanefit: the two front rows on the battlefield no longer overlap (Ben: "I can't see the power/toughness
# of the opponent's card"), without making cards smaller. Desktop only (phones already scale lanes by .36).
# Each army member sits in a lane, drawn as a vertical offset (inline `top`): ready (Attack) cards are pushed
# 34px toward the middle, Defense sits at 0, tapped cards are pushed back. With the bigger desktop cards
# (patch_cardsize) a ready enemy card and a ready player card overlapped by ~20px, hiding the enemy's stats.
# laneFit() measures the gap between the lowest enemy card and the highest player card (combat-lane cards,
# which are meant to meet, are left out of the measurement) with the lane offsets at 0 and at full size, and
# scales every lane offset by the largest K (0..1) that keeps a 10px gap. Lanes keep their order and spacing
# ratios; at sizes where nothing overlaps K stays 1. Outside combat, attackers you have selected (pushed further
# forward) are also held 10px short of the enemy's row so its stats stay readable while you choose. It runs before the FLIP card moves (cardMoves, which also
# lines blockers up), after renders that skip cardMoves (a new screen), and on window resize.

_JSLF = r"""
/* ===== patch_lanefit: keep the enemy's and player's front rows apart ===== */
let LFDONE=false;
function laneFit(){try{if(document.documentElement.classList.contains('ph'))return;
 const cs=[...document.querySelectorAll('#app .fld .lys .cd')];if(!cs.length)return;
 cs.forEach(x=>{const cur=x.style.top||'0px';if(x.dataset.lt!==cur)x.dataset.l0=parseFloat(cur)||0});
 const set=K=>cs.forEach(x=>{const v=(+x.dataset.l0*K).toFixed(1)+'px';x.style.top=v;x.dataset.lt=v});
 const lim=(typeof RK=='number'?RK:34)+1,nc=x=>Math.abs(+x.dataset.l0)<=lim,
  E=cs.filter(x=>nc(x)&&x.closest('.fe')),P=cs.filter(x=>nc(x)&&x.closest('.fp'));
 if(!E.length||!P.length){set(1);return}
 const gap=()=>Math.min(...P.map(x=>x.getBoundingClientRect().top))-Math.max(...E.map(x=>x.getBoundingClientRect().bottom)),want=10;
 set(0);const g0=gap();set(1);const g1=gap();
 let K=1;if(g1<want&&g0>g1)K=Math.max(0,Math.min(1,(g0-want)/(g0-g1)));set(K);
 if(!G.cmb){const eB=Math.max(...E.map(x=>x.getBoundingClientRect().bottom)),pT=Math.min(...P.map(x=>x.getBoundingClientRect().top));
  cs.filter(x=>!nc(x)).forEach(x=>{const pl=!!x.closest('.fp'),edge=()=>{const r=x.getBoundingClientRect();return pl?r.top-eB:pT-r.bottom},v1=+x.dataset.l0*K,
   d1=edge();if(d1>=want)return;x.style.top='0px';const d0=edge();const f=d0>d1?Math.max(0,Math.min(1,(d0-want)/(d0-d1))):1,v=(v1*f).toFixed(1)+'px';x.style.top=v;x.dataset.lt=v})}
 }catch(e){}}
{const c0=cardMoves;cardMoves=function(){laneFit();LFDONE=true;return c0.apply(this,arguments)}}
{const r0=render;render=function(){LFDONE=false;const o=r0.apply(this,arguments);if(!LFDONE)laneFit();return o}}
try{addEventListener('resize',()=>setTimeout(laneFit,60))}catch(e){}
"""
_b3("showChars();\n</script>", _JSLF + "showChars();\n</script>")
