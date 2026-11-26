# patch_libloader: the Ouroboros loader covers any card-library screen until every card on it is fully painted
# (Ben: at an altar, Upgrade showed the cards as plain coloured blanks with no frame or art).
# Why it happened: patch_loader hides each painted card until its frame and picture load, but only for up to 5 s per
# card. A whole library is dozens of images, so on a slow connection the cap ran out and the cards appeared with only
# their base colour (var(--f)) showing. Those screens are also drawn outside render(), so the full-screen loader
# never ran for them.
# Fix: whenever cards appear inside a library screen, every unloaded frame and picture on it is collected and the
# Ouroboros loader is shown (after the usual 140 ms, so a cached screen never flashes it) until they have all loaded
# or failed, capped at 20 s. While any library is waiting, the other loader gates can't hide the loader early.
# Library screens (the same set patch_browse20 enlarges):
#   .ov  overlays: full library and starting cards (home), view deck / library so far, graveyard, quick-spell pause,
#        remove / upgrade / duplicate picker (crafting table, altar), Hades discard, upgrade/remove confirmation
#   .dcards  draft and reward draft ("Spoils of Victory")
#   .kc      prestige (kleos) upgrade picker after a victory
# Hover previews (.tip, #insp) are ignored.

_JSLIBLD = r"""
/* ===== patch_libloader: Ouroboros loader until a card library is fully painted ===== */
(function(){const LIBSEL='.ov,.dcards,.kc',CAP=20000;let wait=0;
 const _show=ldShow;ldShow=function(on){if(!on&&wait>0)return;return _show(on)};
 function gate(root){const S=new Set();
  root.querySelectorAll('.cd.af').forEach(cd=>{if(cd.closest('.tip,#insp,#tip')||!cd.closest(LIBSEL))return;ldCardUrls(cd).forEach(u=>{if(u&&!LD.ok.has(u)&&!LD.bad.has(u))S.add(u)})});
  if(!S.size)return;wait++;let done=false;const tm=setTimeout(()=>{if(!done)_show(true)},140);
  Promise.race([Promise.all([...S].map(u=>ldUrl(u))),new Promise(r=>setTimeout(r,CAP))]).then(()=>{done=true;clearTimeout(tm);wait--;
   if(wait<=0){wait=0;if(!document.querySelector('.fxin.ldw')&&!ldUrls().length)_show(false);else ldGate(false)}})}
 let pend=null;
 try{new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!=1)continue;
   const hit=(n.matches&&n.matches('.cd.af'))||(n.querySelector&&n.querySelector('.cd.af'));if(!hit)continue;
   const root=n.closest&&n.closest(LIBSEL)||n;if(!pend)pend=new Set();pend.add(root)}
  if(pend){const P=pend;pend=null;P.forEach(r=>{try{if(r.isConnected)gate(r)}catch(e){}})}}).observe(document.body,{childList:true,subtree:true})}catch(e){}
})();
"""
_b3("showChars();\n</script>", _JSLIBLD + "showChars();\n</script>")
