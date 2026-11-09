# v102: atmosphere and game feel.
# 4 realm particles + torchlight · 5 carved stone map · 7 offer/attack/spell/death effects
# 8 boss & elite intros + trump stamp · 9 victory/defeat screens · 10 selection/target glows + cursor light · 11 sound
# Code lives in sfx.js and fx.js (spliced after anim.js). Named patch_fx.py to stay clear of the art branch's numbered patches.

_b3("fit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();",
    open(S+'sfx.js',encoding='utf-8').read() + "\n" + open(S+'fx.js',encoding='utf-8').read() + "\nfit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();")

# 10: mark valid targets / blockers / attackers on the card itself
_b3("if(G.blk==c.u)cl.push('bsel');",
    "if(G.blk==c.u)cl.push('bsel');try{if(t=='p'||t=='e'){const PP=G.pend&&G.pc&&PEND[G.pend];"
    "if((G.mode&&G.mode.tgt&&tsOk(G.mode.tgt,c,t))||(PP&&pendOpts(PP,G.pc).includes(c)))cl.push('tok');"
    "else if(t=='p'&&G.phase=='blockP'&&G.cmb&&!bAll(G.cmb).includes(c.u)&&G.cmb.atk.some(u=>{const a=G.e.bf.find(x=>x.u==u);return a&&canBlock(c,a)}))cl.push('bok');"
    "else if(t=='p'&&G.phase=='main'&&!G.atkd&&!G.cmb&&!G.sel.includes(c.u)&&canAtk(c))cl.push('aok')}}catch(e){}")

