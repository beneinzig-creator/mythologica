# patch_introclick: the pre-fight "Click to begin" screen waits for the player (Ben, Nov 2026). It used to close by
# itself after 4.5 s (7 s for guardians). Now only a click/tap, or Enter/Space, starts the fight.
_b3("o.addEventListener('click',close);gsap.delayedCall(boss?7:4.5,close)",
    "o.addEventListener('click',close);"
    "const kc=e=>{if(!document.body.contains(o)){removeEventListener('keydown',kc);return}"
    "if(e.key=='Enter'||e.key==' '){e.preventDefault();removeEventListener('keydown',kc);close()}};addEventListener('keydown',kc)")
