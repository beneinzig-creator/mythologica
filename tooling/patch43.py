# v100: GSAP motion layer.
# - GSAP 3.12.5 (vendor/gsap.min.js) is inlined at the top of the game script, so the game stays one offline file.
# - anim.js wraps render() to animate card moves (FLIP by uid), entries, damage, life/mana, screens and overlays.
# - The existing WAAPI flights (draw, graveyard, draft pick) use GSAP when it is present, with the old code as fallback.

GSAP = open(S+'vendor/gsap.min.js', encoding='utf-8').read()
_b3('<div id="app"></div>\n<script>\n', '<div id="app"></div>\n<script>\ntry{\n' + GSAP + '\n}catch(e){}\n')

ANIM = open(S+'anim.js', encoding='utf-8').read()
_b3("fit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();", ANIM + "\nfit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();")

# draw: library -> hand
_b3("const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')'},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')'}],{duration:1300,delay:d,easing:'ease-in-out',fill:'both'});an.onfinish=()=>el.remove();",
    "if(GSOK()){gsap.fromTo(el,{x:a.left,y:a.top,scale:s0,rotation:mine?-12:12,transformOrigin:'0 0'},{x:b.left,y:b.top,scale:s1,rotation:0,duration:1.25,delay:d/1000,ease:'power3.inOut',onComplete:()=>el.remove()})}else{const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')'},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')'}],{duration:1300,delay:d,easing:'ease-in-out',fill:'both'});an.onfinish=()=>el.remove();}")

# death / discard: table -> graveyard
_b3("const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')',opacity:1},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')',opacity:.75}],{duration:1100,delay:150,easing:'ease-in',fill:'both'});an.onfinish=()=>el.remove();",
    "if(GSOK()){gsap.timeline({onComplete:()=>el.remove()}).fromTo(el,{x:a.left,y:a.top,scale:s0,rotation:0,opacity:1,filter:'brightness(1)',transformOrigin:'0 0'},{y:a.top-14,filter:'brightness(.55) grayscale(.8)',duration:.25,ease:'power2.out'}).to(el,{x:b.left,y:b.top,scale:s1,rotation:mine?-14:14,opacity:.7,duration:.85,ease:'power2.in'})}else{const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')',opacity:1},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')',opacity:.75}],{duration:1100,delay:150,easing:'ease-in',fill:'both'});an.onfinish=()=>el.remove();}")

# draft pick: chosen card flies to the library, the others fall away
_b3("ws.forEach((x,i)=>{if(i!=j)x.animate([{opacity:1},{opacity:0}],{duration:350,fill:'forwards'})});",
    "if(GSOK())ws.forEach((x,i)=>{if(i!=j)gsap.to(x,{opacity:0,y:40,rotationX:30,duration:.4,ease:'power2.in'})});else ws.forEach((x,i)=>{if(i!=j)x.animate([{opacity:1},{opacity:0}],{duration:350,fill:'forwards'})});")
_b3("w.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale(.42)',opacity:.9}],{duration:1000,easing:'cubic-bezier(.45,0,.75,.55)',fill:'forwards'});",
    "if(GSOK())gsap.timeline().to(w,{y:-24,scale:1.06,duration:.22,ease:'power2.out'}).to(w,{x:dx,y:dy,scale:.42,rotation:-10,opacity:.9,duration:.78,ease:'power2.in'});else w.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale(.42)',opacity:.9}],{duration:1000,easing:'cubic-bezier(.45,0,.75,.55)',fill:'forwards'});")

# GSAP drives the hero detail reveal; keep the CSS keyframe only as the no-GSAP fallback
_b3(".dft{zoom:.62}.lib{max-height:68vh}\n}\n", ".dft{zoom:.62}.lib{max-height:68vh}\n}\nhtml.gs .hdet{animation:none}\n")
