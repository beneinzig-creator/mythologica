# ===== Ruthless, base stats out of combat, creature-cost stat, graveyard travel animation =====
_s=lambda t,o,n:(t.replace(o,n) if t.count(o)==1 else (_ for _ in ()).throw(AssertionError((t.count(o),o[:50]))))
def _both(o,n):
    global head,tail,mid
    if head.count(o)==1: head=head.replace(o,n)
    elif mid.count(o)==1: mid=mid.replace(o,n)
    else: tail=_s(tail,o,n)
_both("(has(c,'r')?' +1 power while in attack form.':'')","(has(c,'r')?' Ruthless.':'')")
_both("[/\\braiders?\\b/i,'Raider','army members with Raider get +1 power while in attack form.']","[/\\bruthless\\b/i,'Ruthless','+1 power while in attack form.'],[/\\braiders?\\b/i,'Raider','army members with Raider have Ruthless (+1 power while in attack form).']")
_both("""<span style="color:${cl2(pwr(c),c.a)}">${pwr(c)}</span>""","""<span style="color:${cl2(pwr(c)-nr(c),c.a)}">${pwr(c)-nr(c)}</span>""")
_both("function card(c,z,zi,yo){","const nr=c=>{const cu=G.cmb;return has(c,'r')&&!c.def&&!(cu&&cu.atk.includes(c.u))&&!(G.sel&&G.sel.includes(c.u))?1:0};\nfunction card(c,z,zi,yo){")
_both("let sum=0;have.forEach(c=>{","let sum=0,cs=0,cn=0;have.forEach(c=>{if(D[c.id][2]=='C'){cs+=cost(c);cn++}")
_both("Average mana cost: ${(sum/Math.max(1,have.length)).toFixed(2)}<br>","Average mana cost: ${(sum/Math.max(1,have.length)).toFixed(2)}<br>Average army member cost: ${cn?(cs/cn).toFixed(2):'none yet'}<br>")
_both("function flyIn(c,s){","""function gyFly(s,c){try{if(!G||!G.turn)return;const el0=document.querySelector('.cd[data-z$=":'+c.u+'"]');if(!el0)return;const a=el0.getBoundingClientRect(),el=document.createElement('div'),mine=s===G.p;if(!a.width)return;
el.style.cssText='position:fixed;left:0;top:0;z-index:300;pointer-events:none;transform-origin:0 0';el.innerHTML=card(c,'v:'+c.u);document.body.appendChild(el);const w0=el.firstElementChild.offsetWidth||104,s0=a.width/w0;
el.style.transform='translate('+a.left+'px,'+a.top+'px) scale('+s0+')';
requestAnimationFrame(()=>{try{const dst=document.querySelector('.decks [data-z="'+(mine?'gyp':'gye')+'"]');if(!dst){el.remove();return}const b=dst.getBoundingClientRect(),s1=b.width/w0;
const an=el.animate([{transform:'translate('+a.left+'px,'+a.top+'px) scale('+s0+')',opacity:1},{transform:'translate('+b.left+'px,'+b.top+'px) scale('+s1+')',opacity:.75}],{duration:1100,delay:150,easing:'ease-in',fill:'both'});an.onfinish=()=>el.remove();setTimeout(()=>{try{el.remove()}catch(e){}},1600)}catch(e){try{el.remove()}catch(_){}}})}catch(e){}}
function flyIn(c,s){""")
A=rep(A,"const bury=(s,c)=>{if(c.id!='sold'){","const bury=(s,c)=>{if(c.id!='sold'){try{gyFly(s,c)}catch(e){}")
