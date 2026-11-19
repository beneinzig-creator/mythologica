# v106-107: tutorial (Odysseus, Odin, Wukong and Thoth lessons: battle, offerings, Phalanx, Raiders, the journey) and first-time tips in runs.
# Lessons use fixed decks and draw orders against fixed enemies. They never touch the saved run: tutorial fights end
# in their own 'tutend' phase instead of kleos/lost (persist() clears the save on 'lost').
_b3("fit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();",
    open(S+'tutorial.js',encoding='utf-8').read() + "\nfit();try{addEventListener('resize',fit)}catch(e){}\nshowChars();")
_b3("function bt0(b){", "function bt0(b){if(typeof tutBt=='function'&&tutBt(b))return;")
_b3("function chk(){instCap();dintChk();amFall();", "function chk(){instCap();dintChk();amFall();if(G.tut&&tutChk())return 1;")
_b3("function render0(){const p=G.p,e=G.e,ph=G.phase;", "function render0(){const p=G.p,e=G.e,ph=G.phase;if(ph=='tutmenu')return renderTutMenu();if(ph=='tutend')return renderTutEnd();if(ph=='tutjourney')return renderTutJourney();")
_b3("if(b=='end'){", "if(b=='end'){if(G.tut&&tutNoEnd())return msg(tutNoEnd());")
_b3("Choose your character</div>${savedInfo()}<div class=\"chrow\">",
    "Choose your character</div><button class=\"b gh tutbtn\" data-b=\"tutmenu\">${tutDone().length?'How to play':'New here? How to play'}</button>${savedInfo()}<div class=\"chrow\">")
TCSS = ("#tutc{position:fixed;top:calc(52px + env(safe-area-inset-top,0px));right:max(14px,env(safe-area-inset-right,0px));z-index:310;width:min(360px,calc(100vw - 28px));display:none;"
 "background:linear-gradient(#ffffff0c,#0000 40%),#0d1418f2;border:1px solid #e0b04a99;border-radius:12px;padding:12px 14px;color:#efe6cf;box-shadow:0 0 0 1px #0008,0 14px 34px #000c;font:15px/1.45 var(--fb)}"
 ".tutch{font-family:var(--fd);font-weight:700;color:var(--gold);font-size:14px;letter-spacing:.04em;display:flex;justify-content:space-between;margin-bottom:6px}.tutch span{font-family:var(--fb);font-weight:400;opacity:.6;font-size:12px}"
 ".tutcm b{color:#ffe2a0}.tutcb{display:flex;gap:10px;align-items:center;margin-top:10px}.tutcb .b{font-size:14px;padding:5px 16px}"
 ".tutx{background:none;border:0;color:#efe6cf99;font:13px var(--fb);cursor:pointer;text-decoration:underline;margin-left:auto}.tutx:hover{color:#efe6cf}"
 ".tuthi{outline:3px solid #ffd27a!important;outline-offset:3px;animation:tutpulse 1.2s ease-in-out infinite;border-radius:8px}"
 "@keyframes tutpulse{0%,100%{box-shadow:0 0 0 0 #ffd27a00,0 0 0 #0000}50%{box-shadow:0 0 18px 6px #ffd27a88}}"
 ".tuttabs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:4px}.tuttab{font-size:15px;padding:6px 14px;opacity:.7}.tuttab.on{opacity:1;border-color:#e0b04a;box-shadow:0 0 0 1px #e0b04a66,0 0 14px #e0b04a44}"
 ".tutbtn{margin-top:2px}.tutls{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;width:min(980px,94vw);margin-top:6px}"
 ".tutl{font:inherit;color:var(--ink);text-align:left;position:relative;display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-radius:12px;cursor:pointer;"
 "background:linear-gradient(#ffffff0a,#0000 40%),#00000059;border:1px solid #ffffff14;box-shadow:inset 0 1px 0 #ffffff1c,inset 0 -2px 0 #0008,0 8px 20px #000a}"
 ".tutl:hover{border-color:#e0b04a99}.tutn{font-family:var(--fd);font-weight:700;color:var(--gold);font-size:20px}.tutt{font-family:var(--fd);font-weight:700;font-size:17px}.tuts{font-size:14px;opacity:.75}"
 ".tutok{position:absolute;top:10px;right:12px;color:#7fdc8a;font-size:20px}.tutl.dn{border-color:#7fdc8a55}"
 ".tutj{font-size:18px;line-height:1.6;max-width:640px;text-align:center}.tutj b{color:#ffe2a0}"
 "html.ph #tutc{top:auto;bottom:130px;right:8px;width:min(300px,60vw);font-size:12px;padding:8px 10px}")
_b3("html.gs .hdet{animation:none}\n", "html.gs .hdet{animation:none}\n" + TCSS + "\n")
