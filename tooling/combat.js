const {chromium}=require('playwright');let fails=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)fails++};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [w,h,ch] of [[844,390,'ody'],[667,375,'odin'],[932,430,'wukong']]){
const p=await b.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(300);
await p.evaluate(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.mana=2;G.turn=4;G.e.bf=[];G.e.hand=[];const mkc=(s,id)=>{const c=mk(id);enter(s,c);c.sick=0;c.def=0};const pool=CHARS[G.ch].pool;pool.filter(k=>D[k][2]=='C'&&!(D[k][5]||'').includes('k')&&!(D[k][5]||'').includes('p')).slice(0,2).forEach(i=>mkc(G.p,i));G.p.hand=[];render()`);
await p.waitForTimeout(2600);
const T=async(sel,i=0)=>{const bb=await p.locator(sel).nth(i).boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(450)};
const L=async()=>{const bb=await p.locator('#loupe .cd').boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(450)};
const tag=`[${w}x${h} ${ch}] `;
await p.evaluate(`G.e.mana=5;const mk2=(s,id)=>{const c=mk(id);enter(s,c);c.sick=0;c.tap=1};EN[0].d.filter(k=>D[k][2]=='C').slice(0,2).forEach(i=>mk2(G.e,i));render()`);await p.waitForTimeout(600);const e0=await p.evaluate('G.e.life');
// select two attackers via loupe taps
for(let i=0;i<2;i++){await T('.fp .cd:not(.sel):not(.tap)',0);await L()}
ok(tag+'2 attackers selected',await p.evaluate('G.sel.length')==2);
await T('[data-b="atk"]');await p.waitForTimeout(4000);
let n=0;while((await p.evaluate('G.phase'))!='main'&&n++<20){if(await p.locator('[data-b="res"]').count())await T('[data-b="res"]');else await p.waitForTimeout(500)}
await p.waitForTimeout(1500);
ok(tag+'attack reduced enemy life ('+e0+'→'+await p.evaluate('G.e.life')+')',await p.evaluate('G.e.life')<e0);
// enemy attack & blocks
if((await p.evaluate('G.phase'))=='main')await T('[data-b="end"]');
let g=0;while((await p.evaluate('G.phase'))!='blockP'&&g++<40)await p.waitForTimeout(500);
ok(tag+'reached block phase',await p.evaluate('G.phase')=='blockP');
if(await p.evaluate('G.phase')=='blockP'){await p.evaluate('G.p.bf.forEach(c=>{c.tap=0});render()');await p.waitForTimeout(600);await p.screenshot({path:`play/${w}x${h}_${ch}_block1.png`});
 await T('.fp .cd:not(.tap)',0);await L();
 const m=await p.evaluate('G.blk');ok(tag+'blocker selected',!!m);
 // attacker = enemy card with atk class
 await T('.fe .cd.atk, .fe .cd.tgt, .fe .cd',0);await L();
 await p.screenshot({path:`play/${w}x${h}_${ch}_block2.png`});
 ok(tag+'block assigned',await p.evaluate('Object.keys((G.cmb&&G.cmb.blk)||{}).length')>=1);
 await T('[data-b="res"]');await p.waitForTimeout(3000)}
ok(tag+'no errors '+errs.join('|'),errs.length==0);
await p.close()}
console.log(fails?'FAILS '+fails:'ALL OK');await b.close()})()
