# ===== Ruthless hover in standard ability format; flashing target on attacker hover =====
def _b2(o,n):
    global head,tail,mid
    c=[(v,head.count(o)) for v in ('head',)]
    if head.count(o)==1: head=head.replace(o,n)
    elif mid.count(o)==1: mid=mid.replace(o,n)
    elif tail.count(o)==1: tail=tail.replace(o,n)
    else: raise AssertionError(o[:60])
_b2("q:'Opportunist: +1 power for each","r:'Ruthless: it gets +1 power while in attack form.',q:'Opportunist: +1 power for each")
_b2("if(ramp(c))L.push('Rampart of Troy: +1 more health in defense form.');else if(has(c,'r'))L.push('Attack form: +1 power from its own raider ability.');","if(ramp(c))L.push('Rampart of Troy: +1 more health in defense form.');")
_b2("[/\\bruthless\\b/i,'Ruthless','+1 power while in attack form.']","[/\\bruthless\\b/i,'Ruthless',KWL.r]")
_b2("army members with Raider have Ruthless (+1 power while in attack form).","army members with Raider have Ruthless: they get +1 power while in attack form.")
head=rep(head,".rmv{background:#000c}",".rmv{background:#000c}@keyframes tf{0%,100%{outline-color:#ff5a3c}50%{outline-color:transparent}}.cd.tgt.flash{animation:tf 1.25s linear infinite}")
tail=rep(tail,"function render(){render0();fitHand()}","""let HV=0;
function applyFlash(){try{document.querySelectorAll('.cd.flash').forEach(x=>x.classList.remove('flash'));if(!HV||!G||!G.p)return;const cu=G.cmb;let tid=0;if(cu&&cu.side=='p'&&cu.atk.includes(HV))tid=cu.tg&&cu.tg[HV];else if(!cu&&G.sel&&G.sel.includes(HV))tid=G.tg&&G.tg[HV];if(tid){const t=document.querySelector('.cd[data-z$=":'+tid+'"]');if(t)t.classList.add('flash')}}catch(e){}}
if(document.addEventListener)document.addEventListener('mouseover',ev=>{try{const cd=ev.target.closest&&ev.target.closest('.cd'),z=cd&&cd.dataset.z||'',h=z[0]=='p'&&z[1]==':'?+z.slice(2):0;if(h!==HV){HV=h;applyFlash()}}catch(e){}});
function render(){render0();fitHand();applyFlash()}""")