FXCSS = (
# particles canvas + effect layer
"#fxp{position:fixed;inset:0;z-index:0;pointer-events:none}"
"#fxl{position:fixed;inset:0;z-index:290;pointer-events:none;overflow:hidden}#fxl>*{position:absolute;left:0;top:0}"
".fxd,.fxs{border-radius:50%}.fxs{background:radial-gradient(circle,#c9c2b8aa,#8a847c44 45%,#0000 70%)}"
".fxc{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6c8,#e0b04a 45%,#8a5a12);border:1px solid #6b4510;box-shadow:0 0 10px #ffd27a}"
".fxr{mix-blend-mode:screen;filter:drop-shadow(0 0 6px #ffcf6a) drop-shadow(0 0 18px #ffb43c)}"
".fxk{position:absolute}.fxsh{background:linear-gradient(135deg,#9a9286,#4d473f);clip-path:polygon(50% 0,100% 40%,70% 100%,0 70%)}"
".fxi{width:120px;height:120px;border-radius:50%;mix-blend-mode:screen;background:radial-gradient(circle,#fff8e0,#ffcf6acc 25%,#ff7a3a55 50%,#0000 70%)}"
# torchlight + cursor light on the slabs
".fld::after{content:'';position:absolute;left:88px;right:88px;border-radius:10px;pointer-events:none;mix-blend-mode:screen;"
"background:radial-gradient(240px circle at calc(var(--mx,-900px) - 88px) calc(var(--my,-900px) - 8px),#ffd59238,#0000 70%),"
"radial-gradient(ellipse 40% 80% at 0% 50%,#ff9a4a22,#0000 70%),radial-gradient(ellipse 40% 80% at 100% 50%,#ff9a4a22,#0000 70%);animation:fxtorch 4.3s infinite}"
".fe::after{top:8px;bottom:2px}.fp::after{top:2px;bottom:6px}"
"@keyframes fxtorch{0%,100%{opacity:.82}9%{opacity:1}21%{opacity:.74}37%{opacity:.95}52%{opacity:.8}70%{opacity:1}86%{opacity:.86}}"
# selection / target states
".fld .cd.sel{outline:none!important;box-shadow:0 0 0 2px #ff9a6a,0 0 20px 5px #e0482bcc,0 16px 22px #000b!important}"
".fld .cd.atk{outline:none!important;box-shadow:0 0 0 3px #ff6a3d,0 0 28px 7px #e0482b,0 16px 22px #000b!important}"
".fld .cd.bk{outline:none!important;box-shadow:0 0 0 3px #5da0ec,0 0 22px 5px #3b8ad9bb!important}"
".fld .cd.tok,.fld .cd.bok{cursor:pointer;animation:fxok 1.1s ease-in-out infinite alternate}"
"@keyframes fxok{from{box-shadow:0 0 0 2px #7fc4ff,0 0 8px 2px #3b8ad977}to{box-shadow:0 0 0 2px #c4e4ff,0 0 26px 8px #3b8ad9}}"
".fld .cd.aok{box-shadow:0 0 0 1px #e0b04a88,0 4px 0 -1px #0007,0 16px 22px #000b}"
".fld .cd.tgt{outline:2px dashed #ff6a3d!important;outline-offset:3px}"
".fld .cd:not(.sel):not(.atk):not(.bk):not(.tok):not(.bok):hover{box-shadow:0 0 0 1px #ffe2a0aa,0 0 32px 8px #ffcf7a55,0 22px 28px #000c}"
# sound toggle
"#sndb{position:fixed;top:calc(6px + env(safe-area-inset-top,0px));right:max(48px,calc(env(safe-area-inset-right,0px) + 42px));z-index:300;width:36px;height:36px;border-radius:50%;border:1px solid #e0b04a88;background:#0b1820d9;color:#efe6cf;cursor:pointer;display:grid;place-items:center;padding:0}"
"#sndb:hover{border-color:var(--gold);color:var(--gold)}"
# 5: map as a carved stone tablet
".tmap{color:#e9dfc6;background:radial-gradient(ellipse at 50% 40%,#5b6670 0%,#3d4750 55%,#252c33 100%);border-radius:10px;"
"box-shadow:inset 0 2px 0 #ffffff26,inset 0 -3px 0 #0009,inset 0 0 60px #000a,0 0 0 2px #1a1f24,0 0 0 7px #3a434c,0 0 0 9px #11151a,0 14px 34px #000c}"
".tmap:before{opacity:.55;mix-blend-mode:overlay}"
".tmap:after{content:'';position:absolute;inset:10px;border:1px solid #0008;border-radius:6px;box-shadow:0 1px 0 #ffffff1a,inset 0 1px 0 #ffffff12;pointer-events:none}"
".tr{stroke:#0e1215;stroke-width:3.5;opacity:.9;filter:drop-shadow(0 1px 0 #ffffff26)}"
".tr.av{stroke:#e0b04a;stroke-width:4;opacity:1;filter:drop-shadow(0 0 4px #e0b04a99)}"
".tr.dn{stroke:#b5562f;stroke-width:4;opacity:.95;filter:drop-shadow(0 1px 0 #ffffff1f)}"
".wn{color:#e9dfc6}"
".wn .mi{border:2px solid #14181c;background:radial-gradient(circle at 40% 30%,#76818b,#46505a 60%,#2f363d);"
"box-shadow:inset 0 2px 2px #ffffff40,inset 0 -3px 4px #0009,0 1px 0 #ffffff1c,0 4px 8px #000a}"
".wn.loc .mi{background:radial-gradient(circle at 40% 30%,#7d8a76,#4c5a47 60%,#323d30);border-color:#151a13}"
".wn.go .mi{border-color:#e0b04a;animation:fxmap 1.6s ease-in-out infinite}"
"@keyframes fxmap{0%,100%{box-shadow:inset 0 2px 2px #ffffff40,inset 0 -3px 4px #0009,0 0 0 2px #e0b04a55,0 0 10px #e0b04a66}50%{box-shadow:inset 0 2px 2px #ffffff40,inset 0 -3px 4px #0009,0 0 0 3px #e0b04a99,0 0 22px #e0b04acc}}"
".wn.walk .mi{border-color:#a07a3c}"
".wn.cur .mi{border-color:#f3d27a;box-shadow:inset 0 2px 2px #ffffff40,inset 0 -3px 4px #0009,0 0 0 4px #e0b04a88,0 0 24px #e0b04a}"
".wn.fin .mi{color:#d9805a}"
".wn .tipx{background:#141a1fee;color:#efe6cf;border:1px solid #e0b04a44}"
# 8: intro
"#fxin{position:fixed;inset:0;z-index:320;display:grid;place-items:center;cursor:pointer;background:radial-gradient(ellipse at 50% 45%,#2a0f0acc,#050302f2 70%)}"
"#fxin.elite{background:radial-gradient(ellipse at 50% 45%,#12202acc,#030508ee 70%)}"
".fxin-in{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;max-width:min(680px,92vw);padding:20px}"
".fxin-k{font-size:13px;letter-spacing:.4em;text-transform:uppercase;color:#e0b04acc}"
".fxin-ic{font-size:110px;line-height:1.1;filter:drop-shadow(0 0 30px #ff8a3a88)}#fxin.elite .fxin-ic{filter:drop-shadow(0 0 30px #7fc4ff88);font-size:90px}"
".fxin-n{font-family:var(--fd);font-weight:700;font-size:clamp(30px,6vw,58px);color:var(--gold);text-shadow:0 3px 0 #000,0 0 30px #e0b04a66;line-height:1.05}"
".fxin-l{font-style:italic;font-size:18px;line-height:1.5;color:#efe6cfdd}"
".fxin-t{margin-top:8px;padding:6px 18px;border:3px double #e0b04a;color:#ffe2a0;background:#5a1a0ccc;font-family:var(--fd);font-weight:700;font-size:20px;transform:rotate(-3deg);box-shadow:0 6px 18px #000a}"
".fxin-t span{display:block;font-family:var(--fb);font-weight:400;font-size:11px;letter-spacing:.3em;text-transform:uppercase;opacity:.8}"
".fxin-c{margin-top:14px;font-size:12px;letter-spacing:.25em;text-transform:uppercase;opacity:.5}"
# 9: rays, laurel, fight-won banner, defeat tablet
".fxrays{position:fixed;inset:0;z-index:300;pointer-events:none;overflow:hidden}"
".fxrays>i{position:absolute;left:50%;top:42%;width:240vmax;height:240vmax;margin:-120vmax 0 0 -120vmax;background:repeating-conic-gradient(from 0deg,#ffd98a1c 0deg 5deg,#0000 5deg 15deg);"
"-webkit-mask:radial-gradient(circle,#000 0,#0000 38%);mask:radial-gradient(circle,#000 0,#0000 38%)}"
".fxrays.big>i{background:repeating-conic-gradient(from 0deg,#ffd98a2a 0deg 5deg,#0000 5deg 15deg)}"
".fxleaf{position:absolute;left:0;top:0;width:12px;height:6px;border-radius:50%;background:linear-gradient(#ffe7a0,#c8922a);box-shadow:0 0 6px #ffd27a88}"
".fxlaurel{display:block;margin:0 auto -6px;filter:drop-shadow(0 0 10px #e0b04a88)}"
".fxwon{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center}"
".fxwon span{display:block;margin-top:-30px;font-family:var(--fd);font-weight:700;font-size:64px;color:var(--gold);text-shadow:0 4px 0 #000,0 0 36px #e0b04aaa}"
"#fxlost{position:fixed;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,#0000 20%,#1a0404cc 85%)}"
".fxtab{position:absolute;left:50%;top:34%;width:min(400px,80vw);height:200px;transform:translate(-50%,-50%)}"
".fxtab-h{position:absolute;top:0;bottom:0;width:50%;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#6a6e72,#3a3d41 70%," + "#24272a);box-shadow:inset 0 2px 0 #ffffff26,inset 0 -3px 0 #0009,0 16px 30px #000c}"
".fxtab-h.l{left:0;border-radius:10px 0 0 10px}.fxtab-h.r{right:0;border-radius:0 10px 10px 0}"
".fxtab-h span{position:absolute;top:50%;width:min(400px,80vw);transform:translateY(-50%);text-align:center;font-family:var(--fd);font-weight:700;font-size:58px;color:#2a2d30;text-shadow:0 -1px 0 #0009,0 1px 0 #ffffff33}"
".fxtab-h.l span{left:0}.fxtab-h.r span{right:0}"
".fxcr{position:absolute;inset:0;width:100%;height:100%}"
".fxtab-s{position:absolute;left:0;right:0;top:calc(100% + 18px);text-align:center;font-style:italic;font-size:20px;color:#efe6cf;text-shadow:0 2px 6px #000}"
"html.ph .fxin-ic{font-size:60px}html.ph .fxin-l{font-size:13px}html.ph .fxwon span{font-size:40px;margin-top:-40px}html.ph .fxtab{height:130px}html.ph .fxtab-h span{font-size:38px}"
)
_b3("html.gs .hdet{animation:none}\n", "html.gs .hdet{animation:none}\n" + FXCSS + "\n")
