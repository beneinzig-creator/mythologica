# v109: anti-stall clock. From turn CLK0, at the start of each player turn both sides lose (turn - CLK0 + 1) life.
# A countdown badge shows from turn CLKW. Ties go to the player: chk() tests the enemy's life first.
# Not used in tutorial lessons.
CLOCK = r"""
/* ===== v109: anti-stall clock ===== */
const CLK0=20,CLKW=15;
const CLKN=()=>({odin:'Ragnarök draws near',wukong:'The Jade Emperor grows impatient',thoth:'The scales of Ma\'at tip'})[(G&&G.ch)||'ody']||'The gods grow impatient';
const clkOn=()=>!!(G&&G.e&&G.p&&!G.tut);
function clockTick(){if(!clkOn()||G.turn<CLK0)return 0;const n=G.turn-CLK0+1;G.p.life-=n;G.e.life-=n;log(CLKN()+': you and '+(G.e.nm||'the enemy')+' each lose '+n+' life.');return n}
function clkBadge(){if(!clkOn()||!G.turn||G.turn<CLKW)return'';const left=CLK0-G.turn,nx=Math.max(1,G.turn+1-CLK0+1);
 const tip='From turn '+CLK0+', at the start of each of your turns, you and the enemy both lose life: 1 on turn '+CLK0+', 2 on turn '+(CLK0+1)+', and so on. If you both fall at once, you win.';
 return`<span class="cn clk${left<=0?' on':''}" title="${tip}">⏳ ${CLKN()} · ${left>0?'in '+left+' turn'+(left==1?'':'s'):'−'+nx+' life each next turn'}</span>`}
"""
_b3("/* ---------- tutorial flow ---------- */", CLOCK + "/* ---------- tutorial flow ---------- */")
# tick at the start of the player's turn
_b3("G.msg=turnMsg()+whNote();if(G.p.life<=0)chk();render()}",
    "G.msg=turnMsg()+whNote();{const n=clockTick();if(n)G.msg=CLKN()+': both sides lose '+n+' life. '+G.msg}if(G.p.life<=0||G.e.life<=0)chk();render()}")
# badge in the enemy header
_b3("${foreStrip()}", "${foreStrip()}${clkBadge()}")
# one-time run tip when the countdown first appears
_b3(" a2:'<b>Act II.</b>", " clock:'<b>The gods grow impatient.</b> From turn '+20+', at the start of each of your turns, you and the enemy both lose life: 1 on turn 20, 2 on turn 21, and so on. If you both fall at once, you win.',\n a2:'<b>Act II.</b>")
_b3("if(ph=='kleos')return'kleos';", "if(ph=='main'&&G.turn>=CLKW&&G.e)return'clock';if(ph=='kleos')return'kleos';")
_b3("html.gs .hdet{animation:none}\n", "html.gs .hdet{animation:none}\n"
    ".clk{display:block;margin-top:3px;color:#e8c27a;opacity:.9}.clk.on{color:#ff9a7a;text-shadow:0 0 8px #ff5a3a88;animation:clkp 1.6s ease-in-out infinite}"
    "@keyframes clkp{0%,100%{opacity:.75}50%{opacity:1}}\n")
